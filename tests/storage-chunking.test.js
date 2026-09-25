// Unit tests for site/js/storage/chunking.js — chunk planning, range
// bounds-checking, the sequential-write tracker, and the retry policy
// the storage seam's OPFS (and future native) write path builds on
// (ADR 2026-09-20-1116). Pure functions and one small class, no
// browser: `node --test`.

import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_CHUNK_BYTES,
  planChunks,
  isRangeInBounds,
  SequentialWriteTracker,
  MAX_CHUNK_ATTEMPTS,
  nextRetryDelayMs,
  shouldRetryChunk,
} from "../site/js/storage/chunking.js";
import { OutOfOrderWriteError } from "../site/js/storage/errors.js";

test("planChunks covers the whole archive with no gaps and no overlap", () => {
  const total = 20_000_000;
  const chunkBytes = 8 * 1024 * 1024;
  const chunks = planChunks(total, chunkBytes);

  assert.equal(chunks.length, 3); // 8M, 8M, ~3.6M
  let expectedOffset = 0;
  chunks.forEach((chunk, i) => {
    assert.equal(chunk.index, i);
    assert.equal(chunk.offset, expectedOffset);
    assert.ok(chunk.length > 0);
    assert.ok(chunk.length <= chunkBytes);
    expectedOffset += chunk.length;
  });
  assert.equal(expectedOffset, total);
  assert.equal(chunks.at(-1).length, total - 2 * chunkBytes);
});

test("planChunks on an exact multiple of chunkBytes has no trailing short chunk", () => {
  const chunks = planChunks(16 * 1024 * 1024, 8 * 1024 * 1024);
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, 8 * 1024 * 1024);
  assert.equal(chunks[1].length, 8 * 1024 * 1024);
});

test("planChunks on zero bytes yields no chunks", () => {
  assert.deepEqual(planChunks(0), []);
});

test("planChunks defaults to DEFAULT_CHUNK_BYTES", () => {
  const chunks = planChunks(DEFAULT_CHUNK_BYTES + 1);
  assert.equal(chunks.length, 2);
  assert.equal(chunks[0].length, DEFAULT_CHUNK_BYTES);
  assert.equal(chunks[1].length, 1);
});

test("planChunks rejects invalid inputs", () => {
  assert.throws(() => planChunks(-1), RangeError);
  assert.throws(() => planChunks(1.5), RangeError);
  assert.throws(() => planChunks(10, 0), RangeError);
  assert.throws(() => planChunks(10, -1), RangeError);
});

test("isRangeInBounds accepts a read fully inside the archive", () => {
  assert.equal(isRangeInBounds(0, 100, 100), true);
  assert.equal(isRangeInBounds(50, 50, 100), true);
  assert.equal(isRangeInBounds(0, 0, 0), true); // a zero-length read at EOF of an empty file
});

test("isRangeInBounds rejects a read that runs past EOF", () => {
  assert.equal(isRangeInBounds(0, 101, 100), false);
  assert.equal(isRangeInBounds(100, 1, 100), false); // starts exactly at EOF
  assert.equal(isRangeInBounds(99, 2, 100), false); // ends one byte past EOF
});

test("isRangeInBounds rejects malformed offset/length/sizeBytes", () => {
  assert.throws(() => isRangeInBounds(-1, 1, 100), RangeError);
  assert.throws(() => isRangeInBounds(0, -1, 100), RangeError);
  assert.throws(() => isRangeInBounds(0, 1, -1), RangeError);
  assert.throws(() => isRangeInBounds(0.5, 1, 100), RangeError);
});

test("SequentialWriteTracker accepts in-order chunks and reports completion", () => {
  const tracker = new SequentialWriteTracker(30);
  assert.equal(tracker.isComplete, false);
  tracker.accept("wellington", 0, 10);
  tracker.accept("wellington", 10, 10);
  assert.equal(tracker.bytesWritten, 20);
  assert.equal(tracker.isComplete, false);
  tracker.accept("wellington", 20, 10);
  assert.equal(tracker.bytesWritten, 30);
  assert.equal(tracker.isComplete, true);
});

test("SequentialWriteTracker.assertNext checks without counting, so a failed write can be retried", () => {
  const tracker = new SequentialWriteTracker(30);
  tracker.assertNext("wellington", 0, 10);
  assert.equal(tracker.bytesWritten, 0, "assertNext must not count");
  tracker.assertNext("wellington", 0, 10); // the retry of the same chunk is still next
  assert.throws(() => tracker.assertNext("wellington", 10, 10), OutOfOrderWriteError);
  assert.throws(() => tracker.assertNext("wellington", 0, 31), RangeError);
  tracker.accept("wellington", 0, 10);
  assert.equal(tracker.bytesWritten, 10);
});

test("SequentialWriteTracker rejects an out-of-order chunk", () => {
  const tracker = new SequentialWriteTracker(30);
  tracker.accept("wellington", 0, 10);
  assert.throws(
    () => tracker.accept("wellington", 20, 10), // skipped the [10, 20) chunk
    OutOfOrderWriteError
  );
  // The rejected write must not have been counted.
  assert.equal(tracker.bytesWritten, 10);
});

test("SequentialWriteTracker rejects a chunk that would overrun the declared total", () => {
  const tracker = new SequentialWriteTracker(10);
  assert.throws(() => tracker.accept("wellington", 0, 11), RangeError);
});

test("SequentialWriteTracker.resumeAt fast-forwards a fresh tracker", () => {
  const tracker = new SequentialWriteTracker(30);
  tracker.resumeAt(20);
  assert.equal(tracker.bytesWritten, 20);
  tracker.accept("wellington", 20, 10);
  assert.equal(tracker.isComplete, true);
});

test("SequentialWriteTracker.resumeAt refuses to run after a write has already happened", () => {
  const tracker = new SequentialWriteTracker(30);
  tracker.accept("wellington", 0, 10);
  assert.throws(() => tracker.resumeAt(10), Error);
});

test("SequentialWriteTracker.resumeAt refuses to resume past the declared total", () => {
  const tracker = new SequentialWriteTracker(30);
  assert.throws(() => tracker.resumeAt(31), RangeError);
});

test("nextRetryDelayMs doubles per attempt and is capped", () => {
  assert.equal(nextRetryDelayMs(1), 500);
  assert.equal(nextRetryDelayMs(2), 1000);
  assert.equal(nextRetryDelayMs(3), 2000);
  assert.equal(nextRetryDelayMs(20), 30_000); // deep into the exponential range — must hit the ceiling
});

test("nextRetryDelayMs honours custom base/ceiling", () => {
  assert.equal(nextRetryDelayMs(1, { baseMs: 100, maxMs: 150 }), 100);
  assert.equal(nextRetryDelayMs(2, { baseMs: 100, maxMs: 150 }), 150); // 200 would exceed the ceiling
});

test("nextRetryDelayMs spreads the delay by ±jitter with an injectable random source", () => {
  assert.equal(nextRetryDelayMs(3, { jitter: 0.5, random: () => 0.5 }), 2000); // centre
  assert.equal(nextRetryDelayMs(3, { jitter: 0.5, random: () => 1 }), 3000); // +50 %
  assert.equal(nextRetryDelayMs(3, { jitter: 0.5, random: () => 0 }), 1000); // −50 %
  assert.equal(nextRetryDelayMs(1, { jitter: 1, random: () => 0 }), 0); // never below zero
  assert.throws(() => nextRetryDelayMs(1, { jitter: 1.5 }), RangeError);
});

test("shouldRetryChunk allows exactly MAX_CHUNK_ATTEMPTS attempts", () => {
  for (let attempt = 1; attempt <= MAX_CHUNK_ATTEMPTS; attempt += 1) {
    assert.equal(shouldRetryChunk(attempt), true, `attempt ${attempt} should be allowed`);
  }
  assert.equal(shouldRetryChunk(MAX_CHUNK_ATTEMPTS + 1), false);
});
