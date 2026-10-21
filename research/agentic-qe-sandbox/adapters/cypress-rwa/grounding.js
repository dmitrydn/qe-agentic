/**
 * Endpoint grounding gate for cypress-rwa (AQE_GROUNDING=1, adapter-local,
 * deterministic, no LLM). Some requirements in requirements/unified-
 * requirements.md assert an endpoint that does not exist in the running
 * app (e.g. `GET /bankTransfer` when the real route is `/bankTransfers`,
 * or `POST /notifications` when that prefix only serves GET and PATCH).
 * Generated tests against these hit a real 404 and get triaged as defects
 * — a false positive rooted in the requirement, not the app or the agent.
 *
 * partitionByGrounding() checks each requirement's apiHints endpoints
 * against the app's real "METHOD /path" route table (the same table
 * extract-api-hints.js already derives mechanically from the backend
 * source) and splits requirements into grounded / ungrounded.
 */
import { buildAutoApiHintsBySpecId } from "./extract-api-hints.js";

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...new Array(b.length)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/** Nearest "METHOD /path" in `routeSet` to `endpoint`, by plain edit distance. */
function nearestRoute(endpoint, routeSet) {
  let best = null;
  let bestDistance = Infinity;
  for (const route of routeSet) {
    const distance = levenshtein(endpoint, route);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = route;
    }
  }
  return best;
}

/**
 * @param {Array<{id: string, apiHints?: Array<{method: string, path: string}>}>} requirements
 * @param {{ appRoot: string }} opts
 * @returns {{ grounded: object[], ungrounded: Array<object & { groundingEndpoint: string, nearestRoute: string|null }> }}
 */
export function partitionByGrounding(requirements, { appRoot }) {
  const routeSet = new Set(buildAutoApiHintsBySpecId({ appRoot }).keys());

  const grounded = [];
  const ungrounded = [];
  for (const requirement of requirements) {
    const hints = requirement.apiHints ?? [];
    // Nothing to check against the route table (no method+path asserted at
    // all) — pass through ungated rather than gate on missing information.
    if (hints.length === 0) {
      grounded.push(requirement);
      continue;
    }
    const isGrounded = hints.some((h) => routeSet.has(`${h.method} ${h.path}`));
    if (isGrounded) {
      grounded.push(requirement);
      continue;
    }
    const groundingEndpoint = `${hints[0].method} ${hints[0].path}`;
    ungrounded.push({ ...requirement, groundingEndpoint, nearestRoute: nearestRoute(groundingEndpoint, routeSet) });
  }
  return { grounded, ungrounded };
}
