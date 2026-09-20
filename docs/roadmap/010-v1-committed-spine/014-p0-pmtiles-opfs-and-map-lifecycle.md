- [~] **P0-D — PMTiles in OPFS, and the map's lifecycle.**
      (claimed 2026-09-20-1134, wt: tuhura-p0d-storage-seam — the
      browser-free half only: the seam's shape, its OPFS backend and a
      synthetic archive fixture. Runtime OPFS and MapLibre wiring stay
      open behind this claim.) Build one
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
