# Defect report: CYPRESS-RWA-USERS-009-negative-003

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required password
**Confidence:** high

## Rationale
The API documentation states that password is validated as 'any(must exist)', meaning it is a required field. The negative test correctly omits the password field and expects a 400 or 422 validation error. However, the application returns 500 Internal Server Error with a stack trace showing 'Error: Illegal arguments: undefined, string' from bcrypt.hashSync, indicating the backend attempts to hash an undefined password before validating required fields. This is a real defect: the application should validate required fields and return 400/422 before attempting to process the data.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, balance, avatar, defaultPrivacyLevel but omitting password field
1. Observe 500 Internal Server Error with bcrypt error instead of expected 400/422 validation error
1. Expected: 400 or 422 status with validation error message
1. Actual: 500 status with 'Illegal arguments: undefined, string' from bcrypt.hashSync
