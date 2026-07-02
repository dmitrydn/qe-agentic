# Defect report: CYPRESS-RWA-USERS-010-TC2

**Requirement:** CYPRESS-RWA-USERS-010
**Test case:** POST /users returns 422 when invalid email format is sent
**Confidence:** high

## Rationale
The application accepts an invalid email format ('not-a-valid-email') and returns 201 Created instead of 422 Unprocessable Entity. The API hints document that email is a validated optional field (string, optional), and the requirement explicitly states that errors should be returned when an invalid field is sent. The application should validate email format and reject malformed emails with a 422 status and an errors array containing 1 error. Instead, it creates the user successfully with the invalid email stored as-is. This behavior is consistently reproducible across all 3 runs.

## Repro steps
1. Send POST /users with body: {"firstName":"Jane","lastName":"Smith","username":"janesmith","password":"Password123!","email":"not-a-valid-email"}
1. Observe: Response status is 201 (expected 422)
1. Observe: Response body contains created user with email='not-a-valid-email' (expected errors array with length 1)
1. Expected: Status 422 with {"errors": [<validation error for email format>]}
