#!/usr/bin/env python3
"""Assert that every local asset reference in the site resolves.

The site ships build-less, so this is a correctness gate, not a build:
it walks every .html file, extracts href/src references, and fails if a
*local* one (root-absolute `/inc/...` or relative `img/...`) points at a
file that isn't in the repo. This is the failure mode that hurts a
hand-maintained static site — a renamed or moved asset silently 404s in
the browser but nothing else notices.

External references (http://, https://, //cdn, mailto:, javascript:,
in-page #anchors) are reported for visibility but never fail the build:
those are a rot vector to weigh (see docs/ROADMAP.md), not a broken
link today. stdlib only — nothing to install.
"""

from __future__ import annotations

import pathlib
import re
import sys
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = ROOT / "site"  # the deployable web root; repo meta lives above it
ATTRS = {"href", "src"}
PENDING_FILE = ROOT / "tools" / "known-pending.txt"


def load_pending() -> set[str]:
    """Refs that don't resolve yet but are intentional (tracked in ROADMAP)."""
    if not PENDING_FILE.exists():
        return set()
    out: set[str] = set()
    for line in PENDING_FILE.read_text(encoding="utf-8").splitlines():
        line = line.split("#", 1)[0].strip()
        if line:
            out.add(line)
    return out


class RefCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.refs: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in ATTRS and value:
                self.refs.append(value.strip())


def is_external(ref: str) -> bool:
    return bool(re.match(r"^(?:https?:)?//", ref)) or ref.split(":", 1)[0].lower() in {
        "mailto",
        "tel",
        "javascript",
        "data",
    }


def resolve(ref: str, page: pathlib.Path) -> pathlib.Path:
    ref = ref.split("#", 1)[0].split("?", 1)[0]
    if ref.startswith("/"):
        # root-absolute paths are relative to the deployed web root (site/)
        return SITE / ref.lstrip("/")
    return (page.parent / ref).resolve()


def main() -> int:
    pages = sorted(SITE.rglob("*.html"))
    if not pages:
        print(f"no .html files found under {SITE.relative_to(ROOT)}/", file=sys.stderr)
        return 1

    pending_refs = load_pending()
    broken: list[str] = []
    external: set[str] = set()
    pending_hit: set[str] = set()
    checked = 0

    for page in pages:
        parser = RefCollector()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        rel_page = page.relative_to(ROOT)
        for ref in parser.refs:
            if not ref or ref.startswith("#"):
                continue
            if is_external(ref):
                external.add(ref)
                continue
            checked += 1
            target = resolve(ref, page)
            if target.exists():
                continue
            if ref in pending_refs:
                pending_hit.add(ref)
                continue
            broken.append(f"{rel_page}: {ref} -> missing {target.relative_to(ROOT) if ROOT in target.parents else target}")

    print(f"checked {checked} local references across {len(pages)} page(s)")
    if pending_hit:
        print(f"\n{len(pending_hit)} pending reference(s) (allowlisted in known-pending.txt, see ROADMAP):")
        for ref in sorted(pending_hit):
            print(f"  … {ref}")
    if external:
        print(f"\n{len(external)} external reference(s) (not failed, see ROADMAP de-rot):")
        for ref in sorted(external):
            print(f"  · {ref}")
    if broken:
        print(f"\n{len(broken)} BROKEN local reference(s):", file=sys.stderr)
        for line in broken:
            print(f"  ✗ {line}", file=sys.stderr)
        return 1
    print("\nall local references resolve ✓")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
