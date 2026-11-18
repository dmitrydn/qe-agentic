# EP-03 Articles

Let members publish, edit and delete articles, and let anyone read them.

## US-08 Publish an article

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-025, R-026, R-027, R-031, R-049, R-061

As a member, I want to write and publish an article with a title, summary, Markdown body and tags, so that I can share my knowledge.

### Business rules

- **BR-08.1** The editor for a new article is at /editor. — `routing.md` L13
- **BR-08.2** The editor has Article Title, "What's this article about?", body (Markdown) and "Enter tags" fields, and a "Publish Article" button. — `templates.md` L451-470
- **BR-08.3** Publishing requires authentication. — `endpoints.md` L159
- **BR-08.4** Title, description and body are required; tags are optional. — `endpoints.md` L161-163
- **BR-08.5** A published article has slug, title, description, body, tagList, createdAt, updatedAt, favorited, favoritesCount and author; status 201. — `api-response-format.md` L38-57; `openapi.yml` L219-239
- **BR-08.6** Every article gets a unique slug; two articles with the same title get different slugs. — `endpoints.md` L185

### Acceptance criteria

#### AC-08.1 Member publishes an article (UI)

Spec: `templates.md` L451-470; `routing.md` L14

```gherkin
Scenario: Member publishes an article
  Given I am signed in
    And I am on /editor
  When I enter a title, description, body and tags
    And I click "Publish Article"
  Then the article is created
    And I can open it at /article/<its slug>
```

#### AC-08.2 Create via API (API)

Spec: `openapi.yml` L219-239; `api-response-format.md` L38-57

```gherkin
Scenario: Create via API
  Given I am signed in
  When I POST /api/articles with title, description, body and tagList
  Then the response status is 201
    And the response contains the article with my username as author.username
```

#### AC-08.3 Two articles with the same title (API)

Spec: `endpoints.md` L185

```gherkin
Scenario: Two articles with the same title
  Given I have published an article titled "Hello"
  When I publish another article titled "Hello"
  Then the two articles have different slugs
```

#### AC-08.4 Required field missing (outline) (API)

Spec: `endpoints.md` L161; `error-handling.md` L7-17

```gherkin
Scenario Outline: Required field missing
  Given I am signed in
  When I POST /api/articles without <field>
  Then the response status is 422
    And the response body contains errors.<field>

  Examples:
    | field |
    | title |
    | description |
    | body |
```

#### AC-08.5 Publish without a token (API)

Spec: `error-handling.md` L21

```gherkin
Scenario: Publish without a token
  Given I have no token
  When I POST /api/articles
  Then the response status is 401
```

### Open questions

- **OQ-08.1** OpenAPI lists a 409 conflict on create. What can conflict, if duplicate titles must still succeed? → [open-questions.md](../open-questions.md)
- **OQ-08.2** What are the tag rules (case, duplicates, allowed characters, maximum number)? → [open-questions.md](../open-questions.md)
- **OQ-08.3** Are there length limits for title, description and body? → [open-questions.md](../open-questions.md)
- **OQ-08.4** Where does the member land after publishing? → [open-questions.md](../open-questions.md)

## US-09 Edit my article

**Persona:** Author · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-028, R-029, R-030, R-061

As an author, I want to edit my published article, so that I can correct mistakes and keep it up to date.

### Business rules

- **BR-09.1** The editor for an existing article is at /editor/:slug. — `routing.md` L13
- **BR-09.2** Editing requires authentication; title, description and body can each be changed independently; the updated article is returned. — `endpoints.md` L179-181
- **BR-09.3** Changing the title changes the slug. — `endpoints.md` L183
- **BR-09.4** Only the author may edit: other members get 403 with an "article" error key; an unknown slug gives 404. — `openapi.yml` L260-288; `openapi.yml` L791-792

### Acceptance criteria

#### AC-09.1 Author changes the title (UI)

Spec: `endpoints.md` L183

```gherkin
Scenario: Author changes the title
  Given I am the author of an article
    And I am on its /editor/<slug> page
  When I change the title
    And I publish the change
  Then the article shows the new title
    And its URL uses a new slug
```

#### AC-09.2 Partial update via API (API)

Spec: `endpoints.md` L179-181

```gherkin
Scenario: Partial update via API
  Given I am the author of an article
  When I PUT /api/articles/<slug> with only a new body
  Then the response status is 200
    And the body is updated and the title is unchanged
```

#### AC-09.3 Another member tries to edit (API)

Spec: `openapi.yml` L260-288; `openapi.yml` L791-792

```gherkin
Scenario: Another member tries to edit
  Given "anna" wrote an article
    And I am signed in as "jake"
  When I PUT /api/articles/<anna's slug>
  Then the response status is 403
    And the response body contains errors.article
```

### Open questions

- **OQ-09.1** Can tags be changed when editing? The list of editable fields leaves out tagList. → [open-questions.md](../open-questions.md)
- **OQ-09.2** Who sees the "Edit Article" button? The spec has an unresolved TODO here. → [open-questions.md](../open-questions.md)
- **OQ-09.3** Do old links (the previous slug) still work after a title change? → [open-questions.md](../open-questions.md)

## US-10 Delete my article

**Persona:** Author · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-032, R-063

As an author, I want to delete an article I no longer want published, so that it is no longer visible to anyone.

### Business rules

- **BR-10.1** Deleting requires authentication and returns status 204. — `endpoints.md` L187-191; `openapi.yml` L289-315
- **BR-10.2** The "Delete Article" button is shown only to the article's author. — `routing.md` L15; `templates.md` L509
- **BR-10.3** Other members get 403; an unknown slug gives 404. — `openapi.yml` L289-315

### Acceptance criteria

#### AC-10.1 Author deletes their article (UI)

Spec: `templates.md` L509

```gherkin
Scenario: Author deletes their article
  Given I am the author of an article
    And I am on its article page
  When I click "Delete Article"
  Then the article is deleted
    And opening /article/<slug> no longer shows it
```

#### AC-10.2 Non-author does not see the delete button (UI)

Spec: `routing.md` L15

```gherkin
Scenario: Non-author does not see the delete button
  Given "anna" wrote an article
    And I am a visitor or signed in as "jake"
  When I open anna's article
  Then there is no "Delete Article" button
```

#### AC-10.3 Another member tries to delete via API (API)

Spec: `openapi.yml` L289-315

```gherkin
Scenario: Another member tries to delete via API
  Given "anna" wrote an article
    And I am signed in as "jake"
  When I DELETE /api/articles/<anna's slug>
  Then the response status is 403
    And the article still exists
```

#### AC-10.4 Delete via API (API)

Spec: `openapi.yml` L289-315; `openapi.yml` L240-259

```gherkin
Scenario: Delete via API
  Given I am the author of an article
  When I DELETE /api/articles/<slug>
  Then the response status is 204
    And GET /api/articles/<slug> returns 404
```

### Open questions

- **OQ-10.1** Is the author asked to confirm before deleting? → [open-questions.md](../open-questions.md)
- **OQ-10.2** What happens to the article's comments and favourites when it is deleted? → [open-questions.md](../open-questions.md)
- **OQ-10.3** Where does the author land after deleting? → [open-questions.md](../open-questions.md)

## US-11 Read an article

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-024, R-049, R-062, R-064, R-065

As a reader, I want to open an article and read it formatted, so that long content is easy to follow.

### Business rules

- **BR-11.1** Articles are at /article/:slug. — `routing.md` L14
- **BR-11.2** GET /api/articles/:slug needs no authentication and returns the full article including its body. — `endpoints.md` L136-140; `api-response-format.md` L38-57
- **BR-11.3** The Markdown body is rendered in the browser. — `routing.md` L16
- **BR-11.4** The comments section is at the bottom of the article page. — `routing.md` L17
- **BR-11.5** An unknown slug returns 404. — `openapi.yml` L240-259

### Acceptance criteria

#### AC-11.1 Reader opens an article (UI)

Spec: `routing.md` L14-17

```gherkin
Scenario: Reader opens an article
  Given an article exists whose body contains "## Introduction"
  When I open /article/<slug>
  Then I see its title, author and tags
    And "Introduction" is rendered as a heading, not as raw Markdown
    And the comments section is below the article
```

#### AC-11.2 Article via API (API)

Spec: `endpoints.md` L136-140

```gherkin
Scenario: Article via API
  Given an article exists
  When I GET /api/articles/<slug> without a token
  Then the response status is 200
    And the response contains article.body
```

#### AC-11.3 Unknown article (API)

Spec: `openapi.yml` L240-259

```gherkin
Scenario: Unknown article
  Given no article has slug "nope"
  When I GET /api/articles/nope
  Then the response status is 404
```

### Open questions

- **OQ-11.1** When a signed-in member reads an article, should favorited and author.following reflect them? The endpoint says no authentication is required. → [open-questions.md](../open-questions.md)
- **OQ-11.2** Which HTML is allowed in rendered Markdown (scripts, links, images)? → [open-questions.md](../open-questions.md)
