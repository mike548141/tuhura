# Model & token economics — repo-local facts only

The doctrine lives up, not here. Seat assignment (risk assigns the seats;
billing only prices them), the billing states of the marginal token, the
hand-up ladder, sub-agent economics and session hygiene are atelier's
[economics doctrine][economics], read at the pin in `CLAUDE.md`; entitlement
numbers (the plan, its cap share, prices) are person-local in the estate
root. Never trust a restatement of any of that here: until 2026-08-15 this
file was a full restatement of the house policy with no repo-local content
at all — the exact "repeat" atelier's propagation rule forbids (a child may
*add*, never repeat or conflict — `PROPAGATION.md`, ruled 2026-08-09, with
the sibling `faves` copy as the grounding case). Trimmed at the 2026-08-15
pin bump. What remains is only what atelier cannot hold: this repo's own
applications and the economics it owes.

## Applying the seats to this repo

- Nearly all v1 work is build-tier: the `site/` shell, the map/tiles/OPFS
  plumbing, the service worker, pure-logic tests (`node --test`), docs, and
  the data pipeline tools under `tools/`.
- Reviews stay scoped and short: hand the reviewer the diff / named files or
  the design record, not the repo; ask for findings, not rewrites; apply back
  on the build tier ([reviews/README.md](reviews/README.md)).
- **A field test is spend the tank cannot buy.** Several accept-whens
  (Phase 0's soak rider, Phase 1's real recorded walk, Phase 3's full trip
  cycle) need a real device in real conditions over real days. Plan sessions
  so the human step is queued *before* the wait, not discovered after it.

## Operating costs and licence tripwires — owed

The founding review (2026-08-08) found "free app" is load-bearing: Open-Meteo,
BirdNET and NIWA terms all turn on it, so **one non-commercial analysis governs
all three**, and it belongs here. This file owes an operating-costs & licence-
tripwire table covering: R2 storage/egress for tile archives, the LINZ Basemaps
key tier, Cloudflare Pages/Workers limits, each cached layer's licence
condition and the change that would trip it, and — once the hybrid channel
starts — the **platform tax the shell brings**: US$99/yr Apple in perpetuity
plus the recurring toolchain march (current-year SDK for App Store
submissions; Google Play target-API deadlines **and its closed-test hurdle
before a first public release**), a standing maintenance obligation on a solo
project, not a one-off (platform research 2026-08-09).

**Two costs the 2026-08-17 ruling (R2) adds to that table, both before the
first native build rather than after it.** The shell's *tier* is now
post-Phase-3 on a two-armed gate (ADR 2026-08-08-0545 addendum), so the tax is
not yet being paid — but the table must be honest about what opens when it is.
First, **over-the-air updates are unpriced and may not be free** (review F3):
this project assumed web assets update over the air, and Capacitor's remote-URL
mode is documented as not for production. The real options are a third-party
updater — a new trust surface, and a floor confirmation before adoption — or
App Review per fix, which is a *per-change* cost, not a per-year one. Second,
the closed-test hurdle above is a **release-blocking** cost on Google's side,
not a line item. Until the table exists, the board's data-ops thread is the
record of the debt.

<!-- Cross-repo pointer into atelier (public), as a full URL so it resolves
     for a reader who has no sibling checkout. -->

[economics]: https://github.com/mike548141/atelier/blob/main/docs/method/ECONOMICS.md
