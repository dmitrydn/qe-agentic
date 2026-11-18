#!/usr/bin/env python3
"""Build the self-contained BA review pack (zip) from the repo requirements.

Usage: python3 tools/build_ba_pack.py OUTPUT.zip
Reads REVIEW-GUIDE.md, epics/*.md, review/BA-review.xlsx (unchanged in the repo).
Writes a zip with 1-Review-Guide.html, 2-Stories.html, 3-BA-review.xlsx.
BA copy: no repository paths, no Interface-contract sections, no Baseline IDs.
"""
import re, sys, glob, os, shutil, subprocess, tempfile, zipfile
import openpyxl
from openpyxl.styles import Font

HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GUIDE, STORIES, WB = "1-Review-Guide.html", "2-Stories.html", "3-BA-review.xlsx"
CSS = """<style>
body{font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:60rem;margin:2rem auto;padding:0 1rem;line-height:1.5;color:#1f2328}
table{border-collapse:collapse;margin:1rem 0;font-size:.92rem}th,td{border:1px solid #d0d7de;padding:.35rem .6rem;vertical-align:top}th{background:#f6f8fa}
code{background:#f6f8fa;padding:.1rem .3rem;border-radius:4px;font-size:.88em}pre{background:#f6f8fa;padding:.8rem;border-radius:6px;overflow:auto}
h1{border-bottom:2px solid #d0d7de;padding-bottom:.3rem}h2{border-bottom:1px solid #eaeef2;padding-bottom:.2rem;margin-top:2.2rem}
#TOC{background:#f6f8fa;padding:.5rem 1.5rem;border-radius:6px}#TOC ul{padding-left:1.2rem}
</style>"""

def sub1(s, a, b):
    assert s.count(a) == 1, f"expected exactly one occurrence of: {a[:70]}"
    return s.replace(a, b)

def guide_md():
    s = open(os.path.join(HERE, "REVIEW-GUIDE.md")).read()
    s = sub1(s, " (`DECISIONS.md` D-04)", "")
    s = sub1(s, "`review/BA-review.xlsx` (your working file), `epics/*.md` (the stories)",
             f"**{WB}** (your working file), **{STORIES}** (the stories)")
    s = sub1(s, " (`intent.md` P2)", "")
    s = sub1(s, "**Never open the official test suites**: `specs/api/hurl/`, `specs/api/bruno/`, `specs/e2e/`, the Postman collection, in the sandbox or on GitHub | They are the hidden answer key used to score the agents (`DECISIONS.md` D-03)",
             "**Never open the official test suites** of the RealWorld specification on GitHub: the folders `specs/api/hurl/`, `specs/api/bruno/`, `specs/e2e/` and the Postman collection | They are the hidden answer key used to score the agents")
    s = sub1(s, "**Never read the app's source code** (`backend/`, `frontend/` in the sandbox)",
             "**Never read the app's source code** (the RealWorld backend and frontend repositories)")
    s = sub1(s, "**Don't edit the Markdown files** (`epics/`, `open-questions.md`) | Your answers are transferred into them by script, so there is one source of truth: your workbook",
             f"**Don't edit the stories or this guide** ({STORIES}, {GUIDE}) | Your answers go only into the workbook, so there is one source of truth")
    s = sub1(s, "Sheet **Stories** in `review/BA-review.xlsx`, one row per user story. For each story, read it in `epics/EP-0n-….md` and ask:",
             f"Sheet **Stories** in {WB}, one row per user story. Click the story's link in the *Read the story* column (or find it in {STORIES}) and ask:")
    s = re.sub(r"\n- Skip the section \*\*Interface contract \(not for BA review\)\*\*[^\n]*", "", s)
    s = sub1(s, "An agent then transfers your answers into the Markdown requirements", "An agent then transfers your answers into the requirements")
    s = sub1(s, " (`intent.md` P3)", "")
    s = sub1(s, "It behaves differently from the local app on purpose", "It behaves differently from the team's instance on purpose")
    s = re.sub(r"\A# [^\n]*\n+", "", s)                      # title comes from pandoc metadata
    s = s.replace("\n**Time:**", "\n\n**Time:**").replace("\n**You need:**", "\n\n**You need:**")
    return s

PIN = "ebbcdeb8d55b42a3a613c787560498b8ef10003f"
SPEC = {"api-response-format.md": "docs/src/content/docs/specifications/backend/",
        "cors.md": "docs/src/content/docs/specifications/backend/",
        "endpoints.md": "docs/src/content/docs/specifications/backend/",
        "error-handling.md": "docs/src/content/docs/specifications/backend/",
        "routing.md": "docs/src/content/docs/specifications/frontend/",
        "styles.md": "docs/src/content/docs/specifications/frontend/",
        "templates.md": "docs/src/content/docs/specifications/frontend/",
        "features.md": "docs/src/content/docs/implementation-creation/",
        "openapi.yml": "specs/api/"}
CITE = re.compile(r"`?(" + "|".join(re.escape(k) for k in SPEC) + r")`? L(\d+)(?:-(\d+))?")

def link_citations(s):
    def rep(m):
        f, a, b = m.group(1), m.group(2), m.group(3) or m.group(2)
        url = f"https://github.com/realworld-apps/realworld/blob/{PIN}/{SPEC[f]}{f}#L{a}-L{b}"
        return f"[{f} L{a}{'-' + m.group(3) if m.group(3) else ''}]({url})"
    return CITE.sub(rep, s)

def stories_md():
    parts = [f"Stories for review. Rule numbers have gaps on purpose: technical interface details were moved out of this copy because they need no business decision. Decide open questions in **{WB}**, sheet *Decisions*; review each story on sheet *Stories*. "
             f"How to review: **{GUIDE}**.\n"]
    for f in sorted(glob.glob(os.path.join(HERE, "epics", "EP-*.md"))):
        s = open(f).read()
        # drop Interface contract sections (until next ## or ### heading)
        s = re.sub(r"\n### Interface contract \(not for BA review\)\n.*?(?=\n##+ |\Z)", "\n", s, flags=re.S)
        s = re.sub(r" · \*\*Baseline:\*\* [^\n]*", "", s)
        s = s.replace("→ [open-questions.md](../open-questions.md)", f"→ decide in {WB}, sheet *Decisions*")
        s = link_citations(s)
        s = re.sub(r"^## (US-(\d\d)) (.*)$", lambda m: f"## {m.group(1)} {m.group(3)} {{#us-{m.group(2)}}}", s, flags=re.M)
        parts.append(s)
    return "\n\n".join(parts)

def html(md, out, title):
    with tempfile.TemporaryDirectory() as t:
        src, hdr = os.path.join(t, "in.md"), os.path.join(t, "h.html")
        open(src, "w").write(md); open(hdr, "w").write(CSS)
        subprocess.run(["pandoc", src, "-f", "markdown", "-t", "html5", "-s", "--toc", "--toc-depth=2",
                        "-H", hdr, "--metadata", f"title={title}", "-o", out], check=True)

def workbook(out):
    wb = openpyxl.load_workbook(os.path.join(HERE, "review", "BA-review.xlsx"))
    ws = wb["Stories"]
    col = [c.column for c in ws[1] if c.value == "File"]
    assert len(col) == 1, "Stories sheet must have one File column"
    col = col[0]
    ws.cell(1, col).value = "Read the story"
    for r in range(2, ws.max_row + 1):
        sid = ws.cell(r, 1).value
        if not sid: continue
        n = re.match(r"US-(\d\d)$", sid).group(1)
        c = ws.cell(r, col)
        c.value = f"{STORIES} › {sid}"
        c.hyperlink = f"{STORIES}#us-{n}"
        c.font = Font(color="0563C1", underline="single")
    wb.save(out)

def main(zip_out):
    with tempfile.TemporaryDirectory() as t:
        html(guide_md(), os.path.join(t, GUIDE), "Conduit requirements: review guide for the BA")
        html(stories_md(), os.path.join(t, STORIES), "Conduit user stories")
        workbook(os.path.join(t, WB))
        with zipfile.ZipFile(zip_out, "w", zipfile.ZIP_DEFLATED) as z:
            for n in (GUIDE, STORIES, WB):
                z.write(os.path.join(t, n), f"Conduit-BA-review-pack/{n}")
    print("wrote", zip_out)

if __name__ == "__main__":
    main(sys.argv[1])
