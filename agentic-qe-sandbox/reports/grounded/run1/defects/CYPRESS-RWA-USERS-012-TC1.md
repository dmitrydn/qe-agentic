# Defect report: CYPRESS-RWA-USERS-012-TC1

**Requirement:** CYPRESS-RWA-USERS-012
**Test case:** PATCH /users/:userId returns 422 when an invalid field is sent
**Confidence:** high

## Rationale
The test sends a PATCH request with an invalid field 'invalidField' and expects exactly 1 error in the response (errors.length === 1). However, the application returns 2 errors: one for the invalid nested field validations and one for an invalid userId parameter. The requirement states 'errors when an invalid field sent' and expects a single error, but the API is returning multiple errors including an unexpected userId validation error. The response body shows errors array has length 2, not 1 as required.

## Repro steps
1. Authenticate as primaryUser via session-cookie login
1. Send PATCH /users/:userId with body {"invalidField": "someValue"}
1. Observe response status 422 with errors array containing 2 elements instead of expected 1
1. Expected: errors.length === 1, Actual: errors.length === 2
