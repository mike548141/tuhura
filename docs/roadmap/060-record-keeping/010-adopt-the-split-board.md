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
