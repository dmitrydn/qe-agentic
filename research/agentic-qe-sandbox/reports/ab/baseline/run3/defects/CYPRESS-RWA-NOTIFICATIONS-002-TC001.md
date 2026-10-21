# Defect report: CYPRESS-RWA-NOTIFICATIONS-002-TC001

**Requirement:** CYPRESS-RWA-NOTIFICATIONS-002
**Test case:** Creates notifications for transaction, like and comment as authenticated user
**Confidence:** high

## Rationale
The application returns 404 'Cannot POST /notifications' indicating the endpoint does not exist or is not registered. The requirement explicitly documents POST /notifications as an available API endpoint, and the acceptance criteria state that a POST /notifications request should complete successfully. The test correctly attempts to POST to this documented endpoint with proper authentication (loginByApi), but the application fails to handle the request. This is a consistent failure across all 3 runs with identical behavior, ruling out flakiness. The error is a missing route implementation, not infrastructure noise.

## Repro steps
1. Authenticate as a seeded user via session-cookie login
1. Send POST request to /notifications with empty body
1. Observe 404 response with message 'Cannot POST /notifications'
1. Expected: status 200, 201, or 204 indicating successful notification creation
1. Actual: status 404 indicating the endpoint is not implemented
