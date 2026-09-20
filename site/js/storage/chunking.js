// Pure arithmetic for the storage seam's bulk paths (ADR
// 2026-09-20-1116): planning how a multi-hundred-MB to multi-GB
// archive download splits into requests, bounds-checking a read
// against the archive's known size, tracking which bytes have
// actually landed in a staging write, and deciding whether a failed
// chunk is worth retrying. None of this touches OPFS, `fetch`, or a
// worker, so it is exercised under `node --test` with no browser
// (tests/storage-chunking.test.js) — the OPFS backend is a thin caller
// of this module, not a reimplementation of it.

import { OutOfOrderWriteError } from "./errors.js";

/**
 * Default chunk size for a region download. 8 MiB balances two costs
 * on a cellular connection in patchy coverage: too small and
 * per-request overhead (TLS handshake, R2 request cost, the
 * await-per-chunk churn of writing to a sync access handle) dominates;
 * too large and a dropped connection partway through a chunk discards
 * more progress than it needed to. A starting point, not a measured
 * number — the platform research's soak-test rider is where this gets
 * earned against a real device, not here.
 */
export const DEFAULT_CHUNK_BYTES = 8 * 1024 * 1024;

/** Split `totalBytes` into `{index, offset, length}` windows of at most `chunkBytes`. */
export function planChunks(totalBytes, chunkBytes = DEFAULT_CHUNK_BYTES) {
  if (!Number.isInteger(totalBytes) || totalBytes < 0) {
    throw new RangeError(`totalBytes must be a non-negative integer, got ${totalBytes}`);
  }
  if (!Number.isInteger(chunkBytes) || chunkBytes <= 0) {
    throw new RangeError(`chunkBytes must be a positive integer, got ${chunkBytes}`);
  }
  const chunks = [];
  let index = 0;
  for (let offset = 0; offset < totalBytes; offset += chunkBytes) {
    chunks.push({ index, offset, length: Math.min(chunkBytes, totalBytes - offset) });
    index += 1;
  }
  return chunks;
}

/**
 * Is a requested `[offset, offset + length)` read inside `[0,
 * sizeBytes)`? PMTiles' own directory format can only point inside an
 * archive it itself wrote, but a *corrupt* or truncated archive — a
 * partial write that somehow escaped the atomic-commit boundary, or
 * bytes lost to a filesystem-level bug — can still hand back a
 * directory entry that points past EOF. This is the one check standing
 * between that and a backend silently handing MapLibre's worker a
 * short or garbage read. Callers throw OutOfRangeReadError (defined in
 * errors.js, not here, so this module stays free of archive-id
 * concerns) when this returns false.
 */
export function isRangeInBounds(offset, length, sizeBytes) {
  if (!Number.isInteger(offset) || offset < 0) {
    throw new RangeError(`offset must be a non-negative integer, got ${offset}`);
  }
  if (!Number.isInteger(length) || length < 0) {
    throw new RangeError(`length must be a non-negative integer, got ${length}`);
  }
  if (!Number.isInteger(sizeBytes) || sizeBytes < 0) {
    throw new RangeError(`sizeBytes must be a non-negative integer, got ${sizeBytes}`);
  }
  return offset + length <= sizeBytes;
}

/**
 * Tracks a sequential, gap-free write into a staging file and refuses
 * anything else. Sequential-only is a deliberate restriction, not a
 * limitation worked around elsewhere: a `FileSystemSyncAccessHandle`
 * can seek and write out of order, but this seam never asks it to,
 * because "did every byte land" then reduces to one number
 * (`bytesWritten`) instead of a set of ranges to reconcile. The
 * download is a stream; this class enforces that assumption rather
 * than silently tolerating its violation.
 */
export class SequentialWriteTracker {
  #bytesWritten = 0;
  #totalBytes;

  constructor(totalBytes) {
    if (!Number.isInteger(totalBytes) || totalBytes < 0) {
      throw new RangeError(`totalBytes must be a non-negative integer, got ${totalBytes}`);
    }
    this.#totalBytes = totalBytes;
  }

  get bytesWritten() {
    return this.#bytesWritten;
  }

  get totalBytes() {
    return this.#totalBytes;
  }

  get isComplete() {
    return this.#bytesWritten === this.#totalBytes;
  }

  /**
   * Fast-forward past bytes that already exist on disk from an
   * earlier, interrupted attempt — used only when resuming a write,
   * and only before this tracker's first `accept()`. Trusts the
   * caller's count rather than re-reading and re-verifying those
   * bytes: verifying correctness (not just presence) needs a manifest
   * checksum this seam doesn't have yet (the ADR's "corrupt archive"
   * discussion covers the gap honestly).
   */
  resumeAt(bytesAlreadyWritten) {
    if (this.#bytesWritten !== 0) {
      throw new Error("resumeAt() must be called before any accept()");
    }
    if (!Number.isInteger(bytesAlreadyWritten) || bytesAlreadyWritten < 0) {
      throw new RangeError(
        `bytesAlreadyWritten must be a non-negative integer, got ${bytesAlreadyWritten}`
      );
    }
    if (bytesAlreadyWritten > this.#totalBytes) {
      throw new RangeError(
        `${bytesAlreadyWritten} already-written bytes exceeds the declared ` +
          `total of ${this.#totalBytes}`
      );
    }
    this.#bytesWritten = bytesAlreadyWritten;
  }

  /**
   * Record a chunk that starts exactly where the last one ended.
   * `id` is carried only for the error message — this class has no
   * other use for it, and naming.js's grammar isn't imposed here so
   * the tracker stays usable in a test with any placeholder string.
   */
  accept(id, offset, length) {
    if (offset !== this.#bytesWritten) {
      throw new OutOfOrderWriteError(id, this.#bytesWritten, offset);
    }
    if (this.#bytesWritten + length > this.#totalBytes) {
      throw new RangeError(
        `write of ${length} bytes at ${offset} would exceed the declared ` +
          `total of ${this.#totalBytes}`
      );
    }
    this.#bytesWritten += length;
  }
}

/**
 * Retry policy for a failed chunk fetch/write. Capped attempts, not
 * unbounded — a region that can never complete (dead link, server
 * outage) must surface as a visible failure (CLAUDE.md: "degrade
 * visibly"), never spin silently forever. Backoff is a fixed
 * exponential-with-ceiling, not jittered: a resumable single-device
 * download's retry cost is "the user waits a bit longer", not
 * "stampede a shared server alongside every other client", so there is
 * nothing jitter buys here — and a fixed formula is a deterministic
 * one to test.
 */
export const MAX_CHUNK_ATTEMPTS = 5;

export function nextRetryDelayMs(attempt, { baseMs = 500, maxMs = 30_000 } = {}) {
  if (!Number.isInteger(attempt) || attempt < 1) {
    throw new RangeError(`attempt must be a positive integer, got ${attempt}`);
  }
  return Math.min(baseMs * 2 ** (attempt - 1), maxMs);
}

/** `attempt` is the attempt about to be made (1-based, after the previous one failed). */
export function shouldRetryChunk(attempt, maxAttempts = MAX_CHUNK_ATTEMPTS) {
  return attempt <= maxAttempts;
}
