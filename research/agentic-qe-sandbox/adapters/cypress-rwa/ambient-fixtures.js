/**
 * Ambient identity fixtures for cypress-rwa test execution.
 *
 * Requirements reference identity/context values as {{user_id}},
 * {{other_user_id}}, {{unknown_id}}, etc. — "the authenticated user", "some
 * other user", "a non-existent id". These are test *fixtures*, not oracle
 * content: they say WHO/WHAT a request targets, never WHAT to assert. Seeding
 * them into the capture map (see executeTestCase's initialCaptures) lets those
 * references resolve, identically for every requirement and both oracle doses.
 *
 * Pure mapping from seeded data → fixtures, so it is unit-testable; the live
 * fetch wrapper lives in workflow-adapter.js.
 */

export const UNKNOWN_ID = "00000000-0000-0000-0000-000000000000";

/**
 * @param {{ actor: string, users?: object[], bankAccounts?: object[] }} input
 * @returns {Record<string, any>}
 */
export function buildAmbientFixtures({ actor, users = [], bankAccounts = [] }) {
  const fixtures = { unknown_id: UNKNOWN_ID };
  if (actor === "anonymous") return fixtures;

  const self = actor === "secondaryUser" ? users[1] : users[0];
  const other = actor === "secondaryUser" ? users[0] : users[1];

  if (self?.id != null) fixtures.user_id = self.id;
  if (other?.id != null) {
    fixtures.other_user_id = other.id;
    if (other.email) fixtures.other_user_email = other.email;
  }

  const selfId = self?.id;
  const otherBa = bankAccounts.find((b) => b?.id != null && b.userId != null && b.userId !== selfId);
  if (otherBa) fixtures.other_user_bank_account_id = otherBa.id;

  return fixtures;
}
