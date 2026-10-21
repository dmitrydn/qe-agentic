# Testability report (Phase A — measure only)

Run: 2026-06-27T18-57-01
Model: anthropic/claude-sonnet-4.5    Settings: threshold 0.7 · clarifyOnFail [D2,D3,D5] · strictFail off · runs 1
Summary: 20 testable / 17 needs-clarification / 7 untestable

Dimensions D1–D6 (`+` pass · `~` partial · `F` fail):  D1 oracle · D2 clarity · D3 actor · D4 interface · D5 consistency · D6 scope

| Requirement | Verdict | Score | D1–D6 | Blocked by | Top gap |
|---|---|---|---|---|---|
| CYPRESS-RWA-BANK-ACCOUNTS-001 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-BANK-ACCOUNTS-002 | testable | 0.92 | + + + + ~ + | — | Which userId should be used in the assertion `expect(response.body.account.userId).to.eq(userId)` — the authenticated user making the request, or a different user from the seed data? |
| CYPRESS-RWA-BANK-ACCOUNTS-003 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-BANK-ACCOUNTS-004 | needs_clarification | 0.67 | + F + + F + | — | Is the endpoint path correct? Should it be DELETE /bankAccounts/:bankAccountId instead of DELETE /contacts/:bankAccountId, or does a 'contact' represent a bank account in this system? |
| CYPRESS-RWA-BANK-ACCOUNTS-005 | untestable | 0.75 | ~ + + F + + | D4 | What is the exact expected outcome when the request completes? What response fields, structure, or values should be asserted (e.g., array of bank accounts, specific fields like id/accountNumber, non-empty result)? |
| CYPRESS-RWA-BANK-ACCOUNTS-006 | untestable | 0.58 | F ~ + F + + | D1, D4 | What is the exact expected outcome when a bank account is successfully created — which status code, response fields, or entity properties should be asserted? |
| CYPRESS-RWA-BANK-ACCOUNTS-007 | untestable | 0.50 | + F + F F + | D4 | Which bank account should be deleted — is it identified by ID, and if so, should the test use a specific seeded account ID from database-seed.json? |
| CYPRESS-RWA-BANK-TRANSFER-001 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-COMMENTS-001 | testable | 0.92 | + + + + ~ + | — | Which specific transactionId from the seeded data (data/database-seed.json) should be used in the GET /comments/:transactionId request? |
| CYPRESS-RWA-COMMENTS-002 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-CONTACTS-001 | needs_clarification | 0.67 | + + F + F + | — | Does GET /contacts/:username require authentication or not? The acceptance criteria specify session-cookie login (cy.loginByApi), but the API hints state Auth: none for anonymous actor. |
| CYPRESS-RWA-CONTACTS-002 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-CONTACTS-003 | needs_clarification | 0.67 | + F + + F + | — | What specifically makes the contactUserId invalid in this test case — is it missing from the request body, null, a non-existent user ID, a malformed string, the wrong data type, or something else? |
| CYPRESS-RWA-CONTACTS-004 | testable | 0.92 | + + + + ~ + | — | The criterion 'When deletes a contact' appears redundant with 'When a DELETE /contacts/:contactId request is made' — should one be removed, or does it indicate a specific verification step beyond the HTTP call? |
| CYPRESS-RWA-LIKES-001 | testable | 0.92 | + + + + ~ + | — | Which specific transactionId from the seeded data (data/database-seed.json) should be used, and how do we know it has exactly 1 like? |
| CYPRESS-RWA-LIKES-002 | testable | 0.92 | + + + + ~ + | — | Which specific transactionId from the seeded data (database-seed.json) should be used in the POST request? |
| CYPRESS-RWA-NOTIFICATIONS-001 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-NOTIFICATIONS-002 | untestable | 0.42 | F F + + ~ F | D1 | What specific response or state change constitutes 'the request completes' — a 200/201 status code, a notification ID returned, a database record created, or something else? |
| CYPRESS-RWA-NOTIFICATIONS-003 | testable | 0.92 | + + + + ~ + | — | Which specific notification from the seeded data (database-seed.json) should be used as the :notificationId parameter for this test? |
| CYPRESS-RWA-NOTIFICATIONS-004 | needs_clarification | 0.75 | + F + + ~ + | — | What constitutes an 'invalid field' in this context — is it an unknown field name not in the schema, the isRead field with wrong type, a missing required field, or something else? |
| CYPRESS-RWA-TEST-DATA-001 | needs_clarification | 0.58 | + F ~ + F + | — | Which specific entity value(s) should ${entity} be replaced with for this test—one specific value, all enum values, or a representative subset? |
| CYPRESS-RWA-TRANSACTIONS-001 | testable | 0.75 | ~ ~ + + ~ + | — | What does the `isSenderOrReceiver` predicate check — does it verify the transaction object contains either a senderId or receiverId matching the authenticated user, or does it check something else about the transaction structure? |
| CYPRESS-RWA-TRANSACTIONS-002 | testable | 0.83 | ~ ~ + + + + | — | What specific condition must `isSenderOrReceiver` evaluate to pass — does it check the user is in either the sender or receiver field, or something else? |
| CYPRESS-RWA-TRANSACTIONS-003 | needs_clarification | 0.67 | + F + + F + | — | What specific time range values (rangeStartTs and rangeEndTs) should be used in the GET /transactions request to test this behaviour? |
| CYPRESS-RWA-TRANSACTIONS-004 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-TRANSACTIONS-005 | needs_clarification | 0.67 | + F + + F + | — | How is 'page two' requested in the GET /transactions/contacts endpoint — is there a page query parameter, limit/offset parameters, or a cursor-based pagination mechanism not documented in the apiHints? |
| CYPRESS-RWA-TRANSACTIONS-006 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-TRANSACTIONS-007 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-TRANSACTIONS-008 | needs_clarification | 0.83 | + F + + + + | — | What specific values should be used for the required request body fields (transactionType, receiverId, description, amount) when creating the new request — should these reference specific seeded users/data from database-seed.json? |
| CYPRESS-RWA-TRANSACTIONS-009 | needs_clarification | 0.75 | + F + + ~ + | — | What specific update is being tested — which field(s) should be changed and to what value(s)? |
| CYPRESS-RWA-TRANSACTIONS-010 | needs_clarification | 0.67 | + F + + F + | — | Which specific field should be sent as invalid — requestStatus or another field? |
| CYPRESS-RWA-USERS-001 | testable | 1.00 | + + + + + + | — | — |
| CYPRESS-RWA-USERS-002 | testable | 0.92 | + + + + ~ + | — | Which specific userId from the seeded data (database-seed.json) should be used in the GET /users/:userId request? |
| CYPRESS-RWA-USERS-003 | needs_clarification | 0.83 | + F + + + + | — | What specific invalid userId scenario should be tested — a non-existent but well-formed ID, a malformed ID format, a non-numeric value, or something else? |
| CYPRESS-RWA-USERS-004 | needs_clarification | 0.50 | ~ ~ F + F + | — | What is the complete expected structure for the deep.equal assertion on response.body.user (the criterion ends at 'expect(response.body.user).to.deep.equal({' with no closing)? |
| CYPRESS-RWA-USERS-005 | untestable | 0.50 | F F + + F + | D1 | What is the complete expected outcome for the final acceptance criterion? The assertion 'expect(response.body.results[0]).to.contain({' is incomplete—what fields and values should results[0] contain? |
| CYPRESS-RWA-USERS-006 | untestable | 0.50 | F F + + F + | D1 | What is the complete expected outcome for the assertion 'expect(response.body.results[0]).to.contain({' — which fields and values should be checked? |
| CYPRESS-RWA-USERS-007 | untestable | 0.50 | F F + + F + | D1 | What is the complete expected outcome for the response body assertion that begins with 'expect(response.body.results[0]).to.contain({'? |
| CYPRESS-RWA-USERS-008 | needs_clarification | 0.42 | ~ F F + F + | — | What specific firstName value (and other required fields: lastName, password, balance, avatar, defaultPrivacyLevel) should be sent in the POST /users request body? |
| CYPRESS-RWA-USERS-009 | needs_clarification | 0.50 | + F F + F + | — | What balance value (in cents) should be sent in the POST /users request body to test this requirement? |
| CYPRESS-RWA-USERS-010 | needs_clarification | 0.67 | + F + + F + | — | Which specific field should be sent as invalid (e.g., firstName, email, balance) and what makes it invalid (e.g., wrong type, missing required, invalid format)? |
| CYPRESS-RWA-USERS-011 | testable | 0.92 | + + + + ~ + | — | Which specific user fields should be updated in the PATCH request body, and what values should be used for the update? |
| CYPRESS-RWA-USERS-012 | needs_clarification | 0.67 | + F + + F + | — | Which specific field should be sent as invalid in the PATCH request (e.g., firstName, email, balance)? |
| CYPRESS-RWA-USERS-013 | needs_clarification | 0.50 | + F F + F + | — | Is this requirement testing the login action itself (unauthenticated user POSTs credentials to /login), or testing that an already-authenticated user can POST to /login again? |
