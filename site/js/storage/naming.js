// Archive naming and path rules for the storage seam (ADR
// 2026-09-20-1116). Kept pure and separate from the OPFS backend for
// two reasons: it can be unit tested with no browser (`node --test`,
// CLAUDE.md's dev loop), and a future native-filesystem backend reuses
// these exact rules instead of re-deriving them — the id→filename
// mapping is part of the seam's contract, not an OPFS implementation
// detail.
//
// WHY A STRICT ID GRAMMAR. An archive id becomes a filename — first in
// OPFS (`FileSystemDirectoryHandle.getFileHandle`), later on a native
// filesystem. Both mishandle path separators, leading dots (which this
// module already reserves for its own staging convention below), and
// whitespace, and unlike a DOM API a filesystem gives no escaping
// safety net. Region ids are expected to come from this app's own
// slugs ("wellington", "wairarapa-coast" — matching how regions are
// already named in ARCHITECTURE.md prose), so the grammar only needs
// to admit that shape, not arbitrary Unicode.
//
// WHY A VERSION IN THE STAGING NAME (addendum 2026-09-25, cold pass F6).
// A staging file is resumed by byte count alone. If the upstream archive
// was rebuilt between attempts, resuming splices two builds and commits
// cleanly. So a write names the version it is downloading — any token
// the caller can derive from the source (an ETag, a build date, a
// content hash), lower-cased to this grammar — and `write()` refuses to
// resume a staging file carrying a different one.

import { InvalidArchiveIdError } from "./errors.js";

export const ARCHIVE_EXT = ".pmtiles";
const STAGING_SUFFIX = ".part";
const MAX_ID_LENGTH = 64;
const MAX_VERSION_LENGTH = 64;

// Lowercase kebab-case only: a-z, 0-9, single hyphens as separators.
// Excludes every character that means something special to a
// filesystem (/, ., leading -, whitespace, NUL) by simply never
// admitting it.
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// A version token is narrower still — no hyphens — so it can never be
// confused with the id it follows in a staging name.
const VERSION_PATTERN = /^[a-z0-9]+$/;

/** Throws InvalidArchiveIdError if `id` isn't a valid archive id; returns it unchanged otherwise. */
export function assertValidArchiveId(id) {
  if (typeof id !== "string" || id.length === 0) {
    throw new InvalidArchiveIdError(id, "must be a non-empty string");
  }
  if (id.length > MAX_ID_LENGTH) {
    throw new InvalidArchiveIdError(id, `longer than ${MAX_ID_LENGTH} characters`);
  }
  if (!ID_PATTERN.test(id)) {
    throw new InvalidArchiveIdError(
      id,
      "must be lowercase kebab-case (a-z, 0-9, single hyphens between parts)"
    );
  }
  return id;
}

/** Throws InvalidArchiveIdError if `version` isn't a valid version token; returns it otherwise. */
export function assertValidArchiveVersion(version) {
  if (typeof version !== "string" || version.length === 0) {
    throw new InvalidArchiveIdError(version, "version must be a non-empty string");
  }
  if (version.length > MAX_VERSION_LENGTH) {
    throw new InvalidArchiveIdError(version, `version longer than ${MAX_VERSION_LENGTH} characters`);
  }
  if (!VERSION_PATTERN.test(version)) {
    throw new InvalidArchiveIdError(version, "version must be lowercase a-z, 0-9 only");
  }
  return version;
}

/** The published, readable filename for a committed archive. */
export function archiveFileName(id) {
  assertValidArchiveId(id);
  return `${id}${ARCHIVE_EXT}`;
}

/**
 * The in-progress write target's filename: `.<id>.<version>.pmtiles.part`.
 * A leading dot keeps it visibly apart from `list()`'s committed results
 * and mirrors the rsync/editor convention of a dot-prefixed temp file
 * meaning "not done yet, don't touch". The name is deterministic per
 * (id, version) — not a fresh random name per attempt — so a crashed
 * download resumes into the *same* staging file next session rather
 * than orphaning a new one every time; orphan cleanup then reduces to
 * "does this staging file's id have a live download", not a sweep for
 * stray UUIDs.
 */
export function stagingFileName(id, version) {
  assertValidArchiveId(id);
  assertValidArchiveVersion(version);
  return `.${id}.${version}${ARCHIVE_EXT}${STAGING_SUFFIX}`;
}

export function isStagingFileName(name) {
  return (
    typeof name === "string" &&
    name.startsWith(".") &&
    name.endsWith(`${ARCHIVE_EXT}${STAGING_SUFFIX}`)
  );
}

export function isArchiveFileName(name) {
  return (
    typeof name === "string" &&
    name.endsWith(ARCHIVE_EXT) &&
    !name.startsWith(".") &&
    name.length > ARCHIVE_EXT.length
  );
}

/** Reverse of archiveFileName — null if `name` isn't a committed archive's filename. */
export function archiveIdFromFileName(name) {
  if (!isArchiveFileName(name)) return null;
  const id = name.slice(0, -ARCHIVE_EXT.length);
  try {
    return assertValidArchiveId(id);
  } catch {
    return null;
  }
}

/** Reverse of stagingFileName — `{id, version}`, or null if `name` isn't a staging filename. */
export function parseStagingFileName(name) {
  if (!isStagingFileName(name)) return null;
  const suffixLength = ARCHIVE_EXT.length + STAGING_SUFFIX.length;
  const body = name.slice(1, -suffixLength);
  const dot = body.lastIndexOf(".");
  if (dot <= 0) return null;
  try {
    return {
      id: assertValidArchiveId(body.slice(0, dot)),
      version: assertValidArchiveVersion(body.slice(dot + 1)),
    };
  } catch {
    return null;
  }
}

/** The id alone from a staging filename — null if it isn't one. */
export function archiveIdFromStagingFileName(name) {
  const parsed = parseStagingFileName(name);
  return parsed ? parsed.id : null;
}
