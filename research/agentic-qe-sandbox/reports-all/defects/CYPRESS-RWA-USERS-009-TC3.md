# Defect report: CYPRESS-RWA-USERS-009-TC3

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user without required lastName field
**Confidence:** high

## Rationale
The API documentation explicitly states that lastName is a required field (must exist) for POST /users. The test correctly sends a request omitting the lastName field and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating a user without the required lastName field. This violates the documented API contract and represents a missing validation check in the backend.

## Repro steps
1. Send POST /users with body: {"firstName": "TestFirstName", "username": "testuser_nolastname", "password": "SecurePass123!", "balance": 10000} (omitting lastName)
1. Observe: Response status is 201 and user is created successfully
1. Expected: Response status should be 400 or 422 indicating validation failure for missing required field lastName
