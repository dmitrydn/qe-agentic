# EP-02 Profiles & settings

Let members manage their own details and see other members' public profiles.

**BA-ASSUMPTION:** Epic grouping and goal framing are BA judgement, not stakeholder-authored specification.

## US-05 Update my settings

**Persona:** Member · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-008, R-009, R-010, R-059

As a member, I want to update my picture, username, bio, email and password, so that my profile is accurate and my account stays secure.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-05.1** The settings page is at /settings. — routing.md L12
- **BR-05.2** The form has fields for profile picture URL, username (placeholder "Your Name"), bio, email and new password, and an "Update Settings" button. — templates.md L404-426
- **BR-05.3** Updating my settings requires authentication, accepts email, username, password, image and bio, and returns the updated user. — endpoints.md L56-74
- **BR-05.4** Accounts cannot be deleted. — features.md L8
- **BR-05.5** At least one settings field must be provided when requesting a user update. — openapi.yml L846-857

### Acceptance criteria

#### AC-05.1 Member updates their bio (UI)

Spec: templates.md L404-426; routing.md L20

```gherkin
Scenario: Member updates their bio
  Given I am signed in
    And I am on the /settings page
  When I change my bio
    And I click "Update Settings"
  Then my new bio is saved
    And my profile shows the new bio
```

#### AC-05.2 Partial update via API (API)

Spec: endpoints.md L56-74

```gherkin
Scenario: Partial update via API
  Given I am signed in
  When I PUT /api/user with only a new bio
  Then the response status is 200
    And the response contains the updated bio
```

#### AC-05.3 Update without a token (API)

Spec: endpoints.md L72; error-handling.md L21

```gherkin
Scenario: Update without a token
  Given I have no token
  When I PUT /api/user
  Then the response status is 401
```

### Open questions

- **OQ-05.1** What happens if I change my username or email to one already taken? → [open-questions.md](../open-questions.md)
- **OQ-05.2** Must I enter my current password to set a new one? → [open-questions.md](../open-questions.md)
- **OQ-05.3** The field placeholder says "Your Name" but it edits the username. Is that intended? → [open-questions.md](../open-questions.md)
- **OQ-05.4** Does leaving a field empty clear it or leave it unchanged? → [open-questions.md](../open-questions.md)
- **OQ-05.5** Is the picture URL validated? → [open-questions.md](../open-questions.md)
- **OQ-05.6** What is the response for an empty user update, and what happens to existing sessions after a password change? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-05.1** PUT /api/user declares 200 User, 401 Unauthorized and 422 GenericError responses. — openapi.yml L76-87

## US-06 View a member's profile

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Must · **Status:** Draft · **Baseline:** R-011, R-048, R-067, R-068

As a reader, I want to view an author's profile, so that I can learn who they are before following them.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-06.1** Profiles are at /profile/:username and show basic user info (picture, username, bio). — routing.md L19-20; templates.md L289-309
- **BR-06.2** Viewing a member's profile works with or without authentication and returns username, bio, image and following. — endpoints.md L76-80; api-response-format.md L25-33
- **BR-06.3** An unknown username returns a not-found error. — openapi.yml L95-117
- **BR-06.4** The profile page has a "Follow <name>" button and an "Edit Profile Settings" button. — templates.md L305; templates.md L309

### Acceptance criteria

#### AC-06.1 Reader opens a profile (UI)

Spec: routing.md L19-20

```gherkin
Scenario: Reader opens a profile
  Given a member "jake" exists
  When I open /profile/jake
  Then I see jake's picture, username and bio
```

#### AC-06.2 Profile via API (API)

Spec: endpoints.md L76-80; api-response-format.md L25-33

```gherkin
Scenario: Profile via API
  Given a member "jake" exists
  When I GET /api/profiles/jake without a token
  Then the response status is 200
    And the response contains profile.username, profile.bio, profile.image and profile.following
```

#### AC-06.3 Unknown profile (API)

Spec: openapi.yml L95-117

```gherkin
Scenario: Unknown profile
  Given no member "nobody" exists
  When I GET /api/profiles/nobody
  Then the response status is 404
```

### Open questions

- **OQ-06.1** Who sees "Follow" and who sees "Edit Profile Settings"? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

- **IC-06.1** The profile response requires a profile object containing username, bio, image and following; following is boolean and bio and image may be null. — openapi.yml L521-540; openapi.yml L746-756
- **IC-06.2** GET /api/profiles/{username} declares 200 Profile, 401 Unauthorized, 404 NotFound and 422 GenericError responses; optional-auth token handling remains OQ-03.4. — openapi.yml L93-111

## US-07 Browse a member's articles and favourites

**Persona:** Visitor · **Type:** Feature · **Priority (proposed):** Should · **Status:** Draft · **Baseline:** R-016, R-017, R-067, R-069

As a reader, I want to see the articles a member wrote and the ones they favourited, so that I can find more content I'm likely to enjoy.

**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval.

### Business rules

- **BR-07.1** The profile lists the member's own articles ("My Articles" tab) or their favourited articles ("Favorited Articles" tab, /profile/:username/favorites). — routing.md L19-21; templates.md L322-325
- **BR-07.2** Articles can be filtered by author and by the user who favourited them. — endpoints.md L110-116

### Acceptance criteria

#### AC-07.1 Member's own articles (UI)

Spec: routing.md L21

```gherkin
Scenario: Member's own articles
  Given "jake" has written 2 articles
  When I open /profile/jake
  Then the "My Articles" tab lists exactly jake's 2 articles
```

#### AC-07.2 Member's favourites (UI)

Spec: routing.md L19-21

```gherkin
Scenario: Member's favourites
  Given "jake" has favourited 1 article
  When I open /profile/jake/favorites
  Then the "Favorited Articles" tab lists that 1 article
```

#### AC-07.3 Filter by author via API (API)

Spec: endpoints.md L110-112

```gherkin
Scenario: Filter by author via API
  Given "jake" and "anna" have both written articles
  When I GET /api/articles?author=jake
  Then every returned article has author.username "jake"
```

#### AC-07.4 Filter by favourited via API (API)

Spec: endpoints.md L114-116

```gherkin
Scenario: Filter by favourited via API
  Given "jake" has favourited an article
  When I GET /api/articles?favorited=jake
  Then every returned article is one jake has favourited
```

### Open questions

- **OQ-07.1** Should the tab read "My Articles" on someone else's profile? → [open-questions.md](../open-questions.md)
- **OQ-07.2** Can author and favorited (and tag) filters be combined? → [open-questions.md](../open-questions.md)
- **OQ-07.3** Does filtering by an unknown username return an empty list or 404? → [open-questions.md](../open-questions.md)
- **OQ-07.4** Are author and favorited filters case-sensitive, and what happens for an unknown tag? → [open-questions.md](../open-questions.md)

### Interface contract (not for BA review)

None.
