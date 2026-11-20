# 2026-11-20 · 2238 UTC · docs/SESSIONS.md retired into the session folder

A headless Opus 5.5 session (`4a5bc1e8`), started inside this repo by an
estate health sweep (orchestrator session `19378351`) to bring the session
log to atelier's current form (atelier board `010/270`). It ran no review. No
Fable model was used.

## What landed

- **The one-file session index is retired; the folder is the index.**
  atelier's `archivecut.py` moved each of the 19 entries in
  `docs/SESSIONS.md` (last changed in `a0cc351`), word for word, near the
  top of the session file it linked, and kept the file's preamble, fenced,
  in a new `docs/sessions/README.md`. Every plan proof passed; `--verify`
  on the committed result prints PASS for `docs/SESSIONS.md` and for the
  earlier `docs/ROADMAP-DONE.md` cut. No `SESSIONS-ARCHIVE.md` ever existed
  here.
- **wrapscan now exempts `docs/sessions/`**, in place of its old
  `docs/SESSIONS.md` entry. The placed entries are one long line each and
  the byte-for-byte rebuild depends on them, so they cannot be rewrapped;
  atelier exempts the same folder. The cost: new session files are no
  longer column-checked at commit time.
- **Instructions now name the folder, not an index:** the `CLAUDE.md` read
  order (read the newest few files) and closing rule (write this session's
  own file), `CONTRIBUTING.md`'s *Log the session*, the `README.md` session
  context line, and the `docs/ARCHITECTURE.md` layout block. The board
  index was already current.

## Left as found

- `pathscan` (warn-only) reports six references to the retired path in
  records: the 2026-08-17-1229 ADR on the session-log split and the board
  item `040/010`. Records are left as written.
- The floor's other advisories, from before this session: `pointerscan` on
  the `040/050` state line, `pdlistscan` on the missing
  `docs/PERSONAL-DATA.md`, and `attribscan` on one placed entry's wording.
- The atelier pin `2a6d7a4` is far behind atelier's mainline and the floor
  has changed since; bumping it was outside this session's task.

## Identifiers

- **Session:** `4a5bc1e8`, Opus 5.5, started 2026-11-20 22:38 UTC by
  orchestrator session `19378351`.
- **Commits:** `e585bca` (the retirement and the wrapscan exemption); the
  commit that rewords the instructions and adds this file.
- **Pull requests:** none.
- **Board:** none touched.
- **Worktrees and branches:** a detached worktree at `origin/main`, removed
  by the launcher.
- **Agents:** none launched.
