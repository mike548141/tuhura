// Shared error types for the storage seam (ADR 2026-09-20-1116). Every
// backend — the OPFS one today, a native filesystem one later — throws
// exactly these classes, never a bare Error or a platform-native one
// (e.g. OPFS's own `NotFoundError`/`QuotaExceededError` DOMExceptions
// are caught inside the backend and re-thrown as these). That is what
// makes the seam a seam: a caller's `catch` block never needs to know
// which backend it's talking to, on this machine or a future
// Capacitor shell's.

/** `open()` or `delete()` targeted an id with nothing committed under it. */
export class ArchiveNotFoundError extends Error {
  constructor(id) {
    super(`no archive named "${id}"`);
    this.name = "ArchiveNotFoundError";
    this.id = id;
  }
}

/**
 * A committed archive failed a structural check (see the ADR's
 * "Errors and degradation" section for exactly which checks exist
 * today, and which — a manifest checksum — don't yet).
 */
export class ArchiveCorruptError extends Error {
  constructor(id, reason) {
    super(`archive "${id}" is corrupt: ${reason}`);
    this.name = "ArchiveCorruptError";
    this.id = id;
    this.reason = reason;
  }
}

/**
 * A write could not proceed because the origin (OPFS) or device
 * (native) is out of room. `availableBytes` is filled in wherever the
 * backend can determine it, so a caller can show a concrete number
 * rather than a bare failure — `undefined` when the backend genuinely
 * cannot tell (e.g. `storage.estimate()` itself failed).
 */
export class ArchiveQuotaExceededError extends Error {
  constructor(id, requestedBytes, availableBytes) {
    super(
      `writing "${id}" needs ${requestedBytes} more bytes; ` +
        `${availableBytes ?? "an unknown amount"} available`
    );
    this.name = "ArchiveQuotaExceededError";
    this.id = id;
    this.requestedBytes = requestedBytes;
    this.availableBytes = availableBytes;
  }
}

/**
 * A `getBytes(offset, length)` request fell outside `[0, sizeBytes)`.
 * Thrown, never silently clamped or zero-padded: a short read that
 * then decodes as a corrupt tile is a worse failure than a clear one,
 * and this is exactly the shape a truncated or corrupt archive leaves
 * behind.
 */
export class OutOfRangeReadError extends Error {
  constructor(id, offset, length, sizeBytes) {
    super(
      `read [${offset}, ${offset + length}) is outside "${id}" ` +
        `(${sizeBytes} bytes)`
    );
    this.name = "OutOfRangeReadError";
    this.id = id;
    this.offset = offset;
    this.length = length;
    this.sizeBytes = sizeBytes;
  }
}

/**
 * A write arrived at an offset other than exactly where the last one
 * ended. Writes into this seam are sequential-only by design (see
 * chunking.js's SequentialWriteTracker) — this is a caller bug, never
 * a gap to reconcile.
 */
export class OutOfOrderWriteError extends Error {
  constructor(id, expectedOffset, gotOffset) {
    super(
      `write to "${id}" arrived at offset ${gotOffset}, expected ` +
        `${expectedOffset} — writes into this seam are sequential-only`
    );
    this.name = "OutOfOrderWriteError";
    this.id = id;
    this.expectedOffset = expectedOffset;
    this.gotOffset = gotOffset;
  }
}

/** An archive id doesn't satisfy naming.js's grammar. */
export class InvalidArchiveIdError extends Error {
  constructor(id, reason) {
    super(`invalid archive id ${JSON.stringify(id)}: ${reason}`);
    this.name = "InvalidArchiveIdError";
    this.id = id;
    this.reason = reason;
  }
}
