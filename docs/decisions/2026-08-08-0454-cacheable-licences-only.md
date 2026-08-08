# Data layers: only licences that permit offline redistribution are cached

**Status**: accepted • **Date**: 2026-08-08
**Review**: not warranted — restates legal constraints found in the founding
data audit (2026-08-08); the contestable choices it forces (which sources to
pursue) sit in ROADMAP outreach items

## Context

Offline caching **is** redistribution: tūhura copies a data layer onto the
user's device and serves it for days. The founding data audit found the NZ
sources split cleanly: LINZ topo/aerial/DEM (CC-BY 4.0, local copies
explicitly permitted), DOC conservation land (CC-BY 4.0), MPI marine layers
(CC-BY 4.0, per-layer), Open-Meteo weather (CC-BY 4.0) — versus the OSM
public tile server (offline use explicitly banned), OpenTopoMap (bulk
download banned), MetService (must delete data, no redistribution), NIWA
(redistribution/hosting banned outright), and LINZ *hydrographic* charts
(not CC-BY — ENC subscription/commercial track, unlike LINZ topo).

## Decision

A layer ships in the offline cache **only** when its licence permits
redistribution, with attribution carried in-app (a visible attribution
screen plus map credits). Everything else is either:

- **linked out to** (live web view when in coverage, never cached), or
- **blocked pending an agreement** — recorded as a ROADMAP outreach item,
  never worked around by scraping or digitising PDFs.

OSM data comes from self-hosted extracts (Protomaps pipeline) under ODbL
with attribution — never the public tile server. Weather defaults to
Open-Meteo (cacheable), with the commercial tier budgeted if the app ever
commercialises; MetService, if ever used, is live-fetch only.

## Rejected

- **Cache now, sort licensing later:** the app is publication-bound and the
  estate's repos are built to be shareable; shipping a licence breach is a
  legal and reputational defect no feature justifies.
- **Digitising DOC/F&G PDF boundaries ourselves:** Crown-copyright
  derivative-work risk, plus a correctness risk on safety-adjacent data
  (hunting boundaries) that hand-tracing amplifies — outreach for the real
  GIS data instead.
- **Using the OSM/OpenTopoMap public tile servers with polite caching:**
  their usage policies ban precisely this; being IP-blocked mid-trip is also
  an offline-reliability failure.

## Consequences

- The v1 layer set is the CC-BY column: LINZ basemap/aerial/DEM, DOC
  conservation land, MPI marine layers, Open-Meteo weather. Hunting blocks,
  tides, and river data wait on outreach (ROADMAP) — the app degrades
  honestly (layer marked unavailable-offline) rather than shipping grey-area
  data.
- Every layer carries source + licence + currency metadata in its manifest,
  which is also what the in-app "data sources" screen renders.
- Attribution is a UI requirement from day one, not a retrofit.
