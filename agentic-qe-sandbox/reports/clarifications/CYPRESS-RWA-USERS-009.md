# Clarification needed: CYPRESS-RWA-USERS-009

**Verdict:** needs_clarification
**Score:** 0.50

## Dimension findings

| Dimension | Rating | Finding |
|---|---|---|
| D1 | pass | Expected outcomes are concrete and checkable: 201 status, response body contains firstName field, balance equals 10000 cents |
| D2 | fail | Behaviour is undeterminable: criterion 'creates a new user with an account balance in cents' restates the title but doesn't specify WHICH balance value to send in the request, making the test action unclear |
| D3 | fail | Actor context contradicts: criteria state 'authenticated as a seeded user via session-cookie login' but apiHints specify 'actor: anonymous' with 'Auth: none' for POST /users |
| D4 | pass | Concrete endpoint specified: POST /users with field schema provided in apiHints |
| D5 | fail | Internal contradiction: criteria require authentication (cy.loginByApi, seeded user) but apiHints state POST /users requires no auth (actor: anonymous, Auth: none) |
| D6 | pass | Single atomic behaviour: creating one user with a specific balance value |

## Questions for the author

- What balance value (in cents) should be sent in the POST /users request body to test this requirement?
- Should POST /users be called with authentication (as stated in preconditions) or without authentication (as stated in apiHints)? Which is the correct auth context for this test?
- The acceptance criteria reference a firstName variable in the assertion — what firstName value should be sent in the request to enable this check?

## Assumptions the assessor would otherwise make

- The assertion 'expect(response.body.user).to.contain({ firstName })' implies the response includes a user object with a firstName field matching the request
- The balance assertion checks the exact value 10000 cents (100_00), implying this is the expected balance after user creation
- Other required fields (lastName, password, avatar, defaultPrivacyLevel per apiHints) will be provided with valid test values even though not specified in criteria
