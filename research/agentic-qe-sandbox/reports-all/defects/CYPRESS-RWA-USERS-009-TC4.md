# Defect report: CYPRESS-RWA-USERS-009-TC4

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user without required password field
**Confidence:** high

## Rationale
The API hints document that password is a required field (must exist) for POST /users. The test correctly sends a request omitting the password field and expects a 400 or 422 validation error. Instead, the application returns 500 with a stack trace showing 'Error: Illegal arguments: undefined, string' in bcrypt.hashSync, indicating the backend attempts to hash an undefined password rather than validating required fields first. This is a real defect: the application should validate required fields and return 400/422 before attempting to process the data.

## Repro steps
1. Send POST /users with body: {"firstName": "TestFirstName", "lastName": "TestLastName", "username": "testuser_nopassword", "balance": 10000} (omitting password field)
1. Observe: response status 500 with bcrypt error 'Illegal arguments: undefined, string'
1. Expected: response status 400 or 422 indicating missing required field 'password'
