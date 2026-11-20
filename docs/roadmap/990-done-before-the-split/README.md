# Done before the split

The board's finished work from before it moved to one file per item,
cut from `docs/ROADMAP-DONE.md`
(last changed in `78e31b1`) into one `[x]` item file per entry by
`tools/archivecut.py`. Below the marker line this page is that file
verbatim: its preamble, its headings and every line that was not an
entry, in order, with each entry replaced by a link to the item file
that holds it, and links re-pointed for the new depth.
`python3 tools/archivecut.py --verify` rebuilds the original from these
files and compares it with the last committed copy.

<!-- archivecut:verbatim-below -->
# tūhura roadmap — completed detail (FROZEN 2026-08-17)

**This file is the pre-split archive and takes no new entries.** It was
harvested from the monolithic `ROADMAP.md` as items reached `[x]`. Since the
board split ([ADR 2026-08-17-0545](../../decisions/2026-08-17-0545-adopt-the-split-board.md))
a done item simply stays `[x]` in its own file under
[`roadmap/`](../README.md), flipped in the commit that finishes the work —
there is no harvest step. What is below stays verbatim, newest last; grep it on
demand.

- ✅ [0010-founding-architecture-review](0010-founding-architecture-review.md)
- ✅ [0020-platform-tier-marine-staging-cold-pass](0020-platform-tier-marine-staging-cold-pass.md)
