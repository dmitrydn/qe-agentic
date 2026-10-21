# Defect report: CYPRESS-RWA-USERS-011-negative-002

**Requirement:** CYPRESS-RWA-USERS-011
**Test case:** Update non-existent user should fail
**Confidence:** high

## Rationale
The API returns 204 (success) when attempting to update a non-existent user (unknown_id = 00000000-0000-0000-0000-000000000000). Standard REST semantics dictate that PATCH on a non-existent resource should return 404 Not Found. The test correctly expects 404, but the application incorrectly accepts and processes the request as if the resource exists. This behavior is consistent across all 3 runs, indicating a real defect in resource existence validation.

## Repro steps
1. Send PATCH /users/00000000-0000-0000-0000-000000000000 with body {"firstName": "UpdatedName"} and valid authentication
1. Observe response status 204 (No Content)
1. Expected: 404 (Not Found) since the user ID does not exist
