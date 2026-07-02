# Defect report: CYPRESS-RWA-USERS-010-TC1

**Requirement:** CYPRESS-RWA-USERS-010
**Test case:** POST /users returns 422 when an invalid field is sent
**Confidence:** high

## Rationale
The API accepted an invalid email format ('invalid-email') and returned 201 Created instead of 422 Unprocessable Entity. According to the API hints, the email field is documented as 'string, optional' but the requirement explicitly states the endpoint should return 422 'when an invalid field sent'. The test consistently sent a malformed email across all 3 runs and the API accepted it every time, creating users with IDs VbhsRhlKi, olRCX1ktvn, and Octcw0M5g8. The application failed to validate the email field format, which is a real defect in input validation.

## Repro steps
1. Send POST /users with body containing email: 'invalid-email' (not a valid email format)
1. Observe response status 201 instead of expected 422
1. Observe user created successfully with the invalid email stored in the database
