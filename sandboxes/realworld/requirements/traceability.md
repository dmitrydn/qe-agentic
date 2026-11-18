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
