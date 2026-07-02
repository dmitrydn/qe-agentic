import { test } from "node:test";
import assert from "node:assert/strict";
import { getByJsonPath, resolveTemplate, buildPath, buildQueryString, executeTestCase } from "./test-runner.js";

function stubFetch(responseBody) {
  const original = globalThis.fetch;
  globalThis.fetch = async () => ({
    status: 200,
    text: async () => JSON.stringify(responseBody),
  });
  return () => {
    globalThis.fetch = original;
  };
}

test("getByJsonPath supports dot paths, bracket indices, and an optional leading $.", () => {
  const body = { results: [{ id: "a" }, { id: "b" }], count: 2 };
  assert.equal(getByJsonPath(body, "results[0].id"), "a");
  assert.equal(getByJsonPath(body, "$.results[1].id"), "b");
  assert.equal(getByJsonPath(body, "count"), 2);
  assert.equal(getByJsonPath(body, "missing.path"), undefined);
});

test("resolveTemplate substitutes a whole-string {{name}} preserving type", () => {
  assert.equal(resolveTemplate("{{id}}", { id: "abc" }), "abc");
  assert.equal(resolveTemplate("{{count}}", { count: 5 }), 5);
});

test("resolveTemplate stringifies partial-match {{name}} occurrences", () => {
  assert.equal(resolveTemplate("user-{{id}}-x", { id: 7 }), "user-7-x");
});

test("resolveTemplate supports {{name + N}} / {{name - N}} arithmetic", () => {
  assert.equal(resolveTemplate("{{balance + 5000}}", { balance: 100 }), 5100);
  assert.equal(resolveTemplate("{{balance - 5000}}", { balance: 100 }), -4900);
});

test("resolveTemplate deep-substitutes through arrays and objects", () => {
  const result = resolveTemplate({ a: "{{x}}", b: ["{{y}}", 3] }, { x: "X", y: "Y" });
  assert.deepEqual(result, { a: "X", b: ["Y", 3] });
});

test("buildPath fills {param} segments from pathParams (resolved through captures)", () => {
  const path = buildPath("/widgets/{id}", { id: "{{widgetId}}" }, { widgetId: "abc123" });
  assert.equal(path, "/widgets/abc123");
});

test("buildPath throws when a required pathParam is missing", () => {
  assert.throws(() => buildPath("/widgets/{id}", {}, {}), /Missing pathParam "id"/);
});

test("buildQueryString builds an encoded querystring or empty string", () => {
  assert.equal(buildQueryString(undefined, {}), "");
  assert.equal(buildQueryString({ page: 2, q: "a b" }, {}), "?page=2&q=a+b");
});

// JSON has no `undefined`; a TestCase asserting "this field is absent" (the
// JS/Chai idiom `expect(x).to.eq(undefined)`, which the real cypress-rwa
// spec uses for transaction.requestStatus on a payment) can only encode
// that as `value: null`. This must NOT fail just because a genuinely
// missing key decodes to `undefined`, not `null` — that would be a false
// positive caused by a JSON-encoding gap, not a real defect.
test("eq(null) passes when the asserted field is genuinely absent from the response", async () => {
  const restore = stubFetch({ transaction: { id: "abc", status: "complete" } });
  try {
    const result = await executeTestCase(
      {
        requests: [
          {
            name: "create",
            method: "POST",
            pathTemplate: "/transactions",
            expect: { status: 200, jsonPath: [{ path: "transaction.requestStatus", op: "eq", value: null }] },
          },
        ],
      },
      { baseUrl: "http://example.test", authContext: {} }
    );
    assert.equal(result.pass, true);
  } finally {
    restore();
  }
});

test("eq(null) still fails when the field is present with a real value", async () => {
  const restore = stubFetch({ transaction: { id: "abc", requestStatus: "pending" } });
  try {
    const result = await executeTestCase(
      {
        requests: [
          {
            name: "create",
            method: "POST",
            pathTemplate: "/transactions",
            expect: { status: 200, jsonPath: [{ path: "transaction.requestStatus", op: "eq", value: null }] },
          },
        ],
      },
      { baseUrl: "http://example.test", authContext: {} }
    );
    assert.equal(result.pass, false);
    assert.match(result.requests[0].failures[0], /expected === null, got "pending"/);
  } finally {
    restore();
  }
});
