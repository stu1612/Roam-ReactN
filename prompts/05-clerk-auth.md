# 05 · Clerk auth

Status: done

## Goal

Guests sign up with name, email and password, then confirm their email with a 6-digit code. They sign in with email and password, or with Google. Sessions survive app restarts, signed-out guests can't reach `/home`, and signed-in guests skip onboarding and the auth screens. Sign out works. All of this runs in Expo Go, on the existing custom screens.

## Decisions

- `@clerk/expo` 4.14 (installed) uses the current method-based custom-flow API: `useSignUp()`/`useSignIn()` return `{ signUp|signIn, errors, fetchStatus }`, and every method resolves to `{ error }`. A complete attempt becomes the active session through `finalize({ navigate })`. Don't use the legacy API (`prepareFirstFactor`/`setActive`) or `useOAuth`.
- Dev instance `roam` (`app_3L2pmz6FyvmVnWLdxBhG3FKqJnV`). Already set: email required with `email_code` verification, password required, Google enabled, captcha off, sessions last up to 7 days, and device trust on.
- Clerk config changes, made through the Clerk MCP with a dry run first: password `min_length` 15 → 8 to match `validation.ts`; enable first and last name (both optional) in `user_model`.
- Full name is split at the first space: `firstName` gets the first word, `lastName` the rest (or none).
- `src/lib/auth/mock-auth.ts` is deleted. `src/lib/auth/clerk-errors.ts` maps a Clerk error to one friendly message (the first error's `longMessage`/`message`, else "Something went wrong. Please try again."). Screens keep their own validation, loading states and `StatusBanner`.
- Sign up: `signUp.password({ emailAddress, password, firstName, lastName })` → `signUp.verifications.sendEmailCode()` → push `/verify?email=…&flow=sign-up`. The screen renders `<View nativeID="clerk-captcha" />`.
- Sign in: `signIn.password({ emailAddress, password })`. On `complete`, finalize. On `needs_client_trust` or `needs_second_factor` with an email-code factor, run `signIn.mfa.sendEmailCode()` → push `/verify?email=…&flow=sign-in`. Any other status shows a generic error.
- Verify serves both flows, chosen by the `flow` param. Sign-up uses `signUp.verifications.verifyEmailCode({ code })` and resend `sendEmailCode()`. Sign-in uses `signIn.mfa.verifyEmailCode({ code })` and resend `signIn.mfa.sendEmailCode()`. On `complete` it finalizes. Wrong codes show Clerk's message in the banner.
- Navigation after finalize: `navigate` callback does `router.replace("/home")`, after `dismissAll` if possible. A `session.currentTask` isn't expected with this config; if it ever happens, show a generic error.
- Protected routes use layout guards, without moving files:
  - Root layout reads `useAuth()`. While `!isLoaded` the splash screen stays up, so nothing flashes.
  - It wraps screens in `Stack.Protected`: `guard={isSignedIn}` for `home` and `design-system`, and `guard={!isSignedIn}` for `index` and `(auth)`. Expo Router then redirects on its own, both at startup and when the auth state changes (sign out → onboarding).
  - Fallback if `Stack.Protected` isn't in this SDK's expo-router: `<Redirect>` guards in `(auth)/_layout.tsx` plus inline guards in `index.tsx` and `home.tsx`.
- Persistent sessions: `tokenCache` from `@clerk/expo/token-cache`, already on the provider. It needs `expo-secure-store`, which isn't installed yet, so sessions don't currently survive a restart.
- Sign out: home calls `useClerk().signOut()`. The guard then sends the guest to onboarding. Home shows the signed-in email instead of "Sign-in is mocked".
- Google: `useSSO().startSSOFlow({ strategy: "oauth_google", redirectUrl: AuthSession.makeRedirectUri() })`. If it returns `createdSessionId`, call `setActive({ session })`, which is correct for SSO. A cancelled browser is a no-op with no error. The screen calls `WebBrowser.warmUpAsync` on mount and `coolDownAsync` on unmount, per Clerk's Expo docs. Onboarding's "Continue with Google" also runs the SSO flow instead of opening sign-in. Apple shows a "Coming soon" alert because Apple isn't enabled in Clerk and native Apple sign-in needs a development build.
- "Forgot password?" keeps its "coming soon" alert.
- New dependencies (approving this plan approves them), installed with `npx expo install`: `expo-secure-store` (token cache), `expo-auth-session` and `expo-crypto` (`useSSO`). All three are in Expo Go.
- The existing env key `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local` stays. `CLERK_SECRET_KEY` is unused by the app (API routes come later).

## Out of scope

Password reset, Apple sign-in, MFA beyond the email code for device trust, the user profile, verifying sessions in API routes, PostHog identify, and production instance.

## Steps

### 1. Clerk config and dependencies

Through the Clerk MCP, dry-run then apply: `auth_password.min_length: 8` and `user_model.first_name/last_name: { enabled: true, required: false }`. Then run `npx expo install expo-secure-store expo-auth-session expo-crypto`, and add plugins to `app.json` if expo-doctor asks for them. Done when `get_instance_config` shows the change and `npx expo-doctor` passes.

### 2. Error helper and SSO

Add `src/lib/auth/clerk-errors.ts`. Rewrite `src/components/auth/social-buttons.tsx` to use `useSSO` for Google, with Apple showing an alert. Add a small `useGoogleSignIn` hook in `src/lib/auth/` that both social-buttons and onboarding use.

### 3. Screens

Swap the mock calls in `sign-up.tsx`, `sign-in.tsx` and `verify.tsx` as described under Decisions. Delete `mock-auth.ts`.

### 4. Guards and sign out

Root layout: `useAuth`, keep the splash screen up until fonts and Clerk are loaded, and add the `Stack.Protected` groups. Home: real `signOut` and the user's email. Done when tsc and lint pass.

## Verification

- `npx tsc --noEmit`, `npx expo lint` and `npx expo-doctor` pass.
- On iPhone in Expo Go (the user runs it):
  - Sign up with a new email. You receive a code, a wrong code shows an error, the right code goes to home, and the user appears in the Clerk dashboard (checked with MCP `list_users`) with a first and last name.
  - Sign up with an existing email shows Clerk's error. A 7-character password is blocked in the app.
  - Kill and reopen the app: it opens on home without passing through onboarding.
  - Sign out goes to onboarding. Opening `/home` by back gesture or deep link isn't possible.
  - Sign in with the right password goes to home, or to the code step on a new device first. A wrong password shows an error.
  - Google on sign-in and on onboarding opens the browser and lands on home. Cancelling does nothing.

## AGENTS.md updates

- Who owns what → Auth: replace the "mocked in mock-auth.ts" sentence with: Auth uses Clerk custom flows (`useSignUp`/`useSignIn` method API, `finalize`). Email codes verify sign-up and new-device sign-in on one screen. Google uses `useSSO`. Route access is controlled by `Stack.Protected` in the root layout.
- Expo → routes: note that `home` and `design-system` are signed-in only and that `index` and `(auth)` are signed-out only.

## Result

Built as planned. Clerk dev config patched (password min 8, first/last name on). Added expo-secure-store, expo-auth-session and expo-crypto. One change from the plan: screens don't navigate in `finalize`'s callback, because it runs before the session is active (while `home` is still guarded). `Stack.Protected` redirects on its own instead. tsc, lint and expo-doctor pass. The device checks are still pending.
