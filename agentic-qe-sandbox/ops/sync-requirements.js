#!/usr/bin/env node
/**
 * ops/ = operate the suite in an SDLC. (workflow = make · eval = grade · ops = operate)
 *
 * sync-requirements: keep the generated suite in step with the requirements,
 * regenerating only what changed and pruning what is stale. This is the one
 * place that names the concrete adapter (exactly like run-workflow.js), so it
 * lives OUTSIDE workflow/ where the import-boundary rule forbids adapter imports.
 *
 * Modes:
 *   (default) / --dry-run : print the delta + prune plan. Writes nothing,
 *                           calls no LLM, deletes nothing.
 *   --init-manifest       : snapshot the CURRENT requirements + existing test
 *                           files into state/suite-manifest.json. No LLM, no
 *                           deletes — just records a baseline so later runs can
 *                           detect change.
 *   --apply               : prune the stale set and regenerate added+changed
 *                           via the LLM, then update the manifest. SPENDS — only
 *                           on the delta (unchanged requirements are skipped).
 *
 * Usage:
 *   node ops/sync-requirements.js --dry-run
 *   node ops/sync-requirements.js --init-manifest
 *   node ops/sync-requirements.js --apply
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../workflow/config.js";
import { createLlmClient } from "../workflow/llm/llm-client.js";
import { select } from "../workflow/steps/select.js";
import { assess } from "../workflow/steps/assess.js";
import { generate } from "../workflow/steps/generate.js";
import { diffRequirements, hashRequirement } from "../workflow/steps/diff-requirements.js";
import { computePruneSet } from "../workflow/steps/prune.js";
import { applySync } from "../workflow/steps/apply-sync.js";
import { buildCostReport } from "../workflow/llm/cost.js";
import { resolveTestsDir } from "../workflow/tests-dir.js";
import { cypressRwaWorkflowAdapter } from "../adapters/cypress-rwa/workflow-adapter.js";

const SANDBOX_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_TESTS_DIR = resolveTestsDir(SANDBOX_ROOT);
const STATE_DIR = join(SANDBOX_ROOT, "state");
// NOTE: the manifest must NOT live in generated-tests/ — the orchestrator and
// eval/run-eval.js load that folder with `readdirSync().filter(f.endsWith('.json'))`
// and JSON.parse each as a TestCase, so a *.json there would be mis-read.
const MANIFEST_PATH = join(STATE_DIR, "suite-manifest.json");

function loadManifest() {
  if (!existsSync(MANIFEST_PATH)) return { version: 1, requirements: {} };
  return JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
}

// Read the persisted suite as plain {file, requirementId, testId} records.
function loadPersisted() {
  if (!existsSync(GENERATED_TESTS_DIR)) return [];
  return readdirSync(GENERATED_TESTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const tc = JSON.parse(readFileSync(join(GENERATED_TESTS_DIR, f), "utf8"));
      return { file: f, requirementId: tc.requirementId, testId: tc.id };
    });
}

function parseArgs(argv) {
  return {
    initManifest: argv.includes("--init-manifest"),
    apply: argv.includes("--apply"),
    // dry-run is the default; the flag is accepted for explicitness.
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cfgPreview = loadConfig(process.env); // validates env knobs early; no LLM client is created in plan mode

  const requirements = await select({ adapter: cypressRwaWorkflowAdapter });
  const manifest = loadManifest();
  const persisted = loadPersisted();
  const manifestExists = existsSync(MANIFEST_PATH);

  const coveredReqIds = new Set(persisted.map((p) => p.requirementId));
  const { added, changed, missing, removed, unchanged, gated, hashes } = diffRequirements(manifest, requirements, coveredReqIds);
  const currentReqIds = requirements.map((r) => r.id);
  const pruneSet = computePruneSet({ persisted, changedIds: changed, removedIds: removed, currentReqIds });

  if (args.apply) {
    const cfg = loadConfig(process.env);
    const llm = createLlmClient(cfg); // requires OPENROUTER_API_KEY — this path spends.
    const requirementsById = new Map(requirements.map((r) => [r.id, r]));
    const gateOn = cfg.testabilityGate === "on";
    const effects = {
      generate: (req) => generate({ requirement: req, llm }),
      persist: (tc) => writeFileSync(join(GENERATED_TESTS_DIR, `${tc.id}.json`), JSON.stringify(tc, null, 2)),
      remove: (file) => {
        const p = join(GENERATED_TESTS_DIR, file);
        if (existsSync(p)) unlinkSync(p);
      },
      // Only set when the gate is on (testability-gate.md §7-8) — applySync
      // skips assessment entirely when this is undefined, so a gate-off run
      // behaves exactly as it did before the gate existed.
      ...(gateOn ? { assess: (req) => assess({ requirement: req, llm, config: cfg }) } : {}),
    };
    mkdirSync(GENERATED_TESTS_DIR, { recursive: true });
    console.log(
      `[sync] APPLY — prune ${pruneSet.length} file(s), ${gateOn ? "assess then " : ""}regenerate ${added.length + changed.length + missing.length} requirement(s). This calls the LLM.`
    );
    const { manifest: next, summary } = await applySync({
      added, changed, missing, removed, pruneSet, hashes, requirementsById, prevManifest: manifest, effects,
    });
    next.model = cfg.llmModel;
    mkdirSync(STATE_DIR, { recursive: true });
    writeFileSync(MANIFEST_PATH, JSON.stringify(next, null, 2));
    const cost = buildCostReport(llm.getUsage?.(), {
      inputUsdPerMTok: cfg.llmInputUsdPerMTok,
      outputUsdPerMTok: cfg.llmOutputUsdPerMTok,
    });
    console.log(
      `[sync] done: regenerated ${summary.regenerated} req(s) (${summary.generatedTests} test(s))` +
        (summary.gated ? `, gated ${summary.gated} req(s) (returned for clarification, not generated)` : "") +
        `, pruned ${summary.pruned} file(s).`
    );
    console.log(`[sync] cost: $${cost.totalUsd.toFixed(4)} over ${cost.calls} LLM call(s).`);
    console.log(`[sync] manifest updated -> state/suite-manifest.json`);
    return;
  }

  if (args.initManifest) {
    const byReq = new Map();
    for (const p of persisted) {
      if (!byReq.has(p.requirementId)) byReq.set(p.requirementId, []);
      byReq.get(p.requirementId).push(p.testId);
    }
    const out = { version: 1, model: loadConfig(process.env).llmModel, requirements: {} };
    for (const req of requirements) {
      out.requirements[req.id] = { hash: hashRequirement(req), testIds: byReq.get(req.id) ?? [] };
    }
    mkdirSync(STATE_DIR, { recursive: true });
    writeFileSync(MANIFEST_PATH, JSON.stringify(out, null, 2));
    const withTests = Object.values(out.requirements).filter((r) => r.testIds.length > 0).length;
    console.log(`[sync] wrote baseline manifest: ${requirements.length} requirement(s) ` +
      `(${withTests} with existing tests) -> state/suite-manifest.json`);
    return;
  }

  // ---- dry-run plan (default) ----
  const line = (s) => console.log(s);
  line("");
  line("Requirement sync — DRY RUN  (writes nothing · no LLM calls · deletes nothing)");
  line(manifestExists ? "Manifest: state/suite-manifest.json" : "Manifest: (none yet — first run, so everything reads as NEW; run --init-manifest to set a baseline)");
  line("");
  line(`Requirements in source: ${requirements.length}    Persisted test files: ${persisted.length}`);
  line(`  new        ${added.length.toString().padStart(3)}  -> would generate`);
  line(`  changed    ${changed.length.toString().padStart(3)}  -> would regenerate (old tests pruned first)`);
  line(`  missing    ${missing.length.toString().padStart(3)}  -> would generate (hash unchanged, but no test on disk)`);
  line(`  removed    ${removed.length.toString().padStart(3)}  -> tests pruned`);
  line(`  unchanged  ${unchanged.length.toString().padStart(3)}  -> skipped (no cost)`);
  line(`  gated      ${gated.length.toString().padStart(3)}  -> skipped (returned for clarification, not regenerated — testability-gate.md §8)`);
  const show = (label, ids) => { if (ids.length) line(`     ${label}: ${ids.slice(0, 12).join(", ")}${ids.length > 12 ? ` … (+${ids.length - 12})` : ""}`); };
  show("new", added); show("changed", changed); show("missing", missing); show("removed", removed); show("gated", gated);
  line("");
  line(`Prune plan: ${pruneSet.length} file(s)`);
  for (const p of pruneSet.slice(0, 20)) line(`  - ${p.file}  (${p.reason})`);
  if (pruneSet.length > 20) line(`  … (+${pruneSet.length - 20} more)`);
  line("");
  const toGenerate = added.length + changed.length + missing.length;
  const gateOnPreview = cfgPreview.testabilityGate === "on";
  line(
    `Next apply would cost ≈ ${toGenerate} ${gateOnPreview ? "assess + generate" : "generate"} call(s) (new+changed+missing); unchanged+gated+removed are free.`
  );
  line(`Run with --apply to execute it (prunes + regenerates the above and updates the manifest).`);
  line("");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
