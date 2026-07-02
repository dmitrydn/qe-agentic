# Defect report: CYPRESS-RWA-USERS-008-negative-005

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without avatar
**Confidence:** high

## Rationale
The API hints explicitly state that 'avatar' is a validated field marked as 'any(must exist)', meaning it is required. The test correctly sends a POST /users request omitting the avatar field and expects a 400 or 422 error status. However, the application accepts the request and returns 201 Created, successfully creating users without the required avatar field across all three runs. This violates the documented contract that avatar must exist.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"noavatar","password":"Pass123!","balance":100,"defaultPrivacyLevel":"public"} (omitting avatar field)
1. Observe: Response status is 201 and user is created
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required avatar field
