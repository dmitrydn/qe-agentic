# Stage 6 Workflow Report

Generated: 2026-06-30T14:54:36.582Z
Model: anthropic/claude-sonnet-4.5
N (runs per test): 3

## Coverage
Requirements: 4/4 covered
Tests: 8 generated, 8 passed, 0 failed (real defects), 0 quarantined (flaky)
False-positive rate: 0.0%

## Cost
Total: $0.0500 over 4 LLM call(s) (5,834 input + 2,164 output tokens)
Rates: $3/M input, $15/M output → input $0.0175, output $0.0325

| Phase | Calls | Input tok | Output tok | Cost |
|---|---|---|---|---|
| generate | 4 | 5,834 | 2,164 | $0.0500 |

## Traceability
No orphan tests — every generated test references a valid requirement id.

## Test outcomes

| Test id | Requirement id | Status |
|---|---|---|
| CYPRESS-RWA-BANK-ACCOUNTS-001-TC-001 | CYPRESS-RWA-BANK-ACCOUNTS-001 | pass |
| CYPRESS-RWA-BANK-ACCOUNTS-001-TC-002 | CYPRESS-RWA-BANK-ACCOUNTS-001 | pass |
| CYPRESS-RWA-TRANSACTIONS-001-TC1 | CYPRESS-RWA-TRANSACTIONS-001 | pass |
| CYPRESS-RWA-TRANSACTIONS-001-TC2 | CYPRESS-RWA-TRANSACTIONS-001 | pass |
| CYPRESS-RWA-TRANSACTIONS-007-positive-001 | CYPRESS-RWA-TRANSACTIONS-007 | pass |
| CYPRESS-RWA-TRANSACTIONS-007-auth-001 | CYPRESS-RWA-TRANSACTIONS-007 | pass |
| CYPRESS-RWA-USERS-001-TC-001 | CYPRESS-RWA-USERS-001 | pass |
| CYPRESS-RWA-USERS-001-TC-002 | CYPRESS-RWA-USERS-001 | pass |
