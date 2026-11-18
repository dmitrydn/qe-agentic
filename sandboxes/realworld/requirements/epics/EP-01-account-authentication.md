# EP-01 Account & authentication

Let people create an account, sign in, stay signed in and sign out.

## US-01 Sign up

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-004, R-005, R-047, R-057

As a visitor, I want to create an account with a username, email and password, so that I can publish articles and take part in discussions.

### Business rules

- **BR-01.1** Registration requires username, email and password. — `endpoints.md` L48
- **BR-01.2** Registration does not require being signed in. — `endpoints.md` L46
- **BR-01.3** A successful registration returns the new user's email, token, username, bio and image, with status 201. — `endpoints.md` L46; `api-response-format.md` L11-20; `openapi.yml` L44-60
- **BR-01.4** A username that is already taken is rejected with status 409 and the message "has already been taken". — `openapi.yml` L44-60; `openapi.yml` L781-790
- **BR-01.5** A request missing a required field is rejected with status 422 and field-level error messages. — `error-handling.md` L7-17
- **BR-01.6** The sign-up page is at /register and has Username, Email and Password fields and a "Sign up" button; errors are listed on the form. — `routing.md` L9; `templates.md` L262-281; `templates.md` L267
- **BR-01.7** The app stores the returned token in the browser (localStorage). — `routing.md` L10

### Acceptance criteria

#### AC-01.1 Visitor signs up successfully (UI)

Spec: `routing.md` L9-10; `templates.md` L262-281

```gherkin
Scenario: Visitor signs up successfully
  Given I am a visitor on the /register page
  When I enter a new username, email and password
    And I click "Sign up"
  Then my account is created
    And I am signed in
```

#### AC-01.2 Registration via API returns the new user (API)

Spec: `openapi.yml` L44-60; `api-response-format.md` L11-20

```gherkin
Scenario: Registration via API returns the new user
  Given no account exists with username "jake"
  When I POST /api/users with username "jake", an email and a password
  Then the response status is 201
    And the response contains user.email, user.token, user.username, user.bio and user.image
```

#### AC-01.3 Username already taken (API)

Spec: `openapi.yml` L781-790

```gherkin
Scenario: Username already taken
  Given an account with username "jake" exists
  When I POST /api/users with username "jake"
  Then the response status is 409
    And errors.username contains "has already been taken"
```

#### AC-01.4 Required field missing (outline) (API)

Spec: `endpoints.md` L48; `error-handling.md` L7-17

```gherkin
Scenario Outline: Required field missing
  Given I am a visitor
  When I POST /api/users without <field>
  Then the response status is 422
    And the response body contains errors.<field>

  Examples:
    | field |
    | username |
    | email |
    | password |
```

### Open questions

- **OQ-01.1** What are the password rules (minimum length, complexity)? → [open-questions.md](../open-questions.md)
- **OQ-01.2** What makes an email valid, and must emails be unique like usernames? → [open-questions.md](../open-questions.md)
- **OQ-01.3** Which characters and lengths are allowed in a username? → [open-questions.md](../open-questions.md)
- **OQ-01.4** Where does the user land after a successful sign-up? → [open-questions.md](../open-questions.md)

## US-02 Sign in

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-002, R-003, R-057, R-058

As a returning member, I want to sign in with my email and password, so that I can access my account.

### Business rules

- **BR-02.1** Sign-in requires email and password. — `endpoints.md` L28
- **BR-02.2** Sign-in does not require an existing session. — `endpoints.md` L26
- **BR-02.3** Valid credentials return the user's details including an authentication token, with status 200. — `endpoints.md` L26; `openapi.yml` L28-42
- **BR-02.4** Invalid credentials are rejected with status 401. — `openapi.yml` L28-42
- **BR-02.5** The sign-in page is at /login and has Email and Password fields and a "Sign in" button; errors are listed on the form. — `routing.md` L9; `templates.md` L231-247; `templates.md` L236
- **BR-02.6** The app stores the token in the browser (localStorage). — `routing.md` L10

### Acceptance criteria

#### AC-02.1 Member signs in successfully (UI)

Spec: `templates.md` L231-247; `templates.md` L66-71

```gherkin
Scenario: Member signs in successfully
  Given I have an account
    And I am on the /login page
  When I enter my email and password
    And I click "Sign in"
  Then I am signed in
    And the header shows the signed-in navigation
```

#### AC-02.2 Sign-in via API returns a token (API)

Spec: `openapi.yml` L28-42; `api-response-format.md` L11-20

```gherkin
Scenario: Sign-in via API returns a token
  Given an account exists for jake@jake.jake
  When I POST /api/users/login with the correct email and password
  Then the response status is 200
    And the response contains user.token
```

#### AC-02.3 Wrong password (API)

Spec: `openapi.yml` L28-42

```gherkin
Scenario: Wrong password
  Given an account exists for jake@jake.jake
  When I POST /api/users/login with a wrong password
  Then the response status is 401
```

#### AC-02.4 Required field missing (outline) (API)

Spec: `endpoints.md` L28; `error-handling.md` L7

```gherkin
Scenario Outline: Required field missing
  Given I am a visitor
  When I POST /api/users/login without <field>
  Then the response status is 422

  Examples:
    | field |
    | email |
    | password |
```

### Open questions

- **OQ-02.1** Is a wrong password a 401 (OpenAPI) or a 422 validation error (error-handling page), and what message is shown? → [open-questions.md](../open-questions.md)
- **OQ-02.2** Is there any lockout or rate limit after repeated failed attempts? → [open-questions.md](../open-questions.md)
- **OQ-02.3** How long does a session (token) stay valid? → [open-questions.md](../open-questions.md)

## US-03 Stay signed in

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-001, R-006, R-007, R-058

As a member, I want to stay signed in when I reload or return to the app, so that I don't have to sign in on every visit.

### Business rules

- **BR-03.1** Authenticated requests carry the header Authorization: Token <jwt>. — `endpoints.md` L5-9
- **BR-03.2** GET /api/user requires authentication and returns the current user. — `endpoints.md` L50-54
- **BR-03.3** A request that needs authentication but has no token is rejected with status 401. — `error-handling.md` L21; `openapi.yml` L771-780
- **BR-03.4** The token is kept in localStorage, so it survives a page reload. — `routing.md` L10

### Acceptance criteria

#### AC-03.1 Session survives a reload (UI)

Spec: `routing.md` L10

**BA-ASSUMPTION:** persistence across reload is implied by storing the token in localStorage, not stated

```gherkin
Scenario: Session survives a reload
  Given I am signed in
  When I reload the page
  Then I am still signed in
```

#### AC-03.2 Current user via API (API)

Spec: `endpoints.md` L50-54

```gherkin
Scenario: Current user via API
  Given I have a valid token
  When I GET /api/user with the Authorization header
  Then the response status is 200
    And the response contains my user details
```

#### AC-03.3 Current user without a token (API)

Spec: `error-handling.md` L21

```gherkin
Scenario: Current user without a token
  Given I have no token
  When I GET /api/user
  Then the response status is 401
```

### Open questions

- **OQ-03.1** What should the app do when the stored token is invalid or expired? → [open-questions.md](../open-questions.md)
- **OQ-03.2** Is an invalid (not missing) token also a 401? → [open-questions.md](../open-questions.md)

## US-04 Sign out

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-060

As a member, I want to sign out, so that nobody else can use my account on this device.

### Business rules

- **BR-04.1** The settings page has a logout button labelled "Or click here to logout.". — `features.md` L7; `templates.md` L430
- **BR-04.2** After signing out, the header shows the signed-out links (Home, Sign in, Sign up). — `templates.md` L36-40

### Acceptance criteria

#### AC-04.1 Member signs out (UI)

Spec: `templates.md` L430; `templates.md` L36-40

```gherkin
Scenario: Member signs out
  Given I am signed in
    And I am on the /settings page
  When I click "Or click here to logout."
  Then I am signed out
    And the header shows Home, Sign in and Sign up
```

### Open questions

- **OQ-04.1** Where is the user taken after signing out? → [open-questions.md](../open-questions.md)
- **OQ-04.2** Is the token invalidated on the server, or only removed from the browser? → [open-questions.md](../open-questions.md)
