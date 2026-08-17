#!/usr/bin/env python3
"""board — resolver shim onto atelier's tools/board.py. No policy lives here.

WHY A SHIM AND NOT A COPY. The scanners are atelier's tools, one source; a
child repo does NOT vendor them (`.githooks/pre-commit` says so at length, and
ADR 0008 is why). So this file carries no board logic — it finds atelier's
`board.py` the same way the hook finds `floor.py` and hands argv straight to it.

WHY IT EXISTS AT ALL. `board.py` writes its own remedy into the generated index
and into every failure message: *"run: python3 tools/board.py rebuild"*. In
atelier that is literally true. In a child repo it is not — atelier's tools sit
outside the tree — so the one command a session is told to run when the floor
blocks it would not exist. A resolver shim makes the printed remedy true here
without duplicating a line of policy. (Handed up to atelier as a finding: the
generated remedy string assumes atelier-local tools, and tūhura is the first
child to adopt the split board.)

Usage — the same surface as atelier's:
    python3 tools/board.py            # check: is docs/ROADMAP.md current?
    python3 tools/board.py rebuild    # regenerate it from docs/roadmap/
    python3 tools/board.py --selftest # prove atelier's core offline

Resolution order, matching the hook exactly: ATELIER_TOOLS env wins (so a test
or CI run can redirect without touching repo config), then the baked
`hooks.atelierTools` git config, then the sibling-checkout convention. Fails
closed and loud: a shim that silently did nothing would be worse than no shim,
because the floor would still block and the printed remedy would still lie.
"""

from __future__ import annotations

import os
import runpy
import subprocess
import sys
from pathlib import Path

SIBLING_DEFAULT = "../atelier/tools"


def repo_root() -> Path:
    """This repo's top level — so `board.py` works from any cwd, not just root."""
    try:
        out = subprocess.run(["git", "rev-parse", "--show-toplevel"],
                             capture_output=True, text=True, check=True)
        return Path(out.stdout.strip())
    except (OSError, subprocess.CalledProcessError):
        return Path(__file__).resolve().parent.parent


def git_config(key: str) -> str:
    try:
        out = subprocess.run(["git", "config", "--get", key],
                             capture_output=True, text=True, check=True)
        return out.stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return ""


def atelier_tools(root: Path) -> Path | None:
    for candidate in (os.environ.get("ATELIER_TOOLS", ""),
                      git_config("hooks.atelierTools"),
                      str(root / SIBLING_DEFAULT)):
        if not candidate:
            continue
        path = Path(candidate).expanduser()
        if not path.is_absolute():
            path = (root / path).resolve()
        if (path / "board.py").is_file():
            return path
    return None


def main(argv: list[str]) -> int:
    root = repo_root()
    tools = atelier_tools(root)
    if tools is None:
        print("✗ board: atelier's board.py not found — BLOCKING (fail closed).",
              file=sys.stderr)
        print("  The board tool lives in atelier, not here. Point at it with:",
              file=sys.stderr)
        print("    git config hooks.atelierTools ../atelier/tools",
              file=sys.stderr)
        print("  or set ATELIER_TOOLS in the environment.", file=sys.stderr)
        return 2

    # Default --root to THIS repo, so the shim is cwd-independent. An explicit
    # --root (the floor always passes one) is left exactly as given.
    args = list(argv)
    if "--root" not in args:
        args += ["--root", str(root)]

    sys.argv = [str(tools / "board.py")] + args
    try:
        runpy.run_path(str(tools / "board.py"), run_name="__main__")
    except SystemExit as exc:
        return int(exc.code or 0)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
