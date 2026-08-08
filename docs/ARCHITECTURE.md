# Architecture

Current truth, kept compact. The *why* behind contestable calls lives in
[`decisions/`](decisions/); this file is what's true now. Grounded in the
founding research sweep (2026-08-08, `reviews/` + ADRs); the app itself is
not yet built — where a section describes intent rather than shipped code it
says so.

## What it is

tūhura is an installable, offline-first PWA: vanilla HTML + CSS + ES-module
JavaScript served statically from `site/`, no build step, no accounts, no
server-side application logic. The map stack is the one sanctioned vendored
dependency. A user downloads map regions while in coverage; in the
backcountry the app runs entirely from device storage — map, waypoints,
tracks, recorded data. A future Cloudflare Worker + R2 backend stores only
E2E-encrypted blobs for cross-device sync and sharing.

## The stack (and why)

- **Rendering: MapLibre GL JS, vendored** into `site/vendor/` as its shipped
  ES module + CSS (ADR: the one dependency). WebGL vector rendering with
  worker-thread tile parsing is the only mobile-smooth path; Leaflet's vector
  plugins are abandoned/maintenance-mode, OpenLayers is bundler-oriented.
  iOS Safari WebGL context loss is real and handled explicitly
  (`webglcontextlost` → recreate).
- **Tiles: PMTiles archives in OPFS.** Single-file tile archives read via the
  pmtiles library's `FileSource` over an OPFS file — byte-range reads become
  `file.slice()`, so offline tile serving needs **no service-worker
  byte-serving** (the Cache API cannot store 206 responses; that whole
  problem is designed out). The service worker precaches only the app shell,
  style, glyphs, sprites.
- **Basemap: LINZ `topographic-v2` vector tiles (CC-BY 4.0).** Purpose-drawn
  NZ topo (Topo50 source data + 8 m-DEM hillshade), official whole-tileset
  MBTiles export → `pmtiles convert` → regional or full-NZ archives
  (full NZ ≈ low single-digit GB). Protomaps OSM extract as
  fallback/POI overlay. LINZ terms explicitly permit local copies.
- **Storage: OPFS for bulk (tile archives), IndexedDB for structured data**
  (waypoints, tracks, preferences). Installed-PWA storage since iOS 17 shares
  one origin quota (~60% of disk) and home-screen apps are exempt from the
  7-day eviction rule; `navigator.storage.persist()` is requested before any
  large download, and the cache is treated as rebuildable — a manifest
  detects and repairs partial loss.
- **GPS: honest about the platform.** Track recording is a **screen-on**
  feature: wake lock (iOS ≥ 18.4 for installed apps) + one long-lived
  `watchPosition`, points filtered (accuracy gate, teleport rejection,
  stationary suppression) and persisted to IndexedDB per fix; a visible
  banner on gaps, GPX segment breaks on resume. Screen-off pocket recording
  is native-only territory — so **GPX import/export is first-class**, and
  elevation comes from the DEM, not GPS altitude (no barometer on the web).
- **Sync (future): E2E-encrypted, accountless.** Identity is
  `(groupID, rootKey)` — random, generated on-device; HKDF derives data/index/
  auth keys; AES-GCM via WebCrypto; QR/URL-fragment device pairing (the key
  never reaches a server by construction). Per-object last-write-wins with
  hybrid logical clocks (waypoints/tracks are append-mostly; tracks immutable
  once recorded — no CRDT library needed). Server: Cloudflare Worker + R2,
  content-addressed encrypted segments + one CAS'd index object; the server
  sees sizes and timing, never plaintext. Faves ADR 0017 is the design
  precedent; per-user keypair from day one so person-to-person sharing is
  key-wrapping later, not a redesign.
- **Hosting: Cloudflare Pages** (static, push-to-main deploy), same shape as
  Faves ADR 0004; tile archives served from R2 (zero egress).

## Data layers and licensing

Offline caching is redistribution — a layer ships only if its licence
permits it, with attribution carried in-app. Current audit (2026-08-08):

| Layer | Source | Licence | Cacheable |
|---|---|---|---|
| Topo basemap, aerial, DEM | LINZ | CC-BY 4.0 | ✅ explicit |
| OSM overlay | Protomaps/OSM extract | ODbL | ✅ (self-hosted, never the public tile server) |
| Conservation land | DOC | CC-BY 4.0 | ✅ |
| Marine reserves / fisheries layers | MPI | CC-BY 4.0 (verify per-layer) | ✅ |
| Weather | Open-Meteo | CC-BY 4.0 (commercial tier if app commercialises) | ✅ |
| Hunting blocks, F&G seasons | DOC / Fish & Game | PDF-only, no open data | ❌ — outreach queued |
| Tides, river flow, sea temp | LINZ/NIWA/MetService | unstated / redistribution banned | ❌ — outreach queued |
| Marine charts | LINZ hydro | NOT CC-BY (ENC/IC-ENC) | ❌ — link out only |

## Layout

```
site/          # the deployable artefact (no build step)
site/vendor/   # pinned MapLibre GL JS + pmtiles ESM + licences (NOTICE'd)
docs/          # this file, STRATEGY, ROADMAP, SESSIONS, decisions/, reviews/
tools/         # dev/CI helpers (stdlib-only Python 3)
```

## Testing

CI proves: doc link integrity, and (once code lands) pure-logic unit tests
via `node --test` with no npm install, plus the atelier scanner floor.
What CI honestly cannot prove: that the map renders, that offline mode
survives flight mode, that GPS recording behaves on a real phone — those are
documented human steps: exercise at 390 px, offline, on real iOS + Android
before calling a change done.
