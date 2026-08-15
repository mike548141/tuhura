# Zero build step, with one vendored map dependency (MapLibre GL JS + pmtiles)

**Status**: accepted; its "exactly one dependency class" sentence superseded by
`2026-08-08-0546-vendored-dependencies-rule.md` (the map-stack decision and every
rejection stand) • **Date**: 2026-08-08
**Review**: done — founding cold review, verdict 2026-08-08
(`../reviews/2026-08-08-0516-founding-architecture-and-directives.md`; the
one-class framing was its finding 9, answered by ADR 0546). Pointer closed
2026-08-15 — it still read "brief to be filed" a week after the brief landed.

## Context

The sibling repo Faves proved the house shape for a PWA: zero build step,
vanilla HTML/CSS/ES-modules, no npm at runtime, `site/` is the whole product
(Faves ADR 0001). Faves' ADR 0005 then showed the wall that shape hits: a
real tile map "needs an external tile source **and** a map library",
so Faves handed off to native maps apps. tūhura *is* the map — the handoff
is not available. Rendering NZ topo vector tiles smoothly on a phone GPU is
not hand-writable vanilla JS.

## Decision

Keep the zero-build invariant — no bundler, no framework, no CDN, no package
manager at runtime — and sanction exactly **one dependency class**: the map
stack, **vendored** as pinned bytes in `site/vendor/`:

- **MapLibre GL JS** — its shipped `dist/maplibre-gl.mjs` + CSS (BSD-3-Clause)
- **pmtiles** — its shipped ESM build (BSD-3-Clause)

Each vendored file is committed with its version and licence recorded in
`NOTICE`; upgrading is a deliberate re-vendor commit, never an install step.
Everything else stays hand-written vanilla JS.

## Rejected

- **No map library (Faves ADR 0005 handoff):** the product is the map;
  linking out to Apple/Google Maps cannot show topo, hunting blocks, or
  offline layers in the backcountry.
- **Leaflet:** its vector-tile plugins are abandoned (Leaflet.VectorGrid) or
  officially maintenance-mode with MapLibre recommended instead
  (protomaps-leaflet); Canvas main-thread tile rendering is the slow path on
  mobile.
- **OpenLayers:** bundler-oriented package; its WebGL vector-tile renderer is
  immature (no text rendering); the discouraged full build is un-tree-shaken.
- **CDN-loading the library:** breaks offline-first (first visit in coverage
  must fully provision the app) and adds a third-party runtime trust surface.
- **npm + bundler:** toolchain rot the estate deliberately avoids; a build
  step makes every future session pay a tooling tax the product never repays.

## Consequences

- `site/` remains the complete artefact; a static file server still serves
  the whole product; MapLibre's ~251 KB gzip is a one-time cached asset.
- `NOTICE` becomes a required file, and vendor upgrades are visible,
  reviewable diffs.
- Faves' `check_no_deps.py` guard needs a tūhura variant: runtime
  dependencies stay forbidden, but `site/vendor/` is the declared exception
  (pinned files, recorded in NOTICE).
- iOS WebGL context loss becomes our problem to handle (recreate on
  `webglcontextlost`), and a WebGL feature-check gates the map screen.
