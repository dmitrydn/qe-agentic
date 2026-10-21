# Defect report: CYPRESS-RWA-USERS-009-negative-005

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required avatar
**Confidence:** high

## Rationale
The API hints explicitly document that 'avatar' is a validated field with constraint 'any(must exist)', meaning it is required. The negative test correctly attempts to create a user without the avatar field and expects a 400 or 422 error. However, across all three runs, the API returned 201 (success) and created the user without the avatar field. This is a clear violation of the documented validation contract that avatar must exist.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and defaultPrivacyLevel, but omitting the avatar field
1. Observe: API returns 201 and creates the user successfully
1. Expected: API should return 400 or 422 rejecting the request due to missing required avatar field
