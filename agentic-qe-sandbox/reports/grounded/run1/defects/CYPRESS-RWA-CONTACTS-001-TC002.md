# Defect report: CYPRESS-RWA-CONTACTS-001-TC002

**Requirement:** CYPRESS-RWA-CONTACTS-001
**Test case:** Unauthenticated user cannot get contacts by username
**Confidence:** high

## Rationale
The API hint documents that GET /contacts/:username requires 'Auth: none' (anonymous actor), yet the test expects 401 for unauthenticated requests. The application crashes with a 500 error ('Cannot read properties of undefined (reading id)' in getUserId) when called without authentication, indicating the backend attempts to access user session data that doesn't exist. This is a real defect: the endpoint should either (1) allow anonymous access as documented, returning 200, or (2) properly validate authentication and return 401 instead of crashing. The consistent 500 across all runs confirms this is not flaky.

## Repro steps
1. Send GET /contacts/:username without any authentication headers or session cookie
1. Observe: Server returns 500 Internal Server Error with stack trace showing 'Cannot read properties of undefined (reading id)' at getUserId
1. Expected: Either 200 OK (per API hint 'Auth: none') or 401 Unauthorized (per test expectation), but not a crash
