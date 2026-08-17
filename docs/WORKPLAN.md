# Workplan

Phases toward v1, each ending in something demonstrable on a phone with an
explicit **Accept when**. Work top-down; write evidence notes inline as
phases land (the Faves pattern). Parked items live on the board
(`docs/roadmap/`, indexed by `ROADMAP.md`).

## Phase 0 — offline map proof (the riskiest assumption first)

The whole strategy rests on: MapLibre + PMTiles-in-OPFS renders LINZ vector
topo on a phone, installed, in flight mode. Prove it before anything else.

- [ ] Vendor MapLibre GL JS (`dist/maplibre-gl.mjs` + CSS) and pmtiles ESM
      into `site/vendor/`; seed `NOTICE`; adapt the no-deps guard to allow
      exactly `site/vendor/` (per the founding ADR).
- [ ] LINZ Basemaps API key (free tier); fetch `topographic-v2` style +
      glyphs/sprites; render online first.
- [ ] Build one regional PMTiles archive (Wellington/Wairarapa) from the
      LINZ export endpoint via `pmtiles convert`; download into OPFS
      (worker + `createSyncAccessHandle`); wire `FileSource` →
      `pmtiles://` protocol.
- [ ] Minimal app shell + service worker (shell precache only, Faves ADR
      0015 split-version pattern); manifest; installable.
- [ ] Handle WebGL context loss (recreate map); WebGL feature gate.
- [ ] **WKWebView spike** (platform research 2026-08-09; sharpened by the
      2026-08-15 cold review, F8): render the same archive inside a bare
      WKWebView / Capacitor shell, not just Safari, and establish four
      things — (i) MapLibre frame rate behind the shell boundary (the one
      assumption that could still favour a native rewrite); (ii) whether
      OPFS and `navigator.storage.estimate()` work under
      `capacitor://localhost` at all, and what quota they report (the
      15 %-vs-60 % policy is documented; what a shell actually gets is
      not); (iii) whether a service worker registers there — the shell's
      over-the-air update story depends on it (review F3); (iv) that the
      shell sees none of the installed PWA's data (confirms the silo). If
      the storage seam's native backend is prototyped, measure its
      range reads over a multi-GB file with MapLibre's worker parsing —
      the "≈100 lines" estimate is untested. Needs a Mac with Xcode and a
      free Apple ID (7-day device builds), **not** the paid Developer
      Program — this is not spend. An hour now, or a re-architecture later.
- [ ] **Scale/soak rider** (founding review): ≥5 GB of archives written to
      OPFS, device left 7+ days dormant, then cold-start offline render —
      on a real iPhone AND an older iPad. This is the hard half of the
      risk; a happy-path regional render alone does not retire it.

**Accept when**: installed PWA on a real iPhone and Android renders the
region, pans/zooms smoothly, in flight mode, after a cold start — AND the
scale/soak rider passes.

## Phase 1 — the personal layer

User data is **not rebuildable** (unlike tiles) — durability ships with
the first write, not in Phase 3 (founding review).

- [ ] `navigator.storage.persist()` from first write + storage/free-space
      UI; automatic local backup: periodic GPX/JSON snapshot offered to
      Files/Share.
- [ ] Waypoints: typed pins, create/edit/delete on map, photo + note,
      IndexedDB store (model/UI split, unit-tested pure logic,
      `node --test`). Imported/synced text is untrusted input — render
      via the shared `el()` helper only; CSP headers from this phase.
      **The schema carries its time dimension from the first write**
      (atelier PRINCIPLES §9, 2026-08-08): *world time* (when the fix was
      taken / the photo shot / the catch landed) and *record time* (when
      the row was created or last edited — the HLC the sync design already
      needs) as separate fields, never one column doing both; deletion is a
      dated tombstone, not a hard delete (LWW sync needs the tombstone
      anyway); an imported GPX point with no timestamp is stored as
      *unknown*, never as *now*. Cheap on day one, unrecoverable later.
- [ ] Track recording behind a **capability seam** (a location-stream
      interface the future native plugin implements — ADR
      2026-08-08-0545): wake lock + `watchPosition`, filter pipeline
      (accuracy gate, teleport rejection, stationary suppression),
      per-fix persistence, gap banner + segment breaks.
- [ ] GPX import/export (`<input type=file>` in, blob download +
      `navigator.share` out); GeoJSON too.
- [ ] Locate-me + compass heading (normalise iOS `webkitCompassHeading` vs
      Android `deviceorientationabsolute`).

**Accept when**: record a real walk offline, import a watch GPX, both
render as tracks; waypoints survive app restart offline.

## Phase 2 — the access layer (the killer feature)

Framing rule (founding review): present **access, not ownership** —
tenure is not permission, and cadastral lines are not fences. DOC +
Herenga ā Nuku are the go/no-go layers; parcels are context.
Default-deny styling: absence of data never renders as "public".

- [ ] DOC conservation land (CC-BY) + Herenga ā Nuku access layers
      (paper roads, access points) — the primary layers.
- [ ] LINZ primary parcels as context (`parcel_intent`), sized for
      offline first (the 8–12 GB estimate omitted this layer), with its
      daily-update cadence given its own refresh story.
- [ ] Layer switcher with per-layer attribution + currency **on the map
      face**, not only in a card.
- [ ] **MPI marine reserves + fishing rules** (R1, Mike ruled 2026-08-17):
      these are the access layer *at sea* — go/no-go in exactly the sense
      DOC and Herenga ā Nuku are on land, and the review's F10 is that the
      strategy's own logic already put them here. Same default-deny styling
      and same on-map currency date; a closed area whose data is stale must
      say so rather than render as open.

**Accept when**: standing on a boundary in the field, the app shows the
access status of each side, offline, with source and data-date visible —
and the hedge wording has had a legal read-over. The same holds at a
reserve boundary on the water.

## Phase 3 — regions & trip readiness

- [ ] Region download manager: pmtiles extract pipeline (R2-hosted
      archives), progress, **versioned resumable full re-downloads**
      (ETag/If-Range; delta sync is post-v1, evidence-gated — ROADMAP),
      cache-repair manifest, honest per-layer sizes, user-scalable
      coverage. The manifest carries **two dates per layer, kept apart**
      (PRINCIPLES §9): the source's data currency (world time — what the
      map face shows) and the archive's build date (record time — what
      staleness is computed from); one date standing for both is the
      defect the on-map currency rule exists to avoid. Whole-of-NZ is the
      post-v1 *ceiling*, device-permitting;
      the ~1 GB national base is the floor. Multi-archive tile-routing
      design note written before build. Archives sit behind a **storage
      seam** (platform research 2026-08-09) — OPFS backend now, native
      filesystem later: an embedded WebView's origin quota is a quarter of
      Safari's, so a shell that keeps tiles in OPFS *shrinks* capacity, and
      the native side is the durability guarantee `persist()` only
      heuristically approximates. Same discipline as the recorder's
      location-stream seam; cheap now, a rewrite later.
- [ ] **Trip check** (founding review): a pre-departure readiness screen
      run while in coverage — archive integrity, persist() status,
      free-space headroom, layer currency. Discovery at the trailhead is
      too late.
- [ ] Open-Meteo forecast fetch-before-you-go, cached with timestamp;
      sunrise/set computed locally.
- [ ] **GEBCO bathymetry + LINZ hydro vectors** (R1, Mike ruled
      2026-08-17), behind the first-enable modal and the persistent
      **not-for-navigation** badge, with no route-planning over water. The
      badge is not a disclaimer to be dismissed once — it stays on the map
      face while the layer is on. Offline tides remain blocked on the LINZ
      written licence answer and are not part of this.
- [ ] Lighthouse pass + a11y sweep; deploy to Cloudflare Pages.

**Accept when**: quality bar met (Perf ≥ 95, A11y 100, installable) and a
full plan→dark→review trip cycle works on the owner's real weekend —
including one leg on the water, with the not-for-navigation badge visible
throughout and no route drawn over it.

## Phase 4 — activity heroes (one per vertical, prove the thesis)

- [ ] 4WD: track-grade tags on OSM `tracktype` data.
- [ ] Hunting: blood-trail marker mode (rapid one-tap colour-coded pins).
- [ ] Fishing: catch log pin type with moon phase (computed locally);
      tide context joins when the LINZ licence answer arrives — the hero
      ships without its blocked part.
- [ ] Birding: stationary/travelling checklist mode on the personal layer.
- [ ] **One water hero** (R1, Mike ruled 2026-08-17) — the review's F9:
      Phase 4's own one-per-vertical rule left the water with none. The
      candidates recorded are a **dive-site / anchorage log** or a
      **drift / wake track**; which one is a Phase 4 design call, not
      decided by this ruling. It ships without tide context if the LINZ
      licence answer has not arrived — the same discipline the fishing
      hero already takes.

**Accept when**: each vertical has one moment where tūhura beats the app
the owner used before — the water counted as a vertical, not an extra.

## Later (parked → ROADMAP)

E2E sync backend · E2E sharing · offline peer-to-peer share · bird sound
ID · negotiated data (hunting blocks, tides, bathymetry) · community
layers.
