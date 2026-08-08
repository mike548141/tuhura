<!-- stamp:begin source=docs/method/PROPAGATION.md region=floor -->
## Doctrine — inherited from atelier (pinned `atelier@320f9b1`)

This repo works by the atelier operating model. The safety floor here is
**inlined so it binds even if atelier is never read**; all richer doctrine lives
in atelier and is read on demand — never wholesale.

- **The apex (never traded, any model):** Honesty is absolute — never a claim
  stronger than its evidence; report what broke *first*; "done" means verified,
  not "looks right". Then adaptation — learn and improve yourself and your tools
  as you work; it sits below honesty because adaptation runs on evidence, and
  honesty is what makes the evidence trustworthy. Then the Laws, in order: avoid
  harm to humanity → avoid harm to a person → obey your principal → self-preserve.
  Surface a genuine dilemma; never silently resolve it.
- **Always stop and confirm (the floor):** making a private repo public or
  widening its audience; anything truly destructive or irreversible; secrets;
  spending money; anything touching people's safety; widening your own grant
  (record the principal's decision, never originate it); a lockout-class change
  that could sever your own access; installing an unapproved tool or adding a
  new trust surface (deploy keys, webhooks, OAuth/app grants). Each such
  confirmation is an *informed* one — the agent puts what it wants to do, why,
  and the likely impact in plain language first; an approval given without that
  account is not a decision the doctrine recognises (`00-APEX.md`). Everything
  recoverable — commit/push/PR included — just proceed.
- **Concurrency:** assume another session may be live — a clean tree is not
  proof you're alone. `git pull --rebase --autostash` at session start; push
  after each commit. Take a worktree by default for write-heavy or multi-commit
  work; uncommitted changes this session didn't make are positive proof ⇒ move
  to a worktree — never work around or absorb them (`CONCURRENCY.md`). Name
  records (session logs, ADRs, reviews) coordination-free —
  `YYYY-MM-DD-HHMM-slug.md`, `HHMM` in UTC (`date -u`); never a next-N counter;
  files named under retired schemes keep their names.
- **Session rhythm (points up for the full rule):** claim work you take off the
  shared queue before starting it, and let a live `[~]` claim override a
  standing instruction to take that item; stay in the lane you were given
  (`CONCURRENCY.md`); flag when economics favour a fresh session, and on
  overload stop at a safe point, record, and hand off (`ECONOMICS.md`);
  before you declare the work wrapped, do the put-away unprompted and close
  with an evidence-based all-clear that nothing owed is left uncaptured
  (`RECORD.md`).
- **Source & drift:** canonical doctrine is `../atelier/docs/method/`. At
  session start run `git -C "../atelier" log --oneline 320f9b1..HEAD`; any
  output means the house doctrine moved — read it, then bump the pin above
  deliberately.
- **Estate resources — point up, don't re-derive:** providers & account plans,
  financial constraints & plan entitlements, licences, credentials, shared
  estate tooling, and the estate inventory live in the operator's **private
  estate-root repo** (atelier's private counterpart). Reference it for these;
  never re-derive them locally or copy its contents down. If **this** repo is
  public, reference the root by local-path convention, never by name — a public
  repo naming the estate's credential/inventory root is reconnaissance.
- **This repo's visibility:** PRIVATE — a push is not publication; making it
  public is a floor action. Verify:
  `gh repo view mike548141/tuhura --json visibility`.
<!-- stamp:end -->

---

# tūhura — session onramp

tūhura (te reo Māori: to explore, discover) is an offline-first mobile PWA map
app for the New Zealand outdoors — off-road driving, hunting, fishing, birding,
tramping. It must work **perfectly with zero connectivity** for days in the
backcountry, and take opportunistic advantage of a connection when one appears.
Accountless, like its sibling `../faves`; a future end-to-end-encrypted backend
syncs and shares waypoints, tracks, and preferences between a user's own devices
and with other users — the server must never be able to read user data.

## Read order at session start

1. `docs/STRATEGY.md` — what tūhura is for and the non-goals.
2. `docs/ARCHITECTURE.md` — current truth: the stack and why.
3. `docs/ROADMAP.md` — what's open; work from `docs/WORKPLAN.md`.
4. Tail of `docs/SESSIONS.md` — where the last session left off. A last commit
   then silence with no closing entry means the last session either died
   mid-flight or is still live — run the read-first recovery sweep
   (`../atelier/docs/method/CONCURRENCY.md` § Surviving an interrupted
   session) before assuming either.

## Hard constraints

- **Offline is the primary mode, not a degraded one.** Every feature is
  designed no-coverage-first: full functionality — maps, waypoints, tracks,
  recorded data — with the radio dead for days. Connectivity is the
  enhancement. A feature that needs the network to be useful in the bush does
  not ship.
- **Zero build step, one sanctioned dependency class.** `site/` is served
  as-is: vanilla HTML + CSS + ES-module JavaScript, no bundlers, no
  frameworks, no CDN dependencies, no npm at runtime. The one deliberate
  departure from Faves' ADR 0001 (recorded in this repo's ADRs): a **vendored**
  map-rendering library and tile-format support, committed into `site/vendor/`
  with its licence carried in `NOTICE`. Vendored means pinned bytes in the
  repo — still no build step, no CDN, no package manager at runtime.
- **Accountless.** No sign-up, no email, no password, no PII. Future sync is
  E2E-encrypted against a dumb ciphertext store (Faves ADR 0017 is the design
  precedent: passkey+PRF headline, bearer sync-code fallback, client-side
  merge, per-user keypair from day one so sharing comes later cheaply).
- **Mobile first.** Phones (390 px) first, then tablets, then desktop. Every
  interactive target ≥ 44 px; designed for gloves, glare, and one hand.
- **Safety-adjacent data is presented honestly.** Land boundaries, hunting
  areas, tides, track grades can bear on people's safety and legality. Show
  data with its source, currency, and licence; never present stale or
  uncertain data as authoritative; degrade visibly (a layer that may be out
  of date says so).
- **Respect data licences.** Offline caching is redistribution — every layer
  cached to the device must have a licence that permits it, with attribution
  carried in-app. A source whose terms forbid it is linked out to, never
  cached.
- **No personal / instance data.** No health, family, financial, or
  personal-estate context enters this repo. Publication-bound: treat every
  commit as if the repo were public; run the leak/secret scans as hooks.
- **Hooks don't travel.** The scan hook and its `hooks.atelierTools` config are
  per-clone — git transports neither, so a fresh clone commits **unscanned**
  until they're reinstalled. Before the first commit on any new clone or
  machine, rewire them (commands in CONTRIBUTING — Development setup).
- **New Zealand English**; correct macrons (tohutō) on te reo Māori — the app
  is **tūhura** in prose and UI, `tuhura` in the repo name, URLs, and code
  identifiers.
- **Accessibility is non-negotiable.** WCAG 2.2 AA, semantic HTML, visible
  focus, prefers-reduced-motion, dark mode (a true-dark map style is a feature:
  night vision at a campsite).

## Layout

- `site/` — the deployable artefact (never mixed with root scaffolding);
  `site/vendor/` — the pinned map library (the sanctioned dependency)
- `docs/` — strategy, architecture, roadmap, decisions, session log
- `tools/` — dev/CI helpers (stdlib-only Python 3, argparse'd)

## Dev loop

```sh
python3 tools/serve.py      # laptop + phone on same Wi-Fi; prints both URLs
python3 tools/check_links.py  # doc link integrity
# further checks (validate.py, vendor pinning) arrive with the code they gate
```

Exercise changes in a real browser at 390 px, and offline (DevTools → Network
→ Offline) before calling them done.

## Conventions

- NZ English; macrons on te reo Māori.
- Comments say *why*, not *what*; ADR the re-litigable decisions
  (`docs/decisions/`); append a `docs/SESSIONS.md` entry before finishing.
- Commit messages: `area: imperative subject`, why-dense body. Areas in play:
  `map`, `layers`, `waypoints`, `tracks`, `offline`, `sync`, `css`, `pwa`/`sw`,
  `a11y`, `data`, `docs`, `tools`, `deploy`.
- `#!#` TODO markers; more `#` = higher priority (`#!####` blocking).
- Lockstep rules live in `docs/ARCHITECTURE.md` once the service worker lands —
  keep them current there, in one place.
