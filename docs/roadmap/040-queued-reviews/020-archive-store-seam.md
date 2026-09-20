- ⏳ **Rule-4 cold pass queued — the archive-store seam.** Refs only.
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
