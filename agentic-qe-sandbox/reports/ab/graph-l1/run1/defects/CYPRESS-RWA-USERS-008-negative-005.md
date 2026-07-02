# Defect report: CYPRESS-RWA-USERS-008-negative-005

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required avatar
**Confidence:** high

## Rationale
The API hints explicitly document that 'avatar' is a required field (any(must exist)) for POST /users. The test correctly sends a request omitting the avatar field and expects a 400 or 422 error status. However, across all three runs, the application returned 201 and successfully created the user without the avatar field, violating the documented contract. The response bodies show users were created with all other fields but no avatar property. This is a clear validation defect where the backend is not enforcing the required field constraint documented in the API contract.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, email, phoneNumber, balance, and defaultPrivacyLevel, but omitting the required 'avatar' field
1. Observe: Server returns 201 and creates the user successfully
1. Expected: Server should return 400 or 422 rejecting the request due to missing required 'avatar' field
