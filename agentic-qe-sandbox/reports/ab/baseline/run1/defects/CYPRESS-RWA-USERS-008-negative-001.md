# Defect report: CYPRESS-RWA-USERS-008-negative-001

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without firstName
**Confidence:** high

## Rationale
The API hints document that firstName is a required field ('firstName (any(must exist))') for POST /users. The negative test correctly sends a request omitting firstName and expects a 400 or 422 error status. However, the application accepts the request and returns 201 Created, successfully creating a user without the required firstName field. This behavior violates the documented API contract. The failure is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing lastName, username, password, balance, avatar, defaultPrivacyLevel but omitting firstName
1. Observed: 201 Created with user object lacking firstName field
1. Expected: 400 or 422 error rejecting the request due to missing required field
