# Cold pass — the session-log split (rule 4, refs-only)

**Started** 2026-09-20 10:58 UTC. Brief on top, verdict below the divider —
one file (REVIEW.md § The lifecycle). Written by the reviewer, not the author.

## Provenance

The delta was authored by the 2026-08-17 session. This pass was spawned by a
session that authored none of it and was neither started nor instructed by its
author — the principal opened it and pointed it at the queue. The pass runs
reviewer-plus-orchestrator under the principal's 2026-08-17 ruling: the
reviewer (Fable, the named tier) read the delta, answered the lenses, assigned
every severity and wrote the reconcile; the orchestrator (Opus, off-tier)
holds the record-keeping and formed no finding. The item was queued refs-only
with no `.deferred.md` sibling — verified (`ls docs/reviews/*.deferred.md`
matches nothing; `reviewscan` counts two briefs, both clean) — so the rule-1
partition is trivially held: there was nothing to hold back. Rule 2 was
honoured: the two verdicts already in `docs/reviews/` were not opened until
this file's findings were written; the reconcile section at the end records
what was read after.

**Disclosures.** Tree sweeps ran through `coldsweep.py` with its default bar
and never `--include-barred`. That default also bars `docs/SESSIONS.md` and
`docs/sessions/`, which are the work under review, so those were read
directly by path (and at `7630fc2` via `git show`) — a read of the delta, not
a sweep. Commits after the delta head were inspected only as `git log --stat`
on the session-record paths, to learn whether the record was later amended;
no post-delta content was read. The 2026-08-17 session detail carries the
author's own evaluative account of this work (its Phase 3); it sits inside
the delta and could not be avoided — it was treated as the author's claim.

## Subject

The split of `docs/SESSIONS.md` from a 351-line flat log into a 26-line
index over nine verbatim detail files under `docs/sessions/`, with the
supporting record edits, landed 2026-08-17 by an Opus session on the
principal's ruling. Reviewed as landed at `4f52ad2`.

## Type

Built work that is also doctrine by function: the ADR fixes how every future
session here records itself (index line, detail file, identifier scheme,
wrapscan exemption). Rule 3 therefore applies — findings are the principal's
to decide, and the author records counsel only.

## Scope

- Delta `7630fc2..4f52ad2` (three commits: `73218e5` the split, `cfb06df` its
  merge, `4f52ad2` a pin bump with a board-preamble paragraph). The queue
  pointer names `7630fc2..HEAD`; the orchestrator pinned the upper bound at
  take-time (see F5). The pin-bump commit is not the session-log work but it
  sits inside the bound handed to this pass, so it was reviewed too.
- Intent record: `docs/decisions/2026-08-17-1229-split-the-session-log.md`.
- Prior art: `docs/decisions/2026-08-17-0545-adopt-the-split-board.md`.
- Doctrine surface: atelier `RECORD.md` § *The session log*, read at the pin
  (`431f1f7`) and at atelier HEAD — net-zero diff on that file between the
  two (two commits touch it and cancel out).
- Resulting files as they now stand: `docs/SESSIONS.md`, all of
  `docs/sessions/`, `CLAUDE.md`, `docs/ARCHITECTURE.md`, `.wrapscanignore`,
  the two board items and the board preamble.

## Load-bearing assumptions to challenge

Named by the reviewer as its first act; the intent record's account of the
work was treated as a claim, not as scope.

- **A1** — The length was fat entries, not a long index, so detail-on-demand
  (not rotation) was the right sanctioned move.
- **A2** — The move follows what RECORD.md dictates, not atelier's own
  layout (which uses the retired `NN` scheme).
- **A3** — The move was lossless: every entry's text is verbatim.
- **A4** — Identifiers were recovered from git (first commit, UTC), not
  invented.
- **A5** — `sizescan` is clean rather than suppressed, and the `wrapscan`
  exemption is as narrow as claimed (index only; detail files stay gated).
- **A6** — The unit is the session, applied consistently across all entries.
- **A7** — Nothing else in the repo needed to change for the new shape to be
  followed by the next session (implicit in what the delta touched).
- **A8** — The pin-bump commit's three claims: the child template is
  unchanged across `0af3006..431f1f7`, `board.py`'s change is docstring only,
  and the BS1 paragraph in the board preamble is a faithful paraphrase.
- **A9** — The rule-4 handoff was done to the letter: pointer queued in the
  landing commit, refs only, ADR carrying a review line.

## Grounding

What was actually driven, not "looks right":

- `git show 7630fc2:docs/SESSIONS.md` saved and split into entries by a
  script; each entry compared line-by-line (bullet and indent stripped) with
  its detail file. Ten pre-split entries, nine files (the two 2026-08-17
  phases share one), all identical; the ninth file carries 56 non-blank lines
  of *new* Phase 3 text after the moved entries, which is the live session's
  own entry, not a rewrite.
- First-commit UTC times per session date read from git across all parents.
- Atelier's floor run over the worktree at `4f52ad2` (hook plane): every
  enforced check green; `sizescan` clean with no `.sizescanignore`;
  `wrapscan` clean with six files exempted (`docs/research/**` plus the
  index); `board` index current; `pathscan` (warn-only) reports six
  pre-existing findings in the 0545 ADR, a file this delta does not touch.
- CI at head: `gh run list` shows `floor` and `CI` both `success` for
  `cfb06df` and `4f52ad2`.
- Atelier: `git diff 0af3006 431f1f7` on the child template (empty) and
  `tools/board.py` (+4/−1, docstring); the inlined floor's stamp region
  diffed against the template at `431f1f7` — identical bar the three
  fill-ins (pin, path, visibility). BS1's source wording read in
  `CONCURRENCY.md` at `431f1f7`.
- `linkscan` clean — every index pointer resolves; nine files, nine links.

## Non-goals

- The content of the historical entries themselves (they were reviewed by
  their own sessions; this pass checks the move, not the prose moved).
- The R1/R2 rulings that share the 2026-08-17 session — ruled by the
  principal on the 2026-08-15 verdict, not under review here.
- Commits after `4f52ad2` (`828b0a2`, `f1fcc3e`): board claims by a later
  session, outside the bound.

---

## Verdict — PASS-WITH-FINDINGS

**0 MAJOR / 1 MODERATE / 3 minor / 4 note**, plus the security lens
discharged. The work is sound: the split is what doctrine sanctions, it is
lossless (proven mechanically, not read), the scans are clean for the right
reason, and the rule-4 handoff was done properly. What the findings catch is
the *record* of the work running slightly ahead of its evidence — in three
places the intent record states a number or a rule that the tree does not
bear out. None of it changes the decision. With no MAJOR the cycle closes
here (REVIEW.md § The lifecycle): what follows is decided into fixes or the
backlog, and the application does not spawn another ceremony.

### Lens 1 — approach & assumptions

- **A1 holds directionally, on wrong numbers** (→ F1). Entry sizes measured
  10, 20, 16, 31, 17, 66, 39, 48, 50 and 47 raw lines — every one multi-line
  prose, median about 35, none a one-liner. That *is* detail inlined into an
  index, and rotation would indeed have archived it fat. The ADR's "eleven
  entries" and "30–48 lines each" are not what the file held.
- **A2 holds.** RECORD.md § *The session log* at the pin names both moves and
  the `<date>-<HHMM>-<slug>` scheme; atelier's own `docs/sessions/` listing
  is still `NN`-numbered, so copying it would have propagated a retired
  convention. Reading the rule rather than the layout was the right call and
  the re-briefing of the principal when the first framing proved incomplete
  is exactly the apex working.
- **A3 holds**, mechanically (Grounding above).
- **A4 holds for eight of nine** (→ F2).
- **A5 holds.** Floor re-run confirms both halves.
- **A6 holds.** The 2026-08-08 entries call themselves separate sessions and
  got separate files; the 2026-08-17 entry calls itself one session in
  phases and got one file. The rule was applied to what the record says, not
  to the clock — the four 2026-08-08 "sessions" span 78 minutes, which is a
  question for those entries, not for this migration.
- **A7 fails partially** (→ F3): the read side was updated, the write side
  was not.
- **A8 holds** on all three claims.
- **A9 holds**; the pointer's grammar earns a note upstream (→ F5).

### Lens 2 — correctness & quality

- "351 lines → 26" — `wc` agrees. "Nine detail files" — agrees.
- "Entry text verbatim, nothing rewritten, summarised or dropped" — agrees,
  and the claim is more precise than it sounds: only bullet markers and the
  two-space indent were removed, plus phase headings and a lead-in line
  were *added* in the ninth file.
- "sizescan is now clean rather than suppressed" — agrees; no ignore file.
- "atelier carries the identical entry" — the path line is identical; see
  F6 for what the sentence leaves out.
- The Phase 3 session entry records no verification line at all (Phases 1
  and 2 both end "Verified: …"). CI was in fact green at head; the record
  just does not say so. Folded into F4.

### Lens 3 — completeness / harvest

- F3: two write-side instructions still describe the old act.
- F4: the delta's last commit is not in the session record.
- F7: half of the stated residual is already mechanical and the other half
  is cheap.

### Lens 4 — security & privacy

**Discharged with grounds.** The delta moves text that was already published
in this repo's history; it adds no new data class and no new surface. At
design altitude the threat model of a per-session store is the same as the
flat log it replaces — over-disclosure of estate or personal detail into a
PUBLIC repo — and the moved text's only such mentions (an estate root, a
credential registry holding metadata) were generic when published and stay
so. Git-recovered timestamps expose nothing not already in public history.
`secretscan` and `leakscan` are clean at head. `/security-review` was not
run: its exclusions bar markdown, so a clean pass would be definitionally
empty and is weighed as nothing. No finding.

### Findings

**F1 — MODERATE — the intent record's quantitative grounds are wrong.**
The ADR's Context says "351 lines across eleven entries" and "eleven entries
ran 30–48 lines each"; the item disposition, the session's Phase 3 entry and
the commit message repeat it. The pre-split file held **ten** entries of
**10–65** raw lines (only five inside 30–48). The qualitative ground survives
— every entry was multi-line prose, so detail-on-demand was still the right
move — and the principal's ruling is not disturbed. But this session made a
point of re-briefing him because the first briefing was incomplete, then
briefed him on numbers nobody had counted; an accepted ADR is the durable
copy of that briefing. *Counsel:* a dated addendum to the ADR (accepted text
is immutable, per the 0545 precedent) giving the measured figures and saying
the conclusion stands on them; one line on the board item's disposition.

**F2 — minor — the identifier rule as stated is not the rule applied.**
The ADR: "each pre-split file takes the UTC time of that session's first
commit, read from git." Eight files do. `2026-08-17-0545-…` does not: the
first commit of that session is `78e31b1` at **05:54** UTC (no commit exists
at 05:4x); `0545` is the board-split ADR's own start time, set by that
session with `date -u`. That value is arguably the *better* fact — a
session-owned start, which is what doctrine wants — but the file's H1 says
"0545 UTC" under a rule that would have said 0554, and the ADR asserts a
uniform method. *Counsel:* fold into the F1 addendum: first-commit time, save
where the session left its own dated record at open, which takes precedence.
Renaming the file is not worth the churn.

**F3 — minor — the write side was not updated.** `CLAUDE.md` § Conventions
still says "append a `docs/SESSIONS.md` entry before finishing" and
`CONTRIBUTING.md` says "Append a dated entry to `docs/SESSIONS.md`". Both
described the flat log and now under-describe the act (one index line, plus
a detail file when the session is substantial). The read-order item and the
index preamble do carry the new shape — but the preamble sits above the tail
the file tells a session to read (`tail -20` already cuts its first six lines
and will cut all of it after roughly fourteen more sessions), and the
`sizescan` nudge that RECORD.md relies on to catch a regression to a flat log
fires at ~250 lines, so several fat entries would pass silently first.
*Counsel:* one clause in each of the two lines naming both halves of the act.

**F4 — minor — the session record at the delta head omits the delta's last
commit.** `4f52ad2` bumped the pin `0af3006` → `431f1f7` and added the BS1
paragraph to the board preamble; the session's index line and Phase 3 entry
record the pin as `eef38be` → `0af3006` only and carry no verification line.
No commit since (stat-checked to `main`) has amended the record. The commit
message holds the account, but doctrine puts the next session's read in the
session log, not `git log`. *Counsel:* the orchestrator's close for this pass
appends the missing fact as its own dated entry — RECORD.md says a pointer to
continuing work names the entry, so a later entry is the append-only shape.

**F5 — note, handed up to atelier — the queue pointer names a moving bound.**
`010-session-log-split.md` says `7630fc2..HEAD`. Rule 4's landing = queuing
makes the landing SHA unknowable from inside the landing commit, so `HEAD` is
the natural spelling — and it drifts: at take-time `HEAD` was four commits
past the landing, and this pass reviewed a pin-bump commit the author never
queued. `pointerscan` reports the pointer "refs-only and current", so the
tool accepts a symbolic bound. The orchestrator pinning the bound in its
claim (as done here) is the right practice; the doctrine could say so, and
the pointer grammar could spell the bound as "the commit that adds this file"
(resolvable by `git log --diff-filter=A`). Not the author's error.

**F6 — note — "atelier carries the identical entry" is half the sentence.**
atelier's `.wrapscanignore` does carry `docs/SESSIONS.md`; it *also* exempts
`docs/sessions/` on the ground that its detail files are one-entry-per-line.
tūhura keeps its detail files gated, and they pass. That is stricter and
right — the ADR's next sentence even says so — but "identical" invites a
future session to copy atelier's second entry as well. *Counsel:* fold one
clause into the F1 addendum.

**F7 — note, handed up to atelier — the stated residual is half solved.**
The ADR records honestly that index and detail can now disagree with nothing
mechanical to stop it. Half of it is already mechanical: `linkscan` fails a
commit whose index line points at a missing file. The unguarded half is an
orphan detail file with no index line, or a line whose date/slug disagree
with its target's name — a short check, and one that belongs in atelier's
floor (one source) rather than here. No defect at head: nine files, nine
resolving links.

**F8 — note — the ADR's review line points at the board, not a brief.**
`docs/decisions/README.md` gives the queued form as
`queued — docs/reviews/<file>`; this ADR points at the roadmap pointer,
because in a refs-only queue no brief exists until the taker writes it.
`reviewscan` accepts it and it is the correct pointer. The README could name
the refs-only case so the next author does not invent a brief to satisfy the
stated form.

### Live-proven claims, re-run

| Claim | Result |
|---|---|
| 351 → 26 lines, nine files | ✅ `wc` |
| Entries verbatim | ✅ script, all ten entries identical |
| Identifiers = first commit UTC | ⚠️ eight of nine (F2) |
| `sizescan` clean, not suppressed | ✅ floor run, no ignore file |
| Index exempt, detail files gated | ✅ six exemptions, none under `docs/sessions/` |
| Board index current | ✅ floor run |
| Pin bump: template unchanged, board.py docstring-only | ✅ both diffed |
| Inlined floor matches template | ✅ stamp region diffed, fill-ins only |
| Floor at head (CI plane) | ✅ `floor` + `CI` success at `cfb06df`, `4f52ad2` |

### Follow-up checklist

- [ ] F1 + F2 + F6 — one dated addendum to the ADR (principal's decision).
- [ ] F3 — two one-clause edits (`CLAUDE.md`, `CONTRIBUTING.md`).
- [ ] F4 — append the unrecorded pin bump as a dated session entry.
- [ ] F5, F7 — hand up to atelier as notes against `pointerscan` and the
      floor; F8 — one sentence in `docs/decisions/README.md`.

Severity vocabulary is atelier's current one (MAJOR / MODERATE / minor /
note); the 2026-08-15 verdict in this directory used MAJOR / MINOR, and
nothing turns on the difference.

### Reconcile — prior verdicts, opened after the findings above were written

Two prior verdicts sit in `docs/reviews/`: the founding review
(`2026-08-08-0516-…`) and the platform-tier + marine-staging pass
(`2026-08-15-1033-…`). Both were opened only after every finding above was
in this file. Neither concerns the session log, and no finding here overlaps
or contradicts either — there is nothing to reconcile in substance. The
2026-08-15 verdict's follow-up checklist is ticked "done 2026-08-17"; the
work those ticks claim landed at or below `7630fc2`, the base of this delta,
so verifying them is outside this pass's bound and was **not** done — noted,
not claimed. This file follows the 2026-08-15 file's shape (brief fields,
divider, first-act assumptions, findings, security, checklist, reconcile).
No deferred sibling existed, so nothing is folded in below.
