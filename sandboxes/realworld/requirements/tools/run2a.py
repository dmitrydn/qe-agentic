"""Apply the reviewed-in-run gap dispositions and coverage additions; no oracle inputs.

Run with step4, then step5. This is a one-shot migration, not a workbook reset.
Only the two explicitly permitted research Markdown files are input.
"""

import hashlib
import re
import sys

from markdown_io import markdown_records, table
from workbook import ROOT, SOURCE

REPO = ROOT.parents[2]
PIN = "ebbcdeb8d55b42a3a613c787560498b8ef10003f"
EVENTS = []


def fmt(value):
    return re.sub(r"([\w-]+\.(?:md|yml))(?= L\d)", r"`\1`", value)


def event(item, change, reason, citation):
    EVENTS.append({"ID": item, "Change": change, "Reason": reason, "Citation": citation})


def next_id(items, prefix, story):
    # Never recycle a retired source ID.
    nums = [int(i.split(".")[1]) for i in items if i.startswith(prefix + "-" + story + ".")]
    nums += [int(i) for i in re.findall(prefix + "-" + story + r"\.(\d+)", (ROOT / "CHANGELOG.md").read_text())]
    return prefix + "-" + story + "." + str(max(nums, default=0) + 1)


def question(items, story, text, why, citation):
    item = next_id(items, "OQ", story)
    items[item] = {"OQ ID": item, "Story ID": "US-" + story, "Question": text, "Why it matters": why,
                   "Spec evidence": citation, "Owner": "Product Owner", "Answer / decision": "", "Status": "Open"}
    event(item, "New open question (answer blank, Open)", why, citation)
    return item


def retire(items, item, target, reason):
    old = items.pop(item)
    event(item, "Rule turned into " + target + "; removed assertion: " + old["Business rule"], reason, old["Spec traces"])


def assumption(items, item, reason):
    items[item]["BA-ASSUMPTION"] = reason
    event(item, "Retained scenario wording; added BA-ASSUMPTION: " + reason,
          "Do not assert an unresolved condition as specification-backed while its rule is reconciled.", items[item]["Spec traces"])


def rule(items, story, text, citation, reason):
    item = next_id(items, "BR", story)
    items[item] = {"Rule ID": item, "Story ID": "US-" + story, "Business rule": text, "Spec traces": citation}
    event(item, "New business rule: " + text, reason, citation)
    return item


def write_items(items):
    for path in sorted((ROOT / "epics").glob("EP-*.md")):
        text = path.read_text(encoding="utf-8")
        chunks = re.split(r"(?=^## US-)", text, flags=re.M)
        result = [chunks[0]]
        for chunk in chunks[1:]:
            sid = re.match(r"## (US-\d+)", chunk).group(1)
            intro = chunk.split("### Business rules", 1)[0].rstrip()
            owned = [r for r in items.values() if r["Story ID"] == sid]
            blocks = [intro, "### Business rules", "\n".join(
                "- **" + r["Rule ID"] + "** " + r["Business rule"] + " — " + fmt(r["Spec traces"])
                for r in owned if "Rule ID" in r), "### Acceptance criteria"]
            for ac in (r for r in owned if "AC ID" in r):
                blocks += ["#### " + ac["AC ID"] + " " + ac["Scenario"] + " (" + ac["Level"] + ")", "Spec: " + fmt(ac["Spec traces"])]
                if ac.get("BA-ASSUMPTION"):
                    blocks.append("**BA-ASSUMPTION:** " + ac["BA-ASSUMPTION"])
                blocks.append("```gherkin\n" + ac["Gherkin"] + "\n```")
            blocks += ["### Open questions", "\n".join("- **" + q["OQ ID"] + "** " + q["Question"] + " → [open-questions.md](../open-questions.md)"
                        for q in owned if "OQ ID" in q)]
            result.append("\n\n".join(blocks) + "\n\n")
        path.write_text("".join(result).rstrip() + "\n", encoding="utf-8")
    questions = [r for r in items.values() if "OQ ID" in r]
    headers = ["OQ ID", "Story ID", "Question", "Why it matters", "Spec evidence", "Owner", "Answer / decision", "Status"]
    (ROOT / "open-questions.md").write_text("# Open questions\n\n" + table(questions, headers) + "\n", encoding="utf-8")


def save_events(phase):
    path = ROOT / "CHANGELOG.md"
    path.write_text(path.read_text() + "\n\n## Run 2a — " + phase + " — 2026-11-18\n\nSpecification pin: " + PIN + "\n\n"
                    + table(EVENTS, ["ID", "Change", "Reason", "Citation"]) + "\n", encoding="utf-8")


def step4():
    items, stories = markdown_records()
    assert len(stories) == 23 and sum(i.startswith("BR-") for i in items) == 89
    q = {}
    q["reload"] = question(items, "03", "Must the user remain signed in across a reload, and under what token-validity conditions?",
                           "BR-03.4 inferred persistence from localStorage; routing states storage, not reload/session lifetime.", "routing.md L10")
    q["edit"] = question(items, "09", "Which users may update an article through the API: only its author, or others with permissions?",
                         "X-01: declared 403 and UI controls do not state the API ownership predicate.", "openapi.yml L260-288; error-handling.md L23; templates.md L482")
    q["delete"] = question(items, "10", "Which users may delete an article through the API, and when exactly is 403 returned?",
                           "X-01: author-only button visibility does not specify API permissions.", "routing.md L15; openapi.yml L289-315; error-handling.md L23")
    q["comment"] = question(items, "18", "Which users may delete a comment through the API, and does being a non-author always cause 403?",
                            "X-01: routing specifies UI visibility; OpenAPI declares 403 without the ownership predicate.", "routing.md L18; openapi.yml L366-398; error-handling.md L23")
    q["following"] = question(items, "19", "Precisely whose follow relationship does profile.following represent, including unauthenticated responses?",
                              "P-003 is an inferred meaning of a field; the schema only states a boolean.", "api-response-format.md L25-33; openapi.yml L521-540")
    q["count"] = question(items, "15", "Is articlesCount the filtered total before pagination, the returned page size, or something else?",
                          "BR-15.4 inferred total matching semantics from an example and integer schema.", "api-response-format.md L102; openapi.yml L697-745")
    q["favorite"] = question(items, "20", "Whose favourite state does favorited represent, and how exactly must favoritesCount change after favorite or unfavorite?",
                             "F-011 and BR-20.2 infer field semantics and count transitions; the source gives fields and operation names only.", "api-response-format.md L48-49; endpoints.md L223-237")
    for item, target, why in [
        ("BR-02.4", "OQ-02.1", "X-02: no explicit mapping of wrong credentials to the declared 401 versus validation 422; do not decide the existing question."),
        ("BR-03.4", q["reload"], "Storage is specified, persistence outcome is inferred."),
        ("BR-09.4", q["edit"], "API author-only condition is absent; the unrelated declared status codes are retained separately in step 5."),
        ("BR-10.3", q["delete"], "Non-author implies forbidden is not explicitly stated; declared status codes remain usable."),
        ("BR-18.3", q["comment"], "Non-author implies forbidden is not explicitly stated; resource-key wording alone does not establish permission."),
        ("BR-19.2", q["following"], "Boolean field presence does not define viewer-relative meaning."),
        ("BR-15.4", q["count"], "An integer example does not define filtered-total semantics."),
        ("BR-20.2", q["favorite"], "Field names/examples do not explicitly define viewer state or count transitions."),
    ]:
        retire(items, item, target, why)
    for item, reason in {
        "AC-02.3": "Wrong-password classification remains unresolved in OQ-02.1; 401 is declared but its bad-credential trigger is not explicit.",
        "AC-09.3": "API author-only edit permission awaits " + q["edit"] + "; the declared 403 alone does not establish this condition.",
        "AC-10.3": "API author-only delete permission awaits " + q["delete"] + "; UI visibility does not establish API enforcement.",
        "AC-18.3": "API author-only comment deletion awaits " + q["comment"] + "; 403 is declared without this predicate.",
        "AC-19.2": "The following=true interpretation awaits " + q["following"] + "; the schema states only boolean type.",
        "AC-19.3": "The following=false interpretation awaits " + q["following"] + "; the schema states only boolean type.",
        "AC-20.1": "Favourite count/state transitions await " + q["favorite"] + "; the example is not a transition rule.",
        "AC-20.2": "The favorited=true and favoritesCount transition interpretation awaits " + q["favorite"] + ".",
        "AC-20.3": "The favorited=false transition interpretation awaits " + q["favorite"] + ".",
        "AC-15.2": "The assertion on total articlesCount awaits " + q["count"] + "; only its presence/type is explicit.",
    }.items():
        assumption(items, item, reason)
    q["optional"] = question(items, "03", "What happens to malformed, invalid or expired tokens on optional-auth profile, list and comment endpoints that also declare 401?",
                             "X-11: neither optional authentication nor a 401 declaration defines invalid-token handling.", "openapi.yml L93-117; openapi.yml L183-213; openapi.yml L315-337")
    q["trim"] = question(items, "01", "Are leading/trailing whitespace and case normalised for usernames, email addresses and other submitted text?",
                         "X-06: validation and normalisation boundaries are not specified.", "openapi.yml L456-480")
    q["filters"] = question(items, "07", "Are author and favorited filters case-sensitive, and what happens for an unknown tag?",
                            "X-09: existing OQ-07.2/07.3 and OQ-14.2 do not cover every filter-silence dimension.", "endpoints.md L102-126")
    q["paging"] = question(items, "15", "What happens beyond the last offset, and which timestamp and tie-break define most-recent article order?",
                           "X-10: default/minimum paging values do not settle beyond-total or tied ordering.", "endpoints.md L118-134")
    q["repeat"] = question(items, "20", "What happens when an article that is not favourited is unfavourited again?",
                           "X-12: repeat favourite is already OQ-20.1; reverse-operation idempotency is not stated.", "endpoints.md L231-237")
    q["unfollow"] = question(items, "19", "What happens when an unfollow is repeated or the target was never followed?",
                             "X-12: repeat-follow question does not define reverse-operation idempotency.", "endpoints.md L90-96")
    q["settings"] = question(items, "05", "What is the response for an empty user update, and what happens to existing sessions after a password change?",
                             "X-13/X-21: at least one field is required, but the exact empty-update classification and password/session effect are unstated.", "openapi.yml L76-94; openapi.yml L846-857; endpoints.md L74")
    q["ui"] = question(items, "21", "What should users see during loading, after sign-in, and for non-422 errors or token expiry; how are dates displayed?",
                       "X-17: existing redirect/route questions do not cover loading, sign-in success destination, general error display or date presentation.", "routing.md L5-21; templates.md L145-155; templates.md L231-247")
    q["time"] = question(items, "22", "Must date-time values use a particular precision or timezone representation beyond the declared date-time format?",
                         "X-22: millisecond-Z examples do not mandate exact serialisation.", "openapi.yml L567-572; api-response-format.md L46-47")
    old_evidence = items["OQ-09.1"]["Spec evidence"]
    items["OQ-09.1"]["Spec evidence"] += "; openapi.yml L596-608"
    event("OQ-09.1", "Added OpenAPI UpdateArticle evidence; question remains unanswered", "A-043: prose omits tagList while the schema includes it; record both without choosing a rule.", old_evidence + "; openapi.yml L596-608")
    rows = []
    def gap(item, disposition, refs, evidence, finding):
        rows.append({"Gap": item, "Disposition": disposition, "Links": refs, "Evidence at pin": evidence, "Finding": finding})
    gap("X-01", "Existing + new questions; rules converted", "OQ-18.1; " + "; ".join(q[k] for k in ("edit", "delete", "comment")), "error-handling.md L23; openapi.yml L275-276; openapi.yml L302-303; openapi.yml L385-386; routing.md L15-18", "403 is explicit; API author-only predicate is not. Retired BR-09.4/10.3/18.3; UI ownership stays.")
    gap("X-02", "Already an open question; rule converted", "OQ-02.1", "error-handling.md L7; openapi.yml L32-37", "401 and 422 are declared; bad-credential classification is not selected. BR-02.4 retired.")
    gap("X-03", "Resolved by specification", "BR-01.3; BR-08.5; BR-10.1; BR-16.2; BR-18.1", "openapi.yml L32-37; openapi.yml L48-53; openapi.yml L223-230; openapi.yml L298-307; openapi.yml L349-356; openapi.yml L381-390", "Prose omission is not contradiction; OpenAPI supplies success codes.")
    gap("X-04", "Already open; partial resolution", "OQ-01.2; OQ-05.1; OQ-08.1; BR-01.4", "openapi.yml L48-53; openapi.yml L223-230; openapi.yml L781-790", "409 and username-taken example explicit; email uniqueness and article conflict conditions remain unanswered.")
    gap("X-05", "Already an open question", "OQ-22.1", "error-handling.md L9-15; openapi.yml L811-820", "empty versus blank wording differs; do not select.")
    gap("X-06", "Existing + new question", "OQ-01.1; OQ-01.2; OQ-01.3; OQ-08.2; OQ-08.3; OQ-16.2; " + q["trim"], "openapi.yml L456-480; openapi.yml L579-608; endpoints.md L161-163", "Length, format and normalisation rules absent; required fields and paging minimums are not absent.")
    gap("X-07", "Resolved by specification; related question retained", "BR-08.6; AC-08.3; OQ-08.1; OQ-09.3", "endpoints.md L183-185", "Unique slugs and distinct duplicate-title slugs explicit. Derivation/format is implementation discretion, not a missing business rule; recount rejection of R-031 is stale.")
    gap("X-08", "Already open", "OQ-08.2; OQ-14.1; OQ-14.2", "endpoints.md L163; endpoints.md L243; templates.md L203", "Tag uniqueness/case/count and popularity/order remain unstated.")
    gap("X-09", "Existing + new question", "OQ-07.2; OQ-07.3; OQ-14.2; " + q["filters"], "endpoints.md L102-126", "Filter combination, case and unknown-value semantics not derived from examples.")
    gap("X-10", "Existing + new questions", "OQ-15.2; OQ-17.1; OQ-17.2; " + q["paging"], "endpoints.md L118-134; endpoints.md L215; openapi.yml L895-911", "Defaults/minima are explicit; maximum, beyond-total, timestamp/tie-break and comment ordering are not.")
    gap("X-11", "Existing + new question", "OQ-02.3; OQ-03.1; OQ-03.2; " + q["optional"], "openapi.yml L93-117; openapi.yml L183-213; openapi.yml L315-337; routing.md L10", "Optional auth plus declared 401 is not proof every anonymous call fails; invalid-token handling/claims remain unresolved.")
    gap("X-12", "Existing + new questions", "OQ-19.2; OQ-20.1; " + q["repeat"] + "; " + q["unfollow"], "endpoints.md L82-96; endpoints.md L223-237", "Self/repeat and reverse-operation cases remain unspecified.")
    gap("X-13", "Existing + new question; partial resolution", "OQ-05.1; OQ-05.4; " + q["settings"], "openapi.yml L76-94; openapi.yml L846-857", "At-least-one field requirement explicit; exact error and update uniqueness remain open.")
    gap("X-14", "Already open; user deletion outside scope", "OQ-10.2; BR-05.4", "endpoints.md L187-191; features.md L8-10", "Article cascade not specified. User deletion not required; do not invent cascade.")
    gap("X-15", "Resolved by specification", "BR-10.1; BR-18.1", "openapi.yml L298-299; openapi.yml L381-382; openapi.yml L768-770", "204 refers to No content with empty content map; response body is not an unresolved choice.")
    gap("X-16", "Already open; conversion location resolved", "OQ-11.2; BR-11.3", "routing.md L16; api-response-format.md L44", "Client-side rendering explicit; sanitisation/allowed HTML not stated.")
    gap("X-17", "Existing + new question", "OQ-01.4; OQ-04.1; OQ-08.4; OQ-10.3; OQ-16.1; OQ-21.1; OQ-21.2; " + q["ui"], "routing.md L5-21; templates.md L231-247; templates.md L470; templates.md L509", "Route names and controls do not define redirects, loading, not-found UI or general error/date presentation.")
    gap("X-18", "Resolved by specification", "BR-11.3", "routing.md L16", "Render markdown from server client side explicitly locates conversion in browser; raw body example is compatible.")
    gap("X-19", "Already open", "OQ-09.2; OQ-19.3; OQ-20.2", "templates.md L482; templates.md L495-509", "TODO remains; do not invent switch conditions for controls.")
    gap("X-20", "Resolved at current pin", "FE-045 coverage disposition", "templates.md L7-26; styles.md L5-14", "Head now serves shared styles.css; fonts/icons separately loaded as styles guidance requires. Old CDN-theme conflict is stale.")
    gap("X-21", "Existing + new question; accepted fields resolved", "BR-05.3; OQ-05.2; OQ-05.4; " + q["settings"], "endpoints.md L64-74; openapi.yml L504-520", "Example subset does not override explicit username/password accepted fields; reauthentication/session effects still unspecified.")
    gap("X-22", "New question", q["time"], "openapi.yml L567-572; api-response-format.md L46-47", "Date-time type explicit, mandatory precision/timezone spelling not stated.")
    for item, refs, evidence, finding in [
        ("G-01", "X-01", "error-handling.md L23; openapi.yml L275-276; routing.md L15-18", "Overstated: 403 exists, its ownership predicate remains a gap; see converted rules/questions in X-01."),
        ("G-02", "X-04; X-06", "openapi.yml L781-790; openapi.yml L895-911", "Partly wrong: username-taken conflict and paging minima explicit; other validation still open."),
        ("G-03", "X-02", "openapi.yml L32-37; error-handling.md L7", "Not silence about response codes: unresolved classification of credentials versus validation."),
        ("G-04", "X-03", "openapi.yml L48-53; openapi.yml L298-299; openapi.yml L349-356", "Resolved: allowed OpenAPI gives success codes."),
        ("G-05", "OQ-11.1; X-11", "endpoints.md L140; api-response-format.md L48-54", "No-auth-required does not mean auth ignored. Viewer-dependent fields' semantics remain a question, not proof of contradiction."),
        ("G-06", "OQ-14.1; X-08", "templates.md L203; endpoints.md L243", "Popularity/order/limit remain undefined."),
        ("G-07", "OQ-09.2; X-19", "templates.md L482", "TODO persists."),
        ("G-08", "OQ-21.1; X-17", "routing.md L12-13; templates.md L122", "Protected UI route behaviour not specified."),
        ("G-09", "OQ-07.2; OQ-15.2; X-09; X-10", "endpoints.md L102-124; openapi.yml L895-911", "Combination and maximum remain unspecified; minima/defaults explicit."),
        ("G-10", "OQ-17.1; X-10", "endpoints.md L211-215", "Comment ordering remains unspecified."),
        ("G-11", "FE-049 coverage disposition", "frontend-api.md L25-34", "Deployment limitation, not product requirement; current citation is 31-34, not 205-208. No hosted instance used."),
    ]:
        gap(item, "Rechecked; see linked disposition", refs, evidence, finding)
    for base in ("G-01", "G-03", "G-04", "G-11"):
        original = next(row for row in rows if row["Gap"] == base)
        gap("Correction " + base, "Correction verified at current pin", original["Links"], original["Evidence at pin"], original["Finding"])
    assert len(rows) == 37 and len({r["Gap"] for r in rows}) == 37
    write_items(items)
    path = ROOT / "traceability.md"
    path.write_text(path.read_text() + "\n## Run 2a gap reconciliation\n\nPin: " + PIN + ". Older analyses are leads only. Every row below was rechecked against the cited current requirement sources; no oracle/implementation was used.\n\n"
                    + table(rows, ["Gap", "Disposition", "Links", "Evidence at pin", "Finding"]) + "\n", encoding="utf-8")
    save_events("step 4")
    current, _ = markdown_records()
    assert sum(i.startswith("BR-") for i in current) == 81
    assert all(r["Status"] == "Open" and not r["Answer / decision"] for r in current.values() if "OQ ID" in r)
    print("Step 4 PASS: 22 recount gaps + 11 baseline gaps + 4 corrections = 37 distinct dispositions")
    print("Retired rules:", [e["ID"] for e in EVENTS if e["Change"].startswith("Rule turned")])
    print("New questions:", [e["ID"] for e in EVENTS if "New open question" in e["Change"]])


def checklist():
    path = REPO / "research/realworld-spike/requirements-recount.md"
    rows = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        match = re.match(r"^\| ((?:B|U|P|A|C|F|FE|FT)-\d{3}) \| (.*?) \| (.*?) \|$", line)
        if match:
            rows[match.group(1)] = match.group(2)
    assert len(rows) == 210, ("Historical checklist IDs", len(rows))
    return rows


def coverage_references(row, items):
    """Current coverage targets must exist; exclusion prose may cite logged retirements."""
    from markdown_io import read_table
    refs = re.findall(r"(?:BR|AC|OQ)-\d+\.\d+", row["Coverage / reason"])
    allowed = set(items)
    if row["Disposition"] == "Out of asserted scope":
        changelog = (ROOT / "CHANGELOG.md").read_text(encoding="utf-8")
        for section in re.split(r"\n## ", changelog)[1:]:
            if "| ID | Change | Reason | Citation |" in section:
                allowed.update(r["ID"] for r in read_table(section)
                               if r["Change"].startswith("Rule turned into "))
    assert all(i in allowed for i in refs), row
    return refs


def validate():
    """Step 4/5 output integrity check, without reopening restricted research."""
    from markdown_io import read_table
    from convert import expected_items, records
    from workbook import read_workbook
    items, stories = markdown_records()
    book = read_workbook()
    changelog = (ROOT / "CHANGELOG.md").read_text()
    trace = (ROOT / "traceability.md").read_text()
    assert len(list((ROOT / "epics").glob("EP-*.md"))) == 7
    assert read_table(trace.split("## Run 2a", 1)[0]) == records(book["Traceability"])
    for source in records(book["Backlog"]):
        for field in ("Story ID", "Title", "Persona", "Type", "Priority (proposed)", "Status", "Baseline req IDs", "User story"):
            assert stories[source["Story ID"]][field] == source[field], (source["Story ID"], field)
    for item, source in expected_items(book).items():
        if item not in items:
            continue
        for field, value in source.items():
            if item == "OQ-09.1" and field == "Spec evidence":
                value += "; openapi.yml L596-608"
            assert items[item][field] == value, ("Unexpected original content change", item, field)
    gap_text = trace.split("## Run 2a gap reconciliation", 1)[1].split("## Run 2a coverage", 1)[0]
    gap_rows = read_table(gap_text)
    assert len(gap_rows) == 37
    expected_gaps = {"X-" + str(n).zfill(2) for n in range(1, 23)} | {"G-" + str(n).zfill(2) for n in range(1, 12)} | {"Correction " + g for g in ("G-01", "G-03", "G-04", "G-11")}
    assert {r["Gap"] for r in gap_rows} == expected_gaps
    counts = [len(stories)] + [sum(i.startswith(p) for i in items) for p in ("BR-", "AC-", "OQ-")]
    assert counts[0] == 23 and counts[2] == 72
    assert all(s["Status"] == "Draft" for s in stories.values())
    assert all(r["Status"] == "Open" and not r["Answer / decision"] for r in items.values() if "OQ ID" in r)
    assert "BR-08.6" in items and items["BR-08.6"]["Spec traces"] == "endpoints.md L185"
    for item in ("BR-02.4", "BR-03.4", "BR-09.4", "BR-10.3", "BR-18.3", "BR-19.2", "BR-15.4", "BR-20.2"):
        assert item not in items and item in changelog, item
    if "## Run 2a coverage" in trace:
        coverage = read_table(trace.split("## Run 2a coverage", 1)[1])
        assert len(coverage) == 210 and len({r["Checklist ID"] for r in coverage}) == 210
        for row in coverage:
            refs = coverage_references(row, items)
            if row["Disposition"] == "Covered":
                assert any(i.startswith(("BR-", "AC-")) for i in refs), row
            else:
                assert row["Disposition"] == "Out of asserted scope" and row["Coverage / reason"], row
        readme = (ROOT / "README.md").read_text()
        for label, n in zip(("stories", "rules", "scenarios", "open questions"), counts):
            assert "- " + label + ": " + str(n) in readme
        print("Step 5 PASS: 210 unique checklist rows; every row has current BR/AC coverage or an explicit exclusion reason")
    print("Current counts: stories / rules / scenarios / open questions =", counts)
    print("PASS: Draft stories, Open unanswered questions, retired IDs logged, BR-08.6 retained")


def step5():
    from coverage2a import COVERAGE, NOTES
    items, stories = markdown_records()
    assert len(stories) == 23 and sum(i.startswith("BR-") for i in items) == 81
    for story, text, evidence in [
        ("01", "The User response requires email, token and username strings, plus bio and image, each a string or null.", "openapi.yml L481-503"),
        ("01", "The registration request body contains a required user object with username, email and password.", "openapi.yml L834-845; openapi.yml L467-480"),
        ("01", "The Sign up page has a Sign up heading and a Have an account? link to /login.", "templates.md L262-265"),
        ("02", "The login request body contains a required user object with email and password.", "openapi.yml L822-833; openapi.yml L456-466"),
        ("02", "The login API declares 200 User, 401 Unauthorized and 422 GenericError responses; bad-credential classification remains OQ-02.1.", "openapi.yml L28-37"),
        ("02", "The Sign in page has a Sign in heading and a Need an account? link to /register.", "templates.md L231-234"),
        ("03", "GET /api/user declares 200 User, 401 Unauthorized and 422 GenericError responses.", "openapi.yml L61-68"),
        ("05", "The user update request requires a user object and at least one field to update.", "openapi.yml L846-857"),
        ("05", "PUT /api/user declares 200 User, 401 Unauthorized and 422 GenericError responses.", "openapi.yml L76-87"),
        ("06", "The profile response requires a profile object containing username, bio, image and following; following is boolean and bio and image may be null.", "openapi.yml L521-540; openapi.yml L746-756"),
        ("06", "GET /api/profiles/{username} declares 200 Profile, 401 Unauthorized, 404 NotFound and 422 GenericError responses; optional-auth token handling remains OQ-03.4.", "openapi.yml L93-111"),
        ("08", "The create request requires an article object containing title, description and body; optional tagList is an array of strings.", "openapi.yml L579-595; openapi.yml L858-869"),
        ("08", "An Article requires slug, title, description, body, tagList, createdAt, updatedAt, favorited, favoritesCount and author. createdAt and updatedAt are date-time strings, favorited is boolean, favoritesCount is integer, and author is a Profile.", "openapi.yml L541-578"),
        ("08", "POST /api/articles declares 201 Article, 401 Unauthorized, 409 ConflictError and 422 GenericError responses; the conflict trigger remains OQ-08.1.", "openapi.yml L219-230"),
        ("08", "The create/edit editor shows an error-messages list and a tag-list with a remove icon; the article page includes an Edit Article control without a resolved visibility switch.", "templates.md L444-446; templates.md L464-466; templates.md L482; templates.md L505-507"),
        ("09", "PUT /api/articles/{slug} declares 200 Article, 401 Unauthorized, 403 Forbidden, 404 NotFound and 422 GenericError responses; the API ownership condition remains OQ-09.4.", "openapi.yml L260-288; error-handling.md L23-25"),
        ("10", "DELETE /api/articles/{slug} declares 204 with no content, 401 Unauthorized, 403 Forbidden, 404 NotFound and 422 GenericError responses; the API ownership condition remains OQ-10.4.", "openapi.yml L289-315; openapi.yml L768-770"),
        ("11", "GET /api/articles/{slug} declares 200 Article, 404 NotFound and 422 GenericError responses.", "openapi.yml L240-259"),
        ("12", "Article list and feed responses require articles and integer articlesCount. Each article entry requires slug, title, description, tagList, createdAt, updatedAt, favorited, favoritesCount and author, without a body field; author is a Profile.", "openapi.yml L697-745; api-response-format.md L62-67"),
        ("12", "GET /api/articles declares 200 MultipleArticles, 401 Unauthorized and 422 GenericError responses; optional-auth token handling remains OQ-03.4.", "openapi.yml L183-213"),
        ("12", "The home banner shows conduit and A place to share your knowledge.", "templates.md L126-131"),
        ("13", "GET /api/articles/feed declares 200 MultipleArticles, 401 Unauthorized and 422 GenericError responses.", "openapi.yml L164-180"),
        ("14", "GET /api/tags declares 200 Tags and 422 GenericError responses, with a required tags array of strings.", "openapi.yml L443-453; openapi.yml L649-661"),
        ("15", "The limit query parameter is an integer with minimum 1 and default 20; offset is an integer with minimum 0 describing the number of items to skip.", "openapi.yml L895-911"),
        ("15", "Pagination markup uses page-item and page-link classes, with the active page marked active.", "templates.md L191-196"),
        ("16", "The create-comment request body contains a required comment object whose body field is required.", "openapi.yml L630-636; openapi.yml L882-893"),
        ("16", "A Comment requires id, createdAt, updatedAt, body and author. id is integer, createdAt and updatedAt are date-time strings, body is string and author is a Profile.", "openapi.yml L609-629"),
        ("16", "POST /api/articles/{slug}/comments declares 201 Comment, 401 Unauthorized, 404 NotFound and 422 GenericError responses.", "openapi.yml L338-365"),
        ("17", "GET /api/articles/{slug}/comments declares 200 with a comments array, 401 Unauthorized, 404 NotFound and 422 GenericError responses; optional-auth token handling remains OQ-03.4.", "openapi.yml L315-337; openapi.yml L675-685"),
        ("18", "DELETE /api/articles/{slug}/comments/{id} requires an integer id path parameter and declares 204 with no content, 401 Unauthorized, 403 Forbidden, 404 NotFound and 422 GenericError responses; the ownership condition remains OQ-18.2.", "openapi.yml L366-398; openapi.yml L768-770"),
        ("19", "Follow and unfollow require no additional parameters and declare 200 Profile, 401 Unauthorized, 404 NotFound and 422 GenericError responses.", "endpoints.md L82-96; openapi.yml L118-160"),
        ("20", "Favorite and unfavorite require no additional parameters and declare 200 Article, 401 Unauthorized, 404 NotFound and 422 GenericError responses.", "endpoints.md L223-237; openapi.yml L399-441"),
        ("21", "The document title is Conduit; the footer links conduit to / and displays An interactive learning project. Code & design licensed under MIT.", "templates.md L14; templates.md L103-111"),
        ("21", "When a user has no profile image, display the default avatar, a smiley face icon.", "styles.md L16-18"),
        ("22", "Unauthorized responses use the errors model; the specification's missing-token example is errors.token containing is missing.", "openapi.yml L771-780"),
        ("22", "The errors model contains field-name arrays of strings. Forbidden and NotFound examples contain forbidden and not found respectively; their error key identifies the resource type, not a literal resource name.", "openapi.yml L637-647; openapi.yml L791-810"),
    ]:
        rule(items, story, text, evidence, "Step 5: make stated contract/template detail explicit rather than count it as implicit coverage.")
    leads = checklist()
    rows = []
    for line in COVERAGE.strip().splitlines():
        item, evidence, target = line.split("|", 2)
        assert item in leads, item
        excluded = target.startswith("!")
        rows.append({"Checklist ID": item, "Historical statement (lead only)": leads[item],
                     "Evidence at pin": evidence, "Disposition": "Out of asserted scope" if excluded else "Covered",
                     "Coverage / reason": target[1:] if excluded else target,
                     "Qualification": NOTES.get(item, "")})
    assert len(rows) == 210 and {r["Checklist ID"] for r in rows} == set(leads)
    for row in rows:
        coverage_references(row, items)
    write_items(items)
    path = ROOT / "traceability.md"
    path.write_text(path.read_text() + "\n## Run 2a coverage\n\nPin: " + PIN + ". The 210-row older recount is an inventory of leads, not an authority. Each row is re-located below. Covered means designed requirement coverage, not executed tests or proven software. Exclusions include engineering/styling/deployment scope and unsupported or conflicting statements; their questions remain unanswered. A declared response code is not an invented trigger.\n\n"
                    + table(rows, ["Checklist ID", "Historical statement (lead only)", "Evidence at pin", "Disposition", "Coverage / reason", "Qualification"]) + "\n", encoding="utf-8")
    readme = ROOT / "README.md"
    text = readme.read_text()
    for label, count in [("stories", 23), ("rules", sum(i.startswith("BR-") for i in items)), ("scenarios", 72), ("open questions", sum(i.startswith("OQ-") for i in items))]:
        text = re.sub(r"^- " + label + r": \d+$", "- " + label + ": " + str(count), text, flags=re.M)
    text = text.replace("# Conduit requirements — unchanged workbook conversion", "# Conduit requirements — draft refinement")
    text = text.replace("Derived, not stakeholder-authored. Run 1 preserves source wording; no BA decisions have been made.", "Derived, not stakeholder-authored. Run 1 preserved source wording; Run 2a reconciles gaps and fills explicit coverage at the same pin. No BA decisions have been made.")
    text += "\nRun 2a: counts above describe current Markdown. The verbatim workbook sections are historical source material, not updated source totals. See [traceability.md](traceability.md) for the 37 gap/correction dispositions and 210-row coverage inventory. All stories remain Draft; all questions remain Open and unanswered.\n\nCurrent validation: use tools/run2a.py --check and tools/check_citations.py. The older conversion checks intentionally expect the original item set; do not rerun the workbook generator over this refinement.\n"
    readme.write_text(text, encoding="utf-8")
    save_events("step 5")
    validate()
    print("New rules:", [e["ID"] for e in EVENTS if e["Change"].startswith("New business rule")])
    print("Coverage disposition counts:", {name: sum(r["Disposition"] == name for r in rows) for name in ("Covered", "Out of asserted scope")})


if __name__ == "__main__":
    assert hashlib.sha256(SOURCE.read_bytes()).hexdigest() == "eb1a9ef70058438926454d9f0f8bcf316aa014162d4db8633b657073eafe9b58"
    if sys.argv[1:] == ["step4"]:
        step4()
    elif sys.argv[1:] == ["step5"]:
        step5()
    elif sys.argv[1:] == ["--check"]:
        validate()
    else:
        raise SystemExit("Usage: run2a.py step4|step5|--check")