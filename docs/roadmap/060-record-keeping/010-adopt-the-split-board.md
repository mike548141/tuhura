- [x] **Adopt the split board — one file per item, a generated index.** Done
      2026-08-17 (owner directive, this session). `docs/ROADMAP.md`'s 173 lines
      became `docs/roadmap/` — six sections, twenty-four item files, each
      section's narrative in its own `README.md` — and `ROADMAP.md` is now the
      generated index that every session reads at open. atelier's `board` floor
      check went from out-of-scope to enforcing here the moment `docs/roadmap/`
      existed. Rationale and the shape as built:
      `docs/decisions/2026-08-17-0545-adopt-the-split-board.md`; the upstream
      ruling is atelier's board-store ADR (2026-08-15).
      review: not warranted — adoption of an already-reviewed upstream decision,
      applied without local variation bar the `tools/board.py` resolver shim;
      the shim is noted in the ADR and handed up to atelier as a finding.

      **Note 2026-08-17 (same day):** the local `tools/board.py` shim is
      **retired**. atelier fixed all three child-adoption defects upstream
      within the hour (`b2ba382`, `363a846`, `a3a64aa`) — the banner names no
      path, the generator emits the hook's full resolution order for a child,
      the section links stopped repeating their path as link text, and item
      flags moved before the link so wrapscan's unbreakable-token exemption
      applies. The shim, the `.wrapscanignore` entry and the whole
      `.pathscanignore` file are gone; the pin moved `eef38be` → `0af3006`.
      Correction to the line above: tūhura was **not** the first child to
      adopt — `faves` split its board at 17:28 NZST, twenty-six minutes ahead
      of this repo's merge, and it is faves' findings the upstream fixes cite.
