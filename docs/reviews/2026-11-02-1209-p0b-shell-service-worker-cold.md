# Cold pass — P0-B: the app shell and its service worker (rule 4, refs-only)

**Status:** BRIEF ONLY — the review has NOT run. Written 2026-11-02 1209
UTC for board item `010/012` (P0-B). **Fable-gated:** the pass runs only on
Mike's explicit approval of Fable work at the time. The verdict goes below a
divider in this file (atelier `REVIEW.md` § *The lifecycle*).

## Provenance

This brief was written by a brief-writing sub-agent (Claude Opus 5.5) of
session `2be3482c`, on Mike's instruction of 2026-11-02, verbatim: *"Write
briefs for anything that needs a review in any of the repos, where a brief
is not ready"*. The item's own review line is conditional, and the launching
session judged that the built shell and service worker earn a pass anyway,
as first-of-kind work that fails silently. The sub-agent wrote none of the
delta, ran no review, and formed no finding. It wrote the held-back sibling
named below.

**Barred from taking this pass** (rule 4):

- the 2026-09-20 orchestrated queue run that built P0-B (branch
  `p0b-shell`, merged at `eb92b81`), and any worker it dispatched;
- this brief-writing sub-agent and its parent session.

**Tier: Fable, checked at selection.** A session not on Fable stops, and
neither takes the item on a lower tier nor proceeds hoping the pass is
accepted (`REVIEW.md` rule 4). An off-tier orchestrator, if any, forms no
finding, writes no severity, and is disclosed in the claim, the pointer and
the verdict. The verdict repeats this provenance.

## Subject

Built and merged; not run on a device. No later commit on `main` touches the
shell's files (checked at `c36eefb`); review them as they stand.

- **Delta:** `eb92b81^1..eb92b81^2`, six commits, merged at `eb92b81`:

  | Commit | What | Files |
  |---|---|---|
  | `1734c9f` | the icon set | `tools/gen_icons.py`, `site/icons/*`, `site/favicon.ico` |
  | `59614f8` | manifest and design tokens | `site/site.webmanifest`, `site/css/app.css` |
  | `271f620` | the shell | `site/index.html`, `site/js/app.js`, `dom.js`, `sw-register.js`, `sw-update.js`, `update-notice.js` |
  | `a4a3fad` | the service worker | `site/sw.js` |
  | `4e7cde4` | the lockstep rules | `docs/ARCHITECTURE.md` § *App shell & service worker (lockstep rules)* |
  | `12da5f0` | an a11y fix | `site/index.html` |

- **Read each commit body-free:** from the primary checkout,
  `/usr/bin/python3 ../atelier/tools/coldsweep.py --commit <sha>`. Plain
  `git show` is barred until phase 2: it prints the body ahead of the diff,
  and reading is atomic (`REVIEW.md` rule 1).
- **The pattern it ports:** Faves' ADR 0015 (split-version precache), named
  by `docs/decisions/2026-08-08-0452-pmtiles-in-opfs.md`. Faves is a sibling
  public repo; read its ADR there if it is checked out beside this one.
- **Intent records** (phase 2): the P0-B item
  `docs/roadmap/010-v1-committed-spine/012-p0-app-shell-and-service-worker.md`
  (its *Built* paragraph is the builder's own account), ADR
  `2026-08-08-0452`, `docs/WORKPLAN.md` Phase 0, and this repo's
  `CLAUDE.md` hard constraints (offline-primary, zero build step, mobile
  first, accessibility).

## Type

Built work that is also direction: the service worker's update path and its
cache rules are what every later feature ships through, and the lockstep
rules govern every later change to the shell. Whether any part is doctrine
by function (`REVIEW.md` rule 3) is for you to judge and state.

## Why it earns a review

A service worker is the one piece of a web app that can outlive its own
fix. If it caches the wrong thing, never takes an update, or takes a broken
one, an installed phone can sit on that state with no visible error, and in
this app's setting the phone may be days from a connection. It is the first
in this repo, and no test in `tests/` exercises it.

## Scope and the four lenses — run all four

Scope is the whole commitment: the item's intent and its *Accept when*, the
lockstep rules, the code, the generated icons and their generator, and
real-world behaviour, exercised in a real browser at 390 px and offline
wherever this machine allows. An impossibility claim states its grounds.

1. **Approach & assumptions** — the most important. Name the load-bearing
   assumptions yourself, as your first act, before reading the list below.
2. **Correctness & quality** — does each piece do what the item and the
   rules say; anything overclaimed, stubbed or silently cut.
3. **Completeness / harvest** — what the shell should have covered and did
   not; every mirror site of a rule (`REVIEW.md` V3).
4. **Security & privacy** — a must. The service worker's scope and what it
   will serve, cache poisoning, update integrity, DOM injection; checked
   against open catalogues (OWASP ASVS, OWASP Top 10), not memory. Aim
   `/security-review` at the JS delta by staging it in a scratch worktree of
   your own; weigh it as one input. Never run it over this file while the
   sibling below still exists.

Run the standing checklist (V1–V7) unasked.

## Load-bearing claims to attack

The work's own claims, in its own terms — a floor, never a fence. Damage
each with a probe or confirm it by re-driving it.

- **C1** — The service worker precaches the shell only, never a tile, and
  states that rule at its head.
- **C2** — Faves' split-version pattern is followed, so a shell update and
  a data-format change cannot be mistaken for one another; bumping
  `SHELL_VERSION` renames the cache.
- **C3** — An update is offered to the person by a banner, and a tap
  reloads cleanly.
- **C4** — The app installs and cold-starts to its shell with the radio
  off (the item's *Accept when*; recorded as not yet verified on a device).
- **C5** — No `innerHTML` anywhere in `site/`; the `el()` helper is
  text-safe by construction.
- **C6** — Contrast was computed: the worst pair is 4.32:1 against the 3:1
  non-text floor, and every text pair is at least 6.21:1.
- **C7** — The icons are real PNGs from a stdlib-only generator, and the
  committed set matches what the generator makes.
- **C8** — A single-page-fallback protection inherited from Faves was kept
  as insurance and is labelled unverified in the code.

## Grounding — re-run lines

Each run once by the brief-writer on 2026-11-02, from the root of a fresh
worktree of `origin/main` at `c36eefb`, Node v24.18.0. Re-run every one; a
line that no longer reproduces is a finding.

- `python3 tools/gen_icons.py --check` → no output, exit 0; the working
  tree unchanged afterwards (`git status --short` empty).
- `node --check` on `site/sw.js`, `site/js/sw-register.js`,
  `sw-update.js`, `update-notice.js`, `app.js`, `dom.js` → all exit 0.
- `nice -n 19 node --test` (pass no path) → 55 tests, 55 pass. None of them
  is about the shell.
- `python3 tools/check_links.py` → *"all local references resolve"*.

**Not run by the brief-writer, with grounds:** the shell in a browser. The
brief-writer ran no browser. Serve it with `python3 tools/serve.py` and
drive it in a headless or real browser at 390 px: install, offline
cold-start, a `SHELL_VERSION` bump and the update path, and an interrupted
install. Say which you could drive and which only a phone can.

## Rule 2 — what is barred until your findings are committed

"Committed" means durably written to your draft of this file.

- The commit message bodies (see *Subject*).
- The P0-B item's *Built* and *Why this stays open* paragraphs, and the
  session records (`docs/SESSIONS.md`, `docs/sessions/`), which carry the
  builder's account. If your onramp reads them, treat them as claims and
  disclose that you did.
- Prior verdicts in `docs/reviews/`; search with `coldsweep.py`, whose
  default bar excludes them.

## Non-goals

- The map: P0-C and P0-D own the style, the tiles and the storage seam.
- Mike's five-minute phone check, which closes the item; this pass does
  not replace it.

If a non-goal fences off a risk the work actually carries, say so as a
finding.

## The held-back sibling

`2026-11-02-1209-p0b-shell-service-worker-cold.deferred.md`, beside this
file, holds 7 entries. Open it only after your findings are durably written
here; then fold it in below your verdict and delete it (`REVIEW.md`
rule 1).
