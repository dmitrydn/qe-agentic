# Defect report: CYPRESS-RWA-USERS-010-TC1

**Requirement:** CYPRESS-RWA-USERS-010
**Test case:** POST /users returns 422 when an invalid field is sent
**Confidence:** high

## Rationale
The API accepts a POST /users request containing an unrecognized field 'invalidField' and returns 201 (success) instead of rejecting it with 422. According to the API hints, the endpoint has a defined set of validated fields (firstName, lastName, username, password, email, phoneNumber, balance, avatar, defaultPrivacyLevel). The requirement expects that when an invalid field is sent, the response should be 422 with errors.length === 1. The application is incorrectly accepting and silently ignoring extra fields rather than validating and rejecting them, which violates the documented contract that only specific fields should be accepted.

## Repro steps
1. Send POST /users with all valid required fields plus an extra unrecognized field 'invalidField': 'this should cause an error'
1. Observe: response status is 201 (Created) and user is successfully created
1. Expected: response status should be 422 (Unprocessable Entity) with errors array containing 1 error about the invalid field
