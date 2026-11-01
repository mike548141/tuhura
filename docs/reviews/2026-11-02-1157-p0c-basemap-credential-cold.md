# Cold pass — P0-C: where the basemap credential lives (design-time, refs-only)

**Status:** ACT 1 WRITTEN 2026-11-02 — the cold pass ran on Fable 5.1 and
its verdict is below the divider; act 2 (the held-back sibling, checked
against act 1) follows once the orchestrator releases it. Brief written
2026-11-02 1157 UTC for board item `010/013` (P0-C), whose line read
*"review: queued"*.
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

---

# Verdict — act 1 (cold pass, 2026-11-02)

**PASS WITH MAJORS — 2 MAJOR, 5 MINOR, 5 NOTE.** The item's conclusion
survives: the shipped product should carry no LINZ credential. The item's
*framing* does not: it classifies the credential wrongly, and so puts the
wrong question to Mike (F1); and the offline path it describes is one
archive where the published style needs two sources (F2). Nothing here
says build differently; it says decide on corrected facts. Rule 3: the
item's last sentence (*"Settle this before wiring any key into `site/`"*)
is a standing instruction to future sessions and so doctrine by function,
narrowly; the item already marks both actions 🎯, so every finding below
is counsel to Mike's decision, and nothing is applied by this pass.

## Provenance (rule 4, V7)

Reviewer: Fable 5.1, tier checked at selection. Spawned by a headless
orchestrator session (Claude Opus 5.5) that was itself started by drain
session `c87c4ee0` (Opus 5.5). Both are rule-4 off-tier orchestrators:
they hold the context partition, form no finding and write no severity.
The reviewer was not started or instructed by any barred session: not the
2026-09-20 queue run that landed `828b0a2` or its workers, and not session
`2be3482c` or its brief-writing sub-agent. The pass ran under Mike's drain
approval of 2026-11-02 for Fable-dependent work, including cold reviews.

Disclosures. (a) The brief's `../atelier` did not resolve from the
review worktree; `coldsweep.py` and `datescan.py` were run from the
atelier checkout by absolute path, with `--root .` at this repo's root.
(b) The brief was read in full before the reviewer named its own
assumptions, on the orchestrator's instruction; the list below was then
written against the item text and is not blind to the brief's C1–C7.
(c) Not read: `docs/SESSIONS.md`, `docs/sessions/`, `docs/ROADMAP-DONE.md`,
any file under `docs/reviews/` other than this brief, the landing commit's
message body, and the `.deferred.md` sibling (held by the orchestrator).
(d) Beyond LINZ's published terms and documentation, the reviewer read
LINZ's open-source tiler and style configuration on GitHub, which is the
published behaviour behind the documentation; cited per finding. No key
was minted, no account touched, no request carried a key.

## The reviewer's own load-bearing assumptions (lens 1, first act)

- **A1** The key gates every endpoint the online render needs. *False in
  part:* fonts and sprites are keyless (N1).
- **A2** The key is a secret in the ASVS sense. *False for Standard
  access; a public-by-design token for Developer access* (F1).
- **A3** "Public repo, no build step" is the right harm axis. *Wrong
  axis* (F6).
- **A4** The export endpoint exists, is on the free tier, and returns the
  whole tileset. *Confirmed in code; `topographic-v2` specifically
  unverified* (N2).
- **A5** Style, glyphs and sprites are redistributable. *Fonts are OFL /
  Apache; sprites' licence unverified; ADR 0546 process applies* (F5).
- **A6** `topographic-v2` is one vector tileset. *False: two sources*
  (F2).
- **A7** The self-hosted style must be rewritten. *Confirmed* (F2).
- **A8** Online render first is the cheapest proof. *Holds, and it needs
  no account* (F7).
- **A9** Two options is the whole option space. *No* (F1, options).
- **A10** The online path's privacy cost is unnamed. *Confirmed* (F3).
- **A11** Attribution must survive self-hosting. *Confirmed* (F5).
- **A12** The 2026-08-08 research row is the item's factual base and is
  dated. *Confirmed; partly overclaimed* (F4).

## Evidence base (public reads, all accessed 2026-11-02)

- **T1** LINZ Basemaps Terms of Use:
  `https://www.linz.govt.nz/guidance/data-service/linz-basemaps-guide/linz-basemaps-terms-use`.
  Clause 1: access *"for limited use without registration (Standard
  Access)"* and *"for unlimited reasonable use with registration
  (Developer Access)"*. Clause 4: *"Current limits are 1,000 tiles /
  minute and 1,000,000 tiles / month."* Clause 5: *"We track use of our
  APIs and may restrict use outside the current limits or any other
  unreasonable use (in our sole discretion)."* Clause 13: *"You are
  responsible for complying with licences applying to material on
  Basemaps, including attribution requirements."* Clauses 17–18:
  suspension on breach; *"We may also end our provision of Basemaps to
  everyone, or just to you, for any reason at any time."* Clause 20:
  terms may change, *"including introducing costs"*. The page carries no
  clause on API-key sharing, caching, bulk download or export, and no
  date or version.
- **T2** LINZ Basemaps documentation:
  `https://www.linz.govt.nz/data/linz-data/linz-basemaps/linz-basemaps-documentation`.
  Standard: *"LINZ Basemap APIs at this level do not require
  registration"*; *"A dynamic API key is allocated to you"*; *"Standard
  API keys expire after 90 days"*. Developer: *"Developers can request
  this access level by contacting us"*; *"Developer level access enables
  the allocation of static API keys which we can restrict to your
  nominated website"*; *"Developer keys do not expire"*. *"There is no
  charge for either access level."* *"LINZ Basemaps use open data,
  licensed for reuse under the Creative Commons 4.0 International
  licence."* *"Your product must always visibly show attribution and link
  to the LINZ Basemap custom attribution data and copyright text."*
- **T3** Technical documentation:
  `https://basemaps.linz.govt.nz/docs/user-guide/technical-documentation/`.
  Standard is *"designed for use of our APIs in internal GIS applications
  or web mapping tools"*; Developer supports *"public, high-volume web and
  mobile apps"*. *"All use of your API key is your responsibility, whether
  authorised or not."* *"Rate liming [sic] applies to all API clients, at
  the API token and IP address level."* 429 on excess. Rate-limit table:
  nominated-site restriction is Developer-only.
- **T4** Vector-tile usage page:
  `https://basemaps.linz.govt.nz/docs/user-guide/working-with-vector-tiles/usage/`.
  Templates: `/v1/styles/{tileset}.json?api={api_key}`,
  `/v1/tiles/{tileset}/{crs}/{z}/{x}/{y}.pbf?api={api_key}`,
  `/v1/export/{tileset}/{crs}.mbtiles?api={api_key}`. No glyph or sprite
  template; nothing on export size or limits; footer *"© CC BY 4.0 LINZ"*.
- **T5** LINZ's own MapLibre example
  (`https://basemaps.linz.govt.nz/docs/examples/maplibre.vector.3857/`)
  embeds a literal key in a public page.
- **T6** Published style
  `https://raw.githubusercontent.com/linz/basemaps-config/master/config/style/topographic-v2.json`:
  `sources` = `"LINZ Basemaps"` (`vector`,
  `/v1/tiles/topographic-v2/{tileMatrix}/tile.json`, attribution
  *"© 2022 Toitū Te Whenua - CC BY 4.0"*) and `"LINZ-Elevation-Hillshade"`
  (`raster-dem`,
  `/v1/tiles/elevation/{tileMatrix}/{z}/{x}/{y}.png?pipeline=terrain-rgb`);
  `glyphs` = `/v1/fonts/{fontstack}/{range}.pbf`; `sprite` =
  `/v1/sprites/topographic`. Font stacks used: Open Sans (Regular,
  Italic, Bold, Bold Italic, Medium, Light Italic) and Roboto (Light,
  Bold, Bold Italic, Italic, Black, Black Italic).
- **T7** Tiler source, `https://github.com/linz/basemaps`,
  `packages/lambda-tiler/src/routes/`: `tile.style.json.ts` prepends the
  host to relative URLs and appends `api` to tile URLs only — `glyphs`
  and `sprite` get no key; `fonts.ts` and `sprites.ts` make no key check;
  `export.tileset.ts` calls `Validate.apiKey(req)`, requires a
  single-layer tileset with a stored `.mbtiles` beside its `.tar.co`
  source, and returns `302` to a presigned S3 URL. `src/util/validate.ts`:
  format check plus a blocklist, no registry.
  `packages/shared/src/api.ts`: `newApiKey` = `'c' + ulid()` stored in
  `localStorage`; `isValidApiKey` accepts a `c` or `d` prefix whose
  remainder decodes as a ULID; the age check is commented out; the
  landing app regenerates its `c` key after about 30 days.
- **T8** Font licences: Open Sans — SIL Open Font License 1.1
  (`https://raw.githubusercontent.com/googlefonts/opensans/main/OFL.txt`);
  Roboto — OFL 1.1 for `googlefonts/roboto-3-classic`, Apache 2.0 for
  `googlefonts/roboto-2`. Which build LINZ's glyphs derive from is not
  published.
- **T9** OWASP ASVS 5.0.0 V13.3.1 (L2):
  `https://raw.githubusercontent.com/OWASP/ASVS/v5.0.0/5.0/en/0x22-V13-Configuration.md`
  — *"Secrets must not be included in application source code or
  included in build artifacts"*, scoped to *"backend secrets"*; 13.3.4 <!-- spellscan:allow: verbatim OWASP quote -->
  (L3) rotation. OWASP API Security Top 10 2023
  (`https://api-security.owasp.org/editions/2023/en/0x11-t10`): API4
  Unrestricted Resource Consumption, API8 Security Misconfiguration.

## Findings

### MAJOR

**F1 — The item mis-classifies the credential and so asks the wrong
question.** The item: *"an API key is a secret, and secrets are floor
... creating it is an account action and a credential"*; and C3, whether
LINZ issues *"deliberately-public, domain-restricted keys"*, is
*"unverified"*. LINZ's documents and code settle both (T1–T3, T7):

- A **Standard** key needs no registration, is minted in the requester's
  own browser (`'c' + ulid()`), is validated by format alone, is
  rate-limited per token *and* IP, and rots in 90 days. Nothing is
  granted by holding it that is not granted by generating a fresh one.
  It is a quota tag, not a secret; creating it is not an account action.
- A **Developer** key is the deliberately-public kind: registered by
  email, static, non-expiring, *"restrict[ed] to your nominated
  website"*, meant for *"public, high-volume web and mobile apps"*. LINZ
  itself embeds a key in a public example page (T5). C3's answer is
  **yes, at Developer tier**.

ASVS 13.3.1 bars *backend* secrets from source; a site-restricted public
token is the pattern browser basemap keys use, and its risk is not
confidentiality but **availability and liability**: a published key can
be burned by anyone (API4), the site restriction is a Referer check that
non-browser clients evade, and *"All use of your API key is your
responsibility"* (T3) with suspension on breach (T1 cl. 17). Embedding a
Developer key therefore risks the online path dying for every user at
once, and LINZ's view of the project — not a leaked secret.

So "where does the key live" is downstream of the question the item does
not ask: **does the shipped app ever fetch LINZ tiles at runtime?** If
no — the item's own insight — no key exists in the product and the
Standard key is a dev-session tool. If yes (an in-coverage preview before
a region download, say), the only honest options are a registered
Developer key published on purpose, or a per-device Standard key minted
at runtime exactly as LINZ's landing app does. The second is technically
open but is what T3 steers *away* from (*"internal ... tools"* vs
*"public ... apps"*), it fragments quota per device in a way LINZ may
call unreasonable (T1 cl. 5), and the token becomes a 30-to-90-day
per-device identifier sent to a third party (F3). A proxy (Cloudflare
Worker) holding the key is ruled out by ARCHITECTURE's *"no server-side
application logic"* and should be foreclosed on the record rather than
left unnamed.

**Owed ruling (Mike's), with recommendation.** (1) Treat a Standard key
as a quota token, not a floor secret: a session may mint one for the
online proof, never commits it (it rots and identifies the minter), and
records in the session log that it did. (2) Rule that v1 has **no
runtime LINZ tile path**: region choice and preview run off the national
base archive ARCHITECTURE already names as the ~1 GB floor. Then the
product carries no key and 🎯 1 shrinks to "a dev session mints one".
(3) Only if a runtime path is ever wanted, register Developer access
with site restriction and publish the key knowingly, accepting the
availability risk and recording it in ECONOMICS' tripwire table.
Recommendation: (1) and (2).

**F2 — The scoping insight's offline path is one archive; the style
needs two sources, and the second has no documented export.** The item:
*"once a PMTiles archive is built and self-hosted, the running app reads
tiles from OPFS, and glyphs and sprites can be vendored alongside the
style"*. The published `topographic-v2` style (T6) draws its hillshade
from a second, `raster-dem` source served through LINZ's
`pipeline=terrain-rgb` processing. The export route (T7) serves a stored
`.mbtiles` beside a `.tar.co` vector source; the elevation tileset is a
COG pipeline product and no export is documented for it (T4). So the
offline render is a **different map** — no hillshade — unless a second
archive is built from the LINZ 8 m DEM (LDS, CC-BY, courier-ordered for
full NZ per the research file) and the style's `LINZ-Elevation-Hillshade`
source repointed at it. The style also needs its `sources`, `glyphs` and
`sprite` URLs rewritten for self-hosting; the item does not say so.

Consequence for the credential question: none — the insight still holds,
no key is needed at runtime. Consequence for what rests on the item: P0-D
says *"Build one regional archive"* and *"generating the archive needs
the LINZ export endpoint (P0-C's key question)"*; Phase 0's accept-when
is *"renders the region"*; and the item's stated purpose is to prove
*"the style and the vendored renderer agree"* — a proof that transfers
to the offline map only if the offline map is the same style. The
hillshade gap would be discovered after the archive is built, which is
the moment this review exists to move. MAJOR for that reason, not for
the credential.

Owed: P0-D's text to name the second source and choose (hillshade from a
self-built terrain-RGB archive; or a v1 style without hillshade, said
plainly in the item and in ARCHITECTURE's basemap bullet, whose
*"8 m-DEM hillshade"* currently reads as included).

### MINOR

**F3 — The online path's privacy cost is unnamed, and SECURITY.md
contradicts itself about it.** Every pan of an online render sends tile
coordinates, the device IP and the key to LINZ, which *"track[s] use of
our APIs"* (T1 cl. 5). For a hunting and fishing app a viewport is a
location disclosure; under the per-device-key pattern the token is also
a persistent identifier. The item frames the decision as credential
exposure only; the stronger argument for its own insight is that the
offline path removes a third-party location egress, and the strongest
argument against any runtime tile path is the same. `SECURITY.md`
§ Privacy says *"no third-party requests"* and in the next sentence
*"Network access exists only to fetch map data and forecasts"* — map data
from LINZ is a third-party request (V5). Owed: name the egress in the
item's option analysis; reconcile SECURITY.md.

**F4 — "Terms explicitly permit local copies" overclaims.**
`ARCHITECTURE.md` (basemap bullet) and the research row both say it. The
Basemaps Terms of Use (T1) say nothing about copies, caching, bulk
download or export; what permits a local copy is the CC BY 4.0 licence on
the *data* (T2), with cl. 13 placing licence compliance on the user. The
Terms also let LINZ end the service or introduce costs at will (cl. 18,
20), so the export pipeline's continuity is at LINZ's discretion — a
tripwire ECONOMICS already owes a row for. V1. Owed: reword to "the data
is CC BY 4.0; the service terms are silent on copies and revocable".

**F5 — "Glyphs and sprites can be vendored" skips the house's own
process and the licences.** Glyph PBFs are font software: Open Sans is
OFL 1.1; Roboto is OFL 1.1 or Apache 2.0 depending on the build LINZ
derived from, which is unpublished (T8). OFL permits bundling *"provided
that each copy contains the above copyright notice and this license"*.
ADR 0546 says any vendored dependency gets its own ADR and a `NOTICE`
entry; `tools/vendor_check.py` pins `site/vendor/` bytes. The sprite
sheet is LINZ-authored under a licence the style file does not state.
And LINZ requires visible attribution linking to its copyright statement
and the Basemap's custom attribution text (T2) — offline, that text must
ship in the app, not be fetched from `/v1/attribution`. Owed: one ADR for
the style assets (style JSON, glyphs, sprites, attribution text) under
0546, with each licence verified and carried in `NOTICE`.

**F6 — C2 picks the wrong axis.** *"This repo is public and has no build
step, so an embedded key is published the moment it is committed"* is
true and beside the point: anything the client-side app uses at runtime
is handed to every user whatever the repo's visibility, and a private
repo with build-time injection would change nothing. The brief's *"Why
it earns a review"* has the same shape. The conclusion stands; the
reasoning should be corrected so no future session reasons that a build
step or a private mirror would make a runtime key safe. V1.

**F7 — "Blocked on Mike" overstates.** The online proof needs a Standard
key, which needs no registration (T2); the design question the item
defers to *"LINZ's own terms"* is answered by reading them, which this
pass has done. What remains Mike's is the ruling in F1, not a key. The
leaf's blocker line should say so, so the board's "ready to go" read is
honest (the Phase 0 parent split the leaves for exactly that reason).

### NOTE

**N1** Fonts and sprites are served without a key (T7): the key gates the
style JSON and tiles only. An online render could fetch LINZ glyphs and
sprites keylessly; offline wants them vendored regardless (F5).

**N2** Export is one request answered by a `302` to a presigned S3 URL
(T7); the research row's *"1M tiles/mo"* is a tile count and does not
bear on export. Whether `topographic-v2` has a stored `.mbtiles` to
export is unverified — probing it needs a key, which this pass did not
mint. The export is the whole tileset; P0-D's regional archive is a
`pmtiles extract` after `convert`.

**N3** Grounding re-run: `coldsweep -i 'api.?key'` → the same 4 hits
over 121 files, but **29** files barred, not the brief's 23 (review files
landed between `da5259e` and this worktree's HEAD); `vendor_check.py`
and `check_links.py` exit 0 with the quoted lines; the `--commit` line
prints subject, a one-file `+29` stat and the diff, no body. The brief's
*"unchanged since"* holds for the item's body; two stamps were appended
(`c36eefb`, `d83b367`).

**N4** Rotation: Standard keys expire at 90 days per docs and the landing
app regenerates at about 30 (T2, T7); a Standard key committed anywhere
rots. Developer keys never expire, so ASVS 13.3.4's rotation would be by
asking LINZ. Neither is a reason to commit one.

**N5** `ECONOMICS.md` owes a tripwire table naming *"the LINZ Basemaps
key tier"*; T1–T3 are its source facts (two tiers, no cost, revocable,
costs may be introduced).

## Lens 4 — security and privacy

Checked against ASVS 5.0 V13.3 and API Security Top 10 2023 (T9), not
memory. Threats enumerated at design altitude: (i) credential
confidentiality — moot for Standard keys, not the risk for Developer keys
(F1); (ii) resource consumption / quota burn of a published key leading
to suspension (API4, API8) — the real cost of embedding (F1); (iii)
location egress to a third party via the online tile path (F3); (iv)
supply-chain and licence integrity of vendored style assets (F5, under
the existing `vendor_check.py` floor). `/security-review`: discharged in
one line — there is no code in scope; the subject is a 29-line roadmap
item and the scanner's exclusions bar markdown, so a clean pass would be
definitionally empty.

## Standing checklist V1–V7

- **V1** F4, F6, F7 (claims stronger than their evidence).
- **V2** All four grounding lines re-run (N3); the item's *"unverified"*
  C3 verified (F1).
- **V3** Records that change under the recommended ruling: the item
  (blocker line, options, F2's second source); P0-D `014` (two archives
  or a stated no-hillshade v1); `ARCHITECTURE.md` basemap bullet
  (hillshade, "terms permit copies") and § App shell (STYLE axis already
  anticipated — consistent); `WORKPLAN.md` Phase 0 line 2 (*"API key
  (free tier)"* → "Standard key, no registration"); the research row
  (F4); `SECURITY.md` § Privacy (F3); `ECONOMICS.md` tripwire table (N5);
  a new ADR plus `NOTICE` entries for style assets (F5); `CONTRIBUTING`
  dev-setup, if a session's minted key needs a documented home outside
  the tree. `site/sw.js`'s comment and ADR 0452 already agree with the
  no-key, own-version-axis shape — no change.
- **V4** The key-tier facts should land once (ECONOMICS table or the
  item) and be pointed at from ARCHITECTURE, not restated.
- **V5** SECURITY.md internal contradiction (F3); ARCHITECTURE's
  hillshade-included reading vs the single-archive plan (F2).
- **V6** Above.
- **V7** Provenance stated above and in the brief.

## Non-goals, tested

The non-goals fence off nothing the direction carries: obtaining a key is
Mike's (and, per F1/F7, smaller than framed); the archive pipeline and
`pmtiles` install belong to P0-D, whose text F2 asks to change; the
storage seam has its own pass.

## Follow-ups for the decision step

1. Mike rules on F1 (1)–(3); recommendation (1) and (2).
2. Apply F2's choice to P0-D and ARCHITECTURE before any archive is
   built.
3. F3–F7, N3, N5 are text corrections; one follow-ups item can carry
   them.
