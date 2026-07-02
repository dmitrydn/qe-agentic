# Defect report: CYPRESS-RWA-CONTACTS-003-TC1

**Requirement:** CYPRESS-RWA-CONTACTS-003
**Test case:** POST /contacts returns 422 when invalid contactUserId is provided
**Confidence:** high

## Rationale
The requirement explicitly states that POST /contacts should return status 422 and an errors array with length 1 when an invalid contactUserId is provided. However, across all three runs, the API consistently returns 200 OK and successfully creates a contact with the invalid contactUserId ('invalid-user-id'), storing it directly without validation. The application is not validating the contactUserId field and should reject invalid user IDs with a 422 status.

## Repro steps
1. Authenticate as a seeded user (primaryUser) via session-cookie login
1. Send POST /contacts with body {"contactUserId": "invalid-user-id"}
1. Observe: API returns 200 OK and creates contact with the invalid ID
1. Expected: API should return 422 with errors array containing validation error
