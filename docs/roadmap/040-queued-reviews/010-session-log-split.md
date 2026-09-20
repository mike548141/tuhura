- [x] **Rule-4 cold pass — the session-log split. DONE 2026-09-20:
      PASS-WITH-FINDINGS.** Verdict:
      `docs/reviews/2026-09-20-1058-session-log-split.md`.
      Delta reviewed: `7630fc2..4f52ad2`.
      Intent record: `docs/decisions/2026-08-17-1229-split-the-session-log.md`.

      0 MAJOR · 1 MODERATE · 3 minor · 4 notes. No MAJOR, so the review
      cycle closes here. The split itself is sound — what atelier
      `RECORD.md` sanctions, provably lossless (all ten entries verbatim,
      re-run not read), and scanning clean for the right reason.

      **Spawn provenance.** The delta was authored by the 2026-08-17
      session. This pass was spawned by a session that authored none of it
      and was neither started nor instructed by its author. It ran
      reviewer-plus-orchestrator under the principal's 2026-08-17 ruling:
      the reviewer, on Fable, read the delta, answered the lenses and
      assigned every severity; the orchestrator, off-tier on Opus, held the
      records and formed no finding. Disclosed at claim, in this pointer,
      and in the verdict.

      ✅ **Mike ruled 2026-09-20: dated addendum.** All four are enacted —
      the addendum is appended to the ADR (measured figures, F2's rule
      corrected, F6's clause folded in), F3's write-side wording is fixed in
      `CLAUDE.md` and `CONTRIBUTING.md`, and F4 was discharged as a dated
      entry in the 2026-09-20 session record rather than by editing an
      append-only log. The findings as they stood:

      - **F1 (MODERATE)** — the ADR's quantitative grounds are wrong. It
        says "351 lines across eleven entries … 30–48 lines each"; the
        pre-split file held **ten** entries of **10–65** lines, only five
        inside the stated band. The qualitative ground survives and the
        ruling is not disturbed, but the briefing it rests on cited
        numbers nobody had counted.
      - **F2 (minor)** — the identifier rule as written is not the rule
        applied: one of nine files takes its session's own `date -u` open
        stamp rather than its first-commit time.
      - **F3 (minor)** — the write side was never updated. `CLAUDE.md`
        § Conventions and `CONTRIBUTING.md` still say "append an entry to
        `docs/SESSIONS.md`", which under-describes the act now that it is
        an index line plus a detail file.
      - **F4 (minor)** — the session record at the delta head omits that
        delta's own last commit (`4f52ad2`, the pin bump and the BS1
        paragraph).

      **F5 and F7 are handed up to atelier**, not fixed here: a queued
      pointer may name a moving bound (`..HEAD`) and `pointerscan` accepts
      it; and the index-versus-detail integrity gap is half-guarded by
      `linkscan` already, with the orphan-detail-file half belonging in
      atelier's floor rather than in this repo.

      **One honest wrinkle in the enactment.** Re-counting the pre-split
      file gave 9–65 lines and four-of-ten inside the ADR's stated band;
      the reviewer measured 10–65 and five-of-ten. The difference is
      blank-line handling at an entry boundary. Both counts are in the
      addendum rather than one being silently picked — the finding was
      about uncounted numbers, so replacing them with a second
      unreconciled figure would have repeated it.

      review: done — this item *is* the review.
