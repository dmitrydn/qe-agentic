# Defect report: CYPRESS-RWA-USERS-004-negative-001

**Requirement:** CYPRESS-RWA-USERS-004
**Test case:** Get user profile by username - non-existent username
**Confidence:** high

## Rationale
The API returns 200 OK with an empty user object when requesting a non-existent username, instead of returning 404 Not Found or 400 Bad Request as expected for a negative test case. This is a real defect: the application fails to properly validate that the requested username exists and does not return an appropriate error status code for a missing resource. The behavior is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Authenticate as a seeded user via session-cookie login
1. Send GET /users/profile/nonexistentuser12345
1. Observe: response status is 200 with body {"user":{}}
1. Expected: response status should be 404 or 400 indicating the user does not exist
