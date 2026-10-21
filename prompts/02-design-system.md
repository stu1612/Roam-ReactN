# 02 · Design system

Status: done

## Goal

Every screen draws from one visual source: Roam's colors, type, spacing, radii and shadows as NativeWind tokens, the Plus Jakarta Sans font, lucide icons, and a component library covering all 15 sections of the design sheet. A dev-only preview screen shows every component so it can be compared with the design on the iPhone.

## Decisions

- **Storage:** tokens are Tailwind v4 `@theme` CSS variables in `global.css` (expo-design-system skill: Tailwind projects keep tokens in `global.css`). No `src/theme/` folder, so there is one system, not two. Components use `className` with token classes (`bg-primary`, `text-heading`, `rounded-card`). A tiny `src/constants/theme.ts` mirrors only the values that can't go through `className` (icon colors/sizes passed as props to lucide, `ActivityIndicator` color, `placeholderTextColor`).
- **Font:** Plus Jakarta Sans via `@expo-google-fonts/plus-jakarta-sans` (new dependency, approved). Weights 400 Regular, 500 Medium, 700 Bold, loaded with `useFonts` in the root layout behind the splash screen. Static files, so weight is chosen by `fontFamily` (`font-sans`, `font-medium`, `font-bold` tokens map to the family names), never `fontWeight`.
- **Icons:** `lucide-react-native` + `react-native-svg` via `npx expo install` (approved; both work in Expo Go). Stroke 2, default size 24, color `text-primary`. Exception: the Google "G" in the secondary button is a brand mark, so it ships as an SVG asset in `assets/images/google-g.svg`, not a lucide icon.
- **Dark mode:** light only. `app.json` `userInterfaceStyle` → `"light"`. Tokens are variables, so a dark set can be added later.
- **Scope:** all 15 sections. Components live in `src/components/ui/` (shared primitives); the preview screen lives at `src/app/design-system.tsx`, linked from the home screen only when `__DEV__`.
- **Glass:** the tab bar uses `expo-glass-effect` (already installed) `GlassView` on iOS 26+, with a fallback of `bg-glass` (rgba 255,255,255,0.7) + border on Android and older iOS (`isLiquidGlassAvailable()`). The component is built now; wiring it into an actual tabs navigator is out of scope (no tabs exist yet).
- **Images:** listing card photo uses `expo-image` with a remote placeholder URL in the preview.
- Values estimated from the image (sizes, paddings, radii) are snapped to the 4-point grid and listed as estimates in the report.

### Tokens

Colors (from the sheet, exact hex):

| Token | Value | Use |
|---|---|---|
| `primary` | #FFC629 | Primary actions, active states |
| `lavender` | #C9B4FF | Secondary actions, highlights, focused input border |
| `ink` (text-primary) | #0B0B1A | Headings, primary text, dark segmented thumb |
| `ink-muted` (text-secondary) | #6B7280 | Body/secondary text, placeholders |
| `surface` | #FFFFFF | Cards, sheets, modals |
| `surface-muted` | #F4F5F7 | App background, input fields, chips |
| `border` | #E5E7EB | Dividers, borders |
| `glass` | rgba(255,255,255,0.7) | Tab bar, glass surfaces |

Proposed new tokens (used in the sheet but not in the palette; values estimated from the image):

| Token | Value | Use |
|---|---|---|
| `lavender-soft` | #F1ECFF | Focused input fill, policy card bg, Superhost badge, selected chip |
| `primary-soft` | #FFF6DA | Guest favorite badge |
| `success` / `success-soft` | #16A34A / #E8F6EE | Success alert icon / bg, "New" badge |
| `danger` / `danger-soft` | #E11D48 / #FDECEF | Error alert, "20% off" badge |
| `star` | #FFC629 (= primary) | Rating star |

Type ramp (Plus Jakarta Sans; letter-spacing tightened on display/heading as in the sheet):

| Token | Family | Size / line height |
|---|---|---|
| `display` | Bold | 56 / 56 (1.0), tracking -1.5 |
| `heading` | Bold | 28 / 34 (1.2), tracking -0.5 |
| `title` | Bold | 20 / 24 (card titles, e.g. "Modern Cabin with Hot Tub") — proposed |
| `body` | Regular | 16 / 24 (1.5) |
| `caption` | Medium | 14 / 20 |
| `button` | Medium | 17 / 22 (lg), 15 / 20 (sm chips) |
| `micro` | Medium | 12 / 16 (tab labels, sub-captions) — proposed |

Spacing: Tailwind's default 4-point scale (`p-1` = 4 … ) is kept; screen edge padding is 16 (`px-4`). No custom steps needed.

Radii: `rounded-sm` 8 (tags in listing card), `rounded-md` 12 (icon tiles), `rounded-card` 20 (cards, inputs: inputs look ~16, cards ~20 — estimate), `rounded-full` (buttons, chips, badges, icon buttons, tab bar, segmented control, toggles are all capsules). Non-capsule radii get `borderCurve: "continuous"`.

Shadows: `shadow-card` `0 1px 2px rgba(11,11,26,0.05)`, `shadow-raised` `0 4px 12px rgba(11,11,26,0.08)` (tab bar, toggle knob), `shadow-glow` `0 4px 16px rgba(255,198,41,0.45)` (active Home tab). Via `boxShadow`.

Motion: `fast` 150ms (press, toggle), `base` 250ms (focus border, segment thumb).

Sizes (proposed): button height 56 (lg) / 44 (sm), input height 56, icon button 56, chip height 48 (filled text chips) / 44 (icon chips), tab bar 72.

### Components (all in `src/components/ui/`)

Every interactive one has pressed feedback (opacity 0.7 or darker fill), disabled (opacity 0.4), accessibility role/state/label, and merges `className`/`style` last.

1. `Text` — `variant`: display | heading | title | body | caption | button | micro; `tone`: default | muted. Only place `fontSize` lives.
2. `Logo` — "roam" wordmark rendered in Plus Jakarta Sans ExtraBold-like Bold, tracking -2 (no logo asset exists; flagged as placeholder — provide an SVG if one exists).
3. `Button` — variants `primary` (yellow fill, ink text, optional trailing arrow), `secondary` (white, border, optional leading icon e.g. Google G); sizes `lg` | `sm`; `loading` shows spinner with label kept for a11y.
4. `IconButton` — circular 56, `surface-muted` fill, lucide icon, required `accessibilityLabel`.
5. `TextField` — leading icon, placeholder in `ink-muted`; states default (`surface-muted`, border `border`), focused (`lavender-soft` fill, 1.5px `lavender` border); `secure` variant with eye/eye-off toggle; optional trailing action (filter icon for search).
6. `SearchField` — `TextField` preset with search icon + trailing `SlidersHorizontal` button.
7. `Chip` — selectable; variant `filter` (text only: selected = `lavender` fill; unselected = `surface-muted`) and `category` (icon + label: selected = `primary` fill, unselected = `surface-muted`). `accessibilityState.selected`.
8. `ListingCard` — horizontal: image (rounded, heart `IconButton` overlay), title, location with `MapPin`, rating with star + count, up to 2 amenity tags, price "$280 / night". Takes data props (title, location, rating, reviewCount, amenities, price, imageUri, saved, onToggleSave, onPress).
9. `PolicyCard` — `lavender-soft` card, icon tile, title, caption, chevron; pressable.
10. `ProfileRow` / `ProfileList` — grouped list on white with hairline dividers, icon + label + chevron (not a card per row).
11. `GlassTabBar` — capsule glass bar; active item = yellow circle with glow; props for items + active index; built to be passed as `tabBar` later.
12. `SegmentedControl` — two-or-more options with icons; selected thumb `ink` fill / white text, animated with Reanimated (`base`).
13. `Toggle` — use RN `Switch` with `trackColor` `primary` / `thumbColor` white (native control per skill: don't rebuild it). `Stepper` — capsule with minus / value / plus, min/max bounds, disabled ends.
14. `Alert` (`StatusBanner` to avoid clashing with RN `Alert`) — `success` | `error`, icon, message, dismiss X.
15. `Badge` — tones `favorite` (star icon, `primary-soft`), `success`, `danger`, `lavender`.
16. `src/components/ui/index.ts` re-exports all.

## Out of scope

- Real screens (home, search, stay detail, profile) and a tabs navigator — later features use these components.
- Dark mode.
- Map view behind the Map segment.
- Haptics.

## Steps

### 1. Dependencies and fonts

`npx expo install @expo-google-fonts/plus-jakarta-sans expo-font lucide-react-native react-native-svg`. In `src/app/_layout.tsx`, load Regular/Medium/Bold with `useFonts`, keep the splash up (`expo-splash-screen` `preventAutoHideAsync` / `hideAsync`) until loaded or errored. Set `app.json` `userInterfaceStyle: "light"`. Check the NativeWind v5 docs for custom font families in `@theme`. Done: app boots, `npx expo-doctor` passes.

### 2. Tokens in global.css

Add an `@theme` block with every token above (colors, `--font-*` family names, `--text-*` sizes with line heights and tracking, radii, shadows). Verify against https://www.nativewind.dev/v5 docs that v5 resolves `@theme` variables, `--text-*--line-height`, `--font-*`, and `boxShadow` utilities on native; adjust syntax if not. Create `src/constants/theme.ts` with the handful of JS-side values (colors for icon props, icon sizes, motion). Done: a test `View className="bg-primary rounded-card shadow-card"` renders correctly.

### 3. Primitives

`Text`, `Logo`, `Button`, `IconButton`, `TextField`, `SearchField`, `Badge`, `StatusBanner`. Add the Google G SVG asset (official mark from Google's brand resources — user to confirm or provide).

### 4. Selection controls

`Chip`, `SegmentedControl`, `Toggle` (Switch), `Stepper`.

### 5. Composite components

`ListingCard`, `PolicyCard`, `ProfileList`/`ProfileRow`, `GlassTabBar`.

### 6. Preview screen

`src/app/design-system.tsx`: scrollable, `surface-muted` background, one section per sheet section (01–15) with the same sample copy as the design, interactive (chips toggle, field focuses, stepper counts, segment switches, banners dismiss). Home screen gets a dev-only link to it. Replace the placeholder "Hi Stu" with a minimal branded screen using `Logo` + tagline.

### 7. Device comparison loop

User screenshots the preview screen in Expo Go; compare section by section with the design, list differences, fix, repeat.

## Verification

- `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` pass.
- `grep -rnE "#[0-9A-Fa-f]{3,8}|fontSize|fontWeight" src --include=*.tsx` finds no hits outside `src/constants/theme.ts` and the Google SVG.
- On iPhone in Expo Go: fonts render as Plus Jakarta Sans (not system font) in all three weights; every section of the preview matches the design; pressed states visible on all tappables; focused input shows lavender border; password eye toggles; glass tab bar shows glass (iOS 26) or translucent fallback.
- VoiceOver spot-check: icon buttons announce labels, chips announce selected.
- Android (if available) or note as not checked.

## AGENTS.md updates

Add a **Design system** section:
- Tokens live only in `global.css` `@theme`; JS-side mirrors only in `src/constants/theme.ts`. No hex, `fontSize`, or `fontWeight` elsewhere.
- Font is Plus Jakarta Sans (400/500/700) via `@expo-google-fonts`; choose weight with `font-*` family classes.
- Icons: `lucide-react-native` (stroke 2); brand marks are SVG assets.
- Shared UI primitives live in `src/components/ui/`; use them before writing new styled views. Light mode only for now.
- Preview every new primitive in `src/app/design-system.tsx`.
Update **Who owns what → Styling** to point at this section.

## Result

Built as planned; tsc, lint, expo-doctor and an iOS export pass, and compiled token values are present in the bundle. Checked on iPhone in Expo Go by the user: home screen and design-system preview look right.

Differences from the plan:
- Added Plus Jakarta Sans ExtraBold (800) for the `Logo` wordmark, which looks heavier than Bold in the design.
- Input radius got its own token `rounded-field` (16); cards use `rounded-card` (20).
- The Google G is a `GoogleIcon` react-native-svg component (official paths) instead of an `.svg` asset, since Metro doesn't import SVG files without an extra transformer.
- `expo-image`, `GlassView` and the segmented thumb (`Animated.View`) are wrapped in styled `View`s, as those don't take `className`.
- `Logo` is an SVG wordmark outlined from Plus Jakarta Sans ExtraBold (tracking -40 units); standalone copy in `assets/images/roam-wordmark.svg`.
