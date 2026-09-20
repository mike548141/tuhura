- [~] **P0-B — app shell, service worker, installable.**
      (claimed 2026-09-20-1056, wt: tuhura-p0b-shell) A minimal shell
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
