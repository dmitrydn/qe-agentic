"""Read compact requirements Markdown, with legacy-layout migration support."""

import re

from workbook import ROOT


def plain_citations(text):
    return text.replace("`", "")


def table(rows, headers):
    def cell(value):
        return value.replace("&", "&amp;").replace("|", "&#124;").replace("\n", "<br>")
    lines = ["| " + " | ".join(headers) + " |", "| " + " | ".join("---" for _ in headers) + " |"]
    lines += ["| " + " | ".join(cell(row.get(h, "")) for h in headers) + " |" for row in rows]
    return "\n".join(lines)


def read_table(text):
    lines = [line for line in text.splitlines() if line.startswith("| ")]
    assert len(lines) >= 2, "Missing table"
    def cells(line):
        return [v.strip().replace("<br>", "\n").replace("&#124;", "|").replace("&amp;", "&")
                for v in line.strip("|").split("|")]
    headers = cells(lines[0])
    result = []
    for line in lines[2:]:
        values = cells(line)
        assert len(values) == len(headers), line
        result.append(dict(zip(headers, values)))
    return result


def gherkin_fields(text):
    """Derive the legacy Given/When/Then values from the unchanged Gherkin."""
    groups, active = {"Given": [], "When": [], "Then": []}, None
    for line in text.splitlines():
        match = re.match(r"\s+(Given|When|Then|And) (.*)", line)
        if match:
            keyword, value = match.groups()
            if keyword != "And":
                active = keyword
            assert active is not None, text
            groups[active].append(value)
    return {key: "\n".join(value) for key, value in groups.items()}


def markdown_records():
    items, stories = {}, {}
    for path in sorted((ROOT / "epics").glob("EP-*.md")):
        text = path.read_text(encoding="utf-8")
        print("READ", path)
        if "**Epic ID:**" in text:
            # Legacy format: needed only to verify the first migration is lossless.
            for heading in re.finditer(r"^(#{2,4}) ((?:US-\d+|(?:BR|AC)-\d+\.\d+))\b[^\n]*\n", text, re.M):
                tail = text[heading.end():]
                boundary = re.search(r"^#{1,4} ", tail, re.M)
                block = tail[:boundary.start()] if boundary else tail
                row = {}
                for field in re.finditer(r"^\*\*([^*\n]+):\*\*[ \t]*(?:\n\n)?(.*?)(?=^\*\*[^*\n]+:\*\*|^```|\Z)", block, re.M | re.S):
                    row[field.group(1)] = field.group(2).strip()
                code = re.search(r"^```gherkin\n(.*?)\n```", block, re.M | re.S)
                if code:
                    row["Gherkin"] = code.group(1)
                target = stories if heading.group(2).startswith("US-") else items
                assert heading.group(2) not in target, heading.group(2)
                target[heading.group(2)] = row
            continue
        for story in re.finditer(r"^## (US-\d+) ([^\n]+)\n(.*?)(?=^## US-|\Z)", text, re.M | re.S):
            sid, title, block = story.groups()
            metadata = dict(re.findall(r"\*\*([^*]+):\*\* ([^\n]*?)(?= · \*\*|\n|$)", block.split("### ", 1)[0]))
            row = {"Story ID": sid, "Title": title, **metadata}
            row["Baseline req IDs"] = row.pop("Baseline")
            row["User story"] = block.split("\n\n", 2)[1]
            assert sid not in stories, sid
            stories[sid] = row
            for rule in re.finditer(r"^- \*\*(BR-\d+\.\d+)\*\* (.*?) — ([^\n]+)$", block, re.M):
                item, wording, traces = rule.groups()
                assert item not in items, item
                items[item] = {"Rule ID": item, "Story ID": sid, "Business rule": wording,
                               "Spec traces": plain_citations(traces)}
            for ac in re.finditer(r"^#### (AC-\d+\.\d+) ([^\n]+) \(([^()]+)\)\n(.*?)(?=^#### |^### |\Z)", block, re.M | re.S):
                item, title, level, body = ac.groups()
                spec = re.search(r"^Spec: ([^\n]+)", body, re.M)
                code = re.search(r"^```gherkin\n(.*?)\n```", body, re.M | re.S)
                assert spec and code, item
                assert item not in items, item
                items[item] = {"AC ID": item, "Story ID": sid, "Scenario": title, "Level": level,
                               "Spec traces": plain_citations(spec.group(1)), "Gherkin": code.group(1),
                               **gherkin_fields(code.group(1))}
                assumption = re.search(r"^\*\*BA-ASSUMPTION:\*\* ([^\n]+)", body, re.M)
                if assumption:
                    items[item]["BA-ASSUMPTION"] = assumption.group(1)
    path = ROOT / "open-questions.md"
    text = path.read_text(encoding="utf-8")
    print("READ", path)
    if "| OQ ID |" in text:
        questions = read_table(text)
    else:
        questions = []
        for match in re.finditer(r"^## (OQ-\d+\.\d+)\n(.*?)(?=^## |\Z)", text, re.M | re.S):
            row = {}
            for field in re.finditer(r"^\*\*([^*\n]+):\*\*\n\n(.*?)(?=^\*\*[^*\n]+:\*\*|\Z)", match.group(2), re.M | re.S):
                row[field.group(1)] = field.group(2).strip()
            questions.append(row)
    for row in questions:
        item = row["OQ ID"]
        assert item not in items, item
        items[item] = row
    return items, stories