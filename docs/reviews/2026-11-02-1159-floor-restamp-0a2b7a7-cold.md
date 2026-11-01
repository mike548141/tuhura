# Cold pass — the floor block re-stamped at `0a2b7a7` (rule 4, refs-only)

**Status:** BRIEF ONLY — the review has NOT run. Written 2026-11-02 1159
UTC for board item `040/040`, which queued the pass on 2026-10-26 and left
the brief to its taker. **Fable-gated:** the pass runs only on Mike's
explicit approval of Fable work at the time. The verdict goes below a
divider in this file (atelier `REVIEW.md` § *The lifecycle*).

## Provenance

This brief was written by a brief-writing sub-agent (Claude Opus 5.5) of
session `2be3482c`, on Mike's instruction of 2026-11-02, verbatim: *"Write
briefs for anything that needs a review in any of the repos, where a brief
is not ready"*. It wrote none of the delta, ran no review, and formed no
finding. It wrote the held-back sibling named below.

**Barred from taking this pass** (rule 4):

- session `9172eab0`, which authored the bump (its record:
  `docs/sessions/2026-10-26-1009-pin-bump-0a2b7a7.md`);
- this brief-writing sub-agent and its parent session.

**Tier: Fable, checked at selection.** A session not on Fable stops, and
neither takes the item on a lower tier nor proceeds hoping the pass is
accepted (`REVIEW.md` rule 4). An off-tier orchestrator, if any, forms no
finding, writes no severity, and is disclosed in the claim, the pointer and
the verdict. The verdict repeats this provenance.

## Subject

- **Delta:** `29b463b..cd543c9` — one commit, `cd543c9`, resolved from the
  item's own recipe
  (`git log --diff-filter=A -- docs/roadmap/040-queued-reviews/040-floor-restamp-0a2b7a7.md`
  returns `cd543c9`). Files: `CLAUDE.md` (the inlined floor block and its
  pin), `docs/ROADMAP.md`, the queued-reviews README and item `040/040`, and
  the session record.
- **Read it body-free:** from the primary checkout,
  `/usr/bin/python3 ../atelier/tools/coldsweep.py --commit cd543c9`
  (add `--path CLAUDE.md` to scope it). Plain `git show` is barred until
  phase 2: it prints the body ahead of the diff, and reading is atomic
  (`REVIEW.md` rule 1).
- **The canonical text:** atelier `docs/method/PROPAGATION.md` at
  `0a2b7a7`, the region between `floor:begin` and `floor:end`, and that
  file's stamp rules. From a worktree, `../atelier` does not resolve; use
  `ATELIER="$(git rev-parse --git-common-dir)/../../atelier"` and
  `git -C "$ATELIER" show 0a2b7a7:docs/method/PROPAGATION.md`.
- **Intent record** (phase 2): the session record named above. It is a
  claim to test, not settled scope.

## Type

Self-authored doctrine by function (`REVIEW.md` rule 3): the floor block is
the safety floor every session here reads first. Findings are Mike's to
decide; nothing is applied by the reviewer.

## Why it earns a review

The inlined floor is what binds a session that never opens atelier. A copy
that drifts from the canonical text, narrows it, or adds to it changes the
floor silently, and the repo is public, so every byte of it is published.
The author's record says this repo's stamp check cannot judge a child's
floor copy, so no machine has compared it.

## Scope and the four lenses — run all four

The whole commitment: the copy against its canonical source at the pin,
the substitutions a child is allowed to make, the pin line, and anything
else the delta changed. Approach & assumptions first: name the load-bearing
assumptions yourself before reading the list below. Security & privacy:
the block is public prose; say whether anything in it discloses what a
public repo must not, and discharge `/security-review` in one line (no code
in the delta). Run the standing checklist (V1–V7) unasked.

## Load-bearing claims to attack

- **C1** — The inlined block matches the canonical `floor` region at
  `0a2b7a7` word for word, apart from the substitutions the stamp rules
  allow.
- **C2** — The only wording change since the previous pin is the
  **Estate resources** bullet.
- **C3** — The pin line names `0a2b7a7`, and `0a2b7a7` is an ancestor of
  atelier's `origin/main`.
- **C4** — The checks the author ran (`floor.py --plane ci`) passed before
  and after, and the stamp check's inability to judge a child's copy is as
  the record states.

## Grounding — re-run lines

Each run once by the brief-writer on 2026-11-02, from a fresh worktree of
`origin/main` at `da5259e`. Re-run every one; a line that no longer
reproduces is a finding.

- `/usr/bin/python3 "$ATELIER/tools/floor.py" --plane ci` → exit 0.
- `git -C "$ATELIER" show 0a2b7a7:docs/method/PROPAGATION.md | sed -n
  '106,200p'` (the lines between the two fences) diffed against
  `sed -n 1,99p CLAUDE.md` → 20 changed lines in three hunks: the opening
  fence and pin line, the drift bullet's atelier path and pin, and the
  visibility bullet and closing fence.

## Rule 2 — what is barred until your findings are committed

- The landing commit's message body (see *Subject*).
- The session record and `docs/SESSIONS.md`.
- Prior verdicts in `docs/reviews/`; search with `coldsweep.py`, whose
  default bar excludes them.

## Non-goals

- The rest of the pin bump's doctrine catch-up beyond the floor block (the
  session record lists it): in scope only where it changed the block.
- Bumping the pin again.

## The held-back sibling

`2026-11-02-1159-floor-restamp-0a2b7a7-cold.deferred.md`, beside this
file, holds 3 entries. Open it only after your findings are durably written
here; then fold it in below your verdict and delete it (`REVIEW.md`
rule 1).
