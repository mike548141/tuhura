# v1 — the committed spine (zero external dependencies)

Everything here ships without waiting on anyone outside the project: no licence
negotiation, no third-party approval, no data owner's goodwill. That is the
selection rule, and it is what makes v1 a *commitment* rather than a hope —
each phase can be finished by work alone.

Phases run in order (detail and acceptance criteria in
[`../../WORKPLAN.md`](../../WORKPLAN.md)); the ordering is risk-first, which is
why the offline map proof is Phase 0 rather than a later hardening pass. An item
here that turns out to need an external dependency does not quietly slip — it
moves to post-v1 with the gate that now governs it named.

**Marine is part of this spine** (Mike's R1 ruling, 2026-08-17), not a vertical
staged behind it: reserves and fishing rules in Phase 2, bathymetry and hydro in
Phase 3 behind the not-for-navigation badge, one water hero in Phase 4. The one
marine capability that is *not* here is instrument integration (BLE/NMEA), which
needs the native channel and is gated post-v1 with it.
