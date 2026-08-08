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

## Verdict (2026-08-08, three independent cold reviewers — platform/architecture, security/safety/cultural, feasibility/economics; all fresh-context Fable sessions)

**Overall: the Phase 0–2 spine is sound and correctly risk-first; the
directive layer around it needed a knife, gates, and three honesty
corrections. Nothing blocks Phase 0/1.** Findings condensed below with
dispositions; the full reviewer reports live in the session transcript and
their substance is folded into the docs/ADRs cited.

**Blockers (2, both resolved this session):**
- **Tides licence contradiction** (security + feasibility, independently):
  ARCHITECTURE shipped tides as ✅ while the repo's own research says the
  LINZ CSV licence is *unstated* (reviewer re-verified against LINZ).
  → Table row downgraded to blocked-pending-LINZ; constituent pipeline
  gated on written LINZ confirmation.
- **Platform posture contradicted itself across three docs** while the
  backlog accumulated native-only obligations; deferral compounds (storage
  silos make later migration dearer). → **Ruling (b) adopted**: PWA stays
  canonical product + committed thin Capacitor channel post-Phase 3,
  scoped to background GNSS + barometer (+BLE if marine revives); CarPlay
  entitlement-permitting; locked-screen listening cut. ADR
  `2026-08-08-0545-platform-posture`.

**Major clusters and dispositions (applied unless marked owner-decision):**
1. *No cutline / additive scope absorption* → ROADMAP restructured into
   v1 · post-v1 (evidence-gated) · icebox (externally gated); every big
   spend now names its gate. Outreach threads reclassified as options
   that may never open, off every critical path.
2. *Delta sync = research project in v1's clothing* (both technical
   reviewers) → demoted to post-v1, gated on real update-pain evidence;
   v1 ships versioned resumable full re-downloads. Owner's requirement
   stands as the end-state; the staging is the change.
3. *Whole-NZ floor unevidenced; omits the parcels layer; misfits older
   devices* → reworded to supported **ceiling** (device-permitting) with
   a device-test gate; ~1 GB national base is the true floor; access
   layer to be sized before Phase 2.
4. *Irreplaceable personal data in evictable storage* → Phase 1 gains
   `persist()` + storage UI + automatic local backup/export;
   "rebuildable" now explicitly tiles-only. Trip-readiness check added
   to Phase 3 accept-when. Phase 0 gains a scale/soak rider (≥5 GB,
   7-day dormancy, old-iPad cold start).
5. *E2E sync precedent under-specified for this data class* → sync ADR
   requirements recorded in ARCHITECTURE: ≥128-bit rootKey (Faves'
   44-bit bearer code explicitly rejected), per-device keypairs +
   rotation/revocation, signed version-chained index, web-delivery
   caveat, GCM nonce/AAD discipline, rate limits/quotas, trip-pattern
   metadata named, HLC skew cap.
6. *Parcels read as permission* → Phase 2 reframed access-not-ownership:
   DOC + Herenga ā Nuku are the go/no-go layers, parcels context;
   default-deny styling; currency date on the map face; hedge wording
   gets legal review as an accept-when.
7. *Māori land layer is a conduct risk, not a labelling problem* →
   off-by-default opt-in (answers the brief's open question);
   engagement (Te Kōti Whenua Māori + mana whenua) holds authority over
   the layer's shape and existence (e.g. status-on-tap vs area fill in
   hunting profiles), with "don't ship" a legitimate outcome; hard
   WORKPLAN gate.
8. *Sound ID shoot-decision hazard* → standing product rule: ID output
   is never framed as legal-to-take, warning in-feature; triple gate
   (licence, NZ taonga coverage, inference stability); AviaNZ GPL is
   link-out only, never vendored.
9. *One-dependency ADR already falsified* → superseded by
   `2026-08-08-0546-vendored-dependencies-rule` (each vendored dep is
   individually ADR'd + NOTICE'd).
10. *Marine verticals in v1* → deferred post-v1 (owner-decision noted:
    directive stands on the roadmap, staged behind the land verticals);
    no route-planning affordances over water; first-enable modal +
    persistent not-for-navigation badge when hydro ships. Dive-site
    layer is ODbL if OSM-seeded (not "ours").
11. *Export/share privacy undesigned* → export-privacy rules (near-home
    trim prompt, EXIF strip by default, optional fuzzing) required
    before any share feature ships.
12. *Honest-economics gaps* → data-ops section owed in ARCHITECTURE
    (per-layer refresh cadence; a layer without automated refresh shows
    its build date); operating-costs & licence-tripwire table owed in
    ECONOMICS ("free app" is load-bearing for Open-Meteo/BirdNET/NIWA
    terms — one NC analysis governs all three); Lighthouse Perf measure
    restated as an honest first-load budget; audience stays
    owner-household until data-refresh automation exists; "trust with
    your life" stays out of user-facing copy.

Minor/notes (CSP + untrusted-import rule, elevation-claim vs no queryable
DEM, multi-archive router design note, LINZ key expendability, tide
staleness windows, Privacy Act statement at sync time) are folded into the
docs they target.
