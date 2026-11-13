# Kohler Konnect — web prototype

A phone-first prototype built with **plain HTML, CSS and JavaScript**: no framework, no
packages, no build step. Dark only, tuned to the Figma references: near-black surfaces,
per-room accent colours, circular dials, amber energy rings and a "pan to set" temperature
control.

Scope (mock data and motion, no backend, nothing is saved):

- **Onboarding** — Let's Konnect → Create account → Connect Kohler devices → Connect other devices
- **Devices** — room switcher at the top (Bathroom | Kitchen), devices as tiles; a device page with the
  product photo, tappable feature callouts and the value stepper; routines
- **Health** — five areas, each with a living visual driven by its score (flower, horse, water ripples,
  water vessel, candle flame), then Today | Over time with charts and what they mean
- **Account** — privacy, products, devices, services (plus start over and a component gallery)

## Run it

Open `index.html` in a browser. That is all. (Product photos, once their addresses are filled in, load
from Kohler's image server and need an internet connection; without one the app shows an icon instead.)

To try it on a phone, serve the folder and open the address from the phone on the same network:

```bash
python -m http.server 8000
```

It can be hosted as-is on any static host (GitHub Pages: Settings → Pages → deploy from
`main`, folder `/`). On a phone, "Add to Home Screen" opens it full screen.

On a desktop browser the app is shown as a phone-sized column.

## Where things are

```
index.html            page shell: screen area, tab bar, script tags
css/tokens.css        design tokens (colours, spacing, radius, motion)
css/base.css          reset, type scale, app frame, enter animations
css/components.css    card, button, chip, ring, bar chart, temperature control, top bar, tab bar
css/visuals.css       motion and colour of the Health visuals
css/screens.css       layout that belongs to one screen
js/data.js            all mock data
js/icons.js           the icon glyphs the app uses
js/ui.js              helpers that return component HTML (button, chip, ring, bar chart, ...)
js/tempControl.js     the drag-to-set value stepper
js/healthVisuals.js   the five Health visuals, drawn from a 0..1 level
js/router.js          #/path routing, back, tab bar, per-screen state
js/screens/*.js       one file per area: onboarding, devices, product, routines, health, account
```

Routes: `#/onboarding`, `#/onboarding/account`, `#/onboarding/connect`, `#/onboarding/other`,
`#/devices`, `#/devices/room/:id`, `#/devices/product/:id`, `#/devices/routines/:id`, `#/health`,
`#/health/:area`, `#/account`, `#/gallery`. The older `#/home...` and `#/health/stat/:id` paths redirect.

## Product photos

Each product in `js/data.js` has an `image` field. Paste the address of a photo on Kohler's image server
(on kohler.com: right-click the photo → Copy image address). The photo is linked, not copied into this
repo. Each quick control has `x` / `y` (percent of the photo) for where its callout sits; adjust them
to the photo.

`CLAUDE.md` has the conventions for adding a screen, component or token.

## History

This repo started as an Expo / React Native iOS prototype. That version is kept at the git tag
`ios-prototype` (`git checkout ios-prototype`). Design notes are in `docs/superpowers/specs/`.

## Credits

Icons are from [Ionicons](https://ionic.io/ionicons) (MIT License, © Ionic). Only the glyphs in
use are copied into `js/icons.js`.
