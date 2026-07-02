# Testability battery report

Accuracy: 100% (16/16 cases)

## Confusion matrix

| expected \ predicted | testable | needs_clarification | untestable |
|---|---|---|---|
| testable | 5 | 0 | 0 |
| needs_clarification | 0 | 3 | 0 |
| untestable | 0 | 0 | 8 |

## Cases

| Case id | Expected | Predicted | Match | Score |
|---|---|---|---|---|
| good-users-001 | testable | testable | yes | 1.00 |
| good-bankaccounts-001 | testable | testable | yes | 1.00 |
| ambiguous-link-expiry | needs_clarification | needs_clarification | yes | 0.83 |
| ambiguous-bulk-export-large | needs_clarification | needs_clarification | yes | 0.50 |
| no-oracle-form-submit | untestable | untestable | yes | 0.75 |
| no-interface-loyalty-points | untestable | untestable | yes | 0.75 |
| epic-payments-module | untestable | untestable | yes | 0.25 |
| clear-create-bankaccount | testable | testable | yes | 1.00 |
| clear-list-users | testable | testable | yes | 1.00 |
| borderline-single-transaction | testable | testable | yes | 1.00 |
| ambiguous-fast-export | untestable | untestable | yes | 0.67 |
| missing-actor-update | needs_clarification | needs_clarification | yes | 0.83 |
| contradiction-conflicting-status | untestable | untestable | yes | 0.50 |
| no-oracle-navigate | untestable | untestable | yes | 0.83 |
| no-interface-nightly-report | untestable | untestable | yes | 0.50 |
| epic-security | untestable | untestable | yes | 0.17 |
