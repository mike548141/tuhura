- [x] **Does `SESSIONS.md` want the same treatment as the board?** **RULED
      2026-08-17 — yes, but not the treatment first proposed.** Surfaced by
      `sizescan` during the board split (2026-08-17): the session log is 297
      lines against the ~250-line reference, and it grows monotonically — every
      session appends, nothing ever leaves. atelier answered this class with the
      same shape used for the board (a lean index plus `docs/sessions/<entry>.md`
      on demand), and `RECORD.md` names it as one pattern the whole record
      shares: *current-truth files stay lean; history relocates to an on-demand
      store*.

      Not decided here, and deliberately not bundled into the board split — that
      migration was a change of store for **one** record, and doing a second
      under its cover would hide it. Two honest counters to weigh first: the log
      is read as `tail -60`, not whole, so its read cost is already bounded; and
      a one-line-per-session format is what makes it greppable. The advisory is
      a signal, not a verdict — a file long purely from live current-truth has
      nothing to relocate.

      review: not warranted — an open question recorded from a mechanical
      signal, not a decision; a split would get its own ADR and review.

      **Disposition 2026-08-17.** Mike required the move be made only in line
      with what atelier actually dictates, and reading `RECORD.md` § *The
      session log* rather than copying atelier's layout found **two** sanctioned
      moves where the question above assumed one: detail-on-demand
      (`docs/sessions/`), and rotation to a `SESSIONS-ARCHIVE.md` growth store.
      The question was re-put with both, and he ruled **detail-on-demand** —
      correct for this cause, because the eleven entries ran 30–48 lines each
      and were detail inlined into an index, which rotation would have archived
      while leaving fat. 351 lines → 26; `sizescan` clean, not suppressed.
      Both counters recorded above survive the ruling and are answered in the
      ADR: `tail` bounds the read cost, and one-line-per-session grep-ability is
      now *better*, not worse. ADR:
      `docs/decisions/2026-08-17-1229-split-the-session-log.md`; the rotation
      move stays available and the index preamble names it.
