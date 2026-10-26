# Cold pass — the seam fixes' application (rule 4, refs-only)

**Status:** BRIEF ONLY — the review has NOT run. Written 2026-10-26 09:10
UTC for board item `040/030`. The pass is for a cold Fable session to run;
the verdict goes below a divider in this file (atelier `REVIEW.md` § *The
lifecycle*).

## Provenance

This brief was written by a headless brief-writing session (Claude Opus 5.5,
session `49c917e1`), started on Mike's instruction of 2026-10-26 to have every
owed brief ready for a reviewer. That session wrote none of the delta, ran no
review, and formed no finding. It wrote the held-back sibling named below.

**Barred from taking this pass** (rule 4: the review comes from a session the
author neither started nor instructed):

- the session that applied the fixes: the 2026-09-20 22:36 UTC cold-pass
  session, resumed 2026-09-25 (its record:
  `docs/sessions/2026-09-25-0118-seam-findings-applied.md`). It also wrote
  the verdict it applied, so both authorships fail the criterion;
- the 2026-09-20 orchestrated queue run and any worker it dispatched, which
  built the seam these fixes edit;
- this brief-writing session.

**Tier: Fable, checked at selection.** A session not on Fable stops, and
neither takes the item on a lower tier nor proceeds hoping the pass is
accepted (`REVIEW.md` rule 4). If the pass runs as reviewer plus an off-tier
orchestrator, the orchestrator forms no finding and writes no severity, and
the arrangement is disclosed in the claim, the queue pointer and the
verdict's provenance. The verdict repeats this provenance.

## Subject

The application of the 2026-09-20 seam cold pass's eleven findings, on
Mike's ruling of 2026-09-25 (rule 3: accept all, apply now). Built and
merged; not run on a device.

- **Delta:** `22b4cde..21f48a6` — one commit, `21f48a6`. The bound is the
  item's own recipe resolved:
  `git log --diff-filter=A -- docs/roadmap/040-queued-reviews/030-seam-fixes-application.md`
  returns `21f48a6`. Merged to `main` at `afe45c5`.
- **Adjacent, in scope:** `e79742b` (a `.gitignore` change merged in the
  same branch, after the bound). Nothing excludes it, so it is in scope.
- **Read the landing commit body-free:** run, from the repo root,
  `/usr/bin/python3 ../atelier/tools/coldsweep.py --commit 21f48a6`
  (add `--path <p>` to scope it). It prints the subject, stat and diff and
  never the message body, with rule-2 barred files left out. Plain
  `git show` is barred until phase 2 because it prints the body, the
  applier's own account, ahead of the diff, and reading is atomic
  (`REVIEW.md` rule 1). The body is read in the reconcile.
- **Intent record:** the *Addendum 2026-09-25* section of
  `docs/decisions/2026-09-20-1116-archive-store-seam.md`. The addendum
  states what the application claims to have done; it is a claim to test,
  not settled scope.
- **Code and tests at HEAD:** `site/js/storage/` (`chunking.js`,
  `errors.js`, `naming.js`, `opfs-archive-store.js`), `tests/` (all five
  test files, including the in-memory OPFS stand-in in
  `tests/storage-opfs.test.js`), `tools/make_fixture_pmtiles.py`.
- **The consumer contract:** the vendored `site/vendor/pmtiles/pmtiles.js`
  (4.5.0) — `PMTiles`, `FileSource`, `FetchSource`, and how `Protocol` keys
  archives.
- **Docs the delta edits:** `docs/ARCHITECTURE.md`, the P0-D item
  `docs/roadmap/010-v1-committed-spine/014-p0-pmtiles-opfs-and-map-lifecycle.md`,
  `CLAUDE.md` (the pin line in the inlined floor block), the queued-reviews
  README and this pass's own item.
- **Doctrine surface:** atelier `REVIEW.md` § *Applying decisions to
  doctrine — and when the cycle stops*, and rules 3–4. The work was made
  under the pin `548b706`; read the doctrine there for what it had to meet
  (`git -C ../atelier show 548b706:docs/method/REVIEW.md`). Atelier's
  mainline has moved since (585 commits at 2026-10-26); run the pass itself
  by mainline doctrine.

## Type

Built work that is also direction. The addendum changes rules every later
region feature and the MapLibre wiring build on: the bounds rule, the write
contract, the error set, the archive key. Rule 3 applies: findings are
Mike's to decide; the applier records counsel only.

## Why it earns a review

The seam is the one path every offline map tile will take. Its worst
failure is silent: a partial or stale archive served as a whole one, or a
read that works in tests and fails on a phone with no signal, days from
help. The application also closes the findings of its own author's verdict,
and its `[fixed]` stamps were set by that same session. Nobody independent
has driven the fixes.

## Scope and the four lenses — run all four

Scope is the whole commitment: the ruling's intent, the decisions in the
addendum, the code, the tests (a wrong test verifies nothing), the docs,
and real-world behaviour, exercised live wherever this machine allows. An
impossibility claim states its grounds.

1. **Approach & assumptions** — the most important. Name the load-bearing
   assumptions yourself, as your first act, before reading the list below.
2. **Correctness & quality** — does each applied fix do what the addendum
   says; anything overclaimed, stubbed, or silently cut.
3. **Completeness / harvest** — what the application should have covered
   and did not; every mirror site of a changed rule (`REVIEW.md` V3).
4. **Security & privacy** — a must. The addendum enumerates threats; test
   that enumeration, don't adopt it. Check likely vectors against open
   catalogues (OWASP Top 10 / ASVS), not memory. Aim `/security-review` at
   the JS delta where it can reach it; a clean scan over markdown is empty
   by the scanner's own exclusions. Never run it over this file while the
   sibling below still exists.

Run the standing checklist (V1–V7) unasked.

## Load-bearing claims to attack

The work's own claims, in its own terms — a floor, never a fence. Damage
each with a probe or confirm it by re-driving it; reasoning about it is not
enough.

- **C1** — The seam's handle works under the real `new pmtiles.PMTiles()`
  on archives both under and over 16 KiB, and the offset-0 clamp is the only
  departure from "thrown, never clamped".
- **C2** — A failed write leaves `bytesWritten` equal to the bytes on disk;
  the same chunk can be retried; `commit()` cannot publish short.
- **C3** — The fixture generator's TileIDs are a bijection matching the
  vendored library's `zxyToTileId`.
- **C4** — With no `move()`, commit stops typed and the staging file stays
  intact and resumable.
- **C5** — Every seam error round-trips through JSON across the worker
  boundary with class, fields and `instanceof` intact.
- **C6** — Writes are versioned; a staging file for another version is
  refused, never spliced.
- **C7** — The error set is ten, `delete()` is idempotent, and the ADR,
  ARCHITECTURE and the P0-D item now say what the code does.
- **C8** — `getKey()` changes when an archive's bytes change and is stable
  across `open()` of the same archive.
- **C9** — The in-memory OPFS stand-in proves the backend's logic, and
  only the platform's own behaviour still needs a browser.
- **C10** — The addendum's threat enumeration is complete for this surface.
- **C11** — The process claims: the principal's ruling recorded as the
  ADR's acceptance; the pin bump in the same commit was deliberate and the
  inlined floor block matches canonical at `548b706`; the application's own
  `⏳` queued in the landing commit, refs only.

## Grounding — re-run lines

Each line was run once by the brief-writer on 2026-10-26, from the repo root
of a fresh worktree at `e5c235f`. Re-run every one; a line that no longer
reproduces is a finding.

- `node --test` (pass no path) → 55 tests, 55 pass, about 0.8 s, Node
  v24.18.0.
- `/usr/bin/python3 ../atelier/tools/floor.py --plane ci` → exit 0. Two
  advisory lines: leakscan G3 (seven binary findings, warning until
  2026-11-18) and the board index under the previous projection (atelier
  `320/730`'s stopgap, within its grace).
- `/usr/bin/python3 tools/make_fixture_pmtiles.py --out <scratch>/fx.pmtiles`
  → 680 bytes, 5 tiles, spec revision `8b8ddea`.
- `/usr/bin/python3 ../atelier/tools/coldsweep.py --commit 21f48a6` →
  subject, an 18-file stat, and the diff, with no message body.
- `gh run list -L 3` → `floor` and `CI` success at `e5c235f`.

Recorded proofs in the delta are the work's own: the tests above, and the
addendum's statements of what was proven. Re-run the proofs; don't cite
them.

## Rule 2 — what is barred until your findings are committed

"Committed" means durably written to your draft of this file.

- The prior verdict `docs/reviews/2026-09-20-2236-archive-store-seam.md`,
  including the `[fixed]` stamps the delta added to it. Search the tree
  with `coldsweep.py`, whose default bar excludes it. Open it in the
  reconcile, to check each `[fixed]` claim, never to anchor.
- The landing commit's message body (see *Subject*).
- The session records on the onramp path — the `docs/SESSIONS.md` line for
  2026-09-25 and its detail file — carry the applier's evaluative account.
  If your onramp reads them, treat them as claims and disclose that you
  did. The P0-D item's 2026-09-25 paragraph is part of the delta and is a
  claim too.

## Non-goals

- The runtime half on a real device: OPFS under the installed PWA, `move()`
  and quota on target browsers (still owed on P0-D, not by this delta).
  Whether that boundary is drawn where the addendum draws it is in scope
  (C9).
- MapLibre `pmtiles://` wiring, WebGL context loss and its feature gate —
  not built.
- Commits after `e79742b` that touch nothing in the delta.

## The held-back sibling

`2026-10-26-0910-seam-fixes-application-cold.deferred.md`, beside this
file, holds the brief-writer's own angles. Open it only after your findings
are durably written here; then fold it in below your verdict and delete it
(`REVIEW.md` rule 1).
