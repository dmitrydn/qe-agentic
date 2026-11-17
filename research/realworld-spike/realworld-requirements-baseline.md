# RealWorld (Conduit) — Requirements Baseline v0.1

Extracted 2026-10-23 from `realworld-apps/realworld` (MIT), main branch, shallow clone.
Extraction by Claude, by hand from the docs below. **Not yet reviewed by a human — treat as draft until a second person spot-checks it.**

## 1. Extraction rules (the method)

1. **Allowed sources (agent-visible):**
   `docs/specifications/backend/*.md`, `docs/specifications/frontend/*.md`, `docs/implementation-creation/features.md`, `specs/api/openapi.yml`.
2. **Excluded sources (held-out oracle — never shown to agents):**
   `specs/api/hurl/*`, `specs/api/bruno/*`, `specs/e2e/*.spec.ts`, Postman collection.
   `specs/e2e/SELECTORS.md` is an *interface* contract (locators), not a requirement source: automation agents may read it, extraction does not use it.
3. **One requirement = one condition → one observable outcome.** Compound sentences are split. Example: "Authentication required, returns the Article" becomes two requirements — (a) rejects requests without a token, (b) returns the Article on success.
4. **Stated only.** Every line traces to a file and line number. Nothing inferred from code, tests or "how Conduit usually works". Where the spec is silent, the silence is logged as a gap (section 4), not filled in.
5. **Normalised wording:** "The system shall …" — so the requirements-quality agent (C1) scores the requirement, not the prose style of the source.

Source keys: **EP** = backend/endpoints.md · **ER** = backend/error-handling.md · **RF** = backend/api-response-format.md · **CO** = backend/cors.md · **RT** = frontend/routing.md · **TP** = frontend/templates.md · **FE** = implementation-creation/features.md

Type: **F** functional · **A** authorisation/auth enforcement · **I** interface/data contract · **E** error handling · **U** UI behaviour · **N** non-functional

## 2. Requirements (73 stated)

### Authentication & users
| ID | Requirement | Type | Source |
|---|---|---|---|
| R-001 | Authenticated requests shall carry the header `Authorization: Token <jwt>`. | I | EP L7–9 |
| R-002 | `POST /api/users/login` shall not require authentication and shall return a User object on valid credentials. | F | EP L13–26 |
| R-003 | Login shall require the fields `email` and `password`. | F | EP L28 |
| R-004 | `POST /api/users` shall register a new user without authentication and return a User object. | F | EP L32–46 |
| R-005 | Registration shall require `email`, `username` and `password`. | F | EP L48 |
| R-006 | `GET /api/user` shall require authentication. | A | EP L54 |
| R-007 | `GET /api/user` shall return the User object of the authenticated user. | F | EP L54 |
| R-008 | `PUT /api/user` shall require authentication and return the updated User. | A/F | EP L72 |
| R-009 | `PUT /api/user` shall accept `email`, `username`, `password`, `image` and `bio`. | F | EP L74 |
| R-010 | Users shall not be deletable (out of scope). | F | FE L8 |

### Profiles & following
| ID | Requirement | Type | Source |
|---|---|---|---|
| R-011 | `GET /api/profiles/:username` shall return a Profile; authentication optional. | F | EP L78–80 |
| R-012 | `POST /api/profiles/:username/follow` shall require authentication and return the Profile. | A/F | EP L84–88 |
| R-013 | `DELETE /api/profiles/:username/follow` shall require authentication and return the Profile. | A/F | EP L92–96 |

### Articles
| ID | Requirement | Type | Source |
|---|---|---|---|
| R-014 | `GET /api/articles` shall return the most recent articles globally by default, ordered most recent first. | F | EP L102, L126 |
| R-015 | List shall filter by `tag`. | F | EP L106–108 |
| R-016 | List shall filter by `author`. | F | EP L110–112 |
| R-017 | List shall filter by `favorited` (username). | F | EP L114–116 |
| R-018 | `limit` shall default to 20. | F | EP L118 |
| R-019 | `offset` shall default to 0. | F | EP L122 |
| R-020 | List shall not require authentication. | A | EP L126 |
| R-021 | `GET /api/articles/feed` shall require authentication. | A | EP L134 |
| R-022 | Feed shall return only articles created by users the caller follows, most recent first. | F | EP L134 |
| R-023 | Feed shall accept `limit` and `offset` like the list endpoint. | F | EP L132 |
| R-024 | `GET /api/articles/:slug` shall return a single Article without authentication. | F | EP L140 |
| R-025 | `POST /api/articles` shall require authentication and return the created Article. | A/F | EP L159 |
| R-026 | Create shall require `title`, `description` and `body`. | F | EP L161 |
| R-027 | Create shall accept optional `tagList` as an array of strings. | F | EP L163 |
| R-028 | `PUT /api/articles/:slug` shall require authentication and return the updated Article. | A/F | EP L179 |
| R-029 | Update shall accept optional `title`, `description`, `body`. | F | EP L181 |
| R-030 | Changing `title` shall change the `slug`. | F | EP L183 |
| R-031 | Slugs shall be unique; duplicate titles shall produce distinct slugs. | F | EP L185 |
| R-032 | `DELETE /api/articles/:slug` shall require authentication. | A | EP L191 |

### Comments, favourites, tags
| ID | Requirement | Type | Source |
|---|---|---|---|
| R-033 | `POST /api/articles/:slug/comments` shall require authentication and return the created Comment. | A/F | EP L207 |
| R-034 | Comment `body` shall be required. | F | EP L209 |
| R-035 | `GET /api/articles/:slug/comments` shall return multiple comments; authentication optional. | F | EP L215 |
| R-036 | `DELETE /api/articles/:slug/comments/:id` shall require authentication. | A | EP L221 |
| R-037 | Comments shall not be updatable (out of scope). | F | FE L10 |
| R-038 | `POST /api/articles/:slug/favorite` shall require authentication and return the Article. | A/F | EP L227 |
| R-039 | `DELETE /api/articles/:slug/favorite` shall require authentication and return the Article. | A/F | EP L235 |
| R-040 | `GET /api/tags` shall return the list of tags without authentication. | F | EP L243 |

### Errors, CORS, response format
| ID | Requirement | Type | Source |
|---|---|---|---|
| R-041 | A request failing validation shall return 422 with `{"errors": {<field>: [<message>, …]}}`. | E | ER L7–17 |
| R-042 | A request needing authentication without it shall return 401. | E | ER L21 |
| R-043 | A valid request the user lacks permission for shall return 403. | E | ER L23 |
| R-044 | A request for a non-existent resource shall return 404. | E | ER L25 |
| R-045 | When frontend and backend are on different origins, the backend shall answer `OPTIONS` and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers`. | N | CO L7 |
| R-046 | Responses shall carry `Content-Type: application/json; charset=utf-8`. | I | RF L7 |
| R-047 | User object shall contain `email`, `token`, `username`, `bio`, `image`. | I | RF L11–20 |
| R-048 | Profile object shall contain `username`, `bio`, `image`, `following`. | I | RF L25–33 |
| R-049 | Single Article shall contain `slug`, `title`, `description`, `body`, `tagList`, `createdAt`, `updatedAt`, `favorited`, `favoritesCount`, `author` (Profile). | I | RF L38–57 |
| R-050 | List and feed responses shall omit the article `body`. | I | RF L62–67 |
| R-051 | Multiple-articles response shall include `articlesCount`. | I | RF L102 |
| R-052 | Comment shall contain `id`, `createdAt`, `updatedAt`, `body`, `author` (Profile). | I | RF L108–122 |
| R-053 | Tags response shall be `{"tags": [string, …]}`. | I | RF L146–152 |

### Frontend — routes and pages
| ID | Requirement | Type | Source |
|---|---|---|---|
| R-054 | Home (`/`) shall show a list of tags. | U | RT L4–5 |
| R-055 | Home shall list articles from Feed, Global or a Tag. | U | RT L6 |
| R-056 | Home article list shall be paginated. | U | RT L7 |
| R-057 | Sign-in and sign-up shall be at `/login` and `/register`. | U | RT L8 |
| R-058 | The JWT shall be stored in localStorage. | U | RT L9 |
| R-059 | Settings shall be at `/settings`. | U | RT L11 |
| R-060 | The settings page shall have a logout button. | U | FE L7 |
| R-061 | The editor shall be at `/editor` (create) and `/editor/:slug` (edit). | U | RT L12 |
| R-062 | The article page shall be at `/article/:slug`. | U | RT L13 |
| R-063 | The delete-article button shall be shown only to the article's author. | U | RT L14 |
| R-064 | Article markdown from the server shall be rendered client-side. | U | RT L15 |
| R-065 | The comments section shall be at the bottom of the article page. | U | RT L16 |
| R-066 | The delete-comment button shall be shown only to the comment's author. | U | RT L17 |
| R-067 | Profile shall be at `/profile/:username` and `/profile/:username/favorites`. | U | RT L18 |
| R-068 | Profile shall show basic user info. | U | RT L19 |
| R-069 | Profile shall list the author's created or favourited articles. | U | RT L20 |
| R-070 | Logged out, the header shall link to home, login and register. | U | TP L36–40 |
| R-071 | Logged in, the header shall link to home, new article, settings and profile. | U | TP L66–71 |
| R-072 | The active header link shall carry the `active` CSS class. | U | TP L42, L73 |
| R-073 | Home shall show a default **Global Feed** tab, a **tag** tab after a popular tag is clicked, and a **Your Feed** tab when logged in. | U | TP L118–122 |

Counts: F 26 · A 5 · A/F 8 · I 9 · E 4 · U 20 · N 1 → **73 stated**, above the ≥40 threshold.

## 3. Sanity notes
- Count is sensitive to splitting. R-073 could fairly be three requirements; R-008/012/013 etc. could split auth from response. A strict one-outcome split gives roughly 90.
- Line numbers refer to the Markdown files as of the clone date; pin the commit SHA in the sandbox so they stay valid.

## 4. Gaps found during extraction (natural C1 ground truth — not planted)

| ID | Gap | Why it matters | Affected |
|---|---|---|---|
| G-01 | **No API-level authorisation rule** for updating/deleting articles and comments. 403 is defined generically (ER L23); ownership appears only as "button shown to author" in the UI (RT L14, L17). | Biggest gap. Nothing in the spec says another user's `DELETE` must fail. Classic UI-only security. | R-028, R-032, R-036, R-043 |
| G-02 | **No validation rules**: email format, password policy, username/email uniqueness, length limits. OpenAPI carries no `maxLength`/`pattern`; only `minimum` on `limit`/`offset`. | Testers cannot derive boundary or negative cases from the spec. | R-003, R-005, R-009, R-026, R-041 |
| G-03 | **Login failure behaviour unspecified** (wrong password: 401? 422? which message?). | Ambiguous expected result on the most-tested flow. | R-002 |
| G-04 | **Success status codes unspecified** (create → 200 or 201? delete → 200 or 204? body?). | Every API test needs an expected status. | R-004, R-025, R-032, R-033, R-036 |
| G-05 | **Contradiction:** Get Article says "No authentication required" (EP L140) but the response includes viewer-dependent `favorited` and `author.following` (RF L48, L54). | Is auth optional (changes fields) or ignored? | R-024, R-049 |
| G-06 | **"Popular tags" undefined** — UI says popular (TP L121, L203), API says "list of tags". No ordering or limit. | Untestable as written. | R-040, R-054, R-073 |
| G-07 | **Unresolved TODO in the spec** itself (TP L482: follow/favourite vs edit/delete switch on the article page). | The spec admits an incomplete requirement. | R-063 |
| G-08 | **Logged-out access to protected routes unspecified** (`/editor`, `/settings`, Your Feed): redirect, hide, or error? | No expected result for negative UI cases. | R-059, R-061, R-073 |
| G-09 | **Filter combination and `limit` maximum unspecified** (`?tag=x&author=y`; `limit=10000`). | Boundary and combinatorial cases have no oracle. | R-015–R-019 |
| G-10 | **Comment ordering unspecified.** Articles are "most recent first"; comments are not ordered. | Ambiguous list assertions. | R-035 |
| G-11 | **Hosted demo API deviates from spec by design**: logged-out users see only demo-account content (frontend/api.md L205–208). | Never use api.realworld.show as the oracle; run the backend locally. | all list requirements |

How to use section 4: freeze it **before** running the C1 agent, then score the agent's findings against it (recall and precision). Have one human review the 11 gaps first — if a reviewer disagrees with one, drop it from the eval set rather than argue.
