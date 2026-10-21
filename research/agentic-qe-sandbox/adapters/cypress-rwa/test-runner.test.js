import { test } from "node:test";
import assert from "node:assert/strict";
import { getByJsonPath, resolveTemplate, buildPath, buildQueryString, executeTestCase, checkJsonPathAssertion } from "./test-runner.js";

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

test("getByJsonPath supports negative indices (last element)", () => {
  assert.equal(getByJsonPath({ comments: [{ c: "a" }, { c: "b" }] }, "comments[-1].c"), "b");
  assert.equal(getByJsonPath({ a: [1, 2, 3] }, "$.a[-2]"), 2);
});

test("getByJsonPath supports [?(@.field OP value)] filter expressions", () => {
  const body = { results: [{ requestStatus: "pending" }, { requestStatus: "complete" }, { requestStatus: "pending" }] };
  assert.deepEqual(getByJsonPath(body, "results[?(@.requestStatus!='pending')]"), [{ requestStatus: "complete" }]);
  assert.deepEqual(getByJsonPath(body, "$.results[?(@.requestStatus=='pending')]"), [
    { requestStatus: "pending" },
    { requestStatus: "pending" },
  ]);
  // numeric comparison
  assert.deepEqual(getByJsonPath({ xs: [{ n: 1 }, { n: 9 }] }, "xs[?(@.n>=5)]"), [{ n: 9 }]);
});

test("eq compares arrays/objects by value (filter 'no counter-example' -> eq [])", () => {
  const f1 = [];
  checkJsonPathAssertion({ results: [] }, { path: "results", op: "eq", value: [] }, f1, {});
  assert.equal(f1.length, 0);
  const f2 = [];
  checkJsonPathAssertion({ results: [{ x: 1 }] }, { path: "results", op: "eq", value: [] }, f2, {});
  assert.equal(f2.length, 1);
  const f3 = [];
  checkJsonPathAssertion({ o: { a: 1, b: 2 } }, { path: "o", op: "eq", value: { a: 1, b: 2 } }, f3, {});
  assert.equal(f3.length, 0);
});

test("isType integer accepts integer-valued numbers, rejects floats", () => {
  const fint = [];
  checkJsonPathAssertion({ n: 150953 }, { path: "n", op: "isType", value: "integer" }, fint, {});
  assert.equal(fint.length, 0);
  const ffloat = [];
  checkJsonPathAssertion({ n: 1.5 }, { path: "n", op: "isType", value: "integer" }, ffloat, {});
  assert.equal(ffloat.length, 1);
});

test("buildPath resolves {{capture}} references embedded in the path template", () => {
  assert.equal(buildPath("/users/{{user_id}}", {}, { user_id: "u1" }), "/users/u1");
  assert.equal(buildPath("/users/{{user_id}}/txns", {}, { user_id: "u9" }), "/users/u9/txns");
});

test("executeTestCase seeds initialCaptures so {{user_id}} resolves in the path", async () => {
  let calledUrl;
  const original = globalThis.fetch;
  globalThis.fetch = async (url) => {
    calledUrl = url;
    return { status: 200, text: async () => JSON.stringify({ user: { id: "u1", balance: 100 } }) };
  };
  try {
    const tc = {
      actor: "primaryUser",
      requests: [{ name: "get self", method: "GET", pathTemplate: "/users/{{user_id}}", expect: { status: 200 } }],
    };
    const r = await executeTestCase(tc, { baseUrl: "http://x", authContext: {}, initialCaptures: { user_id: "u1" } });
    assert.equal(calledUrl, "http://x/users/u1");
    assert.equal(r.pass, true);
  } finally {
    globalThis.fetch = original;
  }
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
