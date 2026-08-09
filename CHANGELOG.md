# Changelog

Notable changes, newest first. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Everything sits
under _Unreleased_ until there's a reason to cut a tagged version.

## [Unreleased]

### Added
- **The site is live.** tūhura publishes on Cloudflare Pages: every push
  to `main` deploys to <https://tuhura.myspot.nz>, with
  `https://tuhura.pages.dev` as the always-works default. Provisioning is
  config-as-code (`tools/deploy.json` + `tools/deploy.py`); the flow and
  the token story are in [docs/DEPLOY.md](docs/DEPLOY.md). What is live
  today is the "under construction" shell — the hostname exists early
  deliberately, so the service worker's origin never has to move once
  devices start caching tiles against it.
- `SECURITY.md` — private vulnerability reporting via GitHub advisories,
  with scope written to tūhura's real risk: safety-adjacent data rendered
  wrongly (a boundary shown as public when it isn't) leads the list, ahead
  of the conventional web surfaces.
- Initial repository scaffolded to the house conventions.

### Added
- Platform research — **PWA vs native vs the other options**
  ([docs/research/2026-08-09-0449-platform-pwa-vs-native.md](docs/research/2026-08-09-0449-platform-pwa-vs-native.md)),
  commissioned when Mike re-opened the question. Verifies the web's real
  2026 ceiling on iOS, discredits two widely-repeated storage myths that
  would have pushed the call the wrong way, and finds a quota asymmetry
  that changes how offline storage must be built well before any shell
  exists. Conclusion: the PWA-canonical ADR's shape holds, its timing
  doesn't.

### Changed
- **Maritime use is first-class, equal to land** (owner directive
  2026-08-09). Boating, diving and fishing on the water sit alongside
  off-road driving, tramping, mountaineering, hunting and birding in every
  statement of what tūhura is — strategy, onramp, README, the live shell.
  Mountaineering is newly named; the "not a chart plotter" non-goal is
  restated as the licensing limit it always was, not a ranking. Roadmap
  staging for the marine layers is flagged as contested and left unchanged
  pending a ruling.
- **The repository is public.** Doctrine stamp in `CLAUDE.md` updated to
  match: every push is now publication, and narrowing back does not
  un-publish.
- Cross-repo pointers into atelier are now resolvable URLs rather than bare
  relative paths that only worked with a sibling checkout — `pathscan` is
  clean as a result.
