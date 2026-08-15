# Offline tiles: PMTiles archives in OPFS, not service-worker tile caching

**Status**: accepted • **Date**: 2026-08-08
**Review**: done — founding cold review, verdict 2026-08-08
(`../reviews/2026-08-08-0516-founding-architecture-and-directives.md`; the
offline stack was its assumption 2 — held, with the scale/soak rider and
`persist()`-is-heuristic caveats folded into WORKPLAN/ARCHITECTURE). Pointer
closed 2026-08-15 — it still read "brief to be filed" after the brief landed.

## Context

Offline is tūhura's primary mode: whole map regions (hundreds of MB to GB)
must live on the device and serve tiles with the radio dead for days. The
web platform offers several storage paths, and the obvious one — a service
worker caching tile requests — has a hard defect for the PMTiles format:
PMTiles is read by HTTP **range requests**, and the Cache API cannot store
206 (partial) responses; browsers also cache range hits on large files
unreliably. Tile-by-tile caching (the old leaflet.offline pattern) means
tens of thousands of writes per region and no deduplication.

## Decision

Store each downloaded region as a **single PMTiles archive in OPFS**
(origin-private file system), and read it through the pmtiles library's
`Source` interface: `FileSource` over the OPFS file, registered on
MapLibre's `pmtiles://` protocol. Byte-range reads become `file.slice()` —
no network layer, no service worker involvement, no 206 problem, one file
per region (atomic to delete, cheap to verify).

The service worker's job shrinks to the app shell: HTML, CSS, JS, map style,
glyphs, sprites — the Faves ADR 0015 split-versioning pattern applies to
that shell precache unchanged.

Region provisioning: server-side `pmtiles extract` (or the LINZ whole-NZ
export converted once), downloaded in chunks to OPFS via a worker;
`navigator.storage.persist()` requested before any large download; a
manifest of expected archives detects partial loss, and every archive is
re-downloadable — the cache is durable-but-not-guaranteed, never the only
copy of anything irreplaceable.

## Rejected

- **Service worker intercepting range requests** (synthesising 206s by
  slicing a cached 200): re-implements byte-serving inside a SW, fights
  Safari's strict range handling, and holds multi-GB blobs awkwardly in the
  Cache API.
- **Tile-by-tile IndexedDB/Cache API caching:** thousands of writes per
  region, no dedup, slow, and eviction can silently punch holes in a region.
- **IndexedDB for the archives:** blob reads pull whole values into memory;
  OPFS sync access handles give near-native random-access reads and avoid
  iOS's long IndexedDB-corruption history. IndexedDB remains right for the
  small structured data (waypoints, tracks, settings).

## Consequences

- Fully-offline map serving is a pure client-side file read — testable
  in flight mode, no server component.
- iOS support floor: OPFS needs iOS ≥ 15.2, writes via
  `createSyncAccessHandle()` in a worker (Safari < 26 lacks
  `createWritable`); installed-PWA install is effectively required on iOS
  before offering big downloads (persist heuristic + 7-day-rule exemption).
- Storage budgeting is ours to do: check `storage.estimate()` before
  downloads and show honest remaining-space UI.
