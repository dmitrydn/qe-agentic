# Defect report: CYPRESS-RWA-USERS-008-negative-001

**Requirement:** CYPRESS-RWA-USERS-008
**Test case:** Fails to create user without firstName
**Confidence:** high

## Rationale
The API hints document that firstName is a validated field marked as 'any(must exist)', meaning it is required. The negative test correctly sends a POST /users request omitting the firstName field and expects a 400 or 422 error status. However, the application accepts the request and returns 201, creating a user without firstName (the response body shows no firstName field). This violates the documented validation requirement. The failure is consistent across all 3 runs.

## Repro steps
1. Send POST /users with body: {"lastName":"Doe","username":"missingfirst","password":"Pass123!","balance":100,"avatar":"https://example.com/avatar.jpg","defaultPrivacyLevel":"public"} (omitting firstName)
1. Observe: response status is 201 (success) instead of 400/422 (validation error)
1. Observe: response body contains a created user object without a firstName field
1. Expected: request should be rejected with 400 or 422 status because firstName is documented as 'must exist'
