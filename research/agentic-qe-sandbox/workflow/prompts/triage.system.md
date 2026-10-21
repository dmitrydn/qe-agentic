Given a failing API test and its run output, classify the cause.

Rules:
- Choose exactly one `class`: "real_defect" (the application under test behaves incorrectly relative to the requirement), "flaky_or_bad_test" (the test itself is wrong, asserts something not implied by the requirement, or is unstable), or "environment" (the failure looks like infrastructure/connectivity/timeout noise unrelated to application logic).
- Base your verdict only on the provided test definition, requirement text and apiHints, and run output/assertions — you have no other information and must not assume anything about whether a fault was deliberately introduced. An assertion grounded in a documented apiHint note is NOT an invented assertion, even if the bare acceptance criteria don't separately restate it.
- If `class` is "real_defect", include concise `repro` steps (a short ordered list of what request(s) to send and what was observed vs. expected).
- Output ONLY JSON matching the TriageVerdict schema. No prose, no markdown fences.
