# Clarification needed: CYPRESS-RWA-USERS-012

**Verdict:** needs_clarification
**Score:** 0.67

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | pass | Expected outcome is concrete: status 422 and errors array length equals 1 |
| D2 | fail | Cannot determine WHICH invalid field is being sent or WHAT makes it invalid from the requirement |
| D3 | pass | Actor is authenticated seeded user via session-cookie login, database seeded |
| D4 | pass | Concrete endpoint PATCH /users/:userId with validation rules provided in apiHints |
| D5 | fail | Criterion 'When errors when an invalid field sent' is grammatically incomplete and undefined |
| D6 | pass | Single testable behaviour: validation error response for invalid field in user update |

## Questions for the author

- Which specific field should be sent as invalid in the PATCH request (e.g., firstName, email, balance)?
- What makes the field invalid for this test — wrong type, invalid format, disallowed value, or something else?
- Should the invalid field be sent alongside valid fields, or should only the invalid field be in the request body?

## Assumptions the assessor would otherwise make

- The :userId path parameter will be the authenticated user's own ID
- The response body structure includes an 'errors' array at the top level
- Standard HTTP 422 semantics apply (unprocessable entity due to validation failure)
