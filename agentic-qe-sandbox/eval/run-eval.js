#!/usr/bin/env node
/**
 * Seeded-defect scoring harness (Stage 6). Replays the persisted suite from
 * generated-tests/ — NO regeneration, NO new generation, Generate never sees
 * a defect — against each catalog defect:
 *   1. baseline: run the test on the clean app; only tests that are
 *      reliably PASS (n runs, reset before each) are eligible to "catch".
 *   2. apply() the defect; re-run the eligible tests; a defect is "caught"
 *      if at least one previously-PASS test now decides FAIL.
 *   3. revert() the defect; re-run those same tests to confirm green again.
 * Fills `defects[]`/`catchRate` in reports/scorecard.json (written by the
 * clean run) and writes reports/eval-report.md.
 *
 * Usage: node eval/run-eval.js
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runHarness } from "../workflow/steps/run-harness.js";
import { DEFECT_CATALOG } from "./defects.js";

const SANDBOX_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

function loadPersistedTestCases(generatedTestsDir) {
  if (!existsSync(generatedTestsDir)) return [];
  return readdirSync(generatedTestsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(join(generatedTestsDir, f), "utf8")));
}

/**
 * @param {{ adapter: object, config: object, generatedTestsDir: string, reportsDir: string }} opts
 */
export async function runEval({ adapter, config, generatedTestsDir, reportsDir }) {
  await (await adapter.run()).ready();

  const testCases = loadPersistedTestCases(generatedTestsDir);
  if (testCases.length === 0) {
    throw new Error(
      `runEval(): no persisted test cases found in ${generatedTestsDir} — run the clean run (run-workflow.js) first.`
    );
  }

  console.log(`[eval] loaded ${testCases.length} persisted test case(s)`);

  await adapter.reset();
  const baselineEligible = [];
  for (const tc of testCases) {
    const { decision } = await runHarness({ testCase: tc, adapter, n: config.runN });
    console.log(`[eval] baseline ${tc.id}: ${decision}`);
    if (decision === "PASS") baselineEligible.push(tc);
  }

  const defectResults = [];
  for (const defect of DEFECT_CATALOG) {
    console.log(`[eval] === defect: ${defect.id} ===`);
    const injector = adapter.faultInjector(defect.id);

    await injector.apply();
    const byTestIds = [];
    for (const tc of baselineEligible) {
      const { decision } = await runHarness({ testCase: tc, adapter, n: config.runN });
      console.log(`[eval]   ${tc.id} with defect applied: ${decision}`);
      if (decision === "FAIL") byTestIds.push(tc.id);
    }
    await injector.revert();

    let revertedCleanly = true;
    for (const tc of baselineEligible.filter((t) => byTestIds.includes(t.id))) {
      const { decision } = await runHarness({ testCase: tc, adapter, n: config.runN });
      console.log(`[eval]   ${tc.id} after revert: ${decision}`);
      if (decision !== "PASS") revertedCleanly = false;
    }

    defectResults.push({
      id: defect.id,
      description: defect.description,
      severity: defect.severity ?? "unspecified",
      expectCaught: defect.expectCaught !== false,
      caught: byTestIds.length > 0,
      byTestIds,
      revertedCleanly,
    });
  }

  // The headline catch rate only measures detection power over defects the
  // suite is actually expected to catch — negative controls (expectCaught
  // === false) are excluded from this denominator on purpose, so adding more
  // of them can't silently inflate or deflate the number; their own
  // pass/fail is reported separately below instead.
  const realDefects = defectResults.filter((d) => d.expectCaught);
  const negativeControls = defectResults.filter((d) => !d.expectCaught);
  const caughtCount = realDefects.filter((d) => d.caught).length;
  const catchRate = realDefects.length > 0 ? caughtCount / realDefects.length : null;

  const targetedTestIds = new Set(realDefects.flatMap((d) => d.byTestIds));
  const unmeasuredTestIds = baselineEligible.map((tc) => tc.id).filter((id) => !targetedTestIds.has(id));

  const negativeControlSummary = {
    total: negativeControls.length,
    correctlyUncaught: negativeControls.filter((d) => !d.caught).length,
    unexpectedlyCaught: negativeControls.filter((d) => d.caught).map((d) => d.id),
  };

  const scorecardPath = join(reportsDir, "scorecard.json");
  const scorecard = JSON.parse(readFileSync(scorecardPath, "utf8"));
  scorecard.defects = defectResults.map(({ id, caught, byTestIds, severity, expectCaught }) => ({
    id,
    caught,
    byTestIds,
    severity,
    expectCaught,
  }));
  scorecard.catchRate = catchRate;
  scorecard.unmeasuredTestIds = unmeasuredTestIds;
  scorecard.negativeControls = negativeControlSummary;
  writeFileSync(scorecardPath, JSON.stringify(scorecard, null, 2));
  writeFileSync(
    join(reportsDir, "eval-report.md"),
    renderEvalReportMarkdown(defectResults, catchRate, baselineEligible, unmeasuredTestIds, negativeControlSummary)
  );

  await adapter.teardown();

  return {
    defectResults,
    catchRate,
    unmeasuredTestIds,
    negativeControlSummary,
    baselineEligibleIds: baselineEligible.map((tc) => tc.id),
  };
}

function renderEvalReportMarkdown(defectResults, catchRate, baselineEligible, unmeasuredTestIds, negativeControlSummary) {
  const realDefects = defectResults.filter((d) => d.expectCaught);
  const negativeControls = defectResults.filter((d) => !d.expectCaught);
  const lines = [
    "# Stage 6 Seeded-Defect Eval Report",
    "",
    `Catch rate (real defects only, negative controls excluded from this denominator): ` +
      `${(catchRate * 100).toFixed(0)}% (${realDefects.filter((d) => d.caught).length}/${realDefects.length})`,
    `Negative controls correctly NOT caught: ${negativeControlSummary.correctlyUncaught}/${negativeControlSummary.total}` +
      (negativeControlSummary.unexpectedlyCaught.length
        ? ` (unexpectedly caught: ${negativeControlSummary.unexpectedlyCaught.join(", ")})`
        : ""),
    `Baseline-eligible (clean-app PASS) test cases: ${baselineEligible.map((tc) => tc.id).join(", ") || "(none)"}`,
    `Unmeasured test cases (not flipped by any real-defect catalog entry): ${unmeasuredTestIds.join(", ") || "(none)"}`,
    "",
    "## Real defects",
    "",
    "| Defect id | Severity | Caught | Catching test(s) | Reverted cleanly |",
    "|---|---|---|---|---|",
    ...realDefects.map(
      (d) =>
        `| ${d.id} | ${d.severity} | ${d.caught ? "yes" : "NO"} | ${d.byTestIds.join(", ") || "-"} | ${d.revertedCleanly ? "yes" : "NO"} |`
    ),
    "",
    "## Negative controls (expected to NOT be caught)",
    "",
    "| Defect id | Severity | Caught (unexpected if yes) | Reverted cleanly |",
    "|---|---|---|---|",
    ...negativeControls.map(
      (d) => `| ${d.id} | ${d.severity} | ${d.caught ? "YES — unexpected" : "no (expected)"} | ${d.revertedCleanly ? "yes" : "NO"} |`
    ),
    "",
  ];
  for (const d of defectResults) {
    lines.push(`## ${d.id}`, "", d.description, "");
  }
  return lines.join("\n");
}

async function main() {
  const { loadConfig } = await import("../workflow/config.js");
  const { cypressRwaWorkflowAdapter } = await import("../adapters/cypress-rwa/workflow-adapter.js");
  const config = loadConfig(process.env);

  const { resolveTestsDir } = await import("../workflow/tests-dir.js");
  const { defectResults, catchRate, unmeasuredTestIds, negativeControlSummary } = await runEval({
    adapter: cypressRwaWorkflowAdapter,
    config,
    generatedTestsDir: resolveTestsDir(SANDBOX_ROOT),
    reportsDir: join(SANDBOX_ROOT, "reports"),
  });

  console.log(`\n[eval] catch rate (real defects): ${(catchRate * 100).toFixed(0)}%`);
  console.log(
    `[eval] negative controls correctly uncaught: ${negativeControlSummary.correctlyUncaught}/${negativeControlSummary.total}`
  );
  if (unmeasuredTestIds.length > 0) {
    console.log(`[eval] unmeasured test ids (no targeting real defect): ${unmeasuredTestIds.join(", ")}`);
  }
  // Only a missed REAL defect or a dirty revert is a failure — a negative
  // control going uncaught is the expected, correct outcome, not a failure;
  // a negative control going unexpectedly caught is reported above but is
  // not itself a failure (it just means detection is better than assumed).
  const missed = defectResults.filter((d) => d.expectCaught && !d.caught);
  const notReverted = defectResults.filter((d) => !d.revertedCleanly);
  if (missed.length > 0) {
    console.error(`[eval] MISSED real defects: ${missed.map((d) => d.id).join(", ")}`);
  }
  if (notReverted.length > 0) {
    console.error(`[eval] defects that did NOT revert cleanly: ${notReverted.map((d) => d.id).join(", ")}`);
  }
  if (missed.length > 0 || notReverted.length > 0) {
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
