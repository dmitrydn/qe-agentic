# Defect report: CYPRESS-RWA-TEST-DATA-001-TC-002

**Requirement:** CYPRESS-RWA-TEST-DATA-001
**Test case:** Get remote mock data for users entity without authentication
**Confidence:** high

## Rationale
The test expects that GET /testData/users without authentication should return 401 Unauthorized. However, the endpoint returns 200 OK with full user data including sensitive fields (passwords, emails, phone numbers, balances) to unauthenticated requests. This is a security defect: the endpoint lacks proper authentication enforcement. The requirement states 'with an authenticated client unless a step says otherwise', implying authentication is normally required. The test correctly validates that unauthenticated access should be rejected with 401, but the application fails to enforce this. The failure is consistent across all 3 runs.

## Repro steps
1. Send GET /testData/users without any authentication headers
1. Observe: response status is 200 with full user data exposed
1. Expected: response status should be 401 Unauthorized
