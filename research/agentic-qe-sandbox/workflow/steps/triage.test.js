import { test } from "node:test";
import assert from "node:assert/strict";
import { triage } from "./triage.js";

const REQUIREMENT = {
  id: "R-1",
  title: "does a thing",
  acceptanceCriteria: ["Given x", "Then y"],
  source: { file: "f.ts" },
  apiHints: [{ method: "GET", path: "/things", notes: "documented contract note" }],
};

const TEST_CASE = {
  id: "tc-1",
  requirementId: "R-1",
  title: "positive case",
  kind: "positive",
  actor: "primaryUser",
  requests: [{ name: "req1", method: "GET", pathTemplate: "/things", expect: { status: 200 } }],
};

function verdict(overrides = {}) {
  return { class: "real_defect", confidence: "high", requirementId: "R-1", rationale: "because", ...overrides };
}

test("triage de-duplicates identical runs in the prompt but keeps the true run count visible", async () => {
  const identicalRun = { pass: false, requests: [{ name: "req1", status: 500, ok: false, failures: ["boom"] }], output: "x" };
  const runs = [identicalRun, identicalRun, identicalRun];

  let capturedUser;
  const llm = {
    complete: async ({ user }) => {
      capturedUser = user;
      return verdict();
    },
  };

  await triage({ testCase: TEST_CASE, runs, requirement: REQUIREMENT, llm });

  assert.match(capturedUser, /Run results across 3 run\(s\)/);
  assert.match(capturedUser, /All 3 runs .* produced identical output; 1 distinct run shown/);
  // Only one copy of the run JSON should appear, not three.
  const occurrences = capturedUser.split('"failures"').length - 1;
  assert.equal(occurrences, 1);
});

test("triage keeps all runs verbatim (no dedupe note) when they genuinely differ", async () => {
  const runs = [
    { pass: false, requests: [{ name: "req1", status: 500, ok: false, failures: ["boom"] }], output: "x" },
    { pass: false, requests: [{ name: "req1", status: 503, ok: false, failures: ["different boom"] }], output: "y" },
  ];

  let capturedUser;
  const llm = {
    complete: async ({ user }) => {
      capturedUser = user;
      return verdict();
    },
  };

  await triage({ testCase: TEST_CASE, runs, requirement: REQUIREMENT, llm });

  assert.doesNotMatch(capturedUser, /produced identical output/);
  assert.match(capturedUser, /"boom"/);
  assert.match(capturedUser, /"different boom"/);
});

test("triage includes the requirement's apiHints in the prompt", async () => {
  let capturedUser;
  const llm = {
    complete: async ({ user }) => {
      capturedUser = user;
      return verdict();
    },
  };

  await triage({ testCase: TEST_CASE, runs: [{ pass: false, requests: [], output: "" }], requirement: REQUIREMENT, llm });

  assert.match(capturedUser, /documented contract note/);
});

test("triage forces the verdict's requirementId to match the requested requirement", async () => {
  const llm = { complete: async () => verdict({ requirementId: "WRONG-ID" }) };
  const result = await triage({ testCase: TEST_CASE, runs: [{ pass: false, requests: [], output: "" }], requirement: REQUIREMENT, llm });
  assert.equal(result.requirementId, "R-1");
});
