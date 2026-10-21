# POST 5 — Correction (draft, not published)

**Purpose:** publicly withdraw the claims from Posts 1, 2 and 4 that didn't survive the October 2026 review. Same voice and format as the series. Post it yourself; then add the short correction comments below to the original posts.

**Image:** slide 12 of `slides/Agentic-QE-Architecture-v3.pptx` ("What changed since v2"), exported as PNG.

```
I told you my system's true false-alarm rate was 2–3%.

I can't stand behind that number anymore. Or three others I posted.

Here's what I got wrong, and what I'm doing about it. ↓

—

This summer I posted a series on an AI system that writes, runs and
judges its own API tests. I said "try to prove me wrong." A hard review
of my own repo did.

What I'm withdrawing:

→ "True false-alarm rate ≈ 2–3%." I got there by reading the AI judge's
  own explanations, not by independently confirming each bug. And at
  least 3 of the 11 "real bugs" look like my test runner's fault, not
  the app's: it sent a literal ":username" in the URL. Honest answer:
  unknown, until a second person verifies them.

→ "100% triage accuracy (12/12)." I tuned the judge's prompt on the same
  12 cases I then scored it on, and most cases carried the answer in
  their own names. That's a training score, not a measurement.

→ "Nobody told it to check the balances." A hint I wrote for that exact
  requirement described the balance check. The demo ran for real; my
  framing of it was wrong.

→ "90% defect catch." It is 9 of 10, but on defects I wrote after seeing
  the tests, from a single run. The 95% range is 60–98%. And the two
  "negative controls" could never have been caught by those tests in
  the first place.

What still stands: the loop works end to end, the knowledge-graph idea
showed no detectable gain, and my acceptance gate is still red. Outside
research backs the core bet too: vague requirements cost LLM-written
tests 26–40 points of fault detection.

What I'm changing: an evaluation set I never tuned against, a second
human labelling failures, error bars on every number, five runs instead
of one, and human review before anything counts as "done".

In post 2 I wrote: "Your headline number is a guess until you read
what's underneath it." I didn't read deep enough under my own.

What's a number you've had to take back?

#QualityEngineering #SoftwareEngineering #AIAgents #LLM #TestAutomation
```

*Hook length check: first 3 lines ≈ 150 chars, under the ~210 fold.*

## First comment (post immediately)

```
The receipts for this correction:

→ What changed since v2, claim by claim: slide 12 of the updated architecture deck (v3) in the repo
→ The review itself, with every recomputed number and its 95% interval: docs/review/C-evidence.md
→ Where the original claims came from: agentic-qe-sandbox/VERIFICATION.md

I'll post re-measured numbers after the re-baseline. Hold me to it.
```

> Before posting: push `docs/review/` and the v3 deck to the public repo so these links resolve. Replace the paths with full GitHub URLs.

## Correction comments on the original posts

Add one to each, so anyone landing on the old post sees it.

**Post 1 (the loop + demo):**
```
Correction (Oct 2026): two claims here don't hold. The balance check was described in a hint I wrote, so "nobody told it" was wrong. And 12/12 triage was scored on cases I'd tuned on. Details: [link to Post 5]
```

**Post 2 (the 18.2% reframe):**
```
Correction (Oct 2026): I'm withdrawing the "true rate ≈ 2–3%." It was self-adjudicated from the AI judge's explanations, and at least 3 of the "real bugs" look like a bug in my own test runner. Details: [link to Post 5]
```

**Post 4 (executive summary):**
```
Correction (Oct 2026): the "18% → 2–3%, off by 6x" example in takeaway 2 doesn't hold up. The irony isn't lost on me; it's takeaway 2 applied to myself. Details: [link to Post 5]
```

Post 3 (knowledge-graph A/B) needs no correction. "Didn't move" is a fair reading of a result with no detectable difference.

## Also out of date in public

- `agentic-qe-sandbox/MAKE-THE-CASE.md` (repo): "Nobody told it to check balances", 100% triage, the 2–3% reframe.
- Evidence dashboard (`dmitrydn.github.io/qe-agentic/evidence-dashboard/`): same headline numbers.
- `slides/Make-the-Case-Stage7.pptx` / `.pdf`: carries the same claims as v2.
