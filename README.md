# Kohler Konnect — iOS prototype

A native iOS app prototype built with **Expo (React Native + TypeScript + Expo Router)**.
Dark-only, tuned to the Figma references: near-black surfaces, per-room accent colors,
circular dials, amber energy rings, and a "pan to set" temperature control.

Scope for this build (mock data + motion, no backend):
- **Onboarding** — Let's Konnect → Create account → Connect Kohler devices → Connect other devices
- **Home → Room → Product** — room list, device list, quick-control product page (interactive temp stepper), routines
- **Health → Stat** — score cards, stat page with animated chart (7/30/90 day), highlights, sources
- **Account** — privacy, products, devices, services (+ start over, component gallery)

## Run on Windows (daily dev via Expo Go)

```bash
npm install
npx expo start --tunnel     # scan the QR with Expo Go on the iPhone
```

Hot reloads when you save. Press `w` for a browser layout preview (motion/gestures only work on the phone).

## Build the standalone app on the Mac

```bash
git pull
npm install
npx expo prebuild --platform ios
# In Xcode: open ios/<app>.xcworkspace → Signing & Capabilities → select "Personal Team"
#          → confirm bundle id is com.arnav.konnect (must be unique)
npx expo run:ios --device --configuration Release
```

Release mode bundles the JS, so the app runs on its own with no PC attached. First launch may need
Settings → General → VPN & Device Management → Trust your Apple ID. Free signing expires after
7 days; re-run to refresh.

## Notes
- `ios/` and `android/` are **not** committed — the Mac regenerates them via `expo prebuild`.
- Bundle id: `com.arnav.konnect`.
- Motion: `react-native-reanimated` + `react-native-gesture-handler` + `expo-haptics`.
- Rings/charts: `react-native-svg` (bars are reanimated Views). Icons: `@expo/vector-icons`.
