# SavedFeed — Project Context

## The idea

A mobile app that acts as a personal inbox for everything a user saves across the internet — Instagram, Twitter/X, YouTube, Reddit, articles, anything. The problem it solves: people save posts constantly but never go back to them. They forget, get lazy, or can't find what they saved.

The app does four things:
1. Collects saved posts in one place
2. Auto-categorises and organises them using AI
3. Resurfaces them at the right time (like spaced repetition) so the user actually retains the information
4. Later — lets users share saves with friends (social layer)

Primary target users: students and tech/developer folks who save courses, articles, tutorials, and tools but never act on them.

---

## The problem in one line

"Save and forget" — 68% of saved content is never revisited. This app fixes that loop.

---

## Core features (decided so far)

### v1 — what gets built first
- **Universal save inbox** — Android share sheet (user taps "Share → SavedFeed" from any app). Also manual URL paste.
- **AI auto-categorisation** — Tags each save with a category (Technology, AI/ML, Programming, Design, Career, Courses, Science, Business, Finance, Health, Productivity, Entertainment, News) and 2–5 keyword tags. Uses OpenAI gpt-4o-mini.
- **Semantic search** — Search saves by meaning, not just keywords. "That Python tutorial from last month" should just work. Uses OpenAI text-embedding-3-small + pgvector.
- **Daily resurface nudge** — Push notification at 9am: "You saved this 3 weeks ago — 4 min read today?" Uses spaced repetition intervals (1, 3, 7, 14, 30, 60 days).
- **AdMob ads** — Banner ads for free users. Revenue from day one.
- **Basic auth** — Email + password via Supabase.

### v2 — after v1 is stable
- Friend network + post sharing (this is the social/viral layer)
- Curated collections (public or private reading lists)
- Learning analytics (weekly digest, streak, topic breakdown)
- AI summary of any saved article (premium feature)
- Offline reading + export to Notion/PDF (premium)

### Not building
- Web app
- Browser extension (maybe later)
- Instagram/Twitter OAuth (they don't allow saved posts via API)
- Premium paywall (comes after free user base is established)

---

## Tech stack decided

| Layer | Choice |
|---|---|
| Mobile | React Native + Expo SDK 51 |
| Language | TypeScript |
| Navigation | Expo Router (file-based) |
| Backend + DB + Auth | Supabase (Postgres) |
| Vector search | pgvector on Supabase |
| AI categorisation | OpenAI gpt-4o-mini |
| AI embeddings | OpenAI text-embedding-3-small |
| Content/URL scraping | open-graph-scraper or metascraper |
| Push notifications | Expo Notifications + FCM |
| Ads | Google AdMob |
| State management | Zustand |
| Styling | NativeWind (Tailwind for RN) |
| Lists | FlashList (not FlatList) |
| Images | expo-image |

**Important:** OpenAI API key must never go in the React Native bundle. All AI calls go through a Supabase Edge Function called `process-save`.

---

## Database — key tables

**saves** — the core table. Stores: url, title, description, image_url, domain, source_platform, category, tags (array), embedding (vector 1536), resurface logic fields (next_resurface_at, resurface_count, times_viewed), is_archived, is_favourite.

**profiles** — extends Supabase auth.users. Stores: username, display_name, avatar_url.

pgvector is enabled. Row Level Security is on — users only see their own saves. Semantic search runs via a Supabase RPC function that does cosine similarity on the embedding column.

---

## Screens

1. **Home** — "Good morning [name]" + 3 resurface cards for today + recently saved list + AdMob banner
2. **Inbox** — All saves, filterable by category, searchable. Long-press for archive/favourite/delete.
3. **Categories** — Grid of category cards with save counts
4. **Search** — Full-screen semantic + keyword hybrid search
5. **New Save** — Receives share intents + manual URL input. Fetches metadata, shows preview, runs AI, saves.
6. **Save detail** — Full view of a save. "Mark as reviewed" button advances the spaced repetition.
7. **Login / Signup** — Standard email + password auth

---

## Monetisation plan

**Now (v1 launch):** Google AdMob — banner ads on Home, Inbox, and Categories screens. At 10K DAU expect ₹3–5L/month in Indian market.

**Month 6+:** Premium subscription at ₹99–149/month or ₹799/year. Unlocks: AI summaries, offline reading, unlimited saves (free = 500 cap), no ads, advanced analytics.

**Year 2:** Curated newsletter sponsorships — the app knows exactly what topics users save most. Sell sponsorships to ed-tech, dev tools, and course platforms.

Order: Ads first → prove retention → then premium → then sponsorships.

---

## The API access problem (and solution)

Instagram, Twitter/X, and LinkedIn do not allow third-party apps to access a user's saved posts via API. This is the biggest technical constraint.

**Solution for v1:** Android share sheet. User is on Instagram, sees a post they want to save, taps the share button, selects SavedFeed from the list — same as sharing to WhatsApp. The post URL or text is sent to SavedFeed as an Android intent. No API access needed.

**Later:** Reddit, YouTube, and GitHub have open APIs — these can be integrated directly to auto-import saves from those platforms.

---

## Competitive landscape

- **Pocket / Instapaper** — article-only, no AI, no social, aging product. Weak competition.
- **Raindrop.io** — closest rival. Good bookmark manager but no AI resurfacing, no social layer, no spaced repetition.
- **Notion / Obsidian** — too heavy and manual. Not the same audience.
- **Native platform saves** (Instagram saved, Twitter bookmarks) — these are the problem, not the competition. They save but never resurface or organise.

**Our angle:** Raindrop × Duolingo × BeReal. No existing app combines AI resurfacing + social sharing + mobile-native + student-first design.

---

## Roadmap

| Phase | Timeline | Goal |
|---|---|---|
| MVP | Month 1–2 | Save via share sheet, AI tagging, search, 50 beta users from college groups |
| Habit layer | Month 3–4 | Daily nudge, streak mechanic, home resurface cards, AdMob, Play Store launch |
| Social layer | Month 5–8 | Friends, share saves, public collections — viral growth engine |
| Monetisation | Month 9–12 | Premium tier launch, target 1K paying subscribers |

---

## Risks

- **Platform API lockout** (High) — solved by share-sheet approach for v1
- **Retention / habit formation** (High) — the nudge mechanic must feel useful not spammy; study Duolingo's streak design
- **Big Tech clone risk** (Medium) — moat is the cross-platform aggregation + social layer, which Instagram/Twitter won't build because it benefits competitors
- **AI cost at scale** (Medium) — batch categorisation, cache embeddings, use cheaper models for tagging; only run AI once per save

---

## What still needs figuring out

- Exact onboarding flow and how to make the first 3 minutes sticky
- Whether to launch on iOS simultaneously or Android-first
- Specific spaced repetition algorithm tuning based on content type (a meme resurfaces differently than a 10-hour course)
- Growth channel — likely college Discord/WhatsApp communities and tech Twitter/LinkedIn

---

## One-line pitch

SavedFeed is the app that turns your "save and forget" habit into actual learning — one daily nudge at a time.
