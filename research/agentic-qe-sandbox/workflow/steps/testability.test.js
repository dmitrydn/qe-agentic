import { test } from "node:test";
import assert from "node:assert/strict";
import { preChecks, scoreOf, verdictOf, stabilize, DIMENSION_IDS, BLOCKING_DIMENSION_IDS } from "./testability.js";
import { validateAgainstSchema, formatAjvErrors } from "../llm/json.js";
import testabilitySchema from "../schemas/testability.schema.json" with { type: "json" };

function dims(overrides = {}) {
  return DIMENSION_IDS.map((id) => ({
    id,
    rating: overrides[id] ?? "pass",
    finding: `${id} finding`,
  }));
}

// preChecks

test("preChecks: empty acceptanceCriteria is a hard gap", () => {
  const { hardGap, reason, flags } = preChecks({ acceptanceCriteria: [], apiHints: [] });
  assert.equal(hardGap, true);
  assert.match(reason, /empty/);
  assert.deepEqual(flags, []);
});

test("preChecks: missing acceptanceCriteria field is also a hard gap", () => {
  const { hardGap } = preChecks({});
  assert.equal(hardGap, true);
});

test("preChecks: no 'Then' criterion flags D1 but is not a hard gap", () => {
  const { hardGap, flags } = preChecks({
    acceptanceCriteria: ["Given a user is logged in", "When they click submit"],
    apiHints: [{ method: "GET", path: "/x" }],
  });
  assert.equal(hardGap, false);
  assert.ok(flags.some((f) => f.startsWith("D1")));
});

test("preChecks: absent apiHints flags D4 but is not a hard gap", () => {
  const { hardGap, flags } = preChecks({
    acceptanceCriteria: ["Given a user is logged in", "Then they see a welcome message"],
  });
  assert.equal(hardGap, false);
  assert.ok(flags.some((f) => f.startsWith("D4")));
});

test("preChecks: clean requirement has no flags and no hard gap", () => {
  const { hardGap, flags } = preChecks({
    acceptanceCriteria: ["Given a user is logged in", "Then they see a welcome message"],
    apiHints: [{ method: "GET", path: "/x" }],
  });
  assert.equal(hardGap, false);
  assert.deepEqual(flags, []);
});

// scoreOf

test("scoreOf: all pass scores 1", () => {
  assert.equal(scoreOf(dims()), 1);
});

test("scoreOf: all fail scores 0", () => {
  const allFail = DIMENSION_IDS.reduce((acc, id) => ({ ...acc, [id]: "fail" }), {});
  assert.equal(scoreOf(dims(allFail)), 0);
});

test("scoreOf: mixed ratings with default equal weights", () => {
  // 3 pass (1.0), 2 partial (0.5), 1 fail (0) -> (3*1 + 2*0.5 + 1*0) / 6
  const mixed = dims({ D4: "partial", D5: "partial", D6: "fail" });
  const score = scoreOf(mixed);
  assert.ok(Math.abs(score - (3 + 1) / 6) < 1e-9);
});

test("scoreOf: custom weights change the result", () => {
  const mixed = dims({ D1: "fail" });
  const equalWeighted = scoreOf(mixed);
  const heavilyWeightedOnD1 = scoreOf(mixed, { D1: 100 });
  assert.ok(heavilyWeightedOnD1 < equalWeighted);
});

// verdictOf

test("verdictOf: a blocking dimension failing forces untestable even with a high score", () => {
  const dimensions = dims({ D4: "fail" });
  const score = scoreOf(dimensions);
  const { verdict, blockedBy } = verdictOf(dimensions, score, 0.1);
  assert.equal(verdict, "untestable");
  assert.deepEqual(blockedBy, ["D4"]);
});

test("verdictOf: a non-blocking dimension failing does not force untestable", () => {
  const dimensions = dims({ D3: "fail" });
  const score = scoreOf(dimensions);
  const { verdict, blockedBy } = verdictOf(dimensions, score, 0.5);
  assert.notEqual(verdict, "untestable");
  assert.deepEqual(blockedBy, []);
});

test("verdictOf: with no clarify list, a non-blocking fail does not cap — score decides", () => {
  // 5 pass + 1 fail (non-blocking) = 5/6 ≈ 0.83, above 0.7. One weak dimension
  // can't hard-flip a borderline verdict on temp-0 noise.
  const dimensions = dims({ D6: "fail" });
  const score = scoreOf(dimensions);
  assert.ok(score >= 0.7, `expected score >= 0.7, got ${score}`);
  assert.equal(verdictOf(dimensions, score, 0.7).verdict, "testable");
});

test("verdictOf: a fail on a clarify-on-fail dimension forces needs_clarification even at a high score", () => {
  // The real signal: D2 fail = the acceptance criteria are ambiguous, so the
  // gate must ask the author — exactly the ambiguous-link-expiry case.
  const dimensions = dims({ D2: "fail" });
  const score = scoreOf(dimensions);
  assert.ok(score >= 0.7);
  assert.equal(
    verdictOf(dimensions, score, 0.7, BLOCKING_DIMENSION_IDS, { clarifyOnFailIds: ["D2"] }).verdict,
    "needs_clarification"
  );
});

test("verdictOf: a fail on a NON-listed dimension stays testable under a clarify list", () => {
  const dimensions = dims({ D6: "fail" });
  const score = scoreOf(dimensions);
  assert.equal(
    verdictOf(dimensions, score, 0.7, BLOCKING_DIMENSION_IDS, { clarifyOnFailIds: ["D2"] }).verdict,
    "testable"
  );
});

test("verdictOf: strictFail caps on any non-blocking fail, regardless of the clarify list", () => {
  const dimensions = dims({ D6: "fail" });
  const score = scoreOf(dimensions);
  assert.equal(
    verdictOf(dimensions, score, 0.7, BLOCKING_DIMENSION_IDS, { strictFail: true }).verdict,
    "needs_clarification"
  );
});

test("verdictOf: score below threshold yields needs_clarification", () => {
  const dimensions = dims({ D5: "partial", D6: "partial" });
  const score = scoreOf(dimensions); // < 1
  const { verdict } = verdictOf(dimensions, score, 0.95);
  assert.equal(verdict, "needs_clarification");
});

test("verdictOf: score exactly at threshold is testable (strict less-than rule)", () => {
  const dimensions = dims();
  const { verdict } = verdictOf(dimensions, 0.7, 0.7);
  assert.equal(verdict, "testable");
});

test("verdictOf: clean case with high score is testable", () => {
  const dimensions = dims();
  const score = scoreOf(dimensions);
  const { verdict, blockedBy } = verdictOf(dimensions, score, 0.7);
  assert.equal(verdict, "testable");
  assert.deepEqual(blockedBy, []);
});

test("verdictOf: respects a custom blockingIds list", () => {
  const dimensions = dims({ D2: "fail" });
  const score = scoreOf(dimensions);
  const { verdict, blockedBy } = verdictOf(dimensions, score, 0.1, ["D2"]);
  assert.equal(verdict, "untestable");
  assert.deepEqual(blockedBy, ["D2"]);
});

// stabilize (N-run combination)

const mkA = (verdict, score, clarifications = []) => ({ verdict, score, clarifications, dimensions: dims(), blockedBy: [] });

test("stabilize: majority verdict, median score, union of clarifications", () => {
  const out = stabilize([
    mkA("needs_clarification", 0.67, ["q1"]),
    mkA("testable", 0.75, ["q2"]),
    mkA("needs_clarification", 0.67, ["q1", "q3"]),
  ]);
  assert.equal(out.verdict, "needs_clarification"); // 2 vs 1
  assert.equal(out.score, 0.67); // median of [0.67, 0.67, 0.75]
  assert.deepEqual(out.clarifications.sort(), ["q1", "q2", "q3"]);
  assert.equal(out.stability.runs, 3);
  assert.equal(out.stability.agreed, false);
});

test("stabilize: a tie breaks toward the more conservative verdict", () => {
  const out = stabilize([mkA("testable", 0.75), mkA("needs_clarification", 0.67)]);
  assert.equal(out.verdict, "needs_clarification");
});

test("stabilize: full agreement is flagged and the verdict is preserved", () => {
  const out = stabilize([mkA("testable", 0.83), mkA("testable", 0.92)]);
  assert.equal(out.verdict, "testable");
  assert.equal(out.stability.agreed, true);
});

test("stabilize: a single assessment passes through unchanged", () => {
  const a = mkA("testable", 0.9);
  assert.equal(stabilize([a]), a);
});

// schema sanity

test("testability.schema.json: a well-formed LLM output validates", () => {
  const sample = {
    requirementId: "REQ-1",
    dimensions: dims(),
    clarifications: [],
    assumptions: [],
  };
  const { valid, errors } = validateAgainstSchema(sample, testabilitySchema);
  assert.equal(valid, true, valid ? "" : formatAjvErrors(errors));
});

test("testability.schema.json: rejects a payload that includes a code-derived field", () => {
  const sample = {
    requirementId: "REQ-1",
    dimensions: dims(),
    clarifications: [],
    assumptions: [],
    score: 1, // the LLM must never emit this — code derives it
  };
  const { valid } = validateAgainstSchema(sample, testabilitySchema);
  assert.equal(valid, false);
});

test("testability.schema.json: rejects fewer than 6 dimensions", () => {
  const sample = {
    requirementId: "REQ-1",
    dimensions: dims().slice(0, 5),
    clarifications: [],
    assumptions: [],
  };
  const { valid } = validateAgainstSchema(sample, testabilitySchema);
  assert.equal(valid, false);
});

test("BLOCKING_DIMENSION_IDS exports D1 and D4", () => {
  assert.deepEqual(BLOCKING_DIMENSION_IDS, ["D1", "D4"]);
});
