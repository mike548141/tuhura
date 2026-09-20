- [ ] 🎯 **P0-E — the WKWebView spike.** Render the same archive inside a bare
      WKWebView / Capacitor shell, not just Safari, and establish four things
      (platform research 2026-08-09, sharpened by the 2026-08-15 cold pass,
      F8):

      1. MapLibre's frame rate behind the shell boundary — the one
         assumption that could still favour a native rewrite.
      2. Whether OPFS and `navigator.storage.estimate()` work at all under
         `capacitor://localhost`, and what quota they report. The
         15 %-versus-60 % policy is documented; what a shell actually gets
         is not.
      3. Whether a service worker registers there — the shell's
         over-the-air update story depends on it (F3, still unexamined).
      4. That the shell sees none of the installed PWA's data, confirming
         the silo.

      If the storage seam's native backend is prototyped, measure its range
      reads over a multi-GB file with MapLibre's worker parsing — the
      "≈100 lines" estimate is untested.

      🎯 **Blocked on Mike**: needs a Mac with Xcode and a free Apple ID
      (7-day device builds). Explicitly **not** the paid Developer
      Program — this is not spend. An hour now, or a re-architecture later.

      review: not warranted — a measurement, not a decision; what it
      measures is already ADR'd.
