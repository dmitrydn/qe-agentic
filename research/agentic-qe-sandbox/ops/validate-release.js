#!/usr/bin/env node
/**
 * ops/ = operate the suite. (workflow = make · eval = grade · ops = operate)
 *
 * validate-release: replay the existing, persisted suite against the CURRENT
 * app build and report regressions. No generation happens — the only LLM cost
 * is a triage call per FAILing test — so this is the near-zero-cost release gate.
 * Exits non-zero if any regression is found (so it can fail a CI release stage).
 *
 * Names the concrete adapter, so it lives in ops/ (not workflow/, where the
 * import-boundary rule forbids adapter imports). Boots the runtime container via
 * the adapter — requires the app image to be available (docker).
 *
 * Usage: node ops/validate-release.js
 */
import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../workflow/config.js";
import { createLlmClient } from "../workflow/llm/llm-client.js";
import { select } from "../workflow/steps/select.js";
import { runHarness } from "../workflow/steps/run-harness.js";
import { triage } from "../workflow/steps/triage.js";
import { validateRelease } from "../workflow/steps/release.js";
import { buildCostReport } from "../workflow/llm/cost.js";
import { resolveTestsDir } from "../workflow/tests-dir.js";
import { cypressRwaWorkflowAdapter as adapter } from "../adapters/cypress-rwa/workflow-adapter.js";

const SANDBOX_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATED_TESTS_DIR = resolveTestsDir(SANDBOX_ROOT);
const REPORTS_DIR = join(SANDBOX_ROOT, "reports");

function loadSuite() {
  if (!existsSync(GENERATED_TESTS_DIR)) return [];
  return readdirSync(GENERATED_TESTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(GENERATED_TESTS_DIR, f), "utf8")));
}

function renderReleaseReport(summary, regressions, results, model) {
  const lines = [
    "# Release validation report",
    "",
    `Model (triage): ${model}`,
    `Result: ${summary.regressions ? "FAIL — regressions found" : "PASS — no regressions"}`,
    "",
    "## Summary",
    `Replayed: ${summary.total} test(s) — ${summary.pass} pass · ${summary.regressions} regression(s) · ` +
      `${summary.quarantined} quarantined (flaky) · ${summary.inconclusive} inconclusive`,
    "",
  ];
  if (regressions.length) {
    lines.push("## Regressions", "", "| Test id | Requirement | Confidence | Rationale |", "|---|---|---|---|");
    for (const r of regressions) {
      lines.push(`| ${r.id} | ${r.requirementId} | ${r.verdict?.confidence ?? "-"} | ${(r.verdict?.rationale ?? "").replace(/\|/g, "\\|")} |`);
    }
    lines.push("");
  }
  lines.push("## All outcomes", "", "| Test id | Requirement | Status |", "|---|---|---|");
  for (const r of results) lines.push(`| ${r.id} | ${r.requirementId} | ${r.status} |`);
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const config = loadConfig(process.env);
  const llm = createLlmClient(config);

  const suite = loadSuite();
  if (suite.length === 0) {
    throw new Error(
      `validate-release: no persisted suite in generated-tests/ — run a workflow or 'sync-requirements --apply' first.`
    );
  }

  const requirements = await select({ adapter });
  const requirementsById = new Map(requirements.map((r) => [r.id, r]));

  await (await adapter.run()).ready(); // boot the build under test
  const effects = {
    runHarness: (tc) => runHarness({ testCase: tc, adapter, n: config.runN }),
    triage: ({ testCase, runs, requirement }) => triage({ testCase, runs, requirement, llm }),
  };

  let outcome;
  try {
    outcome = await validateRelease({ suite, requirementsById, effects });
  } finally {
    await adapter.teardown();
  }
  const { results, regressions, summary } = outcome;

  mkdirSync(REPORTS_DIR, { recursive: true });
  writeFileSync(join(REPORTS_DIR, "release-report.md"), renderReleaseReport(summary, regressions, results, config.llmModel));

  const cost = buildCostReport(llm.getUsage?.(), {
    inputUsdPerMTok: config.llmInputUsdPerMTok,
    outputUsdPerMTok: config.llmOutputUsdPerMTok,
  });

  console.log(
    `[release] ${summary.pass}/${summary.total} pass · ${summary.regressions} regression(s) · ${summary.quarantined} quarantined`
  );
  if (regressions.length) console.log(`[release] REGRESSIONS: ${regressions.map((r) => r.id).join(", ")}`);
  console.log(`[release] cost: $${cost.totalUsd.toFixed(4)} over ${cost.calls} triage call(s) (replay itself is free)`);
  console.log(`[release] report -> reports/release-report.md`);

  process.exit(regressions.length > 0 ? 1 : 0); // non-zero gates the release in CI
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
