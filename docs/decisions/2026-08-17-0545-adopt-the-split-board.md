# Adopt the split board — one file per roadmap item, a generated index

**Status**: accepted • **Date**: 2026-08-17
**Review**: not warranted — this is *adoption* of an upstream decision that was
itself researched, adversarially re-tested, and ruled on (atelier's board-store
ADR, 2026-08-15). Nothing re-litigable is decided here: the store's shape,
grammar, and floor check are taken as ruled. The one local variation — a
resolver shim at `tools/board.py` — is a mechanical consequence of atelier's
tools living outside this tree, recorded below and handed up to atelier as a
finding rather than settled here.

## Context

Mike directed this repo to take the board split (2026-08-17). The upstream
ruling is atelier's, dated 2026-08-15: one markdown file per roadmap item under
`docs/roadmap/`, with `ROADMAP.md` reduced to a short auto-rebuilt index and a
`board` floor check that blocks a commit whose index has drifted from its item
files. atelier migrated itself first, deliberately, as the worked example before
any fleet rollout; tūhura is the first child to follow.

Three defect classes drove the upstream split, and the ordering of their weight
here is **not** the same as atelier's:

- **Contention at file grain.** atelier's strongest lived incident — a wholesale
  revert of the shared board destroying a sibling session's in-flight work.
  tūhura has never had two sessions collide on `ROADMAP.md`; this benefit is
  real but prospective, and it is honest to say so.
- **Read cost.** atelier's board reached 4,063 lines (~67k tokens) read at every
  session open. tūhura's was **173 lines** — a rounding error by comparison.
  This repo is not adopting to fix a size problem it does not have.
- **State asserted, not derived.** An item's own `git log` becomes its
  provenance: which commit flipped its state, and what work that commit carried.
  This applies at any board size, and it is the benefit tūhura gets **today**.

So the honest grounds for adopting now are: the provenance property is
immediate; the contention property is insurance taken before it is needed rather
than after; and a board that grows into the problem after the fleet has moved on
would be migrating alone, without the worked example beside it.

## Decision

Adopt the upstream shape without local variation, bar the shim below.

- **`docs/roadmap/<NNN>-<section>/<NNN>-<slug>.md`** — one item per file, the
  existing checkbox grammar verbatim (`[ ]`/`[~]`/`[x]`/`⏳` on the first line,
  continuations beneath). No frontmatter: state lives in the checkbox line and
  nowhere else.
- **Six sections**, the five that already structured the board plus one new:
  `010-v1-committed-spine`, `020-post-v1-evidence-gated`,
  `030-icebox-externally-gated`, `040-queued-reviews`, `050-standing-threads`,
  `060-record-keeping`. Each section's narrative is its own `README.md`; the
  board preamble (legend, review-line rule, tier structure) is
  `docs/roadmap/README.md`.
- **`docs/ROADMAP.md` is generated** — 173 hand-kept lines became a 58-line
  index. Done items render `✅`, never `[x]`, so `sizescan`'s cold-content gate
  cannot fire on a generated line.
- **The `board` floor check now enforces here.** It was passing as
  out-of-scope; it began blocking the moment `docs/roadmap/` existed. Nothing
  was wired to turn it on — it arrives through atelier's registry, which is the
  design working.
- **`ROADMAP-DONE.md` is frozen** as the pre-split archive. A done item now
  stays `[x]` in its own file, flipped in the commit that finishes the work.
  There is no harvest step, and the harvest's red-window failure mode retires
  with it.
- **Claiming is unchanged in shape**: the claim edits the item file's checkbox
  line on `main`, before the worktree, and the claim commit carries the
  regenerated index. Sessions on different items now conflict on nothing.

**Two 🎯 flags were surfaced, not created.** `board.py` lifts eye-flags from an
item's *state line* into the index, and the two owner rulings outstanding — the
platform-tier question and the marine-staging question — carried their 🎯 in
body prose, where the index could not see it. Moving the glyph to the state line
makes both visible at the session-start read. The rulings themselves are
untouched and still Mike's.

## The one local variation: `tools/board.py` as a resolver shim

atelier's `board.py` writes its own remedy into the generated index and into
every failure message — *"run: `python3 tools/board.py rebuild`"*. In atelier
that string is true. In a child repo it is not: the scanners are atelier's
tools, one source, and a child does **not** vendor them (`.githooks/pre-commit`,
ADR 0008). So a tūhura session blocked by the floor would be handed a command
that does not exist.

`tools/board.py` here is a ~90-line shim carrying **no board logic**: it
resolves atelier's tools the same way the pre-commit hook resolves `floor.py`
(`ATELIER_TOOLS` env → `hooks.atelierTools` git config → `../atelier/tools`),
defaults `--root` to this repo so it works from any cwd, and hands argv
straight through. It fails closed and loud — a shim that silently did nothing
would be worse than none, because the floor would still block and the remedy
would still lie.

**Handed up, not fixed here**: the generated remedy string assuming
atelier-local tools is atelier's defect, found by being the first child to
adopt. A shim per child repo is a workaround; the upstream fix is for the
remedy line to know it is speaking to a child.

## Rejected

- **Vendoring `board.py` into `tools/`.** Directly contrary to the one-source
  rule the hook spends thirty lines defending — a vendored copy goes stale the
  moment atelier improves the tool, which is exactly the failure ADR 0008 was
  written after.
- **No shim, and document the real command instead** — CONTRIBUTING spelling
  out the path to atelier's own `board.py` in the sibling checkout. Cheaper, and
  it leaves the *machine-printed* remedy wrong — the message a session actually
  reads at the moment it is blocked. Documentation does not out-shout a failure
  message.
- **Deferring adoption until the board grows.** The read-cost case is genuinely
  weak at 173 lines, so this was live. Rejected because the provenance benefit
  does not scale with size, and because migrating later means migrating without
  the fleet's worked example in front of it.
- **Flattening the tiers into fewer sections.** The three-tier structure is the
  founding review's (2026-08-08) and carries meaning — committed / evidence-
  gated / externally-gated. The split was a change of *store*, not of content;
  restructuring under cover of a migration would hide a second decision inside
  the first.

## Consequences

- The session-start board read drops 173 → 58 lines; item detail loads on
  demand. A smaller win than atelier's, and stated as such.
- Every state change now rebuilds the index **in the same commit** — the `board`
  check makes that mechanical rather than remembered. After a merge conflict on
  the index, rebuilding *is* the resolution; never hand-merge it.
- Items' position *within* a section's narrative is no longer expressed;
  cross-item prose references degrade to section level. Known upstream cost,
  accepted here unchanged.
- Item files are ordered by numeric filename prefix in tens, so re-prioritising
  means renaming (git tracks it) and there is room to insert between items
  without a renumber. Order granularity is advisory.
- A fresh clone that has not run `git config hooks.atelierTools` cannot rebuild
  the index *or* scan — the same pre-existing gap CONTRIBUTING already covers,
  now with one more symptom.

## Addendum 2026-08-17 — the local variation is retired, and a claim is corrected

Everything above stands as accepted. Two things changed within hours of it, and
both are appended rather than edited in.

**The shim is gone; all three findings were fixed upstream.** The section *The
one local variation* described `tools/board.py` as a shim to be handed up, not
kept. atelier did the upstream fix the same evening — `b2ba382` (the generator
writes for the repo it lives in), `363a846` (the wrapscan half), `a3a64aa` (emit
the hook's *whole* resolution order, after a first attempt named only
`$ATELIER_TOOLS` and expanded to `python3 /board.py` on a machine that sets the
git config instead). So:

- `tools/board.py` is **deleted**. The generated banner now names no path at
  all, and the rebuild instruction in the preamble is emitted per-repo:
  repo-relative where the tool lives inside the tree, the hook's full
  `${ATELIER_TOOLS:-$(git config hooks.atelierTools)}` order where it does not,
  and never an absolute path — a machine-local fact has no business in a public
  file.
- The `.wrapscanignore` entry for the index is **removed**, and `wrapscan` is
  green with no exemption. The cause was not a policy conflict at all: item
  flags were appended *after* the link, which put a space after the trailing
  store path and destroyed the unbreakable-token exemption the line already had.
  Flags now lead the link. My reading of it as "two enforced checks are mutually
  unsatisfiable" was wrong — it was a trailing space.
- `.pathscanignore` is **deleted entirely**. The generator stopped repeating
  each section's path as its own link text, so the six-per-rebuild false
  positives are gone. The exemption is not merely unnecessary now, it was
  masking real findings: with it removed, `pathscan` immediately surfaced eight
  live references to the shim this addendum retires.

**Correction: tūhura was not the first child to adopt.** The Context above says
it was. `faves` split its board at 17:28 NZST on 2026-08-17, twenty-six minutes
before this repo's merge at 17:54, and it is faves' adoption the upstream fixes
name in their own comments. The two sessions ran concurrently and neither could
see the other's commits; nothing was checked before the claim was made, and that
is the defect — the claim went further than the evidence, which is the one thing
the apex does not trade. What survives is only that both children independently
hit the same three defects within half an hour, which is stronger evidence for
the upstream fixes than either report alone.

**Pin.** `atelier@eef38be` → `atelier@0af3006`. The doctrine moved with it (the
inlined floor gains the before-the-action re-briefing rule and the channel's
concurrency wording, both now verbatim against atelier's template); the earlier
session note that "no pin bump is owed" was true against `66ff846` when it was
checked and false thirty minutes later.
