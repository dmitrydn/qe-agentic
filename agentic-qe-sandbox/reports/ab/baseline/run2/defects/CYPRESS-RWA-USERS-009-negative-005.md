# Defect report: CYPRESS-RWA-USERS-009-negative-005

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fails to create user without required avatar
**Confidence:** high

## Rationale
The API hints explicitly document that 'avatar' is a required field (listed under 'Other validated fields' with 'must exist' constraint). The negative test correctly expects a 400 or 422 status when omitting the required avatar field. However, the application accepted the request and returned 201 Created, successfully creating a user without the avatar field. This behavior violates the documented API contract that avatar must exist. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and defaultPrivacyLevel, but omitting the avatar field
1. Observe: API returns 201 Created and successfully creates the user
1. Expected: API should return 400 or 422 rejecting the request due to missing required avatar field
