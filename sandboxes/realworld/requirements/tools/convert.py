"""Generate compact Markdown, retaining source content and Run 1b corrections."""

import hashlib
import re
import sys

from markdown_io import markdown_records, plain_citations, read_table, table
from workbook import ROOT, SOURCE, read_workbook

PIN = "ebbcdeb8d55b42a3a613c787560498b8ef10003f"
SLUGS = ["account-authentication", "profiles-settings", "articles", "discovery-feeds",
         "comments", "social", "navigation-platform"]


def records(sheet):
    headers = {re.sub(r"\d", "", k): v for k, v in sheet[0].items()}
    return [{headers[re.sub(r"\d", "", k)]: v for k, v in row.items()} for row in sheet[1:]]


def fields(row):
    return "\n\n".join("**" + key + ":**\n\n" + value for key, value in row.items())


def expected_items(book):
    items = {}
    for sheet, key in [("Business Rules", "Rule ID"), ("Acceptance Criteria", "AC ID"), ("Open Questions", "OQ ID")]:
        for row in records(book[sheet]):
            items[row[key]] = dict(row)
    items["AC-18.1"]["Spec traces"] += "; routing.md L18"
    items["AC-03.1"]["BA-ASSUMPTION"] = "persistence across reload is implied by storing the token in localStorage, not stated"
    return items


def check_content(book=None):
    """Check every canonical field, not just global substring presence."""
    book = book or read_workbook()
    actual, stories = markdown_records()
    expected = expected_items(book)
    assert set(actual) == set(expected), "Item ID mismatch"
    for item, row in expected.items():
        assert actual[item] == row, ("Item content changed", item, actual[item], row)
    expected_stories = records(book["Backlog"])
    assert set(stories) == {s["Story ID"] for s in expected_stories}
    for source in expected_stories:
        for field in ["Story ID", "Title", "Persona", "Type", "Priority (proposed)", "Status", "Baseline req IDs", "User story"]:
            assert stories[source["Story ID"]][field] == source[field], (source["Story ID"], field)
    trace = (ROOT / "traceability.md").read_text(encoding="utf-8")
    if "| Baseline req ID |" in trace:
        assert read_table(trace) == records(book["Traceability"]), "Traceability content changed"
    # Formatting is removed only for citation backticks; text and Gherkin are literal.
    rendered = "\n".join(path.read_text(encoding="utf-8") for path in sorted((ROOT / "epics").glob("EP-*.md")))
    rendered += "\n" + (ROOT / "open-questions.md").read_text(encoding="utf-8")
    for row in expected.values():
        for key in ["Business rule", "Gherkin", "Question"]:
            if key in row:
                assert row[key] in rendered, ("Non-verbatim content", key, row)
        key = "Spec evidence" if "OQ ID" in row else "Spec traces"
        assert row[key] in plain_citations(rendered), ("Non-verbatim citations", row)
    print("Content check PASS: 89 rule texts, 72 Gherkin blocks, 54 questions, all item fields and citation strings, plus exact Run 1b corrections")
    return actual, stories


def check_counts():
    """Read-only step 2 count check; never regenerate over reviewed Markdown."""
    before = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    book = read_workbook()
    paths = sorted((ROOT / "epics").glob("EP-*.md"))
    epic_text = "\n".join(path.read_text(encoding="utf-8") for path in paths)
    questions = (ROOT / "open-questions.md").read_text(encoding="utf-8")
    trace = (ROOT / "traceability.md").read_text(encoding="utf-8")
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    specs = [
        ("epics", r"^# (EP-\d+)", epic_text, "Epics", "Epic ID"),
        ("stories", r"^## (US-\d+)", epic_text, "Backlog", "Story ID"),
        ("rules", r"^- \*\*(BR-\d+\.\d+)\*\*", epic_text, "Business Rules", "Rule ID"),
        ("scenarios", r"^#### (AC-\d+\.\d+)\b", epic_text, "Acceptance Criteria", "AC ID"),
        ("open questions", r"^\| (OQ-\d+\.\d+) \|", questions, "Open Questions", "OQ ID"),
        ("traceability rows", r"^\| (R-\d+) \|", trace, "Traceability", "Baseline req ID"),
    ]
    counts = []
    for label, pattern, text, sheet, key in specs:
        actual = re.findall(pattern, text, re.M)
        expected = [r[key] for r in records(book[sheet]) if r[key] != "Total"]
        assert sorted(actual) == sorted(expected), (label, actual, expected)
        assert len(actual) == len(set(actual)), ("Duplicate IDs", label)
        assert "- " + label + ": " + str(len(actual)) in readme, label
        counts.append(len(actual))
    assert counts == [7, 23, 89, 72, 54, 73], counts
    assert len(paths) == 7
    assert re.findall(r"\*\*Status:\*\* ([^ ·\n]+)", epic_text) == ["Draft"] * 23
    question_rows = read_table(questions)
    assert all(r["Status"] == "Open" and r["Answer / decision"] == "" for r in question_rows)
    assert before == hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    print("Step 2 count check PASS: " + ", ".join(str(n) + " " + s[0] for n, s in zip(counts, specs)))
    print("PASS: exact source ID sets, README counts, Draft/Open statuses and blank answers; source SHA-256", before)
    for path in paths + [ROOT / "open-questions.md", ROOT / "traceability.md", ROOT / "README.md"]:
        print("READ", path)


def main():
    before = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    book = read_workbook()
    data = {name: records(book[name]) for name in book if name != "README"}
    epics = [r for r in data["Epics"] if r["Epic ID"].startswith("EP-")]
    counts = dict(zip(["epics", "stories", "rules", "scenarios", "open questions", "traceability rows"],
                      [len(epics)] + [len(data[n]) for n in ("Backlog", "Business Rules", "Acceptance Criteria", "Open Questions", "Traceability")]))
    assert list(counts.values()) == [7, 23, 89, 72, 54, 73], counts
    assert all(r["Status"] == "Draft" for r in data["Backlog"])
    assert all(r["Status"] == "Open" and not r["Answer / decision"] for r in data["Open Questions"])
    # Fail before any write if migration would discard an existing content change.
    paths = sorted((ROOT / "epics").glob("EP-*.md"))
    old_items, old_stories = check_content(book) if paths else (None, None)
    old_lines = sum(len(p.read_text(encoding="utf-8").splitlines()) for p in paths)
    items = expected_items(book)
    outputs = {}
    readme = ["# Conduit requirements — unchanged workbook conversion",
              "Derived, not stakeholder-authored. Run 1 preserves source wording; no BA decisions have been made.",
              "Specification pin: " + PIN,
              "## Counts\n\n" + "\n".join("- " + k + ": " + str(v) for k, v in counts.items()),
              "## Workbook README (verbatim cell text)"]
    for row in book["README"]:
        readme.append("\n\n".join(row.values()))
    readme.append("## Workbook epic summary (verbatim cell text)")
    readme.extend(fields(r) for r in data["Epics"])
    readme.append("## Workbook sources and personas (verbatim cell text)")
    readme.extend("\n\n".join(row.values()) for row in book["Sources"])
    readme.append("Workbook verification statements above are historical claims, not the current check result. See citation-report.md for Run 1 results. BA-ASSUMPTION: personas, value statements, epic grouping, proposed priorities and example data are authored judgement as described above; per-item tidy-up is deferred to step 6.")
    outputs[ROOT / "README.md"] = "\n\n".join(readme) + "\n"
    # Layout-only run: the already published README remains byte-for-byte unchanged.
    if (ROOT / "README.md").exists():
        outputs[ROOT / "README.md"] = (ROOT / "README.md").read_text(encoding="utf-8")

    def traces(value):
        return re.sub(r"([\w-]+\.(?:md|yml))(?= L\d)", r"`\1`", value)

    for epic, slug in zip(epics, SLUGS):
        parts = ["# " + epic["Epic ID"] + " " + epic["Epic"], epic["Goal"]]
        for story in data["Backlog"]:
            if story["Epic ID"] != epic["Epic ID"]:
                continue
            sid = story["Story ID"]
            metadata = " · ".join("**" + key + ":** " + story[field] for key, field in
                                   [("Persona", "Persona"), ("Type", "Type"), ("Priority (proposed)", "Priority (proposed)"),
                                    ("Status", "Status"), ("Baseline", "Baseline req IDs")])
            parts += ["## " + sid + " " + story["Title"], metadata, story["User story"], "### Business rules"]
            rule_lines = []
            for rule in data["Business Rules"]:
                if rule["Story ID"] == sid:
                    rule = items[rule["Rule ID"]]
                    rule_lines.append("- **" + rule["Rule ID"] + "** " + rule["Business rule"] + " — " + traces(rule["Spec traces"]))
            parts.append("\n".join(rule_lines))
            parts.append("### Acceptance criteria")
            for ac in data["Acceptance Criteria"]:
                if ac["Story ID"] == sid:
                    ac = items[ac["AC ID"]]
                    parts += ["#### " + ac["AC ID"] + " " + ac["Scenario"] + " (" + ac["Level"] + ")",
                              "Spec: " + traces(ac["Spec traces"])]
                    if ac.get("BA-ASSUMPTION"):
                        parts.append("**BA-ASSUMPTION:** " + ac["BA-ASSUMPTION"])
                    parts.append("```gherkin\n" + ac["Gherkin"] + "\n```")
            parts.append("### Open questions")
            parts.append("\n".join("- **" + q["OQ ID"] + "** " + q["Question"] + " → [open-questions.md](../open-questions.md)"
                                   for q in data["Open Questions"] if q["Story ID"] == sid))
        outputs[ROOT / "epics" / (epic["Epic ID"] + "-" + slug + ".md")] = "\n\n".join(parts) + "\n"
    outputs[ROOT / "open-questions.md"] = "# Open questions\n\n" + table(data["Open Questions"], list(data["Open Questions"][0])) + "\n"
    headers = list(data["Traceability"][0])
    outputs[ROOT / "traceability.md"] = "# Baseline R-ID → story mapping\n\n" + table(data["Traceability"], headers) + "\n"
    for path, text in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
    new_items, new_stories = check_content(book)
    if old_items is not None:
        assert old_items == new_items, "Canonical item content changed during layout migration"
        for sid, story in new_stories.items():
            assert all(old_stories[sid][key] == value for key, value in story.items()), sid
    check_counts()
    assert before == hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    print("Step 2 PASS:", ", ".join(str(v) + " " + k for k, v in counts.items()))
    new_lines = sum(len(p.read_text(encoding="utf-8").splitlines()) for p in outputs if p.parent.name == "epics")
    print("Epic total line count: before", old_lines, "/ after", new_lines)
    print("PASS: canonical items unchanged across migration; source SHA-256", before)
    for path in outputs:
        print("READ/WRITE", path)


if __name__ == "__main__":
    if sys.argv[1:] == ["--check-counts"]:
        check_counts()
    elif sys.argv[1:] == ["--check-content"]:
        check_content()
    elif not sys.argv[1:]:
        main()
    else:
        raise SystemExit("Usage: convert.py [--check-counts|--check-content]")