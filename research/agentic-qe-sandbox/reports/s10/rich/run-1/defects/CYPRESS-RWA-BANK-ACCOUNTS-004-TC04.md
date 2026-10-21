# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-004-TC04

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-004
**Test case:** Delete bank account fails with non-existent id
**Confidence:** high

## Rationale
The test attempts to DELETE a non-existent bank account (using {{unknown_id}}) and expects a 404 status code per the acceptance criteria. However, the API returns 200 with an empty body instead. This behavior is inconsistent across all 3 runs with identical results, indicating a deterministic defect. The acceptance criteria explicitly states 'When DELETE /bankAccounts/{{unknown_id}} Then the response status is 404', so the application is not correctly handling deletion attempts on non-existent resources.

## Repro steps
1. Authenticate as a valid user
1. Send DELETE /bankAccounts/00000000-0000-0000-0000-000000000000 (a well-formed but non-existent ID)
1. Observe: API returns 200 with empty body
1. Expected: API should return 404 status code
