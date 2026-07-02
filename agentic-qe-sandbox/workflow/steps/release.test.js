import { test } from "node:test";
import assert from "node:assert/strict";
import { validateRelease } from "./release.js";

test("validateRelease maps PASS/FAIL+real_defect/FLAKY to pass/regression/quarantined", async () => {
  const suite = [
    { id: "t1", requirementId: "R-1" }, // PASS
    { id: "t2", requirementId: "R-2" }, // FAIL -> real_defect -> regression
    { id: "t3", requirementId: "R-3" }, // FLAKY -> quarantined
    { id: "t4", requirementId: "R-4" }, // FAIL -> environment -> inconclusive
  ];
  const decisions = { t1: "PASS", t2: "FAIL", t3: "FLAKY", t4: "FAIL" };
  const verdicts = { t2: { class: "real_defect" }, t4: { class: "environment" } };

  const effects = {
    runHarness: async (tc) => ({ decision: decisions[tc.id], runs: [{ pass: decisions[tc.id] === "PASS" }] }),
    triage: async ({ testCase }) => verdicts[testCase.id],
  };

  const { results, regressions, summary } = await validateRelease({
    suite,
    requirementsById: new Map(suite.map((t) => [t.requirementId, { id: t.requirementId }])),
    effects,
  });

  const status = Object.fromEntries(results.map((r) => [r.id, r.status]));
  assert.equal(status.t1, "pass");
  assert.equal(status.t2, "regression");
  assert.equal(status.t3, "quarantined");
  assert.equal(status.t4, "environment");
  assert.deepEqual(regressions.map((r) => r.id), ["t2"]);
  assert.deepEqual(summary, { total: 4, pass: 1, regressions: 1, quarantined: 1, inconclusive: 1 });
});

test("validateRelease reports zero regressions on a clean build (all PASS)", async () => {
  const suite = [{ id: "t1", requirementId: "R-1" }, { id: "t2", requirementId: "R-1" }];
  const effects = {
    runHarness: async () => ({ decision: "PASS", runs: [{ pass: true }] }),
    triage: async () => { throw new Error("triage should not be called when everything passes"); },
  };
  const { regressions, summary } = await validateRelease({
    suite, requirementsById: new Map([["R-1", { id: "R-1" }]]), effects,
  });
  assert.equal(regressions.length, 0);
  assert.equal(summary.pass, 2);
});
