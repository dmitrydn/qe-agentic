# Run 1c citation report

Specification pin: ebbcdeb8d55b42a3a613c787560498b8ef10003f

## Result

Checked: 284 / Passed: 284 / Failed: 0

Additional Markdown citation occurrences: 1 checked / 1 passed / 0 failed.

Backlog roll-up entries: 120 checked / 120 passed / 0 failed.

## Outcome breakdown (original 284 occurrences)

- BA-ASSUMPTION: 1

- Citation-set context: 2

- Direct keywords: 215

- Open-question existence: 61

- Reviewed exception: 5

## Method and limitations

The denominator retains the 284 original source-sheet citation occurrences (126 Business Rules, 97 Acceptance Criteria, 61 Open Questions). Evidence and BA-ASSUMPTION labels are read from current canonical Markdown item blocks, not only from the unchanged XLSX. Added Markdown citations are checked and reported separately; none are silently discarded. Original citations must remain present. Sources are limited to the explicit eight-file allowlist; every inclusive 1-based range must exist at the verified pin, even for an exception, assumption or contextual citation.

Open questions are checked for existence only, because their citations can point to specification silence. Exact ID/citation pairs in tools/citation-exceptions.md count as passed but appear separately below, including the AI reviewer and pending human confirmation. BA-ASSUMPTION items are range-checked and reported as assumptions, not as proved behaviour. Ordinary wording uses the unchanged token screen (case folding, camelCase splitting, trailing-s singularisation, fixed stop words). Each range's direct match is attempted first. When a range is contextual markup with no wording overlap, another range in the same item's current citation set can provide the keywords; the report explicitly identifies that companion instead of claiming a match in the markup. In this run this applies to BR-18.2 and AC-18.1, supported by routing.md L18 while retaining templates.md L599-600. BR-18.2 already included routing.md L18; only AC-18.1 adds a new citation occurrence.

These are lexical/structural checks, not semantic proof or BA approval. In particular, the five supplied AI paraphrases remain pending Dmitry's confirmation. The compact layout omits duplicated IDs and story-level roll-ups. IDs are parsed from headings/list labels; Given/When/Then wording is reconstructed from the verbatim Gherkin for the unchanged keyword screen. Backlog roll-ups are read from the unchanged workbook and checked only for membership in that story's current Markdown rule citations; they do not increase the primary denominator.

## Reviewed exceptions

- BR-01.2 — endpoints.md L46: "No authentication required" = registration needs no sign-in — Claude (AI), 2026-11-18, pending Dmitry's confirmation

- BR-02.2 — endpoints.md L26: "No authentication required" = sign-in needs no existing session — Claude (AI), 2026-11-18, pending Dmitry's confirmation

- BR-05.4 — features.md L8: "no deleting required" = accounts cannot be deleted — Claude (AI), 2026-11-18, pending Dmitry's confirmation

- BR-15.1 — templates.md L191-196: pagination markup = lists are paginated — Claude (AI), 2026-11-18, pending Dmitry's confirmation

- BR-20.3 — templates.md L503: "Favorite Post (29)" = heart with count on the article page — Claude (AI), 2026-11-18, pending Dmitry's confirmation

## Every unexplained failure

None.

## Per-sheet totals (original occurrences)

- Business Rules: 126 checked / 126 passed / 0 failed

- Acceptance Criteria: 97 checked / 97 passed / 0 failed

- Open Questions: 61 checked / 61 passed / 0 failed

## Citation audit (all 284 original occurrences)

### 1. BR-01.1 — endpoints.md L48

PASS — Direct keywords: email, password, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L48-L48

````text
Required fields: `email`, `username`, `password`
````

### 2. BR-01.2 — endpoints.md L46

PASS — Reviewed exception: "No authentication required" = registration needs no sign-in — Claude (AI), 2026-11-18, pending Dmitry's confirmation

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L46-L46

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 3. BR-01.3 — endpoints.md L46

PASS — Direct keywords: user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L46-L46

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 4. BR-01.3 — api-response-format.md L11-20

PASS — Direct keywords: bio, email, image, token, user, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L11-L20

````text
```json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": null,
    "image": null
  }
}
````

### 5. BR-01.3 — openapi.yml L44-60

PASS — Direct keywords: 201, new, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L44-L60

````text
      operationId: CreateUser
      requestBody:
        $ref: '#/components/requestBodies/NewUserRequest'
      responses:
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /user:
    get:
      tags:
        - User and Authentication
      summary: Get current user
      description: Gets the currently logged-in user
````

### 6. BR-01.4 — openapi.yml L44-60

PASS — Direct keywords: 409

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L44-L60

````text
      operationId: CreateUser
      requestBody:
        $ref: '#/components/requestBodies/NewUserRequest'
      responses:
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /user:
    get:
      tags:
        - User and Authentication
      summary: Get current user
      description: Gets the currently logged-in user
````

### 7. BR-01.4 — openapi.yml L781-790

PASS — Direct keywords: already, taken, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L781-L790

````text
    ConflictError:
      description: Conflict - resource already exists
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GenericErrorModel'
          example:
            errors:
              username:
                - "has already been taken"
````

### 8. BR-01.5 — error-handling.md L7-17

PASS — Direct keywords: 422, error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L17

````text
If a request fails any validations, expect a 422 and errors in the following format:

```json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
````

### 9. BR-01.6 — routing.md L9

PASS — Direct keywords: register, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L9

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
````

### 10. BR-01.6 — templates.md L262-281

PASS — Direct keywords: button, email, error, form, password, sign, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L262-L281

````text
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <a href="/login">Have an account?</a>
        </p>

        <ul class="error-messages">
          <li>That email is already taken</li>
        </ul>

        <form>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Username" />
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email" />
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password" />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">Sign up</button>
````

### 11. BR-01.6 — templates.md L267

PASS — Direct keywords: error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L267-L267

````text
        <ul class="error-messages">
````

### 12. BR-01.7 — routing.md L10

PASS — Direct keywords: local, storage, store, token

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 13. BR-02.1 — endpoints.md L28

PASS — Direct keywords: email, password

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L28-L28

````text
Required fields: `email`, `password`
````

### 14. BR-02.2 — endpoints.md L26

PASS — Reviewed exception: "No authentication required" = sign-in needs no existing session — Claude (AI), 2026-11-18, pending Dmitry's confirmation

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L26-L26

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 15. BR-02.3 — endpoints.md L26

PASS — Direct keywords: authentication, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L26-L26

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 16. BR-02.3 — openapi.yml L28-42

PASS — Direct keywords: 200, authentication, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L42

````text
      operationId: Login
      requestBody:
        $ref: '#/components/requestBodies/LoginUserRequest'
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /users:
    post:
      tags:
        - User and Authentication
````

### 17. BR-02.4 — openapi.yml L28-42

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L42

````text
      operationId: Login
      requestBody:
        $ref: '#/components/requestBodies/LoginUserRequest'
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /users:
    post:
      tags:
        - User and Authentication
````

### 18. BR-02.5 — routing.md L9

PASS — Direct keywords: login, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L9

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
````

### 19. BR-02.5 — templates.md L231-247

PASS — Direct keywords: button, email, error, form, password, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L231-L247

````text
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
          <a href="/register">Need an account?</a>
        </p>

        <ul class="error-messages">
          <li>That email is already taken</li>
        </ul>

        <form>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email" />
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password" />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">Sign in</button>
````

### 20. BR-02.5 — templates.md L236

PASS — Direct keywords: error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L236-L236

````text
        <ul class="error-messages">
````

### 21. BR-02.6 — routing.md L10

PASS — Direct keywords: local, storage, store, token

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 22. BR-03.1 — endpoints.md L5-9

PASS — Direct keywords: authorization, header, jwt, token

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L5-L9

````text
### Authentication Header:

You can read the authentication header from the headers of the request

`Authorization: Token jwt.token.here`
````

### 23. BR-03.2 — endpoints.md L50-54

PASS — Direct keywords: authentication, current, get, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L50-L54

````text
### Get Current User

`GET /api/user`

Authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication) that's the current user
````

### 24. BR-03.3 — error-handling.md L21

PASS — Direct keywords: 401, authentication, but

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 25. BR-03.3 — openapi.yml L771-780

PASS — Direct keywords: token

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L771-L780

````text
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GenericErrorModel'
          example:
            errors:
              token:
                - "is missing"
````

### 26. BR-03.4 — routing.md L10

PASS — Direct keywords: local, storage, token

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 27. BR-04.1 — features.md L7

PASS — Direct keywords: button, logout, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L7-L7

````text
- Authenticate users via JWT (login/signup pages + logout button on settings page)
````

### 28. BR-04.1 — templates.md L430

PASS — Direct keywords: button, click, here, logout

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L430-L430

````text
        <button class="btn btn-outline-danger">Or click here to logout.</button>
````

### 29. BR-04.2 — templates.md L36-40

PASS — Direct keywords: header, home, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 30. BR-05.1 — routing.md L12

PASS — Direct keywords: setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L12-L12

````text
- Settings page (URL: `/settings` )
````

### 31. BR-05.2 — templates.md L404-426

PASS — Direct keywords: bio, button, email, form, name, new, password, picture, placeholder, profile, setting, update, url

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L404-L426

````text
              <input class="form-control" type="text" placeholder="URL of profile picture" />
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Email" />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="New Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
````

### 32. BR-05.3 — endpoints.md L56-74

PASS — Direct keywords: authentication, bio, email, image, password, put, user, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L56-L74

````text
### Update User

`PUT /api/user`

Example request body:

```json
{
  "user":{
    "email": "jake@jake.jake",
    "bio": "I like to skateboard",
    "image": "https://i.stack.imgur.com/xHWG8.jpg"
  }
}
```

Authentication required, returns the [User](/specifications/backend/api-response-format#users-for-authentication)

Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 33. BR-05.4 — features.md L8

PASS — Reviewed exception: "no deleting required" = accounts cannot be deleted — Claude (AI), 2026-11-18, pending Dmitry's confirmation

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L8-L8

````text
- CRU- users (sign up & settings page - no deleting required)
````

### 34. BR-06.1 — routing.md L19-20

PASS — Direct keywords: basic, info, profile, show, user, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L20

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
````

### 35. BR-06.1 — templates.md L289-309

PASS — Direct keywords: info, profile, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L289-L309

````text
### Profile

```html
<div class="profile-page">
  <div class="user-info">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <img src="http://i.imgur.com/Qr71crq.jpg" class="user-img" />
          <h4>Eric Simons</h4>
          <p>
            Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from
            the Hunger Games
          </p>
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-plus-round"></i>
            &nbsp; Follow Eric Simons
          </button>
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-gear-a"></i>
            &nbsp; Edit Profile Settings
````

### 36. BR-06.2 — endpoints.md L76-80

PASS — Direct keywords: authentication, get, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L76-L80

````text
### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a [Profile](/specifications/backend/api-response-format#profile)
````

### 37. BR-06.2 — api-response-format.md L25-33

PASS — Direct keywords: bio, following, image, profile, username, work

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L25-L33

````text
```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://api.realworld.io/images/smiley-cyrus.jpg",
    "following": false
  }
}
````

### 38. BR-06.3 — openapi.yml L95-117

PASS — Direct keywords: 404, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L95-L117

````text
      operationId: GetProfileByUsername
      parameters:
        - name: username
          in: path
          description: Username of the profile to get
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/ProfileResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
  /profiles/{username}/follow:
    post:
      tags:
        - Profile
      summary: Follow a user
      description: Follow a user by username
````

### 39. BR-06.4 — templates.md L305

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 40. BR-06.4 — templates.md L309

PASS — Direct keywords: edit, profile, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L309-L309

````text
            &nbsp; Edit Profile Settings
````

### 41. BR-07.1 — routing.md L19-21

PASS — Direct keywords: article, favorite, favorited, list, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L21

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles
````

### 42. BR-07.1 — templates.md L322-325

PASS — Direct keywords: article, favorited

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L322-L325

````text
              <a class="nav-link active" href="">My Articles</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">Favorited Articles</a>
````

### 43. BR-07.2 — endpoints.md L110-116

PASS — Direct keywords: author, favorited, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L110-L116

````text
Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`
````

### 44. BR-08.1 — routing.md L13

PASS — Direct keywords: article, editor

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L13-L13

````text
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 45. BR-08.2 — templates.md L451-470

PASS — Direct keywords: about, article, button, enter, markdown, publish, tag, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L451-L470

````text
              <input type="text" class="form-control form-control-lg" placeholder="Article Title" />
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="What's this article about?" />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control"
                rows="8"
                placeholder="Write your article (in markdown)"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="Enter tags" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> tag </span>
              </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button">
              Publish Article
````

### 46. BR-08.3 — endpoints.md L159

PASS — Direct keywords: authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L159-L159

````text
Authentication required, will return an [Article](/specifications/backend/api-response-format#single-article)
````

### 47. BR-08.4 — endpoints.md L161-163

PASS — Direct keywords: body, description, optional, tag, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L163

````text
Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings
````

### 48. BR-08.5 — api-response-format.md L38-57

PASS — Direct keywords: article, author, body, count, created, description, favorite, favorited, list, slug, tag, title, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L38-L57

````text
```json
{
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
````

### 49. BR-08.5 — openapi.yml L219-239

PASS — Direct keywords: 201, article, body, description, slug, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L219-L239

````text
      operationId: CreateArticle
      requestBody:
        $ref: '#/components/requestBodies/NewArticleRequest'
      responses:
        '201':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: article
  /articles/{slug}:
    get:
      tags:
        - Articles
      summary: Get an article
      description: Get an article. Auth not required
````

### 50. BR-08.6 — endpoints.md L185

PASS — Direct keywords: article, slug, title, unique

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L185-L185

````text
> The `slug` is the article's URL identifier. The spec only requires it to be a unique string that you can use to fetch, update, and delete the article — duplicate titles must still produce distinct slugs. How you derive it is up to your implementation (commonly a kebab-cased title); no particular format is enforced by the test suite.
````

### 51. BR-09.1 — routing.md L13

PASS — Direct keywords: article, editor, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L13-L13

````text
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 52. BR-09.2 — endpoints.md L179-181

PASS — Direct keywords: article, authentication, body, description, title, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L179-L181

````text
Authentication required, returns the updated [Article](/specifications/backend/api-response-format#single-article)

Optional fields: `title`, `description`, `body`
````

### 53. BR-09.3 — endpoints.md L183

PASS — Direct keywords: slug, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L183

````text
The `slug` also gets updated when the `title` is changed
````

### 54. BR-09.4 — openapi.yml L260-288

PASS — Direct keywords: 403, 404, article, error, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L260-L288

````text
      operationId: UpdateArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to update
          required: true
          schema:
            type: string
      requestBody:
        $ref: '#/components/requestBodies/UpdateArticleRequest'
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: article
    delete:
      tags:
        - Articles
      summary: Delete an article
      description: Delete an article. Auth is required
````

### 55. BR-09.4 — openapi.yml L791-792

PASS — Direct keywords: article, error, key

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 56. BR-10.1 — endpoints.md L187-191

PASS — Direct keywords: authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L187-L191

````text
### Delete Article

`DELETE /api/articles/:slug`

Authentication required
````

### 57. BR-10.1 — openapi.yml L289-315

PASS — Direct keywords: 204

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L289-L315

````text
      operationId: DeleteArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to delete
          required: true
          schema:
            type: string
      responses:
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
  /articles/{slug}/comments:
    get:
      tags:
        - Comments
      summary: Get comments for an article
      description: Get the comments for an article. Auth is optional
````

### 58. BR-10.2 — routing.md L15

PASS — Direct keywords: article, author, button, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 59. BR-10.2 — templates.md L509

PASS — Direct keywords: article, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L509-L509

````text
          <i class="ion-trash-a"></i> Delete Article
````

### 60. BR-10.3 — openapi.yml L289-315

PASS — Direct keywords: 403, 404, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L289-L315

````text
      operationId: DeleteArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to delete
          required: true
          schema:
            type: string
      responses:
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
  /articles/{slug}/comments:
    get:
      tags:
        - Comments
      summary: Get comments for an article
      description: Get the comments for an article. Auth is optional
````

### 61. BR-11.1 — routing.md L14

PASS — Direct keywords: article, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L14-L14

````text
- Article page (URL: `/article/article-slug-here` )
````

### 62. BR-11.2 — endpoints.md L136-140

PASS — Direct keywords: article, authentication, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L136-L140

````text
### Get Article

`GET /api/articles/:slug`

No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 63. BR-11.2 — api-response-format.md L38-57

PASS — Direct keywords: article, body, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L38-L57

````text
```json
{
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
````

### 64. BR-11.3 — routing.md L16

PASS — Direct keywords: markdown

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L16-L16

````text
  - Render markdown from server client side
````

### 65. BR-11.4 — routing.md L17

PASS — Direct keywords: bottom, comment, section

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L17-L17

````text
  - Comments section at bottom of page
````

### 66. BR-11.5 — openapi.yml L240-259

PASS — Direct keywords: 404, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L240-L259

````text
      operationId: GetArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to get
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    put:
      tags:
        - Articles
      summary: Update an article
      description: Update an article. Auth is required
````

### 67. BR-12.1 — routing.md L5-7

PASS — Direct keywords: feed, global, home

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L5-L7

````text
- Home page (URL: `/` )
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
````

### 68. BR-12.1 — templates.md L118-120

PASS — Direct keywords: default, feed, global, home, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L118-L120

````text
The Home page includes up to three tabs:

- a default **Global Feed** tab
````

### 69. BR-12.2 — endpoints.md L102

PASS — Direct keywords: article, author, most, recent

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L102

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results
````

### 70. BR-12.2 — endpoints.md L126

PASS — Direct keywords: article, authentication, first, most, recent

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 71. BR-12.3 — api-response-format.md L62-67

PASS — Direct keywords: article, body, list

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L62-L67

````text
:::caution
Starting from the 2024/08/16, the endpoints retrieving a list of articles do no longer return the body of an article for performance reasons.
It affects:
- `GET /api/articles`
- `GET /api/articles/feed`
:::
````

### 72. BR-12.3 — api-response-format.md L102

PASS — Direct keywords: article, count

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 73. BR-12.4 — templates.md L145-185

PASS — Direct keywords: author, date, description, more, preview, read, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L145-L185

````text
        </div>

        <div class="article-preview">
          <div class="article-meta">
            <a href="/profile/eric-simons"><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
            <div class="info">
              <a href="/profile/eric-simons" class="author">Eric Simons</a>
              <span class="date">January 20th</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right">
              <i class="ion-heart"></i> 29
            </button>
          </div>
          <a href="/article/how-to-build-webapps-that-scale" class="preview-link">
            <h1>How to build webapps that scale</h1>
            <p>This is the description for the post.</p>
            <span>Read more...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline">realworld</li>
              <li class="tag-default tag-pill tag-outline">implementations</li>
            </ul>
          </a>
        </div>

        <div class="article-preview">
          <div class="article-meta">
            <a href="/profile/albert-pai"><img src="http://i.imgur.com/N4VcUeJ.jpg" /></a>
            <div class="info">
              <a href="/profile/albert-pai" class="author">Albert Pai</a>
              <span class="date">January 20th</span>
            </div>
            <button class="btn btn-outline-primary btn-sm pull-xs-right">
              <i class="ion-heart"></i> 32
            </button>
          </div>
          <a href="/article/the-song-you" class="preview-link">
            <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
            <p>This is the description for the post.</p>
            <span>Read more...</span>
            <ul class="tag-list">
              <li class="tag-default tag-pill tag-outline">realworld</li>
````

### 74. BR-13.1 — templates.md L122

PASS — Direct keywords: after, appear, feed, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 75. BR-13.2 — endpoints.md L134

PASS — Direct keywords: article, authentication, first, followed

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 76. BR-13.3 — endpoints.md L132

PASS — Direct keywords: like, limit, list, offset

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L132-L132

````text
Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)
````

### 77. BR-14.1 — routing.md L6

PASS — Direct keywords: list, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L6-L6

````text
  - List of tags
````

### 78. BR-14.1 — templates.md L203

PASS — Direct keywords: popular, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L203-L203

````text
          <p>Popular Tags</p>
````

### 79. BR-14.2 — templates.md L121

PASS — Direct keywords: after, clicking, tab, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L121-L121

````text
- an optional **tag name** tab, appears after clicking one of the popular tags
````

### 80. BR-14.2 — endpoints.md L106-108

PASS — Direct keywords: tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L106-L108

````text
Filter by tag:

`?tag=AngularJS`
````

### 81. BR-14.3 — endpoints.md L239-243

PASS — Direct keywords: authentication, get, list, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L239-L243

````text
### Get Tags

`GET /api/tags`

No authentication required, returns a [List of Tags](/specifications/backend/api-response-format#list-of-tags)
````

### 82. BR-14.3 — api-response-format.md L146-152

PASS — Direct keywords: tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L146-L152

````text
```json
{
  "tags": [
    "reactjs",
    "angularjs"
  ]
}
````

### 83. BR-15.1 — routing.md L8

PASS — Direct keywords: article, list

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L8-L8

````text
  - Pagination for list of articles
````

### 84. BR-15.1 — templates.md L191-196

PASS — Reviewed exception: pagination markup = lists are paginated — Claude (AI), 2026-11-18, pending Dmitry's confirmation

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L191-L196

````text
        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
````

### 85. BR-15.2 — endpoints.md L118-124

PASS — Direct keywords: 0, 20, article, default, limit, offset

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L124

````text
Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`
````

### 86. BR-15.2 — openapi.yml L895-911

PASS — Direct keywords: 0, 1, 20, default, limit, offset, starting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L895-L911

````text
    offsetParam:
      in: query
      name: offset
      required: false
      schema:
        type: integer
        minimum: 0
      description: The number of items to skip before starting to collect the result set.
    limitParam:
      in: query
      name: limit
      required: false
      schema:
        type: integer
        minimum: 1
        default: 20
      description: The numbers of items to return.
````

### 87. BR-15.3 — endpoints.md L132

PASS — Direct keywords: parameter

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L132-L132

````text
Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)
````

### 88. BR-15.4 — api-response-format.md L102

PASS — Direct keywords: article, count

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 89. BR-16.1 — templates.md L562-566

PASS — Direct keywords: comment, form, post, write

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L562-L566

````text
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
````

### 90. BR-16.1 — routing.md L17

PASS — Direct keywords: bottom, comment, section

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L17-L17

````text
  - Comments section at bottom of page
````

### 91. BR-16.2 — endpoints.md L207-209

PASS — Direct keywords: authentication, body, comment, created

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L207-L209

````text
Authentication required, returns the created [Comment](/specifications/backend/api-response-format#single-comment)

Required field: `body`
````

### 92. BR-16.2 — api-response-format.md L108-122

PASS — Direct keywords: author, body, comment, created, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L108-L122

````text
```json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
````

### 93. BR-16.2 — openapi.yml L338-365

PASS — Direct keywords: 201, body, comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L338-L365

````text
      operationId: CreateArticleComment
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to create a comment for
          required: true
          schema:
            type: string
      requestBody:
        $ref: '#/components/requestBodies/NewCommentRequest'
      responses:
        '201':
          $ref: '#/components/responses/SingleCommentResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: comment
  /articles/{slug}/comments/{id}:
    delete:
      tags:
        - Comments
      summary: Delete a comment for an article
      description: Delete a comment for an article. Auth is required
````

### 94. BR-16.3 — features.md L10

PASS — Direct keywords: comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L10-L10

````text
- CR-D Comments on articles (no updating required)
````

### 95. BR-17.1 — endpoints.md L211-215

PASS — Direct keywords: article, authentication, comment, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L211-L215

````text
### Get Comments from an Article

`GET /api/articles/:slug/comments`

Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 96. BR-17.1 — api-response-format.md L127-141

PASS — Direct keywords: comment, work

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L127-L141

````text
```json
{
  "comments": [{
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }]
}
````

### 97. BR-17.2 — templates.md L577-582

PASS — Direct keywords: author, comment, date

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L577-L582

````text
            <a href="/profile/author" class="comment-author">
              <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            </a>
            &nbsp;
            <a href="/profile/jacob-schmidt" class="comment-author">Jacob Schmidt</a>
            <span class="date-posted">Dec 29th</span>
````

### 98. BR-17.3 — features.md L10

PASS — Direct keywords: comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L10-L10

````text
- CR-D Comments on articles (no updating required)
````

### 99. BR-18.1 — endpoints.md L217-221

PASS — Direct keywords: authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L217-L221

````text
### Delete Comment

`DELETE /api/articles/:slug/comments/:id`

Authentication required
````

### 100. BR-18.1 — openapi.yml L366-398

PASS — Direct keywords: 204

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L366-L398

````text
      operationId: DeleteArticleComment
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to delete a comment for
          required: true
          schema:
            type: string
        - name: id
          in: path
          description: ID of the comment you want to delete
          required: true
          schema:
            type: integer
      responses:
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
  /articles/{slug}/favorite:
    post:
      tags:
        - Favorites
      summary: Favorite an article
      description: Favorite an article. Auth is required
````

### 101. BR-18.2 — routing.md L18

PASS — Direct keywords: author, comment, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 102. BR-18.2 — templates.md L599-600

PASS — Citation-set context: This range exists but has no direct wording keyword. Supporting citation in the same item: routing.md L18 (author, comment, delete)

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L599-L600

````text
            <span class="mod-options">
              <i class="ion-trash-a"></i>
````

### 103. BR-18.3 — openapi.yml L366-398

PASS — Direct keywords: 403, comment, error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L366-L398

````text
      operationId: DeleteArticleComment
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to delete a comment for
          required: true
          schema:
            type: string
        - name: id
          in: path
          description: ID of the comment you want to delete
          required: true
          schema:
            type: integer
      responses:
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
  /articles/{slug}/favorite:
    post:
      tags:
        - Favorites
      summary: Favorite an article
      description: Favorite an article. Auth is required
````

### 104. BR-18.3 — openapi.yml L791-792

PASS — Direct keywords: comment, error, key

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 105. BR-19.1 — endpoints.md L82-96

PASS — Direct keywords: authentication, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L82-L96

````text
### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required

### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 106. BR-19.2 — api-response-format.md L25-33

PASS — Direct keywords: following, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L25-L33

````text
```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://api.realworld.io/images/smiley-cyrus.jpg",
    "following": false
  }
}
````

### 107. BR-19.3 — templates.md L305

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 108. BR-19.3 — templates.md L498

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L498-L498

````text
          &nbsp; Follow Eric Simons <span class="counter">(10)</span>
````

### 109. BR-19.4 — openapi.yml L118-141

PASS — Direct keywords: 404, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L118-L141

````text
      operationId: FollowUserByUsername
      parameters:
        - name: username
          in: path
          description: Username of the profile you want to follow
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/ProfileResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
    delete:
      tags:
        - Profile
      summary: Unfollow a user
      description: Unfollow a user by username
````

### 110. BR-19.5 — endpoints.md L134

PASS — Direct keywords: article, followed

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 111. BR-20.1 — endpoints.md L223-237

PASS — Direct keywords: article, authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L223-L237

````text
### Favorite Article

`POST /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required

### Unfavorite Article

`DELETE /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 112. BR-20.2 — api-response-format.md L48-49

PASS — Direct keywords: count, favorite, favorited

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 113. BR-20.3 — templates.md L155

PASS — Direct keywords: heart

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L155-L155

````text
              <i class="ion-heart"></i> 29
````

### 114. BR-20.3 — templates.md L503

PASS — Reviewed exception: "Favorite Post (29)" = heart with count on the article page — Claude (AI), 2026-11-18, pending Dmitry's confirmation

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L503-L503

````text
          &nbsp; Favorite Post <span class="counter">(29)</span>
````

### 115. BR-20.4 — routing.md L19-21

PASS — Direct keywords: article, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L21

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles
````

### 116. BR-21.1 — templates.md L36-40

PASS — Direct keywords: header, home, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 117. BR-21.2 — templates.md L66-71

PASS — Direct keywords: article, header, home, link, new, profile, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L66-L71

````text
If a user is logged in, then the header should include links to:

- the home page
- the new article page
- the settings page
- the profile page
````

### 118. BR-21.3 — templates.md L42

PASS — Direct keywords: active, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L42-L42

````text
> the link of the active page should use the **active** css class.
````

### 119. BR-21.3 — templates.md L73

PASS — Direct keywords: active, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L73-L73

````text
> the link of the active page should use the **active** css class.
````

### 120. BR-22.1 — error-handling.md L7-17

PASS — Direct keywords: 422, error, validation

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L17

````text
If a request fails any validations, expect a 422 and errors in the following format:

```json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
````

### 121. BR-22.2 — error-handling.md L21

PASS — Direct keywords: 401, authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 122. BR-22.3 — error-handling.md L23

PASS — Direct keywords: 403, user, valid

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 123. BR-22.4 — error-handling.md L25

PASS — Direct keywords: 404

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 124. BR-22.5 — openapi.yml L791-810

PASS — Direct keywords: article, comment, error, key, profile, resource, type

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L810

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GenericErrorModel'
          example:
            errors:
              resource:
                - "forbidden"
    NotFound:
      description: Not Found. The error key identifies the resource type (article, profile, comment, etc.)
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GenericErrorModel'
          example:
            errors:
              resource:
                - "not found"
````

### 125. BR-22.6 — api-response-format.md L7

PASS — Direct keywords: 8, application, charset, content, json, type, utf

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L7-L7

````text
Make sure the right content type like `Content-Type: application/json; charset=utf-8` is correctly returned.
````

### 126. BR-23.1 — cors.md L7

PASS — Direct keywords: acces, allow, backend, content, control, correct, different, frontend, header, host, option, origin, port, run, type

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 127. AC-01.1 — routing.md L9-10

PASS — Direct keywords: register, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L10

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
  - Uses JWT (store the token in localStorage)
````

### 128. AC-01.1 — templates.md L262-281

PASS — Direct keywords: account, email, password, sign, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L262-L281

````text
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <a href="/login">Have an account?</a>
        </p>

        <ul class="error-messages">
          <li>That email is already taken</li>
        </ul>

        <form>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Username" />
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email" />
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password" />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">Sign up</button>
````

### 129. AC-01.2 — openapi.yml L44-60

PASS — Direct keywords: 201, new, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L44-L60

````text
      operationId: CreateUser
      requestBody:
        $ref: '#/components/requestBodies/NewUserRequest'
      responses:
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /user:
    get:
      tags:
        - User and Authentication
      summary: Get current user
      description: Gets the currently logged-in user
````

### 130. AC-01.2 — api-response-format.md L11-20

PASS — Direct keywords: bio, email, image, jake, token, user, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L11-L20

````text
```json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": null,
    "image": null
  }
}
````

### 131. AC-01.3 — openapi.yml L781-790

PASS — Direct keywords: already, error, exist, taken, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L781-L790

````text
    ConflictError:
      description: Conflict - resource already exists
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GenericErrorModel'
          example:
            errors:
              username:
                - "has already been taken"
````

### 132. AC-01.4 — endpoints.md L48

PASS — Direct keywords: field

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L48-L48

````text
Required fields: `email`, `username`, `password`
````

### 133. AC-01.4 — error-handling.md L7-17

PASS — Direct keywords: 422, body, error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L17

````text
If a request fails any validations, expect a 422 and errors in the following format:

```json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
````

### 134. AC-02.1 — templates.md L231-247

PASS — Direct keywords: account, email, password, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L231-L247

````text
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
          <a href="/register">Need an account?</a>
        </p>

        <ul class="error-messages">
          <li>That email is already taken</li>
        </ul>

        <form>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email" />
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password" />
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right">Sign in</button>
````

### 135. AC-02.1 — templates.md L66-71

PASS — Direct keywords: header

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L66-L71

````text
If a user is logged in, then the header should include links to:

- the home page
- the new article page
- the settings page
- the profile page
````

### 136. AC-02.2 — openapi.yml L28-42

PASS — Direct keywords: 200, login, post, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L42

````text
      operationId: Login
      requestBody:
        $ref: '#/components/requestBodies/LoginUserRequest'
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /users:
    post:
      tags:
        - User and Authentication
````

### 137. AC-02.2 — api-response-format.md L11-20

PASS — Direct keywords: email, jake, token, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L11-L20

````text
```json
{
  "user": {
    "email": "jake@jake.jake",
    "token": "jwt.token.here",
    "username": "jake",
    "bio": null,
    "image": null
  }
}
````

### 138. AC-02.3 — openapi.yml L28-42

PASS — Direct keywords: 401, login, post, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L42

````text
      operationId: Login
      requestBody:
        $ref: '#/components/requestBodies/LoginUserRequest'
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /users:
    post:
      tags:
        - User and Authentication
````

### 139. AC-02.4 — endpoints.md L28

PASS — Direct keywords: field

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L28-L28

````text
Required fields: `email`, `password`
````

### 140. AC-02.4 — error-handling.md L7

PASS — Direct keywords: 422

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 141. AC-03.1 — routing.md L10

PASS — BA-ASSUMPTION: persistence across reload is implied by storing the token in localStorage, not stated; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 142. AC-03.2 — endpoints.md L50-54

PASS — Direct keywords: current, get, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L50-L54

````text
### Get Current User

`GET /api/user`

Authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication) that's the current user
````

### 143. AC-03.3 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 144. AC-04.1 — templates.md L430

PASS — Direct keywords: click, here, logout

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L430-L430

````text
        <button class="btn btn-outline-danger">Or click here to logout.</button>
````

### 145. AC-04.1 — templates.md L36-40

PASS — Direct keywords: header, home

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 146. AC-05.1 — templates.md L404-426

PASS — Direct keywords: bio, new, profile, setting, update

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L404-L426

````text
              <input class="form-control" type="text" placeholder="URL of profile picture" />
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control form-control-lg"
                rows="8"
                placeholder="Short bio about you"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Email" />
            </fieldset>
            <fieldset class="form-group">
              <input
                class="form-control form-control-lg"
                type="password"
                placeholder="New Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
````

### 147. AC-05.1 — routing.md L20

PASS — Direct keywords: show

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L20-L20

````text
  - Show basic user info
````

### 148. AC-05.2 — endpoints.md L56-74

PASS — Direct keywords: bio, put, update, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L56-L74

````text
### Update User

`PUT /api/user`

Example request body:

```json
{
  "user":{
    "email": "jake@jake.jake",
    "bio": "I like to skateboard",
    "image": "https://i.stack.imgur.com/xHWG8.jpg"
  }
}
```

Authentication required, returns the [User](/specifications/backend/api-response-format#users-for-authentication)

Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 149. AC-05.3 — endpoints.md L72

PASS — Direct keywords: user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L72-L72

````text
Authentication required, returns the [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 150. AC-05.3 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 151. AC-06.1 — routing.md L19-20

PASS — Direct keywords: profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L20

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
````

### 152. AC-06.2 — endpoints.md L76-80

PASS — Direct keywords: get, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L76-L80

````text
### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a [Profile](/specifications/backend/api-response-format#profile)
````

### 153. AC-06.2 — api-response-format.md L25-33

PASS — Direct keywords: bio, following, image, jake, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L25-L33

````text
```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://api.realworld.io/images/smiley-cyrus.jpg",
    "following": false
  }
}
````

### 154. AC-06.3 — openapi.yml L95-117

PASS — Direct keywords: 404, get, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L95-L117

````text
      operationId: GetProfileByUsername
      parameters:
        - name: username
          in: path
          description: Username of the profile to get
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/ProfileResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
  /profiles/{username}/follow:
    post:
      tags:
        - Profile
      summary: Follow a user
      description: Follow a user by username
````

### 155. AC-07.1 — routing.md L21

PASS — Direct keywords: article, list

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L21-L21

````text
  - List of articles populated from author's created articles or author's favorited articles
````

### 156. AC-07.2 — routing.md L19-21

PASS — Direct keywords: article, favorite, favorited, list, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L21

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles
````

### 157. AC-07.3 — endpoints.md L110-112

PASS — Direct keywords: author, filter, jake

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L110-L112

````text
Filter by author:

`?author=jake`
````

### 158. AC-07.4 — endpoints.md L114-116

PASS — Direct keywords: favorited, jake

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L114-L116

````text
Favorited by user:

`?favorited=jake`
````

### 159. AC-08.1 — templates.md L451-470

PASS — Direct keywords: article, enter, publish, tag, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L451-L470

````text
              <input type="text" class="form-control form-control-lg" placeholder="Article Title" />
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="What's this article about?" />
            </fieldset>
            <fieldset class="form-group">
              <textarea
                class="form-control"
                rows="8"
                placeholder="Write your article (in markdown)"
              ></textarea>
            </fieldset>
            <fieldset class="form-group">
              <input type="text" class="form-control" placeholder="Enter tags" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> tag </span>
              </div>
            </fieldset>
            <button class="btn btn-lg pull-xs-right btn-primary" type="button">
              Publish Article
````

### 160. AC-08.1 — routing.md L14

PASS — Direct keywords: article, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L14-L14

````text
- Article page (URL: `/article/article-slug-here` )
````

### 161. AC-08.2 — openapi.yml L219-239

PASS — Direct keywords: 201, article, body, create, description, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L219-L239

````text
      operationId: CreateArticle
      requestBody:
        $ref: '#/components/requestBodies/NewArticleRequest'
      responses:
        '201':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: article
  /articles/{slug}:
    get:
      tags:
        - Articles
      summary: Get an article
      description: Get an article. Auth not required
````

### 162. AC-08.2 — api-response-format.md L38-57

PASS — Direct keywords: article, author, body, description, list, tag, title, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L38-L57

````text
```json
{
  "article": {
    "slug": "how-to-train-your-dragon",
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "It takes a Jacobian",
    "tagList": ["dragons", "training"],
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
````

### 163. AC-08.3 — endpoints.md L185

PASS — Direct keywords: article, slug, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L185-L185

````text
> The `slug` is the article's URL identifier. The spec only requires it to be a unique string that you can use to fetch, update, and delete the article — duplicate titles must still produce distinct slugs. How you derive it is up to your implementation (commonly a kebab-cased title); no particular format is enforced by the test suite.
````

### 164. AC-08.4 — endpoints.md L161

PASS — Direct keywords: body, field

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L161

````text
Required fields: `title`, `description`, `body`
````

### 165. AC-08.4 — error-handling.md L7-17

PASS — Direct keywords: 422, body, error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L17

````text
If a request fails any validations, expect a 422 and errors in the following format:

```json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
````

### 166. AC-08.5 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 167. AC-09.1 — endpoints.md L183

PASS — Direct keywords: slug, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L183

````text
The `slug` also gets updated when the `title` is changed
````

### 168. AC-09.2 — endpoints.md L179-181

PASS — Direct keywords: article, body, title, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L179-L181

````text
Authentication required, returns the updated [Article](/specifications/backend/api-response-format#single-article)

Optional fields: `title`, `description`, `body`
````

### 169. AC-09.3 — openapi.yml L260-288

PASS — Direct keywords: 403, article, body, error, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L260-L288

````text
      operationId: UpdateArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to update
          required: true
          schema:
            type: string
      requestBody:
        $ref: '#/components/requestBodies/UpdateArticleRequest'
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: article
    delete:
      tags:
        - Articles
      summary: Delete an article
      description: Delete an article. Auth is required
````

### 170. AC-09.3 — openapi.yml L791-792

PASS — Direct keywords: article, error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 171. AC-10.1 — templates.md L509

PASS — Direct keywords: article, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L509-L509

````text
          <i class="ion-trash-a"></i> Delete Article
````

### 172. AC-10.2 — routing.md L15

PASS — Direct keywords: article, author, button, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 173. AC-10.3 — openapi.yml L289-315

PASS — Direct keywords: 403, article, delete, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L289-L315

````text
      operationId: DeleteArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to delete
          required: true
          schema:
            type: string
      responses:
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
  /articles/{slug}/comments:
    get:
      tags:
        - Comments
      summary: Get comments for an article
      description: Get the comments for an article. Auth is optional
````

### 174. AC-10.4 — openapi.yml L289-315

PASS — Direct keywords: 204, 404, article, delete, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L289-L315

````text
      operationId: DeleteArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to delete
          required: true
          schema:
            type: string
      responses:
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
  /articles/{slug}/comments:
    get:
      tags:
        - Comments
      summary: Get comments for an article
      description: Get the comments for an article. Auth is optional
````

### 175. AC-10.4 — openapi.yml L240-259

PASS — Direct keywords: 404, article, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L240-L259

````text
      operationId: GetArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to get
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    put:
      tags:
        - Articles
      summary: Update an article
      description: Update an article. Auth is required
````

### 176. AC-11.1 — routing.md L14-17

PASS — Direct keywords: article, author, comment, markdown, section, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L14-L17

````text
- Article page (URL: `/article/article-slug-here` )
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
````

### 177. AC-11.2 — endpoints.md L136-140

PASS — Direct keywords: article, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L136-L140

````text
### Get Article

`GET /api/articles/:slug`

No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 178. AC-11.3 — openapi.yml L240-259

PASS — Direct keywords: 404, article, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L240-L259

````text
      operationId: GetArticle
      parameters:
        - name: slug
          in: path
          description: Slug of the article to get
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    put:
      tags:
        - Articles
      summary: Update an article
      description: Update an article. Auth is required
````

### 179. AC-12.1 — templates.md L120

PASS — Direct keywords: feed, global, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L120-L120

````text
- a default **Global Feed** tab
````

### 180. AC-12.1 — endpoints.md L126

PASS — Direct keywords: article, first

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 181. AC-12.2 — endpoints.md L126

PASS — Direct keywords: article, first, ordered

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 182. AC-12.2 — api-response-format.md L62-67

PASS — Direct keywords: article, body, get, list

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L62-L67

````text
:::caution
Starting from the 2024/08/16, the endpoints retrieving a list of articles do no longer return the body of an article for performance reasons.
It affects:
- `GET /api/articles`
- `GET /api/articles/feed`
:::
````

### 183. AC-12.2 — api-response-format.md L102

PASS — Direct keywords: article, count

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 184. AC-13.1 — templates.md L122

PASS — Direct keywords: feed, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 185. AC-13.2 — templates.md L122

PASS — Direct keywords: feed, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 186. AC-13.3 — endpoints.md L134

PASS — Direct keywords: article, followed

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 187. AC-13.4 — endpoints.md L134

PASS — Direct keywords: article

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 188. AC-13.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 189. AC-14.1 — templates.md L121

PASS — Direct keywords: appear, tab, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L121-L121

````text
- an optional **tag name** tab, appears after clicking one of the popular tags
````

### 190. AC-14.2 — api-response-format.md L146-152

PASS — Direct keywords: tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L146-L152

````text
```json
{
  "tags": [
    "reactjs",
    "angularjs"
  ]
}
````

### 191. AC-14.3 — endpoints.md L106-108

PASS — Direct keywords: filter, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L106-L108

````text
Filter by tag:

`?tag=AngularJS`
````

### 192. AC-15.1 — templates.md L191-196

PASS — Direct keywords: 1, 2

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L191-L196

````text
        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
````

### 193. AC-15.2 — endpoints.md L118

PASS — Direct keywords: 20, article, default

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L118

````text
Limit number of articles (default is 20):
````

### 194. AC-15.2 — api-response-format.md L102

PASS — Direct keywords: article, count

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 195. AC-15.3 — endpoints.md L118-124

PASS — Direct keywords: 20, article, limit, offset

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L124

````text
Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`
````

### 196. AC-16.1 — templates.md L562-566

PASS — Direct keywords: comment, post, write

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L562-L566

````text
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
````

### 197. AC-16.2 — openapi.yml L338-365

PASS — Direct keywords: 201, article, body, comment, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L338-L365

````text
      operationId: CreateArticleComment
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to create a comment for
          required: true
          schema:
            type: string
      requestBody:
        $ref: '#/components/requestBodies/NewCommentRequest'
      responses:
        '201':
          $ref: '#/components/responses/SingleCommentResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: comment
  /articles/{slug}/comments/{id}:
    delete:
      tags:
        - Comments
      summary: Delete a comment for an article
      description: Delete a comment for an article. Auth is required
````

### 198. AC-16.2 — api-response-format.md L108-122

PASS — Direct keywords: author, body, comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L108-L122

````text
```json
{
  "comment": {
    "id": 1,
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:22:56.637Z",
    "body": "It takes a Jacobian",
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
    }
  }
}
````

### 199. AC-16.3 — endpoints.md L209

PASS — Direct keywords: body

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L209-L209

````text
Required field: `body`
````

### 200. AC-16.3 — error-handling.md L7

PASS — Direct keywords: 422

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 201. AC-16.4 — endpoints.md L207

PASS — Direct keywords: comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L207-L207

````text
Authentication required, returns the created [Comment](/specifications/backend/api-response-format#single-comment)
````

### 202. AC-16.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 203. AC-17.1 — templates.md L577-582

PASS — Direct keywords: author, comment, date

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L577-L582

````text
            <a href="/profile/author" class="comment-author">
              <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            </a>
            &nbsp;
            <a href="/profile/jacob-schmidt" class="comment-author">Jacob Schmidt</a>
            <span class="date-posted">Dec 29th</span>
````

### 204. AC-17.2 — endpoints.md L211-215

PASS — Direct keywords: article, comment, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L211-L215

````text
### Get Comments from an Article

`GET /api/articles/:slug/comments`

Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 205. AC-18.1 — templates.md L599-600

PASS — Citation-set context: This range exists but has no direct wording keyword. Supporting citation in the same item: routing.md L18 (author, comment, delete)

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L599-L600

````text
            <span class="mod-options">
              <i class="ion-trash-a"></i>
````

### 206. AC-18.2 — routing.md L18

PASS — Direct keywords: comment, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 207. AC-18.3 — openapi.yml L366-398

PASS — Direct keywords: 403, article, comment, delete, error, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L366-L398

````text
      operationId: DeleteArticleComment
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to delete a comment for
          required: true
          schema:
            type: string
        - name: id
          in: path
          description: ID of the comment you want to delete
          required: true
          schema:
            type: integer
      responses:
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
  /articles/{slug}/favorite:
    post:
      tags:
        - Favorites
      summary: Favorite an article
      description: Favorite an article. Auth is required
````

### 208. AC-19.1 — templates.md L305

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 209. AC-19.1 — endpoints.md L134

PASS — Direct keywords: article

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 210. AC-19.2 — endpoints.md L82-88

PASS — Direct keywords: follow, post, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L82-L88

````text
### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 211. AC-19.3 — endpoints.md L90-96

PASS — Direct keywords: delete, follow, profile, unfollow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L90-L96

````text
### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 212. AC-19.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 213. AC-20.1 — templates.md L155

PASS — Direct keywords: heart

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L155-L155

````text
              <i class="ion-heart"></i> 29
````

### 214. AC-20.1 — api-response-format.md L48-49

PASS — Direct keywords: count

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 215. AC-20.2 — endpoints.md L223-229

PASS — Direct keywords: article, favorite, post, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L223-L229

````text
### Favorite Article

`POST /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 216. AC-20.3 — endpoints.md L231-237

PASS — Direct keywords: article, delete, favorite, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L231-L237

````text
### Unfavorite Article

`DELETE /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 217. AC-20.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 218. AC-21.1 — templates.md L36-40

PASS — Direct keywords: header, home

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 219. AC-21.2 — templates.md L66-71

PASS — Direct keywords: article, header, home, new, profile, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L66-L71

````text
If a user is logged in, then the header should include links to:

- the home page
- the new article page
- the settings page
- the profile page
````

### 220. AC-21.3 — templates.md L73

PASS — Direct keywords: active, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L73-L73

````text
> the link of the active page should use the **active** css class.
````

### 221. AC-22.1 — error-handling.md L7-25

PASS — Direct keywords: body, code, error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L25

````text
If a request fails any validations, expect a 422 and errors in the following format:

```json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```

#### Other status codes:

401 for Unauthorized requests, when a request requires authentication but it isn't provided

403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request
````

### 222. AC-22.2 — error-handling.md L7-17

PASS — Direct keywords: 422, empty, error, format, validation

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L17

````text
If a request fails any validations, expect a 422 and errors in the following format:

```json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
}
```
````

### 223. AC-23.1 — cors.md L7

PASS — Direct keywords: acces, allow, content, control, different, header, option, origin, run, type

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 224. OQ-01.1 — openapi.yml L44-60

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L44-L60

````text
      operationId: CreateUser
      requestBody:
        $ref: '#/components/requestBodies/NewUserRequest'
      responses:
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /user:
    get:
      tags:
        - User and Authentication
      summary: Get current user
      description: Gets the currently logged-in user
````

### 225. OQ-01.2 — openapi.yml L781-790

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L781-L790

````text
    ConflictError:
      description: Conflict - resource already exists
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GenericErrorModel'
          example:
            errors:
              username:
                - "has already been taken"
````

### 226. OQ-01.3 — routing.md L19

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L19

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
````

### 227. OQ-01.4 — routing.md L9

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L9

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
````

### 228. OQ-02.1 — openapi.yml L28-42

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L42

````text
      operationId: Login
      requestBody:
        $ref: '#/components/requestBodies/LoginUserRequest'
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /users:
    post:
      tags:
        - User and Authentication
````

### 229. OQ-02.1 — error-handling.md L7

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 230. OQ-02.2 — openapi.yml L28-42

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L42

````text
      operationId: Login
      requestBody:
        $ref: '#/components/requestBodies/LoginUserRequest'
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      x-codegen-request-body-name: body
  /users:
    post:
      tags:
        - User and Authentication
````

### 231. OQ-02.3 — routing.md L10

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 232. OQ-03.1 — routing.md L10

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 233. OQ-03.2 — error-handling.md L21

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 234. OQ-04.1 — templates.md L430

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L430-L430

````text
        <button class="btn btn-outline-danger">Or click here to logout.</button>
````

### 235. OQ-04.2 — routing.md L10

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 236. OQ-05.1 — openapi.yml L76-94

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L76-L94

````text
      operationId: UpdateCurrentUser
      requestBody:
        $ref: '#/components/requestBodies/UpdateUserRequest'
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: body
  /profiles/{username}:
    get:
      tags:
        - Profile
      summary: Get a profile
      description: Get a profile of a user of the system. Auth is optional
````

### 237. OQ-05.2 — templates.md L423

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L423-L423

````text
                placeholder="New Password"
````

### 238. OQ-05.3 — templates.md L407

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L407-L407

````text
              <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
````

### 239. OQ-05.4 — endpoints.md L74

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 240. OQ-05.5 — templates.md L404

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L404-L404

````text
              <input class="form-control" type="text" placeholder="URL of profile picture" />
````

### 241. OQ-06.1 — templates.md L305-309

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L309

````text
            &nbsp; Follow Eric Simons
          </button>
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-gear-a"></i>
            &nbsp; Edit Profile Settings
````

### 242. OQ-07.1 — templates.md L322

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L322-L322

````text
              <a class="nav-link active" href="">My Articles</a>
````

### 243. OQ-07.2 — endpoints.md L102-116

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L116

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`
````

### 244. OQ-07.3 — endpoints.md L110-116

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L110-L116

````text
Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`
````

### 245. OQ-08.1 — openapi.yml L219-239

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L219-L239

````text
      operationId: CreateArticle
      requestBody:
        $ref: '#/components/requestBodies/NewArticleRequest'
      responses:
        '201':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
      x-codegen-request-body-name: article
  /articles/{slug}:
    get:
      tags:
        - Articles
      summary: Get an article
      description: Get an article. Auth not required
````

### 246. OQ-08.1 — endpoints.md L185

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L185-L185

````text
> The `slug` is the article's URL identifier. The spec only requires it to be a unique string that you can use to fetch, update, and delete the article — duplicate titles must still produce distinct slugs. How you derive it is up to your implementation (commonly a kebab-cased title); no particular format is enforced by the test suite.
````

### 247. OQ-08.2 — endpoints.md L163

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L163-L163

````text
Optional fields: `tagList` as an array of Strings
````

### 248. OQ-08.3 — endpoints.md L161

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L161

````text
Required fields: `title`, `description`, `body`
````

### 249. OQ-08.4 — templates.md L470

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L470-L470

````text
              Publish Article
````

### 250. OQ-09.1 — endpoints.md L181

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L181-L181

````text
Optional fields: `title`, `description`, `body`
````

### 251. OQ-09.2 — templates.md L482

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 252. OQ-09.2 — templates.md L506

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L506-L506

````text
          <i class="ion-edit"></i> Edit Article
````

### 253. OQ-09.3 — endpoints.md L183

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L183

````text
The `slug` also gets updated when the `title` is changed
````

### 254. OQ-10.1 — templates.md L509

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L509-L509

````text
          <i class="ion-trash-a"></i> Delete Article
````

### 255. OQ-10.2 — endpoints.md L187-191

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L187-L191

````text
### Delete Article

`DELETE /api/articles/:slug`

Authentication required
````

### 256. OQ-10.3 — routing.md L15

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 257. OQ-11.1 — endpoints.md L140

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L140-L140

````text
No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 258. OQ-11.1 — api-response-format.md L48-54

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L54

````text
    "favorited": false,
    "favoritesCount": 0,
    "author": {
      "username": "jake",
      "bio": "I work at statefarm",
      "image": "https://i.stack.imgur.com/xHWG8.jpg",
      "following": false
````

### 259. OQ-11.2 — routing.md L16

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L16-L16

````text
  - Render markdown from server client side
````

### 260. OQ-12.1 — routing.md L7

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L7-L7

````text
  - List of articles pulled from either Feed, Global, or by Tag
````

### 261. OQ-13.1 — templates.md L120-122

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L120-L122

````text
- a default **Global Feed** tab
- an optional **tag name** tab, appears after clicking one of the popular tags
- an optional **Your Feed** tab, appears after logging in
````

### 262. OQ-13.2 — endpoints.md L134

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 263. OQ-13.3 — endpoints.md L134

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 264. OQ-14.1 — templates.md L203

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L203-L203

````text
          <p>Popular Tags</p>
````

### 265. OQ-14.1 — endpoints.md L243

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L243-L243

````text
No authentication required, returns a [List of Tags](/specifications/backend/api-response-format#list-of-tags)
````

### 266. OQ-14.2 — endpoints.md L108

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L108-L108

````text
`?tag=AngularJS`
````

### 267. OQ-15.1 — templates.md L191-196

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L191-L196

````text
        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
````

### 268. OQ-15.2 — openapi.yml L895-911

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L895-L911

````text
    offsetParam:
      in: query
      name: offset
      required: false
      schema:
        type: integer
        minimum: 0
      description: The number of items to skip before starting to collect the result set.
    limitParam:
      in: query
      name: limit
      required: false
      schema:
        type: integer
        minimum: 1
        default: 20
      description: The numbers of items to return.
````

### 269. OQ-16.1 — templates.md L562-566

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L562-L566

````text
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
````

### 270. OQ-16.2 — endpoints.md L209

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L209-L209

````text
Required field: `body`
````

### 271. OQ-17.1 — endpoints.md L215

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L215-L215

````text
Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 272. OQ-17.2 — endpoints.md L211-215

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L211-L215

````text
### Get Comments from an Article

`GET /api/articles/:slug/comments`

Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 273. OQ-18.1 — routing.md L18

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 274. OQ-19.1 — templates.md L498

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L498-L498

````text
          &nbsp; Follow Eric Simons <span class="counter">(10)</span>
````

### 275. OQ-19.1 — api-response-format.md L25-33

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L25-L33

````text
```json
{
  "profile": {
    "username": "jake",
    "bio": "I work at statefarm",
    "image": "https://api.realworld.io/images/smiley-cyrus.jpg",
    "following": false
  }
}
````

### 276. OQ-19.2 — endpoints.md L82-88

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L82-L88

````text
### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 277. OQ-19.3 — templates.md L305

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 278. OQ-20.1 — endpoints.md L223-229

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L223-L229

````text
### Favorite Article

`POST /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 279. OQ-20.2 — templates.md L155

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L155-L155

````text
              <i class="ion-heart"></i> 29
````

### 280. OQ-21.1 — routing.md L12-13

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L12-L13

````text
- Settings page (URL: `/settings` )
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 281. OQ-21.2 — routing.md L5-21

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L5-L21

````text
- Home page (URL: `/` )
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
  - Pagination for list of articles
- Sign in/Sign up pages (URL: `/login`, `/register` )
  - Uses JWT (store the token in localStorage)
  - Authentication can be easily switched to session/cookie based
- Settings page (URL: `/settings` )
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
- Article page (URL: `/article/article-slug-here` )
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles
````

### 282. OQ-22.1 — error-handling.md L9-15

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L9-L15

````text
```json
{
  "errors":{
    "body": [
      "can't be empty"
    ]
  }
````

### 283. OQ-22.1 — openapi.yml L811-820

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L811-L820

````text
    GenericError:
      description: Unexpected error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/GenericErrorModel'
          example:
            errors:
              title:
                - "can't be blank"
````

### 284. OQ-23.1 — cors.md L7

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

## Additional Markdown citations (outside the original denominator)

### 1. AC-18.1 — routing.md L18

PASS — Direct keywords: author, comment, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

## Backlog roll-up consistency (not primary citations)

- US-01 — endpoints.md L48: PASS

- US-01 — endpoints.md L46: PASS

- US-01 — api-response-format.md L11-20: PASS

- US-01 — openapi.yml L44-60: PASS

- US-01 — openapi.yml L781-790: PASS

- US-01 — error-handling.md L7-17: PASS

- US-01 — routing.md L9: PASS

- US-01 — templates.md L262-281: PASS

- US-01 — templates.md L267: PASS

- US-01 — routing.md L10: PASS

- US-02 — endpoints.md L28: PASS

- US-02 — endpoints.md L26: PASS

- US-02 — openapi.yml L28-42: PASS

- US-02 — routing.md L9: PASS

- US-02 — templates.md L231-247: PASS

- US-02 — templates.md L236: PASS

- US-02 — routing.md L10: PASS

- US-03 — endpoints.md L5-9: PASS

- US-03 — endpoints.md L50-54: PASS

- US-03 — error-handling.md L21: PASS

- US-03 — openapi.yml L771-780: PASS

- US-03 — routing.md L10: PASS

- US-04 — features.md L7: PASS

- US-04 — templates.md L430: PASS

- US-04 — templates.md L36-40: PASS

- US-05 — routing.md L12: PASS

- US-05 — templates.md L404-426: PASS

- US-05 — endpoints.md L56-74: PASS

- US-05 — features.md L8: PASS

- US-06 — routing.md L19-20: PASS

- US-06 — templates.md L289-309: PASS

- US-06 — endpoints.md L76-80: PASS

- US-06 — api-response-format.md L25-33: PASS

- US-06 — openapi.yml L95-117: PASS

- US-06 — templates.md L305: PASS

- US-06 — templates.md L309: PASS

- US-07 — routing.md L19-21: PASS

- US-07 — templates.md L322-325: PASS

- US-07 — endpoints.md L110-116: PASS

- US-08 — routing.md L13: PASS

- US-08 — templates.md L451-470: PASS

- US-08 — endpoints.md L159: PASS

- US-08 — endpoints.md L161-163: PASS

- US-08 — api-response-format.md L38-57: PASS

- US-08 — openapi.yml L219-239: PASS

- US-08 — endpoints.md L185: PASS

- US-09 — routing.md L13: PASS

- US-09 — endpoints.md L179-181: PASS

- US-09 — endpoints.md L183: PASS

- US-09 — openapi.yml L260-288: PASS

- US-09 — openapi.yml L791-792: PASS

- US-10 — endpoints.md L187-191: PASS

- US-10 — openapi.yml L289-315: PASS

- US-10 — routing.md L15: PASS

- US-10 — templates.md L509: PASS

- US-11 — routing.md L14: PASS

- US-11 — endpoints.md L136-140: PASS

- US-11 — api-response-format.md L38-57: PASS

- US-11 — routing.md L16: PASS

- US-11 — routing.md L17: PASS

- US-11 — openapi.yml L240-259: PASS

- US-12 — routing.md L5-7: PASS

- US-12 — templates.md L118-120: PASS

- US-12 — endpoints.md L102: PASS

- US-12 — endpoints.md L126: PASS

- US-12 — api-response-format.md L62-67: PASS

- US-12 — api-response-format.md L102: PASS

- US-12 — templates.md L145-185: PASS

- US-13 — templates.md L122: PASS

- US-13 — endpoints.md L134: PASS

- US-13 — endpoints.md L132: PASS

- US-14 — routing.md L6: PASS

- US-14 — templates.md L203: PASS

- US-14 — templates.md L121: PASS

- US-14 — endpoints.md L106-108: PASS

- US-14 — endpoints.md L239-243: PASS

- US-14 — api-response-format.md L146-152: PASS

- US-15 — routing.md L8: PASS

- US-15 — templates.md L191-196: PASS

- US-15 — endpoints.md L118-124: PASS

- US-15 — openapi.yml L895-911: PASS

- US-15 — endpoints.md L132: PASS

- US-15 — api-response-format.md L102: PASS

- US-16 — templates.md L562-566: PASS

- US-16 — routing.md L17: PASS

- US-16 — endpoints.md L207-209: PASS

- US-16 — api-response-format.md L108-122: PASS

- US-16 — openapi.yml L338-365: PASS

- US-16 — features.md L10: PASS

- US-17 — endpoints.md L211-215: PASS

- US-17 — api-response-format.md L127-141: PASS

- US-17 — templates.md L577-582: PASS

- US-17 — features.md L10: PASS

- US-18 — endpoints.md L217-221: PASS

- US-18 — openapi.yml L366-398: PASS

- US-18 — routing.md L18: PASS

- US-18 — templates.md L599-600: PASS

- US-18 — openapi.yml L791-792: PASS

- US-19 — endpoints.md L82-96: PASS

- US-19 — api-response-format.md L25-33: PASS

- US-19 — templates.md L305: PASS

- US-19 — templates.md L498: PASS

- US-19 — openapi.yml L118-141: PASS

- US-19 — endpoints.md L134: PASS

- US-20 — endpoints.md L223-237: PASS

- US-20 — api-response-format.md L48-49: PASS

- US-20 — templates.md L155: PASS

- US-20 — templates.md L503: PASS

- US-20 — routing.md L19-21: PASS

- US-21 — templates.md L36-40: PASS

- US-21 — templates.md L66-71: PASS

- US-21 — templates.md L42: PASS

- US-21 — templates.md L73: PASS

- US-22 — error-handling.md L7-17: PASS

- US-22 — error-handling.md L21: PASS

- US-22 — error-handling.md L23: PASS

- US-22 — error-handling.md L25: PASS

- US-22 — openapi.yml L791-810: PASS

- US-22 — api-response-format.md L7: PASS

- US-23 — cors.md L7: PASS
