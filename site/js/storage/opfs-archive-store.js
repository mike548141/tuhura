// OPFS backend for the storage seam (ADR 2026-09-20-1116) — implements
// the ArchiveStore/ArchiveHandle/ArchiveWriter shapes the ADR decides,
// against the browser's origin-private file system.
//
// NOT EXERCISED BY `node --test`. OPFS has no Node implementation, so
// this file carries no unit tests of its own and cannot get any from
// this seam's browser-free half (P0-D's claim). Every piece of logic
// it leans on IS tested: id/filename rules (naming.js), chunk
// planning, range bounds-checking, and the sequential-write bookkeeping
// (chunking.js). What's left here is thin glue over the OPFS API
// surface, plus the one genuinely non-trivial piece — the
// staging→commit sequence — which a browser session must verify
// directly (see the ADR's Consequences and the session report's
// unverified list).
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
// throw propagates unwrapped.

import {
  archiveFileName,
  stagingFileName,
  isStagingFileName,
  archiveIdFromFileName,
  archiveIdFromStagingFileName,
} from "./naming.js";
import { isRangeInBounds, SequentialWriteTracker } from "./chunking.js";
import {
  ArchiveNotFoundError,
  ArchiveCorruptError,
  ArchiveQuotaExceededError,
  OutOfRangeReadError,
} from "./errors.js";

// Every archive lives under one subdirectory of the origin-private
// root, kept apart from any other future OPFS use of this origin.
// There is no second use today, but a named subtree is cheap insurance
// against a later OPFS consumer colliding on filenames.
const ARCHIVE_DIR = "archives";

async function archivesDir({ create = false } = {}) {
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle(ARCHIVE_DIR, { create });
}

/**
 * A committed archive, opened for reading. Deliberately duck-types the
 * vendored pmtiles library's `Source` interface (`getKey()`,
 * `getBytes(offset, length) -> {data}}`) — the ADR's "why range reads
 * are the primitive" — so a caller can hand this straight to
 * `new pmtiles.PMTiles(handle)` with no adapter object in between.
 * `sizeBytes` and `close()` are this seam's own additions, not
 * pmtiles', and a pmtiles-facing caller simply never reads them.
 */
class OpfsArchiveHandle {
  #file; // a browser File snapshot — see getBytes() for what that implies
  #id;

  constructor(id, file) {
    this.#id = id;
    this.#file = file;
  }

  getKey() {
    return this.#id;
  }

  get sizeBytes() {
    return this.#file.size;
  }

  /**
   * The seam's one required read primitive. A `File` from
   * `FileSystemFileHandle.getFile()` is a point-in-time snapshot — per
   * spec its bytes don't change even if the underlying OPFS file is
   * later rewritten — so a read in progress can never be corrupted by
   * a concurrent write elsewhere; the trade-off is that a handle opened
   * before a re-download won't see the new bytes until re-opened. That
   * is *why* this design treats archives as immutable once committed
   * (see naming.js and the writer below): nothing here ever needs the
   * file to change under a live handle.
   */
  async getBytes(offset, length) {
    if (!isRangeInBounds(offset, length, this.#file.size)) {
      throw new OutOfRangeReadError(this.#id, offset, length, this.#file.size);
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
  #dirHandle;
  #stagingHandle; // FileSystemFileHandle
  #syncAccess; // FileSystemSyncAccessHandle — worker-only, see module comment
  #tracker;
  #closed = false;

  constructor(id, dirHandle, stagingHandle, syncAccess, totalBytes) {
    this.#id = id;
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

  /**
   * Append the next sequential chunk. Throws (via the tracker) if
   * `offset` isn't exactly where the last chunk ended — a caller bug,
   * since chunking.js's `planChunks` is the only sanctioned source of
   * offsets, and never silently corrected here.
   */
  async append(offset, bytes) {
    this.#tracker.accept(this.#id, offset, bytes.byteLength);
    // Quota exhaustion surfaces as a platform QuotaExceededError;
    // translate it to this seam's own type so a caller never needs to
    // know which backend it's talking to (ADR: "what crosses the
    // seam"). estimate() is only queried on the failure path — it's
    // its own async round trip, and successful writes are the common
    // case.
    try {
      this.#syncAccess.write(bytes, { at: offset });
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
  }

  /**
   * Publish the staging file as the committed archive. Two steps, in
   * order, so a crash between them leaves the staging file (resumable
   * from `bytesWritten`) rather than an ambiguous half-renamed archive:
   * flush + release the sync access handle (required before the file
   * can be moved or re-opened — a browser allows at most one open sync
   * access handle per file), then publish under the final name.
   *
   * UNVERIFIED (see the ADR and the session report): whether the
   * target browser's `FileSystemFileHandle` exposes `move()` — the
   * atomic path, a single filesystem operation with no bytes copied.
   * Where it's absent this falls back to a copy-then-delete, which is
   * NOT atomic (a crash mid-copy leaves both the staging file and a
   * truncated final file) — acceptable only because `open()` never
   * trusts a final file's presence alone (see OpfsArchiveStore.open,
   * which is the layer that would need a manifest checksum to fully
   * close this gap; none exists yet).
   */
  async commit() {
    if (!this.#tracker.isComplete) {
      throw new ArchiveCorruptError(
        this.#id,
        `commit() called with ${this.#tracker.bytesWritten}/` +
          `${this.#tracker.totalBytes} bytes written`
      );
    }
    this.#syncAccess.flush();
    this.#syncAccess.close();
    this.#closed = true;

    const finalName = archiveFileName(this.#id);
    if (typeof this.#stagingHandle.move === "function") {
      await this.#stagingHandle.move(this.#dirHandle, finalName);
      return;
    }
    const finalHandle = await this.#dirHandle.getFileHandle(finalName, { create: true });
    const finalSync = await finalHandle.createSyncAccessHandle();
    try {
      const file = await this.#stagingHandle.getFile();
      const bytes = new Uint8Array(await file.arrayBuffer());
      finalSync.write(bytes, { at: 0 });
      finalSync.flush();
    } finally {
      finalSync.close();
    }
    await this.#dirHandle.removeEntry(stagingFileName(this.#id));
  }

  /** Discard a partial write and free the space — used when a download is cancelled, not merely paused. */
  async abort() {
    if (!this.#closed) {
      this.#syncAccess.close();
      this.#closed = true;
    }
    await this.#dirHandle.removeEntry(stagingFileName(this.#id)).catch(() => {});
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
   * discovered by writing until EOF. Resuming means re-opening the
   * same deterministic staging file (naming.js) and fast-forwarding
   * the tracker to its current length, rather than restarting a
   * multi-GB download from zero.
   *
   * MUST be called from a worker — see the module comment.
   */
  async write(id, totalBytes) {
    const dir = await archivesDir({ create: true });
    const stagingHandle = await dir.getFileHandle(stagingFileName(id), { create: true });
    const syncAccess = await stagingHandle.createSyncAccessHandle();
    const existingBytes = syncAccess.getSize();
    const writer = new OpfsArchiveWriter(id, dir, stagingHandle, syncAccess, totalBytes);
    if (existingBytes > 0) writer.resumeAt(existingBytes);
    return writer;
  }

  async delete(id) {
    const dir = await archivesDir().catch((err) => {
      if (err && err.name === "NotFoundError") return null;
      throw err;
    });
    if (!dir) return;
    await dir.removeEntry(archiveFileName(id)).catch((err) => {
      if (!err || err.name !== "NotFoundError") throw err;
    });
    // Also clear any orphaned staging file for the same id — otherwise
    // cancelling and re-downloading a region could resume into stale
    // partial bytes left by a completely different, already-deleted
    // download.
    await dir.removeEntry(stagingFileName(id)).catch(() => {});
  }

  /**
   * Every archive, committed or in progress. `state: "partial"`
   * entries are the degrade-visibly hook (CLAUDE.md) a download UI
   * needs: a region stuck mid-download after a killed tab shows up
   * here on next launch instead of silently vanishing. Never cached —
   * every call re-reads the live directory, which is what lets a
   * higher-level "expected regions" manifest notice OPFS quietly
   * dropped one (the ADR's eviction-between-sessions note).
   */
  async list() {
    const dir = await archivesDir().catch(() => null);
    if (!dir) return [];
    const out = [];
    for await (const [name, handle] of dir.entries()) {
      if (handle.kind !== "file") continue;
      const stagingId = archiveIdFromStagingFileName(name);
      if (stagingId !== null) {
        const file = await handle.getFile();
        out.push({ id: stagingId, state: "partial", sizeBytes: file.size });
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
