# tūhura session log (append-only)

One entry per working session, newest LAST. Append only — never edit or
rewrite prior entries. At session start read the tail (e.g.
`tail -60 docs/SESSIONS.md`); the full history is for grepping. Append an
entry before finishing a session.

- **2026-08-08**: Repo created and scaffolded to the house conventions
  (doctrine block pinned `atelier@320f9b1`, scan hook wired and proven).
  Mike named the app **tūhura** and set the frame: offline-first mobile PWA
  map app for off-road driving, hunting, fishing, birding; accountless with a
  future E2E-encrypted sync backend; atelier doctrine rules the work.
  Founding research fanned out to sub-agents (Faves learnings; competitor
  features; NZ data sources + licensing; offline PWA map tech + E2E sync) and
  grounded the first ADRs and docs. Next: work `docs/WORKPLAN.md` Phase 0 —
  vendor MapLibre + pmtiles, prove an offline LINZ vector basemap on a phone.

- **2026-08-08 (second session, same day)**: Owner directive sweep —
  sensors, sound ID, companion mode, CarPlay, delta sync, whole-NZ cache,
  marine verticals, Māori land ruling (ship it, toggleable), settings
  architecture. Seven research agents; two new research records. Then the
  **founding cold review** (three independent reviewers; brief + verdict
  in `reviews/2026-08-08-0516-…`): platform ruled — PWA-canonical + thin
  Capacitor channel (ADR 0545); dependency rule superseded (ADR 0546);
  ROADMAP re-tiered v1/post-v1/icebox with evidence gates; tide-licence
  and whole-NZ honesty fixes; parcels reframed access-not-ownership;
  Māori land layer off-by-default with engagement authority; personal-data
  durability pulled into Phase 1. Owner then endorsed the verdict and
  added: compass widget + 4WD vehicle level (degrees) to v1; land-status
  presentation recorded as an open design question (overlay vs crossing
  alert vs tap-for-status); sensor sources become pluggable seams
  (ros/tiki pattern) with the native channel's scope widened to BLE +
  OBD-II/CAN read-only telemetry (ADR 0555; vehicle *control* iceboxed,
  safety-gated); owner confirmed full-feature-set outranks PWA purity —
  ADR 0545's ruling stands with the wider scope. Session closed clean.
  Next: Phase 0 with its scale/soak rider.

- **2026-08-08 (third session, same day)**: Publication. Audited the repo's
  atelier wiring end to end — hooks path, `hooks.atelierTools`,
  `.atelier-floor.json`, the floor + CI workflows, doctrine pin (no drift),
  commit signing (all history born-signed) — all sound and proven green on
  the last four pushes, so no remedial wiring was needed. Two real gaps
  closed before the flip: `SECURITY.md` written (absent entirely; it is a
  publish-time artefact, and its scope leads with safety-adjacent data
  rendered wrongly rather than the usual web surfaces), and the twelve
  `pathscan` findings fixed properly — cross-repo pointers into atelier
  converted from bare relative paths to reference-style URLs, so they
  resolve for a reader with no sibling checkout. Mike gave informed
  authorisation and the repo went **public**. Reviews: none were due —
  `reviewscan` and `pointerscan` both clean, and the two `review: queued`
  lines are gated on artefacts that don't exist yet, so nothing was blocked
  on a Fable session. Next: Cloudflare Pages deploy, then Phase 0.

- **2026-08-08 (fourth session, same day)**: Went live. Cloudflare Pages
  wired the same way as the sibling faves repo — git-connected project
  provisioned as code (`tools/deploy.py` + `tools/deploy.json`), custom
  domain `tuhura.myspot.nz`, proxied CNAME created by the script (the API
  attach does not create it; only the dashboard flow does). Its own
  least-privilege token minted from the estate root via the estate's mint
  tool: Pages Edit on the account, DNS Edit + Zone Read on the one zone,
  auto-tightened from all-zones in the same run; registered in the estate
  credential registry (metadata only) and validated. The hostname exists
  deliberately ahead of the app: a service worker's cache scope is bound
  to its origin, so moving origin after devices hold gigabytes of tiles
  would be a migration, and moving it now is free.
  Verified live: `tuhura.pages.dev` and `tuhura.myspot.nz` both 200 with a
  valid certificate. `dig` against 1.1.1.1 resolves; only the owner's Mac
  held a stale negative DNS entry, which a local cache flush clears.

  **Auto-deploy is not wired, and the first write-up here got it wrong.**
  It recorded the missed webhook as a one-off that "just needed a manual
  kick", on the strength of the provisioning push alone. A second push
  also produced no deployment, which falsified that: the project has one
  deployment and it is the one triggered by hand. The actual cause is that
  Cloudflare's GitHub App does not have this repo in its installation —
  Pages can still clone, because a public repo needs no grant to read,
  which is exactly what made a broken webhook look like a working
  connection. Grant is browser-only and outstanding. `deploy.py` gained
  `deploy` and `status` subcommands so publishing is not blocked meanwhile,
  and README/CONTRIBUTING/DEPLOY/CHANGELOG were corrected — they had all
  claimed push-deploys on the strength of the provisioning step succeeding.
  The lesson worth keeping: a deploy path is not proven by the deploy you
  triggered yourself.

- **2026-08-09**: Auto-deploy closed out. Mike granted the repo to the
  Cloudflare Workers and Pages GitHub App and flushed the stale local DNS
  entry; both verified rather than assumed. An empty commit produced a
  deployment nobody triggered, and its metadata reads
  `type: github:push, branch: main, commit: 4d36c16` against the previous
  one's `ad_hoc` — which both proves the webhook and confirms the earlier
  diagnosis was right. `tuhura.myspot.nz` now resolves and serves 200
  directly from the owner's machine.
  The workaround documentation was then removed as promised: README,
  CONTRIBUTING, CHANGELOG and DEPLOY.md are back to "a push is a deploy".
  `deploy` and `status` stay, re-framed — `deploy` is now a force-rebuild
  for transient build failures rather than a workaround, and DEPLOY.md
  keeps a short troubleshooting note recording that a public repo makes a
  dead webhook look healthy, since that is the trap that cost a wrong
  diagnosis and would otherwise cost the next one too.
  Next: Phase 0 with its scale/soak rider.

- **2026-08-09**: Two owner directives, one session. First, **maritime is a
  first-class half of tūhura** — boating, diving and fishing on the water
  rank equal with off-road driving, tramping, mountaineering, hunting and
  birding on land. The docs had marine bolted on as a vertical (STRATEGY led
  with the land list and appended the water one; CLAUDE.md, README and the
  live shell omitted water entirely; mountaineering appeared nowhere), so
  every statement of what tūhura is now splits the activity list by medium
  with neither as the default, and names where the two genuinely differ.
  The "not a marine chart plotter" non-goal stays, restated as the LINZ ENC
  licensing limit it always was rather than a ranking. Roadmap staging was
  deliberately left alone: the founding review staged marine post-v1 on
  delivery-risk grounds, which is a sequencing call, not a worth call — the
  tension is recorded on the item for Mike to rule rather than silently
  re-tiered.

  Second, Mike re-opened the **platform question** (PWA vs native), which
  ADR 2026-08-08-0545 had settled as PWA-canonical + a contingent Capacitor
  shell. Researched properly against current sources rather than priors:
  `research/2026-08-09-0449-platform-pwa-vs-native.md`. Two popular claims
  that would have decided it wrongly are false — the "50 MB PWA cap" and
  "iOS deletes PWA data after 7 days" both predate iOS 17, where WebKit
  grants a home-screen web app 60% of disk and `persist()` exempts it from
  eviction. The real ceiling is narrower and permanent: background location,
  Web Bluetooth (WebKit has no implementation and Mozilla calls the API
  harmful — it is not coming), raw sockets, barometer.
  **The finding: the ADR's shape survives, its timing does not.** Native-
  first buys no capability the shell doesn't, while costing zero-build,
  push-to-deploy and a US$99/yr-plus-annual-SDK-march maintenance tax on a
  solo project. But the maritime ruling converted the shell from
  contingency to certainty the same day — marine instruments speak BLE and
  NMEA-over-TCP, both permanently closed to iOS Safari, so that half of the
  product cannot exist on the web at all. Re-tiering the shell into v1 is
  Mike's call and is flagged, not taken.
  One genuinely new finding needed no ruling and was folded into the
  workplan: an embedded WebView's origin quota is 15% of disk against
  Safari's 60%, so a later wrap that keeps tiles in OPFS would *shrink*
  capacity fourfold. Phase 3 now builds archives behind a storage seam
  (OPFS now, native filesystem later) and Phase 0 gains a cheap
  MapLibre-in-WKWebView spike — the one assumption that could still favour
  a rewrite, and an hour to test.
  Next: Phase 0, plus two owner rulings outstanding (marine staging, shell
  tier).

  **Owed, not done — doctrine drift is unread.** `atelier` has moved 27
  commits past this repo's pin (`320f9b1`); the session-start rule is to read
  the drift and bump the pin deliberately, and this session did neither,
  staying in the lane Mike set. Unread, so the risk is unpriced rather than
  known — the log alone shows changes to propagation rules, a new PRINCIPLES
  section, and a floor change to boundary checks, any of which may bind this
  repo's own CLAUDE.md. Flagged to Mike 2026-08-09; wants its own short
  session before the next substantive one.

  **Record audit (Mike asked, same session).** The first close-out claim
  that nothing was uncaptured was **wrong**, and checking rather than
  asserting found it: the research existed but the docs a future session
  actually reads at start still stated the old posture as settled. STRATEGY
  presented the non-goal with no hint it had been challenged, ARCHITECTURE
  § Platform posture still said "decided" and "post-Phase-3", and the ADR
  carried a bare "accepted" status. A session reading the prescribed order
  would have taken stale truth and never reached the research. Fixed at all
  three, plus the ADR gained a Challenged section recording what held, what
  broke, and what it had missed; ROADMAP's data-ops thread gained the
  recurring platform tax (US$99/yr plus the annual SDK march) that ECONOMICS
  owes. Lesson worth keeping: a finding is not recorded because a document
  exists — it is recorded when the documents that get *read* point at it.

- **2026-08-15**: Cold session, Mike's lane: review work, Fable-dependent
  work, and briefs for reviews that need them — write the brief, don't run
  it. Three things done, one queued.
  **The doctrine drift is read and the pin bumped** (`320f9b1` → `b5da9e5`,
  73 commits) — the debt the 2026-08-09 session recorded. What binds this
  repo: the Three Laws left atelier's apex (Mike's ruling 2026-08-15; the
  apex is honesty, then adaptation), so the inlined block sheds the Laws
  sentence and now matches the canonical block byte-for-byte bar the
  fill-ins; PROPAGATION's new rule that a child may *add* but never *repeat*
  made `docs/ECONOMICS.md` a defect — it was a full restatement of the house
  policy with no repo-local fact in it — so it is trimmed to what atelier
  cannot hold (seat application here, the field-test-is-spend point, and the
  operating-costs/licence-tripwire table it still owes); PRINCIPLES §9 (data
  carries its time dimension, and it binds retrofits) is folded into the
  WORKPLAN where it bites before it is too late — the Phase 1 personal-layer
  schema carries world time and record time apart with dated tombstones, and
  the Phase 3 manifest carries data currency and build date as two dates. The
  split-board migration does *not* reach here (RECORD.md: a repo that has not
  adopted the split keeps the monolithic form). "Work lands in the repo it
  changes" needed nothing.
  **Review-record hygiene**: ADRs 0450 and 0452 still said "queued — brief
  to be filed" a week after the founding brief landed and closed; both now
  point at the verdict, 0450's status carries the partial supersession by
  0546 that 0546 declared and 0450 never acknowledged, and the ADR index —
  empty since scaffold, six ADRs unlisted — is populated.
  **Brief written, not run**:
  `reviews/2026-08-15-1033-platform-tier-and-marine-staging.md` — a cold
  pass on the two coupled owner rulings still outstanding (re-tier the shell
  into v1; marine's staging), so Mike rules on a tested finding rather than a
  fresh one. Seeded questions sit in the `.deferred.md` sibling per REVIEW.md
  rule 1 (same author class wrote the research); pointers queued on the
  ROADMAP (new *Queued reviews* item + both ⏳ paragraphs), ADR 0545's
  Challenged section, and the research record. Needs a fresh Fable session
  that did not write the brief.
  Floor green on the CI plane before and after. Not done, by lane: nothing
  on Phase 0; the two owner rulings remain outstanding and now wait on the
  review as well.
  Next: run the queued review cold; then Mike's two rulings; then Phase 0.

- **2026-08-15 (second cold session, ~14:00 UTC)**: Mike's lane again —
  review work, Fable-dependent work, briefs for reviews that need them. One
  review run, one drift adopted, no new briefs owed.
  **The queued cold pass is run** —
  `reviews/2026-08-15-1033-platform-tier-and-marine-staging.md`, by a
  fresh Fable session that wrote none of the brief, the research, or the
  ADRs (rule 4's criterion met; findings committed before the founding
  verdict or the deferred sibling was opened; sibling folded in and
  deleted). Verdict in one line: the research's *negative* conclusion holds
  — native-first stays closed — but its *positive* one (re-tier the shell
  into v1) overreaches. Two MAJOR: **F1** "maritime first-class" does not
  entail marine *instruments* in v1 — everything STRATEGY names as the
  marine half is web-reachable and licence-clear bar tides, so the shell's
  "certainty" is not established by the marine ruling; **F3** ADR 0545's
  "web assets update over the air" is unexamined — Capacitor's remote-URL
  mode is documented as not for production, so over-the-air means a
  third-party updater (a new trust surface) or App Review per fix. Also:
  the research's own platform-tax argument cuts against starting the shell
  early (F4); the seams make deferral *cheap*, not dearer (F5); two rows of
  the "verified" table were misread (F6, corrections note appended, body
  untouched); Phase 4 has no water hero against its own one-per-vertical
  rule (F9); marine reserves are the access layer at sea and belong in
  Phase 2 by the strategy's logic (F10); neither ADR enumerates the native
  channel's threats (S1). Spot-checks fetched live: WebKit storage policy,
  caniuse (Web Bluetooth, wake lock), Apple SDK requirement, Google Play
  closed-test rule, Capacitor config docs. **Recommendations, Mike's to
  rule on**: R1 marine into v1 on the web side, decoupled from the shell;
  R2 shell stays post-Phase-3 with a two-armed gate and a named trigger —
  the dilemma (Mike's stated openness to "whatever gets the full feature
  set" versus solo zero-build economics) is stated, not resolved. Applied
  where not direction: spike sharpened (F8), pointers on ARCHITECTURE,
  ROADMAP (queued-reviews item ticked; the two ⏳ items now say the two
  rulings are decoupled), ADR 0545, research record. `/security-review`
  not run — no code in scope, markdown outside its file classes.
  **Drift adopted** — atelier `b5da9e5` → `eef38be` (13 commits): the
  inlined floor gains the dilemma sentence and the authority-absolute
  wording (the two hunks now match atelier's
  `../atelier/docs/build/templates/CLAUDE.md` verbatim); the reply-gate
  unwiring, the guardrail-architecture research
  and the accepted-in-part REVIEW.md gap are atelier-internal or queued
  there and bind nothing here.
  **No new briefs owed**: the two remaining `review: queued` lines on the
  ROADMAP (sync ADR, UX pass) are gated on work that does not exist yet.
  Floor green on the CI plane before and after. Not done, by lane: nothing
  on Phase 0.
  Next: 🎯 Mike's two rulings (R1, R2 — now independent of each other);
  then Phase 0, with the sharpened spike.

- **2026-08-17**: **Board split adopted** (owner directive, this session) —
  the roadmap became a per-item store. `docs/ROADMAP.md`'s 173 hand-kept
  lines are now `docs/roadmap/`: six sections (v1 spine · post-v1 ·
  icebox · queued reviews · standing threads · record-keeping), each with
  its own narrative `README.md`, twenty-four item files carrying the
  checkbox grammar verbatim, and a board preamble holding the legend,
  the review-line rule and the three-tier structure. `ROADMAP.md` is now
  a **58-line generated index**; `ROADMAP-DONE.md` is frozen as the
  pre-split archive and takes no new entries — a done item stays `[x]` in
  its own file, flipped in the commit that finishes the work, so the
  harvest step and its red-window failure mode are both retired here.
  ADR `2026-08-17-0545`. **Atelier drift: none owed** — the pin
  `eef38be` already carries the board-store ADR (2026-08-15) *and*
  `tools/board.py`; the 25 commits since touch no doctrine and no tools,
  so the pin stands unbumped deliberately, not by omission.
  **The `board` floor check went from out-of-scope to enforcing** the
  moment `docs/roadmap/` existed — nothing was wired to turn it on, which
  is atelier's registry design working as built. **One local variation**:
  `tools/board.py` is a ~90-line **resolver shim**, no board logic, that
  finds atelier's copy the way the pre-commit hook finds `floor.py`
  (`ATELIER_TOOLS` → `hooks.atelierTools` → `../atelier/tools`) and
  defaults `--root` to this repo. It exists because atelier's `board.py`
  prints its own remedy — *"run `python3 tools/board.py rebuild`"* — into
  the generated index and every failure message, and in a child repo that
  command did not exist; vendoring the tool was rejected outright (ADR
  0008, one source). **Handed up to atelier as a finding**, not fixed
  here: the remedy string assumes atelier-local tools, found by being the
  first child to adopt. **Two 🎯 flags surfaced, not created** — the
  platform-tier and marine-staging rulings carried their 🎯 in body prose
  where the index could not see it; moved onto the state line so both
  show at the session-start read. The rulings are untouched and still
  Mike's. Honest note recorded in the ADR: tūhura's read-cost case is
  weak (173 lines against atelier's 4,063) and it has never had two
  sessions collide on the board — the benefit taken *today* is
  provenance (an item's own `git log` says which commit flipped it); the
  contention benefit is insurance bought before it is needed.
  Verified: `board --selftest` OK, index check green, `check_links.py`
  green, floor green on both hook and CI planes. Not done, by lane:
  nothing on Phase 0; no roadmap *content* changed — this was a change of
  store, not of substance, and restructuring under cover of a migration
  was explicitly rejected.
  One signal caught in passing and put on the board rather than acted on:
  `sizescan` flags this very file at 297 lines against the ~250 reference,
  which is the class atelier answered with an index plus `docs/sessions/`.
  Recorded as an open question (`060-record-keeping/020-…`), not bundled
  into this migration — a second store change under cover of the first
  would hide it.
  Next: 🎯 Mike's two rulings (R1 marine-into-v1, R2 shell tier — still
  independent of each other); then Phase 0, with the sharpened spike.

- **2026-08-17 (same session, second phase — the pin, and three corrections)**:
  Mike asked whether the atelier pin had been bumped. It had not: the earlier
  phase checked the drift, found `docs/method` and `tools` byte-identical
  between `eef38be` and atelier's then-HEAD `66ff846`, and recorded "no pin
  bump owed" — **true when checked, false thirty minutes later.** atelier
  advanced to `0af3006` *during* this session: 56 commits from the pin, seven
  `docs/method` files changed, `board.py` +146 lines, a new `coldsweep.py`, and
  the CLAUDE.md template moved. The lesson is not that the check was done
  wrong but that a drift read is a **point-in-time** fact and was recorded as a
  standing one; the sibling checkout was also verified current against its
  remote this time, which the first read never did.
  **Pin bumped `eef38be` → `0af3006`**, and the inlined floor now matches
  atelier's template **verbatim** (diffed, not eyeballed): the apex/floor gains
  *at this floor the re-briefing comes before the action, never after it*, and
  concurrency gains **the channel** — announce your file set on open, a claim
  says what and never which files, a message reserves nothing so check a shared
  allocator after the push, and the shared checkout's index and mid-rebase
  state are shared surfaces (stage explicit paths, read staged hunk headers
  before every commit).
  **All three findings this repo handed up were fixed upstream within the
  hour** — and by a sibling's report, not this one. `faves` split its board at
  17:28 NZST, twenty-six minutes before tūhura's merge at 17:54, hit the same
  three defects, and atelier's fixes (`b2ba382`, `363a846`, `a3a64aa`) cite
  faves by name. **So the earlier claim that tūhura was "the first child repo"
  is corrected — it went further than the evidence, nothing was checked before
  it was written, and that is the defect.** What survives is stronger than
  either report alone: two children hit the identical three defects
  independently, half an hour apart.
  **Consequently the local workarounds are all deleted**: `tools/board.py` (the
  resolver shim), the `.wrapscanignore` entry for the generated index, and
  `.pathscanignore` in its entirety. `wrapscan` is green with **no** exemption
  — the cause was never "two enforced checks are mutually unsatisfiable", it
  was a trailing space: flags appended *after* the link put a space after the
  line's trailing path and destroyed the unbreakable-token exemption the line
  already had. Flags now lead. Removing `.pathscanignore` immediately proved
  its cost: eight live references to the deleted shim surfaced the moment the
  mask came off, all since fixed in current-truth files. The ADR takes a dated
  **addendum** rather than an edit (accepted text is immutable); the residual
  `pathscan` findings in `SESSIONS.md` and the ADR body are left standing on
  purpose — upstream doctrine holds records deliberately un-gateable, since a
  record legitimately names a path that existed when it was written.
  Verified: hook floor 0, CI floor 0, `check_links` 0, `board --selftest` OK,
  index rebuilt in the new shape (61 lines). Not done, by lane: nothing on
  Phase 0; the seven changed `docs/method` files are read-on-demand doctrine
  and were read for what binds here, not adopted wholesale.
  Next: 🎯 Mike's two rulings (R1 marine-into-v1, R2 shell tier); the queued
  `SESSIONS.md` relocation question; then Phase 0.
