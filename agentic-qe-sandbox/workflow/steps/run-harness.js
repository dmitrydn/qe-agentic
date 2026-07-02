/**
 * RUN (deterministic) — the flake guard. Executes a TestCase N times via the
 * adapter's testRunner, calling reset() before EVERY run so no state leaks
 * across runs. Decision rule: all-pass -> PASS; all-fail -> FAIL (real
 * signal, send to triage); mixed -> FLAKY (quarantine, never scored).
 */

/**
 * A malformed TestCase (e.g. a pathTemplate referencing a {{capture}} that
 * was never produced by an earlier request) can make testRunner() throw
 * instead of returning a RunResult — that is itself evidence the test is
 * broken, not a reason to crash the whole orchestrator run for every other
 * requirement still queued behind this one. Convert a thrown error into an
 * ordinary failed RunResult so it flows through the normal decision rule
 * (-> FAIL -> triage, which can correctly call it flaky_or_bad_test) instead
 * of propagating.
 */
async function runOnce(testCase, adapter) {
  try {
    return await adapter.testRunner(testCase);
  } catch (err) {
    return { pass: false, requests: [], output: `testRunner threw: ${err.message}` };
  }
}

/**
 * @param {{ testCase: object, adapter: import('../adapter/contract.js').Adapter, n: number }} opts
 * @returns {Promise<{ decision: "PASS"|"FAIL"|"FLAKY", runs: object[] }>}
 */
export async function runHarness({ testCase, adapter, n }) {
  const runs = [];
  for (let i = 0; i < n; i++) {
    await adapter.reset();
    const result = await runOnce(testCase, adapter);
    runs.push(result);
  }

  const passes = runs.filter((r) => r.pass).length;
  let decision;
  if (passes === n) decision = "PASS";
  else if (passes === 0) decision = "FAIL";
  else decision = "FLAKY";

  return { decision, runs };
}
