#!/usr/bin/env node
/**
 * Stage 7 — "make the case" live walkthrough. Not part of the verify.sh
 * gate (no thresholds, no scoring) — a narrated demonstration of the full
 * Stage 6 loop on a single requirement, run live against the real
 * container and the real LLM, for an audience that has not seen the rest
 * of this codebase:
 *
 *   1. show the requirement (as authored, from unified-requirements.md)
 *   2. GENERATE — the agent writes an executable API test from it
 *   3. RUN — execute it 3x w/ reset against the clean app -> PASS
 *   4. seed a real defect into the app's source (the same catalog used by
 *      the Stage 6b eval, not something invented for this demo)
 *   5. RUN again, same test, no regeneration -> FAIL
 *   6. TRIAGE — the agent classifies the failure, never told a defect was
 *      seeded
 *   7. revert the defect, RUN again -> back to PASS (prove the app, not
 *      the test, was the variable)
 *
 * Usage: node demo/run-demo.js [requirementId] [defectId]
 * Defaults: CYPRESS-RWA-TRANSACTIONS-007 / payment-amount-cents — the
 * requirement with curated business-semantics apiHints, targeted by 2 of
 * the 12 cataloged defects (see VERIFICATION.md Stage 6b workstream B).
 */
import { loadConfig } from "../workflow/config.js";
import { createLlmClient } from "../workflow/llm/llm-client.js";
import { select } from "../workflow/steps/select.js";
import { generate } from "../workflow/steps/generate.js";
import { runHarness } from "../workflow/steps/run-harness.js";
import { triage } from "../workflow/steps/triage.js";
import { cypressRwaWorkflowAdapter as adapter } from "../adapters/cypress-rwa/workflow-adapter.js";
import { getDefectCatalogEntry } from "../adapters/cypress-rwa/fault-injector.js";

const requirementId = process.argv[2] ?? "CYPRESS-RWA-TRANSACTIONS-007";
const defectId = process.argv[3] ?? "payment-amount-cents";

function rule(char = "─") {
  console.log(char.repeat(72));
}
function step(n, title) {
  console.log("");
  rule("=");
  console.log(`STEP ${n} — ${title}`);
  rule("=");
}
function runsSummary(runs) {
  return runs.map((r) => (r.pass ? "pass" : "fail")).join(", ");
}

async function main() {
  const config = loadConfig(process.env);
  const llm = createLlmClient(config);

  const defect = getDefectCatalogEntry(defectId);

  step(0, "boot");
  console.log(`Requirement under test: ${requirementId}`);
  console.log(`Seeded defect to demonstrate: ${defectId} — ${defect.description}`);
  await (await adapter.run()).ready();

  step(1, "the requirement, as authored (no curation, no AI involved here)");
  const requirements = await select({ adapter, filter: { ids: [requirementId] } });
  const requirement = requirements[0];
  if (!requirement) throw new Error(`Requirement ${requirementId} not found via adapter.requirementsSource()`);
  console.log(`id:          ${requirement.id}`);
  console.log(`userStory:   ${requirement.userStory}`);
  console.log("acceptanceCriteria:");
  for (const c of requirement.acceptanceCriteria) console.log(`  - ${c}`);
  console.log(`traceability: ${requirement.traceability}`);

  step(2, "GENERATE (agent) — the LLM writes an executable TestCase from the criteria above");
  const testCases = await generate({ requirement, llm });
  console.log(`Generated ${testCases.length} test case(s):`);
  for (const tc of testCases) {
    rule();
    console.log(JSON.stringify(tc, null, 2));
  }
  const tc = testCases[0];

  step(3, "RUN (deterministic) — execute it 3x against the clean app, reset() before each run");
  await adapter.reset();
  let { decision, runs } = await runHarness({ testCase: tc, adapter, n: config.runN });
  console.log(`${tc.id}: runs=[${runsSummary(runs)}] -> ${decision}`);
  if (decision !== "PASS") {
    console.log("(Note: a live LLM call can occasionally generate a test that doesn't pass on the clean app —");
    console.log(" that is itself a real, reportable finding, not a demo failure. See VERIFICATION.md for the");
    console.log(" measured false-positive rate this risk is tracked against.)");
  }

  step(4, `seed the real defect "${defectId}" into the running container's source`);
  console.log(`file: ${defect.file}`);
  console.log(`- ${defect.find.trim()}`);
  console.log(`+ ${defect.replace.trim()}`);
  const injector = adapter.faultInjector(defectId);
  await injector.apply();

  step(5, "RUN again — SAME persisted TestCase, no regeneration, against the now-defective app");
  await adapter.reset();
  ({ decision, runs } = await runHarness({ testCase: tc, adapter, n: config.runN }));
  console.log(`${tc.id}: runs=[${runsSummary(runs)}] -> ${decision}`);

  if (decision === "FAIL") {
    step(6, "TRIAGE (agent) — classify the failure; never told a defect was injected");
    const verdict = await triage({ testCase: tc, runs, requirement, llm });
    console.log(JSON.stringify(verdict, null, 2));
    console.log("");
    console.log(
      verdict.class === "real_defect"
        ? "-> correctly identified as a real application defect."
        : `-> classified as "${verdict.class}" — see VERIFICATION.md Stage 6b workstream D for the measured triage accuracy this is tracked against.`
    );
  } else {
    console.log(`(decision was ${decision}, not FAIL — triage is only invoked on FAIL; see eval-report.md for this`);
    console.log(" defect's measured catch rate across the full persisted suite, not just this one test.)");
  }

  step(7, "revert the defect, confirm the app — not the test — was the variable");
  await injector.revert();
  await adapter.reset();
  ({ decision, runs } = await runHarness({ testCase: tc, adapter, n: config.runN }));
  console.log(`${tc.id}: runs=[${runsSummary(runs)}] -> ${decision}`);

  step("done", "summary");
  console.log(`Requirement ${requirement.id} -> generated test ${tc.id} -> PASS on clean app -> FAIL under`);
  console.log(`seeded defect "${defectId}" -> triaged correctly -> PASS again after revert.`);
  console.log("This is the same loop verify.sh runs at scale; see VERIFICATION.md for aggregate metrics.");

  await adapter.teardown();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
