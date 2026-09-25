// Unit tests for site/js/storage/naming.js — the id/filename rules the
// storage seam's OPFS backend (and, later, a native one) both build on
// (ADR 2026-09-20-1116). Pure functions, no browser: `node --test`.

import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCHIVE_EXT,
  assertValidArchiveId,
  assertValidArchiveVersion,
  archiveFileName,
  stagingFileName,
  isStagingFileName,
  isArchiveFileName,
  archiveIdFromFileName,
  archiveIdFromStagingFileName,
  parseStagingFileName,
} from "../site/js/storage/naming.js";
import { InvalidArchiveIdError } from "../site/js/storage/errors.js";

test("assertValidArchiveId accepts kebab-case ids", () => {
  for (const id of ["wellington", "wairarapa-coast", "a", "a1-b2-c3"]) {
    assert.equal(assertValidArchiveId(id), id);
  }
});

test("assertValidArchiveId rejects the shapes a filesystem would mishandle", () => {
  const bad = [
    "", // empty
    "Wellington", // uppercase
    "wellington ", // trailing space
    " wellington", // leading space
    "-wellington", // leading hyphen
    "wellington-", // trailing hyphen
    "wellington--coast", // double hyphen
    "wellington/coast", // path separator
    "../etc", // traversal
    "wellington.pmtiles", // embeds the extension
    ".wellington", // leading dot (staging convention)
    "wellington_coast", // underscore not admitted
    "a".repeat(65), // over the length cap
  ];
  for (const id of bad) {
    assert.throws(() => assertValidArchiveId(id), InvalidArchiveIdError, `expected ${JSON.stringify(id)} to be rejected`);
  }
});

test("assertValidArchiveId rejects non-strings", () => {
  for (const id of [null, undefined, 42, {}, []]) {
    assert.throws(() => assertValidArchiveId(id), InvalidArchiveIdError);
  }
});

test("assertValidArchiveVersion admits a bare lowercase token and nothing that could read as an id", () => {
  for (const v of ["v1", "etag9f3a", "20260925", "a"]) assert.equal(assertValidArchiveVersion(v), v);
  for (const v of ["", "V1", "v-1", "v.1", "v 1", "a".repeat(65), null, 7]) {
    assert.throws(() => assertValidArchiveVersion(v), InvalidArchiveIdError, `expected ${JSON.stringify(v)} rejected`);
  }
});

test("archiveFileName and stagingFileName round-trip through the extractors", () => {
  const id = "wairarapa-coast";
  const finalName = archiveFileName(id);
  const staging = stagingFileName(id, "etag1");

  assert.equal(finalName, `wairarapa-coast${ARCHIVE_EXT}`);
  assert.equal(staging, `.wairarapa-coast.etag1${ARCHIVE_EXT}.part`);

  assert.equal(isArchiveFileName(finalName), true);
  assert.equal(isStagingFileName(finalName), false);
  assert.equal(isStagingFileName(staging), true);
  assert.equal(isArchiveFileName(staging), false);

  assert.equal(archiveIdFromFileName(finalName), id);
  assert.equal(archiveIdFromStagingFileName(staging), id);
  assert.deepEqual(parseStagingFileName(staging), { id, version: "etag1" });
});

test("archiveFileName and stagingFileName reject an invalid id or version before touching the filesystem", () => {
  assert.throws(() => archiveFileName("Not Valid"), InvalidArchiveIdError);
  assert.throws(() => stagingFileName("Not Valid", "v1"), InvalidArchiveIdError);
  assert.throws(() => stagingFileName("wellington", "Not-Valid"), InvalidArchiveIdError);
  assert.throws(() => stagingFileName("wellington"), InvalidArchiveIdError); // version is required
});

test("archiveIdFromFileName returns null for anything that isn't a committed archive's name", () => {
  for (const name of [
    "readme.txt",
    ".wellington.v1.pmtiles.part", // a staging name, not a final one
    "wellington.PMTILES", // wrong case extension
    "wellington", // no extension at all
    ARCHIVE_EXT, // bare extension, empty id
  ]) {
    assert.equal(archiveIdFromFileName(name), null, `expected ${JSON.stringify(name)} to yield null`);
  }
});

test("parseStagingFileName returns null for anything that isn't a staging name", () => {
  for (const name of [
    "wellington.pmtiles",
    "wellington",
    ".wellington.pmtiles", // no .part
    ".wellington.pmtiles.part", // the pre-version shape: no version token
    ".Wellington.v1.pmtiles.part", // invalid id
    ".wellington.V1.pmtiles.part", // invalid version
    "readme.txt",
  ]) {
    assert.equal(parseStagingFileName(name), null, `expected ${JSON.stringify(name)} to yield null`);
    assert.equal(archiveIdFromStagingFileName(name), null);
  }
});

test("the extractors reject non-string input without throwing", () => {
  for (const name of [null, undefined, 42, {}]) {
    assert.equal(archiveIdFromFileName(name), null);
    assert.equal(archiveIdFromStagingFileName(name), null);
    assert.equal(parseStagingFileName(name), null);
  }
});
