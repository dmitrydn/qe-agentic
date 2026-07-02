import { test } from "node:test";
import assert from "node:assert/strict";
import { runTestabilityBattery } from "./run-testability-battery.js";
import { GOOD_CASES, SYNTHETIC_CASES } from "./testability-battery.js";

const ALL_CASES = [...GOOD_CASES, ...SYNTHETIC_CASES];

// Minimal Requirement stand-ins for the two GOOD_CASES requirement ids —
// content doesn't matter here since assessFn is mocked out below; only the
// id lookup (byReqId) inside runTestabilityBattery is exercised.
const REQUIREMENTS = GOOD_CASES.map((c) => ({
  id: c.requirementId,
  title: "stub",
  acceptanceCriteria: ["Given x", "Then y"],
  source: { file: "stub.ts" },
}));

function assessment(verdict) {
  return { requirementId: "stub", dimensions: [], clarifications: [], assumptions: [], score: verdict === "testable" ? 1 : 0, verdict, blockedBy: [] };
}

// Cases are processed GOOD_CASES then SYNTHETIC_CASES, in order (see
// runTestabilityBattery) — a sequential counter lets a mock assessFn answer
// "which case is this?" without runTestabilityBattery needing to expose it.
function sequencedAssessFn(verdictForCase) {
  let i = 0;
  return async () => {
    const verdict = verdictForCase(ALL_CASES[i]);
    i += 1;
    return assessment(verdict);
  };
}

test("runTestabilityBattery: 100% accuracy when every prediction matches its expected verdict", async () => {
  const assessFn = sequencedAssessFn((c) => c.expectedVerdict);

  const battery = await runTestabilityBattery({
    llm: {},
    config: { testabilityThreshold: 0.7 },
    requirements: REQUIREMENTS,
    assessFn,
  });

  assert.equal(battery.accuracy, 1);
  assert.equal(battery.correct, battery.total);
  assert.equal(battery.misclassified.length, 0);
  assert.equal(battery.total, ALL_CASES.length);
});

test("runTestabilityBattery: a wrong prediction on one case is the only misclassification and lowers accuracy", async () => {
  const wrongVerdict = { testable: "untestable", needs_clarification: "testable", untestable: "needs_clarification" };
  const assessFn = sequencedAssessFn((c) => (c.id === ALL_CASES[0].id ? wrongVerdict[c.expectedVerdict] : c.expectedVerdict));

  const battery = await runTestabilityBattery({
    llm: {},
    config: { testabilityThreshold: 0.7 },
    requirements: REQUIREMENTS,
    assessFn,
  });

  assert.equal(battery.misclassified.length, 1);
  assert.equal(battery.misclassified[0].id, ALL_CASES[0].id);
  assert.equal(battery.correct, battery.total - 1);
  assert.ok(battery.accuracy < 1);
});

test("runTestabilityBattery: the confusion matrix tallies expected x predicted correctly", async () => {
  const assessFn = async () => assessment("untestable");

  const battery = await runTestabilityBattery({
    llm: {},
    config: { testabilityThreshold: 0.7 },
    requirements: REQUIREMENTS,
    assessFn,
  });

  // Every case predicted "untestable" regardless of its own expectedVerdict.
  const totalPredictedUntestable = Object.values(battery.matrix).reduce((sum, row) => sum + row.untestable, 0);
  assert.equal(totalPredictedUntestable, battery.total);
  const totalPredictedOther = Object.values(battery.matrix).reduce((sum, row) => sum + row.testable + row.needs_clarification, 0);
  assert.equal(totalPredictedOther, 0);
});

test("runTestabilityBattery: throws a clear error when a GOOD_CASES requirement id is missing from the supplied requirements", async () => {
  await assert.rejects(
    () =>
      runTestabilityBattery({
        llm: {},
        config: { testabilityThreshold: 0.7 },
        requirements: [], // none of the GOOD_CASES ids are present
        assessFn: async () => assessment("testable"),
      }),
    /references unknown requirement id/
  );
});

test("runTestabilityBattery: fails fast on a missing requirement id, before ever calling assessFn", async () => {
  let calls = 0;
  await assert.rejects(() =>
    runTestabilityBattery({
      llm: {},
      config: { testabilityThreshold: 0.7 },
      requirements: [],
      assessFn: async () => {
        calls += 1;
        return assessment("testable");
      },
    })
  );
  assert.equal(calls, 0);
});
