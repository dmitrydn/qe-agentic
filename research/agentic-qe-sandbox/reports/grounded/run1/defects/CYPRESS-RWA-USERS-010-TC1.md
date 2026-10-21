# Defect report: CYPRESS-RWA-USERS-010-TC1

**Requirement:** CYPRESS-RWA-USERS-010
**Test case:** POST /users returns 422 when an invalid field is sent
**Confidence:** high

## Rationale
The API accepts a POST /users request containing an unrecognized field 'invalidField' and returns 201 (success) instead of rejecting it with 422. The requirement states that when an invalid field is sent, the response status should be 422 with errors.length === 1. The API hints document all validated fields (firstName, lastName, username, password, email, phoneNumber, balance, avatar, defaultPrivacyLevel), and 'invalidField' is not among them. The application should validate the request body and reject unknown fields, but instead it silently ignores the invalid field and creates the user successfully. This behavior is consistently reproducible across all three runs.

## Repro steps
1. Send POST /users with body containing a valid user payload plus an unrecognized field: {"firstName":"John","lastName":"Doe","username":"johndoe","password":"Password123!","invalidField":"this should not be here"}
1. Observe: API returns 201 Created with a new user object, ignoring the invalid field
1. Expected: API should return 422 Unprocessable Entity with errors array containing 1 error about the invalid field
