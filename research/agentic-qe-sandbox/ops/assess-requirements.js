#!/usr/bin/env node
/**
 * ops/ = operate the suite. (workflow = make · eval = grade · ops = operate)
 *
 * assess-requirements: Phase-A standalone testability scorer
 * (docs/design/testability-gate.md §7). Measure-only — never gates, never
 * generates a test, never touches the manifest. This is the calibration
 * tool: run it on the real requirement set, eyeball the verdict
 * distribution and clarifications, and use that to pick
 * TESTABILITY_THRESHOLD before the Phase-B hard gate is ever turned on.
 * Mirrors the `sync-requirements --dry-run` pattern.
 *
 * Names the concrete adapter, so it lives in ops/ (not workflow/, where the
 * import-boundary rule forbids adapter imports).
 *
 * Usage:
 *   node ops/assess-requirements.js [--all | --requirement <id>]
 *   (no flags defaults to --all)
 */
import { mkdirSync, writeFileSync, appendFileSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "../workflow/config.js";
import { createLlmClient } from "../workflow/llm/llm-client.js";
import { select } from "../workflow/steps/select.js";
import { assessStable } from "../workflow/steps/assess.js";
import { DIMENSION_IDS } from "../workflow/steps/testability.js";
import { renderClarificationReport } from "../workflow/steps/report.js";
import { buildCostReport } from "../workflow/llm/cost.js";
import { cypressRwaWorkflowAdapter as adapter } from "../adapters/cypress-rwa/workflow-adapter.js";

const SANDBOX_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const REPORTS_DIR = join(SANDBOX_ROOT, "reports");
const CLARIFICATIONS_DIR = join(REPORTS_DIR, "clarifications");
// Each run is preserved here (timestamped) plus a one-row-per-run history.md,
// so runs can be diffed instead of silently overwriting one another.
const TESTABILITY_DIR = join(REPORTS_DIR, "testability");

function parseArgs(argv) {
  const idx = argv.indexOf("--requirement");
  const requirementId = idx >= 0 ? argv[idx + 1] : undefined;
  return { all: argv.includes("--all") || !requirementId, requirementId };
}

function topGap(a) {
  if (a.clarifications.length) return a.clarifications[0];
  const firstGap = a.dimensions.find((d) => d.rating !== "pass");
  return firstGap ? firstGap.finding : "—";
}

// Compact per-dimension ratings (D1..D6 in order) so a report row shows WHICH
// dimension drove the verdict — the detail this analysis needed but the report
// didn't previously persist.
const RATING_GLYPH = { pass: "+", partial: "~", fail: "F" };
function dimGlyphs(a) {
  const byId = Object.fromEntries(a.dimensions.map((d) => [d.id, d.rating]));
  return DIMENSION_IDS.map((id) => RATING_GLYPH[byId[id]] ?? "?").join(" ");
}

function countVerdicts(assessments) {
  const counts = { testable: 0, needs_clarification: 0, untestable: 0 };
  for (const a of assessments) counts[a.verdict] += 1;
  return counts;
}

// The knobs that change the verdicts — recorded in every report and history row
// so a diff between runs is meaningful (you can see WHICH setting moved it).
function runContext(config) {
  return `threshold ${config.testabilityThreshold} · clarifyOnFail [${config.testabilityClarifyOnFail.join(",")}] · strictFail ${config.testabilityStrictFail ? "on" : "off"} · runs ${config.testabilityRuns}`;
}

function renderTestabilityReport(assessments, model, config, stamp) {
  const counts = countVerdicts(assessments);

  const lines = [
    "# Testability report (Phase A — measure only)",
    "",
    `Run: ${stamp}`,
    `Model: ${model}    Settings: ${runContext(config)}`,
    `Summary: ${counts.testable} testable / ${counts.needs_clarification} needs-clarification / ${counts.untestable} untestable`,
    "",
    "Dimensions D1–D6 (`+` pass · `~` partial · `F` fail):  D1 oracle · D2 clarity · D3 actor · D4 interface · D5 consistency · D6 scope",
    "",
    "| Requirement | Verdict | Score | D1–D6 | Blocked by | Top gap |",
    "|---|---|---|---|---|---|",
  ];
  for (const a of assessments) {
    lines.push(
      `| ${a.requirementId} | ${a.verdict} | ${a.score.toFixed(2)} | ${dimGlyphs(a)} | ${a.blockedBy.join(", ") || "—"} | ${topGap(a).replace(/\|/g, "\\|")} |`
    );
  }
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const config = loadConfig(process.env);
  const llm = createLlmClient(config); // requires OPENROUTER_API_KEY — this path spends per non-hard-gap requirement.

  const requirements = await select({
    adapter,
    filter: { all: args.all, ids: args.requirementId ? [args.requirementId] : undefined },
  });

  if (requirements.length === 0) {
    throw new Error(`assess-requirements: no requirement matched --requirement ${args.requirementId}`);
  }

  const assessments = [];
  for (const requirement of requirements) {
    const a = await assessStable({ requirement, llm, config });
    assessments.push(a);
    console.log(`[assess] ${a.requirementId}: ${a.verdict} (score ${a.score.toFixed(2)})`);
  }

  // Rebuild from scratch so the folder reflects THIS run's non-testable
  // requirements only — no stale files for ones since made testable.
  rmSync(CLARIFICATIONS_DIR, { recursive: true, force: true });
  mkdirSync(CLARIFICATIONS_DIR, { recursive: true });
  for (const a of assessments) {
    if (a.verdict !== "testable") {
      writeFileSync(join(CLARIFICATIONS_DIR, `${a.requirementId}.md`), renderClarificationReport(a));
    }
  }
  const stamp = new Date().toISOString().replace(/:/g, "-").replace(/\..+$/, "");
  mkdirSync(TESTABILITY_DIR, { recursive: true });
  const fullReport = renderTestabilityReport(assessments, config.llmModel, config, stamp);
  // Timestamped copy is preserved; testability-report.md stays as a "latest" pointer.
  writeFileSync(join(TESTABILITY_DIR, `run-${stamp}.md`), fullReport);
  writeFileSync(join(REPORTS_DIR, "testability-report.md"), fullReport);

  const cost = buildCostReport(llm.getUsage?.(), {
    inputUsdPerMTok: config.llmInputUsdPerMTok,
    outputUsdPerMTok: config.llmOutputUsdPerMTok,
  });
  const counts = countVerdicts(assessments);

  // One comparable row per run so runs can be diffed at a glance.
  const historyPath = join(TESTABILITY_DIR, "history.md");
  if (!existsSync(historyPath)) {
    writeFileSync(
      historyPath,
      "# Testability run history\n\n| Run | Settings | testable | needs-clarification | untestable | cost |\n|---|---|---|---|---|---|\n"
    );
  }
  appendFileSync(
    historyPath,
    `| ${stamp} | ${runContext(config)} | ${counts.testable} | ${counts.needs_clarification} | ${counts.untestable} | $${cost.totalUsd.toFixed(4)} |\n`
  );

  console.log(
    `[assess] ${counts.testable} testable / ${counts.needs_clarification} needs-clarification / ${counts.untestable} untestable`
  );
  console.log(`[assess] cost: $${cost.totalUsd.toFixed(4)} over ${cost.calls} assess call(s)`);
  console.log(
    `[assess] report -> reports/testability/run-${stamp}.md  (latest: reports/testability-report.md · history: reports/testability/history.md)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
