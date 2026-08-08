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
