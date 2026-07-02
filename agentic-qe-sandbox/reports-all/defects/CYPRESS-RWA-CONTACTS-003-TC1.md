# Defect report: CYPRESS-RWA-CONTACTS-003-TC1

**Requirement:** CYPRESS-RWA-CONTACTS-003
**Test case:** POST /contacts returns 422 when invalid contactUserId is provided
**Confidence:** high

## Rationale
The application accepts an invalid contactUserId ('invalid-user-id') and returns 200 with a created contact object, instead of rejecting it with 422 and an errors array. The requirement explicitly states that the endpoint should 'error when invalid contactUserId' and return status 422 with an errors array of length 1. All three runs consistently show the same behavior: the API successfully creates a contact with the invalid ID rather than validating and rejecting it. This is a clear validation defect in the POST /contacts endpoint.

## Repro steps
1. Authenticate as a seeded user (primaryUser)
1. Send POST /contacts with body {"contactUserId": "invalid-user-id"}
1. Observe: response status is 200 and contact is created with the invalid contactUserId
1. Expected: response status should be 422 with errors array containing 1 validation error
