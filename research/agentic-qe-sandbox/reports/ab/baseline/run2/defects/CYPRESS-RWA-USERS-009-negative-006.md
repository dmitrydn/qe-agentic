# Defect report: CYPRESS-RWA-USERS-009-negative-006

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fails to create user without required defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints explicitly document that defaultPrivacyLevel is a validated field with enum(public|private|contacts) and marked as optional. However, the test expects the API to reject requests missing defaultPrivacyLevel with 400/422 status. Across all 3 runs, the API consistently returns 201 and successfully creates users without defaultPrivacyLevel, indicating the backend does not enforce this field as required. This is a real defect: the validation logic fails to reject requests missing defaultPrivacyLevel when the test (and likely business logic) expects it to be mandatory.

## Repro steps
1. Send POST /users with body: {"firstName":"TestFirstName","lastName":"TestLastName","username":"testuser_noprivacy","password":"SecurePass123!","balance":10000,"avatar":"https://example.com/avatar.jpg"} (omitting defaultPrivacyLevel)
1. Observe: API returns 201 Created and successfully creates user
1. Expected: API should return 400 or 422 rejecting the request due to missing required field defaultPrivacyLevel
