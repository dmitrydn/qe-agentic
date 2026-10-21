# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-002-TC004

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-002
**Test case:** Get bank account with non-existent id returns 404
**Confidence:** high

## Rationale
The test sends GET /bankAccounts/{{unknown_id}} where {{unknown_id}} is documented as 'a well-formed but non-existent id'. The acceptance criteria explicitly state 'When GET /bankAccounts/{{unknown_id}} Then the response status is 404'. However, the API returned 200 with an empty body instead of 404. This behavior is inconsistent across all 3 runs with fresh state, indicating the application incorrectly handles requests for non-existent bank account IDs.

## Repro steps
1. Authenticate as primaryUser
1. Send GET /bankAccounts/00000000-0000-0000-0000-000000000000 (a well-formed but non-existent UUID)
1. Observe: API returns 200 with empty body {}
1. Expected: API should return 404 status code
