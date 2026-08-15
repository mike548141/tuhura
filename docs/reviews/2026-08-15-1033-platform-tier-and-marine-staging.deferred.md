# Deferred — seeded questions for the platform-tier / marine-staging review

*Open only after your own findings are durably written (REVIEW.md rule 1). A
floor, never a fence: these are where the brief's author thought the risk
lives, which is exactly what you should not inherit before forming your own
view. Fold this file into the brief below the verdict, then delete it.*

## Seeded — the platform tier

1. **Does "maritime first-class" actually entail "marine instruments in
   v1"?** The research treats the owner's directive (boating, diving,
   fishing rank equal with the land activities) as converting BLE/NMEA
   instrument support from contingency to certainty. But the ROADMAP's
   marine item is *layers* (bathymetry, hydro vectors, reserves, dive sites,
   tides) — none of which need a shell — and no roadmap item commits to AIS,
   depth-sounder or NMEA-gateway integration at all. Is the shell "certain"
   because a *committed feature* needs it, or because a *plausible future
   feature* would? If the latter, the honest change is to the **gate**
   ("first shell release when the first native-only feature is scheduled",
   or "when a real multi-hour screen-off need is measured"), not the
   **tier** — and that is a different ask of the owner.
2. **The screen-off-recording argument on the water.** "A day's drift, a
   dive surface interval, an eight-hour crossing: screen-on recording at
   10–20 %/h is not survivable" — is that measured or assumed, and does it
   hold on a helm with 12 V power, or in a dry bag on a kayak? The land
   version of this argument (a hunting weekend) was the founding review's
   grounds; the marine version is asserted, not grounded.
3. **The WKWebView quota claim.** WebKit's storage-policy post gives "other
   apps" 15 %/20 % against a browser's 60 %/80 %. Does that apply to a
   Capacitor app (custom scheme `capacitor://localhost`, WKWebView with a
   non-persistent or persistent data store) the way the research states, or
   is it a default a shell can configure around? Is the "storage seam →
   native filesystem" fix the *only* answer, and is its "≈100 lines"
   estimate honest for range reads over multi-GB files with MapLibre's
   worker-thread tile parsing?
4. **The recurring platform tax vs the founding review's scope knife.** The
   founding review cut scope hard for a solo owner working via AI sessions.
   Re-tiering the shell into v1 adds an Xcode/Gradle toolchain, signing,
   store accounts, review latency, and an annual SDK march to the *same* v1.
   Does the research price what re-tiering costs v1's calendar and
   attention, or only what it buys? Is there a middle option the docs have
   not named — e.g. "shell as Phase 5, built only against the seams v1
   already buys, first native-only feature scoped when the seams exist" —
   that gives the owner a sharper ruling than "in v1 / post-v1"?
5. **The "verified" table.** Spot-check at least: Web Bluetooth's WebKit
   status; the wake-lock-on-installed-PWA claim (iOS ≥ 18.4); the SDK/API
   deadline dates; the "MapLibre React Native v11 mirrors GL JS" claim. A
   date or version that has moved is a finding even if the conclusion
   survives it.
6. **What the research did not consider.** Android-only shell first (Web
   Bluetooth exists in Chrome; Play's tax is one-off)? A companion-device
   path for instruments (an MFi/BLE puck already on the roadmap for GNSS —
   does the same shape reach NMEA)? Progressive enhancement where the PWA
   detects the shell and lights features up? Any of these changes the
   *urgency* of the tier question.

## Seeded — marine's staging

7. **Is a v1 with zero water hero honest to "equal measure"?** Phase 4 has
   four heroes, all land. Which marine hero is *zero-dependency* — no shell,
   no blocked licence: a dive/anchorage log with moon and sunrise/set (both
   computed locally), a wake track with a drift readout, or a GEBCO
   bathymetry base (public domain, cacheable) — and what does adding one
   cost the v1 calendar? The founding review's staging was a delivery-risk
   call made when marine was a vertical; re-price it now that GEBCO (PD) and
   MPI (CC-BY) rows carry no licence risk while tides remain ⏳.
8. **The non-goal's restatement.** STRATEGY now frames "not a marine chart
   plotter" as a licensing limit (LINZ ENC), not a ranking, and keeps "no
   route-planning affordances over water" plus the not-for-navigation badge.
   With marine first-class, is that framing honest to a boatie who will use
   the app at sea regardless — and does the safety framing (the founding
   review's assumption 7) need to say more, or less, than it does?
9. **Coupling check.** If the reviewer's answer to (1) is "gate, not tier",
   does the marine staging still depend on the shell at all — or can the
   two rulings be decoupled so the owner can rule marine into v1 without
   ruling on the shell the same day?

## Seeded — cross-cutting

10. **The docs that get read.** The last session's record audit found the
    research existed but the start-of-session docs still stated the old
    posture as settled, and fixed it at STRATEGY, ARCHITECTURE and the ADR.
    Do those three now say the *same* thing about what is settled, what is
    contested, and what was folded in regardless — or has a fourth surface
    (README, DESIGN, the live `site/` shell copy) been missed?
11. **PRINCIPLES §9 (data carries its time dimension) reached this repo at
    the 2026-08-15 pin bump.** The marine layers are the most time-sensitive
    data in the product (tides, sea state, reserves that change by
    gazette). Does the layer table / manifest design carry world time and
    record time separately, or one "currency date" doing both jobs?
