# Cold pass — the floor block re-stamped at `2a6d7a4` (rule 4, refs-only)

**Board:** `docs/roadmap/040-queued-reviews/050-floor-restamp-2a6d7a4.md`
(`040/050`)
**Status:** BRIEF ONLY 2026-11-14 (UTC) — queued, waiting on Mike's explicit
approval of Fable work. No pass has run. The held-back sibling is
`2026-11-14-0127-floor-restamp-2a6d7a4-cold.deferred.md`, beside this file.

## Provenance

Written by a headless Claude Opus 5.5 brief-writer, session `89a8835d`,
started inside this repo by an estate health sweep (orchestrator session
`58027096`). It wrote none of the delta, ran no review, used no Fable model
and formed no finding. It wrote the held-back sibling named above.

**Barred from taking this pass** (`REVIEW.md` rule 4):

- session `2402c2a3`, which authored the bump, and its dispatching
  orchestrator `e820bff5`;
- this brief-writer (`89a8835d`) and its orchestrator `58027096`.

**Tier: Fable, checked at selection.** A session not on Fable stops; it
neither takes the item on a lower tier nor proceeds hoping the pass is
accepted. An off-tier orchestrator, if any, holds the context partition only:
it forms no finding, writes no severity, and is disclosed in the claim, the
pointer and the verdict. The verdict repeats this provenance (V7).

**Fable-gated:** the pass runs only on Mike's explicit approval of Fable work
at the time. Until then this brief waits.

## Before you read anything

1. **Skip the session-log step of `CLAUDE.md`'s read order.** The log is on
   rule 2's barred list; reading its tail puts the author's words in front
   of you before this brief does.
2. **Check your tree has the delta:**
   `git merge-base --is-ancestor 1da770b HEAD` must exit 0. If it does not,
   stop; an orchestrator merges `origin/main` into the review branch before
   it spawns you.
3. **Resolve atelier.** From a worktree, `../atelier` does not resolve. Use
   `ATELIER="$(git rev-parse --git-common-dir)/../../atelier"`; every command
   below assumes it.

## Subject

- **Delta:** `2b9c623..1da770b`, one commit. The board item's own recipe
  resolves it:
  `git log --diff-filter=A -- docs/roadmap/040-queued-reviews/050-floor-restamp-2a6d7a4.md`
  returns `1da770b`.
- **Read it body-free:**
  `/usr/bin/python3 "$ATELIER/tools/coldsweep.py" --root . --commit 1da770b`
  (add `--path CLAUDE.md` to scope it). That prints the subject, the stat and
  the diff of six files — `.atelier-floor.json`, `.githooks/commit-msg`,
  `.githooks/pre-merge-commit`, `.leakscanbinaries`, `CLAUDE.md`,
  `CONTRIBUTING.md` — and never the message body. Plain `git show` is barred
  until phase 2: it prints the body ahead of the diff, and reading is atomic
  (`REVIEW.md` rule 1).
- **The canonical text:** atelier `docs/method/PROPAGATION.md` at `2a6d7a4`,
  the region between `<!-- floor:begin -->` (line 115) and
  `<!-- floor:end -->` (line 223), and that file's stamp rules directly
  below it. Read with `git -C "$ATELIER" show 2a6d7a4:docs/method/PROPAGATION.md`.
  The previous pin's region is the same file at `0a2b7a7`, lines 105–201.
- **The other canonical sources the delta copies:** atelier
  `tools/commit-msg.sample` and `tools/pre-merge-commit.sample` at `2a6d7a4`;
  the `.leakscanbinaries` rules in atelier `tools/README.md` § *Binary files
  (G3)* at `2a6d7a4`.
- **Intent record** (phase 2 only):
  `docs/sessions/2026-11-13-0624-estate-health-pin-2a6d7a4.md`. It is a claim
  to test, not settled scope.

## Type

Self-authored doctrine by function (`REVIEW.md` rule 3). The floor block is
the safety floor every session here reads first; the two hooks and the
binary-exemption manifest are gates, which count as doctrine by function. The
findings are Mike's to decide; the reviewer applies nothing.

## Why it earns a review

The inlined floor is what binds a session that never opens atelier. A copy
that narrows, widens or garbles the canonical text changes the floor in
silence, and this repo is public, so every byte of it is published. This time
the canonical region itself moved, not just a fill, which is the case the
previous re-stamp pass said still earns a cold pass.

The worst failure modes:

- **A floor obligation lost or altered in the copy**, read as verbatim
  because a tool printed `identical`.
- **A gate that passes when it should block:** a hook that exits 0 when it is
  miswired, or a `.leakscanbinaries` line that exempts bytes nobody looked
  at. The manifest is a silent-failure surface: a listed file is never
  scanned for metadata again while its digest matches.

## Scope and the four lenses — run all four

The whole commitment: the floor copy against its canonical source at the pin,
the fills a child may make, the pin line, the read-order clause the delta
adds, the two added hooks against their samples, the visibility declaration
in `.atelier-floor.json`, and the seven `.leakscanbinaries` entries with the
claims their comment makes. Non-goals are listed below and are the only
narrowing.

- **Approach & assumptions** (most important): name the load-bearing
  assumptions yourself before you read the list below, and attack each by
  probe.
- **Correctness & quality:** does the copy say what the canonical text says,
  no more and no less; are the hooks what their samples are, with only the
  allowed substitution; does each manifest entry hold for the bytes it
  names.
- **Completeness / harvest:** what the re-stamp should have carried and did
  not (an obligation the new canonical text puts on a child, outside the
  floor block, that the delta leaves undone).
- **Security & privacy:** the block and the manifest are public prose; say
  whether anything in them discloses what a public repo must not. The hooks
  are shell: check them for unsafe handling of the commit message they read.
  Run `/security-review` over the two hook files only if the harness ships
  it; a clean pass over markdown is empty by the scanner's own exclusions,
  so weigh it as nothing there.

Run the standing checklist (V1–V7) unasked.

## Load-bearing claims to attack

- **C1** — The inlined block (`CLAUDE.md` lines 2–109, inside the
  `stamp:begin` / `stamp:end` pair) matches the canonical `floor` region at
  `2a6d7a4` word for word, apart from the fills the stamp rules allow.
- **C2** — The board item says the canonical region moved in "eight bullets'
  wording" between `0a2b7a7` and `2a6d7a4`. Measure it.
- **C3** — The pin line names `2a6d7a4`, and `2a6d7a4` is an ancestor of
  atelier's `origin/main`.
- **C4** — `pins.py` reads this repo's floor copy `identical` to the floor
  text at its own pin, and that verdict means what a reader would take it to
  mean (say what the tool actually compares, and how it treats the fills).
- **C5** — `.githooks/commit-msg` and `.githooks/pre-merge-commit` are
  atelier's samples at `2a6d7a4`, with only the atelier-path substitution.
- **C6** — Each of the seven `.leakscanbinaries` lines names the current
  bytes of its file (first 16 hex of SHA-256), and each file carries no
  metadata set, as the manifest's comment states.
- **C7** — `.atelier-floor.json`'s `"visibility": "public"` is the fact.

## Grounding — re-run lines

Each run once by this brief-writer on 2026-11-14 (UTC), from a detached
worktree of `origin/main` at `1da770b`, with `/usr/bin/python3` (Python
3.9.6). Re-run every one; a line that no longer reproduces is a finding,
unless the change is explained by a later commit you can name.

- `/usr/bin/python3 "$ATELIER/tools/floor.py" --plane ci --root .` → exit 0,
  with one advisory: `pdlistscan` (no `docs/PERSONAL-DATA.md`).
- `git -C "$ATELIER" show 2a6d7a4:docs/method/PROPAGATION.md | sed -n '116,222p'`
  diffed against `sed -n 2,109p CLAUDE.md` → three hunks: the heading's
  `<SHA>`; the **Source & drift** bullet's `<atelier-path>` and `<SHA>`; the
  **This repo's visibility** bullet (two placeholder lines become five) and
  the canonical region's own ```` ```markdown ```` fence lines.
- `/usr/bin/python3 "$ATELIER/tools/pins.py" --child .` → the floor copy
  reads `identical`; the pin reads `4 behind` and the run exits 1, because
  atelier's `origin/main` has moved four commits past `2a6d7a4` since the
  bump. None of the four touches `docs/method/PROPAGATION.md`
  (`git -C "$ATELIER" diff --stat 2a6d7a4 origin/main -- docs/method/PROPAGATION.md`
  is empty). Re-measure the count; it will have moved again.
- `git -C "$ATELIER" merge-base --is-ancestor 2a6d7a4 origin/main` → exit 0.
- `git -C "$ATELIER" show 2a6d7a4:tools/pre-merge-commit.sample` diffed
  against `.githooks/pre-merge-commit` → identical. The same for
  `commit-msg.sample` → one changed line (line 35, the
  `hooks.atelierTools` hint: `<atelier-path>/tools` → `../atelier/tools`).
- `/usr/bin/python3 "$ATELIER/tools/leakscan.py" --root . .` → exit 0;
  `7 binary file(s) by .leakscanbinaries`, `0 G3 finding(s)`.
- `shasum -a 256 <file> | cut -c1-16` for each of the seven listed paths →
  each matches its manifest line.
- `gh repo view mike548141/tuhura --json visibility` → `PUBLIC` (a read of a
  live system; read-only).

## Rule 2 — what is barred until your findings are committed

- The landing commit's message body (see *Subject*).
- The session record and `docs/SESSIONS.md`.
- Prior verdicts in `docs/reviews/`, and the board items that carry a prior
  verdict or the author's account of this delta:
  `docs/roadmap/040-queued-reviews/050-floor-restamp-2a6d7a4.md` (this
  pass's pointer; its C2 wording is quoted above, which is all you need),
  `docs/roadmap/040-queued-reviews/040-floor-restamp-0a2b7a7.md` (the
  previous re-stamp's verdict and its owed decisions), and
  `docs/roadmap/010-v1-committed-spine/005-g3-blocks-ci-from-2026-11-18-strip-or-list-binaries.md`
  (the author's done-note on the binaries).
- The held-back sibling.

Search the tree only through `coldsweep.py`, with every barred path excluded:

```sh
/usr/bin/python3 "$ATELIER/tools/coldsweep.py" --root . \
  --also-exclude docs/roadmap/040-queued-reviews/050-floor-restamp-2a6d7a4.md \
  --also-exclude docs/roadmap/040-queued-reviews/040-floor-restamp-0a2b7a7.md \
  --also-exclude docs/roadmap/010-v1-committed-spine/005-g3-blocks-ci-from-2026-11-18-strip-or-list-binaries.md \
  --also-exclude docs/reviews/2026-11-14-0127-floor-restamp-2a6d7a4-cold.deferred.md \
  -i '<pattern>'
```

Its default bar already covers `docs/SESSIONS.md`, `docs/sessions/`,
`docs/ROADMAP-DONE.md` and `docs/reviews/`; the four `--also-exclude` lines
cover the rest. Atelier's own board and doctrine are the parent's state, not
this repo's prior verdicts, and may be read; disclose any atelier item you
read that bears on a finding.

## Non-goals

- Bumping the pin again, or judging whether this repo should be on atelier's
  newer commits.
- The rest of the 340-commit doctrine catch-up beyond the surfaces in
  *Scope*: in scope only where it changed one of them, or where it puts an
  obligation on this repo that the delta should have met (the harvest lens).
- `pdlistscan`'s advisory on the missing `docs/PERSONAL-DATA.md`: an entry
  there in a public repo is Mike's to grant. Note it only if the delta
  misstates it.
- The four earlier owed decisions from the previous re-stamp's pass: in
  scope only where this delta changed what they bear on.

## No live writes

The pass needs no write to any live system. The one live read is
`gh repo view … --json visibility` (read-only). Any step that would write
outside this repo's working tree is NOT RUN.

## The held-back sibling

`2026-11-14-0127-floor-restamp-2a6d7a4-cold.deferred.md`, beside this file,
holds 6 entries. Open it only after your findings are durably written here;
then fold it in below your verdict and delete it (`REVIEW.md` rule 1).
