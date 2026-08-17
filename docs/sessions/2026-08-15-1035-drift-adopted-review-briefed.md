# 2026-08-15 · 1035 UTC · Drift adopted, ADR pointers closed, the cold pass briefed

**2026-08-15**: Cold session, Mike's lane: review work, Fable-dependent
work, and briefs for reviews that need them — write the brief, don't run
it. Three things done, one queued.
**The doctrine drift is read and the pin bumped** (`320f9b1` → `b5da9e5`,
73 commits) — the debt the 2026-08-09 session recorded. What binds this
repo: the Three Laws left atelier's apex (Mike's ruling 2026-08-15; the
apex is honesty, then adaptation), so the inlined block sheds the Laws
sentence and now matches the canonical block byte-for-byte bar the
fill-ins; PROPAGATION's new rule that a child may *add* but never *repeat*
made `docs/ECONOMICS.md` a defect — it was a full restatement of the house
policy with no repo-local fact in it — so it is trimmed to what atelier
cannot hold (seat application here, the field-test-is-spend point, and the
operating-costs/licence-tripwire table it still owes); PRINCIPLES §9 (data
carries its time dimension, and it binds retrofits) is folded into the
WORKPLAN where it bites before it is too late — the Phase 1 personal-layer
schema carries world time and record time apart with dated tombstones, and
the Phase 3 manifest carries data currency and build date as two dates. The
split-board migration does *not* reach here (RECORD.md: a repo that has not
adopted the split keeps the monolithic form). "Work lands in the repo it
changes" needed nothing.
**Review-record hygiene**: ADRs 0450 and 0452 still said "queued — brief
to be filed" a week after the founding brief landed and closed; both now
point at the verdict, 0450's status carries the partial supersession by
0546 that 0546 declared and 0450 never acknowledged, and the ADR index —
empty since scaffold, six ADRs unlisted — is populated.
**Brief written, not run**:
`reviews/2026-08-15-1033-platform-tier-and-marine-staging.md` — a cold
pass on the two coupled owner rulings still outstanding (re-tier the shell
into v1; marine's staging), so Mike rules on a tested finding rather than a
fresh one. Seeded questions sit in the `.deferred.md` sibling per REVIEW.md
rule 1 (same author class wrote the research); pointers queued on the
ROADMAP (new *Queued reviews* item + both ⏳ paragraphs), ADR 0545's
Challenged section, and the research record. Needs a fresh Fable session
that did not write the brief.
Floor green on the CI plane before and after. Not done, by lane: nothing
on Phase 0; the two owner rulings remain outstanding and now wait on the
review as well.
Next: run the queued review cold; then Mike's two rulings; then Phase 0.
