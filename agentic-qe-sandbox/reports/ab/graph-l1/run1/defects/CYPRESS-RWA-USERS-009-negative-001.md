# Defect report: CYPRESS-RWA-USERS-009-negative-001

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required firstName
**Confidence:** high

## Rationale
The API hints explicitly state that firstName is a required field ('firstName (any(must exist))') for POST /users. The negative test correctly attempts to create a user without firstName and expects a 400 or 422 error. However, the application accepts the request and returns 201, successfully creating a user without the required firstName field. This is consistently reproducible across all 3 runs, indicating the backend validation is not enforcing the documented requirement that firstName must exist.

## Repro steps
1. Send POST /users with body containing lastName, username, password, balance, avatar, defaultPrivacyLevel but omitting firstName
1. Observe: API returns 201 and creates user successfully
1. Expected: API should return 400 or 422 rejecting the request due to missing required firstName field
