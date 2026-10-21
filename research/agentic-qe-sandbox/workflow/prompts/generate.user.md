Requirement id: {{requirement.id}}
Title: {{requirement.title}}
User story: {{requirement.userStory}}

Acceptance criteria:
{{#each requirement.acceptanceCriteria}}
- {{this}}
{{/each}}

API hints (only use endpoints/fields listed here; do not invent any):
{{#each requirement.apiHints}}
- {{this.method}} {{this.path}}{{#if this.auth}} (actor: {{this.auth}}){{/if}}{{#if this.notes}} — {{this.notes}}{{/if}}
{{/each}}

Available actors: {{actorsList}}

TestCase JSON schema (your output must be a JSON array of objects matching this schema):
{{schemaJson}}

Return a JSON array of TestCase objects.
