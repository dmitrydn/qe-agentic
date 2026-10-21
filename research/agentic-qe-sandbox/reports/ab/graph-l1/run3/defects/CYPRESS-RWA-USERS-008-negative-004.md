# Defect report: CYPRESS-RWA-USERS-008-negative-004

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** fails to create user without required balance
**Confidence:** high

## Rationale
The API hint explicitly states that 'balance' is a required field ('balance (any(must exist))') for POST /users. The test correctly sends a request omitting the balance field and expects a 400 or 422 error. However, the application accepts the request with status 201 and creates a user with balance defaulted to 0. This violates the documented contract that balance must exist in the request. The behavior is consistent across all 3 runs, indicating a real defect in the validation logic.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, avatar, and defaultPrivacyLevel, but omitting the balance field
1. Observe: response status is 201 and user is created with balance=0
1. Expected: response status should be 400 or 422 rejecting the request due to missing required field 'balance'
