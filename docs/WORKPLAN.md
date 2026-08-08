# Workplan

Phases toward v1, each ending in something demonstrable on a phone with an
explicit **Accept when**. Work top-down; write evidence notes inline as
phases land (the Faves pattern). Parked items live in `ROADMAP.md`.

## Phase 0 — offline map proof (the riskiest assumption first)

The whole strategy rests on: MapLibre + PMTiles-in-OPFS renders LINZ vector
topo on a phone, installed, in flight mode. Prove it before anything else.

- [ ] Vendor MapLibre GL JS (`dist/maplibre-gl.mjs` + CSS) and pmtiles ESM
      into `site/vendor/`; seed `NOTICE`; adapt the no-deps guard to allow
      exactly `site/vendor/` (per the founding ADR).
- [ ] LINZ Basemaps API key (free tier); fetch `topographic-v2` style +
      glyphs/sprites; render online first.
- [ ] Build one regional PMTiles archive (Wellington/Wairarapa) from the
      LINZ export endpoint via `pmtiles convert`; download into OPFS
      (worker + `createSyncAccessHandle`); wire `FileSource` →
      `pmtiles://` protocol.
- [ ] Minimal app shell + service worker (shell precache only, Faves ADR
      0015 split-version pattern); manifest; installable.
- [ ] Handle WebGL context loss (recreate map); WebGL feature gate.

**Accept when**: installed PWA on a real iPhone and Android renders the
region, pans/zooms smoothly, in flight mode, after a cold start.

## Phase 1 — the personal layer

- [ ] Waypoints: typed pins, create/edit/delete on map, photo + note,
      IndexedDB store (model/UI split, unit-tested pure logic,
      `node --test`).
- [ ] Track recording: wake lock + `watchPosition`, filter pipeline
      (accuracy gate, teleport rejection, stationary suppression),
      per-fix persistence, gap banner + segment breaks.
- [ ] GPX import/export (`<input type=file>` in, blob download +
      `navigator.share` out); GeoJSON too.
- [ ] Locate-me + compass heading (normalise iOS `webkitCompassHeading` vs
      Android `deviceorientationabsolute`).

**Accept when**: record a real walk offline, import a watch GPX, both
render as tracks; waypoints survive app restart offline.

## Phase 2 — the access layer (the killer feature)

- [ ] LINZ primary parcels → offline overlay classifying public vs private
      (`parcel_intent`), styled honestly ("indicative only" hedge).
- [ ] DOC conservation land (CC-BY) overlay; Herenga ā Nuku access
      layers (paper roads, access points).
- [ ] Layer switcher with per-layer attribution + currency card.

**Accept when**: standing on a boundary in the field, the app says whose
land each side is, offline, with its source and date visible.

## Phase 3 — regions & trip readiness

- [ ] Region download manager: pmtiles extract pipeline (R2-hosted
      archives), progress, resume, storage budget UI, `persist()` flow,
      cache-repair manifest. **User-scalable from one region to all of
      NZ** — whole-of-NZ offline is a supported floor, not an edge case
      (owner directive 2026-08-08); the UI presents honest per-layer sizes
      and lets the user dial coverage up or down.
- [ ] **Delta updates**: when server-side tiles/metadata change, clients
      fetch only changed tiles + manifest deltas, never the full archive
      (owner directive 2026-08-08; mechanism per the delta-sync research
      and founding review).
- [ ] Open-Meteo forecast fetch-before-you-go, cached with timestamp;
      sunrise/set computed locally.
- [ ] Lighthouse pass + a11y sweep; deploy to Cloudflare Pages.

**Accept when**: quality bar met (Perf ≥ 95, A11y 100, installable) and a
full plan→dark→review trip cycle works on the owner's real weekend.

## Phase 4 — activity heroes (one per vertical, prove the thesis)

- [ ] 4WD: track-grade tags on OSM `tracktype` data.
- [ ] Hunting: blood-trail marker mode (rapid one-tap colour-coded pins).
- [ ] Fishing: catch log pin type with tide/moon context (tide data
      pending outreach — degrade honestly).
- [ ] Birding: stationary/travelling checklist mode on the personal layer.

**Accept when**: each vertical has one moment where tūhura beats the app
the owner used before.

## Later (parked → ROADMAP)

E2E sync backend · E2E sharing · offline peer-to-peer share · bird sound
ID · negotiated data (hunting blocks, tides, bathymetry) · community
layers.
