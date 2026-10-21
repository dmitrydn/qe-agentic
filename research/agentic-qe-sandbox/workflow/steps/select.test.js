import { test } from "node:test";
import assert from "node:assert/strict";
import { select } from "./select.js";

const VALID_REQS = [
  { id: "A-1", title: "first", acceptanceCriteria: ["Given x", "Then y"], source: { file: "f1.ts" } },
  { id: "A-2", title: "second", acceptanceCriteria: ["Given x", "Then y"], source: { file: "f2.ts" } },
];

function fakeAdapter(requirements) {
  return { requirementsSource: async () => requirements };
}

test("select returns all requirements when no filter is given", async () => {
  const reqs = await select({ adapter: fakeAdapter(VALID_REQS) });
  assert.equal(reqs.length, 2);
});

test("select applies an id filter", async () => {
  const reqs = await select({ adapter: fakeAdapter(VALID_REQS), filter: { ids: ["A-2"] } });
  assert.deepEqual(reqs.map((r) => r.id), ["A-2"]);
});

test("select.all overrides an id filter", async () => {
  const reqs = await select({ adapter: fakeAdapter(VALID_REQS), filter: { all: true, ids: ["A-2"] } });
  assert.equal(reqs.length, 2);
});

test("select throws with a clear message when a requirement fails schema validation", async () => {
  const bad = [{ id: "A-1" }]; // missing title/acceptanceCriteria/source
  await assert.rejects(
    () => select({ adapter: fakeAdapter(bad) }),
    /failed schema validation/
  );
});
