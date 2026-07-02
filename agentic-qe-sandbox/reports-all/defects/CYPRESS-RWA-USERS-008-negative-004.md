# Defect report: CYPRESS-RWA-USERS-008-negative-004

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without balance
**Confidence:** high

## Rationale
The API hints explicitly state that 'balance' is a validated field marked as 'any(must exist)', meaning it is required. The test correctly sends a POST /users request omitting the balance field and expects a 4xx error (400 or 422). However, the application accepts the request with status 201 and creates a user with balance defaulted to 0. This violates the documented contract that balance must exist in the request. The behavior is consistent across all 3 runs.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"nobalance","password":"Pass123!","avatar":"https://example.com/avatar.jpg","defaultPrivacyLevel":"public"} (omitting balance field)
1. Observe: Response status is 201 with user created having balance=0
1. Expected: Response status should be 400 or 422 rejecting the request because balance field is required per API contract
