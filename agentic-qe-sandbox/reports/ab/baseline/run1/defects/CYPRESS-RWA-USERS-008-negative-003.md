# Defect report: CYPRESS-RWA-USERS-008-negative-003

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without password
**Confidence:** high

## Rationale
The API hints document that password is a validated field marked 'must exist' for POST /users. When the test omits the password field, the application should return 400 or 422 (client error indicating invalid request), but instead returns 500 (server error) with a stack trace showing 'Error: Illegal arguments: undefined, string' in bcrypt.hashSync. This indicates the backend is attempting to hash an undefined password value rather than validating required fields first and rejecting the request with an appropriate 4xx status. The application fails to properly validate required fields before processing, which is a real defect in input validation logic.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, balance, avatar, defaultPrivacyLevel but omitting password field
1. Observe response status 500 instead of expected 400/422
1. Response body shows bcrypt error attempting to hash undefined password value
