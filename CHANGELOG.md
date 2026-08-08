# Changelog

Notable changes, newest first. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Everything sits
under _Unreleased_ until there's a reason to cut a tagged version.

## [Unreleased]

### Added
- `SECURITY.md` — private vulnerability reporting via GitHub advisories,
  with scope written to tūhura's real risk: safety-adjacent data rendered
  wrongly (a boundary shown as public when it isn't) leads the list, ahead
  of the conventional web surfaces.
- Initial repository scaffolded to the house conventions.

### Changed
- **The repository is public.** Doctrine stamp in `CLAUDE.md` updated to
  match: every push is now publication, and narrowing back does not
  un-publish.
- Cross-repo pointers into atelier are now resolvable URLs rather than bare
  relative paths that only worked with a sibling checkout — `pathscan` is
  clean as a result.
