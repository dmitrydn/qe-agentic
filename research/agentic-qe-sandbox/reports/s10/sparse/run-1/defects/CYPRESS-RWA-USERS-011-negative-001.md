# Defect report: CYPRESS-RWA-USERS-011-negative-001

**Requirement:** CYPRESS-RWA-USERS-011
**Test case:** Update another user's profile should fail
**Confidence:** high

## Rationale
The negative test attempts to update another user's profile (other_user_id) while authenticated as the primary user. The application returned 204 (success), allowing the unauthorized modification. This is a security vulnerability: users should not be able to modify other users' profiles. The test correctly expects 401 or 403 to enforce authorization boundaries, but the API permits the operation.

## Repro steps
1. Authenticate as primary user (user_id)
1. Send PATCH /users/{{other_user_id}} with body {"firstName": "UnauthorizedUpdate"}
1. Observe: response status is 204 (success)
1. Expected: response status should be 401 or 403 (unauthorized/forbidden)
