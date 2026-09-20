#!/usr/bin/env python3
"""Generate tūhura's icon set with no external tool.

Why this exists: the PWA manifest needs real PNGs (maskable + plain,
several sizes) and a favicon set, but this machine has no ImageMagick,
no Pillow, and the "one vendored dependency" rule (ADR
2026-08-08-0546) is reserved for the map stack — an image library would
be a second one for a job that doesn't need it. Python's stdlib already
has everything a flat-colour PNG needs: `zlib` for the DEFLATE stream
every PNG chunk carries, `struct` and `binascii.crc32` for the chunk
framing. So the icon is drawn with three primitive shape tests
(circle/triangle/rect membership) evaluated per pixel, not decoded from
a source image — a tiny scanline rasteriser, not a general one.

The mark: a mountain over a water band, on a solid dark tile — "land and
water in equal measure" (owner directive 2026-08-09) as a single glyph,
legible down to a 16 px favicon because it is two bold flat shapes and
nothing finer. Both shapes are kept inside the maskable "safe zone" (a
centred circle at 80% of the icon's width — W3C's maskable-icon
guidance) so the *same* PNG serves the plain "any" purpose and the
"maskable" purpose without a second asset, matching Faves'
`icons/icon-*.png` (`purpose: "any maskable"`).

Regenerate after a palette change in `site/css/app.css`:
    python3 tools/gen_icons.py
"""

from __future__ import annotations

import argparse
import math
import struct
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT / "site" / "icons"
FAVICON_ICO = ROOT / "site" / "favicon.ico"

# Same values as the CSS custom properties in site/css/app.css
# (--bg-dark, --accent-dark) — the icon is a fixed dark tile regardless
# of the viewer's OS theme, like most app icons, so it always uses the
# dark-mode pair. Keep these two literals in step with the CSS by hand;
# there are only two and they change together (a palette change touches
# both files in one commit).
BG = (0x06, 0x09, 0x0A)
FG = (0x2B, 0xD9, 0xAB)

# Sizes the manifest, HTML head and Apple touch-icon convention need.
# (name, pixels, purpose) — purpose only matters for the manifest list.
RASTER_TARGETS = [
    ("icon-192.png", 192, "any maskable"),
    ("icon-512.png", 512, "any maskable"),
    ("apple-touch-icon.png", 180, None),
    ("favicon-16.png", 16, None),
    ("favicon-32.png", 32, None),
    ("favicon-48.png", 48, None),
]


def png_bytes(width: int, height: int, pixels: bytes) -> bytes:
    """A minimal, valid PNG: IHDR + one IDAT + IEND, 8-bit RGBA, no
    interlacing. `pixels` is already filter-byte-prefixed scanlines."""

    def chunk(tag: bytes, data: bytes) -> bytes:
        return (
            struct.pack(">I", len(data))
            + tag
            + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)
        )

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(pixels, level=9)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


def in_triangle(px, py, a, b, c) -> bool:
    """Point-in-triangle via the sign of three cross products — true for
    any point on the same side of all three edges (works for either
    winding order since we only compare sign equality, not a fixed
    sign)."""

    def cross(o, u, v):
        return (u[0] - o[0]) * (v[1] - o[1]) - (u[1] - o[1]) * (v[0] - o[0])

    d1, d2, d3 = cross(a, b, (px, py)), cross(b, c, (px, py)), cross(c, a, (px, py))
    has_neg = d1 < 0 or d2 < 0 or d3 < 0
    has_pos = d1 > 0 or d2 > 0 or d3 > 0
    return not (has_neg and has_pos)


# Glyph geometry in icon-fraction space (0..1 square, y down), designed
# to sit inside the maskable safe circle: radius 0.4 centred on (.5,.5).
# See the module docstring for why only two shapes.
PEAK = ((0.50, 0.20), (0.26, 0.52), (0.74, 0.52))  # apex, base-left, base-right
WATER_Y0, WATER_Y1 = 0.56, 0.70
WATER_X0, WATER_X1 = 0.17, 0.83


def glyph_covers(fx: float, fy: float) -> bool:
    if in_triangle(fx, fy, *PEAK):
        return True
    return WATER_X0 <= fx <= WATER_X1 and WATER_Y0 <= fy <= WATER_Y1


def render(size: int) -> bytes:
    """Full-bleed BG tile with the FG glyph painted on top; opaque
    throughout (maskable icons must have no transparency, and a flat
    app-icon tile has none to give anyway)."""
    rows = []
    for y in range(size):
        row = bytearray([0])  # filter type 0 (None) prefixes every scanline
        fy = (y + 0.5) / size
        for x in range(size):
            fx = (x + 0.5) / size
            r, g, b = FG if glyph_covers(fx, fy) else BG
            row += bytes((r, g, b, 255))
        rows.append(bytes(row))
    return png_bytes(size, size, b"".join(rows))


def write_ico(png: bytes, size: int, dest: Path) -> None:
    """A one-image ICO wrapping a PNG payload directly (the format Vista+
    and every current browser accepts) — no separate BMP/DIB encoder
    needed for a single 32 px entry."""
    header = struct.pack("<HHH", 0, 1, 1)
    entry = struct.pack(
        "<BBBBHHII",
        size if size < 256 else 0,
        size if size < 256 else 0,
        0,  # colour count: not palette-based
        0,  # reserved
        1,  # colour planes
        32,  # bits per pixel
        len(png),
        6 + 16,  # offset: header + one directory entry
    )
    dest.write_bytes(header + entry + png)


def write_svg(dest: Path) -> None:
    """Vector favicon (`<link rel="icon" type="image/svg+xml">`):
    browsers that support it prefer it over the raster favicons, and it
    stays crisp at any pixel density with no size list to maintain."""
    fg = "#%02x%02x%02x" % FG
    bg = "#%02x%02x%02x" % BG
    ax, ay = (v * 100 for v in PEAK[0])
    bx, by = (v * 100 for v in PEAK[1])
    cx, cy = (v * 100 for v in PEAK[2])
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="tūhura">
  <rect width="100" height="100" fill="{bg}"/>
  <polygon points="{ax:.1f},{ay:.1f} {bx:.1f},{by:.1f} {cx:.1f},{cy:.1f}" fill="{fg}"/>
  <rect x="{WATER_X0*100:.1f}" y="{WATER_Y0*100:.1f}" width="{(WATER_X1-WATER_X0)*100:.1f}" height="{(WATER_Y1-WATER_Y0)*100:.1f}" fill="{fg}"/>
</svg>
"""
    dest.write_text(svg, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--check", action="store_true",
        help="regenerate into a temp dir and diff against site/icons "
             "instead of writing (CI-friendly: fails if committed icons "
             "are stale relative to this script)",
    )
    args = parser.parse_args()

    ICONS_DIR.mkdir(parents=True, exist_ok=True)
    written = []
    for name, size, _purpose in RASTER_TARGETS:
        data = render(size)
        path = ICONS_DIR / name
        if args.check:
            current = path.read_bytes() if path.exists() else None
            if current != data:
                raise SystemExit(f"stale icon: {path} does not match the generator")
        else:
            path.write_bytes(data)
            written.append(path)

    svg_path = ICONS_DIR / "favicon.svg"
    if args.check:
        import io

        buf = io.StringIO()
        # write_svg only writes to a real path; re-derive the same text
        # inline for the check rather than touching disk.
        fg = "#%02x%02x%02x" % FG
        bg = "#%02x%02x%02x" % BG
        ax, ay = (v * 100 for v in PEAK[0])
        bx, by = (v * 100 for v in PEAK[1])
        cx, cy = (v * 100 for v in PEAK[2])
        expected = (
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" '
            f'role="img" aria-label="tūhura">\n'
            f'  <rect width="100" height="100" fill="{bg}"/>\n'
            f'  <polygon points="{ax:.1f},{ay:.1f} {bx:.1f},{by:.1f} '
            f'{cx:.1f},{cy:.1f}" fill="{fg}"/>\n'
            f'  <rect x="{WATER_X0*100:.1f}" y="{WATER_Y0*100:.1f}" '
            f'width="{(WATER_X1-WATER_X0)*100:.1f}" '
            f'height="{(WATER_Y1-WATER_Y0)*100:.1f}" fill="{fg}"/>\n'
            f"</svg>\n"
        )
        current = svg_path.read_text(encoding="utf-8") if svg_path.exists() else None
        if current != expected:
            raise SystemExit(f"stale icon: {svg_path} does not match the generator")
    else:
        write_svg(svg_path)
        written.append(svg_path)

    ico_png = render(32)
    if args.check:
        current = FAVICON_ICO.read_bytes() if FAVICON_ICO.exists() else None
        expect = FAVICON_ICO.with_suffix(".check")
        write_ico(ico_png, 32, expect)
        ok = current == expect.read_bytes()
        expect.unlink()
        if not ok:
            raise SystemExit(f"stale icon: {FAVICON_ICO} does not match the generator")
    else:
        write_ico(ico_png, 32, FAVICON_ICO)
        written.append(FAVICON_ICO)

    if not args.check:
        for path in written:
            print(f"wrote {path.relative_to(ROOT)} ({path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
