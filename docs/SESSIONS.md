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
