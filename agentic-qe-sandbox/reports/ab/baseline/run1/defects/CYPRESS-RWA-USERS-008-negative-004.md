# Defect report: CYPRESS-RWA-USERS-008-negative-004

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without balance
**Confidence:** high

## Rationale
The API hints explicitly state that 'balance' is a required field (any(must exist)) for POST /users. The test correctly sends a request omitting the balance field and expects a 4xx error (400 or 422). However, the application accepts the request with 201 status and creates a user with balance defaulted to 0. This violates the documented contract that balance must exist in the request. The failure is consistent across all 3 runs.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"missingbalance","password":"Pass123!","avatar":"https://example.com/avatar.jpg","defaultPrivacyLevel":"public"} (omitting balance field)
1. Observe: response status is 201 with user created having balance:0
1. Expected: response status should be 400 or 422 rejecting the request due to missing required field 'balance'
