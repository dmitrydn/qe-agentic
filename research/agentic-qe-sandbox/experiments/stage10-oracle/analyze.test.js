import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mean, stdev, range, aggregateDose, noiseBand, decideMetric,
  wilcoxonSignedRank, catchDecomposition, analyzeExperiment,
} from "./analyze.js";

test("basic stats", () => {
  assert.equal(mean([2, 4, 6]), 4);
  assert.ok(Math.abs(stdev([2, 4, 6]) - 2) < 1e-9);
  assert.equal(range([5, 1, 3]), 4);
});

test("wilcoxon: all-positive diffs [1..5] → W=0, Wpos=15, known z/p", () => {
  const pairs = [1, 2, 3, 4, 5].map((d) => ({ rich: d, sparse: 0 }));
  const r = wilcoxonSignedRank(pairs);
  assert.equal(r.n, 5);
  assert.equal(r.Wpos, 15);
  assert.equal(r.Wneg, 0);
  assert.equal(r.W, 0);
  assert.ok(r.z < -1.85 && r.z > -1.95, `z=${r.z}`);
  assert.ok(r.p > 0.05 && r.p < 0.07, `p=${r.p}`);
});

test("wilcoxon: ties get averaged ranks", () => {
  const r = wilcoxonSignedRank([{ rich: 1, sparse: 0 }, { rich: 1, sparse: 0 }, { rich: 0, sparse: 1 }]);
  // |diffs| all 1 → ranks average to 2 each; Wpos=4, Wneg=2, W=2
  assert.equal(r.n, 3);
  assert.equal(r.Wpos, 4);
  assert.equal(r.Wneg, 2);
  assert.equal(r.W, 2);
});

test("wilcoxon: zero differences are dropped", () => {
  const r = wilcoxonSignedRank([{ rich: 3, sparse: 3 }, { rich: 5, sparse: 2 }]);
  assert.equal(r.n, 1);
});

test("noiseBand = control run-to-run range", () => {
  const sparse = [{ fpRateRaw: 0.10 }, { fpRateRaw: 0.14 }, { fpRateRaw: 0.12 }];
  assert.ok(Math.abs(noiseBand(sparse, (r) => r.fpRateRaw) - 0.04) < 1e-9);
});

test("decideMetric: within band = NULL, beyond = BETTER/WORSE", () => {
  assert.equal(decideMetric({ richMean: 0.11, sparseMean: 0.13, band: 0.05, betterIsLower: true }).call, "NULL");
  assert.equal(decideMetric({ richMean: 0.05, sparseMean: 0.20, band: 0.04, betterIsLower: true }).call, "BETTER");
  assert.equal(decideMetric({ richMean: 0.25, sparseMean: 0.10, band: 0.04, betterIsLower: true }).call, "WORSE");
  // catch: higher is better
  assert.equal(decideMetric({ richMean: 0.9, sparseMean: 0.6, band: 0.1, betterIsLower: false }).call, "BETTER");
});

test("catchDecomposition splits authGate vs valueShape", () => {
  const runs = [{
    defects: [
      { id: "auth-gate-get-users", caught: true, expectCaught: true },
      { id: "auth-gate-get-transactions", caught: true, expectCaught: true },
      { id: "users-results-not-array", caught: true, expectCaught: true },
      { id: "users-self-not-excluded", caught: false, expectCaught: true },
      { id: "payment-amount-cents", caught: false, expectCaught: true },
    ],
  }];
  const d = catchDecomposition(runs);
  assert.equal(d.authGate.mean, 1); // 2/2 caught
  assert.ok(Math.abs(d.valueShape.mean - 1 / 3) < 1e-9); // 1 of 3 caught
});

function run(dose, { fp, gr = 0, catch: c, reqFp = {} }) {
  return { dose, fpRateRaw: fp, groundingRejections: gr, requirementsTotal: 24, catchRate: c, defects: [], perRequirementFp: reqFp };
}

test("analyzeExperiment: rich FP well below sparse beyond band, catch not worse → GO", () => {
  const runs = [
    run("sparse", { fp: 0.20, catch: 0.5 }), run("sparse", { fp: 0.22, catch: 0.5 }), run("sparse", { fp: 0.21, catch: 0.5 }),
    run("rich", { fp: 0.05, catch: 0.6 }), run("rich", { fp: 0.06, catch: 0.6 }), run("rich", { fp: 0.04, catch: 0.6 }),
  ];
  const a = analyzeExperiment(runs, ["R1", "R2"]);
  assert.equal(a.decisions.fpRateRaw.call, "BETTER");
  assert.equal(a.overall, "GO");
  assert.ok(a.bands.fpRateRaw <= 0.02 + 1e-9); // sparse range 0.20..0.22
});

test("analyzeExperiment: deltas inside band → NULL", () => {
  const runs = [
    run("sparse", { fp: 0.10, catch: 0.5 }), run("sparse", { fp: 0.25, catch: 0.5 }),
    run("rich", { fp: 0.16, catch: 0.5 }), run("rich", { fp: 0.17, catch: 0.5 }),
  ];
  const a = analyzeExperiment(runs, ["R1"]);
  assert.equal(a.decisions.fpRateRaw.call, "NULL"); // band is wide (0.15), delta small
  assert.equal(a.overall, "NULL");
});

test("analyzeExperiment: rich catch worse beyond band → NEGATIVE", () => {
  const runs = [
    run("sparse", { fp: 0.10, catch: 0.90 }), run("sparse", { fp: 0.11, catch: 0.90 }),
    run("rich", { fp: 0.10, catch: 0.40 }), run("rich", { fp: 0.11, catch: 0.40 }),
  ];
  const a = analyzeExperiment(runs, ["R1"]);
  assert.equal(a.decisions.catchRate.call, "WORSE");
  assert.equal(a.overall, "NEGATIVE");
});

test("aggregateDose reports mean/min/max", () => {
  const agg = aggregateDose([run("rich", { fp: 0.1, catch: 0.5 }), run("rich", { fp: 0.3, catch: 0.7 })]);
  assert.equal(agg.fpRateRaw.mean, 0.2);
  assert.equal(agg.fpRateRaw.min, 0.1);
  assert.equal(agg.catchRate.max, 0.7);
});
