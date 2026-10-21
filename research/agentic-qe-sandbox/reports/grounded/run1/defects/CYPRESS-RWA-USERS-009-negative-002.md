# Defect report: CYPRESS-RWA-USERS-009-negative-002

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user with missing required fields
**Confidence:** high

## Rationale
The test correctly expects a 400 or 422 status when required fields are missing from POST /users. However, the application returns 500 with a bcrypt error 'Illegal arguments: undefined, string', indicating the backend attempts to hash an undefined password without first validating required fields. The API hints show password is optional, but the stack trace reveals the application crashes when password is undefined rather than returning proper validation errors. This is a real defect: the application should validate inputs and return 4xx before attempting operations that assume field presence.

## Repro steps
1. Send POST /users with body {"firstName": "TestFirstName", "balance": 10000} (omitting username and password)
1. Observe response status 500 instead of expected 400/422
1. Response body shows bcrypt.hashSync error with 'undefined' argument, indicating missing input validation before password hashing
