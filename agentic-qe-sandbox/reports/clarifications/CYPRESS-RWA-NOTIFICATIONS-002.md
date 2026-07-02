# Clarification needed: CYPRESS-RWA-NOTIFICATIONS-002

**Verdict:** untestable
**Score:** 0.42
**Blocked by:** D1

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | fail | No checkable outcome stated — 'the request completes' with a reference to external source provides no concrete oracle (status code, response structure, field values, or error condition) |
| D2 | fail | Cannot determine which behaviour is under test — 'creates notifications for transaction, like and comment' appears in both When and title but never defines what creating means, which entities are involved, or what distinguishes transaction/like/comment notifications |
| D3 | pass | Actor and preconditions specified: authenticated seeded user via session-cookie login, database seeded from specific JSON file |
| D4 | pass | Concrete endpoint provided: POST /notifications |
| D5 | partial | The criterion 'When creates notifications for transaction, like and comment' duplicates the title without defining the action, and 'see source for the exact assertion' is an external placeholder rather than a stated expectation |
| D6 | fail | Spans three distinct behaviours (transaction notifications, like notifications, comment notifications) without specifying whether this tests creation of all three types, one type, or their interaction |

## Questions for the author

- What specific response or state change constitutes 'the request completes' — a 200/201 status code, a notification ID returned, a database record created, or something else?
- What does 'creates notifications' mean in this context — does the POST endpoint create new notifications, or does it retrieve/list notifications that were created by other actions (transactions, likes, comments)?
- Are transaction, like, and comment three separate notification types that should all be created in one test, or is this requirement testing the creation of one type as an example?
- What request body or parameters are needed for the POST /notifications call to create these notifications?
- What distinguishes a transaction notification from a like notification from a comment notification in the expected outcome?
