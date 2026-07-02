# Defect report: CYPRESS-RWA-USERS-008-negative-006

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** fails to create user without required defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints explicitly document that defaultPrivacyLevel is a required field (marked as 'any(must exist)' in the validated fields list). The test correctly sends a POST /users request omitting defaultPrivacyLevel and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating a user without this required field. This behavior violates the documented API contract. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and avatar, but omitting defaultPrivacyLevel
1. Observe: server returns 201 Created and successfully creates the user
1. Expected: server should return 400 or 422 rejecting the request due to missing required field defaultPrivacyLevel
