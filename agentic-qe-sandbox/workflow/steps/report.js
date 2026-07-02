/**
 * REPORT (deterministic). Aggregates orchestrator records into a Scorecard,
 * and writes reports/scorecard.json, reports/report.md,
 * reports/defects/<id>.md for each real_defect outcome, and
 * reports/clarifications/<id>.md for each requirement the testability gate
 * (testability-gate.md) returned for clarification instead of generating
 * from. Leaves defects[]/catchRate to the eval harness (null/[] on a clean
 * run).
 */
import { writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { buildCostReport } from "../llm/cost.js";

/**
 * Renders a single non-testable assessment (testability-gate.md §7) as the
 * clarification artifact handed back to the requirement's author. Shared by
 * the Phase-B gate here and the Phase-A standalone scorer
 * (ops/assess-requirements.js), so both produce the same format.
 * @param {{ requirementId: string, verdict: string, score: number, blockedBy: string[],
 *           dimensions: { id: string, rating: string, finding: string }[],
 *           clarifications: string[], assumptions: string[] }} assessment
 * @returns {string}
 */
export function renderClarificationReport(assessment) {
  const lines = [
    `# Clarification needed: ${assessment.requirementId}`,
    "",
    `**Verdict:** ${assessment.verdict}`,
    `**Score:** ${assessment.score.toFixed(2)}`,
  ];
  if (assessment.blockedBy.length) lines.push(`**Blocked by:** ${assessment.blockedBy.join(", ")}`);
  lines.push(
    "",
    "## Dimension findings",
    "",
    "| Dimension | Rating | Finding |",
    "|---|---|---|",
    ...assessment.dimensions.map((d) => `| ${d.id} | ${d.rating} | ${d.finding.replace(/\|/g, "\\|")} |`),
    ""
  );
  if (assessment.clarifications.length) {
    lines.push("## Questions for the author", "", ...assessment.clarifications.map((c) => `- ${c}`), "");
  }
  if (assessment.assumptions.length) {
    lines.push("## Assumptions the assessor would otherwise make", "", ...assessment.assumptions.map((s) => `- ${s}`), "");
  }
  return lines.join("\n");
}

/**
 * @param {{ records: Array<{ tc: object, status: "pass"|"defect"|"quarantined"|"needs_clarification", verdict?: object, assessment?: object }>,
 *           requirements: object[], config: object, model: string,
 *           usage?: { calls: number, promptTokens: number, completionTokens: number, byPhase?: object },
 *           reportsDir: string, testabilityAssessments?: object[] }} opts
 * @returns {object} Scorecard
 */
export function report({ records, requirements, config, model, usage, reportsDir, testabilityAssessments = [] }) {
  const knownIds = new Set(requirements.map((r) => r.id));

  // A requirement that errored out entirely (see orchestrator.js's
  // per-requirement try/catch) produced no TestCase at all — it has no
  // `.tc` and must not be counted as a "generated" test or indexed by
  // requirementId the way every other status is. Same for a requirement the
  // testability gate returned for clarification: it was never generated, so
  // it must not be counted as a generated test, an orphan, or a coverage hit
  // (testability-gate.md §7).
  const testRecords = records.filter((r) => r.status !== "errored" && r.status !== "needs_clarification");
  const erroredRecords = records.filter((r) => r.status === "errored");
  const gatedRecords = records.filter((r) => r.status === "needs_clarification");

  const generated = testRecords.length;
  const passed = testRecords.filter((r) => r.status === "pass").length;
  const failed = testRecords.filter((r) => r.status === "defect").length;
  const quarantinedFlaky = testRecords.filter((r) => r.status === "quarantined").length;
  const errored = erroredRecords.length;

  const coveredIds = new Set(testRecords.filter((r) => r.status === "pass").map((r) => r.tc.requirementId));
  const orphanTestIds = testRecords.filter((r) => !knownIds.has(r.tc.requirementId)).map((r) => r.tc.id);

  const falsePositiveRate = generated > 0 ? failed / generated : 0;

  // Cost of this run from accumulated token usage and the configured prices.
  // `usage` is absent only when called without an instrumented client (e.g.
  // a unit test) — then cost is null rather than a misleading $0.
  const cost = usage
    ? buildCostReport(usage, {
        inputUsdPerMTok: config.llmInputUsdPerMTok,
        outputUsdPerMTok: config.llmOutputUsdPerMTok,
      })
    : null;

  // Only present when the testability gate actually ran (testabilityAssessments
  // is empty when the gate is off, or for any caller that predates it) — an
  // absent/null block, not a misleadingly-zeroed one, distinguishes "the gate
  // didn't run" from "the gate ran and every requirement was testable".
  const testabilityCounts = { testable: 0, needs_clarification: 0, untestable: 0 };
  for (const a of testabilityAssessments) testabilityCounts[a.verdict] += 1;
  const testability = testabilityAssessments.length
    ? {
        counts: testabilityCounts,
        gated: testabilityAssessments
          .filter((a) => a.verdict !== "testable")
          .map((a) => ({ requirementId: a.requirementId, verdict: a.verdict, score: a.score, blockedBy: a.blockedBy })),
      }
    : null;

  const scorecard = {
    generatedAt: new Date().toISOString(),
    model,
    n: config.runN,
    requirements: { total: requirements.length, covered: coveredIds.size },
    tests: { generated, passed, failed, quarantinedFlaky, errored },
    falsePositiveRate,
    traceability: { orphanTestIds },
    errors: erroredRecords.map((r) => ({ requirementId: r.requirementId, message: r.error })),
    defects: [],
    catchRate: null,
    cost,
    testability,
  };

  mkdirSync(reportsDir, { recursive: true });
  mkdirSync(join(reportsDir, "defects"), { recursive: true });

  for (const record of records.filter((r) => r.status === "defect")) {
    const path = join(reportsDir, "defects", `${record.tc.id}.md`);
    writeFileSync(path, renderDefectReport(record));
  }

  // Rebuild clarifications/ from scratch only when this run gated something, so
  // it reflects THIS run with no stale files. A run that gated nothing (e.g. the
  // gate is off) leaves any existing clarifications/ untouched.
  if (gatedRecords.length > 0) {
    rmSync(join(reportsDir, "clarifications"), { recursive: true, force: true });
    mkdirSync(join(reportsDir, "clarifications"), { recursive: true });
  }
  for (const record of gatedRecords) {
    const path = join(reportsDir, "clarifications", `${record.requirementId}.md`);
    writeFileSync(path, renderClarificationReport(record.assessment));
  }

  writeFileSync(join(reportsDir, "scorecard.json"), JSON.stringify(scorecard, null, 2));
  writeFileSync(join(reportsDir, "report.md"), renderReportMarkdown(scorecard, testRecords, gatedRecords));

  return scorecard;
}

function renderDefectReport(record) {
  const { tc, verdict } = record;
  const lines = [
    `# Defect report: ${tc.id}`,
    "",
    `**Requirement:** ${tc.requirementId}`,
    `**Test case:** ${tc.title}`,
    `**Confidence:** ${verdict.confidence}`,
    "",
    "## Rationale",
    verdict.rationale,
    "",
  ];
  if (verdict.repro?.length) {
    lines.push("## Repro steps", ...verdict.repro.map((s) => `1. ${s}`), "");
  }
  return lines.join("\n");
}

function usd(n) {
  return `$${Number(n).toFixed(4)}`;
}

function renderCostSection(cost) {
  if (!cost) {
    return ["## Cost", "Not tracked for this run (no instrumented LLM client).", ""];
  }
  const lines = [
    "## Cost",
    `Total: ${usd(cost.totalUsd)} over ${cost.calls} LLM call(s) ` +
      `(${cost.promptTokens.toLocaleString()} input + ${cost.completionTokens.toLocaleString()} output tokens)`,
    `Rates: $${cost.pricing.inputUsdPerMTok}/M input, $${cost.pricing.outputUsdPerMTok}/M output ` +
      `→ input ${usd(cost.inputUsd)}, output ${usd(cost.outputUsd)}`,
  ];
  const phases = Object.entries(cost.byPhase ?? {});
  if (phases.length) {
    lines.push("", "| Phase | Calls | Input tok | Output tok | Cost |", "|---|---|---|---|---|");
    for (const [phase, p] of phases) {
      lines.push(
        `| ${phase} | ${p.calls} | ${p.promptTokens.toLocaleString()} | ${p.completionTokens.toLocaleString()} | ${usd(p.totalUsd)} |`
      );
    }
  }
  lines.push("");
  return lines;
}

function renderReportMarkdown(scorecard, records, gatedRecords = []) {
  const lines = [
    "# Stage 6 Workflow Report",
    "",
    `Generated: ${scorecard.generatedAt}`,
    `Model: ${scorecard.model}`,
    `N (runs per test): ${scorecard.n}`,
    "",
    "## Coverage",
    `Requirements: ${scorecard.requirements.covered}/${scorecard.requirements.total} covered`,
    `Tests: ${scorecard.tests.generated} generated, ${scorecard.tests.passed} passed, ` +
      `${scorecard.tests.failed} failed (real defects), ${scorecard.tests.quarantinedFlaky} quarantined (flaky)` +
      (scorecard.tests.errored ? `, ${scorecard.tests.errored} requirement(s) errored (see Errors below)` : ""),
    `False-positive rate: ${(scorecard.falsePositiveRate * 100).toFixed(1)}%`,
    "",
    ...renderCostSection(scorecard.cost),
    "## Traceability",
    scorecard.traceability.orphanTestIds.length
      ? `Orphan test ids (no valid requirementId): ${scorecard.traceability.orphanTestIds.join(", ")}`
      : "No orphan tests — every generated test references a valid requirement id.",
    "",
    "## Test outcomes",
    "",
    "| Test id | Requirement id | Status |",
    "|---|---|---|",
    ...records.map((r) => `| ${r.tc.id} | ${r.tc.requirementId} | ${r.status} |`),
    "",
  ];

  const defectRecords = records.filter((r) => r.status === "defect");
  if (defectRecords.length) {
    lines.push("## Defects found", "");
    for (const r of defectRecords) {
      lines.push(`- ${r.tc.id} (${r.tc.requirementId}) — see defects/${r.tc.id}.md`);
    }
    lines.push("");
  }

  const quarantined = records.filter((r) => r.status === "quarantined");
  if (quarantined.length) {
    lines.push("## Quarantine list (flaky/bad tests, excluded from scoring)", "");
    for (const r of quarantined) {
      lines.push(`- ${r.tc.id} (${r.tc.requirementId})`);
    }
    lines.push("");
  }

  if (scorecard.testability) {
    const { counts } = scorecard.testability;
    lines.push(
      "## Testability gate",
      "",
      `${counts.testable} testable / ${counts.needs_clarification} needs-clarification / ${counts.untestable} untestable`,
      ""
    );
  }

  if (gatedRecords.length) {
    lines.push("## Requirements returned for clarification (not generated — see testability-gate.md)", "");
    for (const r of gatedRecords) {
      lines.push(`- ${r.requirementId} (${r.assessment.verdict}, score ${r.assessment.score.toFixed(2)}) — see clarifications/${r.requirementId}.md`);
    }
    lines.push("");
  }

  if (scorecard.errors.length) {
    lines.push("## Errors (requirement could not be processed at all — not counted as a generated test)", "");
    for (const e of scorecard.errors) {
      lines.push(`- ${e.requirementId}: ${e.message}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
