import { test } from "node:test";
import assert from "node:assert/strict";
import { computePruneSet } from "./prune.js";

const persisted = [
  { file: "R-1-TC1.json", requirementId: "R-1" }, // unchanged -> keep
  { file: "R-2-TC1.json", requirementId: "R-2" }, // changed -> replace
  { file: "R-2-TC2.json", requirementId: "R-2" }, // changed -> replace (extra file too)
  { file: "R-3-TC1.json", requirementId: "R-3" }, // removed -> delete
  { file: "R-9-TC1.json", requirementId: "R-9" }, // orphan (not in current) -> delete
];

test("computePruneSet flags changed, removed, and orphan files (not unchanged)", () => {
  const out = computePruneSet({
    persisted,
    changedIds: ["R-2"],
    removedIds: ["R-3"],
    currentReqIds: ["R-1", "R-2", "R-4"], // R-9 absent => orphan
  });
  const byFile = Object.fromEntries(out.map((o) => [o.file, o.reason]));

  assert.equal(byFile["R-1-TC1.json"], undefined); // kept
  assert.equal(byFile["R-2-TC1.json"], "changed requirement (replace)");
  assert.equal(byFile["R-2-TC2.json"], "changed requirement (replace)");
  assert.equal(byFile["R-3-TC1.json"], "removed requirement");
  assert.equal(byFile["R-9-TC1.json"], "orphan (no matching requirement)");
  assert.equal(out.length, 4);
});

test("computePruneSet returns nothing when suite is in sync", () => {
  const out = computePruneSet({
    persisted: [{ file: "R-1-TC1.json", requirementId: "R-1" }],
    changedIds: [],
    removedIds: [],
    currentReqIds: ["R-1"],
  });
  assert.deepEqual(out, []);
});
