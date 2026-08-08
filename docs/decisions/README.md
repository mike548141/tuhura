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

<!-- One line per ADR — replace with live entries. The example below is a
single-line code span so its placeholder link isn't scanned as a real one:
`[2026-01-15](2026-01-15-0930-slug.md) — one-line summary of the decision` -->

<!-- Cross-repo pointers into atelier (public), as full URLs so they resolve
     for a reader who has no sibling checkout. -->

[concurrency]: https://github.com/mike548141/atelier/blob/main/docs/method/CONCURRENCY.md
[review]: https://github.com/mike548141/atelier/blob/main/docs/method/REVIEW.md
[record]: https://github.com/mike548141/atelier/blob/main/docs/method/RECORD.md
