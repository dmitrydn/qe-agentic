# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-004-TC05

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-004
**Test case:** Delete bank account fails when accessing another user's account
**Confidence:** high

## Rationale
The test attempts to DELETE /bankAccounts/{{other_user_bank_account_id}} (a bank account owned by another user) while authenticated as the primary user. The acceptance criteria explicitly state 'When DELETE /bankAccounts/{{other_user_bank_account_id}} Then the response status is 403'. The application returned 200 instead of 403, indicating it allowed the deletion of another user's bank account without proper authorization checks. This is a clear authorization bypass defect. The test ran consistently 3 times with identical results, ruling out flakiness.

## Repro steps
1. Authenticate as the primary user
1. Send DELETE /bankAccounts/{{other_user_bank_account_id}} where {{other_user_bank_account_id}} is a bank account owned by a different user
1. Observe: response status is 200 (success)
1. Expected: response status should be 403 (forbidden) to prevent unauthorized deletion of another user's bank account
