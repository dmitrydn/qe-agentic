/**
 * Stage 10 — experiment analysis (pure).
 *
 * Consumes normalized per-run records (one per dose per repetition, built by
 * the orchestrator from each run's scorecard.json + clarifications) and produces
 * the composite metrics, control-derived noise band, paired per-requirement
 * Wilcoxon signed-rank test, catch decomposition by defect type, and the
 * pre-registered GO / NULL / NEGATIVE decision. No I/O, no LLM — so it is fully
 * unit-testable, and the numbers behind the memo are independently re-checkable.
 *
 * A normalized run record:
 *   {
 *     dose: "rich" | "sparse",
 *     fpRateRaw: number,            // scorecard.falsePositiveRate (pre-adjudication)
 *     groundingRejections: number,  // count of ungrounded requirements this run
 *     requirementsTotal: number,
 *     catchRate: number,            // scorecard.catchRate (real defects only)
 *     defects: [{ id, caught, expectCaught }],
 *     perRequirementFp: { [reqId]: 0|1 } // 1 if that requirement produced a true-failure this run
 *   }
 */

export const DOSES = { CONTROL: "sparse", TREATMENT: "rich" };

// The seeded catalog partitioned by what kind of oracle catches it. Auth-gate
// defects are near-structural wins for RICH (it carries an unauth→401 case
// SPARSE lacks); the value/shape defects are the interesting ones. Reported
// separately so auth-gate freebies never inflate the headline.
export const DEFECT_TYPE = {
  "auth-gate-post-transactions": "authGate",
  "auth-gate-get-bankaccounts": "authGate",
  "auth-gate-get-users": "authGate",
  "auth-gate-get-transactions": "authGate",
  "payment-amount-cents": "valueShape",
  "payment-amount-rounding-shaved-cent": "valueShape",
  "receiver-balance-not-credited": "valueShape",
  "bankaccounts-missing-userid-field": "valueShape",
  "bankaccounts-routingnumber-hardcoded": "valueShape",
  "users-results-not-array": "valueShape",
  "users-self-not-excluded": "valueShape",
  "transactions-pagination-off-by-one": "valueShape",
};

// ---- basic stats -------------------------------------------------------
export const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
export const stdev = (xs) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};
export const range = (xs) => (xs.length ? Math.max(...xs) - Math.min(...xs) : 0);

function summarize(values) {
  return { mean: mean(values), stdev: stdev(values), min: Math.min(...values), max: Math.max(...values), values };
}

/** Aggregate a dose's runs into per-metric summaries. */
export function aggregateDose(runs) {
  return {
    n: runs.length,
    fpRateRaw: summarize(runs.map((r) => r.fpRateRaw)),
    groundingRejectionRate: summarize(
      runs.map((r) => (r.requirementsTotal ? r.groundingRejections / r.requirementsTotal : 0))
    ),
    catchRate: summarize(runs.map((r) => r.catchRate)),
  };
}

/**
 * Noise band for a metric = the run-to-run spread observed in the CONTROL
 * (sparse) dose. A treatment↔control delta inside this band is reported as null.
 */
export function noiseBand(controlRuns, metricFn) {
  return range(controlRuns.map(metricFn));
}

/** Pre-registered decision for one metric given the two dose means + band. */
export function decideMetric({ richMean, sparseMean, band, betterIsLower }) {
  const delta = richMean - sparseMean;
  const improved = betterIsLower ? delta < 0 : delta > 0;
  if (Math.abs(delta) <= band) return { call: "NULL", delta, band };
  return { call: improved ? "BETTER" : "WORSE", delta, band };
}

/**
 * Wilcoxon signed-rank over paired per-requirement values (rich vs sparse).
 * Normal approximation with tie + continuity correction — adequate for n≈24
 * and, unlike a table lookup, dependency-free. Returns W, z, two-sided p, and
 * the count of non-zero pairs.
 */
export function wilcoxonSignedRank(pairs) {
  const diffs = pairs.map((p) => p.rich - p.sparse).filter((d) => d !== 0);
  const n = diffs.length;
  if (n === 0) return { W: 0, z: 0, p: 1, n: 0 };

  const ranked = diffs
    .map((d) => ({ abs: Math.abs(d), sign: Math.sign(d) }))
    .sort((a, b) => a.abs - b.abs);

  // average ranks for ties
  let i = 0;
  while (i < ranked.length) {
    let j = i;
    while (j + 1 < ranked.length && ranked[j + 1].abs === ranked[i].abs) j++;
    const avg = (i + 1 + (j + 1)) / 2;
    for (let k = i; k <= j; k++) ranked[k].rank = avg;
    i = j + 1;
  }

  const Wpos = ranked.filter((r) => r.sign > 0).reduce((a, r) => a + r.rank, 0);
  const Wneg = ranked.filter((r) => r.sign < 0).reduce((a, r) => a + r.rank, 0);
  const W = Math.min(Wpos, Wneg);

  const meanW = (n * (n + 1)) / 4;
  const sdW = Math.sqrt((n * (n + 1) * (2 * n + 1)) / 24);
  const z = sdW === 0 ? 0 : (W - meanW + 0.5) / sdW; // continuity correction toward mean
  const p = 2 * (1 - normalCdf(Math.abs(z)));
  return { W, Wpos, Wneg, z, p: Math.min(1, Math.max(0, p)), n };
}

function normalCdf(x) {
  // Abramowitz-Stegun 7.1.26
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const prob =
    d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}

/** Catch rate split by defect type, per dose (mean over runs). */
export function catchDecomposition(runs) {
  const types = ["authGate", "valueShape"];
  const out = {};
  for (const type of types) {
    const ids = Object.entries(DEFECT_TYPE).filter(([, t]) => t === type).map(([id]) => id);
    const perRun = runs.map((r) => {
      const rel = (r.defects || []).filter((d) => ids.includes(d.id) && d.expectCaught !== false);
      const caught = rel.filter((d) => d.caught).length;
      return rel.length ? caught / rel.length : 0;
    });
    out[type] = summarize(perRun);
  }
  return out;
}

/**
 * Full analysis. `runs` is the flat list of normalized run records (both doses).
 * `requirementIds` are the 24 slice ids (for the paired FP test).
 */
export function analyzeExperiment(runs, requirementIds) {
  const rich = runs.filter((r) => r.dose === DOSES.TREATMENT);
  const sparse = runs.filter((r) => r.dose === DOSES.CONTROL);
  if (!rich.length || !sparse.length) throw new Error("need at least one run per dose");

  const aggRich = aggregateDose(rich);
  const aggSparse = aggregateDose(sparse);

  const bands = {
    fpRateRaw: noiseBand(sparse, (r) => r.fpRateRaw),
    groundingRejectionRate: noiseBand(sparse, (r) =>
      r.requirementsTotal ? r.groundingRejections / r.requirementsTotal : 0
    ),
    catchRate: noiseBand(sparse, (r) => r.catchRate),
  };

  const decisions = {
    fpRateRaw: decideMetric({
      richMean: aggRich.fpRateRaw.mean,
      sparseMean: aggSparse.fpRateRaw.mean,
      band: bands.fpRateRaw,
      betterIsLower: true,
    }),
    groundingRejectionRate: decideMetric({
      richMean: aggRich.groundingRejectionRate.mean,
      sparseMean: aggSparse.groundingRejectionRate.mean,
      band: bands.groundingRejectionRate,
      betterIsLower: true,
    }),
    catchRate: decideMetric({
      richMean: aggRich.catchRate.mean,
      sparseMean: aggSparse.catchRate.mean,
      band: bands.catchRate,
      betterIsLower: false,
    }),
  };

  // paired per-requirement FP: mean FP indicator across each dose's runs
  const perReqMean = (doseRuns, reqId) =>
    mean(doseRuns.map((r) => (r.perRequirementFp?.[reqId] ?? 0)));
  const pairs = requirementIds.map((id) => ({
    id,
    rich: perReqMean(rich, id),
    sparse: perReqMean(sparse, id),
  }));
  const wilcoxonFp = wilcoxonSignedRank(pairs);

  // Overall call: H1 supported only if FP better AND grounding better AND catch not worse.
  const overall = deriveOverall(decisions);

  return {
    aggRich,
    aggSparse,
    bands,
    decisions,
    pairs,
    wilcoxonFp,
    catch: { rich: catchDecomposition(rich), sparse: catchDecomposition(sparse) },
    overall,
  };
}

function deriveOverall(d) {
  const fpBetter = d.fpRateRaw.call === "BETTER";
  const grBetter = d.groundingRejectionRate.call === "BETTER";
  const catchWorse = d.catchRate.call === "WORSE";
  const anyWorse = d.fpRateRaw.call === "WORSE" || d.groundingRejectionRate.call === "WORSE" || catchWorse;
  if ((fpBetter || grBetter) && !catchWorse) return "GO";
  if (anyWorse) return "NEGATIVE";
  return "NULL";
}
