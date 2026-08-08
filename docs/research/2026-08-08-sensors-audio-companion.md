# Research — device sensors, audio ID, companion mode (2026-08-08)

Condensed reference from the second research sweep (owner directives
2026-08-08). Re-verify platform claims against current iOS before building.
Companions: `2026-08-08-delta-sync-marine-ux.md`, the two founding records.

## Sensor access matrix (iPhone/iPad, 2026)

| Capability | Activity value | PWA (Safari) | Hybrid (Capacitor) | Native-only |
|---|---|---|---|---|
| GNSS foreground | core | ✅ | ✅ | |
| GNSS background / screen-off | pocket track logging | ❌ disqualifying gap | ✅ `allowsBackgroundLocationUpdates` | |
| Barometer/altimeter | elevation, weather trend, dive | ❌ no web API in any browser | ✅ `CMAltimeter` plugin (vet quality) | best native |
| Compass | bearing | ⚠️ `webkitCompassHeading` + permission gesture | ✅ | |
| Accel/gyro (pitch/roll) | 4WD incline HUD | ✅ `devicemotion` + gesture | ✅ | |
| Microphone | sound ID, voice notes | ⚠️ foreground only; installed-PWA quirks | ⚠️ same unless native audio session | background listen |
| Camera still | waypoint photos | ✅ `<input capture>` | ✅ | |
| Bluetooth (AIS, fishfinders, BLE GPS as *peripheral data*) | marine | ❌ no Web Bluetooth on iOS | ✅ BLE plugin | |
| NFC tag read | check-ins | ❌ | ✅ Core NFC | |
| Wi-Fi Aware (no-signal party mesh) | group sync | ❌ | ❌ no plugins yet | iOS 26+ native |
| Satellite messaging | emergency | ❌ | ❌ | closed; Apple API "in development", no ETA |
| CarPlay | on-road nav | ❌ WKWebView not renderable there | ⚠️ native Swift scene inside wrapped app + discretionary entitlement | ✅ |
| Wake lock (screen-on) | recording | ✅ iOS ≥ 18.4 for installed PWAs | ✅ | |
| Apple Watch (baro/GPS) | secondary logging | ❌ HealthKit is native-only | ✅ HKWorkoutRoute (post-workout, not live) | |

- **iPad hardware trap**: GNSS exists only on Wi-Fi+Cellular SKUs — all
  generations; Wi-Fi-only iPads have no GNSS chip. Barometer standard since
  iPad Air 2 (2014); compass standard since iPad Pro (2015).
- **The PWA ceiling is background execution** — everything foreground is
  web-viable; anything screen-off (tracking, listening) is not.
- Capacitor can wrap a vanilla-JS no-bundler site (one `capacitor.js`
  script include), at the cost of an Xcode/signing toolchain, US$99/yr,
  App Review latency, and Guideline 4.2 (must not read as a wrapped
  website — offline maps + native sensors likely clears it, not free).
- "PWA + sibling native sensor app" has no iOS bridge path (PWA sandbox,
  mixed-content blocks `ws://` to localhost) — collapses into wrapping.

## Companion mode (old iPad on the dash)

Ranked (bridging research, confidence noted):
1. ✅ **MFi Bluetooth GNSS puck** (Garmin GLO 2, NZ$219 at Smart Marine;
   Bad Elf alternatives): feeds iOS Location Services **system-wide** on
   Wi-Fi-only iPads; the fix reaches Safari's Geolocation API — zero app
   code. The aviation/overlanding standard. Verify with a 5-min test page.
2. ✅ **Used Wi-Fi+Cellular iPad** — GNSS works without a SIM.
3. ❌ **Hotspot GPS pass-through is a myth** (~90% confidence; debunked
   2011, reconfirmed by Apple Community 2020-22): a tethered iPad gets
   stale Wi-Fi-BSSID/IP fixes (~65-150 m urban, nothing rural). 30-min
   drive-test protocol in the full report if we want certainty.
4. ⚠️ WebRTC QR-signalled Safari↔Safari bridge over hotspot: feasible demo,
   fragile product (iPhone must stay screen-on foreground; re-pair every
   drop). Not production.
5. ❌ PWA consuming NMEA-over-TCP (GPS2IP): impossible (no raw TCP in
   browsers; mixed-content blocks local `ws://`).
6. 🔎 Native sibling apps (iPhone BLE peripheral → iPad app): the only
   path that also bridges the **barometer**; shipping precedent
   (Waterkaarten GPS Share, SeaNav). Native both ends.

## Sound ID (birds + game calls)

- **BirdNET** (Cornell/Chemnitz): the base-model candidate. V2.4 TFLite
  50.5 MB, 6,522 classes, NZ species included — **but kea and 4/5 kiwi
  species absent** (only North Island brown kiwi). Code MIT; **models
  CC BY-NC-SA 4.0** (verified against repo) — a company-owned app likely
  trips NC even if free; commercial clearance =
  ccb-birdnet@cornell.edu (terms unpublished). <!-- leakscan:allow: published organisation contact address, not personal data -->
  Oceania accuracy tier is the good one (PR-AUC 0.16-0.23).
- **Merlin**: closed, in-house Cornell; NZ Sound ID coverage still being
  collected — not reusable regardless.
- **Google Perch 2.0**: Apache-2.0 (verified), ~15k taxa incl. non-birds,
  strong transfer learning; NZ label coverage unverified — check the model
  card before committing.
- **AviaNZ** (Massey/VUW, DOC-adjacent): GPL-3.0 toolkit with published
  kiwi + morepork filters — the only NZ-trained option; copyleft needs
  legal care if embedded.
- **Official precedent**: birdnet-team/real-time-pwa ("BirdNET Live") —
  TF.js fully on-device in a PWA, MIT, young (Nov 2025) but Cornell's own.
- **Game mammals (deer roar/pig/goat/possum): nothing off-the-shelf
  anywhere.** Research prototypes only (single-species, farm animals);
  possum has no acoustic dataset at all. A real model needs 1,000+ labelled
  field clips per class — likely hunter-collected NZ data (a community
  programme, not a feature). Game **birds** (mallard, shelduck, geese)
  ride the bird-model path fine.
- **Inference in Safari/PWA**: viable foreground — WebGPU shipped default
  in iOS 26; AudioWorklet stable; getUserMedia fixed since iOS 13.4 (flaky
  edge cases remain — test installed-mode across launches). Known risk:
  ONNX-Runtime-Web WebGPU crash after ~500 continuous inferences on iOS
  26.3 (open bug) — long sessions must be tested; TF.js is the precedent
  path. **Screen-locked listening is native-only** (`UIBackgroundModes:
  audio`) — a PWA identifies while open, like using Merlin actively.
