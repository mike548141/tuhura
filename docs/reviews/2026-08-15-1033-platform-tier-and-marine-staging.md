# Review brief — the shell's tier and marine's staging (two coupled owner rulings, before Mike rules)

**Subject**: two pieces of *direction*, recorded and awaiting the owner's
ruling, that the docs currently carry as contested (⏳):

1. **The platform tier.** ADR `2026-08-08-0545` (PWA canonical + a thin
   Capacitor shell, post-Phase-3, gated on a field failure of screen-on
   recording) was challenged on 2026-08-09. The challenge's record is
   `docs/research/2026-08-09-0449-platform-pwa-vs-native.md`, whose
   conclusion is that the ADR's *shape* holds but its *timing* does not, and
   that the shell should be re-tiered into v1. Two consequences were folded
   into WORKPLAN without waiting for the ruling (a storage seam in Phase 3; a
   MapLibre-in-WKWebView spike in Phase 0).
2. **Marine's staging.** The owner directed on 2026-08-09 that maritime use
   is a first-class half of the product, equal to land (STRATEGY, CLAUDE.md,
   README were rewritten to say so). The founding review had staged the
   marine layers post-v1 on delivery-risk grounds; the ROADMAP records the
   tension and leaves the tier unchanged pending the owner.

They are coupled: the marine ruling is the stated reason the shell's timing
is contested (marine instruments speak BLE / NMEA-over-TCP, closed to iOS
Safari). Both are Fable-authored records (2026-08-08 and 2026-08-09
sessions), written *for* the owner to rule on; neither has been reviewed.

**Type**: design + direction, in the designed state — nothing is built. This
is the cheapest moment to be wrong, and the most expensive one to be wrong
*and unreviewed*: whichever way the owner rules, the phases, the seams, and
the economics table will be built to it.

**Why it earns a review**: the worst failure mode is a ruling made on a
finding that overreaches — the owner re-tiers a native packaging track (with
its recurring platform tax and App-Review latency) into a solo v1 because a
research record said "the shell is now a certainty", when a narrower reading
of the same evidence would have changed only a *gate*; or, symmetrically, the
owner leaves marine post-v1 and the product ships a v1 that contradicts its
own strategy on the first screen. Either way the error propagates into every
phase's build.

**Scope** (point, don't paste):

- `docs/research/2026-08-09-0449-platform-pwa-vs-native.md` — the challenge,
  its four-option framing, its "verified" and "discredited" claims table, and
  its three-part conclusion. Treat its claims as evidence to test, not scope.
- `docs/decisions/2026-08-08-0545-platform-posture.md` — the ADR, including
  its *Challenged 2026-08-09* section.
- `docs/decisions/2026-08-08-0555-sensor-seams-and-native-channel-scope.md`
  — the widened native-channel scope that the marine argument leans on.
- `docs/STRATEGY.md` (§ what it is; the two marine and native non-goals) and
  the ROADMAP's two ⏳ items (*Hybrid Capacitor channel*, *Marine layers*)
  plus the *Standing threads → Data-ops* platform-tax note.
- `docs/WORKPLAN.md` — Phase 0's WKWebView spike, Phase 3's storage seam,
  Phase 4's activity heroes (currently four, all on land).
- `docs/ARCHITECTURE.md` § Platform posture and § Data layers (the marine
  rows and their licence verdicts).
- Prior review, for the reconcile step **only after your own findings are
  durably written** (REVIEW.md rule 2):
  `docs/reviews/2026-08-08-0516-founding-architecture-and-directives.md`.

**Grounding**: nothing is driven; the grounding is the research record's
sources (all public, dated, linked at its foot) and the docs' internal
cross-references. Cheap checks available to you: every platform-capability
claim in the research cites a primary source you can open (WebKit blog,
caniuse, WebBluetoothCG status, Apple/Google requirement pages, MapLibre
docs); the licence rows in ARCHITECTURE name their sources; the sibling
`../faves` repo holds the house PWA precedents the docs lean on. Where a
claim would need a device to test (WKWebView quota behaviour under
Capacitor's custom scheme; MapLibre performance behind the shell boundary),
say so and state what the cheap spike would have to show.

**Security & privacy** (a must on every review): the decision under review
adds or defers a *trust surface* — an App Store presence, native plugin
permissions (location-always, Bluetooth), instrument data streams, a second
storage silo — for a product whose user data (hunting and fishing locations,
home-adjacent tracks) is sensitive. Weigh the two rulings on that axis, not
only on capability and cost. `/security-review` cannot reach this work (no
code; markdown is outside its file classes) — say so in the verdict rather
than counting an empty pass.

**Non-goals**:

- Re-litigating the founding review's other clusters (sync design, Māori
  land layer, sound ID, delta sync) except where the platform or marine
  ruling changes them.
- Re-running the full platform web research; challenge its conclusions and
  spot-check its sources, a fresh sweep is not asked.
- Making the ruling. The output is findings and, where you can, a sharpened
  recommendation per ruling with its grounds — the decision is the owner's.

**Provenance**: brief written 2026-08-15 by a cold Fable session the owner
opened for review work; that session did not author the research or the ADR
(different sessions, 2026-08-08/09) but is the same author *class*, so
REVIEW.md rules 1–2 bind: the brief's own framing is attackable, and the
seeded questions sit in the sibling
`2026-08-15-1033-platform-tier-and-marine-staging.deferred.md` — open it
only once your findings are durably written, then fold it in below the
verdict and delete it. Name the load-bearing assumptions yourself as your
first act.
