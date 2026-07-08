# Comment-Monitoring Playbook — Agentic QE campaign

The repeatable routine for watching comments on the 3 campaign posts. Any session (or Claude in Chrome) follows this exactly, so every check is consistent. **The agent never posts anything — it drafts; Dmitry approves and posts.**

Reads LinkedIn through **Claude in Chrome** (Dmitry's own logged-in browser). No API, no stored credentials, no server. Runs are reminder-triggered; Dmitry runs them with Chrome open.

---

## Inputs (fill once, per post, in CAMPAIGN-LOG.md)

- Post 1 URL: `[paste after publishing]`
- Post 2 URL: `[paste after publishing]`
- Post 3 URL: `[paste after publishing]`
- Voice & facts source: `MAKE-THE-CASE.md` (every number + caveat), `PUBLISH-PACKAGE.md` (the pre-drafted skeptic replies), profile About/headline (tone).

---

## The routine (each run)

1. **Open each live post** in the browser via Claude in Chrome. Click "Load more comments" / "See more replies" until all are expanded (LinkedIn hides older/nested ones).
2. **Extract every comment new since the last check** — from CAMPAIGN-LOG.md's last entry, note the timestamp/last-seen and only process what's after it. For each: author name, headline/title if visible, the text, and a rough timestamp.
3. **Flag** each comment against the four priorities (below). Unflagged = a like/no-action.
4. **Draft a reply** for each flagged comment following the reply rules (below).
5. **Capture metrics** for each post: reactions, comment count, reposts. Add profile-view trend if Dmitry reads it off his own dashboard.
6. **Append to CAMPAIGN-LOG.md**: a new dated section with the digest, flagged items + drafts, and the metrics row. Surface the must-answer few in chat.

---

## Flagging priorities

Flag (and draft a reply) when a comment is any of:

1. **Skeptical / technical challenge** — questions a metric or the method. *Highest value.* Turning a skeptic into "he clearly audits himself harder than I would" is the biggest win.
2. **Recruiter / senior title** — VP Eng, CTO, Head of QA/QE, Director, recruiter, or a notable name. Engage substantively; log the person for a possible connect/follow-up. **Never pitch availability.**
3. **Question / repo-or-demo request** — "how does it handle X?", "can I try it?", "where's the code?" Easy, high-value reply + one link.
4. **Negative / hostile** — flag it, do **not** draft a comeback. Note "handle with care — calm one-liner or ignore" and leave the judgment to Dmitry.

Everything else (praise, emoji, generic "great post"): note the count, no draft — a like from Dmitry is enough.

---

## Reply rules (for drafts)

- **Voice:** first person, Dmitry's tone — empirical, calm, slightly wry. Match the About/headline register.
- **Caveat-first with skeptics:** concede the fair point, *then* show the evidence. e.g. "Fair — 2–3% is a bounded estimate on one app; here's exactly how I got there: [link]."
- **Ground every claim** in `MAKE-THE-CASE.md`. Never invent a number. Reuse the four pre-drafted replies in `PUBLISH-PACKAGE.md` ("Isn't this just <tool>?", "2–3% seems too good", "Why keep the gate red?", "Can I try it?") as starting points.
- **Short:** aim under ~500 characters. One link max. Plain text (LinkedIn strips markdown).
- **Employer-safe:** no availability lines, no "open to roles," nothing that reads as job-hunting. Frame as personal R&D.
- **Ask a question back** where natural — it extends the thread, which LinkedIn rewards.
- **Hostile:** default to not replying, or one calm, non-defensive line. Never escalate tone.
- Each draft in the log is clearly marked **DRAFT — approve before posting** with the target comment quoted above it.

---

## Metrics to log (per post, per check)

| field | where to read it |
|---|---|
| Reactions | count under the post |
| Comments | count under the post |
| Reposts | count under the post |
| Profile views (trend) | Dmitry's own "profile views" / dashboard (optional, his read) |
| Notable engagers | names/titles worth following up (recruiters, senior) |

Trend matters more than absolute numbers — a profile-view spike after a post means the positioning is landing.

---

## Cadence (reminder-driven)

- **Launch day (Tue):** publish nudge ~09:00; comment-check #1 ~10:00 (≈launch +30–60 min); check #2 ~11:00 (≈+90 min).
- **Daily:** 18:00 digest — run the routine across all live posts, log metrics.
- Posts 2 & 3 (weeks 2–3): same launch-window pattern on their publish days.

---

## First-run verification (Tue, Post 1)

The first live run doubles as the acceptance test:

1. Compare the agent's extracted comment list against what's actually visible on the post — no missed or hallucinated comments.
2. Confirm each draft quotes a real line from `MAKE-THE-CASE.md` (no invented numbers).
3. Confirm the agent drafted only — nothing was posted.
4. Confirm employer-safe: no availability language slipped into any draft.

If all four hold, the routine is trusted for the rest of the campaign.
