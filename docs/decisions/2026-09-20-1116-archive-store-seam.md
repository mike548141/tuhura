# The storage seam: an ArchiveStore interface over range-read tile archives

**Status**: accepted • **Date**: 2026-09-20
**Review**: done — cold pass 2026-09-20, FAIL-WITH-MAJORS
(`../reviews/2026-09-20-2236-archive-store-seam.md`; findings are the
principal's under rule 3). Was: queued — flagged in the board item this ADR ships against
(`docs/roadmap/010-v1-committed-spine/014-p0-pmtiles-opfs-and-map-lifecycle.md`:
"the storage seam's shape is direction, and it forecloses alternatives
for every later region feature"). Filing the actual queued-review entry
under `docs/roadmap/040-queued-reviews/` is the orchestrator's, not
this worker's — out of this claim's file set.

## Context

ADR `2026-08-08-0452` already decided *what* a downloaded region is: one
PMTiles archive, read by byte range, with no service worker or Cache
API involved. It did not decide the *shape of the code* that reads and
writes that archive — and the platform research
(`docs/research/2026-08-09-0449-platform-pwa-vs-native.md`) then raised
the stakes on getting that shape right: an embedded WebView's origin
quota is a fraction of Safari's, so the day a Capacitor shell ships
(ADR `2026-08-08-0555`), tile archives move from OPFS to a native
filesystem — a storage *migration*, not a rewrite, only if every caller
already goes through one seam rather than touching OPFS APIs directly.
Concretely, from the research (citing WebKit's own storage-policy post):
a browser-app origin gets up to 60% of disk (80% overall); an app
embedding a WebView gets 15% of disk (20% overall) for the *same*
origin — roughly a fourfold cut for a naive wrap that leaves tiles
where they were. `navigator.storage.persist()` softens eviction but is
granted by heuristic, not contract; a native filesystem has neither
problem. This repo has no browser to build or test the OPFS half
against (P0-D's claim note), so this ADR decides the interface and the
OPFS backend's design, while flagging exactly what a browser session
must still confirm.

## Decision

An `ArchiveStore` is the only thing any caller — the future region
downloader, and MapLibre's `pmtiles://` protocol handler — is allowed
to touch. Two small interfaces, split deliberately along the
read/write boundary because they have different threading constraints
(below) and different lifetimes (a read handle is opened per map
session; a write spans a whole download):

```js
// store-level (site/js/storage/opfs-archive-store.js today)
store.open(id)        -> Promise<ArchiveHandle>   // throws ArchiveNotFoundError
store.write(id, totalBytes) -> Promise<ArchiveWriter>  // worker-only, see below
store.delete(id)       -> Promise<void>
store.list()           -> Promise<{id, state: "ready"|"partial", sizeBytes}[]>
store.quota()          -> Promise<{usageBytes, quotaBytes, availableBytes}|null>
store.persist()        -> Promise<boolean>

// handle-level — duck-types pmtiles' own Source interface on purpose
handle.getKey()               -> string
handle.getBytes(offset, length) -> Promise<{data: ArrayBuffer}>
handle.sizeBytes               // number
handle.close()

// writer-level
writer.bytesWritten            // number
writer.append(offset, bytes)  -> Promise<void>   // sequential only
writer.commit()                -> Promise<void>   // atomic publish
writer.abort()                 -> Promise<void>   // discard, free space
```

**Range reads are the primitive, not whole-archive reads or fetches.**
PMTiles is a directory-plus-blobs format read by `[offset, length)`
slices — the header points at the root directory, the directory points
at tile bytes, and MapLibre's worker thread decodes exactly the bytes
a viewport needs, never the whole archive. `getBytes(offset, length)`
is therefore the one operation a read backend must get right; every
other read (header, directory, a tile) is that primitive called with
different numbers, by the vendored `pmtiles.js` library itself. Making
it the seam's primitive — rather than "give me a stream" or "give me
the whole file" — is what lets `ArchiveHandle` be handed to
`new pmtiles.PMTiles(handle)` with **no adapter object**: the vendored
library's `FileSource` class already expects exactly `{getKey(),
getBytes(offset, length)}`, so this seam's read half is pmtiles'
existing contract, not a new one invented alongside it.

**OPFS today, native filesystem later, same caller code.** The OPFS
backend (`opfs-archive-store.js`) implements `open`/`getBytes` with
`FileSystemFileHandle.getFile()` — a `File` snapshot whose `.slice()`
already satisfies `getBytes` with no OPFS-specific call in sight — and
implements `write`/`commit` with `createSyncAccessHandle()`, which the
spec restricts to a dedicated worker (Safari < 26 has no
`createWritable` either, so this is not a stylistic choice — ADR
0452's "iOS support floor" note). A native-filesystem backend swaps
both halves for real file-descriptor reads/writes and answers `quota()`
from actual free disk space instead of `storage.estimate()`'s
heuristic — but returns the exact same four member shapes, because
nothing above the backend ever inspects *how* a range read happened.
That is the whole point of drawing the line at `getBytes`/`append`
rather than, say, exposing a raw handle: a raw `FileSystemFileHandle`
or a raw native `FILE*` both leak their platform the moment a caller
touches them.

**What crosses the seam**: an archive `id` (a plain string), byte
offsets/lengths (numbers), tile bytes (`ArrayBuffer`), size and quota
numbers, and the five typed errors below. **What must not**: any OPFS
type (`FileSystemFileHandle`, `FileSystemSyncAccessHandle`, `File`), any
worker/threading requirement, and any platform-specific quota
mechanism. A caller that needs to know it's talking to OPFS specifically
is a seam that has already failed — nothing in `site/js/app.js` or a
future map-bootstrap module should ever import `opfs-archive-store.js`
directly; it imports whichever backend the platform layer wires up.

## Errors and degradation (`site/js/storage/errors.js`)

Five typed errors, identical across backends, because a caller's catch
block must not need to know which backend threw:

- `ArchiveNotFoundError` — `open()`/`delete()` on an id with nothing
  committed under it.
- `ArchiveCorruptError` — a write finished at the wrong byte count, or
  (once a manifest checksum exists — it doesn't yet, see Consequences)
  a committed archive fails verification.
- `ArchiveQuotaExceededError` — carries `availableBytes` where the
  backend can determine it, so the UI can say "need 340 MB, 120 MB
  free" rather than a bare failure.
- `OutOfRangeReadError` — a `getBytes` request outside `[0, sizeBytes)`.
  Thrown, never silently clamped: a short read that then decodes as a
  corrupt tile is a worse failure than a clear one, and a truncated
  archive is exactly the shape a killed download leaves behind.
- `OutOfOrderWriteError` — an `append()` whose offset isn't exactly
  `bytesWritten`. Writes are sequential-only by design (see
  `chunking.js`'s `SequentialWriteTracker`), so this is a caller bug,
  never a case to reconcile.

Degradation stays visible, per this repo's standing rule
(`CLAUDE.md`: "degrade visibly"), not silently returned-and-ignored:

- **Quota exhaustion** mid-download: the write pauses (the staging file
  and `bytesWritten` are untouched — nothing is deleted), the error
  carries the numbers, and the *caller* (not this seam) owns showing
  "ran out of space, downloaded so far: N MB" with resume/cancel. This
  ADR decides that the store never auto-deletes another archive to make
  room — freeing space is the user's call, not a heuristic's.
- **A partially-written archive** (tab killed mid-download): `list()`
  reports it as `state: "partial"`, distinct from `"ready"`, by design
  — `open()` only ever looks at the *committed* filename (see naming
  below), so a partial download can never be silently opened as if
  complete. The caller's job is to surface "incomplete — resume or
  discard"; this seam's job is only to make that distinction
  observable.
- **A corrupt archive** (bytes present, but wrong): there is no
  manifest checksum yet (owed, see Consequences), so today the only
  detection is structural — `getBytes` bounds-checks every read against
  `sizeBytes`, and pmtiles' own header parse (`bytesToHeader`) throws on
  a bad magic number, which propagates straight up through
  `handle.getBytes()` since this seam wraps nothing there. That is
  honestly incomplete: a corrupted-but-structurally-valid-looking
  archive (bit rot inside tile data, not the header) is not caught
  today. Flagged, not silently accepted as solved.
- **Eviction between sessions**: `list()` is never cached — every call
  re-reads the live directory — so it is the one source of truth a
  higher-level "expected regions" manifest (ADR 0452's phrase) can diff
  against to notice a region OPFS quietly dropped. This seam doesn't
  own that reconciliation; it owns making it possible.

## Rejected

- **Cache API** (as the read primitive): cannot store a 206 partial
  response at all — the exact defect ADR 0452 already ruled the tile
  format out over. Restated here because it also fails as an
  *interface* choice, not just a storage choice: `Cache.match()` hands
  back a whole `Response`, so a range-read primitive would have to be
  synthesised on top of it anyway, which is the SW-range-synthesis
  approach 0452 already rejected.
- **IndexedDB blobs** (as the read primitive): a blob value has to be
  read whole into memory before any byte of it is usable — IndexedDB
  has no "give me bytes N..M of this value" cursor. That inverts the
  entire reason range reads exist (serve a viewport's tiles, not a
  multi-GB archive). It remains correct for what it already does in
  this repo's design — small structured records (waypoints, tracks,
  preferences) — where whole-value reads are the norm anyway.
- **A plain fetch-through** (register `pmtiles://` against a `blob:`
  or `http://localhost`-style URL backed by a service worker): turns
  every tile read back into an HTTP range request the SW must intercept
  and answer — reintroducing the Cache-API 206 problem one layer up,
  plus the SW's own lifecycle (install/activate/update) as a dependency
  of the map's rendering path for no benefit over a direct
  `getBytes()` call in the same JS context.
- **One interface for read and write**: considered and rejected because
  the two have incompatible threading stories on today's backend — a
  read handle is fine on the main thread (`getFile()` is async but not
  worker-restricted); a write handle is worker-only
  (`createSyncAccessHandle()`). Merging them would force every
  `ArchiveHandle` consumer, including the MapLibre protocol handler, to
  either run in a worker or carry dead worker-only methods. Splitting
  them means the seam's read half (the one that matters for a future
  native swap: pmtiles compatibility) is unencumbered by the write
  half's constraints.
- **Exposing the raw platform handle** (`FileSystemFileHandle` /
  `FileSystemSyncAccessHandle`) instead of `getBytes`/`append`: the
  fastest thing to write and the fastest thing to make this whole ADR
  pointless — a native backend cannot hand back either type, so every
  caller would need an `if (isOPFS)` branch the day the Capacitor shell
  lands. The entire value of a seam is that this branch never gets
  written.

## Consequences

- Any future region-download feature, and the MapLibre `pmtiles://`
  protocol wiring (P0-D's still-open browser half), write against this
  interface, never `navigator.storage.getDirectory()` directly — same
  discipline as the sensor seams (ADR `2026-08-08-0555`).
- `ArchiveHandle` is pmtiles-Source-compatible by construction, so
  wiring MapLibre later is "pass the handle to `new pmtiles.PMTiles()`",
  not "write an adapter."
- The pure logic this seam depends on — id/filename rules
  (`naming.js`), chunk planning and the sequential-write tracker
  (`chunking.js`) — is unit-testable with no browser and is tested
  (`tests/`). The OPFS backend itself is not, and cannot be, from this
  machine; see the session report for the exact list a browser must
  confirm (staging→commit via `move()` vs. the copy fallback,
  `createSyncAccessHandle()` behaviour, real quota numbers on-device).
- No archive-integrity checksum exists yet. Structural checks
  (bounds-checked reads, pmtiles' magic-number parse) catch gross
  corruption; a manifest with a content hash per archive is follow-up
  work this ADR does not do, so "corrupt archive" detection should be
  read as best-effort today, not solved.
- The store never deletes anything on its own initiative (not on quota
  pressure, not on eviction, not on a failed write) — every deletion is
  an explicit `delete()` call from a caller acting on a user decision.
