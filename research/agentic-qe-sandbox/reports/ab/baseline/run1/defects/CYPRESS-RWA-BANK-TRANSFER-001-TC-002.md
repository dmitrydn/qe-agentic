# Defect report: CYPRESS-RWA-BANK-TRANSFER-001-TC-002

**Requirement:** CYPRESS-RWA-BANK-TRANSFER-001
**Test case:** Unauthenticated user cannot get bank transfers
**Confidence:** high

## Rationale
The test expects a 401 Unauthorized response when accessing GET /bankTransfer without authentication, which is the correct security behavior for a protected endpoint. However, the application returns 404 Not Found with 'Cannot GET /bankTransfer', indicating the endpoint does not exist or is not registered. The requirement confirms GET /bankTransfer is a valid endpoint (used by authenticated users), so it should exist and return 401 for unauthenticated requests, not 404. This is a real defect in the application's routing or endpoint registration.

## Repro steps
1. Send GET request to /bankTransfer without authentication credentials
1. Observe: Response status is 404 with body 'Cannot GET /bankTransfer'
1. Expected: Response status should be 401 Unauthorized (endpoint exists but requires authentication)
