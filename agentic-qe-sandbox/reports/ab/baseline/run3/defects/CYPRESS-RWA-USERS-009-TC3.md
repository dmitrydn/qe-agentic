# Defect report: CYPRESS-RWA-USERS-009-TC3

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user without required lastName field
**Confidence:** high

## Rationale
The API hints document that lastName is a required field (marked as 'must exist') for POST /users. The test correctly sends a request omitting the lastName field and expects a 4xx validation error (400 or 422). However, the application accepts the request and returns 201 Created, successfully creating a user without the required lastName field. This behavior is consistently reproduced across all three runs, indicating the application fails to validate the required lastName field.

## Repro steps
1. Send POST /users with body: {"firstName": "TestFirstName", "username": "testuser_nolastname", "password": "SecurePass123!", "balance": 10000} (omitting lastName)
1. Observe: Response status is 201 and user is created
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required lastName field
