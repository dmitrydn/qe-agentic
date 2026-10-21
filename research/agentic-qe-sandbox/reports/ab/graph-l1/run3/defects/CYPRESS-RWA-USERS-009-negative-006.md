# Defect report: CYPRESS-RWA-USERS-009-negative-006

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Fail to create user without required defaultPrivacyLevel
**Confidence:** high

## Rationale
The API hints explicitly document that defaultPrivacyLevel is a validated field with enum(public|private|contacts) and is marked as optional. However, the test expects the API to reject requests missing defaultPrivacyLevel with 400/422 status. Across all 3 runs, the API consistently returns 201 and successfully creates users without this field, indicating the backend does not enforce defaultPrivacyLevel as required. This is a real defect: the API accepts invalid input (missing a field that should be validated) when it should reject it.

## Repro steps
1. Send POST /users with body containing firstName, lastName, username, password, balance, and avatar, but omitting defaultPrivacyLevel
1. Observe: API returns 201 Created and successfully creates the user
1. Expected: API should return 400 or 422 rejecting the request due to missing required field defaultPrivacyLevel
