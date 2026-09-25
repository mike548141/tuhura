// Tests for site/js/storage/opfs-archive-store.js under `node --test`,
// over an in-memory stand-in for the OPFS surface the module touches
// (getDirectory, getFileHandle, getFile, createSyncAccessHandle, move,
// removeEntry, entries, storage.estimate). What these prove is the
// module's logic — staging→commit, the quota path, resume rules, the
// bounds rule under the real vendored pmtiles parser — not the
// platform's behaviour, which still needs a browser (the item's
// checklist). The cold pass of 2026-09-20 (F2) wrote the first version
// of this stub to show the quota path published a partial archive; it
// is kept as the gate that stops that regressing.

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import { OpfsArchiveStore } from "../site/js/storage/opfs-archive-store.js";
import {
  ArchiveNotFoundError,
  ArchiveCorruptError,
  ArchiveQuotaExceededError,
  OutOfRangeReadError,
  OutOfOrderWriteError,
  ArchiveVersionMismatchError,
  ArchiveWriterClosedError,
  ArchiveBusyError,
  ArchiveStoreUnsupportedError,
} from "../site/js/storage/errors.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATOR = join(ROOT, "tools", "make_fixture_pmtiles.py");
const VENDORED_PMTILES = join(ROOT, "site", "vendor", "pmtiles", "pmtiles.js");

// --------------------------------------------------------------------
// The OPFS stand-in. One flat directory, files as Uint8Array, at most
// one open sync access handle per file (as the platform enforces), a
// byte quota, and an optional move() so its absence can be tested.
// --------------------------------------------------------------------

function domException(name) {
  const err = new Error(name);
  err.name = name;
  return err;
}

function installOpfs({ quotaBytes = Infinity, withMove = true } = {}) {
  const files = new Map();
  const openSync = new Set();
  let dirExists = false;
  const usage = () => [...files.values()].reduce((n, b) => n + b.byteLength, 0);

  function fileHandle(name) {
    const handle = {
      kind: "file",
      name,
      async getFile() {
        return new File([files.get(name)], name, { lastModified: 1_700_000_000_000 });
      },
      async createSyncAccessHandle() {
        if (openSync.has(name)) throw domException("NoModificationAllowedError");
        openSync.add(name);
        return {
          getSize: () => files.get(name).byteLength,
          write(bytes, { at }) {
            const current = files.get(name);
            const end = at + bytes.byteLength;
            const grown = Math.max(current.byteLength, end);
            if (usage() - current.byteLength + grown > quotaBytes) {
              throw domException("QuotaExceededError");
            }
            const next = new Uint8Array(grown);
            next.set(current);
            next.set(bytes, at);
            files.set(name, next);
            return bytes.byteLength;
          },
          flush() {},
          close() {
            openSync.delete(name);
          },
        };
      },
    };
    if (withMove) {
      handle.move = async (_destDir, newName) => {
        if (openSync.has(name)) throw domException("NoModificationAllowedError");
        files.set(newName, files.get(name));
        files.delete(name);
      };
    }
    return handle;
  }

  const dir = {
    kind: "directory",
    async getFileHandle(name, { create = false } = {}) {
      if (!files.has(name)) {
        if (!create) throw domException("NotFoundError");
        files.set(name, new Uint8Array(0));
      }
      return fileHandle(name);
    },
    async removeEntry(name) {
      if (!files.has(name)) throw domException("NotFoundError");
      if (openSync.has(name)) throw domException("NoModificationAllowedError");
      files.delete(name);
    },
    async *entries() {
      for (const name of [...files.keys()]) yield [name, fileHandle(name)];
    },
  };
  const root = {
    async getDirectoryHandle(_name, { create = false } = {}) {
      // A test that seeds files directly has, by that act, an archives directory.
      if (!dirExists && files.size === 0 && !create) throw domException("NotFoundError");
      dirExists = true;
      return dir;
    },
  };
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      storage: {
        getDirectory: async () => root,
        estimate: async () => ({ quota: quotaBytes === Infinity ? 1e12 : quotaBytes, usage: usage() }),
        persist: async () => true,
      },
    },
  });
  return { files, names: () => [...files.keys()].sort() };
}

// --------------------------------------------------------------------
// Fixtures and the vendored parser, exactly as tests/pmtiles-fixture
// loads them.
// --------------------------------------------------------------------

function loadVendoredPmtiles() {
  const src = readFileSync(VENDORED_PMTILES, "utf8");
  const sandbox = { console, TextDecoder, DataView, Uint8Array, Promise };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: VENDORED_PMTILES });
  return sandbox.pmtiles;
}

function generateFixture(extraArgs = []) {
  const dir = mkdtempSync(join(tmpdir(), "tuhura-opfs-"));
  try {
    const out = join(dir, "fixture.pmtiles");
    execFileSync("python3", [GENERATOR, "--out", out, ...extraArgs], { stdio: "pipe" });
    return new Uint8Array(readFileSync(out));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

/** Every tile z0..z4 (341 of them) in the library's TileID order — an archive over 16 KiB. */
function allTilesToZ4(pmtiles) {
  const tiles = [];
  for (let z = 0; z <= 4; z++) for (let x = 0; x < 1 << z; x++) for (let y = 0; y < 1 << z; y++) tiles.push([z, x, y]);
  tiles.sort((a, b) => pmtiles.zxyToTileId(...a) - pmtiles.zxyToTileId(...b));
  return tiles.map((t) => t.join("/")).join(",");
}

async function writeArchive(store, id, bytes, { version = "v1", chunk = 100 } = {}) {
  const writer = await store.write(id, bytes.byteLength, version);
  for (let offset = 0; offset < bytes.byteLength; offset += chunk) {
    await writer.append(offset, bytes.subarray(offset, Math.min(offset + chunk, bytes.byteLength)));
  }
  await writer.commit();
}

// --------------------------------------------------------------------
// F1 — the seam's handle under the real parser, both sides of 16 KiB.
// --------------------------------------------------------------------

test("the seam's ArchiveHandle is accepted by the vendored PMTiles on an archive under 16 KiB", async () => {
  installOpfs();
  const pmtiles = loadVendoredPmtiles();
  const bytes = generateFixture();
  assert.ok(bytes.byteLength < 16384, "default fixture must be smaller than the header probe");
  const store = new OpfsArchiveStore();
  await writeArchive(store, "wellington", bytes);

  const handle = await store.open("wellington");
  const archive = new pmtiles.PMTiles(handle);
  const header = await archive.getHeader();
  assert.equal(header.numAddressedTiles, 5);
  const tile = await archive.getZxy(1, 1, 0);
  assert.equal(Buffer.from(tile.data).toString("utf8").startsWith("tuhura-fixture:1/1/0"), true);
  assert.equal(await archive.getZxy(2, 0, 0), undefined);
});

test("the seam's ArchiveHandle is accepted by the vendored PMTiles on an archive over 16 KiB", async () => {
  installOpfs();
  const pmtiles = loadVendoredPmtiles();
  const bytes = generateFixture(["--tiles", allTilesToZ4(pmtiles)]);
  assert.ok(bytes.byteLength > 16384, "341-tile fixture must exceed the header probe");
  const store = new OpfsArchiveStore();
  await writeArchive(store, "wairarapa-coast", bytes, { chunk: 4096 });

  const archive = new pmtiles.PMTiles(await store.open("wairarapa-coast"));
  const header = await archive.getHeader();
  assert.equal(header.numAddressedTiles, 341);
  for (const [z, x, y] of [[4, 3, 2], [3, 7, 0], [2, 2, 0]]) {
    const tile = await archive.getZxy(z, x, y);
    assert.ok(tile, `z${z}/${x}/${y} present`);
    assert.equal(Buffer.from(tile.data).toString("utf8").startsWith(`tuhura-fixture:${z}/${x}/${y}`), true);
  }
});

test("getBytes clamps only the header probe at offset 0 and stays strict everywhere else", async () => {
  installOpfs();
  const store = new OpfsArchiveStore();
  const bytes = new Uint8Array(200).fill(7);
  await writeArchive(store, "small", bytes);
  const handle = await store.open("small");
  assert.equal(handle.sizeBytes, 200);
  assert.equal((await handle.getBytes(0, 16384)).data.byteLength, 200); // the probe, clamped
  assert.equal((await handle.getBytes(150, 50)).data.byteLength, 50); // exact tail
  await assert.rejects(() => handle.getBytes(150, 51), OutOfRangeReadError); // one past EOF
  await assert.rejects(() => handle.getBytes(200, 1), OutOfRangeReadError); // starts at EOF
  await assert.rejects(() => handle.getBytes(1, 16384), OutOfRangeReadError); // not the probe
});

test("getKey changes when the committed bytes do", async () => {
  installOpfs();
  const store = new OpfsArchiveStore();
  await writeArchive(store, "k", new Uint8Array(10));
  const key = (await store.open("k")).getKey();
  assert.match(key, /^k@\d+$/);
  assert.equal((await store.open("k")).getKey(), key); // stable across open() calls
});

// --------------------------------------------------------------------
// F2 — the quota path leaves the tracker equal to the disk.
// --------------------------------------------------------------------

test("a quota failure leaves bytesWritten at what landed, the retry is accepted, and commit waits for every byte", async () => {
  const opfs = installOpfs({ quotaBytes: 8 });
  const store = new OpfsArchiveStore();
  const writer = await store.write("wellington", 16, "v1");
  await writer.append(0, new Uint8Array(8).fill(1));
  assert.equal(writer.bytesWritten, 8);

  await assert.rejects(() => writer.append(8, new Uint8Array(8).fill(2)), (err) => {
    assert.ok(err instanceof ArchiveQuotaExceededError);
    assert.equal(err.requestedBytes, 8);
    assert.equal(err.availableBytes, 0);
    return true;
  });
  assert.equal(writer.bytesWritten, 8, "a failed write must not be counted");
  await assert.rejects(() => writer.commit(), ArchiveCorruptError);
  assert.deepEqual(opfs.names(), [".wellington.v1.pmtiles.part"], "nothing published");

  // Space freed elsewhere; the same chunk retries at the same offset.
  const opfs2 = installOpfs({ quotaBytes: 64 });
  const store2 = new OpfsArchiveStore();
  const w = await store2.write("wellington", 16, "v1");
  await w.append(0, new Uint8Array(8).fill(1));
  await w.append(8, new Uint8Array(8).fill(2));
  await w.commit();
  assert.deepEqual(opfs2.names(), ["wellington.pmtiles"]);
  assert.equal(opfs2.files.get("wellington.pmtiles").byteLength, 16);
});

test("an out-of-order chunk is refused before anything reaches the disk", async () => {
  const opfs = installOpfs();
  const store = new OpfsArchiveStore();
  const writer = await store.write("w", 30, "v1");
  await writer.append(0, new Uint8Array(10));
  await assert.rejects(() => writer.append(20, new Uint8Array(10)), OutOfOrderWriteError);
  assert.equal(writer.bytesWritten, 10);
  assert.equal(opfs.files.get(".w.v1.pmtiles.part").byteLength, 10);
});

// --------------------------------------------------------------------
// Commit, abort, and the closed writer.
// --------------------------------------------------------------------

test("commit publishes under the final name and the staging file is gone; a second commit is a typed error", async () => {
  const opfs = installOpfs();
  const store = new OpfsArchiveStore();
  const writer = await store.write("w", 4, "v1");
  await writer.append(0, new Uint8Array([1, 2, 3, 4]));
  await writer.commit();
  assert.deepEqual(opfs.names(), ["w.pmtiles"]);
  await assert.rejects(() => writer.commit(), ArchiveWriterClosedError);
  await assert.rejects(() => writer.append(4, new Uint8Array(1)), ArchiveWriterClosedError);
  await assert.rejects(() => writer.abort(), ArchiveWriterClosedError);
});

test("abort discards the staging file and frees the name for a fresh write", async () => {
  const opfs = installOpfs();
  const store = new OpfsArchiveStore();
  const writer = await store.write("w", 4, "v1");
  await writer.append(0, new Uint8Array(2));
  await writer.abort();
  assert.deepEqual(opfs.names(), []);
  const again = await store.write("w", 4, "v1");
  assert.equal(again.bytesWritten, 0);
});

test("without move() commit stops typed and leaves the staging file intact and resumable", async () => {
  const opfs = installOpfs({ withMove: false });
  const store = new OpfsArchiveStore();
  const writer = await store.write("w", 4, "v1");
  await writer.append(0, new Uint8Array([9, 9, 9, 9]));
  await assert.rejects(() => writer.commit(), ArchiveStoreUnsupportedError);
  assert.deepEqual(opfs.names(), [".w.v1.pmtiles.part"]);
  assert.equal(opfs.files.get(".w.v1.pmtiles.part").byteLength, 4);
});

// --------------------------------------------------------------------
// Resume and versions (F6), busy handles (F7).
// --------------------------------------------------------------------

test("a second write() for the same id while one is live is a typed busy error", async () => {
  installOpfs();
  const store = new OpfsArchiveStore();
  const first = await store.write("w", 10, "v1");
  await first.append(0, new Uint8Array(6));
  await assert.rejects(() => store.write("w", 10, "v1"), ArchiveBusyError);
  await first.abort();
  const second = await store.write("w", 10, "v1");
  assert.equal(second.bytesWritten, 0, "abort discarded the partial");
});

test("a fresh session resumes a partial download and refuses a different version", async () => {
  const opfs = installOpfs();
  // A partial download of version "etag1" left behind by an earlier session.
  opfs.files.set(".w.etag1.pmtiles.part", new Uint8Array(6).fill(5));
  const store = new OpfsArchiveStore();

  await assert.rejects(() => store.write("w", 10, "etag2"), (err) => {
    assert.ok(err instanceof ArchiveVersionMismatchError);
    assert.equal(err.existingVersion, "etag1");
    assert.equal(err.requestedVersion, "etag2");
    return true;
  });

  const resumed = await store.write("w", 10, "etag1");
  assert.equal(resumed.bytesWritten, 6);
  await resumed.append(6, new Uint8Array(4).fill(6));
  await resumed.commit();
  assert.deepEqual(opfs.names(), ["w.pmtiles"]);
  assert.deepEqual([...opfs.files.get("w.pmtiles")], [5, 5, 5, 5, 5, 5, 6, 6, 6, 6]);
});

test("a staging file longer than the declared total is refused as corrupt", async () => {
  const opfs = installOpfs();
  opfs.files.set(".w.v1.pmtiles.part", new Uint8Array(20));
  const store = new OpfsArchiveStore();
  await assert.rejects(() => store.write("w", 10, "v1"), ArchiveCorruptError);
});

test("delete() removes the archive and every staging version, and is idempotent", async () => {
  const opfs = installOpfs();
  opfs.files.set("w.pmtiles", new Uint8Array(3));
  opfs.files.set(".w.old.pmtiles.part", new Uint8Array(1));
  opfs.files.set(".w.new.pmtiles.part", new Uint8Array(2));
  opfs.files.set("other.pmtiles", new Uint8Array(1));
  const store = new OpfsArchiveStore();
  await store.delete("w");
  assert.deepEqual(opfs.names(), ["other.pmtiles"]);
  await store.delete("w"); // nothing there — not an error
  await store.delete("never-existed");
});

test("delete() during a live write is a typed busy error, not a platform one", async () => {
  installOpfs();
  const store = new OpfsArchiveStore();
  const writer = await store.write("w", 4, "v1");
  await assert.rejects(() => store.delete("w"), ArchiveBusyError);
  await writer.abort();
});

// --------------------------------------------------------------------
// open(), list(), quota(), persist().
// --------------------------------------------------------------------

test("open() on a missing archive, or before any archive exists, is ArchiveNotFoundError", async () => {
  installOpfs();
  const store = new OpfsArchiveStore();
  await assert.rejects(() => store.open("w"), ArchiveNotFoundError); // no directory yet
  await writeArchive(store, "other", new Uint8Array(1));
  await assert.rejects(() => store.open("w"), ArchiveNotFoundError); // directory, no file
});

test("list() reports ready and partial archives, partials with their version, and ignores strangers", async () => {
  const opfs = installOpfs();
  opfs.files.set("w.pmtiles", new Uint8Array(3));
  opfs.files.set(".w.etag9.pmtiles.part", new Uint8Array(2));
  opfs.files.set("notes.txt", new Uint8Array(1));
  opfs.files.set(".bad name.pmtiles.part", new Uint8Array(1));
  const store = new OpfsArchiveStore();
  const listed = (await store.list()).sort((a, b) => a.state.localeCompare(b.state));
  assert.deepEqual(listed, [
    { id: "w", state: "partial", version: "etag9", sizeBytes: 2 },
    { id: "w", state: "ready", sizeBytes: 3 },
  ]);
});

test("list() before any write is empty, not an error", async () => {
  installOpfs();
  assert.deepEqual(await new OpfsArchiveStore().list(), []);
});

test("quota() reports origin-wide numbers and persist() passes the platform's answer through", async () => {
  installOpfs({ quotaBytes: 1000 });
  const store = new OpfsArchiveStore();
  await writeArchive(store, "w", new Uint8Array(100));
  assert.deepEqual(await store.quota(), { usageBytes: 100, quotaBytes: 1000, availableBytes: 900 });
  assert.equal(await store.persist(), true);
});
