import { test } from "node:test";
import assert from "node:assert/strict";
import { hashRequirement, diffRequirements } from "./diff-requirements.js";

const REQ = {
  id: "R-1",
  title: "List users",
  acceptanceCriteria: ["Given auth", "Then 200 with an array"],
  apiHints: [{ method: "GET", path: "/users" }],
  source: { file: "a.ts" },
};

test("hashRequirement is stable and order-independent", () => {
  const a = hashRequirement(REQ);
  const b = hashRequirement({ ...REQ, source: { file: "DIFFERENT.ts" }, id: "X" });
  assert.equal(a, b); // id + source are excluded from the hash
});

test("hashRequirement changes when testable substance changes", () => {
  const base = hashRequirement(REQ);
  assert.notEqual(base, hashRequirement({ ...REQ, acceptanceCriteria: ["Given auth", "Then 200 with ONE object"] }));
  assert.notEqual(base, hashRequirement({ ...REQ, apiHints: [{ method: "GET", path: "/users", notes: "exclude self" }] }));
  assert.notEqual(base, hashRequirement({ ...REQ, title: "List users (paged)" }));
});

test("diffRequirements classifies added / changed / removed / unchanged", () => {
  const r1 = { id: "R-1", title: "t1", acceptanceCriteria: ["a"] };
  const r2 = { id: "R-2", title: "t2", acceptanceCriteria: ["a"] };
  const r4 = { id: "R-4", title: "t4", acceptanceCriteria: ["a"] };

  const manifest = {
    requirements: {
      "R-1": { hash: hashRequirement(r1), testIds: ["R-1-TC1"] },           // unchanged
      "R-2": { hash: "STALE", testIds: ["R-2-TC1"] },                       // changed
      "R-3": { hash: hashRequirement({ id: "R-3", title: "gone", acceptanceCriteria: ["a"] }), testIds: ["R-3-TC1"] }, // removed
    },
  };

  const d = diffRequirements(manifest, [r1, r2, r4]); // R-4 is new, R-3 absent
  assert.deepEqual(d.added.sort(), ["R-4"]);
  assert.deepEqual(d.changed.sort(), ["R-2"]);
  assert.deepEqual(d.removed.sort(), ["R-3"]);
  assert.deepEqual(d.unchanged.sort(), ["R-1"]);
  assert.equal(d.hashes["R-4"], hashRequirement(r4));
});

test("diffRequirements: hash matches but no test on disk -> 'missing' (backfill), not 'unchanged'", () => {
  const r1 = { id: "R-1", title: "t1", acceptanceCriteria: ["a"] }; // has tests
  const r2 = { id: "R-2", title: "t2", acceptanceCriteria: ["a"] }; // hash matches, but NO tests on disk
  const manifest = {
    requirements: {
      "R-1": { hash: hashRequirement(r1), testIds: ["R-1-TC1"] },
      "R-2": { hash: hashRequirement(r2), testIds: [] },
    },
  };
  const coveredReqIds = new Set(["R-1"]); // only R-1 actually has a persisted test

  const d = diffRequirements(manifest, [r1, r2], coveredReqIds);
  assert.deepEqual(d.unchanged, ["R-1"]);
  assert.deepEqual(d.missing, ["R-2"]);
  assert.deepEqual(d.added, []);
  assert.deepEqual(d.changed, []);
});

test("diffRequirements: without coveredReqIds, hash-matching reqs stay 'unchanged' (no missing)", () => {
  const r1 = { id: "R-1", title: "t1", acceptanceCriteria: ["a"] };
  const manifest = { requirements: { "R-1": { hash: hashRequirement(r1), testIds: [] } } };
  const d = diffRequirements(manifest, [r1]); // no coveredReqIds passed
  assert.deepEqual(d.unchanged, ["R-1"]);
  assert.deepEqual(d.missing, []);
});

test("diffRequirements treats an empty/absent manifest as everything-new", () => {
  const reqs = [{ id: "R-1", title: "t", acceptanceCriteria: ["a"] }];
  const d = diffRequirements({}, reqs);
  assert.deepEqual(d.added, ["R-1"]);
  assert.deepEqual(d.changed, []);
  assert.deepEqual(d.removed, []);
});

test("diffRequirements: a hash-matching gated requirement is bucketed 'gated', not 'added'/'missing'", () => {
  const g = { id: "G-1", title: "vague epic", acceptanceCriteria: ["a"] };
  const manifest = { gated: { "G-1": { hash: hashRequirement(g), verdict: "untestable" } } };

  const d = diffRequirements(manifest, [g], new Set()); // even with coveredReqIds supplied (no test for it)
  assert.deepEqual(d.gated, ["G-1"]);
  assert.deepEqual(d.added, []);
  assert.deepEqual(d.missing, []);
  assert.deepEqual(d.unchanged, []);
});

test("diffRequirements: a gated requirement whose hash changed leaves the gated bucket (re-assessed as 'added')", () => {
  const manifest = { gated: { "G-1": { hash: "STALE-HASH", verdict: "untestable" } } };
  const g = { id: "G-1", title: "now has real criteria", acceptanceCriteria: ["a"] };

  const d = diffRequirements(manifest, [g]);
  assert.deepEqual(d.gated, []);
  assert.deepEqual(d.added, ["G-1"]);
});

test("diffRequirements: a gated requirement disappearing entirely from the source is bucketed 'removed' (cleans up manifest.gated too)", () => {
  const manifest = { gated: { "G-1": { hash: "h", verdict: "untestable" } } };
  const d = diffRequirements(manifest, []); // G-1 no longer in source
  assert.deepEqual(d.gated, []);
  assert.deepEqual(d.added, []);
  assert.deepEqual(d.removed, ["G-1"]);
});
