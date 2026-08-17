# tūhura session log (index)

Append-only, newest last; one line per session. **Tail-read this at session
start** (`tail -20 docs/SESSIONS.md`) — it is the index, not the record. Full
detail lives in `docs/sessions/<date>-<HHMM>-<slug>.md`; open a file only when
its line needs unpacking.

Append-only is a rule about **content** — an entry is never edited or reordered
once written — not about the file. When this index outgrows its budget the
recent tail stays and older lines rotate **verbatim** to `SESSIONS-ARCHIVE.md`
(RECORD.md § The session log). Restructured to this shape 2026-08-17, entries
preserved verbatim in the detail files; the `HHMM` on each pre-split file is the
session's **first commit** in UTC, recovered from git rather than invented, and
new sessions use their own start time (`date -u`).

---

- [2026-08-08 · repo born](sessions/2026-08-08-0450-repo-created-and-scaffolded.md) — repo created and scaffolded to the house conventions (doctrine pinned `atelier@320f9b1`, scan hook wired and proven); Mike named the app **tūhura** and set the frame — offline-first PWA map for the NZ outdoors, accountless, future E2E sync; founding research fanned out to sub-agents and grounded the first ADRs.
- [2026-08-08 · owner directive sweep](sessions/2026-08-08-0518-owner-directive-sweep.md) — sensors, sound ID, companion mode, CarPlay, delta sync, whole-NZ cache, marine verticals, the Māori land ruling (ship it, toggleable) and settings; founding cold review's verdict integrated, ROADMAP re-tiered v1/post-v1/icebox with evidence gates.
- [2026-08-08 · publication](sessions/2026-08-08-0554-publication.md) — audited the repo for anything that must not go public, added SECURITY.md and made every atelier pointer resolve for a reader with no sibling checkout; **Mike's decision: the repo is PUBLIC**, so every push is publication.
- [2026-08-08 · went live](sessions/2026-08-08-0608-went-live.md) — Cloudflare Pages serving <https://tuhura.myspot.nz>; the git-connected auto-deploy webhook did **not** fire and the claim was corrected rather than left standing — manual deploy + `tools/deploy.py status` added as the honest interim.
- [2026-08-09 · auto-deploy closed out](sessions/2026-08-09-0439-auto-deploy-closed-out.md) — push-to-deploy confirmed working end-to-end and the workaround removed; the repo granted to the Pages project.
- [2026-08-09 · maritime first-class, platform re-opened](sessions/2026-08-09-0445-maritime-first-class-platform-reopened.md) — two owner directives: **maritime is a first-class half of tūhura, equal to land** (STRATEGY and CLAUDE.md now say so), and the platform question re-opened → `research/2026-08-09-0449-platform-pwa-vs-native.md`. The ADR's shape held; its *timing* did not, and the shell's tier became contested.
- [2026-08-15 · drift adopted, cold pass briefed](sessions/2026-08-15-1035-drift-adopted-review-briefed.md) — atelier drift adopted (pin `b5da9e5`), two stale ADR review pointers closed and the ADRs indexed, and the platform-tier + marine-staging cold pass **briefed and queued refs-only** for a non-author to take.
- [2026-08-15 · the cold pass RUN](sessions/2026-08-15-1412-platform-tier-marine-staging-pass.md) — run by a fresh Fable session that wrote none of the brief, research or ADRs. 2 MAJOR (F1 "maritime first-class" ≠ marine instruments in v1; F3 the over-the-air update claim unexamined). Recommendations **R1** (marine into v1, web side) and **R2** (shell post-Phase-3, two-armed gate) left with Mike, decoupled; pin bumped to `eef38be`.
- [2026-08-17 · board split, pin bump, two rulings](sessions/2026-08-17-0545-board-split-pin-bump-and-two-rulings.md) — the roadmap became a per-item board with a generated 62-line index; atelier moved **mid-session** so the pin went `eef38be` → `0af3006` and all three handed-up findings came back fixed (on `faves`' report, not ours — the "first child" claim was corrected); then **Mike ruled R1 and R2**: marine joins v1 on the web side, the shell stays post-Phase-3 on a two-armed gate, and marine *instrument* integration is what stays post-v1. This session log split to index + detail files.
