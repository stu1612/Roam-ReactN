# Roam

Expo React Native rental app. Guests describe a stay in one sentence ("quiet pet friendly cabin with a hot tub under $300 a night") and get ranked stays back. They can also ask booking and policy questions about a stay, answered with exact text from Roam's own content.

This file is the project's memory: it holds every decision that is still true. Plans in `prompts/` are history.

## Commands

```bash
npx expo install <package>  # ALWAYS use instead of npm install: resolves SDK-compatible versions
npx expo start              # dev server (scan the QR code with the iPhone camera to open in Expo Go)
npx expo lint               # lint
npx tsc --noEmit            # type check
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npx eas-cli@latest <cmd>    # EAS builds, submits, and updates (use instead of bare `eas`)
```

## Expo

- Expo ships breaking changes every SDK release, so don't trust memory. Before touching an Expo, EAS, or React Native API, check the `expo` major version in `package.json` and read `https://docs.expo.dev/versions/v<major>.0.0/`. For anything else, start from https://docs.expo.dev/llms.txt and follow its links.
- Routes live in `src/app/`: every file is a screen and `_layout.tsx` files define navigators. Onboarding is `src/app/index.tsx`; auth screens (sign-up, verify, sign-in) live in `src/app/(auth)/`; `src/app/home.tsx` is the signed-in placeholder. API routes are `src/app/api/*+api.ts`. Keep components, hooks, and utils outside `src/app/`.
- `ios/` and `android/` are generated. Never create or edit them by hand; configure native behavior in `app.json` and config plugins.
- Target iPhone first, but keep everything working on Android too: no iOS-only APIs without an Android fallback.
- The app runs in Expo Go, which only includes its bundled native modules. Only use libraries Expo Go supports. If a feature truly needs native code outside Expo Go, ask before adding it, because it means switching to a development build (`npx eas-cli@latest build --profile development`). The user has an Expo account for EAS.

## Who owns what

Each tool has one job. Ask before moving a responsibility to a different tool.

- **Auth:** Clerk is the source of truth. The app keeps its own custom auth screens. Set Clerk up through the Clerk CLI and use the Clerk MCP for current Expo patterns. Use `@clerk/expo` custom flows (works in Expo Go, supports Expo SDK 54–58). Don't use Clerk's native components or native Google/Apple sign-in: they need a development build. Browser-based OAuth through `expo-auth-session` is fine. Screens use the method-based custom-flow API (`useSignUp`/`useSignIn`, `{ error }` results, `finalize()`), never the legacy `setActive`/`prepareFirstFactor` API. `verify.tsx` confirms both sign-up emails and new-device sign-ins (device trust) by email code, chosen by its `flow` param. Google uses `useSSO` (`src/lib/auth/use-google-sign-in.ts`); Apple is "coming soon". Route access is set only by `Stack.Protected` in the root layout (`home`, `design-system` signed in; `index`, `(auth)` signed out). Screens never navigate after auth, the guards do. Keep Clerk's password minimum equal to `MIN_PASSWORD` in `validation.ts`.
- **Content:** Sanity (properties, hosts, policies, house rules). Studio is a standalone app in `studio/`. Schema deploys and content changes go through the Sanity MCP, and generated property copy uses Agent Actions.
- **Exact constraints** (price, guests, type, amenities, pets, place): GROQ filters, with values always passed as params.
- **Soft intent** (quiet, cozy, secluded): Dataset Embeddings via `text::semanticSimilarity()` inside `score()`.
- **Policy knowledge:** a Sanity Context endpoint in Knowledge Base mode. Context endpoints are created in the Dashboard's Context app and read with an organization token (Context Viewer), per https://www.sanity.io/docs/ai/context-migration-guide. One endpoint serves one mode. The Context skill still describes `sanity.agentContext` Studio documents with a project token; that route is deprecated, so don't use it.
- **Typed decisions** (which stay topics and policies answer a question): Jev, called from API routes through the AI SDK's `experimental_evaluate` with the `@ai-sdk/typesafe-ai` provider and `TYPESAFE_AI_API_KEY`. No Vercel AI Gateway. Keep `ai` and `@ai-sdk/typesafe-ai` pinned to exact versions, since the API is experimental.
- **Answer text:** none generated. Answers show the stay's own fields and policy text word for word, with their source. No LLM runs in the app.
- **Styling:** NativeWind v5 (Tailwind CSS v4) with `className`. It's a release candidate: keep `nativewind`, `react-native-css`, `tailwindcss`, `@tailwindcss/postcss` and `lightningcss` pinned to exact versions, keep the `lightningcss` override in `package.json`, and only change them by following the NativeWind v5 docs (https://www.nativewind.dev/v5/llms.txt). Tokens and components: see Design system.
- **Analytics:** PostHog, identified through Clerk. Use `posthog-react-native` with its Expo modules only (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`). Events, autocapture, feature flags and JS error tracking work in Expo Go. Don't add `@posthog/react-native-plugin` (session replay, native crash capture, push): it needs a development build.

## Design system

- Tokens (colors, fonts, type ramp, radii, shadows, `--spacing: 4px`) live only in `global.css` `@theme`. `src/constants/theme.ts` mirrors just the values that can't go through `className` (icon colors/sizes, motion). No hex, `fontSize` or `fontWeight` anywhere else; new values become tokens first. Light mode only for now.
- Font: Plus Jakarta Sans 400/500/700/800 via `@expo-google-fonts/plus-jakarta-sans`, loaded in the root layout. Pick weight with `font-jakarta` / `-medium` / `-bold` / `-extrabold`, never `fontWeight` or Tailwind's `font-bold` (weight utilities). Type-ramp line heights are unitless ratios: react-native-css multiplies them by font size, so `34px` would become 34×.
- Icons: `lucide-react-native`, stroke 2, sizes from `iconSize`. Brand marks (Google G, Apple) are SVG components.
- Shared UI lives in `src/components/ui/` (import from `@/components/ui`). Use these before writing new styled views. Text always goes through `Text` with a `variant`. Forms use `TextField` (`label` for the two-line auth style, `error` for messages) and `CodeInput` for one-time codes.
- Third-party views that ignore `className` (`expo-image`, `GlassView`, `Animated.View`) sit inside a styled `View`.
- Preview every new primitive in `src/app/design-system.tsx` (dev-only, linked from home).

## Rules

- Secret keys (Clerk secret key, TypeSafe key, Sanity organization token, Sanity write token) never reach the app bundle. Use them only in API routes and local scripts such as seeding. Never put them behind `EXPO_PUBLIC_`, which is bundled into the app. Never commit `.env`. Keep variable names, without values, in `.env.example`.
- Sanity Context needs a deployed Studio for the dataset. Redeploy Studio from `studio/` after schema changes.
- Jev is not an agent. It answers typed questions (Choice, Noul, Score) with probabilities. It never writes GROQ, calls tools, or generates text. Code builds queries from its answers.
- Prices, guest counts, and dates are parsed in code. Jev may choose between candidates code found, but never produces the value.
- Embeddings rank, they don't filter, and they only see the document itself (no references). Hard constraints are always GROQ filters, and text that should affect ranking lives on the property document.
- Policy answers show only text from the stay's data and Roam's policies, word for word. If nothing answers the question, say so and point to support.
- API routes verify the Clerk session before doing any work.
- PostHog failures never block the app. Never send what guests type, tokens, or personal data in events.
- Let Sanity generate document IDs. Model relationships as references.
- Ask before adding a dependency or service, changing the Sanity schema once content exists, or deleting data. Prefer Expo modules over third-party libraries.
- Whenever you need input from the user, ask through your tool's built-in question panel so they pick from options instead of typing. Give two to four clear options with the recommended one first. Fall back to plain text only if no such panel exists.

## How we build features

For a new feature or a change across several files. Small fixes and questions skip this.

1. **Understand.** Read the code involved. Open an earlier plan only if this feature builds directly on it (pick by file name). Read the current docs pages for the APIs you'll use, and load a matching skill if one exists (e.g. the Expo, Clerk, Sanity, Sanity Context, or TypeSafe skills). Don't write version-specific APIs from memory.
2. **Ask.** If a real decision is unclear (scope, visible behavior, data shape), ask in the question panel, batching questions into one round and following up only if the answers raise new ones. Pick defaults for the rest and list them. If a decision in this file looks wrong, raise it instead of changing it.
3. **Plan.** Copy `prompts/TEMPLATE.md` to `prompts/NN-feature-name.md` (next number) and fill it in. The plan must be self-contained, so a fresh session can build it from this file plus the plan alone.
4. **IMPORTANT: stop and wait.** Write no app code until the user approves the plan. Ask for approval in the question panel (approve, or request changes). If they request changes, update the plan and ask again. On approval, set `Status: approved`.
5. **Build** step by step, checking each one. If a step turns out wrong, stop and explain instead of redesigning.
6. **Close out.**
   - Run the plan's Verification and give the report described under Reporting.
   - Add a short `## Result` to the plan and set `Status: done`.
   - Update this file: put each lasting decision in the section it belongs to. Replace or remove rules that are no longer true instead of appending. Keep this file under 150 lines.

## Building from designs

Designs are attached in the chat. Screens must match them exactly: layout, spacing, sizes, colors, type, radii, icons, and copy.

- Icons, fonts, and brand images come from `assets/` or the chosen icon library, never recreated from a screenshot. Sample property photos may be remote placeholder images. If an asset is missing, use a marked placeholder and list it.
- Map every color, font, spacing value, and radius to a design-system token. List values with no token in the plan as proposed new tokens instead of hardcoding them. When creating the design system itself, derive the tokens from the designs.
- UI plans describe the design (elements, states, tokens, assets) well enough to build without the image. If building in a new session, ask for the design to be attached again.
- After building, the user checks the screen on their iPhone in Expo Go and sends a screenshot (there is no iOS simulator: the Mac runs macOS 12, which can't run an Xcode new enough for this SDK). Compare the screenshot with the design, list every difference, fix, and repeat. Report which values were estimated from an image.

## Reporting

End every piece of work that changes code (features and fixes, not answers to questions) with this report. Use these headings in this order, and leave out any section that would be empty.

- **Done:** one line on the outcome, then the files changed and what changed in each.
- **Verified:** each check with ✅ or ❌ and its evidence (command output, screenshot). List what wasn't checked as ❌ with the reason. Never mark something ✅ without running it.
- **You need to:** numbered actions only the user can take, such as keys, dashboard settings, manual steps in Sanity, or assets to provide.
- **Test it yourself:** numbered steps to reproduce the result from a fresh start, ending with `Expected:` and what the user should see.
- **Notes:** defaults picked, trade-offs, and anything left for later.

## Checks

- Lint and type check pass before any task is called done.
- Screens that load data handle loading, error, and empty states.
- AI features are tried against realistic inputs, and failures are explained by cause: missing data, the decision Jev made, the query, or the code.
