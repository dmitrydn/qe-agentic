# Defect report: CYPRESS-RWA-USERS-009-negative-002

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required lastName
**Confidence:** high

## Rationale
The API documentation explicitly states that lastName is a required field (must exist) for POST /users. The test correctly sends a request omitting lastName and expects a 4xx error (400 or 422). However, the application accepts the request and returns 201 Created, successfully creating a user without the required lastName field. This violates the documented API contract. The failure is consistent across all 3 runs, indicating a real validation defect in the backend.

## Repro steps
1. Send POST /users with body containing firstName, username, password, balance, avatar, defaultPrivacyLevel but omitting lastName
1. Observe: server returns 201 and creates user successfully
1. Expected: server should return 400 or 422 rejecting the request due to missing required field lastName
