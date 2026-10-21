/**
 * Stage 6b, workstream D: a labelled battery of failures for measuring
 * triage's classification accuracy with a confusion matrix, rather than
 * relying on the 3 real seeded defects (Stage 6) plus one anecdotal false
 * positive (see VERIFICATION.md §7) as the only evidence triage works.
 *
 * Each case has a ground-truth `class` (one of TriageVerdict's three) and is
 * either:
 *  - "real": actually executed against the live container (a real seeded
 *    defect applied + reverted, or a deliberately bad hand-written TestCase
 *    run against the CLEAN app), so the `runs` triage sees are genuine
 *    RunResults from the real adapter.
 *  - "synthetic": a hand-crafted RunResult triple, fed to triage() directly
 *    without touching the container — used for failure shapes that are
 *    impractical to manufacture live (infra/connectivity noise) or to widen
 *    coverage cheaply once the "real" mechanics are already exercised above.
 *
 * This module only builds/describes the battery; running it (and the live
 * defect apply/revert side effects) happens in run-triage-battery.js.
 */

const USERS_REQUIREMENT_ID = "CYPRESS-RWA-USERS-001";
const BANKACCOUNTS_REQUIREMENT_ID = "CYPRESS-RWA-BANK-ACCOUNTS-001";
const TRANSACTIONS_007_REQUIREMENT_ID = "CYPRESS-RWA-TRANSACTIONS-007";

function passResult(name, status) {
  return { name, status, ok: true, failures: [] };
}

export const REAL_DEFECT_CASES = [
  {
    id: "real-defect-payment-cents",
    groundTruth: "real_defect",
    kind: "real-defect",
    defectId: "payment-amount-cents",
    testCaseId: "CYPRESS-RWA-TRANSACTIONS-007-positive-001",
  },
  {
    id: "real-defect-auth-gate-post-transactions",
    groundTruth: "real_defect",
    kind: "real-defect",
    defectId: "auth-gate-post-transactions",
    testCaseId: "CYPRESS-RWA-TRANSACTIONS-007-auth-001",
  },
  {
    id: "real-defect-bankaccounts-missing-userid",
    groundTruth: "real_defect",
    kind: "real-defect",
    defectId: "bankaccounts-missing-userid-field",
    testCaseId: "CYPRESS-RWA-BANK-ACCOUNTS-001-TC-001",
  },
  {
    id: "real-defect-receiver-balance-not-credited",
    groundTruth: "real_defect",
    kind: "real-defect",
    defectId: "receiver-balance-not-credited",
    testCaseId: "CYPRESS-RWA-TRANSACTIONS-007-positive-001",
  },
];

/**
 * Hand-written bad TestCases run against the CLEAN (unmodified) app — the
 * app is correct, the test asserts something the requirement never claimed,
 * so the correct verdict is flaky_or_bad_test, not real_defect.
 */
export const REAL_BAD_TEST_CASES = [
  {
    id: "real-bad-test-wrong-status-201",
    groundTruth: "flaky_or_bad_test",
    kind: "real-bad-test",
    requirementId: USERS_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-BAD-TEST-users-201",
      requirementId: USERS_REQUIREMENT_ID,
      title: "(stress-test bad test) expects 201 instead of the documented 200",
      kind: "positive",
      actor: "primaryUser",
      requests: [
        { name: "List users", method: "GET", pathTemplate: "/users", expect: { status: 201 } },
      ],
    },
  },
  {
    id: "real-bad-test-invented-field-value",
    groundTruth: "flaky_or_bad_test",
    kind: "real-bad-test",
    requirementId: BANKACCOUNTS_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-BAD-TEST-bankaccounts-invented-name",
      requirementId: BANKACCOUNTS_REQUIREMENT_ID,
      title: "(stress-test bad test) asserts a bank name never specified by the requirement",
      kind: "positive",
      actor: "primaryUser",
      requests: [
        {
          name: "List bank accounts",
          method: "GET",
          pathTemplate: "/bankAccounts",
          expect: {
            status: 200,
            jsonPath: [{ path: "results[0].bankName", op: "eq", value: "First Bogus Bank of Nowhere" }],
          },
        },
      ],
    },
  },
];

/** Hand-crafted RunResult triples, fed straight to triage() — no live container traffic. */
export const SYNTHETIC_CASES = [
  {
    id: "synthetic-environment-connrefused",
    groundTruth: "environment",
    kind: "synthetic",
    requirementId: USERS_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-SYN-env-connrefused",
      requirementId: USERS_REQUIREMENT_ID,
      title: "gets a list of users",
      kind: "positive",
      actor: "primaryUser",
      requests: [{ name: "List users", method: "GET", pathTemplate: "/users", expect: { status: 200 } }],
    },
    runs: Array.from({ length: 3 }, () => ({
      pass: false,
      requests: [
        { name: "List users", status: 0, ok: false, failures: ["request error: fetch failed: ECONNREFUSED 127.0.0.1:3001"] },
      ],
      output: "GET http://localhost:3001/users -> ERROR fetch failed: ECONNREFUSED 127.0.0.1:3001",
    })),
  },
  {
    id: "synthetic-environment-gateway-timeout",
    groundTruth: "environment",
    kind: "synthetic",
    requirementId: TRANSACTIONS_007_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-SYN-env-timeout",
      requirementId: TRANSACTIONS_007_REQUIREMENT_ID,
      title: "creates a new payment",
      kind: "positive",
      actor: "primaryUser",
      requests: [
        {
          name: "Create payment",
          method: "POST",
          pathTemplate: "/transactions",
          body: {
            transactionType: "payment",
            source: "bankAcct1",
            receiverId: "receiverUser1",
            description: "stress-test payment",
            amount: 50,
            privacyLevel: "public",
          },
          expect: { status: 200 },
        },
      ],
    },
    runs: Array.from({ length: 3 }, () => ({
      pass: false,
      requests: [{ name: "Create payment", status: 504, ok: false, failures: ["status: expected 200, got 504"] }],
      output:
        "POST http://localhost:3001/transactions -> 504 FAILURES: status: expected 200, got 504\nbody: <html>504 Gateway Time-out</html>\nnginx",
    })),
  },
  {
    id: "synthetic-environment-dns",
    groundTruth: "environment",
    kind: "synthetic",
    requirementId: USERS_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-SYN-env-dns",
      requirementId: USERS_REQUIREMENT_ID,
      title: "gets a list of users",
      kind: "positive",
      actor: "primaryUser",
      requests: [{ name: "List users", method: "GET", pathTemplate: "/users", expect: { status: 200 } }],
    },
    runs: Array.from({ length: 3 }, () => ({
      pass: false,
      requests: [{ name: "List users", status: 0, ok: false, failures: ["request error: getaddrinfo ENOTFOUND localhost"] }],
      output: "GET http://localhost:3001/users -> ERROR getaddrinfo ENOTFOUND localhost",
    })),
  },
  {
    id: "synthetic-bad-test-typo-path",
    groundTruth: "flaky_or_bad_test",
    kind: "synthetic",
    requirementId: BANKACCOUNTS_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-SYN-bad-typo-path",
      requirementId: BANKACCOUNTS_REQUIREMENT_ID,
      title: "(stress-test) asserts a jsonPath that is not part of the BankAccount contract",
      kind: "positive",
      actor: "primaryUser",
      requests: [
        {
          name: "List bank accounts",
          method: "GET",
          pathTemplate: "/bankAccounts",
          expect: { status: 200, jsonPath: [{ path: "results[0].accountBalanceTotal", op: "exists" }] },
        },
      ],
    },
    runs: Array.from({ length: 3 }, () => ({
      pass: false,
      requests: [
        passResult("List bank accounts", 200),
        { name: "List bank accounts", status: 200, ok: false, failures: ["jsonPath results[0].accountBalanceTotal: expected to exist, was undefined"] },
      ],
      output:
        "GET http://localhost:3001/bankAccounts -> 200 FAILURES: jsonPath results[0].accountBalanceTotal: expected to exist, was undefined\nbody: {\"results\":[{\"id\":\"abc\",\"userId\":\"u1\",\"bankName\":\"Test Bank\",\"accountNumber\":\"123\",\"routingNumber\":\"456\"}]}",
    })),
  },
  {
    id: "synthetic-bad-test-wrong-arithmetic",
    groundTruth: "flaky_or_bad_test",
    kind: "synthetic",
    requirementId: TRANSACTIONS_007_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-SYN-bad-arithmetic",
      requirementId: TRANSACTIONS_007_REQUIREMENT_ID,
      title: "(stress-test) test asserts the sender's balance dropped by the wrong amount (test typo, not an app bug)",
      kind: "positive",
      actor: "primaryUser",
      requests: [
        {
          name: "Verify balance after payment",
          method: "GET",
          pathTemplate: "/testData/users",
          expect: { status: 200, jsonPath: [{ path: "results[0].balance", op: "eq", value: "{{senderBalanceBefore - 10000}}" }] },
        },
      ],
    },
    runs: Array.from({ length: 3 }, () => ({
      pass: false,
      requests: [
        {
          name: "Verify balance after payment",
          status: 200,
          ok: false,
          failures: ["jsonPath results[0].balance: expected === 40000, got 45000"],
        },
      ],
      output:
        "GET http://localhost:3001/testData/users -> 200 FAILURES: jsonPath results[0].balance: expected === 40000, got 45000\nbody: {\"results\":[{\"id\":\"u1\",\"balance\":45000}]}",
    })),
  },
  {
    id: "synthetic-real-defect-stacktrace-500",
    groundTruth: "real_defect",
    kind: "synthetic",
    requirementId: TRANSACTIONS_007_REQUIREMENT_ID,
    testCase: {
      id: "STRESS-SYN-real-defect-500",
      requirementId: TRANSACTIONS_007_REQUIREMENT_ID,
      title: "creates a new payment",
      kind: "positive",
      actor: "primaryUser",
      requests: [
        {
          name: "Create payment",
          method: "POST",
          pathTemplate: "/transactions",
          body: {
            transactionType: "payment",
            source: "bankAcct1",
            receiverId: "receiverUser1",
            description: "stress-test payment",
            amount: 50,
            privacyLevel: "public",
          },
          expect: { status: 200 },
        },
      ],
    },
    runs: Array.from({ length: 3 }, () => ({
      pass: false,
      requests: [{ name: "Create payment", status: 500, ok: false, failures: ["status: expected 200, got 500"] }],
      output:
        "POST http://localhost:3001/transactions -> 500 FAILURES: status: expected 200, got 500\n" +
        'body: {"error":"TypeError: Cannot read properties of undefined (reading \'defaultPrivacyLevel\')","stack":"at createTransaction (backend/database.ts:538:46)"}',
    })),
  },
];

export function allCases() {
  return [...REAL_DEFECT_CASES, ...REAL_BAD_TEST_CASES, ...SYNTHETIC_CASES];
}
