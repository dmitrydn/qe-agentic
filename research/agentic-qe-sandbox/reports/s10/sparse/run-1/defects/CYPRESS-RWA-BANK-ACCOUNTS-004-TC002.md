# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-004-TC002

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-004
**Test case:** Delete a bank account - unauthorized user cannot delete another user's account
**Confidence:** high

## Rationale
The test attempts to delete another user's bank account (other_user_bank_account_id) while authenticated as primaryUser. The application returned 200 OK, allowing the deletion to succeed. This is a clear authorization vulnerability - users should not be able to delete bank accounts owned by other users. The test correctly expects one of [401, 403, 404] to enforce proper access control, but the API failed to implement this security check. The failure is consistent across all 3 runs with fresh state resets, indicating a real defect in the authorization logic rather than test flakiness.

## Repro steps
1. Authenticate as primaryUser (user_id)
1. Send DELETE /bankAccounts/{{other_user_bank_account_id}} where other_user_bank_account_id belongs to a different user
1. Observe: Response status is 200 (deletion succeeds)
1. Expected: Response status should be 401, 403, or 404 (deletion should be rejected due to lack of ownership)
