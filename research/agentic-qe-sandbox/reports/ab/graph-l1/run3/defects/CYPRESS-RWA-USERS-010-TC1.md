# Defect report: CYPRESS-RWA-USERS-010-TC1

**Requirement:** CYPRESS-RWA-USERS-010
**Test case:** POST /users returns 422 when an invalid field is sent
**Confidence:** high

## Rationale
The API accepts a POST /users request containing an invalid field 'invalidField' and returns 201 (success) instead of rejecting it with 422. According to the API hints, the endpoint has a defined set of validated fields (firstName, lastName, username, password, email, phoneNumber, balance, avatar, defaultPrivacyLevel). The requirement expects that when an invalid field is sent, the response status should be 422 with an errors array of length 1. Instead, the application silently ignores the invalid field and creates the user successfully. This behavior is consistently reproduced across all 3 runs, indicating the application does not validate against unexpected/invalid fields in the request body.

## Repro steps
1. Send POST /users with valid required fields plus an additional invalid field: {"firstName":"John","lastName":"Doe","username":"johndoe","password":"Password123!","email":"john@example.com","phoneNumber":"555-1234","balance":1000,"avatar":"http://example.com/avatar.jpg","defaultPrivacyLevel":"public","invalidField":"this should cause an error"}
1. Observe: Response status is 201 (Created) with a user object in the body
1. Expected: Response status should be 422 with an errors array containing 1 error about the invalid field
