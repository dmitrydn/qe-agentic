# EP-06 Social

Let members follow authors and favourite articles.

## US-19 Follow and unfollow authors

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-012, R-013

As a member, I want to follow authors I like, so that their new articles appear in my personal feed.

### Business rules

- **BR-19.1** Following and unfollowing require authentication and return the author's profile. — `endpoints.md` L82-96
- **BR-19.2** The profile's following flag shows whether I follow that author. — `api-response-format.md` L25-33
- **BR-19.3** A Follow button appears on the profile page and on the article page. — `templates.md` L305; `templates.md` L498
- **BR-19.4** Following an unknown username returns 404. — `openapi.yml` L118-141
- **BR-19.5** Followed authors' articles appear in Your Feed (see US-13). — `endpoints.md` L134

### Acceptance criteria

#### AC-19.1 Member follows an author (UI)

Spec: `templates.md` L305; `endpoints.md` L134

```gherkin
Scenario: Member follows an author
  Given I am signed in
    And I am on jake's profile
  When I click "Follow jake"
  Then I now follow jake
    And jake's new articles appear in Your Feed
```

#### AC-19.2 Follow via API (API)

Spec: `endpoints.md` L82-88

```gherkin
Scenario: Follow via API
  Given I am signed in
    And I don't follow "jake"
  When I POST /api/profiles/jake/follow
  Then the response status is 200
    And profile.following is true
```

#### AC-19.3 Unfollow via API (API)

Spec: `endpoints.md` L90-96

```gherkin
Scenario: Unfollow via API
  Given I follow "jake"
  When I DELETE /api/profiles/jake/follow
  Then the response status is 200
    And profile.following is false
```

#### AC-19.4 Follow without a token (API)

Spec: `error-handling.md` L21

```gherkin
Scenario: Follow without a token
  Given I have no token
  When I POST /api/profiles/jake/follow
  Then the response status is 401
```

### Open questions

- **OQ-19.1** The article page shows a follower count next to Follow, but the profile data has no follower count. Is the count required? → [open-questions.md](../open-questions.md)
- **OQ-19.2** Can I follow myself? What happens if I follow someone twice? → [open-questions.md](../open-questions.md)
- **OQ-19.3** What happens when a visitor clicks Follow? → [open-questions.md](../open-questions.md)

## US-20 Favourite and unfavourite articles

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-038, R-039

As a member, I want to favourite articles, so that I can show appreciation and find them again later.

### Business rules

- **BR-20.1** Favouriting and unfavouriting require authentication and return the article. — `endpoints.md` L223-237
- **BR-20.2** Each article shows whether I favourited it (favorited) and how many times it was favourited (favoritesCount). — `api-response-format.md` L48-49
- **BR-20.3** A heart button with the count appears on previews and on the article page. — `templates.md` L155; `templates.md` L503
- **BR-20.4** Favourited articles appear on my profile's favourites tab (see US-07). — `routing.md` L19-21

### Acceptance criteria

#### AC-20.1 Member favourites an article (UI)

Spec: `templates.md` L155; `api-response-format.md` L48-49

```gherkin
Scenario: Member favourites an article
  Given I am signed in
    And an article has 3 favourites
  When I click its heart button
  Then the button shows I have favourited it
    And the count shows 4
```

#### AC-20.2 Favourite via API (API)

Spec: `endpoints.md` L223-229

```gherkin
Scenario: Favourite via API
  Given I am signed in
    And I haven't favourited the article
  When I POST /api/articles/<slug>/favorite
  Then the response status is 200
    And article.favorited is true
    And article.favoritesCount has increased by 1
```

#### AC-20.3 Unfavourite via API (API)

Spec: `endpoints.md` L231-237

```gherkin
Scenario: Unfavourite via API
  Given I have favourited the article
  When I DELETE /api/articles/<slug>/favorite
  Then the response status is 200
    And article.favorited is false
```

#### AC-20.4 Favourite without a token (API)

Spec: `error-handling.md` L21

```gherkin
Scenario: Favourite without a token
  Given I have no token
  When I POST /api/articles/<slug>/favorite
  Then the response status is 401
```

### Open questions

- **OQ-20.1** Can I favourite my own article? What happens if I favourite twice? → [open-questions.md](../open-questions.md)
- **OQ-20.2** What happens when a visitor clicks the heart? → [open-questions.md](../open-questions.md)
