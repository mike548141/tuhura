# Platform posture: PWA-canonical + a committed thin Capacitor channel

**Status**: accepted; **timing challenged 2026-08-09, ruling outstanding**
• **Date**: 2026-08-08
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

## Challenged 2026-08-09 — timing, not shape (ruling outstanding)

Mike re-opened the platform question. Researched against current sources:
`../research/2026-08-09-0449-platform-pwa-vs-native.md`.

- **What held**: every rejection above survives. Native-first (including
  the cross-platform options — React Native, Flutter, KMP — which this ADR
  never separately examined) buys **no capability** a Capacitor shell does
  not, while forfeiting the zero-build core, push-to-deploy, and the free
  web surface, and adding a permanent annual toolchain-upgrade tax.
- **What broke**: the gate. This ADR deferred BLE explicitly — *"BLE
  accessories join if/when the marine verticals revive"* — and they revived
  the next day, when Mike ruled maritime a first-class half of the product.
  Marine instruments (BLE, NMEA-over-TCP) are permanently unreachable from
  iOS Safari, so the shell is now a certainty rather than a contingency on
  a field failure, and "post-Phase-3" is contested.
- **What was missed**: an embedded WebView's origin quota is 15% of disk
  against Safari's 60%, so the "separate storage silos" consequence is
  sharper than recorded — a wrap that keeps tiles in OPFS *shrinks*
  capacity. The obligations this ADR bought early were the right *kind*;
  there was one more to buy (a storage seam), now folded into WORKPLAN
  Phase 3.

Superseding this ADR is deliberately **not** done here: re-tiering a
review-outcome ruling is the owner's call, flagged on ROADMAP.
