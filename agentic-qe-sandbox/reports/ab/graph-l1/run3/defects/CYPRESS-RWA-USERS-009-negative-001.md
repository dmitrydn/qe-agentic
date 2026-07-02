# Defect report: CYPRESS-RWA-USERS-009-negative-001

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required firstName
**Confidence:** high

## Rationale
The API hints explicitly state that firstName is a required field ('firstName (any(must exist))') for POST /users. The negative test correctly attempts to create a user without firstName and expects a 400 or 422 error. However, the application accepts the request and returns 201 Created, successfully creating a user without the required firstName field. This violates the documented API contract. The failure is consistent across all 3 runs, indicating a real validation defect in the application.

## Repro steps
1. Send POST /users with body containing lastName, username, password, balance, avatar, defaultPrivacyLevel but omitting firstName
1. Observe: API returns 201 Created and successfully creates user without firstName field
1. Expected: API should return 400 or 422 error rejecting the request due to missing required firstName field
