# 01: NativeWind v5 setup

Status: done

## Goal

Style components with Tailwind classes (`className="..."`) on iPhone and Android in Expo Go, using NativeWind v5.

## Context

- Source: https://www.nativewind.dev/v5/getting-started/installation (linked from https://www.nativewind.dev/llms-full.txt, which mostly covers v4).
- NativeWind v5 is a release candidate (`5.0.0-rc.0`). The docs say it "is not intended for production use"; v4 is the stable release.
- The guide's tested target matches this project exactly: Expo 57.0.22, React Native 0.86.3, React 19.2.3, Reanimated 4.5.1, Worklets 0.10.1.
- AGENTS.md: stay on Expo Go; target iPhone and Android. NativeWind works at build time through Metro and PostCSS and adds no native code beyond Reanimated, Worklets, Safe Area Context and expo-system-ui, which Expo Go already includes and the project already has installed.

## Decisions

- Pin the exact RC pair and Tailwind versions the guide gives. They are pre-release, so `^` ranges could pull in a breaking RC.
- `global.css` goes in the project root, as in the guide, and is imported once in `src/app/_layout.tsx`.
- Skip `prettier-plugin-tailwindcss` (optional, and the project has no Prettier setup).
- No Babel config needed. The project has no `babel.config.js`, and v5 doesn't need one.
- `userInterfaceStyle: "automatic"` is already set in `app.json`.

## Steps

1. Install dependencies:
   - `npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0`
   - `npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui` (already installed; this confirms the SDK 57 versions)
   - `npm install --save-dev --save-exact tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 postcss lightningcss@1.30.1`
2. `package.json`: add `"lightningcss": "1.30.1"` to the existing `overrides` (next to the `xcode` → `uuid` override), then run `npm install`.
3. Create `postcss.config.mjs` with the `@tailwindcss/postcss` plugin.
4. Create `global.css` with the layered Tailwind imports (theme, preflight, unlayered utilities) and `nativewind/theme`.
5. Create `metro.config.js` (`npx expo customize metro.config.js`) and wrap the config with `withNativewind`.
6. Import `../../global.css` in `src/app/_layout.tsx`.
7. Create `nativewind-env.d.ts` with the `react-native-css/types` reference.
8. Restyle `src/app/index.tsx` with the guide's test classes to prove the setup works.
9. CLAUDE.md: note the NativeWind RC pins and the `lightningcss` override, so the SDK 58 upgrade accounts for them.

## Verification

- `npx tsc --noEmit`, `npx expo lint` and `npx expo-doctor` pass.
- `npx expo start --clear` bundles without errors.
- On the iPhone in Expo Go: the home screen shows centered, bold, blue, larger text on a white background.

## Result

Built as planned. All four config files match the guide, the RC pair and Tailwind are pinned exactly, and `lightningcss` resolves to 1.30.1 everywhere.

Differences from the plan:
- `expo-doctor` flagged new SDK 57 patch releases (`expo` 57.0.31, `expo-router` 57.0.29, `@expo/ui` 57.0.26), unrelated to NativeWind. These were updated with `npx expo install`, which also changed `expo` from `^57.0.0` to `~57.0.31`. An npm `ENOTEMPTY` error during the update required deleting and reinstalling `node_modules`.
- NativeWind's tooling added `nativewind-env.d.ts` to `tsconfig.json`'s `include`.
- The web export's CSS file is empty (0 B). Web isn't a target, so this wasn't investigated.

