# Defect report: CYPRESS-RWA-USERS-008-negative-006

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints explicitly document that defaultPrivacyLevel is a required field (marked as 'must exist' in the validated fields list). The negative test correctly attempts to create a user without this required field and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating the user without the required field. This is consistently reproducible across all 3 runs, indicating the backend validation is not enforcing the documented requirement for defaultPrivacyLevel.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and avatar, but omitting defaultPrivacyLevel
1. Observe: Server returns 201 Created and creates the user
1. Expected: Server should return 400 or 422 rejecting the request due to missing required field defaultPrivacyLevel
