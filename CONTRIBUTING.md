# Contributing to tūhura

tūhura is an offline-first mobile PWA map app for the NZ outdoors — vanilla
HTML/CSS/JS in `site/`, no build step, one vendored map library.
Before changing anything, read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
so a change doesn't run aground on a deliberate boundary.

## Development setup

Nothing to install — a static file server and a browser are the toolchain:

```sh
python3 tools/serve.py        # serves site/ on laptop + phone (same Wi-Fi)
python3 tools/check_links.py  # doc link integrity
```

**`main` auto-deploys.** Hosting is Cloudflare Pages, git-connected, so a
push to `main` publishes to <https://tuhura.myspot.nz> with no separate
release step. Branches and PRs get their own preview URLs — the cheap way
to check a change on a real phone before it reaches the live hostname.
See [`docs/DEPLOY.md`](docs/DEPLOY.md).

Once per clone. The hook itself is **tracked** (`.githooks/pre-commit`, so it
travels with the repo and never goes stale), but git does not transport
*config* — so a fresh clone commits **unscanned** until these two lines are run.
Once wired, the hook fails closed rather than ever scanning nothing:

```sh
git config core.hooksPath .githooks
git config hooks.atelierTools "../atelier/tools"
```

Once per **machine**, not per clone — the personal-data half of `leakscan`:

```sh
cp "../atelier/tools/leakscan-terms.example.txt" ~/.claude/leakscan-terms.txt
# then fill it in with your estate's literal sensitive strings
```

This list is what `leakscan` matches your own names, addresses and identifiers
against; the shipped structural patterns only catch the *shape* of sensitive
data. It lives in `~/.claude/`, outside every repo, because the list itself is
the leak if committed. The hook runs `leakscan --require-terms`, so **without
it your first commit blocks** rather than passing on half a check — that block
is deliberate, and it is not a broken tool. CI has no such list and never will,
which is why CI's `leakscan` is structural-only and reports itself as partial
cover rather than as a clean pass.

Prove it landed — two claims, and the second is the one that bites. The first
line must print `.githooks`, not nothing; the second must print the checks and
their state, not an error:

```sh
git config --get core.hooksPath
python3 "../atelier/tools/floor.py" --list --plane hook
```

The registry line alone proves the tools path resolves and the config parses —
it does *not* prove git will ever invoke the hook. With `core.hooksPath` unset
or mistyped, that command prints a clean registry while every commit goes
unscanned, which is exactly the gap this section exists to close.

The hook names no scanner: it is a shim over `../atelier/tools/floor.py`,
the one registry that this repo's CI reads too, so a check added upstream
applies here with no edit. To run a check **advisory** while re-baselining, or
to scope one to part of the tree, declare it in `.atelier-floor.json` at the
repo root — never by removing a check.

An advisory is *tracked debt*, so it states what the debt is and when it comes
due — both required:

```json
"advisory": {
  "wrapscan": {"why": "adopting the check; ~60 findings to clear",
               "review-by": "2026-09-01"}
}
```

When the date passes the repo goes **red on the fleet board** and nothing
blocks — the pressure is visibility, not a broken commit on a date nobody
remembers setting.

Reducing what a check **covers** on one that may never be softened
(`secretscan`, `leakscan`, `linkscan`, `reviewscan`, `licenscan`) also states
its reason — both the tree it reads and the arguments it runs with, because
either can shrink real cover without the check ever appearing as disabled:

```json
"scope": {"leakscan": {"paths": ["src"], "why": "only src/ is shareable"}},
"flags": {"leakscan": {"args": ["--disable", "ipv4"],
                       "why": "IP shapes are content in a networking repo"}}
```

On a check that *can* re-baseline, both keys stay reason-free: pointing a prose
check at part of the tree is an ordinary layout fact.

That file is also where this repo adds a check of its **own**, under `local`:
a rule that is genuinely repo-specific and could never be fleet-wide. Give it
a `run` path inside this repo and a `why`; it then runs beside the shared
checks and blocks the same commit. It cannot take a shared check's name, and a
declared check whose script is missing blocks rather than passing quietly. If
other repos would want the rule, it belongs upstream in atelier instead.

## What makes a good change

- **Stay in scope.** Non-goals live in `docs/STRATEGY.md` — read them before
  adding a feature; offline-first and accountless are boundaries, not
  preferences.
- **Test for real.** Say what you actually exercised — which browsers, at
  390 px mobile width, and **offline** (DevTools → Network → Offline); an
  offline-first app change verified only online is not verified.
- **New Zealand English** throughout (favourite, colour, organise);
  correct macrons on te reo Māori.
- **No personal data.** No addresses, contacts, health, family or
  business detail belongs in this repo.
- **Comments say _why_, not _what_** — constraints and non-obvious
  reasons only.
- **Record real decisions.** A short ADR in [`docs/decisions/`](docs/decisions/)
  when a choice rejects a plausible alternative or rests on hard-won
  evidence; a code comment for reversible ones.
- **Log the session.** Append a dated entry to
  [`docs/SESSIONS.md`](docs/SESSIONS.md) before finishing.

## Review

Significant or risky work gets a peer review before it's trusted — a more
capable model reviews the whole commitment: approach, assumptions, security &
privacy, and real-world behaviour, not just correctness. The trigger is
**commitment, not artefact**: a design or decision
others will build on earns one as much as a diff does, and earns it earlier,
when being wrong is still cheap. See
[`docs/reviews/README.md`](docs/reviews/README.md).
