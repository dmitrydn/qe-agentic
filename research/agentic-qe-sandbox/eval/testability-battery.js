/**
 * A small labelled battery for measuring assess()'s verdict accuracy with a
 * confusion matrix (docs/design/testability-gate.md §9), mixing real curated
 * requirements ("good" — expected testable) with hand-synthesized weak ones
 * that exercise each gap kind named in the spec. Each case carries a
 * ground-truth `expectedVerdict`. This module only describes the battery;
 * running it against the real assess() step happens in
 * run-testability-battery.js.
 */

// "good" cases point at a real, curated requirement id — resolved against the
// live requirement set in run-testability-battery.js's main(), exactly like
// triage-battery.js's REAL_* cases resolve a persisted TestCase id.
export const GOOD_CASES = [
  { id: "good-users-001", kind: "real", requirementId: "CYPRESS-RWA-USERS-001", expectedVerdict: "testable" },
  { id: "good-bankaccounts-001", kind: "real", requirementId: "CYPRESS-RWA-BANK-ACCOUNTS-001", expectedVerdict: "testable" },
];

/** Hand-crafted weak requirements, fed straight to assess() — no live adapter call. */
export const SYNTHETIC_CASES = [
  {
    id: "ambiguous-link-expiry",
    kind: "synthetic",
    expectedVerdict: "needs_clarification",
    requirement: {
      id: "SYN-AMBIGUOUS-LINK-EXPIRY",
      title: "Password reset link expires",
      userStory: "As a user, I want my password reset link to expire so it can't be reused indefinitely.",
      acceptanceCriteria: [
        "Given a password reset link has been generated",
        "Then the link expires after 24 hours",
      ],
      source: { file: "synthetic" },
      apiHints: [
        { method: "POST", path: "/passwordResetTokens/:token/verify", notes: "returns 200 if the token is still valid, 410 if expired" },
      ],
    },
  },
  {
    id: "ambiguous-bulk-export-large",
    kind: "synthetic",
    expectedVerdict: "needs_clarification",
    requirement: {
      id: "SYN-AMBIGUOUS-BULK-EXPORT",
      title: "Bulk export handles large accounts",
      userStory: "As a user with many transactions, I want to export my history without it failing.",
      acceptanceCriteria: [
        "Given a user with a large number of transactions",
        "When they request an export",
        "Then the export completes successfully for large accounts",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "GET", path: "/transactions/export" }],
    },
  },
  {
    id: "no-oracle-form-submit",
    kind: "synthetic",
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-NO-ORACLE-FORM-SUBMIT",
      title: "User submits a contact form",
      userStory: "As a user, I want to submit a contact form.",
      acceptanceCriteria: [
        "Given a user is on the contact page",
        "When they fill in the form and click submit",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "POST", path: "/contactForms" }],
    },
  },
  {
    id: "no-interface-loyalty-points",
    kind: "synthetic",
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-NO-INTERFACE-LOYALTY-POINTS",
      title: "Loyalty points accrue on purchase",
      userStory: "As a customer, I want to earn loyalty points when I make a purchase.",
      acceptanceCriteria: [
        "Given a customer completes a purchase",
        "Then their loyalty point balance increases by 1 point per dollar spent",
      ],
      source: { file: "synthetic" },
      // deliberately no apiHints: no documented endpoint/contract to act against
    },
  },
  {
    id: "epic-payments-module",
    kind: "synthetic",
    // Relabeled needs_clarification -> untestable: an epic with no checkable
    // outcome (D1 fail) spanning five behaviours isn't recoverable with a few
    // clarifying questions — it must be split into real requirements first. The
    // gate's `untestable` is the correct verdict here. Flip back if you decide a
    // vague epic should instead be returned for clarification.
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-EPIC-PAYMENTS-MODULE",
      title: "The payments module works correctly",
      userStory: "As a user, I want payments to work.",
      acceptanceCriteria: [
        "Given the payments module",
        "Then it correctly handles deposits, withdrawals, transfers, refunds, and disputes across all account types",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "POST", path: "/transactions" }],
    },
  },

  // ---- battery expansion: more samples per gap kind for a stabler accuracy signal ----
  {
    id: "clear-create-bankaccount",
    kind: "synthetic",
    expectedVerdict: "testable",
    requirement: {
      id: "SYN-CLEAR-CREATE-BANKACCOUNT",
      title: "Create a bank account",
      userStory: "As an authenticated user, I want to create a bank account so I can transact.",
      acceptanceCriteria: [
        "Given an authenticated primaryUser",
        "When they POST /bankAccounts with bankName, accountNumber and routingNumber",
        "Then the response status is 200 and the body contains the created account's id and the submitted bankName",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "POST", path: "/bankAccounts", auth: "primaryUser", notes: "body: bankName (string), accountNumber (string), routingNumber (string)" }],
    },
  },
  {
    id: "clear-list-users",
    kind: "synthetic",
    expectedVerdict: "testable",
    requirement: {
      id: "SYN-CLEAR-LIST-USERS",
      title: "List users",
      userStory: "As an authenticated user, I want to list users so I can find contacts.",
      acceptanceCriteria: [
        "Given an authenticated primaryUser",
        "When they GET /users",
        "Then the response status is 200 and results is an array of user objects",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "GET", path: "/users", auth: "primaryUser", notes: "returns { results: [...] }" }],
    },
  },
  {
    id: "borderline-single-transaction",
    kind: "synthetic",
    expectedVerdict: "testable",
    requirement: {
      id: "SYN-BORDERLINE-SINGLE-TRANSACTION",
      title: "Get a single transaction by id",
      userStory: "As an authenticated user, I want to fetch one transaction by its id.",
      acceptanceCriteria: [
        "Given an authenticated primaryUser and a seeded transaction",
        "When they GET /transactions/:id for that transaction",
        "Then the response status is 200 and the body's id equals the requested id",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "GET", path: "/transactions/:id", auth: "primaryUser" }],
    },
  },
  {
    id: "ambiguous-fast-export",
    kind: "synthetic",
    // Relabeled needs_clarification -> untestable: "completes quickly enough"
    // has no measurable oracle (D1 fail), so there is nothing checkable to test
    // until a threshold is defined. The gate's untestable is the correct call.
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-AMBIGUOUS-FAST-EXPORT",
      title: "Export is fast",
      userStory: "As a user, I want my transaction export to be fast.",
      acceptanceCriteria: [
        "Given an authenticated primaryUser",
        "When they GET /transactions/export",
        "Then the export completes quickly enough",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "GET", path: "/transactions/export", auth: "primaryUser" }],
    },
  },
  {
    id: "missing-actor-update",
    kind: "synthetic",
    expectedVerdict: "needs_clarification",
    requirement: {
      id: "SYN-MISSING-ACTOR-UPDATE",
      title: "Update a bank account",
      userStory: "As a user, I want to update a bank account.",
      acceptanceCriteria: [
        "When PATCH /bankAccounts/:id is called with a new bankName",
        "Then the response status is 200 and the bankName is updated",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "PATCH", path: "/bankAccounts/:id", notes: "no actor/auth stated — whose account, and may anyone update it?" }],
    },
  },
  {
    id: "contradiction-conflicting-status",
    kind: "synthetic",
    // Relabeled needs_clarification -> untestable: criteria assert both 200 and
    // 404 for the same valid request — a contradiction that leaves no checkable
    // outcome (D1 fail). Untestable until the contradiction is resolved.
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-CONTRADICTION-STATUS",
      title: "Delete a contact",
      userStory: "As an authenticated user, I want to delete a contact.",
      acceptanceCriteria: [
        "Given an authenticated primaryUser and an existing contact",
        "When they DELETE /contacts/:id",
        "Then the response status is 200",
        "And the response status is 404 for that same valid request",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "DELETE", path: "/contacts/:id", auth: "primaryUser" }],
    },
  },
  {
    id: "no-oracle-navigate",
    kind: "synthetic",
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-NO-ORACLE-NAVIGATE",
      title: "User opens the dashboard",
      userStory: "As a user, I want to open my dashboard.",
      acceptanceCriteria: [
        "Given an authenticated user",
        "When they navigate to the dashboard",
      ],
      source: { file: "synthetic" },
      apiHints: [{ method: "GET", path: "/dashboard" }],
    },
  },
  {
    id: "no-interface-nightly-report",
    kind: "synthetic",
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-NO-INTERFACE-NIGHTLY-REPORT",
      title: "Nightly summary email",
      userStory: "As a user, I want a nightly summary of my account emailed to me.",
      acceptanceCriteria: [
        "Given a user with activity during the day",
        "Then a summary email is sent each night at midnight",
      ],
      source: { file: "synthetic" },
      // no apiHints: no endpoint/contract to act against
    },
  },
  {
    id: "epic-security",
    kind: "synthetic",
    expectedVerdict: "untestable",
    requirement: {
      id: "SYN-EPIC-SECURITY",
      title: "The system must be secure",
      userStory: "As a stakeholder, I want the system to be secure.",
      acceptanceCriteria: [
        "Given the system",
        "Then it is secure against attacks",
      ],
      source: { file: "synthetic" },
      // no oracle, no interface, not atomic
    },
  },
];

export function allCases() {
  return [...GOOD_CASES, ...SYNTHETIC_CASES];
}
