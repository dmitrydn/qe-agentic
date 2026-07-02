Requirement id: {{requirement.id}}
Title: {{requirement.title}}
Acceptance criteria:
{{#each requirement.acceptanceCriteria}}
- {{this}}
{{/each}}

API hints that were available to whoever authored this test (the documented
contract — method/path/auth/notes — the same data Generate is given; an
assertion grounded in one of these notes is NOT an invented assertion, even
if the bare acceptance criteria above don't separately repeat it):
{{#each requirement.apiHints}}
- {{this.method}} {{this.path}}{{#if this.auth}} (actor: {{this.auth}}){{/if}}{{#if this.notes}} — {{this.notes}}{{/if}}
{{/each}}

Test case under triage:
{{testCaseJson}}

Run results across {{runs.length}} run(s) (each run reset application state first):
{{#if dedupeNote}}{{dedupeNote}}
{{/if}}{{runsJson}}

TriageVerdict JSON schema (your output must be a single object matching this schema):
{{schemaJson}}

Return a single JSON object.
