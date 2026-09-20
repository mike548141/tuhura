// Service worker — precaches the app shell so it cold-starts with the
// radio off. Ported pattern, not ported scope: Faves' ADR 0015 split-
// precache-versioning applies here (ADR 2026-08-08-0452: "the service
// worker's job shrinks to the app shell ... the Faves ADR 0015 split-
// versioning pattern applies to that shell precache unchanged"), but
// what it is a shell OF differs completely.
//
// docs/ARCHITECTURE.md carries the lockstep rules (what must change
// together, and what breaks if it drifts) — this file is the
// mechanism, that doc is the one place the rules live (CLAUDE.md).
//
// THE ONE RULE THAT MATTERS MOST HERE: this cache NEVER holds a map
// tile, a PMTiles archive, a style, a sprite sheet or a glyph. Tiles
// are read from OPFS via pmtiles' FileSource (ADR
// 2026-08-08-0452) — no fetch(), no service worker involvement, no
// Cache API entry, ever. A tile archive is hundreds of MB to
// multiple GB; the Cache API is not sized or designed for that, and
// mixing "the eleven files that make the app run" with "the two
// gigabytes of Wairarapa topo someone downloaded" in one cache would
// make every shell update also re-touch the tiles. When P0-C/P0-D land
// the MapLibre style JSON, sprite sheet and glyph set, those DO belong
// in a service-worker precache (they're shell-sized, not tile-sized)
// but on their OWN version axis — see ARCHITECTURE.md before adding
// them here.
//
// Only one cache exists today: there is no data axis yet (no fetched
// JSON, no per-user content) distinct from the shell itself, so
// splitting now would be machinery for a wording match (the same call
// Faves' ADR 0015 made about a third "configuration" cache). The
// `ensureCache` seam below already generalises to N caches — add
// STYLE_VERSION/STYLE_CACHE the same way the day P0-C's style JSON
// needs its own update rhythm.
const SHELL_VERSION = "2026-09-20.1";
const SHELL_CACHE = `tuhura-shell-${SHELL_VERSION}`;

// A cache is only trusted as fully built once this sentinel lands in
// it — written last, after every asset is in. An install interrupted
// midway (flaky reception, tab closed) leaves the named cache present
// but *without* the sentinel, so the next install rebuilds it rather
// than skipping a half-filled cache — which offline would otherwise
// mean a phone stranded on missing shell assets with no self-heal.
// The URL is synthetic, never fetched by the app.
const READY = "./__cache_ready__";

// Every file the shell needs to render and run with zero network.
// Keep this in lockstep with site/index.html's own asset references —
// ARCHITECTURE.md states the rule; this list is where it's obeyed.
const SHELL = [
  "./",
  "index.html",
  "css/app.css",
  "js/app.js",
  "js/dom.js",
  "js/sw-register.js",
  "js/sw-update.js",
  "js/update-notice.js",
  "site.webmanifest",
  "favicon.ico",
  "icons/favicon.svg",
  "icons/favicon-16.png",
  "icons/favicon-32.png",
  "icons/favicon-48.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/apple-touch-icon.png",
];

// Building a versioned cache must not read the browser's own HTTP
// cache: a plain `fetch()` defaults to `cache: "default"`, and a
// precache built that way can be filled with the PREVIOUS deploy's
// bytes if Cloudflare Pages' response headers allow it — the version
// constant renames the cache and then refills it with stale files,
// silently, with a passing READY sentinel. Inherited from Faves'
// sw.js (measured there against real response headers, ADR 0015) but
// NOT independently re-measured against tuhura's own Pages project —
// this repo has no live deploy yet, so treat this as a carried-over
// protection until it's confirmed against a real deploy.
const PRECACHE_FETCH = { cache: "reload" };

// 🛑 `res.ok` alone cannot prove an asset exists on Cloudflare Pages
// (the same hazard Faves hit and fixed, ADR 0100): Pages answers a
// path it doesn't have with `index.html` and a 200 — its single-page
// fallback — so a genuinely missing file precaches successfully under
// the wrong URL instead of failing the install. The response's
// content-type is the tell: a `.css`/`.js`/`.json`/image path answered
// as `text/html` cannot be the real file, because every real one is
// served with its own type. Deliberately one-way: it refuses ONLY a
// known non-HTML extension answered as HTML, so a legitimate response
// is never rejected — over-refusing here would strand every phone on
// the old shell forever with no notice and no way back.
const NON_HTML_EXT = /\.(?:js|mjs|css|json|webmanifest|png|jpe?g|webp|svg|ico)$/i;

function servedAsHtmlStandIn(url, contentType) {
  const path = String(url).split(/[?#]/)[0];
  if (!NON_HTML_EXT.test(path)) return false;
  return /^\s*text\/html\b/i.test(String(contentType || ""));
}

/** Refuse a response that cannot be the file we asked for. */
function requireAsset(url, res) {
  if (!res.ok) throw new Error(`SW install: ${url} → ${res.status}`);
  if (servedAsHtmlStandIn(url, res.headers.get("content-type"))) {
    throw new Error(
      `SW install: ${url} → ${res.status} but served as HTML — that path ` +
        `is missing from the deploy`
    );
  }
  return res;
}

// Cloudflare Pages 308-redirects `/index.html` → `/`; the browser
// refuses to return a redirected response to a navigation, and
// cache.match would hand one straight back — so copy the body into a
// fresh, non-redirected Response before it ever reaches the cache or a
// navigation.
async function fetchClean(url, init) {
  const res = await fetch(url, init);
  return res.redirected ? new Response(res.body, res) : res;
}

// Build `name` only if it isn't already fully populated. Because the
// cache name carries its own version, bumping SHELL_VERSION renames the
// cache outright: the old one is left in place (untouched, still
// serving) until activate cleans it up — never edited in place.
async function ensureCache(name, populate) {
  if (await caches.has(name)) {
    const existing = await caches.open(name);
    if (await existing.match(READY)) return;
    await caches.delete(name);
  }
  const cache = await caches.open(name);
  await populate(cache);
  await cache.put(READY, new Response("ok"));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await ensureCache(SHELL_CACHE, async (cache) => {
        // Per-URL put (not cache.addAll) so a redirected shell page is
        // cleaned first, but keep addAll's response.ok guard by hand —
        // requireAsset adds the half res.ok can't see on Pages.
        await Promise.all(
          SHELL.map(async (u) => {
            const res = requireAsset(u, await fetchClean(u, PRECACHE_FETCH));
            await cache.put(u, res);
          })
        );
      });
      // NO unconditional skipWaiting. A new worker taking over
      // immediately would serve new assets to a page still running the
      // old HTML and modules — a version skew with no test that can see
      // it. Instead it holds in `waiting`: the page offers a "newer
      // version is ready" notice (update-notice.js), the tap posts
      // SKIP_WAITING below, and the reload lands on the new worker
      // together. Ignore the notice and the phone still gets the new
      // version on the next cold start, when the last client closes.
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Keep only the current shell cache; delete every other named
      // cache (old shell versions, and — once P0-C/D land — any other
      // version-named cache this file no longer lists). The new cache
      // was fully built during install while the old one was still
      // serving, so there is no window where offline breaks.
      const keep = new Set([SHELL_CACHE]);
      const names = await caches.keys();
      await Promise.all(names.filter((n) => !keep.has(n)).map((n) => caches.delete(n)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Anything not in the shell falls straight through to the network,
  // untouched by this worker — a future data/tile fetch must never be
  // caught by a cache-first handler written for eleven small files.
  event.respondWith(cacheFirst(req));
});

async function cacheFirst(req) {
  const cache = await caches.open(SHELL_CACHE);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  // Cache miss (a fresh deep link, or a request outside the shell
  // list): the network copy of a shell page may be redirected by
  // Cloudflare — fetchClean strips that so a navigation doesn't fail.
  return fetchClean(req);
}
