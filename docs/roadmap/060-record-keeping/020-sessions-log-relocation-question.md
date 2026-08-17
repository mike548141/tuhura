- [ ] **Does `SESSIONS.md` want the same treatment as the board?** Surfaced by
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
