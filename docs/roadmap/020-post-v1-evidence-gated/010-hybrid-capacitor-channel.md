- [ ] 🎯 **Hybrid Capacitor channel** → background GNSS logging + barometer.
      Gate: screen-on recording fails a real owner field weekend.
      review: done — ADR 2026-08-08-0545 (the founding review's ruling)

  ⏳ **Gate contested, owner's call outstanding.** Mike re-opened the
  platform question 2026-08-09; researched in
  `docs/research/2026-08-09-0449-platform-pwa-vs-native.md`. Finding: the ADR's
  shape holds (native-first buys no capability the shell doesn't), but its
  timing does not — marine instruments (BLE/NMEA, permanently closed to
  iOS Safari) and screen-off recording are now committed features that
  cannot ship without the shell, so the gate is met in principle already.
  Open: re-tier the shell into v1. Two consequences do NOT wait on that
  ruling and are folded into the phases — the WKWebView storage-quota
  asymmetry (15% vs 60% of disk) means Phase 3 needs a storage seam, and a
  MapLibre-in-WKWebView spike belongs in Phase 0.

  review of the challenge: done 2026-08-15
  (`docs/reviews/2026-08-15-1033-platform-tier-and-marine-staging.md`) —
  native-first stays closed; "the shell is a certainty" overreaches (F1),
  the shell's over-the-air update claim is unexamined (F3); recommendation
  R2: keep post-Phase-3, widen the gate to two arms (field failure OR the
  owner naming a native-only feature as the next deliverable after Phase
  3), name the trigger. 🎯 Mike rules; this item and the marine item are
  decoupled — neither waits on the other.
