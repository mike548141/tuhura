# Feature Landscape: Off-road / Hunting / Fishing / Birding Map Apps

Research seed for an offline-first, accountless mobile PWA map app (NZ-based, global quality bar). Compiled 2026-08-08.

---

## 1. Off-Road / Overlanding

### onX Offroad
- **(a) Raved**: 650k+ vehicle-filtered trails w/ difficulty + open/close dates; public/private land boundary overlays; CarPlay/Android Auto; unlimited waypoints; fastest learning curve in category. [features](https://www.onxmaps.com/offroad/app/features)
- **(b) Paywall resentment**: Private-land-ownership data + biweekly "Recent Imagery" locked to Elite ($99.99/yr) — Premium ($34.99/yr) called "underpowered"; free tier capped to one offline area. [pricing](https://www.onxmaps.com/offroad/app/pricing)
- **(c) Offline**: Custom 5/10/150-mile downloads <!-- datescan:allow: mileage tier options, not a date -->, full interactive land/trail data offline; reported struggles navigating offline maps via Android Auto.
- **(d) Waypoints/tracks**: Unlimited waypoints, route builder; **no in-app track trim tool** — forgotten recordings run until battery dies. [reviews](https://justuseapp.com/en/app/1475112177/onx-offroad/reviews)
- **(e) Sharing**: Real-time group location sharing (≤10 people, 5s refresh, session-based, cell-dependent); shareable routes/folders; community trail photos/ratings.
- **(f) Complaints**: Map-layer depth thinner than Gaia; Elite called most expensive single subscription in category; weak on-road nav.

### Gaia GPS
- **(a) Raved**: 250+ map layers (topo/satellite/historic aerial/cell-coverage-by-carrier); USFS seasonal-route MVUM layer; photo-on-waypoint; Trailforks integration.
- **(b) Paywall resentment**: Free tier can't download offline at all; entry tier limited to single-layer/~50 basemaps; full catalogue + Private Land layer needs Premium ($36-40/yr or $89.99/yr bundled). Repeated price hikes cited as churn driver to onX. [membership tiers](https://help.gaiagps.com/hc/en-us/articles/115003524547)
- **(c) Offline**: Region/layer downloads; workflow called "cumbersome," offline search/routing weak.
- **(d) Waypoints/tracks**: Full GPX/KML/GeoJSON export incl. bulk folder export; powerful but steeper learning curve, no browsable trail database.
- **(e) Sharing**: Route/waypoint sharing exists but weak social layer vs onX/Trailforks.
- **(f) Complaints**: "Buggy, crashes, poor web performance" per Gaia's own community forum; no trail difficulty ratings unlike onX. [community thread](https://help.gaiagps.com/hc/en-us/community/posts/16863228352919)

### Trailforks
- **(a) Raved**: Largest trail DB globally (650k-800k trails, 100+ countries) w/ rich metadata; best desktop route planner; auto-generated Ridelogs on in-app recording (no Strava round-trip).
- **(b) Paywall resentment**: Free tier = local region + 14-day trial only; worldwide + offline needs Pro (~$36-40/yr).
- **(c) Offline**: Pro-only, incremental regional updates.
- **(d) Waypoints/tracks**: In-app recording → auto Ridelog + proximity alerts; Strava sync exists but **2025-26 policy change blocks Strava-imported activities from public feed/badges** — only native recordings count. [policy](https://help.trailforks.com/hc/en-us/articles/28386474199959)
- **(e) Sharing**: Strongest community feed/social of the category — followers, trail-condition logging, builder work logs.
- **(f) Complaints**: Not true turn-by-turn driving nav — MTB-first, paired with onX/Gaia for actual driving; menu flow called "disjointed." [forum](https://www.mtbr.com/threads/anyone-tired-of-trail-forks-app.1241306/)

### iOverlander
- **(a) Raved**: Massive global crowdsourced camping/POI DB (mechanics, water, propane, border crossings), traveler-verified + moderated; legacy version fully free/offline/ad-free.
- **(b) Paywall resentment**: **Major reversal** — 2024 "iOverlander 2" relaunch added Pro/Unlimited tiers gating offline maps, satellite imagery, land-use overlays, saved filters; reviewers call it "nearly useless without a subscription" after being free for a decade. [review](https://mwm.ai/apps/ioverlander-2/1486556203)
- **(c) Offline**: Legacy = free offline POI lookup; V2 offline downloads now paywalled.
- **(d) Waypoints/tracks**: POI-centric, **not a track recorder** — users pair with Gaia/OsmAnd for GPS logs.
- **(e) Sharing**: Pure crowdsourced-POI model, no personal trip/social layer.
- **(f) Complaints**: Stale/outdated listings, no occupancy visibility, dated design, unclear closed-spot flagging.

### Hema Maps (Hema Explorer / 4WD Maps) — AU context
- **(a) Raved**: AU-specific 40k+ POI touring DB; "4WD Maps" is one-time-purchase (no subscription), preloaded regional touring maps; HemaX cloud sync incl. NZ topo in Premium tier.
- **(b) Paywall resentment**: Explorer stacks a $49.99 upfront fee **plus** optional $9.99/mo subscription — unusual double-dip vs single one-time 4WD Maps fee; HemaX cloud ToS requires relinquishing rights over user-submitted photos/tracks. [review](https://topwiretraveller.com/review-hema-maps-app/)
- **(c) Offline**: Multi-scale offline topo is core value prop; crashes reported specifically during offline map-section downloads.
- **(d) Waypoints/tracks**: Trip-log with waypoint notes + geotagged photos, synced to cloud.
- **(e) Sharing**: HemaX cloud unlocks pre/during/post-trip sharing.
- **(f) Complaints**: Widely panned UX at launch (improved since); customer service called "effectively non-existent."

### Avenza Maps (georeferenced-PDF model)
- **(a) Raved**: Import official agency PDF maps (USFS MVUM, NPS, BLM) → offline GPS position on them with zero network; accurate in dead zones.
- **(b) Paywall resentment**: Per-map purchases rather than subscription — less resented, but map quality inconsistent/unlabeled (scan vs native).
- **(c) Offline**: Offline-by-design core model.
- **(d) Waypoints/tracks**: Placemarks w/ photo/note; dedicated GPS-track recorder; full GPX/KML/KMZ export.
- **(e) Sharing**: Utilitarian export (AirDrop/email/Dropbox), not social.
- **(f) Complaints**: Many store maps are low-quality scans; Nov-2025 update broke previously-owned maps.

### Other notes
- **Backcountry Navigator**: legacy "PRO" in maintenance mode; successor **XE** being actively rebuilt (2026) — thin public evidence, niche/GPX power-user tool.
- **ExplorOz (AU)**: proprietary offline EOTopo basemap, 100k+ places; reviewers report phantom track-log lines and app freezes after updates while remote — a category-wide reliability pattern (see cross-cutting below).

**Cross-cutting off-road gap**: Offline-mode reliability (crashes/freezes exactly where signal is absent) recurs across onX, Gaia, Hema, ExplorOz — trust in "it'll actually work with zero bars" is the real differentiator, not feature count.

---

## 2. Hunting

### onX Hunt (US category leader, 4.56/5, ~63k ratings)
- **(a) Raved**: Land-ownership boundaries from 3,100+ counties w/ owner name/tax address/acreage; offline 3D + LiDAR maps; huge waypoint icon library; wind/weather overlays. [features](https://www.onxmaps.com/hunt/app/features/land-ownership-maps-parcel-viewer)
- **(b) Paywall resentment**: Basic free tier stripped further in 2026 ("totally useless" per [Rokslide](https://rokslide.com/forums/threads/onx-basic-now-totally-useless.379186/)); tiers Premium $34.99 (1 state) → Two-State $49.99 → Elite $99.99 (all 50 states + tools).
- **(c) Offline**: Full offline packages incl. 3D/LiDAR/satellite/topo/ownership, works at zero signal.
- **(d) Waypoints/tracks**: Custom markers, "Go & Track" recording.
- **(e) Sharing**: Live location sharing (≤9 friends, 5s refresh, cell-dependent) **plus offline waypoint sharing between nearby devices with no signal** — notable precedent for mesh/offline-share design. [feature](https://www.onxmaps.com/hunt/app/features/offline-sharing)
- **(f) Complaints**: Outdated satellite imagery, no seasonal/canopy imagery options, crashes with large offline libraries, landowner records stale up to 8+ months post-sale.

### HuntStand
- **(a) Raved**: Property boundary/owner data; weather+solunar auto-attached to log entries; Group Hunt Areas w/ message board; 2M active hunters / 4.8M hunt areas dataset.
- **(b) Paywall resentment**: Pro $29.99/yr, Ultimate $99.99/yr (rut-prediction maps); users complain new tiers gate what used to be included.
- **(c) Offline**: Pro/Ultimate only; only satellite imagery caches (not all layers); **app phones home on launch even with maps downloaded**, delaying offline display. [zendesk](https://huntstand.zendesk.com/hc/en-us/articles/16598671273620)
- **(d) Waypoints/tracks**: Large icon set; dedicated "first blood" marker + colour-coded "Tracer" blood-trail path recording — a genuine UX innovation worth emulating.
- **(e) Sharing**: Group Hunt Areas (collaborative once shared with ≥1 user) + chat.
- **(f) Complaints**: "Much better base maps but the UI royally sucks"; instability, data loss, inaccurate wind direction; absorbed/discontinued ScoutLook (Mar 2024), losing users' stored data in the merger.

### Spartan Forge (AI whitetail-movement prediction — niche/US-specific)
- **(a) Raved**: AI deer-movement predictions, CyberScout AI chat, LiDAR + slope-angle bedding-terrain layer, high-res UAV imagery.
- **(b) Paywall resentment**: UAV high-res imagery expensive to expand → limited coverage; some cancel after a year feeling no edge over onX.
- **(c)/(d)/(e)**: Standard offline/waypoint tools; not a sharing-focused app.
- **(f) Complaints**: Property-line data staleness; narrow whitetail-only use case limits appeal.

### BaseMap
- **(a) Raved**: 900+ layers, nationwide parcel/owner boundaries, "$500 navigation-error reimbursement" guarantee, rangefinder integration, desktop hunt planner.
- **(b) Paywall resentment**: Free = GPS only; Pro $39.99 → Advantage $69.99 → Ultimate $99.99/yr.
- **(c) Offline**: **Reliability gap** — multiple 2025-26 reports that offline/airplane mode drops the Pro subscription check and reverts to free tier mid-hunt. [reviews](https://justuseapp.com/en/app/1305237481/basemap-hunting-gps-maps/reviews)
- **(d)** Rangefinder-tied waypoint marking.
- **(f) Complaints**: Crashes on layer toggle, slow Pro-status detection, uncorrectable compass azimuth errors; "too many bugs, moved back to onX."

### NZ-specific hunting landscape
- **HuntBlocks NZ / "Hunt NZ"** (indie): layers DOC hunting blocks + live GPS + species guide + offline regional downloads + private hunt journal + community closure reports, vector-tile topo finer than 1:50k, no ads. **Site currently down** (huntblocks.co.nz redirects to a "hosting usage exceeded" page) — illustrates fragility of small NZ indie infra, a credible gap for a well-resourced entrant. [App Store](https://apps.apple.com/nz/app/hunt-nz-offline-maps-gps/id1562467564)
- **DOC hunting permits** (`permits-licences.doc.govt.nz`): **no map/GPS app at all** — a web portal only. Real-time block availability (no login), online booking/payment for restricted blocks, free open-area permits across 8 regions covering 93% of Public Conservation Land (~7.8M ha); ~2,500 hunters/month, 20k+ permits since relaunch. No official GIS boundary layer/PDF/app — third parties fill the gap. [portal](https://permits-licences.doc.govt.nz/)
- **Herenga ā Nuku / Walking Access Commission (WAMS + Pocket Maps)**: the actual authoritative NZ public-access boundary dataset (walk/hunt/fish/4WD access, public + negotiated private land) since 2010; Pocket Maps app gained a full offline topo basemap May 2024. **This is the closest NZ equivalent to onX's land-ownership layer and is government-authoritative** — a strong data-partner/integration target. [herengaanuku.govt.nz](https://www.herengaanuku.govt.nz/maps/outdoor-access-maps)
- **Fish & Game NZ**: licensing is web-purchase + emailed PDF, no app.
- Forum caveat (NZ Hunting & Shooting): DOC boundary overlays are **indicative only** — GPS-matches-map ≠ legal certainty; don't over-promise boundary precision.

**Cross-cutting hunting gaps**: (1) no app reliably validates subscription/offline status without phoning home; (2) land-ownership data staleness is universal; (3) no US app has NZ DOC-block/WAMS data — the NZ market is served only by fragile indie apps; (4) blood-trail/kill-site marking (HuntStand's Tracer) is becoming its own feature category, worth building first-class rather than generic; (5) offline peer-to-peer location sharing (onX's zero-signal waypoint share) has no true mesh equivalent — a genuine differentiator opportunity for NZ backcountry.

---

## 3. Fishing

### Fishbrain
- **(a) Raved**: AI Fish ID from photos (300+ species); AI bite-time/solunar forecasts fed by community catch data; 20M+ user catch database for finding productive water; bulk catch-photo upload w/ auto species recognition.
- **(b) Paywall resentment**: Nearly every planning feature (7-day forecast, hourly bite times, depth-contour maps, most shared catch positions) sits behind Pro ($9.99-12.99/mo, ~$120-155/yr); free tier called "nearly unusable" with upgrade prompts on almost every tap.
- **(c) Offline**: **Weak** — explicitly "best used while online," most tools need connectivity; called out as unsuited to remote/no-signal fishing vs rivals. [comparison](https://fishingsun.com/a/blog/onwater-vs-fishbrain-which-fishing-app-fits-best-for-you)
- **(d) Waypoints/tracks**: Personal waypoints + depth contours (Navionics/C-Map partnership) are Pro-only; catch-location accuracy widely reported as "wildly inaccurate."
- **(e) Sharing**: Core to product — follows, customizable feed, per-species leaderboards; spot privacy opt-in per catch, but premium spot data paywalled.
- **(f) Complaints**: Frequent crashes needing reinstall, followers silently dropped, aggressive paywalling, battery drain, **bot/scam problem in social feed** (phishing/solicitation).

### Navionics (Garmin)
- **(a) Raved**: Best-in-class chart detail, SonarCharts HD bathymetry to 1ft/0.5m contours; Plotter Sync to real chartplotters; ActiveCaptain community layer (marinas/hazards/tips); the de facto phone-as-chartplotter standard.
- **(b) Paywall resentment**: ~US$50/yr; new ToS reportedly **wipes access to previously-purchased charts on expiry**; switching devices can lose purchased chart access; capped at 2 devices; route-following (vs. creation) reportedly locked down in a recent update.
- **(c) Offline**: Strong — charts cache for offline, core value prop; NZ anglers confirm "doesn't need cell coverage, just GPS." Caveat: depth shown is charted only, doesn't auto-adjust for tide/draft.
- **(d) Waypoints/tracks**: Full GPX import/export of tracks/routes/markers; SonarChart Live builds real-time bathymetry from connected sonar while trolling.
- **(e) Sharing**: "Connections" live position/track/route sharing with friends/fleet; Community Edits crowdsource chart corrections. No catch log/species DB/forecast — not a fishing app per se.
- **(f) Complaints**: Billing errors/double-charging, "subscription loop" bugs blocking paid content, sonar-depth inaccuracy reported ("50ft shown where it's 3ft" — safety-relevant), dated UI.

### Fishing Points
- **(a) Raved**: Strongest **free** tide/solunar/weather planning tool in category; catch log auto-attaches weather/solunar/tide; fishfinder-style waypoint marking; four map types incl. nautical+satellite even on free tier; cheap premium ($5-10/yr); NZ anglers' pick despite gaps.
- **(b) Paywall resentment**: Premium nautical/satellite layers + some lake depth gated; **NZ users specifically note it lacks NZ nautical charts** despite "worldwide" framing — real regional gap; charged despite advertised 7-day trial in some reports.
- **(c) Offline**: Built on NOAA charts (US-centric) — unclear how deep NZ offline chart coverage goes outside satellite/OSM layers.
- **(d) Waypoints/tracks**: GPX/KMZ export; **privacy-first by default** — "everything saved is private, not shared with anyone" unless explicitly exported.
- **(e) Sharing**: Opt-in export/share only, no built-in social feed/leaderboard — deliberate Fishbrain contrast.
- **(f) Complaints**: Waypoints unexpectedly deleted (data-loss trust issue); forecast accuracy questioned (swell predictions reportedly half actual height); sync failures post-purchase.

### Tide / marine-weather apps (NZ relevance)
- **Tides Near Me**: simple, forward-looking; offline claims inconsistent with user reports of not working offline/out of range.
- **Windy.app**: buoy-calibrated tides at 3000+ locations, multi-model weather, genuine offline mode for pre-downloaded forecasts; no fishing-specific features.
- **LINZ tide predictions**: NZ's authoritative source (PDF/CSV). Built on this: **Tides NZ** (~230 ports, no-internet-required) and **NZ Tides** (LINZ-sourced lookup table, fully offline by design). These outperform global tide apps on offline reliability because data ships baked-in. [linz.govt.nz](https://www.linz.govt.nz/products-services/tides-and-tidal-streams/tide-predictions)
- **PredictWind**: strong wind/wave/tidal-current suite (4.68/5, 26k ratings), free; separate **Offshore** app supports true offline via GRIB files (tidal-current GRIB offline needs paid subscription); NZ testimonials praise west-coast bar-crossing accuracy.
- **MetService Marine (NZ)**: free (Maritime NZ-sponsored), tides/forecasts/radar; no offline-specific claims, phone-only.

### NZ-specific fishing apps
- **NZ Fishing Rules** (Fisheries NZ, official): GPS-aware bag-limit/rules lookup — compliance tool, not mapping/logging.
- **NZ Fishing News**: digital-magazine subscription, not a spot/logging tool.
- **Fish & Game NZ**: licensing website only, no app.
- Forum consensus (fishing.net.nz): NZ anglers stitch together Navionics + Fishing Points + Fishbrain + PredictWind + MetService — **no single app covers chart+tide+log+social for NZ waters**, the clearest opportunity signal in this category.

**Cross-cutting fishing gap**: privacy-vs-social is a real fork (Fishbrain = social/leaderboard/paywalled; Fishing Points = private/free-ish) — a new entrant can offer private-by-default logging with opt-in sharing, genuine NZ chart/tide data baked in offline, and skip the bot/spam problem entirely.

---

## 4. Birding

### eBird (Cornell Lab)
- **(a) Raved**: Traveling/stationary checklists w/ GPS auto-distance; global hotspot map; life list auto-built; Macaulay Library photo/audio attach; rare bird alerts (RBA); NZ Bird Atlas (2019-2024) used eBird as its native NZ digital data-collection tool. [NZ portal](https://www.birdsnz.org.nz/birding/ebird/)
- **(b) Paywalls**: **None** — free, nonprofit. Atypical vs. other three categories.
- **(c) Offline**: Offline Mode pre-downloads maps/checklists, syncs on reconnect; entry point reportedly hard to find on Android.
- **(d) Waypoint/track UX**: Stationary vs. Traveling protocols; traveling mode auto-tracks distance/route even offline; effort metrics (time/distance/party size) mandatory, feeding data-quality scoring.
- **(e) Sharing**: Checklist sharing with companions; hotspot pages aggregate checklists; RBA distributed by region.
- **(f) Complaints**: UX called dated/unintuitive ("icon-heavy without labels"); can't fine-edit sightings from mobile; duplicate/misidentified records linger; RBA filter tuning fiddly.

### Merlin Bird ID (Cornell Lab)
- **(a) Raved**: Sound ID identifying multiple simultaneous species in real time (most-praised feature in category); Photo ID 5-question flow; fully offline regional "bird packs"; 4.9-star rating; zero paywall friction.
- **(b) Paywalls**: None — free/donation-supported.
- **(c) Offline**: **Standout** — downloadable packs give full Sound ID + Photo ID offline with zero connectivity; packs can be storage-heavy.
- **(d)**: No track/route recording — point-in-time ID only, interlinks to eBird for logging.
- **(e) Sharing**: Personal life list, syncs across devices when logged in; no route sharing.
- **(f) Complaints**: Rare/regional species often missing from matches; life list has reportedly disappeared/relocated after updates and doesn't sync offline/logged-out.

### BirdNET (Cornell / Chemnitz)
- **(a) Raved**: AI acoustic ID across 6,000+ species; spectrogram visualisation; confidence-ranked matches; live global activity stats.
- **(b) Paywalls**: None.
- **(c) Offline — key nuance**: Original BirdNET app records offline but **needs internet to send audio to servers for analysis**. Newer **BirdNET Live** (a PWA using TensorFlow.js) runs the model **fully on-device**, no audio ever leaves the phone — directly relevant precedent for an offline-first PWA. [birdnet.cornell.edu/app](https://birdnet.cornell.edu/app/)
- **(d)**: No route/checklist tooling, single-capture events, optional location tagging.
- **(e) Sharing**: Optional contribution to global DB; no hotspot/social layer.
- **(f) Complaints**: Inconsistent results across devices; false "can't identify" defaults to a wrong guess; struggles with confusable calls (e.g. shorebirds); freezes on repeated use.

### NZ-specific birding tools
- **eBird NZ regional portal**: Birds NZ (OSNZ) + Cornell partnership since 2008; NZ names/km distances; used as the Bird Atlas's native tool — strong precedent that NZ birders already trust the eBird checklist/hotspot model.
- **NZ Birds Online**: reference encyclopaedia, not an observation-logging app — a licensable/linkable ID reference layer.
- **Bird Song NZ**: NZ-specific AI acoustic ID, te reo Māori names + pronunciation, DOC conservation-status tagging, nearby-sightings feed; offline capability unconfirmed, worth direct testing. [bird-song.co.nz](https://www.bird-song.co.nz/)
- **AviaNZ**: open-source research-grade acoustic analysis (DOC/Predator Free NZ adjacent), not a consumer field app.
- **iNaturalist NZ – Mātaki Taiao**: general biodiversity app, DOC-endorsed; offline capture queues without signal and syncs later; **no in-app bird-specific life list** — must use the website, a friction point vs. eBird/Merlin.

**Cross-cutting birding insight**: all four majors (eBird, Merlin, BirdNET, iNaturalist) are free/nonprofit — **birding is the one category with no paywall precedent**. The exploitable gaps are UX modernity, true on-device offline inference (BirdNET Live's model, not the older server-round-trip pattern), and a unified life-list + route-tracking experience in one app rather than three.

---

## 5. General Outdoors / Topo

### AllTrails
- **(a) Raved**: 450k+ trails, 191 countries, community reviews/photos; wrong-turn alerts; 3D previews; live activity sharing; 2025 additions — Trail Conditions (15 weather factors hourly), Community Heatmaps, AI "Outdoor Lens" plant/landmark ID. 4.9★/1M+ reviews.
- **(b) Paywall resentment**: **Free tier has no offline maps at all** — hard blocker in dead zones. 2025 third "Peak" tier ($79.99/yr vs. Plus $35.99/yr) moved previously-Plus features up a tier, angering long-time subscribers.
- **(c) Offline**: Plus/Peak only; area-size capped (oversized selections blocked, "zoom in" prompt); trail-dense areas only download the popular subset.
- **(d) Waypoints/tracks**: Standard record+pin, GPX export; well-documented **battery drain** flagged as a safety risk mid-trail.
- **(e) Sharing**: Category leader — reviews, photo gallery (65M+ community), live sharing, heatmaps, following. Also its biggest liability.
- **(f) Complaints**: Reviews attach to wrong trail, stale reviews resurface as current, wrong trailhead directions; reports of auto-uploading private photos despite disabled permissions; data weaker outside North America/W. Europe (relevant to NZ).

### Komoot
- **(a) Raved**: Surface/incline-aware route planning; Trail View (community trail photos pre-trip); Highlights community-favourite-place layer; well-rated voice guidance.
- **(b) Paywall resentment**: **Major Feb-2025 restructure** — new users can no longer buy one-off region packs; **device sync (Garmin/Wahoo/watches) now requires Premium** (€59.99/yr) even for one route — called "subscription fatigue," rivals don't charge for device sync. Legacy users keep old access, creating a two-tier userbase.
- **(c) Offline**: Whole-region downloads + offline rerouting; now subscription-gated for new users (previously one-time purchase).
- **(d)**: Route-planning-first (draw/adjust) rather than freeform waypoint-dropping.
- **(e) Sharing**: Follow + "close friends" visibility tiers; personal adventure log, shareable or private.
- **(f) Complaints**: "Isn't worth a subscription — route planning with little else"; new paywall seen as bait-and-switch.

### Organic Maps
- **(a) Raved**: Fully free, **no account, zero tracking/ads/data collection** (Exodus-verified) — explicit anti-AllTrails/Komoot positioning; complete offline function incl. contours/elevation profiles/turn-by-turn voice, all on OSM; 4.8★; 2025 adds — planned-route saving, track stats, GeoJSON import.
- **(b) Paywalls**: None — open-source, donation-funded.
- **(c) Offline**: Fully offline by design, not an add-on; region-based OSM tile downloads.
- **(d) Waypoints/tracks**: Bookmarks + recording; import/export GPX/KML/KMZ/KMB/GeoJSON; historical bugs (colour not preserved on export, dropped start/end points) since fixed.
- **(e) Sharing**: Essentially none by design — no accounts/community layer, export/import only.
- **(f) Complaints**: Fewer features than OsmAnd; search/address relevance issues; entirely dependent on local OSM data density (a risk for remote NZ backcountry if OSM coverage there is thin).

### CalTopo
- **(a) Raved**: Slope-angle shading, viewshed analysis, live SNOTEL/weather overlays, desktop↔mobile sync; the SAR/backcountry-ski community standard.
- **(b) Paywall resentment**: **Offline download requires paid Mobile sub ($20/yr) — nothing downloads free**, same hard-offline-paywall pattern as AllTrails; higher tiers for Google Earth export/bigger PDFs; called "expensive vs other nav apps."
- **(c) Offline**: Full-res offline of non-premium layers incl. satellite once paid; auto-sync on reconnect. Bugs: needs restart every 10-15 min offline, unintuitive download flow, slowdowns past ~1,000 waypoints.
- **(d)**: Desktop-grade planning tools carried to mobile; waypoint-heavy trips cause UI slowdown.
- **(e) Sharing**: Shared-account collaboration (SAR teams, group planning), not public discovery.
- **(f) Complaints**: Steep learning curve, offline reliability bugs, cost — a power-user tool, not mass-market; a gap for a simpler offline-first competitor.

### NZ-specific topo apps
- **LINZ NZ Topo50 licensing — confirmed CC BY 4.0.** Nearly all LINZ Data Service layers are reusable, including commercially, with attribution. **A new NZ app can legally use official LINZ topo tiles as its base layer for free** instead of licensing OSM or a commercial provider. [linz.govt.nz](https://www.linz.govt.nz/products-services/data/licensing-and-using-data/attributing-linz-data) (Exact WMTS/API technical details need a direct follow-up against `data.linz.govt.nz`.)
- Wilderness Magazine's 4-app NZ roundup: **OSMaps** ($55/yr, offers LINZ Topo50, limited offline); **OsmAnd+** ($40 one-time, no LINZ layer, OSM-only, steep learning curve); **MapOut** ($8.99 one-time, iOS-only, single map type); **Topo GPS** ($6.50/map, basic toolset). [wildernessmag.co.nz](https://www.wildernessmag.co.nz/review/which-navigation-app-should-you-use/)
- **Topo4GPS NZ**: ~460MB/region, offline after download, includes **DOC hunting-block boundaries** — cross-category precedent worth noting.
- **NZ Topo Map (topomap.co.nz)**: Android full-featured (GPX/KML/FIT import, unlimited markers, GPX editor, offline caching, elevation profiles); **iOS materially weaker** — no track recording/route display/speed display, a real platform-parity gap. User anger at shift from one-time purchase to NZ$22.99/yr subscription breaking old installs; reported "map disappears on zoom after full download" bug called "potentially deadly."
- **MapToaster / iHikeGPS / Memory-Map (Topo4GPS Tramper)**: smaller players; common complaints are slow Wi-Fi downloads and clunky PC↔app sync.

**Cross-cutting general-outdoors gap**: Offline capability is paywalled in every major global app (AllTrails, Komoot, CalTopo) — a free-forever-offline core (Organic Maps' model) is the clear differentiation lane. NZ topo apps have legitimate data rights (LINZ CC-BY) but weak UX/social layers and poor iOS/Android parity — an opening to combine official data with a genuine multi-activity community layer none of them offer.

---

## 6. Synthesis — Prioritised Feature List

### Design thesis
The competitive set splits cleanly on two axes that a new entrant can exploit simultaneously:

1. **Offline is universally paywalled or unreliable.** AllTrails, Komoot, CalTopo, Gaia, HuntStand, BaseMap, Fishbrain all gate offline behind a subscription, and even paid offline modes crash, drop subscription checks, or fail silently in the exact zero-signal conditions they're sold for (HuntStand phones home on launch; BaseMap reverts to free tier offline; CalTopo needs restarts every 10-15 min; NZ Topo Map's map "disappears on zoom" after download). **Free, robust, offline-by-default is the single biggest differentiator available** — Organic Maps and Merlin's bird-pack model are the only two proof points that this works well.
2. **Accountless is unclaimed territory.** Every major app in every category requires sign-up to get real value (onX, Gaia, Fishbrain, AllTrails, HuntStand, Navionics). Birding is the exception — eBird/Merlin/BirdNET are free and largely frictionless — proving a no-signup, no-paywall model is viable when the value proposition doesn't depend on land/chart licensing costs.

NZ has an unusual structural advantage: **LINZ Topo50 is CC-BY 4.0** (free commercial base-map rights) and **Herenga ā Nuku's WAMS/Pocket Maps dataset is the government-authoritative public-access/hunting-boundary layer**, already offline-capable since May 2024. No competitor — global or NZ-indie — is combining official free data with a modern multi-activity offline-first app; the closest indie (HuntBlocks) is currently offline entirely.

### Common infrastructure (build once, reuse across all four activities)
| Capability | Notes from research |
|---|---|
| **Offline map tiles** | LINZ Topo50 (CC-BY, NZ-specific, free) as primary base layer; OSM as fallback/global. Must survive zero-signal reliably — this is where every competitor fails. |
| **Offline area download** | Region-based (not single-trail) downloads, no hard size caps that block large areas (AllTrails' "zoom in" wall is a complaint, not a model to copy). |
| **Waypoints/pins** | Universal primitive — icon-typed (species/hazard/camp/stand/spot), photo+note attachment, GPX/KML/KMZ/GeoJSON export as baseline (table stakes per Gaia, Avenza, Organic Maps, Navionics). |
| **Track recording** | Start/stop/pause, auto-distance/time/elevation, **explicit trim/edit tool** (onX's missing-trim complaint), export to GPX. |
| **Land/access boundary layer** | Public/private/DOC/WAMS overlays — reusable across 4WD (legal tracks), hunting (permitted blocks), fishing (access points), even birding (reserve boundaries). This is the single highest-leverage shared layer given the WAMS data source. |
| **Tide/weather baseline** | LINZ tide predictions (official, NZ-wide) benefits fishing directly and off-road/hunting/birding indirectly (trip planning, river crossings, weather windows). |
| **Sharing/export** | Opt-in, local-first (export/import file or link) rather than cloud-social — sidesteps Fishbrain's bot/spam problem and onX's cell-dependent live-share limitation. Consider onX's "offline waypoint share between nearby devices" (Bluetooth/local network) as a genuine differentiator with no true equivalent anywhere in the research. |
| **Privacy-by-default** | Fishing Points' "nothing shared unless you export" model, and Organic Maps' zero-tracking stance, are both explicitly praised — carry this across all four activities rather than defaulting to a social feed. |

### Activity-specific overlays (build per-vertical, on top of shared infrastructure)
| Activity | Overlay | Precedent / rationale |
|---|---|---|
| **4WD/off-road** | Trail difficulty grading + open/close seasonal dates | onX Offroad's most-loved feature; Trailforks' metadata depth |
| | Vehicle-type filtering (4×4/ATV/UTV) | onX Offroad |
| **Hunting** | DOC hunting block boundaries + permit status | Fills the gap DOC's own web-only portal leaves; Topo4GPS NZ already does a basic version |
| | Blood-trail / kill-site marker mode | HuntStand's "Tracer" — a genuine differentiated micro-feature, cheap to build, well-loved |
| | Species/season info | onX Hunt, HuntStand |
| **Fishing** | Tide + solunar overlay tied to spot markers | Fishing Points' auto-attach model |
| | Depth/bathymetry (stretch — licensing-dependent) | Navionics SonarCharts — likely too costly for v1; treat as phase-2+ |
| | Species catch log | Fishbrain, Fishing Points |
| **Birding** | Offline sound/photo ID (on-device inference) | BirdNET Live (TensorFlow.js, PWA-native precedent) and Merlin's offline packs — technically the most novel ask, scope carefully |
| | Checklist mode (stationary/traveling) + hotspot map | eBird's protocol model, already trusted by NZ birders via the Bird Atlas |
| | Life list | eBird/Merlin |

### Phased roadmap

**v1 (offline-first, accountless, NZ-first)**
1. LINZ Topo50 offline base map (region download, robust zero-signal rendering) — the trust foundation everything else depends on.
2. Waypoints: typed pins, photo/note attach, edit/delete.
3. Track recording with trim/edit and GPX export.
4. WAMS/Herenga ā Nuku public-access + DOC hunting-block boundary overlay (single shared layer, dual-purpose for 4WD legality and hunting permission).
5. LINZ tide data overlay (benefits fishing now, cheap to add given open data).
6. Local export/import (GPX/KML) for sharing — no account, no cloud dependency.
7. One activity-specific "hero" feature per vertical to prove the multi-activity thesis without overbuilding: trail difficulty tags (4WD), blood-trail marker mode (hunting), tide-linked catch log (fishing), stationary/traveling checklist (birding).

**Phase 2**
1. Offline sound ID for birding (on-device model, BirdNET Live-style) — highest technical lift, highest novelty.
2. Bluetooth/local-network waypoint and track sharing between nearby devices with zero signal (matches onX's offline-share, extends it beyond hunting to all four activities) — the most defensible differentiator identified in the whole research set, since no competitor has generalised it.
3. Community-contributed POI layer (iOverlander/AllTrails/Trailforks model) but opt-in and moderated to avoid the staleness and spam problems both categories report.
4. Vehicle-type trail filtering, seasonal open/close automation.
5. NZ-specific species/season/regulation data feeds (Fisheries NZ rules, DOC hunting seasons) surfaced contextually on the map.

**Phase 3 / stretch**
1. Bathymetry/nautical chart layer for fishing (licensing-dependent — evaluate LINZ hydrographic open data vs. commercial).
2. Trail-condition/heatmap crowdsourcing (AllTrails Community Heatmaps model) — only once a critical mass of users exists to make the data meaningful.
3. Cross-device account-optional sync (e.g., end-to-end encrypted, user-controlled — not a data-harvesting account model) for users who want continuity across phone/tablet without breaking the accountless promise.
4. AI camera ID (plant/landmark/bird) — AllTrails' Outdoor Lens and Merlin's Photo ID are the precedents; defer until core reliability is proven, since "on-device AI ID" is the single highest-effort, highest-risk-of-disappointing-vs-incumbents feature in the set.

---

## Source list (representative, inline citations above)
- onX Offroad: onxmaps.com, risingsun4x4club.org, justuseapp.com
- Gaia GPS: help.gaiagps.com, utoverland.com, overlandbound.com
- Trailforks: trailforks.com, help.trailforks.com, mtbr.com
- iOverlander: mwm.ai, bearfoottheory.com, overlandbound.com
- Hema Maps: hemamaps.com, topwiretraveller.com, aulro.com
- Avenza: store.avenza.com, support.avenzamaps.com
- onX Hunt: onxmaps.com/hunt, rokslide.com, apps.apple.com
- HuntStand: huntstand.com, huntstand.zendesk.com, rokslide.com
- Spartan Forge: outdoorlife.com, fieldethos.com, rokslide.com
- BaseMap: basemap.com, justuseapp.com, rokslide.com
- DOC / Herenga ā Nuku: permits-licences.doc.govt.nz, herengaanuku.govt.nz, deerstalkers.org.nz
- NZ hunting indie: apps.apple.com (Hunt NZ), nzhuntingandshooting.co.nz
- Fishbrain: fishbrain.com, fishingsun.com, justuseapp.com
- Navionics: navionics.com, panbo.com, wavveboating.com, navionics.pissedconsumer.com
- Fishing Points: fishingpoints.app, justuseapp.com
- Tides/marine: linz.govt.nz, niwa.co.nz, apps.apple.com (Tides NZ, PredictWind), help.predictwind.com
- eBird/Merlin/BirdNET: ebird.org, support.ebird.org, birdsnz.org.nz, merlin.allaboutbirds.org, birdnet.cornell.edu, birda.org, birdforum.net
- NZ birding: bird-song.co.nz, predatorfreenz.org, blog.doc.govt.nz, inaturalist.org
- AllTrails: alltrails.com (via localsinsider.com, techradar.com), support.alltrails.com, hikerhero.com
- Komoot: dcrainmaker.com, bikeradar.com, support.komoot.com
- Organic Maps: alternativeto.net, organicmaps.app, github.com/organicmaps
- CalTopo: apps.apple.com, wildsnow.com
- LINZ / NZ topo: linz.govt.nz, data.linz.govt.nz, wildernessmag.co.nz, play.google.com (Topo4GPS, NZ Topo Map), geekzone.co.nz, tramper.nz
