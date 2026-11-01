# Held back — the brief-writer's angles for the P0-C credential pass

For `2026-11-02-1157-p0c-basemap-credential-cold.md`. **Open only after your
own findings are durably written in the brief** (`REVIEW.md` rule 1). Then
fold this in below the verdict and delete this file.

Written by the brief-writing sub-agent (Claude Opus 5.5, of session
`2be3482c`) from one read of the item and the records it names. These are
hypotheses, unproven; none was driven. Use them to check coverage against
your own findings, never as findings. Answer each: confirmed, damaged, or
already covered by your finding N.

## Seeded hypotheses

- **D1 — a "public" key is still the owner's quota.** If LINZ does issue
  domain-restricted keys, the restriction is a referrer check, which any
  client outside a browser can set. Does a published key let a stranger
  spend the owner's tile allowance, or get the key revoked, whatever its
  label says?
- **D2 — self-hosting moves the dependency rather than removing it.** C4
  and C6 need archives hosted somewhere a phone can download them from.
  Does that host need its own credential, cost money per byte served, or
  carry terms of its own? Does bulk export through the free tier fit that
  tier's published limits?
- **D3 — any runtime online path brings the key back.** Connectivity is the
  enhancement, not the mode. If any feature fetches LINZ tiles live (an
  area not yet downloaded, a fresher edition, a preview before download),
  the shipped app needs a key again. Does *"the product does not carry
  one"* survive the features the strategy promises?
- **D4 — vendored glyphs and sprites carry their own licences.** Glyph sets
  are built from fonts, and sprites are artwork; their licences may differ
  from the tiles' CC-BY 4.0. Do they fit the vendored-dependency rule's
  sanctioned class, and does `NOTICE` cover them?
- **D5 — a vendored style drifts.** LINZ updates quarterly. A vendored
  `topographic-v2` style with rewritten sources can fall out of step with
  newer archives. Who notices, and does the app say the data may be out of
  date, as the safety-adjacent rule asks?
- **D6 — an online render tells a third party where the user is looking.**
  Tile requests carry coordinates and the device's address. Does the
  item's online-first step square with the accountless, privacy-first
  posture, and is it disclosed to the user?
- **D7 — is online-first still the cheapest proof?** P0-D's fixture
  generator makes a spec-valid archive with no key. Could a local render
  prove the style and the renderer agree as cheaply, or does the online
  step spend the one credential C6 sets out to avoid?
