# Kohler Konnect: Devices and Health redesign (team crazy-8s round)

## Summary

- **Goal.** Make the Devices page and the Health page the interesting parts of the app, from
  the team's crazy-8s sketches, and carry the same styling through the rest. Dark theme kept.
- **What changes.** `js/screens/home.js` becomes `devices.js` (room switcher + device tiles);
  `product.js` gets a product photo with feature callouts; `health.js` is rebuilt around five
  living visuals; new `js/healthVisuals.js` and `css/visuals.css`; new helpers in `js/ui.js`
  (`segment`, `photo`, `deviceTile`, `callout`); data model in `js/data.js` (`health` replaces
  `stats`; products gain `image`, `status`, callout positions); routes renamed with redirects.
- **Decisions.** D1 routes and redirects. D2 five health areas replace the four score cards.
  D3 visuals are inline SVG + CSS driven by one 0..1 level. D4 product photos are linked from
  Kohler's image server with a built-in fallback. D5 callouts are data and replace the chips.
  D6 the room summary is kept as a slim strip. D7 "same styling" = reuse, not redesign.
- **Verification.** Click-through in headless Chrome: 226 checks, clean console (routes,
  redirects, room switch, tiles, callouts, stepper, each health area and its visual, Today /
  Over time, ranges, state rules, photo load and failure). No overflow at 320 / 375 / 430px.
  Visuals reviewed by eye at levels 0.15 / 0.5 / 0.9, still and mid-animation.
- **Check on a device.** Smoothness of the horse and ripples on a phone; touch targets of the
  callouts once real photos are in.
- **Risks.** Linked photos can move or be blocked (fallback covers it; photos need internet).
  The photos are light studio shots, so the photo areas are bright against the dark theme.

## What Arnav decided

- Devices: local nav at the top switches rooms; devices are tiles. Tab renamed to Devices.
- Device page: product photo + feature callouts + the existing controls.
- Product photos: linked from Kohler's site, not copied into the repo.
- Health: one big visual, chips to switch area, then Today | Over time with charts and
  interpretation. Analogies: flower = wellness / recovery; horse = mobility (halting when low,
  smooth when high); water ripples = gut health (small and even = good; large and uneven =
  bad); water in a vessel = hydration; candle flame = stress.
- Dark theme kept and extended.

## Approaches considered (Health layout)

1. **One big visual, switch between areas (chosen).** The selected area fills the top;
   chips switch; detail below.
2. **Grid of living tiles, tap for detail.** Everything animates at once; each area needs its
   own page. More motion on screen, less room per visual.
3. **Stacked, every area in full.** Nothing hidden, but a very long page.

## Decisions (Claude's calls unless noted above)

- **D1 Routes.** `#/devices`, `#/devices/room/:id`, `#/devices/product/:id`,
  `#/devices/routines/:id`, `#/health`, `#/health/:area`. `#/home...` and `#/health/stat/:id`
  redirect. The room is page state on `#/devices`, switched without navigating.
- **D2 Areas.** Recovery → Wellness, Steadiness → Mobility, Hydration and Stress stay, Gut
  health is new (69). Existing series and copy are reused; gut health copy is new mock data.
- **D3 Visuals.** `KK.visual(kind, level)`: geometry computed in JS from the level; looping
  motion in CSS via custom properties. Stress passes its calm level (100 − score). With
  reduced motion the animation is off and each visual holds a pose that reflects the level.
- **D4 Photos.** `ui.photo` always renders the icon fallback; the `<img>` covers it when it
  loads and removes itself on error. This is the one exception to "nothing from the network".
- **D5 Callouts.** `quick[*].x / y` in percent of the photo; the label flips to the side with
  more room. The chips row is gone; a line under the photo counts the features that are on.
- **D6 Room summary.** Set-point dial, headline, device count, energy and status rings in one
  strip under the switcher.
- **D7 Styling pass.** Onboarding's device list and Account's product rows use photo
  thumbnails; the gallery shows the new components and all visuals. Routines only had its
  routes updated: it already used the shared card and chip styles.

## New copy and colours introduced (mock; change freely)

- Device status lines on tiles ("Ready · 39 °C", "Idle", "On · 70%", "Updating…",
  "Holding · 42 °C").
- Gut health notes and sources; one caption per visual.
- Colours: mobility `#d9925f`, gut `#2fb8a6`, petals `#e58fa5` / `#f6c6d2`.
- The stepper on the device page is the compact 3-row version, so photo and controls fit.
- The device-page footnote no longer repeats the room name.

## Photos

Arnav supplied the five addresses (shower control, bathtub, vanity, toilet, kitchen faucet);
they are in `products[*].image` and callouts are placed per photo. Kohler's site refuses
automated page requests, so new addresses have to be copied by hand from kohler.com. The
photos are square studio shots on a light background; the device page shows them at 4:3.
