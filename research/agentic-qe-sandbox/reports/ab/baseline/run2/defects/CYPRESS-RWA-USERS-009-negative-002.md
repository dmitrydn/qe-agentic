# Defect report: CYPRESS-RWA-USERS-009-negative-002

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fails to create user without required lastName
**Confidence:** high

## Rationale
The API hints document that lastName is a required field (marked as 'must exist') for POST /users. The negative test correctly attempts to create a user without the lastName field and expects a 400 or 422 error response. However, across all three runs, the application returns 201 (success) and creates the user without lastName, violating the documented API contract. The failure is consistent across all runs, indicating a real validation defect in the application.

## Repro steps
1. Send POST /users with body containing firstName, username, password, balance, avatar, defaultPrivacyLevel but omitting lastName
1. Observe: API returns 201 and creates user successfully
1. Expected: API should return 400 or 422 rejecting the request due to missing required lastName field
