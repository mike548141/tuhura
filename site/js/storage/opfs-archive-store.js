// OPFS backend for the storage seam (ADR 2026-09-20-1116, addendum
// 2026-09-25) — implements the ArchiveStore/ArchiveHandle/ArchiveWriter
// shapes the ADR decides, against the browser's origin-private file
// system.
//
// TESTED UNDER NODE OVER A STUBBED OPFS SURFACE (tests/storage-opfs.test.js).
// OPFS has no Node implementation, so what those tests prove is this
// module's *logic* — the staging→commit sequence, the quota path, the
// resume rules, the bounds rule under the real vendored pmtiles parser —
// not the platform's behaviour. The cold pass (2026-09-20, F2) found
// the earlier "unverified by construction" claim false: a 20-line stub
// was enough to show the quota path published a partial archive. What
// still needs a browser is the platform itself: that OPFS exists under
// the installed PWA, `move()` on the target browsers, what
// `storage.estimate()` and `persist()` actually report on a device.
//
// TWO EXECUTION CONTEXTS, ONE MODULE. Reads (`open`/`getBytes`) work
// from either the main thread or a worker — OPFS's async directory API
// (`getDirectory`, `getFileHandle`, `getFile`) is available in both.
// Writes do not: `FileSystemFileHandle.createSyncAccessHandle()` throws
// outside a dedicated worker by spec, not by omission here (ADR
// 2026-08-08-0452's "iOS support floor" note: Safari < 26 has no
// `createWritable` either, so there is no main-thread write path to
// fall back to). Calling `write()` from the main thread is a caller
// error this module cannot detect in advance — the platform's own
// throw propagates unwrapped. A seam error thrown in the worker reaches
// the UI as `err.toJSON()` over postMessage, revived with
// `archiveErrorFromJSON()` (errors.js).

import {
  archiveFileName,
  stagingFileName,
  archiveIdFromFileName,
  parseStagingFileName,
  assertValidArchiveVersion,
} from "./naming.js";
import { isRangeInBounds, SequentialWriteTracker } from "./chunking.js";
import {
  ArchiveNotFoundError,
  ArchiveCorruptError,
  ArchiveQuotaExceededError,
  OutOfRangeReadError,
  ArchiveVersionMismatchError,
  ArchiveWriterClosedError,
  ArchiveBusyError,
  ArchiveStoreUnsupportedError,
} from "./errors.js";

// Every archive lives under one subdirectory of the origin-private
// root, kept apart from any other future OPFS use of this origin.
// There is no second use today, but a named subtree is cheap insurance
// against a later OPFS consumer colliding on filenames.
const ARCHIVE_DIR = "archives";

// pmtiles' first read of any archive is `getBytes(0, 16384)` — the spec
// guarantees header + root directory fit in the first 16 KiB, and the
// library reads that whole window up front. Its own `FetchSource`
// special-cases a 416 at offset 0 for archives smaller than that; the
// seam does the same by clamping *only* that probe (cold pass F1).
const HEADER_PROBE_OFFSET = 0;

async function archivesDir({ create = false } = {}) {
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle(ARCHIVE_DIR, { create });
}

function isBusy(err) {
  return err && (err.name === "NoModificationAllowedError" || err.name === "InvalidStateError");
}

/**
 * A committed archive, opened for reading. Deliberately duck-types the
 * vendored pmtiles library's `Source` interface (`getKey()`,
 * `getBytes(offset, length) -> {data}`) — the ADR's "why range reads
 * are the primitive" — so a caller can hand this straight to
 * `new pmtiles.PMTiles(handle)` with no adapter object in between.
 * tests/storage-opfs.test.js does exactly that, against the real
 * vendored parser. `sizeBytes` and `close()` are this seam's own
 * additions, not pmtiles', and a pmtiles-facing caller never reads them.
 */
class OpfsArchiveHandle {
  #file; // a browser File snapshot — see getBytes() for what that implies
  #id;

  constructor(id, file) {
    this.#id = id;
    this.#file = file;
  }

  /**
   * pmtiles caches headers and directories by this key, and its
   * `Protocol` keys archives by it too, so it must change when the
   * bytes do: a re-downloaded region under a live `PMTiles` instance
   * would otherwise be served from a stale directory cache (cold pass
   * F11). The id plus the committed file's modification time is stable
   * across `open()` calls on the same archive and differs across
   * re-downloads. Callers build the `pmtiles://<key>/…` style URL from
   * this value, never from the bare id.
   */
  getKey() {
    return `${this.#id}@${this.#file.lastModified}`;
  }

  get sizeBytes() {
    return this.#file.size;
  }

  /**
   * The seam's one required read primitive. A `File` from
   * `FileSystemFileHandle.getFile()` carries a snapshot state: if the
   * underlying OPFS file changes after the File was created, reads
   * fail with `NotReadableError` rather than returning either old or
   * new bytes (File API § snapshot state). So a handle can never
   * silently serve a mix of two versions — but a handle opened before
   * a re-download will start *failing* once the new bytes land, not
   * keep working on the old ones. That is why this design treats
   * archives as immutable once committed and asks callers to re-open
   * after a re-download: nothing here ever needs the file to change
   * under a live handle.
   */
  async getBytes(offset, length) {
    if (!isRangeInBounds(offset, length, this.#file.size)) {
      if (offset === HEADER_PROBE_OFFSET && length > this.#file.size) {
        length = this.#file.size; // the library's own header probe; see HEADER_PROBE_OFFSET
      } else {
        throw new OutOfRangeReadError(this.#id, offset, length, this.#file.size);
      }
    }
    const data = await this.#file.slice(offset, offset + length).arrayBuffer();
    return { data };
  }

  close() {
    // No handle to release — see the class comment above. Present so a
    // caller written against "call close() when done" (the shape a
    // native backend's real file descriptor will need) never needs an
    // `if (handle.close)` guard.
  }
}

/**
 * A staging write in progress. `append()` is the only way to put bytes
 * in — no seek, no random access — matching SequentialWriteTracker's
 * restriction one layer down. `commit()` is the atomic-publish
 * boundary the ADR's degrade-visibly rule leans on: this class only
 * guarantees a half-written archive is never mistaken for a whole one;
 * the caller owns telling the user about it.
 */
class OpfsArchiveWriter {
  #id;
  #version;
  #dirHandle;
  #stagingHandle; // FileSystemFileHandle
  #syncAccess; // FileSystemSyncAccessHandle — worker-only, see module comment
  #tracker;
  #closed = false;

  constructor(id, version, dirHandle, stagingHandle, syncAccess, totalBytes) {
    this.#id = id;
    this.#version = version;
    this.#dirHandle = dirHandle;
    this.#stagingHandle = stagingHandle;
    this.#syncAccess = syncAccess;
    this.#tracker = new SequentialWriteTracker(totalBytes);
  }

  /** Fast-forward past bytes an earlier, interrupted attempt already wrote. Store-internal; see OpfsArchiveStore.write(). */
  resumeAt(bytesAlreadyWritten) {
    this.#tracker.resumeAt(bytesAlreadyWritten);
  }

  get bytesWritten() {
    return this.#tracker.bytesWritten;
  }

  get version() {
    return this.#version;
  }

  /**
   * Append the next sequential chunk. The tracker checks the offset
   * *before* the write and counts the bytes *after* it lands, so a
   * failed write — quota or anything else — leaves `bytesWritten`
   * equal to what is actually on disk and the same chunk can be
   * retried (cold pass F2). Throws (via the tracker) if `offset` isn't
   * exactly where the last chunk ended — a caller bug, since
   * chunking.js's `planChunks` is the only sanctioned source of
   * offsets, and never silently corrected here.
   */
  async append(offset, bytes) {
    if (this.#closed) throw new ArchiveWriterClosedError(this.#id);
    this.#tracker.assertNext(this.#id, offset, bytes.byteLength);
    // Quota exhaustion surfaces as a platform QuotaExceededError;
    // translate it to this seam's own type so a caller never needs to
    // know which backend it's talking to (ADR: "what crosses the
    // seam"). estimate() is only queried on the failure path — it's
    // its own async round trip, and successful writes are the common
    // case.
    let written;
    try {
      written = this.#syncAccess.write(bytes, { at: offset });
    } catch (err) {
      if (err && err.name === "QuotaExceededError") {
        let availableBytes;
        try {
          const est = await navigator.storage.estimate();
          availableBytes = est.quota - est.usage;
        } catch {
          availableBytes = undefined;
        }
        throw new ArchiveQuotaExceededError(this.#id, bytes.byteLength, availableBytes);
      }
      throw err;
    }
    if (written !== bytes.byteLength) {
      // A short write is not a retry case: the bytes on disk past
      // `bytesWritten` are now unknown, and the tracker has not moved.
      throw new ArchiveCorruptError(
        this.#id,
        `short write: ${written} of ${bytes.byteLength} bytes landed at ${offset}`
      );
    }
    this.#tracker.accept(this.#id, offset, bytes.byteLength);
  }

  /**
   * Publish the staging file as the committed archive. Two steps, in
   * order, so a crash between them leaves the staging file (resumable
   * from `bytesWritten`) rather than an ambiguous half-renamed archive:
   * flush + release the sync access handle (required before the file
   * can be moved or re-opened — a browser allows at most one open sync
   * access handle per file), then `move()` it under the final name — a
   * single filesystem operation with no bytes copied. There is no
   * copy-then-delete fallback: one would have to pull a multi-GB file
   * through memory and would leave a truncated final file that `open()`
   * cannot tell from a whole one (cold pass F4). Where `move()` is
   * absent the write stops typed, with the staging file intact.
   */
  async commit() {
    if (this.#closed) throw new ArchiveWriterClosedError(this.#id);
    if (!this.#tracker.isComplete) {
      throw new ArchiveCorruptError(
        this.#id,
        `commit() called with ${this.#tracker.bytesWritten}/` +
          `${this.#tracker.totalBytes} bytes written`
      );
    }
    if (typeof this.#stagingHandle.move !== "function") {
      throw new ArchiveStoreUnsupportedError(this.#id, "FileSystemFileHandle.move()");
    }
    this.#syncAccess.flush();
    this.#syncAccess.close();
    this.#closed = true;
    await this.#stagingHandle.move(this.#dirHandle, archiveFileName(this.#id));
  }

  /** Discard a partial write and free the space — used when a download is cancelled, not merely paused. */
  async abort() {
    if (this.#closed) throw new ArchiveWriterClosedError(this.#id);
    this.#syncAccess.close();
    this.#closed = true;
    await this.#dirHandle.removeEntry(stagingFileName(this.#id, this.#version)).catch(() => {});
  }
}

export class OpfsArchiveStore {
  async open(id) {
    let dir;
    try {
      dir = await archivesDir();
    } catch (err) {
      if (err && err.name === "NotFoundError") throw new ArchiveNotFoundError(id);
      throw err;
    }
    let fileHandle;
    try {
      fileHandle = await dir.getFileHandle(archiveFileName(id));
    } catch (err) {
      if (err && err.name === "NotFoundError") throw new ArchiveNotFoundError(id);
      throw err;
    }
    const file = await fileHandle.getFile();
    return new OpfsArchiveHandle(id, file);
  }

  /**
   * Begin (or resume) a write. `totalBytes` is the declared final
   * size, known up front from the download's own manifest (ADR
   * 2026-08-08-0452: "a manifest of expected archives"), not
   * discovered by writing until EOF. `version` names the build being
   * downloaded (naming.js). Resuming means re-opening the same
   * deterministic staging file for that (id, version) and
   * fast-forwarding the tracker to its current length, rather than
   * restarting a multi-GB download from zero; a staging file for a
   * *different* version is refused, never spliced (cold pass F6).
   *
   * MUST be called from a worker — see the module comment.
   */
  async write(id, totalBytes, version) {
    assertValidArchiveVersion(version);
    const dir = await archivesDir({ create: true });
    for await (const [name, handle] of dir.entries()) {
      if (handle.kind !== "file") continue;
      const staged = parseStagingFileName(name);
      if (staged && staged.id === id && staged.version !== version) {
        throw new ArchiveVersionMismatchError(id, staged.version, version);
      }
    }
    const stagingHandle = await dir.getFileHandle(stagingFileName(id, version), { create: true });
    let syncAccess;
    try {
      syncAccess = await stagingHandle.createSyncAccessHandle();
    } catch (err) {
      if (isBusy(err)) throw new ArchiveBusyError(id);
      throw err;
    }
    const existingBytes = syncAccess.getSize();
    const writer = new OpfsArchiveWriter(id, version, dir, stagingHandle, syncAccess, totalBytes);
    if (existingBytes > 0) {
      try {
        writer.resumeAt(existingBytes);
      } catch (err) {
        // A staging file longer than the declared total is not this
        // version's download, whatever its name says.
        syncAccess.close();
        throw new ArchiveCorruptError(
          id,
          `staging file holds ${existingBytes} bytes, more than the declared ${totalBytes}`
        );
      }
    }
    return writer;
  }

  /**
   * Remove a committed archive and every staging file for the id, any
   * version. Idempotent: a missing archive is not an error, because
   * the caller's intent — "nothing under this id" — is already true.
   */
  async delete(id) {
    archiveFileName(id); // validates the id before touching the filesystem
    const dir = await archivesDir().catch((err) => {
      if (err && err.name === "NotFoundError") return null;
      throw err;
    });
    if (!dir) return;
    const names = [];
    for await (const [name, handle] of dir.entries()) {
      if (handle.kind !== "file") continue;
      if (archiveIdFromFileName(name) === id) names.push(name);
      const staged = parseStagingFileName(name);
      // Also clear orphaned staging files for the same id — otherwise
      // cancelling and re-downloading a region could resume into stale
      // partial bytes left by a completely different, already-deleted
      // download.
      if (staged && staged.id === id) names.push(name);
    }
    for (const name of names) {
      try {
        await dir.removeEntry(name);
      } catch (err) {
        if (err && err.name === "NotFoundError") continue;
        if (isBusy(err)) throw new ArchiveBusyError(id);
        throw err;
      }
    }
  }

  /**
   * Every archive, committed or in progress. `state: "partial"`
   * entries (which carry their `version`) are the degrade-visibly hook
   * (CLAUDE.md) a download UI needs: a region stuck mid-download after
   * a killed tab shows up here on next launch instead of silently
   * vanishing. An id can appear twice — once ready, once partial —
   * while a newer version is downloading over a committed one. Never
   * cached — every call re-reads the live directory, which is what lets
   * a higher-level "expected regions" manifest notice OPFS quietly
   * dropped one (the ADR's eviction-between-sessions note).
   */
  async list() {
    const dir = await archivesDir().catch(() => null);
    if (!dir) return [];
    const out = [];
    for await (const [name, handle] of dir.entries()) {
      if (handle.kind !== "file") continue;
      const staged = parseStagingFileName(name);
      if (staged !== null) {
        const file = await handle.getFile();
        out.push({ id: staged.id, state: "partial", version: staged.version, sizeBytes: file.size });
        continue;
      }
      const id = archiveIdFromFileName(name);
      if (id === null) continue; // not one of ours — ignore, don't fail list()
      const file = await handle.getFile();
      out.push({ id, state: "ready", sizeBytes: file.size });
    }
    return out;
  }

  /**
   * Origin-wide storage headroom — not per-archive; OPFS has one quota
   * per origin, shared with every other use of it. Returns null when
   * the API is unavailable rather than throwing: quota reporting is
   * advisory everywhere it exists on the web (the platform research:
   * `persist()` is heuristic, and so is `estimate()`), so a "space
   * remaining" UI should treat "unknown" as its own visible state, not
   * an error.
   */
  async quota() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    const est = await navigator.storage.estimate();
    if (est.quota == null || est.usage == null) return null;
    return {
      usageBytes: est.usage,
      quotaBytes: est.quota,
      availableBytes: est.quota - est.usage,
    };
  }

  /**
   * Requests eviction exemption (ADR 2026-08-08-0452, ARCHITECTURE.md
   * "Offline data lifecycle"). Best-effort by design — WebKit's own
   * documentation calls this heuristic-granted, not contractual — and
   * the boolean return is the only signal a caller ever gets; there is
   * no "why not" from the platform.
   */
  async persist() {
    if (!navigator.storage || !navigator.storage.persist) return false;
    return navigator.storage.persist();
  }
}
