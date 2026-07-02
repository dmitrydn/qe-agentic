#!/usr/bin/env node
/**
 * Stage 6b, workstream D: runs the labelled battery in triage-battery.js
 * against the real triage() step + a real LLM call for every case, then
 * reports a confusion matrix and accuracy. "real-defect" cases apply/revert
 * an actual catalog defect and replay a persisted TestCase live;
 * "real-bad-test" cases run a hand-written bad TestCase live against the
 * CLEAN app; "synthetic" cases skip the container and hand triage() a
 * crafted RunResult triple directly. Triage is never told which kind of
 * case it's looking at, or the ground truth — same blindness as production.
 *
 * Usage: node eval/run-triage-battery.js
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runHarness } from "../workflow/steps/run-harness.js";
import { triage } from "../workflow/steps/triage.js";
import { resolveTestsDir } from "../workflow/tests-dir.js";
import { REAL_DEFECT_CASES, REAL_BAD_TEST_CASES, SYNTHETIC_CASES } from "./triage-battery.js";

const SANDBOX_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CLASSES = ["real_defect", "flaky_or_bad_test", "environment"];
const GENERATED_TESTS_DIR = resolveTestsDir(SANDBOX_ROOT);

function loadPersistedTestCase(testCaseId) {
  return JSON.parse(readFileSync(join(GENERATED_TESTS_DIR, `${testCaseId}.json`), "utf8"));
}

/**
 * @param {{ adapter: object, llm: object, config: object, requirements: object[] }} opts
 */
export async function runTriageBattery({ adapter, llm, config, requirements }) {
  const byReqId = new Map(requirements.map((r) => [r.id, r]));
  const results = [];

  await (await adapter.run()).ready();

  for (const c of REAL_DEFECT_CASES) {
    const tc = loadPersistedTestCase(c.testCaseId);
    const requirement = byReqId.get(tc.requirementId);
    const injector = adapter.faultInjector(c.defectId);
    await injector.apply();
    const { decision, runs } = await runHarness({ testCase: tc, adapter, n: config.runN });
    let verdict = null;
    if (decision === "FAIL") {
      verdict = await triage({ testCase: tc, runs, requirement, llm });
    }
    await injector.revert();
    results.push({ id: c.id, groundTruth: c.groundTruth, decision, predicted: verdict?.class ?? null, verdict });
    console.log(`[triage-battery] ${c.id}: decision=${decision} predicted=${verdict?.class ?? "(n/a)"} groundTruth=${c.groundTruth}`);
  }

  for (const c of REAL_BAD_TEST_CASES) {
    const requirement = byReqId.get(c.requirementId);
    const { decision, runs } = await runHarness({ testCase: c.testCase, adapter, n: config.runN });
    let verdict = null;
    if (decision === "FAIL") {
      verdict = await triage({ testCase: c.testCase, runs, requirement, llm });
    }
    results.push({ id: c.id, groundTruth: c.groundTruth, decision, predicted: verdict?.class ?? null, verdict });
    console.log(`[triage-battery] ${c.id}: decision=${decision} predicted=${verdict?.class ?? "(n/a)"} groundTruth=${c.groundTruth}`);
  }

  for (const c of SYNTHETIC_CASES) {
    const requirement = byReqId.get(c.requirementId);
    const verdict = await triage({ testCase: c.testCase, runs: c.runs, requirement, llm });
    results.push({ id: c.id, groundTruth: c.groundTruth, decision: "FAIL", predicted: verdict.class, verdict });
    console.log(`[triage-battery] ${c.id}: predicted=${verdict.class} groundTruth=${c.groundTruth}`);
  }

  await adapter.teardown();

  // Confusion matrix: rows = ground truth, cols = predicted.
  const matrix = {};
  for (const truth of CLASSES) {
    matrix[truth] = {};
    for (const pred of CLASSES) matrix[truth][pred] = 0;
  }
  let scored = 0;
  let correct = 0;
  const unscored = [];
  for (const r of results) {
    if (r.predicted === null) {
      unscored.push(r.id); // decision wasn't FAIL (e.g. a "bad test" that happened to PASS) — can't triage
      continue;
    }
    scored++;
    if (matrix[r.groundTruth] && r.predicted in matrix[r.groundTruth]) matrix[r.groundTruth][r.predicted]++;
    if (r.predicted === r.groundTruth) correct++;
  }
  const accuracy = scored > 0 ? correct / scored : null;
  const misclassified = results.filter((r) => r.predicted !== null && r.predicted !== r.groundTruth);

  return { results, matrix, accuracy, scored, correct, unscored, misclassified };
}

function renderMatrixMarkdown(matrix) {
  const header = `| ground truth \\ predicted | ${CLASSES.join(" | ")} |`;
  const sep = `|---|${CLASSES.map(() => "---").join("|")}|`;
  const rows = CLASSES.map((truth) => `| ${truth} | ${CLASSES.map((pred) => matrix[truth][pred]).join(" | ")} |`);
  return [header, sep, ...rows].join("\n");
}

function renderReportMarkdown({ results, matrix, accuracy, scored, correct, unscored, misclassified }) {
  const lines = [
    "# Stage 6b Triage Stress-Test Report",
    "",
    `Accuracy: ${(accuracy * 100).toFixed(0)}% (${correct}/${scored} scored cases)`,
    unscored.length ? `Unscored (no FAIL decision to triage): ${unscored.join(", ")}` : "",
    "",
    "## Confusion matrix",
    "",
    renderMatrixMarkdown(matrix),
    "",
    "## Cases",
    "",
    "| Case id | Ground truth | Predicted | Match | Confidence |",
    "|---|---|---|---|---|",
    ...results.map(
      (r) =>
        `| ${r.id} | ${r.groundTruth} | ${r.predicted ?? "(unscored)"} | ${r.predicted === r.groundTruth ? "yes" : "NO"} | ${r.verdict?.confidence ?? "-"} |`
    ),
    "",
  ];
  if (misclassified.length) {
    lines.push("## Misclassifications", "");
    for (const r of misclassified) {
      lines.push(
        `### ${r.id}`,
        "",
        `Ground truth: \`${r.groundTruth}\` — Predicted: \`${r.predicted}\` (confidence: ${r.verdict?.confidence})`,
        "",
        `Rationale given: ${r.verdict?.rationale}`,
        ""
      );
    }
  }
  return lines.filter((l) => l !== "").join("\n");
}

async function main() {
  const { loadConfig } = await import("../workflow/config.js");
  const { createLlmClient } = await import("../workflow/llm/llm-client.js");
  const { cypressRwaWorkflowAdapter } = await import("../adapters/cypress-rwa/workflow-adapter.js");
  const config = loadConfig(process.env);
  const llm = createLlmClient(config);
  const requirements = await cypressRwaWorkflowAdapter.requirementsSource();

  const battery = await runTriageBattery({ adapter: cypressRwaWorkflowAdapter, llm, config, requirements });

  const { buildCostReport } = await import("../workflow/llm/cost.js");
  const cost = buildCostReport(llm.getUsage?.(), {
    inputUsdPerMTok: config.llmInputUsdPerMTok,
    outputUsdPerMTok: config.llmOutputUsdPerMTok,
  });

  const reportsDir = join(SANDBOX_ROOT, "reports");
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(
    join(reportsDir, "triage-battery.json"),
    JSON.stringify(
      {
        accuracy: battery.accuracy,
        scored: battery.scored,
        correct: battery.correct,
        matrix: battery.matrix,
        unscored: battery.unscored,
        misclassifiedIds: battery.misclassified.map((r) => r.id),
        cases: battery.results.map((r) => ({ id: r.id, groundTruth: r.groundTruth, predicted: r.predicted })),
        cost,
      },
      null,
      2
    )
  );
  writeFileSync(join(reportsDir, "triage-battery.md"), renderReportMarkdown(battery));

  console.log(`\n[triage-battery] accuracy: ${(battery.accuracy * 100).toFixed(0)}% (${battery.correct}/${battery.scored})`);
  if (cost) {
    console.log(
      `[triage-battery] cost: $${cost.totalUsd.toFixed(4)} over ${cost.calls} LLM call(s) ` +
        `(${cost.promptTokens} in + ${cost.completionTokens} out tok)`
    );
  }
  if (battery.misclassified.length) {
    console.log(`[triage-battery] misclassified: ${battery.misclassified.map((r) => r.id).join(", ")}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
