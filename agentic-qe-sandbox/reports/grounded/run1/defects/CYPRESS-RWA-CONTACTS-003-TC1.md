# Defect report: CYPRESS-RWA-CONTACTS-003-TC1

**Requirement:** CYPRESS-RWA-CONTACTS-003
**Test case:** POST /contacts returns 422 when invalid contactUserId is provided
**Confidence:** high

## Rationale
The requirement explicitly states that POST /contacts should return status 422 and an errors array with length 1 when given an invalid contactUserId. However, across all three runs, the endpoint consistently returns 200 OK and successfully creates a contact with the invalid contactUserId value ('invalid-user-id'), storing it directly in the database without validation. The application is not validating that contactUserId references an existing user, which violates the documented requirement for error handling on invalid input.

## Repro steps
1. Authenticate as a seeded user (primaryUser) via session-cookie login
1. Send POST /contacts with body {"contactUserId": "invalid-user-id"}
1. Observe: response status is 200 (expected 422)
1. Observe: response body contains a successfully created contact object with the invalid contactUserId (expected errors array)
