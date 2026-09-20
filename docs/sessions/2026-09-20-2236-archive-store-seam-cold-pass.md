# 2026-09-20 · 2236 UTC · The archive-store seam's cold pass

Fresh Fable session; Mike's directed first item. Independence held: this
session authored none of the delta and was started by the principal.

## What the pass found

Verdict `docs/reviews/2026-09-20-2236-archive-store-seam.md` —
**FAIL-WITH-MAJORS**. The seam's shape is right; two claims it rests on are
not. F1: `PMTiles.getHeader()` always reads 16 KiB from offset 0, and the
seam's strict bounds rule throws on that for any archive under 16 KiB — and no
test ever put the seam's handle under `PMTiles` (layer 2 uses the library's
own `FileSource`). F2: `append()` counts bytes before writing them, so a quota
failure leaves the tracker ahead of the disk, the retry is refused, and
`commit()` publishes a half-written archive as whole. Both proven live, F2
with a 20-line OPFS stub over the real module — which also falsifies the
record's "unverified by construction". F3: the fixture generator weights each
Hilbert bit by `s` instead of `s*s`, so TileIDs collide from z2 up; the
self-check table is exactly the subset that cannot detect it.

The `/security-review` skill read the clean primary checkout and reached
nothing; re-aimed as a sub-task at a scratch worktree carrying the delta as
pending changes, it formed no finding and one hygiene note (folded in).

## Owed, time-capped by Mike at 11:00 NZST

- Reconcile against the 2026-08-08 and 2026-08-15 verdicts (not opened).
- Atelier drift: `e9a6aae` → `2b29bb7`; child template and canonical floor
  block **unchanged** (diffed), so the inlined block is current; movement is
  tooling (`board --staged` at the hook, `rebuild --from-index`, scanners
  skip linked worktrees) and CONCURRENCY (dispatch prompts name a unique
  absolute scratch path; CF3's stop flagged 🎯 for Mike upstream). Pin bump
  deliberately left for the next session to make with the read done.
