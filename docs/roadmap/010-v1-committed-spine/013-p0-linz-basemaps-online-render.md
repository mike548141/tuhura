- [ ] 🎯 **P0-C — online render against LINZ Basemaps.** Fetch the
      `topographic-v2` style JSON plus glyphs and sprites, and render the
      LINZ vector topo online, before any offline path exists — the cheapest
      way to prove the style and the vendored renderer agree.

      **Blocked on Mike — an API key is a secret, and secrets are floor.**
      LINZ Basemaps issues a free-tier key; creating it is an account action
      and a credential, so this session did not create one. Two things are
      owed together, and the second is the interesting one:

      1. 🎯 Obtain a free-tier LINZ Basemaps API key.
      2. 🎯 **Decide where it lives.** This repo is public and has no build
         step, so an embedded key is published the moment it is committed.
         Some basemap providers issue deliberately-public, domain-restricted
         keys for exactly this; whether LINZ's free tier is one of those is
         **unverified** and must be read off LINZ's own terms before anything
         is committed — not assumed from how other providers behave.

      **The scoping insight that may shrink this leaf to nothing.** tūhura is
      offline-primary: once a PMTiles archive is built and self-hosted, the
      running app reads tiles from OPFS, and glyphs and sprites can be
      vendored alongside the style. On that path the key is needed only to
      *generate* archives — a build-time credential on a workstation, never
      shipped — and the app embeds no key at all. If that holds, the honest
      answer is not "hide the key well" but "the product does not carry one".
      Settle this before wiring any key into `site/`.

      review: queued — this decides whether a credential exists in the
      deployed artefact at all, which is direction, not plumbing.

      ⏳ 📝 BRIEF WRITTEN 2026-11-02 by a brief-writing sub-agent (Claude
      Opus 5.5) of session `2be3482c`, a non-author:
      `docs/reviews/2026-11-02-1157-p0c-basemap-credential-cold.md`, with its
      `.deferred.md` sibling. A design-time pass on the direction above,
      before the key exists. Tier at selection: Fable. **Fable-gated: it
      runs only on Mike's explicit approval.** The taker reads the brief and
      runs the pass; it does not rewrite the brief.
