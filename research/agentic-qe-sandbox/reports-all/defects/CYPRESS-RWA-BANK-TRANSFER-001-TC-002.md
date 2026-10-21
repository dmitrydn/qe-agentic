# Defect report: CYPRESS-RWA-BANK-TRANSFER-001-TC-002

**Requirement:** CYPRESS-RWA-BANK-TRANSFER-001
**Test case:** Unauthenticated user cannot get bank transfers
**Confidence:** high

## Rationale
The test expects a 401 Unauthorized response when accessing GET /bankTransfer without authentication, which is the correct security behavior for a protected endpoint. However, the application returns 404 Not Found with 'Cannot GET /bankTransfer', indicating the endpoint does not exist or is not registered. The response is consistent across all 3 runs with fresh state resets, ruling out flakiness. The requirement confirms GET /bankTransfer is a valid endpoint that should exist. This is a real defect: the endpoint is either not implemented or not properly registered in the routing layer.

## Repro steps
1. Send GET request to /bankTransfer without authentication credentials
1. Observe 404 Not Found response with body 'Cannot GET /bankTransfer'
1. Expected: 401 Unauthorized response indicating authentication is required
