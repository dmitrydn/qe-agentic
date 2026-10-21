import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAmbientFixtures, UNKNOWN_ID } from "./ambient-fixtures.js";

const users = [
  { id: "u1", username: "alice", email: "alice@example.com" },
  { id: "u2", username: "bob", email: "bob@example.com" },
];
const bankAccounts = [
  { id: "ba1", userId: "u1" },
  { id: "ba2", userId: "u2" },
];

test("primaryUser: self=u1, other=u2, other bank account belongs to a different user", () => {
  const f = buildAmbientFixtures({ actor: "primaryUser", users, bankAccounts });
  assert.equal(f.user_id, "u1");
  assert.equal(f.other_user_id, "u2");
  assert.equal(f.other_user_email, "bob@example.com");
  assert.equal(f.other_user_bank_account_id, "ba2");
  assert.equal(f.unknown_id, UNKNOWN_ID);
});

test("secondaryUser: self/other swap", () => {
  const f = buildAmbientFixtures({ actor: "secondaryUser", users, bankAccounts });
  assert.equal(f.user_id, "u2");
  assert.equal(f.other_user_id, "u1");
  assert.equal(f.other_user_bank_account_id, "ba1");
});

test("anonymous: only unknown_id, no identity leaked", () => {
  const f = buildAmbientFixtures({ actor: "anonymous", users, bankAccounts });
  assert.deepEqual(f, { unknown_id: UNKNOWN_ID });
});

test("degrades gracefully with no seeded data", () => {
  const f = buildAmbientFixtures({ actor: "primaryUser" });
  assert.equal(f.unknown_id, UNKNOWN_ID);
  assert.ok(!("user_id" in f));
});
