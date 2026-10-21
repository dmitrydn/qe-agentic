import { test } from "node:test";
import assert from "node:assert/strict";
import { costFor, buildCostReport } from "./cost.js";

const PRICING = { inputUsdPerMTok: 3, outputUsdPerMTok: 15 };

test("costFor applies per-million input/output rates", () => {
  // 1,000,000 input tok @ $3/M = $3; 1,000,000 output tok @ $15/M = $15.
  const c = costFor({ promptTokens: 1_000_000, completionTokens: 1_000_000 }, PRICING);
  assert.equal(c.inputUsd, 3);
  assert.equal(c.outputUsd, 15);
  assert.equal(c.totalUsd, 18);
});

test("costFor handles small realistic token counts", () => {
  // ~5,400 in + ~2,000 out (a curated 4-requirement run).
  const c = costFor({ promptTokens: 5400, completionTokens: 2000 }, PRICING);
  assert.equal(c.inputUsd, round6((5400 / 1e6) * 3));
  assert.equal(c.outputUsd, round6((2000 / 1e6) * 15));
  assert.equal(c.totalUsd, round6(c.inputUsd + c.outputUsd));
});

test("costFor is zero-safe on missing usage or pricing", () => {
  assert.deepEqual(costFor(undefined, undefined), { inputUsd: 0, outputUsd: 0, totalUsd: 0 });
  assert.deepEqual(costFor({ promptTokens: 100, completionTokens: 50 }, undefined), {
    inputUsd: 0,
    outputUsd: 0,
    totalUsd: 0,
  });
});

test("buildCostReport sums totals and breaks down by phase", () => {
  const usage = {
    calls: 3,
    promptTokens: 3000,
    completionTokens: 600,
    byPhase: {
      generate: { calls: 2, promptTokens: 2400, completionTokens: 500 },
      triage: { calls: 1, promptTokens: 600, completionTokens: 100 },
    },
  };
  const r = buildCostReport(usage, PRICING);

  assert.equal(r.calls, 3);
  assert.equal(r.promptTokens, 3000);
  assert.equal(r.completionTokens, 600);
  assert.equal(r.pricing.inputUsdPerMTok, 3);
  assert.equal(r.pricing.outputUsdPerMTok, 15);

  // Total matches the standalone math.
  assert.deepEqual(
    { inputUsd: r.inputUsd, outputUsd: r.outputUsd, totalUsd: r.totalUsd },
    costFor(usage, PRICING)
  );

  // Phase totals reconcile to the run total.
  const phaseInput = r.byPhase.generate.inputUsd + r.byPhase.triage.inputUsd;
  const phaseOutput = r.byPhase.generate.outputUsd + r.byPhase.triage.outputUsd;
  assert.equal(round6(phaseInput), r.inputUsd);
  assert.equal(round6(phaseOutput), r.outputUsd);
  assert.equal(r.byPhase.generate.calls, 2);
  assert.equal(r.byPhase.triage.calls, 1);
});

test("buildCostReport degrades safely when usage is absent", () => {
  const r = buildCostReport(undefined, PRICING);
  assert.equal(r.calls, 0);
  assert.equal(r.totalUsd, 0);
  assert.deepEqual(r.byPhase, {});
});

function round6(n) {
  return Math.round(n * 1e6) / 1e6;
}
