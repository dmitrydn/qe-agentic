# Failing tests by frontend and spec file

Generated from the Playwright JSON reports in logs/. Suite: realworld SHA 450bbc5, 139 tests. Format: status | test title | first line of error.

## angular-apimode-true
```
step2-angular-apimode-true.json {'expected': 133, 'unexpected': 6, 'flaky': 0, 'skipped': 0} duration_s=445
| spec | pass | fail | flaky | skip |
| articles.spec.ts | 10 | 0 | 0 | 0 |
| auth.spec.ts | 8 | 0 | 0 | 0 |
| comments.spec.ts | 8 | 1 | 0 | 0 |
| error-handling.spec.ts | 30 | 1 | 0 | 0 |
| health.spec.ts | 4 | 0 | 0 | 0 |
| navigation.spec.ts | 9 | 0 | 0 | 0 |
| null-fields.spec.ts | 11 | 0 | 0 | 0 |
| settings.spec.ts | 7 | 0 | 0 | 0 |
| social.spec.ts | 3 | 3 | 0 | 0 |
| url-navigation.spec.ts | 14 | 0 | 0 | 0 |
| user-fetch-errors.spec.ts | 13 | 1 | 0 | 0 |
| xss-security.spec.ts | 16 | 0 | 0 | 0 |
## comments.spec.ts
  - unexpected | should require login to post comment | Error: expect(locator).toBeVisible() failed
## error-handling.spec.ts
  - unexpected | should show error message on create article form when network fails | Error: expect(locator).toContainText(expected) failed
## social.spec.ts
  - unexpected | should follow and unfollow a user | TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  - unexpected | should view other user profile | TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  - unexpected | should display followed users articles in feed | TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
## user-fetch-errors.spec.ts
  - unexpected | should allow browsing app in unavailable mode and persist token across reloads | Error: expect(received).toBe(expected) // Object.is equality
```

## angular-apimode-false
```
step2-angular-apimode-false.json {'expected': 73, 'unexpected': 1, 'flaky': 0, 'skipped': 65} duration_s=183
| spec | pass | fail | flaky | skip |
| articles.spec.ts | 9 | 0 | 0 | 1 |
| auth.spec.ts | 7 | 0 | 0 | 1 |
| comments.spec.ts | 7 | 1 | 0 | 1 |
| error-handling.spec.ts | 0 | 0 | 0 | 31 |
| health.spec.ts | 3 | 0 | 0 | 1 |
| navigation.spec.ts | 9 | 0 | 0 | 0 |
| null-fields.spec.ts | 11 | 0 | 0 | 0 |
| settings.spec.ts | 7 | 0 | 0 | 0 |
| social.spec.ts | 6 | 0 | 0 | 0 |
| url-navigation.spec.ts | 14 | 0 | 0 | 0 |
| user-fetch-errors.spec.ts | 0 | 0 | 0 | 14 |
| xss-security.spec.ts | 0 | 0 | 0 | 16 |
## comments.spec.ts
  - unexpected | should require login to post comment | Error: expect(locator).toBeVisible() failed
```

## vue-apimode-true
```
step2-vue-apimode-true.json {'expected': 118, 'unexpected': 21, 'flaky': 0, 'skipped': 0} duration_s=907
| spec | pass | fail | flaky | skip |
| articles.spec.ts | 10 | 0 | 0 | 0 |
| auth.spec.ts | 8 | 0 | 0 | 0 |
| comments.spec.ts | 9 | 0 | 0 | 0 |
| error-handling.spec.ts | 18 | 13 | 0 | 0 |
| health.spec.ts | 4 | 0 | 0 | 0 |
| navigation.spec.ts | 9 | 0 | 0 | 0 |
| null-fields.spec.ts | 11 | 0 | 0 | 0 |
| settings.spec.ts | 7 | 0 | 0 | 0 |
| social.spec.ts | 3 | 3 | 0 | 0 |
| url-navigation.spec.ts | 14 | 0 | 0 | 0 |
| user-fetch-errors.spec.ts | 9 | 5 | 0 | 0 |
| xss-security.spec.ts | 16 | 0 | 0 | 0 |
## error-handling.spec.ts
  - unexpected | should handle 400 on registration with validation errors | Test timeout of 15000ms exceeded.
  - unexpected | should handle 400 on article creation | TimeoutError: page.fill: Timeout 5000ms exceeded.
  - unexpected | should handle 403 when updating article | Error: expect(locator).toHaveValue(expected) failed
  - unexpected | should handle 403 when deleting another users comment | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle 403 when following user you are blocked by | Error: expect(locator).toBeVisible() failed
  - unexpected | should show error message on settings form when network fails | Error: expect(locator).toBeVisible() failed
  - unexpected | should show error message on login form when network fails | Error: expect(locator).toContainText(expected) failed
  - unexpected | should show error message on register form when network fails | Error: expect(locator).toContainText(expected) failed
  - unexpected | should show error message on create article form when network fails | TimeoutError: page.fill: Timeout 5000ms exceeded.
  - unexpected | should show error message on update article form when network fails | Error: expect(locator).toHaveValue(expected) failed
  - unexpected | should show error message when adding comment fails due to network | TimeoutError: page.fill: Timeout 5000ms exceeded.
  - unexpected | should handle network error when favoriting article | Test timeout of 15000ms exceeded.
  - unexpected | should handle network error when following user | TimeoutError: page.click: Timeout 5000ms exceeded.
## social.spec.ts
  - unexpected | should follow and unfollow a user | TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  - unexpected | should view other user profile | TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  - unexpected | should display followed users articles in feed | TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
## user-fetch-errors.spec.ts
  - unexpected | should handle 500 Internal Server Error on /api/user | Error: expect(locator).toBeVisible() failed
  - unexpected | should allow browsing app in unavailable mode and persist token across reloads | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle network timeout on /api/user | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle network failure on /api/user | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle malformed JSON on /api/user | Error: expect(locator).toBeVisible() failed
```

## vue-apimode-false
```
step2-vue-apimode-false.json {'expected': 74, 'unexpected': 0, 'flaky': 0, 'skipped': 65} duration_s=147
| spec | pass | fail | flaky | skip |
| articles.spec.ts | 9 | 0 | 0 | 1 |
| auth.spec.ts | 7 | 0 | 0 | 1 |
| comments.spec.ts | 8 | 0 | 0 | 1 |
| error-handling.spec.ts | 0 | 0 | 0 | 31 |
| health.spec.ts | 3 | 0 | 0 | 1 |
| navigation.spec.ts | 9 | 0 | 0 | 0 |
| null-fields.spec.ts | 11 | 0 | 0 | 0 |
| settings.spec.ts | 7 | 0 | 0 | 0 |
| social.spec.ts | 6 | 0 | 0 | 0 |
| url-navigation.spec.ts | 14 | 0 | 0 | 0 |
| user-fetch-errors.spec.ts | 0 | 0 | 0 | 14 |
| xss-security.spec.ts | 0 | 0 | 0 | 16 |
```

## react-apimode-true
```
step2-react-apimode-true.json {'expected': 41, 'unexpected': 98, 'flaky': 0, 'skipped': 0} duration_s=1446
| spec | pass | fail | flaky | skip |
| articles.spec.ts | 0 | 10 | 0 | 0 |
| auth.spec.ts | 1 | 7 | 0 | 0 |
| comments.spec.ts | 0 | 9 | 0 | 0 |
| error-handling.spec.ts | 12 | 19 | 0 | 0 |
| health.spec.ts | 4 | 0 | 0 | 0 |
| navigation.spec.ts | 0 | 9 | 0 | 0 |
| null-fields.spec.ts | 0 | 11 | 0 | 0 |
| settings.spec.ts | 0 | 7 | 0 | 0 |
| social.spec.ts | 0 | 6 | 0 | 0 |
| url-navigation.spec.ts | 0 | 14 | 0 | 0 |
| user-fetch-errors.spec.ts | 8 | 6 | 0 | 0 |
| xss-security.spec.ts | 16 | 0 | 0 | 0 |
## articles.spec.ts
  - unexpected | should create a new article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should edit an existing article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should delete an article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should delete an article when server returns 200 instead of 204 | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should favorite an article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should unfavorite an article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should view article from home feed | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should display article preview correctly | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should remove all tags when editing an article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should only allow author to edit/delete article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
## auth.spec.ts
  - unexpected | should register a new user | Test timeout of 15000ms exceeded.
  - unexpected | should login with existing user | Test timeout of 15000ms exceeded.
  - unexpected | should show error for invalid login | Error: expect(locator).toBeVisible() failed
  - unexpected | should fail login with wrong password | Test timeout of 15000ms exceeded.
  - unexpected | should logout successfully | Test timeout of 15000ms exceeded.
  - unexpected | should maintain session after page reload | Test timeout of 15000ms exceeded.
  - unexpected | should handle invalid token on page reload gracefully | Error: expect(received).toBe(expected) // Object.is equality
## comments.spec.ts
  - unexpected | should add a comment to an article | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should delete own comment | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should delete comment when server returns 200 instead of 204 | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should display multiple comments | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should require login to post comment | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should only allow comment author to delete | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should handle long comments | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should preserve comments after page reload | Test timeout of 15000ms exceeded while running "beforeEach" hook.
  - unexpected | should clear comment form after posting | Test timeout of 15000ms exceeded while running "beforeEach" hook.
## error-handling.spec.ts
  - unexpected | should handle 400 on login with validation errors | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle 400 on registration with validation errors | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle 400 on article creation | TimeoutError: page.fill: Timeout 5000ms exceeded.
  - unexpected | should handle 401 when submitting settings form | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle 401 when posting a comment | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle 403 when updating article | Error: expect(locator).toHaveValue(expected) failed
  - unexpected | should handle 403 when deleting another users comment | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle 403 when following user you are blocked by | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle 500 on user profile load | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle network error on user profile load | Error: expect(locator).toBeVisible() failed
  - unexpected | should show error message on settings form when network fails | Error: expect(locator).toBeVisible() failed
  - unexpected | should show error message on login form when network fails | Error: expect(locator).toBeVisible() failed
  - unexpected | should show error message on register form when network fails | Error: expect(locator).toBeVisible() failed
  - unexpected | should show error message on create article form when network fails | TimeoutError: page.fill: Timeout 5000ms exceeded.
  - unexpected | should show error message on update article form when network fails | Error: expect(locator).toHaveValue(expected) failed
  - unexpected | should show error message when adding comment fails due to network | TimeoutError: page.fill: Timeout 5000ms exceeded.
  - unexpected | should handle network error when favoriting article | TimeoutError: locator.click: Timeout 5000ms exceeded.
  - unexpected | should handle network error when following user | TimeoutError: page.click: Timeout 5000ms exceeded.
  - unexpected | should handle 404 for non-existent profile | Error: expect(locator).toBeVisible() failed
## navigation.spec.ts
  - unexpected | should navigate through main pages when logged out | Error: expect(page).toHaveURL(expected) failed
  - unexpected | should navigate through main pages when logged in | Test timeout of 15000ms exceeded.
  - unexpected | should filter articles by tag | Test timeout of 15000ms exceeded.
  - unexpected | should switch between Global Feed and Your Feed | Test timeout of 15000ms exceeded.
  - unexpected | should display popular tags | Test timeout of 15000ms exceeded.
  - unexpected | should paginate articles | Test timeout of 15000ms exceeded.
  - unexpected | should navigate to article from author name | Test timeout of 15000ms exceeded.
  - unexpected | should show article count on profile tabs | Test timeout of 15000ms exceeded.
  - unexpected | should handle empty states gracefully | Test timeout of 15000ms exceeded.
## null-fields.spec.ts
  - unexpected | newly registered user should show default avatar on profile page | Test timeout of 15000ms exceeded.
  - unexpected | newly registered user should show default avatar in navbar | Test timeout of 15000ms exceeded.
  - unexpected | newly registered user should show default avatar on article meta | Test timeout of 15000ms exceeded.
  - unexpected | newly registered user should show default avatar in comment section | Test timeout of 15000ms exceeded.
  - unexpected | setting image should display custom avatar on profile page | Test timeout of 15000ms exceeded.
  - unexpected | clearing image to empty string should restore default avatar | Test timeout of 15000ms exceeded.
  - unexpected | null bio should not render as literal "null" on profile page | Test timeout of 15000ms exceeded.
  - unexpected | setting then clearing bio should not show stale data | Test timeout of 15000ms exceeded.
  - unexpected | settings form should show empty string for null image | Test timeout of 15000ms exceeded.
  - unexpected | settings form should show empty string for null bio | Test timeout of 15000ms exceeded.
  - unexpected | author avatars should render on other user articles in feed | Error: expect(locator).toHaveAttribute(expected) failed
## settings.spec.ts
  - unexpected | should update bio only | Test timeout of 15000ms exceeded.
  - unexpected | should update image only | Test timeout of 15000ms exceeded.
  - unexpected | should update bio and image together | Test timeout of 15000ms exceeded.
  - unexpected | should display updated bio on profile page | Test timeout of 15000ms exceeded.
  - unexpected | should display updated image on profile page | Test timeout of 15000ms exceeded.
  - unexpected | should preserve username in navbar after update | Test timeout of 15000ms exceeded.
  - unexpected | should allow navigation to settings again after update | Test timeout of 15000ms exceeded.
## social.spec.ts
  - unexpected | should follow and unfollow a user | Test timeout of 15000ms exceeded.
  - unexpected | should view own profile | Test timeout of 15000ms exceeded.
  - unexpected | should view other user profile | Test timeout of 15000ms exceeded.
  - unexpected | should display user articles on profile | Test timeout of 15000ms exceeded.
  - unexpected | should display favorited articles on profile | Test timeout of 15000ms exceeded.
  - unexpected | should display followed users articles in feed | Test timeout of 15000ms exceeded.
## url-navigation.spec.ts
  - unexpected | / should show Global Feed for everyone | Error: expect(page).toHaveURL(expected) failed
  - unexpected | /?feed=following should show Your Feed (authenticated) | Test timeout of 15000ms exceeded.
  - unexpected | /?feed=following should redirect to /login when not authenticated | Error: expect(page).toHaveURL(expected) failed
  - unexpected | /tag/:tag should filter by tag | Error: expect(locator).toBeVisible() failed
  - unexpected | tabs should have correct href attributes | Test timeout of 15000ms exceeded.
  - unexpected | clicking Your Feed should navigate to /?feed=following | Test timeout of 15000ms exceeded.
  - unexpected | clicking Global Feed should navigate to / | Test timeout of 15000ms exceeded.
  - unexpected | empty Your Feed shows helpful message with link to Global Feed | Test timeout of 15000ms exceeded.
  - unexpected | pagination should update URL with ?page=N | Test timeout of 15000ms exceeded.
  - unexpected | should load correct page when navigating directly to ?page=N | Test timeout of 15000ms exceeded.
  - unexpected | pagination URL preserves feed=following parameter | Test timeout of 15000ms exceeded.
  - unexpected | pagination should work with /tag/:tag | Test timeout of 15000ms exceeded.
  - unexpected | page should reset when switching feeds | Test timeout of 15000ms exceeded.
  - unexpected | tag pagination shows correct articles per page | Test timeout of 15000ms exceeded.
## user-fetch-errors.spec.ts
  - unexpected | should handle 401 Unauthorized on /api/user | Error: expect(received).toBe(expected) // Object.is equality
  - unexpected | should handle 500 Internal Server Error on /api/user | Error: expect(locator).toBeVisible() failed
  - unexpected | should allow browsing app in unavailable mode and persist token across reloads | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle network timeout on /api/user | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle network failure on /api/user | Error: expect(locator).toBeVisible() failed
  - unexpected | should handle malformed JSON on /api/user | Error: expect(locator).toBeVisible() failed
```
