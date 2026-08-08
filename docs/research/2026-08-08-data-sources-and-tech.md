# Founding research — NZ data sources & offline PWA tech (2026-08-08)

Condensed reference from the founding research sweep (web research by
sub-agents, 2026-08-08). Licence terms move — re-verify before shipping a
layer. Companion: `2026-08-08-competitor-landscape.md`.

## Data sources — offline-cacheable verdicts

Offline caching is redistribution (ADR 2026-08-08-0454). Audit results:

### ✅ Cacheable (open licence, attribution required)

| Source | Licence | Access | Notes |
|---|---|---|---|
| LINZ Topo50/250, Basemaps `topographic-v2`/`topolite-v2` vector tiles | CC-BY 4.0 | data.linz.govt.nz + basemaps.linz.govt.nz (free API key; standard tier 1M tiles/mo) | Terms explicitly permit local copies. Whole-tileset export: `https://basemaps.linz.govt.nz/v1/export/{tileset}/{crs}.mbtiles?api=…` → `pmtiles convert`. Quarterly updates. |
| LINZ aerial imagery | CC-BY 4.0 | LDS / Basemaps (COG) | ~95% national, 5–30 cm |
| LINZ 8 m DEM + LiDAR DEMs | CC-BY 4.0 | LDS (COG); full-NZ DEM needs courier order (>3.5 GB web cap) | LiDAR regional only; hillshade/terrain source |
| LINZ NZ Primary Parcels | CC-BY 4.0 | LDS layer 50772, WFS/REST; updated daily | **`parcel_intent` classifies Crown/fee-simple/Māori/road etc. — public-vs-private without the Privacy-Act-gated owner-name tier** |
| DOC Public Conservation Land | CC-BY 4.0 | DOC ArcGIS Hub / Koordinates / data.govt.nz | Contact GIShelp@doc.govt.nz. DOC mid-GIS-migration through 2026 — expect URL churn | <!-- leakscan:allow: published government/organisation contact address, not personal data -->
| DOC tracks/huts/campsites | presumed CC-BY (verify per layer) | DOC ArcGIS Hub (GeoJSON/GPX); api.doc.govt.nz (key; terms unverified) | Exact dataset URLs need re-finding |
| Herenga ā Nuku (access maps) | CC-BY 3.0 NZ/4.0 — explicit third-party reuse | maps.herengaanuku.govt.nz REST; extracts via GIS@herengaanuku.govt.nz | Paper roads, access points, walkways — the authoritative access layer | <!-- leakscan:allow: published government/organisation contact address, not personal data -->
| MPI marine reserves / fisheries layers | CC-BY 4.0 (verify per layer) | data-mpi.opendata.arcgis.com; GISHub@mpi.govt.nz | Gazette is legal source of truth for mātaitai etc. | <!-- leakscan:allow: published government/organisation contact address, not personal data -->
| OSM (raw data / self-built tiles) | ODbL | Protomaps daily builds (`pmtiles extract`), NZ ≈ low-GB at z15 | Attribution "© OpenStreetMap"; rendered tiles = Produced Work |
| Open-Meteo weather | CC-BY 4.0 | api; free tier non-commercial (600/min); paid tier if app commercialises | No restriction on caching fetched forecasts |
| Māori Land Spatial Dataset | CC-BY 4.0 | data.govt.nz (2017-dated — find current at Māori Land Court) | ⚠️ Cultural-sensitivity product decision, not just licensing |

### 🛑 Not cacheable — link out or negotiate

- **OSM public tile server / OpenTopoMap**: offline/bulk use explicitly
  banned by usage policies. Never point the app at them.
- **MetService API**: proprietary; must delete data when purpose served, no
  redistribution; $30+/mo commercial. Live top-up only, if ever.
- **NIWA (tides, river flow, sea temp)**: standard terms ban
  publishing/hosting/passing on, both tiers. Needs a negotiated commercial
  licence — direct contact.
- **LINZ hydrographic charts**: NOT CC-BY (unlike LINZ topo). ENC service is
  S-63-encrypted per-cell subscription; raw LDS hydro layers say "not for
  navigation", licence unstated; S-57 via IC-ENC is commercial. Contact
  Hydro@linz.govt.nz for any chart feature. <!-- leakscan:allow: published government/organisation contact address, not personal data -->
- **LINZ tide prediction CSVs**: free but licence unstated + "not official
  tide tables" disclaimer — confirm with LINZ before shipping.
- **eBird**: API is personal/non-commercial single-copy; redistribution of
  data "in any media" explicitly banned; commercial use needs Cornell
  written permission (ebird@cornell.edu). <!-- leakscan:allow: published government/organisation contact address, not personal data -->
- **iNaturalist**: per-observation licences (CC0/BY/BY-NC/ARR) — bulk via
  GBIF export with per-record licence filtering, not the live API.
- **DOC hunting blocks / Fish & Game seasons**: PDF/web only, no open GIS.
  Season dates are gazetted (gazette.govt.nz) — legal text is the safer
  source. Outreach: GIShelp@doc.govt.nz; MPI Fishing Rules app backend: <!-- leakscan:allow: published government/organisation contact address, not personal data -->
  info@mpi.govt.nz. <!-- leakscan:allow: published government/organisation contact address, not personal data -->

## Tech findings (grounding for the birth ADRs)

- **MapLibre GL JS** (v6.x): only library with native vector tiles + WebGL
  + bundler-free ESM dist + `addProtocol` offline hook. ~251 KB gzip.
  Leaflet VT plugins abandoned/maintenance-mode; OpenLayers
  bundler-oriented, WebGL VT renderer lacks text. Handle iOS WebGL context
  loss (`webglcontextlost` → recreate; bugs #7022/#726/#2644).
- **PMTiles in OPFS**: Cache API cannot store 206 responses → don't serve
  archives via SW range requests. pmtiles `FileSource` over an OPFS `File`
  → `file.slice()` reads. Reference impl:
  github.com/makinacorpus/maplibre-offline-pmtiles (MIT). Region
  provisioning: `pmtiles extract` server-side; NZ z0–15 ≈ 1–3 GB vector vs
  ~10–15 GB raster Topo50.
- **Storage**: Safari 17+/iOS 17+: unified origin quota ≈ 60% of disk;
  installed home-screen apps exempt from the 7-day ITP rule and get
  `persist()` heuristically. Safari-tab and installed-app storage are
  separate silos (download regions **in the installed app**). OPFS writes:
  `createSyncAccessHandle()` in a worker (Safari < 26 lacks
  `createWritable`). Killers: Safari "Clear History and Website Data",
  icon deletion, storage-pressure LRU — cache is rebuildable by design.
- **GPS**: no background/screen-off geolocation on either platform (2026
  state). Wake lock everywhere, but broken in installed iOS PWAs until
  18.4. `watchPosition` (one long-lived), filter: accuracy gate (>30–50 m
  drop), teleport rejection, stationary radius, optional smoothing.
  Battery ~10–20%/h screen-on-dimmed. GNSS works with no data; cold start
  in the bush = 30 s–minutes (get first fix at the trailhead). Altitude
  from DEM, not GPS (no barometer on the web). iOS permission
  flakiness recurs per release — build a "location not working?" screen.
- **PWA capabilities**: iOS has no install prompt (manual A2HS; Safari 26
  opens any A2HS site as a web app); no Background Sync/Share Target on
  iOS (can't *receive* a shared GPX — use `<input type=file>`); Web Share
  incl. files works both platforms. Compass: iOS `webkitCompassHeading`
  (true north, permission gesture) vs Android `deviceorientationabsolute`
  (magnetic — add declination).
- **E2E sync sketch** (full detail in ARCHITECTURE): identity =
  `(groupID, rootKey)` random on-device; HKDF → data/index/auth keys;
  AES-GCM WebCrypto; QR/fragment pairing (Excalidraw/CryptPad pattern);
  per-object LWW + hybrid logical clocks (tracks immutable once recorded);
  Cloudflare Worker + R2 (free tier ample, zero egress), content-addressed
  encrypted segments + one CAS'd index (`onlyIf` etag). Metadata leakage
  (sizes/timing) mitigated by padding + batched pushes; documented, not
  over-claimed. Prior art: secsync, Faves ADR 0017 (passkey+PRF as later
  claim path; keypair per user from day one for future sharing).
