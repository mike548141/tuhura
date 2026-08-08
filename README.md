# tūhura

tūhura (te reo Māori: *to explore, discover*) is an offline-first mobile web
app (PWA) for the New Zealand outdoors — a map for off-road driving, hunting,
fishing, birding, and tramping that keeps working perfectly when there is no
coverage at all, and quietly takes advantage of a connection when one appears.
Accountless by design; a future end-to-end-encrypted sync shares your spots
between your own devices — and with your mates — without the server ever being
able to read them.

The deployable site lives in `site/`. Everything at the repo root is
scaffolding that never ships.

## What's here

| Path | Purpose |
|---|---|
| `site/` | **The deployable artefact** — vanilla HTML/CSS/JS, no build step |
| `docs/` | Strategy, architecture, roadmap, decisions, session log |
| `tools/` | Dev/CI helpers (stdlib-only Python 3) |

## Run it / Setup

```sh
python3 tools/serve.py    # serves site/ on laptop + phone (same Wi-Fi)
```

## Develop

- Comments explain **why**, not what.
- Contestable decisions get a short ADR in [`docs/decisions/`](docs/decisions/).
- Session context: [`CLAUDE.md`](CLAUDE.md), [`docs/ROADMAP.md`](docs/ROADMAP.md),
  tail of [`docs/SESSIONS.md`](docs/SESSIONS.md).

## Licence

Apache-2.0 (see [LICENSE](LICENSE)).
