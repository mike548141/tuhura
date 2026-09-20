- [x] **P0-A — vendor the map stack and gate it. DONE 2026-09-20.** MapLibre GL JS
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

      **Landed 2026-09-20.** maplibre-gl 6.10.0 and pmtiles 4.5.0 in
      `site/vendor/`, integrity verified against the registry's own sha512
      rather than trusted; `NOTICE` carries both upstream licence texts in
      full (maplibre's turned out to bundle MIT glfx.js and further
      BSD-3-Clause code, so it is not the single BSD-3-Clause licence a
      summary would have claimed); `tools/vendor_check.py` pins every file
      by sha256 and enforces the no-CDN / no-npm rule, wired into the
      floor's local seam in `.atelier-floor.json` so it runs on every
      commit rather than when someone remembers. Proven to block: a
      one-byte edit to a vendored file reds the floor.

      **The finding worth carrying forward.** pmtiles' declared ESM entry
      (`dist/esm/index.js`) carries a bare `import … from "fflate"`, which
      resolves only under a bundler or an import map — neither of which
      this repo has, and vendoring fflate would be a second dependency no
      ADR covers. The package's own documented answer, `dist/pmtiles.js`,
      is vendored instead: self-contained, fflate inlined, loaded as a
      classic script exposing a global rather than as a module. This is
      recorded in `tools/vendor-manifest.json` so a future re-vendor does
      not "fix" it back to the broken nominal entry.

      **Two scanner suppressions were added, and tested rather than
      asserted.** With `.secretscanignore` / `.leakscanignore` removed,
      `secretscan` reds on `NOTICE` and the manifest (npm sha512 hashes
      read as high entropy), `leakscan` reds on a sha256 substring
      matching the NZ phone shape, and `secretscan` reds on a minified
      maplibre identifier. All false positives of exactly the kind the
      ignore files describe. The real guarantee on those bytes is the
      sha256 pin, which is why wiring it into the floor mattered.
