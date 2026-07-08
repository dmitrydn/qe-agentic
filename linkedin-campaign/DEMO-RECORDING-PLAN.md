# Demo Recording Plan — the Post 1 anchor asset

**What we're recording:** `demo/run-demo.js` — the Stage 7 live walkthrough. One requirement, generated into a test, run 3× clean (pass), broken with a one-line defect (fail), triaged blind (real_defect), reverted (pass). It's a self-narrating terminal program with labelled STEP banners, so the terminal *is* the storyboard.

**Two deliverables from one recording:**

1. **A looping GIF (~45–60s, 2× speed)** — the primary asset, dropped as the first comment on Post 1. Terminal casts make small, crisp, auto-looping GIFs that read perfectly in the LinkedIn feed.
2. **An MP4 (full speed, ~2–3 min)** — for your profile's Featured section, where a viewer who clicked through wants the unhurried version.

**Who runs it:** this must run on a machine with your Docker/Colima runtime and `OPENROUTER_API_KEY` — i.e. Claude Code on your laptop, or you. It cannot run in this sandbox (no container runtime, no key). The `demo/record-demo.sh` script does the whole capture-and-render in one command.

---

## Pre-flight (do once)

```bash
# tooling
brew install asciinema agg ffmpeg      # agg renders the .cast -> .gif

# runtime
colima start                           # or launch Docker Desktop
node --version                         # need >= 18.18

# key
cd agentic-qe-sandbox
cat .env                               # confirm OPENROUTER_API_KEY=sk-or-... is present
```

**Rehearsal run (no recording) — always do this first.** A live LLM call can occasionally generate a test that doesn't pass on the clean app; that's a real finding, not a demo bug, but you don't want it in the take. Run it once dry:

```bash
set -a; source .env; set +a
node demo/run-demo.js
```

If STEP 3 shows `runs=[pass, pass, pass] -> PASS` and STEP 6 classifies `real_defect`, you have a clean take. If not, just run again — it's non-deterministic, and a clean run is the honest, representative one.

---

## Record + render (one command)

```bash
./demo/record-demo.sh
# or pin the requirement/defect explicitly:
./demo/record-demo.sh CYPRESS-RWA-TRANSACTIONS-007 payment-amount-cents
```

Outputs land in `demo/recordings/`: a `.cast` (re-renderable), a `.gif` (feed), and an `.mp4` (Featured). The script records at 80×40, trims idle LLM-wait time to 2.5s, and renders the GIF at 2× speed so the whole loop reads in under a minute.

---

## The shot-list — what's on screen, mapped to the real STEP banners

The demo prints these exact banners in order. This is the storyboard; the middle column is the beat, the right column is the optional caption/overlay you can add in post (or say aloud in the MP4 narration). Captions echo Post 1's copy so the asset and the post reinforce each other.

| On screen (actual STEP banner) | The beat | Caption / narration |
|---|---|---|
| `STEP 0 — boot` | Names the requirement + the defect to be demonstrated; boots the live container | "Real banking app. Real LLM. Nothing mocked." |
| `STEP 1 — the requirement, as authored` | Prints the plain-English user story + acceptance criteria (no AI, no test code) | "The agent gets *this* — prose. No test code, no source." |
| `STEP 2 — GENERATE (agent)` | The LLM emits an executable TestCase as JSON — including a balance re-check nobody asked for | "It inferred the balance check from the domain. Nobody wrote that assertion." |
| `STEP 3 — RUN 3× against the clean app` | `runs=[pass, pass, pass] -> PASS` | "Run 3× with reset. Flake-guard, not luck." |
| `STEP 4 — seed the real defect` | Shows the one-line source diff (`amount * 100` → `amount`) | "Now I break the backend on purpose. One line." |
| `STEP 5 — RUN again, same test` | `runs=[fail, fail, fail] -> FAIL` | "Same test. No regeneration. Fails every time." |
| `STEP 6 — TRIAGE (agent), never told a defect was seeded` | Second agent's verdict JSON: `real_defect`, high confidence, 5-step repro | "A second agent judges it blind. Verdict: real defect." |
| `STEP 7 — revert, confirm the app was the variable` | `runs=[pass, pass, pass] -> PASS` | "Revert the line. Green again. The app was the variable — not the test." |
| `STEP done — summary` | One-line recap of the whole loop | "Generate → run 3× → triage → revert. That's the loop, at scale." |

**Framing tips.** Keep the terminal at a comfortable, large font (the script sets font-size 20 for the GIF). Dark theme (monokai) reads best in-feed. For the GIF, the money moments are STEP 4 (the diff) and STEP 6 (the `real_defect` verdict) — if you trim anything, protect those two frames.

---

## LinkedIn output specs

- **GIF (feed / first comment):** aim for < 15 MB and < 60s. The script's 2× speed + idle-trim gets you there; if it's still long, re-render the `.cast` with `agg --speed 3`.
- **MP4 (Featured / if you post native video):** LinkedIn prefers MP4, ≥ 720p, up to ~10 min. The `.mp4` the script produces is already `faststart`/`yuv420p` for clean playback. If you want a "clean app → break → catch → revert" title card, add it in any editor over the MP4.
- **Native video vs GIF-as-comment:** if you'd rather post the demo as native video *inside* Post 1 (higher autoplay reach) instead of a linked GIF, use the MP4 and skip the "link in comments" line for the demo — but keep the repo/MAKE-THE-CASE links in the first comment.

---

## Verification — before you publish

1. **Fidelity to the evidence doc.** Watch the recording start to finish and confirm the STEP sequence matches the "Watch it work" 7 steps in `MAKE-THE-CASE.md` (same requirement ID, same `amount * 100` diff, same pass→fail→pass arc). If the recording drifts from the doc, one of them is wrong — reconcile before posting.
2. **Representative run.** Confirm STEP 3 is `PASS` and STEP 6 is `real_defect`. Don't publish a take where the clean app failed at STEP 3 (unrepresentative) or triage misclassified — rerun instead. This isn't cherry-picking; it's showing the modal behavior the metrics describe.
3. **No secrets on screen.** Scrub the recording for anything from `.env`, tokens in URLs, or internal hostnames before it goes public. (The demo doesn't print the key, but check the boot lines.)
4. **Length + size.** GIF < 60s and < 15 MB; MP4 plays cleanly with audio if you narrated.

---

*The recording is the only campaign asset that must be produced on your own machine — everything it shows is already backed line-for-line by `MAKE-THE-CASE.md`.*
