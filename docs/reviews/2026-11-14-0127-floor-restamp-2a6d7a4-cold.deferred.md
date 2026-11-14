# Held back — the brief-writer's angles for the floor re-stamp pass at `2a6d7a4`

For `2026-11-14-0127-floor-restamp-2a6d7a4-cold.md`. **Open only after your
own findings are durably written in the brief** (`REVIEW.md` rule 1). Then
fold this in below the verdict and delete this file.

Written by the headless Opus 5.5 brief-writer, session `89a8835d`. These are
hypotheses and measurements, not findings. Only D1's count was measured; no
other entry was tested. Answer each: confirmed, damaged, or already covered
by your finding N.

- **D1 — "eight bullets" was measured, and it reads six.** Comparing the
  canonical `floor` region at `0a2b7a7` with the one at `2a6d7a4` bullet by
  bullet, whitespace-normalised, six bullets changed: *Always stop and
  confirm*, *Asking*, *Concurrency*, *Doctrine problems point up*, *Source &
  drift*, *Estate resources*. The author's account appears to count eight
  *changes* (two in the floor bullet, two in Concurrency). Does the item's
  "eight bullets' wording" overstate it (V1), and does the miscount matter
  for anything resting on it?
- **D2 — does `identical` cover the fills?** `pins.py` reads the copy
  `identical`, yet the visibility fill grew from the canonical two
  placeholder lines to five lines of prose, carried over unchanged from the
  previous pin. The previous pass found that fill carries a floor obligation
  the canonical floor does not, and left it with Mike. If the tool accepts
  any fill, its `identical` can't see that, and a reader of the bump record
  would take it as proof the copy is clean. Is the tool's green stronger
  than what it checks?
- **D3 — who may list a binary in a public repo.** All seven
  `.leakscanbinaries` lines are `by=agent`. The same bump says an entry in
  the personal-data list of a public repo is Mike's alone to grant. Is there
  an equivalent bar for agent-listed binaries in a public repo, in atelier's
  G3 rules or the floor, and did the bump meet it? Separately: the comment
  says the images were "looked at". Can you confirm that by looking at them
  yourself, and by listing each PNG's chunks?
- **D4 — the hook hint hardcodes `../atelier`.** `commit-msg`'s one
  substitution prints `git config hooks.atelierTools ../atelier/tools`. That
  path does not resolve from a worktree, which this repo uses by default. Is
  the hint wrong for the normal case, and is the substitution one the
  samples' stamp rules allow? Are two new tracked hooks a "new trust surface"
  under the floor's always-confirm list, or ordinary house machinery?
- **D5 — the read-order clause tells a cold reviewer to skip only the log.**
  Step 3 of the same read order sends a session to the board index, and the
  items it lists can carry prior verdicts and the author's account (this
  brief had to bar three of them by name). Does the new clause sit with
  `REVIEW.md` rule 2's barred list at `2a6d7a4`, or does it read as "the log
  is the only thing to skip"?
- **D6 — what the re-stamp left as it was.** The previous re-stamp's pass
  left owed decisions: the visibility fill, a bare `stampscan` run that
  prints a false green, and the queued-reviews README's hand count. That
  README still says "Two open" and names neither this item nor any of the
  briefs written since. The re-stamp neither applied nor re-raised them. Is
  that right (they are Mike's), or should the bump record have said they
  were still open? And on proportion: now that `pins.py` compares the copy
  by machine, what remains for a cold pass is judging the fill's content and
  the canonical change itself. Say whether this pass bore that out.
