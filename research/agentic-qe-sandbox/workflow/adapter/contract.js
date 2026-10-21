/**
 * The Stage-6 adapter contract. Core talks ONLY to this interface — never to
 * an app directly, never branching on `adapter.name`. An adapter wraps the
 * existing stage-5 AppAdapter (run/seed/auth/teardown) and adds the two
 * Stage-6-specific members below.
 *
 * @typedef {Object} AuthContext
 * @property {Record<string,string>} [headers]
 * @property {Record<string,string>} [cookies]
 *
 * @typedef {Object} RunResultRequest
 * @property {string} name
 * @property {number} status
 * @property {boolean} ok
 * @property {string[]} failures
 *
 * @typedef {Object} RunResult
 * @property {boolean} pass
 * @property {RunResultRequest[]} requests
 * @property {string} output
 *
 * @typedef {Object} FaultInjectorHandle
 * @property {() => Promise<void>} apply
 * @property {() => Promise<void>} revert
 *
 * @typedef {Object} Adapter
 * @property {string} name - opaque label, never branched on
 * @property {() => Promise<import('../../core/adapter/types.js').RawRequirementItem[]>} requirementsSource
 *   already-normalized unified requirements, in the Requirement shape (see schemas/requirement.schema.json)
 * @property {() => Promise<{ ready: () => Promise<boolean> }>} run - boot/ensure app reachable
 * @property {() => Promise<void>} seed - reset to known seeded state
 * @property {() => Promise<void>} reset - alias/explicit clean state (used between runs)
 * @property {(actor: string) => Promise<AuthContext>} auth - resolve abstract actor -> concrete auth
 * @property {(testCase: object) => Promise<RunResult>} testRunner - execute a structured TestCase
 * @property {(defectId: string) => FaultInjectorHandle} faultInjector
 * @property {() => Promise<void>} teardown
 */

const REQUIRED_MEMBERS = [
  "name",
  "requirementsSource",
  "run",
  "seed",
  "reset",
  "auth",
  "testRunner",
  "faultInjector",
  "teardown",
];

/**
 * Runtime shape check: does this object satisfy the Adapter contract? This is
 * the only place workflow code is allowed to reason about "what an adapter
 * is" — shape only, never app-specific behavior.
 * @param {Partial<import('./contract.js').Adapter>} adapter
 */
export function assertAdapter(adapter) {
  const missing = REQUIRED_MEMBERS.filter((key) => typeof adapter?.[key] === "undefined");
  if (missing.length > 0) {
    throw new Error(
      `Adapter is missing required member(s): ${missing.join(", ")}. ` +
        `An Adapter must implement: ${REQUIRED_MEMBERS.join(", ")}.`
    );
  }
}
