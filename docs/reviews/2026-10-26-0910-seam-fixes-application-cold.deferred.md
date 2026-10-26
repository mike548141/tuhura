# Held back — the brief-writer's angles for the seam-fixes cold pass

For `2026-10-26-0910-seam-fixes-application-cold.md`. **Open only after your
own findings are durably written in the brief** (`REVIEW.md` rule 1). Then
fold this in below the verdict and delete this file.

Written by the brief-writing session (Opus 5.5, `49c917e1`) from one read of
the code at HEAD. These are hypotheses, unproven; none was driven. Use them to
check coverage against your own findings, never as findings.

## Seeded hypotheses

- **D1 — the stand-in may confirm its author's model.** The in-memory OPFS
  in `tests/storage-opfs.test.js` hard-codes `lastModified` to one constant
  and appears to throw `QuotaExceededError` before any byte lands. If so, it
  cannot exercise C8 (a re-download changing the key) or a platform that
  writes part of a chunk and then throws. A test built on the same belief as
  the code proves consistency, not correctness.
- **D2 — a partial write on resume.** On reopen, `write()` resumes at
  `syncAccess.getSize()`. If a quota failure or a short write left bytes past
  the last accepted chunk, the resume offset falls mid-chunk and no longer
  matches `planChunks`. Does that strand the download, or splice it? The
  short-write path throws `ArchiveCorruptError` "not a retry case", but
  nothing truncates the staging file, so the next `write()` may resume into
  the unknown bytes.
- **D3 — `lastModified` on the target platforms.** Where a browser does not
  track a file's modification time, the File API defaults `lastModified` to
  the time of `getFile()`. Then `getKey()` changes on every `open()`, which
  defeats pmtiles' header and directory caches and may grow `Protocol`'s
  registry. Does `move()` keep the staging file's mtime? Is a millisecond
  enough to tell two downloads apart?
- **D4 — the offset-0 clamp is wider than the probe.** It clamps any read at
  offset 0 that runs past EOF, not only the 16 KiB header probe. A crafted or
  truncated archive whose directory asks for `[0, n)` beyond EOF gets short
  bytes instead of `OutOfRangeReadError`. Is "only at offset 0" the narrowest
  rule that matches pmtiles' `FetchSource` precedent, or should it key on the
  probe's length as well?
- **D5 — a stale partial blocks a new version.** `write()` refuses when a
  staging file for another version exists. The only removal path is
  `delete(id)`, which also removes the committed archive, or `abort()`, which
  needs a writer opened at the old version with a `totalBytes` at least the
  stale file's size. So a user with a working region and an abandoned partial
  update may have to lose the working region to update it. Offline-first,
  that is a usability and safety question.
- **D6 — `list()` during a live write.** `list()` calls `getFile()` on a
  staging file that may have an open sync access handle in a worker. Does any
  target browser reject that while the lock is held? If it does, `list()`
  throws instead of reporting the partial, which is exactly the
  degrade-visibly hook it exists for.
- **D7 — `commit()` after a failed `move()`.** `#closed` is set before
  `move()` resolves. If `move()` rejects (busy, quota, a target already
  existing), the writer cannot retry and the caller must call `write()`
  again. Does that path resume and commit cleanly, and is it tested? What
  does `move()` do when a committed archive of the same name exists, under a
  live read handle?
- **D8 — reviving untrusted error JSON.** `archiveErrorFromJSON` builds an
  `ArchiveError` from any object with a string `code`. Today the only sender
  is the app's own worker. Check whether a revived field can reach the DOM
  as markup, and whether structured clone already carries `Error` objects
  across `postMessage` on the target browsers, which would make the JSON
  layer partly redundant.
- **D9 — one fact, one home.** The addendum says "the accepted text above
  stands" and corrects it from below: "thrown, never clamped", the
  five-error set, and `delete()` throwing on a missing id are still in the
  body. A reader who stops at the decision text gets three rules the code no
  longer follows. Are they marked where they stand?
- **D10 — the pin bump in a feature commit.** The `CLAUDE.md` pin moved
  `2b29bb7` → `548b706` inside an `offline:` commit. Did the inlined floor
  block's text get re-synced to canonical at `548b706`, or only the SHA?
  The 2026-09-20 run found the block had drifted from its source once
  before.

## Facts the brief-writer held back

None. Every fact gathered is in the brief's *Grounding* section.
