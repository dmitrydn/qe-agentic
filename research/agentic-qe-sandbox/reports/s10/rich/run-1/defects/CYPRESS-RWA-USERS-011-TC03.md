# Defect report: CYPRESS-RWA-USERS-011-TC03

**Requirement:** CYPRESS-RWA-USERS-011
**Test case:** User cannot update another user's profile
**Confidence:** high

## Rationale
The test expects a 403 Forbidden response when an authenticated user attempts to update another user's profile, which is a standard authorization check. The application returned 204 No Content instead, indicating the update was accepted. This violates the requirement's acceptance criteria that explicitly states 'When PATCH /users/{{other_user_id}} with body { "firstName": "ShouldNotApply" } Then the response status is 403'. The failure is consistent across all 3 runs with fresh state resets, ruling out flakiness. The application is incorrectly allowing cross-user profile updates.

## Repro steps
1. Authenticate as the primary user (user_id)
1. Send PATCH /users/{{other_user_id}} with body {"firstName": "ShouldNotApply"}
1. Observe: Response status is 204 (success)
1. Expected: Response status should be 403 (forbidden)
