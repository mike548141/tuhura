# Deploying tūhura

Hosting is **Cloudflare Pages**, git-connected to this repo. Config is
code: [`tools/deploy.json`](../tools/deploy.json) declares the desired
state, [`tools/deploy.py`](../tools/deploy.py) reconciles it against the
Cloudflare API. Idempotent — safe to run repeatedly.

- **Live:** <https://tuhura.myspot.nz>
- **Default:** `https://tuhura.pages.dev` (always works, no DNS needed)

There is no build step, so there is nothing to build: Pages serves
`site/` exactly as committed. That is the whole deploy.

## Why a subdomain, not `myspot.nz/tuhura`

A Pages project maps to a whole hostname and serves at its root. Serving
at a *path* would mean either restructuring the repo under a `tuhura/`
folder (breaks the zero-build-step rule and `serve.py`) or fronting it
with a Worker router. A subdomain needs neither — the app uses relative
paths and a `./`-scoped manifest, so it is origin-portable.

This matters more here than it would for an ordinary site. A service
worker's scope is bound to its origin and path; an app that may later
move origin, or serve from a path, inherits cache-scope bugs that are
painful to unpick once devices are holding gigabytes of offline tiles.
Own hostname from the start, before anything is cached.

## The API token

The deploy token is an **account-owned child token**, minted in code from
the estate's parent minting token and scoped to exactly:

| Scope | Permission |
| --- | --- |
| Account · Pages | Edit |
| Zone · DNS (`myspot.nz` only) | Edit |
| Zone · Zone (`myspot.nz` only) | Read |

One child per repo, so revoking this one never touches another
consumer's access. The value lives in the macOS **login keychain** as
`cloudflare-tuhura-deploy` — never in the repo, a dotfile, or a
transcript. Source it per-shell:

```sh
export CLOUDFLARE_API_TOKEN=$(security find-generic-password -s cloudflare-tuhura-deploy -w)
```

Minting, rolling and the credential registry live in the estate's
access repo (a sibling checkout — see the estate-resources rule in
`CLAUDE.md`); this repo consumes the token and never mints one.

**Python note:** the python.org install on the owner's machine has no CA
certificates wired up, so `python3 tools/deploy.py` fails TLS
verification. Use the system interpreter: `/usr/bin/python3`.

## Everyday deploys

**Right now deploys are manual.** Push does not yet publish:

```sh
git push origin main
/usr/bin/python3 tools/deploy.py deploy    # trigger the build
/usr/bin/python3 tools/deploy.py status    # poll until `success`
```

### Why, and how to fix it once

Cloudflare can *read* this repo without any grant — it is public, so the
clone is anonymous, which is why `apply` succeeded and a triggered deploy
builds the right commit. What it does not get for free is the **push
webhook**: that is delivered by Cloudflare's GitHub App, and only for
repos inside the App's installation. This repo is not in it yet, so
pushes land in GitHub and nothing downstream hears about them.

This is the one step that cannot be scripted — OAuth and App grants are
browser-only, and widening an App's repo access is a trust decision the
owner makes, not one a script takes:

1. GitHub → **Settings → Applications → Cloudflare Pages → Configure**
2. Under *Repository access*, add **`mike548141/tuhura`**, and save.

Then confirm it took, rather than assuming:

```sh
git commit --allow-empty -m "chore: confirm auto-deploy" && git push
/usr/bin/python3 tools/deploy.py status    # a new deployment, unprompted
```

Once a push deploys on its own, delete the manual step from this section
and drop the `deploy` subcommand's reason-for-existing note — leaving a
workaround documented after it stops being needed is how a doc starts
lying.

Branches and PRs get their own preview URLs, which is the cheap way to
look at a change on a real phone before it reaches the live hostname —
those also depend on the App grant.

## Re-provisioning

```sh
/usr/bin/python3 tools/deploy.py plan     # dry run: desired vs actual
/usr/bin/python3 tools/deploy.py apply    # make it so
```

`apply` creates the git-connected Pages project (no build command, output
dir `site/`), attaches the custom domain, **and creates the proxied CNAME
itself** — the dashboard flow auto-creates that record but the API attach
does not. HTTPS provisions in the background because the zone is in the
same account.

One step is browser-only and cannot be scripted: authorising Cloudflare's
GitHub App against this repo (OAuth grants are not automatable). It was
done once and persists; you only revisit it if the grant is revoked, in
which case `apply` fails with a message saying exactly that.
