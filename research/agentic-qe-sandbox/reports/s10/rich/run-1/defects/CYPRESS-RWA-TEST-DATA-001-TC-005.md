# Defect report: CYPRESS-RWA-TEST-DATA-001-TC-005

**Requirement:** CYPRESS-RWA-TEST-DATA-001
**Test case:** Unauthenticated request to get users test data
**Confidence:** high

## Rationale
The test expects GET /testData/users without authentication to return 401 (unauthorized), but the endpoint returns 200 with user data. This is a security defect: the endpoint exposes sensitive user information (including password hashes, emails, phone numbers, balances) to unauthenticated requests. The requirement explicitly states 'with an authenticated client unless a step says otherwise', implying authentication is required by default. This test case is specifically checking the auth boundary (kind: 'auth', actor: 'anonymous'), and the application fails to enforce it. The failure is consistent across all 3 runs.

## Repro steps
1. Send GET /testData/users without any authentication headers
1. Observe: response status is 200 with full user data including sensitive fields
1. Expected: response status should be 401 (unauthorized)
