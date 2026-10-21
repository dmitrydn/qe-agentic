# Clarification needed: CYPRESS-RWA-NOTIFICATIONS-004

**Verdict:** needs_clarification
**Score:** 0.75

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | pass | Expected outcome is concrete: status 422 and response.body.errors.length equals 1 |
| D2 | fail | The criterion 'errors when invalid field sent' does not specify WHICH invalid field or WHAT makes it invalid (wrong type, unknown field, missing required field, etc.) |
| D3 | pass | Actor is authenticated primaryUser via session-cookie login, database seeded with known state |
| D4 | pass | Concrete endpoint PATCH /notifications/:notificationId with known request body field isRead (boolean) |
| D5 | partial | The placeholder :notificationId is not defined (which notification from the seeded data should be used) |
| D6 | pass | Single atomic behaviour: validation error response when sending invalid field to notification update endpoint |

## Questions for the author

- What constitutes an 'invalid field' in this context — is it an unknown field name not in the schema, the isRead field with wrong type, a missing required field, or something else?
- Which specific notificationId from the seeded data (data/database-seed.json) should be used in the PATCH request?

## Assumptions the assessor would otherwise make

- The exact structure of response.body.errors array elements is not specified but can be asserted by checking length equals 1
- Standard HTTP 422 semantics apply (unprocessable entity due to validation failure)
