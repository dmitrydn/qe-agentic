# Defect report: CYPRESS-RWA-USERS-008-negative-006

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints document that defaultPrivacyLevel is a required field (marked as 'any(must exist)' in the validated fields list). The negative test correctly attempts to create a user without this required field and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating the user without the required defaultPrivacyLevel field. This is consistently reproducible across all 3 runs. The application is failing to validate a documented required field.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and avatar, but omitting defaultPrivacyLevel
1. Observe: Response status is 201 and user is created
1. Expected: Response status should be 400 or 422 indicating validation failure for missing required field defaultPrivacyLevel
