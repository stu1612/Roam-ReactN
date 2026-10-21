# 03 · Onboarding

Status: done

## Goal

On launch, guests see a 3-slide swipeable onboarding (slide 1 matches the attached design) and can move into sign-in or sign-up via "Get started", "Continue with Google" or "Skip".

## Decisions

- Auth screens are placeholders this round: `src/app/(auth)/sign-in.tsx` and `sign-up.tsx`, styled with the design system, no Clerk. Clerk + browser Google OAuth is a separate plan.
- "Get started" → `/sign-up`. "Continue with Google" → `/sign-in` (placeholder; later starts OAuth). "Skip" → `/sign-in`.
- Onboarding shows on every launch (no persistence, no new dependency). A "seen" flag comes with auth gating.
- Onboarding becomes `src/app/index.tsx`. The dev "Design system" link moves to the sign-in placeholder (dev only).
- 3 slides in a horizontal paging `FlatList` (no new dependency). Photo + location pill change per slide; the white card's heading/body change per slide; buttons stay fixed.
- Photos: remote Unsplash URLs (`images.unsplash.com/photo-…?w=1200&q=80`), via `expo-image` with `contentFit="cover"`. Each URL is checked to return 200 before use. Placeholders, not licensed assets.
- Slide copy (2 and 3 are mine):
  1. Whistler, BC — "Find a stay that fits your story" / "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip."
  2. Krabi, Thailand — "Just say what you're looking for" / "Describe your trip in one sentence and get stays ranked for you."
  3. Maldives — "Answers straight from the source" / "Ask about check-in, pets or cancellations and see the stay's own policy, word for word."
- Progress indicator: 3 bars, active one wider and lavender, others `surface-muted`; animates with the scroll (Reanimated, already installed).

## Design (slide 1)

- Full-bleed photo covering the top ~68% of the screen, behind the status bar (light content status bar is NOT used: design shows dark status text).
- Top row inside safe area, `px-6`: `Logo` (height ~40, ink) left; "Skip" pill right: `h-12 px-5 rounded-full` light glass (`bg-glass`), `button-sm` text.
- Location pill, bottom-left of photo, ~16px above the card: dark translucent pill `h-12 px-4 gap-2 rounded-full`, white `MapPin` (lucide, filled) + white `caption` text, thin white/20% border.
- White card from ~62% down to bottom, top edge is a curve (higher on the left, sweeping down to the right corner) drawn as an SVG path in `surface`, `px-6`:
  - progress bars `h-1.5`, active `w-13`, inactive `w-12`, `gap-3`, `mt-6`
  - heading: new `hero` variant, ExtraBold, `mt-6`
  - body: `body` muted, slightly larger in design (≈17px) → keep `text-body` 16px
  - `Button` primary "Get started" `showArrow`, `mt-6`; `Button` secondary "Continue with Google" with `GoogleIcon`, `mt-3`; bottom safe-area padding.

### Proposed new tokens

- `--text-hero: 36px`, line-height `1.1`, letter-spacing `-1px` + `hero` Text variant (font-jakarta-extrabold).
- `--color-scrim: rgba(11, 11, 26, 0.45)` for the location pill; `colors.surface` already covers the white icon.
- `--spacing` covers everything else. Values estimated from the image: hero size, card curve, photo height, bar widths.

## Out of scope

Clerk, real Google OAuth, auth gating/redirects, persisting "onboarding seen", analytics events, bundled (local) photos.

## Steps

### 1. Tokens

Add `--text-hero` and `--color-scrim` to `global.css`, `hero` variant to `src/components/ui/text.tsx`, preview both in `src/app/design-system.tsx`.

### 2. Onboarding components

`src/components/onboarding/`: `onboarding-slide.tsx` (photo + location pill), `curved-card.tsx` (SVG curve + content), `progress-bars.tsx` (Reanimated, driven by scroll offset shared value), `slides.ts` (data). Third-party views (`Image`, `Animated.View`) sit inside styled `View`s.

### 3. Screen + routes

Rewrite `src/app/index.tsx` as onboarding (header hidden). Add `src/app/(auth)/_layout.tsx` (Stack, headers hidden) and placeholder `sign-in.tsx` / `sign-up.tsx` (Logo, title, "Coming soon" body, back link; sign-in carries the dev design-system link). Wire buttons with `router.push`.

## Verification

- `npx expo lint`, `npx tsc --noEmit` pass; each Unsplash URL returns 200 with `curl -I`.
- On iPhone (Expo Go): slide 1 vs design screenshot, list differences; swipe through 3 slides, bars follow; each button reaches the right placeholder and back works.
- Android: layout not clipped (not tested on device if none available; say so).

## AGENTS.md updates

- Design system: add `hero` text variant and `scrim` color to the token list context (tokens themselves live in `global.css`).
- Note under Expo/Who owns what: onboarding is `src/app/index.tsx`; auth routes live in `src/app/(auth)/`.

## Result

Built as planned. Changes from the plan: slides 2–3 are Krabi, Thailand and Maldives to match the chosen photos; `hero` is 36px (re-measured); the location pill has no border (white/20% border skipped to avoid an untested opacity modifier). The card's top is measured (slide area minus tallest slide text, capped at 58% of screen height) so body text never runs under the buttons. Lint and type check pass; the user confirmed on iPhone that text is clear and all routes work.
