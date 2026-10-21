# Stage 6 Seeded-Defect Eval Report

Catch rate (real defects only, negative controls excluded from this denominator): 90% (9/10)
Negative controls correctly NOT caught: 2/2
Baseline-eligible (clean-app PASS) test cases: CYPRESS-RWA-BANK-ACCOUNTS-001-TC-001, CYPRESS-RWA-BANK-ACCOUNTS-001-TC-002, CYPRESS-RWA-TRANSACTIONS-001-TC1, CYPRESS-RWA-TRANSACTIONS-001-TC2, CYPRESS-RWA-TRANSACTIONS-007-auth-001, CYPRESS-RWA-TRANSACTIONS-007-positive-001, CYPRESS-RWA-USERS-001-TC-001, CYPRESS-RWA-USERS-001-TC-002
Unmeasured test cases (not flipped by any real-defect catalog entry): CYPRESS-RWA-TRANSACTIONS-001-TC1

## Real defects

| Defect id | Severity | Caught | Catching test(s) | Reverted cleanly |
|---|---|---|---|---|
| payment-amount-cents | blatant | yes | CYPRESS-RWA-TRANSACTIONS-007-positive-001 | yes |
| auth-gate-post-transactions | blatant | yes | CYPRESS-RWA-TRANSACTIONS-007-auth-001 | yes |
| receiver-balance-not-credited | blatant | yes | CYPRESS-RWA-TRANSACTIONS-007-positive-001 | yes |
| payment-amount-rounding-shaved-cent | subtle | yes | CYPRESS-RWA-TRANSACTIONS-007-positive-001 | yes |
| auth-gate-get-bankaccounts | blatant | yes | CYPRESS-RWA-BANK-ACCOUNTS-001-TC-002 | yes |
| bankaccounts-missing-userid-field | moderate | yes | CYPRESS-RWA-BANK-ACCOUNTS-001-TC-001 | yes |
| auth-gate-get-users | blatant | yes | CYPRESS-RWA-USERS-001-TC-002 | yes |
| users-results-not-array | moderate | yes | CYPRESS-RWA-USERS-001-TC-001 | yes |
| auth-gate-get-transactions | blatant | yes | CYPRESS-RWA-TRANSACTIONS-001-TC2 | yes |
| transactions-pagination-off-by-one | subtle | NO | - | yes |

## Negative controls (expected to NOT be caught)

| Defect id | Severity | Caught (unexpected if yes) | Reverted cleanly |
|---|---|---|---|
| bankaccounts-routingnumber-hardcoded | moderate | no (expected) | yes |
| users-self-not-excluded | subtle | no (expected) | yes |

## payment-amount-cents

Payment amount is stored without the dollars-to-cents (x100) conversion, so transaction.amount ends up 100x too small.

## auth-gate-post-transactions

The auth gate is removed from POST /transactions, so an unauthenticated request no longer receives 401.

## receiver-balance-not-credited

On a completed payment, the receiver's balance is no longer credited (sender is still debited).

## payment-amount-rounding-shaved-cent

Payment amount conversion shaves one cent off every payment (subtle off-by-one rounding bug, distinct from the blatant x100 omission above).

## auth-gate-get-bankaccounts

The auth gate is removed from GET /bankAccounts, so an unauthenticated request no longer receives 401.

## bankaccounts-missing-userid-field

GET /bankAccounts results no longer carry the userId field on each account (a partial response-shape regression).

## bankaccounts-routingnumber-hardcoded

A newly created bank account's routingNumber is hardcoded instead of persisting the submitted value. NEGATIVE CONTROL: no generated test calls POST /bankAccounts or asserts on routingNumber, so this is expected to slip through uncaught.

## auth-gate-get-users

The auth gate is removed from GET /users, so an unauthenticated request no longer receives 401.

## users-results-not-array

GET /users returns a single user object instead of an array of results (collapses the list to its first element).

## users-self-not-excluded

GET /users no longer excludes the requesting user from their own results list. NEGATIVE CONTROL: no generated test asserts on result count or self-exclusion, so this is expected to slip through uncaught.

## auth-gate-get-transactions

The auth gate is removed from GET /transactions, so an unauthenticated request no longer receives 401.

## transactions-pagination-off-by-one

Pagination's offset calculation is off by one page (classic off-by-one), so requesting the default first page skips straight to page two's items — for small seeded result sets this can empty out the first page entirely.
