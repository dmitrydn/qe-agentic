"""Check source citation occurrences against current Markdown; never repair content."""

from collections import Counter
import re
import subprocess
from pathlib import Path

from convert import PIN, records
from markdown_io import markdown_records, plain_citations, read_table
from workbook import ROOT, read_workbook

SPEC = Path("/tmp/rw-spec")
CITE = re.compile(r"([\w-]+\.(?:md|yml)) L(\d+)(?:-(\d+))?")
ALLOWED = {
    "endpoints.md": "docs/src/content/docs/specifications/backend/endpoints.md",
    "error-handling.md": "docs/src/content/docs/specifications/backend/error-handling.md",
    "api-response-format.md": "docs/src/content/docs/specifications/backend/api-response-format.md",
    "cors.md": "docs/src/content/docs/specifications/backend/cors.md",
    "routing.md": "docs/src/content/docs/specifications/frontend/routing.md",
    "templates.md": "docs/src/content/docs/specifications/frontend/templates.md",
    "features.md": "docs/src/content/docs/implementation-creation/features.md",
    "openapi.yml": "specs/api/openapi.yml",
    "styles.md": "docs/src/content/docs/specifications/frontend/styles.md",
    "frontend-api.md": "docs/src/content/docs/specifications/frontend/api.md",
    "frontend-tests.md": "docs/src/content/docs/specifications/frontend/tests.md",
    "backend-tests.md": "docs/src/content/docs/specifications/backend/tests.md",
    "backend-introduction.md": "docs/src/content/docs/specifications/backend/introduction.md",
}
STOP = set("a an the and or to of in on at for from with without is are be being been was were it its this that these those as by i my me we our you your they their them has have had do does did not no only any all each other same can cannot could should shall must may will would when then given which what how why where whether if so than into through also via shown stated requires require required returns return contains contain includes include needs need request requests response responses page pages api ui spec specification rule rules status successful successfully".split())


def tokens(text):
    text = re.sub(r"([a-z])([A-Z])", r"\1 \2", text)
    words = re.findall(r"[a-z]+|\d+", text.lower())
    return {w[:-1] if len(w) > 3 and w.endswith("s") else w for w in words if w not in STOP and (len(w) > 2 or w.isdigit())}


def citations(text):
    matches = list(CITE.finditer(text))
    remainder = CITE.sub("", text).replace(";", "").strip()
    assert not remainder, ("Unparsed citation text", text, remainder)
    return [(m.group(0), m.group(1), int(m.group(2)), int(m.group(3) or m.group(2))) for m in matches]


def read_exceptions():
    path = ROOT / "tools/citation-exceptions.md"
    entries = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        if not re.match(r"\| (?:BR|AC|OQ)-", line):
            continue
        parts = [part.strip() for part in line.strip("|").split("|")]
        assert len(parts) == 4, line
        item, citation, reason, reviewer = parts
        assert len(citations(citation)) == 1 and reason and reviewer, line
        key = (item, citation)
        assert key not in entries, ("Duplicate exception", key)
        entries[key] = (reason, reviewer)
    print("READ", path)
    return entries


def evidence(citation, cache):
    label, name, first, last = citation
    assert name in ALLOWED, ("Source outside explicit allowlist", name)
    path = SPEC / ALLOWED[name]
    result = dict(citation=label, path=ALLOWED[name], first=first, last=last, excerpt="", reason="")
    if not path.is_file():
        result["reason"] = "Cited file does not exist"
        return result
    if name not in cache:
        cache[name] = path.read_text(encoding="utf-8").splitlines()
        print("READ", path)
    lines = cache[name]
    if not 1 <= first <= last <= len(lines):
        result["reason"] = "Line range outside file bounds (" + str(len(lines)) + " lines)"
    else:
        result["excerpt"] = "\n".join(lines[first - 1:last])
    return result


def classify(result, item, row, trace_key, companions, exceptions):
    """Never waive range validity; explicitly distinguish all non-keyword passes."""
    result.update(id=item, method="FAIL", detail="")
    if result["reason"]:
        return result
    if item.startswith("OQ-"):
        result.update(method="Open-question existence", detail="File and range exist; keywords not applicable to specification silence.")
    elif (item, result["citation"]) in exceptions:
        reason, reviewer = exceptions[(item, result["citation"])]
        result.update(method="Reviewed exception", detail=reason + " — " + reviewer)
    elif row.get("BA-ASSUMPTION"):
        result.update(method="BA-ASSUMPTION", detail=row["BA-ASSUMPTION"] + "; range exists; not asserted as explicit specification behaviour.")
    else:
        wording = " ".join(v for k, v in row.items() if k not in {trace_key, "Rule ID", "AC ID", "Story ID", "Gherkin"})
        matches = sorted(tokens(wording) & tokens(result["excerpt"]))
        if matches:
            result.update(method="Direct keywords", detail=", ".join(matches))
        else:
            support = []
            for companion in companions:
                if companion["reason"] or companion["citation"] == result["citation"]:
                    continue
                overlap = sorted(tokens(wording) & tokens(companion["excerpt"]))
                if overlap:
                    support.append(companion["citation"] + " (" + ", ".join(overlap) + ")")
            if support:
                result.update(method="Citation-set context", detail="This range exists but has no direct wording keyword. Supporting citation in the same item: " + "; ".join(support))
            else:
                result["reason"] = "No substantive wording keyword in this range or companion citations"
    return result


def audit_entry(index, result):
    url = "https://github.com/realworld-apps/realworld/blob/" + PIN + "/" + result["path"] + "#L" + str(result["first"]) + "-L" + str(result["last"])
    return ["### " + str(index) + ". " + result["id"] + " — " + result["citation"],
            "FAIL: " + result["reason"] if result["reason"] else "PASS — " + result["method"] + ": " + result["detail"],
            "Source: " + url, "````text\n" + result["excerpt"] + "\n````"]


def historical_main():
    head = subprocess.check_output(["git", "-C", str(SPEC), "rev-parse", "HEAD"], text=True).strip()
    assert head == PIN, head
    book = read_workbook()
    items, stories = markdown_records()
    exceptions = read_exceptions()
    cache, results, additions, rollups, used_exceptions = {}, [], [], [], set()
    sheets = [("Business Rules", "Rule ID", "Spec traces"),
              ("Acceptance Criteria", "AC ID", "Spec traces"),
              ("Open Questions", "OQ ID", "Spec evidence")]
    source_ids = set()
    for sheet, id_key, trace_key in sheets:
        for source in records(book[sheet]):
            item = source[id_key]
            source_ids.add(item)
            row = items[item]
            assert row[id_key] == item and row["Story ID"] == source["Story ID"], item
            original = citations(source[trace_key])
            current = citations(row[trace_key])
            original_counts, current_counts = Counter(c[0] for c in original), Counter(c[0] for c in current)
            assert not original_counts - current_counts, ("Original citation removed", item)
            assert len(current) == len(current_counts), ("Duplicate citation", item)
            companions = [evidence(c, cache) for c in current]
            for citation, raw in zip(current, companions):
                result = classify(dict(raw), item, row, trace_key, companions, exceptions)
                result["sheet"] = sheet
                (results if citation[0] in original_counts else additions).append(result)
                if result["method"] == "Reviewed exception":
                    used_exceptions.add((item, citation[0]))
    assert source_ids == set(items), ("Unexpected or missing Markdown IDs", source_ids ^ set(items))
    assert len(results) == 284, len(results)
    assert set(exceptions) == used_exceptions, ("Unused/invalid exceptions", set(exceptions) - used_exceptions)
    assert set(stories) == {s["Story ID"] for s in records(book["Backlog"])}
    # The compact epic layout intentionally omits the workbook's roll-up column.
    # Check that unchanged source roll-up against the current Markdown rule citations.
    for story in records(book["Backlog"]):
        sid = story["Story ID"]
        rule_traces = {c[0] for item, rule in items.items() if item.startswith("BR-") and rule["Story ID"] == sid for c in citations(rule["Spec traces"])}
        for c in citations(story["Spec traces (rules)"]):
            rollups.append((sid, c[0], c[0] in rule_traces))
    failures = [r for r in results + additions if r["reason"]]
    primary_failed = sum(bool(r["reason"]) for r in results)
    rollup_failures = [r for r in rollups if not r[2]]
    methods = Counter(r["method"] for r in results)
    summary = "Checked: 284 / Passed: " + str(284 - primary_failed) + " / Failed: " + str(primary_failed)
    report = ["# Run 1c citation report", "Specification pin: " + PIN, "## Result", summary,
              "Additional Markdown citation occurrences: " + str(len(additions)) + " checked / " + str(sum(not r["reason"] for r in additions)) + " passed / " + str(sum(bool(r["reason"]) for r in additions)) + " failed.",
              "Backlog roll-up entries: " + str(len(rollups)) + " checked / " + str(len(rollups) - len(rollup_failures)) + " passed / " + str(len(rollup_failures)) + " failed.",
              "## Outcome breakdown (original 284 occurrences)"]
    report.extend("- " + method + ": " + str(count) for method, count in sorted(methods.items()))
    report += ["## Method and limitations",
               "The denominator retains the 284 original source-sheet citation occurrences (126 Business Rules, 97 Acceptance Criteria, 61 Open Questions). Evidence and BA-ASSUMPTION labels are read from current canonical Markdown item blocks, not only from the unchanged XLSX. Added Markdown citations are checked and reported separately; none are silently discarded. Original citations must remain present. Sources are limited to the explicit eight-file allowlist; every inclusive 1-based range must exist at the verified pin, even for an exception, assumption or contextual citation.",
               "Open questions are checked for existence only, because their citations can point to specification silence. Exact ID/citation pairs in tools/citation-exceptions.md count as passed but appear separately below, including the AI reviewer and pending human confirmation. BA-ASSUMPTION items are range-checked and reported as assumptions, not as proved behaviour. Ordinary wording uses the unchanged token screen (case folding, camelCase splitting, trailing-s singularisation, fixed stop words). Each range's direct match is attempted first. When a range is contextual markup with no wording overlap, another range in the same item's current citation set can provide the keywords; the report explicitly identifies that companion instead of claiming a match in the markup. In this run this applies to BR-18.2 and AC-18.1, supported by routing.md L18 while retaining templates.md L599-600. BR-18.2 already included routing.md L18; only AC-18.1 adds a new citation occurrence.",
               "These are lexical/structural checks, not semantic proof or BA approval. In particular, the five supplied AI paraphrases remain pending Dmitry's confirmation. The compact layout omits duplicated IDs and story-level roll-ups. IDs are parsed from headings/list labels; Given/When/Then wording is reconstructed from the verbatim Gherkin for the unchanged keyword screen. Backlog roll-ups are read from the unchanged workbook and checked only for membership in that story's current Markdown rule citations; they do not increase the primary denominator.",
               "## Reviewed exceptions"]
    for r in results:
        if r["method"] == "Reviewed exception":
            report.append("- " + r["id"] + " — " + r["citation"] + ": " + r["detail"])
    report.append("## Every unexplained failure")
    report.extend("- " + r["id"] + " — " + r["citation"] + ": " + r["reason"] for r in failures)
    report.extend("- Backlog " + sid + " — " + c + ": absent from this story's rules" for sid, c, _ in rollup_failures)
    if not failures and not rollup_failures:
        report.append("None.")
    report.append("## Per-sheet totals (original occurrences)")
    for sheet, _, _ in sheets:
        group = [r for r in results if r["sheet"] == sheet]
        failed = sum(bool(r["reason"]) for r in group)
        report.append("- " + sheet + ": " + str(len(group)) + " checked / " + str(len(group) - failed) + " passed / " + str(failed) + " failed")
    report.append("## Citation audit (all 284 original occurrences)")
    for index, result in enumerate(results, 1):
        report.extend(audit_entry(index, result))
    report.append("## Additional Markdown citations (outside the original denominator)")
    for index, result in enumerate(additions, 1):
        report.extend(audit_entry(index, result))
    report.append("## Backlog roll-up consistency (not primary citations)")
    report.extend("- " + sid + " — " + c + ": " + ("PASS" if passed else "FAIL") for sid, c, passed in rollups)
    (ROOT / "citation-report.md").write_text("\n\n".join(report) + "\n", encoding="utf-8")
    print(summary)
    print("Original outcome breakdown:", dict(sorted(methods.items())))
    print("Additional Markdown citations:", len(additions), "checked /", sum(not r["reason"] for r in additions), "passed")
    print("Roll-up:", len(rollups), "checked /", len(rollups) - len(rollup_failures), "passed /", len(rollup_failures), "failed")
    for r in failures:
        print("FAIL", r["id"], r["citation"], r["reason"])
    for sid, citation, _ in rollup_failures:
        print("ROLLUP FAIL", sid, citation)
    print("REPORT", ROOT / "citation-report.md")
    return bool(failures or rollup_failures)


def main():
    """Audit the full current item set; disclose all retired original occurrences."""
    head = subprocess.check_output(["git", "-C", str(SPEC), "rev-parse", "HEAD"], text=True).strip()
    assert head == PIN, head
    book = read_workbook()
    items, stories = markdown_records()
    exceptions = read_exceptions()
    cache, results, retired, metadata, rollups, used_exceptions = {}, [], [], [], [], set()
    sheets = [("Business Rules", "Rule ID", "Spec traces"),
              ("Acceptance Criteria", "AC ID", "Spec traces"),
              ("Open Questions", "OQ ID", "Spec evidence")]
    originals = {row[id_key]: (sheet, trace_key, row)
                 for sheet, id_key, trace_key in sheets for row in records(book[sheet])}
    changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
    change_rows = read_table(changelog.split("## Run 2a — step 4", 1)[1].split("## Run 2a — step 5", 1)[0])
    retirements = {r["ID"]: r for r in change_rows if r["Change"].startswith("Rule turned into ")}
    moves = {}
    for section in re.split(r"\n## ", changelog)[1:]:
        if "| ID | Change | Reason | Citation |" in section:
            for change in read_table(section):
                match = re.match(r"Moved unchanged to (IC-\d+\.\d+);", change["Change"])
                if match:
                    assert change["ID"] not in moves and change["ID"] not in items
                    moves[change["ID"]] = match.group(1)
                    assert match.group(1) in items and change["Reason"]
    inverse_moves = {new: old for old, new in moves.items()}
    assert len(inverse_moves) == len(moves)
    assert set(originals) - set(items) == set(retirements) | (set(moves) & set(originals)), "Every retired source ID must have a logged conversion or IC move"
    for item in set(retirements):
        sheet, trace_key, source = originals[item]
        target = re.search(r"Rule turned into (OQ-\d+\.\d+)", retirements[item]["Change"]).group(1)
        assert target in items and retirements[item]["Reason"], (item, target)
        for c in citations(source[trace_key]):
            raw = evidence(c, cache)
            raw.update(id=item, method="Retired assertion — range only", detail="Converted to " + target + "; see CHANGELOG. Not counted as current supported behaviour.")
            retired.append(raw)
    for item, row in items.items():
        sheet, trace_key = ("Interface Contract" if item.startswith("IC-") else "Business Rules", "Spec traces") if item.startswith(("BR-", "IC-")) else (("Acceptance Criteria", "Spec traces") if item.startswith("AC-") else ("Open Questions", "Spec evidence"))
        current = citations(row[trace_key])
        assert current, ("Missing citation", item)
        assert len(current) == len({c[0] for c in current}), ("Duplicate citation", item)
        source_citations = []
        source_id = inverse_moves.get(item, item)
        if source_id in originals:
            _, _, source = originals[source_id]
            assert row["Story ID"] == source["Story ID"], item
            source_citations = [c[0] for c in citations(source[trace_key])]
            assert not Counter(source_citations) - Counter(c[0] for c in current), ("Unlogged removed citation", item)
        else:
            assert "| " + source_id + " | New " in changelog, ("Unlogged new item", item)
        companions = [evidence(c, cache) for c in current]
        for citation, raw in zip(current, companions):
            result = classify(dict(raw), item, row, trace_key, companions, exceptions)
            result.update(sheet=sheet, origin="Retained original" if citation[0] in source_citations else "Added")
            results.append(result)
            if result["method"] == "Reviewed exception":
                used_exceptions.add((item, citation[0]))
    assert sum(r["origin"] == "Retained original" for r in results) + len(retired) == 284
    assert set(exceptions) == used_exceptions, ("Unused exception", set(exceptions) - used_exceptions)
    assert set(stories) == {s["Story ID"] for s in records(book["Backlog"])}
    trace = (ROOT / "traceability.md").read_text(encoding="utf-8")
    for heading in ("Run 2a gap reconciliation", "Run 2a coverage"):
        section = trace.split("## " + heading, 1)[1].split("\n## ", 1)[0]
        for row in read_table(section):
            item = row.get("Gap", row.get("Checklist ID"))
            for c in citations(plain_citations(row["Evidence at pin"])):
                result = evidence(c, cache)
                result.update(id=item, method="Traceability range only", detail="Reconciliation/coverage evidence; semantic disposition is documented in traceability.")
                metadata.append(result)
    for section in re.split(r"\n## ", changelog)[1:]:
        if "| ID | Change | Reason | Citation |" not in section:
            continue
        for row in read_table(section):
            for c in citations(plain_citations(row["Citation"])):
                result = evidence(c, cache)
                result.update(id=row["ID"], method="Change-log range only", detail="Historical/content-change evidence, not an additional current assertion.")
                metadata.append(result)
    # Historical roll-ups may point at a retired source rule, never at an unexplained omission.
    for story in records(book["Backlog"]):
        sid = story["Story ID"]
        current = {c[0] for i, r in items.items() if i.startswith(("BR-", "IC-")) and r["Story ID"] == sid for c in citations(r["Spec traces"])}
        removed = {c[0] for i in retirements if originals[i][2]["Story ID"] == sid for c in citations(originals[i][2]["Spec traces"])}
        for c in citations(story["Spec traces (rules)"]):
            status = "Current rule" if c[0] in current else ("Logged retired rule" if c[0] in removed else "FAIL")
            rollups.append((sid, c[0], status))
    failures = [r for r in results + retired + metadata if r["reason"]]
    bad_rollups = [r for r in rollups if r[2] == "FAIL"]
    methods = Counter(r["method"] for r in results)
    summary = "Current citations: " + str(len(results)) + " checked / " + str(sum(not r["reason"] for r in results)) + " passed / " + str(sum(bool(r["reason"]) for r in results)) + " unexplained failures."
    report = ["# Run 2b citation report", "Specification pin: " + PIN, "## Result", summary,
              "Original 284 occurrence accounting: " + str(sum(r["origin"] == "Retained original" for r in results)) + " retained, " + str(len(retired)) + " retired with logged question conversions. Added current occurrences: " + str(sum(r["origin"] == "Added" for r in results)) + ".",
              "Metadata citations: " + str(len(metadata)) + " range-checked. Retired citations: " + str(len(retired)) + " range-checked, not asserted as supported rules.",
              "Backlog historical roll-ups: " + str(len(rollups)) + " checked; " + str(sum(r[2] == "Current rule" for r in rollups)) + " match current rule citations; " + str(sum(r[2] == "Logged retired rule" for r in rollups)) + " match logged retired rules; " + str(len(bad_rollups)) + " unexplained omissions.",
              "## Current outcome breakdown"]
    report.extend("- " + method + ": " + str(count) for method, count in sorted(methods.items()))
    report += ["## Method and limitations",
               "All current BR/IC/AC/OQ items are read from canonical Markdown, including every newly added item and citation. Original IDs may disappear only through an explicit logged rule-to-question conversion or unchanged BR-to-IC move. Moved original citations count as retained; retained original citations must remain. Historical roll-ups match current BR or IC citations. Every range must exist at the verified pin in the explicit 13-file requirement-source allowlist. No test suite or implementation is an input.",
               "The prior lexical policy is unchanged: ordinary wording requires direct substantive-token overlap or explicitly reported same-item citation-set context. OQ citations are existence-only because they may locate silence. BA-ASSUMPTION scenarios are range-checked, not promoted to specification-backed predicates. Exact exceptions use their current recorded reviewer; all five currently name Dmitry, 2026-11-18. No new exception has been introduced.",
               "Reconciliation/coverage and change-log evidence is checked for range existence separately; historical checklist wording is only a lead, not a new asserted requirement. Historical roll-ups distinguish current rule membership from a logged retired assertion. These lexical/structural checks are not semantic proof, executed tests or BA approval. Responses declared by OpenAPI do not establish unstated triggers.",
               "## Reviewed exceptions"]
    report.extend("- " + r["id"] + " — " + r["citation"] + ": " + r["detail"] for r in results if r["method"] == "Reviewed exception")
    report += ["## Every unexplained failure"]
    report.extend("- " + r["id"] + " — " + r["citation"] + ": " + r["reason"] for r in failures)
    report.extend("- Backlog " + sid + " — " + c + ": missing" for sid, c, _ in bad_rollups)
    if not failures and not bad_rollups:
        report.append("None.")
    for heading, group in [("Current citation audit", results), ("Retired original citation audit", sorted(retired, key=lambda r: (r["id"], r["citation"]))), ("Traceability and change-log citation audit", metadata)]:
        report.append("## " + heading)
        for index, result in enumerate(group, 1):
            report.extend(audit_entry(index, result))
    report.append("## Historical roll-up consistency")
    report.extend("- " + sid + " — " + c + ": " + status for sid, c, status in rollups)
    (ROOT / "citation-report.md").write_text("\n\n".join(report) + "\n", encoding="utf-8")
    print(summary)
    print("Current outcome breakdown:", dict(sorted(methods.items())))
    print("Retired occurrences:", len(retired), "; metadata occurrences:", len(metadata))
    print("Historical roll-ups:", dict(Counter(r[2] for r in rollups)))
    for r in failures:
        print("FAIL", r["id"], r["citation"], r["reason"])
    print("REPORT", ROOT / "citation-report.md")
    return bool(failures or bad_rollups)


if __name__ == "__main__":
    raise SystemExit(main())