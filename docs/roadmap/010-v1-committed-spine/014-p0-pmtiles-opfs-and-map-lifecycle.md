- [ ] **P0-D — PMTiles in OPFS, and the map's lifecycle.** Build one
      regional archive (Wellington / Wairarapa) with `pmtiles convert`,
      download it into OPFS from a worker using `createSyncAccessHandle`,
      and wire a `FileSource` behind the `pmtiles://` protocol so MapLibre
      reads range requests out of local storage
      (`docs/decisions/2026-08-08-0452-pmtiles-in-opfs.md`).

      Two lifecycle obligations ship with it, because a map that dies in the
      field is worse than no map: **WebGL context loss** must recreate the
      map rather than leave a dead canvas, and a **WebGL feature gate** must
      say so plainly on a device that cannot render at all.

      The archive sits behind the **storage seam** (platform research
      2026-08-09) — an OPFS backend now, a native filesystem later. An
      embedded WebView's origin quota is a fraction of Safari's, so a shell
      that keeps tiles in OPFS *shrinks* capacity; the seam is what makes
      that a backend swap instead of a rewrite. Same discipline as the
      recorder's location-stream seam: cheap now, a rewrite later.

      **Partly blocked**: generating the archive needs the LINZ export
      endpoint (P0-C's key question) and the `pmtiles` CLI, which is a tool
      install and therefore Mike's to approve. The OPFS plumbing, the seam
      and the lifecycle handling can all be built and tested against a small
      synthetic archive first, and should be.

      review: queued — the storage seam's shape is direction, and it
      forecloses alternatives for every later region feature.

      **The browser-free half landed 2026-09-20; the claim is released and
      the item stays open.** Delivered: the seam's shape
      (`docs/decisions/2026-09-20-1116-archive-store-seam.md`), its OPFS
      backend and extracted pure logic under `site/js/storage/`, and
      `tools/make_fixture_pmtiles.py` — a spec-valid synthetic PMTiles v3
      archive generator written against the fetched spec at a recorded
      revision, so tests never need a multi-gigabyte LINZ download or the
      `pmtiles` CLI (an unapproved tool install, deliberately not made).

      The seam's read half duck-types the vendored pmtiles library's own
      `Source` contract, so an `ArchiveHandle` is handed straight to
      `new pmtiles.PMTiles(handle)` with no adapter. *As first landed,
      that sentence was never tested* — the one library-backed test parsed
      the generated fixture through the library's own `FileSource`, which
      verified the generator, not the seam (cold pass F1). Since 2026-09-25
      the seam's handle itself is driven under `PMTiles` by
      `tests/storage-opfs.test.js`.

      **What is still owed, and it is the runtime half.** OPFS does not
      exist outside a browser, so what `tests/storage-opfs.test.js` proves
      over its in-memory stand-in is the backend's *logic* (staging →
      commit, the quota path, resume, the bounds rule under the real
      parser), never the platform's behaviour. Also still open:
      wiring the `pmtiles://` protocol into MapLibre, WebGL context-loss
      recovery, the WebGL feature gate, and building a real regional
      archive (which needs P0-C's key question settled first).

      A browser session must confirm: that OPFS works at all under the
      installed PWA; whether `FileSystemFileHandle.move()` exists on the
      target browsers or the copy-then-delete fallback is the live path;
      and what `storage.estimate()` and `persist()` actually report on a
      real device rather than what the policy documents claim.

      🎯 **Cold pass closed 2026-09-20 — FAIL-WITH-MAJORS**
      (`docs/reviews/2026-09-20-2236-archive-store-seam.md`). F1: the seam's
      handle breaks pmtiles' 16 KiB header probe and was never put under
      `PMTiles` in a test — the library verified the *fixture*, not the seam.
      F2: a failed write advances the tracker, so the retry is refused and
      `commit()` publishes a partial archive; proven with a 20-line OPFS stub,
      which also shows this file *is* testable. F3: the generator's TileIDs
      are wrong from z2 up. F1–F11 are Mike's under rule 3; the fix set earns
      its own `⏳`.

      **The fix set landed 2026-09-25** on Mike's ruling (all eleven
      accepted): F1 the header probe clamps at offset 0 and the handle is
      tested under `PMTiles` both sides of 16 KiB; F2 the tracker counts
      after the write and `commit()` cannot publish short; F3 the
      generator's TileIDs are a proven bijection over z0–z4; F4 no copy
      fallback; F5 every error carries a code and round-trips through
      JSON; F6 writes are versioned and a mismatch is refused; F7 ten
      typed errors, idempotent delete; F8/F9 in the ADR's addendum; F10
      ARCHITECTURE names the seam; F11 tidied. 55 tests. The application
      carries its own `⏳` (`../040-queued-reviews/030-seam-fixes-application.md`).
