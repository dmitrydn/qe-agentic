# Clarification needed: CYPRESS-RWA-TRANSACTIONS-010

**Verdict:** needs_clarification
**Score:** 0.67

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | pass | Expected outcomes are concrete: status 422 and errors array length equals 1 |
| D2 | fail | The behaviour under test is undeterminable — 'an invalid field' is undefined: which field name, which invalid value, or what makes it invalid is not specified |
| D3 | pass | Actor is authenticated seeded user via session-cookie login, database seeded with known state |
| D4 | pass | Concrete endpoint PATCH /transactions/:transactionId is specified with auth requirement |
| D5 | fail | Criterion 'When errors when an invalid field sent' is grammatically malformed and contradicts the action criterion specifying a PATCH request is made |
| D6 | pass | Single atomic behaviour: validation error response when invalid field is sent |

## Questions for the author

- Which specific field should be sent as invalid — requestStatus or another field?
- What makes the field invalid — wrong data type, value outside the enum, missing required field, or extra unexpected field?
- What specific invalid value should be sent in the test request body?
- Should the 'When errors when an invalid field sent' criterion describe the request payload or the expected outcome? The phrasing is unclear.

## Assumptions the assessor would otherwise make

- The :transactionId path parameter will use a valid transaction ID from the seeded data
- The single error in the errors array corresponds to the one invalid field sent
- Standard REST validation error response structure is assumed (errors array with error objects)
