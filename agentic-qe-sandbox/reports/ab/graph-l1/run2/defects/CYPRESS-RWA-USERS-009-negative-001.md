# Defect report: CYPRESS-RWA-USERS-009-negative-001

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required firstName
**Confidence:** high

## Rationale
The API hints explicitly state that firstName is a validated field marked as 'any(must exist)', meaning it is required. The negative test correctly attempts to create a user without the firstName field and expects a 400 or 422 error status. However, across all 3 runs, the API consistently returns 201 (success) and creates the user without firstName (note the response body lacks a firstName field entirely). This violates the documented contract that firstName 'must exist'. The application is incorrectly accepting requests that omit a required field.

## Repro steps
1. Send POST /users with body containing lastName, username, password, balance, avatar, defaultPrivacyLevel but omitting firstName
1. Observe: API returns 201 and creates user successfully
1. Expected: API should return 400 or 422 rejecting the request due to missing required firstName field
