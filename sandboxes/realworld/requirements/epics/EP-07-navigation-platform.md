# EP-07 Navigation & platform

Cross-cutting behaviour: navigation, API error contract, cross-origin access.

**BA-ASSUMPTION:** Epic grouping and goal framing are BA judgement, not stakeholder-authored specification.

## US-21 Navigate the application

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-070, R-071, R-072

As a user, I want a header that shows the right links for my situation, so that I can always get where I need to go.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-21.1** Signed out, the header links to the home, sign-in and sign-up pages. — templates.md L36-40
- **BR-21.2** Signed in, the header links to the home, new article, settings and profile pages. — templates.md L66-71
- **BR-21.3** The link for the current page is highlighted (active). — templates.md L42; templates.md L73
- **BR-21.5** When a user has no profile image, display the default avatar, a smiley face icon. — styles.md L16-18

### Acceptance criteria

#### AC-21.1 Signed-out header (UI)

Spec: templates.md L36-40

```gherkin
Scenario: Signed-out header
  Given I am a visitor
  When I open any page
  Then the header shows Home, Sign in and Sign up
```

#### AC-21.2 Signed-in header (UI)

Spec: templates.md L66-71

```gherkin
Scenario: Signed-in header
  Given I am signed in
  When I open any page
  Then the header shows Home, New Article, Settings and my profile
```

#### AC-21.3 Current page is highlighted (UI)

Spec: templates.md L73

```gherkin
Scenario: Current page is highlighted
  Given I am on /settings
  When I look at the header
  Then the Settings link is marked active
```

### Open questions

- **OQ-21.1** What happens when a visitor opens /editor, /settings or another signed-in page directly? → [open-questions.md](../open-questions.md)
- **OQ-21.2** What does the user see for an unknown URL? → [open-questions.md](../open-questions.md)
- **OQ-21.3** What should users see during loading, after sign-in, and for non-422 errors or token expiry; how are dates displayed? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-21.1** The document title is Conduit; the footer links conduit to / and displays An interactive learning project. Code & design licensed under MIT. — templates.md L14; templates.md L103-111

## US-22 Consistent API error responses

**Persona:** API consumer · **Type:** Enabler · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-041, R-042, R-043, R-044, R-046

As an API consumer, I want every error to use the same status codes and JSON format, so that my client can handle failures in one place.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-22.1** Validation failures are rejected with field-level error messages. — error-handling.md L7-17
- **BR-22.2** Missing authentication causes a request to be rejected as unauthorized. — error-handling.md L21
- **BR-22.3** A valid request the user is not permitted to make is rejected as forbidden. — error-handling.md L23
- **BR-22.4** A request for something that doesn't exist returns a not-found error. — error-handling.md L25

### Acceptance criteria

#### AC-22.1 Error status codes (outline) (API)

Spec: error-handling.md L7-25

```gherkin
Scenario Outline: Error status codes
  Given <precondition>
  When I send <request>
  Then the response status is <status>
    And the body has an errors object

  Examples:
    | precondition | request | status |
    | I have no token | GET /api/user | 401 |
    | "anna" wrote an article; I am signed in as "jake" | DELETE /api/articles/<anna's slug> | 403 |
    | no article has slug "nope" | GET /api/articles/nope | 404 |
    | I am signed in | POST /api/articles without a title | 422 |
```

#### AC-22.2 Validation error format (API)

Spec: error-handling.md L7-17

```gherkin
Scenario: Validation error format
  Given I am signed in
  When I POST /api/articles with an empty title
  Then the response status is 422
    And errors.title is a list of messages
```

### Open questions

- **OQ-22.1** Is the empty-field message "can't be empty" or "can't be blank"? → [open-questions.md](../open-questions.md)
- **OQ-22.2** Must date-time values use a particular precision or timezone representation beyond the declared date-time format? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-22.1** For 403 and 404, the error key names the resource type (article, comment, profile). — openapi.yml L791-810
- **IC-22.2** Responses are JSON with Content-Type application/json; charset=utf-8. — api-response-format.md L7
- **IC-22.3** Unauthorized responses use the errors model; the specification's missing-token example is errors.token containing is missing. — openapi.yml L771-780
- **IC-22.4** The errors model contains field-name arrays of strings. Forbidden and NotFound examples contain forbidden and not found respectively; their error key identifies the resource type, not a literal resource name. — openapi.yml L637-647; openapi.yml L791-810

## US-23 Cross-origin access

**Persona:** API consumer · **Type:** Enabler · **Priority (proposed):** Should · **Status:** Draft · **Baseline:** R-045

As a frontend developer, I want the API to accept requests from a web app hosted on another origin, so that frontend and backend can be deployed separately.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-23.1** When frontend and backend run on different hosts or ports, the service answers browser preflight requests and allows the required origin and request headers. — cors.md L7

### Acceptance criteria

#### AC-23.1 Preflight request (API)

Spec: cors.md L7

```gherkin
Scenario: Preflight request
  Given the web app runs on a different origin from the API
  When the browser sends OPTIONS /api/articles with Access-Control-Request-Headers: Content-Type
  Then the response includes Access-Control-Allow-Origin
    And the response includes Access-Control-Allow-Headers covering Content-Type
```

### Open questions

- **OQ-23.1** Which origins are allowed: any origin, or a configured list? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

None.
