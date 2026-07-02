# Defect report: CYPRESS-RWA-USERS-008-negative-005

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** fails to create user without required avatar
**Confidence:** high

## Rationale
The API hints explicitly document that 'avatar' is a required field (any(must exist)) for POST /users. The test correctly sends a request omitting the avatar field and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating a user without the required avatar field. This behavior violates the documented contract that avatar must exist. The failure is consistent across all 3 runs, indicating a real validation defect in the application.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"johndoe303","password":"SecurePass123!","balance":1000,"defaultPrivacyLevel":"contacts"} (omitting avatar field)
1. Observe: Response status is 201 and user is created successfully
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required avatar field
