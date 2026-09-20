// tūhura's one entry point, loaded as a module from index.html.
//
// Side-effect import: sw-register.js wires the service worker (and the
// update flow on top of it) the moment the module graph loads — there
// is nothing else for the shell to bootstrap yet. Kept as its own file
// rather than inlined so P0-C/P0-D's map bootstrap has a place to land
// without index.html growing a second <script> tag per feature.
import "./sw-register.js";
