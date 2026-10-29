#!/usr/bin/env python3
"""Sync the publication list from ORCID + Crossref.

What it does, in order:

1. Reads ``_data/publications.yml`` and collects every DOI already listed.
2. Asks Crossref for each DOI and refreshes ``citation_count`` in place
   (the file is edited line-by-line so all comments and ordering survive).
3. Asks the ORCID public API for the author's works and appends any DOI that
   is not in the YAML yet, filling the entry from Crossref.
4. Writes ``_data/metrics.yml`` with the aggregate numbers the site displays.

Run it locally with::

    python _scripts/sync_academic.py

It is also executed daily by ``.github/workflows/sync-academic.yml``. Only the
standard library plus PyYAML is required.
"""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("PyYAML is required: pip install pyyaml")

ORCID = "0009-0000-8611-7194"
MAILTO = "kannmu@163.com"
UA = f"KannmuSite-sync/1.0 (mailto:{MAILTO})"

ROOT = Path(__file__).resolve().parent.parent
PUBS = ROOT / "_data" / "publications.yml"
METRICS = ROOT / "_data" / "metrics.yml"

SELF_FAMILY = "fan"
SELF_GIVEN = ("linhan", "lin han", "lin-han", "lin han fan")

DOI_RE = re.compile(r"^(\s*)doi:\s*(\S+)\s*$")


# ---------------------------------------------------------------- networking
def http_json(url: str, tries: int = 3, timeout: int = 25) -> dict | None:
    """GET a URL and parse JSON, retrying transient failures."""
    last = None
    for attempt in range(tries):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
        try:
            with urllib.request.urlopen(req, timeout=timeout) as res:
                return json.loads(res.read().decode("utf-8"))
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last = exc
            if attempt < tries - 1:
                time.sleep(1.5 * (attempt + 1))
    print(f"  ! {url} -> {last}", file=sys.stderr)
    return None


def crossref(doi: str) -> dict | None:
    return http_json(f"https://api.crossref.org/works/{urllib.parse.quote(doi)}?mailto={MAILTO}")


def norm_doi(doi: str | None) -> str:
    if not doi:
        return ""
    return re.sub(r"^https?://(dx\.)?doi\.org/", "", doi.strip(), flags=re.I).lower()


# ------------------------------------------------------------------- helpers
def is_self(given: str, family: str) -> bool:
    return (family or "").strip().lower() == SELF_FAMILY and \
        (given or "").strip().lower().replace(".", "") in SELF_GIVEN


def fmt_authors(message: dict) -> tuple[str, str, str]:
    """Return (authors joined with ' ; ', self name as written, author role)."""
    names, self_name, index = [], "", None
    for i, author in enumerate(message.get("author") or []):
        given = author.get("given", "")
        family = author.get("family", "")
        display = f"{given} {family}".strip() or author.get("name", "")
        if is_self(given, family) and index is None:
            index = i
            self_name = display
        names.append(display)
    if index is None:
        role = "coauthor"
    elif index == 0:
        role = "first"
    else:
        role = "coauthor"
    return " ; ".join(names), self_name, role


def slugify(text: str) -> str:
    text = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return text[:40] or "work"


def short_venue(container: str) -> str:
    container = (container or "").strip()
    if not container:
        return ""
    words = re.split(r"\s+", container)
    if len(container) <= 26 or len(words) <= 2:
        return container
    return "".join(w[0].upper() for w in words if w[:1].isalpha())[:8]


# --------------------------------------------------------------- file edits
def refresh_citations(text: str, counts: dict[str, int]) -> tuple[str, int]:
    """Replace citation_count values in place, keyed by the DOI in the block."""
    lines = text.splitlines()
    current_doi = None
    changed = 0
    for i, line in enumerate(lines):
        m = DOI_RE.match(line)
        if m:
            current_doi = norm_doi(m.group(2))
            continue
        if current_doi in counts and re.match(r"^\s*citation_count:", line):
            new = f"{line.split(':')[0]}: {counts[current_doi]}"
            if new != line.rstrip():
                lines[i] = new
                changed += 1
    return "\n".join(lines) + "\n", changed


def append_entry(text: str, entry: dict) -> str:
    block = [
        "",
        f"- id: {entry['id']}",
        f"  year: {entry['year']}",
        f'  title: "{entry["title"].replace(chr(34), chr(39))}"',
        f"  date: {entry['date']}",
        f"  type: {entry['type']}",
        f'  venue: "{entry["venue"]}"',
        f'  venue_short: "{entry["venue_short"]}"',
        f'  publisher: "{entry["publisher"]}"',
    ]
    for key in ("volume", "issue", "pages"):
        if entry.get(key):
            block.append(f'  {key}: "{entry[key]}"')
    block += [
        f"  doi: {entry['doi']}",
        f"  citation_count: {entry['citation_count']}",
        f"  author_role: {entry['author_role']}",
        f'  authors: "{entry["authors"]}"',
        f'  self_name: "{entry["self_name"]}"',
        "  topics: [imported]",
        "  featured: false",
        "  note: >-",
        "    由 ORCID / Crossref 同步自动收录，欢迎补充摘要与主题标签。",
        '  abstract_zh: ""',
        '  abstract_en: ""',
    ]
    return text.rstrip("\n") + "\n" + "\n".join(block) + "\n"


# ----------------------------------------------------------------------- run
def main() -> int:
    if not PUBS.exists():
        sys.exit(f"not found: {PUBS}")

    raw = PUBS.read_text(encoding="utf-8")
    docs = yaml.safe_load(raw) or []
    known = {norm_doi(p.get("doi")) for p in docs if p.get("doi")}
    print(f"publications.yml: {len(docs)} entries, {len(known)} DOIs")

    # 1. refresh citation counts -------------------------------------------------
    counts: dict[str, int] = {}
    for doi in sorted(known):
        meta = crossref(doi)
        if not meta:
            continue
        value = meta.get("message", {}).get("is-referenced-by-count")
        if isinstance(value, int):
            counts[doi] = value
        time.sleep(0.2)
    print(f"crossref: refreshed {len(counts)}/{len(known)} citation counts")

    raw, changed = refresh_citations(raw, counts)
    print(f"publications.yml: {changed} citation values updated")

    # 2. discover new works on ORCID --------------------------------------------
    works = http_json(f"https://pub.orcid.org/v3.0/{ORCID}/works") or {}
    orcid_dois: list[str] = []
    for group in works.get("group") or []:
        for summary in group.get("work-summary") or []:
            for ext in (summary.get("external-ids") or {}).get("external-id") or []:
                if ext.get("external-id-type") == "doi":
                    doi = norm_doi(ext.get("external-id-value"))
                    if doi and doi not in orcid_dois:
                        orcid_dois.append(doi)
    print(f"orcid: {len(orcid_dois)} DOIs on the record")

    added = 0
    for doi in orcid_dois:
        if doi in known:
            continue
        meta = crossref(doi)
        if not meta or "message" not in meta:
            continue
        message = meta["message"]
        if message.get("type") in {"posted-content", "dataset", "peer-review"}:
            continue

        authors, self_name, role = fmt_authors(message)
        if not self_name:
            continue

        parts = (message.get("issued", {}).get("date-parts") or [[None]])[0]
        year = parts[0] or datetime.now().year
        month = parts[1] if len(parts) > 1 else 1
        day = parts[2] if len(parts) > 2 else 1
        is_conf = message.get("type") == "proceedings-article"
        container = (message.get("container-title") or [""])[0]

        entry = {
            "id": f"{slugify(self_name.split()[-1])}{year}{slugify(container)[:3]}",
            "year": year,
            "title": (message.get("title") or ["Untitled"])[0],
            "date": f"{year:04d}-{month:02d}-{day:02d}",
            "type": "conference" if is_conf else "journal",
            "venue": container or message.get("publisher", ""),
            "venue_short": short_venue(container),
            "publisher": message.get("publisher", ""),
            "volume": message.get("volume", ""),
            "issue": message.get("issue", ""),
            "pages": message.get("page", "") or message.get("article-number", ""),
            "doi": doi,
            "citation_count": message.get("is-referenced-by-count", 0),
            "author_role": role,
            "authors": authors,
            "self_name": self_name,
        }
        raw = append_entry(raw, entry)
        known.add(doi)
        added += 1
        print(f"  + {year} {entry['title'][:70]}")
        time.sleep(0.2)

    if changed or added:
        PUBS.write_text(raw, encoding="utf-8")
        print(f"publications.yml written ({added} new entries)")

    # 3. aggregate metrics -------------------------------------------------------
    docs = yaml.safe_load(PUBS.read_text(encoding="utf-8")) or []
    total_cites = sum(int(p.get("citation_count") or 0) for p in docs)
    first_author = sum(1 for p in docs if p.get("author_role") in {"first", "cofirst"})
    journals = sum(1 for p in docs if p.get("type") == "journal")

    METRICS.write_text(
        "# 由 _scripts/sync_academic.py 自动生成，请勿手工编辑。\n"
        f"updated: {datetime.now(timezone.utc).isoformat(timespec='seconds')}\n"
        f"works: {len(docs)}\n"
        f"citations: {total_cites}\n"
        f"first_author: {first_author}\n"
        f"journals: {journals}\n"
        f"conferences: {len(docs) - journals}\n"
        f"orcid_works: {len(orcid_dois)}\n"
        f"source: ORCID + Crossref\n",
        encoding="utf-8",
    )
    print(f"metrics.yml: {len(docs)} works · {total_cites} citations · h-index n/a")

    # Touch nothing else; the workflow decides whether to commit.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
