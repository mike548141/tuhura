# Cold pass — the floor block re-stamped at `0a2b7a7` (rule 4, refs-only)

**Status:** ACT 2 WRITTEN 2026-11-01 (UTC) — the cold pass ran on Fable 5.1;
act 1's verdict is below the divider and act 2 (the held-back sibling's three
entries, tested against it) follows beneath. Final: **PASS — 0 MAJOR,
3 MINOR, 5 NOTE** (act 1 read 0/2/4; act 2 raised F4 to MINOR and added F7).
Act 1 was committed as `6a01f3a` before the sibling was released; the
sibling is folded in at the end of this file. Brief written 2026-11-02 1159
UTC for board item `040/040`, which queued the pass on 2026-10-26 and left
the brief to its taker. **Fable-gated:** the pass runs only on Mike's
explicit approval of Fable work at the time (this run: the 2026-11-02 drain
approval).

## Provenance

This brief was written by a brief-writing sub-agent (Claude Opus 5.5) of
session `2be3482c`, on Mike's instruction of 2026-11-02, verbatim: *"Write
briefs for anything that needs a review in any of the repos, where a brief
is not ready"*. It wrote none of the delta, ran no review, and formed no
finding. It wrote the held-back sibling named below.

**Barred from taking this pass** (rule 4):

- session `9172eab0`, which authored the bump (its record:
  `docs/sessions/2026-10-26-1009-pin-bump-0a2b7a7.md`);
- this brief-writing sub-agent and its parent session.

**Tier: Fable, checked at selection.** A session not on Fable stops, and
neither takes the item on a lower tier nor proceeds hoping the pass is
accepted (`REVIEW.md` rule 4). An off-tier orchestrator, if any, forms no
finding, writes no severity, and is disclosed in the claim, the pointer and
the verdict. The verdict repeats this provenance.

## Subject

- **Delta:** `29b463b..cd543c9` — one commit, `cd543c9`, resolved from the
  item's own recipe
  (`git log --diff-filter=A -- docs/roadmap/040-queued-reviews/040-floor-restamp-0a2b7a7.md`
  returns `cd543c9`). Files: `CLAUDE.md` (the inlined floor block and its
  pin), `docs/ROADMAP.md`, the queued-reviews README and item `040/040`, and
  the session record.
- **Read it body-free:** from the primary checkout,
  `/usr/bin/python3 ../atelier/tools/coldsweep.py --commit cd543c9`
  (add `--path CLAUDE.md` to scope it). Plain `git show` is barred until
  phase 2: it prints the body ahead of the diff, and reading is atomic
  (`REVIEW.md` rule 1).
- **The canonical text:** atelier `docs/method/PROPAGATION.md` at
  `0a2b7a7`, the region between `floor:begin` and `floor:end`, and that
  file's stamp rules. From a worktree, `../atelier` does not resolve; use
  `ATELIER="$(git rev-parse --git-common-dir)/../../atelier"` and
  `git -C "$ATELIER" show 0a2b7a7:docs/method/PROPAGATION.md`.
- **Intent record** (phase 2): the session record named above. It is a
  claim to test, not settled scope.

## Type

Self-authored doctrine by function (`REVIEW.md` rule 3): the floor block is
the safety floor every session here reads first. Findings are Mike's to
decide; nothing is applied by the reviewer.

## Why it earns a review

The inlined floor is what binds a session that never opens atelier. A copy
that drifts from the canonical text, narrows it, or adds to it changes the
floor silently, and the repo is public, so every byte of it is published.
The author's record says this repo's stamp check cannot judge a child's
floor copy, so no machine has compared it.

## Scope and the four lenses — run all four

The whole commitment: the copy against its canonical source at the pin,
the substitutions a child is allowed to make, the pin line, and anything
else the delta changed. Approach & assumptions first: name the load-bearing
assumptions yourself before reading the list below. Security & privacy:
the block is public prose; say whether anything in it discloses what a
public repo must not, and discharge `/security-review` in one line (no code
in the delta). Run the standing checklist (V1–V7) unasked.

## Load-bearing claims to attack

- **C1** — The inlined block matches the canonical `floor` region at
  `0a2b7a7` word for word, apart from the substitutions the stamp rules
  allow.
- **C2** — The only wording change since the previous pin is the
  **Estate resources** bullet.
- **C3** — The pin line names `0a2b7a7`, and `0a2b7a7` is an ancestor of
  atelier's `origin/main`.
- **C4** — The checks the author ran (`floor.py --plane ci`) passed before
  and after, and the stamp check's inability to judge a child's copy is as
  the record states.

## Grounding — re-run lines

Each run once by the brief-writer on 2026-11-02, from a fresh worktree of
`origin/main` at `da5259e`. Re-run every one; a line that no longer
reproduces is a finding.

- `/usr/bin/python3 "$ATELIER/tools/floor.py" --plane ci` → exit 0.
- `git -C "$ATELIER" show 0a2b7a7:docs/method/PROPAGATION.md | sed -n
  '106,200p'` (the lines between the two fences) diffed against
  `sed -n 1,99p CLAUDE.md` → 20 changed lines in three hunks: the opening
  fence and pin line, the drift bullet's atelier path and pin, and the
  visibility bullet and closing fence.

## Rule 2 — what is barred until your findings are committed

- The landing commit's message body (see *Subject*).
- The session record and `docs/SESSIONS.md`.
- Prior verdicts in `docs/reviews/`; search with `coldsweep.py`, whose
  default bar excludes them.

## Non-goals

- The rest of the pin bump's doctrine catch-up beyond the floor block (the
  session record lists it): in scope only where it changed the block.
- Bumping the pin again.

## The held-back sibling

`2026-11-02-1159-floor-restamp-0a2b7a7-cold.deferred.md`, beside this
file, holds 3 entries. Open it only after your findings are durably written
here; then fold it in below your verdict and delete it (`REVIEW.md`
rule 1).

*(Orchestrator, 2026-11-01: the sibling is folded below the verdict, under
"Deferred sibling, folded below the verdict"; its file is deleted.)*

---

# Verdict — act 1 (findings written before the sibling was opened)

**PASS — 0 MAJOR, 2 MINOR, 4 NOTE.** The inlined floor is the canonical
`floor` region at `0a2b7a7` verbatim once the four placeholders are filled
by script, with one residue: the `<visibility fact>` slot carries four lines
of prose, one of which states a floor obligation the canonical floor does
not (F1). Every other claim in the brief holds; both grounding lines
reproduce. Findings on this surface are Mike's to decide (rule 3); nothing
is applied here.

## Provenance (rule 4, V7)

- **Reviewer:** Claude Fable 5.1, tier checked at selection. I read the
  delta, answered the lenses, and assigned every severity below.
- **Spawn:** a headless orchestrator session (Claude Opus 5.5), itself
  started by drain session `c87c4ee0` (Claude Opus 5.5), inside this repo.
  Both are rule-4 off-tier orchestrators: they hold the context partition
  (the `.deferred.md` sibling was removed from this worktree before I
  opened it and is released only after act 1 is committed), form no
  finding and write no severity. Neither wrote the brief or the delta.
- **Barred parties, not involved:** session `9172eab0` (author of the
  bump) and the brief-writing sub-agent of session `2be3482c` and its
  parent. I was neither started nor instructed by any of them. The claim of
  `9172eab0`'s authorship rests on the brief and the board item; the
  session record that would corroborate it is rule-2 barred until act 2.
- **Authority:** Mike's 2026-11-02 Fable drain approval.

## Rule-2 disclosure — what was and was not read

- Not read: the landing commit's message body (`coldsweep.py --commit`
  only), `docs/sessions/*`, `docs/SESSIONS.md`, `docs/ROADMAP-DONE.md`,
  prior verdicts in `docs/reviews/`, the held-back sibling. Every tree
  search ran through `coldsweep.py` with its default bar; no
  `--include-barred` run.
- Read, and disclosed because it bears on F1 and F4: four items on
  **atelier's** board at `origin/main` — `320/160` (stampscan cannot stamp
  across a repo boundary), `320/620` (a child's visibility fact inside its
  verbatim floor), `320/180` (sibling-path convention breaks in a
  worktree) and `210/110` (`pins.py` from a worktree). They are the
  parent's doctrine state, not this repo's prior verdicts; none was written
  about this delta. I formed F1 from the diff before reading them; they
  changed its routing, not its existence.
- Read as canonical sources: `PROPAGATION.md`, `RECORD.md`, `TOOLBOX.md`
  and `tools/stampscan.py` at `0a2b7a7`; `REVIEW.md` and
  `skills/create-repo/SKILL.md` at the pin; `PROPAGATION.md` at `548b706`
  and at `origin/main` for the region diffs.

## Lens 1 — the load-bearing assumptions, named by me

Named before the grounding lines were re-run; the brief's own list is
treated as a claim set, not a fence.

- **A1** — "Verbatim apart from the allowed substitutions" has a defined
  meaning: the stamp rules say which lines a child may change and how far.
  *Attacked:* they do not. `PROPAGATION.md` names four placeholders and
  says "fill" them; nothing bounds a fill's length or content, and the
  house's one example fill (`skills/create-repo/SKILL.md:144`) is a single
  parenthetical clause. Atelier's `320/620` records the same gap. So C1 is
  decidable only on the four substituted lines; what a fill may *contain*
  is an open doctrine question. F1 is the consequence.
- **A2** — Some machine compared this copy to its canonical text.
  *Attacked:* none did, and none can (F4). The hand comparison in this
  verdict is the only one on record for this copy, besides the
  brief-writer's.
- **A3** — The pin bump's floor review is the floor block alone.
  *Attacked and held:* the delta also edits CLAUDE.md § *Conventions* (the
  identifiers-block sentence) and the ROADMAP index. Both checked below;
  both sound.
- **A4** — The copy that was re-stamped is the copy at HEAD. *Held:* the
  block at `cd543c9` is byte-identical to the block at `c43cee4` (HEAD).
- **A5** — The repo is PUBLIC. *Assumed, not re-verified:* `gh repo view`
  is network and outside this pass's grant. The repo's own ADRs of
  2026-08-08 and the floor line assert it; nothing read contradicts it.

## The claims (C1–C4)

- **C1 — holds, with F1.** Method: extract the region between
  `floor:begin`/`floor:end` at `0a2b7a7`, strip the presentation fence,
  fill `<SHA>` → `0a2b7a7`, `<atelier-path>` → `../atelier`,
  `<owner/repo>` → `mike548141/tuhura` **by script**, then run
  `stampscan.py` against a scratch root holding that filled canonical text
  beside this repo's `CLAUDE.md`. Result: one drift line, the visibility
  bullet — every other line of the 95-line region compares equal. The nine
  bullets the structural rule (SR2) requires are all present, in order.
- **C2 — holds.** `diff` of the region at `548b706` against `0a2b7a7`: one
  hunk, the Estate-resources bullet (six lines → eight; the "shared estate
  tooling" phrase moved out, the `TOOLBOX.md` pointer moved in). One
  atelier commit in the 590 between the pins touches `PROPAGATION.md`
  (`55572b1`). The copy's delta carries exactly that hunk plus the two pin
  lines.
- **C3 — holds.** The heading and the drift line both read `0a2b7a7`;
  `git merge-base --is-ancestor 0a2b7a7 origin/main` is true after a
  read-only fetch. No `548b706` residue anywhere in the unbarred tree
  (`coldsweep`, 121 files). The region is unchanged between `0a2b7a7` and
  `origin/main` (24 commits), so the copy is also current against the
  parent's tip, though the pin itself trails.
- **C4 — holds, and is sharper than the record states.** `floor.py --plane
  ci` exits 0 from this worktree (secretscan 5 advisory entropy hits, all
  pre-existing hashes and ids; leakscan without `--require-terms`). On the
  stamp check: `stampscan` is **not in `floor.py`'s registry** in either
  plane, by its own header's design, so "cannot judge a child's copy" is
  true twice over — it never ran, and it could not have: `stampscan --root
  <this repo> CLAUDE.md` exits 2 (`missing-source`), and with the source
  made resolvable it exits 1 on the filled pin line. The CI floor
  (`.github/workflows/floor.yml`) checks atelier out at `@main`, not at the
  pin, so the pass the author recorded is a laptop fact at the pin;
  reproduced here, so it stands.

## Grounding — re-run

- `floor.py --plane ci` → exit 0. Reproduces.
- Region lines 106–200 at `0a2b7a7` against `sed -n 1,99p CLAUDE.md` → 20
  changed lines in three hunks, exactly as the brief states. Reproduces.

## Findings

Severity is mine; the decision on each is Mike's (rule 3). Nothing applied.

### F1 — MINOR — the visibility slot carries doctrine, not a fact

`CLAUDE.md:93–97`. The canonical line is
`- **This repo's visibility:** <visibility fact>. Verify: …`. The copy
fills the slot with four lines: the fact (`PUBLIC (Mike's decision,
2026-08-08)`), a consequence ("every push is publication … mirrored and
archived the moment it lands") and a floor statement: *"Narrowing back to
private is a floor action and does not un-publish what already went out."*
The canonical always-stop list names *making a private repo public or
widening its audience*; it does not name narrowing. So the copy's floor
asks a session to stop on an action the house floor does not, inside the
one block that is meant to be the canonical text word for word
(`PROPAGATION.md`, ruled 2026-09-19, `115/030`). The addition is
conservative — it over-stops rather than under-stops — and it is
**inherited**: the stamp at `548b706` carried the same four lines, so the
delta re-asserted it rather than introduced it. Whether Mike ruled the
narrowing clause on 2026-08-08 is unverifiable from the unbarred tree
(the founding review is in `docs/reviews/`, barred until act 2).

Why it is a finding and not a style note: the slot is the one place a
child may write freely inside the floor, which makes it the one place a
local rule can enter the floor unreviewed by the parent; and when a
placeholder-aware `stampscan` lands (atelier `320/160`'s first sketch), a
fill that is a paragraph will red where a fill that is a fact will not.

*Recommendation:* trim the fill to the house shape — e.g. `PUBLIC (Mike's
decision, 2026-08-08; every push is publication)` — and move the two
remaining sentences to a repo-local bullet directly below `stamp:end`,
where this repo's own onramp already lives. If the narrowing clause is a
ruling Mike wants as floor, it belongs in the canonical text via
§ *Pointing up*, not in one child's slot. Alternative: keep the fill as is
and let atelier's `320/620` bound the slot; cost is that this copy stays
unjudgeable by any future tool until then.

### F2 — MINOR — the brief's record date is the local date, not the UTC date

This file is named `2026-11-02-1159-…` and its Status line said "Written
2026-11-02 1159 UTC"; its commit (`c36eefb`) landed at
`2026-11-01T12:00:20Z`, so 1159 UTC fell on **2026-11-01**. `RECORD.md`
§ *Absolute dating* (at the pin) is explicit: the record's date is the UTC
date, "an NZ morning is still the previous UTC day, so the prose date
matches the record's own UTC identifier". The board item repeats the local
date ("BRIEF WRITTEN 2026-11-02"); the claim line's `2026-11-01T15:05Z` is
correct UTC — so the item mixes bases. The delta itself is clean on this
rule: its record is `2026-10-26-1009-…` for a commit at
`2026-10-26T10:13Z`. Not the author's defect; the brief-writer's, and it
is the brief's framing, which rule 1 makes attackable.

*Recommendation:* do not rename the file (the verdict lives in it and the
board and index link to it); let this finding stand as the in-file
correction, and have the fold and close entries carry UTC dates. Mike may
prefer a rename; that is his call, and `linkscan` would show every link to
move.

### F3 — NOTE — the queued-reviews README keeps a hand count that is already stale

`docs/roadmap/040-queued-reviews/README.md:9–11` reads "Two open … both
briefed and waiting on Mike's approval". At HEAD, `030`'s pass has run
(`78ab884`) and its item is `[ ] 🎯`; only `040` is `[~] ⏳`. The delta
moved the count from "One open" to "Two open", continuing a pattern rather
than starting it, but a count maintained by hand beside a generated index
is a second home for one fact (V4), and it went stale within the week.
*Recommendation:* replace the count with a pointer to the index's queued-
reviews section and keep only the narrative.

### F4 — NOTE — no instrument judged this copy, and none can; the hand check is the instrument

Confirmed and measured under C4. Already on atelier's board as `320/160`
(both obstacles, with a public child's corroboration), `320/620` and
`020/110`; nothing new for this repo to hand up. What this repo *can* do
is what `320/160`'s corroboration describes and this verdict did: on every
pin bump, extract both regions by their markers, fill the placeholders by
script, and compare bytes. That step is not written anywhere in this
repo's unbarred tree (`CLAUDE.md`, `CONTRIBUTING.md`); whether the author
ran it is in the barred record. *Recommendation:* a one-line repo-local
note under the stamp or in CONTRIBUTING's pin-bump steps, until atelier
rules on `320/160`.

### F5 — NOTE — the floor's own drift recipe does not run where the floor tells you to work

The Concurrency bullet mandates a worktree by default; the Source & drift
bullet's `git -C "../atelier"` does not resolve from one (the brief had to
supply `$(git rev-parse --git-common-dir)/../../atelier`). A V5 tension in
the **canonical** text, not this copy's — filed upstream as `320/180`.
Adjacent: `pins.py --child <this repo>` reports "4 behind" where the
recipe's `0a2b7a7..origin/main` counts 24 (`pins.py` measures against
atelier's local HEAD; `210/110` is nearby). Recorded so the next bumper is
not surprised; nothing for this repo to change.

### F6 — NOTE — the ROADMAP index churn is the generator, not a hand edit

Two index lines unrelated to this item changed in the delta (`P0-B` and
`040/010` gained "…" continuations). That is `board.py` at the new pin
(`28ef94a`, "project each item's logical first paragraph") re-rendering
the index; rebuilding in the same commit is the rule, and the `board`
floor check passes at HEAD. Correct; noted so a reader does not take it
for a hand edit of a generated file.

## Lenses 2–4 and the standing checklist

- **Lens 2 (correctness):** the copy's three substituted sites are right;
  the Conventions sentence is a faithful gloss of `RECORD.md:95–121` at
  the pin (six of its seven identifier fields named; *Other repos* omitted,
  acceptable for a pointer); `TOOLBOX.md` exists at the pin and the
  bullet's gloss matches its opening. No overclaim found in the delta's
  unbarred text.
- **Lens 3 (completeness/harvest):** the pin SHA has two mirror sites in
  the block and both moved; no third mirror exists in the unbarred tree
  (the only `stamp:` markers are `CLAUDE.md:1` and `:98`). The 590-commit
  catch-up beyond the floor is a stated non-goal and not a fence over the
  floor's risk. Harvest: the hand-check method already exists upstream
  (F4) and was not reused here.
- **Lens 4 (security & privacy):** the block names the public
  `mike548141/tuhura` and describes the estate root without naming it;
  the delta's diff carries no home-directory path and no private
  repository name. `/security-review` **not run — discharged:** the delta
  is Markdown only, a landed commit, and the scanner's exclusions bar that
  file class, so its clean pass would be definitionally empty. The repo's
  own `secretscan`/`leakscan` ran via the floor (above).
- **V1** no claim beyond its evidence — the brief's "no machine has
  compared it" is exactly true (C4). **V2** both grounding lines re-run
  (above). **V3** mirror sites swept (lens 3). **V4** F3. **V5** F1 (copy
  vs canonical floor list), F5 (canonical, upstream). **V6** lens 4.
  **V7** this section's provenance; repeated from the brief.

## Follow-ups owed (for the fold; none applied)

- Mike's rulings on F1 and F2.
- Owner's call on F3 and F4; F5 and F6 need nothing.
- Act 2: open the sibling, reconcile its 3 entries against the findings
  above, fold it in below, delete it.

## Act 2 — the held sibling, tested against act 1

Opened after act 1 was committed and pushed (`6a01f3a`), on the
orchestrator's release; the sibling was the only file read in this act.
Its three entries are the brief-writer's hypotheses; each is answered as
confirmed, damaged, or already covered, with what act 1 caught and what it
missed. The sibling's text is folded in below by the orchestrator.

- **D1 — markers that promise a check nobody runs.** *Confirmed, and act 1
  missed the sharp half.* F4 said no instrument can judge the copy; it did
  not say that one prints a green. Measured in this act: `stampscan --root
  <this repo>` with no paths — the invocation an adopter types, and the one
  a hand step would carry — scans `docs/` only, never reaches `CLAUDE.md`,
  and prints `✓ stampscan clean — no stamped blocks found.`, **exit 0**.
  `--require-stamps` turns that into exit 2, but nothing in this repo or in
  the floor passes it, and `floor.py` at atelier `origin/main` (what the CI
  floor checks out) registers no stampscan at all, so no floor plane ever
  prints a stamp verdict, true or false. The markers this delta re-asserted
  therefore name a check that either errors (`CLAUDE.md` given explicitly)
  or greens over nothing (bare). Atelier's `320/160` § *The new half*
  records the default-scope defect with a different symptom in another
  public child; this repo shows the plain false-green shape. **F4 is raised
  from NOTE to MINOR** on that measurement: a silent-failure surface, not
  merely an absent check. Its recommendation gains a line: until atelier
  rules on `320/160`, any hand run of `stampscan` here must pass
  `--require-stamps` and name `CLAUDE.md`, and should expect exit 2.
- **D2 — the visibility bullet's attribution.** *Already covered by F1,
  which left it open; still open.* F1 states that whether Mike ruled the
  narrowing clause on 2026-08-08 is unverifiable from the unbarred tree.
  The place to verify it is the founding review in `docs/reviews/`
  (2026-08-08) and the two ADRs dated 2026-08-08, read for his words on
  visibility; this act's grant was the sibling alone, so the check is
  handed to the fold. Two outcomes, both already inside F1's
  recommendation: his words with that date → the fact stands and the floor
  clause is his to keep or lift; an agent's summary carried forward → the
  attribution "Mike's decision" is itself a V1 overclaim inside the floor
  and the fill should carry only the verifiable fact. No change to F1's
  severity either way, because F1 is about doctrine in the slot, not about
  who put it there.
- **D3 — proportion.** *Confirmed as a question; answered here as asked.*
  The byte comparison this pass made is mechanical and a tool could make it
  at every bump: extract both regions by marker, fill the four placeholders
  by script, compare, assert no residual `<placeholder>` and no over-wrap —
  `320/160`'s corroboration describes exactly this, and act 1 ran it in a
  scratch root in under a minute. What a tool cannot do is judge what a
  fill *contains* (F1) or whether the canonical change itself is right;
  those are the only two judgement calls a floor re-stamp carries. The
  rule-4 pointer was still correctly queued: the floor is self-authored
  doctrine by function, and `REVIEW.md` calibration puts doctrine text in
  the cold-review class — the author had no discretion to skip it. But the
  proportionate *standing* shape for this class is a tool for the
  comparison on every bump and a cold pass only when the canonical region
  changed in more than a substitution, or a fill changed. Recorded as
  **F7 — NOTE** below for Mike, since it is a calibration of his doctrine's
  ceremony, not this repo's to decide. This pass did pay for itself once:
  F1 is a content judgement no comparison tool would have made.

### F7 — NOTE — a floor re-stamp earns a tool at every bump and a cold pass only when the words moved

The judgement content of this pass was two calls (F1's slot content; the
one canonical bullet's change), and everything else was a comparison a
script makes. *Recommendation, for Mike via atelier (`320/160`, `320/620`):*
make the script-fill-and-diff the required step of every pin bump in every
child, and reserve the rule-4 pointer for bumps where the canonical `floor`
region changed beyond a substitution or the child's fills changed. Until
that is ruled, the pointer stays mandatory here, as it was for this one.

### Tally after act 2

| Finding | Act 1 | Act 2 | Change |
|---|---|---|---|
| F1 visibility slot carries doctrine | MINOR | MINOR | D2 leaves it open; no change |
| F2 brief's record date is local, not UTC | MINOR | MINOR | — |
| F3 README hand count stale | NOTE | NOTE | — |
| F4 no instrument judges the copy | NOTE | **MINOR** | D1: bare run prints a false green, measured |
| F5 drift recipe fails in a worktree | NOTE | NOTE | — |
| F6 ROADMAP churn is the generator | NOTE | NOTE | — |
| F7 proportion of the ceremony | — | **NOTE** | D3, new |

**Final verdict: PASS — 0 MAJOR, 3 MINOR, 5 NOTE.** The verdict is
unchanged; the tally moved from 0/2/4 to 0/3/5. Zero MAJOR, so under
`REVIEW.md` § *The lifecycle* the application of Mike's rulings closes
without a further queued pointer.

## Deferred sibling, folded below the verdict (orchestrator, 2026-11-01)

The text below is the brief-writer's held-back sibling,
`2026-11-02-1159-floor-restamp-0a2b7a7-cold.deferred.md`, carried in
verbatim except that its headings sit two levels deeper so they nest under
this one. The orchestrator held it outside the worktree until act 1 was
committed at `6a01f3a`, then released it to the reviewer for act 2; the
reviewer's reconcile of it is the *Act 2* section above. The orchestrator
(a headless Opus 5.5 session started by drain session `c87c4ee0`) formed
no finding and edited none of the reviewer's text. The sibling's own
words are hypotheses, never findings.

### Held back — the brief-writer's angles for the floor re-stamp pass

For `2026-11-02-1159-floor-restamp-0a2b7a7-cold.md`. **Open only after your
own findings are durably written in the brief** (`REVIEW.md` rule 1). Then
fold this in below the verdict and delete this file.

Written by the brief-writing sub-agent (Claude Opus 5.5, of session
`2be3482c`). Hypotheses, unproven; none was driven. Answer each: confirmed,
damaged, or already covered by your finding N.

- **D1 — markers that promise a check nobody runs.** The block now sits
  between `stamp:begin` / `stamp:end` markers naming its source region. If
  the stamp check cannot judge a child's copy, does any tool read those
  markers and print a green that a session will take as "verified"?
- **D2 — the visibility bullet's attribution.** It reads *"Mike's decision,
  2026-08-08"*. Is that decision on record in his words with that date, or
  an agent's summary carried forward?
- **D3 — proportion.** The comparison this pass makes is mechanical. Could
  a tool make it at every bump, and is a cold pass the proportionate check
  for a re-stamp whose only change is one bullet's wording (`REVIEW.md`
  calibration)? Say so in the verdict if not.
