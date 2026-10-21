# Defect report: CYPRESS-RWA-USERS-009-negative-003

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fails to create user without required password
**Confidence:** high

## Rationale
The API documentation states that password is a required field ('must exist') for POST /users. When the test omits the password field, the application should return 400 or 422 (client error indicating validation failure). Instead, the server returns 500 (internal server error) with a stack trace showing 'Error: Illegal arguments: undefined, string' in bcrypt.hashSync, indicating the backend attempts to hash an undefined password rather than validating required fields first. This is a real defect: the application fails to properly validate required fields before processing, leading to an unhandled exception instead of a proper validation error response.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, balance, avatar, and defaultPrivacyLevel but omitting the password field
1. Observe: server returns 500 with bcrypt error about undefined argument
1. Expected: server should return 400 or 422 indicating password is required
