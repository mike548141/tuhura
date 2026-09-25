// Verifies tools/make_fixture_pmtiles.py two ways: independently of the
// vendored library (hand-decoding the header's raw bytes against the
// PMTiles v3 spec) and, where it actually works, BY the vendored
// library itself (site/vendor/pmtiles/pmtiles.js) — real independent
// verification, not a claim of it. See the session report for what
// this does and does not establish.
//
// WHY A SUBPROCESS, NOT AN IMPORTED MODULE. The generator is Python
// (tools/ is stdlib-only Python 3, CLAUDE.md); this test shells out to
// it exactly as a developer or CI would, rather than re-implementing
// its logic in JS to "test" that reimplementation against itself.
//
// WHY A TEMP DIR, NOT A COMMITTED FIXTURE FILE. This repo is public
// (CLAUDE.md) and every commit is publication; a generated binary
// blob adds nothing a re-run of the generator doesn't already give a
// reader, so the fixture is built fresh into an OS temp dir per test
// run and never lands in git.
//
// LOADING A CLASSIC-SCRIPT GLOBAL BUILD UNDER NODE. pmtiles.js is
// vendored as a non-ESM global build (tools/vendor-manifest.json
// explains why: its real ESM entry has a bare `from "fflate"` import
// with nothing to resolve it here). `vm.runInContext` evaluates it as
// the same kind of classic script a `<script src>` tag would, so this
// is not a Node-specific reimplementation — it is literally the file
// site/index.html will load, run once here to check the fixture.

import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const GENERATOR = join(ROOT, "tools", "make_fixture_pmtiles.py");
const VENDORED_PMTILES = join(ROOT, "site", "vendor", "pmtiles", "pmtiles.js");

function generateFixture(dir, extraArgs = []) {
  const out = join(dir, "fixture.pmtiles");
  execFileSync("python3", [GENERATOR, "--out", out, ...extraArgs], { stdio: "pipe" });
  return readFileSync(out);
}

// The generator's own tile_payload() encoding, reimplemented here only
// to compute an EXPECTED string to assert against — not called as a
// shared implementation, so this doesn't just check the generator
// against itself.
function expectedTilePayload(z, x, y, seed = 0) {
  const label = `tuhura-fixture:${z}/${x}/${y}:seed=${seed}`;
  return label.padEnd(48, ".");
}

const DEFAULT_TILES = [
  [0, 0, 0],
  [1, 0, 0],
  [1, 0, 1],
  [1, 1, 1],
  [1, 1, 0],
];

// --------------------------------------------------------------------
// Layer 1: hand-decode the raw header against the PMTiles v3 spec
// (fields per spec §3.1-3.2), with no involvement from the vendored
// library. This is the fallback the task calls for if loading the
// vendored library hadn't worked — kept as a real test in its own
// right even though loading it DID work (see layer 2 below), because
// it catches a header-layout bug the library's own (more permissive)
// parser might tolerate.
// --------------------------------------------------------------------

function readU64LE(buf, offset) {
  return buf.readBigUInt64LE(offset);
}

test("fixture header decodes correctly by hand, against the spec's byte layout", () => {
  let dir;
  try {
    dir = mkdtempSync(join(tmpdir(), "tuhura-pmtiles-"));
    const bytes = generateFixture(dir);

    assert.equal(bytes.subarray(0, 7).toString("latin1"), "PMTiles");
    assert.equal(bytes.readUInt8(7), 3); // version

    const rootDirOffset = readU64LE(bytes, 8);
    const rootDirLength = readU64LE(bytes, 16);
    const metadataOffset = readU64LE(bytes, 24);
    const metadataLength = readU64LE(bytes, 32);
    const leafDirLength = readU64LE(bytes, 48);
    const tileDataOffset = readU64LE(bytes, 56);
    const tileDataLength = readU64LE(bytes, 64);
    const numAddressedTiles = readU64LE(bytes, 72);
    const numTileEntries = readU64LE(bytes, 80);
    const numTileContents = readU64LE(bytes, 88);

    const clustered = bytes.readUInt8(96);
    const internalCompression = bytes.readUInt8(97);
    const tileCompression = bytes.readUInt8(98);
    const tileType = bytes.readUInt8(99);
    const minZoom = bytes.readUInt8(100);
    const maxZoom = bytes.readUInt8(101);

    // §2: root directory MUST be contained in the first 16 KiB.
    assert.equal(rootDirOffset, 127n); // immediately after the 127-byte header
    assert.ok(127n + rootDirLength <= 16384n);

    // §2: sections laid out header, root dir, metadata, [no leaf dirs], tile data.
    assert.equal(metadataOffset, rootDirOffset + rootDirLength);
    assert.equal(tileDataOffset, metadataOffset + metadataLength);
    assert.equal(leafDirLength, 0n); // no leaf directories in a 5-tile fixture

    assert.equal(numAddressedTiles, 5n);
    assert.equal(numTileEntries, 5n);
    assert.equal(numTileContents, 5n); // 5 distinct blobs, no dedup

    assert.equal(clustered, 1); // tiles written contiguous in TileID order
    assert.equal(internalCompression, 1); // "none" — default
    assert.equal(tileCompression, 1); // "none" — default
    assert.equal(tileType, 0); // "unknown" — avoids the vector_layers requirement
    assert.equal(minZoom, 0);
    assert.equal(maxZoom, 1);

    assert.equal(BigInt(bytes.length), tileDataOffset + tileDataLength);
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------
// Layer 2: load the ACTUAL vendored library
// (site/vendor/pmtiles/pmtiles.js — the exact bytes site/index.html
// will serve) as a classic script, and have it parse the fixture for
// real: header, directory lookup, decompression, tile bytes. If this
// block fails to even load the library, the test below says so
// explicitly rather than skipping silently — see the session report.
// --------------------------------------------------------------------

function loadVendoredPmtiles() {
  const src = readFileSync(VENDORED_PMTILES, "utf8");
  const sandbox = { console, TextDecoder, DataView, Uint8Array, Promise };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: VENDORED_PMTILES });
  if (typeof sandbox.pmtiles !== "object") {
    throw new Error("vendored pmtiles.js did not expose the expected `pmtiles` global");
  }
  return sandbox.pmtiles;
}

test("the vendored pmtiles.js library parses the fixture and reads every tile correctly", async () => {
  const pmtiles = loadVendoredPmtiles();
  let dir;
  try {
    dir = mkdtempSync(join(tmpdir(), "tuhura-pmtiles-"));
    const bytes = generateFixture(dir);
    const file = new File([bytes], "fixture.pmtiles");
    const source = new pmtiles.FileSource(file);
    const archive = new pmtiles.PMTiles(source);

    const header = await archive.getHeader();
    assert.equal(header.specVersion, 3);
    assert.equal(header.numAddressedTiles, 5);
    assert.equal(header.minZoom, 0);
    assert.equal(header.maxZoom, 1);
    assert.equal(header.clustered, true);

    for (const [z, x, y] of DEFAULT_TILES) {
      const tile = await archive.getZxy(z, x, y);
      assert.ok(tile, `expected tile z${z}/${x}/${y} to be found`);
      const text = Buffer.from(tile.data).toString("utf8");
      assert.equal(text, expectedTilePayload(z, x, y));
    }

    // A tile that was never written must come back empty, not throw and
    // not fabricate bytes — this is what a MapLibre viewport panning
    // outside a downloaded region's tile set should see. z1 has all 4
    // of its tiles in the default set, so z2 (nothing downloaded) is
    // the genuinely-missing probe.
    const missing = await archive.getZxy(2, 0, 0);
    assert.equal(missing, undefined);
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

test("the vendored library also round-trips a gzip-compressed fixture", async () => {
  const pmtiles = loadVendoredPmtiles();
  let dir;
  try {
    dir = mkdtempSync(join(tmpdir(), "tuhura-pmtiles-"));
    const bytes = generateFixture(dir, [
      "--internal-compression", "gzip",
      "--tile-compression", "gzip",
    ]);
    const file = new File([bytes], "fixture-gz.pmtiles");
    const source = new pmtiles.FileSource(file);
    const archive = new pmtiles.PMTiles(source);

    const header = await archive.getHeader();
    assert.equal(header.internalCompression, 2); // gzip
    assert.equal(header.tileCompression, 2);

    const tile = await archive.getZxy(0, 0, 0);
    assert.equal(Buffer.from(tile.data).toString("utf8"), expectedTilePayload(0, 0, 0));
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

// --------------------------------------------------------------------
// Layer 3: the generator's TileID arithmetic against the vendored
// library's, for every tile z0..z4 (341 of them). The spec's own
// worked table is six rows, all with zero high-bit contribution, and a
// wrong bit weight passed it while collapsing 341 ids onto 83 (cold
// pass 2026-09-20, F3). Two implementations that agree on the whole
// range is the check that table could not make.
// --------------------------------------------------------------------

test("the generator's zxy_to_tile_id agrees with the vendored library's zxyToTileId for every tile z0..z4", () => {
  const pmtiles = loadVendoredPmtiles();
  const script = `
import sys; sys.path.insert(0, ${JSON.stringify(join(ROOT, "tools"))})
from make_fixture_pmtiles import zxy_to_tile_id
for z in range(5):
    for x in range(1 << z):
        for y in range(1 << z):
            print(z, x, y, zxy_to_tile_id(z, x, y))
`;
  const rows = execFileSync("python3", ["-c", script], { encoding: "utf8" }).trim().split("\n");
  assert.equal(rows.length, 341);
  const seen = new Set();
  for (const row of rows) {
    const [z, x, y, id] = row.split(" ").map(Number);
    assert.equal(id, pmtiles.zxyToTileId(z, x, y), `z${z}/${x}/${y}`);
    seen.add(id);
  }
  assert.equal(seen.size, 341, "341 tiles must map to 341 distinct ids");
});

test("the generator refuses tiles out of TileID order rather than writing a broken directory", () => {
  let dir;
  try {
    dir = mkdtempSync(join(tmpdir(), "tuhura-pmtiles-"));
    assert.throws(
      () => generateFixture(dir, ["--tiles", "2/0/0,1/0/0"]),
      /strictly ascending/
    );
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});
