# Defect report: CYPRESS-RWA-USERS-009-negative-003

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required password
**Confidence:** high

## Rationale
The API documentation states that password is validated as 'any(must exist)', meaning it is a required field. The negative test correctly omits the password field and expects a 400 or 422 validation error. However, the application returns 500 Internal Server Error with a stack trace showing 'Error: Illegal arguments: undefined, string' from bcrypt.hashSync, indicating the backend attempts to hash an undefined password instead of validating required fields first. This is a real defect: the application should validate required fields and return 400/422 before attempting to process the request.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, balance, avatar, defaultPrivacyLevel but omitting password field
1. Observe: server returns 500 Internal Server Error with bcrypt error about undefined argument
1. Expected: server should return 400 or 422 indicating password is required
