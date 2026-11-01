# Cold pass — P0-B: the app shell and its service worker (rule 4, refs-only)

**Status:** ACT 1 WRITTEN — the cold pass ran on 2026-11-02 (Fable 5.1,
under Mike's 2026-11-02 drain approval); the verdict is below the divider.
Brief written 2026-11-02 1209 UTC for board item `010/012` (P0-B). Act 2
(the held sibling, judged against act 1) follows below act 1.

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

---

# Verdict — act 1 (cold pass, 2026-11-02)

**PASS WITH MAJORS — 2 MAJOR, 6 MINOR, 6 NOTE.** The shell and the service
worker do what the item says: in headless Chrome at 390 px the worker
installs, the shell cold-starts with the server dead, a `SHELL_VERSION`
bump raises the banner, a tap reloads onto the new cache with the old one
gone, an interrupted install self-heals, and "Not now" leaves the worker
waiting for the next cold start. Both MAJORs sit beside the code, not in
it: the lockstep rules that keep it working rest on human memory where the
sibling repo already had a machine check, and the item's own acceptance
procedure cannot pass on a phone as written. Verified means re-run here,
not read.

## Provenance (rule 4, V7)

Reviewer: Fable 5.1, tier checked at selection. Spawned by a headless
orchestrator session (Claude Opus 5.5) that was itself started by drain
session `c87c4ee0` (Opus 5.5). Both are rule-4 off-tier orchestrators:
they held the context partition (the `.deferred.md` sibling was removed
from this worktree before I started and is released only after act 1 is
committed), formed no finding and wrote no severity. Neither wrote the
brief or any of the delta, and neither is barred by it. I was not started
or instructed by the 2026-09-20 queue run that built P0-B (branch
`p0b-shell`, merged at `eb92b81`), by any worker it dispatched, or by the
brief-writing sub-agent of session `2be3482c` or its parent. The pass ran
under Mike's 2026-11-02 approval of Fable work. Worktree: a fresh checkout
of `origin/main` at `af5f3d1`; no commit by me.

## Reading discipline (rules 1–2), disclosed

- Read before findings: this brief; atelier `REVIEW.md`; this repo's
  `CLAUDE.md`, `docs/ARCHITECTURE.md` § lockstep rules, `docs/WORKPLAN.md`
  Phase 0, ADR `2026-08-08-0452`, `docs/DEPLOY.md`, `docs/DESIGN.md`
  (grep only); the P0-B item's intent, *Accept when*, review lines, claim
  line and the *Owed to Mike* steps. Every commit of the delta was read
  body-free with `coldsweep.py --commit`; every tree sweep ran under
  coldsweep's default bar (no `--include-barred`). The sibling public repo
  Faves (`../faves`) was read for ADR 0015, `site/_headers`, the fetch
  block of its `sw.js`, the names of its service-worker tests and
  `tools/validate.py`'s `check_version_bump`.
- Not read: `docs/SESSIONS.md`, `docs/sessions/`, `docs/ROADMAP-DONE.md`,
  every prior verdict in `docs/reviews/`, and the commit message bodies.
- One slip: a line-numbered 60-column listing of the item file, run to
  locate the barred paragraphs so I could skip them, showed me the first
  60 characters of each line of *Built* and *Why this stays open* before
  I excluded them. Nothing in those fragments goes beyond what claims
  C1–C8 already restate; no finding below rests on them.
- The `/security-review` sub-task read `SECURITY.md` and `CLAUDE.md` in a
  scratch worktree; it did not touch `docs/reviews/` or `docs/sessions/`.

## Lens 1 — the load-bearing assumptions, named first

Named before the code was opened; outcome after it was exercised.

| # | Assumption | Outcome |
|---|---|---|
| A1 | The registration scope actually covers the navigations that matter | Held: scope `http://localhost:8765/`, every path under it, `?query` and `/index.html` served offline |
| A2 | The precache list is complete and exact, and install is all-or-nothing | Held for completeness (18 entries + sentinel, every resource `cache-storage` offline); not exact — two entries nothing loads (F5) |
| A3 | A hand-kept list drifts, so something mechanical must catch the drift | **Fails**: the rules say it is a human check; the sibling has the tool (F1) |
| A4 | The update path cannot wedge: no stuck `waiting`, no reload loop | Held: Refresh reloads once; "Not now" leaves `waiting`; next cold start activates |
| A5 | Activate purges old caches without touching data caches | Held today; `caches.keys()` minus the keep-set is deleted, and the vendored MapLibre makes no Cache API call (grep: 0 hits in all three `.mjs` files), so nothing else writes a cache yet |
| A6 | Offline navigation falls back sanely | Held for the shell; a deep link offline is a browser error page (F9) |
| A7 | Re-precaching cannot read stale bytes from the HTTP cache | Held in code (`cache: "reload"`); the first-visit half is open (F6) |
| A8 | The dev server speaks the right MIME types | Held: `text/javascript`, `application/manifest+json` |
| A9 | The manifest is installable and `start_url` sits inside scope | Held: `Page.getAppManifest` no errors; `getInstallabilityErrors` empty |
| A10 | Everything is relative, so a sub-path or new origin would not break it | Held: no root-absolute URL in `site/`; `DEPLOY.md` relies on the same fact |
| A11 | No cross-origin or runtime response ever enters the cache | Held: the only `cache.put` is at install over the static list |
| A12 | The banner is announced and usable one-handed in gloves | Held for announcement (`role=status`, `aria-live=polite`); layout fails at 390 px (F3) |
| A13 | The icon generator is deterministic across machines | Held on two Pythons here; byte-exact `--check` is fragile by design (F12) |
| A14 | The acceptance procedure the item hands Mike can pass | **Fails** (F2) |

## Claims C1–C8

| Claim | Result |
|---|---|
| C1 shell only, never a tile, rule at the head | Held. `SHELL` holds 17 shell paths; the head comment states the rule; see A5 |
| C2 split-version pattern; a bump renames the cache | Held: `.1` → `.2` produced two READY caches side by side, the old deleted on activate. Caveat: a `sw.js` edit with no bump still raises the banner and delivers the old shell (F1) |
| C3 banner, tap reloads cleanly | Held (text flips to "Refreshing…", one reload, new tagline, one cache). Layout defect at 390 px (F3) |
| C4 installs and cold-starts with the radio off | Half-run: cold start with the server killed held in headless Chrome (navigation and every resource `cache-storage`). Home-screen install, standalone launch and flight mode need a phone — NOT RUN; and F2 says the written procedure cannot do it |
| C5 no `innerHTML`; `el()` text-safe by construction | Letter held (grep of `site/` minus `vendor/`: zero uses). "By construction" is an overclaim (F7) |
| C6 contrast computed; worst 4.32:1, text ≥ 6.21:1 | Figures reproduce (4.32 focus/bg light; 6.21 accent-on/accent light). The one UI boundary in the shell is outside the computation (F4) |
| C7 real PNGs from a stdlib generator, set matches | Held: every PNG parses with valid CRCs, 8-bit RGBA, opaque, glyph inside the 80 % safe zone; the ICO is a well-formed single 32 px PNG entry; `--check` passes on Python 3.9.6 and 3.14.6 |
| C8 Pages single-page-fallback guard kept, labelled unverified | Held: `servedAsHtmlStandIn` refuses a non-HTML extension answered as HTML, accepts `./` and `index.html`, handles `?v=1` and upper-case extensions, passes a missing content-type; every non-HTML `SHELL` entry is inside its extension list (VM probe, below) |

## Rule 3 — what here is doctrine

The lockstep rules in `docs/ARCHITECTURE.md` govern every future edit under
`site/` and are doctrine by function. F1 and F5 (and F6's hosting rule) are
therefore Mike's to decide, not the author's: the author of the rules is
the 2026-09-20 queue-run session; the principal is distinct, so rule 3
applies in full. The code itself is ordinary code; its findings take the
normal `[fixed]`/`[backlog]`/`[rejected]` path.

## Findings

### MAJOR

**F1 — The lockstep rules have no machine floor, and the port dropped the
one the sibling already had.** `docs/ARCHITECTURE.md` says a `sw.js` that
drifts from reality "is a human/review check, not a tool one", and that a
missed bump leaves "no error and no visible sign anything is wrong". Both
halves are wrong in a way that matters. Re-driven: appending a comment to
`sw.js` and editing `index.html` with no bump (phase P5) installs a new
worker in milliseconds (the READY sentinel short-circuits `ensureCache`),
raises *"A newer version of tūhura is ready."*, and the tap reloads the old
shell — the one visible sign is a banner that is false. And it is a tool
check: `../faves/tests/sw-versioning.test.js` asserts "every shipped module
is precached — no module may be missing from SHELL", that install does not
`skipWaiting`, and that activate keeps exactly the current caches; this
repo's `tests/` has nothing for the shell and `.atelier-floor.json` carries
one local check (`vendor`) where a second would register. Rule 3: Mike
decides. Recommendation: (a) a `node --test` shape test over `site/sw.js`
— `SHELL` equals the asset graph of `index.html` plus its `import` closure
plus the manifest's icons, no `.pmtiles`/tile/style/glyph path in `SHELL`,
no `skipWaiting` in install, activate's keep-set is exactly `SHELL_CACHE`;
(b) a local floor check that blocks a staged change to any file in that
graph when the `SHELL_VERSION` line of `sw.js` is unchanged. The headless
driver used for this pass (Chrome over the DevTools protocol, ~20 s,
Node 24 with no dependency) proves P1–P5 end to end and is worth adopting
as `tools/` script rather than leaving as reviewer scratch.

**F2 — The item's acceptance procedure cannot pass on a phone as
written.** Steps 1–3 and 5 of *Owed to Mike* run the phone against
`python3 tools/serve.py`'s Wi-Fi URL: plain HTTP from a LAN address, which
is not a secure context, so `navigator.serviceWorker` is absent, nothing
registers, no browser offers an install, and flight mode shows an error
page. `tools/serve.py` prints this itself (lines 87–89: *"the
offline/installable PWA only works on localhost or HTTPS, so over Wi-Fi the
phone shows the site but not offline mode"*). The item has sat "owed to a
human on a device" since 2026-09-20 behind a procedure that would read as
the shell failing. The brief lists the phone check as a non-goal; this
finding is about the procedure, which the non-goal fences off. Options for
Mike: (a) run the check against the Pages deploy over HTTPS —
`docs/DEPLOY.md` names it live, `sw.js` line 76 says no live deploy exists;
I did not touch the live host (barred), so which is true is unverified
here; (b) Android only: `adb reverse tcp:8080 tcp:8080` and open
`http://localhost:8080` on the phone; (c) iOS needs TLS with a certificate
the phone trusts. Recommend (a) and rewrite the five steps to name the
HTTPS origin; whichever is chosen, `serve.py`'s note and the item's steps
must agree (V5).

### MINOR

**F3 — At 390 px the banner's two buttons stack flush with no gap.**
`update-notice.js` wraps them in `.update-notice-actions`, which no CSS
rule styles, so inside the banner's flex row the two `inline-flex` buttons
wrap vertically: Refresh at y 731 and Not now at y 775, both 44 px tall,
0 px apart, the text squeezed into a 2-line column (screenshot taken).
Opposite actions touching is the fat-finger case the gloves-first rule
exists for. Recommend `.update-notice-actions { display: flex; gap:
0.5rem; flex-wrap: wrap }` and letting the banner go column-wise under
34 rem; re-measure after.

**F4 — The only UI boundary in the shell is below the 3:1 floor in dark
mode, and C6 does not count it.** `.btn-quiet` ("Not now") is transparent
with `border-color: var(--border)`; on the banner's `--surface` that is
3.68:1 light but **1.51:1 dark** (1.67:1 on `--bg`). The CSS calls
`--border` "decorative only" and the comment's "~2.9:1 on --bg" is 3.38:1
by computation. SC 1.4.11 lets a text-identified control carry no boundary
at all, so whether this fails is a reading for Mike; a boundary that is
drawn but near-invisible is the worse of the two. Recommend a control
border token at ≥ 3:1 in both themes (dark: `--muted` 8.28:1 on surface
works) and adding the pair to the computed table.

**F5 — The lockstep rule text disagrees with the code and with the main
branch's own history.** Rule 2 says `SHELL` "must list exactly the files
`site/index.html` loads or imports"; `favicon-16.png` and `favicon-32.png`
are in `SHELL` and referenced by nothing in `site/` (not the HTML, not the
manifest), so the rule's first instance breaks it; the three manifest icons
are loaded by the manifest, not the HTML, so the rule as worded excludes
files that must be there. Rule 1 says "any non-comment edit under `site/`"
bumps `SHELL_VERSION`; three later commits on `main` (`0743e5b` vendoring
MapLibre, `b0be830` and `21f48a6` the storage seam) edited under `site/`
with no bump — correctly, since nothing in the shell loads them — so the
rule is already unobserved and over-broad. `sw.js` line 18 says "eleven
files"; `SHELL` has 17. Rule 3: Mike decides. Recommend rewording both
rules to the shell's asset graph (the HTML, its import closure, the
manifest's icons), and either linking the two orphan favicons from the
head or dropping them from `SHELL` and the generator.

**F6 — No `site/_headers` and no Content-Security-Policy before the first
deploy** (lens 4; severity low; defence in depth with one known incident
behind it). `sw.js` lines 68–77 carry `cache: "reload"` as an unmeasured
inheritance. `../faves/site/_headers` records why it is needed: Pages
served `js/*` with `max-age=14400`, a bump renamed the cache and the
install refilled it from the previous deploy. `cache: "reload"` protects an
installed phone; it does not protect a first visit landing between a
deploy and the worker update, which is what the headers file is for. The
HTML also sets no CSP; the OWASP CSP cheat sheet confirms a `<meta
http-equiv>` policy works except for framing protections, sandboxing and
the reporting endpoint, which need the header. Recurrence prevention: add
`site/_headers` (`max-age=0, must-revalidate` on every `SHELL` path and
`sw.js`) and a `default-src 'self'` policy in the same commit as the first
deploy, and extend F1's shape test to assert `_headers` covers `SHELL`.

**F7 — `el()` is text-safe by convention, not by construction** (lens 4,
XSS class; no exploit today — every string is a literal). The property
branch `node[k] = v` sets whatever key it is given: `innerHTML`,
`outerHTML`, `srcdoc`, an `on*` handler. `dom.js` and `update-notice.js`
both say "by construction"; C5 repeats it. `role` also goes through that
branch and relies on ARIA reflection (works in Chrome — the banner's
`role=status` was read back from the DOM — Safari ≥ 12.1, Firefox ≥ 119).
Recurrence prevention: have `el()` throw on a short denylist (`innerHTML`,
`outerHTML`, `srcdoc`, keys starting `on`) and route `role` through
`setAttribute`; add a `node --test` for it; and a one-line check in
`tests/` that `site/` outside `vendor/` contains no `innerHTML`. Or reword
the three claims to "by convention".

**F8 — The update-flow logic was built to be tested and has no tests.**
`sw-update.js` says it was split out so the rules "could be run under
`node --test`"; the port took the code "verbatim" and left behind
`../faves/tests/sw-update.test.js` (nine cases: resume detection, first
install is not news, throttle, backwards clock, reload guard, no reload
loop) and `sw-precache-guard.test.js` (guard coverage of every `SHELL`
entry, `requireAsset` on every install fetch, the two fetch modes). My VM
probe of the guard passed on eight cases, so porting is an hour, not a
design. `node --test` today: 55 tests, none about the shell.

### NOTE

**F9 — The fetch handler's comment does not describe the code.** "Anything
not in the shell falls straight through to the network, untouched by this
worker" — every same-origin GET goes through `respondWith(cacheFirst())`
(a cache lookup, then `fetchClean`). Verified: `/does-not-exist.txt` came
back 404 through the worker. A future same-origin range request for a
download would also be proxied. Either early-return for paths outside
`SHELL` or fix the comment. Two adjacent facts, no action needed today: an
offline deep link (`/deep/link`) is the browser's error page — fine for a
single-page shell until routes exist; and `fetchClean` on an opaque
(status 0) response would throw rather than pass it through.

**F10 — Comment drift, one cluster.** `app.css` lines 5–7 say the contrast
numbers "are in docs/ARCHITECTURE.md's lockstep section" — they are not;
lines 274–277 describe a banner entrance "added in JS via a class" — no
class or animation exists; `gen_icons.py` lines 40–41 name `--bg-dark` /
`--accent-dark`, tokens the CSS does not have; `ARCHITECTURE.md` says the
`--focus` token is encoded in `gen_icons.py` — only `BG` and `FG` are;
`sw.js` line 42 says the sentinel is "never fetched by the app" — true, but
a page `fetch("/__cache_ready__")` is served `200 ok` from the cache.

**F11 — Manifest and icon-link details.** `purpose: "any maskable"` on one
asset is discouraged by Chrome's install guidance: the glyph covers about
17 % of the tile, so the "any" rendering is mostly dark square; no `id`
field; `<link rel="icon" href="favicon.ico" sizes="any">` describes a
single 32 px ICO (`sizes="32x32"`). The icons themselves are sound (C7).

**F12 — `gen_icons.py --check` is byte-exact**, so it depends on zlib
emitting identical bytes across builds (held on Python 3.9.6 and 3.14.6
here); a decode-and-compare-pixels check would be portable. Its help says
"regenerate into a temp dir" but it writes `site/favicon.check` beside the
real file and unlinks it; the SVG template is duplicated between
`write_svg` and the check branch (V4).

**F13 — A failed install is silent to developers too.** With one asset
missing (phase P4) the new cache was left at 10 entries without READY, no
banner, the page on the old worker — the designed outcome — and nothing in
the console. A `console.warn` when `installing.state` reaches `redundant`
costs one line and is the only signal a developer gets.

**F14 — Record slip, not the delta.** The item's claim line reads
`CLAIMED 2026-11-01T15:26Z`, a day before the brief it claims (2026-11-02
1209 UTC). Correct it in the fold-in commit.

## Lens 4 — security & privacy

Design altitude: the shell collects nothing, sends nothing, and holds no
user data yet; the only trust surface is the service worker's cache, which
is written once at install from a static same-origin list and never at
runtime, so a user-driven navigation cannot poison it; cross-origin and
non-GET requests are not intercepted; `SKIP_WAITING` is reachable only
from same-origin clients and its worst effect is a guarded reload. Code
altitude: no `innerHTML`, no `eval`, no third-party script, no inline
script; the gaps are F6 (headers and CSP) and F7 (the helper's claim).
`/security-review` was aimed at the full JS/HTML/manifest/Python delta,
staged in a scratch worktree of my own (the landed-delta case): zero
findings at its bar, twelve candidates examined and rejected with grounds
(cache poisoning, `SKIP_WAITING`, redirect laundering, scope, the
sentinel, `ignoreSearch`, the banner DOM, the Pages fallback, missing CSP,
the generator, logging, offline navigation); weighed as one input. Open
catalogues, read 2026-11-02 rather than recalled: OWASP Top 10:2025 —
F6 sits under A02 *Security Misconfiguration*, F7's class under A05
*Injection*, and the update path's integrity under A08 *Software or Data
Integrity Failures* (answered by the install-time guard, C8, and open at
the hosting layer, F6); the OWASP CSP cheat sheet for F6's meta-tag
limits.

## Standing checklist V1–V7

- **V1** no claim stronger than its evidence — F1 ("no visible sign"; "not
  a tool one"), F7 ("by construction"), F10.
- **V2** re-run every recorded proof — all four grounding lines reproduce
  (`--check` clean on two Pythons, tree clean; six `node --check` exit 0;
  55/55; "all local references resolve"); `vendor_check.py` also clean.
- **V3** mirror sites — the rules have one declared home and `README.md`,
  `CONTRIBUTING.md` and `CLAUDE.md` point at it rather than restate it:
  clean. The sibling's tests and `_headers` are the mirror the port did
  not sweep (F1, F6, F8).
- **V4** one fact, one home — the palette is three places by design and
  the rule says so; the SVG template is two places (F12).
- **V5** no internal contradiction — F2 (item steps vs `serve.py`), F5
  (rule vs `SHELL` vs history), F10.
- **V6** security on every review — above.
- **V7** provenance — above, and in the brief.

## Not run, with grounds

Home-screen install, standalone launch, flight-mode relaunch and the
macron on a real home screen (phone only; and see F2). Safari and
WKWebView (no iOS device or simulator in this pass). Response headers of
the Pages deploy (a live system, barred). Light-theme screenshots were
taken by emulation; the headless default rendered dark.

## Evidence

- Grounding: `python3 tools/gen_icons.py --check` (3.14.6 and 3.9.6) → no
  output, exit 0, tree unchanged; `node --check` × 6 → 0; `nice -n 19 node
  --test` → 55 pass; `tools/check_links.py` → "all local references
  resolve"; `tools/vendor_check.py` → holds.
- Browser: Google Chrome 156.0.8078.79 `--headless=new`, driven over the
  DevTools protocol from Node 24.18.0, viewport 390×844 at 2×, against a
  scratch copy of `site/` served by `tools/serve.py` on `localhost:8765`.
  P1 first visit: controller set, cache `tuhura-shell-2026-09-20.1` with
  18 entries + READY, manifest parsed with no errors, installability
  errors none, landmarks banner/main "Map"/contentinfo, first Tab lands on
  the skip link, `sw.js` served `no-store` as `text/javascript`. P2 server
  killed: `/`, `/?region=…`, `/index.html` render from `cache-storage`;
  `/deep/link` is a browser error; `registration.update()` rejects and is
  swallowed. P3 bump to `.2`: banner within 15 s, roles read back, two
  Tabs to Refresh, tap → "Refreshing…" → reload → tagline `.2`, only the
  `.2` cache remains. P4 bump to `.3` with `favicon-16.png` removed: `.3`
  cache at 10 entries, no READY, no banner, page on `.2`; asset restored:
  rebuilt, banner; Not now: banner gone, worker waiting; last tab closed
  and reopened: `.3` active, `.2` gone. P5 comment-only `sw.js` edit, no
  bump: banner shown, caches unchanged, tagline unchanged.
- Guard probe (Node `vm`, `sw.js` evaluated with a stub `self`): css as
  `text/html` → refused; css as `text/css`, `./`, `index.html`, missing
  content-type → accepted; `?v=1`, upper-case extension, `.webmanifest` as
  HTML → refused; `requireAsset` throws on 404 and on the HTML stand-in;
  `message` ignores junk and honours `SKIP_WAITING`.
- Contrast (WCAG relative luminance, computed): light text/bg 15.18,
  muted/bg 7.76, accent/bg 5.70, accent-on/accent 6.21, focus/bg 4.32,
  focus/surface 4.71, border/bg 3.38, border/surface 3.68; dark text/bg
  17.53, muted/bg 9.21, accent/bg 11.05, accent-on/accent 9.39, focus/bg
  8.52, focus/surface 7.66, border/bg 1.67, border/surface 1.51.
- Icons: all six PNGs IHDR/IDAT/IEND, 8-bit RGBA, CRCs valid, opaque, zero
  glyph pixels outside the 0.4-radius safe circle; ICO header type 1,
  count 1, 32×32, PNG payload at offset 22, sizes consistent.
- Cleanup: server and browser stopped; scratch worktree removed; the
  review worktree holds only this file's edit beside the pre-existing
  sibling deletion.
