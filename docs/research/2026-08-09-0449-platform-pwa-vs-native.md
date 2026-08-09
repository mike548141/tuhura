# Research — PWA vs native vs the other options (2026-08-09)

Commissioned by the owner: *"I am still not convinced this should be a PWA
— research it properly and give me a convincing reason for PWA, native, or
any other option."* Re-opens ADR `2026-08-08-0545-platform-posture.md`
(PWA-canonical + a committed thin Capacitor channel), which was itself a
founding-review ruling.

Evidence is dated and sourced. Where a claim is widely repeated on the web
but wrong, it is marked ❌ **discredited** with the authoritative
correction — several of the popular "iOS PWA limits" numbers are years out
of date and would push the decision the wrong way if believed.

## The question, stated properly

Not "PWA or native". Four options, and the third is the one usually
missed:

| | Option | One codebase? | Web version? | Full sensors? | Build step |
|---|---|---|---|---|---|
| **A** | PWA only | ✅ | ✅ | ❌ | none |
| **B** | PWA canonical + thin Capacitor shell (**current ADR**) | ✅ | ✅ | ✅ | shell only |
| **C** | Cross-platform native (React Native / Flutter / KMP) | ✅ | ❌ (or a poor second) | ✅ | full |
| **D** | Native per platform (Swift + Kotlin) | ❌ (two) | ❌ | ✅ | full ×2 |

## What the web genuinely cannot do on iOS (2026, verified)

These are not "not yet" — they are settled positions.

| Capability | Status | Source |
|---|---|---|
| Background / screen-off location | ❌ no API in any browser | no WebKit support through Safari 27; nothing in the 26.x or 27 release notes |
| Web Bluetooth | ❌ **and not coming** — WebKit has no Web Bluetooth code at all; Mozilla's standards position is "Harmful" | caniuse (unsupported through Safari 26.5); WebBluetoothCG implementation status |
| Raw TCP/UDP sockets | ❌ no API; `ws://` to a LAN device is blocked as mixed content from an HTTPS origin | already established in `2026-08-08-sensors-audio-companion.md` |
| Barometer / altimeter | ❌ no web API in any browser | ibid. |
| Screen-locked audio capture | ❌ native `UIBackgroundModes: audio` only | ibid. |

Android is more generous (Web Bluetooth landed in Chrome 151) but
background location is absent there too, and building for the more
capable platform only is not an option.

## What the web *can* do, better than the folklore says

- ❌ **Discredited: "iOS caps PWAs at ~50 MB".** Superseded since iOS 17.
  WebKit's own storage policy: *"For a browser app, the origin quota is up
  to 60% of the total disk space… overall quota is up to 80%."* A
  home-screen web app gets the **browser-app** quota, not the embedded
  one. Multi-gigabyte offline map archives are within policy.
- ❌ **Discredited: "iOS deletes PWA data after 7 days".** The 7-day
  no-interaction deletion is the ITP rule for **best-effort** storage.
  `navigator.storage.persist()` exempts an origin from eviction entirely,
  and WebKit grants it *"based on heuristics like whether the website is
  opened as a Home Screen Web App"* — i.e. installed PWAs are the
  favoured case. Phase 1 already calls `persist()` from the first write.
- Wake lock works on installed PWAs (iOS ≥ 18.4); WebGL/WebGPU, OPFS,
  `getUserMedia`, and MapLibre's whole rendering path are fine.

**But note the honest weakness**: `persist()` is granted by *heuristic*,
not contract. There is no specification guarantee, no API to confirm
durability ahead of time beyond `persisted()`, and no recourse if a
future WebKit tightens it. For a product whose central promise is
"gigabytes of map survive a week of dormancy and a cold start with the
radio dead", the web offers *very probably* where native offers
*guaranteed*. That is the strongest honest argument in the native column
— and Phase 0's soak rider exists precisely to measure it.

## The trap in "just wrap it later"

Non-obvious and material: **WKWebView inside a third-party app gets a
smaller quota than Safari does** — WebKit's policy gives "other apps" an
origin quota of 15% of total disk (20% overall) against a browser app's
60%/80%. A naive Capacitor wrap that keeps tiles in OPFS therefore
*shrinks* available storage roughly fourfold.

The fix is not hard but must be designed in, not retrofitted: in a shell,
tile archives move to the **native filesystem** (guaranteed durable, no
eviction, no quota heuristics) and MapLibre reads them through a small
byte-range bridge — PMTiles only needs a source that answers
`getBytes(offset, length)`, so this is a custom `Source` adapter of
roughly a hundred lines, not a re-architecture. This *also* retires the
durability weakness above.

## What the maritime elevation changes (2026-08-09)

The founding ADR deferred BLE explicitly: *"BLE accessories join if/when
the marine verticals revive."* They just did — Mike ruled maritime a
first-class half of the product. That single line is what re-opens this,
because on the water the native-only list stops being a corner case:

- **Marine instruments are the boating differentiator.** AIS receivers,
  depth/sonar, wind, and NMEA 2000 gateways speak BLE or NMEA-over-TCP.
  Both are permanently closed to a browser on iOS. This is not a
  degraded experience — the feature cannot exist at all.
- **Screen-off recording stops being optional.** A day's drift, a dive
  surface interval, an eight-hour crossing: screen-on recording at
  10–20%/h is not survivable, and a helm-mounted iPad in the sun is worse.
- **Barometer** earns a second job (sea-state/weather trend, dive
  profile) on top of elevation.

So the native ceiling is now certain rather than speculative. The
founding review rejected "continuing to defer" on the grounds that the
deferral toll grows with every phase; that reasoning now applies harder.

## Why not C or D (the full-native options)

- **The map stack is portable, the UI is not.** MapLibre Native supports
  PMTiles from device storage on Android and iOS, and MapLibre React
  Native v11 (2026) rewrote its API to mirror MapLibre GL JS. So the
  expensive, tūhura-specific work — tile pipeline, style, layer schemas,
  licensing, offline region logic — survives any of these moves. What a
  rewrite forfeits is the app shell, not the hard part. This cuts *both*
  ways: it makes C cheaper than it looks, and it makes staying on the web
  cheaper to reverse later.
- **The recurring tax is the killer for a solo, AI-session project.**
  US$99/yr in perpetuity, plus a *mandatory* annual toolchain march:
  from 2026-04-28 every App Store submission must build against the iOS 26
  SDK (Xcode 26+); from 2026-08-31 Google Play requires target API 36 for
  updates, with older targets losing visibility on newer devices. Miss a
  year and the app rots in place. A PWA has no such clock.
- **C and D also delete the zero-build doctrine**, push-to-deploy, and
  instant fixes — the properties that make this maintainable at all — and
  put every bug fix behind App Review latency.
- **B gets 100% of the capability C and D get**, because Capacitor plugins
  reach the same iOS/Android APIs. There is no capability argument for C
  or D over B. The only real argument is rendering performance in a
  WebView, and MapLibre GL JS runs the same WebGL renderer either side of
  that boundary — measurable, and worth measuring early rather than
  assuming.

## Conclusion

The current ADR's **structure survives the challenge; its timing does
not.** PWA-canonical + a thin Capacitor shell is still the right shape —
it is the only option that keeps one codebase, a free zero-friction web
surface, push-to-deploy, and *complete* native capability. Native-first
buys nothing B does not buy, and costs the properties that make a
one-person project survivable.

What has changed is that the shell is no longer a contingency gated on a
field failure. Marine instrument support and screen-off recording are now
committed features that **cannot** ship without it, so the shell is a
certainty with a known trigger date, and three things should move
forward accordingly:

1. **Storage architecture decided now, not at wrap time** — the 15%/60%
   quota asymmetry means Phase 3's region manager must be written against
   a storage interface with an OPFS backend today and a native-filesystem
   backend later, the same way the recorder already sits behind a
   location-stream seam.
2. **Measure MapLibre in a WKWebView early** — a cheap spike during Phase
   0, because it is the one remaining assumption that could still favour C.
3. **Re-tier the shell** from post-Phase-3 contingency to a committed v1
   track — owner's call, recorded on the ROADMAP marine item.

## Sources

- [WebKit — Updates to Storage Policy](https://webkit.org/blog/14403/updates-to-storage-policy/)
- [MDN — Storage quotas and eviction criteria](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)
- [caniuse — Web Bluetooth](https://caniuse.com/web-bluetooth)
- [WebBluetoothCG — implementation status](https://github.com/WebBluetoothCG/web-bluetooth/blob/main/implementation-status.md)
- [WebKit Features for Safari 26.6](https://webkit.org/blog/18178/webkit-features-for-safari-26-6/)
- [Apple Developer — upcoming SDK minimum requirements](https://developer.apple.com/news/upcoming-requirements/)
- [Google Play — target API level requirements](https://developer.android.com/google/play/requirements/target-sdk)
- [MapLibre Android — PMTiles example](https://maplibre.org/maplibre-native/android/examples/data/PMTiles/)
- [MapLibre React Native](https://maplibre.org/maplibre-react-native/)
- [MapLibre newsletter, April 2026](https://maplibre.org/news/2026-05-02-maplibre-newsletter-april-2026/)
