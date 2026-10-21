# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-004-TC004

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-004
**Test case:** Delete a bank account - non-existent account
**Confidence:** high

## Rationale
The test attempts to DELETE a non-existent bank account (using {{unknown_id}}, which is documented as a well-formed but non-existent id). The API returns 200 OK instead of the expected 404 or 400 error status. A DELETE operation on a non-existent resource should return an error status code indicating the resource was not found (404) or that the request was invalid (400). The consistent 200 response across all 3 runs with fresh state resets indicates the application incorrectly reports success when attempting to delete a non-existent bank account.

## Repro steps
1. Authenticate as primaryUser with {{token}}
1. Send DELETE /bankAccounts/{{unknown_id}} where {{unknown_id}} is a well-formed but non-existent UUID (00000000-0000-0000-0000-000000000000)
1. Observe: API returns 200 OK with empty body
1. Expected: API should return 404 Not Found or 400 Bad Request
