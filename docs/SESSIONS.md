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
  would be a migration, and moving it now is free. The GitHub webhook did
  not fire on the provisioning push, so the first deployment was triggered
  explicitly — worth knowing for the next repo: the connection was correct
  (Cloudflare had resolved the repo id), it just needed one manual kick.
  Verified live: `tuhura.pages.dev` and `tuhura.myspot.nz` both 200 with a
  valid certificate. `dig` against 1.1.1.1 resolves; only the owner's Mac
  held a stale negative DNS entry, which a local cache flush clears.
  Next: Phase 0 with its scale/soak rider.
