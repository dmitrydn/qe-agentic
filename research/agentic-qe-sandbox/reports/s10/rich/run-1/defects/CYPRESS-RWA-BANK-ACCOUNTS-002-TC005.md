# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-002-TC005

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-002
**Test case:** Get bank account owned by another user returns 403
**Confidence:** high

## Rationale
The test expects a 403 Forbidden response when an authenticated user attempts to access another user's bank account (GET /bankAccounts/{{other_user_bank_account_id}}), which is explicitly required by the acceptance criteria. However, the API returned 200 OK with the full bank account details (id: I8qfnpz9q4a, userId: GjWovtg2hr). This indicates the application is not enforcing proper authorization checks and is leaking sensitive financial information across user boundaries. The failure is consistent across all 3 runs with identical behavior, ruling out flakiness.

## Repro steps
1. Authenticate as the primary user (user_id: {{user_id}})
1. Send GET /bankAccounts/I8qfnpz9q4a (a bank account owned by user GjWovtg2hr, not the authenticated user)
1. Observe: Response status is 200 with full account details returned
1. Expected: Response status should be 403 Forbidden, denying access to another user's bank account
