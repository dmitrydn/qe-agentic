/**
 * Hermetic test for the mechanical apiHints extractor. Reads the real backend
 * source in-repo at config.appRoot — no running app required.
 *
 * Covers Fix 2 (enforcement-aware constraint extraction, AQE_GROUNDING=1):
 * POST /users and PATCH /users/:userId register `userFieldsValidator` as bare
 * middleware (never wrapped in validateMiddleware(...), so its .exists()
 * rules are declared but never enforced — the route also registers
 * `isUserValidator`, wrapped in validateMiddleware(...), which does run).
 * Pre-fix, extractApiRoutes() credits both validators' fields to the route;
 * with the flag on, only the enforced one should contribute.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { extractApiRoutes } from "./extract-api-hints.js";

const __dirname_ = dirname(fileURLToPath(import.meta.url));
const SANDBOX_ROOT = join(__dirname_, "../..");
const REPO_ROOT = join(SANDBOX_ROOT, "..");
const config = JSON.parse(readFileSync(join(__dirname_, "config.json"), "utf8"));
const appRoot = join(REPO_ROOT, config.appRoot);

function postUsersRoute(routes) {
  return routes.find((r) => r.method === "POST" && r.path === "/users");
}

function patchUserByIdRoute(routes) {
  return routes.find((r) => r.method === "PATCH" && r.path === "/users/:userId");
}

test("flag off (default): POST /users still reports firstName as must-exist (baseline, byte-identical)", () => {
  delete process.env.AQE_GROUNDING;
  const route = postUsersRoute(extractApiRoutes({ appRoot }));
  const firstName = route.fields.find((f) => f.name === "firstName");
  assert.ok(firstName, "expected firstName in baseline extraction");
  assert.equal(firstName.type, "any(must exist)");
  assert.equal(firstName.validator, "userFieldsValidator");
});

test("AQE_GROUNDING=1: POST /users no longer reports firstName as must-exist (userFieldsValidator is unenforced bare middleware)", () => {
  process.env.AQE_GROUNDING = "1";
  try {
    const route = postUsersRoute(extractApiRoutes({ appRoot }));
    const fromUnenforced = route.fields.filter((f) => f.validator === "userFieldsValidator");
    assert.deepEqual(fromUnenforced, [], "userFieldsValidator is never wrapped in validateMiddleware(...) — must not contribute fields");
    assert.equal(route.fields.find((f) => f.name === "firstName" && f.type === "any(must exist)"), undefined);
  } finally {
    delete process.env.AQE_GROUNDING;
  }
});

test("AQE_GROUNDING=1: POST /users still reports isUserValidator's fields (enforced via validateMiddleware)", () => {
  process.env.AQE_GROUNDING = "1";
  try {
    const route = postUsersRoute(extractApiRoutes({ appRoot }));
    const firstName = route.fields.find((f) => f.name === "firstName");
    assert.ok(firstName, "isUserValidator's firstName should still be extracted");
    assert.equal(firstName.validator, "isUserValidator");
    assert.equal(firstName.optional, true);
  } finally {
    delete process.env.AQE_GROUNDING;
  }
});

test("AQE_GROUNDING=1: PATCH /users/:userId drops userFieldsValidator's fields too, keeps isUserValidator's", () => {
  process.env.AQE_GROUNDING = "1";
  try {
    const route = patchUserByIdRoute(extractApiRoutes({ appRoot }));
    assert.ok(route, "expected PATCH /users/:userId to be extracted");
    const fromUnenforced = route.fields.filter((f) => f.validator === "userFieldsValidator");
    assert.deepEqual(fromUnenforced, []);
    assert.ok(route.fields.some((f) => f.validator === "isUserValidator"));
  } finally {
    delete process.env.AQE_GROUNDING;
  }
});
