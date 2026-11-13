# Kohler Konnect: port from Expo / React Native to plain HTML, CSS and JavaScript

## Summary

- **Goal.** Replace the Expo SDK 58 / React Native iOS prototype with a static web app that
  needs no toolchain: open `index.html` and it runs. The iOS toolchain (Expo Go, prebuild on a
  Mac) caused complications. The team's UX updates follow in a later round, so this round is a
  1:1 port of the existing screens, structured so that screens are easy to change.
- **What changes.** `src/` (TypeScript / React Native), `app.json`, `package.json`, lockfile,
  TypeScript and ESLint config, Expo template assets are removed. New: `index.html`,
  `css/{tokens,base,components,screens}.css`, `js/{data,icons,ui,tempControl,router}.js`,
  `js/screens/{onboarding,home,product,routines,health,account}.js`. `README.md` and
  `CLAUDE.md` are rewritten for the web stack.
- **Decisions.** D1 no build step, classic scripts. D2 one page with a hash router. D3
  phone-first, 393px column on desktop. D4 icons as inline SVG. D5 motion in CSS. D6 haptics
  dropped. D7 Expo code removed from `main`, kept at tag `ios-prototype`. D8 state in memory.
  Details below.
- **Verification.** A scripted click-through in headless Chrome (every route, every data id,
  the whole onboarding flow, stepper by keyboard / drag / tap, chips, routines, charts, tabs,
  back and state rules, console must be clean) and a text comparison of every visible string in
  the old source against the rendered pages. Screenshots reviewed by eye.
- **Check on a device.** A real iPhone in Safari: safe-area insets (notch, home indicator) and
  the feel of the touch drag on the stepper. Not verifiable from the development PC.
- **Risks.** Pixel parity with the native build is approximate (font metrics, spring feel).
  `main` no longer contains the Expo app; recover it with `git checkout ios-prototype`.

## Approaches considered

1. **Static HTML/CSS + vanilla JS, single page, hash router (chosen).** Mirrors the Expo
   Router paths, keeps the tab bar and per-screen state alive between screens, no tooling.
2. **One HTML file per screen, no router.** Simplest files, but the shell (head, tab bar,
   scripts) is repeated 15 times, dynamic routes (`room/:id`, `product/:id`, `stat/:id`) need
   query strings and JS anyway, and every UX change to shared chrome touches every file.
3. **Expo's web export (`expo export --platform web`).** Reuses the code, but keeps the whole
   Expo / React Native toolchain that caused the trouble, and Node is not installed on the
   development PC. Rejected: it does not meet "fully HTML/CSS".

## Decisions

- **D1 No build step, classic scripts.** Plain `<script>` tags in dependency order, one global
  `KK`, no ES modules and no bundler. Reason: Node is not available, and the page then opens by
  double-click (`file://`) and hosts on GitHub Pages unchanged.
- **D2 Single page, hash router.** `#/home/room/bathroom` etc., same paths as before. Screen
  state is kept per history entry: it survives going forward and back, and is dropped when the
  user navigates back past the screen, as component state did on the native stack. Tabs
  remember where they were left; a second tap on the active tab returns to its first screen.
- **D3 Phone first.** Full width on phones; on wider windows a centred 393 × 852 column.
  `env(safe-area-inset-*)` replaces `SafeAreaView`.
- **D4 Icons as inline SVG.** The 40 Ionicons glyphs in use are copied into `js/icons.js`
  (MIT). No icon font, no CDN.
- **D5 Motion in CSS.** Enter animations are keyframes with a stagger delay; the three spring
  presets become easing / duration tokens; bars grow with a CSS animation. The stepper keeps a
  real spring (integrated in `requestAnimationFrame`) because it is driven by the finger.
  `prefers-reduced-motion` is honoured.
- **D6 Haptics dropped.** iOS Safari has no haptics API. `KK.haptic` vibrates where the
  browser allows it (Android); every press has a visible pressed state.
- **D7 Expo code removed from `main`.** Kept at tag `ios-prototype` (commit `95936b8`).
- **D8 State in memory.** Nothing is saved between page loads, as before.

## Differences from the native build

Deliberate, small, and listed so the UX round can confirm or reverse them:

- **Stepper drag direction.** The column now follows the finger. In the native build the
  column moved against the finger. Larger values are still above the centre.
- **Stepper extras.** A value can also be tapped to select it, and the control works from the
  keyboard (arrow keys, Home / End). The selected value is centred in the control; natively it
  sat 33px below centre.
- **Account section cards** have 16px inner padding. Natively they had none, so the icon and
  rows touched the card edge.
- **Routine rows:** the whole row toggles, not only the text.
- **Product icons** moved from the room screen into the product data.
- **Gallery:** chart card has padding; chips toggle; the label reads "(drag)" not "(swipe)".

Kept as found (looks unintended, left for the UX round): the product footnote repeats the room
name ("Bathroom · Bathroom · Quick controls") because the blurb already starts with it.

## Left to later rounds

The team's UX updates; Kitchen product set; full routines creator; any persistence or backend.
