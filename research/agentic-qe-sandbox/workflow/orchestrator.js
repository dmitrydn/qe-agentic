/**
 * The Stage-6 loop: SELECT -> GENERATE -> RUN (N + reset) -> TRIAGE -> REPORT.
 * App-agnostic — moves typed data between steps and the adapter; names no
 * app and no framework.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { assertAdapter } from "./adapter/contract.js";
import { select } from "./steps/select.js";
import { assess } from "./steps/assess.js";
import { generate } from "./steps/generate.js";
import { runHarness } from "./steps/run-harness.js";
import { triage } from "./steps/triage.js";
import { report } from "./steps/report.js";

/**
 * @param {{ adapter: object, llm: { complete: Function }, config: object,
 *           filter?: object, generatedTestsDir: string, reportsDir: string }} opts
 */
export async function run({ adapter, llm, config, filter, generatedTestsDir, reportsDir }) {
  assertAdapter(adapter);
  await (await adapter.run()).ready();

  const requirements = await select({ adapter, filter });
  const records = [];
  // Per-requirement testability verdicts (testability-gate.md §7), only
  // populated when the gate is on — kept separate from `records` (which is
  // per-TEST-CASE) so a requirement that produces N test cases doesn't get
  // its testability verdict counted N times in the report.
  const testabilityAssessments = [];
  const testabilityGateOn = config.testabilityGate === "on";

  mkdirSync(generatedTestsDir, { recursive: true });

  for (const req of requirements) {
    // One requirement's worth of work (generate/run/triage/regenerate) must
    // not be able to take the rest of the batch down with it — a transient
    // LLM error, an exhausted repair-retry budget, or any other unexpected
    // throw here is recorded as "errored" for THIS requirement only, and
    // the loop moves on. Without this, a single bad requirement among many
    // (e.g. an `--all` sweep across 44) loses every result after it too.
    try {
      if (testabilityGateOn) {
        const assessment = await assess({ requirement: req, llm, config });
        testabilityAssessments.push(assessment);
        if (assessment.verdict !== "testable") {
          console.log(`[testability] ${req.id}: ${assessment.verdict} (score ${assessment.score.toFixed(2)}) — returned for clarification, not generated`);
          records.push({ status: "needs_clarification", requirementId: req.id, assessment });
          continue; // input-quality gate (testability-gate.md) — do NOT generate
        }
      }

      let testCases = await generate({ requirement: req, llm });

      for (let tc of testCases) {
        let attempt = 0;
        let outcome;

        while (true) {
          const { decision, runs } = await runHarness({ testCase: tc, adapter, n: config.runN });
          console.log(
            `[run] ${tc.id} (${req.id}) n=${config.runN} runs=[${runs.map((r) => (r.pass ? "pass" : "fail")).join(",")}] -> ${decision}`
          );

          if (decision === "PASS") {
            outcome = { tc, status: "pass" };
            break;
          }

          if (decision === "FAIL") {
            const verdict = await triage({ testCase: tc, runs, requirement: req, llm });
            if (verdict.class === "real_defect") {
              outcome = { tc, status: "defect", verdict };
              break;
            }
            // flaky_or_bad_test / environment -> bounded regeneration below
          }

          if (attempt++ >= config.maxRegenRetries) {
            outcome = { tc, status: "quarantined" };
            break;
          }
          const regenerated = await generate({ requirement: req, llm });
          tc = regenerated[0] ?? tc;
        }

        records.push(outcome);
        persistTestCase(outcome.tc, generatedTestsDir);
      }
    } catch (err) {
      console.error(`[error] requirement ${req.id} could not be processed, skipping: ${err.message}`);
      records.push({ status: "errored", requirementId: req.id, error: err.message });
    }
  }

  const quarantined = records.filter((r) => r.status === "quarantined").map((r) => r.tc.id);
  console.log(`[quarantine] ${quarantined.length} test(s) excluded from scoring: ${quarantined.join(", ") || "(none)"}`);

  // Token usage accumulated by the client across every generate/triage call
  // this run (including repair retries). Optional-chained so a stub LLM in
  // tests without getUsage() still works — report() degrades to a null cost.
  const usage = llm.getUsage?.();
  const scorecard = report({ records, requirements, config, model: config.llmModel, usage, reportsDir, testabilityAssessments });
  if (scorecard.cost) {
    console.log(
      `[cost] $${scorecard.cost.totalUsd.toFixed(4)} over ${scorecard.cost.calls} LLM call(s) ` +
        `(${scorecard.cost.promptTokens} in + ${scorecard.cost.completionTokens} out tok)`
    );
  }
  return scorecard;
}

function persistTestCase(testCase, generatedTestsDir) {
  writeFileSync(join(generatedTestsDir, `${testCase.id}.json`), JSON.stringify(testCase, null, 2));
}
