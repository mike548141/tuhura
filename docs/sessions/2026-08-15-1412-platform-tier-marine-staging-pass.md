# 2026-08-15 · 1412 UTC · The platform-tier + marine-staging cold pass RUN

**2026-08-15 (second cold session, ~14:00 UTC)**: Mike's lane again —
review work, Fable-dependent work, briefs for reviews that need them. One
review run, one drift adopted, no new briefs owed.
**The queued cold pass is run** —
`reviews/2026-08-15-1033-platform-tier-and-marine-staging.md`, by a
fresh Fable session that wrote none of the brief, the research, or the
ADRs (rule 4's criterion met; findings committed before the founding
verdict or the deferred sibling was opened; sibling folded in and
deleted). Verdict in one line: the research's *negative* conclusion holds
— native-first stays closed — but its *positive* one (re-tier the shell
into v1) overreaches. Two MAJOR: **F1** "maritime first-class" does not
entail marine *instruments* in v1 — everything STRATEGY names as the
marine half is web-reachable and licence-clear bar tides, so the shell's
"certainty" is not established by the marine ruling; **F3** ADR 0545's
"web assets update over the air" is unexamined — Capacitor's remote-URL
mode is documented as not for production, so over-the-air means a
third-party updater (a new trust surface) or App Review per fix. Also:
the research's own platform-tax argument cuts against starting the shell
early (F4); the seams make deferral *cheap*, not dearer (F5); two rows of
the "verified" table were misread (F6, corrections note appended, body
untouched); Phase 4 has no water hero against its own one-per-vertical
rule (F9); marine reserves are the access layer at sea and belong in
Phase 2 by the strategy's logic (F10); neither ADR enumerates the native
channel's threats (S1). Spot-checks fetched live: WebKit storage policy,
caniuse (Web Bluetooth, wake lock), Apple SDK requirement, Google Play
closed-test rule, Capacitor config docs. **Recommendations, Mike's to
rule on**: R1 marine into v1 on the web side, decoupled from the shell;
R2 shell stays post-Phase-3 with a two-armed gate and a named trigger —
the dilemma (Mike's stated openness to "whatever gets the full feature
set" versus solo zero-build economics) is stated, not resolved. Applied
where not direction: spike sharpened (F8), pointers on ARCHITECTURE,
ROADMAP (queued-reviews item ticked; the two ⏳ items now say the two
rulings are decoupled), ADR 0545, research record. `/security-review`
not run — no code in scope, markdown outside its file classes.
**Drift adopted** — atelier `b5da9e5` → `eef38be` (13 commits): the
inlined floor gains the dilemma sentence and the authority-absolute
wording (the two hunks now match atelier's
`../atelier/docs/build/templates/CLAUDE.md` verbatim); the reply-gate
unwiring, the guardrail-architecture research
and the accepted-in-part REVIEW.md gap are atelier-internal or queued
there and bind nothing here.
**No new briefs owed**: the two remaining `review: queued` lines on the
ROADMAP (sync ADR, UX pass) are gated on work that does not exist yet.
Floor green on the CI plane before and after. Not done, by lane: nothing
on Phase 0.
Next: 🎯 Mike's two rulings (R1, R2 — now independent of each other);
then Phase 0, with the sharpened spike.
