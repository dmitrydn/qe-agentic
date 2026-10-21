# Defect report: CYPRESS-RWA-COMMENTS-002-TC005

**Requirement:** CYPRESS-RWA-COMMENTS-002
**Test case:** Fail to post comment on unknown transaction
**Confidence:** high

## Rationale
The test expects a 404 status when posting a comment to a non-existent transaction ID, but the application returns 500 with a TypeError indicating it cannot destructure properties from an undefined transaction object. The error 'Cannot destructure property senderId of getTransactionById(...) as it is undefined' shows the backend code fails to handle the case where getTransactionById returns undefined/null for a non-existent transaction, causing an unhandled exception instead of the expected 404 response. This is a real defect in error handling - the application should gracefully return 404 when the transaction doesn't exist, not crash with a 500 error.

## Repro steps
1. Authenticate as a valid user
1. POST /comments/00000000-0000-0000-0000-000000000000 with body {"content": "Comment on unknown transaction"}
1. Observe: Returns 500 Internal Server Error with TypeError about undefined transaction
1. Expected: Should return 404 Not Found
