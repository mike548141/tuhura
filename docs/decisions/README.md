# Decision records

Short ADRs preserving the *deliberation* behind significant decisions —
the alternatives weighed, why they lost, and the evidence — which
`ARCHITECTURE.md` (current truth, compact) deliberately compresses away.

Write one when a decision (a) rejected a plausible alternative a future
session might re-propose, or (b) rests on evidence that took real work to
gather. Don't write one for reversible implementation choices — a code
comment covers those (the "comments say why" rule).

Format: one file, `<YYYY-MM-DD>-<HHMM>-<slug>.md` (start time, 24-hour, in UTC
— `date -u`, atelier ADR 2026-07-15; coordination-free, per atelier's
[record-identifier rule][concurrency]; files named under retired schemes keep
their names), about half a page.
Sections: **Status** (draft / accepted / revoked `<date>` / superseded by
`<file>`), **Date**, **Review**, **Context**, **Decision**, **Rejected** (each
alternative + why it lost), **Consequences**. **Review** is the stated
judgement the record owes at the moment it's written (atelier's
[review doctrine][review]): a queued pointer (`queued — docs/reviews/<file>`)
or an explicit `not warranted — <grounds>` — omission is the bug, and
atelier's `reviewscan` reds a new record that leaves it blank (a reviewer or
the principal can disagree with a judgement; neither can disagree with a
blank). Draft is the only mutable state —
deliberation still open, binding on nothing; acceptance is the principal's
call and freezes the substance. Everything after acceptance is appended, never
edited: a dated **Addendum** section when the decision matures, `revoked
<date>` + addendum when it stops applying with no replacement, `superseded by
<file>` when a new ADR replaces it (the full lifecycle is atelier's
[record lifecycle][record]).

## Index

One line per ADR, oldest first.

- [2026-08-08 0450](2026-08-08-0450-one-vendored-map-dependency.md) — zero
  build step; MapLibre GL JS + pmtiles vendored into `site/vendor/` (its
  "one dependency class" sentence superseded by 0546; the map-stack decision
  stands).
- [2026-08-08 0452](2026-08-08-0452-pmtiles-in-opfs.md) — offline tiles are
  PMTiles archives in OPFS, not service-worker tile caching.
- [2026-08-08 0454](2026-08-08-0454-cacheable-licences-only.md) — only
  licences that permit offline redistribution are cached; the rest link out.
- [2026-08-08 0545](2026-08-08-0545-platform-posture.md) — PWA canonical +
  a committed thin Capacitor channel (founding-review ruling); **timing
  challenged 2026-08-09, owner ruling outstanding**.
- [2026-08-08 0546](2026-08-08-0546-vendored-dependencies-rule.md) — every
  vendored dependency is individually ADR'd, pinned, NOTICE'd.
- [2026-08-08 0555](2026-08-08-0555-sensor-seams-and-native-channel-scope.md)
  — sensor-source seams (pluggable backends) + the widened native-channel
  scope; vehicle *control* needs its own ADR + review.
- [2026-08-17 0545](2026-08-17-0545-adopt-the-split-board.md) — the roadmap
  becomes a board: one file per item under `docs/roadmap/`, `ROADMAP.md`
  generated, the `board` floor check now enforcing here.
- [2026-08-17 1229](2026-08-17-1229-split-the-session-log.md) — the session log
  becomes an index with detail on demand under `docs/sessions/`; rotation to a
  `SESSIONS-ARCHIVE.md` growth store is the *next* move, deliberately not taken.

<!-- Cross-repo pointers into atelier (public), as full URLs so they resolve
     for a reader who has no sibling checkout. -->

[concurrency]: https://github.com/mike548141/atelier/blob/main/docs/method/CONCURRENCY.md
[review]: https://github.com/mike548141/atelier/blob/main/docs/method/REVIEW.md
[record]: https://github.com/mike548141/atelier/blob/main/docs/method/RECORD.md
