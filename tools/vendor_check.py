#!/usr/bin/env python3
"""Guard the one sanctioned exception to the zero-dependency rule.

CLAUDE.md and two ADRs (docs/decisions/2026-08-08-0450 and -0546) allow
exactly one thing into this build-less, npm-less, CDN-less repo: pinned
third-party bytes committed under site/vendor/, each with its version,
integrity hash and licence recorded. That rule is only as true as the
humans who remember to keep it — a re-vendor that forgets to update the
pin, a hand-edit to a vendored file, a `npm install` that leaves a
package.json behind, or a "just this once" CDN <script> tag would each
break it silently, and nothing else in this repo would notice. This
script is what notices, every commit.

WHERE THE PINS LIVE. tools/vendor-manifest.json — not a hidden dotfile,
not embedded as a comment in NOTICE — because a manifest that's a normal
JSON file is greppable, diffable in a PR, and matches the house
convention (tools/deploy.json is the sibling precedent: declared desired
state as data, reconciled by a script). NOTICE stays prose because a
licence text is prose; the manifest stays data because a hash is data.
The two are cross-checked against each other below, not merged.

Four failure modes, each its own check:

  1. A file under site/vendor/ that the manifest doesn't know about —
     vendored by hand, outside the pinning discipline.
  2. A manifest-recorded file whose content hash no longer matches —
     silent drift (a re-vendor that forgot to update the pin) or a
     hand-edit of vendored bytes (which must never happen: vendored
     means the upstream bytes, unmodified, or it isn't vendored, it's
     forked without saying so).
  3. A manifest library with no matching licence entry in NOTICE — the
     ADR's "each vendored file is committed with its version and
     licence recorded in NOTICE" clause, made mechanical.
  4. Anything outside site/vendor/ that looks like a third-party
     dependency arriving through the back door: a package.json /
     package-lock.json / yarn.lock / node_modules anywhere in the repo
     (evidence an `npm install` happened), or a site/ file loading code
     from a CDN (<script src="http...">, @import url(http...), or a
     bare https:// module import) — the exact two shapes the "no CDN,
     no package manager at runtime" rule exists to keep out.

Exit codes (fail-safe, matching the fleet floor's convention):
  0  clean
  1  one or more of the four checks found a problem
  2  usage / config error (manifest missing or malformed is NOT a pass)

stdlib only — no install, no build step, the same property everything
else in tools/ has.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VENDOR = "site/vendor"

NPM_ARTIFACT_NAMES = {"package.json", "package-lock.json", "yarn.lock"}
NPM_ARTIFACT_DIRS = {"node_modules"}

# Text suffixes worth opening for the CDN-reference scan. A binary or
# already-vendored asset can't carry a <script>/@import/import of its own
# in a way this repo authored, so scanning is bounded to what a person
# could plausibly have hand-written.
SCANNABLE_SUFFIXES = {".html", ".htm", ".css", ".js", ".mjs", ".json", ".webmanifest"}

CDN_PATTERNS = [
    ("<script src=\"http(s)\">", re.compile(r"<script\b[^>]*\bsrc\s*=\s*[\"']https?://", re.IGNORECASE)),
    ("@import url(http(s))", re.compile(r"@import\s+url\(\s*[\"']?https?://", re.IGNORECASE)),
    ("bare https:// import specifier", re.compile(
        r"""(?:\bfrom\s*|\bimport\s*\(\s*|^\s*import\s*)[\"'](https?://[^\"']+)[\"']""",
        re.IGNORECASE | re.MULTILINE,
    )),
]


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def load_manifest(manifest_path: Path) -> dict:
    return json.loads(manifest_path.read_text(encoding="utf-8"))


def manifest_files(manifest: dict) -> dict[str, str]:
    """Flatten {relpath: 'sha256:...'} across every library entry."""
    out: dict[str, str] = {}
    for lib, entry in manifest.get("libraries", {}).items():
        for relpath, pin in entry.get("files", {}).items():
            out[relpath] = pin
    return out


def check_pins(root: Path, manifest: dict) -> list[str]:
    """Failure modes 1 and 2: untracked vendor files, and hash drift."""
    problems: list[str] = []
    vendor_dir = root / VENDOR
    manifest_relpath = (root / "tools" / "vendor-manifest.json").relative_to(root)
    pinned = manifest_files(manifest)

    on_disk = set()
    if vendor_dir.is_dir():
        on_disk = {
            str(p.relative_to(root)) for p in vendor_dir.rglob("*") if p.is_file()
        }

    untracked = sorted(on_disk - set(pinned))
    for relpath in untracked:
        problems.append(
            f"untracked vendor file: {relpath} is under {VENDOR}/ but not in "
            f"{manifest_relpath} — add it to a library's \"files\" "
            f"with its sha256, or remove it if it doesn't belong"
        )

    for relpath, pin in sorted(pinned.items()):
        full = root / relpath
        if not full.is_file():
            problems.append(
                f"missing pinned file: {relpath} is recorded in the manifest "
                f"but not present on disk"
            )
            continue
        algo, _, expected = pin.partition(":")
        if algo != "sha256":
            problems.append(f"{relpath}: manifest pin uses unsupported algorithm {algo!r}")
            continue
        actual = sha256_of(full)
        if actual != expected:
            problems.append(
                f"hash drift: {relpath} is sha256:{actual} but the manifest "
                f"pins sha256:{expected} — a hand-edit, or a re-vendor that "
                f"forgot to update {manifest_relpath}"
            )
    return problems


def check_notice_coverage(manifest: dict, notice_text: str) -> list[str]:
    """Failure mode 3: every library needs a licence entry in NOTICE."""
    problems: list[str] = []
    libraries = manifest.get("libraries", {})

    # Each entry's own header ("<lib> <version>" on its own line) bounds
    # where its section ends: the next library's header, or EOF.
    headers = {
        lib: re.search(
            rf"^{re.escape(lib)} {re.escape(entry['version'])}\s*$",
            notice_text,
            re.MULTILINE,
        )
        for lib, entry in libraries.items()
    }

    for lib, entry in libraries.items():
        header = headers[lib]
        if header is None:
            problems.append(
                f"NOTICE has no entry for {lib} {entry['version']} — expected a "
                f"line reading exactly \"{lib} {entry['version']}\""
            )
            continue
        start = header.end()
        later_starts = [h.start() for other, h in headers.items() if other != lib and h and h.start() > start]
        end = min(later_starts) if later_starts else len(notice_text)
        section = notice_text[start:end]
        licence = entry.get("licence", "")
        if not re.search(rf"^Licence:\s*{re.escape(licence)}\b", section, re.MULTILINE):
            problems.append(
                f"NOTICE entry for {lib} {entry['version']} has no "
                f"\"Licence: {licence}\" line — licence recorded in the "
                f"manifest doesn't match what NOTICE states"
            )
    return problems


def check_no_npm_artifacts(root: Path) -> list[str]:
    """Failure mode 4a: an npm install left evidence anywhere in the repo."""
    problems: list[str] = []
    for path in root.rglob("*"):
        if ".git" in path.parts:
            continue
        if path.is_file() and path.name in NPM_ARTIFACT_NAMES:
            problems.append(f"npm artifact committed: {path.relative_to(root)}")
        if path.is_dir() and path.name in NPM_ARTIFACT_DIRS:
            problems.append(f"npm artifact committed: {path.relative_to(root)}/")
    return problems


def check_no_cdn_refs(root: Path) -> list[str]:
    """Failure mode 4b: site/ (outside the vendored exception) loads a CDN."""
    problems: list[str] = []
    site = root / "site"
    vendor_dir = root / VENDOR
    if not site.is_dir():
        return problems

    for path in sorted(site.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in SCANNABLE_SUFFIXES:
            continue
        if vendor_dir in path.parents or path == vendor_dir:
            continue  # the sanctioned exception itself, not app code
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        for label, pattern in CDN_PATTERNS:
            if pattern.search(text):
                problems.append(f"CDN reference ({label}) in {path.relative_to(root)}")
    return problems


def run(root: Path) -> list[str]:
    manifest_path = root / "tools" / "vendor-manifest.json"
    notice_path = root / "NOTICE"

    if not manifest_path.is_file():
        raise SystemExit(f"vendor_check: manifest not found at {manifest_path}")
    manifest = load_manifest(manifest_path)
    if not notice_path.is_file():
        raise SystemExit(f"vendor_check: NOTICE not found at {notice_path}")
    notice_text = notice_path.read_text(encoding="utf-8")

    problems: list[str] = []
    problems += check_pins(root, manifest)
    problems += check_notice_coverage(manifest, notice_text)
    problems += check_no_npm_artifacts(root)
    problems += check_no_cdn_refs(root)
    return problems


# --- selftest -----------------------------------------------------------
# Exercises all four failure modes against a synthetic repo in a tempdir,
# so "does the guard actually guard" is a rerunnable claim, not a one-off
# hand demonstration that bit-rots the next time someone touches this file.


def _write(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def _make_clean_fixture(base: Path) -> None:
    lib_js = "console.log('fixture');\n"
    _write(base / "site" / "vendor" / "fake-lib" / "fake.js", lib_js)
    digest = hashlib.sha256(lib_js.encode("utf-8")).hexdigest()
    manifest = {
        "libraries": {
            "fake-lib": {
                "version": "1.2.3",
                "licence": "MIT",
                "files": {"site/vendor/fake-lib/fake.js": f"sha256:{digest}"},
            }
        }
    }
    _write(base / "tools" / "vendor-manifest.json", json.dumps(manifest, indent=2))
    _write(
        base / "NOTICE",
        "fake-lib 1.2.3\n--------------\nLicence: MIT\n\n(fixture licence body)\n",
    )
    _write(base / "site" / "index.html", "<!doctype html><title>fixture</title>\n")


def selftest() -> int:
    cases: list[tuple[str, bool]] = []

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        _make_clean_fixture(base)
        problems = run(base)
        cases.append(("clean fixture passes", problems == []))

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        _make_clean_fixture(base)
        _write(base / "site" / "vendor" / "fake-lib" / "extra.js", "// not pinned\n")
        problems = run(base)
        cases.append((
            "untracked vendor file is caught",
            any("untracked vendor file" in p for p in problems),
        ))

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        _make_clean_fixture(base)
        (base / "site" / "vendor" / "fake-lib" / "fake.js").write_text(
            "console.log('tampered');\n", encoding="utf-8"
        )
        problems = run(base)
        cases.append((
            "hash drift is caught",
            any("hash drift" in p for p in problems),
        ))

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        _make_clean_fixture(base)
        (base / "NOTICE").write_text("fake-lib 1.2.3\n(no licence line here)\n", encoding="utf-8")
        problems = run(base)
        cases.append((
            "missing NOTICE licence entry is caught",
            any("NOTICE entry" in p for p in problems),
        ))

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        _make_clean_fixture(base)
        _write(base / "package.json", "{}\n")
        problems = run(base)
        cases.append((
            "package.json anywhere in the repo is caught",
            any("npm artifact committed" in p for p in problems),
        ))

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        _make_clean_fixture(base)
        _write(
            base / "site" / "index.html",
            '<!doctype html><script src="https://unpkg.com/thing.js"></script>\n',
        )
        problems = run(base)
        cases.append((
            "CDN <script src> is caught",
            any("CDN reference" in p for p in problems),
        ))

    with tempfile.TemporaryDirectory() as tmp:
        base = Path(tmp)
        _make_clean_fixture(base)
        _write(
            base / "site" / "app.mjs",
            'import { thing } from "https://cdn.example.com/thing.mjs";\n',
        )
        problems = run(base)
        cases.append((
            "bare https:// import specifier is caught",
            any("CDN reference" in p for p in problems),
        ))

    ok = True
    for name, passed in cases:
        print(f"{'ok' if passed else 'FAIL'}  — {name}")
        ok = ok and passed
    return 0 if ok else 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--root", type=Path, default=ROOT, help="repo root (default: this script's parent's parent)"
    )
    parser.add_argument(
        "--selftest", action="store_true", help="run the guard against synthetic fixtures and exit"
    )
    args = parser.parse_args()

    if args.selftest:
        return selftest()

    problems = run(args.root)
    if problems:
        print(f"{len(problems)} vendor-check problem(s):", file=sys.stderr)
        for p in problems:
            print(f"  ✗ {p}", file=sys.stderr)
        return 1
    print("vendor pins, NOTICE coverage, and the no-CDN/no-npm rule all hold ✓")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
