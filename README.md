# Kohler Konnect — web prototype

A phone-first prototype built with **plain HTML, CSS and JavaScript**: no framework, no
packages, no build step. Dark only, tuned to the Figma references: near-black surfaces,
per-room accent colours, circular dials, amber energy rings and a "pan to set" temperature
control.

Scope (mock data and motion, no backend, nothing is saved):

- **Onboarding** — Let's Konnect → Create account → Connect Kohler devices → Connect other devices
- **Home → Room → Product** — room list, device list, product page (value stepper, quick controls), routines
- **Health → Stat** — score cards, stat page with a 7/30/90-day chart, highlights, sources
- **Account** — privacy, products, devices, services (plus start over and a component gallery)

## Run it

Open `index.html` in a browser. That is all.

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
css/screens.css       layout that belongs to one screen
js/data.js            all mock data
js/icons.js           the icon glyphs the app uses
js/ui.js              helpers that return component HTML (button, chip, ring, bar chart, ...)
js/tempControl.js     the drag-to-set value stepper
js/router.js          #/path routing, back, tab bar, per-screen state
js/screens/*.js       one file per area: onboarding, home, product, routines, health, account
```

Routes: `#/onboarding`, `#/onboarding/account`, `#/onboarding/connect`, `#/onboarding/other`,
`#/home`, `#/home/room/:id`, `#/home/product/:id`, `#/home/routines/:id`, `#/health`,
`#/health/stat/:id`, `#/account`, `#/gallery`.

`CLAUDE.md` has the conventions for adding a screen, component or token.

## History

This repo started as an Expo / React Native iOS prototype. That version is kept at the git tag
`ios-prototype` (`git checkout ios-prototype`). The design note for the move to the web is in
`docs/superpowers/specs/2026-11-12-html-port-design.md`.

## Credits

Icons are from [Ionicons](https://ionic.io/ionicons) (MIT License, © Ionic). Only the glyphs in
use are copied into `js/icons.js`.
