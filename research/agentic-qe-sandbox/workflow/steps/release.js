/**
 * VALIDATE A RELEASE (orchestration; app-agnostic). Replays an existing,
 * persisted suite against whatever app the injected runHarness talks to and
 * classifies each failure. No generation happens here — the only LLM cost is a
 * triage call per FAILing test. A FAIL triaged as `real_defect` is a regression.
 *
 * Effects are injected (runHarness / triage) so this is unit-testable with no
 * app container and no LLM.
 */

/**
 * @param {{ suite: object[], requirementsById: Map<string, object>,
 *           effects: { runHarness: (tc:object)=>Promise<{decision:"PASS"|"FAIL"|"FLAKY",runs:object[]}>,
 *                      triage: (o:{testCase:object,runs:object[],requirement:object})=>Promise<{class:string}>} }} opts
 * @returns {Promise<{ results: object[], regressions: object[], summary: object }>}
 */
export async function validateRelease({ suite, requirementsById, effects }) {
  const results = [];

  for (const testCase of suite) {
    const { decision, runs } = await effects.runHarness(testCase);
    const base = { id: testCase.id, requirementId: testCase.requirementId };

    if (decision === "PASS") {
      results.push({ ...base, status: "pass" });
      continue;
    }
    if (decision === "FLAKY") {
      results.push({ ...base, status: "quarantined" });
      continue;
    }
    // decision === "FAIL" -> ask triage whether it's a genuine regression
    const requirement = requirementsById.get(testCase.requirementId);
    const verdict = await effects.triage({ testCase, runs, requirement });
    const status =
      verdict.class === "real_defect" ? "regression"
      : verdict.class === "environment" ? "environment"
      : "flaky_or_bad_test";
    results.push({ ...base, status, verdict });
  }

  const regressions = results.filter((r) => r.status === "regression");
  const summary = {
    total: results.length,
    pass: results.filter((r) => r.status === "pass").length,
    regressions: regressions.length,
    quarantined: results.filter((r) => r.status === "quarantined").length,
    inconclusive: results.filter((r) => r.status === "environment" || r.status === "flaky_or_bad_test").length,
  };
  return { results, regressions, summary };
}
