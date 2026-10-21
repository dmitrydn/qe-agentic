# Defect report: CYPRESS-RWA-USERS-008-negative-003

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without password
**Confidence:** high

## Rationale
The API hints document that password is a required field ('must exist') for POST /users. When the test omits the password field, the application should return 400 or 422 (client error indicating validation failure). Instead, the server returns 500 with a stack trace showing 'Error: Illegal arguments: undefined, string' in bcrypt.hashSync, indicating the backend attempts to hash an undefined password value rather than validating required fields first. This is a real defect: the application fails to properly validate required fields before processing, resulting in an internal server error instead of the expected client error response.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"nopassword","balance":100,"avatar":"https://example.com/avatar.jpg","defaultPrivacyLevel":"public"} (omitting password field)
1. Observe: Server returns 500 Internal Server Error with bcrypt.hashSync error on undefined password
1. Expected: Server should return 400 or 422 with validation error indicating password is required
