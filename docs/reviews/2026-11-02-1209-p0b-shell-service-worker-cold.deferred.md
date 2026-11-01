# Held back — the brief-writer's angles for the P0-B shell pass

For `2026-11-02-1209-p0b-shell-service-worker-cold.md`. **Open only after
your own findings are durably written in the brief** (`REVIEW.md` rule 1).
Then fold this in below the verdict and delete this file.

Written by the brief-writing sub-agent (Claude Opus 5.5, of session
`2be3482c`) from the commit file lists, the head of `site/sw.js` and the
item; it did not read the rest of the code. Hypotheses, unproven; none was
driven. Answer each: confirmed, damaged, or already covered by your
finding N.

- **D1 — an update that never lands.** If the new worker waits for a tap,
  an installed app that is never fully closed may run the old shell for
  ever. If it takes over without one, old page code may meet a new worker.
  Which is it, and is either case visible to the person?
- **D2 — a half-finished install.** If one precache fetch fails offline or
  mid-download, does install fail cleanly and keep the old shell, or can a
  partial cache become the active one? Does `cache: "reload"` hold through
  every intermediary between the host and the phone?
- **D3 — the worker's reach.** At the site root, what will the worker
  answer for a path it does not know: a future API, a future fetched tile,
  a 404? The single-page fallback is labelled unverified; what does it
  serve today?
- **D4 — the clean-up on activate.** Does deleting old caches match by
  name in a way that will also delete the future style cache on its own
  version axis, which `sw.js` says is coming?
- **D5 — the manifest's permanent fields.** `id`, `start_url` and `scope`
  are hard to change once a phone has installed the app. Are today's values
  the ones the app can live with when hosting, sub-paths and sync arrive?
- **D6 — "true-dark from the first paint".** Is the theme applied before
  the first frame (no light flash at a campsite), and were the contrast
  ratios computed from the colours the browser actually renders in both
  themes?
- **D7 — a check that writes.** `gen_icons.py` creates `site/icons/` and
  writes files in its main path. Does `--check` ever write into the tree
  before it compares, so a stale set is "fixed" rather than reported? Is
  the maskable icon's art inside the safe zone?
