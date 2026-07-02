# Defect report: CYPRESS-RWA-USERS-008-negative-006

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hint explicitly states that defaultPrivacyLevel is a validated field marked as 'any(must exist)', meaning it is required. The test correctly sends a POST /users request omitting defaultPrivacyLevel and expects a 400 or 422 error. However, the application accepts the request and returns 201 Created, successfully creating a user without this required field. This violates the documented contract that defaultPrivacyLevel must exist. The failure is consistent across all 3 runs.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"missingprivacy","password":"Pass123!","balance":100,"avatar":"https://example.com/avatar.jpg"}
1. Observe: Response status is 201 and user is created
1. Expected: Response status should be 400 or 422 because defaultPrivacyLevel is a required field per API contract
