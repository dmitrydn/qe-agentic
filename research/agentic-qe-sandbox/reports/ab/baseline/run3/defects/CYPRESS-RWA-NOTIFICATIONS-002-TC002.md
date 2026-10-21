# Defect report: CYPRESS-RWA-NOTIFICATIONS-002-TC002

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-002
**Test case:** Fails to create notifications when not authenticated
**Confidence:** high

## Rationale
The test expects a 401 Unauthorized response when attempting to POST /notifications without authentication, which is the correct behavior for a protected endpoint. However, the application returns 404 Not Found with 'Cannot POST /notifications', indicating the endpoint does not exist or is not registered. This is a real defect because the requirement explicitly documents POST /notifications as an available endpoint, and the application should return 401 for unauthenticated requests rather than 404.

## Repro steps
1. Send POST request to /notifications without authentication credentials
1. Observe: Server returns 404 Not Found with message 'Cannot POST /notifications'
1. Expected: Server should return 401 Unauthorized since the endpoint exists but requires authentication
