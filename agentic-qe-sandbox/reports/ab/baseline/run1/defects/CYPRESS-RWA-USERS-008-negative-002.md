# Defect report: CYPRESS-RWA-USERS-008-negative-002

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without lastName
**Confidence:** high

## Rationale
The API hints explicitly document that lastName is a required field (marked as 'must exist') for POST /users. The negative test correctly attempts to create a user without lastName and expects a 400 or 422 error. However, the application accepts the request and returns 201 Created, successfully creating a user without the required lastName field. This violates the documented API contract. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing firstName, username, password, balance, avatar, defaultPrivacyLevel but omitting lastName
1. Observe: server returns 201 and creates user successfully
1. Expected: server should return 400 or 422 rejecting the request due to missing required field lastName
