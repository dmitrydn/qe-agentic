import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveApiHints, stripAllFromEnv } from "./api-hints-policy.js";

const curatedMap = { "REQ-CURATED": [{ method: "POST", path: "/x", notes: "curated" }] };
const autoMap = new Map([["spec-1", { method: "GET", path: "/y", notes: "auto" }]]);
const curatedRecord = { id: "REQ-CURATED", source: { specId: "spec-1" } };
const autoRecord = { id: "REQ-AUTO", source: { specId: "spec-1" } };
const bareRecord = { id: "REQ-NONE", source: { specId: "nope" } };

test("stripAll zeroes CURATED hints", () => {
  const r = resolveApiHints(curatedRecord, { curatedMap, autoMap, stripAll: true });
  assert.equal(r, undefined);
});

test("stripAll zeroes AUTO hints", () => {
  const r = resolveApiHints(autoRecord, { curatedMap, autoMap, stripAll: true });
  assert.equal(r, undefined);
});

test("stripAll zeroes even with graph side-effects enabled", () => {
  const graphSideEffects = new Map([["GET /y", "writes X"]]);
  const r = resolveApiHints(autoRecord, { curatedMap, autoMap, graphSideEffects, stripAll: true });
  assert.equal(r, undefined);
});

test("without stripAll, curated hints are returned (proves the flag is what strips)", () => {
  const r = resolveApiHints(curatedRecord, { curatedMap, autoMap, stripAll: false });
  assert.deepEqual(r, curatedMap["REQ-CURATED"]);
});

test("without stripAll, auto hints are returned when no curated entry", () => {
  const r = resolveApiHints(autoRecord, { curatedMap, autoMap, stripAll: false });
  assert.deepEqual(r, [autoMap.get("spec-1")]);
});

test("without stripAll, graph side-effects augment auto notes", () => {
  const graphSideEffects = new Map([["GET /y", "writes X"]]);
  const r = resolveApiHints(autoRecord, { curatedMap, autoMap, graphSideEffects, stripAll: false });
  assert.equal(r[0].notes, "auto writes X");
});

test("without stripAll and no hints at all, returns undefined", () => {
  const r = resolveApiHints(bareRecord, { curatedMap, autoMap, stripAll: false });
  assert.equal(r, undefined);
});

test("stripAllFromEnv maps the env flag", () => {
  assert.equal(stripAllFromEnv({}), false);
  assert.equal(stripAllFromEnv({ AQE_STRIP_APIHINTS: "" }), false);
  assert.equal(stripAllFromEnv({ AQE_STRIP_APIHINTS: "1" }), true);
});
