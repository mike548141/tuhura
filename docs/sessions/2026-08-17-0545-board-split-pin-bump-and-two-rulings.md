# 2026-08-17 · 0545 UTC · Board split, pin bump, and two owner rulings

*Three phases of one session, recorded as they landed.*

## Phase 1 — the board split

**2026-08-17**: **Board split adopted** (owner directive, this session) —
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

## Phase 2 — the pin, and three corrections

**2026-08-17 (same session, second phase — the pin, and three corrections)**:
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

## Phase 3 — two owner rulings, and the session log split

**Mike ruled on both outstanding 🎯 items**, put to him with the cold pass's
recommendations and the trade-offs stated. Both accepted, and they stay
decoupled.

**R1 — marine joins v1 on the web side.** MPI reserves + fishing rules into
Phase 2 (the access layer at sea, F10); GEBCO + LINZ hydro into Phase 3 behind
the first-enable modal and the persistent not-for-navigation badge, no
route-planning over water; one water hero into Phase 4 (F9 — the water was the
one vertical Phase 4's own one-per-vertical rule had left without a hero).
Offline tides stay blocked on the LINZ written licence answer and did not move.
The old post-v1 marine-layers item is `[x]` **superseded, not deleted** — the
work is owed, in the phases it moved to, and the item says where. What remains
post-v1 is **marine instrument integration** (BLE/NMEA), now its own item:
Web Bluetooth is permanently closed to iOS Safari, so it is the one marine
capability that genuinely needs the native channel. That is the distinction F1
turned on, and STRATEGY now states it at the non-goal instead of leaving it to
be inferred.

**R2 — the shell stays post-Phase-3, on a two-armed gate**: screen-on recording
fails a real field weekend, **or** Mike names a native-only feature as the next
deliverable after Phase 3. Either opens it; neither is presumed. Naming the
trigger is the point — without it the tier gets re-litigated at every phase
boundary, which is exactly what happened between 2026-08-08 and 2026-08-15.
Three obligations ride with it, all *before* the first native build: **F3** (the
over-the-air update claim is unexamined — Capacitor's remote-URL mode is
documented as not for production, so it means a third-party updater, a new trust
surface needing a floor confirmation, or App Review per fix), **S1** (neither ADR
enumerates the native channel's threats), and the platform tax as a standing
obligation. ADR 0545 was **appended, never superseded** — the ruling changes the
gate and the tier's justification, not the platform posture, and every rejection
in it held under review. ECONOMICS took the over-the-air unknown and Google
Play's closed-test hurdle beside the Apple line, and the review's follow-up
checklist is ticked against what actually landed.

**Then the session log split — and the briefing that had to be corrected
first.** Mike had ruled "split it now", but then required the move be made only
in line with what atelier actually dictates. Reading `RECORD.md` § *The session
log* rather than copying atelier's own layout found **two** sanctioned moves
where the question put to him had offered one: detail-on-demand
(`docs/sessions/`) and rotation to a `SESSIONS-ARCHIVE.md` growth store — and
doctrine says plainly that `sizescan` here is advisory, never gating. **So the
ruling had been given on an incomplete briefing, and the honest move was to
re-put it rather than proceed on it.** Re-put with both moves and the
leave-it-alone option, he ruled detail-on-demand.

That is the right one for this cause, and the reasoning is worth keeping: the
eleven entries ran 30–48 lines each, so this was never a long *index* — it was
**detail files inlined into an index**, and rotation would have archived them
while leaving them fat, re-bloating within eight sessions. 351 lines → **26**.
Nine detail files, entry text **verbatim** — nothing rewritten or dropped, the
index lines written *beside* the entries rather than replacing them.
Identifiers were **recovered, not invented**: `HHMM` is a fact a live session
owns and a migration does not, so each pre-split file takes the UTC time of that
session's first commit, read from git, rather than a fabricated time or a
sequence counter. `sizescan` is now clean rather than suppressed, and the
rotation move stays available with the index preamble naming it.

ADR `2026-08-17-1229-split-the-session-log.md`; its rule-4 cold pass is **queued
refs-only** for a non-author. Stated residual, in the ADR rather than glossed:
the index and its detail can now disagree, and unlike the board there is no
generator and no check to stop them.
