import { test } from "node:test";
import assert from "node:assert/strict";
import { assess } from "./assess.js";
import { DIMENSION_IDS } from "./testability.js";

const REQUIREMENT = {
  id: "R-1",
  title: "expires links after 24 hours",
  acceptanceCriteria: ["Given a generated link", "Then it is rejected after 24 hours"],
  source: { file: "f.ts" },
  apiHints: [{ method: "GET", path: "/links/:id", notes: "documented contract note" }],
};

const CONFIG = { testabilityThreshold: 0.7, testabilityWeights: {} };

function allPassDimensions(overrides = {}) {
  return DIMENSION_IDS.map((id) => ({ id, rating: overrides[id] ?? "pass", finding: `${id} ok` }));
}

function rawAssessment(overrides = {}) {
  return {
    requirementId: "R-1",
    dimensions: allPassDimensions(overrides.dimensions),
    clarifications: overrides.clarifications ?? [],
    assumptions: overrides.assumptions ?? [],
  };
}

test("assess: a hard structural gap (no acceptance criteria) short-circuits with no LLM call", async () => {
  let called = false;
  const llm = { complete: async () => { called = true; return rawAssessment(); } };
  const requirement = { id: "R-2", title: "nothing here", acceptanceCriteria: [], source: { file: "f.ts" } };

  const result = await assess({ requirement, llm, config: CONFIG });

  assert.equal(called, false);
  assert.equal(result.verdict, "untestable");
  assert.deepEqual(result.blockedBy, ["D1", "D4"]);
  assert.equal(result.requirementId, "R-2");
  assert.equal(result.score, 0);
  assert.ok(result.clarifications.length > 0);
});

test("assess: score and verdict are code-derived, not taken from the LLM", async () => {
  // The mocked LLM tries to sneak its own score/verdict in — assess must ignore them.
  const llm = {
    complete: async () => ({ ...rawAssessment(), score: 0.01, verdict: "untestable", blockedBy: ["D1"] }),
  };

  const result = await assess({ requirement: REQUIREMENT, llm, config: CONFIG });

  assert.equal(result.score, 1);
  assert.equal(result.verdict, "testable");
  assert.deepEqual(result.blockedBy, []);
});

test("assess: a blocking dimension failing forces untestable even with high ratings elsewhere", async () => {
  const llm = { complete: async () => rawAssessment({ dimensions: { D4: "fail" } }) };

  const result = await assess({ requirement: REQUIREMENT, llm, config: CONFIG });

  assert.equal(result.verdict, "untestable");
  assert.deepEqual(result.blockedBy, ["D4"]);
});

test("assess: a low aggregate score below threshold yields needs_clarification", async () => {
  const llm = {
    complete: async () => rawAssessment({ dimensions: { D2: "partial", D3: "partial", D5: "fail" } }),
  };

  const result = await assess({ requirement: REQUIREMENT, llm, config: CONFIG });

  assert.equal(result.verdict, "needs_clarification");
  assert.ok(result.score < CONFIG.testabilityThreshold);
});

test("assess: forces the assessment's requirementId to match the requested requirement", async () => {
  const llm = { complete: async () => rawAssessment({ requirementId: "WRONG-ID" }) };
  const result = await assess({ requirement: REQUIREMENT, llm, config: CONFIG });
  assert.equal(result.requirementId, "R-1");
});

test("assess: passes deterministic pre-check flags into the prompt for the LLM to factor in", async () => {
  let capturedUser;
  const llm = {
    complete: async ({ user }) => {
      capturedUser = user;
      return rawAssessment();
    },
  };
  const noOracleReq = {
    id: "R-3",
    title: "vague",
    acceptanceCriteria: ["Given a user submits the form"],
    source: { file: "f.ts" },
  };

  await assess({ requirement: noOracleReq, llm, config: CONFIG });

  assert.match(capturedUser, /no 'Then …' criterion found/);
  assert.match(capturedUser, /no apiHints/);
});

test("assess: includes the requirement's apiHints in the prompt", async () => {
  let capturedUser;
  const llm = {
    complete: async ({ user }) => {
      capturedUser = user;
      return rawAssessment();
    },
  };

  await assess({ requirement: REQUIREMENT, llm, config: CONFIG });

  assert.match(capturedUser, /documented contract note/);
});

test("assess: custom testabilityWeights affect the score and therefore the verdict", async () => {
  const llm = { complete: async () => rawAssessment({ dimensions: { D6: "fail" } }) };

  const equalWeighted = await assess({ requirement: REQUIREMENT, llm, config: CONFIG });
  const heavilyWeightedOnD6 = await assess({
    requirement: REQUIREMENT,
    llm,
    config: { testabilityThreshold: 0.7, testabilityWeights: { D6: 100 } },
  });

  assert.ok(heavilyWeightedOnD6.score < equalWeighted.score);
});
