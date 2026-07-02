# Clarification needed: CYPRESS-RWA-CONTACTS-003

**Verdict:** needs_clarification
**Score:** 0.67

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | pass | Expected outcome is concrete: status 422 and response.body.errors array with length 1 |
| D2 | fail | The behaviour under test is undeterminable — 'errors when invalid contactUserId' does not specify WHAT makes the contactUserId invalid (missing, wrong type, non-existent ID, malformed format) |
| D3 | pass | Actor is authenticated primaryUser via session-cookie login (cy.loginByApi), database seeded with known state |
| D4 | pass | Concrete endpoint POST /contacts is specified in apiHints with auth requirement |
| D5 | fail | Criterion 'When errors when invalid contactUserId' is a fragment that restates the title without defining what constitutes invalidity, creating internal ambiguity about the test condition |
| D6 | pass | Single atomic behaviour: validation error response for one specific invalid input scenario |

## Questions for the author

- What specifically makes the contactUserId invalid in this test case — is it missing from the request body, null, a non-existent user ID, a malformed string, the wrong data type, or something else?
- Should the request body include the invalid contactUserId field, or should it be absent entirely?

## Assumptions the assessor would otherwise make

- The exact structure of the errors array element (message, field name, error code) is not specified but can be asserted generically as 'array with length 1'
- Standard REST validation error response structure is assumed for the 422 status
