import { test } from "node:test";
import assert from "node:assert/strict";
import { applySync } from "./apply-sync.js";

test("applySync prunes first, regenerates added+changed, drops removed, updates manifest", async () => {
  const removed = [];
  const persisted = [];
  const genCalls = [];

  const effects = {
    remove: (file) => removed.push(file),
    persist: (tc) => persisted.push(tc.id),
    generate: async (req) => {
      genCalls.push(req.id);
      return [{ id: `${req.id}-TC1`, requirementId: req.id }];
    },
  };

  const prevManifest = {
    model: "m",
    requirements: {
      "C": { hash: "old", testIds: ["C-TC1"] }, // changed
      "R": { hash: "h", testIds: ["R-TC1"] },    // removed
      "U": { hash: "h", testIds: ["U-TC1"] },    // unchanged -> preserved
    },
  };

  const { manifest, summary } = await applySync({
    added: ["A"],
    changed: ["C"],
    removed: ["R"],
    pruneSet: [{ file: "C-TC1.json" }, { file: "R-TC1.json" }],
    hashes: { A: "hA", C: "hC" },
    requirementsById: new Map([
      ["A", { id: "A" }],
      ["C", { id: "C" }],
    ]),
    prevManifest,
    effects,
  });

  // pruned before regen
  assert.deepEqual(removed.sort(), ["C-TC1.json", "R-TC1.json"]);
  // regenerated added + changed only
  assert.deepEqual(genCalls.sort(), ["A", "C"]);
  assert.deepEqual(persisted.sort(), ["A-TC1", "C-TC1"]);
  // manifest: A added, C updated, U preserved, R gone
  assert.equal(manifest.requirements["A"].hash, "hA");
  assert.deepEqual(manifest.requirements["A"].testIds, ["A-TC1"]);
  assert.equal(manifest.requirements["C"].hash, "hC");
  assert.ok(manifest.requirements["U"]); // unchanged preserved
  assert.equal(manifest.requirements["R"], undefined); // removed dropped
  assert.deepEqual(summary, { regenerated: 2, generatedTests: 2, pruned: 2, gated: 0 });
});

test("applySync regenerates 'missing' requirements (hash unchanged, no tests) without pruning", async () => {
  const genCalls = [];
  const persisted = [];
  let removes = 0;
  const effects = {
    remove: () => removes++,
    persist: (tc) => persisted.push(tc.id),
    generate: async (req) => { genCalls.push(req.id); return [{ id: `${req.id}-TC1`, requirementId: req.id }]; },
  };

  const { manifest, summary } = await applySync({
    added: [],
    changed: [],
    missing: ["M"],            // in manifest, hash matches, but no test exists yet
    removed: [],
    pruneSet: [],              // nothing to prune for a missing requirement
    hashes: { M: "hM" },
    requirementsById: new Map([["M", { id: "M" }]]),
    prevManifest: { requirements: { M: { hash: "hM", testIds: [] } } },
    effects,
  });

  assert.equal(removes, 0);
  assert.deepEqual(genCalls, ["M"]);
  assert.deepEqual(persisted, ["M-TC1"]);
  assert.deepEqual(manifest.requirements["M"].testIds, ["M-TC1"]);
  assert.deepEqual(summary, { regenerated: 1, generatedTests: 1, pruned: 0, gated: 0 });
});

test("applySync on an in-sync suite does nothing", async () => {
  let touched = 0;
  const { summary } = await applySync({
    added: [], changed: [], removed: [], pruneSet: [],
    hashes: {}, requirementsById: new Map(),
    prevManifest: { requirements: { U: { hash: "h", testIds: [] } } },
    effects: { remove: () => touched++, persist: () => touched++, generate: async () => { touched++; return []; } },
  });
  assert.equal(touched, 0);
  assert.deepEqual(summary, { regenerated: 0, generatedTests: 0, pruned: 0, gated: 0 });
});

test("applySync routes a non-testable assessment to manifest.gated instead of generating", async () => {
  const genCalls = [];
  const assessCalls = [];
  const effects = {
    remove: () => {},
    persist: () => {},
    generate: async (req) => { genCalls.push(req.id); return [{ id: `${req.id}-TC1`, requirementId: req.id }]; },
    assess: async (req) => {
      assessCalls.push(req.id);
      return req.id === "A" ? { verdict: "testable" } : { verdict: "untestable" };
    },
  };

  const { manifest, summary } = await applySync({
    added: ["A", "B"],
    changed: [],
    removed: [],
    pruneSet: [],
    hashes: { A: "hA", B: "hB" },
    requirementsById: new Map([
      ["A", { id: "A" }],
      ["B", { id: "B" }],
    ]),
    prevManifest: {},
    effects,
  });

  assert.deepEqual(assessCalls.sort(), ["A", "B"]);
  assert.deepEqual(genCalls, ["A"]); // B never reached generate()
  assert.equal(manifest.requirements["A"].hash, "hA");
  assert.equal(manifest.requirements["B"], undefined);
  assert.deepEqual(manifest.gated["B"], { hash: "hB", verdict: "untestable" });
  assert.equal(manifest.gated["A"], undefined);
  assert.deepEqual(summary, { regenerated: 1, generatedTests: 1, pruned: 0, gated: 1 });
});

test("applySync carries forward a still-gated requirement's manifest entry untouched", async () => {
  const { manifest } = await applySync({
    added: [],
    changed: [],
    removed: [],
    pruneSet: [],
    hashes: {},
    requirementsById: new Map(),
    prevManifest: { gated: { "G": { hash: "hG", verdict: "needs_clarification" } } },
    effects: { remove: () => {}, persist: () => {}, generate: async () => [] },
  });
  assert.deepEqual(manifest.gated["G"], { hash: "hG", verdict: "needs_clarification" });
});

test("applySync drops a removed requirement from manifest.gated too", async () => {
  const { manifest } = await applySync({
    added: [],
    changed: [],
    removed: ["G"],
    pruneSet: [],
    hashes: {},
    requirementsById: new Map(),
    prevManifest: { gated: { "G": { hash: "hG", verdict: "untestable" } } },
    effects: { remove: () => {}, persist: () => {}, generate: async () => [] },
  });
  assert.equal(manifest.gated["G"], undefined);
});

test("applySync clears a stale gated entry when the requirement is re-assessed and becomes testable", async () => {
  const { manifest } = await applySync({
    added: ["G"], // the author revised it -> diffRequirements would bucket this as 'added', not 'gated'
    changed: [],
    removed: [],
    pruneSet: [],
    hashes: { G: "hG2" },
    requirementsById: new Map([["G", { id: "G" }]]),
    prevManifest: { gated: { "G": { hash: "hG1", verdict: "untestable" } } },
    effects: {
      remove: () => {},
      persist: () => {},
      generate: async (req) => [{ id: `${req.id}-TC1`, requirementId: req.id }],
      assess: async () => ({ verdict: "testable" }),
    },
  });
  assert.equal(manifest.gated["G"], undefined);
  assert.equal(manifest.requirements["G"].hash, "hG2");
});
