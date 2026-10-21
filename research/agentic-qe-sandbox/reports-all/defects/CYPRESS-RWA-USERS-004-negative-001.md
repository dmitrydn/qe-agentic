# Defect report: CYPRESS-RWA-USERS-004-negative-001

**Requirement:** CYPRESS-RWA-USERS-004
**Test case:** Get user profile by username - non-existent username
**Confidence:** high

## Rationale
The API returns 200 OK with an empty user object when requesting a non-existent username, instead of returning 404 Not Found or 400 Bad Request. This is a real defect in error handling: the endpoint should distinguish between a successful retrieval of an existing user profile and a failed lookup of a non-existent user. The test correctly expects a 4xx status code for a non-existent resource, which is standard REST API behavior. The failure is deterministic across all 3 runs.

## Repro steps
1. Authenticate as a seeded user via session-cookie login
1. Send GET /users/profile/nonexistent_user_12345
1. Observe: response status is 200 with body {"user":{}}
1. Expected: response status should be 404 or 400 to indicate the user does not exist
