# Defect report: CYPRESS-RWA-USERS-009-TC4

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user without required password field
**Confidence:** high

## Rationale
The API hints document that password is a required field (must exist) for POST /users. The test correctly sends a request omitting the password field and expects a 400 or 422 validation error. However, the application returns 500 Internal Server Error with a stack trace showing 'Error: Illegal arguments: undefined, string' in bcrypt.hashSync, indicating the backend attempts to hash an undefined password instead of validating required fields first. This is a real defect: the application should validate required fields and return 400/422 before attempting to process the data.

## Repro steps
1. Send POST /users with body: {"firstName": "TestFirstName", "lastName": "TestLastName", "username": "testuser_nopassword", "balance": 10000} (omitting password field)
1. Observe: Server returns 500 Internal Server Error with bcrypt error about undefined argument
1. Expected: Server should return 400 or 422 with validation error indicating password is required
