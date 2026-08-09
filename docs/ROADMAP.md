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
(atelier's [review doctrine][review]: omission is the bug). Plain work items
don't.

**Structure (founding review, 2026-08-08): three tiers.** v1 is the
committed spine; post-v1 items are **evidence-gated** (each names the gate
that unlocks it); icebox items are **externally gated** (events outside
our control). Owner directives are staged, never dropped — the tier
records *when*, the gate records *why then*.

## v1 — the committed spine (zero external dependencies)

- [ ] **Phase 0 — offline map proof + scale/soak rider** (WORKPLAN): the
  riskiest assumption first, including the hard half (≥5 GB archives,
  7-day dormancy, old-iPad cold start).
- [ ] **Phase 1 — personal layer** with durability from day one:
  `persist()`, storage UI, automatic local backup/export (user data is
  NOT rebuildable — tiles are), recorder behind the capability seam
  (ADR 2026-08-08-0545).
- [ ] **Phase 2 — access layer**, framed access-not-ownership: DOC +
  Herenga ā Nuku are the go/no-go layers, parcels context with
  default-deny styling + on-map currency date; hedge wording gets legal
  review (accept-when).
- [ ] **Phase 3 (slim) — regions & trip readiness**: user-scalable
  regional downloads with honest per-layer sizes, versioned **resumable
  full re-downloads** (delta staged post-v1), Open-Meteo prefetch,
  pre-departure **trip check** (integrity + persist status + free-space
  headroom), quality gate.
- [ ] **Phase 4 — activity heroes** (zero-dependency versions): 4WD
  track grades; hunting blood-trail mode; fishing catch log + moon
  (tides join when licensed); birding checklist.
- [ ] Foreground sensor features as they fit phases, all via the sensor
  seams (ADR 2026-08-08-0555): on-screen compass widget, 4WD vehicle
  level (pitch/roll in degrees), camera waypoint photos, voice notes.
- [ ] Land-status presentation study (overlay vs crossing alerts vs
  tap-for-status, per layer) — inside Phase 2's design work.
  review: not warranted — an open design question recorded, not a
  decision; the Phase 2 accept-when carries the review.

## Post-v1 — evidence-gated (owner directives staged here by the review)

- [ ] **Hybrid Capacitor channel** → background GNSS logging + barometer.
  Gate: screen-on recording fails a real owner field weekend.
  review: done — ADR 2026-08-08-0545 (the founding review's ruling)
  ⏳ **Gate contested, owner's call outstanding.** Mike re-opened the
  platform question 2026-08-09; researched in
  `research/2026-08-09-0449-platform-pwa-vs-native.md`. Finding: the ADR's
  shape holds (native-first buys no capability the shell doesn't), but its
  timing does not — marine instruments (BLE/NMEA, permanently closed to
  iOS Safari) and screen-off recording are now committed features that
  cannot ship without the shell, so the gate is met in principle already.
  Open: re-tier the shell into v1. Two consequences do NOT wait on that
  ruling and are folded into the phases — the WKWebView storage-quota
  asymmetry (15% vs 60% of disk) means Phase 3 needs a storage seam, and a
  MapLibre-in-WKWebView spike belongs in Phase 0.
- [ ] **Delta sync** (makesync-style, changed blocks only — the owner's
  end-state requirement). Gate: real users + measured update pain from
  full re-downloads; verify OPFS `move()` + makesync format stability
  first. review: done — founding review, demoted from v1 with grounds
- [ ] **Whole-of-NZ offline ceiling** (device-permitting; ~1 GB national
  base is the floor). Gate: a real 8–12 GB provision test passes on
  actual devices, access layer sized in. review: done — founding review
- [ ] **Sound ID** (BirdNET-class, foreground). Triple gate: Cornell NC
  clearance (or Perch NZ-coverage verified), taonga-species gap closed,
  long-session inference stable on iOS. Standing rule: ID output is
  never framed as legal-to-take (in-feature warning). GPL models
  link-out only. review: done — founding review
- [ ] **E2E sync backend** — own ADR gated on the recorded requirements
  (ARCHITECTURE § sync: ≥128-bit rootKey, device keypairs + revocation,
  signed index chain, web-delivery caveat, nonce/AAD, quotas, HLC skew
  cap); then sharing (key-wrapping), then export-privacy rules ship
  BEFORE any share feature. review: queued (the sync ADR when written)
- [ ] **Marine layers — boating & diving**: GEBCO + LINZ hydro vectors with
  first-enable modal + persistent not-for-navigation badge, no
  route-planning over water; dive-sites layer ODbL if OSM-seeded;
  offline tides ⏳ blocked on LINZ written licence confirmation.
  review: done — founding review (staging is its recommendation)
  ⏳ **Staging contested, owner's call outstanding.** Mike directed
  2026-08-09 that maritime use is first-class, equal to land — STRATEGY and
  CLAUDE.md now say so. The founding review's "stage marine after the land
  verticals prove out" was a *sequencing* recommendation on delivery risk,
  not a statement of worth, so the two are not strictly contradictory — but
  leaving marine as the only post-v1 vertical does read as second-class, and
  Phase 4's activity heroes (WORKPLAN) currently have no water hero. Open:
  does a marine hero (dive-site/anchorage log with tide context, or a
  drift/wake track) join v1 Phase 4, and do bathymetry + reserves join the
  Phase 2/3 layer work? Not decided here — the tier is unchanged until Mike
  rules.
- [ ] **Māori land status layer** — ship per owner ruling **subject to
  engagement**: Te Kōti Whenua Māori + mana whenua hold authority over
  the layer's shape and existence (status-on-tap vs area fill in hunting
  profiles is theirs to call; "don't ship" is a legitimate outcome).
  Off by default, explicit opt-in behind the disclaimer. Gates: current
  dataset (not 2017) + engagement outcome. review: done — founding review
- [ ] UX + settings deep design pass (activity profiles). Gate: ≥2
  verticals have real layers to bundle. review: queued (own brief then)
- [ ] Companion-mode docs page: recommend MFi GNSS puck / cellular iPad
  (zero-code paths); native sensor bridge folds into the hybrid channel.
- [ ] Vehicle telemetry (owner directive 2026-08-08): OBD-II/CAN read-only
  via BLE adapters (ELM327-class) on the native channel — engine temp,
  RPM, tyre pressures as a `vehicle-telemetry` seam backend; boundary-
  crossing alerts join once continuous position + land layers coexist.
  Gate: the hybrid channel exists. review: done — ADR 2026-08-08-0555

## Icebox — externally gated

- [ ] CarPlay (owner directive): needs the hybrid shell + Apple's
  discretionary `carplay-maps` entitlement — an approval Apple may never
  grant a free accountless app. Re-evaluate if/when the hybrid channel
  exists and the entitlement climate changes.
- [ ] Game-mammal call ID: no model or dataset exists anywhere; would be
  a community data-collection programme (1,000+ labelled field clips per
  class).
- [ ] Offline peer-to-peer waypoint share; community POI layers;
  satellite messaging (Apple API unreleased).
- [ ] Vehicle **control** via CAN (owner mused 2026-08-08): safety-
  critical actuation — own ADR + full review before any design; never
  rides in on telemetry (ADR 2026-08-08-0555).

## Standing threads (options that may never open — off every critical path)

- [ ] Outreach, Mike sends, drafts on request: DOC (hunting-block GIS) ·
  NIWA (tide/river commercial licence) · MPI (Fishing Rules data) ·
  Cornell (BirdNET NC clearance) · LINZ (tide CSV licence, in writing) ·
  Te Kōti Whenua Māori (Māori land engagement). Contacts in `research/`.
  Features gated on these are options, not plans.
- [ ] Data-ops: ARCHITECTURE owes a per-layer refresh-cadence section;
  a layer without automated refresh displays its build date. ECONOMICS
  owes the operating-costs & licence-tripwire table ("free app" is
  load-bearing for Open-Meteo/BirdNET/NIWA terms — one NC analysis
  governs all).
