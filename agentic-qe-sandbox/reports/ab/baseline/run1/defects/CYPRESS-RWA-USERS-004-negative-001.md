# Defect report: CYPRESS-RWA-USERS-004-negative-001

**Requirement:** CYPRESS-RWA-USERS-004
**Test case:** Get user profile by username - non-existent username
**Confidence:** high

## Rationale
The API returns 200 OK with an empty user object when querying a non-existent username, instead of returning 404 Not Found or 400 Bad Request. This is a real defect in error handling: the endpoint should distinguish between valid requests for non-existent resources (404) and return an appropriate error status rather than a successful response with empty data. The test correctly expects a 4xx status for a non-existent resource, which is standard REST API behavior. The failure is deterministic across all 3 runs.

## Repro steps
1. Authenticate as a seeded user via session-cookie login
1. Send GET /users/profile/nonexistent_user_12345
1. Observe: response status is 200 with body {"user":{}}
1. Expected: response status should be 404 (resource not found) or 400 (bad request)
