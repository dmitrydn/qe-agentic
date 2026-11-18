"""Run 2b only: canonical Markdown -> D-06 split, Gherkin and BA workbook.

No research input. `split` is one-shot; `pack` regenerates derived outputs;
`check` validates without generating. Network link checks are separate.
"""
import copy
import hashlib
import random
import re
import sys
from collections import Counter

from markdown_io import markdown_records, plain_citations, read_table, table
from workbook import ROOT, SOURCE

PIN = "ebbcdeb8d55b42a3a613c787560498b8ef10003f"
SHA = "eb1a9ef70058438926454d9f0f8bcf316aa014162d4db8633b657073eafe9b58"
GUIDE_HASH = ROOT / "tools/run2b-guide-prefix.sha256"
IC = {
    "01.3": "Only successful-response fields and declared success status; no separate user entitlement or validation predicate.",
    "01.7": "Only the token storage mechanism, not session validity or persistence policy (OQ-03.3 remains open).",
    "01.8": "Only User schema fields, types and nullability.",
    "01.9": "Only registration request envelope/required schema fields; business required inputs remain BR-01.1.",
    "01.10": "Only fixed heading/link text and its template destination.",
    "02.6": "Only token storage mechanism; not a session-validity or permission rule.",
    "02.7": "Only login request envelope/required schema fields; business required inputs remain BR-02.1.",
    "02.8": "Only declared responses; the wrong-credential condition is explicitly undecided.",
    "02.9": "Only fixed heading/link text and its template destination.",
    "03.1": "Only credential header wire format; authentication permissions remain BR-03.2/03.3.",
    "03.5": "Only declared response codes and response names.",
    "05.6": "Only declared response codes and response names.",
    "06.5": "Only profile wrapper, schema fields, boolean type and nullability.",
    "06.6": "Only declared responses; optional-auth token behaviour remains an unanswered question.",
    "08.5": "Only published-article response fields and declared success status; publishing permissions remain BR-08.3.",
    "08.7": "Only request envelope/field types and schema optionality; business required/optional inputs remain BR-08.4.",
    "08.8": "Only Article schema fields and types, including author reference.",
    "08.9": "Only declared responses; the conflict condition is explicitly undecided.",
    "09.5": "Only declared responses; no API ownership predicate is asserted.",
    "10.4": "Only declared responses and empty response shape; no API ownership predicate is asserted.",
    "11.6": "Only declared response codes and response names.",
    "12.3": "Only list response shape (body omitted, articlesCount present), not count meaning.",
    "12.5": "Only list/feed response schema fields/types; no filtered-total semantics.",
    "12.6": "Only declared responses; optional-auth handling remains unanswered.",
    "12.7": "Only fixed home-banner text.",
    "13.4": "Only declared response codes and response names.",
    "14.4": "Only declared response codes and tags response schema.",
    "15.6": "Only pagination markup/CSS classes, not page-size or navigation behaviour.",
    "16.4": "Only comment request envelope/required schema field; business body requirement remains BR-16.2.",
    "16.5": "Only Comment schema fields and types, including author reference.",
    "16.6": "Only declared response codes and response names.",
    "17.4": "Only declared responses and array wrapper; optional-auth behaviour remains unanswered.",
    "18.4": "Only path-parameter type and declared responses/empty shape; the ownership condition is not decided.",
    "19.6": "Only no-extra-parameter request shape and declared responses; authentication permission remains BR-19.1.",
    "20.5": "Only no-extra-parameter request shape and declared responses; authentication permission remains BR-20.1.",
    "21.4": "Only fixed document-title/footer text and a fixed footer link.",
    "22.5": "Only error-key schema for declared 403/404 responses, not the condition for allowing or refusing access.",
    "22.6": "Only response media type and charset.",
    "22.7": "Only error response schema/example, not a new token-validation or permission rule.",
    "22.8": "Only error schema and illustrative keys/messages, not a resource permission predicate.",
}
# Conservative, deliberately over-inclusive list of actor/permission/condition mentions.
BORDERLINE = set("01.3 01.7 01.8 01.9 02.6 02.7 02.8 03.1 03.5 05.6 06.5 06.6 08.5 08.7 08.8 08.9 09.5 10.4 11.6 12.3 12.5 12.6 13.4 14.4 15.6 16.4 16.5 16.6 17.4 18.4 19.6 20.5 22.5 22.7 22.8".split())
# Mixed rules keep BR IDs; only remove wire-level spelling from their human prose.
TIDY = {
    "01.3": "",  # moved, never rewritten
    "01.4": 'A username that is already taken is rejected with the message "has already been taken".',
    "01.5": "A request missing a required field is rejected with field-level error messages.",
    "02.3": "Valid credentials return the user's details including an authentication token.",
    "03.2": "Viewing the current user's details requires authentication and returns that user.",
    "03.3": "A request that needs authentication but has no token is rejected as unauthorized.",
    "05.3": "Updating my settings requires authentication, accepts email, username, password, image and bio, and returns the updated user.",
    "05.5": "At least one settings field must be provided when requesting a user update.",
    "06.2": "Viewing a member's profile works with or without authentication and returns username, bio, image and following.",
    "06.3": "An unknown username returns a not-found error.",
    "07.2": "Articles can be filtered by author and by the user who favourited them.",
    "08.10": "The create/edit editor shows a list of errors and a tag list with a remove icon; the article page includes an Edit Article control without a resolved visibility switch.",
    "10.1": "Deleting an article requires authentication and completes without returning content.",
    "11.2": "Reading an article needs no authentication and returns the full article including its body.",
    "11.5": "An unknown article slug returns a not-found error.",
    "13.2": "Your Feed requires authentication and returns only articles by followed authors, newest first.",
    "13.3": "Your Feed supports the same page size and number of skipped articles as the global list.",
    "14.3": "Viewing the list of tags needs no authentication and returns tag strings.",
    "15.2": "Article lists return 20 articles by default, starting at the first article; the requested page size must be at least 1 and the number skipped at least 0.",
    "15.5": "The page size is a whole number of at least 1, defaulting to 20; the number of items to skip is a whole number of at least 0.",
    "16.2": "Posting requires authentication; body is required; the created comment and its author are returned.",
    "17.1": "Reading an article's comments works with or without authentication and returns a list of comments.",
    "18.1": "Deleting a comment requires authentication and completes without returning content.",
    "19.4": "Following an unknown username returns a not-found error.",
    "22.1": "Validation failures are rejected with field-level error messages.",
    "22.2": "Missing authentication causes a request to be rejected as unauthorized.",
    "22.3": "A valid request the user is not permitted to make is rejected as forbidden.",
    "22.4": "A request for something that doesn't exist returns a not-found error.",
    "23.1": "When frontend and backend run on different hosts or ports, the service answers browser preflight requests and allows the required origin and request headers.",
}


def substitute(text, mapping):
    return re.sub(r"\bBR-\d+\.\d+\b", lambda m: mapping.get(m.group(), m.group()), text)


def events_append(rows):
    p = ROOT / "CHANGELOG.md"
    p.write_text(p.read_text() + "\n## Run 2b — classification and labelling — 2026-11-18\n\nSpecification pin: " + PIN + "\n\n"
                 + table(rows, ["ID", "Change", "Reason", "Citation"]) + "\n")


def update_counts(items, stories):
    p = ROOT / "README.md"
    text = p.read_text()
    for label, n in [("stories", len(stories)), ("rules", sum(i.startswith("BR-") for i in items)),
                     ("interface contracts", sum(i.startswith("IC-") for i in items)),
                     ("scenarios", sum(i.startswith("AC-") for i in items)),
                     ("open questions", sum(i.startswith("OQ-") for i in items))]:
        if re.search(r"^- " + label + r": \d+$", text, re.M):
            text = re.sub(r"^- " + label + r": \d+$", "- " + label + ": " + str(n), text, flags=re.M)
        else:
            text = text.replace("- scenarios:", "- " + label + ": " + str(n) + "\n- scenarios:", 1)
    text = re.sub(r"Current validation:.*", "Current validation: tools/run2b.py check and tools/check_citations.py. Do not rerun historical migrations or the original workbook converter over this refinement.", text)
    if "## Run 2b review pack" not in text:
        text += "\n## Run 2b review pack\n\nRules above count BR only; interface contracts count IC separately. D-06 classification covers every prior rule. IC wording and citations remain unchanged; IC is for C1/C2, not BA review. Mixed rules remain BR. Personas, priorities, epic grouping, story framing/so-that and example data are BA-ASSUMPTION, not stakeholder decisions.\n\nRead [REVIEW-GUIDE.md](REVIEW-GUIDE.md) and work in [review/BA-review.xlsx](review/BA-review.xlsx). Stories contains BR-only review notes; IC is excluded. Features are generated from the same 72 Markdown scenarios (Scenario Outlines count once, not once per example). All stories remain Draft; all 70 questions remain Open and unanswered. The original workbook summaries above are historical, not current totals.\n\nRegenerate features and workbook using tools/run2b.py pack; validate with tools/run2b.py check. Decision ranking and estimated AC dependencies are explicit in tools/run2b.py. Citation verification is lexical/structural, not semantic approval. See [traceability.md](traceability.md) for all 117 classifications and current BR/IC/AC coverage.\n"
    p.write_text(text)


def split():
    items, stories = markdown_records()
    before = copy.deepcopy(items)
    assert len([i for i in items if i.startswith("BR-")]) == 117 and not any(i.startswith("IC-") for i in items)
    prefix = (ROOT / "REVIEW-GUIDE.md").read_bytes().split(b"## 6.", 1)[0]
    GUIDE_HASH.write_text(hashlib.sha256(prefix).hexdigest() + "\n")
    mapping, classes, changes = {}, [], []
    counters = Counter()
    for old, row in before.items():
        if not old.startswith("BR-"):
            continue
        suffix = old[3:]
        if suffix in IC:
            story = suffix.split(".")[0]
            counters[story] += 1
            new = "IC-" + story + "." + str(counters[story])
            assert new not in items
            mapping[old] = new
            reason = IC[suffix]
            changes.append({"ID": old, "Change": "Moved unchanged to " + new + "; old BR ID retired", "Reason": reason, "Citation": row["Spec traces"]})
        else:
            new = old
            reason = "User-visible behaviour, permission, validation, limit or navigation outcome; retain mixed/uncertain items as BR (D-06)."
        classes.append({"Old ID": old, "New ID": new, "Class": "IC" if old in mapping else "BR", "Reason": reason})
    assert len(classes) == 117 and len(mapping) == len(IC)
    for old, new in mapping.items():
        row = items.pop(old)
        row["Rule ID"] = new
        items[new] = row
    for suffix, wording in TIDY.items():
        item = "BR-" + suffix
        if item not in items:
            continue
        row = items[item]
        changes.append({"ID": item, "Change": "Plain-language tidy; API contract remains in cited specification/API scenarios. Previous wording: " + row["Business rule"] + " New wording: " + wording,
                        "Reason": "Step 6 human-readable BR layer; no new policy or answer.", "Citation": row["Spec traces"]})
        row["Business rule"] = wording
    # Update active references only; changelog/handback and classification old-ID columns remain historical.
    for item, row in items.items():
        for key in row:
            if key != "Rule ID":
                row[key] = substitute(row[key], mapping)
    for path in sorted((ROOT / "epics").glob("EP-*.md")):
        text = path.read_text()
        chunks = re.split(r"(?=^## US-)", text, flags=re.M)
        result = [chunks[0].rstrip() + "\n\n**BA-ASSUMPTION:** Epic grouping and goal framing are BA judgement, not stakeholder-authored specification.\n\n"]
        for chunk in chunks[1:]:
            sid = re.match(r"## (US-\d+)", chunk).group(1)
            intro = chunk.split("### Business rules", 1)[0].rstrip()
            intro += "\n\n**BA-ASSUMPTION:** Persona, proposed priority, story framing and so-that value are BA judgement. Example names, addresses and other illustrative data in this story's scenarios are BA-authored, not mandated values. Questions remain unresolved; Draft is not approval."
            owned = [r for r in items.values() if r["Story ID"] == sid]
            blocks = [intro, "### Business rules", "\n".join("- **" + r["Rule ID"] + "** " + r["Business rule"] + " — " + r["Spec traces"] for r in owned if r.get("Rule ID", "").startswith("BR-")) or "No separate business rule; see the cited interface contract below.", "### Acceptance criteria"]
            for ac in (r for r in owned if "AC ID" in r):
                blocks += ["#### " + ac["AC ID"] + " " + ac["Scenario"] + " (" + ac["Level"] + ")", "Spec: " + ac["Spec traces"]]
                if ac.get("BA-ASSUMPTION"):
                    blocks.append("**BA-ASSUMPTION:** " + ac["BA-ASSUMPTION"])
                blocks.append("```gherkin\n" + ac["Gherkin"] + "\n```")
            blocks += ["### Open questions", "\n".join("- **" + q["OQ ID"] + "** " + q["Question"] + " → [open-questions.md](../open-questions.md)" for q in owned if "OQ ID" in q),
                       "### Interface contract (not for BA review)", "\n".join("- **" + r["Rule ID"] + "** " + r["Business rule"] + " — " + r["Spec traces"] for r in owned if r.get("Rule ID", "").startswith("IC-")) or "None."]
            result.append("\n\n".join(blocks) + "\n\n")
        path.write_text("".join(result).rstrip() + "\n")
    oq = ROOT / "open-questions.md"
    oq.write_text(substitute(oq.read_text(), mapping))
    trace = ROOT / "traceability.md"
    text = substitute(trace.read_text(), mapping)
    text = text.replace("Covered means designed requirement coverage", "Covered means designed BR/IC/AC requirement coverage")
    trace.write_text(text + "\n## Run 2b D-06 classification\n\nAll 117 pre-split rules classified. Old IDs in this table are historical; New IDs are current. IC is excluded from BA review but retained for C1/C2. Mixed and doubtful items remain BR.\n\n" + table(classes, ["Old ID", "New ID", "Class", "Reason"]) + "\n")
    for sid, story in stories.items():
        refs = "; ".join(dict.fromkeys(r["Spec traces"] for r in before.values() if r["Story ID"] == sid and "Spec traces" in r))
        changes.append({"ID": sid, "Change": "Labelled persona, priority, story/so-that framing and example data BA-ASSUMPTION; labelled epic grouping; metadata/status and Gherkin unchanged.", "Reason": "Step 6: distinguish BA judgement from source behaviour; update active references to moved IDs.", "Citation": refs})
    events_append(changes)
    current, current_stories = markdown_records()
    assert current_stories == stories
    for old, new in mapping.items():
        assert current[new]["Business rule"] == before[old]["Business rule"]
        assert current[new]["Spec traces"] == before[old]["Spec traces"]
    for i, row in before.items():
        if i.startswith("AC-"):
            assert current[i] == row, ("Scenario changed", i)
        if i.startswith("OQ-"):
            assert current[i] == {k: substitute(v, mapping) for k,v in row.items()}, i
    update_counts(current, stories)
    check_split()
    print("D-06 PASS:", len(current_stories), "stories;", 117-len(mapping), "BR;", len(mapping), "IC; 72 AC; 70 OQ")


def check_split():
    items, stories = markdown_records()
    trace = (ROOT / "traceability.md").read_text()
    classes = read_table(trace.split("## Run 2b D-06 classification", 1)[1])
    assert len(classes) == 117 and len({r["Old ID"] for r in classes}) == 117
    assert {r["New ID"] for r in classes} == {i for i in items if i.startswith(("BR-", "IC-"))}
    retired = {r["Old ID"] for r in classes if r["Class"] == "IC"}
    assert not retired & set(items)
    for p in list((ROOT / "epics").glob("EP-*.md")) + [ROOT / "open-questions.md"]:
        assert not retired & set(re.findall(r"\bBR-\d+\.\d+\b", p.read_text())), p
    assert not retired & set(re.findall(r"\bBR-\d+\.\d+\b", trace.split("## Run 2b D-06 classification",1)[0]))
    assert len(read_table(trace.split("## Run 2a",1)[0])) == 73
    coverage = read_table(trace.split("## Run 2a coverage",1)[1].split("## Run 2b",1)[0])
    assert len(coverage) == 210
    for row in coverage:
        if row["Disposition"] == "Covered":
            refs = re.findall(r"(?:BR|IC|AC|OQ)-\d+\.\d+", row["Coverage / reason"])
            assert refs and all(i in items for i in refs) and any(i.startswith(("BR-","IC-","AC-")) for i in refs), row
    assert all(r["Status"] == "Draft" for r in stories.values())
    assert all(not r["Answer / decision"] and r["Status"] == "Open" for r in items.values() if "OQ ID" in r)
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == SHA
    prefix = (ROOT / "REVIEW-GUIDE.md").read_bytes().split(b"## 6.",1)[0]
    assert hashlib.sha256(prefix).hexdigest() == GUIDE_HASH.read_text().strip(), "Guide sections 1–5 changed"
    assert "BR-08.6" in items
    return items, stories


def finish_split():
    """Resume validation only after a parser-only stop; never repeat migration writes."""
    from convert import expected_items, records
    from workbook import read_workbook
    items, stories = check_split()
    book = read_workbook()
    trace = (ROOT / 'traceability.md').read_text()
    classes = read_table(trace.split('## Run 2b D-06 classification',1)[1])
    mapping = {r['Old ID']:r['New ID'] for r in classes if r['Class'] == 'IC'}
    changelog = (ROOT / 'CHANGELOG.md').read_text()
    step4 = read_table(changelog.split('## Run 2a — step 4',1)[1].split('## Run 2a — step 5',1)[0])
    caveats = {r['ID']:r['Change'].split('added BA-ASSUMPTION: ',1)[1]
               for r in step4 if 'added BA-ASSUMPTION: ' in r['Change']}
    retired = {r['ID'] for r in step4 if r['Change'].startswith('Rule turned into ')}
    for source in records(book['Backlog']):
        for field in ('Story ID','Title','Persona','Type','Priority (proposed)','Status','Baseline req IDs','User story'):
            assert stories[source['Story ID']][field] == source[field], (source['Story ID'],field)
    for old,row in expected_items(book).items():
        if old in retired:
            continue
        expected = dict(row)
        current_id = mapping.get(old,old)
        if old in mapping:
            expected['Rule ID'] = current_id
        if old.startswith('BR-') and old[3:] in TIDY and old not in mapping:
            expected['Business rule'] = TIDY[old[3:]]
        if old in caveats:
            expected['BA-ASSUMPTION'] = caveats[old]
        if old == 'OQ-09.1':
            expected['Spec evidence'] += '; openapi.yml L596-608'
        expected = {k:substitute(v,mapping) for k,v in expected.items()}
        assert items[current_id] == expected, ('Original preservation',old)
    assert read_table(trace.split('## Run 2a',1)[0]) == records(book['Traceability'])
    additions = read_table(changelog.split('## Run 2a — step 5',1)[1].split('## Run 2b',1)[0])
    for change in additions:
        old = change['ID']
        row = items[mapping.get(old,old)]
        wording = change['Change'].removeprefix('New business rule: ')
        if old[3:] in TIDY and old not in mapping:
            wording = TIDY[old[3:]]
        assert row['Business rule'] == substitute(wording,mapping), old
        assert row['Spec traces'] == change['Citation'], old
    update_counts(items,stories)
    print('Step 6 preservation PASS: workbook stories/original scenarios + authorised caveats; all 36 Run 2a additions; 73 original mappings')
    print('D-06 PASS:', 117-len(IC), 'BR /',len(IC),'IC / 72 AC / 70 Open unanswered questions')


# Explicit design-impact estimates (current AC IDs, not generated test cases).
# Empty means missing behaviour has no current AC; it is not permission to invent one.
IMPACT = {
 "01.1":"01.1 01.2 02.1 02.2", "01.2":"01.1 01.2 01.3 05.2", "01.3":"01.1 01.2 06.1 06.2",
 "01.4":"01.1", "01.5":"01.1 01.2 02.1 02.2 05.2", "02.1":"02.3 22.1", "02.2":"02.1 02.2 02.3",
 "02.3":"03.1 03.2 03.3", "03.1":"03.1 03.2 21.2", "03.2":"03.2 03.3 22.1",
 "03.3":"03.1", "03.4":"06.2 12.2 17.2", "04.1":"04.1", "04.2":"04.1 03.2",
 "05.1":"05.1 05.2", "05.2":"05.2", "05.3":"05.2 06.1", "05.4":"05.1 05.2", "05.5":"05.2",
 "05.6":"05.2 03.1 03.2", "06.1":"06.1 19.1", "07.1":"07.1 07.2", "07.2":"07.3 07.4 14.3",
 "07.3":"07.3 07.4", "07.4":"07.3 07.4 14.3", "08.1":"08.2 08.3", "08.2":"08.1 08.2 14.1 14.3",
 "08.3":"08.1 08.2 09.2", "08.4":"08.1", "09.1":"08.1 09.1 09.2", "09.2":"09.1 09.3",
 "09.3":"09.1 09.2 11.2", "09.4":"09.2 09.3", "10.1":"10.1", "10.2":"10.4 17.2 07.4",
 "10.3":"10.1", "10.4":"10.2 10.3 10.4", "11.1":"11.2", "11.2":"08.1 09.1 11.1",
 "12.1":"12.1 12.2", "13.1":"12.1 13.1", "13.2":"13.1 13.3", "13.3":"13.3",
 "14.1":"14.1 14.2", "14.2":"14.1 14.3", "15.1":"15.1", "15.2":"15.2 15.3",
 "15.3":"15.2", "15.4":"12.2 13.3 15.3", "16.1":"16.1 16.4", "16.2":"16.1 16.2 16.3",
 "17.1":"17.1 17.2", "17.2":"17.1 17.2", "18.1":"18.1 18.2 18.3", "18.2":"18.1 18.2 18.3",
 "19.1":"19.1", "19.2":"19.1 19.2", "19.3":"19.1 19.4", "19.4":"19.2 19.3",
 "19.5":"19.3", "20.1":"20.1 20.2", "20.2":"20.1 20.4", "20.3":"20.1 20.2 20.3",
 "20.4":"20.3", "21.1":"08.1 09.1 05.1", "21.2":"", "21.3":"02.1 03.1 12.1 13.1 17.1",
 "22.1":"01.4 02.4 08.4 16.3 22.2", "22.2":"01.2 05.2 08.2 09.2 11.2 12.2 16.2 17.2",
 "23.1":"23.1",
}
CONFLICT = set("02.1 05.3 08.1 09.1 19.1 22.1".split())
SECURITY = set("01.1 01.2 01.3 01.5 02.1 02.2 02.3 03.1 03.2 03.3 03.4 04.2 05.2 05.6 09.2 09.4 10.4 11.2 18.1 18.2 21.1 23.1".split())
FIELD_MEANING = set("11.1 15.3 19.4 20.3".split())


def decisions(items):
    questions = [r for r in items.values() if "OQ ID" in r]
    assert set(IMPACT) == {r["OQ ID"][3:] for r in questions}
    def key(q):
        suffix = q["OQ ID"][3:]
        tier = 2 if suffix in FIELD_MEANING else (0 if suffix in CONFLICT | SECURITY else 1)
        return tier, -len(IMPACT[suffix].split()), tuple(map(int,suffix.split('.')))
    first = ['OQ-09.4', 'OQ-10.4', 'OQ-18.2', 'OQ-02.1', 'OQ-11.2', 'OQ-01.1']
    ordered = sorted(questions, key=key)
    ordered = [items[i] for i in first] + [q for q in ordered if q['OQ ID'] not in first]
    result = []
    for rank, q in enumerate(ordered,1):
        suffix = q["OQ ID"][3:]
        acs = ["AC-"+x for x in IMPACT[suffix].split()]
        assert all(i in items for i in acs)
        tier = "Field-meaning question last" if suffix in FIELD_MEANING else ("Spec conflict/security first" if suffix in CONFLICT | SECURITY else "Other missing behaviour")
        kind = "Conflict" if suffix in CONFLICT else "Missing rule"
        reason = tier + "; " + str(len(acs)) + " potentially affected current AC" + (" (" + ", ".join(acs) + ")" if acs else "; new acceptance coverage needed") + "."
        result.append({"Rank":str(rank), "OQ ID":q["OQ ID"], "Story":q["Story ID"], "Proposed kind":kind, "Rank reason":reason})
    return result


def generate_features(items):
    folder = ROOT / "features"
    folder.mkdir(exist_ok=True)
    for path in sorted((ROOT / "epics").glob("EP-*.md")):
        text = path.read_text()
        sids = re.findall(r"^## (US-\d+)",text,re.M)
        title = text.splitlines()[0][2:]
        lines = ["# Generated by tools/run2b.py from canonical Markdown. Do not edit.", "# Specification pin: " + PIN,
                 "# BA-ASSUMPTION: persona/value framing, priorities and example data are BA judgement.", "Feature: " + title, ""]
        for ac in (r for r in items.values() if "AC ID" in r and r["Story ID"] in sids):
            lines += ["  # " + ac["Story ID"] + " — " + ac["AC ID"] + "; Spec: " + ac["Spec traces"]]
            if ac.get("BA-ASSUMPTION"):
                lines.append("  # BA-ASSUMPTION: " + ac["BA-ASSUMPTION"])
            lines.append("  @" + ac["AC ID"].replace("-","_").replace(".","_") + " @" + ac["Level"])
            lines.extend("  " + line if line else "" for line in ac["Gherkin"].splitlines())
            lines.append("")
        (folder / (path.stem + ".feature")).write_text("\n".join(lines) + "\n")


def citation_urls(evidence):
    from check_citations import ALLOWED, citations
    return [(label, "https://github.com/realworld-apps/realworld/blob/"+PIN+"/"+ALLOWED[name]+"#L"+str(first)+"-L"+str(last))
            for label,name,first,last in citations(plain_citations(evidence))]


def workbook(items, stories, ranked):
    from openpyxl import Workbook
    from openpyxl.comments import Comment
    from openpyxl.styles import Alignment, Font, PatternFill, Protection
    from openpyxl.worksheet.datavalidation import DataValidation
    from openpyxl.utils import get_column_letter
    wb = Workbook()
    wb.remove(wb.active)
    s = wb.create_sheet("Stories")
    s.append(["Story ID","Epic","Title","File","Review result","Comment","Priority"])
    epic_paths = {}
    for p in sorted((ROOT / "epics").glob("EP-*.md")):
        for sid in re.findall(r"^## (US-\d+)",p.read_text(),re.M):
            epic_paths[sid] = p
    for sid, story in stories.items():
        p = epic_paths[sid]
        s.append([sid, p.read_text().splitlines()[0][2:],story["Title"],"epics/"+p.name,"","",story["Priority (proposed)"]])
        s.cell(s.max_row,4).hyperlink = "../epics/"+p.name
        # Exact prescribed columns: BR-only review content lives in the Title comment.
        brs = [i+": "+r["Business rule"] for i,r in items.items() if i.startswith("BR-") and r["Story ID"] == sid]
        s.cell(s.max_row,3).comment = Comment("BR-only review notes (IC excluded).\nBA-ASSUMPTION: persona, so-that/value, priorities and examples.\n"+"\n".join(brs),"GitHub Copilot")
    d = wb.create_sheet("Decisions")
    headers = ["Rank","OQ ID","Story ID","Question","Why it matters","Spec evidence","Kind","Decision","Rationale","Owner","Due date","Observed in app","App matches?","Status"]
    # User-approved extension: one independently clickable citation per locked cell,
    # extra evidence columns at the right; exactly one data row per open question.
    max_cites = max(len(citation_urls(items[r["OQ ID"]]["Spec evidence"])) for r in ranked)
    headers += ["Spec evidence " + str(n) for n in range(2,max_cites+1)]
    d.append(headers)
    for rank in ranked:
        q = items[rank["OQ ID"]]
        links = citation_urls(q["Spec evidence"])
        d.append([int(rank["Rank"]),q["OQ ID"],q["Story ID"],q["Question"],q["Why it matters"],links[0][0],rank["Proposed kind"],"","",q["Owner"],"","","","Open"] + [x[0] for x in links[1:]])
        for index,(label,url) in enumerate(links):
            cell = d.cell(d.max_row,6 if index == 0 else 14+index)
            cell.hyperlink = url
            cell.style = "Hyperlink"
        d.cell(d.max_row,1).comment = Comment(rank["Rank reason"],"GitHub Copilot")
    sign = wb.create_sheet("Sign-off")
    sign.append(["Reviewer name","Date","Comment"])
    sign.append(["","",""])
    yellow = PatternFill("solid",fgColor="FFF2CC")
    blue = PatternFill("solid",fgColor="17365D")
    for ws,editable in [(s,{5,6,7}),(d,{7,8,9,10,11,12,13,14}),(sign,{1,2,3})]:
        ws.freeze_panes = "A2"
        ws.protection.sheet = True
        ws.protection.selectLockedCells = True
        ws.protection.selectUnlockedCells = False
        for cell in ws[1]:
            cell.fill = blue
            cell.font = Font(color="FFFFFF",bold=True)
            cell.alignment = Alignment(wrap_text=True,vertical="top")
        ws.row_dimensions[1].height = 32
        for row in ws.iter_rows(min_row=2):
            for cell in row:
                cell.alignment = Alignment(wrap_text=True,vertical="top")
                cell.protection = Protection(locked=cell.column not in editable)
                if cell.column in editable:
                    cell.fill = yellow
            ws.row_dimensions[row[0].row].height = 90 if ws == d else 45
        for col in range(1,ws.max_column+1):
            ws.column_dimensions[get_column_letter(col)].width = 22
        if ws != sign:
            ws.auto_filter.ref = ws.dimensions
    s.column_dimensions['C'].width = 38
    s.column_dimensions['D'].width = 48
    d.column_dimensions['D'].width = 64
    d.column_dimensions['E'].width = 60
    d.column_dimensions['F'].width = 42
    def dropdown(ws,col,options):
        dv = DataValidation(type="list",formula1='"'+','.join(options)+'"',allow_blank=True)
        dv.errorTitle = "Choose a listed value"
        dv.error = "Select a value from the dropdown."
        dv.showErrorMessage = True
        ws.add_data_validation(dv)
        dv.add(col+"2:"+col+str(ws.max_row))
    dropdown(s,'E',["Accepted","Change requested","Rejected"])
    dropdown(s,'G',["Must","Should","Could"])
    dropdown(d,'G',["Conflict","Missing rule","Not needed","Can't decide yet"])
    dropdown(d,'M',["Yes","No","Not checkable"])
    dropdown(d,'N',["Open","Decided","Not needed","Deferred"])
    (ROOT / "review").mkdir(exist_ok=True)
    wb.save(ROOT / "review/BA-review.xlsx")


def rank_only():
    """Reorder only: preserve guide prose and all workbook content except ranks."""
    from openpyxl import load_workbook
    items, _ = markdown_records()
    ranked = decisions(items)
    path = ROOT / 'REVIEW-GUIDE.md'
    text = path.read_text()
    start = text.index('| Rank | OQ ID | Story | Proposed kind | Rank reason |')
    previous = read_table(text[start:])
    assert {r['OQ ID']: {k:v for k,v in r.items() if k != 'Rank'} for r in previous} == {
        r['OQ ID']: {k:v for k,v in r.items() if k != 'Rank'} for r in ranked}
    first = [r['OQ ID'] for r in ranked[:6]]
    assert [r['OQ ID'] for r in ranked[6:]] == [r['OQ ID'] for r in previous if r['OQ ID'] not in first]
    file = ROOT / 'review/BA-review.xlsx'
    wb = load_workbook(file)
    ws = wb['Decisions']
    def snapshot(sheet):
        return [[(c.value, copy.copy(c._style), c.hyperlink.target if c.hyperlink else None,
                  c.comment.text if c.comment else None) for c in row] for row in sheet]
    unchanged = {name: snapshot(wb[name]) for name in ('Stories', 'Sign-off')}
    old = {row[1].value: [copy.copy(c) for c in row] for row in list(ws.rows)[1:]}
    for row_number, entry in enumerate(ranked, 2):
        for source in old[entry['OQ ID']]:
            target = ws.cell(row_number, source.column)
            target.value = int(entry['Rank']) if source.column == 1 else source.value
            target._style = copy.copy(source._style)
            target.comment = copy.copy(source.comment)
            target._hyperlink = None
            if source.hyperlink:
                target.hyperlink = copy.copy(source.hyperlink)
                target.hyperlink.ref = target.coordinate
    path.write_text(text[:start] + table(ranked, ['Rank','OQ ID','Story','Proposed kind','Rank reason']) + '\n')
    wb.save(file)
    saved = load_workbook(file)
    assert all(snapshot(saved[name]) == data for name, data in unchanged.items())
    for row in list(saved['Decisions'].rows)[1:]:
        for cell, source in zip(row, old[row[1].value]):
            if cell.column != 1:
                assert cell.value == source.value
            assert cell._style == source._style
            assert (cell.comment.text if cell.comment else None) == (source.comment.text if source.comment else None)
            assert (cell.hyperlink.target if cell.hyperlink else None) == (source.hyperlink.target if source.hyperlink else None)
    assert path.read_text()[:start] == text[:start]
    check()
    print('PASS: ranking-only correction; other row content, kinds, comments, links and other sheets unchanged')


def pack():
    items,stories = check_split()
    ranked = decisions(items)
    p = ROOT / "REVIEW-GUIDE.md"
    prefix = p.read_bytes().split(b"## 6.",1)[0]
    body = "## 6. Decision list (most blocking first)\n\nAgent-proposed kinds and ranking only; no decisions or approvals. Spec conflicts and security first, then descending estimated number of affected current ACs, with response-field meaning questions last. Ties use stable numeric OQ ID. Impact sets are conservative design estimates, not executed coverage; a missing rule may require new ACs.\n\n"
    p.write_bytes(prefix + (body + table(ranked,["Rank","OQ ID","Story","Proposed kind","Rank reason"]) + "\n").encode())
    generate_features(items)
    workbook(items,stories,ranked)
    update_counts(items,stories)
    check()


def check():
    from openpyxl import load_workbook
    items,stories = check_split()
    ranked = decisions(items)
    guide = (ROOT / "REVIEW-GUIDE.md").read_text().split("## 6.",1)[1]
    assert read_table(guide) == ranked
    feature_files = sorted((ROOT / "features").glob("EP-*.feature"))
    assert len(feature_files) == 7
    ids, count = [], 0
    for p in feature_files:
        text = p.read_text()
        count += len(re.findall(r"^\s*Scenario(?: Outline)?:",text,re.M))
        for tag,body in re.findall(r"^  @(AC_\d+_\d+) @\w+\n(.*?)(?=^  # US-|\Z)",text,re.M|re.S):
            item = tag.replace("AC_","AC-",1).replace("_",".")
            ids.append(item)
            rebuilt = "\n".join(line[2:] if line.startswith("  ") else line for line in body.rstrip().splitlines())
            assert rebuilt == items[item]["Gherkin"],item
    assert count == len(ids) == sum(i.startswith("AC-") for i in items) == 72
    assert len(set(ids)) == 72
    wb = load_workbook(ROOT / "review/BA-review.xlsx")
    assert wb.sheetnames == ["Stories","Decisions","Sign-off"]
    assert wb['Stories'].max_row-1 == len(stories) == 23
    assert wb['Decisions'].max_row-1 == len(ranked) == 70
    assert [r[1].value for r in list(wb['Decisions'].rows)[1:]] == [r['OQ ID'] for r in ranked]
    links = []
    for row in list(wb['Decisions'].rows)[1:]:
        q = items[row[1].value]
        expected = citation_urls(q['Spec evidence'])
        actual = [(c.value,c.hyperlink.target) for c in row if c.hyperlink]
        assert actual == expected,q['OQ ID']
        links.extend(url for _,url in actual)
        assert row[7].value is None and row[8].value is None and row[13].value == 'Open'
    for ws,editable in [(wb['Stories'],{5,6,7}),(wb['Decisions'],{7,8,9,10,11,12,13,14}),(wb['Sign-off'],{1,2,3})]:
        assert ws.freeze_panes == 'A2' and ws.protection.sheet and not ws.protection.password
        for row in ws.iter_rows(min_row=2):
            for cell in row:
                assert cell.protection.locked == (cell.column not in editable)
                if cell.column in editable:
                    assert cell.fill.fgColor.rgb == '00FFF2CC'
    assert len(wb['Stories'].data_validations.dataValidation) == 2
    assert len(wb['Decisions'].data_validations.dataValidation) == 3
    for row in list(wb['Stories'].rows)[1:]:
        assert row[4].value is None and row[5].value is None
        assert 'IC-' not in row[2].comment.text
        sid = row[0].value
        for i,r in items.items():
            if i.startswith('BR-') and r['Story ID'] == sid:
                assert i+': '+r['Business rule'] in row[2].comment.text
    readme = (ROOT/'README.md').read_text()
    for label,n in [('stories',23),('rules',117-len(IC)),('interface contracts',len(IC)),('scenarios',72),('open questions',70)]:
        assert '- '+label+': '+str(n) in readme
    print('PASS: 117 classifications; BR/IC references; unchanged guide §1–§5; Draft/Open/blank; source SHA')
    print('PASS: 7 feature files / 72 scenarios; exact Markdown Gherkin equality and unique AC IDs')
    print('PASS: workbook 23 stories / 70 decisions; all',len(links),'citation hyperlinks; locks, yellow edits, dropdowns, BR-only notes')
    print('Random hyperlink sample (seed 20261118):')
    for url in random.Random(20261118).sample(links,10):
        print(url)


if __name__ == '__main__':
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == SHA
    if sys.argv[1:] == ['split']:
        split()
    elif sys.argv[1:] == ['finish-split']:
        finish_split()
    elif sys.argv[1:] == ['pack']:
        pack()
    elif sys.argv[1:] == ['check']:
        check()
    elif sys.argv[1:] == ['rank-only']:
        rank_only()
    else:
        raise SystemExit('Usage: run2b.py split|finish-split|pack|check|rank-only')