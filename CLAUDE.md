@AGENTS.md

# rn-roam

Uses npm (`package-lock.json`). Project rules and decisions live in AGENTS.md; this file only covers the temporary SDK 57 pin.

## Pinned to Expo SDK 57 (temporary)

The project was scaffolded on SDK 58, then downgraded to SDK 57 because the App Store version of Expo Go did not yet support SDK 58. Everything in this section exists only because of that downgrade. Undo it when upgrading.

### Changes made for SDK 57

1. **Dependencies downgraded.** All `expo-*` packages are at `~57.x`, `react-native` 0.86.3, `react` 19.2.3, plus the matching versions of reanimated, worklets, gesture-handler, screens and safe-area-context.
2. **`uuid` override.** `package.json` has `"overrides": { "xcode": { "uuid": "^11.1.1" } }` to fix a moderate npm audit advisory (old `uuid` pulled in via `expo-splash-screen` → `@expo/config-plugins` → `xcode`). It only affects build-time config plugins, not the app bundle.
3. **app.json plugins.** `expo-font`, `expo-image`, `expo-status-bar` and `expo-web-browser` were added to `plugins` during the downgrade.

4. **NativeWind v5 RC pins.** `nativewind` 5.0.0-rc.0, `react-native-css` 3.1.0-rc.0, `tailwindcss`/`@tailwindcss/postcss` 4.1.12 and a `lightningcss` 1.30.1 override, tested on SDK 57. Before upgrading, check the NativeWind v5 docs for the versions tested on SDK 58. Upgrade the SDK and NativeWind as separate steps, as the NativeWind docs advise.

### Known npm audit warnings (accepted)

About 23 entries remain (the number changes as packages are added). They all come from three packages:

- `node-forge` (high), via `@expo/cli`. No patched release exists yet. Dev tooling only.
- `braces` (high), via Metro → `micromatch`. No patched release exists yet. Dev tooling only.
- `decode-uri-component` (moderate), via `expo-router` → `query-string@7`. The fixed version is ESM-only and breaks `query-string@7`. SDK 58's `expo-router` fixes it.

**Never run `npm audit fix --force`.** It "fixes" these by downgrading to `expo@44` / `react-native@0.72`.

## Upgrading to SDK 58: checklist

Expect breaking changes. Read the SDK 58 changelog and https://docs.expo.dev/versions/v58.0.0/ first.

1. Make sure Expo Go on the phone supports SDK 58 (or use a development build).
2. `npx expo install expo@^58.0.0 --fix`, then `npx expo install --fix` to align every package.
3. Remove the `uuid` override from `package.json` if `npm ls uuid` shows `xcode` no longer needs it, then run `npm install`.
4. Re-run `npm audit`. The `decode-uri-component` warnings should be gone; re-check node-forge and braces.
5. Check that the `app.json` plugins are still valid for SDK 58, and that the NativeWind pins (see above) are supported on SDK 58.
6. Run `npx expo-doctor`, `npx tsc --noEmit` and `npx expo lint`, then test on a device.
