# Defect report: CYPRESS-RWA-BANK-TRANSFER-001-TC-001

**Requirement:** CYPRESS-RWA-BANK-TRANSFER-001
**Test case:** Authenticated user gets a list of bank transfers
**Confidence:** high

## Rationale
The application returns 404 'Cannot GET /bankTransfer' for an endpoint that should exist according to the requirement and API hints. The requirement explicitly states GET /bankTransfer should return 200 with bank transfer data for an authenticated user. The test correctly authenticates as primaryUser and makes the documented GET request, but the endpoint is not implemented or not mounted at the expected path. This is a clear application defect: the API contract specifies this endpoint must exist, but the server responds that it does not.

## Repro steps
1. Authenticate as a seeded user (primaryUser) via session-cookie login
1. Send GET request to /bankTransfer
1. Observe: 404 response with 'Cannot GET /bankTransfer' HTML error page
1. Expected: 200 response with JSON body containing transfers array where transfers[0].userId matches the authenticated user's ID
