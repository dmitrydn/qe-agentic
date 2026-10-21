#!/usr/bin/env node
/**
 * Labelled-battery accuracy check for assess() (docs/design/testability-gate.md
 * §9-§10). Runs every case in testability-battery.js through the real
 * assess() step + a real LLM call, builds a confusion matrix (predicted
 * verdict × expected) and an accuracy, and writes
 * reports/testability-battery.{json,md} — exactly like run-triage-battery.js.
 * "good" cases resolve a real curated requirement id from the live
 * requirement set; "synthetic" cases carry their own hand-written
 * requirement directly. assess() is never told the ground truth.
 *
 * Usage: node eval/run-testability-battery.js
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assess } from "../workflow/steps/assess.js";
import { GOOD_CASES, SYNTHETIC_CASES } from "./testability-battery.js";

const SANDBOX_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const VERDICTS = ["testable", "needs_clarification", "untestable"];

/**
 * @param {{ llm: object, config: object, requirements: object[], assessFn?: Function }} opts
 *   assessFn defaults to the real assess() step; tests inject a fake one to
 *   exercise the confusion-matrix/accuracy math without an LLM call.
 */
export async function runTestabilityBattery({ llm, config, requirements, assessFn = assess }) {
  const byReqId = new Map(requirements.map((r) => [r.id, r]));
  const results = [];

  for (const c of GOOD_CASES) {
    const requirement = byReqId.get(c.requirementId);
    if (!requirement) {
      throw new Error(`runTestabilityBattery: good case "${c.id}" references unknown requirement id "${c.requirementId}"`);
    }
    const assessment = await assessFn({ requirement, llm, config });
    results.push({ id: c.id, expectedVerdict: c.expectedVerdict, predicted: assessment.verdict, assessment });
    console.log(`[testability-battery] ${c.id}: predicted=${assessment.verdict} expected=${c.expectedVerdict}`);
  }

  for (const c of SYNTHETIC_CASES) {
    const assessment = await assessFn({ requirement: c.requirement, llm, config });
    results.push({ id: c.id, expectedVerdict: c.expectedVerdict, predicted: assessment.verdict, assessment });
    console.log(`[testability-battery] ${c.id}: predicted=${assessment.verdict} expected=${c.expectedVerdict}`);
  }

  // Confusion matrix: rows = expected, cols = predicted.
  const matrix = {};
  for (const expected of VERDICTS) {
    matrix[expected] = {};
    for (const predicted of VERDICTS) matrix[expected][predicted] = 0;
  }
  let correct = 0;
  for (const r of results) {
    matrix[r.expectedVerdict][r.predicted] += 1;
    if (r.predicted === r.expectedVerdict) correct += 1;
  }
  const total = results.length;
  const accuracy = total > 0 ? correct / total : null;
  const misclassified = results.filter((r) => r.predicted !== r.expectedVerdict);

  return { results, matrix, accuracy, correct, total, misclassified };
}

function renderMatrixMarkdown(matrix) {
  const header = `| expected \\ predicted | ${VERDICTS.join(" | ")} |`;
  const sep = `|---|${VERDICTS.map(() => "---").join("|")}|`;
  const rows = VERDICTS.map((expected) => `| ${expected} | ${VERDICTS.map((predicted) => matrix[expected][predicted]).join(" | ")} |`);
  return [header, sep, ...rows].join("\n");
}

function renderReportMarkdown({ results, matrix, accuracy, correct, total, misclassified }) {
  const lines = [
    "# Testability battery report",
    "",
    `Accuracy: ${(accuracy * 100).toFixed(0)}% (${correct}/${total} cases)`,
    "",
    "## Confusion matrix",
    "",
    renderMatrixMarkdown(matrix),
    "",
    "## Cases",
    "",
    "| Case id | Expected | Predicted | Match | Score |",
    "|---|---|---|---|---|",
    ...results.map(
      (r) =>
        `| ${r.id} | ${r.expectedVerdict} | ${r.predicted} | ${r.predicted === r.expectedVerdict ? "yes" : "NO"} | ${r.assessment.score.toFixed(2)} |`
    ),
    "",
  ];
  if (misclassified.length) {
    lines.push("## Misclassifications", "");
    for (const r of misclassified) {
      lines.push(
        `### ${r.id}`,
        "",
        `Expected: \`${r.expectedVerdict}\` — Predicted: \`${r.predicted}\` (score: ${r.assessment.score.toFixed(2)}, blockedBy: ${r.assessment.blockedBy.join(", ") || "—"})`,
        "",
        ...r.assessment.dimensions.map((d) => `- ${d.id} (${d.rating}): ${d.finding}`),
        ""
      );
    }
  }
  return lines.join("\n");
}

async function main() {
  const { loadConfig } = await import("../workflow/config.js");
  const { createLlmClient } = await import("../workflow/llm/llm-client.js");
  const { cypressRwaWorkflowAdapter } = await import("../adapters/cypress-rwa/workflow-adapter.js");
  const { buildCostReport } = await import("../workflow/llm/cost.js");

  const config = loadConfig(process.env);
  const llm = createLlmClient(config);
  const requirements = await cypressRwaWorkflowAdapter.requirementsSource();

  const battery = await runTestabilityBattery({ llm, config, requirements });

  const cost = buildCostReport(llm.getUsage?.(), {
    inputUsdPerMTok: config.llmInputUsdPerMTok,
    outputUsdPerMTok: config.llmOutputUsdPerMTok,
  });

  const reportsDir = join(SANDBOX_ROOT, "reports");
  mkdirSync(reportsDir, { recursive: true });
  writeFileSync(
    join(reportsDir, "testability-battery.json"),
    JSON.stringify(
      {
        accuracy: battery.accuracy,
        correct: battery.correct,
        total: battery.total,
        matrix: battery.matrix,
        misclassifiedIds: battery.misclassified.map((r) => r.id),
        cases: battery.results.map((r) => ({ id: r.id, expectedVerdict: r.expectedVerdict, predicted: r.predicted, score: r.assessment.score })),
        cost,
      },
      null,
      2
    )
  );
  writeFileSync(join(reportsDir, "testability-battery.md"), renderReportMarkdown(battery));

  console.log(`\n[testability-battery] accuracy: ${(battery.accuracy * 100).toFixed(0)}% (${battery.correct}/${battery.total})`);
  console.log(`[testability-battery] cost: $${cost.totalUsd.toFixed(4)} over ${cost.calls} assess call(s)`);
  if (battery.misclassified.length) {
    console.log(`[testability-battery] misclassified: ${battery.misclassified.map((r) => r.id).join(", ")}`);
  }
  console.log(`[testability-battery] report -> reports/testability-battery.md`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
