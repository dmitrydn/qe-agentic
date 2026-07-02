# Defect report: CYPRESS-RWA-USERS-009-negative-002

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required lastName
**Confidence:** high

## Rationale
The API documentation explicitly states that lastName is a required field (marked as 'must exist' in the validated fields). The negative test correctly attempts to create a user without the lastName field and expects a 400 or 422 error response. However, the application accepts the request and returns 201 Created, successfully creating a user without the required lastName field. This behavior is consistently reproduced across all 3 runs, indicating the backend validation is not enforcing the documented requirement that lastName must exist.

## Repro steps
1. Send POST /users with body containing firstName, username, password, balance, avatar, and defaultPrivacyLevel but omitting lastName
1. Observe: API returns 201 Created and successfully creates the user
1. Expected: API should return 400 or 422 error rejecting the request due to missing required lastName field
