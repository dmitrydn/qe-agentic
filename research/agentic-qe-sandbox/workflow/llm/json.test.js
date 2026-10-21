import { test } from "node:test";
import assert from "node:assert/strict";
import { extractJson, validateAgainstSchema, formatAjvErrors, InvalidLlmJsonError } from "./json.js";

test("extractJson parses a clean JSON object", () => {
  assert.deepEqual(extractJson('{"a":1}'), { a: 1 });
});

test("extractJson extracts JSON embedded in prose/fences", () => {
  const text = 'Here you go:\n```json\n{"a": [1,2,3]}\n```\nHope that helps.';
  assert.deepEqual(extractJson(text), { a: [1, 2, 3] });
});

test("extractJson extracts a top-level array", () => {
  assert.deepEqual(extractJson("prefix [1,2,3] suffix"), [1, 2, 3]);
});

test("extractJson throws InvalidLlmJsonError when nothing JSON-like is present", () => {
  assert.throws(() => extractJson("no json here"), InvalidLlmJsonError);
});

test("extractJson is not thrown off by a literal unbalanced brace inside a JSON string value", () => {
  // A real failure mode: an LLM "finding" field quoting a truncated code
  // assertion like ".to.contain({" — that lone `{` is inside a string and
  // must not be counted as a structural open-brace.
  const text =
    '```json\n{"a":"contains a literal { unbalanced brace","b":[1,2,"and ] one too"]}\n```';
  assert.deepEqual(extractJson(text), { a: "contains a literal { unbalanced brace", b: [1, 2, "and ] one too"] });
});

test("extractJson correctly skips escaped quotes inside a string when tracking string state", () => {
  const text = '{"finding": "she said \\"hello { world\\" then left", "ok": true}';
  assert.deepEqual(extractJson(text), { finding: 'she said "hello { world" then left', ok: true });
});

test("validateAgainstSchema accepts valid data and rejects invalid data", () => {
  const schema = { type: "object", required: ["x"], properties: { x: { type: "number" } } };
  assert.equal(validateAgainstSchema({ x: 1 }, schema).valid, true);
  const invalid = validateAgainstSchema({ x: "nope" }, schema);
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.length > 0);
});

test("validateAgainstSchema can be called repeatedly against the same $id schema (no ajv duplicate-id crash)", () => {
  const schema = { $id: "repeat-test.json", type: "object", properties: { x: { type: "number" } } };
  assert.equal(validateAgainstSchema({ x: 1 }, schema).valid, true);
  assert.equal(validateAgainstSchema({ x: 2 }, schema).valid, true);
});

test("formatAjvErrors produces a readable string", () => {
  const schema = { type: "object", required: ["x"] };
  const { errors } = validateAgainstSchema({}, schema);
  const formatted = formatAjvErrors(errors);
  assert.ok(formatted.includes("x"));
});
