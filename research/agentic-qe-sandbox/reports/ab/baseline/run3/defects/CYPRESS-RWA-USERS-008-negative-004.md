# Defect report: CYPRESS-RWA-USERS-008-negative-004

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without required balance
**Confidence:** high

## Rationale
The API hints explicitly state that 'balance' is a required field ('balance (any(must exist))') for POST /users. The test correctly sends a request omitting the balance field and expects a 400 or 422 error status. However, the application accepts the request and returns 201 Created, defaulting balance to 0. This violates the documented contract that balance must exist in the request. The failure is consistent across all 3 runs, indicating the application does not properly validate required fields.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, avatar, and defaultPrivacyLevel, but omitting the balance field
1. Observe: Response status is 201 and user is created with balance defaulted to 0
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required field 'balance'
