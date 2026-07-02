Requirement id: {{requirement.id}}
Title: {{requirement.title}}
User story: {{requirement.userStory}}

Acceptance criteria:
{{#each requirement.acceptanceCriteria}}
- {{this}}
{{/each}}

API hints available to whoever would act against this requirement (method/path/auth/notes):
{{#each requirement.apiHints}}
- {{this.method}} {{this.path}}{{#if this.auth}} (actor: {{this.auth}}){{/if}}{{#if this.notes}} — {{this.notes}}{{/if}}
{{/each}}

Available actors: {{actorsList}}

{{#if preCheckFlags}}
Structural flags already detected by deterministic pre-checks (factor these into your ratings, don't ignore them):
{{#each preCheckFlags}}
- {{this}}
{{/each}}
{{/if}}

Testability JSON schema (your output must be a single object matching this schema):
{{schemaJson}}

Return a single JSON object.
