# 2026-09-20 · 1051 UTC · Orchestrated queue run — Phase 0 starts shipping

*An orchestrated queue run (atelier `CONCURRENCY.md` § Orchestrated queue
runs). Orchestrator on Opus 5, tier stated at open and not put to the
principal, per the 2026-09-19 ruling. Four workers dispatched: one Fable
reviewer on the mandated cold-pass tier, three Sonnet build/analysis
workers. Stop condition: **everything left is blocked** — see the close.*

## The pin was stale, and the staleness was self-concealing

The pin said `431f1f7`. Atelier had moved **288 commits**, not the ~45 a
first glance suggested. Worse, the inlined floor block — which this repo
asserts is copied verbatim *"so it binds even if atelier is never read"* —
had drifted from its canonical source in atelier's `PROPAGATION.md`. It
was not a stale SHA over current text; the text itself was wrong.

**Two whole bullets were missing.** *Asking* (2026-08-19): any question,
decision or ruling goes in the harness's structured device with real
options carrying pros, cons, impacts, risks and costs, plus a
recommendation — and the account must **reach** the principal before the
choice is put, which matters here because he often reads in a mode that
hides mid-turn text. *Doctrine problems point up* (2026-08-24): a rule
that is wrong, unworkable or missing is reported to atelier, never
silently worked around, because the workaround destroys the only evidence
the house would get.

**Three bullets were reworded, two of them operative.** Concurrency now
requires reading `git status` **first** and stopping on unexpected dirty
state rather than blind-autostashing, and reading the **whole** staged
index (`git diff --cached`) rather than hunk headers — the half a
hunk-by-hunk read misses is the paths you did not stage. Source & drift
now fetches and diffs against `origin/main` rather than the local
checkout's `HEAD`.

**That last one is why this went unnoticed.** Our old drift command read a
sibling clone's local `HEAD`; an unfetched or differently-parked clone
reports no drift, indefinitely. The check that was supposed to catch
staleness was the thing concealing it.

**Enforcement was never stale, and that is the trap.** `.github/workflows/`
calls atelier's floor at `@main` and the hook resolves `hooks.atelierTools`
live, so both planes had been running atelier's *current* registry against
this repo all along. The pin governs the doctrine a session **reads**, not
the checks it **passes** — so a stale pin here is silent rather than noisy.
Pinned to `e9a6aae` (`origin/main` at 2026-09-20-1100Z; atelier had a live
session committing to it, so this is a point-in-time read, not a standing
fact).

## Phase 0 split into six claimable leaves

Phase 0 bundled two different kinds of work behind one checkbox: three
leaves needing nothing from outside the project, and three blocked on
things only Mike can supply. Bundled, the blockers were invisible at the
session-start index read, and any session claiming "Phase 0" swallowed the
buildable and the blocked together. A bundled line is also claimed as a
unit and serialises sessions that could have run in parallel
(`CONCURRENCY.md` § Claiming work — fan-out needs the leaves to exist as
their own lines). The parent went `[x]` superseded-by-split, the
disposition the marine item already took under R1.

**P0-A — vendored and gated. DONE.** maplibre-gl 6.10.0 and pmtiles 4.5.0
in `site/vendor/`, integrity verified against the registry's own sha512
rather than trusted. `NOTICE` carries both upstream licence texts in full;
maplibre's turned out to bundle MIT glfx.js and further BSD-3-Clause code,
so "BSD-3-Clause" alone would have been a false summary.

The finding worth carrying: **pmtiles' declared ESM entry is unusable
here.** `dist/esm/index.js` holds a bare `import … from "fflate"` that
resolves only under a bundler or import map — neither of which this repo
has, and vendoring fflate would be a second, ADR-uncovered dependency. The
package's own documented answer, the self-contained `dist/pmtiles.js`
global build, is vendored instead, and `tools/vendor-manifest.json` says
why so a future re-vendor does not "fix" it back.

**A guard that was not guarding, caught at merge.** The same work added
`.secretscanignore` and `.leakscanignore` over `site/vendor/`, `NOTICE`
and the manifest. The suppressions were **tested, not accepted**: with them
removed, `secretscan` reds on npm sha512 hashes as high entropy,
`leakscan` reds on a sha256 substring matching the NZ phone shape, and
`secretscan` reds on a minified maplibre identifier — all genuine false
positives. But the net effect was to remove scanning from those paths and
replace it with a pin that ran only when someone remembered.
`tools/vendor_check.py` is now declared in `.atelier-floor.json`'s `local`
seam and runs in both planes. Proven rather than assumed: a one-byte edit
to a vendored file reds the floor and names the drift.

**P0-B — built, and deliberately not ticked.** Shell, manifest, generated
icon set (`tools/gen_icons.py`, a stdlib-only PNG writer — no Pillow or
ImageMagick on the machine, so it wrote real PNGs rather than shipping grey
placeholders), split-version service worker on Faves ADR 0015, and the
lockstep rules now stated in `docs/ARCHITECTURE.md` where `CLAUDE.md` says
they live. Contrast ratios computed, not eyeballed: worst pair 4.32:1
against AA's 3:1 non-text floor, every text pair ≥ 6.21:1. No `innerHTML`
anywhere in `site/`; `sw.js` precaches the shell only and states the
tiles-never-in-Cache-API rule at its head.

The item stays `[ ] 🎯` because its own *Accept when* is "installs to a
phone and cold-starts with the radio off", and nothing in this session had
a browser. Done means verified. A five-step device checklist is on the item.

**P0-D — the browser-free half only.** The claim said so at claim time
rather than after: OPFS is a browser API, so a headless session can write
the backend and verify almost none of it. Delivered: the seam's shape
(ADR `2026-09-20-1116`), its OPFS backend and extracted pure logic under
`site/js/storage/`, and `tools/make_fixture_pmtiles.py` — a spec-valid
PMTiles v3 generator written against the **fetched** spec at a recorded
revision, so tests need neither a multi-gigabyte LINZ download nor the
`pmtiles` CLI (an unapproved tool install, deliberately not made).

The seam's read half duck-types the vendored library's own `Source`
contract, so an `ArchiveHandle` goes straight to `new pmtiles.PMTiles(h)`
with no adapter — the difference between a seam and a wrapper. 29 tests
pass, one of them real independent verification: it loads the *exact
vendored bytes* via `vm.runInContext` and has the library parse the
generated fixture, rather than a second parser that could share the
generator's bugs. `opfs-archive-store.js` itself carries no tests and is
unverified by construction; the item says so rather than implying coverage.

## The cold pass — PASS-WITH-FINDINGS

The queued rule-4 review of the session-log split was taken and closed.
Reviewer on Fable, the named tier, formed every finding and severity;
this orchestrator (Opus, off-tier) held the records and formed none — the
reviewer-plus-orchestrator split Mike ruled on 2026-08-17, disclosed at
the claim, in the pointer and in the verdict's provenance.

0 MAJOR · 1 MODERATE · 3 minor · 4 notes. The split is sound: what
`RECORD.md` sanctions, provably lossless (all ten entries re-checked by
script, not read), scanning clean for the right reason. **F1 (MODERATE)**
is the one that matters — the ADR grounded its case on "351 lines across
eleven entries, 30–48 lines each"; the file held **ten** entries of
**10–65** lines, only five inside the stated band. The conclusion survives
on its qualitative ground, but the briefing rested on numbers nobody had
counted. F1–F4 are Mike's under rule 3 and are carried on the closed board
item rather than left in a review file nobody reopens.

**The pointer itself was unsafe, and that is a house defect.** It read
`Delta: 7630fc2..HEAD`. `HEAD` is symbolic: by take-time the bound had
grown four commits past the landing, and the pass reviewed a pin-bump
commit its author never queued. The failure that did **not** fire, only
because the taker noticed, is a chain session reading `..HEAD` literally
and reviewing its own commits — precisely the independence rule 4 exists
to protect. `pointerscan` called the pointer *"refs-only and current"*,
because it lints grammar and has no opinion on whether a bound resolves.

## Handed up to atelier — PR #86

Two findings filed, not fixed, under the newly-restored point-up duty:
**320/360** (the moving-bound defect above) and **320/370** (the split
session log's residual is half solved already — `linkscan` covers the
dangling-pointer direction; what is unguarded is the quiet direction, an
orphan detail file with no index line, invisible to every session that
reads only the index). Filed in atelier rather than built here because the
shape is `RECORD.md`'s and every adopter inherits the gap.

The seam's own `⏳` pointer spells its bound as *"the commit that adds this
file"* — the fix proposed upstream, exercised here first rather than kept
as a private deviation.

## Corrections to the record this session owes

**F4 from the cold pass, discharged here.** The 2026-08-17 session's record
omits its own last commit, `4f52ad2`, which bumped the pin `0af3006` →
`431f1f7` and added the BS1 paragraph to the board preamble; the index line
and that session's Phase 3 entry record only `eef38be` → `0af3006` and
carry no verification line. Appended here as a dated entry rather than by
editing that session's record, which is append-only.

**A false red this orchestrator caused, recorded so the next one does not.**
`node --test tests/` makes Node 24 resolve the directory as a module and
die, printing as a failing suite. A worker reported 29/29 green; verifying
it, this orchestrator got a red twice and nearly reported the worker wrong.
The correct invocation takes **no path**. Now in both dev-loop blocks.

## Close

**Stop condition: everything left is blocked.** P0-B needs a phone, P0-C
needs a credential decision, P0-E needs a Mac with Xcode, P0-F needs real
devices and seven calendar days of dormancy, P0-D's runtime half needs a
browser, and the new `⏳` cannot be taken by the run that authored the
delta. Starting Phase 1 would breach the workplan's risk-first ordering
while Phase 0's acceptance is unmet.

All worktrees removed, all branches merged and deleted, everything pushed.
Owed and visible on the board: four 🎯 items for Mike, one `⏳` for a
non-author on Fable, and PR #86 awaiting atelier's consideration.
