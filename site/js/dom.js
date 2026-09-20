// Shared DOM helper — one hyphen-aware `el()` for the whole app.
//
// The whole point is the hyphen check: aria-* / data-* keys are
// *attributes*, not IDL properties, so plain `node[k] = v` (what an
// Object.assign version does) sets an inert JS expando the browser
// ignores — accessible names and data attributes silently vanish. This
// module is the single source of truth so that trap can't be
// re-sprung: import it, never re-roll a local copy (the Faves a11y
// lesson this repo inherits, CLAUDE.md).
//
// It is also the untrusted-input discipline starting point (repo
// convention): every property here is set via `textContent` or an IDL
// property, never `innerHTML`, so a DOM node built through `el()`
// cannot be tricked into parsing interpolated data as markup.
//
// `props`: string keys → attribute (if hyphenated) or property
// (otherwise). `children`: a node/string or an array of them;
// null/undefined are skipped so callers can inline conditionals
// (`cond && el(...)`).
export const el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k.includes("-")) node.setAttribute(k, v);
    else node[k] = v;
  }
  for (const child of [].concat(children)) if (child != null) node.append(child);
  return node;
};
