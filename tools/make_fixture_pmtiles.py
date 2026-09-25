#!/usr/bin/env python3
"""Generate a tiny, spec-valid synthetic PMTiles v3 archive for tests.

WHY THIS EXISTS. The storage seam (ADR 2026-09-20-1116) reads archives
by byte range, and that range-read path needs something real to read —
but a real regional PMTiles archive needs the LINZ export endpoint and
the `pmtiles` CLI (P0-D's still-blocked half: a tool install, Mike's to
approve) and runs to hundreds of MB. This script produces a
self-contained archive of a few hundred bytes with a handful of tiles,
so `tests/pmtiles-fixture.test.js` can exercise directory parsing and
range reads with `node --test`, no LINZ, no CLI, no browser.

IMPLEMENTED AGAINST THE SPEC, NOT FROM MEMORY. Written directly against
the published PMTiles v3 specification, fetched and read in full before
writing a byte of this file:

    https://github.com/protomaps/PMTiles/blob/main/spec/v3/spec.md
    revision: 8b8ddea4dbff1b0104cf2bebf2f7ff35c91b41d5
    ("Add terrain tiles, with elevations encoded as RGB values." #660,
    2026-05-26T17:36:54Z — the spec file's most recent commit as of
    2026-09-20, per `git log --oneline` on that path via the GitHub API)

Every structural choice below cites the spec section it implements:
header layout (§3.1-3.2), the compression/tile-type enums (§3.3, the
Tile Type table), lat/lon fixed-point encoding (§3.4), directory entry
semantics and varint encoding (§4.1-4.2). The five default tiles
(z0/0/0 through z1/1/0, TileIDs 0-4) are chosen to match §4.1's own
worked example table verbatim, and `_self_check()` below asserts this
script's Hilbert-curve implementation against that same table before
ever writing a file — an independent-of-the-vendored-library check,
since the table is transcribed from the spec text, not from
`site/vendor/pmtiles/pmtiles.js`.

WHAT THIS SCRIPT DELIBERATELY DOES NOT COVER: leaf directories (the
fixture is far too small to need one — spec §4 even discourages more
than one level), and MVT/vector tile content (tile type defaults to
`Unknown` so the JSON metadata's `vector_layers` requirement, §5,
doesn't apply — the fixture's tile payloads are deterministic synthetic
bytes, not real map data, because this seam's tests care about byte
ranges landing correctly, not about rendering anything).

stdlib only (struct, gzip, json, argparse) — no install, matching every
other tool in tools/.
"""

from __future__ import annotations

import argparse
import gzip
import json
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SPEC_URL = "https://github.com/protomaps/PMTiles/blob/main/spec/v3/spec.md"
SPEC_REVISION = "8b8ddea4dbff1b0104cf2bebf2f7ff35c91b41d5"

MAGIC = b"PMTiles"
VERSION = 3
HEADER_LENGTH = 127
ROOT_DIR_MAX_END = 16384  # spec §4: header + root dir MUST fit in 16 KiB

# Compression enum, spec §3.3.
COMPRESSION = {"unknown": 0, "none": 1, "gzip": 2, "brotli": 3, "zstd": 4}

# Tile Type enum, spec §3.2's Tile Type table. "unknown" avoids the
# JSON-metadata vector_layers requirement that MVT (1) carries (§5).
TILE_TYPE = {
    "unknown": 0,
    "mvt": 1,
    "png": 2,
    "jpeg": 3,
    "webp": 4,
    "avif": 5,
    "mlt": 6,
}


# --------------------------------------------------------------------
# Varints (spec §4.2: "little-endian variable-width integer", the
# protobuf/LEB128 encoding it links to).
# --------------------------------------------------------------------


def write_varint(value: int) -> bytes:
    if value < 0:
        raise ValueError(f"varint cannot encode a negative value: {value}")
    out = bytearray()
    while True:
        byte = value & 0x7F
        value >>= 7
        if value:
            out.append(byte | 0x80)
        else:
            out.append(byte)
            return bytes(out)


def read_varint(buf: bytes, pos: int) -> tuple[int, int]:
    """Decode one varint starting at `pos`; return (value, new_pos). Used
    only by _self_check() below, to decode this script's own output
    independently of how it was encoded — a round-trip check, not a
    second production code path."""
    result = 0
    shift = 0
    while True:
        byte = buf[pos]
        pos += 1
        result |= (byte & 0x7F) << shift
        if not (byte & 0x80):
            return result, pos
        shift += 7


# --------------------------------------------------------------------
# TileID: "cumulative position on the series of Hilbert curves starting
# at zoom level 0" (spec §4.1). The spec states this in prose plus a
# worked example table, not pseudocode, so this is the standard
# Hilbert d2xy/xy2d curve construction (the same one every PMTiles
# implementation — go, JS, python — uses); _self_check() verifies it
# against the spec's own table before this script trusts it for
# anything else.
# --------------------------------------------------------------------


def _rotate(size: int, x: int, y: int, rx: int, ry: int) -> tuple[int, int]:
    if ry == 0:
        if rx != 0:
            return size - 1 - y, size - 1 - x
        return y, x
    return x, y


def zxy_to_tile_id(z: int, x: int, y: int) -> int:
    """Hilbert-curve TileID for (z, x, y). `tile_id` starts at the count
    of tiles in every smaller zoom (4^0 + 4^1 + ... + 4^(z-1) = (4^z-1)/3),
    then walks the curve from its coarsest square down: at each level the
    square has side `s`, holds `s*s` tiles, and the quadrant chosen
    contributes `(3*rx ^ ry)` whole sub-squares — so the weight is `s*s`,
    not `s` (the cold pass of 2026-09-20, F3, found the `s` form: it
    passed the spec's six-row table, whose rows all have zero high-bit
    contribution, while collapsing 341 tiles at z<=4 onto 83 ids).
    `_self_check()` now verifies the whole z0..z4 range is a bijection
    onto 0..340 and a z2 table with every quadrant taken."""
    if z > 26:
        raise ValueError("zoom exceeds the spec's max safe zoom (26)")
    if x >= (1 << z) or y >= (1 << z):
        raise ValueError(f"x/y outside zoom {z}'s bounds")
    tile_id = ((1 << z) * (1 << z) - 1) // 3
    if z == 0:
        return tile_id  # the single z0 tile — no bits to walk
    a, b = x, y
    s = 1 << (z - 1)
    while s > 0:
        rx = 1 if (a & s) else 0
        ry = 1 if (b & s) else 0
        tile_id += ((3 * rx) ^ ry) * s * s
        a, b = _rotate(s, a, b, rx, ry)
        s >>= 1
    return tile_id


# --------------------------------------------------------------------
# Directory encoding, spec §4.2 (order: count, delta TileIDs, RunLengths,
# Lengths, Offsets) followed exactly, including the offset-omission rule
# in Appendix A.1's pseudocode ("if index > 0 && offset == next_byte:
# write 0, else write offset + 1" — applied for every index, including
# 0, which therefore always writes its real offset + 1).
# --------------------------------------------------------------------


def encode_directory(entries: list[dict], internal_compression: str) -> bytes:
    buf = bytearray()
    buf += write_varint(len(entries))

    last_id = 0
    for entry in entries:
        buf += write_varint(entry["tile_id"] - last_id)
        last_id = entry["tile_id"]

    for entry in entries:
        buf += write_varint(entry["run_length"])

    for entry in entries:
        buf += write_varint(entry["length"])

    next_byte = 0
    for index, entry in enumerate(entries):
        if index > 0 and entry["offset"] == next_byte:
            buf += write_varint(0)
        else:
            buf += write_varint(entry["offset"] + 1)
        next_byte = entry["offset"] + entry["length"]

    return _compress(bytes(buf), internal_compression)


def _compress(data: bytes, method: str) -> bytes:
    if method == "none":
        return data
    if method == "gzip":
        return gzip.compress(data, mtime=0)
    raise ValueError(f"unsupported compression: {method!r}")


# --------------------------------------------------------------------
# Header, spec §3.1 (byte layout) and §3.2 (field semantics). 127 bytes,
# little-endian throughout (§3.2 states this per multi-byte field).
# --------------------------------------------------------------------


def encode_position(lon: float, lat: float) -> bytes:
    """Spec §3.4: multiply by 1e7, encode as little-endian i32, lon then lat."""
    return struct.pack("<ii", round(lon * 1e7), round(lat * 1e7))


def build_header(*, sections: dict, counts: dict, flags: dict, bounds: dict) -> bytes:
    header = bytearray()
    header += MAGIC
    header += struct.pack("<B", VERSION)
    header += struct.pack(
        "<QQQQQQQQQQQ",
        sections["root_dir_offset"],
        sections["root_dir_length"],
        sections["metadata_offset"],
        sections["metadata_length"],
        sections["leaf_dir_offset"],
        sections["leaf_dir_length"],
        sections["tile_data_offset"],
        sections["tile_data_length"],
        counts["num_addressed_tiles"],
        counts["num_tile_entries"],
        counts["num_tile_contents"],
    )
    header += struct.pack(
        "<BBBBBB",
        1 if flags["clustered"] else 0,
        COMPRESSION[flags["internal_compression"]],
        COMPRESSION[flags["tile_compression"]],
        TILE_TYPE[flags["tile_type"]],
        flags["min_zoom"],
        flags["max_zoom"],
    )
    header += encode_position(bounds["min_lon"], bounds["min_lat"])
    header += encode_position(bounds["max_lon"], bounds["max_lat"])
    header += struct.pack("<B", bounds["center_zoom"])
    header += encode_position(bounds["center_lon"], bounds["center_lat"])
    assert len(header) == HEADER_LENGTH, f"header is {len(header)} bytes, spec requires {HEADER_LENGTH}"
    return bytes(header)


# --------------------------------------------------------------------
# Default fixture content: the five tiles from spec §4.1's own worked
# example (z0/0/0=0, z1/0/0=1, z1/0/1=2, z1/1/1=3, z1/1/0=4), each given
# small deterministic, distinguishable payload bytes.
# --------------------------------------------------------------------

DEFAULT_TILES = [(0, 0, 0), (1, 0, 0), (1, 0, 1), (1, 1, 1), (1, 1, 0)]


def tile_payload(z: int, x: int, y: int, seed: int) -> bytes:
    label = f"tuhura-fixture:{z}/{x}/{y}:seed={seed}".encode("ascii")
    # Padded to a small, fixed-looking size so every tile in the default
    # fixture has a plausible (if synthetic) byte count, not a one-line
    # label — big enough to make a mid-tile range read meaningful, small
    # enough that the whole archive stays well under a kilobyte.
    return label.ljust(48, b".")


def build_archive(
    *,
    tiles: list[tuple[int, int, int]],
    seed: int,
    internal_compression: str,
    tile_compression: str,
) -> bytes:
    entries = []
    tile_blobs = []
    offset = 0
    for z, x, y in tiles:
        payload = tile_payload(z, x, y, seed)
        blob = _compress(payload, tile_compression)
        entries.append(
            {
                "tile_id": zxy_to_tile_id(z, x, y),
                "offset": offset,
                "length": len(blob),
                "run_length": 1,
            }
        )
        tile_blobs.append(blob)
        offset += len(blob)

    # Directory entries must be sorted by TileID (findTile in the
    # vendored pmtiles.js binary-searches assuming ascending order; the
    # spec's own directory-entry table is likewise TileID-ordered) — the
    # default tile list is already in that order, but a caller passing
    # `--tiles` out of order would otherwise silently build a broken
    # archive, so this is enforced rather than assumed.
    if any(entries[i]["tile_id"] >= entries[i + 1]["tile_id"] for i in range(len(entries) - 1)):
        raise ValueError("tiles must be strictly ascending by TileID (zoom, then Hilbert order)")

    root_dir = encode_directory(entries, internal_compression)
    if HEADER_LENGTH + len(root_dir) > ROOT_DIR_MAX_END:
        raise ValueError(
            f"root directory would end at byte {HEADER_LENGTH + len(root_dir)}, "
            f"past the spec's {ROOT_DIR_MAX_END}-byte limit — this fixture is "
            f"meant to stay tiny; shrink --tiles"
        )

    metadata = {
        "name": "tūhura synthetic fixture",
        "description": (
            "Spec-valid PMTiles v3 archive with synthetic tile payloads, "
            "generated by tools/make_fixture_pmtiles.py for storage-seam "
            "tests. Not real map data."
        ),
        "attribution": "tūhura test fixture — no external data",
        "version": "1.0.0",
    }
    metadata_bytes = _compress(json.dumps(metadata).encode("utf-8"), internal_compression)

    zooms = [t[0] for t in tiles]
    min_zoom, max_zoom = min(zooms), max(zooms)

    root_dir_offset = HEADER_LENGTH
    metadata_offset = root_dir_offset + len(root_dir)
    tile_data_offset = metadata_offset + len(metadata_bytes)

    header = build_header(
        sections={
            "root_dir_offset": root_dir_offset,
            "root_dir_length": len(root_dir),
            "metadata_offset": metadata_offset,
            "metadata_length": len(metadata_bytes),
            "leaf_dir_offset": 0,
            "leaf_dir_length": 0,
            "tile_data_offset": tile_data_offset,
            "tile_data_length": sum(len(b) for b in tile_blobs),
        },
        counts={
            "num_addressed_tiles": len(entries),
            "num_tile_entries": len(entries),
            "num_tile_contents": len(entries),
        },
        flags={
            "clustered": True,  # tiles ARE written contiguous in TileID order
            "internal_compression": internal_compression,
            "tile_compression": tile_compression,
            "tile_type": "unknown",
            "min_zoom": min_zoom,
            "max_zoom": max_zoom,
        },
        bounds={
            # A small Wellington-area box — cosmetic, but plausible for
            # what this repo's fixtures should look like (STRATEGY.md).
            "min_lon": 174.0,
            "min_lat": -42.0,
            "max_lon": 176.5,
            "max_lat": -40.5,
            "center_zoom": min_zoom,
            "center_lon": 175.25,
            "center_lat": -41.25,
        },
    )

    return header + root_dir + metadata_bytes + b"".join(tile_blobs)


# --------------------------------------------------------------------
# Self-check: the spec's own §4.1 worked table, verified independently
# of this script's production path (decodes the encoded directory back
# with a hand-rolled varint reader, not by calling encode_directory's
# own internals) before the CLI trusts zxy_to_tile_id or the directory
# codec for anything it writes to disk.
# --------------------------------------------------------------------

_SPEC_TABLE = [
    (0, 0, 0, 0),
    (1, 0, 0, 1),
    (1, 0, 1, 2),
    (1, 1, 1, 3),
    (1, 1, 0, 4),
    (2, 0, 0, 5),
]

# The full z2 square in Hilbert order — every quadrant and rotation the
# curve has, which the spec's own table does not reach. Transcribed from
# the curve's definition (U-shape, rotated per quadrant), and cross-checked
# against the vendored pmtiles.js's zxyToTileId for all of z0..z4 by
# tests/pmtiles-fixture.test.js — the second, independent implementation.
_Z2_TABLE = [
    (0, 0, 5), (1, 0, 6), (1, 1, 7), (0, 1, 8),
    (0, 2, 9), (0, 3, 10), (1, 3, 11), (1, 2, 12),
    (2, 2, 13), (2, 3, 14), (3, 3, 15), (3, 2, 16),
    (3, 1, 17), (2, 1, 18), (2, 0, 19), (3, 0, 20),
]


def _self_check() -> None:
    for z, x, y, expected_id in _SPEC_TABLE:
        got = zxy_to_tile_id(z, x, y)
        assert got == expected_id, (
            f"zxy_to_tile_id({z},{x},{y}) = {got}, spec §4.1's table says {expected_id}"
        )
    for x, y, expected_id in _Z2_TABLE:
        got = zxy_to_tile_id(2, x, y)
        assert got == expected_id, f"zxy_to_tile_id(2,{x},{y}) = {got}, expected {expected_id}"
    # Bijection over z0..z4: 341 tiles onto exactly the ids 0..340. This is
    # the check the six-row table could not make — a wrong bit weight
    # collides ids long before it disturbs the table's rows.
    ids = sorted(
        zxy_to_tile_id(z, x, y)
        for z in range(5) for x in range(1 << z) for y in range(1 << z)
    )
    assert ids == list(range(341)), "TileIDs over z0..z4 are not a bijection onto 0..340"

    # Round-trip the directory codec through an independent decoder.
    entries = [
        {"tile_id": 5, "offset": 1337, "length": 42, "run_length": 1},
        {"tile_id": 6, "offset": 1379, "length": 10, "run_length": 1},  # contiguous
        {"tile_id": 9, "offset": 2000, "length": 7, "run_length": 3},  # a gap + a run
    ]
    encoded = encode_directory(entries, "none")
    pos = 0
    count, pos = read_varint(encoded, pos)
    assert count == len(entries)
    ids = []
    last_id = 0
    for _ in range(count):
        delta, pos = read_varint(encoded, pos)
        last_id += delta
        ids.append(last_id)
    run_lengths = []
    for _ in range(count):
        rl, pos = read_varint(encoded, pos)
        run_lengths.append(rl)
    lengths = []
    for _ in range(count):
        ln, pos = read_varint(encoded, pos)
        lengths.append(ln)
    offsets = []
    next_byte = 0
    for i in range(count):
        raw, pos = read_varint(encoded, pos)
        offset = (offsets[i - 1] + lengths[i - 1]) if (raw == 0 and i > 0) else raw - 1
        offsets.append(offset)
        next_byte = offset + lengths[i]

    assert ids == [e["tile_id"] for e in entries]
    assert run_lengths == [e["run_length"] for e in entries]
    assert lengths == [e["length"] for e in entries]
    assert offsets == [e["offset"] for e in entries]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument(
        "--out", type=Path, default=ROOT / "tests" / "fixtures" / "synthetic.pmtiles",
        help="output path (default: tests/fixtures/synthetic.pmtiles — gitignored; "
        "the tests build their own copy in a temp dir and never read this one)",
    )
    parser.add_argument(
        "--seed", type=int, default=0,
        help="varies the synthetic tile payload bytes without changing the archive's structure",
    )
    parser.add_argument(
        "--internal-compression", choices=sorted(c for c in COMPRESSION if c != "unknown"),
        default="none", help="compression for the root directory + metadata (default: none)",
    )
    parser.add_argument(
        "--tile-compression", choices=sorted(c for c in COMPRESSION if c != "unknown"),
        default="none", help="compression for tile payloads (default: none)",
    )
    parser.add_argument(
        "--tiles", type=str, default=None,
        help='override the default 5-tile set: "z/x/y,z/x/y,..." ascending by TileID',
    )
    args = parser.parse_args()

    _self_check()

    if args.tiles:
        tiles = []
        for part in args.tiles.split(","):
            z, x, y = (int(v) for v in part.strip().split("/"))
            tiles.append((z, x, y))
    else:
        tiles = DEFAULT_TILES

    archive = build_archive(
        tiles=tiles,
        seed=args.seed,
        internal_compression=args.internal_compression,
        tile_compression=args.tile_compression,
    )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_bytes(archive)
    print(f"wrote {args.out.relative_to(ROOT) if args.out.is_relative_to(ROOT) else args.out} ({len(archive)} bytes, {len(tiles)} tiles)")
    print(f"spec: {SPEC_URL} @ {SPEC_REVISION}")


if __name__ == "__main__":
    main()
