// Unit tests for site/js/storage/errors.js — every seam error survives
// the worker→main boundary as JSON and comes back as the same class
// with the same fields (cold pass 2026-09-20, F5).

import test from "node:test";
import assert from "node:assert/strict";
import {
  ArchiveError,
  ArchiveNotFoundError,
  ArchiveCorruptError,
  ArchiveQuotaExceededError,
  OutOfRangeReadError,
  OutOfOrderWriteError,
  InvalidArchiveIdError,
  ArchiveVersionMismatchError,
  ArchiveWriterClosedError,
  ArchiveBusyError,
  ArchiveStoreUnsupportedError,
  archiveErrorFromJSON,
} from "../site/js/storage/errors.js";

const SAMPLES = [
  new ArchiveNotFoundError("wellington"),
  new ArchiveCorruptError("wellington", "short write"),
  new ArchiveQuotaExceededError("wellington", 8_388_608, 120_000),
  new ArchiveQuotaExceededError("wellington", 8_388_608, undefined),
  new OutOfRangeReadError("wellington", 100, 50, 120),
  new OutOfOrderWriteError("wellington", 16, 8),
  new InvalidArchiveIdError("Bad Id", "must be lowercase"),
  new ArchiveVersionMismatchError("wellington", "etag1", "etag2"),
  new ArchiveWriterClosedError("wellington"),
  new ArchiveBusyError("wellington"),
  new ArchiveStoreUnsupportedError("wellington", "FileSystemFileHandle.move()"),
];

test("every seam error is an ArchiveError with a distinct stable code", () => {
  const codes = new Set();
  for (const err of SAMPLES) {
    assert.ok(err instanceof ArchiveError);
    assert.ok(err instanceof Error);
    assert.equal(err.name, err.constructor.name);
    assert.equal(err.code, err.constructor.code);
    codes.add(err.code);
  }
  assert.equal(codes.size, SAMPLES.length - 1); // the two quota samples share a code
});

test("toJSON → JSON string → archiveErrorFromJSON rebuilds the same class, message and fields", () => {
  for (const original of SAMPLES) {
    const wire = JSON.parse(JSON.stringify(original)); // what postMessage's structured clone would carry
    const revived = archiveErrorFromJSON(wire);
    assert.equal(revived.constructor, original.constructor, original.code);
    assert.equal(revived.message, original.message);
    assert.deepEqual(revived.details(), original.details());
    assert.equal(revived.code, original.code);
  }
});

test("an unknown code revives as a plain ArchiveError carrying the code, never undefined", () => {
  const revived = archiveErrorFromJSON({ code: "ARCHIVE_FROM_THE_FUTURE", message: "hello", details: { id: "x" } });
  assert.ok(revived instanceof ArchiveError);
  assert.equal(revived.code, "ARCHIVE_FROM_THE_FUTURE");
  assert.equal(revived.message, "hello");
  assert.equal(revived.id, "x");
});

test("archiveErrorFromJSON rejects input that is not a serialised seam error", () => {
  for (const bad of [null, undefined, 42, "ARCHIVE_BUSY", {}, { message: "no code" }]) {
    assert.throws(() => archiveErrorFromJSON(bad), TypeError);
  }
});
