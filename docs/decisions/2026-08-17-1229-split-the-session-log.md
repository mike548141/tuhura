# The session log becomes an index with detail on demand

**Status**: accepted • **Date**: 2026-08-17
**Review**: queued — `docs/roadmap/040-queued-reviews/010-session-log-split.md`,
rule-4 cold pass on the landing delta, refs only.

## Context

`docs/SESSIONS.md` had reached **351 lines across eleven entries**, and
`sizescan` flagged it against the ~250-line reference. The board split earlier
the same day answered the same class for the roadmap, which made it tempting to
assume the log wanted the identical treatment.

**It did not follow, and the assumption was challenged before it was acted on.**
Mike's instruction was that the split should happen *only* in line with what
atelier actually dictates. Reading `RECORD.md` § *The session log* rather than
copying atelier's own layout turned up two distinct sanctioned moves, not one:

- **Detail on demand** — "when a session is substantial, its full detail goes in
  a `docs/sessions/<date>-<HHMM>-<slug>.md` file and the index carries a one-line
  pointer." This is the log's *normal* shape.
- **Rotation** — when the index outgrows its budget, older entries relocate
  **verbatim** to a `SESSIONS-ARCHIVE.md` growth store. This is the overflow
  valve for an index that has *already* done the first move.

Doctrine also states plainly that `sizescan` reports this file as an
**advisory** that "never gates", and that a file long purely from live
current-truth "has nothing to relocate". So the size number alone did not
decide anything.

What decided it was the *shape of the length*. tūhura's eleven entries ran
30–48 lines each: they were not a long index, they were **detail files inlined
into an index**. That is precisely the condition the first move exists for, and
rotation would have treated the symptom — archiving fat entries keeps them fat
and re-bloats on the next eight sessions.

## Decision

Mike's ruling (2026-08-17), on the corrected briefing: **index + `docs/sessions/`
detail files.**

- **`docs/SESSIONS.md` is the index** — 351 lines to **26**. One line per
  session, newest last, tail-read at session start.
- **Nine detail files** under `docs/sessions/`, entry text **verbatim**. Nothing
  was rewritten, summarised, or dropped in the move; the index lines are *new*
  prose written beside the entries, not replacements for them.
- **Identifiers are recovered, not invented.** The coordination-free scheme is
  `<date>-<HHMM>-<slug>` with `HHMM` the session's start in UTC — a fact a live
  session owns but a migration does not. Rather than fabricate times or fall
  back to a sequence counter, each pre-split file takes the UTC time of that
  session's **first commit**, read from git. New sessions use their own
  `date -u` start.
- **The two 2026-08-17 phases are one file.** They were one session; doctrine's
  unit is the session, and a pointer to a continuing entry names the entry, not
  a second file.
- **`docs/SESSIONS.md` is exempt from `wrapscan`** by a reasoned
  `.wrapscanignore` entry: one deliberately long line per session is what keeps a
  session's whole scope greppable, and wrapping defeats the format. atelier
  carries the identical entry. The detail files are ordinary prose and stay
  gated.
- **`SESSIONS-ARCHIVE.md` is not created.** It is the *next* move, not this one,
  and a 26-line index has nothing to rotate. Naming it in the index preamble
  costs nothing and means the next session does not have to rediscover it.

`sizescan` is now clean — the advisory that started this is gone, rather than
suppressed.

## Rejected

- **Rotate to `SESSIONS-ARCHIVE.md` instead.** Equally sanctioned, cheaper, and
  wrong for this cause: it relocates fat entries without making them thin, so
  the index re-bloats and the move repeats. Correct later, once entries are
  one-liners and the *index itself* is what has grown.
- **Leave it — the advisory never gates.** Genuinely defensible, and it was put
  to Mike as such. `tail -60` bounds the read cost already. Rejected on his call,
  and because the entries were structurally in the wrong file, which no read
  habit fixes.
- **Copy atelier's layout without reading the rule.** What the challenge caught.
  atelier's own files use the retired `NN` scheme and would have propagated a
  naming convention doctrine has since replaced — the costume, not the doctrine.
- **Bundling this into the board split.** Rejected earlier the same day and
  still right: two store migrations in one commit hide the second inside the
  first.

## Consequences

- Session start reads 26 lines instead of 351; detail opens per session.
- The index and the detail are now two files that can disagree. Nothing
  mechanical prevents an index line drifting from the file it points at — unlike
  the board, there is no generator and no `board`-style check. Stated as a
  residual, not solved.
- Every historical entry keeps its exact wording, so anything that quoted or
  grepped the old text still finds it — one directory down.
- The `HHMM` values are *first-commit* times, not true session starts. They are
  honest about what they are and consistent within the scheme, but a session that
  read for an hour before committing is recorded as starting late.
