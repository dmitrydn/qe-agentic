# Defect report: CYPRESS-RWA-USERS-008-negative-001

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** fails to create user without required firstName
**Confidence:** high

## Rationale
The API hints explicitly document that firstName is validated as 'any(must exist)', meaning it is a required field. The negative test correctly omits firstName and expects a 400 or 422 error response. However, the application accepts the request and returns 201 Created, successfully creating a user without the required firstName field. This violates the documented contract. The failure is consistent across all 3 runs, and the response bodies confirm users were created without firstName.

## Repro steps
1. Send POST /users with body containing lastName, username, password, balance, avatar, defaultPrivacyLevel but omitting firstName
1. Observed: 201 Created with user object lacking firstName field
1. Expected: 400 or 422 error rejecting the request due to missing required field
