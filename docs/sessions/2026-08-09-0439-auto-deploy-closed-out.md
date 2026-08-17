# 2026-08-09 · 0439 UTC · Auto-deploy closed out

**2026-08-09**: Auto-deploy closed out. Mike granted the repo to the
Cloudflare Workers and Pages GitHub App and flushed the stale local DNS
entry; both verified rather than assumed. An empty commit produced a
deployment nobody triggered, and its metadata reads
`type: github:push, branch: main, commit: 4d36c16` against the previous
one's `ad_hoc` — which both proves the webhook and confirms the earlier
diagnosis was right. `tuhura.myspot.nz` now resolves and serves 200
directly from the owner's machine.
The workaround documentation was then removed as promised: README,
CONTRIBUTING, CHANGELOG and DEPLOY.md are back to "a push is a deploy".
`deploy` and `status` stay, re-framed — `deploy` is now a force-rebuild
for transient build failures rather than a workaround, and DEPLOY.md
keeps a short troubleshooting note recording that a public repo makes a
dead webhook look healthy, since that is the trap that cost a wrong
diagnosis and would otherwise cost the next one too.
Next: Phase 0 with its scale/soak rider.
