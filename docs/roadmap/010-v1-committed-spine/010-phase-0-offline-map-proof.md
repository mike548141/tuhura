- [x] **Phase 0 — offline map proof + scale/soak rider.** **SPLIT
      2026-09-20 into six claimable leaves.** No more work is owed on *this*
      item — all of the work is owed, in the leaves beside it:

      - **P0-A** — vendor the map stack and gate it (`011`).
      - **P0-B** — app shell, service worker, installable (`012`).
      - **P0-C** 🎯 — online render against LINZ Basemaps (`013`).
      - **P0-D** — PMTiles in OPFS, and the map's lifecycle (`014`).
      - **P0-E** 🎯 — the WKWebView spike (`015`).
      - **P0-F** 🎯 — the scale and soak rider (`016`).

      **Why split.** Three of the six are blocked on things only Mike can
      supply — a credential, a Mac with Xcode, real devices and seven days
      of dormancy — and three need nothing from outside the project. Bundled
      as one line those blockers were invisible at the session-start read,
      and a session taking "Phase 0" claimed the buildable and the blocked
      together, so the board could not show that most of the phase was
      ready to go. Splitting also lets the leaves fan out: a bundled line is
      claimed as a unit and serialises sessions that could have run in
      parallel (atelier CONCURRENCY § Claiming work — fan-out needs the
      leaves to exist as their own lines).

      The phase's **Accept when** is unchanged and lives in
      [`../../WORKPLAN.md`](../../WORKPLAN.md): an installed PWA on a real
      iPhone and Android renders the region, pans and zooms smoothly, in
      flight mode, after a cold start — *and* the scale/soak rider passes.
      That bar belongs to the phase, not to any one leaf, and P0-F is what
      keeps it from being declared early.

      review: not warranted — a re-shaping of the board's own grain, taking
      no design or direction decision; every leaf carries its own review
      line.
