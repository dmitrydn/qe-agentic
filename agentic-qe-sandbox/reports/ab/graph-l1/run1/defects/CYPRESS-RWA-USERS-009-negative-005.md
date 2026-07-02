# Defect report: CYPRESS-RWA-USERS-009-negative-005

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required avatar
**Confidence:** high

## Rationale
The API hints explicitly document that 'avatar' is a validated field with constraint 'any(must exist)', meaning it is required. The negative test correctly attempts to create a user without the avatar field and expects a 400 or 422 error. However, the application accepts the request and returns 201 Created, successfully creating the user without the required avatar field. This violates the documented API contract. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and defaultPrivacyLevel, but omitting the avatar field
1. Observe: API returns 201 Created and successfully creates the user
1. Expected: API should return 400 or 422 error rejecting the request due to missing required avatar field
