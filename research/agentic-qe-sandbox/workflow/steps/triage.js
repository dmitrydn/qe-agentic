/**
 * TRIAGE (agent). Only called on a FAIL decision (all N runs failed).
 * Classifies the failure as a real defect, a bad/flaky test, or an
 * environment issue. The prompt is never told whether a fault was injected.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render } from "../prompts/render.js";
import triageSchema from "../schemas/triage.schema.json" with { type: "json" };

const __dirname_ = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname_, "..", "prompts");

const SYSTEM_TEMPLATE = readFileSync(join(PROMPTS_DIR, "triage.system.md"), "utf8");
const USER_TEMPLATE = readFileSync(join(PROMPTS_DIR, "triage.user.md"), "utf8");

// triage() is only called on a FAIL decision, which by definition means
// every one of the N runs (each preceded by a fresh reset) failed — so
// their evidence is usually byte-for-byte identical. Sending all N full
// copies (each with its own up-to-2000-char response-body snippets per
// request) multiplies prompt size for no informational gain. Only the
// genuinely distinct runs are kept; the LLM is told how many were
// deduplicated so "ran N times, all identical" stays visible.
function dedupeRuns(runs) {
  const seen = [];
  for (const run of runs) {
    const json = JSON.stringify(run);
    if (!seen.some((s) => s.json === json)) seen.push({ json, run });
  }
  return seen.map((s) => s.run);
}

/**
 * @param {{ testCase: object, runs: object[], requirement: object, llm: { complete: Function } }} opts
 * @returns {Promise<object>}
 */
export async function triage({ testCase, runs, requirement, llm }) {
  const distinctRuns = dedupeRuns(runs);
  const dedupeNote =
    distinctRuns.length < runs.length
      ? `All ${runs.length} runs (each after a fresh reset) produced identical output; ${distinctRuns.length} distinct run shown below, repetition omitted.`
      : "";

  const system = render(SYSTEM_TEMPLATE, {});
  const user = render(USER_TEMPLATE, {
    requirement,
    runs,
    dedupeNote,
    testCaseJson: JSON.stringify(testCase, null, 2),
    runsJson: JSON.stringify(distinctRuns, null, 2),
    schemaJson: JSON.stringify(triageSchema),
  });

  const verdict = await llm.complete({
    system,
    user,
    schema: triageSchema,
    schemaName: "TriageVerdict",
    phase: "triage",
  });

  if (verdict.requirementId !== requirement.id) {
    verdict.requirementId = requirement.id;
  }
  return verdict;
}
