# Defect report: CYPRESS-RWA-USERS-008-negative-004

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** fails to create user without required balance
**Confidence:** high

## Rationale
The API hints explicitly state that 'balance' is a required field ('balance (any(must exist))') for POST /users. The test correctly omits the balance field and expects a 400 or 422 error response. However, the application accepts the request and returns 201 Created, defaulting balance to 0. This violates the documented contract that balance must exist in the request. The failure is consistent across all 3 runs, indicating a real validation defect in the backend.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, avatar, and defaultPrivacyLevel, but omitting the balance field
1. Observe: response status is 201 and user is created with balance defaulted to 0
1. Expected: response status should be 400 or 422 rejecting the request due to missing required field 'balance'
