# Defect report: CYPRESS-RWA-NOTIFICATIONS-002-TC002

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-002
**Test case:** Unauthenticated user cannot create notifications
**Confidence:** high

## Rationale
The test expects POST /notifications to return 401 when unauthenticated, but the endpoint returns 404 'Cannot POST /notifications'. The API hints document POST /notifications as a valid endpoint, and the requirement confirms it should exist. A properly implemented endpoint should return 401 for unauthenticated requests, not 404. The consistent 404 across all 3 runs indicates the endpoint is either not implemented or not registered in the routing layer.

## Repro steps
1. Send POST request to /notifications without authentication credentials
1. Observe: Server returns 404 'Cannot POST /notifications'
1. Expected: Server should return 401 Unauthorized since the endpoint exists but requires authentication
