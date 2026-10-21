# Defect report: CYPRESS-RWA-USERS-009-negative-004

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required balance
**Confidence:** high

## Rationale
The API hint documents that 'balance' is a validated field marked as 'any(must exist)', meaning it is required. The negative test correctly attempts to create a user without providing the balance field, expecting a 400 or 422 validation error. However, the application accepts the request with status 201 and creates the user with balance defaulted to 0. This violates the documented contract that balance must exist in the request. The behavior is consistent across all 3 runs, ruling out flakiness.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, avatar, and defaultPrivacyLevel, but omitting the balance field
1. Observe: response status is 201 and user is created with balance=0
1. Expected: response status should be 400 or 422 rejecting the missing required field
