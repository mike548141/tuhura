- [~] ⏳ **Rule-4 cold pass — the session-log split.** Refs only.
      (claimed 2026-09-20-1056, wt: tuhura-coldpass-session-log)
      Delta: `7630fc2..4f52ad2` (this repo) — pinned to the authoring
      session's last commit at claim time. The pointer as written said
      `..HEAD`, which is a moving target: by this claim it had already
      grown to include a later session's own work, which rule 4 would
      then have had that session reviewing itself.
      Intent record: `docs/decisions/2026-08-17-1229-split-the-session-log.md`.
      Prior art in the same delta's neighbourhood:
      `docs/decisions/2026-08-17-0545-adopt-the-split-board.md`.
      Doctrine surface: atelier `RECORD.md` § *The session log*.
      For a non-author to take; the taker writes the brief.

      **Spawn provenance, disclosed at claim** (atelier `REVIEW.md` rule 4,
      the principal's ruling 2026-08-17 on reviewer-plus-orchestrator). The
      delta was authored by the 2026-08-17 session; the session claiming
      this item authored none of it and was neither started nor instructed
      by its author — it was opened by the principal and pointed at the
      queue, which is the rule's own worked example. The pass runs split:
      the **reviewer is on Fable**, the named tier, and is the only party
      that reads the delta, answers the lenses, assigns severities and
      writes the reconcile. The **orchestrator is off-tier (Opus)**, holds
      the context partition for the deferred sibling, and forms no finding
      and writes no severity. Both conditions the ruling attaches are met,
      and this disclosure is repeated in the verdict's provenance.
