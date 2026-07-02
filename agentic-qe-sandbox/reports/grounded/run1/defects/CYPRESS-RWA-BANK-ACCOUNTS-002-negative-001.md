# Defect report: CYPRESS-RWA-BANK-ACCOUNTS-002-negative-001

**Requirement:** CYPRESS-RWA-BANK-ACCOUNTS-002
**Test case:** Returns error for non-existent bank account
**Confidence:** high

## Rationale
The API returns 200 OK with an empty body when requesting a non-existent bank account (ID 99999999), but should return 404 or 400 to indicate the resource does not exist. This is a standard REST API contract violation: GET requests for non-existent resources should return 4xx error codes, not 200. The test correctly expects statusIn [404, 400] for a negative case. The failure is consistent across all 3 runs with identical behavior, indicating deterministic application logic that fails to validate the bankAccountId exists before returning success.

## Repro steps
1. Authenticate as a seeded user via session-cookie login
1. Send GET /bankAccounts/99999999 (a non-existent bank account ID)
1. Observe: response status is 200 with empty body {}
1. Expected: response status should be 404 (Not Found) or 400 (Bad Request)
