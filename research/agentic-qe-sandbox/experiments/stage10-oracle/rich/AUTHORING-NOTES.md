# Authoring notes — Stage 10 RICH oracle set (Cypress RealWorld App)

## Sources consulted (intended-behavior / structural)

- `agentic-qe-sandbox/requirements/unified-requirements.md` — primary source for the
  behavioral description, Gherkin scenario, and cited `expect(...)` assertion of each of
  the 24 requirement ids (read via targeted grep + full-range read of lines ~2030-2718,
  the `## Source: cypress-rwa` section).
- `sandbox-eval/cypress-realworld-app/backend/app.ts` — confirmed route mount points
  (routers are mounted at the app root: `/users`, `/contacts`, `/bankAccounts`,
  `/transactions`, `/likes`, `/comments`, `/notifications`, `/testData` — **no `/api`
  prefix**, unlike the conduit-blog Hurl examples).
- `sandbox-eval/cypress-realworld-app/backend/*-routes.ts` (transaction, user,
  bankaccount, contact, comment, like, notification, testdata) — exact HTTP
  method/path per route, presence/absence of `ensureAuthenticated`, and success
  status codes (e.g. bank account POST/DELETE return `200`, not `201`/`204`; user
  creation returns `201`; PATCH endpoints return `204`; comments/likes POST return
  bare `200` with no body).
- `sandbox-eval/cypress-realworld-app/backend/validators.ts` — exact request-body /
  query-param / path-param field names checked by `express-validator`, used to write
  deterministic negative cases (e.g. `isTransactionPatchValidator` only checks
  `requestStatus`, so PATCH `/transactions/:id` negative cases assert
  `errors[0].param == "requestStatus"`; `isCommentValidator` checks only `content`;
  `isBankAccountValidator` checks `bankName`/`accountNumber`/`routingNumber`;
  `isNotificationPatchValidator` checks only `isRead`; `shortIdValidation` is applied
  to `userId`, `bankAccountId`, `transactionId`, `notificationId`, `contactUserId`).
- `sandbox-eval/cypress-realworld-app/backend/helpers.ts` — the actual unauthenticated
  error body shape used app-wide: `{"error": "Unauthorized"}` with status `401`
  (used instead of the conduit-blog example's `{"errors":{"token":["is missing"]}}`,
  which is a different app's error shape and only usable as grammar/style reference).
- `sandbox-eval/cypress-realworld-app/backend/package.json` — confirmed
  `express-validator@6.15.0`, whose `errors.array()` items use the key `param` (not
  `path`), which is why negative-case assertions use `jsonpath "$.errors[0].param"`.
- `sandbox-eval/cypress-realworld-app/src/models/*.ts` — response/entity field names
  (`Transaction`, `User`, `BankAccount`, `Comment`, `Like`, `NotificationBase`,
  `Contact`) used to write shape assertions.
- `sandbox-eval/cypress-realworld-app/src/utils/transactionUtils.ts` — confirmed the
  `pageData` shape (`page`, `limit`, `hasNextPages`, `totalPages`) returned alongside
  `results` for the three paginated transaction list endpoints.
- `sandbox-eval/cypress-realworld-app/cypress/tests/api/api-*.spec.ts` (users,
  bankaccounts, contacts, comments, likes, notifications, transactions, testdata) —
  used only to confirm exact request field names/query params actually exercised
  against these routes (e.g. `contactUserId: "1234"` and `/users/1234` as the
  canonical malformed-id literals; the `requestStatus`/query-param names used against
  `GET /transactions`). These are the app's own structural test fixtures, not the
  forbidden defect/eval material.
- `sandbox-eval/realworld-spec/specs/api/hurl/articles.hurl` and
  `errors_articles.hurl` — read once, purely for Hurl block/grammar style (structure
  of `[Captures]`/`[Asserts]`, use of `{{var}}` interpolation inside assertion values,
  the "verify persistence with a follow-up GET" pattern). No endpoint, field name, or
  value from this blog app was copied into the Cypress RWA files.

## Assumptions made (documented rather than guessed silently)

1. **Intent status codes over implementation status codes for ownership violations.**
   The clean app's `GET /users/:userId` handler currently returns `401` (not `403`)
   when the path id does not match the authenticated user, and several other routes
   (bank account GET/DELETE, notification PATCH) perform no explicit ownership check
   in the router at all. Per the task's "intent over implementation" instruction and
   its own example list ("forbidden acting on another user's resource → 403"), every
   *"acting on another user's resource"* negative case in this rich set asserts `403`
   as the intended/correct behavior, not the `401`/absent-check behavior the router
   code currently exhibits. This affects: `USERS-002`, `USERS-011`,
   `BANK-ACCOUNTS-002`, `BANK-ACCOUNTS-004`.
2. **Not-found (`404`) for well-formed-but-nonexistent ids.** `shortIdValidation`
   only checks *format*, not existence. I did not trace whether the handlers
   currently 404 on a nonexistent-but-valid id (doing so would mean reading handler
   logic in `database.ts`, which is out of scope per the blindness/intent rule). Per
   the task's own negative-case template, I assert `404` as the intended behavior
   for: `USERS-003`, `BANK-ACCOUNTS-002`, `BANK-ACCOUNTS-004`, `COMMENTS-002`,
   `LIKES-002`.
3. **Time-range query param names for `TRANSACTIONS-003`.** `validators.ts`
   (`isTransactionQSValidator`) declares `rangeStartTs`/`rangeEndTs` as the backend's
   accepted query params, while the Cypress spec exercises `dateRangeStart`/
   `dateRangeEnd` in its request `qs`. I used the backend validator's own declared
   names (`rangeStartTs`/`rangeEndTs`) as the authoritative API contract. This is
   flagged as an assumption since I did not trace `database.ts` to see which name the
   filter logic actually reads.
4. **`LIKES-002` has no body-field validator.** Unlike comments/bank
   accounts/transactions, `like-routes.ts` validates only the `transactionId` path
   param (no request body fields at all). The required "invalid/missing field → 4xx"
   negative case therefore targets a malformed `transactionId` path segment instead
   of a body field, since no body field exists to invalidate. Documented inline in
   the file's comment.
5. **`TEST-DATA-001` requires no authentication.** `testdata-routes.ts` mounts with
   no `ensureAuthenticated` middleware (it is gated only by `NODE_ENV`). The
   `Authorization: Token {{token}}` header is still included per the experiment's
   universal convention, but no unauthenticated-401 negative case was authored for
   this requirement, since requiring one would misrepresent the endpoint's intended
   (public, test-fixture) access model.
6. **`USERS-010` is the `POST /users` (create/registration) invalid-field case, not
   `PATCH`.** The task prompt's one-line description says "(create/update)", but
   `unified-requirements.md`'s own source line for `CYPRESS-RWA-USERS-010` cites
   `POST /users`. `PATCH /users/:userId`'s equivalent invalid-field case is a
   separate id (`USERS-012`) outside this 24-item slice; I authored `USERS-010`
   against `POST /users` per the primary source doc, and additionally folded one
   invalid-field negative case into `USERS-011` itself (the update endpoint in this
   slice) so that "for create/update endpoints: at least one invalid/missing field →
   4xx" is still satisfied for the PATCH path as well.
7. **`TRANSACTIONS-010` is `PATCH /transactions/:transactionId`, not create.** The
   task's one-line label says "(create)", but both `unified-requirements.md`'s
   Gherkin and its cited spec line (`api-transactions.spec.ts:155`) are for
   `PATCH /transactions/:transactionId`. Authored against PATCH accordingly, and
   separately added invalid-field negative cases directly inside the `POST
   /transactions` files (`TRANSACTIONS-007`/`008`) so the create endpoints are still
   covered.
8. **Security/no-leak assertions not directly handler-verified.** `USERS-001`
   asserts the personal list excludes the requester (`removeUserFromResults` is
   visible in `user-routes.ts`, confirming this is real, structural intent) and that
   no `password` field is exposed in list/detail responses (`USERS-001`,
   `USERS-002`). The password-exclusion assertion is asserted from first-principles
   security intent for a payments app; I did not trace `database.ts`/`getAllUsers`
   to confirm whether the clean baseline actually strips it before serializing.
9. **Universal ("for all items") list predicates.** The Hurl-like grammar given has
   no forall/every-element predicate. Where the intent requires every row in a list
   to satisfy a property (scoping to the requester, status filters, email-search
   filters), I encoded it as a "no counter-example" filter, e.g.
   `jsonpath "$.results[?(@.requestStatus!='pending')]" count == 0`, which is
   logically equivalent to "every item has requestStatus == 'pending'".
10. **Balance reconciliation for `TRANSACTIONS-007`/`008`.** The grammar supports
    `==`/`!=` comparison of an assertion value against a previously `[Captures]`-ed
    variable (confirmed from the `articles.hurl` style example:
    `jsonpath "$.article.updatedAt" != "{{updated_at}}"`), but not inline arithmetic
    (`balance_before - amount`). So the payment case asserts the sender's balance
    actually *changed* (`!=`) after a payment, and the request case asserts it
    *stayed exactly the same* (`==`) after creating an unaccepted request — both are
    exact-value assertions against a captured baseline, but "debited by exactly
    `amount`" could not be expressed as a single static assertion without
    server-side arithmetic support in the runner.
11. **`TRANSACTIONS-006` (public feed) does not assert `privacyLevel == "public"`
    on every row.** `transaction-routes.ts` shows the first page of the public feed
    is deliberately composed of the requester's first five contacts' transactions
    concatenated with public ones — a legitimate Venmo-style "public feed also shows
    your network's activity" design, not a defect. Rather than encode that specific
    implementation branch (which would cross from structure into handler-logic
    tracing), the oracle only asserts the generic shape/field contract and leaves the
    strict privacy-level filter unasserted, noting the design intent in-file.

## Assumed template variables (beyond `{{host}}`/`{{token}}`)

Declared but not independently defined by a source file — expected to be supplied by
whatever runtime/fixture adapter resolves `{{token}}`, since the app's own auth is
session-cookie-based and has no bearer-token endpoint to capture one from:

- `{{user_id}}` — id of the authenticated user who owns `{{token}}`.
- `{{other_user_id}}` — id of a second, distinct seeded user (used as a payment
  receiver / contact / forbidden-access target).
- `{{other_user_email}}` — email address of that second seeded user (for the
  email-search requirement).
- `{{other_user_bank_account_id}}` — id of a bank account owned by the second seeded
  user (used only in the two forbidden-access negative cases).
- `{{unknown_id}}` — a syntactically valid shortid that does not correspond to any
  existing record (used for the not-found negative cases).

All other ids used in the files (bank account id, transaction id, notification id,
comment/like counts) are captured in-file from a preceding request rather than
assumed, to keep each file as self-contained as possible.

## Route paths confirmed (method + path, no `/api` prefix)

`GET/POST /transactions`, `GET /transactions/contacts`, `GET /transactions/public`,
`PATCH /transactions/:transactionId`, `GET/POST /bankAccounts`,
`GET/DELETE /bankAccounts/:bankAccountId`, `GET /users`, `GET /users/:userId`,
`POST /users`, `PATCH /users/:userId`, `GET /users/search`, `POST /contacts`,
`GET/PATCH /notifications`, `GET/POST /comments/:transactionId`,
`GET/POST /likes/:transactionId`, `POST /testData/seed`, `GET /testData/:entity`.

## Output summary

- 24 `.hurl` files written, one per requirement id, to
  `agentic-qe-sandbox/experiments/stage10-oracle/rich/`.
- 98 total request blocks across the 24 files.
- 57 negative/error blocks total: 22 unauthenticated-401, 26 invalid-field/format
  422, 5 not-found 404, 4 forbidden 403.
- Every authenticated endpoint in scope has an explicit unauthenticated → 401 case,
  except `TEST-DATA-001` (documented above as intentionally public).
- Every create/update endpoint in scope has at least one invalid/missing-field → 4xx
  case, including `LIKES-002` (adapted to its only validated input, the path param).

## Blindness attestation

I did not read, open, grep, or cat any of: `**/fault-injector.js`,
`agentic-qe-sandbox/eval/**`, `agentic-qe-sandbox/verify.sh`,
`agentic-qe-sandbox/PROGRESS.md`, `agentic-qe-sandbox/docs/design/**`,
`agentic-qe-sandbox/VERIFICATION.md`, `agentic-qe-sandbox/MAKE-THE-CASE.md`, or any
file whose name contains `defect`, `fault`, `seed` (as a defect-catalog term — the
app's own `db:seed` / `seedDatabase` test-fixture naming in the clean baseline is
unrelated and was only read as ordinary structural source), or `grounding`. I did not
search for or speculate about known bugs, seeded defects, or "what could be wrong" in
the implementation. All value-level oracles above were derived from
`unified-requirements.md`, the clean app's route/validator/model source (for
structure only), and first-principles/standard-convention reasoning about correct
payments-app behavior, per the task's intent-vs-code rule. Where I could not verify a
handler's actual runtime behavior without tracing business logic (see assumptions
1–2, 5, 8, 11 above), I explicitly flagged the assertion as intent-derived rather than
code-verified, per the task's instruction to document assumptions instead of guessing
silently.

I did not read any forbidden (defect/fault/eval/spec) file.
