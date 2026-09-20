- [~] **P0-A — vendor the map stack and gate it.**
      (claimed 2026-09-20-1056, wt: tuhura-p0a-vendor) MapLibre GL JS
      (`dist/maplibre-gl.js` + CSS) and the PMTiles ESM adapter, pinned as
      committed bytes into `site/vendor/`, with each library's licence
      carried in `NOTICE`. Adapt the no-deps guard to permit exactly
      `site/vendor/` and nothing else, and add a vendor-pinning check that
      fails when a vendored file's recorded version, integrity hash or
      licence is missing or stale.

      This is the one sanctioned departure from the zero-dependency rule
      (`docs/decisions/2026-08-08-0450-one-vendored-map-dependency.md` and
      `docs/decisions/2026-08-08-0546-vendored-dependencies-rule.md`):
      vendored means **pinned bytes in the repo** — still no build step, no
      CDN, no package manager at runtime. The guard is what keeps that rule
      true after the humans stop watching.

      Needs nothing from outside the project — no key, no account, no
      device. First leaf of Phase 0 because every other leaf imports it.

      review: not warranted — executes decisions two ADRs already took;
      the vendor guard is mechanism, not direction.
