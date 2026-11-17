# Independent requirements recount (Step 4)

Written BEFORE opening `realworld-requirements-baseline.md`.
Sources read (only): `docs/src/content/docs/specifications/**/*.md`, `docs/src/content/docs/implementation-creation/features.md`, `specs/api/openapi.yml`
at realworld submodule SHA `450bbc5410c7c1b7feca0f238e002162468e2a6c`.
Not read: `specs/api/hurl`, `specs/api/bruno`, `specs/e2e/*.spec.ts`. (Before this recount I saw only the 13 hurl file names and request counts in the Step 1 run output, no file content.)

Rule: one condition -> one observable outcome. Compound sentences split. `invent nothing`.
Source key: **EP** backend/endpoints.md, **ERR** backend/error-handling.md, **RF** backend/api-response-format.md, **CORS** backend/cors.md, **OA** openapi.yml, **RT** frontend/routing.md, **TPL** frontend/templates.md, **STY** frontend/styles.md, **FAPI** frontend/api.md, **FT** frontend/tests.md, **FEAT** features.md. Paths relative to `docs/src/content/docs/specifications/` unless OA/FEAT.

## A. Backend: cross-cutting

| ID | Requirement | Source |
|---|---|---|
| B-001 | Responses carry a JSON content type `application/json; charset=utf-8`. | RF:7 |
| B-002 | Protected requests read credentials from header `Authorization: Token <jwt>`. | EP:7-9, OA:912-921 |
| B-003 | A request failing validation returns HTTP 422. | ERR:7 |
| B-004 | A 422 body has shape `{"errors":{<field>:[<message>...]}}`. | ERR:7-17, OA:637-647 |
| B-005 | Request needing auth without credentials returns 401. | ERR:21 |
| B-006 | Valid request by a user lacking permission returns 403. | ERR:23 |
| B-007 | Request for a resource that cannot be found returns 404. | ERR:25 |
| B-008 | 401 body is `{"errors":{...}}` (example key `token: ["is missing"]`). | OA:771-780 |
| B-009 | 403 body is `{"errors":{"resource":["forbidden"]}}`, where the key identifies the resource type. | OA:791-800 |
| B-010 | 404 body is `{"errors":{"resource":["not found"]}}`, where the key identifies the resource type. | OA:801-810 |
| B-011 | 409 body is `{"errors":{<field>:["has already been taken"]}}` (example `username`). | OA:781-790 |
| B-012 | Backend on a different origin handles `OPTIONS`. | CORS:7 |
| B-013 | CORS preflight response returns correct `Access-Control-Allow-Origin`. | CORS:7 |
| B-014 | CORS preflight response returns correct `Access-Control-Allow-Headers` (e.g. `Content-Type`). | CORS:7 |
| B-015 | Backend includes at least one unit test. | backend/tests.md:5 |
| B-016 | Backend adheres to the OpenAPI spec. | backend/introduction.md:5 |

## B. Users and authentication

| ID | Requirement | Source |
|---|---|---|
| U-001 | `POST /api/users/login` needs no authentication. | EP:26 |
| U-002 | Login body is `{"user":{"email","password"}}`. | EP:15-24, OA:822-833 |
| U-003 | Login with missing `email` is rejected. | EP:28, OA:457-459 |
| U-004 | Login with missing `password` is rejected. | EP:28, OA:457-459 |
| U-005 | Successful login returns 200 with a `{"user":{...}}` object. | OA:32-33 |
| U-006 | Failed login returns 401. | OA:34-35 |
| U-007 | Login with invalid payload returns 422. | OA:36-37 |
| U-008 | User object contains `email`, `token`, `username`, `bio`, `image`, all required. | RF:11-20, OA:481-503 |
| U-009 | `bio` and `image` may be `null`. | RF:17-18, OA:496-503 |
| U-010 | `POST /api/users` needs no authentication. | EP:46 |
| U-011 | Registration body is `{"user":{"username","email","password"}}`. | EP:34-44, OA:834-845 |
| U-012 | Registration with missing `email` is rejected. | EP:48, OA:467-471 |
| U-013 | Registration with missing `username` is rejected. | EP:48, OA:467-471 |
| U-014 | Registration with missing `password` is rejected. | EP:48, OA:467-471 |
| U-015 | Successful registration returns 201 with a User. | OA:48-49 |
| U-016 | Registration with an already-taken value returns 409. | OA:50-51 |
| U-017 | Registration with invalid payload returns 422. | OA:52-53 |
| U-018 | `GET /api/user` requires authentication. | EP:54, OA:69-70 |
| U-019 | `GET /api/user` returns the current user (200). | EP:54, OA:63-64 |
| U-020 | `GET /api/user` unauthenticated returns 401. | OA:65-66 |
| U-021 | `PUT /api/user` requires authentication. | EP:72, OA:86-87 |
| U-022 | `PUT /api/user` accepts `email`. | EP:74 |
| U-023 | `PUT /api/user` accepts `username`. | EP:74 |
| U-024 | `PUT /api/user` accepts `password`. | EP:74 |
| U-025 | `PUT /api/user` accepts `image`. | EP:74 |
| U-026 | `PUT /api/user` accepts `bio`. | EP:74 |
| U-027 | `PUT /api/user` returns the updated User (200). | EP:72, OA:80-81 |
| U-028 | `PUT /api/user` with no fields is invalid ("at least one field is required"). | OA:848 |
| U-029 | `PUT /api/user` unauthenticated returns 401. | OA:82-83 |
| U-030 | `PUT /api/user` invalid payload returns 422. | OA:84-85 |
| U-031 | Auth token is a JWT. | FEAT:7, RT:10 |

## C. Profiles

| ID | Requirement | Source |
|---|---|---|
| P-001 | `GET /api/profiles/:username` authentication is optional. | EP:80, OA:94 |
| P-002 | It returns `{"profile":{username,bio,image,following}}`. | EP:80, RF:25-33, OA:521-540 |
| P-003 | `following` reflects whether the current user follows the profile. | RF:31 (field only) |
| P-004 | Unknown username returns 404. | OA:108-109 |
| P-005 | `POST /api/profiles/:username/follow` requires authentication. | EP:86, OA:135-136 |
| P-006 | Follow takes no additional parameters. | EP:88 |
| P-007 | Follow returns the Profile (200). | EP:86, OA:127-128 |
| P-008 | Follow unknown user returns 404. | OA:131-132 |
| P-009 | Follow unauthenticated returns 401. | OA:129-130 |
| P-010 | `DELETE /api/profiles/:username/follow` requires authentication. | EP:94, OA:159-160 |
| P-011 | Unfollow takes no additional parameters. | EP:96 |
| P-012 | Unfollow returns the Profile (200). | EP:94, OA:151-152 |
| P-013 | Unfollow unknown user returns 404. | OA:155-156 |
| P-014 | Unfollow unauthenticated returns 401. | OA:153-154 |
| P-015 | Profile endpoints return 422 for invalid input. | OA:110-111, 133-134, 157-158 |
| P-016 | `GET /profiles/:username` may return 401 (declared in OA despite optional auth). | OA:106-107 |

## D. Articles

| ID | Requirement | Source |
|---|---|---|
| A-001 | `GET /api/articles` authentication is optional. | EP:126, OA:187 |
| A-002 | It returns most recent articles first. | EP:102, 126 |
| A-003 | Filter by `tag`. | EP:102, 106-108, OA:190-194 |
| A-004 | Filter by `author`. | EP:102, 110-112, OA:195-199 |
| A-005 | Filter by `favorited` (username). | EP:102, 114-116, OA:200-204 |
| A-006 | `limit` query parameter limits the count. | EP:118-120, OA:903-911 |
| A-007 | `limit` defaults to 20. | EP:118, OA:910 |
| A-008 | `limit` must be an integer >= 1. | OA:907-909 |
| A-009 | `offset` skips items. | EP:122-124, OA:895-902 |
| A-010 | `offset` defaults to 0. | EP:122 |
| A-011 | `offset` must be an integer >= 0. | OA:899-901 |
| A-012 | List response is `{"articles":[...],"articlesCount":n}`. | RF:70-103, OA:697-745 |
| A-013 | List items do NOT include `body`. | RF:62-67, OA:710-719 |
| A-014 | List item has `slug,title,description,tagList,createdAt,updatedAt,favorited,favoritesCount,author`. | RF:71-85, OA:710-743 |
| A-015 | `articlesCount` is an integer, required. | RF:102, OA:744-745 |
| A-016 | List with invalid params returns 422. | OA:212-213 |
| A-017 | List declares 401. | OA:210-211 |
| A-018 | `GET /api/articles/feed` requires authentication. | EP:134, OA:179-180 |
| A-019 | Feed accepts `limit`. | EP:132 |
| A-020 | Feed accepts `offset`. | EP:132 |
| A-021 | Feed returns articles created by followed users. | EP:134 |
| A-022 | Feed is ordered most recent first. | EP:134 |
| A-023 | Feed list items omit `body`. | RF:62-67 |
| A-024 | Feed unauthenticated returns 401. | OA:175-176 |
| A-025 | `GET /api/articles/:slug` needs no authentication. | EP:140, OA:239 |
| A-026 | It returns a single Article (200). | EP:140, OA:249-250 |
| A-027 | Single Article includes `body`. | RF:36-58, OA:541-552 |
| A-028 | Unknown slug returns 404. | OA:251-252 |
| A-029 | `POST /api/articles` requires authentication. | EP:159, OA:231-232 |
| A-030 | Create body is `{"article":{title,description,body,tagList}}`. | EP:148-157, OA:858-869 |
| A-031 | `title` required. | EP:161, OA:579-583 |
| A-032 | `description` required. | EP:161, OA:579-583 |
| A-033 | `body` required. | EP:161, OA:579-583 |
| A-034 | `tagList` optional, array of strings. | EP:163, OA:592-596 |
| A-035 | Create returns 201 with the Article. | OA:223-224 |
| A-036 | Create unauthenticated returns 401. | OA:225-226 |
| A-037 | Create with conflict returns 409. | OA:227-228 |
| A-038 | Create invalid returns 422. | OA:229-230 |
| A-039 | `PUT /api/articles/:slug` requires authentication. | EP:179, OA:281-282 |
| A-040 | Update accepts optional `title`. | EP:181, OA:596-601 |
| A-041 | Update accepts optional `description`. | EP:181, OA:596-604 |
| A-042 | Update accepts optional `body`. | EP:181, OA:596-604 |
| A-043 | Update accepts `tagList` (OA only). | OA:605-608 |
| A-044 | Slug changes when `title` changes. | EP:183 |
| A-045 | Update returns the updated Article (200). | EP:179, OA:271-272 |
| A-046 | Update unauthenticated returns 401. | OA:273-274 |
| A-047 | Update where user lacks permission returns 403. | OA:275-276, ERR:23 |
| A-048 | Update unknown slug returns 404. | OA:277-278 |
| A-049 | Update invalid returns 422. | OA:279-280 |
| A-050 | `DELETE /api/articles/:slug` requires authentication. | EP:189, OA:308-309 |
| A-051 | Delete returns 204. | OA:298-299 |
| A-052 | Delete unauthenticated returns 401. | OA:300-301 |
| A-053 | Delete without permission returns 403. | OA:302-303, ERR:23 |
| A-054 | Delete unknown slug returns 404. | OA:304-305 |
| A-055 | Delete invalid returns 422. | OA:306-307 |
| A-056 | Article `createdAt`/`updatedAt` are date-time strings. | RF:46-47, OA:567-572 |
| A-057 | Article `favoritesCount` is an integer. | RF:49, OA:575-576 |
| A-058 | Article `author` is a Profile object. | RF:50-55, OA:577-578 |

## E. Comments

| ID | Requirement | Source |
|---|---|---|
| C-001 | `POST /api/articles/:slug/comments` requires authentication. | EP:205, OA:357-358 |
| C-002 | Body is `{"comment":{"body"}}`. | EP:197-203, OA:882-893 |
| C-003 | `body` is required. | EP:207, OA:630-636 |
| C-004 | Create returns the Comment, 201. | EP:205, OA:349-350 |
| C-005 | Create unauthenticated returns 401. | OA:351-352 |
| C-006 | Create on unknown article returns 404. | OA:353-354 |
| C-007 | Create invalid returns 422. | OA:355-356 |
| C-008 | `GET /api/articles/:slug/comments` authentication is optional. | EP:213, OA:315 |
| C-009 | It returns `{"comments":[...]}` (200). | EP:213, RF:127-141, OA:325-326 |
| C-010 | Unknown article returns 404. | OA:329-330 |
| C-011 | Comment has `id, createdAt, updatedAt, body, author`. | RF:110-121, OA:609-629 |
| C-012 | `id` is an integer. | RF:111, OA:618-619 |
| C-013 | `DELETE /api/articles/:slug/comments/:id` requires authentication. | EP:219, OA:391-392 |
| C-014 | Delete returns 204. | OA:381-382 |
| C-015 | Delete unauthenticated returns 401. | OA:383-384 |
| C-016 | Delete without permission returns 403. | OA:385-386, ERR:23 |
| C-017 | Delete unknown comment/article returns 404. | OA:387-388 |
| C-018 | Delete invalid returns 422. | OA:389-390 |
| C-019 | Comment `id` path parameter is an integer. | OA:374-379 |

## F. Favorites and tags

| ID | Requirement | Source |
|---|---|---|
| F-001 | `POST /api/articles/:slug/favorite` requires authentication. | EP:225, OA:416-417 |
| F-002 | No additional parameters. | EP:227 |
| F-003 | Returns the Article (200). | EP:225, OA:408-409 |
| F-004 | Unauthenticated returns 401. | OA:410-411 |
| F-005 | Unknown article returns 404. | OA:412-413 |
| F-006 | `DELETE /api/articles/:slug/favorite` requires authentication. | EP:233, OA:440-441 |
| F-007 | No additional parameters. | EP:235 |
| F-008 | Returns the Article (200). | EP:233, OA:432-433 |
| F-009 | Unauthenticated returns 401. | OA:434-435 |
| F-010 | Unknown article returns 404. | OA:436-437 |
| F-011 | Favoriting updates `favorited` and `favoritesCount` on the Article (implied). | RF:48-49 |
| F-012 | `GET /api/tags` needs no authentication. | EP:241, OA:447 |
| F-013 | It returns `{"tags":[string...]}` (200). | EP:241, RF:146-152, OA:451 |
| F-014 | Declares 422 for errors. | OA:452-453 |

## G. Frontend

| ID | Requirement | Source |
|---|---|---|
| FE-001 | Home at `/`. | RT:5 |
| FE-002 | Home shows list of tags. | RT:6 |
| FE-003 | Home shows articles from Feed, Global or by Tag. | RT:7 |
| FE-004 | Home paginates the article list. | RT:8 |
| FE-005 | Home has a default Global Feed tab. | TPL:119 |
| FE-006 | A tag tab appears after clicking a popular tag. | TPL:120 |
| FE-007 | A Your Feed tab appears after login. | TPL:121 |
| FE-008 | Home shows a banner with "conduit" and "A place to share your knowledge.". | TPL:126-130 |
| FE-009 | Sidebar labelled "Popular Tags". | TPL:202 |
| FE-010 | Pagination uses `page-item`/`page-link`, active page marked `active`. | TPL:190-197 |
| FE-011 | Article preview shows author link, date, favorite count button, title, description, "Read more...", tag list. | TPL:146-166 |
| FE-012 | Login at `/login`. | RT:9 |
| FE-013 | Register at `/register`. | RT:9 |
| FE-014 | JWT stored in localStorage. | RT:10 |
| FE-015 | Login page: heading "Sign in", link "Need an account?", email + password inputs, "Sign in" button. | TPL:230-246 |
| FE-016 | Register page: heading "Sign up", link "Have an account?", username/email/password, "Sign up" button. | TPL:262-280 |
| FE-017 | Auth pages show errors in `ul.error-messages`. | TPL:235, 266 |
| FE-018 | Settings at `/settings`. | RT:12 |
| FE-019 | Settings fields: profile picture URL, name, bio, email, new password, "Update Settings". | TPL:402-425 |
| FE-020 | Settings has a logout button "Or click here to logout.". | TPL:429, FEAT:7 |
| FE-021 | Editor at `/editor`. | RT:13 |
| FE-022 | Edit existing at `/editor/article-slug-here`. | RT:13 |
| FE-023 | Editor fields: title, about, body (markdown), tags, "Publish Article". | TPL:450-470 |
| FE-024 | Editor shows tags with remove icon. | TPL:464-465 |
| FE-025 | Editor errors in `ul.error-messages`. | TPL:443 |
| FE-026 | Article page at `/article/article-slug-here`. | RT:14 |
| FE-027 | Delete-article button shown only to the author. | RT:15 |
| FE-028 | Markdown body rendered client side. | RT:16 |
| FE-029 | Comments section at the bottom. | RT:17 |
| FE-030 | Delete-comment button shown only to the comment's author. | RT:18 |
| FE-031 | Article page has Follow, Favorite, Edit, Delete buttons (template conflates; TODO says switching is unfinished). | TPL:481, 495-509 |
| FE-032 | Comment form: textarea "Write a comment..." and "Post Comment". | TPL:559-566 |
| FE-033 | Comment card shows text, author avatar/link, date. | TPL:569-582 |
| FE-034 | Profile at `/profile/:username`. | RT:19 |
| FE-035 | Favourites at `/profile/:username/favorites`. | RT:19 |
| FE-036 | Profile shows basic user info. | RT:20 |
| FE-037 | Profile lists author's articles or favorited articles. | RT:21 |
| FE-038 | Profile has tabs "My Articles" and "Favorited Articles". | TPL:321-324 |
| FE-039 | Profile shows "Follow <name>" or "Edit Profile Settings". | TPL:302-309 |
| FE-040 | Header unauth: Home, Sign in, Sign up. | TPL:35-39, 50-56 |
| FE-041 | Header auth: Home, New Article, Settings, profile link. | TPL:65-70, 80-94 |
| FE-042 | Active page's header link has class `active`. | TPL:41, 72 |
| FE-043 | Footer with "conduit" link and MIT attribution text. | TPL:102-110 |
| FE-044 | Head includes title "Conduit". | TPL:12 |
| FE-045 | Use shared `styles.css` (Conduit Minimal CSS v4). | STY:5 |
| FE-046 | Missing profile image shows default avatar. | STY:11 |
| FE-047 | Conform to SELECTORS.md contract (names, classes, text, routes, debug interface, localStorage key, avatar). | FT:11-19 |
| FE-048 | Include at least one unit test. | FT:5 |
| FE-049 | Do not use hosted API for tests: unauth sees only demo content. | FAPI:31-34 |

## H. Features list (FEAT)

| ID | Requirement | Source |
|---|---|---|
| FT-001 | JWT auth with login/signup pages. | FEAT:7 |
| FT-002 | Users: create, read, update (no delete). | FEAT:8 |
| FT-003 | Articles: full CRUD. | FEAT:9 |
| FT-004 | Comments: create, read, delete (no update). | FEAT:10 |
| FT-005 | Paginated article lists. | FEAT:11 |
| FT-006 | Favorite articles. | FEAT:12 |
| FT-007 | Follow users. | FEAT:13 |

**Count: B 16 + U 31 + P 16 + A 58 + C 19 + F 14 + FE 49 + FT 7 = 210 atomic requirements.**
(Some backend rows are inherently in both EP and OA; counted once.)

## I. Spec silences and conflicts (gaps)

| ID | Gap | Evidence |
|---|---|---|
| X-01 | **Ownership rule undefined in prose**: 403 is defined generically (ERR:23) and OA declares 403 on article PUT/DELETE and comment DELETE (OA:275, 302, 385), but no document says "only the author may". Condition for 403 is not stated. | ERR:23, OA:275/302/385 |
| X-02 | Login failure code conflict: ERR says validation failures are 422; OA says login failure is 401 (OA:34). Which applies to bad credentials is unstated in prose. | ERR:7, OA:34-37 |
| X-03 | Success codes absent in prose (EP never states 200/201/204); only OA gives them. Prose and OA diverge (create returns 201 in OA, "returns" only in EP). | EP, OA:48, 223, 349 |
| X-04 | 409 exists only in OA; prose never mentions conflicts. Email-duplicate vs username-duplicate: OA example shows only username. | OA:50, 227, 781-790 |
| X-05 | Error message wording inconsistent: ERR "can't be empty", OA "can't be blank". | ERR:13, OA:820 |
| X-06 | No validation rules: min/max length, password strength, email format, username charset, whitespace trimming. | EP/OA silent |
| X-07 | Slug generation algorithm and slug-collision behaviour undefined (only "slug updates when title changes", EP:183). | EP:183, OA:227 |
| X-08 | Tag semantics: uniqueness, case, ordering, max count, and what makes a tag "popular" are undefined. | RF:146, TPL:202 |
| X-09 | Filter semantics: case sensitivity, combination of `tag`+`author`+`favorited`, unknown author/tag (empty vs 404). | EP:102-116 |
| X-10 | Pagination: max `limit`, `offset` beyond total, ordering key (createdAt vs updatedAt) and tie-break undefined. Comment ordering undefined. | EP:118-126, 213 |
| X-11 | Invalid/expired/malformed token behaviour (401 vs ignore on optional-auth endpoints); OA declares 401 on optional-auth `GET /profiles`, `GET /articles`, `GET comments`, contradicting "auth optional". JWT claims/expiry undefined. | OA:106, 210, 327 |
| X-12 | Follow/favorite edge cases: follow self, repeat follow, repeat favorite, unfavorite when not favorited (idempotent or error). | EP:84-96, 225-235 |
| X-13 | `PUT /user` no-field/empty-body result code and uniqueness conflicts on email/username update unstated (OA:848 only says one field required). | OA:848 |
| X-14 | Delete cascade: deleting an article's effect on comments/favorites unspecified. User deletion not offered. | FEAT:8-9 |
| X-15 | Response bodies of DELETE article/comment (204 no content in OA; EP silent). | OA:768-770 |
| X-16 | Markdown rendering and sanitization (XSS) rules: "render markdown from server" is ambiguous and says nothing on HTML escaping. | RT:16 |
| X-17 | Frontend behaviours unspecified: redirect after login/logout/publish/delete, guard for protected routes when logged out, 404 page, loading states, date format, error display for non-422 errors, token-expiry handling. | RT, TPL |
| X-18 | "Render markdown from server" - the server returns raw markdown (RF body is plain text); spec does not say who converts. | RT:16, RF:44 |
| X-19 | Article template is explicitly unfinished: "TODO : update to switch between follow/favorite AND edit/delete". | TPL:481 |
| X-20 | Templates still reference external CDN assets (`demo.productionready.io`, ionicons) whereas STY says use shared `styles.css`; conflict on stylesheet source. | TPL:14-25, STY:5 |
| X-21 | `Accepted fields` for `PUT /user` list `username`/`password` but example shows only email/bio/image; password-change semantics undefined. | EP:64-74 |
| X-22 | Date-time format precision (example has millisecond Z) not mandated. | RF:46-47, OA:567 |

---

# Comparison with baseline (written AFTER opening `realworld-requirements-baseline.md`)

## Count
| | Baseline v0.1 | Recount |
|---|---|---|
| Atomic requirements | 73 (self-estimate ~90 if strictly split, baseline §3) | 210 |
| Gaps | 11 (G-01..G-11) | 22 (X-01..X-22) |
| Sources actually cited | EP, ER, RF, CO, RT, TP (header only), FE | all of those + `openapi.yml` (≈105 reqs), STY, FAPI, FT, full TPL |

Difference is +137. Drivers, in order: (1) the baseline lists `openapi.yml` as an allowed source but cites it in no requirement. I extracted every declared response code (200/201/204/401/403/404/409/422) per operation, about 100 rows. (2) Baseline merges auth + outcome into one row (e.g. R-012 "require authentication and return the Profile"); the stated rule splits them. (3) Baseline covers about 4 of the 9 template pages; I extracted all of them. (4) I counted STY, FT and FAPI statements. With strict splitting the baseline's own estimate (~90) is nearer the endpoints-only count; the rest is OA and templates.

## In recount, not in baseline (material)
- All OA status codes: 201 on register/create article/create comment; 204 on deletes; 409 on register and article create; 401/403/404/422 per operation (U-005..U-017, A-035..A-055, C-004..C-018, F-003..F-010).
- `limit` >= 1 and `offset` >= 0 constraints (A-008, A-011, OA:899-909).
- `PUT /user` needs at least one field (U-028, OA:848); `tagList` accepted on article update (A-043).
- Frontend: all page contents (login/register/settings/editor/article/profile/footer/comment form), shared CSS, default avatar, selectors contract, unit-test requirement (FE-008..FE-049).
- Comments `id` integer; `articlesCount` integer; date-time types.

## In baseline, not in recount
- **R-031 "Slugs shall be unique; duplicate titles shall produce distinct slugs" (cited EP L185).** `grep -in 'unique|distinct'` over backend docs and OA finds nothing. EP:185 is the heading "### Delete Article". This violates the baseline's own "stated only" rule. Slug collision is a spec silence (my X-07), not a requirement.
- R-010 and R-037 ("not deletable", "not updatable") are out-of-scope statements, not observable behaviours. I kept them as FT-002/FT-004 descriptive rows, not requirements.
- No other baseline requirement is missing from my list.

## Baseline line citations
Backend citations match up to EP L183. From EP L185 onward the baseline is +2 (Delete Article at L185 vs baseline L191; the actual line for "Authentication required" is 189; comments, favorites and tags are all +2). Frontend routing/templates citations are ±1. G-11 cites `frontend/api.md L205–208` but that file has 34 lines; the passage is at L31-34. Citations need re-pinning; the substance holds.

## Gaps: which I found independently
| Baseline | Verdict | Mine |
|---|---|---|
| G-01 No API ownership rule | **Found, but overstated.** 403 is defined generically (ER:23) AND `openapi.yml` declares 403 on article PUT/DELETE and comment DELETE (OA:275, 302, 385). What is missing is the *condition* for the 403 (author-only), not the 403 itself. "Nothing says another user's DELETE must fail" is too strong; OA strongly implies it. | X-01 |
| G-02 No validation rules | **Found; partly wrong.** "uniqueness" is not unspecified: OA declares 409 with a "has already been taken" example for username (OA:50, 781-790). The `maxLength/pattern` claim is correct (grep: only two `minimum:` hits, OA:901, 909). | X-06, X-04 |
| G-03 Login failure unspecified | **Found, but wrong in a way that matters.** OA:34-35 says 401 on login failure; ER:7 says 422 for validation. The real defect is a *conflict* between sources, not silence. | X-02 |
| G-04 Success codes unspecified | **Wrong as stated.** OA gives 200/201/204 for every operation (e.g. OA:223, 298, 349). Gap exists only in the *prose* docs (EP). | X-03 |
| G-05 Auth optional vs viewer fields on Get Article | Not found as such. I logged the related OA inconsistency that "optional auth" endpoints declare 401 (OA:106, 210, 327) and that invalid-token behaviour is undefined. **I missed the specific G-05 contradiction; I agree it is real** (EP:140 "No authentication required" vs `favorited`/`following` in RF:48/54, and OA GET article carries no `security`). | X-11 (related) |
| G-06 "Popular tags" undefined | Found. | X-08 |
| G-07 TODO in template | Found. | X-19 |
| G-08 Logged-out access to protected routes | Found. | X-17 |
| G-09 Filter combos, `limit` max | Found. | X-09, X-10 |
| G-10 Comment ordering | Found. | X-10 |
| G-11 Hosted demo API deviates | **Not a requirements gap.** It is a deployment note about the hosted API (and I cite it as FE-049). Citation is wrong (see above). | FE-049 |

Independently found: G-01, G-02, G-03, G-06, G-07, G-08, G-09, G-10 (8 of 11), G-04 in the narrow prose-only sense, G-05 only partially.
Found by me, not in the baseline: X-05 (error wording "can't be empty" vs "can't be blank"), X-07 slug generation/collision, X-12 follow/favorite edge cases, X-13 PUT /user conflicts, X-14 cascade on delete, X-15 DELETE response bodies, X-16/X-18 markdown rendering/sanitisation ambiguity, X-20 template CDN assets vs shared styles.css, X-21 password change semantics, X-22 date-time format.

## Which baseline gaps I think are wrong
- **G-04**: wrong. `openapi.yml`, an allowed source, specifies success codes.
- **G-03**: mis-characterised. It is a prose/OA conflict (401 vs 422), not a silence.
- **G-01**: overstated (see above).
- **G-02**: the uniqueness sub-claim is wrong (409 in OA).
- **G-11**: not a requirement gap, and mis-cited.
- **R-031** (requirement, not gap) is unsupported by the sources.

Reliability read-out: a second reader, same rules and same sources, produced a materially different count (73 vs 210) and a different gap set. The method is repeatable for endpoint rows but is sensitive to source scope (OA was ignored by the baseline) and to atomic-split policy. The "freeze section 4 as the ground truth" plan is unsafe until G-01/G-03/G-04 are corrected.
