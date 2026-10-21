import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { collectRun, buildBlindWorksheet, requirementIdOf, renderMemo } from "./analyze-io.js";
import { analyzeExperiment } from "./analyze.js";

const SANDBOX_ROOT = join(dirname(fileURLToPath(import.meta.url)), "../..");

test("requirementIdOf extracts the requirement id from a test id", () => {
  assert.equal(requirementIdOf("CYPRESS-RWA-TRANSACTIONS-007-positive-001"), "CYPRESS-RWA-TRANSACTIONS-007");
  assert.equal(requirementIdOf("CYPRESS-RWA-USERS-001-TC-002"), "CYPRESS-RWA-USERS-001");
  assert.equal(requirementIdOf("garbage"), null);
});

test("collectRun maps a real scorecard.json into a normalized record", () => {
  const p = join(SANDBOX_ROOT, "reports/scorecard.json");
  if (!existsSync(p)) return; // fixture optional in fresh checkouts
  const sc = JSON.parse(readFileSync(p, "utf8"));
  const r = collectRun("rich", sc, { groundingRejections: 2, failingTestIds: ["CYPRESS-RWA-USERS-001-TC-003"] });
  assert.equal(r.dose, "rich");
  assert.equal(typeof r.fpRateRaw, "number");
  assert.equal(r.requirementsTotal, sc.requirements.total);
  assert.ok(Array.isArray(r.defects));
  assert.equal(r.perRequirementFp["CYPRESS-RWA-USERS-001"], 1);
});

test("buildBlindWorksheet hides the dose behind arm codes; key recovers it", () => {
  const entries = [
    { dose: "rich", runIndex: 1, testId: "CYPRESS-RWA-USERS-001-x", detail: "balance != expected" },
    { dose: "sparse", runIndex: 1, testId: "CYPRESS-RWA-TRANSACTIONS-007-y", detail: "422 expected 200" },
  ];
  const { worksheetMd, key, rowCount } = buildBlindWorksheet(entries, { armAssignment: { rich: "A", sparse: "B" } });
  assert.equal(rowCount, 2);
  assert.ok(!/\brich\b|\bsparse\b/.test(worksheetMd), "worksheet must not reveal the dose");
  assert.ok(/\bA\b/.test(worksheetMd) && /\bB\b/.test(worksheetMd));
  assert.deepEqual(key, { rich: "A", sparse: "B" });
});

test("default arm assignment is a valid A/B mapping of the two doses", () => {
  const { key } = buildBlindWorksheet([
    { dose: "rich", runIndex: 1, testId: "CYPRESS-RWA-USERS-001-x" },
    { dose: "sparse", runIndex: 1, testId: "CYPRESS-RWA-USERS-002-y" },
  ]);
  assert.deepEqual(new Set(Object.values(key)), new Set(["A", "B"]));
  assert.deepEqual(new Set(Object.keys(key)), new Set(["rich", "sparse"]));
});

test("renderMemo produces a memo with the verdict and all three metrics", () => {
  const runs = [
    { dose: "sparse", fpRateRaw: 0.2, groundingRejections: 3, requirementsTotal: 24, catchRate: 0.5, defects: [], perRequirementFp: {} },
    { dose: "sparse", fpRateRaw: 0.22, groundingRejections: 3, requirementsTotal: 24, catchRate: 0.5, defects: [], perRequirementFp: {} },
    { dose: "rich", fpRateRaw: 0.05, groundingRejections: 1, requirementsTotal: 24, catchRate: 0.6, defects: [], perRequirementFp: {} },
    { dose: "rich", fpRateRaw: 0.06, groundingRejections: 1, requirementsTotal: 24, catchRate: 0.6, defects: [], perRequirementFp: {} },
  ];
  const memo = renderMemo(analyzeExperiment(runs, ["R1", "R2"]), { n: 2, slice: 24 });
  assert.ok(/Verdict/.test(memo));
  assert.ok(/FP rate/.test(memo) && /grounding-rejection/.test(memo) && /catch rate/.test(memo));
  assert.ok(/Wilcoxon/.test(memo));
});
