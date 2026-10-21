# Defect report: CYPRESS-RWA-USERS-008-negative-002

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without lastName
**Confidence:** high

## Rationale
The API hints explicitly document that lastName is a required field (marked as 'must exist') for POST /users. The test correctly sends a request omitting lastName and expects a 4xx error (400 or 422). However, the application accepts the request and returns 201 Created, successfully creating a user without the required lastName field. This behavior is consistently reproduced across all 3 runs, indicating the backend validation is not enforcing the documented requirement that lastName must exist.

## Repro steps
1. Send POST /users with body containing firstName, username, password, balance, avatar, and defaultPrivacyLevel, but omitting lastName
1. Observe: API returns 201 Created and creates the user
1. Expected: API should return 400 or 422 rejecting the request due to missing required field lastName
