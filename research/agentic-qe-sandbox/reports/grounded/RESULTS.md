# AQE_GROUNDING results

Note: only run1 of the planned 3-run grounded sweep was executed — run2 and
run3 were cancelled by user request while run1 was in progress. The table
below is a single baseline-run1 vs grounded-run1 comparison, not an averaged
3-run result.

## (1) Requirements Fix 1 gated as ungrounded

| id | asserted endpoint | nearest real route |
|---|---|---|
| CYPRESS-RWA-BANK-TRANSFER-001 | GET /bankTransfer | GET /bankTransfers |
| CYPRESS-RWA-NOTIFICATIONS-002 | POST /notifications | GET /notifications |
| CYPRESS-RWA-BANK-ACCOUNTS-004 | DELETE /contacts/:bankAccountId | DELETE /contacts/:contactId |

(41 of 44 requirements remain grounded.)

## (2) Fix 2 confirmation

Unit tests (`adapters/cypress-rwa/extract-api-hints.test.js`) confirm that
with `AQE_GROUNDING=1`, `POST /users` and `PATCH /users/:userId` no longer
report `userFieldsValidator`'s fields (`firstName`, `lastName`, `password`,
`balance`, `avatar`, `defaultPrivacyLevel`, all previously "any(must exist)")
because that validator is applied as bare middleware, never wrapped in
`validateMiddleware(...)`. `isUserValidator`'s fields (same names, wrapped in
`validateMiddleware(...)`, hence enforced) still contribute, with `optional:
true`.

Live-run confirmation: baseline run1 flagged
`CYPRESS-RWA-USERS-008-negative-006` as a real_defect — a negative test
asserting `POST /users` must reject a missing `defaultPrivacyLevel` with
400/422, citing the field as "any(must exist)" — when the app in fact returns
201 (correct behavior, since `userFieldsValidator`'s rule is never enforced).
The grounded run1 defect list has no equivalent `CYPRESS-RWA-USERS-008`
entry.

## (3) Baseline vs grounded — run1

| metric | baseline run1 | grounded run1 |
|---|---|---|
| requirements covered/total | 37/44 | 36/41 |
| tests generated | 136 | 123 |
| defects (FP) | 21 | 15 |
| quarantined | 43 | 39 |
| false positive rate | 0.1544 (15.44%) | 0.1220 (12.20%) |
| generate-phase tokens (prompt+completion) | 214168 + 145429 = 359597 | 198473 + 144156 = 342629 |

## (4) Errored sweeps

None. `reports/grounded/run1.log` contains no `[error]` lines; scorecard
`errored: 0`. run2 and run3 were not started (cancelled before launch).
