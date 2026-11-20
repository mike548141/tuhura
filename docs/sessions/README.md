# Session records

One file per working session, named for the time the session started:
`YYYY-MM-DD-HHMM-slug.md`, the time in UTC (the house doctrine's RECORD.md,
§ *The session log*). The folder is the index. The names sort by start time,
so a session getting its bearings reads the newest few files, for example the
ones `ls docs/sessions/[0-9]* | tail -5` lists, and opens older ones only when
it needs them. Some older names carry a two-digit counter where the time
would be (`YYYY-MM-DD-NN-slug.md`). This README is the only file here that is
not a session record.

<!-- archivecut:retired-log-below -->

## The retired one-file session log

This repo once kept a one-file session log beside this folder as well. It
was retired by atelier's `archivecut.py`: each of its entries now sits, word
for word, near the top of the session file it linked, or in a new file named
for its date where it linked none, under the line "From the retired session
log". Below is the rest of that file, word for word: its preamble and
anything else that was not an entry, inside fences so that it is read as a
record and nothing acts on it. The comment lines carry its line numbers, so
`archivecut.py --verify` can rebuild the file from this folder byte for byte.

### `docs/SESSIONS.md`, retired

<!-- archivecut:retired docs/SESSIONS.md lines=36 final-newline=yes last=a0cc351 -->

<!-- archivecut:log-text docs/SESSIONS.md 1+16 -->
````
# tūhura session log (index)

Append-only, newest last; one line per session. **Tail-read this at session
start** (`tail -20 docs/SESSIONS.md`) — it is the index, not the record. Full
detail lives in `docs/sessions/<date>-<HHMM>-<slug>.md`; open a file only when
its line needs unpacking.

Append-only is a rule about **content** — an entry is never edited or reordered
once written — not about the file. When this index outgrows its budget the
recent tail stays and older lines rotate **verbatim** to `SESSIONS-ARCHIVE.md`
(RECORD.md § The session log). Restructured to this shape 2026-08-17, entries
preserved verbatim in the detail files; the `HHMM` on each pre-split file is the
session's **first commit** in UTC, recovered from git rather than invented, and
new sessions use their own start time (`date -u`).

---
````
