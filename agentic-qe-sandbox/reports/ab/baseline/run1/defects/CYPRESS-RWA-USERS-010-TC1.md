# Defect report: CYPRESS-RWA-USERS-010-TC1

**Requirement:** CYPRESS-RWA-USERS-010
**Test case:** POST /users returns 422 when an invalid field is sent
**Confidence:** high

## Rationale
The API accepts a POST /users request containing an unrecognized field 'invalidField' and returns 201 (success) instead of rejecting it with 422. According to the API hints, POST /users has a defined set of validated fields (firstName, lastName, username, password, email, phoneNumber, balance, avatar, defaultPrivacyLevel). The requirement expects that 'when an invalid field sent' the response status should be 422 with errors.length === 1. The application silently ignores the extra field and creates the user successfully, which violates the documented validation behavior. All three runs consistently show the same behavior (201 response, user created), indicating this is not a flaky test but a real validation defect.

## Repro steps
1. Send POST /users with all valid required fields plus an extra unrecognized field 'invalidField': {"firstName":"John","lastName":"Doe","username":"johndoe","password":"Password123!","email":"john@example.com","phoneNumber":"555-1234","balance":1000,"avatar":"http://example.com/avatar.jpg","defaultPrivacyLevel":"public","invalidField":"this should cause an error"}
1. Observe: API returns 201 and creates user successfully
1. Expected: API should return 422 with errors array containing 1 error about the invalid field
