# Defect report: CYPRESS-RWA-USERS-009-TC2

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user fails when required fields are missing
**Confidence:** high

## Rationale
The API returned 500 Internal Server Error instead of the expected 400/422 validation error when required fields (lastName, password, balance, avatar, defaultPrivacyLevel) were missing from the POST /users request. The stack trace shows 'Error: Illegal arguments: undefined, string' in bcrypt.hashSync, indicating the backend attempted to hash an undefined password value rather than validating required fields first. According to the API hints, lastName, password, balance, avatar, and defaultPrivacyLevel are all required fields (must exist). The application should validate input and return 400/422 before attempting to process the data, not crash with a 500 error.

## Repro steps
1. POST /users with body containing only firstName: 'TestFirstName' (omitting required fields: lastName, password, balance, avatar, defaultPrivacyLevel)
1. Observe response status 500 with bcrypt error in stack trace
1. Expected: status 400 or 422 with validation error message indicating missing required fields
