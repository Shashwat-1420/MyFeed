# MyFeed — your feed, in your control

A phone-first "save it now, actually learn it later" app. Share a link from Instagram,
YouTube, Reddit or X; **a local LLM running on the phone** categorises it; then spaced-repetition
reminders bring it back at the right time so you retain it instead of forgetting it.

Built for the **iQOO Hackathon 2026 · City Battles** (Reskilll) — phone-first, with a local
open-source model at the core.

> **Track fit:** **OPEN Wildcard** — *"anything outside the tracks, any domain, with a local or open
> source model at the core."* Also a natural fit for **PS 1 · Learning · AI**, since the whole point
> is retention.

---

## The problem

People save posts constantly and never go back to them — **68% of saved content is never revisited**.
Bookmarks, "Saved" folders and watch-laters are where links go to die. MyFeed closes that loop:
capture → understand → resurface.

---

## What's implemented

### 1. Share-to-app (Android share sheet) — ✅ working
Tap **Share → MyFeed** in any app. The URL is delivered to the app, the platform is detected, and the
New Save screen opens with the link already captured. Built on `expo-share-intent` with SEND intent
filters (`text/*`, `image/*`) applied through the config plugin.

### 2. Real link previews — ✅ working
No placeholder text. The app fetches the page and reads its metadata:

- **og:/twitter: card scraping** (`og:title`, `og:description`, `og:image`, `twitter:*`, `<title>`,
  `<meta name="description">`) with HTML-entity decoding and relative-image resolution.
  React Native's `fetch` has **no CORS**, so this runs client-side with no proxy.
- **YouTube oEmbed** for accurate video titles, channel names and thumbnails — YouTube serves
  generic site-level tags to non-browser fetches, so oEmbed is used instead.
- **Slug fallback** (`LLMs-from-scratch` → "LLMs from scratch") and a monochrome placeholder
  thumbnail when a site has no image.
- The sharing app's own `meta.title` is passed through as a hint.

> **Honest limitation:** Instagram and X block non-browser fetches, so those still fall back to the
> slug title. No client-side scraper can reliably beat that.

### 3. On-device AI categorisation — ✅ working (the centrepiece)
A **local LLM runs on the phone** and sorts each save into one of 14 categories with 2–4 tags.

- **Model:** `Qwen2.5-0.5B-Instruct` (8da4w quantised) via **`react-native-executorch`** on the
  **XNNPACK CPU backend**. ~417 MB, downloaded on first launch, then **fully offline**.
- **Nothing leaves the device** — no cloud API, no API keys in the bundle.
- Prompting a 0.5B model is the hard part: it needs a **system prompt + a one-shot example +
  a trailing `JSON:` cue**, and parsing is **tolerant** (strict JSON first, then a scan for a known
  category id/label).
- **Fallback chain:** on-device model → optional Supabase edge function → **keyword classifier**.
  The app always works, even before the model finishes downloading. The result is tagged with which
  engine produced it, and the UI shows **"Categorized on-device · local model, offline"**.

### 4. SM-2 spaced repetition — ✅ working
Not a fixed interval ladder. A real **SM-2** implementation (the algorithm behind Anki) adapts the
next review to how well you recalled the item, with an ease factor floored at 1.3.

Verified on device: reviewing a save moved it **1 → 2 repetitions, 3 → 6 days, ease 2.50 → 2.60**.

### 5. Anki-style local reminders — ✅ working
A real **local notification** at your chosen time — no push server, fires with the app closed.
The text refreshes whenever the save list changes so the due count stays accurate.

- **Profile → Daily Nudge Time** is a working picker (hour + minute); changing it re-schedules the
  reminder.
- **Profile → Send Test Reminder** fires one immediately for demos.

### 6. iQOO yellow / black theme with real dark mode — ✅ working
Monochrome by design: **yellow `#FFC800` / black / white only**, no per-category colours.

- Categories carry **flat lucide icons**, not emoji.
- Chrome is driven by **CSS-variable-backed semantic tokens** (`bg-canvas`, `bg-panel`, `text-ink`,
  `text-gold`, …) applied at runtime through NativeWind's `vars()` — so dark **and** light mode both
  repaint correctly, and no component hardcodes a chrome colour.
- Light mode darkens gold text to `#8A6A00` for contrast.

### 7. Nine screens, fully navigable — ✅ working
Onboarding · Signup · **Home** (review today + recently saved) · **Inbox** (category filters) ·
**Categories** (grid) · **Search** · **New Save** (link + quick note) · **Save Detail** (spaced-repetition
panel, mark reviewed, archive/delete) · **Profile & Settings**.

Native bottom sheets, a floating action button, Android hardware-back handling, and export-via-share-sheet.

---

## How this maps to the iQOO rubric

| Criterion | Weight | Where we stand |
|---|---|---|
| **End product quality** | 30% | Complete loop works on-device: share → scrape → categorise → save → review → resurface. Nine screens, offline-capable, verified on a real phone. |
| **Novelty and impact** | 20% | Attacks a concrete failure ("save and forget"). Privacy-first: the model is local, so no personal reading data ever leaves the phone. Anki-style retention applied to *saved posts*. |
| **Creative phone use** (camera, voice, on-device AI) | 15% | **On-device LLM inference**, the Android share sheet as the capture surface, and local scheduled notifications. ⚠️ **No camera or voice features** — we don't claim that part. |
| **Technical depth** | 15% | Expo SDK 57 / RN 0.86 / New Architecture, a native ExecuTorch C++ module, `minSdk 26`, NativeWind theming via runtime CSS variables, SM-2, CORS-free og: scraping with oEmbed, and a diagnosed NativeWind runtime-className CPU-spin/leak (documented in `AGENTS.md`). |
| **Office Kit usage** | 10% | ⚠️ **Not used.** We built and demoed directly on the phone; we're not claiming phone↔laptop bridge time. |
| **Demo and presentation** | 10% | A standalone **release APK** sideloads onto the iQOO and runs with no laptop and no dev server. |

We'd rather state the gaps plainly than overclaim: the two soft spots are **camera/voice** (15%) and
**Office Kit** (10%).

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Expo SDK 57 + React Native 0.86 + React 19.2, New Architecture |
| Language | TypeScript (strict) |
| Styling | NativeWind 4 (Tailwind for RN) + runtime CSS variables |
| State | Zustand (store-driven navigation, no router) |
| On-device AI | `react-native-executorch` + Qwen2.5-0.5B-Instruct (8da4w) |
| Icons | `lucide-react-native` |
| Notifications | `expo-notifications` (local, offline) |
| Share intent | `expo-share-intent` |
| Optional backend | Supabase (Postgres + pgvector + edge function) — **not required** |

---

## Build & run

```bash
npm install                 # deps
npx tsc --noEmit            # typecheck (the reliable gate)

npx expo start              # dev server
npx expo run:android --device   # build + install on a USB phone (first build is slow)

cd android && ./gradlew assembleRelease   # standalone demo APK
# -> android/app/build/outputs/apk/release/app-release.apk
```

**Notes**

- The release APK embeds the JS bundle, so it runs **standalone** — no Metro, no laptop. It's signed
  with the debug keystore (fine for sideloading, not Play-Store-ready).
- **First launch needs network**: the ~417 MB model downloads once, then the app is fully offline.
- Supabase is optional and off by default. Add `EXPO_PUBLIC_SUPABASE_URL` /
  `EXPO_PUBLIC_SUPABASE_ANON_KEY` to a `.env` to enable the edge-function path.
- Full engineering notes, decisions and gotchas live in **[`AGENTS.md`](./AGENTS.md)**.

---

## Project layout

```
index.ts                    # Expo entry
src/
  App.tsx                   # root: theme vars, navigation, share-intent, model + reminder sync
  views/                    # 9 screens
  components/{common,navigation,saves}/
  lib/
    localModel.ts           # on-device LLM session + prompt/parse
    aiAdapter.ts            # on-device → edge → keyword fallback chain
    scraper.ts              # og:/twitter: scraping + YouTube oEmbed
    resurface.ts            # SM-2
    notifications.ts        # local reminder scheduling
    theme.ts                # semantic tokens (dark/light) + resolved hexes for icons
    categories.ts           # 14 categories, icon + label
  store/useSavedFeedStore.ts
```

---

## Roadmap / known gaps

- **NPU acceleration** — inference is currently CPU (XNNPACK). Qualcomm Hexagon / MediaTek APU
  offload needs a vendor-specific backend; it's a stretch, not a claim.
- **Instagram / X previews** — blocked by their bot protection; falls back to slug titles.
- **Semantic search** — search is keyword-based today; on-device embeddings would make it semantic.
- **Camera / voice capture** — not implemented (would help the "creative phone use" score).
- **Social layer** — sharing saves with friends was in the original concept, not built.

---

## Why it matters

MyFeed turns "save and forget" into actual learning — one nudge at a time, with the intelligence
running on the phone you already hold.
