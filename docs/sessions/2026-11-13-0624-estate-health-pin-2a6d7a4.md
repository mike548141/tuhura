# 2026-11-13 · 0624 UTC · estate health: pin `0a2b7a7` → `2a6d7a4`, G3 cleared

A headless Opus 5.5 session (`2402c2a3`), dispatched by an estate health
sweep (orchestrator session `e820bff5`) to bring this repo to the latest
atelier pin, green CI and current house conformance. No review was run and no
Fable model was used.

## What was read

- **In full:** `git -C ../atelier diff 0a2b7a7 origin/main --
  docs/method/PROPAGATION.md` (820 lines), the canonical `floor` region at
  `2a6d7a4`.
- **From a digest, not read line by line here:** the rest of the
  `docs/method/` and template delta since this repo's pin (340 commits). The
  digest was written the same day by a session that read every hunk of it;
  the obligations below come from it.

## What moved here

- **Floor block re-stamped** verbatim from `2a6d7a4`, the four fill-ins kept
  (pin SHA, `../atelier`, this repo's visibility fact, `mike548141/tuhura`).
  Wording moved in eight bullets: bulk deletion from a record store joins the
  always-confirm list, the informed confirmation is APEX's full account, the
  ask's account arrives first and goes in prose where there is no device,
  `cclive` at session start, "where the branch has an upstream", class-only
  hand-ups, `fetch -q &&` fails closed, and the estate root may be named.
  `pins.py`: `current`, copy `identical`; `pins.py --check` exit 0.
- **Read order:** the session-log step now says a cold reviewer skips it
  (REVIEW rule 2).
- **G3 (`010/005`, due 2026-11-18) done:** all 7 tracked binaries are the
  app's own icon set from `tools/gen_icons.py`; each PNG holds only IHDR,
  IDAT and IEND, so nothing was stripped and all 7 are listed in
  `.leakscanbinaries` with `by=agent`. `leakscan` reports 0 G3 findings.
  `010/005`'s pointer to atelier's tools README no longer trips `pathscan`.
- **Hooks:** `.githooks/commit-msg` and `.githooks/pre-merge-commit` added
  from atelier's samples; CONTRIBUTING names all three.
- **`.atelier-floor.json`** declares `"visibility": "public"`, which is the
  fact. That brings `pdlistscan` into scope: it warns (blocks from
  2027-03-08) that `docs/PERSONAL-DATA.md` is missing. In a public repo only
  Mike can grant an entry there, so it is left for him.
- **Queued:** `040/050`, the rule-4 cold pass on this re-stamp, refs only,
  Fable-gated.

## Checks run, and their results

`floor.py --plane ci --root .` exit 0 (pdlistscan's one warning above);
`board.py --check` current; `allowmarker.py --census` 0 malformed;
`sizescan.py --check` clean; `grep 'Pending upstream:'` nothing outside the
floor block. CI conclusions at the pushed head are in the closing report.

## Identifiers

- **Session:** `2402c2a3`, dispatched by orchestrator session `e820bff5`.
- **Commits:** the landing commit that adds this file.
- **Pull requests:** none.
- **Board:** `010/005` closed; `040/050` filed.
- **Worktrees and branches:** a detached worktree at `origin/main`, removed
  by the launcher.
- **Agents:** none launched.
