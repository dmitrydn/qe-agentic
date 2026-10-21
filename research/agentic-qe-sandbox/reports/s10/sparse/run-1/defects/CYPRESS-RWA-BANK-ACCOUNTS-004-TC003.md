# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-004-TC003

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-004
**Test case:** Delete a bank account - non-existent account
**Confidence:** high

## Rationale
The API returns 200 OK when attempting to DELETE a non-existent bank account (ID 'non-existent-id-99999'), but should return 400 or 404 to indicate the resource does not exist. This is a standard REST API contract violation: DELETE operations on non-existent resources should fail with an appropriate client error status code, not succeed. The test correctly expects 400 or 404, and the behavior is consistent across all 3 runs, indicating a real defect in error handling.

## Repro steps
1. Authenticate as primaryUser
1. Send DELETE /bankAccounts/non-existent-id-99999
1. Observe: response status is 200 with empty body
1. Expected: response status should be 400 or 404 indicating the account does not exist
