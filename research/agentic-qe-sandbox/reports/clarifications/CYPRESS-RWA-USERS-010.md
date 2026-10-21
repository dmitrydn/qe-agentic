# Clarification needed: CYPRESS-RWA-USERS-010

**Verdict:** needs_clarification
**Score:** 0.67

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | pass | Expected outcome is concrete: status 422 and errors array length equals 1 |
| D2 | fail | Cannot determine WHICH invalid field is being tested or WHAT makes it invalid |
| D3 | pass | Actor is authenticated seeded user via session-cookie login, database seeded |
| D4 | pass | Concrete endpoint POST /users is specified in apiHints |
| D5 | fail | Contradiction: apiHints show POST /users requires anonymous actor, but criteria specify authenticated user |
| D6 | pass | Single atomic behaviour: validation error response for invalid field |

## Questions for the author

- Which specific field should be sent as invalid (e.g., firstName, email, balance) and what makes it invalid (e.g., wrong type, missing required, invalid format)?
- Should the request be made as an authenticated user (per criteria) or anonymous (per apiHints showing POST /users auth: none)?

## Assumptions the assessor would otherwise make

- The errors array structure exists in response.body.errors and is checkable for length
- A single invalid field will produce exactly one error in the array
