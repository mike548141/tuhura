// Unit tests for site/js/storage/naming.js — the id/filename rules the
// storage seam's OPFS backend (and, later, a native one) both build on
// (ADR 2026-09-20-1116). Pure functions, no browser: `node --test`.

import test from "node:test";
import assert from "node:assert/strict";
import {
  ARCHIVE_EXT,
  assertValidArchiveId,
  archiveFileName,
  stagingFileName,
  isStagingFileName,
  isArchiveFileName,
  archiveIdFromFileName,
  archiveIdFromStagingFileName,
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

test("archiveFileName and stagingFileName round-trip through the id extractors", () => {
  const id = "wairarapa-coast";
  const finalName = archiveFileName(id);
  const staging = stagingFileName(id);

  assert.equal(finalName, `wairarapa-coast${ARCHIVE_EXT}`);
  assert.equal(staging, `.wairarapa-coast${ARCHIVE_EXT}.part`);

  assert.equal(isArchiveFileName(finalName), true);
  assert.equal(isStagingFileName(finalName), false);
  assert.equal(isStagingFileName(staging), true);
  assert.equal(isArchiveFileName(staging), false);

  assert.equal(archiveIdFromFileName(finalName), id);
  assert.equal(archiveIdFromStagingFileName(staging), id);
});

test("archiveFileName and stagingFileName reject an invalid id before touching the filesystem", () => {
  assert.throws(() => archiveFileName("Not Valid"), InvalidArchiveIdError);
  assert.throws(() => stagingFileName("Not Valid"), InvalidArchiveIdError);
});

test("archiveIdFromFileName returns null for anything that isn't a committed archive's name", () => {
  for (const name of [
    "readme.txt",
    ".wellington.pmtiles.part", // a staging name, not a final one
    "wellington.PMTILES", // wrong case extension
    "wellington", // no extension at all
    ARCHIVE_EXT, // bare extension, empty id
  ]) {
    assert.equal(archiveIdFromFileName(name), null, `expected ${JSON.stringify(name)} to yield null`);
  }
});

test("archiveIdFromStagingFileName returns null for anything that isn't a staging name", () => {
  for (const name of ["wellington.pmtiles", "wellington", ".wellington.pmtiles", "readme.txt"]) {
    assert.equal(archiveIdFromStagingFileName(name), null, `expected ${JSON.stringify(name)} to yield null`);
  }
});

test("archiveIdFromFileName and archiveIdFromStagingFileName reject non-string input without throwing", () => {
  for (const name of [null, undefined, 42, {}]) {
    assert.equal(archiveIdFromFileName(name), null);
    assert.equal(archiveIdFromStagingFileName(name), null);
  }
});
