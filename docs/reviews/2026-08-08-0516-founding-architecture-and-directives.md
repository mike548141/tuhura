# Review brief — founding architecture + 2026-08-08 owner directives

**Subject**: tūhura's entire founding commitment, in the designed state
(no product code exists yet beyond a placeholder page): strategy,
architecture, platform choice, data/licensing posture, E2E sync design,
and the owner's 2026-08-08 directive set (sensors, sound ID, companion
mode, CarPlay, delta sync, whole-NZ cache, marine verticals, Māori land
layer, settings architecture). Designed by Fable (Claude), 2026-08-08,
grounded in the research records under `docs/research/`.

**Type**: design + decisions to build to — reviewable before code, when
being wrong is cheapest.

**Scope**: `CLAUDE.md`, `docs/STRATEGY.md`, `docs/ARCHITECTURE.md`,
`docs/DESIGN.md`, `docs/WORKPLAN.md`, `docs/ROADMAP.md`,
`docs/decisions/*` (three birth ADRs), `docs/research/*` (four records —
treat their claims as evidence the reviewer may challenge, not gospel).

## Load-bearing assumptions to challenge

1. **PWA-first is still right given the directive set.** The owner's
   directives include features the web platform cannot reach (background
   track logging, barometer, BLE accessories, locked-screen listening,
   CarPlay). The current posture is "PWA now; hybrid wrapper is an open
   question". Is that staging honest and wise — or is it deferral of an
   inevitable decision that will be more expensive later (rework, App
   Store friction, two deploy pipelines)? Should the repo commit now to
   (a) PWA-only with documented ceilings, (b) PWA + planned Capacitor
   track, or (c) native-first? Weigh: solo-owner maintenance economics,
   the zero-build doctrine, update velocity (push = deploy vs App
   Review), Guideline 4.2 rejection risk, and which directives actually
   matter in the field vs are nice-to-haves.
2. **The offline stack**: MapLibre + PMTiles-in-OPFS + LINZ vector tiles;
   makesync-style delta sync; 8–12 GB whole-NZ claim; installed-PWA
   storage durability on iOS. Are the failure modes (eviction, quota,
   WebGL context loss, Safari regressions) survivable for a
   trust-your-life offline promise?
3. **Licensing posture**: cacheable-licences-only ADR; the specific
   verdicts (LINZ CC-BY incl. parcels; BirdNET NC problem; NIWA bans;
   LINZ hydro split; tide-constituent derivation from LINZ CSVs). Is the
   tide derivation actually clean? Is `parcel_intent` sufficient for a
   safety-adjacent public/private land claim, and is the "indicative
   only" hedge enough legally/ethically?
4. **E2E sync design** (rootKey + HKDF + AES-GCM, QR pairing, LWW+HLC,
   R2 CAS): correct crypto shape? metadata-leak posture honest? LWW
   adequate for the data model (tracks immutable, waypoints
   append-mostly)?
5. **Māori land layer**: governance track (MLC engagement, labels,
   disclaimer, no wāhi tapu precision) — adequate? Default state on/off?
   Any risk this feature, in a *hunting* app context, causes harm the
   design hasn't faced?
6. **Scope realism**: seven verticals + sensors + sound ID + companion +
   CarPlay + delta sync + E2E sync, built by one owner with AI sessions.
   Is the WORKPLAN's phase ordering the right risk order? What should be
   cut or resequenced? Is Phase 0 still the riskiest assumption?
7. **Safety framing**: the app will be trusted in no-coverage backcountry
   and on the water. Are the "not for navigation" / "indicative only" /
   battery-honesty measures sufficient, or does anything here create a
   safety claim the product can't keep?

## Grounding

Nothing is built; grounding is the research records (web research,
2026-08-08, sources inline) and the sibling Faves repo's shipped
precedents (SW versioning, storage, a11y, E2E design ADR 0017). Cheap
checks available to the reviewer: the repo's docs cross-reference each
other; claims cite sources; the Faves repo exists at `../faves`.

## Non-goals

- Reviewing atelier doctrine itself (only this repo's application of it).
- Code review (no product code exists).
- Re-running the web research (challenge its conclusions where they look
  wrong, but a full re-sweep is not asked).

---

*Verdict: pending — cold review running 2026-08-08.*
