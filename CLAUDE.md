# CLAUDE.md — Kohler Konnect (Figma → code integration guide)

Rules and conventions for building this app, written for an AI agent integrating the Figma
design (via the Figma MCP) into this codebase. Read this before adding a screen, component
or token.

The app is **plain HTML + CSS + vanilla JavaScript**. No framework, no npm, no bundler, no
build step: `index.html` must keep working when opened directly from disk (`file://`).

> **Source of truth for design is Figma, not this repo.** The palette below was *derived*
> from the Figma references — it is not a formal token export. When the design changes in
> Figma, re-derive the tokens here; don't trust stale values.

- Figma file: `https://www.figma.com/design/Bt9qI3UQGIfY2YCmC43VTr/UX-Design-App-and-Web-App`
- `fileKey` = `Bt9qI3UQGIfY2YCmC43VTr`
- Sitemap (structure): page `App Sitemap and inspo` → section **`Sitemap like fr fr`** (node `139:341`)
- Reference frames (visuals): `1:92` Quick Adjust, `1:323` Thermostat, `1:1215` Home list
- Design System page (`51:294`) holds **reference screenshots only** — not a formal token library.

---

## 1. Hard rules

- **No build step, no dependencies.** No npm packages, no CDN links, no web fonts. Everything
  the page needs is a file in this repo.
- **Classic scripts only.** No `import` / `export` / `type="module"` and no `fetch` of local
  files: both fail on `file://`. Every script is an IIFE that adds to the single global `KK`.
- **Script order matters** and is set in `index.html`: `data → icons → ui → tempControl →
  router → screens/*`. A new script file needs a `<script>` tag there.
- **Dark only, phone first.** One column, max width `--app-width` (393px). Use flex/grid, not
  fixed widths, except for intentionally fixed dials and rings.
- **Escape text.** Anything that is not a literal in the source goes through `KK.esc()` before
  it is put into an HTML string (user input such as the routine name especially).

## 2. Design system

### 2.1 Tokens — `css/tokens.css`

CSS custom properties on `:root`. The one place colours, spacing, radius and motion are defined.

| Group | Names |
|---|---|
| Surfaces | `--c-background` `#050507`, `--c-surface` `#141417`, `--c-surface-raised` `#1c1c21`, `--c-surface-stroke` `#2a2a30` |
| Ink | `--c-text` `#ffffff`, `--c-text-secondary` `#9a9aa3`, `--c-text-muted` `#5e5e66`, `--c-text-faint` `#3a3a40` |
| Accents | `--c-primary` `#2e7be8`, `--c-energy` `#f2a63c`, `--c-success` `#36c279`, `--c-warning` `#f2a63c`, `--c-danger` `#e5564f` |
| Rooms | `--c-room-bathroom` `#3b82f6`, `--c-room-kitchen` `#22a06b`, `--c-room-energy` `#f2a63c`, `--c-room-maintenance` `#8b8b93` |
| Controls | `--c-control-fill`, `--c-control-inactive` `#232328`, `--c-ring-track` `#26262b`, `--c-scrim` |
| Spacing | `--sp-half` 2, `--sp-1` 4, `--sp-2` 8, `--sp-3` 16, `--sp-4` 24, `--sp-5` 32, `--sp-6` 48, `--sp-7` 64 |
| Radius | `--r-sm` 12, `--r-md` 18, `--r-lg` 24, `--r-xl` 32, `--r-full` 999 |
| Motion | `--ease-gentle` / `--ease-standard` / `--ease-snappy` with `--dur-*` |

Type scale = classes in `css/base.css` (system font; size / line-height / weight):
`.t-display` 56/62/300, `.t-hero` 40/46/600, `.t-title` 28/34/700, `.t-heading` 20/27/600,
`.t-subheading` 17/24/600, `.t-body` 17/24/400, `.t-caption` 14/19/500, `.t-label` 12/16/600.
Tones: `.tone-secondary`, `.tone-muted`.

**Rules**
- Never hard-code a hex in a component or screen when a token exists. Add new tokens to
  `tokens.css`.
- In JavaScript, get a colour with `KK.c('primary')` / `KK.c('room-bathroom')` (reads the
  token, so CSS stays the single source). Tinted backgrounds: `KK.alpha(color, '1F')`.
- Data refers to colours by token name (`accent: 'room-bathroom'`, `tone: 'success'`).
- Do not load custom fonts unless Figma specifies a brand face.

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

Ionicons 7 glyphs (MIT), copied in as SVG markup; only the ones in use. `-outline` for
quiet / secondary, solid for active / hero. To add one, copy the inner markup of the Ionicons
SVG (viewBox `0 0 512 512`) into `GLYPHS`. An unknown name logs a console error.

### 2.4 Screens and routing — `js/router.js`, `js/screens/*.js`

```js
KK.route('/home/room/:id', {
  tab: 'home',                       // omit for full-screen flows (no tab bar)
  render: function (ctx) { ... },    // HTML string, or { redirect: '/home' }
  mount: function (root, ctx) { ... } // optional: add event listeners
});
```

- `ctx = { path, params, state }`. Put a screen's changing values in `ctx.state`: it lives as
  long as the screen is in the back stack and is dropped when the user goes back past it.
- Navigate with `<a href="#/home">`, `<a href="#/home" data-replace>`,
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
| Screen frame | a `KK.route` in `js/screens/` |
| Bottom tab | a route with `tab:` set; tab items are in `index.html` |
| Icon | `KK.icon` (closest Ionicons glyph) |
| Per-room colour | `--c-room-<id>` |

### New screen checklist

1. Confirm the route from the sitemap (which tab, which stack) and register it with `KK.route`.
2. Root `<section class="screen">`; `ui.topBar({ back: '/parent', title })` for a drill-down.
3. Compose from `ui.*` helpers; add data to `js/data.js`.
4. Screen-only layout goes in `css/screens.css` under a class named after the screen.
5. Check it: open `index.html`, walk to the screen, use Back, reload on the screen's URL,
   look at the browser console (it must be clean), and try 375px and 430px widths.

## 4. Current state

Implemented (mock data, no backend, nothing persisted): **Onboarding**, **Home → Room →
Product** (value stepper, quick controls, routines), **Health → Stat** (7/30/90-day chart,
highlights, sources), **Account** (start over, component gallery). Bottom nav: Home / Health /
Account.

The earlier Expo / React Native build is at git tag `ios-prototype`.
