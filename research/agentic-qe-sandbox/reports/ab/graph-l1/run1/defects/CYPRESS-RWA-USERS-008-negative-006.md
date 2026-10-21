# Defect report: CYPRESS-RWA-USERS-008-negative-006

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints explicitly document that defaultPrivacyLevel is a required field (any(must exist)) for POST /users. The test correctly sends a request omitting this required field and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating a user without the required defaultPrivacyLevel field. This violates the documented contract. The failure is consistent across all 3 runs with identical behavior.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, email, phoneNumber, balance, and avatar, but omitting defaultPrivacyLevel
1. Observe: Server returns 201 Created and creates the user
1. Expected: Server should return 400 or 422 rejecting the request due to missing required field defaultPrivacyLevel
