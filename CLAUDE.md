# CLAUDE.md — Kohler Konnect (Figma → code integration guide)

Rules and conventions for building this app, written for an AI agent integrating the
Figma design (via the Figma MCP) into this Expo / React Native codebase. Read this before
adding a screen, component, or token.

> **Source of truth for design is Figma, not this repo.** The palette below was *derived*
> from the Figma references — it is not a formal token export. When the design changes in
> Figma, re-derive the tokens here; don't trust stale values.

- Figma file: `https://www.figma.com/design/Bt9qI3UQGIfY2YCmC43VTr/UX-Design-App-and-Web-App`
- `fileKey` = `Bt9qI3UQGIfY2YCmC43VTr`
- Sitemap (structure): page `App Sitemap and inspo` → section **`Sitemap like fr fr`** (node `139:341`)
- Reference frames (visuals): `1:92` Quick Adjust, `1:323` Thermostat, `1:1215` Home list
- Design System page (`51:294`) holds **reference screenshots only** — not a formal token library.

---

## 1. Design System

### 1.1 Token definitions

Tokens live in **one file**: `src/constants/theme.ts`. They are plain frozen objects
(no runtime theming lib, no CSS-in-JS runtime, no variables). Dark-only.

```ts
// src/constants/theme.ts
export const Colors = {
  background: '#050507',      // app background
  surface: '#141417',         // card
  surfaceRaised: '#1C1C21',   // elevated control / selected segment
  surfaceStroke: '#2A2A30',   // 1px borders
  text: '#FFFFFF',
  textSecondary: '#9A9AA3',
  textMuted: '#5E5E66',
  primary: '#2E7BE8',         // brand blue
  energy: '#F2A63C',          // amber energy ring
  success: '#36C279',
  warning: '#F2A63C',
  danger: '#E5564F',
  room: {                     // per-room accent system (from Figma)
    bathroom: '#3B82F6',
    kitchen: '#22A06B',
    energy: '#F2A63C',
    maintenance: '#8B8B93',
  },
  scrim: '#000000AA',
  controlFill: '#2A2A30',
  controlInactive: '#232328',
  ringTrack: '#26262B',
} as const;

export const Spacing = { half: 2, one: 4, two: 8, three: 16, four: 24, five: 32, six: 48, seven: 64 } as const;
export const Radius  = { sm: 12, md: 18, lg: 24, xl: 32, full: 999 } as const;
export const Type    = {
  display:    { fontSize: 56, lineHeight: 62, fontWeight: '300' },
  hero:       { fontSize: 40, lineHeight: 46, fontWeight: '600' },
  title:      { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  heading:    { fontSize: 20, lineHeight: 27, fontWeight: '600' },
  subheading: { fontSize: 17, lineHeight: 24, fontWeight: '600' },
  body:       { fontSize: 17, lineHeight: 24, fontWeight: '400' },
  caption:    { fontSize: 14, lineHeight: 19, fontWeight: '500' },
  label:      { fontSize: 12, lineHeight: 16, fontWeight: '600' },
} as const;
export const Spring = {  // tuned for 60fps on a 60Hz iPhone 15
  gentle:   { damping: 20, stiffness: 120, mass: 0.9, restDisplacement: 0.001, restSpeed: 0.001 },
  standard: { damping: 16, stiffness: 180, mass: 0.8, restDisplacement: 0.001, restSpeed: 0.001 },
  snappy:   { damping: 15, stiffness: 260, mass: 0.7, restDisplacement: 0.001, restSpeed: 0.001 },
} as const;
```

**Rules**
- Always pull color/spacing/radius/type from `@/constants/theme`. **Never** hard-code a hex in a screen when a token exists.
- Add new tokens to this file (extend `Colors`/`Type`/etc.), not inline.
- iOS uses the **system font**; `Type` only sets size/lineHeight/weight. Do not load custom fonts unless Figma specifies a brand face.
- `Spring` presets are the only sanctioned animation configs; reference them, don't invent raw stiffness values.

### 1.2 Component library

Hand-rolled primitives in `src/components/`. No third-party UI kit, no Storybook, no `.mdx` docs.

| File | Exports | Purpose |
|------|---------|---------|
| `ui.tsx` | `Text`, `Icon`, `Card`, `Row`, `Button`, `Chip`, `SectionHeader`, `IconName` | Atomic building blocks |
| `Ring.tsx` | `Ring` | SVG progress ring (energy/status) |
| `BarChart.tsx` | `BarChart` | Animated bar chart (reanimated Views) |
| `TemperatureControl.tsx` | `TemperatureControl` | "Pan to set" value stepper (signature interaction) |
| `Screen.tsx` | `Screen`, `TopBar` | Safe-area + background shell, header bar |
| `Onboard.tsx` | `StepBar`, `HeroMark` | Onboarding progress bar + hero mark |

The atomic `Text` and `Icon` are the ones to reach for:

```tsx
// src/components/ui.tsx
export type IconName = keyof typeof Ionicons.glyphMap;

export function Text({ variant = 'body', tone = 'primary', style, ...rest }: TextProps_) {
  return <RNText style={[{ color: colorOf(tone) }, Type[variant], style]} {...rest} />;
}

export function Icon({ name, size = 22, color = Colors.text, style }: IconProps) {
  return <Ionicons name={name} size={size} color={color} style={style} />;
}
```

**Rules**
- Build new screens from these primitives. If a pattern repeats in ≥ 2 places, promote it to a component in `src/components/` (not into `src/app/`).
- `Button` variants: `primary` (filled, `tint` color), `secondary` (raised surface), `ghost` (outlined). `Chip` is the small toggle (uses `on` + `tint`).
- `Screen` wraps every screen. Pass `scroll` for scrolling content; pass `edges` to control safe-area (see §1.6).
- Keep components presentational; keep state/logic in the screen.

### 1.3 Frameworks & libraries

| Concern | Library | Version | Notes |
|---------|---------|---------|-------|
| Runtime | React Native | 0.88.1 | Expo SDK **58** |
| React | react | 19.3.0 | **React Compiler enabled** (`reactCompiler: true`) |
| Routing | `expo-router` | ~58.0.31 | File-based, typed routes |
| Animation | `react-native-reanimated` | 4.7.1 | Worklets (reanimated 4 API) |
| Gestures | `react-native-gesture-handler` | ~3.3.0 | New `Gesture`/`GestureDetector` API |
| Haptics | `expo-haptics` | ~58.0.8 | iOS-only target |
| SVG | `react-native-svg` | 15.16.0 | Rings only — included in Expo Go |
| Icons | `@expo/vector-icons` | ^15 | Ionicons set |
| Images | `expo-image` | ~58.0.18 | Preferred over RN `Image` |
| Safe area | `react-native-safe-area-context` | ~5.11.1 | via `Screen` |

**Rules**
- **Expo Go compatibility is a hard constraint** (daily dev loop is Expo Go). Before adding any native module, confirm it's in Expo Go (docs: *Third-party libraries supported in Expo Go*). If it isn't, prefer an Expo module or a pure-JS/reanimated alternative (see how `BarChart` avoids SVG animation, and `Ring` renders statically).
- Add dependencies with **`npx expo install <pkg>`** (never `npm i`) so versions match SDK 58.
- Reanimated 4 + React Compiler: worklets are detected automatically (the `'worklet'` directive is still used for gesture handlers). ESLint's `react-hooks/immutability` flags shared-value `.value` mutation — that is the intended reanimated API; see the disable comment in `TemperatureControl.tsx`.

### 1.4 Asset management

Assets live in `assets/`:

```
assets/
  expo.icon/icon.json + Assets/   # iOS icon (expo-icon)
  images/icon.png, splash-icon.png, favicon.png
  images/android-icon-*.png
  images/tabIcons/*.png           # (template leftover — we use vector icons now)
```

**Rules**
- Reference by relative path in `app.json` (icons/splash) or via `require('@/assets/...')` in code.
- Prefer **vector icons** (`Icon`) and **SVG shapes** (`Ring`) over raster images.
- Use `expo-image` (`<Image source={...} />` from `expo-image`) for photos; no CDN in this project.
- No image optimizer is configured — keep rasters small; avoid adding large assets.

### 1.5 Icon system

- Source: **Ionicons** via `@expo/vector-icons`, wrapped by the `Icon` component.
- Naming: Ionicons glyph names, e.g. `home`, `water-outline`, `sparkles-outline`, `pulse`, `settings-outline`, `chevron-back`, `flash`. **Verify a name exists** — invalid names are a TS error (the `IconName` type = `keyof typeof Ionicons.glyphMap`).
- Convention in this app: use `-outline` for quiet/secondary, solid for active/hero.
- Import the type for typed props: `import { Icon, type IconName } from '@/components/ui'`.

```tsx
<Icon name="flash" size={22} color={Colors.energy} />
```

**Rule:** when a Figma frame shows an icon, map it to the closest Ionicons glyph; only fall back to an asset (`expo-image`) if no glyph fits the style.

### 1.6 Styling approach

- **`StyleSheet.create` per file**, composing token values from `@/constants/theme`. No CSS Modules, no styled-components, no Tailwind/Nativewind.
- The **only** CSS in the repo is `src/global.css` (web font fallback vars) — irrelevant to the iOS build.
- Dark-only: colors are fixed from `Colors`; there is no light/dark switch.
- No responsive breakpoints (single iPhone width). Use flex layouts, not fixed widths, except for intentionally fixed dials/rings.
- Safe area: `Screen` uses `SafeAreaView`. For screens **with the tab bar** pass `edges={['top','left','right']}` (omit bottom so the tab bar owns the home-indicator inset). For full-screen flows (onboarding, stat, gallery) use the default `['top','bottom']`.

### 1.7 Project structure

```
kohlerkonnect/
  app.json                 # identity, bundle id, plugins  (see below)
  tsconfig.json            # "@/*" -> "./src/*", strict, typed routes
  AGENTS.md                # Expo workflow rules (complements this file)
  src/
    app/                   # ── ROUTES ONLY (Expo Router; one screen per file) ──
      _layout.tsx          # root Stack (index, onboarding, (tabs), gallery) + ThemeProvider
      index.tsx            # redirect -> /onboarding
      gallery.tsx          # hidden component gallery
      onboarding/          # flow: index, account, connect, other  (+_layout)
      (tabs)/              # tab group
        _layout.tsx        # Tabs: home / health / account
        home/              # index, room/[id], product/[id], routines/[id]  (+_layout Stack)
        health/            # index, stat/[id]  (+_layout Stack)
        account/           # index  (+_layout Stack)
    components/            # primitives + composite components (§1.2)
    constants/theme.ts     # design tokens (§1.1)
    data/mock.ts           # mock data (rooms, products, stats, routines, account)
    css.d.ts               # `declare module '*.css'`
    global.css             # web font vars (native build ignores)
  assets/                  # icons + images (§1.4)
```

**Rules**
- **Routes = files under `src/app/`.** Everything else (components, hooks, utils, data) lives under `src/` but **not** in `src/app/`. A file that isn't a screen must not go in `src/app/`.
- Navigation with `expo-router`: `router.push/back/replace`, `Link`, `useLocalSearchParams<{ id: string }>()` (type the param). Typed routes are on — invalid `href` strings are errors.
- Route groups `(…)` don't add a path segment; tab folders are `home`/`health`/`account`.
- Dynamic routes use `[id].tsx`; index the lookup param as `{ id: string }`.
- Mock data is centralized in `src/data/mock.ts` — add entities there, don't scatter arrays in screens.

---

## 2. Figma → code integration workflow (the rules)

### 2.1 Map Figma concepts to this system

| Figma element | Use |
|---------------|-----|
| Color swatch | → `Colors.*` token (add one if genuinely new); apply via `Text tone` / component `tint` / inline `color` |
| Type style (size/weight) | → nearest `Type` preset; only add a new preset if it's used ≥ 2 places |
| Spacing / padding | → `Spacing.*` |
| Corner radius | → `Radius.*` |
| Card / container | → `Card` (or `Card` with a `tint` background `${accent}1F` for tinted cards) |
| Button | → `Button` (`primary`/`secondary`/`ghost`, `tint`, `icon`, `block`) |
| Small toggle | → `Chip` (`on`, `tint`) |
| Circular progress | → `Ring` (`progress`, `color`, `stroke`) |
| Bar/line chart | → `BarChart` (`data`, `color`, `activeIndex`) — bars are reanimated Views, **not** SVG paths |
| Big value selector / dial | → `TemperatureControl` (steps + value + `onChange`) |
| Screen frame | → a route file in `src/app/`, wrapped in `Screen` (+ `TopBar`) |
| Bottom tab | → a screen in `src/app/(tabs)/` |
| Icon | → `Icon` (Ionicons glyph) |
| Per-room color | → `Colors.room.<id>` |

### 2.2 How to build a new screen (checklist)

1. Confirm the route location from the sitemap (which tab / which stack). Add the file under the right `src/app/…` folder; if it's a new stack screen, add it to that folder's `_layout.tsx` `<Stack>`.
2. Wrap in `<Screen edges={…} scroll={…}>`; add `<TopBar back title=…>` if it's a drill-down.
3. Compose from `ui.tsx` primitives + `Ring`/`BarChart`/`TemperatureControl` as needed.
4. Add data to `src/data/mock.ts` (typed); reference by id.
5. Motion: `FadeInUp`/`FadeInDown` `.springify()` for enters, `withSpring`/`useSharedValue` for stateful animation, `Spring.*` presets, `expo-haptics` on confirm.
6. Hooks **before** any early `return` (rules-of-hooks).
7. `npx tsc --noEmit` + `npx eslint "src/**/*.{ts,tsx}"` must be clean; `npx expo export --platform ios` should bundle.

### 2.3 Motion conventions

- Enters: `<Animated.View entering={FadeInUp.springify()}>`, stagger siblings with `.delay(n)`.
- Shared values: `useSharedValue`, animate with `withSpring(v, Spring.standard)`.
- Worklet handlers (gestures): include the `'worklet'` directive; JS callbacks go through `runOnJS(fn)(args)`.
- `react-hooks/immutability` on `.value` mutation is expected — keep the file-level disable where shared values are mutated.
- Target 60fps (iPhone 15 is 60Hz, not ProMotion). Prefer transform/opacity; avoid animating layout.
- Charts: stagger via a real `setTimeout` in the effect (reanimated's `withTiming` has no `delay` config in this build) — see `BarChart.tsx`.

### 2.4 Guardrails / gotchas

- **Do not** create or edit `ios/` / `android/` — they're gitignored and regenerated by `expo prebuild` on the Mac.
- All native config goes in `app.json` (bundle id `com.arnav.konnect`, `userInterfaceStyle: "dark"`, plugins). After changing native config, the Mac must re-run `prebuild`.
- `package.json` `name` is still `"scaffold"` (harmless) and `scripts.lint` = `expo lint` had a version mismatch — use `npx eslint` directly.
- Figma MCP is configured in the environment (`opencode.json`, parent of the repo), not in this repo.

---

## 3. Commands

```bash
npm install                     # install deps (once)
npx expo install <pkg>          # add a dependency (SDK-version-resolved) — ALWAYS use this
npx expo start --tunnel         # dev server for Expo Go (daily loop)
npx tsc --noEmit                # typecheck (must be clean)
npx eslint "src/**/*.{ts,tsx}"  # lint (must be clean)
npx expo export --platform ios  # validate the JS bundle compiles
npx expo prebuild --platform ios# generate ios/ on the Mac (do NOT on Windows)
```

---

## 4. Current state

Implemented (mock data, no backend): **Onboarding**, **Home → Room → Product** (interactive temp
stepper + quick controls + routines), **Health → Stat** (animated 7/30/90-day chart, highlights,
sources), **Account** (+ start-over, component gallery). Bottom nav: Home / Health / Account.

Next: refine per Arnav's on-device feedback (colors, spacing, copy, weak screens), then add
remaining sitemap screens (Kitchen product set, full Routines creator) one vertical slice at a time.
