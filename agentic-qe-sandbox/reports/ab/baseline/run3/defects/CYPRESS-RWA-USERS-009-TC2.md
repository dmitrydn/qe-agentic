# Defect report: CYPRESS-RWA-USERS-009-TC2

**Requirement:** CYPRESS-RWA-USERS-009
**Test case:** Create user without required firstName field
**Confidence:** high

## Rationale
The API documentation explicitly states that firstName is a required field (marked as 'must exist' in the validated fields). The test correctly sends a POST /users request without the firstName field and expects a 400 or 422 validation error. However, the application accepts the request and returns 201 Created, successfully creating a user without firstName. This is consistently reproducible across all 3 runs, indicating the backend is not enforcing the documented firstName validation requirement.

## Repro steps
1. Send POST /users with body: {"lastName": "TestLastName", "username": "testuser_nofirstname", "password": "SecurePass123!", "balance": 10000} (omitting firstName)
1. Observe: Response status is 201 and user is created with id, uuid, and other fields
1. Expected: Response status should be 400 or 422 rejecting the request due to missing required firstName field
