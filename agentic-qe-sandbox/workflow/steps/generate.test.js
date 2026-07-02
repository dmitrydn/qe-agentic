import { test } from "node:test";
import assert from "node:assert/strict";
import { generate } from "./generate.js";

const REQUIREMENT = {
  id: "R-1",
  title: "does a thing",
  acceptanceCriteria: ["Given x", "Then y"],
  source: { file: "f.ts" },
};

function goodTestCase() {
  return [
    {
      id: "tc-1",
      requirementId: "R-1",
      title: "positive case",
      kind: "positive",
      actor: "primaryUser",
      requests: [
        {
          name: "req1",
          method: "GET",
          pathTemplate: "/things",
          expect: { status: 200 },
        },
      ],
    },
  ];
}

function badTestCaseWithStrayPlaceholder(style) {
  const tc = goodTestCase();
  tc[0].requests[0].pathTemplate = "/things/{id}";
  tc[0].requests[0].pathParams = { id: style === "double" ? "<<thingId>>" : "<thingId>" };
  return tc;
}

test("generate returns test cases unchanged when the LLM uses correct {{name}} syntax", async () => {
  const llm = { complete: async () => goodTestCase() };
  const result = await generate({ requirement: REQUIREMENT, llm });
  assert.equal(result.length, 1);
  assert.equal(result[0].requirementId, "R-1");
});

test("generate self-heals when the LLM emits a stray <name> placeholder, retrying with a corrective message", async () => {
  const calls = [];
  let callCount = 0;
  const llm = {
    complete: async ({ user }) => {
      calls.push(user);
      callCount++;
      if (callCount === 1) return badTestCaseWithStrayPlaceholder("single");
      return goodTestCase();
    },
  };
  const result = await generate({ requirement: REQUIREMENT, llm });
  assert.equal(callCount, 2);
  assert.match(calls[1], /invalid placeholder syntax/);
  assert.equal(result[0].requirementId, "R-1");
});

test("generate self-heals from a <<name>> double-angle-bracket placeholder too", async () => {
  let callCount = 0;
  const llm = {
    complete: async () => {
      callCount++;
      return callCount === 1 ? badTestCaseWithStrayPlaceholder("double") : goodTestCase();
    },
  };
  const result = await generate({ requirement: REQUIREMENT, llm });
  assert.equal(callCount, 2);
  assert.equal(result[0].requirementId, "R-1");
});

test("generate throws after exhausting repair retries if the LLM never produces valid placeholder syntax", async () => {
  const llm = { complete: async () => badTestCaseWithStrayPlaceholder("single") };
  await assert.rejects(
    () => generate({ requirement: REQUIREMENT, llm }),
    /invalid \(non-"\{\{name\}\}"\) placeholders/
  );
});

test("generate throws when a TestCase's requirementId doesn't match the requested requirement", async () => {
  const llm = {
    complete: async () => {
      const tc = goodTestCase();
      tc[0].requirementId = "WRONG-ID";
      return tc;
    },
  };
  await assert.rejects(() => generate({ requirement: REQUIREMENT, llm }), /does not match requested requirement/);
});
