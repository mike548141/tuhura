#!/usr/bin/env python3
"""Provision tuhura hosting on Cloudflare Pages — config as code.

The whole hosting setup (Pages project, build config, custom domain)
lives in tools/deploy.json and is reconciled by this script against the
Cloudflare REST API. Idempotent: run it as often as you like; it creates
what's missing and leaves the rest alone — declare desired state, apply,
repeat.

    export CLOUDFLARE_API_TOKEN=...        # scoped token, see docs/DEPLOY.md
    /usr/bin/python3 tools/deploy.py plan  # show desired vs actual, change nothing
    /usr/bin/python3 tools/deploy.py apply # make it so

Stdlib only — no install, no build step, which is the same property the
site itself has: Pages serves site/ exactly as committed.

The token is read from the environment and is NEVER written to the repo.
The identifiers in deploy.json are — they address rather than
authenticate, and this repo is public, so it carries only the ones the
code reads.

Ported from the sibling faves repo rather than shared as a library: two
copies of 260 stdlib-only lines is cheaper than a dependency between two
repos that must both stay build-less. If a third consumer appears, that
trade flips.

Not automated (one-time, browser-only): authorising Cloudflare's GitHub
App on the repo. See docs/DEPLOY.md. Everything else is here.
"""

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = Path(__file__).resolve().parent / "deploy.json"
API = "https://api.cloudflare.com/client/v4"


class CFError(Exception):
    pass


def token():
    t = os.environ.get("CLOUDFLARE_API_TOKEN")
    if not t:
        sys.exit(
            "CLOUDFLARE_API_TOKEN is not set.\n"
            "Create a scoped token (see docs/DEPLOY.md) and:\n"
            "    export CLOUDFLARE_API_TOKEN=..."
        )
    return t


def cf(method, path, body=None):
    """One Cloudflare API call. Returns the `result` object on success."""
    url = f"{API}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", f"Bearer {token()}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            payload = json.load(r)
    except urllib.error.HTTPError as e:
        payload = json.load(e)
        if not payload.get("success", False):
            errs = "; ".join(
                f"[{m.get('code')}] {m.get('message')}"
                for m in payload.get("errors", [])
            )
            raise CFError(f"{method} {path} -> {e.code}: {errs or e.reason}")
        # some 4xx still carry a usable result (e.g. 409 already-exists)
    if not payload.get("success", False):
        errs = "; ".join(
            f"[{m.get('code')}] {m.get('message')}" for m in payload.get("errors", [])
        )
        raise CFError(f"{method} {path}: {errs}")
    return payload.get("result")


def load_config():
    if not CONFIG.exists():
        sys.exit(f"Missing config: {CONFIG}")
    cfg = json.loads(CONFIG.read_text())
    for key in ("pages_project", "production_branch", "github", "build"):
        if key not in cfg:
            sys.exit(f"deploy.json is missing required key: {key}")
    return cfg


def resolve_account_id(cfg):
    """Use the configured id, else auto-pick if the token sees exactly one."""
    if cfg.get("account_id"):
        return cfg["account_id"]
    accounts = cf("GET", "/accounts?per_page=50") or []
    want = cfg.get("account_name")
    if want:
        for a in accounts:
            if a["name"] == want:
                return a["id"]
        sys.exit(f"No account named {want!r} visible to this token.")
    if len(accounts) == 1:
        return accounts[0]["id"]
    names = ", ".join(f"{a['name']} ({a['id']})" for a in accounts)
    sys.exit(
        "This token can see multiple accounts; set account_id in deploy.json.\n"
        f"  Visible: {names}"
    )


def get_project(acct, name):
    try:
        return cf("GET", f"/accounts/{acct}/pages/projects/{name}")
    except CFError as e:
        if "8000007" in str(e) or "not found" in str(e).lower() or "404" in str(e):
            return None
        raise


def desired_source(cfg):
    gh = cfg["github"]
    return {
        "type": "github",
        "config": {
            "owner": gh["owner"],
            "repo_name": gh["repo"],
            "production_branch": cfg["production_branch"],
            "pr_comments_enabled": True,
            "deployments_enabled": True,
            "production_deployment_enabled": True,
            "preview_deployment_setting": "all",
        },
    }


def desired_build(cfg):
    b = cfg["build"]
    return {
        "build_command": b.get("build_command", ""),
        "destination_dir": b.get("destination_dir", "site"),
        "root_dir": b.get("root_dir", ""),
    }


def ensure_project(acct, cfg, apply):
    name = cfg["pages_project"]
    existing = get_project(acct, name)
    if existing is None:
        print(f"  project {name!r}: MISSING -> will create (git-connected)")
        if not apply:
            return None
        try:
            proj = cf(
                "POST",
                f"/accounts/{acct}/pages/projects",
                {
                    "name": name,
                    "production_branch": cfg["production_branch"],
                    "source": desired_source(cfg),
                    "build_config": desired_build(cfg),
                },
            )
            print(f"    created; deploys from github/{cfg['github']['owner']}/"
                  f"{cfg['github']['repo']}@{cfg['production_branch']}")
            print(f"    default URL: https://{proj.get('subdomain')}")
            return proj
        except CFError as e:
            if "github" in str(e).lower() or "connect" in str(e).lower():
                sys.exit(
                    "Cloudflare can't reach the GitHub repo — the GitHub App "
                    "isn't authorised yet.\n"
                    "Do the one-time connect step in docs/DEPLOY.md, then "
                    "re-run `python3 tools/deploy.py apply`."
                )
            raise
    print(f"  project {name!r}: exists  (url https://{existing.get('subdomain')})")
    # Reconcile build config if it drifted.
    want, have = desired_build(cfg), existing.get("build_config") or {}
    drift = {k: v for k, v in want.items() if have.get(k) != v}
    if drift:
        print(f"    build config drift: {drift} -> will patch")
        if apply:
            cf("PATCH", f"/accounts/{acct}/pages/projects/{name}",
               {"build_config": want})
            print("    patched")
    return existing


def ensure_domains(acct, cfg, apply, project):
    name = cfg["pages_project"]
    want = cfg.get("custom_domains", [])
    if not want:
        return
    if project is None:
        # Plan mode with the project not yet created: the domains endpoint
        # would 404. Nothing exists, so everything is an attach.
        for domain in want:
            print(f"  domain {domain}: MISSING -> will attach after "
                  "project creation (+ proxied CNAME)")
        return
    have = {d["name"] for d in (cf(
        "GET", f"/accounts/{acct}/pages/projects/{name}/domains") or [])}
    for domain in want:
        if domain in have:
            print(f"  domain {domain}: attached")
        else:
            print(f"  domain {domain}: MISSING -> will attach")
            if apply:
                cf("POST", f"/accounts/{acct}/pages/projects/{name}/domains",
                   {"name": domain})
                print("    attached; certificate provisions in the background")
        ensure_cname(cfg, domain, name, apply)


def ensure_cname(cfg, domain, project_name, apply):
    """The dashboard flow creates the CNAME for you; the API attach does
    not (verified live 2026-07-11) — so reconcile the DNS record too."""
    zone_name = cfg.get("zone")
    if not zone_name:
        print("    (no `zone` in deploy.json — create the CNAME yourself)")
        return
    zones = cf("GET", f"/zones?name={zone_name}") or []
    if not zones:
        sys.exit(f"Zone {zone_name!r} not visible to this token.")
    zone_id = zones[0]["id"]
    target = f"{project_name}.pages.dev"
    recs = cf("GET", f"/zones/{zone_id}/dns_records?name={domain}") or []
    if any(r["type"] == "CNAME" and r["content"] == target and r["proxied"]
           for r in recs):
        print(f"  cname {domain} -> {target}: present (proxied)")
        return
    if recs:
        sys.exit(f"{domain} already has DNS records that aren't the "
                 f"expected proxied CNAME to {target} — resolve by hand.")
    print(f"  cname {domain} -> {target}: MISSING -> will create (proxied)")
    if apply:
        cf("POST", f"/zones/{zone_id}/dns_records", {
            "type": "CNAME", "name": domain, "content": target,
            "proxied": True,
            "comment": "Pages custom domain (managed by tools/deploy.py)"})
        print("    created")


def trigger_deploy(acct, cfg):
    """Rebuild the production branch without pushing a commit.

    Pushes deploy on their own via the GitHub App webhook, so this is for
    the cases a push cannot express: re-running a build that failed on
    something transient, or reviving the automatic path after a grant
    lapses. A deployment's `type` distinguishes them — `github:push` for
    the webhook, `ad_hoc` for this.

    The endpoint takes multipart/form-data, not JSON, so it does not go
    through cf().
    """
    name = cfg["pages_project"]
    branch = cfg["production_branch"]
    boundary = "----tuhura-deploy-boundary"
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="branch"\r\n\r\n'
        f"{branch}\r\n"
        f"--{boundary}--\r\n"
    ).encode()
    req = urllib.request.Request(
        f"{API}/accounts/{acct}/pages/projects/{name}/deployments",
        data=body, method="POST")
    req.add_header("Authorization", f"Bearer {token()}")
    req.add_header("Content-Type",
                   f"multipart/form-data; boundary={boundary}")
    try:
        with urllib.request.urlopen(req) as r:
            payload = json.load(r)
    except urllib.error.HTTPError as e:
        payload = json.load(e)
    if not payload.get("success", False):
        errs = "; ".join(
            f"[{m.get('code')}] {m.get('message')}"
            for m in payload.get("errors", []))
        raise CFError(f"deploy trigger: {errs}")
    d = payload["result"]
    print(f"  deployment {d['id']} queued from {branch}")
    print(f"    preview: {d.get('url')}")
    print("  Poll `status` until it reads success.")


def show_status(acct, cfg):
    name = cfg["pages_project"]
    deps = cf("GET",
              f"/accounts/{acct}/pages/projects/{name}/deployments?per_page=5")
    if not deps:
        print("  no deployments yet — run `deploy` to create the first one.")
        return
    for d in deps:
        stage = d["latest_stage"]
        print(f"  {d['created_on'][:19]}  {stage['name']:<8} "
              f"{stage['status']:<8}  {d.get('url')}")


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "plan"
    if cmd not in ("plan", "apply", "deploy", "status"):
        sys.exit("usage: /usr/bin/python3 tools/deploy.py "
                 "[plan|apply|deploy|status]")
    cfg = load_config()
    acct = resolve_account_id(cfg)
    if cmd in ("deploy", "status"):
        print(f"account: {acct}   mode: {cmd.upper()}")
        (trigger_deploy if cmd == "deploy" else show_status)(acct, cfg)
        return
    apply = cmd == "apply"
    print(f"account: {acct}   mode: {cmd.upper()}")
    project = ensure_project(acct, cfg, apply)
    ensure_domains(acct, cfg, apply, project)
    if not apply:
        print("\nplan only — nothing changed. Run `apply` to make it so.")
    else:
        print("\napplied. First deploy runs on the next push to "
              f"{cfg['production_branch']} (or trigger one in the dashboard).")


if __name__ == "__main__":
    try:
        main()
    except CFError as e:
        sys.exit(f"Cloudflare API error: {e}")
