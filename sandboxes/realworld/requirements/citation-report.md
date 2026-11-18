# Run 2a citation report

Specification pin: ebbcdeb8d55b42a3a613c787560498b8ef10003f

## Result

Current citations: 362 checked / 362 passed / 0 unexplained failures.

Original 284 occurrence accounting: 274 retained, 10 retired with logged question conversions. Added current occurrences: 88.

Metadata citations: 477 range-checked. Retired citations: 10 range-checked, not asserted as supported rules.

Backlog historical roll-ups: 120 checked; 114 match current rule citations; 6 match logged retired rules; 0 unexplained omissions.

## Current outcome breakdown

- BA-ASSUMPTION: 14

- Citation-set context: 2

- Direct keywords: 247

- Open-question existence: 94

- Reviewed exception: 5

## Method and limitations

All current BR/AC/OQ items are read from canonical Markdown, including every newly added item and citation. Original IDs may disappear only through an explicit logged rule-to-question conversion; retained original citations must remain. Every range must exist at the verified pin in the explicit 13-file requirement-source allowlist. No test suite or implementation is an input.

The prior lexical policy is unchanged: ordinary wording requires direct substantive-token overlap or explicitly reported same-item citation-set context. OQ citations are existence-only because they may locate silence. BA-ASSUMPTION scenarios are range-checked, not promoted to specification-backed predicates. Exact exceptions use their current recorded reviewer; all five currently name Dmitry, 2026-11-18. No new exception has been introduced.

Reconciliation/coverage and change-log evidence is checked for range existence separately; historical checklist wording is only a lead, not a new asserted requirement. Historical roll-ups distinguish current rule membership from a logged retired assertion. These lexical/structural checks are not semantic proof, executed tests or BA approval. Responses declared by OpenAPI do not establish unstated triggers.

## Reviewed exceptions

- BR-01.2 — endpoints.md L46: "No authentication required" = registration needs no sign-in — Dmitry, 2026-11-18

- BR-02.2 — endpoints.md L26: "No authentication required" = sign-in needs no existing session — Dmitry, 2026-11-18

- BR-05.4 — features.md L8: "no deleting required" = accounts cannot be deleted — Dmitry, 2026-11-18

- BR-15.1 — templates.md L191-196: pagination markup = lists are paginated — Dmitry, 2026-11-18

- BR-20.3 — templates.md L503: "Favorite Post (29)" = heart with count on the article page — Dmitry, 2026-11-18

## Every unexplained failure

None.

## Current citation audit

### 1. BR-01.1 — endpoints.md L48

PASS — Direct keywords: email, password, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L48-L48

````text
Required fields: `email`, `username`, `password`
````

### 2. BR-01.2 — endpoints.md L46

PASS — Reviewed exception: "No authentication required" = registration needs no sign-in — Dmitry, 2026-11-18

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

### 13. BR-01.8 — openapi.yml L481-503

PASS — Direct keywords: bio, email, image, null, string, token, user, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L481-L503

````text
    User:
      required:
        - bio
        - email
        - image
        - token
        - username
      type: object
      properties:
        email:
          type: string
        token:
          type: string
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
````

### 14. BR-01.9 — openapi.yml L834-845

PASS — Direct keywords: object, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L834-L845

````text
    NewUserRequest:
      required: true
      description: Details of the new user to register
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/NewUser'
````

### 15. BR-01.9 — openapi.yml L467-480

PASS — Direct keywords: email, object, password, user, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L467-L480

````text
    NewUser:
      required:
        - email
        - password
        - username
      type: object
      properties:
        username:
          type: string
        email:
          type: string
        password:
          type: string
          format: password
````

### 16. BR-01.10 — templates.md L262-265

PASS — Direct keywords: account, login, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L262-L265

````text
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <a href="/login">Have an account?</a>
        </p>
````

### 17. AC-01.1 — routing.md L9-10

PASS — Direct keywords: register, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L10

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
  - Uses JWT (store the token in localStorage)
````

### 18. AC-01.1 — templates.md L262-281

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

### 19. AC-01.2 — openapi.yml L44-60

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

### 20. AC-01.2 — api-response-format.md L11-20

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

### 21. AC-01.3 — openapi.yml L781-790

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

### 22. AC-01.4 — endpoints.md L48

PASS — Direct keywords: field

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L48-L48

````text
Required fields: `email`, `username`, `password`
````

### 23. AC-01.4 — error-handling.md L7-17

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

### 24. BR-02.1 — endpoints.md L28

PASS — Direct keywords: email, password

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L28-L28

````text
Required fields: `email`, `password`
````

### 25. BR-02.2 — endpoints.md L26

PASS — Reviewed exception: "No authentication required" = sign-in needs no existing session — Dmitry, 2026-11-18

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L26-L26

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 26. BR-02.3 — endpoints.md L26

PASS — Direct keywords: authentication, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L26-L26

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 27. BR-02.3 — openapi.yml L28-42

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

### 28. BR-02.5 — routing.md L9

PASS — Direct keywords: login, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L9

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
````

### 29. BR-02.5 — templates.md L231-247

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

### 30. BR-02.5 — templates.md L236

PASS — Direct keywords: error

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L236-L236

````text
        <ul class="error-messages">
````

### 31. BR-02.6 — routing.md L10

PASS — Direct keywords: local, storage, store, token

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 32. BR-02.7 — openapi.yml L822-833

PASS — Direct keywords: login, object, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L822-L833

````text
    LoginUserRequest:
      required: true
      description: Credentials to use
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/LoginUser'
````

### 33. BR-02.7 — openapi.yml L456-466

PASS — Direct keywords: email, login, object, password, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L456-L466

````text
    LoginUser:
      required:
        - email
        - password
      type: object
      properties:
        email:
          type: string
        password:
          type: string
          format: password
````

### 34. BR-02.8 — openapi.yml L28-37

PASS — Direct keywords: 200, 401, 422, error, generic, login, unauthorized, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L37

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
````

### 35. BR-02.9 — templates.md L231-234

PASS — Direct keywords: account, register, sign

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L231-L234

````text
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
          <a href="/register">Need an account?</a>
        </p>
````

### 36. AC-02.1 — templates.md L231-247

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

### 37. AC-02.1 — templates.md L66-71

PASS — Direct keywords: header

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L66-L71

````text
If a user is logged in, then the header should include links to:

- the home page
- the new article page
- the settings page
- the profile page
````

### 38. AC-02.2 — openapi.yml L28-42

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

### 39. AC-02.2 — api-response-format.md L11-20

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

### 40. AC-02.3 — openapi.yml L28-42

PASS — BA-ASSUMPTION: Wrong-password classification remains unresolved in OQ-02.1; 401 is declared but its bad-credential trigger is not explicit.; range exists; not asserted as explicit specification behaviour.

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

### 41. AC-02.4 — endpoints.md L28

PASS — Direct keywords: field

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L28-L28

````text
Required fields: `email`, `password`
````

### 42. AC-02.4 — error-handling.md L7

PASS — Direct keywords: 422

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 43. BR-03.1 — endpoints.md L5-9

PASS — Direct keywords: authorization, header, jwt, token

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L5-L9

````text
### Authentication Header:

You can read the authentication header from the headers of the request

`Authorization: Token jwt.token.here`
````

### 44. BR-03.2 — endpoints.md L50-54

PASS — Direct keywords: authentication, current, get, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L50-L54

````text
### Get Current User

`GET /api/user`

Authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication) that's the current user
````

### 45. BR-03.3 — error-handling.md L21

PASS — Direct keywords: 401, authentication, but

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 46. BR-03.3 — openapi.yml L771-780

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

### 47. BR-03.5 — openapi.yml L61-68

PASS — Direct keywords: 200, 401, 422, error, generic, get, unauthorized, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L61-L68

````text
      operationId: GetCurrentUser
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 48. AC-03.1 — routing.md L10

PASS — BA-ASSUMPTION: persistence across reload is implied by storing the token in localStorage, not stated; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 49. AC-03.2 — endpoints.md L50-54

PASS — Direct keywords: current, get, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L50-L54

````text
### Get Current User

`GET /api/user`

Authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication) that's the current user
````

### 50. AC-03.3 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 51. BR-04.1 — features.md L7

PASS — Direct keywords: button, logout, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L7-L7

````text
- Authenticate users via JWT (login/signup pages + logout button on settings page)
````

### 52. BR-04.1 — templates.md L430

PASS — Direct keywords: button, click, here, logout

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L430-L430

````text
        <button class="btn btn-outline-danger">Or click here to logout.</button>
````

### 53. BR-04.2 — templates.md L36-40

PASS — Direct keywords: header, home, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 54. AC-04.1 — templates.md L430

PASS — Direct keywords: click, here, logout

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L430-L430

````text
        <button class="btn btn-outline-danger">Or click here to logout.</button>
````

### 55. AC-04.1 — templates.md L36-40

PASS — Direct keywords: header, home

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 56. BR-05.1 — routing.md L12

PASS — Direct keywords: setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L12-L12

````text
- Settings page (URL: `/settings` )
````

### 57. BR-05.2 — templates.md L404-426

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

### 58. BR-05.3 — endpoints.md L56-74

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

### 59. BR-05.4 — features.md L8

PASS — Reviewed exception: "no deleting required" = accounts cannot be deleted — Dmitry, 2026-11-18

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L8-L8

````text
- CRU- users (sign up & settings page - no deleting required)
````

### 60. BR-05.5 — openapi.yml L846-857

PASS — Direct keywords: field, least, object, one, update, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L846-L857

````text
    UpdateUserRequest:
      required: true
      description: User details to update. At least **one** field is required.
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/UpdateUser'
````

### 61. BR-05.6 — openapi.yml L76-87

PASS — Direct keywords: 200, 401, 422, error, generic, unauthorized, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L76-L87

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
````

### 62. AC-05.1 — templates.md L404-426

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

### 63. AC-05.1 — routing.md L20

PASS — Direct keywords: show

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L20-L20

````text
  - Show basic user info
````

### 64. AC-05.2 — endpoints.md L56-74

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

### 65. AC-05.3 — endpoints.md L72

PASS — Direct keywords: user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L72-L72

````text
Authentication required, returns the [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 66. AC-05.3 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 67. BR-06.1 — routing.md L19-20

PASS — Direct keywords: basic, info, profile, show, user, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L20

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
````

### 68. BR-06.1 — templates.md L289-309

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

### 69. BR-06.2 — endpoints.md L76-80

PASS — Direct keywords: authentication, get, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L76-L80

````text
### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a [Profile](/specifications/backend/api-response-format#profile)
````

### 70. BR-06.2 — api-response-format.md L25-33

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

### 71. BR-06.3 — openapi.yml L95-117

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

### 72. BR-06.4 — templates.md L305

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 73. BR-06.4 — templates.md L309

PASS — Direct keywords: edit, profile, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L309-L309

````text
            &nbsp; Edit Profile Settings
````

### 74. BR-06.5 — openapi.yml L521-540

PASS — Direct keywords: bio, boolean, following, image, null, object, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L521-L540

````text
    Profile:
      required:
        - bio
        - following
        - image
        - username
      type: object
      properties:
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
        following:
          type: boolean
````

### 75. BR-06.5 — openapi.yml L746-756

PASS — Direct keywords: object, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L746-L756

````text
    ProfileResponse:
      description: Profile
      content:
        application/json:
          schema:
            required:
              - profile
            type: object
            properties:
              profile:
                $ref: '#/components/schemas/Profile'
````

### 76. BR-06.6 — openapi.yml L93-111

PASS — Direct keywords: 200, 401, 404, 422, auth, error, found, generic, get, optional, profile, unauthorized, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L93-L111

````text
      summary: Get a profile
      description: Get a profile of a user of the system. Auth is optional
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
````

### 77. AC-06.1 — routing.md L19-20

PASS — Direct keywords: profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L20

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
````

### 78. AC-06.2 — endpoints.md L76-80

PASS — Direct keywords: get, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L76-L80

````text
### Get Profile

`GET /api/profiles/:username`

Authentication optional, returns a [Profile](/specifications/backend/api-response-format#profile)
````

### 79. AC-06.2 — api-response-format.md L25-33

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

### 80. AC-06.3 — openapi.yml L95-117

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

### 81. BR-07.1 — routing.md L19-21

PASS — Direct keywords: article, favorite, favorited, list, profile, username

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L21

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles
````

### 82. BR-07.1 — templates.md L322-325

PASS — Direct keywords: article, favorited

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L322-L325

````text
              <a class="nav-link active" href="">My Articles</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">Favorited Articles</a>
````

### 83. BR-07.2 — endpoints.md L110-116

PASS — Direct keywords: author, favorited, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L110-L116

````text
Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`
````

### 84. AC-07.1 — routing.md L21

PASS — Direct keywords: article, list

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L21-L21

````text
  - List of articles populated from author's created articles or author's favorited articles
````

### 85. AC-07.2 — routing.md L19-21

PASS — Direct keywords: article, favorite, favorited, list, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L21

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles
````

### 86. AC-07.3 — endpoints.md L110-112

PASS — Direct keywords: author, filter, jake

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L110-L112

````text
Filter by author:

`?author=jake`
````

### 87. AC-07.4 — endpoints.md L114-116

PASS — Direct keywords: favorited, jake

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L114-L116

````text
Favorited by user:

`?favorited=jake`
````

### 88. BR-08.1 — routing.md L13

PASS — Direct keywords: article, editor

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L13-L13

````text
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 89. BR-08.2 — templates.md L451-470

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

### 90. BR-08.3 — endpoints.md L159

PASS — Direct keywords: authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L159-L159

````text
Authentication required, will return an [Article](/specifications/backend/api-response-format#single-article)
````

### 91. BR-08.4 — endpoints.md L161-163

PASS — Direct keywords: body, description, optional, tag, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L163

````text
Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings
````

### 92. BR-08.5 — api-response-format.md L38-57

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

### 93. BR-08.5 — openapi.yml L219-239

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

### 94. BR-08.6 — endpoints.md L185

PASS — Direct keywords: article, slug, title, unique

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L185-L185

````text
> The `slug` is the article's URL identifier. The spec only requires it to be a unique string that you can use to fetch, update, and delete the article — duplicate titles must still produce distinct slugs. How you derive it is up to your implementation (commonly a kebab-cased title); no particular format is enforced by the test suite.
````

### 95. BR-08.7 — openapi.yml L579-595

PASS — Direct keywords: array, article, body, description, list, object, string, tag, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L579-L595

````text
    NewArticle:
      required:
        - body
        - description
        - title
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
````

### 96. BR-08.7 — openapi.yml L858-869

PASS — Direct keywords: article, create, description, object

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L858-L869

````text
    NewArticleRequest:
      required: true
      description: Article to create
      content:
        application/json:
          schema:
            required:
              - article
            type: object
            properties:
              article:
                $ref: '#/components/schemas/NewArticle'
````

### 97. BR-08.8 — openapi.yml L541-578

PASS — Direct keywords: article, author, body, boolean, count, created, date, description, favorite, favorited, integer, list, profile, slug, string, tag, time, title, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L541-L578

````text
    Article:
      required:
        - author
        - body
        - createdAt
        - description
        - favorited
        - favoritesCount
        - slug
        - tagList
        - title
        - updatedAt
      type: object
      properties:
        slug:
          type: string
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        favorited:
          type: boolean
        favoritesCount:
          type: integer
        author:
          $ref: '#/components/schemas/Profile'
````

### 98. BR-08.9 — openapi.yml L219-230

PASS — Direct keywords: 201, 401, 409, 422, article, conflict, error, generic, unauthorized

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L219-L230

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
````

### 99. BR-08.10 — templates.md L444-446

PASS — Direct keywords: error, message

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L444-L446

````text
        <ul class="error-messages">
          <li>That title is required</li>
        </ul>
````

### 100. BR-08.10 — templates.md L464-466

PASS — Direct keywords: control, list, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L464-L466

````text
              <input type="text" class="form-control" placeholder="Enter tags" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> tag </span>
````

### 101. BR-08.10 — templates.md L482

PASS — Direct keywords: edit, switch

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 102. BR-08.10 — templates.md L505-507

PASS — Direct keywords: article, edit

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L505-L507

````text
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> Edit Article
        </button>
````

### 103. AC-08.1 — templates.md L451-470

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

### 104. AC-08.1 — routing.md L14

PASS — Direct keywords: article, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L14-L14

````text
- Article page (URL: `/article/article-slug-here` )
````

### 105. AC-08.2 — openapi.yml L219-239

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

### 106. AC-08.2 — api-response-format.md L38-57

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

### 107. AC-08.3 — endpoints.md L185

PASS — Direct keywords: article, slug, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L185-L185

````text
> The `slug` is the article's URL identifier. The spec only requires it to be a unique string that you can use to fetch, update, and delete the article — duplicate titles must still produce distinct slugs. How you derive it is up to your implementation (commonly a kebab-cased title); no particular format is enforced by the test suite.
````

### 108. AC-08.4 — endpoints.md L161

PASS — Direct keywords: body, field

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L161

````text
Required fields: `title`, `description`, `body`
````

### 109. AC-08.4 — error-handling.md L7-17

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

### 110. AC-08.5 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 111. BR-09.1 — routing.md L13

PASS — Direct keywords: article, editor, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L13-L13

````text
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 112. BR-09.2 — endpoints.md L179-181

PASS — Direct keywords: article, authentication, body, description, title, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L179-L181

````text
Authentication required, returns the updated [Article](/specifications/backend/api-response-format#single-article)

Optional fields: `title`, `description`, `body`
````

### 113. BR-09.3 — endpoints.md L183

PASS — Direct keywords: slug, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L183

````text
The `slug` also gets updated when the `title` is changed
````

### 114. BR-09.5 — openapi.yml L260-288

PASS — Direct keywords: 200, 401, 403, 404, 422, article, error, forbidden, found, generic, slug, unauthorized

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

### 115. BR-09.5 — error-handling.md L23-25

PASS — Direct keywords: 403, 404, forbidden, found

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L25

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request
````

### 116. AC-09.1 — endpoints.md L183

PASS — Direct keywords: slug, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L183

````text
The `slug` also gets updated when the `title` is changed
````

### 117. AC-09.2 — endpoints.md L179-181

PASS — Direct keywords: article, body, title, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L179-L181

````text
Authentication required, returns the updated [Article](/specifications/backend/api-response-format#single-article)

Optional fields: `title`, `description`, `body`
````

### 118. AC-09.3 — openapi.yml L260-288

PASS — BA-ASSUMPTION: API author-only edit permission awaits OQ-09.4; the declared 403 alone does not establish this condition.; range exists; not asserted as explicit specification behaviour.

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

### 119. AC-09.3 — openapi.yml L791-792

PASS — BA-ASSUMPTION: API author-only edit permission awaits OQ-09.4; the declared 403 alone does not establish this condition.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 120. BR-10.1 — endpoints.md L187-191

PASS — Direct keywords: authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L187-L191

````text
### Delete Article

`DELETE /api/articles/:slug`

Authentication required
````

### 121. BR-10.1 — openapi.yml L289-315

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

### 122. BR-10.2 — routing.md L15

PASS — Direct keywords: article, author, button, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 123. BR-10.2 — templates.md L509

PASS — Direct keywords: article, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L509-L509

````text
          <i class="ion-trash-a"></i> Delete Article
````

### 124. BR-10.4 — openapi.yml L289-315

PASS — Direct keywords: 204, 401, 403, 404, 422, article, delete, error, forbidden, found, generic, slug, unauthorized

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

### 125. BR-10.4 — openapi.yml L768-770

PASS — Direct keywords: content

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L768-L770

````text
    EmptyOkResponse:
      description: No content
      content: { }
````

### 126. AC-10.1 — templates.md L509

PASS — Direct keywords: article, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L509-L509

````text
          <i class="ion-trash-a"></i> Delete Article
````

### 127. AC-10.2 — routing.md L15

PASS — Direct keywords: article, author, button, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 128. AC-10.3 — openapi.yml L289-315

PASS — BA-ASSUMPTION: API author-only delete permission awaits OQ-10.4; UI visibility does not establish API enforcement.; range exists; not asserted as explicit specification behaviour.

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

### 129. AC-10.4 — openapi.yml L289-315

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

### 130. AC-10.4 — openapi.yml L240-259

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

### 131. BR-11.1 — routing.md L14

PASS — Direct keywords: article, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L14-L14

````text
- Article page (URL: `/article/article-slug-here` )
````

### 132. BR-11.2 — endpoints.md L136-140

PASS — Direct keywords: article, authentication, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L136-L140

````text
### Get Article

`GET /api/articles/:slug`

No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 133. BR-11.2 — api-response-format.md L38-57

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

### 134. BR-11.3 — routing.md L16

PASS — Direct keywords: markdown

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L16-L16

````text
  - Render markdown from server client side
````

### 135. BR-11.4 — routing.md L17

PASS — Direct keywords: bottom, comment, section

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L17-L17

````text
  - Comments section at bottom of page
````

### 136. BR-11.5 — openapi.yml L240-259

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

### 137. BR-11.6 — openapi.yml L240-259

PASS — Direct keywords: 200, 404, 422, article, error, found, generic, get, slug

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

### 138. AC-11.1 — routing.md L14-17

PASS — Direct keywords: article, author, comment, markdown, section, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L14-L17

````text
- Article page (URL: `/article/article-slug-here` )
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
````

### 139. AC-11.2 — endpoints.md L136-140

PASS — Direct keywords: article, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L136-L140

````text
### Get Article

`GET /api/articles/:slug`

No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 140. AC-11.3 — openapi.yml L240-259

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

### 141. BR-12.1 — routing.md L5-7

PASS — Direct keywords: feed, global, home

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L5-L7

````text
- Home page (URL: `/` )
  - List of tags
  - List of articles pulled from either Feed, Global, or by Tag
````

### 142. BR-12.1 — templates.md L118-120

PASS — Direct keywords: default, feed, global, home, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L118-L120

````text
The Home page includes up to three tabs:

- a default **Global Feed** tab
````

### 143. BR-12.2 — endpoints.md L102

PASS — Direct keywords: article, author, most, recent

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L102

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results
````

### 144. BR-12.2 — endpoints.md L126

PASS — Direct keywords: article, authentication, first, most, recent

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 145. BR-12.3 — api-response-format.md L62-67

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

### 146. BR-12.3 — api-response-format.md L102

PASS — Direct keywords: article, count

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 147. BR-12.4 — templates.md L145-185

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

### 148. BR-12.5 — openapi.yml L697-745

PASS — Direct keywords: article, author, count, created, description, favorite, favorited, integer, list, profile, slug, tag, title, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L697-L745

````text
    MultipleArticlesResponse:
      description: Multiple articles
      content:
        application/json:
          schema:
            required:
              - articles
              - articlesCount
            type: object
            properties:
              articles:
                type: array
                items:
                  required:
                    - author
                    - createdAt
                    - description
                    - favorited
                    - favoritesCount
                    - slug
                    - tagList
                    - title
                    - updatedAt
                  type: object
                  properties:
                    slug:
                      type: string
                    title:
                      type: string
                    description:
                      type: string
                    tagList:
                      type: array
                      items:
                        type: string
                    createdAt:
                      type: string
                      format: date-time
                    updatedAt:
                      type: string
                      format: date-time
                    favorited:
                      type: boolean
                    favoritesCount:
                      type: integer
                    author:
                      $ref: '#/components/schemas/Profile'
              articlesCount:
                type: integer
````

### 149. BR-12.5 — api-response-format.md L62-67

PASS — Direct keywords: article, body, feed, list

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L62-L67

````text
:::caution
Starting from the 2024/08/16, the endpoints retrieving a list of articles do no longer return the body of an article for performance reasons.
It affects:
- `GET /api/articles`
- `GET /api/articles/feed`
:::
````

### 150. BR-12.6 — openapi.yml L183-213

PASS — Direct keywords: 200, 401, 422, article, auth, error, generic, get, multiple, optional, unauthorized

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L183-L213

````text
      tags:
        - Articles
      summary: Get recent articles globally
      description: Get most recent articles globally. Use query parameters to filter
        results. Auth is optional
      operationId: GetArticles
      parameters:
        - name: tag
          in: query
          description: Filter by tag
          schema:
            type: string
        - name: author
          in: query
          description: Filter by author (username)
          schema:
            type: string
        - name: favorited
          in: query
          description: Filter by favorites of a user (username)
          schema:
            type: string
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        '200':
          $ref: '#/components/responses/MultipleArticlesResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 151. BR-12.7 — templates.md L126-131

PASS — Direct keywords: banner, conduit, knowledge, place, share

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L126-L131

````text
  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>
````

### 152. AC-12.1 — templates.md L120

PASS — Direct keywords: feed, global, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L120-L120

````text
- a default **Global Feed** tab
````

### 153. AC-12.1 — endpoints.md L126

PASS — Direct keywords: article, first

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 154. AC-12.2 — endpoints.md L126

PASS — Direct keywords: article, first, ordered

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 155. AC-12.2 — api-response-format.md L62-67

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

### 156. AC-12.2 — api-response-format.md L102

PASS — Direct keywords: article, count

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 157. BR-13.1 — templates.md L122

PASS — Direct keywords: after, appear, feed, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 158. BR-13.2 — endpoints.md L134

PASS — Direct keywords: article, authentication, first, followed

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 159. BR-13.3 — endpoints.md L132

PASS — Direct keywords: like, limit, list, offset

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L132-L132

````text
Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)
````

### 160. BR-13.4 — openapi.yml L164-180

PASS — Direct keywords: 200, 401, 422, article, error, feed, generic, get, multiple, unauthorized

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L164-L180

````text
        - Articles
      summary: Get recent articles from users you follow
      description: Get most recent articles from users you follow. Use query parameters
        to limit. Auth is required
      operationId: GetArticlesFeed
      parameters:
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        '200':
          $ref: '#/components/responses/MultipleArticlesResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
````

### 161. AC-13.1 — templates.md L122

PASS — Direct keywords: feed, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 162. AC-13.2 — templates.md L122

PASS — Direct keywords: feed, tab

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 163. AC-13.3 — endpoints.md L134

PASS — Direct keywords: article, followed

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 164. AC-13.4 — endpoints.md L134

PASS — Direct keywords: article

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 165. AC-13.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 166. BR-14.1 — routing.md L6

PASS — Direct keywords: list, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L6-L6

````text
  - List of tags
````

### 167. BR-14.1 — templates.md L203

PASS — Direct keywords: popular, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L203-L203

````text
          <p>Popular Tags</p>
````

### 168. BR-14.2 — templates.md L121

PASS — Direct keywords: after, clicking, tab, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L121-L121

````text
- an optional **tag name** tab, appears after clicking one of the popular tags
````

### 169. BR-14.2 — endpoints.md L106-108

PASS — Direct keywords: tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L106-L108

````text
Filter by tag:

`?tag=AngularJS`
````

### 170. BR-14.3 — endpoints.md L239-243

PASS — Direct keywords: authentication, get, list, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L239-L243

````text
### Get Tags

`GET /api/tags`

No authentication required, returns a [List of Tags](/specifications/backend/api-response-format#list-of-tags)
````

### 171. BR-14.3 — api-response-format.md L146-152

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

### 172. BR-14.4 — openapi.yml L443-453

PASS — Direct keywords: 200, 422, error, generic, get, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L443-L453

````text
    get:
      tags:
        - Tags
      summary: Get tags
      description: Get tags. Auth not required
      operationId: GetTags
      responses:
        '200':
          $ref: '#/components/responses/TagsResponse'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 173. BR-14.4 — openapi.yml L649-661

PASS — Direct keywords: array, string, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L649-L661

````text
    TagsResponse:
      description: Tags
      content:
        application/json:
          schema:
            required:
              - tags
            type: object
            properties:
              tags:
                type: array
                items:
                  type: string
````

### 174. AC-14.1 — templates.md L121

PASS — Direct keywords: appear, tab, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L121-L121

````text
- an optional **tag name** tab, appears after clicking one of the popular tags
````

### 175. AC-14.2 — api-response-format.md L146-152

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

### 176. AC-14.3 — endpoints.md L106-108

PASS — Direct keywords: filter, tag

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L106-L108

````text
Filter by tag:

`?tag=AngularJS`
````

### 177. BR-15.1 — routing.md L8

PASS — Direct keywords: article, list

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L8-L8

````text
  - Pagination for list of articles
````

### 178. BR-15.1 — templates.md L191-196

PASS — Reviewed exception: pagination markup = lists are paginated — Dmitry, 2026-11-18

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L191-L196

````text
        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
````

### 179. BR-15.2 — endpoints.md L118-124

PASS — Direct keywords: 0, 20, article, default, limit, offset

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L124

````text
Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`
````

### 180. BR-15.2 — openapi.yml L895-911

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

### 181. BR-15.3 — endpoints.md L132

PASS — Direct keywords: parameter

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L132-L132

````text
Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)
````

### 182. BR-15.5 — openapi.yml L895-911

PASS — Direct keywords: 0, 1, 20, default, integer, item, limit, minimum, number, offset, query, skip

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

### 183. BR-15.6 — templates.md L191-196

PASS — Direct keywords: active, item, link, pagination

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L191-L196

````text
        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
````

### 184. AC-15.1 — templates.md L191-196

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

### 185. AC-15.2 — endpoints.md L118

PASS — BA-ASSUMPTION: The assertion on total articlesCount awaits OQ-15.3; only its presence/type is explicit.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L118

````text
Limit number of articles (default is 20):
````

### 186. AC-15.2 — api-response-format.md L102

PASS — BA-ASSUMPTION: The assertion on total articlesCount awaits OQ-15.3; only its presence/type is explicit.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 187. AC-15.3 — endpoints.md L118-124

PASS — Direct keywords: 20, article, limit, offset

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L124

````text
Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`
````

### 188. BR-16.1 — templates.md L562-566

PASS — Direct keywords: comment, form, post, write

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L562-L566

````text
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
````

### 189. BR-16.1 — routing.md L17

PASS — Direct keywords: bottom, comment, section

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L17-L17

````text
  - Comments section at bottom of page
````

### 190. BR-16.2 — endpoints.md L207-209

PASS — Direct keywords: authentication, body, comment, created

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L207-L209

````text
Authentication required, returns the created [Comment](/specifications/backend/api-response-format#single-comment)

Required field: `body`
````

### 191. BR-16.2 — api-response-format.md L108-122

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

### 192. BR-16.2 — openapi.yml L338-365

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

### 193. BR-16.3 — features.md L10

PASS — Direct keywords: comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L10-L10

````text
- CR-D Comments on articles (no updating required)
````

### 194. BR-16.4 — openapi.yml L630-636

PASS — Direct keywords: body, comment, object

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L630-L636

````text
    NewComment:
      required:
        - body
      type: object
      properties:
        body:
          type: string
````

### 195. BR-16.4 — openapi.yml L882-893

PASS — Direct keywords: comment, create, object

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L882-L893

````text
    NewCommentRequest:
      required: true
      description: Comment you want to create
      content:
        application/json:
          schema:
            required:
              - comment
            type: object
            properties:
              comment:
                $ref: '#/components/schemas/NewComment'
````

### 196. BR-16.5 — openapi.yml L609-629

PASS — Direct keywords: author, body, comment, created, date, integer, profile, string, time, updated

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L609-L629

````text
    Comment:
      required:
        - author
        - body
        - createdAt
        - id
        - updatedAt
      type: object
      properties:
        id:
          type: integer
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        body:
          type: string
        author:
          $ref: '#/components/schemas/Profile'
````

### 197. BR-16.6 — openapi.yml L338-365

PASS — Direct keywords: 201, 401, 404, 422, article, comment, error, found, generic, slug, unauthorized

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

### 198. AC-16.1 — templates.md L562-566

PASS — Direct keywords: comment, post, write

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L562-L566

````text
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
````

### 199. AC-16.2 — openapi.yml L338-365

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

### 200. AC-16.2 — api-response-format.md L108-122

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

### 201. AC-16.3 — endpoints.md L209

PASS — Direct keywords: body

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L209-L209

````text
Required field: `body`
````

### 202. AC-16.3 — error-handling.md L7

PASS — Direct keywords: 422

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 203. AC-16.4 — endpoints.md L207

PASS — Direct keywords: comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L207-L207

````text
Authentication required, returns the created [Comment](/specifications/backend/api-response-format#single-comment)
````

### 204. AC-16.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 205. BR-17.1 — endpoints.md L211-215

PASS — Direct keywords: article, authentication, comment, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L211-L215

````text
### Get Comments from an Article

`GET /api/articles/:slug/comments`

Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 206. BR-17.1 — api-response-format.md L127-141

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

### 207. BR-17.2 — templates.md L577-582

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

### 208. BR-17.3 — features.md L10

PASS — Direct keywords: comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L10-L10

````text
- CR-D Comments on articles (no updating required)
````

### 209. BR-17.4 — openapi.yml L315-337

PASS — Direct keywords: 200, 401, 404, 422, article, auth, comment, error, found, generic, get, optional, slug, unauthorized

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L315-L337

````text
      description: Get the comments for an article. Auth is optional
      operationId: GetArticleComments
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to get comments for
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/MultipleCommentsResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    post:
      tags:
        - Comments
      summary: Create a comment for an article
      description: Create a comment for an article. Auth is required
````

### 210. BR-17.4 — openapi.yml L675-685

PASS — Direct keywords: array, comment

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L675-L685

````text
      content:
        application/json:
          schema:
            required:
              - comments
            type: object
            properties:
              comments:
                type: array
                items:
                  $ref: '#/components/schemas/Comment'
````

### 211. AC-17.1 — templates.md L577-582

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

### 212. AC-17.2 — endpoints.md L211-215

PASS — Direct keywords: article, comment, get, slug

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L211-L215

````text
### Get Comments from an Article

`GET /api/articles/:slug/comments`

Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 213. BR-18.1 — endpoints.md L217-221

PASS — Direct keywords: authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L217-L221

````text
### Delete Comment

`DELETE /api/articles/:slug/comments/:id`

Authentication required
````

### 214. BR-18.1 — openapi.yml L366-398

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

### 215. BR-18.2 — routing.md L18

PASS — Direct keywords: author, comment, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 216. BR-18.2 — templates.md L599-600

PASS — Citation-set context: This range exists but has no direct wording keyword. Supporting citation in the same item: routing.md L18 (author, comment, delete)

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L599-L600

````text
            <span class="mod-options">
              <i class="ion-trash-a"></i>
````

### 217. BR-18.4 — openapi.yml L366-398

PASS — Direct keywords: 204, 401, 403, 404, 422, article, comment, delete, error, forbidden, found, generic, integer, parameter, path, slug, unauthorized

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

### 218. BR-18.4 — openapi.yml L768-770

PASS — Direct keywords: content

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L768-L770

````text
    EmptyOkResponse:
      description: No content
      content: { }
````

### 219. AC-18.1 — templates.md L599-600

PASS — Citation-set context: This range exists but has no direct wording keyword. Supporting citation in the same item: routing.md L18 (author, comment, delete)

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L599-L600

````text
            <span class="mod-options">
              <i class="ion-trash-a"></i>
````

### 220. AC-18.1 — routing.md L18

PASS — Direct keywords: author, comment, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 221. AC-18.2 — routing.md L18

PASS — Direct keywords: comment, delete

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 222. AC-18.3 — openapi.yml L366-398

PASS — BA-ASSUMPTION: API author-only comment deletion awaits OQ-18.2; 403 is declared without this predicate.; range exists; not asserted as explicit specification behaviour.

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

### 223. BR-19.1 — endpoints.md L82-96

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

### 224. BR-19.3 — templates.md L305

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 225. BR-19.3 — templates.md L498

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L498-L498

````text
          &nbsp; Follow Eric Simons <span class="counter">(10)</span>
````

### 226. BR-19.4 — openapi.yml L118-141

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

### 227. BR-19.5 — endpoints.md L134

PASS — Direct keywords: article, followed

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 228. BR-19.6 — endpoints.md L82-96

PASS — Direct keywords: additional, follow, parameter, profile, unfollow

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

### 229. BR-19.6 — openapi.yml L118-160

PASS — Direct keywords: 200, 401, 404, 422, error, follow, found, generic, parameter, profile, unauthorized, unfollow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L118-L160

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
      operationId: UnfollowUserByUsername
      parameters:
        - name: username
          in: path
          description: Username of the profile you want to unfollow
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
````

### 230. AC-19.1 — templates.md L305

PASS — Direct keywords: follow

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 231. AC-19.1 — endpoints.md L134

PASS — Direct keywords: article

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 232. AC-19.2 — endpoints.md L82-88

PASS — BA-ASSUMPTION: The following=true interpretation awaits OQ-19.4; the schema states only boolean type.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L82-L88

````text
### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 233. AC-19.3 — endpoints.md L90-96

PASS — BA-ASSUMPTION: The following=false interpretation awaits OQ-19.4; the schema states only boolean type.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L90-L96

````text
### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 234. AC-19.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 235. BR-20.1 — endpoints.md L223-237

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

### 236. BR-20.3 — templates.md L155

PASS — Direct keywords: heart

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L155-L155

````text
              <i class="ion-heart"></i> 29
````

### 237. BR-20.3 — templates.md L503

PASS — Reviewed exception: "Favorite Post (29)" = heart with count on the article page — Dmitry, 2026-11-18

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L503-L503

````text
          &nbsp; Favorite Post <span class="counter">(29)</span>
````

### 238. BR-20.4 — routing.md L19-21

PASS — Direct keywords: article, profile

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L21

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
  - Show basic user info
  - List of articles populated from author's created articles or author's favorited articles
````

### 239. BR-20.5 — endpoints.md L223-237

PASS — Direct keywords: additional, article, favorite, parameter, unfavorite

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

### 240. BR-20.5 — openapi.yml L399-441

PASS — Direct keywords: 200, 401, 404, 422, article, error, favorite, found, generic, parameter, unauthorized, unfavorite

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L399-L441

````text
      operationId: CreateArticleFavorite
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to favorite
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
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
        - Favorites
      summary: Unfavorite an article
      description: Unfavorite an article. Auth is required
      operationId: DeleteArticleFavorite
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to unfavorite
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
````

### 241. AC-20.1 — templates.md L155

PASS — BA-ASSUMPTION: Favourite count/state transitions await OQ-20.3; the example is not a transition rule.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L155-L155

````text
              <i class="ion-heart"></i> 29
````

### 242. AC-20.1 — api-response-format.md L48-49

PASS — BA-ASSUMPTION: Favourite count/state transitions await OQ-20.3; the example is not a transition rule.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 243. AC-20.2 — endpoints.md L223-229

PASS — BA-ASSUMPTION: The favorited=true and favoritesCount transition interpretation awaits OQ-20.3.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L223-L229

````text
### Favorite Article

`POST /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 244. AC-20.3 — endpoints.md L231-237

PASS — BA-ASSUMPTION: The favorited=false transition interpretation awaits OQ-20.3.; range exists; not asserted as explicit specification behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L231-L237

````text
### Unfavorite Article

`DELETE /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 245. AC-20.4 — error-handling.md L21

PASS — Direct keywords: 401

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 246. BR-21.1 — templates.md L36-40

PASS — Direct keywords: header, home, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 247. BR-21.2 — templates.md L66-71

PASS — Direct keywords: article, header, home, link, new, profile, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L66-L71

````text
If a user is logged in, then the header should include links to:

- the home page
- the new article page
- the settings page
- the profile page
````

### 248. BR-21.3 — templates.md L42

PASS — Direct keywords: active, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L42-L42

````text
> the link of the active page should use the **active** css class.
````

### 249. BR-21.3 — templates.md L73

PASS — Direct keywords: active, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L73-L73

````text
> the link of the active page should use the **active** css class.
````

### 250. BR-21.4 — templates.md L14

PASS — Direct keywords: conduit, title

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L14-L14

````text
  <title>Conduit</title>
````

### 251. BR-21.4 — templates.md L103-111

PASS — Direct keywords: code, conduit, design, footer, interactive, learning, licensed, mit, project, under

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L103-L111

````text
```html
<footer>
  <div class="container">
    <a href="/" class="logo-font">conduit</a>
    <span class="attribution">
      An interactive learning project. Code &amp; design licensed under MIT.
    </span>
  </div>
</footer>
````

### 252. BR-21.5 — styles.md L16-18

PASS — Direct keywords: avatar, default, display, face, icon, image, profile, smiley, user

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/styles.md#L16-L18

````text
### Default Avatar

When a user has no profile image, implementations should display the [default avatar](https://github.com/realworld-apps/realworld/blob/main/assets/media/default-avatar.svg) (a smiley face icon).
````

### 253. AC-21.1 — templates.md L36-40

PASS — Direct keywords: header, home

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 254. AC-21.2 — templates.md L66-71

PASS — Direct keywords: article, header, home, new, profile, setting

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L66-L71

````text
If a user is logged in, then the header should include links to:

- the home page
- the new article page
- the settings page
- the profile page
````

### 255. AC-21.3 — templates.md L73

PASS — Direct keywords: active, link

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L73-L73

````text
> the link of the active page should use the **active** css class.
````

### 256. BR-22.1 — error-handling.md L7-17

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

### 257. BR-22.2 — error-handling.md L21

PASS — Direct keywords: 401, authentication

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 258. BR-22.3 — error-handling.md L23

PASS — Direct keywords: 403, user, valid

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 259. BR-22.4 — error-handling.md L25

PASS — Direct keywords: 404

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 260. BR-22.5 — openapi.yml L791-810

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

### 261. BR-22.6 — api-response-format.md L7

PASS — Direct keywords: 8, application, charset, content, json, type, utf

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L7-L7

````text
Make sure the right content type like `Content-Type: application/json; charset=utf-8` is correctly returned.
````

### 262. BR-22.7 — openapi.yml L771-780

PASS — Direct keywords: error, example, missing, model, token, unauthorized

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

### 263. BR-22.8 — openapi.yml L637-647

PASS — Direct keywords: array, error, model, string, type

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L637-L647

````text
    GenericErrorModel:
      required:
        - errors
      type: object
      properties:
        errors:
          type: object
          additionalProperties:
            type: array
            items:
              type: string
````

### 264. BR-22.8 — openapi.yml L791-810

PASS — Direct keywords: error, example, forbidden, found, identifie, key, model, resource, type

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

### 265. AC-22.1 — error-handling.md L7-25

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

### 266. AC-22.2 — error-handling.md L7-17

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

### 267. BR-23.1 — cors.md L7

PASS — Direct keywords: acces, allow, backend, content, control, correct, different, frontend, header, host, option, origin, port, run, type

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 268. AC-23.1 — cors.md L7

PASS — Direct keywords: acces, allow, content, control, different, header, option, origin, run, type

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 269. OQ-01.1 — openapi.yml L44-60

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

### 270. OQ-01.2 — openapi.yml L781-790

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

### 271. OQ-01.3 — routing.md L19

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L19

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
````

### 272. OQ-01.4 — routing.md L9

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L9

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
````

### 273. OQ-02.1 — openapi.yml L28-42

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

### 274. OQ-02.1 — error-handling.md L7

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 275. OQ-02.2 — openapi.yml L28-42

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

### 276. OQ-02.3 — routing.md L10

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 277. OQ-03.1 — routing.md L10

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 278. OQ-03.2 — error-handling.md L21

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 279. OQ-04.1 — templates.md L430

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L430-L430

````text
        <button class="btn btn-outline-danger">Or click here to logout.</button>
````

### 280. OQ-04.2 — routing.md L10

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 281. OQ-05.1 — openapi.yml L76-94

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

### 282. OQ-05.2 — templates.md L423

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L423-L423

````text
                placeholder="New Password"
````

### 283. OQ-05.3 — templates.md L407

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L407-L407

````text
              <input class="form-control form-control-lg" type="text" placeholder="Your Name" />
````

### 284. OQ-05.4 — endpoints.md L74

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 285. OQ-05.5 — templates.md L404

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L404-L404

````text
              <input class="form-control" type="text" placeholder="URL of profile picture" />
````

### 286. OQ-06.1 — templates.md L305-309

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L309

````text
            &nbsp; Follow Eric Simons
          </button>
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-gear-a"></i>
            &nbsp; Edit Profile Settings
````

### 287. OQ-07.1 — templates.md L322

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L322-L322

````text
              <a class="nav-link active" href="">My Articles</a>
````

### 288. OQ-07.2 — endpoints.md L102-116

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

### 289. OQ-07.3 — endpoints.md L110-116

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L110-L116

````text
Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`
````

### 290. OQ-08.1 — openapi.yml L219-239

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

### 291. OQ-08.1 — endpoints.md L185

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L185-L185

````text
> The `slug` is the article's URL identifier. The spec only requires it to be a unique string that you can use to fetch, update, and delete the article — duplicate titles must still produce distinct slugs. How you derive it is up to your implementation (commonly a kebab-cased title); no particular format is enforced by the test suite.
````

### 292. OQ-08.2 — endpoints.md L163

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L163-L163

````text
Optional fields: `tagList` as an array of Strings
````

### 293. OQ-08.3 — endpoints.md L161

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L161

````text
Required fields: `title`, `description`, `body`
````

### 294. OQ-08.4 — templates.md L470

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L470-L470

````text
              Publish Article
````

### 295. OQ-09.1 — endpoints.md L181

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L181-L181

````text
Optional fields: `title`, `description`, `body`
````

### 296. OQ-09.1 — openapi.yml L596-608

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L596-L608

````text
    UpdateArticle:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
````

### 297. OQ-09.2 — templates.md L482

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 298. OQ-09.2 — templates.md L506

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L506-L506

````text
          <i class="ion-edit"></i> Edit Article
````

### 299. OQ-09.3 — endpoints.md L183

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L183

````text
The `slug` also gets updated when the `title` is changed
````

### 300. OQ-10.1 — templates.md L509

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L509-L509

````text
          <i class="ion-trash-a"></i> Delete Article
````

### 301. OQ-10.2 — endpoints.md L187-191

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L187-L191

````text
### Delete Article

`DELETE /api/articles/:slug`

Authentication required
````

### 302. OQ-10.3 — routing.md L15

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 303. OQ-11.1 — endpoints.md L140

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L140-L140

````text
No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 304. OQ-11.1 — api-response-format.md L48-54

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

### 305. OQ-11.2 — routing.md L16

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L16-L16

````text
  - Render markdown from server client side
````

### 306. OQ-12.1 — routing.md L7

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L7-L7

````text
  - List of articles pulled from either Feed, Global, or by Tag
````

### 307. OQ-13.1 — templates.md L120-122

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L120-L122

````text
- a default **Global Feed** tab
- an optional **tag name** tab, appears after clicking one of the popular tags
- an optional **Your Feed** tab, appears after logging in
````

### 308. OQ-13.2 — endpoints.md L134

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 309. OQ-13.3 — endpoints.md L134

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 310. OQ-14.1 — templates.md L203

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L203-L203

````text
          <p>Popular Tags</p>
````

### 311. OQ-14.1 — endpoints.md L243

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L243-L243

````text
No authentication required, returns a [List of Tags](/specifications/backend/api-response-format#list-of-tags)
````

### 312. OQ-14.2 — endpoints.md L108

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L108-L108

````text
`?tag=AngularJS`
````

### 313. OQ-15.1 — templates.md L191-196

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

### 314. OQ-15.2 — openapi.yml L895-911

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

### 315. OQ-16.1 — templates.md L562-566

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L562-L566

````text
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
````

### 316. OQ-16.2 — endpoints.md L209

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L209-L209

````text
Required field: `body`
````

### 317. OQ-17.1 — endpoints.md L215

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L215-L215

````text
Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 318. OQ-17.2 — endpoints.md L211-215

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L211-L215

````text
### Get Comments from an Article

`GET /api/articles/:slug/comments`

Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 319. OQ-18.1 — routing.md L18

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 320. OQ-19.1 — templates.md L498

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L498-L498

````text
          &nbsp; Follow Eric Simons <span class="counter">(10)</span>
````

### 321. OQ-19.1 — api-response-format.md L25-33

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

### 322. OQ-19.2 — endpoints.md L82-88

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L82-L88

````text
### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 323. OQ-19.3 — templates.md L305

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L305

````text
            &nbsp; Follow Eric Simons
````

### 324. OQ-20.1 — endpoints.md L223-229

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L223-L229

````text
### Favorite Article

`POST /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 325. OQ-20.2 — templates.md L155

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L155-L155

````text
              <i class="ion-heart"></i> 29
````

### 326. OQ-21.1 — routing.md L12-13

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L12-L13

````text
- Settings page (URL: `/settings` )
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 327. OQ-21.2 — routing.md L5-21

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

### 328. OQ-22.1 — error-handling.md L9-15

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

### 329. OQ-22.1 — openapi.yml L811-820

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

### 330. OQ-23.1 — cors.md L7

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 331. OQ-03.3 — routing.md L10

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 332. OQ-09.4 — openapi.yml L260-288

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

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

### 333. OQ-09.4 — error-handling.md L23

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 334. OQ-09.4 — templates.md L482

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 335. OQ-10.4 — routing.md L15

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 336. OQ-10.4 — openapi.yml L289-315

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

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

### 337. OQ-10.4 — error-handling.md L23

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 338. OQ-18.2 — routing.md L18

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 339. OQ-18.2 — openapi.yml L366-398

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

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

### 340. OQ-18.2 — error-handling.md L23

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 341. OQ-19.4 — api-response-format.md L25-33

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

### 342. OQ-19.4 — openapi.yml L521-540

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L521-L540

````text
    Profile:
      required:
        - bio
        - following
        - image
        - username
      type: object
      properties:
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
        following:
          type: boolean
````

### 343. OQ-15.3 — api-response-format.md L102

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 344. OQ-15.3 — openapi.yml L697-745

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L697-L745

````text
    MultipleArticlesResponse:
      description: Multiple articles
      content:
        application/json:
          schema:
            required:
              - articles
              - articlesCount
            type: object
            properties:
              articles:
                type: array
                items:
                  required:
                    - author
                    - createdAt
                    - description
                    - favorited
                    - favoritesCount
                    - slug
                    - tagList
                    - title
                    - updatedAt
                  type: object
                  properties:
                    slug:
                      type: string
                    title:
                      type: string
                    description:
                      type: string
                    tagList:
                      type: array
                      items:
                        type: string
                    createdAt:
                      type: string
                      format: date-time
                    updatedAt:
                      type: string
                      format: date-time
                    favorited:
                      type: boolean
                    favoritesCount:
                      type: integer
                    author:
                      $ref: '#/components/schemas/Profile'
              articlesCount:
                type: integer
````

### 345. OQ-20.3 — api-response-format.md L48-49

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 346. OQ-20.3 — endpoints.md L223-237

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

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

### 347. OQ-03.4 — openapi.yml L93-117

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L93-L117

````text
      summary: Get a profile
      description: Get a profile of a user of the system. Auth is optional
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

### 348. OQ-03.4 — openapi.yml L183-213

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L183-L213

````text
      tags:
        - Articles
      summary: Get recent articles globally
      description: Get most recent articles globally. Use query parameters to filter
        results. Auth is optional
      operationId: GetArticles
      parameters:
        - name: tag
          in: query
          description: Filter by tag
          schema:
            type: string
        - name: author
          in: query
          description: Filter by author (username)
          schema:
            type: string
        - name: favorited
          in: query
          description: Filter by favorites of a user (username)
          schema:
            type: string
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        '200':
          $ref: '#/components/responses/MultipleArticlesResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 349. OQ-03.4 — openapi.yml L315-337

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L315-L337

````text
      description: Get the comments for an article. Auth is optional
      operationId: GetArticleComments
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to get comments for
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/MultipleCommentsResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    post:
      tags:
        - Comments
      summary: Create a comment for an article
      description: Create a comment for an article. Auth is required
````

### 350. OQ-01.5 — openapi.yml L456-480

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L456-L480

````text
    LoginUser:
      required:
        - email
        - password
      type: object
      properties:
        email:
          type: string
        password:
          type: string
          format: password
    NewUser:
      required:
        - email
        - password
        - username
      type: object
      properties:
        username:
          type: string
        email:
          type: string
        password:
          type: string
          format: password
````

### 351. OQ-07.4 — endpoints.md L102-126

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L126

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 352. OQ-15.4 — endpoints.md L118-134

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L134

````text
Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first

### Feed Articles

`GET /api/articles/feed`

Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)

Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 353. OQ-20.4 — endpoints.md L231-237

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L231-L237

````text
### Unfavorite Article

`DELETE /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 354. OQ-19.5 — endpoints.md L90-96

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L90-L96

````text
### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 355. OQ-05.6 — openapi.yml L76-94

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

### 356. OQ-05.6 — openapi.yml L846-857

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L846-L857

````text
    UpdateUserRequest:
      required: true
      description: User details to update. At least **one** field is required.
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/UpdateUser'
````

### 357. OQ-05.6 — endpoints.md L74

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 358. OQ-21.3 — routing.md L5-21

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

### 359. OQ-21.3 — templates.md L145-155

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L145-L155

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
````

### 360. OQ-21.3 — templates.md L231-247

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

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

### 361. OQ-22.2 — openapi.yml L567-572

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L567-L572

````text
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
````

### 362. OQ-22.2 — api-response-format.md L46-47

PASS — Open-question existence: File and range exist; keywords not applicable to specification silence.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L46-L47

````text
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
````

## Retired original citation audit

### 1. BR-02.4 — openapi.yml L28-42

PASS — Retired assertion — range only: Converted to OQ-02.1; see CHANGELOG. Not counted as current supported behaviour.

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

### 2. BR-03.4 — routing.md L10

PASS — Retired assertion — range only: Converted to OQ-03.3; see CHANGELOG. Not counted as current supported behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 3. BR-09.4 — openapi.yml L260-288

PASS — Retired assertion — range only: Converted to OQ-09.4; see CHANGELOG. Not counted as current supported behaviour.

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

### 4. BR-09.4 — openapi.yml L791-792

PASS — Retired assertion — range only: Converted to OQ-09.4; see CHANGELOG. Not counted as current supported behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 5. BR-10.3 — openapi.yml L289-315

PASS — Retired assertion — range only: Converted to OQ-10.4; see CHANGELOG. Not counted as current supported behaviour.

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

### 6. BR-15.4 — api-response-format.md L102

PASS — Retired assertion — range only: Converted to OQ-15.3; see CHANGELOG. Not counted as current supported behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 7. BR-18.3 — openapi.yml L366-398

PASS — Retired assertion — range only: Converted to OQ-18.2; see CHANGELOG. Not counted as current supported behaviour.

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

### 8. BR-18.3 — openapi.yml L791-792

PASS — Retired assertion — range only: Converted to OQ-18.2; see CHANGELOG. Not counted as current supported behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 9. BR-19.2 — api-response-format.md L25-33

PASS — Retired assertion — range only: Converted to OQ-19.4; see CHANGELOG. Not counted as current supported behaviour.

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

### 10. BR-20.2 — api-response-format.md L48-49

PASS — Retired assertion — range only: Converted to OQ-20.3; see CHANGELOG. Not counted as current supported behaviour.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

## Traceability and change-log citation audit

### 1. X-01 — error-handling.md L23

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 2. X-01 — openapi.yml L275-276

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L275-L276

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 3. X-01 — openapi.yml L302-303

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L302-L303

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 4. X-01 — openapi.yml L385-386

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L385-L386

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 5. X-01 — routing.md L15-18

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L18

````text
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
````

### 6. X-02 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 7. X-02 — openapi.yml L32-37

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L32-L37

````text
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 8. X-03 — openapi.yml L32-37

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L32-L37

````text
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 9. X-03 — openapi.yml L48-53

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L48-L53

````text
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 10. X-03 — openapi.yml L223-230

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L223-L230

````text
        '201':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 11. X-03 — openapi.yml L298-307

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L298-L307

````text
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
````

### 12. X-03 — openapi.yml L349-356

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L349-L356

````text
        '201':
          $ref: '#/components/responses/SingleCommentResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 13. X-03 — openapi.yml L381-390

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L381-L390

````text
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
````

### 14. X-04 — openapi.yml L48-53

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L48-L53

````text
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 15. X-04 — openapi.yml L223-230

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L223-L230

````text
        '201':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 16. X-04 — openapi.yml L781-790

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 17. X-05 — error-handling.md L9-15

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 18. X-05 — openapi.yml L811-820

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 19. X-06 — openapi.yml L456-480

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L456-L480

````text
    LoginUser:
      required:
        - email
        - password
      type: object
      properties:
        email:
          type: string
        password:
          type: string
          format: password
    NewUser:
      required:
        - email
        - password
        - username
      type: object
      properties:
        username:
          type: string
        email:
          type: string
        password:
          type: string
          format: password
````

### 20. X-06 — openapi.yml L579-608

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L579-L608

````text
    NewArticle:
      required:
        - body
        - description
        - title
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
    UpdateArticle:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
````

### 21. X-06 — endpoints.md L161-163

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L163

````text
Required fields: `title`, `description`, `body`

Optional fields: `tagList` as an array of Strings
````

### 22. X-07 — endpoints.md L183-185

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L185

````text
The `slug` also gets updated when the `title` is changed

> The `slug` is the article's URL identifier. The spec only requires it to be a unique string that you can use to fetch, update, and delete the article — duplicate titles must still produce distinct slugs. How you derive it is up to your implementation (commonly a kebab-cased title); no particular format is enforced by the test suite.
````

### 23. X-08 — endpoints.md L163

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L163-L163

````text
Optional fields: `tagList` as an array of Strings
````

### 24. X-08 — endpoints.md L243

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L243-L243

````text
No authentication required, returns a [List of Tags](/specifications/backend/api-response-format#list-of-tags)
````

### 25. X-08 — templates.md L203

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L203-L203

````text
          <p>Popular Tags</p>
````

### 26. X-09 — endpoints.md L102-126

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L126

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 27. X-10 — endpoints.md L118-134

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L134

````text
Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first

### Feed Articles

`GET /api/articles/feed`

Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)

Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 28. X-10 — endpoints.md L215

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L215-L215

````text
Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 29. X-10 — openapi.yml L895-911

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 30. X-11 — openapi.yml L93-117

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L93-L117

````text
      summary: Get a profile
      description: Get a profile of a user of the system. Auth is optional
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

### 31. X-11 — openapi.yml L183-213

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L183-L213

````text
      tags:
        - Articles
      summary: Get recent articles globally
      description: Get most recent articles globally. Use query parameters to filter
        results. Auth is optional
      operationId: GetArticles
      parameters:
        - name: tag
          in: query
          description: Filter by tag
          schema:
            type: string
        - name: author
          in: query
          description: Filter by author (username)
          schema:
            type: string
        - name: favorited
          in: query
          description: Filter by favorites of a user (username)
          schema:
            type: string
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        '200':
          $ref: '#/components/responses/MultipleArticlesResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 32. X-11 — openapi.yml L315-337

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L315-L337

````text
      description: Get the comments for an article. Auth is optional
      operationId: GetArticleComments
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to get comments for
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/MultipleCommentsResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    post:
      tags:
        - Comments
      summary: Create a comment for an article
      description: Create a comment for an article. Auth is required
````

### 33. X-11 — routing.md L10

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 34. X-12 — endpoints.md L82-96

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 35. X-12 — endpoints.md L223-237

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 36. X-13 — openapi.yml L76-94

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 37. X-13 — openapi.yml L846-857

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L846-L857

````text
    UpdateUserRequest:
      required: true
      description: User details to update. At least **one** field is required.
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/UpdateUser'
````

### 38. X-14 — endpoints.md L187-191

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L187-L191

````text
### Delete Article

`DELETE /api/articles/:slug`

Authentication required
````

### 39. X-14 — features.md L8-10

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L8-L10

````text
- CRU- users (sign up & settings page - no deleting required)
- CRUD Articles
- CR-D Comments on articles (no updating required)
````

### 40. X-15 — openapi.yml L298-299

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L298-L299

````text
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
````

### 41. X-15 — openapi.yml L381-382

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L381-L382

````text
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
````

### 42. X-15 — openapi.yml L768-770

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L768-L770

````text
    EmptyOkResponse:
      description: No content
      content: { }
````

### 43. X-16 — routing.md L16

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L16-L16

````text
  - Render markdown from server client side
````

### 44. X-16 — api-response-format.md L44

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L44-L44

````text
    "body": "It takes a Jacobian",
````

### 45. X-17 — routing.md L5-21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 46. X-17 — templates.md L231-247

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 47. X-17 — templates.md L470

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L470-L470

````text
              Publish Article
````

### 48. X-17 — templates.md L509

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L509-L509

````text
          <i class="ion-trash-a"></i> Delete Article
````

### 49. X-18 — routing.md L16

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L16-L16

````text
  - Render markdown from server client side
````

### 50. X-19 — templates.md L482

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 51. X-19 — templates.md L495-509

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L495-L509

````text
        </div>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i>
          &nbsp; Follow Eric Simons <span class="counter">(10)</span>
        </button>
        &nbsp;&nbsp;
        <button class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i>
          &nbsp; Favorite Post <span class="counter">(29)</span>
        </button>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> Edit Article
        </button>
        <button class="btn btn-sm btn-outline-danger">
          <i class="ion-trash-a"></i> Delete Article
````

### 52. X-20 — templates.md L7-26

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L7-L26

````text
The `<head>` element includes the page metadata (title, description) and loads the stylesheet.

Load the shared [Conduit theme](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css) plus the fonts and icons it relies on. `styles.css` does **not** bundle fonts or icons, so the head below loads all three; see the [Styles](/specifications/frontend/styles/) page for details.

```html
<head>
  <meta charset="utf-8" />
  <title>Conduit</title>
  <!-- Icons: the ion-* classes used in the templates below (legacy Ionicons v2) -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"
  />
  <!-- Fonts the theme uses -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700|Lora:400,700"
  />
  <!-- The shared Conduit theme (serve styles.css from your own app) -->
  <link rel="stylesheet" href="/styles.css" />
````

### 53. X-20 — styles.md L5-14

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/styles.md#L5-L14

````text
All frontend implementations should use the shared [styles.css](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css) file from the main repository. This is a single CSS file (Conduit Minimal CSS v4) that includes only the classes actually used by Conduit.

The CSS classes it provides match the [templates](/specifications/frontend/templates/) and the [E2E test selectors contract](https://github.com/realworld-apps/realworld/blob/main/specs/e2e/SELECTORS.md).

### Fonts and icons

`styles.css` covers layout and components only — it does **not** bundle fonts or icons, so load these separately in your `<head>`:

- **Fonts:** the theme uses `Source Sans Pro` (body) and `Lora` (headings/article text). Without them, browsers fall back to generic sans-serif/serif. Load them however you prefer (e.g. Google Fonts).
- **Icons:** the templates use `ion-*` classes (`ion-heart`, `ion-compose`, `ion-edit`, `ion-gear-a`, `ion-plus-round`, `ion-trash-a`, `ion-close-round`) from the legacy [Ionicons](https://ionic.io/ionicons) v2 set. Load an icon stylesheet that provides them, or substitute equivalent icons of your own.
````

### 54. X-21 — endpoints.md L64-74

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L64-L74

````text
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

### 55. X-21 — openapi.yml L504-520

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L504-L520

````text
    UpdateUser:
      type: object
      properties:
        email:
          type: string
        password:
          type: string
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
````

### 56. X-22 — openapi.yml L567-572

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L567-L572

````text
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
````

### 57. X-22 — api-response-format.md L46-47

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L46-L47

````text
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
````

### 58. G-01 — error-handling.md L23

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 59. G-01 — openapi.yml L275-276

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L275-L276

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 60. G-01 — routing.md L15-18

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L18

````text
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
````

### 61. G-02 — openapi.yml L781-790

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 62. G-02 — openapi.yml L895-911

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 63. G-03 — openapi.yml L32-37

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L32-L37

````text
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 64. G-03 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 65. G-04 — openapi.yml L48-53

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L48-L53

````text
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 66. G-04 — openapi.yml L298-299

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L298-L299

````text
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
````

### 67. G-04 — openapi.yml L349-356

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L349-L356

````text
        '201':
          $ref: '#/components/responses/SingleCommentResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 68. G-05 — endpoints.md L140

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L140-L140

````text
No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 69. G-05 — api-response-format.md L48-54

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 70. G-06 — templates.md L203

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L203-L203

````text
          <p>Popular Tags</p>
````

### 71. G-06 — endpoints.md L243

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L243-L243

````text
No authentication required, returns a [List of Tags](/specifications/backend/api-response-format#list-of-tags)
````

### 72. G-07 — templates.md L482

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 73. G-08 — routing.md L12-13

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L12-L13

````text
- Settings page (URL: `/settings` )
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 74. G-08 — templates.md L122

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 75. G-09 — endpoints.md L102-124

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L124

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`
````

### 76. G-09 — openapi.yml L895-911

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 77. G-10 — endpoints.md L211-215

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L211-L215

````text
### Get Comments from an Article

`GET /api/articles/:slug/comments`

Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 78. G-11 — frontend-api.md L25-34

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/api.md#L25-L34

````text
## API Limitations

:::info
To avoid the need for content moderation on the public API, the following limitations have been introduced in 2021
:::

The visibility of user content is limited :

- logged out users see only content created by demo accounts
- logged in users see only their content and the content created by demo accounts
````

### 79. Correction G-01 — error-handling.md L23

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 80. Correction G-01 — openapi.yml L275-276

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L275-L276

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 81. Correction G-01 — routing.md L15-18

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L18

````text
  - Delete article button (only shown to article's author)
  - Render markdown from server client side
  - Comments section at bottom of page
  - Delete comment button (only shown to comment's author)
````

### 82. Correction G-03 — openapi.yml L32-37

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L32-L37

````text
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 83. Correction G-03 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 84. Correction G-04 — openapi.yml L48-53

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L48-L53

````text
        '201':
          $ref: '#/components/responses/UserResponse'
        '409':
          $ref: '#/components/responses/ConflictError'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 85. Correction G-04 — openapi.yml L298-299

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L298-L299

````text
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
````

### 86. Correction G-04 — openapi.yml L349-356

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L349-L356

````text
        '201':
          $ref: '#/components/responses/SingleCommentResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 87. Correction G-11 — frontend-api.md L25-34

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/api.md#L25-L34

````text
## API Limitations

:::info
To avoid the need for content moderation on the public API, the following limitations have been introduced in 2021
:::

The visibility of user content is limited :

- logged out users see only content created by demo accounts
- logged in users see only their content and the content created by demo accounts
````

### 88. B-001 — api-response-format.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L7-L7

````text
Make sure the right content type like `Content-Type: application/json; charset=utf-8` is correctly returned.
````

### 89. B-002 — endpoints.md L5-9

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L5-L9

````text
### Authentication Header:

You can read the authentication header from the headers of the request

`Authorization: Token jwt.token.here`
````

### 90. B-002 — openapi.yml L912-922

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L912-L922

````text
  securitySchemes:
    Token:
      type: apiKey
      description: "For accessing the protected API resources, you must have received\
        \ a a valid JWT token after registering or logging in. This JWT token must\
        \ then be used for all protected resources by passing it in via the 'Authorization'\
        \ header.\n\nA JWT token is generated by the API by either registering via\
        \ /users or logging in via /users/login.\n\nThe following format must be in\
        \ the 'Authorization' header :\n\n    Token xxxxxx.yyyyyyy.zzzzzz\n    \n"
      name: Authorization
      in: header
````

### 91. B-003 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 92. B-004 — error-handling.md L7-17

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 93. B-004 — openapi.yml L637-647

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L637-L647

````text
    GenericErrorModel:
      required:
        - errors
      type: object
      properties:
        errors:
          type: object
          additionalProperties:
            type: array
            items:
              type: string
````

### 94. B-005 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 95. B-006 — error-handling.md L23

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 96. B-007 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 97. B-008 — openapi.yml L771-780

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 98. B-009 — openapi.yml L791-800

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L800

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
````

### 99. B-010 — openapi.yml L801-810

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L801-L810

````text
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

### 100. B-011 — openapi.yml L781-790

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 101. B-012 — cors.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 102. B-013 — cors.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 103. B-014 — cors.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/cors.md#L7-L7

````text
If the backend is about to run on a different host/port than the frontend, make sure to handle `OPTIONS` too and return correct `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers` (e.g. `Content-Type`).
````

### 104. B-015 — backend-tests.md L5

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/tests.md#L5-L5

````text
Include _at least_ **one** unit test in your repo to demonstrate how testing works (full testing coverage is _not_ required!)
````

### 105. B-016 — backend-introduction.md L5

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/introduction.md#L5-L5

````text
All backend implementations need to adhere to our [API spec](https://github.com/realworld-apps/realworld/tree/main/specs/api). The full API is described in the [OpenAPI spec](https://github.com/realworld-apps/realworld/blob/main/specs/api/openapi.yml).
````

### 106. U-001 — endpoints.md L26

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L26-L26

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 107. U-002 — endpoints.md L15-24

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L15-L24

````text
Example request body:

```json
{
  "user":{
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```
````

### 108. U-002 — openapi.yml L822-833

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L822-L833

````text
    LoginUserRequest:
      required: true
      description: Credentials to use
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/LoginUser'
````

### 109. U-003 — endpoints.md L28

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L28-L28

````text
Required fields: `email`, `password`
````

### 110. U-003 — openapi.yml L457-459

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L457-L459

````text
      required:
        - email
        - password
````

### 111. U-004 — endpoints.md L28

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L28-L28

````text
Required fields: `email`, `password`
````

### 112. U-004 — openapi.yml L457-459

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L457-L459

````text
      required:
        - email
        - password
````

### 113. U-005 — openapi.yml L32-33

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L32-L33

````text
        '200':
          $ref: '#/components/responses/UserResponse'
````

### 114. U-006 — openapi.yml L34-37

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L34-L37

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 115. U-006 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 116. U-007 — openapi.yml L36-37

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L36-L37

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 117. U-007 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 118. U-008 — openapi.yml L481-503

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L481-L503

````text
    User:
      required:
        - bio
        - email
        - image
        - token
        - username
      type: object
      properties:
        email:
          type: string
        token:
          type: string
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
````

### 119. U-009 — openapi.yml L496-503

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L496-L503

````text
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
````

### 120. U-010 — endpoints.md L46

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L46-L46

````text
No authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 121. U-011 — endpoints.md L34-44

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L34-L44

````text
Example request body:

```json
{
  "user":{
    "username": "Jacob",
    "email": "jake@jake.jake",
    "password": "jakejake"
  }
}
```
````

### 122. U-011 — openapi.yml L834-845

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L834-L845

````text
    NewUserRequest:
      required: true
      description: Details of the new user to register
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/NewUser'
````

### 123. U-012 — endpoints.md L48

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L48-L48

````text
Required fields: `email`, `username`, `password`
````

### 124. U-012 — openapi.yml L467-471

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L467-L471

````text
    NewUser:
      required:
        - email
        - password
        - username
````

### 125. U-013 — endpoints.md L48

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L48-L48

````text
Required fields: `email`, `username`, `password`
````

### 126. U-013 — openapi.yml L467-471

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L467-L471

````text
    NewUser:
      required:
        - email
        - password
        - username
````

### 127. U-014 — endpoints.md L48

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L48-L48

````text
Required fields: `email`, `username`, `password`
````

### 128. U-014 — openapi.yml L467-471

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L467-L471

````text
    NewUser:
      required:
        - email
        - password
        - username
````

### 129. U-015 — openapi.yml L48-49

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L48-L49

````text
        '201':
          $ref: '#/components/responses/UserResponse'
````

### 130. U-016 — openapi.yml L50-51

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L50-L51

````text
        '409':
          $ref: '#/components/responses/ConflictError'
````

### 131. U-016 — openapi.yml L781-790

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 132. U-017 — openapi.yml L52-53

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L52-L53

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 133. U-017 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 134. U-018 — endpoints.md L54

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L54-L54

````text
Authentication required, returns a [User](/specifications/backend/api-response-format#users-for-authentication) that's the current user
````

### 135. U-019 — openapi.yml L63-64

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L63-L64

````text
        '200':
          $ref: '#/components/responses/UserResponse'
````

### 136. U-020 — openapi.yml L65-66

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L65-L66

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 137. U-021 — endpoints.md L72

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L72-L72

````text
Authentication required, returns the [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 138. U-022 — endpoints.md L74

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 139. U-023 — endpoints.md L74

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 140. U-024 — endpoints.md L74

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 141. U-025 — endpoints.md L74

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 142. U-026 — endpoints.md L74

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 143. U-027 — openapi.yml L80-81

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L80-L81

````text
        '200':
          $ref: '#/components/responses/UserResponse'
````

### 144. U-027 — endpoints.md L72

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L72-L72

````text
Authentication required, returns the [User](/specifications/backend/api-response-format#users-for-authentication)
````

### 145. U-028 — openapi.yml L846-857

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L846-L857

````text
    UpdateUserRequest:
      required: true
      description: User details to update. At least **one** field is required.
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/UpdateUser'
````

### 146. U-029 — openapi.yml L82-83

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L82-L83

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 147. U-030 — openapi.yml L84-85

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L84-L85

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 148. U-030 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 149. U-031 — routing.md L10

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 150. U-031 — features.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L7-L7

````text
- Authenticate users via JWT (login/signup pages + logout button on settings page)
````

### 151. P-001 — endpoints.md L80

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L80-L80

````text
Authentication optional, returns a [Profile](/specifications/backend/api-response-format#profile)
````

### 152. P-002 — openapi.yml L521-540

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L521-L540

````text
    Profile:
      required:
        - bio
        - following
        - image
        - username
      type: object
      properties:
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
        following:
          type: boolean
````

### 153. P-002 — openapi.yml L746-756

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L746-L756

````text
    ProfileResponse:
      description: Profile
      content:
        application/json:
          schema:
            required:
              - profile
            type: object
            properties:
              profile:
                $ref: '#/components/schemas/Profile'
````

### 154. P-003 — api-response-format.md L25-33

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 155. P-003 — openapi.yml L539-540

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L539-L540

````text
        following:
          type: boolean
````

### 156. P-004 — openapi.yml L108-109

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L108-L109

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 157. P-005 — endpoints.md L86

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L86-L86

````text
Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)
````

### 158. P-006 — endpoints.md L88

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L88-L88

````text
No additional parameters required
````

### 159. P-007 — openapi.yml L127-128

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L127-L128

````text
        '200':
          $ref: '#/components/responses/ProfileResponse'
````

### 160. P-008 — openapi.yml L131-132

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L131-L132

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 161. P-009 — openapi.yml L129-130

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L129-L130

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 162. P-009 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 163. P-010 — endpoints.md L94

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L94-L94

````text
Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)
````

### 164. P-011 — endpoints.md L96

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L96-L96

````text
No additional parameters required
````

### 165. P-012 — openapi.yml L151-152

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L151-L152

````text
        '200':
          $ref: '#/components/responses/ProfileResponse'
````

### 166. P-013 — openapi.yml L155-156

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L155-L156

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 167. P-014 — openapi.yml L153-154

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L153-L154

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 168. P-014 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 169. P-015 — openapi.yml L110-111

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L110-L111

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 170. P-015 — openapi.yml L133-134

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L133-L134

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 171. P-015 — openapi.yml L157-158

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L157-L158

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 172. P-016 — openapi.yml L106-107

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L106-L107

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 173. A-001 — endpoints.md L126

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 174. A-002 — endpoints.md L102

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L102

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results
````

### 175. A-002 — endpoints.md L126

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L126-L126

````text
Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 176. A-003 — endpoints.md L106-108

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L106-L108

````text
Filter by tag:

`?tag=AngularJS`
````

### 177. A-004 — endpoints.md L110-112

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L110-L112

````text
Filter by author:

`?author=jake`
````

### 178. A-005 — endpoints.md L114-116

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L114-L116

````text
Favorited by user:

`?favorited=jake`
````

### 179. A-006 — endpoints.md L118-120

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L120

````text
Limit number of articles (default is 20):

`?limit=20`
````

### 180. A-007 — endpoints.md L118

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L118

````text
Limit number of articles (default is 20):
````

### 181. A-007 — openapi.yml L910

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L910-L910

````text
        default: 20
````

### 182. A-008 — openapi.yml L903-911

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L903-L911

````text
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

### 183. A-009 — endpoints.md L122-124

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L122-L124

````text
Offset/skip number of articles (default is 0):

`?offset=0`
````

### 184. A-010 — endpoints.md L122

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L122-L122

````text
Offset/skip number of articles (default is 0):
````

### 185. A-011 — openapi.yml L895-902

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L895-L902

````text
    offsetParam:
      in: query
      name: offset
      required: false
      schema:
        type: integer
        minimum: 0
      description: The number of items to skip before starting to collect the result set.
````

### 186. A-012 — openapi.yml L697-745

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L697-L745

````text
    MultipleArticlesResponse:
      description: Multiple articles
      content:
        application/json:
          schema:
            required:
              - articles
              - articlesCount
            type: object
            properties:
              articles:
                type: array
                items:
                  required:
                    - author
                    - createdAt
                    - description
                    - favorited
                    - favoritesCount
                    - slug
                    - tagList
                    - title
                    - updatedAt
                  type: object
                  properties:
                    slug:
                      type: string
                    title:
                      type: string
                    description:
                      type: string
                    tagList:
                      type: array
                      items:
                        type: string
                    createdAt:
                      type: string
                      format: date-time
                    updatedAt:
                      type: string
                      format: date-time
                    favorited:
                      type: boolean
                    favoritesCount:
                      type: integer
                    author:
                      $ref: '#/components/schemas/Profile'
              articlesCount:
                type: integer
````

### 187. A-013 — api-response-format.md L62-67

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L62-L67

````text
:::caution
Starting from the 2024/08/16, the endpoints retrieving a list of articles do no longer return the body of an article for performance reasons.
It affects:
- `GET /api/articles`
- `GET /api/articles/feed`
:::
````

### 188. A-014 — openapi.yml L710-743

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L710-L743

````text
                  required:
                    - author
                    - createdAt
                    - description
                    - favorited
                    - favoritesCount
                    - slug
                    - tagList
                    - title
                    - updatedAt
                  type: object
                  properties:
                    slug:
                      type: string
                    title:
                      type: string
                    description:
                      type: string
                    tagList:
                      type: array
                      items:
                        type: string
                    createdAt:
                      type: string
                      format: date-time
                    updatedAt:
                      type: string
                      format: date-time
                    favorited:
                      type: boolean
                    favoritesCount:
                      type: integer
                    author:
                      $ref: '#/components/schemas/Profile'
````

### 189. A-015 — openapi.yml L702-745

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L702-L745

````text
            required:
              - articles
              - articlesCount
            type: object
            properties:
              articles:
                type: array
                items:
                  required:
                    - author
                    - createdAt
                    - description
                    - favorited
                    - favoritesCount
                    - slug
                    - tagList
                    - title
                    - updatedAt
                  type: object
                  properties:
                    slug:
                      type: string
                    title:
                      type: string
                    description:
                      type: string
                    tagList:
                      type: array
                      items:
                        type: string
                    createdAt:
                      type: string
                      format: date-time
                    updatedAt:
                      type: string
                      format: date-time
                    favorited:
                      type: boolean
                    favoritesCount:
                      type: integer
                    author:
                      $ref: '#/components/schemas/Profile'
              articlesCount:
                type: integer
````

### 190. A-016 — openapi.yml L212-213

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L212-L213

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 191. A-016 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 192. A-017 — openapi.yml L210-211

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L210-L211

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 193. A-018 — endpoints.md L134

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 194. A-019 — endpoints.md L132

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L132-L132

````text
Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)
````

### 195. A-020 — endpoints.md L132

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L132-L132

````text
Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)
````

### 196. A-021 — endpoints.md L134

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 197. A-022 — endpoints.md L134

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L134-L134

````text
Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 198. A-023 — api-response-format.md L62-67

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L62-L67

````text
:::caution
Starting from the 2024/08/16, the endpoints retrieving a list of articles do no longer return the body of an article for performance reasons.
It affects:
- `GET /api/articles`
- `GET /api/articles/feed`
:::
````

### 199. A-024 — openapi.yml L175-176

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L175-L176

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 200. A-025 — endpoints.md L140

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L140-L140

````text
No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 201. A-026 — openapi.yml L249-250

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L249-L250

````text
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
````

### 202. A-026 — endpoints.md L140

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L140-L140

````text
No authentication required, will return [single article](/specifications/backend/api-response-format#single-article)
````

### 203. A-027 — api-response-format.md L38-57

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 204. A-027 — openapi.yml L541-578

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L541-L578

````text
    Article:
      required:
        - author
        - body
        - createdAt
        - description
        - favorited
        - favoritesCount
        - slug
        - tagList
        - title
        - updatedAt
      type: object
      properties:
        slug:
          type: string
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        favorited:
          type: boolean
        favoritesCount:
          type: integer
        author:
          $ref: '#/components/schemas/Profile'
````

### 205. A-028 — openapi.yml L251-252

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L251-L252

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 206. A-029 — endpoints.md L159

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L159-L159

````text
Authentication required, will return an [Article](/specifications/backend/api-response-format#single-article)
````

### 207. A-030 — endpoints.md L148-157

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L148-L157

````text
```json
{
  "article": {
    "title": "How to train your dragon",
    "description": "Ever wonder how?",
    "body": "You have to believe",
    "tagList": ["reactjs", "angularjs", "dragons"]
  }
}
```
````

### 208. A-030 — openapi.yml L858-869

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L858-L869

````text
    NewArticleRequest:
      required: true
      description: Article to create
      content:
        application/json:
          schema:
            required:
              - article
            type: object
            properties:
              article:
                $ref: '#/components/schemas/NewArticle'
````

### 209. A-031 — endpoints.md L161

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L161

````text
Required fields: `title`, `description`, `body`
````

### 210. A-032 — endpoints.md L161

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L161

````text
Required fields: `title`, `description`, `body`
````

### 211. A-033 — endpoints.md L161

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L161-L161

````text
Required fields: `title`, `description`, `body`
````

### 212. A-034 — endpoints.md L163

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L163-L163

````text
Optional fields: `tagList` as an array of Strings
````

### 213. A-034 — openapi.yml L592-595

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L592-L595

````text
        tagList:
          type: array
          items:
            type: string
````

### 214. A-035 — openapi.yml L223-224

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L223-L224

````text
        '201':
          $ref: '#/components/responses/SingleArticleResponse'
````

### 215. A-036 — openapi.yml L225-226

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L225-L226

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 216. A-036 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 217. A-037 — openapi.yml L227-228

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L227-L228

````text
        '409':
          $ref: '#/components/responses/ConflictError'
````

### 218. A-038 — openapi.yml L229-230

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L229-L230

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 219. A-038 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 220. A-039 — endpoints.md L179

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L179-L179

````text
Authentication required, returns the updated [Article](/specifications/backend/api-response-format#single-article)
````

### 221. A-040 — endpoints.md L181

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L181-L181

````text
Optional fields: `title`, `description`, `body`
````

### 222. A-041 — endpoints.md L181

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L181-L181

````text
Optional fields: `title`, `description`, `body`
````

### 223. A-042 — endpoints.md L181

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L181-L181

````text
Optional fields: `title`, `description`, `body`
````

### 224. A-043 — endpoints.md L181

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L181-L181

````text
Optional fields: `title`, `description`, `body`
````

### 225. A-043 — openapi.yml L596-608

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L596-L608

````text
    UpdateArticle:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
````

### 226. A-044 — endpoints.md L183

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L183-L183

````text
The `slug` also gets updated when the `title` is changed
````

### 227. A-045 — openapi.yml L271-272

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L271-L272

````text
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
````

### 228. A-045 — endpoints.md L179

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L179-L179

````text
Authentication required, returns the updated [Article](/specifications/backend/api-response-format#single-article)
````

### 229. A-046 — openapi.yml L273-274

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L273-L274

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 230. A-046 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 231. A-047 — openapi.yml L275-276

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L275-L276

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 232. A-047 — error-handling.md L23

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 233. A-048 — openapi.yml L277-278

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L277-L278

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 234. A-048 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 235. A-049 — openapi.yml L279-280

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L279-L280

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 236. A-049 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 237. A-050 — endpoints.md L187-191

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L187-L191

````text
### Delete Article

`DELETE /api/articles/:slug`

Authentication required
````

### 238. A-051 — openapi.yml L298-299

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L298-L299

````text
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
````

### 239. A-051 — openapi.yml L768-770

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L768-L770

````text
    EmptyOkResponse:
      description: No content
      content: { }
````

### 240. A-052 — openapi.yml L300-301

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L300-L301

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 241. A-052 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 242. A-053 — openapi.yml L302-303

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L302-L303

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 243. A-053 — error-handling.md L23

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 244. A-054 — openapi.yml L304-305

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L304-L305

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 245. A-054 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 246. A-055 — openapi.yml L306-307

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L306-L307

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 247. A-055 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 248. A-056 — openapi.yml L567-572

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L567-L572

````text
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
````

### 249. A-057 — openapi.yml L575-576

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L575-L576

````text
        favoritesCount:
          type: integer
````

### 250. A-058 — openapi.yml L577-578

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L577-L578

````text
        author:
          $ref: '#/components/schemas/Profile'
````

### 251. C-001 — endpoints.md L207

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L207-L207

````text
Authentication required, returns the created [Comment](/specifications/backend/api-response-format#single-comment)
````

### 252. C-002 — endpoints.md L197-205

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L197-L205

````text
Example request body:

```json
{
  "comment": {
    "body": "His name was my name too."
  }
}
```
````

### 253. C-002 — openapi.yml L882-893

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L882-L893

````text
    NewCommentRequest:
      required: true
      description: Comment you want to create
      content:
        application/json:
          schema:
            required:
              - comment
            type: object
            properties:
              comment:
                $ref: '#/components/schemas/NewComment'
````

### 254. C-003 — endpoints.md L209

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L209-L209

````text
Required field: `body`
````

### 255. C-003 — openapi.yml L630-636

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L630-L636

````text
    NewComment:
      required:
        - body
      type: object
      properties:
        body:
          type: string
````

### 256. C-004 — openapi.yml L349-350

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L349-L350

````text
        '201':
          $ref: '#/components/responses/SingleCommentResponse'
````

### 257. C-005 — openapi.yml L351-352

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L351-L352

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 258. C-005 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 259. C-006 — openapi.yml L353-354

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L353-L354

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 260. C-006 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 261. C-007 — openapi.yml L355-356

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L355-L356

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 262. C-007 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 263. C-008 — endpoints.md L215

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L215-L215

````text
Authentication optional, returns [multiple comments](/specifications/backend/api-response-format#multiple-comments)
````

### 264. C-009 — openapi.yml L325-326

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L325-L326

````text
        '200':
          $ref: '#/components/responses/MultipleCommentsResponse'
````

### 265. C-009 — api-response-format.md L127-141

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 266. C-010 — openapi.yml L329-330

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L329-L330

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 267. C-010 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 268. C-011 — openapi.yml L609-629

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L609-L629

````text
    Comment:
      required:
        - author
        - body
        - createdAt
        - id
        - updatedAt
      type: object
      properties:
        id:
          type: integer
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        body:
          type: string
        author:
          $ref: '#/components/schemas/Profile'
````

### 269. C-012 — openapi.yml L618-619

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L618-L619

````text
        id:
          type: integer
````

### 270. C-013 — endpoints.md L217-221

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L217-L221

````text
### Delete Comment

`DELETE /api/articles/:slug/comments/:id`

Authentication required
````

### 271. C-014 — openapi.yml L381-382

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L381-L382

````text
        '204':
          $ref: '#/components/responses/EmptyOkResponse'
````

### 272. C-014 — openapi.yml L768-770

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L768-L770

````text
    EmptyOkResponse:
      description: No content
      content: { }
````

### 273. C-015 — openapi.yml L383-384

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L383-L384

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 274. C-015 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 275. C-016 — openapi.yml L385-386

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L385-L386

````text
        '403':
          $ref: '#/components/responses/Forbidden'
````

### 276. C-016 — error-handling.md L23

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 277. C-017 — openapi.yml L387-388

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L387-L388

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 278. C-017 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 279. C-018 — openapi.yml L389-390

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L389-L390

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 280. C-018 — error-handling.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L7-L7

````text
If a request fails any validations, expect a 422 and errors in the following format:
````

### 281. C-019 — openapi.yml L374-379

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L374-L379

````text
        - name: id
          in: path
          description: ID of the comment you want to delete
          required: true
          schema:
            type: integer
````

### 282. F-001 — endpoints.md L227

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L227-L227

````text
Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)
````

### 283. F-002 — endpoints.md L229

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L229-L229

````text
No additional parameters required
````

### 284. F-003 — openapi.yml L408-409

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L408-L409

````text
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
````

### 285. F-004 — openapi.yml L410-411

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L410-L411

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 286. F-004 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 287. F-005 — openapi.yml L412-413

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L412-L413

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 288. F-005 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 289. F-006 — endpoints.md L235

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L235-L235

````text
Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)
````

### 290. F-007 — endpoints.md L237

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L237-L237

````text
No additional parameters required
````

### 291. F-008 — openapi.yml L432-433

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L432-L433

````text
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
````

### 292. F-009 — openapi.yml L434-435

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L434-L435

````text
        '401':
          $ref: '#/components/responses/Unauthorized'
````

### 293. F-009 — error-handling.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L21-L21

````text
401 for Unauthorized requests, when a request requires authentication but it isn't provided
````

### 294. F-010 — openapi.yml L436-437

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L436-L437

````text
        '404':
          $ref: '#/components/responses/NotFound'
````

### 295. F-010 — error-handling.md L25

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L25-L25

````text
404 for Not found requests, when a resource can't be found to fulfill the request
````

### 296. F-011 — api-response-format.md L48-49

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 297. F-011 — endpoints.md L223-237

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 298. F-012 — endpoints.md L243

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L243-L243

````text
No authentication required, returns a [List of Tags](/specifications/backend/api-response-format#list-of-tags)
````

### 299. F-013 — openapi.yml L450-451

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L450-L451

````text
        '200':
          $ref: '#/components/responses/TagsResponse'
````

### 300. F-013 — api-response-format.md L146-152

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 301. F-014 — openapi.yml L452-453

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L452-L453

````text
        '422':
          $ref: '#/components/responses/GenericError'
````

### 302. FE-001 — routing.md L5

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L5-L5

````text
- Home page (URL: `/` )
````

### 303. FE-002 — routing.md L6

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L6-L6

````text
  - List of tags
````

### 304. FE-003 — routing.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L7-L7

````text
  - List of articles pulled from either Feed, Global, or by Tag
````

### 305. FE-004 — routing.md L8

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L8-L8

````text
  - Pagination for list of articles
````

### 306. FE-005 — templates.md L120

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L120-L120

````text
- a default **Global Feed** tab
````

### 307. FE-006 — templates.md L121

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L121-L121

````text
- an optional **tag name** tab, appears after clicking one of the popular tags
````

### 308. FE-007 — templates.md L122

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L122-L122

````text
- an optional **Your Feed** tab, appears after logging in
````

### 309. FE-008 — templates.md L126-131

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L126-L131

````text
  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>
````

### 310. FE-009 — templates.md L203

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L203-L203

````text
          <p>Popular Tags</p>
````

### 311. FE-010 — templates.md L191-196

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L191-L196

````text
        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
````

### 312. FE-011 — templates.md L145-185

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 313. FE-012 — routing.md L9

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L9

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
````

### 314. FE-013 — routing.md L9

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L9

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
````

### 315. FE-014 — routing.md L10

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 316. FE-015 — templates.md L231-247

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 317. FE-016 — templates.md L262-281

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 318. FE-017 — templates.md L236-238

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L236-L238

````text
        <ul class="error-messages">
          <li>That email is already taken</li>
        </ul>
````

### 319. FE-017 — templates.md L267-269

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L267-L269

````text
        <ul class="error-messages">
          <li>That email is already taken</li>
        </ul>
````

### 320. FE-018 — routing.md L12

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L12-L12

````text
- Settings page (URL: `/settings` )
````

### 321. FE-019 — templates.md L404-426

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 322. FE-020 — templates.md L430

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L430-L430

````text
        <button class="btn btn-outline-danger">Or click here to logout.</button>
````

### 323. FE-020 — features.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L7-L7

````text
- Authenticate users via JWT (login/signup pages + logout button on settings page)
````

### 324. FE-021 — routing.md L13

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L13-L13

````text
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 325. FE-022 — routing.md L13

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L13-L13

````text
- Editor page to create/edit articles (URL: `/editor`, `/editor/article-slug-here` )
````

### 326. FE-023 — templates.md L451-470

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

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

### 327. FE-024 — templates.md L464-466

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L464-L466

````text
              <input type="text" class="form-control" placeholder="Enter tags" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> tag </span>
````

### 328. FE-025 — templates.md L444-446

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L444-L446

````text
        <ul class="error-messages">
          <li>That title is required</li>
        </ul>
````

### 329. FE-026 — routing.md L14

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L14-L14

````text
- Article page (URL: `/article/article-slug-here` )
````

### 330. FE-027 — routing.md L15

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 331. FE-028 — routing.md L16

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L16-L16

````text
  - Render markdown from server client side
````

### 332. FE-029 — routing.md L17

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L17-L17

````text
  - Comments section at bottom of page
````

### 333. FE-030 — routing.md L18

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 334. FE-031 — templates.md L482

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 335. FE-031 — templates.md L495-509

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L495-L509

````text
        </div>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-plus-round"></i>
          &nbsp; Follow Eric Simons <span class="counter">(10)</span>
        </button>
        &nbsp;&nbsp;
        <button class="btn btn-sm btn-outline-primary">
          <i class="ion-heart"></i>
          &nbsp; Favorite Post <span class="counter">(29)</span>
        </button>
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> Edit Article
        </button>
        <button class="btn btn-sm btn-outline-danger">
          <i class="ion-trash-a"></i> Delete Article
````

### 336. FE-032 — templates.md L562-566

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L562-L566

````text
            <textarea class="form-control" placeholder="Write a comment..." rows="3"></textarea>
          </div>
          <div class="card-footer">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            <button class="btn btn-sm btn-primary">Post Comment</button>
````

### 337. FE-033 — templates.md L577-582

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L577-L582

````text
            <a href="/profile/author" class="comment-author">
              <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
            </a>
            &nbsp;
            <a href="/profile/jacob-schmidt" class="comment-author">Jacob Schmidt</a>
            <span class="date-posted">Dec 29th</span>
````

### 338. FE-034 — routing.md L19

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L19

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
````

### 339. FE-035 — routing.md L19

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L19-L19

````text
- Profile page (URL: `/profile/:username`, `/profile/:username/favorites` )
````

### 340. FE-036 — routing.md L20

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L20-L20

````text
  - Show basic user info
````

### 341. FE-037 — routing.md L21

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L21-L21

````text
  - List of articles populated from author's created articles or author's favorited articles
````

### 342. FE-038 — templates.md L322-325

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L322-L325

````text
              <a class="nav-link active" href="">My Articles</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="">Favorited Articles</a>
````

### 343. FE-039 — templates.md L305-309

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L305-L309

````text
            &nbsp; Follow Eric Simons
          </button>
          <button class="btn btn-sm btn-outline-secondary action-btn">
            <i class="ion-gear-a"></i>
            &nbsp; Edit Profile Settings
````

### 344. FE-040 — templates.md L36-40

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L36-L40

````text
If no user is logged in, then the header should include links to:

- the home page
- the login page
- the register page
````

### 345. FE-041 — templates.md L66-71

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L66-L71

````text
If a user is logged in, then the header should include links to:

- the home page
- the new article page
- the settings page
- the profile page
````

### 346. FE-042 — templates.md L42

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L42-L42

````text
> the link of the active page should use the **active** css class.
````

### 347. FE-042 — templates.md L73

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L73-L73

````text
> the link of the active page should use the **active** css class.
````

### 348. FE-043 — templates.md L103-111

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L103-L111

````text
```html
<footer>
  <div class="container">
    <a href="/" class="logo-font">conduit</a>
    <span class="attribution">
      An interactive learning project. Code &amp; design licensed under MIT.
    </span>
  </div>
</footer>
````

### 349. FE-044 — templates.md L14

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L14-L14

````text
  <title>Conduit</title>
````

### 350. FE-045 — styles.md L5-14

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/styles.md#L5-L14

````text
All frontend implementations should use the shared [styles.css](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css) file from the main repository. This is a single CSS file (Conduit Minimal CSS v4) that includes only the classes actually used by Conduit.

The CSS classes it provides match the [templates](/specifications/frontend/templates/) and the [E2E test selectors contract](https://github.com/realworld-apps/realworld/blob/main/specs/e2e/SELECTORS.md).

### Fonts and icons

`styles.css` covers layout and components only — it does **not** bundle fonts or icons, so load these separately in your `<head>`:

- **Fonts:** the theme uses `Source Sans Pro` (body) and `Lora` (headings/article text). Without them, browsers fall back to generic sans-serif/serif. Load them however you prefer (e.g. Google Fonts).
- **Icons:** the templates use `ion-*` classes (`ion-heart`, `ion-compose`, `ion-edit`, `ion-gear-a`, `ion-plus-round`, `ion-trash-a`, `ion-close-round`) from the legacy [Ionicons](https://ionic.io/ionicons) v2 set. Load an icon stylesheet that provides them, or substitute equivalent icons of your own.
````

### 351. FE-045 — templates.md L7-26

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L7-L26

````text
The `<head>` element includes the page metadata (title, description) and loads the stylesheet.

Load the shared [Conduit theme](https://github.com/realworld-apps/realworld/blob/main/assets/theme/styles.css) plus the fonts and icons it relies on. `styles.css` does **not** bundle fonts or icons, so the head below loads all three; see the [Styles](/specifications/frontend/styles/) page for details.

```html
<head>
  <meta charset="utf-8" />
  <title>Conduit</title>
  <!-- Icons: the ion-* classes used in the templates below (legacy Ionicons v2) -->
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.min.css"
  />
  <!-- Fonts the theme uses -->
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600,700|Lora:400,700"
  />
  <!-- The shared Conduit theme (serve styles.css from your own app) -->
  <link rel="stylesheet" href="/styles.css" />
````

### 352. FE-046 — styles.md L16-18

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/styles.md#L16-L18

````text
### Default Avatar

When a user has no profile image, implementations should display the [default avatar](https://github.com/realworld-apps/realworld/blob/main/assets/media/default-avatar.svg) (a smiley face icon).
````

### 353. FE-047 — frontend-tests.md L11-19

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/tests.md#L11-L19

````text
To make your implementation compatible with the E2E tests, it **must** follow the [selectors contract](https://github.com/realworld-apps/realworld/blob/main/specs/e2e/SELECTORS.md), which defines:

- Form input `name` attributes
- Required CSS classes (layout, feed, tags, comments, profile, pagination, buttons, errors)
- Required text content for buttons and links
- Routes
- A debug interface (`window.__conduit_debug__`)
- LocalStorage key for the JWT token
- Default avatar behavior
````

### 354. FE-048 — frontend-tests.md L5

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/tests.md#L5-L5

````text
Include _at least_ **one** unit test in your repo to demonstrate how testing works (full testing coverage is _not_ required!)
````

### 355. FE-049 — frontend-api.md L25-34

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/api.md#L25-L34

````text
## API Limitations

:::info
To avoid the need for content moderation on the public API, the following limitations have been introduced in 2021
:::

The visibility of user content is limited :

- logged out users see only content created by demo accounts
- logged in users see only their content and the content created by demo accounts
````

### 356. FT-001 — features.md L7

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L7-L7

````text
- Authenticate users via JWT (login/signup pages + logout button on settings page)
````

### 357. FT-001 — routing.md L9-10

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L9-L10

````text
- Sign in/Sign up pages (URL: `/login`, `/register` )
  - Uses JWT (store the token in localStorage)
````

### 358. FT-002 — features.md L8

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L8-L8

````text
- CRU- users (sign up & settings page - no deleting required)
````

### 359. FT-003 — features.md L9

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L9-L9

````text
- CRUD Articles
````

### 360. FT-004 — features.md L10

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L10-L10

````text
- CR-D Comments on articles (no updating required)
````

### 361. FT-005 — features.md L11

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L11-L11

````text
- GET and display paginated lists of articles
````

### 362. FT-006 — features.md L12

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L12-L12

````text
- Favorite articles
````

### 363. FT-007 — features.md L13

PASS — Traceability range only: Reconciliation/coverage evidence; semantic disposition is documented in traceability.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/implementation-creation/features.md#L13-L13

````text
- Follow other users
````

### 364. AC-18.1 — templates.md L599-600

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L599-L600

````text
            <span class="mod-options">
              <i class="ion-trash-a"></i>
````

### 365. AC-18.1 — routing.md L18

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 366. AC-03.1 — routing.md L10

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 367. OQ-03.3 — routing.md L10

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 368. OQ-09.4 — openapi.yml L260-288

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 369. OQ-09.4 — error-handling.md L23

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 370. OQ-09.4 — templates.md L482

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 371. OQ-10.4 — routing.md L15

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L15-L15

````text
  - Delete article button (only shown to article's author)
````

### 372. OQ-10.4 — openapi.yml L289-315

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 373. OQ-10.4 — error-handling.md L23

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 374. OQ-18.2 — routing.md L18

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L18-L18

````text
  - Delete comment button (only shown to comment's author)
````

### 375. OQ-18.2 — openapi.yml L366-398

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 376. OQ-18.2 — error-handling.md L23

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L23

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action
````

### 377. OQ-19.4 — api-response-format.md L25-33

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 378. OQ-19.4 — openapi.yml L521-540

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L521-L540

````text
    Profile:
      required:
        - bio
        - following
        - image
        - username
      type: object
      properties:
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
        following:
          type: boolean
````

### 379. OQ-15.3 — api-response-format.md L102

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 380. OQ-15.3 — openapi.yml L697-745

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L697-L745

````text
    MultipleArticlesResponse:
      description: Multiple articles
      content:
        application/json:
          schema:
            required:
              - articles
              - articlesCount
            type: object
            properties:
              articles:
                type: array
                items:
                  required:
                    - author
                    - createdAt
                    - description
                    - favorited
                    - favoritesCount
                    - slug
                    - tagList
                    - title
                    - updatedAt
                  type: object
                  properties:
                    slug:
                      type: string
                    title:
                      type: string
                    description:
                      type: string
                    tagList:
                      type: array
                      items:
                        type: string
                    createdAt:
                      type: string
                      format: date-time
                    updatedAt:
                      type: string
                      format: date-time
                    favorited:
                      type: boolean
                    favoritesCount:
                      type: integer
                    author:
                      $ref: '#/components/schemas/Profile'
              articlesCount:
                type: integer
````

### 381. OQ-20.3 — api-response-format.md L48-49

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 382. OQ-20.3 — endpoints.md L223-237

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 383. BR-02.4 — openapi.yml L28-42

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 384. BR-03.4 — routing.md L10

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/routing.md#L10-L10

````text
  - Uses JWT (store the token in localStorage)
````

### 385. BR-09.4 — openapi.yml L260-288

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 386. BR-09.4 — openapi.yml L791-792

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 387. BR-10.3 — openapi.yml L289-315

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 388. BR-18.3 — openapi.yml L366-398

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 389. BR-18.3 — openapi.yml L791-792

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 390. BR-19.2 — api-response-format.md L25-33

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 391. BR-15.4 — api-response-format.md L102

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 392. BR-20.2 — api-response-format.md L48-49

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 393. AC-02.3 — openapi.yml L28-42

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 394. AC-09.3 — openapi.yml L260-288

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 395. AC-09.3 — openapi.yml L791-792

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L791-L792

````text
    Forbidden:
      description: Forbidden. The error key identifies the resource type (article, comment, etc.)
````

### 396. AC-10.3 — openapi.yml L289-315

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 397. AC-18.3 — openapi.yml L366-398

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 398. AC-19.2 — endpoints.md L82-88

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L82-L88

````text
### Follow user

`POST /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 399. AC-19.3 — endpoints.md L90-96

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L90-L96

````text
### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 400. AC-20.1 — templates.md L155

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L155-L155

````text
              <i class="ion-heart"></i> 29
````

### 401. AC-20.1 — api-response-format.md L48-49

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L48-L49

````text
    "favorited": false,
    "favoritesCount": 0,
````

### 402. AC-20.2 — endpoints.md L223-229

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L223-L229

````text
### Favorite Article

`POST /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 403. AC-20.3 — endpoints.md L231-237

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L231-L237

````text
### Unfavorite Article

`DELETE /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 404. AC-15.2 — endpoints.md L118

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L118

````text
Limit number of articles (default is 20):
````

### 405. AC-15.2 — api-response-format.md L102

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L102-L102

````text
  "articlesCount": 2
````

### 406. OQ-03.4 — openapi.yml L93-117

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L93-L117

````text
      summary: Get a profile
      description: Get a profile of a user of the system. Auth is optional
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

### 407. OQ-03.4 — openapi.yml L183-213

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L183-L213

````text
      tags:
        - Articles
      summary: Get recent articles globally
      description: Get most recent articles globally. Use query parameters to filter
        results. Auth is optional
      operationId: GetArticles
      parameters:
        - name: tag
          in: query
          description: Filter by tag
          schema:
            type: string
        - name: author
          in: query
          description: Filter by author (username)
          schema:
            type: string
        - name: favorited
          in: query
          description: Filter by favorites of a user (username)
          schema:
            type: string
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        '200':
          $ref: '#/components/responses/MultipleArticlesResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 408. OQ-03.4 — openapi.yml L315-337

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L315-L337

````text
      description: Get the comments for an article. Auth is optional
      operationId: GetArticleComments
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to get comments for
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/MultipleCommentsResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    post:
      tags:
        - Comments
      summary: Create a comment for an article
      description: Create a comment for an article. Auth is required
````

### 409. OQ-01.5 — openapi.yml L456-480

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L456-L480

````text
    LoginUser:
      required:
        - email
        - password
      type: object
      properties:
        email:
          type: string
        password:
          type: string
          format: password
    NewUser:
      required:
        - email
        - password
        - username
      type: object
      properties:
        username:
          type: string
        email:
          type: string
        password:
          type: string
          format: password
````

### 410. OQ-07.4 — endpoints.md L102-126

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L102-L126

````text
Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results

Query Parameters:

Filter by tag:

`?tag=AngularJS`

Filter by author:

`?author=jake`

Favorited by user:

`?favorited=jake`

Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first
````

### 411. OQ-15.4 — endpoints.md L118-134

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L118-L134

````text
Limit number of articles (default is 20):

`?limit=20`

Offset/skip number of articles (default is 0):

`?offset=0`

Authentication optional, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles), ordered by most recent first

### Feed Articles

`GET /api/articles/feed`

Can also take `limit` and `offset` query parameters like [List Articles](/specifications/backend/endpoints#list-articles)

Authentication required, will return [multiple articles](/specifications/backend/api-response-format#multiple-articles) created by followed users, ordered by most recent first.
````

### 412. OQ-20.4 — endpoints.md L231-237

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L231-L237

````text
### Unfavorite Article

`DELETE /api/articles/:slug/favorite`

Authentication required, returns the [Article](/specifications/backend/api-response-format#single-article)

No additional parameters required
````

### 413. OQ-19.5 — endpoints.md L90-96

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L90-L96

````text
### Unfollow user

`DELETE /api/profiles/:username/follow`

Authentication required, returns a [Profile](/specifications/backend/api-response-format#profile)

No additional parameters required
````

### 414. OQ-05.6 — openapi.yml L76-94

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 415. OQ-05.6 — openapi.yml L846-857

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L846-L857

````text
    UpdateUserRequest:
      required: true
      description: User details to update. At least **one** field is required.
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/UpdateUser'
````

### 416. OQ-05.6 — endpoints.md L74

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L74-L74

````text
Accepted fields: `email`, `username`, `password`, `image`, `bio`
````

### 417. OQ-21.3 — routing.md L5-21

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 418. OQ-21.3 — templates.md L145-155

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L145-L155

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
````

### 419. OQ-21.3 — templates.md L231-247

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 420. OQ-22.2 — openapi.yml L567-572

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L567-L572

````text
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
````

### 421. OQ-22.2 — api-response-format.md L46-47

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L46-L47

````text
    "createdAt": "2016-02-18T03:22:56.637Z",
    "updatedAt": "2016-02-18T03:48:35.824Z",
````

### 422. OQ-09.1 — endpoints.md L181

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/endpoints.md#L181-L181

````text
Optional fields: `title`, `description`, `body`
````

### 423. OQ-09.1 — openapi.yml L596-608

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L596-L608

````text
    UpdateArticle:
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
````

### 424. BR-01.8 — openapi.yml L481-503

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L481-L503

````text
    User:
      required:
        - bio
        - email
        - image
        - token
        - username
      type: object
      properties:
        email:
          type: string
        token:
          type: string
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
````

### 425. BR-01.9 — openapi.yml L834-845

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L834-L845

````text
    NewUserRequest:
      required: true
      description: Details of the new user to register
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/NewUser'
````

### 426. BR-01.9 — openapi.yml L467-480

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L467-L480

````text
    NewUser:
      required:
        - email
        - password
        - username
      type: object
      properties:
        username:
          type: string
        email:
          type: string
        password:
          type: string
          format: password
````

### 427. BR-01.10 — templates.md L262-265

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L262-L265

````text
        <h1 class="text-xs-center">Sign up</h1>
        <p class="text-xs-center">
          <a href="/login">Have an account?</a>
        </p>
````

### 428. BR-02.7 — openapi.yml L822-833

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L822-L833

````text
    LoginUserRequest:
      required: true
      description: Credentials to use
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/LoginUser'
````

### 429. BR-02.7 — openapi.yml L456-466

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L456-L466

````text
    LoginUser:
      required:
        - email
        - password
      type: object
      properties:
        email:
          type: string
        password:
          type: string
          format: password
````

### 430. BR-02.8 — openapi.yml L28-37

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L28-L37

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
````

### 431. BR-02.9 — templates.md L231-234

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L231-L234

````text
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
          <a href="/register">Need an account?</a>
        </p>
````

### 432. BR-03.5 — openapi.yml L61-68

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L61-L68

````text
      operationId: GetCurrentUser
      responses:
        '200':
          $ref: '#/components/responses/UserResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 433. BR-05.5 — openapi.yml L846-857

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L846-L857

````text
    UpdateUserRequest:
      required: true
      description: User details to update. At least **one** field is required.
      content:
        application/json:
          schema:
            required:
              - user
            type: object
            properties:
              user:
                $ref: '#/components/schemas/UpdateUser'
````

### 434. BR-05.6 — openapi.yml L76-87

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L76-L87

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
````

### 435. BR-06.5 — openapi.yml L521-540

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L521-L540

````text
    Profile:
      required:
        - bio
        - following
        - image
        - username
      type: object
      properties:
        username:
          type: string
        bio:
          type:
            - string
            - 'null'
        image:
          type:
            - string
            - 'null'
        following:
          type: boolean
````

### 436. BR-06.5 — openapi.yml L746-756

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L746-L756

````text
    ProfileResponse:
      description: Profile
      content:
        application/json:
          schema:
            required:
              - profile
            type: object
            properties:
              profile:
                $ref: '#/components/schemas/Profile'
````

### 437. BR-06.6 — openapi.yml L93-111

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L93-L111

````text
      summary: Get a profile
      description: Get a profile of a user of the system. Auth is optional
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
````

### 438. BR-08.7 — openapi.yml L579-595

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L579-L595

````text
    NewArticle:
      required:
        - body
        - description
        - title
      type: object
      properties:
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
````

### 439. BR-08.7 — openapi.yml L858-869

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L858-L869

````text
    NewArticleRequest:
      required: true
      description: Article to create
      content:
        application/json:
          schema:
            required:
              - article
            type: object
            properties:
              article:
                $ref: '#/components/schemas/NewArticle'
````

### 440. BR-08.8 — openapi.yml L541-578

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L541-L578

````text
    Article:
      required:
        - author
        - body
        - createdAt
        - description
        - favorited
        - favoritesCount
        - slug
        - tagList
        - title
        - updatedAt
      type: object
      properties:
        slug:
          type: string
        title:
          type: string
        description:
          type: string
        body:
          type: string
        tagList:
          type: array
          items:
            type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        favorited:
          type: boolean
        favoritesCount:
          type: integer
        author:
          $ref: '#/components/schemas/Profile'
````

### 441. BR-08.9 — openapi.yml L219-230

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L219-L230

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
````

### 442. BR-08.10 — templates.md L444-446

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L444-L446

````text
        <ul class="error-messages">
          <li>That title is required</li>
        </ul>
````

### 443. BR-08.10 — templates.md L464-466

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L464-L466

````text
              <input type="text" class="form-control" placeholder="Enter tags" />
              <div class="tag-list">
                <span class="tag-default tag-pill"> <i class="ion-close-round"></i> tag </span>
````

### 444. BR-08.10 — templates.md L482

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L482-L482

````text
// TODO : update to switch between follow/favorite AND edit/delete
````

### 445. BR-08.10 — templates.md L505-507

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L505-L507

````text
        <button class="btn btn-sm btn-outline-secondary">
          <i class="ion-edit"></i> Edit Article
        </button>
````

### 446. BR-09.5 — openapi.yml L260-288

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 447. BR-09.5 — error-handling.md L23-25

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/error-handling.md#L23-L25

````text
403 for Forbidden requests, when a request may be valid but the user doesn't have permissions to perform the action

404 for Not found requests, when a resource can't be found to fulfill the request
````

### 448. BR-10.4 — openapi.yml L289-315

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 449. BR-10.4 — openapi.yml L768-770

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L768-L770

````text
    EmptyOkResponse:
      description: No content
      content: { }
````

### 450. BR-11.6 — openapi.yml L240-259

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 451. BR-12.5 — openapi.yml L697-745

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L697-L745

````text
    MultipleArticlesResponse:
      description: Multiple articles
      content:
        application/json:
          schema:
            required:
              - articles
              - articlesCount
            type: object
            properties:
              articles:
                type: array
                items:
                  required:
                    - author
                    - createdAt
                    - description
                    - favorited
                    - favoritesCount
                    - slug
                    - tagList
                    - title
                    - updatedAt
                  type: object
                  properties:
                    slug:
                      type: string
                    title:
                      type: string
                    description:
                      type: string
                    tagList:
                      type: array
                      items:
                        type: string
                    createdAt:
                      type: string
                      format: date-time
                    updatedAt:
                      type: string
                      format: date-time
                    favorited:
                      type: boolean
                    favoritesCount:
                      type: integer
                    author:
                      $ref: '#/components/schemas/Profile'
              articlesCount:
                type: integer
````

### 452. BR-12.5 — api-response-format.md L62-67

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/backend/api-response-format.md#L62-L67

````text
:::caution
Starting from the 2024/08/16, the endpoints retrieving a list of articles do no longer return the body of an article for performance reasons.
It affects:
- `GET /api/articles`
- `GET /api/articles/feed`
:::
````

### 453. BR-12.6 — openapi.yml L183-213

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L183-L213

````text
      tags:
        - Articles
      summary: Get recent articles globally
      description: Get most recent articles globally. Use query parameters to filter
        results. Auth is optional
      operationId: GetArticles
      parameters:
        - name: tag
          in: query
          description: Filter by tag
          schema:
            type: string
        - name: author
          in: query
          description: Filter by author (username)
          schema:
            type: string
        - name: favorited
          in: query
          description: Filter by favorites of a user (username)
          schema:
            type: string
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        '200':
          $ref: '#/components/responses/MultipleArticlesResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 454. BR-12.7 — templates.md L126-131

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L126-L131

````text
  <div class="banner">
    <div class="container">
      <h1 class="logo-font">conduit</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>
````

### 455. BR-13.4 — openapi.yml L164-180

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L164-L180

````text
        - Articles
      summary: Get recent articles from users you follow
      description: Get most recent articles from users you follow. Use query parameters
        to limit. Auth is required
      operationId: GetArticlesFeed
      parameters:
        - $ref: '#/components/parameters/offsetParam'
        - $ref: '#/components/parameters/limitParam'
      responses:
        '200':
          $ref: '#/components/responses/MultipleArticlesResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
````

### 456. BR-14.4 — openapi.yml L443-453

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L443-L453

````text
    get:
      tags:
        - Tags
      summary: Get tags
      description: Get tags. Auth not required
      operationId: GetTags
      responses:
        '200':
          $ref: '#/components/responses/TagsResponse'
        '422':
          $ref: '#/components/responses/GenericError'
````

### 457. BR-14.4 — openapi.yml L649-661

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L649-L661

````text
    TagsResponse:
      description: Tags
      content:
        application/json:
          schema:
            required:
              - tags
            type: object
            properties:
              tags:
                type: array
                items:
                  type: string
````

### 458. BR-15.5 — openapi.yml L895-911

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 459. BR-15.6 — templates.md L191-196

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L191-L196

````text
        <ul class="pagination">
          <li class="page-item active">
            <a class="page-link" href="">1</a>
          </li>
          <li class="page-item">
            <a class="page-link" href="">2</a>
````

### 460. BR-16.4 — openapi.yml L630-636

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L630-L636

````text
    NewComment:
      required:
        - body
      type: object
      properties:
        body:
          type: string
````

### 461. BR-16.4 — openapi.yml L882-893

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L882-L893

````text
    NewCommentRequest:
      required: true
      description: Comment you want to create
      content:
        application/json:
          schema:
            required:
              - comment
            type: object
            properties:
              comment:
                $ref: '#/components/schemas/NewComment'
````

### 462. BR-16.5 — openapi.yml L609-629

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L609-L629

````text
    Comment:
      required:
        - author
        - body
        - createdAt
        - id
        - updatedAt
      type: object
      properties:
        id:
          type: integer
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
        body:
          type: string
        author:
          $ref: '#/components/schemas/Profile'
````

### 463. BR-16.6 — openapi.yml L338-365

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 464. BR-17.4 — openapi.yml L315-337

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L315-L337

````text
      description: Get the comments for an article. Auth is optional
      operationId: GetArticleComments
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to get comments for
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/MultipleCommentsResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
    post:
      tags:
        - Comments
      summary: Create a comment for an article
      description: Create a comment for an article. Auth is required
````

### 465. BR-17.4 — openapi.yml L675-685

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L675-L685

````text
      content:
        application/json:
          schema:
            required:
              - comments
            type: object
            properties:
              comments:
                type: array
                items:
                  $ref: '#/components/schemas/Comment'
````

### 466. BR-18.4 — openapi.yml L366-398

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 467. BR-18.4 — openapi.yml L768-770

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L768-L770

````text
    EmptyOkResponse:
      description: No content
      content: { }
````

### 468. BR-19.6 — endpoints.md L82-96

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 469. BR-19.6 — openapi.yml L118-160

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L118-L160

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
      operationId: UnfollowUserByUsername
      parameters:
        - name: username
          in: path
          description: Username of the profile you want to unfollow
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
````

### 470. BR-20.5 — endpoints.md L223-237

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 471. BR-20.5 — openapi.yml L399-441

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L399-L441

````text
      operationId: CreateArticleFavorite
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to favorite
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
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
        - Favorites
      summary: Unfavorite an article
      description: Unfavorite an article. Auth is required
      operationId: DeleteArticleFavorite
      parameters:
        - name: slug
          in: path
          description: Slug of the article that you want to unfavorite
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/SingleArticleResponse'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '422':
          $ref: '#/components/responses/GenericError'
      security:
        - Token: [ ]
````

### 472. BR-21.4 — templates.md L14

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L14-L14

````text
  <title>Conduit</title>
````

### 473. BR-21.4 — templates.md L103-111

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/templates.md#L103-L111

````text
```html
<footer>
  <div class="container">
    <a href="/" class="logo-font">conduit</a>
    <span class="attribution">
      An interactive learning project. Code &amp; design licensed under MIT.
    </span>
  </div>
</footer>
````

### 474. BR-21.5 — styles.md L16-18

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/docs/src/content/docs/specifications/frontend/styles.md#L16-L18

````text
### Default Avatar

When a user has no profile image, implementations should display the [default avatar](https://github.com/realworld-apps/realworld/blob/main/assets/media/default-avatar.svg) (a smiley face icon).
````

### 475. BR-22.7 — openapi.yml L771-780

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

### 476. BR-22.8 — openapi.yml L637-647

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

Source: https://github.com/realworld-apps/realworld/blob/ebbcdeb8d55b42a3a613c787560498b8ef10003f/specs/api/openapi.yml#L637-L647

````text
    GenericErrorModel:
      required:
        - errors
      type: object
      properties:
        errors:
          type: object
          additionalProperties:
            type: array
            items:
              type: string
````

### 477. BR-22.8 — openapi.yml L791-810

PASS — Change-log range only: Historical/content-change evidence, not an additional current assertion.

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

## Historical roll-up consistency

- US-01 — endpoints.md L48: Current rule

- US-01 — endpoints.md L46: Current rule

- US-01 — api-response-format.md L11-20: Current rule

- US-01 — openapi.yml L44-60: Current rule

- US-01 — openapi.yml L781-790: Current rule

- US-01 — error-handling.md L7-17: Current rule

- US-01 — routing.md L9: Current rule

- US-01 — templates.md L262-281: Current rule

- US-01 — templates.md L267: Current rule

- US-01 — routing.md L10: Current rule

- US-02 — endpoints.md L28: Current rule

- US-02 — endpoints.md L26: Current rule

- US-02 — openapi.yml L28-42: Current rule

- US-02 — routing.md L9: Current rule

- US-02 — templates.md L231-247: Current rule

- US-02 — templates.md L236: Current rule

- US-02 — routing.md L10: Current rule

- US-03 — endpoints.md L5-9: Current rule

- US-03 — endpoints.md L50-54: Current rule

- US-03 — error-handling.md L21: Current rule

- US-03 — openapi.yml L771-780: Current rule

- US-03 — routing.md L10: Logged retired rule

- US-04 — features.md L7: Current rule

- US-04 — templates.md L430: Current rule

- US-04 — templates.md L36-40: Current rule

- US-05 — routing.md L12: Current rule

- US-05 — templates.md L404-426: Current rule

- US-05 — endpoints.md L56-74: Current rule

- US-05 — features.md L8: Current rule

- US-06 — routing.md L19-20: Current rule

- US-06 — templates.md L289-309: Current rule

- US-06 — endpoints.md L76-80: Current rule

- US-06 — api-response-format.md L25-33: Current rule

- US-06 — openapi.yml L95-117: Current rule

- US-06 — templates.md L305: Current rule

- US-06 — templates.md L309: Current rule

- US-07 — routing.md L19-21: Current rule

- US-07 — templates.md L322-325: Current rule

- US-07 — endpoints.md L110-116: Current rule

- US-08 — routing.md L13: Current rule

- US-08 — templates.md L451-470: Current rule

- US-08 — endpoints.md L159: Current rule

- US-08 — endpoints.md L161-163: Current rule

- US-08 — api-response-format.md L38-57: Current rule

- US-08 — openapi.yml L219-239: Current rule

- US-08 — endpoints.md L185: Current rule

- US-09 — routing.md L13: Current rule

- US-09 — endpoints.md L179-181: Current rule

- US-09 — endpoints.md L183: Current rule

- US-09 — openapi.yml L260-288: Current rule

- US-09 — openapi.yml L791-792: Logged retired rule

- US-10 — endpoints.md L187-191: Current rule

- US-10 — openapi.yml L289-315: Current rule

- US-10 — routing.md L15: Current rule

- US-10 — templates.md L509: Current rule

- US-11 — routing.md L14: Current rule

- US-11 — endpoints.md L136-140: Current rule

- US-11 — api-response-format.md L38-57: Current rule

- US-11 — routing.md L16: Current rule

- US-11 — routing.md L17: Current rule

- US-11 — openapi.yml L240-259: Current rule

- US-12 — routing.md L5-7: Current rule

- US-12 — templates.md L118-120: Current rule

- US-12 — endpoints.md L102: Current rule

- US-12 — endpoints.md L126: Current rule

- US-12 — api-response-format.md L62-67: Current rule

- US-12 — api-response-format.md L102: Current rule

- US-12 — templates.md L145-185: Current rule

- US-13 — templates.md L122: Current rule

- US-13 — endpoints.md L134: Current rule

- US-13 — endpoints.md L132: Current rule

- US-14 — routing.md L6: Current rule

- US-14 — templates.md L203: Current rule

- US-14 — templates.md L121: Current rule

- US-14 — endpoints.md L106-108: Current rule

- US-14 — endpoints.md L239-243: Current rule

- US-14 — api-response-format.md L146-152: Current rule

- US-15 — routing.md L8: Current rule

- US-15 — templates.md L191-196: Current rule

- US-15 — endpoints.md L118-124: Current rule

- US-15 — openapi.yml L895-911: Current rule

- US-15 — endpoints.md L132: Current rule

- US-15 — api-response-format.md L102: Logged retired rule

- US-16 — templates.md L562-566: Current rule

- US-16 — routing.md L17: Current rule

- US-16 — endpoints.md L207-209: Current rule

- US-16 — api-response-format.md L108-122: Current rule

- US-16 — openapi.yml L338-365: Current rule

- US-16 — features.md L10: Current rule

- US-17 — endpoints.md L211-215: Current rule

- US-17 — api-response-format.md L127-141: Current rule

- US-17 — templates.md L577-582: Current rule

- US-17 — features.md L10: Current rule

- US-18 — endpoints.md L217-221: Current rule

- US-18 — openapi.yml L366-398: Current rule

- US-18 — routing.md L18: Current rule

- US-18 — templates.md L599-600: Current rule

- US-18 — openapi.yml L791-792: Logged retired rule

- US-19 — endpoints.md L82-96: Current rule

- US-19 — api-response-format.md L25-33: Logged retired rule

- US-19 — templates.md L305: Current rule

- US-19 — templates.md L498: Current rule

- US-19 — openapi.yml L118-141: Current rule

- US-19 — endpoints.md L134: Current rule

- US-20 — endpoints.md L223-237: Current rule

- US-20 — api-response-format.md L48-49: Logged retired rule

- US-20 — templates.md L155: Current rule

- US-20 — templates.md L503: Current rule

- US-20 — routing.md L19-21: Current rule

- US-21 — templates.md L36-40: Current rule

- US-21 — templates.md L66-71: Current rule

- US-21 — templates.md L42: Current rule

- US-21 — templates.md L73: Current rule

- US-22 — error-handling.md L7-17: Current rule

- US-22 — error-handling.md L21: Current rule

- US-22 — error-handling.md L23: Current rule

- US-22 — error-handling.md L25: Current rule

- US-22 — openapi.yml L791-810: Current rule

- US-22 — api-response-format.md L7: Current rule

- US-23 — cors.md L7: Current rule
