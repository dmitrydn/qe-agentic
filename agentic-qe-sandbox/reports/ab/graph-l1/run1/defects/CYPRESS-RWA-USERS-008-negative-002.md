# Defect report: CYPRESS-RWA-USERS-008-negative-002

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required lastName
**Confidence:** high

## Rationale
The API hints explicitly document that lastName is a required field (marked as 'any(must exist)' in the validated fields list). The negative test correctly attempts to create a user without the lastName field and expects a 400 or 422 error response. However, the application accepted the request and returned 201 Created, successfully creating a user without the required lastName field. This behavior is consistently reproduced across all 3 runs, indicating the backend validation is not enforcing the documented requirement that lastName must exist.

## Repro steps
1. Send POST /users with body containing firstName, username, password, email, phoneNumber, balance, avatar, and defaultPrivacyLevel, but omitting the lastName field
1. Observe: Response status is 201 and user is created without lastName
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required field lastName
