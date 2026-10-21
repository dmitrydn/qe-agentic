# Defect report: CYPRESS-RWA-USERS-002-TC003

**Requirement:** CYPRESS-RWA-USERS-002
**Test case:** Get another user's profile returns 403
**Confidence:** high

## Rationale
The acceptance criteria explicitly state 'When GET /users/{{other_user_id}} Then the response status is 403'. The test correctly attempts to GET another user's profile while authenticated as primaryUser, but receives 401 Unauthorized instead of the expected 403 Forbidden. This indicates the application is not properly distinguishing between unauthenticated requests (which should return 401) and authenticated requests attempting to access forbidden resources (which should return 403). The failure is consistent across all 3 runs with fresh state resets, ruling out flakiness.

## Repro steps
1. Authenticate as the primary user (obtain valid token)
1. Send GET /users/{{other_user_id}} with valid authentication
1. Observe: receives 401 Unauthorized with body {"error":"Unauthorized"}
1. Expected: should receive 403 Forbidden (authenticated user attempting to access another user's profile)
