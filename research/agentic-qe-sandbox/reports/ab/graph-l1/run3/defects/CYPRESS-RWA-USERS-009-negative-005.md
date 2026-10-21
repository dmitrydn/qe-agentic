# Defect report: CYPRESS-RWA-USERS-009-negative-005

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required avatar
**Confidence:** high

## Rationale
The API hints explicitly state that 'avatar' is a validated field with constraint 'any(must exist)', meaning it is required. The negative test correctly attempts to create a user without the avatar field and expects a 400 or 422 error. However, the application accepts the request and returns 201, successfully creating the user without the required avatar field. This violates the documented API contract that avatar must exist. The failure is consistent across all 3 runs, indicating a real validation defect in the POST /users endpoint.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and defaultPrivacyLevel, but omitting the avatar field
1. Observe: response status is 201 and user is created successfully
1. Expected: response status should be 400 or 422 rejecting the request due to missing required avatar field
