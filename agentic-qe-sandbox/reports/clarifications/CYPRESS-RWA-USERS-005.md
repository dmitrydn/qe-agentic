# Clarification needed: CYPRESS-RWA-USERS-005

**Verdict:** untestable
**Score:** 0.50
**Blocked by:** D1

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | fail | The final acceptance criterion is truncated mid-assertion (ends with 'expect(response.body.results[0]).to.contain({'), providing no checkable outcome. |
| D2 | fail | The behaviour under test is undeterminable: 'gets users by email' could mean filtering by email parameter, searching email fields, or something else entirely—no query parameter or search mechanism is specified. |
| D3 | pass | Actor (authenticated seeded user via session-cookie login) and preconditions (seeded database) are explicitly specified. |
| D4 | pass | Concrete endpoint GET /users/search is specified in both criteria and apiHints with auth requirements. |
| D5 | fail | The truncated assertion creates an internal inconsistency—the requirement states an expected outcome but provides no actual expectation to verify. |
| D6 | pass | Single atomic behaviour: searching/getting users by email via one endpoint. |

## Questions for the author

- What is the complete expected outcome for the final acceptance criterion? The assertion 'expect(response.body.results[0]).to.contain({' is incomplete—what fields and values should results[0] contain?
- How is 'by email' operationalized in the GET /users/search request? Is there a query parameter (e.g., ?email=..., ?q=...), and what email value should be used from the seeded data?
- What does 'gets users by email' mean precisely—exact email match, partial match, case-insensitive search, or something else?
