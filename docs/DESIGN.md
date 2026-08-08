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
- **Safety-adjacent data is hedged in the UI**: land boundaries are
  "indicative — not legal certainty"; every layer carries source + currency
  on its attribution card.
- **Accessibility is non-negotiable**: WCAG 2.2 AA, semantic HTML, visible
  `:focus-visible`, `prefers-reduced-motion` respected, information never
  by colour alone (grade/status = icon + colour + text). Shared `el()` DOM
  helper from day one (hyphen-aware attributes — the Faves a11y lesson).

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
