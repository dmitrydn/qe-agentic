# EP-05 Comments

Let members discuss articles.

**BA-ASSUMPTION:** Epic grouping and goal framing are BA judgement, not stakeholder-authored specification.

## US-16 Comment on an article

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-033, R-034, R-052, R-065

As a member, I want to comment on an article, so that I can respond to the author and other readers.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-16.1** The comment form ("Write a comment...", "Post Comment") is in the comments section at the bottom of the article page. — templates.md L562-566; routing.md L17
- **BR-16.2** Posting requires authentication; body is required; the created comment and its author are returned. — endpoints.md L207-209; api-response-format.md L108-122; openapi.yml L338-365
- **BR-16.3** Comments cannot be edited after posting. — features.md L10

### Acceptance criteria

#### AC-16.1 Member posts a comment (UI)

Spec: templates.md L562-566

```gherkin
Scenario: Member posts a comment
  Given I am signed in
    And I am on an article page
  When I write "Great post" in the comment box
    And I click "Post Comment"
  Then my comment appears in the comments section with my name
```

#### AC-16.2 Comment via API (API)

Spec: openapi.yml L338-365; api-response-format.md L108-122

```gherkin
Scenario: Comment via API
  Given I am signed in
    And an article exists
  When I POST /api/articles/<slug>/comments with body "Great post"
  Then the response status is 201
    And the response contains comment.id, comment.body and comment.author
```

#### AC-16.3 Empty comment (API)

Spec: endpoints.md L209; error-handling.md L7

```gherkin
Scenario: Empty comment
  Given I am signed in
  When I POST a comment without a body
  Then the response status is 422
```

#### AC-16.4 Comment without a token (API)

Spec: endpoints.md L207; error-handling.md L21

```gherkin
Scenario: Comment without a token
  Given I have no token
  When I POST /api/articles/<slug>/comments
  Then the response status is 401
```

### Open questions

- **OQ-16.1** What do visitors see where the comment form would be (a sign-in prompt, nothing)? → [open-questions.md](../open-questions.md)
- **OQ-16.2** Is there a maximum comment length? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-16.1** The create-comment request body contains a required comment object whose body field is required. — openapi.yml L630-636; openapi.yml L882-893
- **IC-16.2** A Comment requires id, createdAt, updatedAt, body and author. id is integer, createdAt and updatedAt are date-time strings, body is string and author is a Profile. — openapi.yml L609-629
- **IC-16.3** POST /api/articles/{slug}/comments declares 201 Comment, 401 Unauthorized, 404 NotFound and 422 GenericError responses. — openapi.yml L338-365

## US-17 Read comments

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-035, R-037

As a reader, I want to read the discussion under an article, so that I can see what others think.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-17.1** Reading an article's comments works with or without authentication and returns a list of comments. — endpoints.md L211-215; api-response-format.md L127-141
- **BR-17.2** Each comment shows the author's picture and name, the date and the text. — templates.md L577-582
- **BR-17.3** Comments cannot be edited. — features.md L10

### Acceptance criteria

#### AC-17.1 Reader sees comments (UI)

Spec: templates.md L577-582

```gherkin
Scenario: Reader sees comments
  Given an article has 2 comments
  When I open the article
  Then both comments are shown with author, date and text
```

#### AC-17.2 Comments via API (API)

Spec: endpoints.md L211-215

```gherkin
Scenario: Comments via API
  Given an article has 2 comments
  When I GET /api/articles/<slug>/comments without a token
  Then the response status is 200
    And the comments array has 2 items
```

### Open questions

- **OQ-17.1** In which order are comments shown (oldest or newest first)? → [open-questions.md](../open-questions.md)
- **OQ-17.2** Are comments paginated? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-17.1** GET /api/articles/{slug}/comments declares 200 with a comments array, 401 Unauthorized, 404 NotFound and 422 GenericError responses; optional-auth token handling remains OQ-03.4. — openapi.yml L315-337; openapi.yml L675-685

## US-18 Delete my comment

**Persona:** Author · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-036, R-066

As a comment author, I want to delete my comment, so that I can remove something I no longer want to say.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-18.1** Deleting a comment requires authentication and completes without returning content. — endpoints.md L217-221; openapi.yml L366-398
- **BR-18.2** The delete icon is shown only to the comment's author. — routing.md L18; templates.md L599-600

### Acceptance criteria

#### AC-18.1 Comment author deletes their comment (UI)

Spec: templates.md L599-600; routing.md L18

```gherkin
Scenario: Comment author deletes their comment
  Given I am signed in
    And I commented on an article
  When I click the delete icon on my comment
  Then my comment is removed from the list
```

#### AC-18.2 Others do not see the delete icon (UI)

Spec: routing.md L18

```gherkin
Scenario: Others do not see the delete icon
  Given "anna" commented on an article
    And I am signed in as "jake"
  When I open the article
  Then anna's comment has no delete icon
```

#### AC-18.3 Another member tries to delete via API (API)

Spec: openapi.yml L366-398

**BA-ASSUMPTION:** API author-only comment deletion awaits OQ-18.2; 403 is declared without this predicate.

```gherkin
Scenario: Another member tries to delete via API
  Given "anna" commented on an article
    And I am signed in as "jake"
  When I DELETE /api/articles/<slug>/comments/<anna's comment id>
  Then the response status is 403
    And the response body contains errors.comment
```

### Open questions

- **OQ-18.1** May an article's author delete other people's comments on their own article? → [open-questions.md](../open-questions.md)
- **OQ-18.2** Which users may delete a comment through the API, and does being a non-author always cause 403? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-18.1** DELETE /api/articles/{slug}/comments/{id} requires an integer id path parameter and declares 204 with no content, 401 Unauthorized, 403 Forbidden, 404 NotFound and 422 GenericError responses; the ownership condition remains OQ-18.2. — openapi.yml L366-398; openapi.yml L768-770
