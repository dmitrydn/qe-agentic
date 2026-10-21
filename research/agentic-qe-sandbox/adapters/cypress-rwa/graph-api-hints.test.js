/**
 * Hermetic test for the graph-L1 side-effect augmenter. Reads the real backend
 * source (in-repo at config.appRoot) and a checked-in graph fixture built by
 * `graphify update <backend> --no-cluster` — no graphify install, API key, or
 * running app required. Proves the core claim: side-effects are derived
 * PER-ENDPOINT, so a mutating POST and a read-only GET on the same path get
 * different notes.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { buildGraphSideEffectsBySpecId } from "./graph-api-hints.js";

const __dirname_ = dirname(fileURLToPath(import.meta.url));
const SANDBOX_ROOT = join(__dirname_, "../..");
const REPO_ROOT = join(SANDBOX_ROOT, "..");
const config = JSON.parse(readFileSync(join(__dirname_, "config.json"), "utf8"));
const appRoot = join(REPO_ROOT, config.appRoot);
const graphPath = join(__dirname_, "__fixtures__", "cypress-backend-graph.json");

const notes = buildGraphSideEffectsBySpecId({ appRoot, graphPath });

test("POST /transactions is flagged as a balance-mutating write", () => {
  const note = notes.get("POST /transactions");
  assert.ok(note, "expected a side-effect note for POST /transactions");
  assert.match(note, /mutates persisted state/);
  assert.match(note, /createTransaction/);
  assert.match(note, /debitPayAppBalance/);
  assert.match(note, /creditPayAppBalance/);
  assert.match(note, /pay-app balance/);
});

test("GET /transactions on the SAME path gets NO note (never mislabelled as mutating)", () => {
  // Precision-over-recall: notes are emitted only for graph-proven writes, so a
  // read endpoint is simply absent — and crucially is never tagged as mutating.
  assert.equal(notes.get("GET /transactions"), undefined);
});

test("GET /transactions/:transactionId gets no note", () => {
  assert.equal(notes.get("GET /transactions/:transactionId"), undefined);
});

test("GET /users gets NO note — in-memory removeUserFromResults must not be called a persisted write", () => {
  assert.equal(notes.get("GET /users"), undefined);
});

test("every emitted note is a positive write claim (precision over recall)", () => {
  for (const [specId, note] of notes) {
    assert.match(note, /mutates persisted state/, `${specId} should only carry write notes`);
  }
});

test("POST /users IS a persisted write (createUser -> saveUser sink)", () => {
  const note = notes.get("POST /users");
  assert.ok(note);
  assert.match(note, /mutates persisted state/);
  assert.match(note, /saveUser/);
});

test("notes are deterministic — only EXTRACTED graph data, no inference", () => {
  const again = buildGraphSideEffectsBySpecId({ appRoot, graphPath });
  assert.deepEqual([...again.entries()].sort(), [...notes.entries()].sort());
});
