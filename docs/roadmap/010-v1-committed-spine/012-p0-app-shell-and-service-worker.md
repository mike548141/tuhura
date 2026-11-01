- [ ] 🎯 **P0-B — app shell, service worker, installable. BUILT
      2026-09-20; acceptance owed to a human on a device.** A minimal shell
      (`site/index.html` + ES modules + CSS), a web app manifest, icons, and
      a service worker that precaches **the shell only** — never tiles, which
      belong in OPFS and would blow the Cache API budget. Follow Faves
      ADR 0015's split-version pattern so a shell update and a data-format
      change can never be mistaken for one another.

      Mobile-first at 390 px, targets ≥ 44 px, WCAG 2.2 AA, visible focus,
      `prefers-reduced-motion`, and a true-dark theme from the first paint —
      night vision at a campsite is a feature, not a later polish pass.

      **Accept when**: the app installs to a phone home screen and cold-starts
      to its shell with the radio off. That is the honest bar for this leaf —
      a map on screen belongs to P0-C and P0-D.

      Needs nothing from outside the project.

      review: queued if the shell's offline-update rules end up stated here
      rather than in ARCHITECTURE — the lockstep rules have one home.

      ⏳ review: queued — the built shell and service worker, regardless of
      the condition above: first-of-kind here, and a service worker fails
      silently. 📝 BRIEF WRITTEN 2026-11-02 by a brief-writing sub-agent
      (Claude Opus 5.5) of session `2be3482c`, a non-author:
      `docs/reviews/2026-11-02-1209-p0b-shell-service-worker-cold.md`, with
      its `.deferred.md` sibling. Tier at selection: Fable. **Fable-gated:
      it runs only on Mike's explicit approval.**

      CLAIMED 2026-11-01T15:26Z — pass running. Orchestrator: a headless Opus 5.5
      session started by drain session `c87c4ee0` (Opus 5.5) inside this
      repo; both are rule-4 off-tier orchestrators that hold the context
      partition (the `.deferred.md` sibling is held back from the reviewer
      until act 1 is committed) and form no finding and write no severity.
      Reviewer tier: Fable 5.1, checked at selection. Neither orchestrator
      is barred by the brief. Runs under Mike's 2026-11-02 drain approval.

      ✅ PASS RAN 2026-11-02 — **PASS WITH MAJORS: 2 MAJOR · 7 MINOR · 7
      NOTE** (act 1 at `b378cb8`, 2/6/6; act 2 raised F11 to MINOR and
      added F15 and F16; the sibling is now folded in). Verdict: below the
      divider in
      `docs/reviews/2026-11-02-1209-p0b-shell-service-worker-cold.md`.
      Reviewer Fable 5.1; the orchestrators formed no finding. In headless
      Chrome at 390 px the shell installs, cold-starts with the server
      dead, takes a `SHELL_VERSION` bump through the banner and one tap,
      and self-heals an interrupted install.

      Standing MAJORs: **F1** the lockstep rules rest on memory, and a
      `sw.js` edit without a bump raises a false "newer version is ready"
      banner, where Faves already has the machine check · **F2** the
      five-minute phone check below runs over `serve.py`'s LAN HTTP URL,
      which is not a secure context, so it cannot pass as written.

      🎯 **Owed to Mike (rule 3: the lockstep rules are doctrine by
      function, so these are his, not the author's):**
      1. **F2, before the phone check.** Options: (a) run it against the
         HTTPS Pages deploy and rewrite the five steps to name that origin
         (the reviewer did not touch the live host, so whether it is live
         is unverified); (b) Android only, `adb reverse` to `localhost`;
         (c) iOS, local TLS with a certificate the phone trusts.
         **Recommendation: (a)**, with `serve.py`'s note and the steps
         made to agree.
      2. **F1.** Adopt (a) a `node --test` shape test over `site/sw.js`
         (`SHELL` equals the shell's asset graph, no tile path, no
         `skipWaiting` in install, activate keeps exactly the current
         caches) and (b) a local floor check that blocks a staged change
         to that graph with `SHELL_VERSION` unchanged; or keep the rule a
         human check. **Recommendation: adopt both**, plus the reviewer's
         headless driver as a `tools/` script.
      3. **Rule wording, F5 and F15:** reword the lockstep rules to the
         shell's asset graph (the HTML, its import closure, the manifest's
         icons), settle the two orphan favicons, and name activate's
         keep-set as a lockstep site. **Recommendation: accept.**
      4. **F6's hosting rule:** add `site/_headers` (shell cache headers
         and a CSP) before the first deploy. **Recommendation: accept.**
      5. **F4, an SC 1.4.11 reading:** the dark-mode "Not now" border is
         1.51:1. **Recommendation: a ≥ 3:1 control-border token in both
         themes.**
      6. **The rest**, F3, F7, F8, F11 (MINOR) and F9, F10, F12, F13, F16
         (NOTE): accept all into one follow-ups item, accept some, or
         decline. **Recommendation: accept all; F11 (manifest `id`) lands
         before the first install.**
      Asked on the board, not in a prompt, per Mike's 2026-11-02 drain
      ruling.

      F14 (NOTE, record slip) reads the claim stamp above as a day early.
      The orchestrator left it as written: it came from `date -u`, and the
      brief's own commit `b2793a3` landed at 2026-11-01T12:09Z, so the slip
      is in the brief's "2026-11-02 1209 UTC" stamp, not the claim.

      Routing: the pass applies nothing. Fixes land in a fresh session on
      Mike's rulings; F1's floor check, being doctrine by function, earns
      its own review when built (`REVIEW.md`). The item still closes only
      on the phone check below, once F2 is settled.

      **Built 2026-09-20 and deliberately not ticked.** The shell,
      manifest, generated icon set (`tools/gen_icons.py`, a stdlib-only
      PNG writer — no Pillow or ImageMagick on the machine, and real PNGs
      rather than grey placeholders), the split-version service worker and
      the lockstep rules in `docs/ARCHITECTURE.md` are all landed and
      pushed. Contrast ratios were computed, not eyeballed: the worst pair
      is 4.32:1 against AA's 3:1 non-text floor, every text pair ≥ 6.21:1.
      No `innerHTML` anywhere in `site/`; the `el()` helper is text-safe by
      construction. `sw.js` precaches the shell only and states the
      tiles-never-in-Cache-API rule at its head.

      **Why this stays open.** This item's own Accept when is *"the app
      installs to a phone home screen and cold-starts to its shell with
      the radio off"*, and nothing in this session had a browser. "Done"
      means verified, so the box stays empty until a device says so.

      🎯 **Owed to Mike — five minutes on a phone**, and the item closes:

      1. `python3 tools/serve.py`, open the phone URL, install to the home
         screen. Check the icon and the name render — including the
         macron on **tūhura**.
      2. Launch it installed: confirm standalone (no browser chrome).
      3. Flight mode, relaunch: confirm it still cold-starts to the shell.
      4. At 390 px check the dark theme, the focus ring under keyboard
         tabbing, and that nothing is under 44 px to the thumb.
      5. Edit any shell file, bump `SHELL_VERSION`, reload: confirm the
         update banner appears and the tap reloads cleanly.

      One unverified inheritance from Faves is labelled in the code as
      such: its Cloudflare Pages single-page-fallback protection was kept
      as cheap insurance, but this repo has no Pages deployment to confirm
      it against yet.
