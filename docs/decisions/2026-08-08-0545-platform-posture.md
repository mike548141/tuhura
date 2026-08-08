# Platform posture: PWA-canonical + a committed thin Capacitor channel

**Status**: accepted • **Date**: 2026-08-08
**Review**: this decision *is* a review outcome — founding cold review
(`../reviews/2026-08-08-0516-founding-architecture-and-directives.md`),
platform reviewer's ruling, adopted

## Context

The 2026-08-08 owner directives include capabilities the web platform
cannot reach (measured: `../research/2026-08-08-sensors-audio-companion.md`):
background/screen-off track logging, barometer, BLE accessories, CarPlay,
locked-screen listening. The founding docs briefly held three different
positions (STRATEGY "no native app"; ARCHITECTURE "open question"; ROADMAP
items assuming native paths). The cold review found the deferral unpriced:
installed-PWA and a future wrapper are separate storage silos, so every
gigabyte and waypoint shipped before the decision raises the migration
toll, and screen-on-only recording (10–20%/h battery) structurally fails
the hunting/tramping core loop — the ceiling is the core loop, not a
corner case.

## Decision

- **The `site/` PWA is the product and stays canonical**: sole codebase,
  zero-build vanilla JS, push-to-main deploys, instant updates. Nothing
  is built that only works wrapped.
- **A thin Capacitor shell is a committed post-Phase-3 packaging track**,
  not an open question. Its scope is exactly the native ceiling that
  earns it: **background GNSS track logging and barometer** (BLE
  accessories join if/when the marine verticals revive). The shell wraps
  the same `site/` artefact; web assets update over the air; only
  shell/plugin changes ride App Review.
- **CarPlay is parked entitlement-permitting** (discretionary
  `carplay-maps` grant Apple may never issue) — it does not justify the
  hybrid track; background GNSS does. **Locked-screen audio listening is
  cut** (native-only, and a foreground Merlin-style flow serves the use).
- **Cheap early obligations bought now**: the Phase 1 track recorder is
  built behind a capability seam (a location-stream interface a native
  plugin can later implement); ARCHITECTURE specifies the
  storage-migration path (export/sync bridge + re-provision flow) before
  Phase 3 ships gigabytes into a silo the wrapper can't read.

## Rejected

- **PWA-only with documented ceilings:** dishonest given the directive
  set — screen-on-only recording fails the owner's own success measure on
  a real hunting weekend; every serious competitor background-records.
- **Native-first:** forfeits deploy velocity, the zero-build core, and
  solo-maintainability for a rewrite; economically irrational for one
  owner building via AI sessions.
- **Continuing to defer:** the storage-silo migration toll and the
  capability-seam retrofit both grow with every phase; deferral was the
  most expensive option on the table.

## Consequences

- STRATEGY's non-goal becomes "no native *rewrite*; the PWA is canonical"
  — the wrapper is packaging, not a second product.
- US$99/yr Apple Developer account, an Xcode/signing toolchain, and
  Guideline 4.2 exposure arrive with the shell — priced in ECONOMICS when
  the track starts; the web side's zero-build doctrine is unchanged.
- The hybrid track starts only on its gate: a real field failure of
  screen-on recording (owner's weekend test), not speculation.
