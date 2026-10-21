# Defect report: CYPRESS-RWA-USERS-008-negative-005

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** fails to create user without required avatar
**Confidence:** high

## Rationale
The API hints explicitly document that 'avatar' is a required field (any(must exist)) for POST /users. The test correctly sends a request omitting the avatar field and expects a 4xx error (400 or 422). However, the application accepts the request and returns 201 Created, successfully creating a user without the required avatar field. This behavior violates the documented contract. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"johndoe303","password":"SecurePass123!","balance":1000,"defaultPrivacyLevel":"contacts"} (omitting avatar)
1. Observe: response status 201 with user created successfully
1. Expected: response status 400 or 422 rejecting the request due to missing required field 'avatar'
