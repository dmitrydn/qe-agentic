import { test } from "node:test";
import assert from "node:assert/strict";
import { runHarness } from "./run-harness.js";

function fakeAdapter(passSequence) {
  let i = 0;
  const resetCalls = [];
  return {
    adapter: {
      reset: async () => resetCalls.push(true),
      testRunner: async () => ({ pass: passSequence[i++], requests: [], output: "" }),
    },
    resetCalls,
  };
}

test("decision rule: all-pass -> PASS", async () => {
  const { adapter, resetCalls } = fakeAdapter([true, true, true]);
  const { decision, runs } = await runHarness({ testCase: {}, adapter, n: 3 });
  assert.equal(decision, "PASS");
  assert.equal(runs.length, 3);
  assert.equal(resetCalls.length, 3); // reset before EVERY run
});

test("decision rule: all-fail -> FAIL", async () => {
  const { adapter } = fakeAdapter([false, false, false]);
  const { decision } = await runHarness({ testCase: {}, adapter, n: 3 });
  assert.equal(decision, "FAIL");
});

test("decision rule: mixed -> FLAKY", async () => {
  const { adapter } = fakeAdapter([true, false, true]);
  const { decision } = await runHarness({ testCase: {}, adapter, n: 3 });
  assert.equal(decision, "FLAKY");
});

test("a testRunner() throw is converted into a failed run, not propagated", async () => {
  const adapter = {
    reset: async () => {},
    testRunner: async () => {
      throw new Error('Missing pathParam "primaryUserId" for template "/users/{{primaryUserId}}"');
    },
  };
  const { decision, runs } = await runHarness({ testCase: {}, adapter, n: 3 });
  assert.equal(decision, "FAIL");
  assert.equal(runs.length, 3);
  for (const run of runs) {
    assert.equal(run.pass, false);
    assert.match(run.output, /testRunner threw: Missing pathParam/);
  }
});

test("reset() is called before every run, in order, n times", async () => {
  const order = [];
  const adapter = {
    reset: async () => order.push("reset"),
    testRunner: async () => {
      order.push("run");
      return { pass: true, requests: [], output: "" };
    },
  };
  await runHarness({ testCase: {}, adapter, n: 2 });
  assert.deepEqual(order, ["reset", "run", "reset", "run"]);
});
