# Strategy

What tūhura is for, who it serves, and what it deliberately is not.
Grounded in the founding competitor/data research (2026-08-08,
`research/`).

## Purpose

One map app for the NZ outdoors — **on land and on the water in equal
measure** — that you can trust with your life **when there is no coverage at
all**. Plan in coverage, then go dark for days: maps, boundaries, waypoints,
tracks, tides and forecasts all keep working from the device.

- **On land**: off-road driving, tramping, mountaineering, hunting, birding.
- **On the water**: boating, diving, fishing (fishing spans both — off the
  rocks and off the boat).

**Maritime is a first-class half of the product, not a vertical bolted on**
(owner directive 2026-08-09, restating and strengthening 2026-08-08). The
same bones carry it: coastal and bathymetric layers, marine reserves and
fishing rules, dive sites, tides and sea state, a track that is a wake.
Where the two differ they differ honestly — a boat has no tracks to follow
and no cell coverage two headlands out, and a diver's day is planned around
tide and slack water, not daylight. Data licensing constraints in
`ARCHITECTURE.md` still apply: chart-grade navigation stays a non-goal until
properly licensed, and that is a licence limit, not a statement of priority.

## The two jobs it must nail

1. **Never fail offline.** The founding research found every major
   competitor either paywalls offline (AllTrails, Gaia, CalTopo, onX,
   HuntStand) or fails in the field precisely when signal dies (subscription
   checks phoning home, maps vanishing after download, restarts required).
   Robust, free, offline-by-default is the single biggest open lane in the
   category — and the hardest to retrofit, so it is the founding constraint,
   not a feature.
2. **Answer "am I allowed to be here?"** Access status — DOC conservation
   land, Herenga ā Nuku access points and paper roads — with LINZ parcel
   tenure as context (tenure is not permission; founding review). The onX
   land layer is the most-loved feature in the US category; nobody has
   built its NZ equivalent on the open data that makes it free here.
   Presented honestly: access, not ownership; default-deny; boundaries
   indicative, never legal certainty.

## Positioning

- **Accountless.** No sign-up anywhere in the category except birding's
  nonprofit cluster; every competitor gates value behind accounts and
  subscriptions. tūhura asks for nothing — sync, when it comes, is
  E2E-encrypted and optional (we never learn who you are).
- **Private by default.** No feed, no leaderboard, no bots. Your spots are
  yours; sharing is deliberate (export, link, QR — later E2E share grants).
- **Multi-activity on shared bones, land and sea.** Map, offline regions,
  waypoints, tracks, access layer are common infrastructure; hunting blocks,
  tides, dive sites, bird checklists are thin overlays on top. Competitors
  are siloed per activity and, more sharply, split at the shoreline — the
  land apps stop at the coast and the marine apps start there. NZ users
  stitch four or five apps together today; a weekend that tows a boat to a
  DOC camp needs two of those piles at once.
- **NZ-first, global-quality bar.** The structural advantage is NZ open
  data (LINZ CC-BY topo/parcels, DOC, MPI, Herenga ā Nuku); the UX bar is
  onX/Merlin, not the dated NZ incumbents.

## Audience

NZ outdoors people on phones and tablets: 4WD tourers, trampers and
mountaineers, hunters, birders, fishers, boaties and divers — starting with
the owner's own trips as the proving ground. People burnt by subscription
fatigue and apps that die in the bush. Tablets are first-class, including the
vehicle- or helm-mounted older iPad backed by a phone's sensors (companion
mode, ROADMAP).

## Success measures (these gate spends — founding review)

- A trip's whole map life — plan, navigate, record, review — completed in
  flight mode after one provisioning session in coverage.
- Installed PWA: A11y 100 and installable are hard gates; performance is
  an honest first-load budget (interactive fast on mid-tier hardware,
  measured truthfully — a WebGL map app is not gamed to a Lighthouse 95).
- The owner reaches for tūhura over the stitched-together app pile on a
  real weekend — hunting, 4WD, or a day on the boat — and a screen-on
  recording failure on such a weekend is the gate that starts the hybrid
  track.
- Audience stays owner-household until data-refresh automation exists
  (stale safety-adjacent layers must be impossible before strangers rely
  on them). The "trust with your life" framing is internal engineering
  posture — it never appears in user-facing copy.

## Non-goals (v1)

- **Not a social network** — no public feed, comments, or follower graph.
- **Not turn-by-turn road navigation** — Apple/Google/CarPlay own that.
- **Not a marine chart plotter** — a *licensing* limit, not a priority
  call: LINZ ENC terms forbid the redistribution offline caching requires
  (link out; revisit with proper licensing). Everything the open marine
  data does allow — bathymetry, reserves, fishing rules, dive sites, sea
  state — is in scope, badged not-for-navigation.
- **Not a community POI database** — crowdsourcing needs critical mass and
  moderation; parked until the personal tool is proven.
- **No native rewrite** — the PWA is the canonical product (one codebase,
  push-to-deploy). A thin Capacitor packaging shell is a committed
  track for the native-only sensor set (ADR 2026-08-08-0545) — packaging,
  never a second product. Re-examined 2026-08-09 when Mike re-opened the
  question: this non-goal **held** (native-first buys no capability the
  shell doesn't). **Tier ruled 2026-08-17 (R2)**: the shell stays
  **post-Phase-3**, on a two-armed gate — a real field weekend where
  screen-on recording fails, *or* Mike naming a native-only feature as the
  next deliverable after Phase 3. **Marine layers do not wait on it** (R1):
  every marine layer named above is web-reachable and licence-clear bar
  tides, and they are in v1. What *does* wait for the shell is **marine
  instrument integration** — BLE/NMEA from onboard instruments is
  permanently closed to iOS Safari, so it is post-v1 on the native channel
  and nowhere else. See `research/2026-08-09-0449-platform-pwa-vs-native.md`
  and ARCHITECTURE § Platform posture.

## Future direction (parked, in order)

E2E-encrypted device sync → E2E sharing with mates → offline peer-to-peer
waypoint share in the field (onX has this for hunting only; nobody has
generalised it) → on-device bird sound ID (BirdNET-Live-style, PWA-proven)
→ negotiated data layers (hunting blocks, tides, bathymetry).
