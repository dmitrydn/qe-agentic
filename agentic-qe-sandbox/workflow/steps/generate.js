/**
 * GENERATE (agent). From a requirement's acceptance criteria, emits one or
 * more framework-neutral TestCase objects via the LLM, including implied
 * negative/auth cases. Persists nothing — the orchestrator persists.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { render } from "../prompts/render.js";
import testcaseSchema from "../schemas/testcase.schema.json" with { type: "json" };

const __dirname_ = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = join(__dirname_, "..", "prompts");

const SYSTEM_TEMPLATE = readFileSync(join(PROMPTS_DIR, "generate.system.md"), "utf8");
const USER_TEMPLATE = readFileSync(join(PROMPTS_DIR, "generate.user.md"), "utf8");

const KNOWN_ACTORS = ["anonymous", "primaryUser", "secondaryUser"];
const MAX_PLACEHOLDER_REPAIR_RETRIES = 2;

// The test runner's only placeholder syntax is "{{name}}" (see
// generate.system.md). Anything matching angle-bracket placeholders is a
// structurally broken TestCase that would silently send a literal,
// useless string to the API — catch it deterministically rather than
// waiting for it to manifest as a confusing runtime failure.
const STRAY_PLACEHOLDER_RE = /<{1,2}[a-zA-Z_][^<>{}]*>{1,2}/;

function findStrayPlaceholders(testCases) {
  const hits = [];
  const visit = (value, path) => {
    if (typeof value === "string") {
      const match = value.match(STRAY_PLACEHOLDER_RE);
      if (match) hits.push(`${path}: "${value}"`);
    } else if (Array.isArray(value)) {
      value.forEach((v, i) => visit(v, `${path}[${i}]`));
    } else if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value)) visit(v, `${path}.${k}`);
    }
  };
  testCases.forEach((tc, i) => visit(tc, `testCases[${i}]`));
  return hits;
}

/**
 * @param {{ requirement: object, llm: { complete: Function }, actors?: string[] }} opts
 * @returns {Promise<object[]>}
 */
export async function generate({ requirement, llm, actors = KNOWN_ACTORS }) {
  const system = render(SYSTEM_TEMPLATE, {});
  let user = render(USER_TEMPLATE, {
    requirement,
    actorsList: actors.join(", "),
    schemaJson: JSON.stringify(testcaseSchema),
  });

  let testCases;
  for (let attempt = 0; ; attempt++) {
    testCases = await llm.complete({ system, user, schema: testcaseSchema, schemaName: "TestCase[]", phase: "generate" });
    const strays = findStrayPlaceholders(testCases);
    if (strays.length === 0) break;
    if (attempt >= MAX_PLACEHOLDER_REPAIR_RETRIES) {
      throw new Error(
        `generate(): LLM kept emitting invalid (non-"{{name}}") placeholders after ${attempt} repair attempt(s): ${strays.join("; ")}`
      );
    }
    user = `${user}\n\nYour previous response used invalid placeholder syntax in these locations: ${strays.join("; ")}. Remember: the ONLY valid placeholder syntax is double curly braces, e.g. "{{name}}" or "{{name + N}}" / "{{name - N}}" — never angle brackets, never any other style. Return corrected JSON only.`;
  }

  const seenIds = new Set();
  return testCases.map((tc, idx) => {
    if (tc.requirementId !== requirement.id) {
      throw new Error(
        `generate(): TestCase[${idx}] requirementId "${tc.requirementId}" does not match requested requirement "${requirement.id}"`
      );
    }
    let id = tc.id || `${requirement.id}-${idx + 1}`;
    if (seenIds.has(id)) id = `${id}-${idx + 1}`;
    seenIds.add(id);
    return { ...tc, id };
  });
}
