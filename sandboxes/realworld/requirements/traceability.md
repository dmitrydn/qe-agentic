# Baseline R-ID → story mapping

| Baseline req ID | Requirement (baseline v0.1) | Type | Covered by stories | # stories |
| --- | --- | --- | --- | --- |
| R-001 | Authenticated requests shall carry the header Authorization: Token <jwt>. | I | US-03 | 1 |
| R-002 | POST /api/users/login shall not require authentication and shall return a User object on valid credentials. | F | US-02 | 1 |
| R-003 | Login shall require the fields email and password. | F | US-02 | 1 |
| R-004 | POST /api/users shall register a new user without authentication and return a User object. | F | US-01 | 1 |
| R-005 | Registration shall require email, username and password. | F | US-01 | 1 |
| R-006 | GET /api/user shall require authentication. | A | US-03 | 1 |
| R-007 | GET /api/user shall return the User object of the authenticated user. | F | US-03 | 1 |
| R-008 | PUT /api/user shall require authentication and return the updated User. | A/F | US-05 | 1 |
| R-009 | PUT /api/user shall accept email, username, password, image and bio. | F | US-05 | 1 |
| R-010 | Users shall not be deletable (out of scope). | F | US-05 | 1 |
| R-011 | GET /api/profiles/:username shall return a Profile; authentication optional. | F | US-06 | 1 |
| R-012 | POST /api/profiles/:username/follow shall require authentication and return the Profile. | A/F | US-19 | 1 |
| R-013 | DELETE /api/profiles/:username/follow shall require authentication and return the Profile. | A/F | US-19 | 1 |
| R-014 | GET /api/articles shall return the most recent articles globally by default, ordered most recent first. | F | US-12 | 1 |
| R-015 | List shall filter by tag. | F | US-14 | 1 |
| R-016 | List shall filter by author. | F | US-07 | 1 |
| R-017 | List shall filter by favorited (username). | F | US-07 | 1 |
| R-018 | limit shall default to 20. | F | US-15 | 1 |
| R-019 | offset shall default to 0. | F | US-15 | 1 |
| R-020 | List shall not require authentication. | A | US-12 | 1 |
| R-021 | GET /api/articles/feed shall require authentication. | A | US-13 | 1 |
| R-022 | Feed shall return only articles created by users the caller follows, most recent first. | F | US-13 | 1 |
| R-023 | Feed shall accept limit and offset like the list endpoint. | F | US-13 | 1 |
| R-024 | GET /api/articles/:slug shall return a single Article without authentication. | F | US-11 | 1 |
| R-025 | POST /api/articles shall require authentication and return the created Article. | A/F | US-08 | 1 |
| R-026 | Create shall require title, description and body. | F | US-08 | 1 |
| R-027 | Create shall accept optional tagList as an array of strings. | F | US-08 | 1 |
| R-028 | PUT /api/articles/:slug shall require authentication and return the updated Article. | A/F | US-09 | 1 |
| R-029 | Update shall accept optional title, description, body. | F | US-09 | 1 |
| R-030 | Changing title shall change the slug. | F | US-09 | 1 |
| R-031 | Slugs shall be unique; duplicate titles shall produce distinct slugs. | F | US-08 | 1 |
| R-032 | DELETE /api/articles/:slug shall require authentication. | A | US-10 | 1 |
| R-033 | POST /api/articles/:slug/comments shall require authentication and return the created Comment. | A/F | US-16 | 1 |
| R-034 | Comment body shall be required. | F | US-16 | 1 |
| R-035 | GET /api/articles/:slug/comments shall return multiple comments; authentication optional. | F | US-17 | 1 |
| R-036 | DELETE /api/articles/:slug/comments/:id shall require authentication. | A | US-18 | 1 |
| R-037 | Comments shall not be updatable (out of scope). | F | US-17 | 1 |
| R-038 | POST /api/articles/:slug/favorite shall require authentication and return the Article. | A/F | US-20 | 1 |
| R-039 | DELETE /api/articles/:slug/favorite shall require authentication and return the Article. | A/F | US-20 | 1 |
| R-040 | GET /api/tags shall return the list of tags without authentication. | F | US-14 | 1 |
| R-041 | A request failing validation shall return 422 with {"errors": {<field>: [<message>, …]}}. | E | US-22 | 1 |
| R-042 | A request needing authentication without it shall return 401. | E | US-22 | 1 |
| R-043 | A valid request the user lacks permission for shall return 403. | E | US-22 | 1 |
| R-044 | A request for a non-existent resource shall return 404. | E | US-22 | 1 |
| R-045 | When frontend and backend are on different origins, the backend shall answer OPTIONS and return correct Access-Control-Allow-Origin and Access-Control-Allow-Headers. | N | US-23 | 1 |
| R-046 | Responses shall carry Content-Type: application/json; charset=utf-8. | I | US-22 | 1 |
| R-047 | User object shall contain email, token, username, bio, image. | I | US-01 | 1 |
| R-048 | Profile object shall contain username, bio, image, following. | I | US-06 | 1 |
| R-049 | Single Article shall contain slug, title, description, body, tagList, createdAt, updatedAt, favorited, favoritesCount, author (Profile). | I | US-08, US-11 | 2 |
| R-050 | List and feed responses shall omit the article body. | I | US-12 | 1 |
| R-051 | Multiple-articles response shall include articlesCount. | I | US-12, US-15 | 2 |
| R-052 | Comment shall contain id, createdAt, updatedAt, body, author (Profile). | I | US-16 | 1 |
| R-053 | Tags response shall be {"tags": [string, …]}. | I | US-14 | 1 |
| R-054 | Home (/) shall show a list of tags. | U | US-14 | 1 |
| R-055 | Home shall list articles from Feed, Global or a Tag. | U | US-12, US-13, US-14 | 3 |
| R-056 | Home article list shall be paginated. | U | US-15 | 1 |
| R-057 | Sign-in and sign-up shall be at /login and /register. | U | US-01, US-02 | 2 |
| R-058 | The JWT shall be stored in localStorage. | U | US-02, US-03 | 2 |
| R-059 | Settings shall be at /settings. | U | US-05 | 1 |
| R-060 | The settings page shall have a logout button. | U | US-04 | 1 |
| R-061 | The editor shall be at /editor (create) and /editor/:slug (edit). | U | US-08, US-09 | 2 |
| R-062 | The article page shall be at /article/:slug. | U | US-11 | 1 |
| R-063 | The delete-article button shall be shown only to the article's author. | U | US-10 | 1 |
| R-064 | Article markdown from the server shall be rendered client-side. | U | US-11 | 1 |
| R-065 | The comments section shall be at the bottom of the article page. | U | US-11, US-16 | 2 |
| R-066 | The delete-comment button shall be shown only to the comment's author. | U | US-18 | 1 |
| R-067 | Profile shall be at /profile/:username and /profile/:username/favorites. | U | US-06, US-07 | 2 |
| R-068 | Profile shall show basic user info. | U | US-06 | 1 |
| R-069 | Profile shall list the author's created or favourited articles. | U | US-07 | 1 |
| R-070 | Logged out, the header shall link to home, login and register. | U | US-21 | 1 |
| R-071 | Logged in, the header shall link to home, new article, settings and profile. | U | US-21 | 1 |
| R-072 | The active header link shall carry the active CSS class. | U | US-21 | 1 |
| R-073 | Home shall show a default **Global Feed** tab, a **tag** tab after a popular tag is clicked, and a **Your Feed** tab when logged in. | U | US-12, US-13, US-14 | 3 |

## Run 2a gap reconciliation

Pin: ebbcdeb8d55b42a3a613c787560498b8ef10003f. Older analyses are leads only. Every row below was rechecked against the cited current requirement sources; no oracle/implementation was used.

| Gap | Disposition | Links | Evidence at pin | Finding |
| --- | --- | --- | --- | --- |
| X-01 | Existing + new questions; rules converted | OQ-18.1; OQ-09.4; OQ-10.4; OQ-18.2 | error-handling.md L23; openapi.yml L275-276; openapi.yml L302-303; openapi.yml L385-386; routing.md L15-18 | 403 is explicit; API author-only predicate is not. Retired BR-09.4/10.3/18.3; UI ownership stays. |
| X-02 | Already an open question; rule converted | OQ-02.1 | error-handling.md L7; openapi.yml L32-37 | 401 and 422 are declared; bad-credential classification is not selected. BR-02.4 retired. |
| X-03 | Resolved by specification | BR-01.3; BR-08.5; BR-10.1; BR-16.2; BR-18.1 | openapi.yml L32-37; openapi.yml L48-53; openapi.yml L223-230; openapi.yml L298-307; openapi.yml L349-356; openapi.yml L381-390 | Prose omission is not contradiction; OpenAPI supplies success codes. |
| X-04 | Already open; partial resolution | OQ-01.2; OQ-05.1; OQ-08.1; BR-01.4 | openapi.yml L48-53; openapi.yml L223-230; openapi.yml L781-790 | 409 and username-taken example explicit; email uniqueness and article conflict conditions remain unanswered. |
| X-05 | Already an open question | OQ-22.1 | error-handling.md L9-15; openapi.yml L811-820 | empty versus blank wording differs; do not select. |
| X-06 | Existing + new question | OQ-01.1; OQ-01.2; OQ-01.3; OQ-08.2; OQ-08.3; OQ-16.2; OQ-01.5 | openapi.yml L456-480; openapi.yml L579-608; endpoints.md L161-163 | Length, format and normalisation rules absent; required fields and paging minimums are not absent. |
| X-07 | Resolved by specification; related question retained | BR-08.6; AC-08.3; OQ-08.1; OQ-09.3 | endpoints.md L183-185 | Unique slugs and distinct duplicate-title slugs explicit. Derivation/format is implementation discretion, not a missing business rule; recount rejection of R-031 is stale. |
| X-08 | Already open | OQ-08.2; OQ-14.1; OQ-14.2 | endpoints.md L163; endpoints.md L243; templates.md L203 | Tag uniqueness/case/count and popularity/order remain unstated. |
| X-09 | Existing + new question | OQ-07.2; OQ-07.3; OQ-14.2; OQ-07.4 | endpoints.md L102-126 | Filter combination, case and unknown-value semantics not derived from examples. |
| X-10 | Existing + new questions | OQ-15.2; OQ-17.1; OQ-17.2; OQ-15.4 | endpoints.md L118-134; endpoints.md L215; openapi.yml L895-911 | Defaults/minima are explicit; maximum, beyond-total, timestamp/tie-break and comment ordering are not. |
| X-11 | Existing + new question | OQ-02.3; OQ-03.1; OQ-03.2; OQ-03.4 | openapi.yml L93-117; openapi.yml L183-213; openapi.yml L315-337; routing.md L10 | Optional auth plus declared 401 is not proof every anonymous call fails; invalid-token handling/claims remain unresolved. |
| X-12 | Existing + new questions | OQ-19.2; OQ-20.1; OQ-20.4; OQ-19.5 | endpoints.md L82-96; endpoints.md L223-237 | Self/repeat and reverse-operation cases remain unspecified. |
| X-13 | Existing + new question; partial resolution | OQ-05.1; OQ-05.4; OQ-05.6 | openapi.yml L76-94; openapi.yml L846-857 | At-least-one field requirement explicit; exact error and update uniqueness remain open. |
| X-14 | Already open; user deletion outside scope | OQ-10.2; BR-05.4 | endpoints.md L187-191; features.md L8-10 | Article cascade not specified. User deletion not required; do not invent cascade. |
| X-15 | Resolved by specification | BR-10.1; BR-18.1 | openapi.yml L298-299; openapi.yml L381-382; openapi.yml L768-770 | 204 refers to No content with empty content map; response body is not an unresolved choice. |
| X-16 | Already open; conversion location resolved | OQ-11.2; BR-11.3 | routing.md L16; api-response-format.md L44 | Client-side rendering explicit; sanitisation/allowed HTML not stated. |
| X-17 | Existing + new question | OQ-01.4; OQ-04.1; OQ-08.4; OQ-10.3; OQ-16.1; OQ-21.1; OQ-21.2; OQ-21.3 | routing.md L5-21; templates.md L231-247; templates.md L470; templates.md L509 | Route names and controls do not define redirects, loading, not-found UI or general error/date presentation. |
| X-18 | Resolved by specification | BR-11.3 | routing.md L16 | Render markdown from server client side explicitly locates conversion in browser; raw body example is compatible. |
| X-19 | Already open | OQ-09.2; OQ-19.3; OQ-20.2 | templates.md L482; templates.md L495-509 | TODO remains; do not invent switch conditions for controls. |
| X-20 | Resolved at current pin | FE-045 coverage disposition | templates.md L7-26; styles.md L5-14 | Head now serves shared styles.css; fonts/icons separately loaded as styles guidance requires. Old CDN-theme conflict is stale. |
| X-21 | Existing + new question; accepted fields resolved | BR-05.3; OQ-05.2; OQ-05.4; OQ-05.6 | endpoints.md L64-74; openapi.yml L504-520 | Example subset does not override explicit username/password accepted fields; reauthentication/session effects still unspecified. |
| X-22 | New question | OQ-22.2 | openapi.yml L567-572; api-response-format.md L46-47 | Date-time type explicit, mandatory precision/timezone spelling not stated. |
| G-01 | Rechecked; see linked disposition | X-01 | error-handling.md L23; openapi.yml L275-276; routing.md L15-18 | Overstated: 403 exists, its ownership predicate remains a gap; see converted rules/questions in X-01. |
| G-02 | Rechecked; see linked disposition | X-04; X-06 | openapi.yml L781-790; openapi.yml L895-911 | Partly wrong: username-taken conflict and paging minima explicit; other validation still open. |
| G-03 | Rechecked; see linked disposition | X-02 | openapi.yml L32-37; error-handling.md L7 | Not silence about response codes: unresolved classification of credentials versus validation. |
| G-04 | Rechecked; see linked disposition | X-03 | openapi.yml L48-53; openapi.yml L298-299; openapi.yml L349-356 | Resolved: allowed OpenAPI gives success codes. |
| G-05 | Rechecked; see linked disposition | OQ-11.1; X-11 | endpoints.md L140; api-response-format.md L48-54 | No-auth-required does not mean auth ignored. Viewer-dependent fields' semantics remain a question, not proof of contradiction. |
| G-06 | Rechecked; see linked disposition | OQ-14.1; X-08 | templates.md L203; endpoints.md L243 | Popularity/order/limit remain undefined. |
| G-07 | Rechecked; see linked disposition | OQ-09.2; X-19 | templates.md L482 | TODO persists. |
| G-08 | Rechecked; see linked disposition | OQ-21.1; X-17 | routing.md L12-13; templates.md L122 | Protected UI route behaviour not specified. |
| G-09 | Rechecked; see linked disposition | OQ-07.2; OQ-15.2; X-09; X-10 | endpoints.md L102-124; openapi.yml L895-911 | Combination and maximum remain unspecified; minima/defaults explicit. |
| G-10 | Rechecked; see linked disposition | OQ-17.1; X-10 | endpoints.md L211-215 | Comment ordering remains unspecified. |
| G-11 | Rechecked; see linked disposition | FE-049 coverage disposition | frontend-api.md L25-34 | Deployment limitation, not product requirement; current citation is 31-34, not 205-208. No hosted instance used. |
| Correction G-01 | Correction verified at current pin | X-01 | error-handling.md L23; openapi.yml L275-276; routing.md L15-18 | Overstated: 403 exists, its ownership predicate remains a gap; see converted rules/questions in X-01. |
| Correction G-03 | Correction verified at current pin | X-02 | openapi.yml L32-37; error-handling.md L7 | Not silence about response codes: unresolved classification of credentials versus validation. |
| Correction G-04 | Correction verified at current pin | X-03 | openapi.yml L48-53; openapi.yml L298-299; openapi.yml L349-356 | Resolved: allowed OpenAPI gives success codes. |
| Correction G-11 | Correction verified at current pin | FE-049 coverage disposition | frontend-api.md L25-34 | Deployment limitation, not product requirement; current citation is 31-34, not 205-208. No hosted instance used. |

## Run 2a coverage

Pin: ebbcdeb8d55b42a3a613c787560498b8ef10003f. The 210-row older recount is an inventory of leads, not an authority. Each row is re-located below. Covered means designed requirement coverage, not executed tests or proven software. Exclusions include engineering/styling/deployment scope and unsupported or conflicting statements; their questions remain unanswered. A declared response code is not an invented trigger.

| Checklist ID | Historical statement (lead only) | Evidence at pin | Disposition | Coverage / reason | Qualification |
| --- | --- | --- | --- | --- | --- |
| B-001 | Responses carry a JSON content type `application/json; charset=utf-8`. | api-response-format.md L7 | Covered | BR-22.6 |  |
| B-002 | Protected requests read credentials from header `Authorization: Token <jwt>`. | endpoints.md L5-9; openapi.yml L912-922 | Covered | BR-03.1 |  |
| B-003 | A request failing validation returns HTTP 422. | error-handling.md L7 | Covered | BR-22.1 |  |
| B-004 | A 422 body has shape `{"errors":{<field>:[<message>...]}}`. | error-handling.md L7-17; openapi.yml L637-647 | Covered | BR-22.1; BR-22.8 |  |
| B-005 | Request needing auth without credentials returns 401. | error-handling.md L21 | Covered | BR-03.3 |  |
| B-006 | Valid request by a user lacking permission returns 403. | error-handling.md L23 | Covered | BR-22.3 |  |
| B-007 | Request for a resource that cannot be found returns 404. | error-handling.md L25 | Covered | BR-22.4 |  |
| B-008 | 401 body is `{"errors":{...}}` (example key `token: ["is missing"]`). | openapi.yml L771-780 | Covered | BR-22.7 |  |
| B-009 | 403 body is `{"errors":{"resource":["forbidden"]}}`, where the key identifies the resource type. | openapi.yml L791-800 | Covered | BR-22.8 |  |
| B-010 | 404 body is `{"errors":{"resource":["not found"]}}`, where the key identifies the resource type. | openapi.yml L801-810 | Covered | BR-22.8 |  |
| B-011 | 409 body is `{"errors":{<field>:["has already been taken"]}}` (example `username`). | openapi.yml L781-790 | Covered | BR-01.4; AC-01.3 |  |
| B-012 | Backend on a different origin handles `OPTIONS`. | cors.md L7 | Covered | BR-23.1 |  |
| B-013 | CORS preflight response returns correct `Access-Control-Allow-Origin`. | cors.md L7 | Covered | BR-23.1 |  |
| B-014 | CORS preflight response returns correct `Access-Control-Allow-Headers` (e.g. `Content-Type`). | cors.md L7 | Covered | BR-23.1 |  |
| B-015 | Backend includes at least one unit test. | backend-tests.md L5 | Out of asserted scope | Engineering delivery requirement, not a Conduit business outcome; no unit-test code or suite was read. |  |
| B-016 | Backend adheres to the OpenAPI spec. | backend-introduction.md L5 | Out of asserted scope | Overarching implementation conformance directive, not a discrete business outcome; operation contracts are mapped individually below. |  |
| U-001 | `POST /api/users/login` needs no authentication. | endpoints.md L26 | Covered | BR-02.2 |  |
| U-002 | Login body is `{"user":{"email","password"}}`. | endpoints.md L15-24; openapi.yml L822-833 | Covered | BR-02.7 |  |
| U-003 | Login with missing `email` is rejected. | endpoints.md L28; openapi.yml L457-459 | Covered | BR-02.1; AC-02.4 |  |
| U-004 | Login with missing `password` is rejected. | endpoints.md L28; openapi.yml L457-459 | Covered | BR-02.1; AC-02.4 |  |
| U-005 | Successful login returns 200 with a `{"user":{...}}` object. | openapi.yml L32-33 | Covered | BR-02.3; AC-02.2 |  |
| U-006 | Failed login returns 401. | openapi.yml L34-37; error-handling.md L7 | Covered | BR-02.8; OQ-02.1 | Only the 401 declaration is covered, not a selected wrong-password predicate; OQ-02.1 is still Open. |
| U-007 | Login with invalid payload returns 422. | openapi.yml L36-37; error-handling.md L7 | Covered | BR-02.8; BR-22.1 |  |
| U-008 | User object contains `email`, `token`, `username`, `bio`, `image`, all required. | openapi.yml L481-503 | Covered | BR-01.8 |  |
| U-009 | `bio` and `image` may be `null`. | openapi.yml L496-503 | Covered | BR-01.8 |  |
| U-010 | `POST /api/users` needs no authentication. | endpoints.md L46 | Covered | BR-01.2 |  |
| U-011 | Registration body is `{"user":{"username","email","password"}}`. | endpoints.md L34-44; openapi.yml L834-845 | Covered | BR-01.9 |  |
| U-012 | Registration with missing `email` is rejected. | endpoints.md L48; openapi.yml L467-471 | Covered | BR-01.1; AC-01.4 |  |
| U-013 | Registration with missing `username` is rejected. | endpoints.md L48; openapi.yml L467-471 | Covered | BR-01.1; AC-01.4 |  |
| U-014 | Registration with missing `password` is rejected. | endpoints.md L48; openapi.yml L467-471 | Covered | BR-01.1; AC-01.4 |  |
| U-015 | Successful registration returns 201 with a User. | openapi.yml L48-49 | Covered | BR-01.3 |  |
| U-016 | Registration with an already-taken value returns 409. | openapi.yml L50-51; openapi.yml L781-790 | Covered | BR-01.4 |  |
| U-017 | Registration with invalid payload returns 422. | openapi.yml L52-53; error-handling.md L7 | Covered | BR-01.5; BR-22.1 |  |
| U-018 | `GET /api/user` requires authentication. | endpoints.md L54 | Covered | BR-03.2 |  |
| U-019 | `GET /api/user` returns the current user (200). | openapi.yml L63-64 | Covered | BR-03.5 |  |
| U-020 | `GET /api/user` unauthenticated returns 401. | openapi.yml L65-66 | Covered | BR-03.3 |  |
| U-021 | `PUT /api/user` requires authentication. | endpoints.md L72 | Covered | BR-05.3 |  |
| U-022 | `PUT /api/user` accepts `email`. | endpoints.md L74 | Covered | BR-05.3 |  |
| U-023 | `PUT /api/user` accepts `username`. | endpoints.md L74 | Covered | BR-05.3 |  |
| U-024 | `PUT /api/user` accepts `password`. | endpoints.md L74 | Covered | BR-05.3 |  |
| U-025 | `PUT /api/user` accepts `image`. | endpoints.md L74 | Covered | BR-05.3 |  |
| U-026 | `PUT /api/user` accepts `bio`. | endpoints.md L74 | Covered | BR-05.3 |  |
| U-027 | `PUT /api/user` returns the updated User (200). | openapi.yml L80-81; endpoints.md L72 | Covered | BR-05.6 |  |
| U-028 | `PUT /api/user` with no fields is invalid ("at least one field is required"). | openapi.yml L846-857 | Covered | BR-05.5 |  |
| U-029 | `PUT /api/user` unauthenticated returns 401. | openapi.yml L82-83 | Covered | BR-05.6; BR-22.2 |  |
| U-030 | `PUT /api/user` invalid payload returns 422. | openapi.yml L84-85; error-handling.md L7 | Covered | BR-05.6; BR-22.1 |  |
| U-031 | Auth token is a JWT. | routing.md L10; features.md L7 | Covered | BR-01.7; BR-03.1 |  |
| P-001 | `GET /api/profiles/:username` authentication is optional. | endpoints.md L80 | Covered | BR-06.2 |  |
| P-002 | It returns `{"profile":{username,bio,image,following}}`. | openapi.yml L521-540; openapi.yml L746-756 | Covered | BR-06.5 |  |
| P-003 | `following` reflects whether the current user follows the profile. | api-response-format.md L25-33; openapi.yml L539-540 | Out of asserted scope | Viewer-relative following meaning is inferred, not stated. BR-19.2 became OQ-19.4; field presence/type is BR-06.5, not a proof of semantics. |  |
| P-004 | Unknown username returns 404. | openapi.yml L108-109 | Covered | BR-06.3 |  |
| P-005 | `POST /api/profiles/:username/follow` requires authentication. | endpoints.md L86 | Covered | BR-19.1 |  |
| P-006 | Follow takes no additional parameters. | endpoints.md L88 | Covered | BR-19.6 |  |
| P-007 | Follow returns the Profile (200). | openapi.yml L127-128 | Covered | BR-19.6 |  |
| P-008 | Follow unknown user returns 404. | openapi.yml L131-132 | Covered | BR-19.4 |  |
| P-009 | Follow unauthenticated returns 401. | openapi.yml L129-130; error-handling.md L21 | Covered | BR-19.6; BR-22.2 |  |
| P-010 | `DELETE /api/profiles/:username/follow` requires authentication. | endpoints.md L94 | Covered | BR-19.1 |  |
| P-011 | Unfollow takes no additional parameters. | endpoints.md L96 | Covered | BR-19.6 |  |
| P-012 | Unfollow returns the Profile (200). | openapi.yml L151-152 | Covered | BR-19.6 |  |
| P-013 | Unfollow unknown user returns 404. | openapi.yml L155-156 | Covered | BR-19.6; BR-22.4 |  |
| P-014 | Unfollow unauthenticated returns 401. | openapi.yml L153-154; error-handling.md L21 | Covered | BR-19.6; BR-22.2 |  |
| P-015 | Profile endpoints return 422 for invalid input. | openapi.yml L110-111; openapi.yml L133-134; openapi.yml L157-158 | Covered | BR-06.6; BR-19.6; BR-22.1 | 422 declarations plus generic validation rule; specific invalid-input boundaries remain X-06 questions. |
| P-016 | `GET /profiles/:username` may return 401 (declared in OA despite optional auth). | openapi.yml L106-107 | Covered | BR-06.6; OQ-03.4 | Declared 401 only; optional authentication is retained and invalid-token classification is OQ-03.4. |
| A-001 | `GET /api/articles` authentication is optional. | endpoints.md L126 | Covered | BR-12.2 |  |
| A-002 | It returns most recent articles first. | endpoints.md L102; endpoints.md L126 | Covered | BR-12.2 |  |
| A-003 | Filter by `tag`. | endpoints.md L106-108 | Covered | BR-14.2; AC-14.3 |  |
| A-004 | Filter by `author`. | endpoints.md L110-112 | Covered | BR-07.2; AC-07.3 |  |
| A-005 | Filter by `favorited` (username). | endpoints.md L114-116 | Covered | BR-07.2; AC-07.4 |  |
| A-006 | `limit` query parameter limits the count. | endpoints.md L118-120 | Covered | BR-15.2; AC-15.3 |  |
| A-007 | `limit` defaults to 20. | endpoints.md L118; openapi.yml L910 | Covered | BR-15.2 |  |
| A-008 | `limit` must be an integer >= 1. | openapi.yml L903-911 | Covered | BR-15.5 |  |
| A-009 | `offset` skips items. | endpoints.md L122-124 | Covered | BR-15.2; AC-15.3 |  |
| A-010 | `offset` defaults to 0. | endpoints.md L122 | Covered | BR-15.2 |  |
| A-011 | `offset` must be an integer >= 0. | openapi.yml L895-902 | Covered | BR-15.5 |  |
| A-012 | List response is `{"articles":[...],"articlesCount":n}`. | openapi.yml L697-745 | Covered | BR-12.5 |  |
| A-013 | List items do NOT include `body`. | api-response-format.md L62-67 | Covered | BR-12.3 |  |
| A-014 | List item has `slug,title,description,tagList,createdAt,updatedAt,favorited,favoritesCount,author`. | openapi.yml L710-743 | Covered | BR-12.5 |  |
| A-015 | `articlesCount` is an integer, required. | openapi.yml L702-745 | Covered | BR-12.5 | Required integer presence only; filtered-total meaning remains OQ-15.3. |
| A-016 | List with invalid params returns 422. | openapi.yml L212-213; error-handling.md L7 | Covered | BR-12.6; BR-22.1 |  |
| A-017 | List declares 401. | openapi.yml L210-211 | Covered | BR-12.6; OQ-03.4 | Declared 401 only; no rule rejecting ordinary anonymous listing was added. |
| A-018 | `GET /api/articles/feed` requires authentication. | endpoints.md L134 | Covered | BR-13.2 |  |
| A-019 | Feed accepts `limit`. | endpoints.md L132 | Covered | BR-13.3 |  |
| A-020 | Feed accepts `offset`. | endpoints.md L132 | Covered | BR-13.3 |  |
| A-021 | Feed returns articles created by followed users. | endpoints.md L134 | Covered | BR-13.2 |  |
| A-022 | Feed is ordered most recent first. | endpoints.md L134 | Covered | BR-13.2 |  |
| A-023 | Feed list items omit `body`. | api-response-format.md L62-67 | Covered | BR-12.3 |  |
| A-024 | Feed unauthenticated returns 401. | openapi.yml L175-176 | Covered | BR-13.4; AC-13.4 |  |
| A-025 | `GET /api/articles/:slug` needs no authentication. | endpoints.md L140 | Covered | BR-11.2 |  |
| A-026 | It returns a single Article (200). | openapi.yml L249-250; endpoints.md L140 | Covered | BR-11.6 |  |
| A-027 | Single Article includes `body`. | api-response-format.md L38-57; openapi.yml L541-578 | Covered | BR-08.5; BR-08.8 |  |
| A-028 | Unknown slug returns 404. | openapi.yml L251-252 | Covered | BR-11.5 |  |
| A-029 | `POST /api/articles` requires authentication. | endpoints.md L159 | Covered | BR-08.3 |  |
| A-030 | Create body is `{"article":{title,description,body,tagList}}`. | endpoints.md L148-157; openapi.yml L858-869 | Covered | BR-08.7 |  |
| A-031 | `title` required. | endpoints.md L161 | Covered | BR-08.4 |  |
| A-032 | `description` required. | endpoints.md L161 | Covered | BR-08.4 |  |
| A-033 | `body` required. | endpoints.md L161 | Covered | BR-08.4 |  |
| A-034 | `tagList` optional, array of strings. | endpoints.md L163; openapi.yml L592-595 | Covered | BR-08.7 |  |
| A-035 | Create returns 201 with the Article. | openapi.yml L223-224 | Covered | BR-08.5 |  |
| A-036 | Create unauthenticated returns 401. | openapi.yml L225-226; error-handling.md L21 | Covered | BR-08.9; AC-08.5 |  |
| A-037 | Create with conflict returns 409. | openapi.yml L227-228 | Covered | BR-08.9; OQ-08.1 | 409 declaration covered; conflict trigger remains OQ-08.1; unique duplicate-title slugs remain BR-08.6. |
| A-038 | Create invalid returns 422. | openapi.yml L229-230; error-handling.md L7 | Covered | BR-08.9; BR-22.1 |  |
| A-039 | `PUT /api/articles/:slug` requires authentication. | endpoints.md L179 | Covered | BR-09.2 |  |
| A-040 | Update accepts optional `title`. | endpoints.md L181 | Covered | BR-09.2 |  |
| A-041 | Update accepts optional `description`. | endpoints.md L181 | Covered | BR-09.2 |  |
| A-042 | Update accepts optional `body`. | endpoints.md L181 | Covered | BR-09.2 |  |
| A-043 | Update accepts `tagList` (OA only). | endpoints.md L181; openapi.yml L596-608 | Out of asserted scope | Prose omits tagList while UpdateArticle schema includes it; OQ-09.1 retains both sources. No business decision or new assertion about editable tags. |  |
| A-044 | Slug changes when `title` changes. | endpoints.md L183 | Covered | BR-09.3 |  |
| A-045 | Update returns the updated Article (200). | openapi.yml L271-272; endpoints.md L179 | Covered | BR-09.5 |  |
| A-046 | Update unauthenticated returns 401. | openapi.yml L273-274; error-handling.md L21 | Covered | BR-09.5; BR-22.2 |  |
| A-047 | Update where user lacks permission returns 403. | openapi.yml L275-276; error-handling.md L23 | Covered | BR-09.5; BR-22.3 |  |
| A-048 | Update unknown slug returns 404. | openapi.yml L277-278; error-handling.md L25 | Covered | BR-09.5; BR-22.4 |  |
| A-049 | Update invalid returns 422. | openapi.yml L279-280; error-handling.md L7 | Covered | BR-09.5; BR-22.1 |  |
| A-050 | `DELETE /api/articles/:slug` requires authentication. | endpoints.md L187-191 | Covered | BR-10.1 |  |
| A-051 | Delete returns 204. | openapi.yml L298-299; openapi.yml L768-770 | Covered | BR-10.4 |  |
| A-052 | Delete unauthenticated returns 401. | openapi.yml L300-301; error-handling.md L21 | Covered | BR-10.4; BR-22.2 |  |
| A-053 | Delete without permission returns 403. | openapi.yml L302-303; error-handling.md L23 | Covered | BR-10.4; BR-22.3 |  |
| A-054 | Delete unknown slug returns 404. | openapi.yml L304-305; error-handling.md L25 | Covered | BR-10.4; BR-22.4 |  |
| A-055 | Delete invalid returns 422. | openapi.yml L306-307; error-handling.md L7 | Covered | BR-10.4; BR-22.1 |  |
| A-056 | Article `createdAt`/`updatedAt` are date-time strings. | openapi.yml L567-572 | Covered | BR-08.8 |  |
| A-057 | Article `favoritesCount` is an integer. | openapi.yml L575-576 | Covered | BR-08.8 |  |
| A-058 | Article `author` is a Profile object. | openapi.yml L577-578 | Covered | BR-08.8 |  |
| C-001 | `POST /api/articles/:slug/comments` requires authentication. | endpoints.md L207 | Covered | BR-16.2 |  |
| C-002 | Body is `{"comment":{"body"}}`. | endpoints.md L197-205; openapi.yml L882-893 | Covered | BR-16.4 |  |
| C-003 | `body` is required. | endpoints.md L209; openapi.yml L630-636 | Covered | BR-16.2 |  |
| C-004 | Create returns the Comment, 201. | openapi.yml L349-350 | Covered | BR-16.2 |  |
| C-005 | Create unauthenticated returns 401. | openapi.yml L351-352; error-handling.md L21 | Covered | BR-16.6; AC-16.4 |  |
| C-006 | Create on unknown article returns 404. | openapi.yml L353-354; error-handling.md L25 | Covered | BR-16.6; BR-22.4 |  |
| C-007 | Create invalid returns 422. | openapi.yml L355-356; error-handling.md L7 | Covered | BR-16.6; BR-22.1 |  |
| C-008 | `GET /api/articles/:slug/comments` authentication is optional. | endpoints.md L215 | Covered | BR-17.1 |  |
| C-009 | It returns `{"comments":[...]}` (200). | openapi.yml L325-326; api-response-format.md L127-141 | Covered | BR-17.4 |  |
| C-010 | Unknown article returns 404. | openapi.yml L329-330; error-handling.md L25 | Covered | BR-17.4; BR-22.4 |  |
| C-011 | Comment has `id, createdAt, updatedAt, body, author`. | openapi.yml L609-629 | Covered | BR-16.5 |  |
| C-012 | `id` is an integer. | openapi.yml L618-619 | Covered | BR-16.5 |  |
| C-013 | `DELETE /api/articles/:slug/comments/:id` requires authentication. | endpoints.md L217-221 | Covered | BR-18.1 |  |
| C-014 | Delete returns 204. | openapi.yml L381-382; openapi.yml L768-770 | Covered | BR-18.4 |  |
| C-015 | Delete unauthenticated returns 401. | openapi.yml L383-384; error-handling.md L21 | Covered | BR-18.4; BR-22.2 |  |
| C-016 | Delete without permission returns 403. | openapi.yml L385-386; error-handling.md L23 | Covered | BR-18.4; BR-22.3 |  |
| C-017 | Delete unknown comment/article returns 404. | openapi.yml L387-388; error-handling.md L25 | Covered | BR-18.4; BR-22.4 |  |
| C-018 | Delete invalid returns 422. | openapi.yml L389-390; error-handling.md L7 | Covered | BR-18.4; BR-22.1 |  |
| C-019 | Comment `id` path parameter is an integer. | openapi.yml L374-379 | Covered | BR-18.4 |  |
| F-001 | `POST /api/articles/:slug/favorite` requires authentication. | endpoints.md L227 | Covered | BR-20.1 |  |
| F-002 | No additional parameters. | endpoints.md L229 | Covered | BR-20.5 |  |
| F-003 | Returns the Article (200). | openapi.yml L408-409 | Covered | BR-20.5 |  |
| F-004 | Unauthenticated returns 401. | openapi.yml L410-411; error-handling.md L21 | Covered | BR-20.5; BR-22.2 |  |
| F-005 | Unknown article returns 404. | openapi.yml L412-413; error-handling.md L25 | Covered | BR-20.5; BR-22.4 |  |
| F-006 | `DELETE /api/articles/:slug/favorite` requires authentication. | endpoints.md L235 | Covered | BR-20.1 |  |
| F-007 | No additional parameters. | endpoints.md L237 | Covered | BR-20.5 |  |
| F-008 | Returns the Article (200). | openapi.yml L432-433 | Covered | BR-20.5 |  |
| F-009 | Unauthenticated returns 401. | openapi.yml L434-435; error-handling.md L21 | Covered | BR-20.5; BR-22.2 |  |
| F-010 | Unknown article returns 404. | openapi.yml L436-437; error-handling.md L25 | Covered | BR-20.5; BR-22.4 |  |
| F-011 | Favoriting updates `favorited` and `favoritesCount` on the Article (implied). | api-response-format.md L48-49; endpoints.md L223-237 | Out of asserted scope | The recount explicitly labels the state/count transition implied; not a stated expected result. See OQ-20.3 and retained BA-ASSUMPTION scenarios. |  |
| F-012 | `GET /api/tags` needs no authentication. | endpoints.md L243 | Covered | BR-14.3 |  |
| F-013 | It returns `{"tags":[string...]}` (200). | openapi.yml L450-451; api-response-format.md L146-152 | Covered | BR-14.4 |  |
| F-014 | Declares 422 for errors. | openapi.yml L452-453 | Covered | BR-14.4 |  |
| FE-001 | Home at `/`. | routing.md L5 | Covered | BR-12.1 |  |
| FE-002 | Home shows list of tags. | routing.md L6 | Covered | BR-14.1 |  |
| FE-003 | Home shows articles from Feed, Global or by Tag. | routing.md L7 | Covered | BR-12.2; BR-13.2; BR-14.2 |  |
| FE-004 | Home paginates the article list. | routing.md L8 | Covered | BR-15.1 |  |
| FE-005 | Home has a default Global Feed tab. | templates.md L120 | Covered | BR-12.1 |  |
| FE-006 | A tag tab appears after clicking a popular tag. | templates.md L121 | Covered | BR-14.2 |  |
| FE-007 | A Your Feed tab appears after login. | templates.md L122 | Covered | BR-13.1 |  |
| FE-008 | Home shows a banner with "conduit" and "A place to share your knowledge.". | templates.md L126-131 | Covered | BR-12.7 |  |
| FE-009 | Sidebar labelled "Popular Tags". | templates.md L203 | Covered | BR-14.1 |  |
| FE-010 | Pagination uses `page-item`/`page-link`, active page marked `active`. | templates.md L191-196 | Covered | BR-15.6 |  |
| FE-011 | Article preview shows author link, date, favorite count button, title, description, "Read more...", tag list. | templates.md L145-185 | Covered | BR-12.4 |  |
| FE-012 | Login at `/login`. | routing.md L9 | Covered | BR-02.5 |  |
| FE-013 | Register at `/register`. | routing.md L9 | Covered | BR-01.6 |  |
| FE-014 | JWT stored in localStorage. | routing.md L10 | Covered | BR-01.7 |  |
| FE-015 | Login page: heading "Sign in", link "Need an account?", email + password inputs, "Sign in" button. | templates.md L231-247 | Covered | BR-02.5; BR-02.9 |  |
| FE-016 | Register page: heading "Sign up", link "Have an account?", username/email/password, "Sign up" button. | templates.md L262-281 | Covered | BR-01.6; BR-01.10 |  |
| FE-017 | Auth pages show errors in `ul.error-messages`. | templates.md L236-238; templates.md L267-269 | Covered | BR-01.6; BR-02.5 |  |
| FE-018 | Settings at `/settings`. | routing.md L12 | Covered | BR-05.1 |  |
| FE-019 | Settings fields: profile picture URL, name, bio, email, new password, "Update Settings". | templates.md L404-426 | Covered | BR-05.2 |  |
| FE-020 | Settings has a logout button "Or click here to logout.". | templates.md L430; features.md L7 | Covered | BR-04.1 |  |
| FE-021 | Editor at `/editor`. | routing.md L13 | Covered | BR-08.1 |  |
| FE-022 | Edit existing at `/editor/article-slug-here`. | routing.md L13 | Covered | BR-09.1 |  |
| FE-023 | Editor fields: title, about, body (markdown), tags, "Publish Article". | templates.md L451-470 | Covered | BR-08.2 |  |
| FE-024 | Editor shows tags with remove icon. | templates.md L464-466 | Covered | BR-08.10 |  |
| FE-025 | Editor errors in `ul.error-messages`. | templates.md L444-446 | Covered | BR-08.10 |  |
| FE-026 | Article page at `/article/article-slug-here`. | routing.md L14 | Covered | BR-11.1 |  |
| FE-027 | Delete-article button shown only to the author. | routing.md L15 | Covered | BR-10.2 |  |
| FE-028 | Markdown body rendered client side. | routing.md L16 | Covered | BR-11.3 |  |
| FE-029 | Comments section at the bottom. | routing.md L17 | Covered | BR-11.4 |  |
| FE-030 | Delete-comment button shown only to the comment's author. | routing.md L18 | Covered | BR-18.2 |  |
| FE-031 | Article page has Follow, Favorite, Edit, Delete buttons (template conflates; TODO says switching is unfinished). | templates.md L482; templates.md L495-509 | Covered | BR-19.3; BR-20.3; BR-10.2; OQ-09.2 | Existing Follow/Favorite/Delete controls covered; edit control presence is added in BR-08.10, but switching logic remains OQ-09.2. No API ownership condition is inferred. |
| FE-032 | Comment form: textarea "Write a comment..." and "Post Comment". | templates.md L562-566 | Covered | BR-16.1 |  |
| FE-033 | Comment card shows text, author avatar/link, date. | templates.md L577-582 | Covered | BR-17.2 |  |
| FE-034 | Profile at `/profile/:username`. | routing.md L19 | Covered | BR-06.1 |  |
| FE-035 | Favourites at `/profile/:username/favorites`. | routing.md L19 | Covered | BR-07.1 |  |
| FE-036 | Profile shows basic user info. | routing.md L20 | Covered | BR-06.1 |  |
| FE-037 | Profile lists author's articles or favorited articles. | routing.md L21 | Covered | BR-07.1 |  |
| FE-038 | Profile has tabs "My Articles" and "Favorited Articles". | templates.md L322-325 | Covered | BR-07.1 |  |
| FE-039 | Profile shows "Follow <name>" or "Edit Profile Settings". | templates.md L305-309 | Covered | BR-06.4 |  |
| FE-040 | Header unauth: Home, Sign in, Sign up. | templates.md L36-40 | Covered | BR-21.1 |  |
| FE-041 | Header auth: Home, New Article, Settings, profile link. | templates.md L66-71 | Covered | BR-21.2 |  |
| FE-042 | Active page's header link has class `active`. | templates.md L42; templates.md L73 | Covered | BR-21.3 |  |
| FE-043 | Footer with "conduit" link and MIT attribution text. | templates.md L103-111 | Covered | BR-21.4 |  |
| FE-044 | Head includes title "Conduit". | templates.md L14 | Covered | BR-21.4 |  |
| FE-045 | Use shared `styles.css` (Conduit Minimal CSS v4). | styles.md L5-14; templates.md L7-26 | Out of asserted scope | Stylesheet packaging/theme-class choice is styling/implementation scope, not a new business rule. Current sources agree; old theme-CDN conflict is resolved. No asset was fetched. |  |
| FE-046 | Missing profile image shows default avatar. | styles.md L16-18 | Covered | BR-21.5 |  |
| FE-047 | Conform to SELECTORS.md contract (names, classes, text, routes, debug interface, localStorage key, avatar). | frontend-tests.md L11-19 | Out of asserted scope | Automation compatibility contract outside business requirements. Its oracle-directory target was never opened; no selector values or debug interface were inferred. |  |
| FE-048 | Include at least one unit test. | frontend-tests.md L5 | Out of asserted scope | Engineering delivery/unit-test requirement, not business behaviour; no tests opened. |  |
| FE-049 | Do not use hosted API for tests: unauth sees only demo content. | frontend-api.md L25-34 | Out of asserted scope | Hosted-demo deployment limitation, not universal Conduit behaviour. Do not copy its visibility restriction into product requirements; no hosted API queried. |  |
| FT-001 | JWT auth with login/signup pages. | features.md L7; routing.md L9-10 | Covered | BR-01.6; BR-01.7; BR-02.5; BR-03.1 |  |
| FT-002 | Users: create, read, update (no delete). | features.md L8 | Covered | BR-01.1; BR-05.3; BR-05.4; BR-03.2 |  |
| FT-003 | Articles: full CRUD. | features.md L9 | Covered | BR-08.3; BR-09.2; BR-10.1; BR-11.2 |  |
| FT-004 | Comments: create, read, delete (no update). | features.md L10 | Covered | BR-16.2; BR-16.3; BR-17.1; BR-18.1 |  |
| FT-005 | Paginated article lists. | features.md L11 | Covered | BR-15.1; BR-15.2 |  |
| FT-006 | Favorite articles. | features.md L12 | Covered | BR-20.1 |  |
| FT-007 | Follow users. | features.md L13 | Covered | BR-19.1 |  |
