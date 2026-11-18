# Open questions

| OQ ID | Story ID | Question | Why it matters | Spec evidence | Owner | Answer / decision | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OQ-01.1 | US-01 | What are the password rules (minimum length, complexity)? | No password policy is stated anywhere; testers cannot derive boundary cases. | openapi.yml L44-60 | Product Owner |  | Open |
| OQ-01.2 | US-01 | What makes an email valid, and must emails be unique like usernames? | Only a username conflict is shown; email uniqueness and format are unstated. | openapi.yml L781-790 | Product Owner |  | Open |
| OQ-01.3 | US-01 | Which characters and lengths are allowed in a username? | No rules stated; affects profile URLs (/profile/:username). | routing.md L19 | Product Owner |  | Open |
| OQ-01.4 | US-01 | Where does the user land after a successful sign-up? | Post-registration navigation is not specified. | routing.md L9 | Product Owner |  | Open |
| OQ-02.1 | US-02 | Is a wrong password a 401 (OpenAPI) or a 422 validation error (error-handling page), and what message is shown? | The two sources point different ways; the expected result of the most-tested flow is ambiguous. | openapi.yml L28-42; error-handling.md L7 | Product Owner |  | Open |
| OQ-02.2 | US-02 | Is there any lockout or rate limit after repeated failed attempts? | Security-relevant behaviour is unstated. | openapi.yml L28-42 | Product Owner |  | Open |
| OQ-02.3 | US-02 | How long does a session (token) stay valid? | Token lifetime and expiry behaviour are unstated. | routing.md L10 | Product Owner |  | Open |
| OQ-03.1 | US-03 | What should the app do when the stored token is invalid or expired? | No behaviour specified for a stale session (sign out silently, show error, redirect?). | routing.md L10 | Product Owner |  | Open |
| OQ-03.2 | US-03 | Is an invalid (not missing) token also a 401? | The error page only covers a missing token. | error-handling.md L21 | Product Owner |  | Open |
| OQ-04.1 | US-04 | Where is the user taken after signing out? | Post-logout navigation is not specified. | templates.md L430 | Product Owner |  | Open |
| OQ-04.2 | US-04 | Is the token invalidated on the server, or only removed from the browser? | Tokens are stateless JWTs; a copied token may stay usable. | routing.md L10 | Product Owner |  | Open |
| OQ-05.1 | US-05 | What happens if I change my username or email to one already taken? | PUT /api/user declares no 409 conflict response, unlike registration. | openapi.yml L76-94 | Product Owner |  | Open |
| OQ-05.2 | US-05 | Must I enter my current password to set a new one? | No re-authentication rule for a security-sensitive change. | templates.md L423 | Product Owner |  | Open |
| OQ-05.3 | US-05 | The field placeholder says "Your Name" but it edits the username. Is that intended? | Users may think they are setting a display name, then find their profile URL changed. | templates.md L407 | Product Owner |  | Open |
| OQ-05.4 | US-05 | Does leaving a field empty clear it or leave it unchanged? | Not specified for any settings field. | endpoints.md L74 | Product Owner |  | Open |
| OQ-05.5 | US-05 | Is the picture URL validated? | No format rule for image. | templates.md L404 | Product Owner |  | Open |
| OQ-06.1 | US-06 | Who sees "Follow" and who sees "Edit Profile Settings"? | The template shows both buttons; the rule for which one appears (own profile vs others, signed out) is unstated. | templates.md L305-309 | Product Owner |  | Open |
| OQ-07.1 | US-07 | Should the tab read "My Articles" on someone else's profile? | The label only makes sense on your own profile. | templates.md L322 | Product Owner |  | Open |
| OQ-07.2 | US-07 | Can author and favorited (and tag) filters be combined? | Combination behaviour is unstated. | endpoints.md L102-116 | Product Owner |  | Open |
| OQ-07.3 | US-07 | Does filtering by an unknown username return an empty list or 404? | Unstated. | endpoints.md L110-116 | Product Owner |  | Open |
| OQ-08.1 | US-08 | OpenAPI lists a 409 conflict on create. What can conflict, if duplicate titles must still succeed? | The contract and the slug rule appear to contradict each other. | openapi.yml L219-239; endpoints.md L185 | Product Owner |  | Open |
| OQ-08.2 | US-08 | What are the tag rules (case, duplicates, allowed characters, maximum number)? | None stated. | endpoints.md L163 | Product Owner |  | Open |
| OQ-08.3 | US-08 | Are there length limits for title, description and body? | No maxLength anywhere in the contract. | endpoints.md L161 | Product Owner |  | Open |
| OQ-08.4 | US-08 | Where does the member land after publishing? | Unstated. | templates.md L470 | Product Owner |  | Open |
| OQ-09.1 | US-09 | Can tags be changed when editing? The list of editable fields leaves out tagList. | Authors will expect to fix tags; the spec doesn't allow or forbid it. | endpoints.md L181; openapi.yml L596-608 | Product Owner |  | Open |
| OQ-09.2 | US-09 | Who sees the "Edit Article" button? The spec has an unresolved TODO here. | Visibility rule for edit controls is incomplete in the spec itself. | templates.md L482; templates.md L506 | Product Owner |  | Open |
| OQ-09.3 | US-09 | Do old links (the previous slug) still work after a title change? | Shared links may break. | endpoints.md L183 | Product Owner |  | Open |
| OQ-10.1 | US-10 | Is the author asked to confirm before deleting? | Irreversible action with no confirmation rule. | templates.md L509 | Product Owner |  | Open |
| OQ-10.2 | US-10 | What happens to the article's comments and favourites when it is deleted? | Cascade behaviour is unstated. | endpoints.md L187-191 | Product Owner |  | Open |
| OQ-10.3 | US-10 | Where does the author land after deleting? | Unstated. | routing.md L15 | Product Owner |  | Open |
| OQ-11.1 | US-11 | When a signed-in member reads an article, should favorited and author.following reflect them? The endpoint says no authentication is required. | The response carries per-viewer fields but the endpoint ignores who is viewing. | endpoints.md L140; api-response-format.md L48-54 | Product Owner |  | Open |
| OQ-11.2 | US-11 | Which HTML is allowed in rendered Markdown (scripts, links, images)? | Rendering user content without a sanitisation rule is a security gap. | routing.md L16 | Product Owner |  | Open |
| OQ-12.1 | US-12 | What does the home page show when there are no articles yet? | Empty state unstated. | routing.md L7 | Product Owner |  | Open |
| OQ-13.1 | US-13 | Which tab is selected by default for a signed-in member: Global Feed or Your Feed? | The spec calls Global Feed the default without distinguishing signed-in users. | templates.md L120-122 | Product Owner |  | Open |
| OQ-13.2 | US-13 | What does Your Feed show when I follow nobody? | Empty state unstated. | endpoints.md L134 | Product Owner |  | Open |
| OQ-13.3 | US-13 | Are my own articles in my feed? | Unstated. | endpoints.md L134 | Product Owner |  | Open |
| OQ-14.1 | US-14 | What makes a tag "popular", how are tags ordered, and how many are shown? | The UI says "popular"; the API just returns "a list of tags". | templates.md L203; endpoints.md L243 | Product Owner |  | Open |
| OQ-14.2 | US-14 | Is tag matching case-sensitive? | Unstated. | endpoints.md L108 | Product Owner |  | Open |
| OQ-15.1 | US-15 | How many articles per page does the UI show? | Only the API default (20) is stated. | templates.md L191-196 | Product Owner |  | Open |
| OQ-15.2 | US-15 | What is the maximum limit, and what happens with invalid values (limit=0, negative, non-numeric)? | Only minimums are declared; error behaviour is unstated. | openapi.yml L895-911 | Product Owner |  | Open |
| OQ-16.1 | US-16 | What do visitors see where the comment form would be (a sign-in prompt, nothing)? | The template only shows the signed-in form. | templates.md L562-566 | Product Owner |  | Open |
| OQ-16.2 | US-16 | Is there a maximum comment length? | Unstated. | endpoints.md L209 | Product Owner |  | Open |
| OQ-17.1 | US-17 | In which order are comments shown (oldest or newest first)? | Articles are ordered newest first; comments have no stated order. | endpoints.md L215 | Product Owner |  | Open |
| OQ-17.2 | US-17 | Are comments paginated? | Unstated. | endpoints.md L211-215 | Product Owner |  | Open |
| OQ-18.1 | US-18 | May an article's author delete other people's comments on their own article? | Moderation rights are unstated; the delete rule only names the comment's author. | routing.md L18 | Product Owner |  | Open |
| OQ-19.1 | US-19 | The article page shows a follower count next to Follow, but the profile data has no follower count. Is the count required? | The template shows data the API cannot supply. | templates.md L498; api-response-format.md L25-33 | Product Owner |  | Open |
| OQ-19.2 | US-19 | Can I follow myself? What happens if I follow someone twice? | Edge cases unstated. | endpoints.md L82-88 | Product Owner |  | Open |
| OQ-19.3 | US-19 | What happens when a visitor clicks Follow? | Unstated (sign-in prompt, redirect, hidden button?). | templates.md L305 | Product Owner |  | Open |
| OQ-20.1 | US-20 | Can I favourite my own article? What happens if I favourite twice? | Edge cases unstated. | endpoints.md L223-229 | Product Owner |  | Open |
| OQ-20.2 | US-20 | What happens when a visitor clicks the heart? | Unstated. | templates.md L155 | Product Owner |  | Open |
| OQ-21.1 | US-21 | What happens when a visitor opens /editor, /settings or another signed-in page directly? | No rule for protected routes (redirect to sign-in, error, blank page?). | routing.md L12-13 | Product Owner |  | Open |
| OQ-21.2 | US-21 | What does the user see for an unknown URL? | No not-found page is specified. | routing.md L5-21 | Product Owner |  | Open |
| OQ-22.1 | US-22 | Is the empty-field message "can't be empty" or "can't be blank"? | The two sources use different wording; message assertions will fail one way or the other. | error-handling.md L9-15; openapi.yml L811-820 | Product Owner |  | Open |
| OQ-23.1 | US-23 | Which origins are allowed: any origin, or a configured list? | Unstated; matters for any non-local deployment. | cors.md L7 | Product Owner |  | Open |
| OQ-03.3 | US-03 | Must the user remain signed in across a reload, and under what token-validity conditions? | BR-03.4 inferred persistence from localStorage; routing states storage, not reload/session lifetime. | routing.md L10 | Product Owner |  | Open |
| OQ-09.4 | US-09 | Which users may update an article through the API: only its author, or others with permissions? | X-01: declared 403 and UI controls do not state the API ownership predicate. | openapi.yml L260-288; error-handling.md L23; templates.md L482 | Product Owner |  | Open |
| OQ-10.4 | US-10 | Which users may delete an article through the API, and when exactly is 403 returned? | X-01: author-only button visibility does not specify API permissions. | routing.md L15; openapi.yml L289-315; error-handling.md L23 | Product Owner |  | Open |
| OQ-18.2 | US-18 | Which users may delete a comment through the API, and does being a non-author always cause 403? | X-01: routing specifies UI visibility; OpenAPI declares 403 without the ownership predicate. | routing.md L18; openapi.yml L366-398; error-handling.md L23 | Product Owner |  | Open |
| OQ-19.4 | US-19 | Precisely whose follow relationship does profile.following represent, including unauthenticated responses? | P-003 is an inferred meaning of a field; the schema only states a boolean. | api-response-format.md L25-33; openapi.yml L521-540 | Product Owner |  | Open |
| OQ-15.3 | US-15 | Is articlesCount the filtered total before pagination, the returned page size, or something else? | BR-15.4 inferred total matching semantics from an example and integer schema. | api-response-format.md L102; openapi.yml L697-745 | Product Owner |  | Open |
| OQ-20.3 | US-20 | Whose favourite state does favorited represent, and how exactly must favoritesCount change after favorite or unfavorite? | F-011 and BR-20.2 infer field semantics and count transitions; the source gives fields and operation names only. | api-response-format.md L48-49; endpoints.md L223-237 | Product Owner |  | Open |
| OQ-03.4 | US-03 | What happens to malformed, invalid or expired tokens on optional-auth profile, list and comment endpoints that also declare 401? | X-11: neither optional authentication nor a 401 declaration defines invalid-token handling. | openapi.yml L93-117; openapi.yml L183-213; openapi.yml L315-337 | Product Owner |  | Open |
| OQ-01.5 | US-01 | Are leading/trailing whitespace and case normalised for usernames, email addresses and other submitted text? | X-06: validation and normalisation boundaries are not specified. | openapi.yml L456-480 | Product Owner |  | Open |
| OQ-07.4 | US-07 | Are author and favorited filters case-sensitive, and what happens for an unknown tag? | X-09: existing OQ-07.2/07.3 and OQ-14.2 do not cover every filter-silence dimension. | endpoints.md L102-126 | Product Owner |  | Open |
| OQ-15.4 | US-15 | What happens beyond the last offset, and which timestamp and tie-break define most-recent article order? | X-10: default/minimum paging values do not settle beyond-total or tied ordering. | endpoints.md L118-134 | Product Owner |  | Open |
| OQ-20.4 | US-20 | What happens when an article that is not favourited is unfavourited again? | X-12: repeat favourite is already OQ-20.1; reverse-operation idempotency is not stated. | endpoints.md L231-237 | Product Owner |  | Open |
| OQ-19.5 | US-19 | What happens when an unfollow is repeated or the target was never followed? | X-12: repeat-follow question does not define reverse-operation idempotency. | endpoints.md L90-96 | Product Owner |  | Open |
| OQ-05.6 | US-05 | What is the response for an empty user update, and what happens to existing sessions after a password change? | X-13/X-21: at least one field is required, but the exact empty-update classification and password/session effect are unstated. | openapi.yml L76-94; openapi.yml L846-857; endpoints.md L74 | Product Owner |  | Open |
| OQ-21.3 | US-21 | What should users see during loading, after sign-in, and for non-422 errors or token expiry; how are dates displayed? | X-17: existing redirect/route questions do not cover loading, sign-in success destination, general error display or date presentation. | routing.md L5-21; templates.md L145-155; templates.md L231-247 | Product Owner |  | Open |
| OQ-22.2 | US-22 | Must date-time values use a particular precision or timezone representation beyond the declared date-time format? | X-22: millisecond-Z examples do not mandate exact serialisation. | openapi.yml L567-572; api-response-format.md L46-47 | Product Owner |  | Open |
