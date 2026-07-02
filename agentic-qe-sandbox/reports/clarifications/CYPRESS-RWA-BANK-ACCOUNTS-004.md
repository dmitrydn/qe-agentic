# Clarification needed: CYPRESS-RWA-BANK-ACCOUNTS-004

**Verdict:** needs_clarification
**Score:** 0.67

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | pass | Expected outcome is concrete and checkable: response status 200 |
| D2 | fail | Endpoint path contradicts behaviour: DELETE /contacts/:bankAccountId for deleting a bank account creates genuine ambiguity about which resource type is being deleted |
| D3 | pass | Actor (authenticated seeded user via session-cookie login) and preconditions (seeded database) are specified |
| D4 | pass | Concrete endpoint provided: DELETE /contacts/:bankAccountId with path parameter |
| D5 | fail | Internal contradiction: title and criteria reference 'bank account' but endpoint path is /contacts/:bankAccountId, creating undefined relationship between contacts and bank accounts |
| D6 | pass | Single atomic behaviour: deleting one bank account resource |

## Questions for the author

- Is the endpoint path correct? Should it be DELETE /bankAccounts/:bankAccountId instead of DELETE /contacts/:bankAccountId, or does a 'contact' represent a bank account in this system?
- If /contacts/:bankAccountId is correct, what is the relationship between a 'contact' and a 'bank account' — are they the same entity with different naming, or is a bank account a property of a contact?

## Assumptions the assessor would otherwise make

- The bankAccountId parameter value would be obtained from the seeded database data
- A 200 status is sufficient to verify deletion success without checking response body or subsequent GET requests
- Standard REST semantics apply: 200 indicates successful deletion
