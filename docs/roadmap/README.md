# tūhura ROADMAP — the board

**One file per item** (board-store ADR, atelier 2026-08-15; adopted here
2026-08-17 — [`../decisions/2026-08-17-0545-adopt-the-split-board.md`](../decisions/2026-08-17-0545-adopt-the-split-board.md)).
Each item lives in `<NNN>-<section>/<NNN>-<slug>.md`: its checkbox line first,
detail beneath, its own `git log` as provenance — which commit flipped its state,
and what work that commit carried. Each section's narrative lives in that
section's `README.md`. [`../ROADMAP.md`](../ROADMAP.md) is the **generated index**
(rebuilt with the command the index itself prints at the top — atelier's
`board.py`, reached through the same `hooks.atelierTools` wiring as the scan
hook; the `board` floor check blocks a commit whose index is stale, and after a
merge conflict on the index, rebuilding *is* the resolution). The session-start
read is the index; open item files on demand.
Completed detail from before the split lives frozen in
[`../ROADMAP-DONE.md`](../ROADMAP-DONE.md); a done item now simply stays in its
file as `[x]` — there is no harvest step.

**Keep it honest, and keep it lean.** The board is the cross-session memory of
what is *actually* left; tick an item in the commit that lands its work, and
never let a state line say something the tree does not. Lean matters because the
index is read at every session open — detail belongs in the item file, where it
is loaded only when the item is worked.

Checkbox states — a **work-owed tri-state**, never a disposition: `[ ]` work
still owed · `[x]` **no more work owed** — delivered, superseded, or declined,
with the disposition said in the item's own text (a dated note), never a fourth
bracket · `[~]` **claimed** by a live parallel session —
`(claimed <date>-<HHMM>, wt: <branch>)`, optionally extended in place with a
resume breadcrumb — don't start a `[~]` item; take the next open one
([atelier CONCURRENCY][concurrency] § Claiming work) · `⏳` **review
queued** for a non-author to take; the pointer is **refs only** — name the delta
and the intent record, no evaluative account.

The harvest-integrity gate holds archive stores to finished-state items only — a
live `[ ]`/`[~]`/`⏳` item in `ROADMAP-DONE.md` reds the floor.

**Review lines.** An entry that records **design or direction** (a chosen
approach, a scoped feature, a decision that forecloses alternatives) carries a
review line — `review: queued (docs/reviews/<file>)` or
`review: not warranted — <grounds>` (atelier's [review doctrine][review]:
omission is the bug). Plain work items don't.

**The `board` check is weaker at the hook than it looks** (atelier BS1, Mike's
ruling 2026-08-17). It compares the *worktree* against the worktree, not the
staged plane — so a rebuilt-but-unstaged index passes the hook, and so does a
rebuild that absorbed a sibling's dirty state line. CI catches the forgotten
rebuild unconditionally; the hook only catches it when worktree and index agree.
The consequence that bites: **a dirty item state line is a stop for claiming
from that checkout** — sync and take the next open item — not a
stage-your-own-hunk case.

**Claiming.** A claim edits the item file's checkbox line **on `main`**, before
the worktree, and the claim commit carries the regenerated index with it. A
same-item collision still fires as a same-line git conflict; sessions on
different items now conflict on nothing.

## Structure — three tiers (founding review, 2026-08-08)

**v1** is the committed spine; **post-v1** items are *evidence-gated* (each names
the gate that unlocks it); **icebox** items are *externally gated* (events
outside our control). Owner directives are staged, never dropped — the tier
records *when*, the gate records *why then*. Two sections sit beside the tiers:
**queued reviews** (refs-only pointers awaiting a non-author taker) and
**standing threads** (options that may never open, off every critical path).

<!-- Cross-repo pointers into atelier (public), as full URLs so they resolve
     for a reader who has no sibling checkout — decisions/README.md's convention. -->

[concurrency]: https://github.com/mike548141/atelier/blob/main/docs/method/CONCURRENCY.md
[review]: https://github.com/mike548141/atelier/blob/main/docs/method/REVIEW.md
