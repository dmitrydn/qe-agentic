# Defect report: CYPRESS-RWA-USERS-008-negative-005

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without avatar
**Confidence:** high

## Rationale
The API documentation explicitly states that 'avatar' is a validated field marked as 'any(must exist)', meaning it is required. The negative test correctly attempts to create a user without the avatar field and expects a 400 or 422 error. However, the application accepts the request and returns 201 Created, successfully creating the user without the required avatar field. This violates the documented API contract. The failure is consistent across all 3 runs, indicating a real validation defect in the POST /users endpoint.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"missingavatar","password":"Pass123!","balance":100,"defaultPrivacyLevel":"public"} (omitting avatar field)
1. Observe: Response status is 201 and user is created successfully
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required 'avatar' field
