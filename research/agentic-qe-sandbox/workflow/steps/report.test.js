import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { report, renderClarificationReport } from "./report.js";

const REQUIREMENTS = [
  { id: "R-1", title: "t1", acceptanceCriteria: ["a"], source: { file: "f.ts" } },
  { id: "R-2", title: "t2", acceptanceCriteria: ["a"], source: { file: "f.ts" } },
];

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), "report-test-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test("report computes coverage, falsePositiveRate, and writes scorecard.json + report.md", () => {
  withTempDir((reportsDir) => {
    const records = [
      { tc: { id: "T1", requirementId: "R-1" }, status: "pass" },
      {
        tc: { id: "T2", requirementId: "R-2" },
        status: "defect",
        verdict: { confidence: "high", rationale: "broken", repro: ["step 1"] },
      },
      { tc: { id: "T3", requirementId: "R-1" }, status: "quarantined" },
    ];

    const scorecard = report({
      records,
      requirements: REQUIREMENTS,
      config: { runN: 3 },
      model: "test-model",
      reportsDir,
    });

    assert.equal(scorecard.requirements.total, 2);
    assert.equal(scorecard.requirements.covered, 1); // only R-1 has a passing test
    assert.equal(scorecard.tests.generated, 3);
    assert.equal(scorecard.tests.passed, 1);
    assert.equal(scorecard.tests.failed, 1);
    assert.equal(scorecard.tests.quarantinedFlaky, 1);
    assert.equal(scorecard.falsePositiveRate, 1 / 3);
    assert.deepEqual(scorecard.traceability.orphanTestIds, []);
    assert.equal(scorecard.catchRate, null);
    assert.deepEqual(scorecard.defects, []);

    assert.ok(existsSync(join(reportsDir, "scorecard.json")));
    assert.ok(existsSync(join(reportsDir, "report.md")));
    assert.ok(existsSync(join(reportsDir, "defects", "T2.md")));

    const persisted = JSON.parse(readFileSync(join(reportsDir, "scorecard.json"), "utf8"));
    assert.equal(persisted.tests.generated, 3);

    const defectMd = readFileSync(join(reportsDir, "defects", "T2.md"), "utf8");
    assert.match(defectMd, /broken/);
    assert.match(defectMd, /step 1/);
  });
});

test("report flags orphan test ids (requirementId not in the known set)", () => {
  withTempDir((reportsDir) => {
    const records = [{ tc: { id: "T1", requirementId: "NOT-A-REAL-ID" }, status: "pass" }];
    const scorecard = report({ records, requirements: REQUIREMENTS, config: { runN: 3 }, model: "m", reportsDir });
    assert.deepEqual(scorecard.traceability.orphanTestIds, ["T1"]);
  });
});

test("report counts an 'errored' record (no .tc) separately and doesn't crash on it", () => {
  withTempDir((reportsDir) => {
    const records = [
      { tc: { id: "T1", requirementId: "R-1" }, status: "pass" },
      { status: "errored", requirementId: "R-2", error: "LLM exhausted repair retries" },
    ];

    const scorecard = report({ records, requirements: REQUIREMENTS, config: { runN: 3 }, model: "m", reportsDir });

    // The errored requirement contributed zero generated tests and isn't
    // "covered", but is recorded by id+message for visibility.
    assert.equal(scorecard.tests.generated, 1);
    assert.equal(scorecard.tests.errored, 1);
    assert.equal(scorecard.requirements.covered, 1);
    assert.deepEqual(scorecard.errors, [{ requirementId: "R-2", message: "LLM exhausted repair retries" }]);

    const reportMd = readFileSync(join(reportsDir, "report.md"), "utf8");
    assert.match(reportMd, /R-2: LLM exhausted repair retries/);
  });
});

test("report on an all-pass clean run yields falsePositiveRate 0", () => {
  withTempDir((reportsDir) => {
    const records = [
      { tc: { id: "T1", requirementId: "R-1" }, status: "pass" },
      { tc: { id: "T2", requirementId: "R-2" }, status: "pass" },
    ];
    const scorecard = report({ records, requirements: REQUIREMENTS, config: { runN: 3 }, model: "m", reportsDir });
    assert.equal(scorecard.falsePositiveRate, 0);
    assert.equal(scorecard.requirements.covered, 2);
  });
});

function assessment(overrides = {}) {
  return {
    requirementId: "R-2",
    dimensions: [{ id: "D4", rating: "fail", finding: "no documented endpoint" }],
    clarifications: ["What endpoint backs this?"],
    assumptions: [],
    score: 0.5,
    verdict: "untestable",
    blockedBy: ["D4"],
    ...overrides,
  };
}

test("report: a gated ('needs_clarification' status) record is excluded from generated/coverage/orphan stats", () => {
  withTempDir((reportsDir) => {
    const records = [
      { tc: { id: "T1", requirementId: "R-1" }, status: "pass" },
      { status: "needs_clarification", requirementId: "R-2", assessment: assessment() },
    ];
    const scorecard = report({
      records,
      requirements: REQUIREMENTS,
      config: { runN: 3 },
      model: "m",
      reportsDir,
      testabilityAssessments: [
        { requirementId: "R-1", verdict: "testable", score: 1, blockedBy: [] },
        assessment(),
      ],
    });

    assert.equal(scorecard.tests.generated, 1); // R-2 contributes no test
    assert.equal(scorecard.requirements.covered, 1);
    assert.deepEqual(scorecard.traceability.orphanTestIds, []);
    assert.deepEqual(scorecard.testability.counts, { testable: 1, needs_clarification: 0, untestable: 1 });
    assert.deepEqual(scorecard.testability.gated, [{ requirementId: "R-2", verdict: "untestable", score: 0.5, blockedBy: ["D4"] }]);

    assert.ok(existsSync(join(reportsDir, "clarifications", "R-2.md")));
    const md = readFileSync(join(reportsDir, "clarifications", "R-2.md"), "utf8");
    assert.match(md, /What endpoint backs this\?/);

    const reportMd = readFileSync(join(reportsDir, "report.md"), "utf8");
    assert.match(reportMd, /Requirements returned for clarification/);
    assert.match(reportMd, /R-2 \(untestable, score 0\.50\)/);
  });
});

test("report: testability is null when no testabilityAssessments are supplied (gate off / pre-gate callers)", () => {
  withTempDir((reportsDir) => {
    const records = [{ tc: { id: "T1", requirementId: "R-1" }, status: "pass" }];
    const scorecard = report({ records, requirements: REQUIREMENTS, config: { runN: 3 }, model: "m", reportsDir });
    assert.equal(scorecard.testability, null);
    assert.ok(!existsSync(join(reportsDir, "clarifications", "R-2.md")));
  });
});

test("renderClarificationReport: includes verdict, score, blockedBy, dimension findings, and clarifications", () => {
  const md = renderClarificationReport(assessment());
  assert.match(md, /# Clarification needed: R-2/);
  assert.match(md, /\*\*Verdict:\*\* untestable/);
  assert.match(md, /\*\*Score:\*\* 0\.50/);
  assert.match(md, /\*\*Blocked by:\*\* D4/);
  assert.match(md, /\| D4 \| fail \| no documented endpoint \|/);
  assert.match(md, /What endpoint backs this\?/);
});
