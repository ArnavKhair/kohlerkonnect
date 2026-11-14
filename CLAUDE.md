# CLAUDE.md — Kohler Konnect (Figma → code integration guide)

Rules and conventions for building this app, written for an AI agent integrating the Figma
design (via the Figma MCP) into this codebase. Read this before adding a screen, component
or token.

The app is **plain HTML + CSS + vanilla JavaScript**. No framework, no npm, no bundler, no
build step: `index.html` must keep working when opened directly from disk (`file://`).

> **Source of truth for design is Figma, not this repo.** The tokens below mirror the
> **Design System** page in Figma (Kohler Blue + Greyscale scales, a 1.25 type scale, brand
> components, and the icon set). When the design changes in Figma, re-derive the tokens here;
> don't trust stale values.

- Figma file: `https://www.figma.com/design/Bt9qI3UQGIfY2YCmC43VTr/UX-Design-App-and-Web-App`
- `fileKey` = `Bt9qI3UQGIfY2YCmC43VTr`
- Sitemap (structure): page `App Sitemap and inspo` → section **`Sitemap like fr fr`** (node `139:341`)
- Reference frames (visuals): `1:92` Quick Adjust, `1:323` Thermostat, `1:1215` Home list
- **Design System** page (`51:294`) — the formal source, with two sections:
  - **Styles** (`217:7512`): Kohler Blue scale (`217:7532`), Greyscale scale (`217:7546`)
  - **Components** (`217:7556`): Button (`217:7563`), Card (`217:7603`), Global nav / tab bar (`217:7662`; toggle default/active `217:7611`/`217:7613`)
- **Icons** page (`217:2`) — the icon set used throughout the app.

---

## 1. Hard rules

- **No build step, no dependencies.** No npm packages, no CDN links, no web fonts. Everything
  the page needs is a file in this repo. **One exception:** product photos are linked from
  Kohler's image server (`products[*].image` in `js/data.js`), always through `ui.photo`, which
  shows an icon fallback when the address is empty or the image fails.
- **Classic scripts only.** No `import` / `export` / `type="module"` and no `fetch` of local
  files: both fail on `file://`. Every script is an IIFE that adds to the single global `KK`.
- **Script order matters** and is set in `index.html`: `data → icons → ui → tempControl →
  healthVisuals → router → screens/*`. A new script file needs a `<script>` tag there.
- **Dark only, phone first.** One column, max width `--app-width` (393px). Use flex/grid, not
  fixed widths, except for intentionally fixed dials and rings.
- **Escape text.** Anything that is not a literal in the source goes through `KK.esc()` before
  it is put into an HTML string (user input such as the routine name especially).

## 2. Design system

### 2.1 Tokens — `css/tokens.css`

CSS custom properties on `:root`. The one place colours, spacing, radius and motion are defined.

| Group | Names |
|---|---|
| Kohler Blue scale | `--blue-100` `#102243` … `--blue-70` `#4a6ba9` … `--blue-10` `#f4f8ff` (10 steps, 100→10) |
| Greyscale | `--grey-100` `#41464e` … `--grey-70` `#828792` … `--grey-10` `#fefeff` (10 steps, 100→10) |
| Surfaces (near-black) | `--c-background` `#050507`, `--c-surface` `#141417`, `--c-surface-raised` `#1c1c21`, `--c-surface-stroke` `#2a2a30` |
| Ink (Greyscale ramp) | `--c-text` `#fefeff`, `--c-text-secondary` `#c9ced6`, `--c-text-muted` `#999ea9`, `--c-text-faint` `#828792` |
| Brand accent (Kohler Blue) | `--c-primary` `#4a6ba9` (blue-70), `--c-primary-strong` `#324f87` (blue-80), `--c-primary-soft` |
| Functional (not in DS; kept) | `--c-energy` `#f2a63c`, `--c-success` `#36c279`, `--c-warning` `#f2a63c`, `--c-danger` `#e5564f` |
| Rooms (Kohler Blue steps) | `--c-room-bathroom` `#4a6ba9` (70), `--c-room-kitchen` `#6789cb` (60), `--c-room-energy` `#87aaed` (50), `--c-room-maintenance` `#324f87` (80) |
| Health | `--c-health-mobility` `#d9925f`, `--c-health-gut` `#2fb8a6`, `--c-petal`, `--c-petal-light`, `--c-flame-core`, `--c-wax` |
| Controls | `--c-control-fill`, `--c-control-inactive` `#232328`, `--c-ring-track` `#26262b`, `--c-scrim` |
| Spacing | `--sp-half` 2, `--sp-1` 4, `--sp-2` 8, `--sp-3` 16, `--sp-4` 24, `--sp-5` 32, `--sp-6` 48, `--sp-7` 64 |
| Radius | `--r-sm` 12, `--r-card` 10 (DS Card), `--r-md` 18, `--r-lg` 24, `--r-xl` 32, `--r-full` 999 |
| Motion | `--ease-gentle` / `--ease-standard` / `--ease-snappy` with `--dur-*` |

**Font** (self-hosted, offline): `--font` = `'Albert Sans', 'Inter', system fallbacks`.
Variable woff2 in `fonts/`, declared in `css/fonts.css` (linked first in `index.html`).

**Type scale** = classes in `css/base.css` (1.25 ratio; size / line-height / weight), body base 16px:
`.t-display` 61/71/300, `.t-hero` 49/57/600, `.t-title` 39/46/700, `.t-heading` 31/38/600,
`.t-subheading` 25/32/600, `.t-body` 20/28/400, `.t-caption` 16/22/500, `.t-label` 13/17/600.
Tones: `.tone-secondary`, `.tone-muted`.

**Rules**
- Never hard-code a hex in a component or screen when a token exists. Add new tokens to
  `tokens.css`.
- In JavaScript, get a colour with `KK.c('primary')` / `KK.c('room-bathroom')` (reads the
  token, so CSS stays the single source). Tinted backgrounds: `KK.alpha(color, '1F')`.
- Data refers to colours by token name (`accent: 'room-bathroom'`, `color: 'health-gut'`).
- Fonts are self-hosted (`fonts/` + `css/fonts.css`): Albert Sans primary, Inter fallback.
  Never add a CDN / web-font link — it breaks `file://`.

### 2.2 Components — `css/components.css` + `js/ui.js`

Hand-rolled. Each helper returns an HTML string; its look lives in `components.css`.

| Helper | Purpose |
|---|---|
| `ui.button({label, icon, variant, tint, block, disabled, href, replace, attrs})` | `primary` (filled with `tint`), `secondary` (raised surface), `ghost` (outlined). With `href` it is a link. |
| `ui.chip({label, icon, on, tint, attrs})` | Small toggle; state is `aria-pressed`. |
| `ui.tile({icon, color, size, radius, iconSize, alpha})` | Icon on a tinted square. |
| `ui.ring({size, stroke, progress, color, innerHtml})` | SVG progress ring. |
| `ui.barChart({data, height, color, activeIndex})` | Bars grow in via CSS. |
| `ui.topBar({title, accent, back, trailingHtml})` | Header; `back` is the fallback route. |
| `ui.stepBar({step, total, back})`, `ui.heroMark({icon, tint, size})` | Onboarding pieces. |
| `ui.sectionLabel(text)` | Uppercase section label. |
| `ui.segment({name, items, active, label, tint, nav})` + `ui.setSegment(root, name, value)` | Segmented switch. `nav: true` is the larger local-navigation style (room switcher). Buttons carry `data-seg` / `data-value`. |
| `ui.photo({src, alt, icon, color, cls})` | Product photo with built-in icon fallback. `cls: 'photo--thumb'` for list rows. |
| `ui.deviceTile(product)` | Tile for the Devices grid (photo, name, status). |
| `ui.callout({id, label, icon, on, x, y, tint})` | Feature marker on a photo at `x` / `y` percent; a toggle. |
| `KK.visual(kind, level)` | Health visual (`flower`, `horse`, `ripples`, `vessel`, `flame`); `level` 0..1, 1 = healthy (`js/healthVisuals.js`, `css/visuals.css`). |
| `KK.tempControl.html(...)` + `.mount(el, {steps, value, onChange})` | Drag / tap / arrow-key value stepper (`js/tempControl.js`). |
| `KK.icon(name, size, color)` | Inline SVG icon (`js/icons.js`). |

CSS-only pieces: `.card`, `.row`, `.pressable`, `.icon-btn`, `.pill`, `.badge`, `.segment`.

**Rules**
- Build screens from these. If a pattern repeats in two places, promote it to a helper in
  `ui.js` with its styles in `components.css`; layout that belongs to one screen goes in
  `css/screens.css`.
- A component takes its accent from the `--tint` custom property.
- Keep helpers presentational; state and event wiring live in the screen's `mount`.
- `/gallery` shows every component. Add new ones there.

### 2.3 Icons — `js/icons.js`

**Phosphor** glyphs (MIT), inlined as SVG markup; ~40 in use, keyed by name. Phosphor is a
256×256 fill-based grid (not 24px stroke): `-outline`-style names use the *regular* weight,
solid names use the *fill* weight. `KK.icon(name, size, color)` keeps its signature; only the
glyph data + viewBox changed. To add one, copy the inner markup of the Phosphor SVG
(viewBox `0 0 256 256`) into `GLYPHS` under the same name you reference. An unknown name logs
a console error. Substitutes: `shower` stands in for a smart faucet; `wheelchair` for sit-to-stand.

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
- The root element of a screen is `<section class="screen ...">`. Add `screen--inset-bottom`
  when there is no tab bar, and `style="--pad:28px"` to change the padding.
- Update the page in `mount` by changing the affected elements, not by re-rendering the whole
  screen (keeps focus and avoids replaying enter animations).
- Mock data is centralised in `js/data.js`; do not scatter arrays in screens.

### 2.5 Motion

- Enter: wrap in `<div class="enter-up" style="--d:60ms">` (from above) or `.enter-down`;
  stagger with `--d`.
- Prefer transform / opacity. Use the `--ease-*` / `--dur-*` tokens.
- `prefers-reduced-motion` is honoured globally in `base.css`; JS animation must check it too
  (see `tempControl.js`).
- Health visuals: shapes are computed in `healthVisuals.js` from the level; looping motion is
  CSS in `visuals.css` fed by custom properties set inline. A new visual needs a still pose
  that reflects its level, because reduced motion switches the animation off.
- `KK.haptic('light' | 'success')` vibrates where the browser allows it (not on iOS). Never
  rely on it: every press also needs a visible pressed state.

## 3. Figma → code mapping

| Figma element | Use |
|---|---|
| Colour swatch | token in `tokens.css`; `KK.c()` in JS |
| Type style | nearest `.t-*` class; add a class only if used in two places |
| Spacing / padding | `--sp-*` |
| Corner radius | `--r-*` |
| Card / container | `.card` (tinted: background `KK.alpha(accent, '1F')`) |
| Button | `ui.button` |
| Small toggle | `ui.chip` |
| Circular progress | `ui.ring` |
| Bar chart | `ui.barChart` |
| Big value selector / dial | `KK.tempControl` |
| Local nav / tabs inside a page | `ui.segment` |
| Product picture | `ui.photo` (+ `ui.callout` for feature markers) |
| Health illustration | `KK.visual` |
| Screen frame | a `KK.route` in `js/screens/` |
| Bottom tab | a route with `tab:` set; tab items are in `index.html` |
| Icon | `KK.icon` (Phosphor glyph) |
| Per-room colour | `--c-room-<id>` |

### New screen checklist

1. Confirm the route from the sitemap (which tab, which stack) and register it with `KK.route`.
2. Root `<section class="screen">`; `ui.topBar({ back: '/parent', title })` for a drill-down.
3. Compose from `ui.*` helpers; add data to `js/data.js`.
4. Screen-only layout goes in `css/screens.css` under a class named after the screen.
5. Check it: open `index.html`, walk to the screen, use Back, reload on the screen's URL,
   look at the browser console (it must be clean), and try 375px and 430px widths.

## 4. Current state

Implemented (mock data, no backend, nothing persisted): **Onboarding**, **Devices** (room
switcher, device tiles, device page with photo callouts and stepper, routines), **Health**
(five areas with living visuals, Today / Over time charts and interpretation), **Account**
(start over, component gallery). Bottom nav: Devices / Health / Account.

The five product photos are linked from Kohler's image server (addresses in `js/data.js`,
supplied by Arnav); callouts are placed per photo.

The earlier Expo / React Native build is at git tag `ios-prototype`.
