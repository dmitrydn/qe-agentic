# Defect report: CYPRESS-RWA-USERS-008-negative-001

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required firstName
**Confidence:** high

## Rationale
The API hints explicitly state that firstName is a required field ('firstName (any(must exist))') for POST /users. The negative test correctly omits firstName and expects a 400 or 422 error response. However, the application accepted the request and returned 201 Created, successfully creating a user without the required firstName field. All three runs consistently show the same behavior (201 status with user created), indicating this is a reproducible validation defect in the backend, not test flakiness.

## Repro steps
1. Send POST /users with body containing lastName, username, password, email, phoneNumber, balance, avatar, and defaultPrivacyLevel, but omitting firstName
1. Observe: Server returns 201 Created and creates the user without firstName
1. Expected: Server should return 400 or 422 and reject the request due to missing required field firstName
