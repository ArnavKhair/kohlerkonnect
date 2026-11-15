# Kohler Konnect: design-system cohesion pass (design)

## Summary

- **Goal.** Every screen should read as one system built from Arnav's Figma Design System page
  (Albert Sans, Kohler Blue + Greyscale ramps, pill button, light card, floating pill nav,
  Heroicons). Today only the nav, buttons, font and ramps follow it; surfaces, type usage,
  spacing, radius, icons and all screen layouts are still from the older dark build.
- **Where.** `D:\ArnavKhair\konnect\kohlerkonnect` (the current clone, `origin/main` at
  `23b07be`). The outer `D:\ArnavKhair\konnect` folder is an older checkout 8 commits behind
  and is not touched.
- **What changes.** `css/tokens.css`, `css/base.css`, `css/components.css`, `css/screens.css`,
  `css/visuals.css`, `js/icons.js`, `js/ui.js`, `js/data.js`, `js/tempControl.js` (row height),
  all six files in `js/screens/`, `index.html`, `CLAUDE.md`. No new dependencies.
- **Decisions (Arnav, 2026-11-14).** D1 surfaces follow Figma: slate page, light cards.
  D2 icons are Heroicons. D3 blue + grey for all interface parts; the five health
  illustrations keep natural colours; green / amber / red only mark a state. D4 devices are
  listed as Figma Card rows, reused in Onboarding and Account.
- **Decisions (Claude's calls).** D5 type classes renamed to the Figma steps and re-assigned
  by role. D6 spacing on a 5px base, radius 10 or pill. D7 two ink contexts (on slate / on
  light card) through scoped custom properties. D8 one toggle look (the nav toggle) for every
  switcher. D9 the health visual sits on a navy "stage" panel. D10 per-room accent colours
  removed. D11 no shadows, no borders on cards (Figma has none).
- **Verification.** Static check script (no off-system literals), headless-browser screenshots
  of every route at 393 / 375 / 430 px compared with the Figma components, scripted
  click-through with a clean console.
- **Check on a device.** Font loads, nav and callout touch targets, health visuals on the navy
  stage, stepper drag, long pages scroll under the nav.
- **Risks.** Figma line-height 1.2 is tight for paragraphs; 16px minimum text makes pages
  longer; six icons have no Heroicons match; blue-70 shapes on the slate page are low contrast
  by design.

## Context

The earlier agents added the ramps, font, pill button, pill nav and a 10px card radius
(commits `a54481f`..`23b07be`) but left the rest:

- Surfaces are four near-black colours that are in neither ramp.
- The type classes were each moved up one step, so body is 20px and section headings 31px,
  while ~45 hard-coded sizes in `components.css` / `screens.css` stayed on the old scale.
  Weights and line-height do not match Figma.
- Icons were moved to Phosphor; Figma's icons page (`217:2`) and components use Heroicons.
- Spacing (4/8/16/24) and radius (12/18/24/32) are the old scale; 112 literal spacing values
  and five different tint mechanisms (`--tint`, `KK.alpha`, `color-mix`, literal alpha hex,
  inline colour) are spread over the CSS and screens.
- The same pattern is hand-built several ways: five list rows, three headers, three status
  pills, six kinds of uppercase label, eight pressed states.

## Figma values (read 2026-11-14, file `Bt9qI3UQGIfY2YCmC43VTr`)

| Item | Node | Values |
|---|---|---|
| Type | `217:7463` | Albert Sans, line-height 1.2. 61 / 49 / 39 Bold, 31 / 25 SemiBold, 20 / 16 Medium, 13 Regular uppercase |
| Kohler Blue 100→10 | `217:7532` | `#102243 #1f3765 #324f87 #4a6ba9 #6789cb #87aaed #a6c3f9 #c3d7ff #dbe7ff #f4f8ff` |
| Greyscale 100→10 | `217:7546` | `#41464e #565b65 #6b717c #828792 #999ea9 #b1b6c0 #c9ced6 #e3e6ed #f8faff #fefeff` |
| Button | `217:7563` | blue-70 fill, pill, padding 15, gap 5, icon 20 (heroicons-mini), 16 Medium `#fefeff` |
| Card | `217:7603` | blue-10 fill, radius 10, no border, clipped; photo 120 square left; text padding 15, space-between; name 20 Medium blue-100; status 16 Medium blue-80 |
| Nav toggle | `217:7611` / `217:7613` | 105 wide, padding 5 / 20, gap 5, icon 20 above 16 Medium. Default: blue-70 fill, light ink. Active: blue-10 fill, blue-70 ink |
| Global nav | `217:7662` | blue-70 pill, padding 5, 353 x 64; icons home / heart / user-circle |
| Frame | `217:7578` | 393 x 852, background grey-100 `#41464e`; nav 20 from the sides, 30 from the bottom |

The ramps are already in `tokens.css` and match. No Figma variables or screens in the new
style exist; everything else is derived from these components.

## Approaches considered

1. **Re-skin by token only** (swap surface tokens, leave screens). Fast, but light cards with
   light text would be unreadable and the mixed sizes stay. Rejected.
2. **Foundation + components + screen sweep in place (chosen).** Keep routes, state and
   helpers; change tokens, component styles and screen markup so every value comes from the
   system. Largest diff in CSS, small in JS logic.
3. **Rebuild screens from scratch.** Not needed; structure and behaviour are sound.

## Design

### Tokens (`css/tokens.css`)

Semantic tokens point at the ramps; nothing else defines a colour.

| Token | On the slate page (`:root`) | Inside `.card` / `.on-light` |
|---|---|---|
| `--c-background` | grey-100 | |
| `--c-backdrop` (outside the phone frame on desktop) | blue-100 | |
| `--c-surface` (card) | blue-10 | |
| `--c-stage` (navy feature panel) | blue-100 | |
| `--c-primary` / `--c-primary-strong` (fills) | blue-70 / blue-80 | same |
| `--c-on-primary` (ink on a blue-70 fill) | grey-10 | same |
| `--c-text` | grey-10 | blue-100 |
| `--c-text-secondary` | grey-40 | blue-80 |
| `--c-text-muted` | grey-50 | grey-80 |
| `--c-accent-ink` (accent-coloured text / icons) | blue-30 | blue-70 |
| `--c-stroke` (dividers, outlines) | grey-80 | blue-20 |
| `--c-control` (tracks, idle bars, quiet fills) | grey-90 | blue-20 |

- `.card` re-declares the right-hand column and sets `color: var(--c-text)`, so `.tone-*`
  classes and `currentColor` icons work in both contexts without JS (D7).
- Status: `--c-success`, `--c-warning`, `--c-danger` kept, used only for dots, rings and
  icons that mark a state, never for text. `--c-energy*` removed (was a duplicate of warning).
- Illustration colours move to `--c-visual-*` (flower petal / petal-light / leaf / eye, horse,
  ripples, vessel, flame / flame-core / wax); `--c-health-*`, `--c-petal*`, `--c-flame-core`,
  `--c-wax` are renamed into that group.
- Removed: `--c-room-*`, `--c-surface-raised`, `--c-surface-stroke`, `--c-control-fill`,
  `--c-control-inactive`, `--c-ring-track`, `--c-scrim`, `--c-text-faint`, `--c-primary-soft`.
- Spacing: `--sp-1` 5, `--sp-2` 10, `--sp-3` 15, `--sp-4` 20, `--sp-5` 30, `--sp-6` 40,
  `--sp-7` 60. Screen padding is `--sp-4` (20, the Figma side margin).
- Radius: `--r-sm` 5 (bars, small marks), `--r-md` 10 (cards, photos, inputs),
  `--r-full` 9999, `--r-frame` 30 (desktop phone outline only).
- Motion: add `--dur-press` 120ms, `--dur-state` 160ms, `--stagger` 60ms; existing ease /
  duration tokens stay.

### Type (`css/base.css`), D5

Classes are named after the Figma steps so a Figma size maps to one class:

| Class | Size / weight | Used for |
|---|---|---|
| `.t-61` | 61 Bold | health score |
| `.t-49` | 49 Bold | stepper value |
| `.t-39` | 39 Bold | onboarding headline |
| `.t-31` | 31 SemiBold | page title (Devices, Today, Account) |
| `.t-25` | 25 SemiBold | small numerals (mini stats, dial), units |
| `.t-20` | 20 Medium | card and row titles, top-bar title, input |
| `.t-16` | 16 Medium | body, secondary lines, buttons, chips, nav |
| `.t-13` | 13 Regular, uppercase | labels, eyebrows, chart axis, callout labels |

All line-height 1.2, no letter-spacing. Old names are replaced everywhere: `t-title` → `t-31`
(onboarding headlines → `t-39`), `t-subheading` → `t-20`, `t-body` and `t-caption` → `t-16`,
`t-label` → `t-13`, `t-display` → `t-61`; `.caps` and the three letter-spacings go away.
Every literal `font-size` / `line-height` / `font-weight` in `components.css` and
`screens.css` is replaced by one of these steps.

### Icons (`js/icons.js`), D2

- Heroicons (MIT) solid: the 20px "mini" set for everything up to 20px, the 24px solid set
  for larger marks (hero marks, photo fallback). `GLYPHS[name] = { 20: '…', 24: '…' }` with
  only the sizes in use; `KK.icon(name, size, color)` keeps its signature and picks the set.
- Source: the official `tailwindlabs/heroicons` repo (`optimized/20/solid`, `24/solid`),
  fetched once with curl into the scratchpad and inlined. If the school network blocks it,
  pull the same glyphs from the Figma icons page through the Figma MCP.
- Keys are renamed to the Heroicons names in `data.js`, the screens and `index.html`; the
  `-outline` suffix disappears. Icon sizes are normalised to 20 (16 only in callout labels).
- Tab bar: `home`, `heart`, `user-circle` as in Figma.
- No exact Heroicons glyph (closest used, for Arnav to check): water → `beaker`,
  thermometer → `fire`, leaf / scent → `sparkles`, faucet / kitchen → `wrench-screwdriver`,
  accessibility (mobility) → `user`, sit-to-stand → `arrow-up-circle`, watch → `clock`.
  The Apple and Google marks on the sign-in buttons are brand logos, not in Heroicons; they
  keep their current glyphs with their own viewBox.

### Components (`css/components.css`, `js/ui.js`)

| Component | Change |
|---|---|
| `.card` | blue-10, radius 10, no border, padding 15 by default (`--card-pad`), light ink context |
| `ui.deviceCard(product, {status, href})` (new, replaces `ui.deviceTile`) | the Figma Card exactly; photo cell 120 square |
| `ui.button` | primary as Figma; secondary = blue-10 fill + blue-70 ink on the page, blue-20 + blue-80 in a card; ghost = 1px `--c-stroke` outline + `--c-accent-ink` |
| `ui.iconButton({icon, href, back, label})` (new) | icon-only DS button, 50px pill; used for back, gear, routines link, add |
| `ui.segment` (D8) | blue-70 pill track, padding 5; items styled as the nav toggle (active blue-10 / blue-70 ink); optional `icon` above the label; scrolls sideways when it does not fit. Used for rooms, health areas, Today / Over time, range |
| `ui.chip` | multi-select toggle on light surfaces: off blue-20 / blue-80, on blue-70 / light ink |
| `ui.status({label, tone})` (new) | dot in the status colour + 13 label in ink; replaces the onboarding pill, the account badge and the gallery label |
| `ui.pageHeader({eyebrow, title, trailingHtml})` (new) | eyebrow `t-13` + title `t-31`; used by Devices, Health and Account |
| `ui.topBar` | title `t-20`; back and trailing use `ui.iconButton` |
| `ui.ring`, `ui.statRing` (new) | track and value stroke from CSS (`--c-control`, `--tint`), default tint primary; `statRing` = ring + icon + caption (Devices and gallery) |
| `ui.barChart` | idle bars `--c-control`, active bar primary, labels `t-13`, bar radius `--r-sm` |
| `ui.photo` | flat grey-10 panel, radius 10, no gradient or border |
| `ui.callout` | dot blue-70 with a grey-10 ring; label pill off blue-10 / blue-80, on blue-70 / light ink; `t-13` |
| `ui.tile`, `ui.heroMark` | tinted with `color-mix` in CSS from `--tint`; no JS alpha |
| Stepper | values `t-49`; active `--c-primary`, others `--c-text-muted`; row 65px (`ROW` in `tempControl.js` and the CSS heights 325 / 195 change together) |
| Tab bar | margins 0 20 30, padding 5, toggles padding 5 / 20, gap 5, icon 20, label 16 Medium, no shadow |
| Pressed state | one rule for every pressable: scale 0.98 + opacity 0.9 over `--dur-press` |

Removed: `KK.alpha`, `ui.deviceTile`, `.foot-btn`, `.gear`, `.fab` shadow, `.pill`, `.badge`,
`.segment--nav`, `.routine-row` / `.rec-card` card copies (they become `.card` + a modifier).
Neutral colours no longer pass through `KK.c()`; icons inherit `currentColor` and take
`.tone-*` classes. `KK.c()` stays for `primary` and status colours only.

### Screens

- **Devices** (`devices.js`): `ui.pageHeader`; room switcher = segment; room summary as a
  light card (dial blue-70, `ui.statRing` twice, both primary); device list = one
  `ui.deviceCard` per row, gap 10; add button = `ui.iconButton` fixed bottom-right.
- **Device page** (`product.js`): photo 4:3 radius 10 with callouts; control card with the
  stepper; Set button through `ui.button` (inner swapped as today, the doubled check removed).
- **Routines** (`routines.js`): rows and the recommended card are `.card`s; the recommended
  card loses its amber tint (label `t-13` + sparkles in accent ink); creator input is a
  blue-20 field, `t-20`; chips as above.
- **Health** (`health.js`, `visuals.css`, D9): hero is a navy `.stage` panel (blue-100,
  radius 10) holding the visual, the score in `t-61` (light ink) and the caption; area
  switcher = segment with icons; chart, mini stats, meaning and sources in light cards, all
  primary. Visuals take their colours from `--c-visual-*` by kind (`.visual--flame` etc.),
  not from the UI tint; internals that assumed near-black (`--c-background` mane / eye,
  wick, hoof, ground) point at stage-appropriate ramp steps. `color` leaves the health data.
- **Onboarding** (`onboarding.js`): padding 20; one hero-mark size (120) and one title
  margin on steps 1, 2, 4; Connect step lists `ui.deviceCard` with a `ui.status` line; all
  inline margins move to `screens.css`.
- **Account** (`account.js`): `ui.pageHeader`; profile card; section cards with divider rows;
  "Kohler products" becomes a label + `ui.deviceCard` stack linking to each device; foot
  links are `ui.button` secondary.
- **Gallery**: shows both ramps, the eight type steps, every helper including the new ones,
  chips inside a card, visuals on a stage.
- `screens.css`: every literal spacing value goes to the nearest `--sp-*` step, radii to
  `--r-*`, durations to tokens; shared pieces (`.page-header`, `.section-label`,
  `.action-pair`) move to `components.css`; inline `style` in screens is limited to `--d`
  stagger and data-driven positions.
- `index.html`: `theme-color` `#41464e`; tab icons renamed. `base.css`: body uses
  `--c-backdrop`.
- `data.js`: `accent` fields and room / health colour names removed; icon names renamed; the
  onboarding vanity name matches the product name.

### Not in scope

Routes, state handling, mock data values, copy (apart from the one name fix), the health
visual geometry and animation, product photos, anything in the outer `konnect` folder, and
writing components back into Figma.

## Challenges to your direction

Built as designed in Figma; noted so they are a choice, not a surprise:

- **Blue-70 on slate.** The nav bar and buttons (`#4a6ba9`) on the page (`#41464e`) have about
  1.7:1 contrast as shapes. Text on them is fine. If they feel sunk on a phone, the fix is a
  lighter page or a darker one from the ramps, a one-token change.
- **Line-height 1.2.** Tight for the few multi-line paragraphs (insight, meaning, onboarding
  copy). If it reads cramped, a paragraph-only 1.4 would be the change.

## Approval

Arnav approved this design and its build plan on 2026-11-14 (plan mode approval in Claude Code).

## As built (differences from this design)

`CLAUDE.md` describes the system as it is in the code. Where the build differs from the text
above, these were Claude's calls during the build (2026-11-14), each small and reversible:

- `ui.tile` was removed: Account sections use a section label above a card of rows, so
  nothing used it. `accountSections[*].icon` left the data with it.
- The Account header has the eyebrow "Your profile" so all three tab headers match.
- Onboarding step 3 uses `t-31` for its title (a list page); steps 1, 2 and 4 use `t-39`.
- The scent callout uses `cloud` (the tub photo already has a `sparkles` callout).
- Callouts: the dot is hollow when off and filled when on; the label is blue-20 / blue-80
  when off (visible on a white photo without a border); its icon is 15px.
- The photo-with-callouts wrapper is `.callout-stage` in `components.css` (the gallery
  reuses it).
- The hero mark is a solid blue-70 disc with a light icon.
- Tab bar: 10px top margin so content never touches it; toggles are 105px wide as in Figma
  and may shrink on phones narrower than 393px (padding 5 / 10).
- The Devices add button is sticky at the bottom-right of the view rather than fixed, so at
  the end of the page it rests under the last card.
- The Set button on the device page is built in the screen (its content changes after a
  press) with the same classes as `ui.button`.
- Ring colour variable is `--tone`. Extra tokens: `--c-photo`, `--c-quiet`, `--c-on-quiet`;
  extra class `.on-dark`.
- Tasks 3 to 6 landed as one commit, because the helpers and the screens that call them
  cannot load cleanly apart.

Added after the independent review: a focusable card draws its focus ring inside itself;
the field placeholder uses the secondary ink.

Open for Arnav (a third item beside the two under "Challenges to your direction"):

- **Quiet fills on a card.** Idle chart bars, ring tracks, the unchecked routine circle and
  dividers are Blue 20 on a Blue 10 card (1.17:1). They read indoors and will be faint in
  bright light. One step darker in the card ink context (`--c-control` / `--c-stroke`) is
  the change if wanted.

## Round 2 (Arnav, 2026-11-14, after seeing the build)

- **Health areas.** The area switcher no longer looks like the global nav. The five area
  cards sit side by side and are swiped (native sideways scroll with snap). Under them, one
  row of icon-only Figma buttons is both the page indicator and a way to jump: the current
  one is the light pill, the others blue. Arnav chose one row over labelled buttons plus
  separate dots. Only the card in view animates. The chart and notes below follow the card
  once a swipe settles; the Today / Over time choice is kept across areas.
- **Device page.** The callouts on the photo are single-select for every product ("I can
  only change one setting at a time"), and the stepper below edits the selected setting with
  that setting's own values and unit. Each `quick` entry in `js/data.js` now has `steps`,
  `value` and `unit` or `scale`; "off" is a value. The product-level set point is folded
  into the most natural setting, which is first in the list and selected when the page opens
  (Arnav's choice over a fourth callout): PerfectFill, Restore soak, Mirror glow, Seat
  warmth, Instant hot. The line under the photo shows the selected setting and its value.
- Claude's calls: mock values per setting (change freely in `js/data.js`); the stepper
  accepts word values and reports them to screen readers as text; a button jump that is
  interrupted falls back to the card in view after a second.
- Not exercised by the automated run: the smooth scroll of a button jump and the stepper's
  spring (headless Chrome draws no frames, so the tests take the reduced-motion path of the
  same code). Both are on the phone checklist.

