# Cold pass — the archive-store seam (rule 4, refs-only)

**Started** 2026-09-20 22:36 UTC. Brief on top, verdict below the divider —
one file (REVIEW.md § The lifecycle). Written by the reviewer, not the author.

## Provenance

The delta was built by a worker dispatched by the 2026-09-20 orchestrated run
(Opus orchestrator, per its own record). This pass was run by a fresh Fable
session that authored none of it and was neither started nor instructed by
that run — the principal opened it and pointed it at the queue, which the queue
item itself directed (Mike, 2026-09-20). Reviewer and orchestrator are the same
session here, on the named tier; no off-tier hand touched a finding.

**Disclosures.** The prior verdict `2026-09-20-1058-session-log-split.md` was
opened *before* findings were written — for its shape only; it concerns the
session log, not this seam, and nothing in it was used. The other two prior
verdicts were not opened. The session detail file for the run that built the
delta carries the author's evaluative account ("the difference between a seam
and a wrapper"); it sits on the onramp read path and was treated as a claim.
Tree sweeps ran through `coldsweep.py` at its default bar. The reconcile was time-boxed
out by the principal's 11:00 NZST cap and completed once the cap lifted, in
a second commit; the reconcile section says when.

## Subject

The storage seam: `ArchiveStore`/`ArchiveHandle`/`ArchiveWriter` shapes, their
OPFS backend, the pure logic beneath (`naming.js`, `chunking.js`, `errors.js`),
the synthetic PMTiles fixture generator and its tests. Landed 2026-09-20 at
`b0be830`, merged `2ccdc18`, queued `ab1c45f`.

## Type

Built work that is also direction: the ADR fixes the interface every later
region feature and the MapLibre wiring build against. Rule 3 applies —
findings are the principal's to decide; the author records counsel only.

## Scope

- Delta `23707e6..ab1c45f` (three commits), bound resolved with the pointer's
  own recipe (`git log --diff-filter=A`), so the self-referential spelling the
  pointer trialled works: nothing outside the landing was swept in.
- Intent record `docs/decisions/2026-09-20-1116-archive-store-seam.md`.
- Prior art: ADR `2026-08-08-0452`, ADR `2026-08-08-0555`, the platform
  research, `docs/ARCHITECTURE.md`.
- The consumer contract the seam claims to match: the vendored
  `site/vendor/pmtiles/pmtiles.js` (4.5.0), read at its `PMTiles`, `FileSource`
  and `FetchSource` classes.
- Doctrine surface: atelier `REVIEW.md` at the pin (`e9a6aae`).

## Load-bearing assumptions to challenge

Named by the reviewer as its first act.

- **A1** — `ArchiveHandle` is pmtiles-`Source`-compatible by construction, so it
  can be handed to `new pmtiles.PMTiles(handle)` with no adapter.
- **A2** — Range reads at `[offset, length)` with strict bounds ("thrown, never
  clamped") are the right primitive for the library that consumes them.
- **A3** — The write half guarantees a half-written archive is never mistaken
  for a whole one; on quota exhaustion `bytesWritten` and the staging file are
  untouched and the download resumes.
- **A4** — `opfs-archive-store.js` "cannot" be tested from this machine.
- **A5** — The fixture generator is spec-valid and its self-check proves it.
- **A6** — The "independent verification" test verifies the seam.
- **A7** — `move()` is uncertain on target browsers and the copy fallback is an
  acceptable stand-in.
- **A8** — Typed errors reach the caller that shows the UI.
- **A9** — The ADR's error/degradation account matches the code.
- **A10** — The record's process claims: ADR accepted, review queued refs-only,
  ARCHITECTURE current.

## Grounding

- `node --test` re-run: 29/29 pass, ~1 s. `gh run list`: `floor` and `CI`
  success at `ab1c45f`. Local `floor.py --plane ci`: every enforced check
  green; five advisory entropy notes, one on the generator's spec SHA.
- **Header-probe proof** (scratch script, the handle's `getBytes` copied
  verbatim): `new pmtiles.PMTiles(seamHandle).getHeader()` on the default
  680-byte fixture → `OutOfRangeReadError: read [0, 16384) is outside "x"`;
  `pmtiles.FileSource` on the same bytes → OK. On an 18,153-byte fixture both
  succeed and read `z4/3/2` correctly.
- **Quota-path proof** (the real module imported under Node over a stubbed
  OPFS surface of ~20 lines): after chunk 1, `bytesWritten=8`, disk 8; chunk 2
  throws `ArchiveQuotaExceededError(availableBytes=8)`; then `bytesWritten=16`,
  disk 8; the retry at offset 8 throws `OutOfOrderWriteError` ("expected 16");
  `commit()` then **succeeds**, calling `move()` and publishing 8 of 16 bytes.
- **TileID cross-check**: the generator's `zxy_to_tile_id` against the vendored
  `zxyToTileId` over all 341 tiles z0–z4 → 324 mismatches (z2: 12, z3: 60,
  z4: 252); 341 tiles map to **83 distinct ids**. A one-token correction
  (weight `s*s`, not `s`) gives 341 distinct ids 0..340 and still passes the
  spec's six-row table.
- Spec read at the cited revision (`8b8ddea`, confirmed via the GitHub API):
  header layout, enums, directory order and offset rule, the 16 KiB root rule,
  "clustered" definition — the generator's header and directory codec match.
- `mdn/browser-compat-data` `FileSystemHandle.move`: Chrome 102, Safari 15.2,
  Firefox 111. WebKit's storage-policy post: 60 %/80 % browser, 15 %/20 %
  embedded — the ADR's numbers hold. File API: a File whose backing file has
  changed fails reads with `NotReadableError` (snapshot state).
- `coldsweep` for the seam's names across the tree: only the delta's own files
  and the decisions index; nothing in `site/js/app.js` or `ARCHITECTURE.md`.

## Non-goals

- The runtime OPFS half on a real device (the item says it is owed; agreed).
- MapLibre `pmtiles://` wiring, context loss, the WebGL gate — not built.
- Commits after `ab1c45f` (the ruling recorded on the pointer; a later pass).

---

## Verdict — FAIL-WITH-MAJORS (2 MAJOR / 3 MODERATE / 4 minor / 2 note)

The *shape* of the seam is right: range reads as the primitive, read/write
split on the threading boundary, immutable committed archives, no
platform types crossing. What fails is the two claims the shape rests on —
that the read half is pmtiles-compatible as built (F1) and that the write half
never publishes a partial archive (F2) — and both were provable from this
machine, which the record said was impossible (A4). Under rule 3 every finding
is Mike's; counsel is labelled. Two MAJORs means the application earns its own
cold pass (REVIEW.md § The lifecycle).

### Lens 1 — approach & assumptions

- **A1 fails as built, A2 fails at the edge** (→ F1). **A3 fails** (→ F2).
  **A4 is false** — the quota proof is a unit test in all but name (→ F2).
  **A5 fails** beyond z1 (→ F3). **A6 is a misattribution** — the library
  verified the *fixture*, never the seam (→ F1). **A7 is stale** (→ F4).
  **A8 fails** at the worker boundary (→ F5). **A9 partly** (→ F7). **A10**:
  accepted by the author (→ F8); refs-only pointer held; ARCHITECTURE stale
  (→ F10).
- The split-interface decision, the rejection of Cache API / IndexedDB /
  fetch-through, and "never auto-delete" are sound and well argued. Nothing
  here says the seam is the wrong idea; it says the build overclaimed.

### Lens 2 — correctness & quality

- "29 tests pass" ✅. "Spec-valid" ⚠️ only for the default five tiles.
  "Handed straight to `new pmtiles.PMTiles(handle)` with no adapter" ❌ never
  exercised; fails the library's first call on any archive under 16 KiB.
  "bytesWritten untouched" ❌. "Half-written never mistaken for whole" ❌ on
  the quota path. "Every backend throws exactly these classes, never a
  platform-native one" ⚠️ (F7).

### Lens 3 — completeness / harvest

- `ARCHITECTURE.md` still describes reads as "pmtiles' `FileSource` over an
  OPFS file" and does not name `site/js/storage/` (F10).
- The retry policy in `chunking.js` has no caller yet; harmless but its
  no-jitter rationale is wrong for a shared R2 origin (F11).

### Lens 4 — security & privacy

Design altitude, enumerated here because the ADR did not (F9): (i) archive id
→ filename: the kebab-case grammar admits no separator, dot or whitespace —
traversal is excluded by construction, tested; (ii) archive bytes are
untrusted network input parsed by pmtiles — the bounds check stops reads past
EOF, but a crafted directory entry can make the library request a tile of any
in-bounds length, so a multi-GB `arrayBuffer()` is reachable from a hostile
archive; the only source is the project's own R2 bucket today, so this is a
note for the day archives come from anywhere else; (iii) no integrity check on
a downloaded archive (acknowledged in the ADR; the manifest checksum is owed);
(iv) privacy: OPFS is origin-private, the data is public map tiles, `list()`
is local — no new exposure. Code altitude: no `innerHTML`, no `eval`; the test
shells out with an argument array, not a shell; `vm.runInContext` runs bytes
pinned by `vendor_check`. `/security-review` was invoked: it read the primary
checkout (clean, empty diff) and reached nothing; it was re-aimed as a
sub-task at a scratch worktree carrying the delta as pending changes. That
run read every new file in full and formed **no finding above its >80 %
bar**; its twelve excluded candidates match the enumeration above (traversal
closed by the id grammar, no DOM sink, argv-only subprocess, pinned bytes
under `vm`). One hygiene note from it, folded into F11: the generator's
default `--out` is inside the repo and not gitignored, so a stray manual run
would stage a binary blob in a public repo. No security finding formed.

### Findings

**F1 — MAJOR — the read primitive breaks pmtiles' first call, and the
compatibility claim was never tested.** `PMTiles.getHeader()` always calls
`getBytes(0, 16384)`; the library's own `FetchSource` special-cases a 416 at
offset 0 for exactly this, and `FileSource` relies on `slice()` clamping. The
seam's "thrown, never clamped" rule (ADR § Errors) turns that probe into
`OutOfRangeReadError` on any archive under 16 KiB — including every fixture
the generator makes by default — and no test constructs the seam's handle at
all: layer 2 uses `pmtiles.FileSource`. A real regional archive is far larger,
so production is unaffected today, but the ADR decides the rule for every
backend and the board item's wording lets a reader believe the seam was the
thing verified. *Counsel:* amend the rule to the library's own precedent —
clamp at offset 0 (the header probe), strict elsewhere — and add the missing
test: the seam's handle, not `FileSource`, under `new pmtiles.PMTiles()`, on
a fixture both under and over 16 KiB. Reword the item so the verification
claim names the fixture.

**F2 — MAJOR — a failed write advances the tracker, so the resume story
fails and `commit()` publishes a partial archive.** `append()` calls
`tracker.accept()` *before* `syncAccess.write()`; on `QuotaExceededError` the
count has already moved. The retry the ADR promises is refused as
out-of-order, and `isComplete` reports true with bytes missing, so `commit()`
moves the staging file into the committed name — the one outcome the writer's
own doc-comment says it guarantees against. Same path for any write error, not
only quota. The module's "unverified by construction" claim is also false:
the proof is a 20-line OPFS stub and the real module. *Counsel:* accept after
the write succeeds (or roll back on throw), check `write()`'s returned byte
count, and land the stub as `tests/storage-opfs.test.js` so the glue is
gated. Add a dated addendum correcting the ADR's "untouched" sentence.

**F3 — MODERATE — the fixture generator's TileIDs are wrong from z2 up and
its self-check cannot see it.** The Hilbert step weights each bit by `1<<i`;
the spec's reference form (and the vendored library) weight by `s*s`. Every
tile whose high bit is set diverges; 341 tiles collapse to 83 ids. The
`_SPEC_TABLE` rows are precisely those whose high-bit contributions are zero,
so the self-check passes on a wrong function. The default fixture (z0–z1) is
unaffected, which is why the library test is green. *Counsel:* `* s * s`;
extend the self-check to cross-check every tile z0–z4 against the vendored
`zxyToTileId` (a second independent implementation, already in the repo).

**F4 — MODERATE — the copy-then-delete fallback cannot work at design
scale, and its safety argument cites a check that does not exist.** The
fallback reads the whole staging file with `arrayBuffer()` — a multi-GB
allocation on a phone — and the comment says this is acceptable because
`open()` "never trusts a final file's presence alone"; `open()` does exactly
that. Compat data has `move()` in Safari since 15.2, Chrome 102, Firefox 111,
so the fallback is most likely dead code. *Counsel:* delete the fallback; if
`move` is absent, throw a typed error and let the UI say so (degrade visibly).

**F5 — MODERATE — typed errors do not cross the boundary the design puts
them on.** Writes are worker-only; the UI is not. A thrown
`ArchiveQuotaExceededError` reaching the main thread via `postMessage`
arrives as a plain `Error` (structured clone keeps `name`/`message`, drops
the class and `availableBytes`), so the ADR's "need 340 MB, 120 MB free"
cannot be built as described. *Counsel:* give every seam error a stable
`code` and a `toJSON()`/`fromJSON()` pair, and say in the ADR that the seam's
write half is consumed by a worker-side downloader that owns the message
protocol.

**F6 — minor — resume has no notion of *which* archive the staging bytes
belong to.** A staging file left by an earlier build of the same region id
resumes by byte count only; if the upstream archive was rebuilt, the result
splices two versions and commits cleanly. Phase 3 already commits to
ETag/If-Range. *Counsel:* carry a version token in the staging name or a
sidecar, and let `write()` refuse a mismatch with a typed error.

**F7 — minor — the ADR and the code disagree in small, findable ways.** Six
error classes, not five (`InvalidArchiveIdError` crosses the seam from
`open`/`write`/`delete`). `delete()` on a missing id returns silently; the ADR
says it throws. Platform errors still leak: a second `commit()`, `delete()`
during a live write, `write()` twice. *Counsel:* one addendum listing the
sixth error and the idempotent delete; wrap the three leak paths.

**F8 — minor — the ADR was self-accepted.** Status says *accepted*; RECORD.md
makes acceptance the principal's decision, informed, never the author's, and
no record of Mike accepting it exists. *Counsel:* Mike's call on this pass
doubles as that decision; record it in the addendum either way.

**F9 — minor — no threat enumeration in the ADR** (REVIEW.md lens 4's
build-time obligation; "absent enumeration is the finding"). Lens 4 above
supplies one; *counsel:* fold it into the addendum.

**F10 — note — `ARCHITECTURE.md` was not updated**; it still names
`FileSource` as the read path and does not mention the seam module.

**F11 — note — small overclaims and dead weight.** The "bogus magic number"
test asserts only that a buffer mutation took effect. The File-snapshot
comment has the failure mode backwards (reads *fail*, they do not return old
bytes). `getKey()` is the bare id, so a re-downloaded region under a live
`PMTiles` instance is served from a stale directory cache unless the caller
re-adds it. The retry policy's no-jitter argument ignores that R2 is shared
by every client. The generator's default output path sits inside the repo
and is not gitignored (scanner note).

### Live-proven claims, re-run

| Claim | Result |
|---|---|
| 29 tests pass | ✅ re-run |
| Library parses the fixture | ✅ re-run (default five tiles) |
| Seam handle works under `PMTiles` | ❌ throws on any archive < 16 KiB |
| Quota failure leaves `bytesWritten` untouched | ❌ advances; commit publishes partial |
| `opfs-archive-store.js` cannot be tested here | ❌ stubbed and driven in 20 lines |
| Generator is spec-valid | ⚠️ z0–z1 only; z2+ ids collide |
| Spec revision as cited | ✅ GitHub API |
| Quota figures 60/80 vs 15/20 | ✅ WebKit post |
| Floor + CI green at head | ✅ both planes |

### Follow-up checklist (Mike's under rule 3)

- [ ] F1, F2 — code fixes + tests + ADR addendum; the application is
      self-authored direction and earns its own `⏳` (two MAJORs).
- [ ] F3 — one-token fix + the cross-check self-test.
- [ ] F4, F5, F6, F7 — decide; small code and one addendum.
- [ ] F8, F9 — the addendum records acceptance and the threat list.
- [ ] F10, F11 — tidy on the next touch.
- [x] Reconcile against the 2026-08-08 and 2026-08-15 verdicts — done
      2026-09-20 23:05 UTC, below.

### Reconcile — prior verdicts, opened after the findings above were committed

Done 2026-09-20 23:05 UTC, after `2aeefa2` landed the findings. The founding
verdict (`2026-08-08-0516`) held the offline stack as its assumption 2 with
the scale/soak rider and the `persist()`-is-heuristic caveat; nothing there
overlaps or contradicts a finding here, and F2 is the concrete shape of the
"trust-your-life offline promise" question it asked. The platform-tier pass
(`2026-08-15-1033`) placed the storage seam in Phase 3 and, in its seeded
question 3 and F8, left the native backend's "≈100 lines" estimate untested
for the WKWebView spike to measure; the seam landed under Phase 0's P0-D
instead (the 2026-09-20 split), which is a sequencing change and not a
conflict. F1's bounds rule and F5's worker-boundary gap are inputs that
spike now inherits, since a native backend is bound by the same ADR. No
finding here is disturbed by either prior verdict, and none of theirs by
this one. Neither verdict's `[x]` claims were re-verified: both close at or
below this delta's base, outside the bound.
