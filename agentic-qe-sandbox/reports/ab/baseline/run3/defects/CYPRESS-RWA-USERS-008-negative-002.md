# Defect report: CYPRESS-RWA-USERS-008-negative-002

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required lastName
**Confidence:** high

## Rationale
The API hints explicitly document that lastName is a required field (marked as 'must exist') for POST /users. The test correctly sends a request omitting lastName and expects a 400 or 422 error response. However, the application accepted the request and returned 201 Created, successfully creating a user without the required lastName field. This behavior violates the documented API contract. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing firstName, username, password, balance, avatar, and defaultPrivacyLevel, but omitting lastName
1. Observed: 201 Created response with user object lacking lastName field
1. Expected: 400 or 422 error response rejecting the request due to missing required field
