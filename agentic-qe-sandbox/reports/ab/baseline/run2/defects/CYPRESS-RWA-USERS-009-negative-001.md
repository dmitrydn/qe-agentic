# Defect report: CYPRESS-RWA-USERS-009-negative-001

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fails to create user without required firstName
**Confidence:** high

## Rationale
The API documentation explicitly states that firstName is a required field (marked as 'must exist' in the validated fields). The negative test correctly attempts to create a user without firstName and expects a 400 or 422 error. However, the application accepts the request and returns 201 Created, successfully creating a user without the required firstName field. This behavior is consistently reproduced across all 3 runs, indicating the application fails to validate the required firstName field as documented in the API contract.

## Repro steps
1. Send POST /users with body containing lastName, username, password, balance, avatar, defaultPrivacyLevel but omitting firstName
1. Observe: API returns 201 Created and successfully creates user without firstName field
1. Expected: API should return 400 or 422 error rejecting the request due to missing required firstName field
