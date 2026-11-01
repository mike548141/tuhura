# Cold pass — P0-C: where the basemap credential lives (design-time, refs-only)

**Status:** BRIEF ONLY — the review has NOT run. Written 2026-11-02 1157
UTC for board item `010/013` (P0-C), whose line reads *"review: queued"*.
**Fable-gated:** the pass runs only on Mike's explicit approval of Fable
work at the time. The verdict goes below a divider in this file (atelier
`REVIEW.md` § *The lifecycle*).

## Provenance

This brief was written by a brief-writing sub-agent (Claude Opus 5.5) of
session `2be3482c`, on Mike's instruction of 2026-11-02, verbatim: *"Write
briefs for anything that needs a review in any of the repos, where a brief
is not ready"*. It wrote none of the subject, ran no review, and formed no
finding. It wrote the held-back sibling named below.

**Barred from taking this pass** (rule 4: the review comes from a session
the author neither started nor instructed):

- the 2026-09-20 orchestrated queue run that wrote the item (landing commit
  `828b0a2`), and any worker it dispatched;
- this brief-writing sub-agent and its parent session.

**Tier: Fable, checked at selection.** A session not on Fable stops, and
neither takes the item on a lower tier nor proceeds hoping the pass is
accepted (`REVIEW.md` rule 4). If the pass runs as reviewer plus an
off-tier orchestrator, the orchestrator forms no finding and writes no
severity, and the arrangement is disclosed in the claim, the queue pointer
and the verdict's provenance. The verdict repeats this provenance.

## Subject

A design-time review of a written direction, before the decision it frames
is made. Nothing is built: no key exists and none is in `site/`.

- **The item:** `docs/roadmap/010-v1-committed-spine/013-p0-linz-basemaps-online-render.md`,
  landed in `828b0a2` and unchanged since. Its text is the author's: the two
  owed actions, the open question of where a key lives, and *"the scoping
  insight that may shrink this leaf to nothing"*. Read the landing commit
  body-free:
  `/usr/bin/python3 ../atelier/tools/coldsweep.py --commit 828b0a2 --path docs/roadmap/010-v1-committed-spine/013-p0-linz-basemaps-online-render.md`.
  Plain `git show` is barred until phase 2: it prints the body ahead of the
  diff, and reading is atomic (`REVIEW.md` rule 1).
- **The records it rests on and reshapes** (read at HEAD):
  `docs/ARCHITECTURE.md` § the basemap bullet and the licence table;
  `docs/decisions/2026-08-08-0452-pmtiles-in-opfs.md` (region provisioning);
  `docs/decisions/2026-08-08-0454-cacheable-licences-only.md`;
  `docs/decisions/2026-08-08-0450-one-vendored-map-dependency.md` and
  `docs/decisions/2026-08-08-0546-vendored-dependencies-rule.md` (what may be
  vendored, which bears on vendoring glyphs and sprites);
  `docs/research/2026-08-08-data-sources-and-tech.md` (the LINZ row);
  `docs/WORKPLAN.md` Phase 0; and the P0-D item
  `docs/roadmap/010-v1-committed-spine/014-p0-pmtiles-opfs-and-map-lifecycle.md`,
  which says archive generation waits on this item's key question.
- **The constraints it answers to:** this repo's `CLAUDE.md` hard
  constraints (public, no build step, offline-primary, licences, honest
  safety-adjacent data).

## Type

Direction, not plumbing, in the item's own words: *"this decides whether a
credential exists in the deployed artefact at all"*. The choice is Mike's
(the item marks both owed actions 🎯); the review's findings are counsel to
that choice. Whether any finding is doctrine by function (`REVIEW.md`
rule 3) is for you to judge and state.

## Why it earns a review

It is a decision that forecloses alternatives, in a public repo with no
build step: whatever the shipped app needs at runtime is published by the
commit that adds it, and a published credential cannot be unpublished. The
worst failure is a credential, or a dependency on one, landing in `site/`
or in the archive pipeline on an assumption nobody checked. The cheapest
moment to catch it is now, before the key exists.

## Scope and the four lenses — run all four

Scope is the whole commitment: the stated options, the scoping insight,
the assumptions under each, what each forecloses for P0-D and every later
region feature, and how each sits with the records above. Real-world
behaviour is in scope where it can be read without a key: the provider's
published terms and documentation, cited by URL and date, never recalled.

1. **Approach & assumptions** — the most important. Name the load-bearing
   assumptions yourself, as your first act, before reading the list below.
   Whether the item frames the right question is in scope.
2. **Correctness & quality** — does the item say what its sources say; is
   anything stated as settled that is not.
3. **Completeness / harvest** — options or consequences the item does not
   name; every record that would have to change under each option
   (`REVIEW.md` V3).
4. **Security & privacy** — a must. Credential exposure, abuse of whatever
   is published or self-hosted, and what any option sends to a third party
   from a user's device; checked against open catalogues (OWASP ASVS, OWASP
   API Security Top 10), not memory. `/security-review` has no code to read
   here; discharge it in one line with grounds.

Run the standing checklist (V1–V7) unasked.

## Load-bearing claims to attack

The item's own claims, in its own terms — a floor, never a fence. Damage
each with a probe (a cited term, a documented behaviour, a traced
contradiction across the records) or confirm it; reasoning alone is not
enough.

- **C1** — A LINZ Basemaps API key is a secret, and creating one is an
  account action and a credential.
- **C2** — The repo is public with no build step, so a key embedded in
  `site/` is published the moment it is committed.
- **C3** — Whether LINZ's free tier issues deliberately-public,
  domain-restricted keys is unverified.
- **C4** — Once a PMTiles archive is built and self-hosted, the running
  app reads tiles from OPFS.
- **C5** — Glyphs and sprites can be vendored alongside the style.
- **C6** — On that path the key is needed only to generate archives, a
  build-time credential on a workstation, never shipped; the app embeds no
  key.
- **C7** — Rendering online against LINZ first is the cheapest way to
  prove the style and the vendored renderer agree.

## Grounding — re-run lines

Each line was run once by the brief-writer on 2026-11-02, from the repo root
of a fresh worktree at `da5259e`. Re-run every one; a line that no longer
reproduces is a finding.

- `/usr/bin/python3 ../atelier/tools/coldsweep.py -i 'api.?key'` → 4 hits
  over 121 files (23 barred): `docs/WORKPLAN.md`, the research file's LINZ
  row, and two lines of the item. None under `site/`.
- `python3 tools/vendor_check.py` → exit 0, *"vendor pins, NOTICE coverage,
  and the no-CDN/no-npm rule all hold"*.
- `python3 tools/check_links.py` → exit 0, *"all local references
  resolve"*.
- The `coldsweep.py --commit` line under *Subject* → the subject, a
  one-file stat (+29) and the diff, with no message body.

## Rule 2 — what is barred until your findings are committed

"Committed" means durably written to your draft of this file.

- The landing commit's message body (see *Subject*).
- The session records: `docs/SESSIONS.md` and `docs/sessions/`, which carry
  the author run's account. If your onramp reads them, treat them as claims
  and disclose that you did.
- Prior verdicts in `docs/reviews/`. Search the tree with `coldsweep.py`,
  whose default bar excludes them.

## Non-goals

- Obtaining a key, or any account action: Mike's (the item's 🎯 1).
- Building the online render, the archive pipeline, or the `pmtiles` CLI
  install (an unapproved tool).
- P0-D's storage seam, which has its own pass (`040/030`).

If a non-goal fences off a risk the direction actually carries, say so as a
finding.

## The held-back sibling

`2026-11-02-1157-p0c-basemap-credential-cold.deferred.md`, beside this
file, holds 7 entries. Open it only after your findings are durably written
here; then fold it in below your verdict and delete it (`REVIEW.md`
rule 1).
