# connectors

One folder per kind of connector. Adding a new stack, source or provider must not require a change in `core/` or `capabilities/`.

- `ai-providers/` — development provider first; client-approved providers in Phase 2
- `requirement-sources/` — files (Markdown, Gherkin) in Phase 1; Azure DevOps, Jira, BATC later
- `stacks/` — Java (JUnit/RestAssured/Selenium), TypeScript (Playwright)
- `test-results/` — JUnit XML, Playwright JSON
