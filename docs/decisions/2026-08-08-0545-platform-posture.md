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

**Review of the challenge**: done 2026-08-15 —
`../reviews/2026-08-15-1033-platform-tier-and-marine-staging.md`. Held:
every rejection above, and the storage seam. Contested: "the shell is a
certainty" (F1 — marine's strategy-defined half needs no shell; instrument
integration does), and this ADR's "web assets update over the air" is
unexamined — Capacitor's remote-URL mode is documented as not for
production, so over-the-air means a third-party updater (a new trust
surface) or App Review per fix (F3). Neither ADR enumerates the native
channel's threats (S1). Recommendation R2: keep post-Phase-3, widen the gate
to two arms, name the trigger. Owner's ruling still outstanding.

## Addendum 2026-08-17 — the owner's ruling on tier (R2), and marine decoupled (R1)

The accepted text above stands. Mike ruled on both recommendations of the
2026-08-15 cold pass, and the two are independent of each other.

**R2 — accepted. The shell stays post-Phase-3, and the gate now has two arms.**
The original single arm (screen-on recording fails a real owner field weekend)
is joined by a second: **Mike naming a native-only feature as the next
deliverable after Phase 3.** Either arm opens the gate; neither is presumed.
This replaces the ADR's implicit "the shell is a certainty" framing, which the
review found overreached (F1) — the shell is *committed as a track* and
*unscheduled as work*, and those are different claims.

Naming the trigger is the point of the second arm. Without it the tier decision
would be re-litigated at every phase boundary by whoever felt the shell was
overdue, which is what happened between 2026-08-08 and 2026-08-15.

**Three obligations the ruling carries, none of them optional:**

- **F3 — the over-the-air update claim is unexamined and must be settled before
  the shell is built, not after.** This ADR asserted that web assets update over
  the air. Capacitor's remote-URL mode is documented as *not for production*, so
  in practice over-the-air means either a third-party updater — **a new trust
  surface, and therefore a floor confirmation before it is adopted** — or App
  Review per fix. Whichever it is, the honest cost belongs in ECONOMICS before
  the first native build, because it changes the shell's running cost, not just
  its setup cost.
- **S1 — neither ADR enumerates the native channel's threats.** A threat model
  is owed as part of the shell's own work, not retrofitted after it ships.
- **The platform tax is a standing obligation.** US$99/yr Apple in perpetuity
  plus a recurring toolchain march (current-year SDK for App Store submissions;
  Google Play's target-API and closed-test hurdles). ECONOMICS carries it.

**R1 — accepted, and it is decoupled from the above.** Marine layers join v1 on
the web side: MPI reserves + fishing rules into Phase 2 (they are the access
layer at sea, F10), GEBCO + LINZ hydro into Phase 3 behind the first-enable
modal and the persistent not-for-navigation badge, one water hero into Phase 4
(F9). Offline tides stay blocked on the LINZ written licence answer.

**Marine instrument integration — BLE/NMEA — stays post-v1 on the native
channel**, and STRATEGY now says so at the non-goal rather than leaving it to be
inferred. This is the distinction F1 turned on: the strategy-defined marine
*half* needs no shell; marine *instruments* do. Reading the first as requiring
the second is what made the shell look like a certainty.

Superseding this ADR is still deliberately not done: the ruling changes the
gate and the tier's justification, not the platform posture itself, and the
rejections above all held under review.
