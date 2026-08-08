# Design

Direction and rules for tūhura's UI. Mobile-first, field-first.

## Direction / mood

A tool, not a toy: calm, high-contrast, map-dominant. The map is the app —
chrome shrinks to the edges and gets out of the way. Design for the field:
gloves, rain on the screen, full-sun glare, one hand on a steering wheel or
rifle sling. NZ English throughout; te reo Māori names with correct tohutō
(the app is **tūhura** everywhere a human reads it).

## Rules

- **390 px first**, then tablet (~34 rem breakpoint), then desktop. Every
  interactive target ≥ 44 px; primary actions reachable one-handed in the
  bottom third; `100dvh` + `env(safe-area-inset-*)` for fixed elements.
- **Offline state is a first-class UI concern**: what's cached, what's
  stale, what's unavailable offline — visible, honest, never a surprise.
  A layer that may be out of date says so on the map, not in a settings
  screen.
- **Big-glove mode by default**: generous targets, high-contrast icons,
  minimal text on the map screen; progressive detail on tap.
- **Dark mode is a field feature**: true-dark map style for night at camp
  (preserve night vision), not just inverted chrome.
- **Battery honesty**: recording shows expected drain (~10–20%/h screen-on)
  and recommends brightness-down + power bank; a recording that pauses
  (screen lock) says so with a banner, never silently loses data.
- **User data is precious, tiles are not**: waypoints and tracks are the
  only copy until sync exists — backup/export is a prominent first-class
  flow, and the UI never implies recorded data survives "Clear History
  and Website Data" or icon deletion (it does not).
- **Safety-adjacent data is hedged in the UI**: land boundaries are
  "indicative — not legal certainty"; every layer carries source + currency
  on its attribution card.
- **Accessibility is non-negotiable**: WCAG 2.2 AA, semantic HTML, visible
  `:focus-visible`, `prefers-reduced-motion` respected, information never
  by colour alone (grade/status = icon + colour + text). Shared `el()` DOM
  helper from day one (hyphen-aware attributes — the Faves a11y lesson).

## Settings & adaptability (owner directive 2026-08-08)

The app adapts deeply — per activity, per person, per situation — without
ever presenting a hundred dials. Working principles (a dedicated UX
research + design pass is queued, ROADMAP):

- **Profiles over dials**: activity profiles (4WD, hunt, fish, bird, tramp,
  boat, dive) bundle layers, units, and UI emphasis; switching profile is
  one tap on the map screen, not a settings trek.
- **Sensible defaults, discoverable overrides**: everything works untouched;
  every layer and behaviour has a home in settings for the user who wants
  it different. Progressive disclosure — common toggles surface, depth on
  demand.
- **Contextual controls**: a layer's own options live on the layer (long
  press), not in a distant settings tree.
- **Sensitive layers are explicit choices**: layers with cultural or
  privacy weight ship **off by default** behind a clear settings toggle
  with a first-enable explanation. Māori land status (owner ruled
  2026-08-08: ship it) additionally runs its governance track: labels use
  LINZ's legal categories, disclaimer modelled on Te Kāhui Māngai's
  "indicative only" wording, and Te Kōti Whenua Māori + mana whenua
  engagement holds authority over the layer's **shape and existence**
  (status-on-tap vs area fill in hunting profiles is theirs to call) —
  the specific harm faced in writing: an offline area-styled Māori-land
  layer in a hunting app can be a targeting aid for trespass; labelling
  alone cannot mitigate that (founding review).
- **Exports respect privacy**: before any share/export ships — near-home
  trim prompt (tracks start at the house), EXIF GPS strip by default,
  optional coordinate fuzzing. A shared track must not doxx a home or
  burn a mate's spot by accident.
- **ID never means legal-to-take** (standing rule, founding review): any
  species-ID output (sound or photo) carries an in-feature warning that
  it is an aid, never confirmation for a shoot/take decision.

## Screens (v1 sketch)

- **Map** — the app. Layer switcher, locate-me, compass/heading, scale.
  FABs: drop waypoint, record track.
- **Regions** — offline download manager: coverage map, sizes, storage
  budget (`storage.estimate()`), update/delete per region.
- **Waypoints & tracks** — typed pins (camp, hazard, stand, spot, catch,
  sighting…), photo + note attach, GPX/GeoJSON import/export, search/sort.
- **Trip sheet** (later) — tides, forecast, sunrise/set for the active area,
  fetched-before-you-go and cached with its timestamp.
- **About/data** — attribution, licences, data currency, privacy promise.

## Anti-goals

No onboarding carousel, no sign-up wall (there is nothing to sign up to),
no notification nagging, no gamification, no engagement mechanics. Open →
map → go.
