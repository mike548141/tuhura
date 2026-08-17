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
  auth keys; AES-GCM via WebCrypto; QR/URL-fragment device pairing.
  Per-object last-write-wins with hybrid logical clocks (tracks immutable
  once recorded — no CRDT library needed). Server: Cloudflare Worker + R2,
  content-addressed encrypted segments + one CAS'd index object. Faves ADR
  0017 is the design *shape* — but the founding review binds the future
  sync ADR to a stronger threat model than Faves' (hunting-location data,
  not restaurant hearts): **rootKey ≥ 128 bits CSPRNG (Faves' ~44-bit
  bearer code rejected); per-device keypairs wrapping a rotatable group
  key + a revocation flow; a device-signed, version-chained index
  (rollback/fork resistance); GCM nonce discipline + object-identity AAD;
  Worker rate limits/quotas/GC; HLC skew caps before any shared groups**.
  Honest limits carried in writing: the origin that stores ciphertext
  also ships the JS holding the keys (deploy-integrity posture: CSP,
  reviewed deploys); server/host still sees IP, sizes, cadence — a
  pre-trip provisioning burst is trip-pattern inference; pairing links
  pasted into chat/screenshots leak the key regardless of transport (the
  pairing UX must say so); and on-device at-rest encryption remains the
  platform's job — waypoints/tracks in IndexedDB are readable on an
  unlocked device and seizable; passphrase-wrapped *exports* are the one
  real at-rest protection the web can add. Export-privacy rules
  (near-home trim, EXIF strip, optional fuzzing) ship before any share
  feature.
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
| Tides | constituents fitted from LINZ CSVs, predicted on-device (design) | LINZ CSV licence **unstated** — derivation inherits it | ⏳ blocked pending written LINZ confirmation |
| Dive sites | curated layer (OSM seed + manual) | ODbL if OSM-seeded (share-alike attaches) | ✅ as ODbL |
| Māori land status | Māori Land Court / LINZ indicators | CC-BY; governance track applies (see DESIGN + research) | ✅ after MLC engagement |
| Hunting blocks, F&G seasons | DOC / Fish & Game | PDF-only, no open data | ❌ — outreach queued |
| River flow, sea temp | NIWA/MetService | redistribution banned | ❌ — outreach queued |
| Marine charts (ENC) | LINZ hydro | NOT CC-BY (ENC/IC-ENC) | ❌ — link out only |

## Offline data lifecycle

- **Cache tiering**: an always-on national base (~1 GB — vector z0–12,
  hillshade z0–10, hydro vectors, reserves) is the true floor; user-
  selected regions add detail zooms. **Whole-of-NZ is the post-v1
  ceiling, device-permitting** (≈8–12 GB *before* the access layer, which
  still needs sizing — founding review), gated on a real-device
  provision test. Aerial per-region opt-in only (full-NZ is 50 GB–1 TB).
  UI shows honest sizes and **free space** (writes fail against free
  space, not quota). Note: `persist()` on iOS is a heuristic grant that
  *reduces* eviction odds — never treat the cache as exempt. Tiles are
  rebuildable; **user data is not** (see Phase 1 durability).
- **Updates**: v1 ships **versioned resumable full re-downloads**
  (immutable R2 version keys + small mutable manifest, ETag/If-Range).
  The delta mechanism (go-pmtiles `makesync`-style block sync — the
  owner's end-state requirement) is post-v1, gated on measured update
  pain; verify OPFS `move()` support and format stability first, and note
  2× transient space per region while patching. A multi-archive
  tile-router (national base + regional archives per layer) is a design
  note owed before Phase 3. Detail:
  `research/2026-08-08-delta-sync-marine-ux.md`.
- **Elevation**: hillshade is *rendering*, not queryable elevation — an
  on-device DEM tile layer must be added (and sized) before any feature
  claims "elevation from the DEM"; until then track profiles use GPS
  altitude with its error stated.

## Platform posture (ADR 2026-08-08-0545 — ⏳ tier re-opened 2026-08-09)

The `site/` PWA is canonical: sole codebase, zero-build, push-to-deploy.
A **thin Capacitor shell is a committed post-Phase-3 packaging track**
hosting the native-only sensor backends — background GNSS, barometer,
BLE (GNSS receivers, OBD-II/CAN telemetry adapters, marine instruments),
native TCP bridges (ADR 2026-08-08-0555 widened this from 0545's
original scope; owner confirmed the full feature set outranks PWA purity,
2026-08-08) — first shell release still gated on a real field failure of
screen-on recording. **Every sensor consumer reads a seam, never a
platform API** (position / altitude / heading / attitude /
vehicle-telemetry; the ros/tiki pluggable-backend pattern) — so device,
puck, paired phone, and car sources are interchangeable backends, and
the UI always shows which source is live. CarPlay parked entitlement-permitting; locked-screen
listening cut. Two obligations bought now: the Phase 1 recorder sits
behind a capability seam, and a **storage-migration path** (backup/export
bridge + re-provisioning) is specified before Phase 3 ships gigabytes —
installed-PWA and wrapper are separate storage silos. Companion-mode
hardware (MFi GNSS puck / cellular iPad) needs no app change either way.

**⏳ What 2026-08-09 changed** (`research/2026-08-09-0449-platform-pwa-vs-native.md`;
Mike re-opened the question, ruling outstanding — the *shape* above is
unchanged and survived the challenge, the **timing** is what is contested).
Three consequences are current truth regardless of how he rules:

- **The shell is a certainty, not a contingency.** Marine instruments speak
  BLE and NMEA-over-TCP; both are permanently closed to iOS Safari (WebKit
  has no Web Bluetooth implementation and no plans for one). With maritime
  ruled first-class, that half of the product cannot ship on the web at
  all — so "gated on a field failure of screen-on recording" is no longer
  the binding gate, whatever the tier ends up being.
- **An embedded WebView's origin quota is 15% of disk against Safari's
  60%** (WebKit storage policy). A wrap that leaves tile archives in OPFS
  therefore *shrinks* capacity roughly fourfold — the storage-silo problem
  is worse than "separate silos" implies. Archives belong behind a
  **storage seam**: OPFS backend now, native filesystem later. PMTiles only
  needs a source answering `getBytes(offset, length)`, so the native
  backend is a small `Source` adapter, not a re-architecture.
- **That native backend is also the durability answer.** Native filesystem
  storage is guaranteed and never evicted, where `persist()` is a heuristic
  grant with no specification contract (see Offline data lifecycle above).
- Native-first (React Native / Flutter / Swift+Kotlin) was re-examined and
  **buys no capability the shell doesn't**, while forfeiting zero-build,
  push-to-deploy, the web surface, and paying a permanent annual
  toolchain-upgrade tax. Not a live option; recorded so it stays closed.
**Reviewed 2026-08-15** (cold pass —
`reviews/2026-08-15-1033-platform-tier-and-marine-staging.md`): the
native-first closure and the storage-seam consequence hold; the first bullet
overreaches — the strategy's marine half (layers, reserves, dive sites,
tides, a wake track) is web-reachable, and it is marine *instrument*
integration that cannot ship on the web (verdict F1). The bullet stands as
written until Mike rules; read it with that finding beside it.
Web ceiling detail: `research/2026-08-08-sensors-audio-companion.md`.

## Layout

```
site/          # the deployable artefact (no build step)
site/vendor/   # pinned MapLibre GL JS + pmtiles ESM + licences (NOTICE'd)
docs/          # this file, STRATEGY, SESSIONS (index), decisions/, reviews/
docs/sessions/ # per-session detail; SESSIONS.md is the index over it
docs/roadmap/  # the board — one file per item; ROADMAP.md is its generated index
tools/         # dev/CI helpers (stdlib-only Python 3)
```

## Testing

CI proves: doc link integrity, and (once code lands) pure-logic unit tests
via `node --test` with no npm install, plus the atelier scanner floor.
What CI honestly cannot prove: that the map renders, that offline mode
survives flight mode, that GPS recording behaves on a real phone — those are
documented human steps: exercise at 390 px, offline, on real iOS + Android
before calling a change done.
