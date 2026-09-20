- [x] **Rule-4 cold pass — the archive-store seam. DONE 2026-09-20** —
      verdict `docs/reviews/2026-09-20-2236-archive-store-seam.md`
      (FAIL-WITH-MAJORS: 2 MAJOR / 3 MODERATE / 4 minor / 2 note; F1–F11 are
      Mike's under rule 3). Was: refs only.
      Delta: `23707e6..` **the commit that adds this file** (resolve with
      `git log --diff-filter=A -- docs/roadmap/040-queued-reviews/020-archive-store-seam.md`).
      The bound is spelled self-referentially rather than as `..HEAD`
      deliberately: a symbolic bound drifts, and a later session reading it
      literally would review its own commits. That defect was found in this
      repo's previous pointer and handed up to atelier the same day
      (atelier `320/360`); this is the proposed spelling, used here first.
      Intent record:
      `docs/decisions/2026-09-20-1116-archive-store-seam.md`.
      Doctrine surface: atelier `REVIEW.md` rule 4.
      For a non-author to take; the taker writes the brief.

      **Not takeable by the run that queued it.** The seam was built by a
      worker this run dispatched, which is the run's own authorship for
      rule 4 (atelier QR2) — "my worker wrote it" is not an independence
      the criterion recognises. Tier at selection: Fable.

      🎯 **Mike ruled 2026-09-20: this is the next session's first item.**
      The run that queued it asked him what to prioritise and he chose this
      pass — so it is not merely open, it is *directed*. The queuing run
      still may not take it: the seam was built by a worker that run
      dispatched, and atelier QR2 is explicit that "my worker wrote it" is
      not an independence rule 4 recognises. That bar is structural, not a
      matter of care taken, and `REVIEW.md` rule 4's stop clause says a
      session that cannot honour it stops rather than proceeding and hoping
      the pass is accepted — a wrong-tier pass was once rejected entire,
      findings unread. So the direction is recorded here instead of obeyed
      there: **a fresh session, on Fable, takes this first.**
