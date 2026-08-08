# tūhura roadmap

Tick items as work lands. Keep this file honest — it's the cross-session
memory of what's actually left — and lean: it's read at every session
start. Move completed detail to ROADMAP-DONE.md once it grows.

Checkbox states are a **work-owed tri-state**: `[ ]` work still owed ·
`[~]` claimed/underway · `[x]` no more work owed — delivered, superseded,
or declined, with the disposition in the item's own dated note (the
harvest-integrity gate holds archive stores to finished-state items only —
a live `[ ]`/`[~]`/`⏳` item there reds the floor).

An entry that records **design or direction** (a chosen approach, a scoped
feature, a decision that forecloses alternatives) carries a review line —
`review: queued (docs/reviews/<file>)` or `review: not warranted — <grounds>`
(atelier `method/REVIEW.md`: omission is the bug). Plain work items don't.

## Now / next

- [ ] **Founding architecture review** — the stack, offline model, and E2E
  sync sketch in `ARCHITECTURE.md` + the birth ADRs are a commitment others
  build on; review before Phase 1 code hardens it.
  review: queued (brief to be filed in `docs/reviews/`)
- [ ] **Phase 0 — offline map proof** (WORKPLAN): vendor MapLibre + pmtiles,
  LINZ `topographic-v2` regional PMTiles in OPFS, installed-PWA render in
  flight mode on a real iPhone + Android. The riskiest assumption first.
- [ ] Data/licence outreach — DOC (hunting-block GIS), NIWA (tide/river
  commercial licence), MPI (Fishing Rules app data), Cornell (BirdNET
  NC-licence clearance), Te Kōti Whenua Māori (Māori land layer
  engagement). Contacts in `research/`. These determine whether the
  activity layers ride on open data or negotiated agreements. Drafts are
  a session's work; Mike sends.

## Backlog — owner directives 2026-08-08

Scope set by Mike; mechanics land from the sensor/companion/delta/marine/UX
research records and the founding review.

- [ ] Sensor features (foreground, web-viable now): compass bearing,
  4WD pitch/roll HUD (`devicemotion`), camera waypoint photos, voice
  notes. Sensor matrix: `research/2026-08-08-sensors-audio-companion.md`.
  review: queued (founding review covers the platform question)
- [ ] Native-ceiling sensor features (need the hybrid/native call first):
  background track logging, barometer (elevation/weather-trend/dive),
  BLE accessories (AIS, fishfinders), CarPlay, locked-screen listening.
  review: queued (founding review — the PWA vs hybrid decision)
- [ ] Sound ID: BirdNET-based (NZ species incl.; kea + 4/5 kiwi absent —
  gap), TF.js on-device per Cornell's own BirdNET-Live PWA precedent;
  foreground listening like Merlin-in-use. Game **birds** ride the same
  model; game **mammals** (deer/pig) have no model anywhere — parked as a
  data-collection programme. ⏳ Blocked on Cornell NC-licence clearance
  (contact in `research/`); fallback Google Perch (Apache-2.0, verify NZ
  labels); AviaNZ kiwi/morepork filters (GPL, legal care).
  review: queued (founding review)
- [ ] Companion mode (old iPad on the dash): document + recommend the
  zero-code paths — MFi GNSS puck (Garmin GLO 2, ~NZ$219) or cellular
  iPad; hotspot GPS pass-through is a debunked myth (drive-test protocol
  in research). A software bridge incl. barometer = native both ends —
  folded into the platform question.
  review: queued (founding review)
- [ ] CarPlay support (owner directive 2026-08-08): the map + live
  position on the head unit for the on-road legs. Web content cannot
  render on CarPlay — this needs a native Swift `CPMapTemplate` scene
  (viable inside a Capacitor-wrapped app) plus Apple's discretionary
  `carplay-maps` entitlement — so it rides the platform decision and is a
  strong argument for the hybrid track.
  review: queued (founding review — platform question)
- [ ] Weather & marine feeds cached before-you-go: Open-Meteo forecast +
  Marine API (CC-BY, cacheable); satellite/radar imagery only if a
  licence-clean source is found (MetService imagery terms hostile).
- [ ] Delta sync for map/data updates — makesync-style block-hash sync,
  changed blocks only (ARCHITECTURE § Offline data lifecycle).
  review: queued (founding review)
- [ ] Whole-of-NZ offline as supported floor; user-scalable regions with
  honest per-layer sizes (≈8–12 GB all-layers-minus-aerial; aerial
  per-region opt-in).
- [ ] Marine verticals: GEBCO bathy + LINZ hydro vectors (not-for-nav
  disclaimer) + marine reserves + curated dive-sites layer + offline
  tides from self-derived constituents fitted on LINZ open CSVs.
  Chart-grade navigation stays out until properly licensed.
- [ ] Māori land status layer — **ship it** (owner ruled 2026-08-08),
  settings-toggleable, governance track per research (LINZ legal
  categories as labels, "indicative only" disclaimer, link to Pātaka
  Whenua). ⏳ Engage Te Kōti Whenua Māori as data authority + mana whenua
  consultation before build; current dataset (2017) needs the live source.
  Default on/off state: review question.
- [ ] UX + settings architecture: deep design pass — activity profiles,
  progressive disclosure, field-condition UI; research seeded in
  `research/`, then a DESIGN.md rewrite.
  review: queued (design commitment — own brief when the pass runs)

## Backlog — founding set

- [ ] Waypoints + tracks: record (screen-on, wake lock), GPX import/export,
  IndexedDB store — the personal layer.
- [ ] Activity overlays as layers: conservation land (DOC CC-BY), marine
  reserves (MPI), hunting blocks / seasons / tides (blocked on outreach).
- [ ] Region download manager: pmtiles extract pipeline, storage budget UI
  (`storage.estimate()`), persist() flow, cache-repair manifest.
- [ ] Weather: Open-Meteo fetch-before-you-go, cached point forecasts.
- [ ] E2E sync backend (Worker + R2) per ARCHITECTURE sketch — own ADR before
  any backend lands (precedent: Faves ADR 0009's gate).
  review: queued (with the founding architecture review)
- [ ] Sharing with other users (key-wrapping, per-scope grants) — after
  self-sync proves out.
- [ ] True-dark map style for night use at camp; compass/heading UI.
