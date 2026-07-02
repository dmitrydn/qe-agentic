import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "./orchestrator.js";
import { DIMENSION_IDS } from "./steps/testability.js";

function withTempDirs(fn) {
  const generatedTestsDir = mkdtempSync(join(tmpdir(), "orch-tests-"));
  const reportsDir = mkdtempSync(join(tmpdir(), "orch-reports-"));
  try {
    return fn({ generatedTestsDir, reportsDir });
  } finally {
    rmSync(generatedTestsDir, { recursive: true, force: true });
    rmSync(reportsDir, { recursive: true, force: true });
  }
}

function fakeAdapter(requirements) {
  return {
    name: "fake",
    requirementsSource: async () => requirements,
    run: async () => ({ ready: async () => true }),
    seed: async () => {},
    reset: async () => {},
    auth: async () => ({}),
    testRunner: async () => ({ pass: true, requests: [], output: "" }),
    faultInjector: () => ({ apply: async () => {}, revert: async () => {} }),
    teardown: async () => {},
  };
}

function testCaseFor(requirementId) {
  return [{ id: `${requirementId}-TC1`, requirementId, title: "case", kind: "positive", actor: "primaryUser", requests: [] }];
}

const PASS_DIMENSIONS = DIMENSION_IDS.map((id) => ({ id, rating: "pass", finding: "ok" }));
// D4 (interface grounding) failing: a blocking dimension, so verdictOf forces
// "untestable" regardless of the rest of the rubric.
const D4_FAIL_DIMENSIONS = DIMENSION_IDS.map((id) => ({ id, rating: id === "D4" ? "fail" : "pass", finding: id === "D4" ? "no documented endpoint" : "ok" }));

const CONFIG = { runN: 1, maxRegenRetries: 1, llmModel: "test-model", testabilityThreshold: 0.7, testabilityWeights: {} };

// R-1 has everything assess() needs to call it testable. R-2's acceptance
// criteria are non-empty (so it clears select()'s schema validation, which
// requires at least one) but it has no documented endpoint — the mocked LLM
// below rates its D4 dimension "fail", which is a blocking dimension.
const REQUIREMENTS = [
  { id: "R-1", title: "t1", acceptanceCriteria: ["Given x", "Then y"], source: { file: "f.ts" }, apiHints: [{ method: "GET", path: "/things" }] },
  { id: "R-2", title: "t2 (no documented endpoint)", acceptanceCriteria: ["Given x", "Then y"], source: { file: "f.ts" } },
];

function fakeLlm() {
  return {
    complete: async ({ schemaName, user }) => {
      const id = user.match(/Requirement id: (\S+)/)[1];
      if (schemaName === "Testability") {
        const dimensions = id === "R-2" ? D4_FAIL_DIMENSIONS : PASS_DIMENSIONS;
        const clarifications = id === "R-2" ? ["What endpoint backs this requirement?"] : [];
        return { requirementId: id, dimensions, clarifications, assumptions: [] };
      }
      if (schemaName === "TestCase[]") {
        return testCaseFor(id);
      }
      throw new Error(`fakeLlm: unexpected schemaName "${schemaName}"`);
    },
  };
}

test("orchestrator: with the gate off (default), every requirement is generated as before", async () => {
  await withTempDirs(async ({ generatedTestsDir, reportsDir }) => {
    const adapter = fakeAdapter(REQUIREMENTS);
    const llm = fakeLlm();
    const scorecard = await run({ adapter, llm, config: { ...CONFIG, testabilityGate: "off" }, generatedTestsDir, reportsDir });

    assert.equal(scorecard.tests.generated, 2);
    assert.equal(scorecard.requirements.covered, 2);
    assert.equal(scorecard.testability, null);
    assert.ok(existsSync(join(generatedTestsDir, "R-2-TC1.json")));
  });
});

test("orchestrator: omitting testabilityGate entirely behaves the same as 'off' (safe default)", async () => {
  await withTempDirs(async ({ generatedTestsDir, reportsDir }) => {
    const adapter = fakeAdapter(REQUIREMENTS);
    const llm = fakeLlm();
    const { testabilityGate, ...configWithoutGate } = CONFIG;
    const scorecard = await run({ adapter, llm, config: configWithoutGate, generatedTestsDir, reportsDir });

    assert.equal(scorecard.tests.generated, 2);
    assert.equal(scorecard.testability, null);
  });
});

test("orchestrator: with the gate on, a non-testable requirement is NOT generated and is returned for clarification", async () => {
  await withTempDirs(async ({ generatedTestsDir, reportsDir }) => {
    const adapter = fakeAdapter(REQUIREMENTS);
    const llm = fakeLlm();
    const scorecard = await run({ adapter, llm, config: { ...CONFIG, testabilityGate: "on" }, generatedTestsDir, reportsDir });

    // R-1 (testable) went through the normal pipeline; R-2 (blocked on D4) did not.
    assert.equal(scorecard.tests.generated, 1);
    assert.equal(scorecard.requirements.covered, 1);
    assert.deepEqual(scorecard.traceability.orphanTestIds, []);

    assert.deepEqual(scorecard.testability.counts, { testable: 1, needs_clarification: 0, untestable: 1 });
    assert.equal(scorecard.testability.gated.length, 1);
    assert.equal(scorecard.testability.gated[0].requirementId, "R-2");
    assert.equal(scorecard.testability.gated[0].verdict, "untestable");
    assert.deepEqual(scorecard.testability.gated[0].blockedBy, ["D4"]);

    // R-2 never produced a test case file.
    const generatedFiles = readdirSync(generatedTestsDir);
    assert.ok(!generatedFiles.some((f) => f.startsWith("R-2")));

    // A clarification artifact was written for R-2, and the markdown report
    // surfaces it as a section, never as a silent omission.
    assert.ok(existsSync(join(reportsDir, "clarifications", "R-2.md")));
    const clarificationMd = readFileSync(join(reportsDir, "clarifications", "R-2.md"), "utf8");
    assert.match(clarificationMd, /Clarification needed: R-2/);
    assert.match(clarificationMd, /\*\*Verdict:\*\* untestable/);
    assert.match(clarificationMd, /What endpoint backs this requirement\?/);

    const reportMd = readFileSync(join(reportsDir, "report.md"), "utf8");
    assert.match(reportMd, /Requirements returned for clarification/);
    assert.match(reportMd, /R-2 \(untestable/);
    assert.match(reportMd, /## Testability gate/);
    assert.match(reportMd, /1 testable \/ 0 needs-clarification \/ 1 untestable/);
  });
});
