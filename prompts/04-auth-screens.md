# 04 · Auth screens (mocked)

Status: done

## Goal

Guests can move through sign up → email verification → home, and sign in → home, on screens that match the attached sign-up design. All of this works with mocked auth, and the form behaviour (validation, loading, errors, keyboard) is real.

## Decisions

- Auth is mocked behind one module, `src/lib/auth/mock-auth.ts`, which exposes `signUp`, `verifyEmail`, `resendCode`, `signIn` and `signInWithOAuth("google" | "apple")`. These are async calls with a ~800 ms delay and the same shapes as the Clerk custom flow, so swapping in Clerk only touches that file and the screens' calls. There is no stored session, and the app does no gating yet.
- Mock rules, so error states can be tested: the code `000000` fails ("That code isn't right"), and the email `taken@example.com` fails on sign up ("An account with this email already exists"). The password `wrongpass` fails on sign in. Everything else succeeds.
- Routes in `src/app/(auth)/`: `sign-up.tsx`, `verify.tsx` (email passed as a param), and `sign-in.tsx`. `src/app/home.tsx` is a signed-in placeholder (Logo, "You're in", "Sign out" → `router.replace("/sign-in")`). It also holds the dev design-system link, which moves there from the sign-in placeholder.
- Navigation: verify → home and sign in → home use `router.replace` (dismissAll + replace) so Back can't return to the forms. "Sign in" on sign up and "Sign up" on sign in use `router.replace` between the two, so they don't stack up.
- Google and Apple are both kept and mocked, and go straight to home. They become browser OAuth through Clerk later (no native sign-in).
- Verification uses 6 code boxes driven by one hidden `TextInput` (`textContentType="oneTimeCode"`, `autoComplete="one-time-code"`, `keyboardType="number-pad"`). It submits automatically when the 6th digit is entered. "Resend code" has a 30 s cooldown.
- Validation runs in code, on submit and then live once a field has been touched. Full name is required, the email must match a simple pattern, and the password needs at least 8 characters. Errors show as `caption` text in `danger` under the field, and the field border turns `danger`. Server (mock) errors show in the existing `StatusBanner`, if it fits; otherwise they use the same caption style above the button.
- The keyboard: a `ScrollView` with `keyboardShouldPersistTaps="handled"` and `automaticallyAdjustKeyboardInsets` (iOS), plus `KeyboardAvoidingView` behavior `height` on Android. Return keys move to the next field, and the last field submits.
- `TextField` gains an optional `label` prop. With a label, it renders the design's two-line field: the label above the input, both left of the icon, height ~72. Without one it stays as it is, so the search field and other existing uses don't change. It also gains an optional `error` prop.
- The Apple icon is lucide-free: there is no Apple logo in lucide, so it's an SVG brand-mark component `AppleIcon` like `GoogleIcon`, drawn from Apple's published logo path. It's a brand mark, not recreated from the screenshot.

## Design (sign up)

- `bg-surface`, `px-6`, top safe area. Header row: a back button on the left (a 48px circle, `bg-surface` with a `border-border` 1px border, `ChevronLeft` lg) and the `Logo` at height 26 on the right (checked on device). Back goes `router.back()`.
- Title "Create\nyour account": `hero` variant (ExtraBold 36), `mt-8`. Subtitle `body` muted, `mt-3`: "Join roam to save your stays, get personalized recommendations and access them across all your devices."
- Fields, `mt-6 gap-4`: labeled `TextField`s, `bg-surface-muted`, `rounded-card` (the design looks ~20px). There is no visible border at rest, so the rest border is `border-surface-muted` and focus keeps lavender. Icon `lg`, ink, with a left inset of ~16 and a ~24 gap to the text. The label is `button-sm` (medium 15) ink, and the placeholder is `body` muted.
  - User: "Full name" / "e.g. Adrian Hajdin" (`textContentType="name"`)
  - Mail: "Email address" / "you@example.com" (`email-address` keyboard, no autocapitalize)
  - Lock: "Password" / "At least 8 characters", secure, with the eye toggle on the right
- `Button` primary "Create account" `showArrow`, `mt-6`.
- An "or" divider, `my-5`: 1px `border` lines either side, with `caption` muted "or" between them.
- `Button` secondary "Continue with Google" with `GoogleIcon`, then "Continue with Apple" with `AppleIcon`, `gap-3`.
- Footer, centered, `mt-6`, with bottom safe area: `caption` muted "Already have an account?" followed by "Sign in" in `caption` ink, `font-jakarta-bold`, underlined.

**Sign in** (same layout): the title is "Welcome\nback" and the subtitle is "Sign in to see your saved stays and pick up where you left off." It has the Email and Password fields, then "Forgot password?" (`caption`, right-aligned, mocked: an alert saying it's coming soon). The button reads "Sign in", followed by the same divider and social buttons. The footer is "New to roam? Sign up".

**Verify**: the same header. The title is "Check\nyour email", and the subtitle is "We sent a 6-digit code to {email}." with the email in ink. Below that are 6 boxes in a row with equal flex and `gap-2`, each `h-16 rounded-field bg-surface-muted`, a `title`-size digit centered. The active box shows a lavender border and `lavender-soft`, and an error turns the boxes' borders `danger`. Then a `Button` "Verify" with `showArrow`. The resend line reads "Didn't get it? Resend code", or "Resend in 0:24" during the cooldown.

### Tokens

No new tokens: every value maps to the existing ones. These are estimated from the image: the labeled field height (~72), the field radius (`rounded-card`), the logo height, the title spacing and the back-button size.

### Assets

`AppleIcon` (SVG brand mark). The Google G already exists.

## Out of scope

Clerk, real OAuth, sessions/persistence, auth gating and redirects, password reset, analytics events, Android device testing (no device available).

## Steps

### 1. Primitives

- In `src/components/ui/text-field.tsx`, add the optional `label` and `error` props as described. Keep the existing unlabeled rendering exactly as it is.
- In `src/components/ui/apple-icon.tsx`, add the `AppleIcon` brand mark.
- In `src/components/ui/code-input.tsx`, add a 6-box OTP input (`value`, `onChangeText`, `onComplete`, `error`).
- Export them from `index.ts`, and preview the labeled field, the error state, `AppleIcon` and `CodeInput` in `src/app/design-system.tsx`.
- Done when lint and tsc pass and the existing screens are unchanged.

### 2. Shared auth pieces and mock

In `src/components/auth/`, add:

- `auth-header.tsx`: the back circle and the logo.
- `auth-screen.tsx`: the safe-area, scroll and keyboard shell, plus title and subtitle.
- `or-divider.tsx`.
- `social-buttons.tsx`: Google and Apple, calling `signInWithOAuth` and then `router.replace("/home")`, with a loading state per button.

Also add `src/lib/auth/mock-auth.ts` and `src/lib/auth/validation.ts`. Delete `src/components/onboarding/auth-placeholder.tsx` once nothing uses it.

### 3. Screens and routes

Write `sign-up.tsx`, `verify.tsx` and `sign-in.tsx` in `src/app/(auth)/`, plus `src/app/home.tsx`, and wire the navigation as described under Decisions. Onboarding's existing links stay as they are: Get started → sign up, Google/Skip → sign in.

## Verification

- `npx expo lint` and `npx tsc --noEmit` pass.
- On an iPhone in Expo Go:
  - Compare sign up with the design and list the differences.
  - Submit sign up empty to see three errors.
  - Try a bad email, then a 7-character password.
  - Try `taken@example.com` to see the banner.
  - Do a valid sign up, which goes to verify showing the email. Enter `000000` to see the error, then any other code to go to home, where Back doesn't return to the forms.
  - Resend should show the cooldown.
  - Sign in with `wrongpass` to see the error, then with valid details to go to home.
  - Google and Apple should both go to home.
  - The keyboard should never cover the focused field or the button, return keys should move between fields, and the eye toggle should work.
  - Sign in ↔ sign up links should replace each other rather than stack.
- Android: not tested on a device. I'll say so in the report.

## AGENTS.md updates

- Who owns what → Auth: until Clerk lands, auth calls go through `src/lib/auth/mock-auth.ts`. Screens never call Clerk directly elsewhere, so the swap stays in one module.
- Design system: `TextField` has a labeled variant, and `CodeInput` and `AppleIcon` are shared UI.
- Expo: `src/app/home.tsx` is the signed-in placeholder.

## Result

Built as planned. Small additions: an `AuthFooter` component for the "Already have an account? Sign in" row, a `ref` prop on `TextField` (React 19 ref-as-prop) so return keys can move focus, and sign in only checks that a password is present (the 8-character rule is for sign up). The success banner on verify confirms a resend. Lint and type check pass. Not yet checked on iPhone.
