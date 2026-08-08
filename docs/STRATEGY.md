# Strategy

What tūhura is for, who it serves, and what it deliberately is not.
Grounded in the founding competitor/data research (2026-08-08,
`research/`).

## Purpose

One map app for the NZ outdoors — off-road driving, hunting, fishing,
birding, tramping, boating and diving — that you can trust with your life
**when there is no coverage at all**. Plan in coverage, then go dark for
days: maps, land boundaries, waypoints, tracks, tides and forecasts all
keep working from the device. On the water the same bones serve the marine
verticals: coastal layers, marine reserves, dive spots, sea conditions
(owner directive 2026-08-08; data licensing constraints in
`ARCHITECTURE.md` still apply — chart-grade navigation stays a non-goal
until properly licensed).

## The two jobs it must nail

1. **Never fail offline.** The founding research found every major
   competitor either paywalls offline (AllTrails, Gaia, CalTopo, onX,
   HuntStand) or fails in the field precisely when signal dies (subscription
   checks phoning home, maps vanishing after download, restarts required).
   Robust, free, offline-by-default is the single biggest open lane in the
   category — and the hardest to retrofit, so it is the founding constraint,
   not a feature.
2. **Answer "am I allowed to be here?"** Public-vs-private land, DOC
   conservation land, access points and paper roads — from authoritative
   CC-BY government data (LINZ parcels' `parcel_intent`, DOC, Herenga ā
   Nuku). The onX land-ownership layer is the most-loved feature in the US
   category; nobody has built its NZ equivalent on the open data that makes
   it free here. Presented honestly: boundaries are indicative, never legal
   certainty.

## Positioning

- **Accountless.** No sign-up anywhere in the category except birding's
  nonprofit cluster; every competitor gates value behind accounts and
  subscriptions. tūhura asks for nothing — sync, when it comes, is
  E2E-encrypted and optional (we never learn who you are).
- **Private by default.** No feed, no leaderboard, no bots. Your spots are
  yours; sharing is deliberate (export, link, QR — later E2E share grants).
- **Multi-activity on shared bones.** Map, offline regions, waypoints,
  tracks, land-access layer are common infrastructure; hunting blocks,
  tides, bird checklists are thin overlays on top. Competitors are siloed
  per activity; NZ users stitch four or five apps together today.
- **NZ-first, global-quality bar.** The structural advantage is NZ open
  data (LINZ CC-BY topo/parcels, DOC, MPI, Herenga ā Nuku); the UX bar is
  onX/Merlin, not the dated NZ incumbents.

## Audience

NZ outdoors people on phones and tablets: 4WD tourers, hunters, fishers,
birders, trampers, boaties and divers — starting with the owner's own trips
as the proving ground. People burnt by subscription fatigue and apps that
die in the bush. Tablets are first-class, including the vehicle-mounted
older iPad backed by a phone's sensors (companion mode, ROADMAP).

## Success measures

- A trip's whole map life — plan, navigate, record, review — completed in
  flight mode after one provisioning session in coverage.
- Installed PWA passes: Lighthouse mobile Perf ≥ 95, A11y 100, installable;
  offline region render on real iPhone + Android with the radio dead.
- The owner reaches for tūhura over the stitched-together app pile on a
  real hunting/fishing/4WD weekend.

## Non-goals (v1)

- **Not a social network** — no public feed, comments, or follower graph.
- **Not turn-by-turn road navigation** — Apple/Google/CarPlay own that.
- **Not a marine chart plotter** — hydro chart licensing is restrictive
  (link out; revisit as a later phase with proper licensing).
- **Not a community POI database** — crowdsourcing needs critical mass and
  moderation; parked until the personal tool is proven.
- **No native app** — the PWA constraint is deliberate (one codebase, no
  stores, estate conventions); its honest limits (screen-off recording) are
  designed around, not fought.

## Future direction (parked, in order)

E2E-encrypted device sync → E2E sharing with mates → offline peer-to-peer
waypoint share in the field (onX has this for hunting only; nobody has
generalised it) → on-device bird sound ID (BirdNET-Live-style, PWA-proven)
→ negotiated data layers (hunting blocks, tides, bathymetry).
