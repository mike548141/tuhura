# 2026-08-09 · 0445 UTC · Maritime made first-class; the platform question re-opened

**2026-08-09**: Two owner directives, one session. First, **maritime is a
first-class half of tūhura** — boating, diving and fishing on the water
rank equal with off-road driving, tramping, mountaineering, hunting and
birding on land. The docs had marine bolted on as a vertical (STRATEGY led
with the land list and appended the water one; CLAUDE.md, README and the
live shell omitted water entirely; mountaineering appeared nowhere), so
every statement of what tūhura is now splits the activity list by medium
with neither as the default, and names where the two genuinely differ.
The "not a marine chart plotter" non-goal stays, restated as the LINZ ENC
licensing limit it always was rather than a ranking. Roadmap staging was
deliberately left alone: the founding review staged marine post-v1 on
delivery-risk grounds, which is a sequencing call, not a worth call — the
tension is recorded on the item for Mike to rule rather than silently
re-tiered.

Second, Mike re-opened the **platform question** (PWA vs native), which
ADR 2026-08-08-0545 had settled as PWA-canonical + a contingent Capacitor
shell. Researched properly against current sources rather than priors:
`research/2026-08-09-0449-platform-pwa-vs-native.md`. Two popular claims
that would have decided it wrongly are false — the "50 MB PWA cap" and
"iOS deletes PWA data after 7 days" both predate iOS 17, where WebKit
grants a home-screen web app 60% of disk and `persist()` exempts it from
eviction. The real ceiling is narrower and permanent: background location,
Web Bluetooth (WebKit has no implementation and Mozilla calls the API
harmful — it is not coming), raw sockets, barometer.
**The finding: the ADR's shape survives, its timing does not.** Native-
first buys no capability the shell doesn't, while costing zero-build,
push-to-deploy and a US$99/yr-plus-annual-SDK-march maintenance tax on a
solo project. But the maritime ruling converted the shell from
contingency to certainty the same day — marine instruments speak BLE and
NMEA-over-TCP, both permanently closed to iOS Safari, so that half of the
product cannot exist on the web at all. Re-tiering the shell into v1 is
Mike's call and is flagged, not taken.
One genuinely new finding needed no ruling and was folded into the
workplan: an embedded WebView's origin quota is 15% of disk against
Safari's 60%, so a later wrap that keeps tiles in OPFS would *shrink*
capacity fourfold. Phase 3 now builds archives behind a storage seam
(OPFS now, native filesystem later) and Phase 0 gains a cheap
MapLibre-in-WKWebView spike — the one assumption that could still favour
a rewrite, and an hour to test.
Next: Phase 0, plus two owner rulings outstanding (marine staging, shell
tier).

**Owed, not done — doctrine drift is unread.** `atelier` has moved 27
commits past this repo's pin (`320f9b1`); the session-start rule is to read
the drift and bump the pin deliberately, and this session did neither,
staying in the lane Mike set. Unread, so the risk is unpriced rather than
known — the log alone shows changes to propagation rules, a new PRINCIPLES
section, and a floor change to boundary checks, any of which may bind this
repo's own CLAUDE.md. Flagged to Mike 2026-08-09; wants its own short
session before the next substantive one.

**Record audit (Mike asked, same session).** The first close-out claim
that nothing was uncaptured was **wrong**, and checking rather than
asserting found it: the research existed but the docs a future session
actually reads at start still stated the old posture as settled. STRATEGY
presented the non-goal with no hint it had been challenged, ARCHITECTURE
§ Platform posture still said "decided" and "post-Phase-3", and the ADR
carried a bare "accepted" status. A session reading the prescribed order
would have taken stale truth and never reached the research. Fixed at all
three, plus the ADR gained a Challenged section recording what held, what
broke, and what it had missed; ROADMAP's data-ops thread gained the
recurring platform tax (US$99/yr plus the annual SDK march) that ECONOMICS
owes. Lesson worth keeping: a finding is not recorded because a document
exists — it is recorded when the documents that get *read* point at it.
