// "A newer version is ready" — the notice half of the PWA update flow
// (see sw-update.js for the decision rules, sw-register.js for the
// wiring, sw.js for the precache this is announcing an update to).
//
// Deliberately NOT an auto-reload. tūhura's shell holds no reader state
// worth losing today, but the pattern is the one to keep once it does
// (an in-progress waypoint note, a filter) — reloading a page out from
// under someone mid-task is a worse bug than being one version behind.
// So: a small banner, two buttons, and nothing happens until they say
// so. It does not take focus, for the same reason.
//
// Text-safe by construction (repo convention, CLAUDE.md): every node
// here is built through `el()` and every string lands via
// `textContent`, never `innerHTML` — nothing here is untrusted input
// today, but the shape is the one every later DOM helper should copy.

import { el } from "./dom.js";

let node = null;

/**
 * Show the update notice. `onRefresh` runs when the reader taps
 * "Refresh". Idempotent: a second update arriving while the notice is
 * up changes nothing — the same one tap still activates whatever is
 * newest.
 */
export function showUpdateNotice(onRefresh) {
  if (node) return node;

  const text = el("p", {
    className: "update-notice-text",
    role: "status",
    "aria-live": "polite",
    textContent: "A newer version of tūhura is ready.",
  });

  const refresh = el("button", {
    type: "button",
    className: "btn",
    textContent: "Refresh",
  });
  const later = el("button", {
    type: "button",
    className: "btn btn-quiet",
    textContent: "Not now",
  });

  node = el("div", { className: "update-notice", role: "region", "aria-label": "App update" }, [
    text,
    el("div", { className: "update-notice-actions" }, [refresh, later]),
  ]);

  refresh.addEventListener("click", () => {
    // Say something immediately: activating the waiting worker and
    // reloading takes a beat, and a button that looks ignored gets
    // tapped again.
    refresh.disabled = true;
    text.textContent = "Refreshing…";
    onRefresh();
  });
  // Dismiss is not "never": the waiting worker stays waiting, so the
  // new version lands by itself on the next cold start (when the last
  // client closes and the worker takes over unasked).
  later.addEventListener("click", dismissUpdateNotice);

  document.body.append(node);
  return node;
}

export function dismissUpdateNotice() {
  if (!node) return;
  node.remove();
  node = null;
}
