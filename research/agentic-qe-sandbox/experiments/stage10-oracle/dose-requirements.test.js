/**
 * Stage 10 — dose requirement-source invariants. These guarantee the two doses
 * are a clean content-richness contrast over the SAME 24 requirements.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { loadDoseRequirements } from "./dose-requirements.js";
import { validateAgainstSchema } from "../../workflow/llm/json.js";
import requirementSchema from "../../workflow/schemas/requirement.schema.json" with { type: "json" };

const rich = await loadDoseRequirements("rich", { stripApiHints: true });
const sparse = await loadDoseRequirements("sparse", { stripApiHints: true });

test("each dose yields exactly the 24 slice requirements, unique ids", () => {
  assert.equal(rich.length, 24);
  assert.equal(sparse.length, 24);
  assert.equal(new Set(rich.map((r) => r.id)).size, 24);
});

test("both doses cover the identical id set (parity)", () => {
  const rIds = rich.map((r) => r.id).sort();
  const sIds = sparse.map((r) => r.id).sort();
  assert.deepEqual(rIds, sIds);
});

test("every requirement is schema-valid", () => {
  for (const req of [...rich, ...sparse]) {
    const { valid, errors } = validateAgainstSchema(req, requirementSchema);
    assert.ok(valid, `${req.id} invalid: ${JSON.stringify(errors)}`);
  }
});

test("RICH carries strictly more oracle than SPARSE (per requirement and overall)", () => {
  const sum = (rs) => rs.reduce((n, r) => n + r.acceptanceCriteria.length, 0);
  assert.ok(sum(rich) > sum(sparse), "rich total acceptance criteria must exceed sparse");
  const sById = new Map(sparse.map((r) => [r.id, r]));
  for (const r of rich) {
    const s = sById.get(r.id);
    assert.ok(
      r.acceptanceCriteria.length >= s.acceptanceCriteria.length,
      `${r.id}: rich (${r.acceptanceCriteria.length}) < sparse (${s.acceptanceCriteria.length})`
    );
  }
});

test("apiHints stripped → no requirement carries apiHints", () => {
  for (const req of [...rich, ...sparse]) assert.ok(!("apiHints" in req));
});

test("apiHints NOT stripped → each requirement gets a method+path hint", async () => {
  const r = await loadDoseRequirements("rich", { stripApiHints: false });
  for (const req of r) {
    assert.ok(Array.isArray(req.apiHints) && req.apiHints.length === 1);
    assert.ok(req.apiHints[0].method && req.apiHints[0].path);
  }
});
