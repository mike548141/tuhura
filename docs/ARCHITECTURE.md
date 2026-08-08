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
| Weather incl. marine (waves/swell/SST) | Open-Meteo | CC-BY 4.0 (commercial tier if app commercialises) | ✅ |
| Bathymetry base | GEBCO 2025 | public domain | ✅ |
| Hydro vectors (depths, soundings) | LINZ LDS | CC-BY + "not for navigation" condition | ✅ with in-app disclaimer |
| Bathymetry 250 m | NIWA | non-commercial + share-alike | 🚩 skip/separable |
| Tides | derived: constituents fitted from LINZ open CSVs, predicted on-device | our derivation (CC-BY source) | ✅ "not for navigation" |
| Dive sites | own curated layer (OSM seed + manual) | ours | ✅ |
| Māori land status | Māori Land Court / LINZ indicators | CC-BY; governance track applies (see DESIGN + research) | ✅ after MLC engagement |
| Hunting blocks, F&G seasons | DOC / Fish & Game | PDF-only, no open data | ❌ — outreach queued |
| River flow, sea temp | NIWA/MetService | redistribution banned | ❌ — outreach queued |
| Marine charts (ENC) | LINZ hydro | NOT CC-BY (ENC/IC-ENC) | ❌ — link out only |

## Offline data lifecycle

- **Cache tiering** (owner directive: whole-NZ floor, user-scalable): an
  always-on national base (~1 GB — vector z0–12, hillshade z0–10, hydro
  vectors, reserves) plus user-selected regions for detail zooms; aerial
  imagery per-region opt-in only (full-NZ aerial is 50 GB–1 TB; everything
  else ≈ 8–12 GB, inside installed-PWA quota). Honest sizes +
  `storage.estimate()` in the UI.
- **Delta updates** (owner directive): the go-pmtiles `makesync` model —
  tileID-aligned block hashes in a small `.sync` sidecar; the client
  fetches only changed blocks and rebuilds the regional archive in OPFS
  (2× transient space per region), falling back to resumable full
  download on layout epochs. R2 keys are immutable per version; one small
  mutable manifest. Detail: `research/2026-08-08-delta-sync-marine-ux.md`.

## Platform posture (current truth; under the founding review)

tūhura is a PWA. The web platform ceiling is measured and documented
(`research/2026-08-08-sensors-audio-companion.md`): no background/screen-off
execution (pocket track logging, locked-screen listening), no barometer, no
Bluetooth accessories, no NFC, no CarPlay. Everything foreground —
maps, offline archives, GPS, compass, pitch/roll, camera, mic + on-device
ML — is web-viable. Whether a Capacitor-wrapped hybrid joins the PWA (one
codebase, native sensor plugins, App Store costs + review friction) and
when, is a founding-review question; companion-mode hardware (MFi GNSS
puck / cellular iPad) needs no app change either way.

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
