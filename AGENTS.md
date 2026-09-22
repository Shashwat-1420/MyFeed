# AGENTS.md — MyFeed / SavedFeed

Guidance for AI agents (and humans) working in this repo. Read this before changing code.

---

## 1. What this project is

A "save-it-now, resurface-it-later" read-later / second-brain app: share a link from
Instagram / YouTube / Reddit / X, it gets scraped, AI-categorized, and then resurfaced on a
spaced-repetition schedule so you actually retain what you save.

It is an entry for the **iQOO hackathon** (Reskilll platform), with two deadlines that drive
all sequencing:

| Date | Event | Notes |
|---|---|---|
| **2026-09-22 (today)** | Reskilll platform submission | Repo + demo must be pushed |
| **2026-09-26/27** | Hyderabad City Battle demo | Loaner iQOO phone handed at check-in — sideload dev APK there |
| **2026-10-09/11** | Finale (per original plan) | |

The iQOO judging rubric (extracted from the official guide): **End product 30% · Novelty 20% ·
Creative phone use 15% · Technical depth 15% · Office Kit 10% · Demo 10%**. The guide explicitly
rewards **a local or open-source model at the core** and **on-device / NPU usage** (Snapdragon
NPU targets mentioned: Sarvam, Gemma, Phi). Phone-first; native Android / Flutter / React Native /
PWA are all allowed stacks.

**Implication: on-device local AI categorization is the single highest-value feature for scoring.**

---

## 2. Current state of the repo

- **Stack today:** Vite + React 18 + TypeScript + Tailwind + Zustand. Mobile-framed web prototype.
- **Entry:** `index.html` → `src/main.tsx` → `src/App.tsx`. Views live in `src/views/`,
  components in `src/components/{common,navigation,saves}/`.
- **State:** `src/store/useSavedFeedStore.ts` (Zustand) is the single source of truth. Store-driven
  navigation — there is **no router**; `currentTab` + `currentScreen` in the store decide what renders.
- **Backend:** `supabase/` holds `schema.sql` (RLS, pgvector, `match_saves` RPC) and an edge
  function `process-save`. Long-term the pgvector path is replaced by on-device embeddings.
- **Mock-first:** `src/lib/scraper.ts` (fake og: fetch) and `src/lib/aiAdapter.ts` (keyword
  categorizer) run without any backend. `src/lib/resurface.ts` holds the interval ladder.

### Commands
```bash
npm install              # esbuild postinstall is blocked by allowScripts; run:
                         #   npm install-scripts approve esbuild   (already done, recorded in package.json)
npm run dev              # Vite dev server
npx tsc --noEmit         # typecheck (the reliable gate)
npm run build            # = tsc && vite build
npm run lint             # BROKEN — script exists but eslint is not installed and there is no
                         # eslint config. Do not treat a lint failure as a regression; use tsc.
```

### Known repo quirks
- `npm run lint` is broken (see above). Do not "fix" it by installing eslint unless asked.
- `app.json` contains **stale Expo artifacts** (an old Expo config with SEND intent filters). Expo
  is **not** installed in `package.json`. This is intentional leftovers from the original plan —
  it will be *reused* in Phase B, not deleted. Commands like `npx expo …` / `eas build` do not work yet.
- `savedfeed_final_implementation_plan.md`, `savedfeed_design_report_antigravity.md`, and
  `savedfeed_project_context (1).md` are **planning docs, not truth** — trust `package.json` and
  the actual source over them.

---

## 3. The agreed roadmap (Phases A → B → C)

The decision is to **convert this Vite web app into an Expo / React Native Android app** and then
layer the differentiating features. The web app is *replaced*, not kept in parallel.

### Phase A — pre-submission web fixes — ✅ DONE (2026-09-22)

Goal: a presentable, correctly-themed, green-building web app to submit today.

1. **Fixed dark mode.** Root cause: `toggleDarkMode` flipped `dark` / `light-mode` classes on
   `<html>`, but **no component used `dark:` variants or the `var(--bg-*)` variables** — every color
   was a hardcoded hex, so toggling did nothing.
   - Converted to **CSS-variable-backed semantic Tailwind tokens** (RGB-triplet form so opacity
     modifiers like `bg-panel/90` work):
     `bg-canvas` `bg-panel` `bg-chip` · `text-ink` `text-muted` `text-dim` · `border-edge` · `text-gold`
   - Defined in `tailwind.config.js` (`colors`) reading `--bg-primary`, `--bg-secondary`,
     `--bg-tertiary`, `--border-strong`, `--text-primary/secondary/tertiary`,
     `--accent-fill`, `--accent-ink` from `src/index.css`.
   - Dark values on `:root`, light values on `.light-mode` (set by `toggleDarkMode`).
   - `text-gold` maps to `--accent-ink`, which is **darkened to `#7A5804` in light mode** so gold
     text stays readable on a light background. Gold **fills** stay literal `#F0B31C` + `text-black`
     (correct in both modes).
   - `.glass-iqoo`, `.glow-iqoo*`, scrollbars and shimmer now follow the vars (shimmer has an
     explicit `.light-mode` variant).
2. **iQOO yellow/black theme sweep.** Removed all ~22 leftover indigo `#7C6EF6` / `#9585F8`
   references (Onboarding, Signup, Profile, confetti colors, onboarding gradients, share button) →
   gold `#F0B31C` / `#FFCB14`.
3. **Contrast pass:** white-on-gold buttons → `text-black`; `text-white` on panel backgrounds → `text-ink`.
4. **Added missing keyframes** `fadeIn` / `bounceIn` (classes `animate-fadeIn` / `animate-bounceIn`
   were used all over but never defined — silent no-ops).
5. **Kept intentional colors:** category colors in `src/lib/categories.ts`, status colors
   (green/red/amber), platform colors (IG/YT/Reddit/X), light-mode palette, `#F0B31C` brand.
6. **Verified:** `npx tsc --noEmit` → 0, `npm run build` → 0.

> **Rule going forward:** for chrome (bg/border/text), use the semantic tokens, never a raw hex.
> Raw hex is allowed only for: category colors, status/danger colors, brand gold fills, light-mode palette.

### Phase B — Expo conversion — ⬜ TODO

- Scaffold **Expo SDK 54/55 + React Native + NativeWind** **in this same repo** (replace the Vite
  app; do not create a sibling directory). Use `create-expo-app` and reconcile into the existing tree.
- NativeWind config mirrors the existing `tailwind.config.js` tokens (`iqoo.*`, `dark.*`, `light.*`, fonts).
- Port state: `src/store/useSavedFeedStore.ts` ports to RN nearly as-is (Zustand works on RN).
- Port views: `div` → `View`, `Text` stays, `lucide-react` → `lucide-react-native`. **Drop
  `MobileFrame`** (web-only desktop preview chrome). Keep the `AdBanner` mock.
- `lucide-react-native` icons; images via `expo-image` or RN `Image`.
- Add **`expo-share-intent`** with the SEND intent filters already sketched in `app.json`
  (this is why Expo Go alone won't do — see below).
- Add **`expo-notifications`**.
- First local build: `npx expo run:android --device` (requires Android SDK + phone on USB debugging).

### Phase C — differentiating features, in value order — ⬜ TODO

1. **Share-to-app** (YouTube / Twitter-X / Instagram share sheet → app). Real og: scraping in
   `src/lib/scraper.ts` — RN's `fetch` has **no CORS**, so it replaces the mock directly.
   Needs `expo-share-intent` (dev build required).
2. **On-device AI categorization** — highest rubric value. Use **`react-native-executorch`**
   (needs New Architecture, RN 0.81+, Expo SDK 54+) **or** `llama.rn`, with a quantized small model
   (SmolLM2 / Gemma-2B class). **Keep the existing keyword fallback in `aiAdapter.ts`.**
   Other local-AI value-adds discussed: on-device embeddings for semantic search (replacing
   pgvector), resurface scheduling prediction, title/description summarization.
3. **Anki-style spaced-repetition notifications** — upgrade `src/lib/resurface.ts` from the fixed
   ladder `[1,3,7,14,30,60]d` to **SM-2**, and fire local notifications via `expo-notifications`.
   (Local notifications work in dev builds.)
4. **Reading UX without WebView memory cost** — do **not** embed a persistent WebView. Show the
   cached/extracted content in-app; to open the original, **deep-link to the platform app first,
   fall back to Chrome Custom Tab** via `expo-web-browser`.
5. **Stretch: usage-stats-driven suggestions** ("Android intelligence") — only if time permits,
   via Android usage-stats access.

### Architecture decisions already made (do not re-litigate)

- **Dev build (not stock Expo Go)** — Expo Go cannot receive share intents, run local models, or
  read usage stats. QR workflow of Expo Go is preserved via the dev build.
- **Expo + React Native + NativeWind** (matches the original plan doc).
- **Replace** the web app rather than keeping both.
- **Local model via `react-native-executorch` or `llama.rn`**; keyword fallback retained.
- **SM-2** upgrade of `resurface.ts` for notifications.
- **No persistent WebView**; deep link → Custom Tab fallback.

---

## 4. Environment / setup notes

- **No Android SDK installed yet** (`ANDROID_HOME` unset, no `adb`). Java 21 and Node present.
  Needed before Phase B's `expo run:android`. Two options were offered, **user has not picked yet**:
  - Android Studio (GUI), or
  - headless: `sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0"` + export
    `ANDROID_HOME` in `~/.zshrc`.
- **Phone with USB debugging must be connected** for the first local build.
- EAS account / local-build path status unknown.
- The demo phone is a **loaner iQOO handed at Hyderabad check-in (Sep 26–27)** — sideload the dev
  APK there; don't plan on the reviewer having this repo.

---

## 5. House rules for agents

- **Scope:** do exactly what was asked (a phase, a fix). Don't refactor unrelated code.
- **Match surrounding style.** This codebase is Tailwind-classed, store-driven, mock-first.
- **Verify before claiming done:** `npx tsc --noEmit` and `npm run build` must both pass.
  Do not rely on `npm run lint` (broken, see above).
- **Theme:** use the semantic tokens (`bg-canvas`/`bg-panel`/`bg-chip`/`text-ink`/`text-muted`/
  `text-dim`/`border-edge`/`text-gold`), not hex literals, for chrome.
- **Dark + light both matter.** Any new surface/text color must work in both modes — add a var
  override if you introduce a new token.
- **Planning docs are stale; source is truth.**
- The web app is being replaced by the RN port — avoid large new investments in Vite-only code.
