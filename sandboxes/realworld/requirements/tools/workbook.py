"""Read text cells from the source XLSX without third-party dependencies."""

import json
import posixpath
from pathlib import Path
import xml.etree.ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source/Conduit-backlog.xlsx"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def read_workbook():
    sheets = {}
    with ZipFile(SOURCE) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = [
                "".join(node.itertext())
                for node in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("m:si", NS)
            ]
        relations = {
            node.attrib["Id"]: node.attrib["Target"]
            for node in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        }
        for sheet in ET.fromstring(archive.read("xl/workbook.xml")).findall("m:sheets/m:sheet", NS):
            target = relations[sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]]
            target = target.lstrip("/") if target.startswith("/") else posixpath.normpath("xl/" + target)
            rows = []
            for row in ET.fromstring(archive.read(target)).findall("m:sheetData/m:row", NS):
                cells = {}
                for cell in row.findall("m:c", NS):
                    value = cell.find("m:v", NS)
                    inline = cell.find("m:is", NS)
                    text = value.text or "" if value is not None else "".join(inline.itertext()) if inline is not None else ""
                    if cell.attrib.get("t") == "s":
                        text = strings[int(text)]
                    cells[cell.attrib["r"]] = text
                if any(cells.values()):
                    rows.append(cells)
            sheets[sheet.attrib["name"]] = rows
    return sheets


if __name__ == "__main__":
    for name, rows in read_workbook().items():
        print("\nSHEET", name, "ROWS", len(rows))
        print(json.dumps(rows[:4], ensure_ascii=False, indent=2))