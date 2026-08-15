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

---

## Verdict — cold pass, 2026-08-15 (Fable; fresh session that wrote none of the brief, the research, or the ADRs)

**First act — the load-bearing assumptions, named before any prior verdict
or the deferred sibling was opened:**

- **LA1** "Maritime is first-class" ⇒ "marine instruments ship in v1" ⇒ "the
  shell is a certainty".
- **LA2** The marine ruling makes screen-off recording newly mandatory.
- **LA3** A Capacitor shell keeps push-to-deploy for its web assets ("web
  assets update over the air; only shell/plugin changes ride App Review" —
  ADR 0545).
- **LA4** The recurring platform tax argues against native-first (C/D) but
  not against starting the shell (B) early.
- **LA5** The research's "verified" table is verified.
- **LA6** The two rulings are coupled (the brief's own framing).
- **LA7** The deferral toll still grows with every phase (the founding
  review's ground for rejecting "continue to defer").

### Headline

The research's **negative** conclusion holds and is well grounded: native-
first — per-platform or cross-platform — buys no capability a Capacitor
shell does not, and is correctly closed. Its **positive** recommendation
(re-tier the shell into v1) rests on one overreach (LA1 → F1) and one
unexamined mechanism (LA3 → F3), and its own strongest cost argument cuts
against it (LA4 → F4). The marine ruling does not depend on the shell at
all: everything STRATEGY names as the marine half is web-reachable and
licence-clear bar tides. **The two rulings should be decoupled.** Sharpened
recommendations at the end; the decisions are Mike's.

Two MAJOR findings (F1, F3); the rest MINOR or record hygiene. Security &
privacy: one design-altitude finding (S1). `/security-review` was not run —
nothing in scope is code, and markdown is outside its file classes, so a
pass would be definitionally empty and is weighed as nothing.

### Findings

**F1 (MAJOR) — the coupling is an overreach: "marine first-class" is not
"marine instruments in v1".** STRATEGY defines the marine half as coastal
and bathymetric layers, reserves and fishing rules, dive sites, tides and
sea state, and a track that is a wake — and names *not a marine chart
plotter* a non-goal. None of that needs BLE or NMEA. AIS targets, depth
sounders, wind and NMEA 2000 gateways are chart-plotter features. So "that
half of the product cannot exist on the web at all" (SESSIONS 2026-08-09;
ARCHITECTURE § Platform posture ⏳ bullet 1) is false as stated: the
*instrument-integration* feature cannot, and it is not in the strategy's
marine half. The underlying capability claim is correct and re-verified
(caniuse: Web Bluetooth unsupported on iOS Safari through 26.5; WebKit has
no implementation) — the product-scope inference is what fails.
Consequence: the marine ruling does not establish the shell's certainty,
and the founding ADR's actual gate (screen-off recording for the land core
loop) is untouched by it. → **[backlog → owner ruling]** (ROADMAP ⏳ *Hybrid
Capacitor channel*); pointer notes added to ARCHITECTURE and the ROADMAP
so the next session does not read the overreach as settled truth.

**F2 (MINOR) — the marine screen-off argument is inverted.** Land is the
strong case (multi-day, nothing to charge from) and the founding ADR had
already made it. At a helm the tablet normally sits on ship's power with the
screen on — that is how every chart plotter runs — and a diver's phone is
not in the water. Marine adds little to the screen-off need; it removes one
stated ground for the shell's *timing*, not for its existence.
→ **[backlog → owner ruling]** (feeds R2).

**F3 (MAJOR) — "web assets update over the air; only shell/plugin changes
ride App Review" is unexamined and, as written, probably false.** Capacitor
bundles web assets into the binary. Its remote-URL mode (`server.url`) is
documented as "intended for use with live-reload servers … not intended for
use in production" (Capacitor config docs, fetched 2026-08-15). Over-the-air
web updates therefore need a live-update service (Capgo / Appflow class) —
a third party able to push code into an app holding hunting and fishing
locations, i.e. a **new trust surface** (CLAUDE.md floor) plus a recurring
cost — or the shell's users take every fix through App Review. Separately,
service-worker support under the `capacitor://` custom scheme on iOS is, to
my knowledge, absent — **unverified here**, so it goes on the Phase 0 spike
(F8) rather than into the record as fact. Net: B's push-to-deploy advantage
over C is a *web-user* property, not a *shell-user* property. This does not
reopen C/D (they lose the web surface entirely) but it weakens the case for
making the shell the primary way v1's owner-household audience runs the app,
and it is a consequence ADR 0545 promised and never priced.
→ **[backlog]**: the shell-track ADR (whenever the gate fires) states the
update mechanism and its trust surface before the track starts; the spike
answers the service-worker half. Pointer appended to ADR 0545.

**F4 (MINOR) — the research's own cost argument cuts against its
recommendation, and the record does not say so.** It calls "US$99/yr in
perpetuity plus a mandatory annual toolchain march" *the killer* for C/D —
and both halves re-verified: Apple requires Xcode 26 / the iOS 26 SDK for
every upload since 2026-04-28 (developer.apple.com/news/upcoming-
requirements, fetched 2026-08-15); Google Play additionally requires a new
personal developer account to run a closed test with ≥12 testers opted in
for 14 continuous days before production access (support.google.com
answer 14151465, fetched 2026-08-15) — a real hurdle for a solo project
whose audience is owner-household by design. But the tax starts when the
*shell* starts, whatever the tier: re-tiering into v1 starts the clock
before Phase 0 has proved the map. The Play target-API-36 date was **not**
re-verified by me. → **[backlog → owner ruling]** (feeds R2).

**F5 (MINOR) — deferral is now cheap, and the record says the opposite.**
The founding review rejected "continue to defer" because the retrofit toll
(storage silo, capability seam) grew every phase. The seams — recorder
(0545), sensor seams (0555), storage seam (this research → Phase 3) —
*discharge* that toll; that is what buying them early was for. So "that
reasoning now applies harder" is backwards: with the seams in, deferring
the shell itself costs little, and what remains is *demand* for a
native-only feature — of which Phases 0–4 as scoped contain none.
→ **[backlog → owner ruling]** (feeds R2).

**F6 (MINOR, record) — the "verified" table carries two verification
errors; the load-bearing rows hold.** (a) "Web Bluetooth landed in Chrome
151": caniuse's mobile column lists only the *current* Chrome for Android
(151); its desktop column reads "56 – 150: Supported". Web Bluetooth has
shipped on Chrome for Android since 56 (2017) — a misread of the source,
harmless to the conclusion, but the row is labelled *verified*.
(b) "Wake lock works on installed PWAs (iOS ≥ 18.4)": caniuse gives Safari
iOS 16.4+ and the claim is uncited; if 18.4 refers to a standalone-mode fix
it needs its source. Everything else I spot-checked held verbatim: WebKit's
storage-policy blog (browser app 60 % origin / 80 % overall; other apps
15 % / 20 %; a Home Screen web app "has the same origin quota and overall
quota as when it is opened in a browser app"; `persist()` granted "based on
heuristics like whether the website is opened as a Home Screen Web App");
Apple's SDK date; iOS Web Bluetooth. → **[fixed]** — a dated corrections
note appended to the research record; the body is left as written.

**F7 (MINOR) — "a certainty with a known trigger date" names no date.** If
the shell is certain, the record owes the trigger. R2 supplies one.
→ **[backlog → owner ruling]**.

**F8 (MINOR) — the Phase 0 WKWebView spike is under-specified.** As written
it measures MapLibre performance and "the quota asymmetry" — the latter is
documented policy, not a measurement. What an hour in a bare WKWebView /
Capacitor shell should actually establish: (i) MapLibre frame rate on the
same archive; (ii) whether OPFS and `navigator.storage.estimate()` work
under `capacitor://localhost` at all, and what quota they report; (iii)
whether a service worker registers (F3); (iv) that the shell sees none of
the installed PWA's data (expected: it does not — confirms the silo).
It needs a Mac with Xcode and a free Apple ID (7-day device builds), **not**
the paid Developer Program — say so, so nobody reads the spike as spend.
→ **[fixed]** in WORKPLAN.

**F9 (MINOR) — Phase 4 breaks its own rule.** "One hero per vertical" —
STRATEGY lists boating and diving as verticals; Phase 4 has four land heroes
and no water hero. That is inconsistent whichever way the marine ruling
goes. → **[backlog → owner ruling]** (feeds R1).

**F10 (harvest) — marine reserves are the access layer at sea, and the docs
have not noticed.** STRATEGY's second job is "am I allowed to be here?".
MPI marine reserves and fishing-rules layers (CC-BY ✅ in ARCHITECTURE's
audit) answer exactly that on the water. By the strategy's own logic they
belong in Phase 2 — same pipeline, same default-deny styling, same
currency-on-the-map-face rule — not in a post-v1 marine bundle.
→ **[backlog → owner ruling]** (feeds R1).

**F11 (brief framing — REVIEW.md rule 1) — the brief asks whether the two
rulings should be coupled; the answer is no.** Marine's staging is a
web-side question; the shell's tier is a native-channel question; the only
bridge is instrument integration, which sits outside the strategy's marine
half (F1). Coupling them lets the weaker ruling borrow urgency from the
stronger. → **[fixed]** by decoupling the ROADMAP pointers' review lines.

### Security & privacy

**S1 (design altitude; MAJOR-class for the shell track, not for the marine
ruling) — neither ADR 0545 nor 0555 enumerates threats for the native
channel; absent enumeration is the finding.** The shell adds: an App Store
presence (an install tied to a platform account — the PWA is *more*
accountless than the shell); location-always and Bluetooth grants; possibly
a third-party live-updater (F3) with code-push authority over an app holding
hunting and fishing locations — a supply-chain trust surface; and a second
storage silo inside the app sandbox, whose files iOS backs up to iCloud by
default unless excluded — whether tiles and user data are excluded from
backup, or the user chooses, must be a decision, not an accident (the
installed PWA's backup behaviour is different and I have **not** verified
it — a cheap Apple-docs check). Severity: design-time, nothing built, no
live exposure. Recurrence prevention: the shell-track ADR carries a threat
enumeration section, and each new surface it opens is a CLAUDE.md floor
confirmation, not a build task. → **[backlog]** (the shell-track ADR).

**S2 (input trust) — instrument data is untrusted input.** NMEA over
LAN TCP or BLE is unauthenticated plaintext; sentences are parsed under the
same `el()`-only rendering rule WORKPLAN sets for imported text. AIS carries
third parties' identity and position — display yes; persist into the user's
track store by default no. → **[backlog]** (the shell-track ADR).

**S3 (marine layers into v1) — no new privacy surface**: static cached
layers. The safety framing already on the ROADMAP (first-enable
not-for-navigation modal, persistent badge, no route planning over water)
is right; add Phase 2's legal read-over of hedge wording to it.
→ **[backlog]** (rides R1).

**S4** — `/security-review`: not run, grounds in the headline.

### Sharpened recommendations (the decisions are Mike's)

**R1 — Marine staging: into v1 on the web side, decoupled from the shell.**
Concretely: MPI reserves + fishing-rules layers into Phase 2 (F10 — they
*are* the access layer at sea); GEBCO bathymetry base + LINZ hydro vectors
into Phase 3's layer and region work, behind the first-enable modal and
persistent not-for-navigation badge; one water hero into Phase 4 (a wake
track plus an anchorage / dive-site log with sun and moon computed locally,
tide context joining when the LINZ licence answer arrives — the fishing
hero's pattern). Instrument integration (AIS, depth, wind, NMEA 2000) stays
post-v1 on the native channel and STRATEGY says so in as many words, so
"first-class" is never read as "chart plotter". Delivery risk is bounded —
same pipelines, one new disclaimer UX; the founding review's sequencing
ground survives *inside* each phase (land layers first, marine second).
Grounds: F1, F9, F10, S3.

**R2 — Shell tier: do not re-tier into v1; keep it post-Phase-3; widen the
single gate to two arms and name the trigger.** Arm A (evidence, unchanged):
screen-on recording fails a real owner field weekend. Arm B (ruling): the
owner names one native-only feature — an instrument integration or
background recording — as the next deliverable after Phase 3's Accept-when.
Either arm firing starts the track, and starting it is a floor confirmation
(spend + the S1 trust surfaces). v1 keeps every free obligation: the seams
(bought), the storage seam (Phase 3), the spike (Phase 0, per F8), and F3
answered before ADR 0545 is superseded. Grounds: F1–F5, F7.
**The dilemma, stated rather than resolved**: Mike's 2026-08-08 openness to
"whatever gets the full feature set" pulls the shell earlier; the economics
of a solo zero-build project, and v1's scope needing none of it, pull it
later. I recommend later. It is a genuine fork and his to pick.

### Follow-up checklist

- [ ] Owner rules on R1 and R2 (ROADMAP ⏳ items, both).
- [ ] On R1 accepted: WORKPLAN Phase 2/3/4 edits + STRATEGY line naming
  instrument integration post-v1.
- [ ] On R2 (either way): supersede or append ADR 0545 with the gate and
  the F3/S1/S2 obligations; ECONOMICS table takes the Play closed-test
  hurdle beside the Apple line.
- [x] F6 corrections note on the research record; F8 spike sharpened; F1/F3
  pointers on ARCHITECTURE, ROADMAP, ADR 0545 (this session).
