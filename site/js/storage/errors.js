// Shared error types for the storage seam (ADR 2026-09-20-1116, addendum
// 2026-09-25). Every backend — the OPFS one today, a native filesystem
// one later — throws exactly these classes, never a bare Error or a
// platform-native one: OPFS's own `NotFoundError`, `QuotaExceededError`
// and `NoModificationAllowedError` DOMExceptions are caught inside the
// backend and re-thrown as these. That is what makes the seam a seam: a
// caller's `catch` block never needs to know which backend it's talking
// to, on this machine or a future Capacitor shell's.
//
// EVERY ERROR SURVIVES postMessage. The write half runs in a worker and
// the UI does not, so a thrown error reaches the screen only after a
// structured clone — which keeps `name` and `message` and drops the
// class and every own field (cold pass 2026-09-20, F5). Each class
// therefore carries a stable `code`, serialises with `toJSON()`, and is
// rebuilt on the other side by `archiveErrorFromJSON()`. A worker-side
// downloader posts `err.toJSON()`; the main thread revives it and gets
// the same class, fields and `instanceof` back.

export class ArchiveError extends Error {
  /** Stable, backend-independent identifier — the thing a message protocol keys on. */
  static code = "ARCHIVE_ERROR";

  constructor(message, id) {
    super(message);
    this.name = new.target.name;
    this.code = new.target.code;
    this.id = id;
  }

  /** The fields a subclass needs to be rebuilt; overridden per class. */
  details() {
    return { id: this.id };
  }

  toJSON() {
    return { code: this.code, message: this.message, details: this.details() };
  }
}

/** `open()` targeted an id with nothing committed under it. */
export class ArchiveNotFoundError extends ArchiveError {
  static code = "ARCHIVE_NOT_FOUND";
  constructor(id) {
    super(`no archive named "${id}"`, id);
  }
}

/**
 * A committed archive, or a write about to become one, failed a
 * structural check (see the ADR's "Errors and degradation" section for
 * exactly which checks exist today, and which — a manifest checksum —
 * don't yet).
 */
export class ArchiveCorruptError extends ArchiveError {
  static code = "ARCHIVE_CORRUPT";
  constructor(id, reason) {
    super(`archive "${id}" is corrupt: ${reason}`, id);
    this.reason = reason;
  }
  details() {
    return { id: this.id, reason: this.reason };
  }
}

/**
 * A write could not proceed because the origin (OPFS) or device
 * (native) is out of room. `availableBytes` is filled in wherever the
 * backend can determine it, so a caller can show a concrete number
 * rather than a bare failure — `undefined` when the backend genuinely
 * cannot tell (e.g. `storage.estimate()` itself failed).
 */
export class ArchiveQuotaExceededError extends ArchiveError {
  static code = "ARCHIVE_QUOTA_EXCEEDED";
  constructor(id, requestedBytes, availableBytes) {
    super(
      `writing "${id}" needs ${requestedBytes} more bytes; ` +
        `${availableBytes ?? "an unknown amount"} available`,
      id
    );
    this.requestedBytes = requestedBytes;
    this.availableBytes = availableBytes;
  }
  details() {
    return { id: this.id, requestedBytes: this.requestedBytes, availableBytes: this.availableBytes };
  }
}

/**
 * A `getBytes(offset, length)` request fell outside `[0, sizeBytes)`.
 * Thrown, never silently clamped or zero-padded — with one deliberate
 * exception, the pmtiles header probe at offset 0 (see
 * OpfsArchiveHandle.getBytes): a short read that then decodes as a
 * corrupt tile is a worse failure than a clear one, and this is exactly
 * the shape a truncated or corrupt archive leaves behind.
 */
export class OutOfRangeReadError extends ArchiveError {
  static code = "ARCHIVE_READ_OUT_OF_RANGE";
  constructor(id, offset, length, sizeBytes) {
    super(`read [${offset}, ${offset + length}) is outside "${id}" (${sizeBytes} bytes)`, id);
    this.offset = offset;
    this.length = length;
    this.sizeBytes = sizeBytes;
  }
  details() {
    return { id: this.id, offset: this.offset, length: this.length, sizeBytes: this.sizeBytes };
  }
}

/**
 * A write arrived at an offset other than exactly where the last one
 * ended. Writes into this seam are sequential-only by design (see
 * chunking.js's SequentialWriteTracker) — this is a caller bug, never
 * a gap to reconcile.
 */
export class OutOfOrderWriteError extends ArchiveError {
  static code = "ARCHIVE_WRITE_OUT_OF_ORDER";
  constructor(id, expectedOffset, gotOffset) {
    super(
      `write to "${id}" arrived at offset ${gotOffset}, expected ` +
        `${expectedOffset} — writes into this seam are sequential-only`,
      id
    );
    this.expectedOffset = expectedOffset;
    this.gotOffset = gotOffset;
  }
  details() {
    return { id: this.id, expectedOffset: this.expectedOffset, gotOffset: this.gotOffset };
  }
}

/** An archive id doesn't satisfy naming.js's grammar. */
export class InvalidArchiveIdError extends ArchiveError {
  static code = "ARCHIVE_ID_INVALID";
  constructor(id, reason) {
    super(`invalid archive id ${JSON.stringify(id)}: ${reason}`, id);
    this.reason = reason;
  }
  details() {
    return { id: this.id, reason: this.reason };
  }
}

/**
 * `write()` found a staging file for this id left by a download of a
 * *different* version of the archive. Resuming into it would splice two
 * builds of the region and commit cleanly (cold pass F6). The caller
 * decides: resume the old version and `abort()` it, or `delete(id)`.
 */
export class ArchiveVersionMismatchError extends ArchiveError {
  static code = "ARCHIVE_VERSION_MISMATCH";
  constructor(id, existingVersion, requestedVersion) {
    super(
      `"${id}" has a partial download of version "${existingVersion}"; ` +
        `refusing to resume it as version "${requestedVersion}"`,
      id
    );
    this.existingVersion = existingVersion;
    this.requestedVersion = requestedVersion;
  }
  details() {
    return { id: this.id, existingVersion: this.existingVersion, requestedVersion: this.requestedVersion };
  }
}

/** `append()`, `commit()` or `abort()` on a writer that has already committed or aborted. */
export class ArchiveWriterClosedError extends ArchiveError {
  static code = "ARCHIVE_WRITER_CLOSED";
  constructor(id) {
    super(`writer for "${id}" is closed`, id);
  }
}

/**
 * The platform refused because another handle holds the file: a second
 * `write()` for the same id while one is live, or `delete()` during a
 * write. Caller-side sequencing, surfaced typed rather than as the
 * platform's own `NoModificationAllowedError`.
 */
export class ArchiveBusyError extends ArchiveError {
  static code = "ARCHIVE_BUSY";
  constructor(id) {
    super(`"${id}" is held by another open handle`, id);
  }
}

/**
 * The backend cannot provide an operation this platform lacks. Today:
 * `FileSystemFileHandle.move()` absent at commit time. Compat data has
 * it in Safari 15.2, Chrome 102 and Firefox 111, so this should never
 * fire on a target browser — and if it does, the staging file is left
 * intact and resumable rather than copied whole through memory (cold
 * pass F4: the copy fallback could not work at multi-GB scale).
 */
export class ArchiveStoreUnsupportedError extends ArchiveError {
  static code = "ARCHIVE_STORE_UNSUPPORTED";
  constructor(id, feature) {
    super(`cannot finish "${id}": this platform lacks ${feature}`, id);
    this.feature = feature;
  }
  details() {
    return { id: this.id, feature: this.feature };
  }
}

const BY_CODE = new Map(
  [
    [ArchiveNotFoundError, (d) => new ArchiveNotFoundError(d.id)],
    [ArchiveCorruptError, (d) => new ArchiveCorruptError(d.id, d.reason)],
    [ArchiveQuotaExceededError, (d) => new ArchiveQuotaExceededError(d.id, d.requestedBytes, d.availableBytes)],
    [OutOfRangeReadError, (d) => new OutOfRangeReadError(d.id, d.offset, d.length, d.sizeBytes)],
    [OutOfOrderWriteError, (d) => new OutOfOrderWriteError(d.id, d.expectedOffset, d.gotOffset)],
    [InvalidArchiveIdError, (d) => new InvalidArchiveIdError(d.id, d.reason)],
    [ArchiveVersionMismatchError, (d) => new ArchiveVersionMismatchError(d.id, d.existingVersion, d.requestedVersion)],
    [ArchiveWriterClosedError, (d) => new ArchiveWriterClosedError(d.id)],
    [ArchiveBusyError, (d) => new ArchiveBusyError(d.id)],
    [ArchiveStoreUnsupportedError, (d) => new ArchiveStoreUnsupportedError(d.id, d.feature)],
  ].map(([cls, build]) => [cls.code, build])
);

/**
 * Rebuild a seam error from `toJSON()`'s output on the other side of a
 * postMessage. An unknown code — a newer worker talking to an older
 * page, or a message that was never ours — comes back as a plain
 * `ArchiveError` carrying the code and message, never as `undefined`.
 */
export function archiveErrorFromJSON(json) {
  if (!json || typeof json !== "object" || typeof json.code !== "string") {
    throw new TypeError("archiveErrorFromJSON needs the object toJSON() produced");
  }
  const build = BY_CODE.get(json.code);
  if (build) return build(json.details ?? {});
  const err = new ArchiveError(json.message ?? json.code, json.details?.id);
  err.code = json.code;
  return err;
}
