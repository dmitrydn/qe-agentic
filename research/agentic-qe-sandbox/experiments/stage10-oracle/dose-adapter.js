/**
 * Stage 10 — dose adapter. Same live cypress-rwa runtime, one requirement
 * source swapped in (rich | sparse). This is the seam the whole experiment
 * turns on: app, runtime, loop, defect catalog, and grounding all held
 * constant; only requirementsSource() differs between the two doses.
 */
import { cypressRwaWorkflowAdapter } from "../../adapters/cypress-rwa/workflow-adapter.js";
import { loadDoseRequirements, DOSES } from "./dose-requirements.js";

/**
 * @param {"rich"|"sparse"} dose
 * @returns {typeof cypressRwaWorkflowAdapter}
 */
export function makeDoseAdapter(dose) {
  if (!DOSES.includes(dose)) {
    throw new Error(`unknown dose "${dose}" (expected one of ${DOSES.join(", ")})`);
  }
  return {
    ...cypressRwaWorkflowAdapter,
    name: `cypress-rwa-${dose}`,
    requirementsSource: () => loadDoseRequirements(dose),
  };
}
