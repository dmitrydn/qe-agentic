# Publish Package — ready-to-ship LinkedIn campaign

Everything needed to publish the 3-post campaign: the exact first-comment link blocks, an asset-to-post map, and a step-by-step publishing runbook. Post bodies live in `LinkedIn-Content-Plan.md`; this file is the operational layer around them.

Fill these placeholders once, everywhere:

- `[REPO]` → your personal GitHub repo root (e.g. `github.com/you/agentic-qe`)
- `[CASE]` → `MAKE-THE-CASE.md` on GitHub (`[REPO]/blob/main/agentic-qe-sandbox/MAKE-THE-CASE.md`)
- `[GIF]` → the demo GIF from `record-demo.sh`
- `[DASH]` → the interactive evidence dashboard (if you host it — see "Assets")

---

## Pre-launch checklist (do once, before Post 1)

Your profile is the conversion surface — every strong post drives a profile visit. Get it ready first.

1. **Featured section populated**, in this order: (1) the evidence dashboard `[DASH]` or `[CASE]`, (2) the repo `[REPO]`, (3) the demo GIF/MP4.
2. **"Open to work — recruiters only" is ON.** Settings → this is invisible to your network and to Accenture, visible only to recruiters searching. This is the entire recruiter ask; no post ever states it.
3. **Headline reads how-you-think, not what-you-want.** e.g. "I build agentic systems, then try to prove them wrong." Never "seeking / open to opportunities."
4. **About section** seeds the search vocabulary in real sentences: agentic, LLM evaluation, negative controls, test generation, API testing, oracle/intent.
5. **Repo is public and clean** — README, runnable `demo/run-demo.js`, `MAKE-THE-CASE.md`, `VERIFICATION.md` all pushed. Never publish a post before its linked artifacts are live.

---

## Asset-to-post map

| Post | Image to attach | First comment |
|---|---|---|
| **Post 1** — the loop / demo | The **loop diagram** (Generate → Run×3 → Triage → Report) | demo GIF + repo + evidence |
| **Post 2** — the 18.2% reframe | The **"18.2% that wasn't" chart** | failure adjudication + first-principles memo |
| **Post 3** — the standing red gate | The **scorecard** (0% / 90% / 100% + the honest red gate) | gate status + A/B memo |

Native visuals lift reach — every post gets one image. Keep the primary link in the first comment, not the body.

---

## Post 1 — first comment (paste immediately after posting)

```
Write-up, code, and the live demo:

→ 60-sec demo (generate → run 3× → break it → catch → revert): [GIF]
→ How it works + all metrics with caveats: [CASE]
→ Runnable code (this exact walkthrough is demo/run-demo.js): [REPO]

Built solo as an own-initiative R&D project. Real banking app (Cypress
Real World App), real LLM (Claude Sonnet 4.5), nothing mocked. Happy to
go deep on any part in the replies.
```

## Post 2 — first comment

```
The receipts:

→ Every one of the 15 residual failures, and what each actually was: [CASE] (see "After Stage 7")
→ Why more code knowledge didn't help — the first-principles write-up: [REPO]/docs/design/requirements-first-principles.md
→ Raw full-breadth run output (132 tests): [REPO]/reports-all

Adjudication was by hand, on one app — so ~2–3% is a bounded estimate,
not a universal constant. The method is all in the open; poke holes in it.
```

## Post 3 — first comment

```
For the curious:

→ The gate's status, in the project's own words: [CASE] (see "Where the gate currently stands")
→ The knowledge-graph A/B I killed: [REPO]/docs/design/graphify-decision-memo.md
→ Full audited record (every metric, every caveat): [REPO]/agentic-qe-sandbox/VERIFICATION.md

The red gate is still red as of posting. If I ever quietly turn it green,
call me out.
```

---

## The publish procedure (per post)

1. **Draft in the LinkedIn composer**, not a scheduler — native posts with a manual first comment perform best.
2. **Paste the body** from `LinkedIn-Content-Plan.md`. Confirm the first 3 lines are intact (the "see more" hook).
3. **Attach the image** for that post (see map above). One image, no album.
4. **No links in the body.** If you must reference one, write "link in comments." Outbound links in the body suppress reach.
5. **Add hashtags** at the very bottom of the body: `#QualityEngineering #SoftwareEngineering #AIAgents #LLM #TestAutomation` (3–5 is optimal; more looks spammy).
6. **Post**, then **immediately paste the first-comment block** for that post. Do this within ~60 seconds so early readers see the links.
7. **Do not tag Accenture** or frame this as work output. It's your personal R&D — keep it that way in every post and reply. (You may tag the Cypress RWA project if you want to credit the target app; optional.)

---

## First-90-minutes protocol (the reach multiplier)

LinkedIn weights early engagement heavily, and your own replies count.

- **Be present for the first 90 minutes.** Reply to every substantive comment.
- **Have 3–4 replies pre-drafted** for predictable questions (see below).
- **Ask a follow-up question back** in your replies — it extends each comment thread, which the algorithm rewards.
- **Don't edit the post** in the first hour (edits can dampen distribution). Fix typos before posting, not after.

**Pre-drafted replies (adapt per post):**

- *"Isn't this just <tool>?"* → "Fair question. The difference is the loop generates the test from prose and a *second* agent triages the failure blind — it's the separation that keeps false positives down. Details: [CASE]."
- *"2–3% seems too good."* → "Agreed it deserves scrutiny — that's why every one of the 15 failures is adjudicated in the open: [CASE] 'After Stage 7'. It's a bounded estimate on one app, not a universal number."
- *"Why keep the gate red?"* → "Because a green that lies makes every future green meaningless. The bug is real and reported rather than special-cased. Full account: [CASE]."
- *"Can I try it?"* → "Yes — it's public: [REPO]. `node demo/run-demo.js` runs the exact walkthrough from the post."

---

## Schedule

| Week | Day/time (your audience TZ) | Post | Deploy-if-strong follow-up |
|---|---|---|---|
| 1 | Tue, 8–10am | Post 1 (loop + demo) | — |
| 2 | Tue, 8–10am | Post 2 (the 18.2% reframe) | Optional A (knowledge-graph kill) later that week if Post 2 lands |
| 3 | Tue, 8–10am | Post 3 (standing red gate) | Optional B (guardrails) if the technical crowd is engaged |

Tue–Thu mornings are the sweet spot for a technical audience. One post/week keeps your network un-fatigued while each post gathers a full engagement cycle.

---

## What to watch (and when to deploy the follow-ups)

Track per post, in the 48h after publishing:

- **"See more" click-through** — the hook test. Low → tighten the first 3 lines next time.
- **Comments-to-reactions ratio** — quality of engagement. High → the topic has depth; deploy the matching follow-up.
- **Profile views + Featured clicks** — the actual conversion signal. A spike after Post 2 or 3 means the positioning is landing.

Deploy Optional Follow-up A/B only if the core three sustain engagement — don't pre-commit to five.

---

*Fully subtle throughout: no availability lines, framed as personal R&D, employer-safe. The recruiter signal lives entirely in your profile settings and the demonstrated rigor.*
