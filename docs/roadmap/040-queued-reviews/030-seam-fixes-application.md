- [ ] 🎯 **Rule-4 cold pass queued — the seam fixes' application.** Refs only.
      Delta: `22b4cde..` **the commit that adds this file** (resolve with
      `git log --diff-filter=A -- docs/roadmap/040-queued-reviews/030-seam-fixes-application.md`).
      Intent record: the 2026-09-25 addendum to
      `docs/decisions/2026-09-20-1116-archive-store-seam.md`; the findings it
      applies are `docs/reviews/2026-09-20-2236-archive-store-seam.md`.
      Doctrine surface: atelier `REVIEW.md` § *Applying decisions to
      doctrine* and rule 4. For a non-author to take; the taker writes the
      brief. Tier at selection: Fable.

      **Not takeable by the session that applied it**, which also wrote the
      verdict it applied — both authorships fail rule 4's criterion. Rule 2
      note for the taker: the delta carries the verdict file's decision
      stamps; review the edited doctrine and code at HEAD and commit
      findings first, open the verdict hunks after.

      📝 BRIEF WRITTEN 2026-10-26 by session `49c917e1` (Opus 5.5):
      `docs/reviews/2026-10-26-0910-seam-fixes-application-cold.md`, with its
      `.deferred.md` sibling; this session may not run the pass. The brief
      names who is barred and the body-free command for the landing commit.
      The taker reads it and runs the pass; it does not rewrite the brief.

      CLAIMED 2026-11-01T12:23Z — pass running. Orchestrator: a headless Opus 5.5
      session started by drain session `c87c4ee0` (Opus 5.5) inside this
      repo; both are rule-4 off-tier orchestrators that hold the context
      partition (the `.deferred.md` sibling is held back from the reviewer
      until act 1 is committed) and form no finding and write no severity.
      Reviewer tier: Fable 5.1, checked at selection. Neither orchestrator
      is barred by the brief. Runs under Mike's 2026-11-02 drain approval.

      ✅ PASS RAN 2026-11-02 — **PASS, no MAJOR: 0 MAJOR · 8 MINOR · 4
      NOTE** (act 1 at `7f29272`; act 2 reconciled the sibling, which is
      now folded in). Verdict: below the divider in
      `docs/reviews/2026-10-26-0910-seam-fixes-application-cold.md`.
      Standing MAJOR: none. Reviewer Fable 5.1; the orchestrators formed
      no finding.

      🎯 **Owed to Mike (rule 3 — the addendum is self-authored direction,
      so every finding is his to rule):** G1 the platform-confirm list on
      P0-D is stale and misses `move()` replacing an existing file and
      `lastModified` as the change signal · G2 three untyped error paths
      beside "never a bare Error" · G3 a test named for a property its
      stub cannot show · G4 `FileSource` survives in P0-D, `WORKPLAN.md`
      and `sw.js`; the ADR Decision block is unmarked · G5 a committed
      archive forgets its version · G6 the threat enumeration omits the
      manifest inputs and the worker message boundary · H1 the resume
      contract after a partial write is unstated · H2 a stale partial
      cannot be discarded without the committed archive (the reviewer
      suggests `discardPartial(id)`) · NOTEs G7 (`InvalidArchiveIdError.id`
      holds a version), G8 (grounding drift since `e5c235f`), G9 (the
      ADR's Review line is stale), H3 (narrow the offset-0 clamp to
      `length === 16384`). Options: accept all and backlog them; accept
      some; or decline. **Recommendation: accept all and route them to
      the P0-D backlog, with G1 fixed first,** because a device session
      would otherwise test the wrong things (the reviewer's reasoning).
      Asked on the board, not in a prompt, per Mike's 2026-11-02 drain
      ruling.

      Routing: a no-MAJOR pass is the terminal application review
      (`REVIEW.md` § *Applying decisions to doctrine*), so no further
      cold pass is queued. Once he rules, the accepted findings go to the
      backlog and this item closes.
