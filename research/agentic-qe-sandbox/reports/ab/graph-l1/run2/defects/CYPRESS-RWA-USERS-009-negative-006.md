# Defect report: CYPRESS-RWA-USERS-009-negative-006

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints document that defaultPrivacyLevel is a validated field marked as 'any(must exist)', meaning it is required. The negative test correctly attempts to create a user without this required field and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating the user without the required defaultPrivacyLevel field. This violates the documented contract that defaultPrivacyLevel must exist. The failure is consistent across all 3 runs, indicating a real validation defect in the POST /users endpoint.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and avatar, but omitting defaultPrivacyLevel
1. Observe: Response status is 201 and user is created successfully
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required field defaultPrivacyLevel
