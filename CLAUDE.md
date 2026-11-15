# CLAUDE.md — Kohler Konnect (Figma → code integration guide)

Rules and conventions for building this app, written for an AI agent integrating the Figma
design (via the Figma MCP) into this codebase. Read this before adding a screen, component
or token.

The app is **plain HTML + CSS + vanilla JavaScript**. No framework, no npm, no bundler, no
build step: `index.html` must keep working when opened directly from disk (`file://`).

> **Source of truth for design is Figma, not this repo.** The tokens below mirror the
> **Design System** page in Figma (Kohler Blue + Greyscale scales, a 1.25 type scale, the
> button, card and global nav components, and the Heroicons icon set). Figma defines only
> those three components; every other component here is derived from them. When the design
> changes in Figma, re-derive the tokens here; don't trust stale values.

- Figma file: `https://www.figma.com/design/Bt9qI3UQGIfY2YCmC43VTr/UX-Design-App-and-Web-App`
- `fileKey` = `Bt9qI3UQGIfY2YCmC43VTr`
- Sitemap (structure): page `App Sitemap and inspo` → section **`Sitemap like fr fr`** (node `139:341`)
- Older inspiration frames (dark; structure only, not the look): `1:92` Quick Adjust, `1:323` Thermostat, `1:1215` Home list
- **Design System** page (`51:294`) — the formal source, with two sections:
  - **App style** (`217:7512`): type steps (`217:7463`), Kohler Blue scale (`217:7532`), Greyscale scale (`217:7546`)
  - **Components** (`217:7556`): Button (`217:7563`), Card (`217:7603`), Global nav / tab bar (`217:7662`; toggle default / active `217:7611` / `217:7613`), frame reference (`217:7578`: page background and nav position)
- **Icons** page (`217:2`) — Heroicons (micro, mini, outline, solid). The app uses the solid drawings.
- Design note for the pass that brought the app onto this system: `docs/superpowers/specs/2026-11-14-design-system-cohesion-design.md`.

---

## 1. Hard rules

- **No build step, no dependencies.** No npm packages, no CDN links, no remotely loaded fonts. Everything
  the page needs is a file in this repo. **One exception:** product photos are linked from
  Kohler's image server (`products[*].image` in `js/data.js`), always through `ui.photo`, which
  shows an icon fallback when the address is empty or the image fails.
- **Classic scripts only.** No `import` / `export` / `type="module"` and no `fetch` of local
  files: both fail on `file://`. Every script is an IIFE that adds to the single global `KK`.
- **Script order matters** and is set in `index.html`: `data → icons → ui → tempControl →
  healthVisuals → router → screens/*`. A new script file needs a `<script>` tag there.
- **One theme, phone first.** Slate page (Greyscale 100), light cards (Kohler Blue 10), brand
  fills in Kohler Blue 70. No light / dark switch. One column, max width `--app-width` (393px).
  Use flex/grid, not fixed widths, except for intentionally fixed dials and rings.
- **Blue and grey only for the interface.** No per-room or per-area accent colours, no
  shadows, no card borders. The five health illustrations keep their own colours
  (`--c-visual-*`); green / amber / red (`--c-success` / `--c-warning` / `--c-danger`) appear
  only as a dot, ring or icon that marks a state, never as text or a fill.
- **Escape text.** Anything that is not a literal in the source goes through `KK.esc()` before
  it is put into an HTML string (user input such as the routine name especially).

## 2. Design system

### 2.1 Tokens — `css/tokens.css`

CSS custom properties. The two ramps are the only place an interface colour is written as a
hex; every other token points at a ramp step.

| Group | Names |
|---|---|
| Kohler Blue scale | `--blue-100` `#102243`, `--blue-90` `#1f3765`, `--blue-80` `#324f87`, `--blue-70` `#4a6ba9`, `--blue-60` `#6789cb`, `--blue-50` `#87aaed`, `--blue-40` `#a6c3f9`, `--blue-30` `#c3d7ff`, `--blue-20` `#dbe7ff`, `--blue-10` `#f4f8ff` |
| Greyscale | `--grey-100` `#41464e`, `--grey-90` `#565b65`, `--grey-80` `#6b717c`, `--grey-70` `#828792`, `--grey-60` `#999ea9`, `--grey-50` `#b1b6c0`, `--grey-40` `#c9ced6`, `--grey-30` `#e3e6ed`, `--grey-20` `#f8faff`, `--grey-10` `#fefeff` |
| Surfaces | `--c-background` (page, grey-100), `--c-backdrop` (behind the phone frame on desktop, blue-100), `--c-surface` (card, blue-10), `--c-photo` (photo panel, grey-10), `--c-stage` (navy feature panel, blue-100) |
| Brand fill | `--c-primary` (blue-70), `--c-primary-strong` (blue-80), `--c-on-primary` (ink on a fill, grey-10) |
| Ink (two contexts, below) | `--c-text`, `--c-text-secondary`, `--c-text-muted`, `--c-accent-ink`, `--c-stroke`, `--c-control`, `--c-quiet` / `--c-on-quiet` |
| State marks | `--c-success` `#36c279`, `--c-warning` `#f2a63c`, `--c-danger` `#e5564f` |
| Health illustrations | `--c-visual-petal`, `-petal-light`, `-leaf`, `-eye`, `-horse`, `-ripples`, `-vessel`, `-flame`, `-flame-core`, `-wax` |
| Spacing (5px base) | `--sp-1` 5, `--sp-2` 10, `--sp-3` 15, `--sp-4` 20, `--sp-5` 30, `--sp-6` 40, `--sp-7` 60 |
| Radius | `--r-sm` 5 (bars, small marks), `--r-md` 10 (cards, photos, fields), `--r-full` (pills), `--r-frame` 30 (desktop phone outline only) |
| Motion | `--ease-gentle` / `--ease-standard` / `--ease-snappy`; `--dur-press` 120, `--dur-state` 160, `--dur-fade` 200, `--dur-snappy` 320, `--dur-standard` 460, `--dur-gentle` 520; `--stagger` 60 |

**Ink contexts.** Text, icons, dividers and quiet fills differ on a dark and a light surface,
so the ink tokens are declared twice and a surface class picks the set:

| Token | On the page / `.stage` / `.on-dark` | In `.card` / `.on-light` |
|---|---|---|
| `--c-text` | grey-10 | blue-100 |
| `--c-text-secondary` | grey-40 | blue-80 |
| `--c-text-muted` | grey-50 | grey-80 |
| `--c-accent-ink` (accent-coloured text / icons) | blue-30 | blue-70 |
| `--c-stroke` (dividers, outlines) | grey-80 | blue-20 |
| `--c-control` (tracks, idle bars, field fill) | grey-90 | blue-20 |
| `--c-quiet` / `--c-on-quiet` (secondary button, chip, callout label) | blue-10 / blue-70 | blue-20 / blue-80 |

Blue 70 is a fill colour: as text or an icon on the slate page it has too little contrast,
which is why accent-coloured ink uses `--c-accent-ink`.

**Font** (self-hosted, offline): `--font` = `'Albert Sans', 'Inter', system fallbacks`.
Variable woff2 in `fonts/`, declared in `css/fonts.css` (linked first in `index.html`).

**Type** = classes in `css/base.css`, named after the Figma steps. All line-height 1.2, no
letter-spacing:

| Class | Size / weight | Used for |
|---|---|---|
| `.t-61` | 61 Bold | health score |
| `.t-49` | 49 Bold | stepper value |
| `.t-39` | 39 Bold | onboarding headline |
| `.t-31` | 31 SemiBold | page title |
| `.t-25` | 25 SemiBold | small numerals, units |
| `.t-20` | 20 Medium | card and row titles, top-bar title, field |
| `.t-16` | 16 Medium | body, secondary lines, buttons, chips, nav |
| `.t-13` | 13 Regular, uppercase | labels, eyebrows, chart axis, callout labels |

Tones: `.tone-secondary`, `.tone-muted`, `.tone-accent` (they follow the ink context).

**Rules**
- Never write a hex, a px font size outside the eight steps, a spacing value or a radius in a
  component or screen. Use the tokens; add new ones to `tokens.css`.
- Helpers take no colour options. A component gets its colours in CSS from the tokens.
  Put a block on a light surface with `.card` (or `.on-light` for a photo), on navy with `.stage`.
- Icons inherit `currentColor`: colour them with a `.tone-*` class on the icon's parent, not
  with a colour passed from JS. `KK.c('primary')` exists for the rare value that must be
  computed in JS.
- Fonts are self-hosted (`fonts/` + `css/fonts.css`): Albert Sans primary, Inter fallback.
  Never add a CDN / web-font link — it breaks `file://`.

### 2.2 Components — `css/components.css` + `js/ui.js`

Hand-rolled. Each helper returns an HTML string; its look lives in `components.css`.

| Helper | Purpose |
|---|---|
| `ui.button({label, icon, variant, block, disabled, href, replace, cls, attrs})` | The Figma button. `primary` (blue-70), `secondary` (quiet fill), `ghost` (outlined). With `href` it is a link. |
| `ui.iconButton({icon, label, href, back, cls, attrs})` | Icon-only button, 50px round. `back` makes it a Back button (`ui.backButton(fallback)` is the shortcut). |
| `ui.deviceCard(product, {status, tone, href})` | The Figma Card: 120px photo on the left, name (20), status line (16). `tone` adds a state dot; `href` makes it a link. Use it wherever a device is listed. |
| `ui.segment({name, items: [{id, label, icon}], active, label})` + `ui.setSegment(root, name, value)` | Every switcher: the Figma nav toggle in a pill track. Icons above the labels are optional. Scrolls sideways when it does not fit. Buttons carry `data-seg` / `data-value`. |
| `ui.chip({label, icon, on, attrs})` | Multi-select toggle; state is `aria-pressed`. Use on a light surface. |
| `ui.status({label, tone, cls})` | State dot + label. `tone`: `success` (default), `warning`, `danger`, `idle`. |
| `ui.pageHeader({eyebrow, title, trailingHtml})` | Header of a tab's root page. |
| `ui.topBar({title, back, trailingHtml})` | Header of a drill-down page; `back` is the fallback route. |
| `ui.stepBar({step, total, back})`, `ui.heroMark({icon})` | Onboarding pieces. |
| `ui.sectionLabel(text)` | Uppercase section label. |
| `ui.ring({size, stroke, progress, tone, innerHtml})`, `ui.statRing({label, icon, progress, tone})` | SVG progress ring; `statRing` adds an icon inside and a caption. `tone` is a state colour, omit for blue. |
| `ui.barChart({data, height, activeIndex})` | Bars grow in via CSS. |
| `ui.photo({src, alt, icon, cls, iconSize})` | Product photo with built-in icon fallback. |
| `ui.callout({id, label, icon, on, x, y})` | Feature marker on a photo at `x` / `y` percent; a toggle. Put it in `.callout-stage.on-light` > `.callout-stage__layer`. |
| `KK.visual(kind, level)` | Health visual (`flower`, `horse`, `ripples`, `vessel`, `flame`); `level` 0..1, 1 = healthy (`js/healthVisuals.js`, `css/visuals.css`). Drawn for a `.stage`. |
| `KK.tempControl.html({steps, value, label, compact})` + `.mount(el, {steps, value, onChange})` | Drag / tap / arrow-key value stepper (`js/tempControl.js`). Rows are 65px: `ROW` in the script and the heights in `components.css` change together. |
| `KK.icon(name, size, color)` | Inline SVG icon (`js/icons.js`). |

CSS-only pieces: `.card`, `.stage`, `.row`, `.stack` (column with a 10px gap), `.action-pair`,
`.list-row` (+ `__label`, `__value`; divider between rows), `.field` (text input), `.pressable`.

**Rules**
- Build screens from these. If a pattern repeats in two places, promote it to a helper in
  `ui.js` with its styles in `components.css`; layout that belongs to one screen goes in
  `css/screens.css`.
- Selected = the nav toggle look (light pill, blue-70 ink, on a blue-70 track). Action = the
  button look (blue-70 pill, light ink). Do not invent a third.
- One pressed state for everything pressable (scale 0.98 + opacity 0.9), defined once at the
  top of `components.css`. Add new pressable classes to that list.
- Keep helpers presentational; state and event wiring live in the screen's `mount`.
- `/gallery` shows the ramps, the type steps and every component. Add new ones there.

### 2.3 Icons — `js/icons.js`

**Heroicons** (MIT), solid, inlined as SVG markup under their Heroicons names (the names on
the Figma icons page). Each glyph has the 20px "mini" drawing; glyphs that are also shown
large carry the 24px solid drawing too (`GLYPHS[name] = { 20: '…', 24: '…' }`) and
`KK.icon(name, size, color)` picks the drawing for the size. Use 20 as the icon size (15 in
callout labels, larger only in hero marks and photo fallbacks). To add one, copy the inner
markup of `optimized/20/solid/<name>.svg` (and `24/solid` if shown above 20px) from
github.com/tailwindlabs/heroicons. An unknown name logs a console error.

Heroicons has no glyph for these, so the closest stands in: `beaker` = water, `fire` = warmth,
`wrench-screwdriver` = faucet / kitchen, `user` = mobility, `arrow-up-circle` = sit-to-stand,
`clock` = watch, `cloud` = scent. `logo-apple` and `logo-google` are brand marks (Phosphor
drawings on a 256 grid) used only on the sign-in buttons.

### 2.4 Screens and routing — `js/router.js`, `js/screens/*.js`

```js
KK.route('/devices/room/:id', {
  tab: 'devices',                      // omit for full-screen flows (no tab bar)
  render: function (ctx) { ... },    // HTML string, or { redirect: '/devices' }
  mount: function (root, ctx) { ... } // optional: add event listeners
});
```

- `ctx = { path, params, state }`. Put a screen's changing values in `ctx.state`: it lives as
  long as the screen is in the back stack and is dropped when the user goes back past it.
- Navigate with `<a href="#/devices">`, `<a href="#/devices" data-replace>`,
  `<button data-back="/fallback">`, or `KK.router.go / replace / back`.
- The root element of a screen is `<section class="screen ...">` (20px padding, the Figma side
  margin). Add `screen--inset-bottom` when there is no tab bar.
- Update the page in `mount` by changing the affected elements, not by re-rendering the whole
  screen (keeps focus and avoids replaying enter animations).
- Mock data is centralised in `js/data.js`; do not scatter arrays in screens.

### 2.5 Motion

- Enter: wrap in `<div class="enter-up" style="--d:1">` (from above) or `.enter-down`; `--d`
  is the item's place in the order (0, 1, 2 …), multiplied by `--stagger`.
- Prefer transform / opacity. Use the `--ease-*` / `--dur-*` tokens.
- `prefers-reduced-motion` is honoured globally in `base.css`; JS animation must check it too
  (see `tempControl.js`).
- Health visuals: shapes are computed in `healthVisuals.js` from the level; looping motion is
  CSS in `visuals.css` fed by custom properties set inline; each kind's colour is a
  `--c-visual-*` token. A new visual needs a still pose
  that reflects its level, because reduced motion switches the animation off.
- `KK.haptic('light' | 'success')` vibrates where the browser allows it (not on iOS). Never
  rely on it: every press also needs a visible pressed state.

## 3. Figma → code mapping

| Figma element | Use |
|---|---|
| Colour swatch | a ramp step through a semantic token in `tokens.css` |
| Type style | the `.t-<size>` class of the same size |
| Spacing / padding | `--sp-*` (5 / 10 / 15 / 20 / 30 / 40 / 60) |
| Corner radius | `--r-md` (10) or `--r-full` |
| Card / container | `.card`; a device is `ui.deviceCard` |
| Dark feature panel | `.stage` |
| Button | `ui.button`; icon-only: `ui.iconButton` |
| Nav toggle / tabs inside a page | `ui.segment` |
| Multi-select toggle | `ui.chip` |
| State badge | `ui.status` |
| Circular progress | `ui.ring` / `ui.statRing` |
| Bar chart | `ui.barChart` |
| Big value selector / dial | `KK.tempControl` |
| Product picture | `ui.photo` (+ `ui.callout` for feature markers) |
| Health illustration | `KK.visual` on a `.stage` |
| Screen frame | a `KK.route` in `js/screens/` |
| Bottom tab | a route with `tab:` set; tab items are in `index.html` |
| Icon | `KK.icon` with the Heroicons name |

### New screen checklist

1. Confirm the route from the sitemap (which tab, which stack) and register it with `KK.route`.
2. Root `<section class="screen">`; `ui.pageHeader` for a tab root, `ui.topBar({ back: '/parent', title })` for a drill-down.
3. Compose from `ui.*` helpers; add data to `js/data.js`.
4. Screen-only layout goes in `css/screens.css` under a class named after the screen.
5. Check it: open `index.html`, walk to the screen, use Back, reload on the screen's URL,
   look at the browser console (it must be clean), and try 375px and 430px widths.
6. Check it against the system: no hex, no font size outside the eight steps, no spacing or
   radius literal, no colour passed from JS; the new piece is in `/gallery`.

## 4. Current state

Implemented (mock data, no backend, nothing persisted): **Onboarding**, **Devices** (room
switcher, device cards, device page with photo callouts and stepper, routines), **Health**
(five areas with living visuals on a navy stage, Today / Over time charts and
interpretation), **Account** (start over, component gallery). Bottom nav: Devices / Health /
Account. All screens follow the Figma design system as of 2026-11-14.

The five product photos are linked from Kohler's image server (addresses in `js/data.js`,
supplied by Arnav); callouts are placed per photo.

The earlier Expo / React Native build is at git tag `ios-prototype`.
