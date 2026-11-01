# Cold pass — the seam fixes' application (rule 4, refs-only)

**Status:** PASS — no MAJOR; 8 MINOR, 4 NOTE after act 2. The pass ran
2026-11-02 (act 1 at `7f29272`, act 2 the same day); verdict below the
divider. Brief written 2026-10-26 09:10 UTC for board item `040/030`
(atelier `REVIEW.md` § *The lifecycle*).

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
file, held the brief-writer's own angles. Open it only after your findings
are durably written here; then fold it in below your verdict and delete it
(`REVIEW.md` rule 1). Folded 2026-11-02: its text is now the last section
of this file, and the sibling file is deleted.

---

## Verdict — PASS, no MAJOR (act 1, 2026-11-02)

Six MINOR, three NOTE, zero MAJOR. Every applied fix does what the
addendum says it does, and the three defects the 2026-09-20 pass called
MAJOR are closed on evidence I re-drove, not on the applier's word. What
remains is a stale platform-confirm list, three untyped error paths beside
a "ten errors, never a bare one" claim, one test whose name outruns its
stub, and a mirror sweep that stopped one file short. Under `REVIEW.md`
§ *Applying decisions* a pass with no MAJOR closes the cycle: the
findings below are decided into the backlog, and their application does
not spawn another full ceremony.

### Provenance (rule 4, V7)

Reviewer: Claude Fable 5.1, tier checked at selection. Spawned by a
headless orchestrator session (Claude Opus 5.5), itself started by drain
session `c87c4ee0` (Opus 5.5). Both are rule-4 off-tier orchestrators:
they hold the context partition, form no finding and write no severity.
The reviewer was not started or instructed by any session the brief
bars: not the session that applied the fixes (the 2026-09-20 22:36 UTC
cold-pass session, resumed 2026-09-25), not the 2026-09-20 orchestrated
queue run or any worker it dispatched, and not the brief-writing session
`49c917e1`. Run under the principal's drain approval of 2026-11-02.

Run from a fresh worktree at `88f5a33` (detached, `origin/main`), Node
v24.18.0, `/usr/bin/python3`. Doctrine read from the atelier checkout's
`origin/main` (`6a16918`) after a fetch; the pinned doctrine was read at
`548b706`.

### Disclosures

- Onramp: I did not open `docs/SESSIONS.md`, any `docs/sessions/` file,
  `docs/ROADMAP-DONE.md` or the prior verdict. The P0-D item's 2026-09-25
  paragraph is part of the delta and was read as a claim. The board item
  `040/030` at HEAD was read for the claim's disclosure text only.
- The held-back sibling was absent from the worktree (held by the
  orchestrator); I did not look for it anywhere.
- The landing commit was read body-free with `coldsweep.py --commit`.
- Tree sweeps: my first two `grep` calls named non-barred paths
  explicitly (`docs/ARCHITECTURE.md`, `docs/roadmap`, `docs/decisions`,
  `CLAUDE.md`, `README.md`, `CONTRIBUTING.md`); they printed nothing from
  a barred path. Rule 2 asks for the tool, not a hand exclusion, so the
  sweep was repeated with `coldsweep.py` (`--also-exclude` on the item and
  this brief; 31 files barred), which is what the mirror findings cite.
- `/security-review` was NOT run, with grounds under lens 4 below.
- No network beyond `gh run list -L 3`; no device, no browser.

### Lens 1 — the assumptions I named first, and what broke

Named before the C-list was read closely, then attacked:

- **A1** pmtiles only reads past EOF at offset 0. Held: the vendored
  4.5.0 reads `[0, 16384)` once in `getHeaderAndRoot`; every later read
  is directory-driven. Its own `FetchSource` re-requests `bytes=0-(n-1)`
  on a 416, so the clamp is the library's own precedent, as the addendum
  says.
- **A2** `File.lastModified` is a reliable change signal on OPFS. Not
  provable here; the stub fixes it at a constant, so the suite cannot
  see a platform that returns a constant either (G1, G3).
- **A3** the stand-in models the platform rules the tests lean on. It
  throws quota before writing, overwrites on `write(at)`, allows one sync
  handle per file, and its `move()` silently replaces an existing
  destination. The last is an assumption the ADR never states (G1).
- **A4** every error crossing the seam is one of the ten. Broke in three
  places (G2).
- **A5** manifest fields are trusted. The enumeration treats only
  archive bytes as untrusted (G6).
- **A6** the tests' names match what their assertions prove. One does
  not (G3).
- **A7** the generator matches the library beyond z4. Held to z8
  exhaustively and 3,000 random tiles to z26.
- **A8** only uncompressed, root-directory-only archives have been driven
  under `PMTiles`. True of the suite; I drove a gzip-compressed 341-tile
  archive through the seam handle (header, tile and metadata reads) and
  it held. Leaf directories remain ungenerated (the generator says so),
  so that path is still exercised only by reasoning: it is `getBytes`
  with other numbers.
- **A9** every mirror of a changed rule was swept. Three were not (G4).
- **A10** the floor block equals canonical at `548b706`. Held (C11).

The brief's framing survived attack: the delta bound resolves to the one
commit `21f48a6`; `e79742b` is in scope and benign (it ignores
`tools/__pycache__/`, which `node --test` does create — verified by
`git status --ignored` after the run); nothing after `e79742b` touches a
delta file. The non-goal that fences off the device half is legitimate —
OPFS, `move()` and quota genuinely need a browser — but the *content* of
that fence is stale, which is G1.

### The load-bearing claims, re-driven

- **C1 — confirmed, and extended.** `tests/storage-opfs.test.js` drives
  the handle under `new pmtiles.PMTiles()` at 680 bytes and at 17 KiB.
  My probe added a gzip-compressed 341-tile archive (17,306 bytes) read
  through the seam: 341 addressed tiles, `z4/15/15` payload correct,
  `getMetadata()` returns the fixture's name. The clamp fires only at
  offset 0 and only when `length > size`; `getBytes(1, 16384)`,
  `getBytes(150, 51)` and `getBytes(200, 1)` on a 200-byte archive throw
  `OutOfRangeReadError` (the suite's test, re-run).
- **C2 — confirmed.** Quota failure leaves `bytesWritten` at 8 of 16, the
  retry at offset 8 is accepted, `commit()` throws `ArchiveCorruptError`
  until every byte lands, and the staging name is the only file on disk.
  The caveat is the stand-in's: it throws before writing. A platform that
  lands part of a chunk and then throws leaves the file ahead of the
  tracker; a same-session retry at `at: offset` overwrites, and a fresh
  session resumes from `getSize()`, so the bytes are a correct prefix
  either way. Not a defect; it belongs on the device list (G1).
- **C3 — confirmed, and extended.** The suite compares 341 tiles. I
  compared 90,381: z0–z8 exhaustive (87,381 distinct ids, a bijection
  onto 0..87380) plus 3,000 random tiles at z9–z26. Zero mismatches
  against the vendored `zxyToTileId`.
- **C4 — confirmed for the case tested; incomplete.** With no `move()`,
  `commit()` throws `ArchiveStoreUnsupportedError` and the 4-byte staging
  file stays. When `move()` exists and *rejects*, the rejection crosses
  the seam as a bare `NoModificationAllowedError`, the writer is already
  closed (`#closed = true` is set before the `await`), and the staging
  file is intact and resumable at 4 by a fresh `write()` (G2a).
- **C5 — confirmed for the ten.** `toJSON` → string → `fromJSON`
  rebuilds class, message, fields and `instanceof` for every sample,
  including `availableBytes: undefined`. An unknown code revives as a
  plain `ArchiveError`. The gap is what is *not* one of the ten (G2).
- **C6 — confirmed.** `.w.etag1.pmtiles.part` seeded; `write("w", 10,
  "etag2")` throws `ArchiveVersionMismatchError` with both versions;
  `write("w", 10, "etag1")` resumes at 6 and commits `[5×6, 6×4]`.
- **C7 — code confirmed; docs partly.** Ten classes, ten distinct codes,
  `delete()` idempotent on a missing id and a never-existing id. The ADR
  addendum, ARCHITECTURE and the P0-D 2026-09-25 paragraph say what the
  code does; the ADR's Decision block and the P0-D opening paragraph
  still say what the old code did (G4).
- **C8 — half confirmed.** `getKey()` is `k@<lastModified>` and stable
  across `open()`. "Changes when the bytes change" is not shown: the
  stand-in's `lastModified` is a constant, so a re-download under a
  different version returned the identical key `k@1700000000000` in my
  probe. With a ticking clock the key does change. The property rests on
  the platform (G1, G3).
- **C9 — the boundary is drawn in the right place; the far side is
  under-described.** The stand-in proves the logic (staging → commit,
  quota, resume, version refusal, bounds under the real parser). The
  list of what the platform must confirm is stale and misses the two
  platform assumptions the fixes themselves introduced (G1).
- **C10 — present, not complete** (G6).
- **C11 — confirmed.** The floor block at `21f48a6` differs from
  `548b706:docs/method/PROPAGATION.md`'s `floor:` region only where the
  template's placeholders (`<SHA>`, `<atelier-path>`, `<visibility
  fact>`, `<owner/repo>`) are filled; the pin line and the drift command
  both read `548b706`. The ADR addendum records the principal's ruling as
  the record's acceptance. The `⏳` item was added by `21f48a6` itself,
  refs only; its text is process, not evaluation. Doctrine at `548b706`
  already held § *Applying decisions* and rules 3–4 in their present
  wording; mainline has since added only the side-door paragraph and the
  V1–V7 checklist, so the work meets both.

### Findings

**G1 — MINOR — the platform-confirm list is stale and misses the two
assumptions the fixes added.** The P0-D item (lines 56–60) still asks a
browser session to confirm "whether `FileSystemFileHandle.move()` exists
on the target browsers or the copy-then-delete fallback is the live
path"; F4 removed that fallback in this delta. ADR Consequences (line
217) still names "the copy fallback". Neither names (a) `move()`
*replacing an existing committed file* — the stand-in does it silently,
the ADR never states it as a requirement of `commit()`, and no test in
the suite commits a second version over a committed first (my probe
did; the logic holds in the stub); nor (b) `File.lastModified` from OPFS
`getFile()` as a change signal that survives `move()` — the whole of
F11. Both are exactly "the platform's own behaviour" C9 says is still
owed, and a device session reading the list as written would not test
either. The addendum's compat claim for `move()` (Safari 15.2, Chrome
102, Firefox 111) is NOT VERIFIED here: no network. Fix: rewrite the
confirm paragraph; add a stub test for v2-over-v1 commit; consider
carrying the version into the committed name (`<id>.<version>.pmtiles`)
so `getKey()` can be `<id>@<version>`, platform-free, and `list()` can
report what is installed — which also answers G5.

**G2 — MINOR — three untyped paths beside "exactly these classes, never a
bare Error or a platform-native one"** (`errors.js` lines 1–8; ADR F7
"the error set is ten"). (a) `commit()`: a rejecting `move()` surfaces
as the platform's DOMException (probe: `NoModificationAllowedError`,
`toJSON` gives `{"name":…}` only) with the writer already closed; the
addendum's "where absent the write stops typed" covers only the missing
method. (b) `append()`: a chunk overrunning the declared total throws a
bare `RangeError` from `assertNext` (probe: `JSON.stringify(err)` is
`{}`, so it cannot cross `postMessage` as anything). The code calls this
a caller bug, but a server that ignores `Range` and returns a whole body
produces it from the network, not from `planChunks`. (c) `getBytes()`
on a handle whose file was deleted or re-downloaded: the class comment
says reads "start failing" with `NotReadableError`; nothing wraps it.
Fix: wrap (a) and (c) in seam errors (busy/corrupt, or a stale-handle
class), make (b) an `OutOfOrderWriteError`-class typed error, or narrow
the header claim to say which paths are excluded. Nit on the same
surface: on the quota path `availableBytes = est.quota - est.usage` is
not null-checked (unlike `quota()`), so an `estimate()` returning no
numbers yields `NaN`, which JSON turns into `null` and the revived
message into "an unknown amount available" — the one case where the
message does not round-trip.

**G3 — MINOR (V1) — a test named for a property its stub cannot show.**
`getKey changes when the committed bytes do` asserts the key's shape and
its stability across `open()`; the stand-in's `lastModified` is
`1_700_000_000_000` for every file, so a re-download yields the same key
(probe above). Rename it to what it proves, or give the stand-in a
clock and assert the change.

**G4 — MINOR (V3) — F10's sweep stopped one file short of the delta and
missed two outside it.** `FileSource` survives as the seam's read path
in the P0-D item's opening paragraph (line 4, in a file the delta
edited), in `docs/WORKPLAN.md:20` ("wire `FileSource` → `pmtiles://`")
and in the `site/sw.js:14` comment ("read from OPFS via pmtiles'
FileSource"). The ADR's Decision block — the thing a builder copies —
still shows `store.write(id, totalBytes)` without `version`, `list()`
without `version`, "the five typed errors below" and "Five typed errors",
with no marker pointing at the addendum that supersedes each. The
addendum pattern is sound; the superseded lines need an inline
"superseded by addendum F6/F7" mark or a struck signature. The research
notes and the 2026-08-08 ADR are historical records and are not mirror
sites.

**G5 — MINOR (harvest) — the committed archive forgets its version.** F6
names the version on the staging file only; `commit()` moves it to
`<id>.pmtiles` and the token is gone. `list()`'s `ready` entries carry no
`version`, so the "expected regions" manifest ARCHITECTURE describes
(§ Offline data lifecycle — "versioned resumable full re-downloads",
ETag/If-Range) cannot tell from the seam which build is installed. A
workaround exists — the archive's own JSON metadata `version` via
`PMTiles.getMetadata()` — and is unstated. See G1's fix.

**G6 — MINOR (lens 4) — the threat enumeration is incomplete.** It names
archive bytes as the only untrusted input. The manifest's `totalBytes`
and `version` arrive over the same network: `version` is grammar-checked
(good, and tested against traversal shapes), `totalBytes` is bounded
only by quota — acceptable while the manifest is the project's own, but
that condition should be stated as (ii) states it for archives. Two
boundaries are unnamed: the worker→main message, where
`archiveErrorFromJSON()` builds an error from any `{code, message}`
(same-origin, so acceptable — say so); and `storage.estimate()`'s
numbers, never validated (the `NaN` in G2). Nothing here is exploitable
as built; the enumeration is what the lens asks for and it is short.

**G7 — NOTE — `InvalidArchiveIdError` carries a version in its `id`
field.** `assertValidArchiveVersion("Bad-Version")` throws with
`err.id === "Bad-Version"`; a consumer printing `err.id` as the archive
name shows the version token. A `field` discriminator or a distinct
class would fix it; the ten-count would then be eleven, and the ADR
should say so.

**G8 — NOTE — grounding drift since `e5c235f`.** `floor.py --plane ci`
exits 0, but the advisory set differs from the brief's: secretscan
reports five low-variety-entropy advisories (SHA pins in `ci.yml`, the
spec revision in the generator, `tools/deploy.json`) — hashes, not
secrets; the board line is clean; leakscan's advisory text changed. Not
a finding on the delta; recorded so the next pass knows the brief's
grounding line was already stale.

**G9 — NOTE — the ADR's `**Review**:` line reads "done — cold pass
2026-09-20"** while its addendum carries an open `⏳`. The record's own
review line should name the application pass as queued/run.

### Standing checklist (V1–V7)

- **V1** — three overclaims, none load-bearing for safety: G2 (the
  header's "never a bare Error"), G3 (the test name), and the P0-D
  paragraph's "F3 … a proven bijection over z0–z4" is true as stated
  (and holds to z8).
- **V2** — every grounding line re-run; results under *Re-run lines*.
  The addendum's "tested under `new pmtiles.PMTiles()` on archives both
  under and over 16 KiB" re-run and extended; its "55 tests" re-run.
- **V3** — G4.
- **V4** — the write signature and the error count each have two homes
  in the ADR (Decision block vs addendum) with no stamp between them: G4.
- **V5** — the ADR body contradicts its addendum on `delete()`,
  `write()`'s arity and the error count by design of the addendum
  pattern, without markers (G4); `errors.js`'s header contradicts
  `chunking.js`'s `RangeError`s (G2).
- **V6** — below.
- **V7** — provenance stated above; it matches the claim on the board
  item.

### Security & privacy (lens 4, V6)

`/security-review` NOT RUN, with grounds: it scans pending changes on
the current branch, and the only pending change in this worktree is the
orchestrator's removal of the held-back sibling — a `git diff` of that
deletion prints the barred text as `-` lines, which is the exact
exposure the brief forbids. The landed delta is not a pending change and
the skill takes no target. Discharged, not skipped: the code-altitude
pass was done by hand.

Catalogue: the online OWASP Top 10 / ASVS were out of reach under the
network bar; I checked against atelier's recorded ASVS chapter map
(`docs/sessions/2026-07-22-1025-security-canon-gap-map.md`, v4.0.3
domains), which is a local copy of the catalogue, not memory.

- *V5 validation / V12 files* — path traversal through the id or
  version: excluded by grammar (`^[a-z0-9]+(?:-[a-z0-9]+)*$`,
  `^[a-z0-9]+$`), tested against `../etc`, `/`, leading `.`, whitespace,
  uppercase and the length cap. `list()` ignores strangers rather than
  failing. Held.
- *Untrusted bytes* — the bounds rule stops reads past EOF; the clamp is
  offset-0-only and a crafted archive with `tileDataOffset = 0` could at
  most read its own header back (the addendum's (ii) covers this and
  defers it to the day archives come from elsewhere). Held.
- *Resource exhaustion* — a hostile manifest can fill the origin quota;
  user-driven and bounded by the platform (G6 asks for the condition to
  be stated).
- *Race / TOCTOU* — two `write()`s for one id both pass the version scan;
  the second fails typed at `createSyncAccessHandle` (`ArchiveBusyError`,
  re-run). `delete()` during a write is typed busy. Held.
- *V7 error handling* — the untyped paths in G2; no secrets or paths in
  any message beyond the archive id and a reason string.
- *Privacy* — origin-private storage, public map tiles, no PII in any
  name or error; `getKey()` embeds a timestamp that never leaves the
  page. Nothing exposed.
- *Repo hygiene* — the secretscan advisories (G8) are SHA pins and a spec
  revision; no secret in the delta. `tests/fixtures/` and
  `tools/__pycache__/` are ignored so a manual run cannot stage a blob.

### Re-run lines (brief § Grounding)

- `node --test` → 55 tests, 55 pass, 0.6 s, Node v24.18.0. Reproduces.
- `floor.py --plane ci` → exit 0. Reproduces; advisory set drifted (G8).
- `make_fixture_pmtiles.py --out <scratch>/fx.pmtiles` → 680 bytes, 5
  tiles, spec revision `8b8ddea`. Reproduces.
- `coldsweep.py --commit 21f48a6` → subject, 18-file stat, diff, no
  body. Reproduces.
- `gh run list -L 3` → `floor` and `CI` success at `88f5a33` (the brief
  saw `e5c235f`; HEAD has moved). Reproduces.

Probes beyond the brief were run from scratch copies in a scratch
directory against the worktree's modules by absolute path; nothing was
written under the repo, and the scratch directory was removed when done.

### Not run, with grounds

- OPFS under the installed PWA, `move()` and `lastModified` on target
  browsers, real `estimate()`/`persist()` numbers: no device, and a
  stated non-goal. G1 is what that session must now read.
- Leaf-directory archives under the seam: the generator cannot produce
  one; the read path is `getBytes` with different numbers and was
  exercised for header, root directory, metadata and tile reads.
- The compat claim for `move()`: network barred.

### What this means for the cycle

No MAJOR, so per `REVIEW.md` § *Applying decisions to doctrine* this is
the terminal application review: G1–G9 are the principal's to decide
under rule 3 (the addendum is self-authored direction), they go to the
backlog once decided, and their application closes without a queued
pointer. If the principal wants one thing fixed before the downloader is
built, it is G1's confirm list, because a device session will otherwise
test the wrong things.

**Tally: MAJOR 0 · MINOR 6 (G1–G6) · NOTE 3 (G7–G9).**

## Act 2 — the reconcile (2026-11-02, after act 1 landed at `7f29272`)

Opened in this order, each after act 1 was committed: the held-back
sibling (handed over by the orchestrator), then the prior verdict
`2026-09-20-2236-archive-store-seam.md` with its `[fixed]` stamps, then
the landing commit's message body. Nothing below changes a severity
assigned in act 1; two findings and one note are added, and one act-1
finding grows its list.

### Rule 2 — the prior verdict's stamps and the commit body

Each `[fixed]` stamp against what act 1 re-drove:

- **F1–F6, F8, F9 [fixed]** — verified as stamped; the proofs named are
  the ones act 1 re-ran (C1–C6, C11).
- **F7 [fixed]** "closed-writer, busy and over-long-staging paths typed"
  — true for those three paths; the stamp does not claim the three in
  G2, which it never looked at.
- **F10 [fixed]** "ARCHITECTURE names the seam in its three passages" —
  true and narrower than the finding's intent: F10 was a mirror-site
  miss, and the sweep stopped at ARCHITECTURE (G4).
- **F11 [fixed]** "`getKey()` content-stable" — overclaims: the key is
  modification-time-stable, not content-stable, and the test cannot tell
  the two apart (G1, G3). The remaining F11 items verified.

The commit body's account agrees with the diff on every point act 1
tested. Its one claim act 1 had not checked — the pin range
`2b29bb7..548b706` is "scanner file-walk refactor and board records
only" — holds: three atelier commits, none under `docs/method/`. Reading
the body after the findings changed nothing; its framing matches the
addendum's, which was already a claim under test.

### The sibling's angles against act 1

Covered by act 1 without change: **D1** (G1, G3 — the constant
`lastModified` and the throw-before-write stand-in), **D4** in part
(lens 4), **D7** (G1, G2a), **D8** (G6), **D9** (G4), **D10** (C11: the
block was re-synced to canonical, not SHA-only — verified by diff, not
assumed). New angles were probed on a scratch copy of the stand-in:

**H1 — MINOR — raised by D2 — the resume contract is unstated, and the
short-write path leaves uncounted bytes on disk.** Probe: a stand-in
that lands 4 of 8 bytes and then throws quota leaves the tracker at 8 and
the file at 12 (the ADR's "`bytesWritten` untouched" holds; "equal to the
disk" does not). A fresh session then resumes at 12 — mid-chunk against
`planChunks(16, 8)`'s offsets `0, 8`. A downloader that drives from the
plan gets `OutOfOrderWriteError` at 8: loud, typed, no splice — the
right failure. One that drives from `writer.bytesWritten` commits a
correct archive. Nothing in the ADR, the writer's doc or `planChunks`
says which; and the short-write path throws `ArchiveCorruptError` "not a
retry case" without truncating, so the next `write()` resumes into bytes
the code itself calls unknown (a correct prefix in the stand-in; on a
platform, whether a short or interrupted write lands a prefix is
unverified — add to G1's list). Fix: state that resume offsets come from
`bytesWritten`, never a plan index (and have `planChunks` take a start
offset); on a short write or a thrown write, `truncate(bytesWritten)` on
the sync handle before rethrowing, so "equal to the disk" is true by
construction on every path and the resume question disappears.

**H2 — MINOR — raised by D5 — a stale partial cannot be discarded
without the committed archive.** Probe: with `w.pmtiles` (v1) committed
and an abandoned `.w.v2.pmtiles.part` of 3 bytes, `write("w", 4, "v3")`
is refused (`ArchiveVersionMismatchError`, correct). The only paths out:
`delete("w")`, which also removes the working region; or `write("w", N,
"v2")` then `abort()`, which works only for `N` at or above the stale
size — `N = 2` throws `ArchiveCorruptError` — and `N` is nowhere in the
error (it is in `list()`'s `sizeBytes`). The error's doc says "resume
the old version and `abort()` it, or `delete(id)`", which is accurate and
not enough: offline-first, a user days from coverage with a working
region and a dead update must not be one wrong call from losing the
region. Fix: a `discardPartial(id)` (or `delete(id, { partialOnly })`),
and the recovery dance with its `totalBytes` constraint in the error's
doc until then.

**H3 — NOTE — raised by D4 — the clamp is wider than the probe.** It
keys on `offset === 0` alone; `offset === 0 && length === 16384` is the
narrowest rule that still matches the library's one unconditional read.
Partial disagreement with the sibling: `FetchSource`'s precedent is
itself offset-0-any-length (a 416 at offset 0 re-requests the whole
file), so the addendum's "matches the library's own precedent" is exact.
Narrowing is free hardening against the crafted-directory case the
addendum's (ii) defers, not a correction.

**G1 — grows (raised by D3, D6, D2).** Add to the platform-confirm list:
(c) whether OPFS tracks a file's modification time at all — where the
File API defaults `lastModified` to the `getFile()` call, the key
changes on every `open()` (probe: two `open()` calls give `k@1000`,
`k@1001`; one handle's key is stable, since the `File` is captured once),
defeating pmtiles' header cache across re-opens and growing `Protocol`'s
registry, which has no public remove; (d) whether `getFile()` on a
staging file succeeds while a worker holds its sync access handle —
`list()` depends on it, and the stand-in cannot say; (e) whether an
interrupted or short write lands a prefix (H1).

**G2 — grows (raised by D7).** Probe: after a rejecting `move()`, a
fresh `write()` resumes at the full count and the retried `commit()`
publishes cleanly. The path works; it is untested in the suite — add
that test alongside the typed wrap.

**G6 — grows (raised by D8).** Structured clone of an `Error` carries
`name` and `message` only (HTML structured-serialise steps), so the JSON
layer is not redundant; stated from the spec, not verified per browser.
Whether a revived `message` or `reason` can reach the DOM as markup is
the UI's to answer and there is no UI yet; the enumeration should name
it so the UI inherits the question.

### What changed, and what did not

No severity moved. The sibling found no MAJOR either, and nothing in it
contradicts a finding; where it disagreed (D4) the evidence is above.
The cycle closes as act 1 said: G1–G9 and H1–H3 are the principal's
under rule 3, then backlog; if one thing goes first, it is still G1's
confirm list, now five items longer than the item carries.

**Final tally: MAJOR 0 · MINOR 8 (G1–G6, H1, H2) · NOTE 4 (G7–G9, H3).**

## Deferred sibling, folded below the verdict (orchestrator, 2026-11-02)

The text below is the brief-writer's held-back sibling,
`2026-10-26-0910-seam-fixes-application-cold.deferred.md`, carried in
verbatim except that its headings sit two levels deeper so they nest under
this one. The orchestrator held it outside the worktree until act 1 was
committed at `7f29272`, then released it to the reviewer for act 2; the
reviewer's reconcile of it is the *Act 2* section above. The orchestrator
(a headless Opus 5.5 session started by drain session `c87c4ee0`) formed
no finding and edited none of the reviewer's text. The sibling's own
words are hypotheses, never findings.

### Held back — the brief-writer's angles for the seam-fixes cold pass

For `2026-10-26-0910-seam-fixes-application-cold.md`. **Open only after your
own findings are durably written in the brief** (`REVIEW.md` rule 1). Then
fold this in below the verdict and delete this file.

Written by the brief-writing session (Opus 5.5, `49c917e1`) from one read of
the code at HEAD. These are hypotheses, unproven; none was driven. Use them to
check coverage against your own findings, never as findings.

#### Seeded hypotheses

- **D1 — the stand-in may confirm its author's model.** The in-memory OPFS
  in `tests/storage-opfs.test.js` hard-codes `lastModified` to one constant
  and appears to throw `QuotaExceededError` before any byte lands. If so, it
  cannot exercise C8 (a re-download changing the key) or a platform that
  writes part of a chunk and then throws. A test built on the same belief as
  the code proves consistency, not correctness.
- **D2 — a partial write on resume.** On reopen, `write()` resumes at
  `syncAccess.getSize()`. If a quota failure or a short write left bytes past
  the last accepted chunk, the resume offset falls mid-chunk and no longer
  matches `planChunks`. Does that strand the download, or splice it? The
  short-write path throws `ArchiveCorruptError` "not a retry case", but
  nothing truncates the staging file, so the next `write()` may resume into
  the unknown bytes.
- **D3 — `lastModified` on the target platforms.** Where a browser does not
  track a file's modification time, the File API defaults `lastModified` to
  the time of `getFile()`. Then `getKey()` changes on every `open()`, which
  defeats pmtiles' header and directory caches and may grow `Protocol`'s
  registry. Does `move()` keep the staging file's mtime? Is a millisecond
  enough to tell two downloads apart?
- **D4 — the offset-0 clamp is wider than the probe.** It clamps any read at
  offset 0 that runs past EOF, not only the 16 KiB header probe. A crafted or
  truncated archive whose directory asks for `[0, n)` beyond EOF gets short
  bytes instead of `OutOfRangeReadError`. Is "only at offset 0" the narrowest
  rule that matches pmtiles' `FetchSource` precedent, or should it key on the
  probe's length as well?
- **D5 — a stale partial blocks a new version.** `write()` refuses when a
  staging file for another version exists. The only removal path is
  `delete(id)`, which also removes the committed archive, or `abort()`, which
  needs a writer opened at the old version with a `totalBytes` at least the
  stale file's size. So a user with a working region and an abandoned partial
  update may have to lose the working region to update it. Offline-first,
  that is a usability and safety question.
- **D6 — `list()` during a live write.** `list()` calls `getFile()` on a
  staging file that may have an open sync access handle in a worker. Does any
  target browser reject that while the lock is held? If it does, `list()`
  throws instead of reporting the partial, which is exactly the
  degrade-visibly hook it exists for.
- **D7 — `commit()` after a failed `move()`.** `#closed` is set before
  `move()` resolves. If `move()` rejects (busy, quota, a target already
  existing), the writer cannot retry and the caller must call `write()`
  again. Does that path resume and commit cleanly, and is it tested? What
  does `move()` do when a committed archive of the same name exists, under a
  live read handle?
- **D8 — reviving untrusted error JSON.** `archiveErrorFromJSON` builds an
  `ArchiveError` from any object with a string `code`. Today the only sender
  is the app's own worker. Check whether a revived field can reach the DOM
  as markup, and whether structured clone already carries `Error` objects
  across `postMessage` on the target browsers, which would make the JSON
  layer partly redundant.
- **D9 — one fact, one home.** The addendum says "the accepted text above
  stands" and corrects it from below: "thrown, never clamped", the
  five-error set, and `delete()` throwing on a missing id are still in the
  body. A reader who stops at the decision text gets three rules the code no
  longer follows. Are they marked where they stand?
- **D10 — the pin bump in a feature commit.** The `CLAUDE.md` pin moved
  `2b29bb7` → `548b706` inside an `offline:` commit. Did the inlined floor
  block's text get re-synced to canonical at `548b706`, or only the SHA?
  The 2026-09-20 run found the block had drifted from its source once
  before.

#### Facts the brief-writer held back

None. Every fact gathered is in the brief's *Grounding* section.
