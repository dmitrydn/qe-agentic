# Defect report: CYPRESS-RWA-TEST-DATA-001-TC002

**Requirement:** CYPRESS-RWA-TEST-DATA-001
**Test case:** Get remote mock data for users entity returns 401 when unauthenticated
**Confidence:** high

## Rationale
The test expects GET /testData/users to return 401 when called without authentication, but the endpoint returns 200 with user data. This is a security defect: the endpoint exposes sensitive user information (including password hashes, emails, phone numbers, balances) to unauthenticated requests. The requirement states 'with an authenticated client unless a step says otherwise', implying authentication is normally required. The test explicitly validates the unauthenticated case and the endpoint fails to enforce authentication.

## Repro steps
1. Send GET /testData/users without any authentication token
1. Observe: response status is 200 with full user data including sensitive fields
1. Expected: response status should be 401 (Unauthorized)
