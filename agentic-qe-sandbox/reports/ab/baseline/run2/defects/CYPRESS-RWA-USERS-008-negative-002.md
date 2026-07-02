# Defect report: CYPRESS-RWA-USERS-008-negative-002

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required lastName
**Confidence:** high

## Rationale
The API hints explicitly document that lastName is a required field (marked as 'must exist') for POST /users. The negative test correctly omits lastName and expects a 400 or 422 error response. However, the application accepts the request and returns 201 Created, successfully creating a user without the required lastName field. This behavior violates the documented API contract. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing firstName, username, password, balance, avatar, and defaultPrivacyLevel, but omitting the required lastName field
1. Observe: API returns 201 Created and successfully creates the user
1. Expected: API should return 400 or 422 error rejecting the request due to missing required field lastName
