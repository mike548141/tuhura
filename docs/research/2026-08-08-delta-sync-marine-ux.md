# Research — delta sync, NZ-scale cache, marine data, UX (2026-08-08)

Condensed reference, second sweep. Companions: `2026-08-08-sensors-audio-companion.md`,
the founding records.

## Delta sync (owner requirement: changed tiles only, never full re-download)

- PMTiles is read-only — updates rewrite the file. Naive binary diffing of
  two builds transfers ~95% of the archive (offsets/varints shift) — dead
  end, measured (protomaps/PMTiles#228).
- **go-pmtiles `makesync`/`sync`** is the mechanism: blocks of consecutive
  tile entries (tileID-aligned, ~64 KB), xxHash64 per block, tiny `.sync`
  sidecar (~0.1% of archive); client hashes local blocks, fetches only
  missing ones via coalesced range requests, rebuilds to a temp file and
  renames. Undocumented/experimental — pin the version, test.
- Adopted design: regional archives on R2 under **immutable versioned
  keys** + small mutable `manifest.json`; client-side sync reimplemented
  in a worker (xxhash-wasm, OPFS temp file + `move()` swap, resumable);
  fallback to plain `If-Range`/ETag resumable full download when the match
  ratio collapses (`layoutEpoch` bump signals "don't diff").
- **Plan 2× transient storage per region** (old + new coexist during
  patch) — regional splits keep that bounded (~100-500 MB each).
- Prior art check: OsmAnd diffs map *data*, Organic Maps re-downloads
  whole regions — nobody mainstream ships tile-level deltas; makesync is
  the state of the art.

## NZ-scale cache (owner requirement: whole-NZ floor, user-scalable)

| Layer | Full-NZ estimate |
|---|---|
| Vector topo z0-15 (+ LINZ contours/tracks) | 2-4 GB |
| Raster Topo50 look | ~4-5 GB (shipping NZ apps corroborate) |
| Hillshade/terrain DEM z0-14 | 2-4 GB |
| Bathy raster + hydro vector + MPAs/POIs | < 1.5 GB |
| **Everything except aerial** | **≈ 8-12 GB** ✅ inside installed-PWA quota |
| LINZ aerial | z16 ~50-100 GB; z18 0.5-1 TB — **per-region opt-in only** |

Tiering: always-on national base (~1 GB: vector z0-12 + hillshade z0-10 +
hydro + MPAs) + user-selected regions for detail zooms + aerial strictly
per-region with size preview. Show `storage.estimate()`, request
`persist()`.

## Marine / boating / diving data

- **GEBCO 2025** bathymetry: public domain ✅ (base layer; ~450 m at NZ).
- **LINZ LDS hydro vectors** (depth areas/contours/soundings): CC-BY ✅
  with a mandatory **"not for navigation"** disclaimer in-app. (Chart
  images/ENCs stay restricted — unchanged.)
- **NIWA 250 m bathy**: NIWA licence is non-commercial + share-alike 🚩 —
  skip or keep separable while any commercial future is open.
- **Dive sites**: no authoritative open NZ dataset — curate our own layer
  (OSM seed + manual), shipped as versioned GeoJSON/PMTiles on the same
  delta pipeline.
- **Marine weather**: Open-Meteo Marine API (wave/swell/SST), CC-BY,
  cacheable ✅; model resolution ~5-11 km — passage planning, not surf
  precision.
- **Offline tides**: FES global grids are registration-gated and weak in
  Cook Strait 🚩. The clean path: LINZ's open CSV predictions → fit
  harmonic constituents ourselves (UTide/pytides-style) → ship our own
  per-port JSON + on-device prediction (`@neaps/tide-predictor` pattern),
  validated against official tables, labelled "not for navigation".

## UX + settings architecture

- Evidence: Gaia/Windy/CalTopo all shipped thumbnail-heavy layer-list
  redesigns in 2026 and users revolted (density beats polish for daily
  use); onX's per-activity app silos are its core UX debt (wrong-app
  purchases, broken cross-activity trips). Apple HIG: minimise settings,
  best-default-first, task-specific options in context not in a settings
  tree.
- Adopted shape (input to the design pass): **three tiers** —
  1. Global (units, theme, sync, storage) — rarely touched;
  2. **Activity profiles** (4WD/hunt/fish/bird/tramp/boat/dive): named
     bundles of default layers (2-4 visible max), opacity/z-order,
     favourites, activity widgets (tides for boat/fish/dive, slope for
     4WD/tramp); editable per profile; switching = one thumb-zone tap on
     the map screen, never a settings trek;
  3. Contextual — per-layer options on long-press; automatic field
     adaptations (day/night, vehicle-mount layout on CarPlay/BT connect)
     with manual override.
- Layer lists stay dense/plain by default; visual richness only in the
  occasional "browse catalogue" view.
- **Māori land layer** (owner ruled: ship it, toggleable): its own
  governance track — label with LINZ's legal categories (Māori freehold /
  Māori customary / General land owned by Māori), first-enable disclaimer
  modelled on Te Kāhui Māngai's "indicative only" wording, link out to
  Pātaka Whenua; no wāhi tapu/urupā precision beyond approved public
  display (maorigis.nz guidance); Te Mana Raraunga principles as the
  design check. 🎯 Engage **Te Kōti Whenua Māori (Māori Land Court)** as
  data authority before shipping; consult mana whenua via Te Kāhui Māngai
  for framing. Default state (on vs off) = review question; research
  recommends off-by-default.
