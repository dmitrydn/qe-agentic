# EP-04 Discovery & feeds

Help readers find articles: global feed, personal feed, tags and paging.

**BA-ASSUMPTION:** Epic grouping and goal framing are BA judgement, not stakeholder-authored specification.

## US-12 Browse the global feed

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-014, R-020, R-050, R-051, R-055, R-073

As a reader, I want to see the latest articles from everyone, so that I can discover new content.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-12.1** The home page (/) has a default "Global Feed" tab. — routing.md L5-7; templates.md L118-120
- **BR-12.2** The list contains the most recent articles from all authors, newest first, and needs no authentication. — endpoints.md L102; endpoints.md L126
- **BR-12.4** Each preview shows author, date, favourites count, title, description, "Read more..." and tags. — templates.md L145-185

### Acceptance criteria

#### AC-12.1 Reader sees the global feed (UI)

Spec: templates.md L120; endpoints.md L126

```gherkin
Scenario: Reader sees the global feed
  Given articles exist from several authors
  When I open the home page
  Then the "Global Feed" tab is selected
    And articles from all authors are listed, newest first
```

#### AC-12.2 Global list via API (API)

Spec: endpoints.md L126; api-response-format.md L62-67; api-response-format.md L102

```gherkin
Scenario: Global list via API
  Given several articles exist
  When I GET /api/articles without a token
  Then the response status is 200
    And articles are ordered by createdAt, newest first
    And no article contains a body
    And articlesCount is present
```

### Open questions

- **OQ-12.1** What does the home page show when there are no articles yet? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-12.1** List responses leave out the article body and include articlesCount. — api-response-format.md L62-67; api-response-format.md L102
- **IC-12.2** Article list and feed responses require articles and integer articlesCount. Each article entry requires slug, title, description, tagList, createdAt, updatedAt, favorited, favoritesCount and author, without a body field; author is a Profile. — openapi.yml L697-745; api-response-format.md L62-67
- **IC-12.3** GET /api/articles declares 200 MultipleArticles, 401 Unauthorized and 422 GenericError responses; optional-auth token handling remains OQ-03.4. — openapi.yml L183-213
- **IC-12.4** The home banner shows conduit and A place to share your knowledge. — templates.md L126-131

## US-13 Read my personal feed

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-021, R-022, R-023, R-055, R-073

As a member, I want a feed of articles from the authors I follow, so that I don't miss their new posts.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-13.1** A "Your Feed" tab appears on the home page after signing in. — templates.md L122
- **BR-13.2** Your Feed requires authentication and returns only articles by followed authors, newest first. — endpoints.md L134
- **BR-13.3** Your Feed supports the same page size and number of skipped articles as the global list. — endpoints.md L132

### Acceptance criteria

#### AC-13.1 Signed-in member sees Your Feed (UI)

Spec: templates.md L122

```gherkin
Scenario: Signed-in member sees Your Feed
  Given I am signed in
  When I open the home page
  Then a "Your Feed" tab is shown
```

#### AC-13.2 Visitor does not see Your Feed (UI)

Spec: templates.md L122

```gherkin
Scenario: Visitor does not see Your Feed
  Given I am a visitor
  When I open the home page
  Then no "Your Feed" tab is shown
```

#### AC-13.3 Feed contains only followed authors (API)

Spec: endpoints.md L134

```gherkin
Scenario: Feed contains only followed authors
  Given I follow "jake" and not "anna"
    And both have published articles
  When I GET /api/articles/feed
  Then every returned article has author.username "jake"
```

#### AC-13.4 Feed without a token (API)

Spec: endpoints.md L134; error-handling.md L21

```gherkin
Scenario: Feed without a token
  Given I have no token
  When I GET /api/articles/feed
  Then the response status is 401
```

### Open questions

- **OQ-13.1** Which tab is selected by default for a signed-in member: Global Feed or Your Feed? → [open-questions.md](../open-questions.md)
- **OQ-13.2** What does Your Feed show when I follow nobody? → [open-questions.md](../open-questions.md)
- **OQ-13.3** Are my own articles in my feed? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-13.1** GET /api/articles/feed declares 200 MultipleArticles, 401 Unauthorized and 422 GenericError responses. — openapi.yml L164-180

## US-14 Discover articles by tag

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Should · **Status:** Draft · **Baseline:** R-015, R-040, R-053, R-054, R-055, R-073

As a reader, I want to pick a popular tag and see articles about that topic, so that I can follow subjects I care about.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-14.1** The home page shows a list of tags under "Popular Tags". — routing.md L6; templates.md L203
- **BR-14.2** Clicking a tag adds a tab named after the tag, listing articles with that tag. — templates.md L121; endpoints.md L106-108
- **BR-14.3** Viewing the list of tags needs no authentication and returns tag strings. — endpoints.md L239-243; api-response-format.md L146-152

### Acceptance criteria

#### AC-14.1 Reader filters by a tag (UI)

Spec: templates.md L121

```gherkin
Scenario: Reader filters by a tag
  Given articles tagged "dragons" and others exist
  When I click the "dragons" tag on the home page
  Then a "dragons" tab appears and is selected
    And only articles tagged "dragons" are listed
```

#### AC-14.2 Tags via API (API)

Spec: api-response-format.md L146-152

```gherkin
Scenario: Tags via API
  Given articles with tags exist
  When I GET /api/tags
  Then the response status is 200
    And the response contains a tags array of strings
```

#### AC-14.3 Filter by tag via API (API)

Spec: endpoints.md L106-108

```gherkin
Scenario: Filter by tag via API
  Given articles tagged "dragons" exist
  When I GET /api/articles?tag=dragons
  Then every returned article has "dragons" in tagList
```

### Open questions

- **OQ-14.1** What makes a tag "popular", how are tags ordered, and how many are shown? → [open-questions.md](../open-questions.md)
- **OQ-14.2** Is tag matching case-sensitive? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-14.1** GET /api/tags declares 200 Tags and 422 GenericError responses, with a required tags array of strings. — openapi.yml L443-453; openapi.yml L649-661

## US-15 Page through article lists

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Should · **Status:** Draft · **Baseline:** R-018, R-019, R-051, R-056

As a reader, I want long article lists split into pages, so that the page loads quickly and I can browse further back.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-15.1** Home-page article lists are paginated. — routing.md L8; templates.md L191-196
- **BR-15.2** Article lists return 20 articles by default, starting at the first article; the requested page size must be at least 1 and the number skipped at least 0. — endpoints.md L118-124; openapi.yml L895-911
- **BR-15.3** The feed supports the same paging parameters. — endpoints.md L132
- **BR-15.5** The page size is a whole number of at least 1, defaulting to 20; the number of items to skip is a whole number of at least 0. — openapi.yml L895-911

### Acceptance criteria

#### AC-15.1 Reader goes to page 2 (UI)

Spec: templates.md L191-196

```gherkin
Scenario: Reader goes to page 2
  Given more articles exist than fit on one page
  When I click page 2
  Then the next set of articles is shown
    And no article from page 1 is repeated
```

#### AC-15.2 Default page size via API (API)

Spec: endpoints.md L118; api-response-format.md L102

**BA-ASSUMPTION:** The assertion on total articlesCount awaits OQ-15.3; only its presence/type is explicit.

```gherkin
Scenario: Default page size via API
  Given 25 articles exist
  When I GET /api/articles
  Then 20 articles are returned
    And articlesCount is 25
```

#### AC-15.3 Limit and offset via API (API)

Spec: endpoints.md L118-124

```gherkin
Scenario: Limit and offset via API
  Given 25 articles exist
  When I GET /api/articles?limit=10&offset=20
  Then 5 articles are returned
```

### Open questions

- **OQ-15.1** How many articles per page does the UI show? → [open-questions.md](../open-questions.md)
- **OQ-15.2** What is the maximum limit, and what happens with invalid values (limit=0, negative, non-numeric)? → [open-questions.md](../open-questions.md)
- **OQ-15.3** Is articlesCount the filtered total before pagination, the returned page size, or something else? → [open-questions.md](../open-questions.md)
- **OQ-15.4** What happens beyond the last offset, and which timestamp and tie-break define most-recent article order? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-15.1** Pagination markup uses page-item and page-link classes, with the active page marked active. — templates.md L191-196
