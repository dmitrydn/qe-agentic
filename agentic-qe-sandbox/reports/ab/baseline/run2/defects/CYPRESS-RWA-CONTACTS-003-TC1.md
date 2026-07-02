# Defect report: CYPRESS-RWA-CONTACTS-003-TC1

**Requirement:** CYPRESS-RWA-CONTACTS-003
**Test case:** POST /contacts returns 422 when invalid contactUserId is provided
**Confidence:** high

## Rationale
The application accepts an invalid contactUserId ('invalid-user-id') and returns 200 with a created contact object, instead of rejecting it with 422 and an errors array. The requirement explicitly states that when an invalid contactUserId is provided, the response status should be 422 with an errors array of length 1. The failure is consistent across all 3 runs, showing the application lacks proper validation for the contactUserId field.

## Repro steps
1. Authenticate as a seeded user (primaryUser)
1. Send POST /contacts with body {"contactUserId": "invalid-user-id"}
1. Observe: response is 200 with a contact object containing the invalid contactUserId
1. Expected: response should be 422 with {"errors": [<validation error>]}
