# Defect report: CYPRESS-RWA-USERS-009-TC5

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user without required balance field
**Confidence:** high

## Rationale
The API hint documents that 'balance' is a required field (any(must exist)) for POST /users. The test correctly sends a request omitting the balance field and expects a 4xx validation error (400 or 422). However, the application accepts the request with 201 Created and defaults balance to 0, violating the documented contract that balance must exist. This behavior is consistently reproducible across all three runs.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password but omitting the balance field
1. Observe: Server returns 201 Created with balance defaulted to 0
1. Expected: Server should return 400 or 422 indicating balance is a required field
