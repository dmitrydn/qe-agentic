# Defect report: CYPRESS-RWA-CONTACTS-003-TC1

**Requirement:** CYPRESS-RWA-CONTACTS-003
**Test case:** POST /contacts returns 422 when invalid contactUserId is provided
**Confidence:** high

## Rationale
The application accepts an invalid contactUserId ('invalid-user-id') and returns 200 with a successfully created contact, instead of rejecting it with 422 and validation errors. The requirement explicitly states the endpoint should 'error when invalid contactUserId' and return status 422 with an errors array of length 1. The test consistently fails across all 3 runs with identical behavior: the API creates a contact record with the invalid ID rather than validating and rejecting it. This is a clear validation defect in the POST /contacts endpoint.

## Repro steps
1. Authenticate as a seeded user (primaryUser)
1. Send POST /contacts with body {"contactUserId": "invalid-user-id"}
1. Observe: response status is 200 and contact is created with the invalid contactUserId
1. Expected: response status should be 422 with errors array containing 1 validation error
