# Defect report: CYPRESS-RWA-USERS-009-TC2

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user without required firstName field
**Confidence:** high

## Rationale
The API hint explicitly states that firstName is a required field ('firstName (any(must exist))') for POST /users. The test correctly sends a request omitting firstName and expects a 4xx validation error (400 or 422). However, the application accepts the request and returns 201 Created, successfully creating a user without the required firstName field. This violates the documented API contract. The failure is consistent across all 3 runs, indicating a real validation defect in the application.

## Repro steps
1. Send POST /users with body: {"lastName":"TestLastName","username":"testuser_nofirstname","password":"SecurePass123!","balance":10000} (omitting firstName)
1. Observe: Server returns 201 Created and creates user without firstName
1. Expected: Server should return 400 or 422 rejecting the request due to missing required firstName field
