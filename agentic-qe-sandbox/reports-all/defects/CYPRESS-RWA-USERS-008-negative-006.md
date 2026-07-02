# Defect report: CYPRESS-RWA-USERS-008-negative-006

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints document that defaultPrivacyLevel is a validated field marked as 'any(must exist)', meaning it is required. The test correctly sends a POST /users request omitting defaultPrivacyLevel and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 with a created user, failing to enforce the documented required field validation. This behavior is consistently reproducible across all three runs.

## Repro steps
1. Send POST /users with body: {"firstName":"John","lastName":"Doe","username":"noprivacy","password":"Pass123!","balance":100,"avatar":"https://example.com/avatar.jpg"} (omitting defaultPrivacyLevel)
1. Observe: Response status is 201 and user is created
1. Expected: Response status should be 400 or 422 indicating validation failure for missing required field defaultPrivacyLevel
