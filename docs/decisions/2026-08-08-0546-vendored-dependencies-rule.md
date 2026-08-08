# Vendored dependencies: individually ADR'd, pinned, NOTICE'd (supersedes the "one dependency class" framing)

**Status**: accepted • **Date**: 2026-08-08
**Review**: founding cold review finding (platform reviewer, finding 7) —
`../reviews/2026-08-08-0516-founding-architecture-and-directives.md`

## Context

ADR `2026-08-08-0450` sanctioned "exactly one dependency class" (the map
stack). The 2026-08-08 directives already imply more: TensorFlow.js (sound
ID), a hash library (delta sync, if built), a tide predictor. The cold
review found the one-class claim would erode by silent exception — the
exact failure ADRs exist to prevent.

## Decision

The zero-build invariant stands unchanged: no bundler, no npm at runtime,
no CDN. What changes is the dependency rule: **any vendored dependency is
allowed only with its own ADR** (what, why, size, licence, upgrade
policy), committed as pinned bytes in `site/vendor/` with a `NOTICE`
entry. The map stack (MapLibre + pmtiles, ADR 0450) is the first entry
under this rule, not an exception to it. GPL/copyleft code is never
vendored into this Apache-2.0 tree (link-out or a separate service only).

## Rejected

- **Keeping the one-class fiction:** each future need would arrive as a
  "small exception", eroding the ADR silently.
- **Open season on vendoring:** the per-dependency ADR is the friction
  that keeps the artefact lean and every addition deliberate.

## Consequences

- ADR 0450's "exactly one dependency class" sentence is superseded by
  this rule; its map-stack decision and all its rejections stand.
- Sound ID, delta sync, or tides each owe an ADR before their library
  lands — which also forces their licence questions (BirdNET NC, GPL) to
  be answered at the right moment.
