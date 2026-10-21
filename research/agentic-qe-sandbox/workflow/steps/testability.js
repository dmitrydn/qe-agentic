/**
 * TESTABILITY (pure, deterministic). The LLM (in assess.js) only rates
 * dimensions and writes findings/clarifications/assumptions — score, verdict,
 * and the gating decision are computed here, never trusted from the model
 * (same hybrid contract as generate/triage).
 */

export const DIMENSION_IDS = ["D1", "D2", "D3", "D4", "D5", "D6"];

// D1 (oracle) and D4 (interface grounding): you cannot test without an
// expected result to check or a contract to act against, regardless of how
// well the other dimensions score.
export const BLOCKING_DIMENSION_IDS = ["D1", "D4"];

export const RATING_VALUES = { pass: 1, partial: 0.5, fail: 0 };

const THEN_CRITERION_RE = /\bthen\b/i;

/**
 * Structural gaps detectable with zero LLM cost. Only an empty
 * acceptanceCriteria list is a HARD gap (no input at all) — it short-circuits
 * straight to `untestable` without calling the LLM. The other two are soft
 * flags surfaced for assess.js to factor in; they don't skip the LLM call.
 * @param {{ acceptanceCriteria?: string[], apiHints?: object[] }} requirement
 * @returns {{ hardGap: boolean, reason?: string, flags: string[] }}
 */
export function preChecks(requirement) {
  const criteria = requirement.acceptanceCriteria ?? [];
  if (criteria.length === 0) {
    return { hardGap: true, reason: "acceptanceCriteria is empty — no input to assess", flags: [] };
  }

  const flags = [];
  if (!criteria.some((c) => THEN_CRITERION_RE.test(c))) {
    flags.push("D1: no 'Then …' criterion found — likely no oracle");
  }
  if (!requirement.apiHints?.length) {
    flags.push("D4: no apiHints — low interface grounding");
  }
  return { hardGap: false, flags };
}

/**
 * Weighted mean of dimension ratings, 0..1. Default weight is 1 per
 * dimension (equal weighting) unless overridden.
 * @param {{ id: string, rating: "pass"|"partial"|"fail" }[]} dimensions
 * @param {Record<string, number>} weights
 * @returns {number}
 */
export function scoreOf(dimensions, weights = {}) {
  let weightedSum = 0;
  let weightTotal = 0;
  for (const dim of dimensions) {
    const weight = weights[dim.id] ?? 1;
    weightedSum += RATING_VALUES[dim.rating] * weight;
    weightTotal += weight;
  }
  return weightTotal === 0 ? 0 : weightedSum / weightTotal;
}

/**
 * A single non-blocking `fail` (e.g. D2 — one genuinely ambiguous criterion,
 * otherwise clean) is exactly the case pure averaging across 6 equally-
 * weighted dimensions can't catch: one fail only costs ~1/6 of the score,
 * which clears almost any reasonable threshold. So `fail` on ANY dimension
 * — not just a blocking one — caps the verdict below `testable`; only the
 * *blocking* dimensions (D1/D4) push it all the way to `untestable`. A
 * `partial` alone never does this — only an outright `fail`.
 * @param {{ id: string, rating: "pass"|"partial"|"fail" }[]} dimensions
 * @param {number} score
 * @param {number} threshold
 * @param {string[]} blockingIds
 * @returns {{ verdict: "testable"|"needs_clarification"|"untestable", blockedBy: string[] }}
 */
export function verdictOf(
  dimensions,
  score,
  threshold,
  blockingIds = BLOCKING_DIMENSION_IDS,
  { strictFail = false, clarifyOnFailIds = [] } = {}
) {
  const blockedBy = dimensions.filter((d) => blockingIds.includes(d.id) && d.rating === "fail").map((d) => d.id);
  if (blockedBy.length > 0) {
    return { verdict: "untestable", blockedBy };
  }
  // A `fail` forces needs_clarification when it lands on a clarity-signal
  // dimension (clarifyOnFailIds, e.g. D2 = "criteria are ambiguous") — that's
  // the gate's whole point. `strictFail` widens this to ANY dimension (the old
  // blanket rule, kept for A/B). Other non-blocking fails only lower the score,
  // so one weak dimension can't hard-flip a borderline verdict on temp-0 noise.
  const clarifyFail = dimensions.some(
    (d) => d.rating === "fail" && (strictFail || clarifyOnFailIds.includes(d.id))
  );
  if (clarifyFail || score < threshold) {
    return { verdict: "needs_clarification", blockedBy: [] };
  }
  return { verdict: "testable", blockedBy: [] };
}

// Tie-break ordering when combining repeated assessments: prefer the more
// conservative verdict (ask rather than generate).
export const VERDICT_SEVERITY = { testable: 0, needs_clarification: 1, untestable: 2 };

/**
 * Combine N independent assessments of the SAME requirement into one stable
 * result: majority verdict (ties broken toward the more conservative verdict),
 * median score, and the union of clarifications. Pure — no LLM, no IO. Damps
 * temp-0 non-determinism on borderline requirements.
 * @param {object[]} assessments
 * @returns {object}
 */
export function stabilize(assessments) {
  if (assessments.length === 1) return assessments[0];
  const counts = {};
  for (const a of assessments) counts[a.verdict] = (counts[a.verdict] ?? 0) + 1;
  const maxCount = Math.max(...Object.values(counts));
  const verdict = Object.keys(counts)
    .filter((v) => counts[v] === maxCount)
    .sort((x, y) => VERDICT_SEVERITY[y] - VERDICT_SEVERITY[x])[0];
  const scores = assessments.map((a) => a.score).sort((a, b) => a - b);
  const mid = scores.length >> 1;
  const score = scores.length % 2 ? scores[mid] : (scores[mid - 1] + scores[mid]) / 2;
  const rep = assessments.find((a) => a.verdict === verdict) ?? assessments[0];
  const clarifications = [...new Set(assessments.flatMap((a) => a.clarifications ?? []))];
  return {
    ...rep,
    score,
    verdict,
    clarifications,
    stability: {
      runs: assessments.length,
      verdicts: assessments.map((a) => a.verdict),
      agreed: Object.keys(counts).length === 1,
    },
  };
}
