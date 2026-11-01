- [~] ⏳ **P0-B — app shell, service worker, installable. BUILT
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

      [~] CLAIMED 2026-11-01T15:26Z — pass running. Orchestrator: a headless Opus 5.5
      session started by drain session `c87c4ee0` (Opus 5.5) inside this
      repo; both are rule-4 off-tier orchestrators that hold the context
      partition (the `.deferred.md` sibling is held back from the reviewer
      until act 1 is committed) and form no finding and write no severity.
      Reviewer tier: Fable 5.1, checked at selection. Neither orchestrator
      is barred by the brief. Runs under Mike's 2026-11-02 drain approval.

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
