# Sensor-source seams (pluggable backends) + widened native-channel scope

**Status**: accepted • **Date**: 2026-08-08
**Review**: not warranted — extends ADR 2026-08-08-0545 with an owner
directive (2026-08-08) and the estate's established seam pattern
(ros/tiki layered backends); the platform decision itself was reviewed

## Context

The owner directed (2026-08-08): sensor inputs must be **pluggable
backends behind seams**, the ros/tiki pattern — position/altitude may come
from the device's own GNSS/barometer, a paired iPhone, a Bluetooth GNSS
receiver, or a vehicle's own systems. Additionally the app should read
**vehicle telemetry** (engine temperature, RPM, tyre pressure — whatever
the CAN bus exposes via OBD-II adapters), possibly extending to vehicle
control later. The owner also confirmed openness to native "or whatever
gets the full feature set" — resolving the platform question in favour of
the reviewed ruling, with wider native scope than ADR 0545's original
"exactly background GNSS and barometer".

## Decision

- **Every sensor consumer in the app reads a seam, never a platform API
  directly.** Defined seams: `position` (stream of fixes + accuracy +
  source), `altitude/pressure`, `heading`, `attitude` (pitch/roll),
  `vehicle-telemetry` (typed channel map: rpm, coolant °C, tyre kPa, …).
  Backends register per seam with a priority/health model; the active
  source and its quality are always visible in the UI (the user knows
  *which* GPS they're trusting).
- **Web-reachable backends ship in the PWA**: device GNSS via
  Geolocation (including OS-level sources it transparently carries — MFi
  BLE pucks, cellular-iPad GNSS), `deviceorientation` heading,
  `devicemotion` attitude.
- **The Capacitor channel's scope widens** (supersedes ADR 0545's
  "exactly background GNSS and barometer" sentence; everything else in
  0545 stands): it hosts the native-only backends — background GNSS,
  barometer, **BLE** (GNSS receivers as in-app sources, OBD-II/CAN
  telemetry adapters, marine instruments later), and native TCP where a
  Wi-Fi OBD/NMEA bridge requires it. CarPlay remains entitlement-parked.
- **Vehicle telemetry is read-only.** Reading the CAN bus via standard
  OBD-II adapters (ELM327-class BLE) is a post-v1 feature on the native
  channel. **Vehicle control is icebox, safety-gated**: actuating car
  systems from an app is a safety-critical domain (and per-vehicle
  reverse engineering); it gets its own ADR + review before any design,
  and never rides in on telemetry's coattails.

## Rejected

- **Full native rewrite** to reach this feature set: still rejected —
  Capacitor's plugin surface (background location, BLE, TCP sockets,
  CarPlay scene) covers every targeted capability while the web codebase
  stays canonical and solo-maintainable (ADR 0545's economics unchanged).
- **Direct platform-API calls per feature**: each new source would touch
  every consumer; the seam makes a car-GPS or paired-phone backend a
  bounded plug-in, exactly as tiki's layered config keeps device quirks
  out of policy.
- **Treating paired-phone bridging as a seam backend now**: the zero-code
  paths (MFi puck feeding the OS, cellular iPad) already serve the
  vehicle case; a bespoke phone→tablet bridge is native-both-ends and
  waits for demonstrated need.

## Consequences

- Phase 1's recorder seam (ADR 0545) generalises: same interface, more
  seams — cheap now, structural later.
- The UI owes a source indicator + fallback behaviour per seam (right
  information at the right time: source quality surfaces when it
  degrades, not as a permanent dashboard).
- OBD-II telemetry lands post-v1 behind the native channel's gate, with
  adapter-compatibility honesty (ELM327 clones vary wildly).
