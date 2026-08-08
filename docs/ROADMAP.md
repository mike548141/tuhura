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
- [ ] Data outreach — DOC (hunting-block GIS), NIWA (tide/river commercial
  licence), MPI (Fishing Rules app data; contacts in `research/`): these
  determine whether the activity layers ride on open data or negotiated
  agreements. Drafts are a session's work; Mike sends.

## Backlog

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
