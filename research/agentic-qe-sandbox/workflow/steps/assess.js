/**
 * ASSESS (agent). The Analyst-Designer's first action: rate a requirement's
 * testability before any test is generated from it. Mirrors generate.js for
 * prompt wiring, but the model only emits per-dimension judgement — score,
 * verdict, and the gating decision are computed by testability.js, never
 * trusted from the model (same hybrid contract as generate/triage).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render } from "../prompts/render.js";
import testabilitySchema from "../schemas/testability.schema.json" with { type: "json" };
import { preChecks, scoreOf, verdictOf, stabilize, DIMENSION_IDS, BLOCKING_DIMENSION_IDS } from "./testability.js";

const __dirname_ = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname_, "..", "prompts");

const SYSTEM_TEMPLATE = readFileSync(join(PROMPTS_DIR, "assess.system.md"), "utf8");
const USER_TEMPLATE = readFileSync(join(PROMPTS_DIR, "assess.user.md"), "utf8");

const KNOWN_ACTORS = ["anonymous", "primaryUser", "secondaryUser"];

/**
 * @param {{ requirement: object, llm: { complete: Function }, config: { testabilityThreshold: number, testabilityWeights?: Record<string, number> }, actors?: string[] }} opts
 * @returns {Promise<object>}
 */
export async function assess({ requirement, llm, config, actors = KNOWN_ACTORS }) {
  const pre = preChecks(requirement);

  if (pre.hardGap) {
    // No acceptance criteria at all: there is nothing for the LLM to judge,
    // so every dimension is unratable — call it a fail across the board
    // (zero LLM spend) and let verdictOf derive the same untestable verdict
    // it would for any other blocking failure.
    const dimensions = DIMENSION_IDS.map((id) => ({ id, rating: "fail", finding: pre.reason }));
    const score = scoreOf(dimensions, config.testabilityWeights);
    const { verdict, blockedBy } = verdictOf(dimensions, score, config.testabilityThreshold, BLOCKING_DIMENSION_IDS, { strictFail: config.testabilityStrictFail, clarifyOnFailIds: config.testabilityClarifyOnFail });
    return {
      requirementId: requirement.id,
      dimensions,
      clarifications: [`${requirement.id} has no acceptance criteria — what should this requirement actually verify?`],
      assumptions: [],
      score,
      verdict,
      blockedBy,
    };
  }

  const system = render(SYSTEM_TEMPLATE, {});
  const user = render(USER_TEMPLATE, {
    requirement,
    actorsList: actors.join(", "),
    preCheckFlags: pre.flags,
    schemaJson: JSON.stringify(testabilitySchema),
  });

  const raw = await llm.complete({
    system,
    user,
    schema: testabilitySchema,
    schemaName: "Testability",
    phase: "assess",
  });

  if (raw.requirementId !== requirement.id) {
    raw.requirementId = requirement.id;
  }

  const score = scoreOf(raw.dimensions, config.testabilityWeights);
  const { verdict, blockedBy } = verdictOf(raw.dimensions, score, config.testabilityThreshold, BLOCKING_DIMENSION_IDS, { strictFail: config.testabilityStrictFail, clarifyOnFailIds: config.testabilityClarifyOnFail });

  return { ...raw, score, verdict, blockedBy };
}

/**
 * assess() repeated config.testabilityRuns times, combined by stabilize()
 * (majority verdict / median score). n=1 is a plain single assess() with no
 * extra cost. Use this from the Phase-A scorer and the gate so borderline
 * verdicts don't flip on temp-0 noise.
 * @param {{ requirement: object, llm: { complete: Function }, config: object, actors?: string[] }} opts
 * @returns {Promise<object>}
 */
export async function assessStable({ requirement, llm, config, actors = KNOWN_ACTORS }) {
  const n = Math.max(1, config.testabilityRuns ?? 1);
  if (n === 1) return assess({ requirement, llm, config, actors });
  const runs = [];
  for (let i = 0; i < n; i++) runs.push(await assess({ requirement, llm, config, actors }));
  return stabilize(runs);
}
