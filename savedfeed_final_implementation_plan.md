# SavedFeed — Final Implementation Plan

SavedFeed is a mobile "second brain" app that eliminates the save-and-forget cycle. It collects saved posts from any platform via Android share sheet, uses a **pluggable AI model system** (provider and model swappable at runtime via admin config) to auto-categorise and generate vector embeddings for semantic search, and resurfaces saved items using spaced repetition intervals (1, 3, 7, 14, 30, 60 days).

This plan covers 8 screens, 9 user flows, full design system, gestures, animations, and backend architecture.

---

## Architecture Decisions — Confirmed

1. **Framework**: React Native + Expo SDK 51, Expo Router (file-based), TypeScript, Zustand, NativeWind/Tailwind, `expo-image`, `@shopify/flash-list`.
2. **Backend**: Supabase — Postgres + pgvector + Auth + Edge Functions. All AI API keys stay server-side inside Edge Functions. Never bundled into the app.
3. **AI System**: Pluggable adapter — provider and model are runtime config values stored in `app_config` DB table. No hardcoded model names anywhere in app code. Admin can swap provider/model without redeployment.
4. **Share Handling**: Android intent filters in `app.json` capture URLs shared from Instagram, YouTube, Reddit etc. Pre-fills the New Save screen.
5. **Dual Mode**: Full offline mock dataset mode for prototype demo. App runs all 9 flows without live credentials. When `.env` is populated, it switches to live Supabase + AI automatically.

---

## Open Questions — Answered

**Q1 — Credentials**: Default to full mock simulation mode. When `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are present in `.env`, switch to live Supabase. AI calls always go through Edge Functions — no AI keys needed on client side.

**Q2 — Viewport**: Yes, include an in-browser mobile container frame (390×844px, device chrome) when running on desktop web preview so reviewers see it as a phone screen.

---

## Project File Structure — Complete

```
savedfeed/
├── app/
│   ├── _layout.tsx                        # Root layout — theme, auth guard, safe area
│   ├── (auth)/
│   │   ├── onboarding.tsx                 # 3-slide carousel
│   │   ├── login.tsx                      # Email + password login
│   │   └── signup.tsx                     # Email + password signup
│   ├── (tabs)/
│   │   ├── _layout.tsx                    # Bottom tab navigator (4 tabs only)
│   │   ├── index.tsx                      # Home screen
│   │   ├── inbox.tsx                      # Inbox screen
│   │   ├── categories.tsx                 # Categories grid
│   │   └── search.tsx                     # Search screen
│   ├── save/
│   │   ├── new.tsx                        # New Save + share intent receiver
│   │   └── [id].tsx                       # Save Detail
│   └── profile.tsx                        # Profile & Settings — stack screen, NOT a tab
├── src/
│   ├── types/
│   │   └── savedfeed.ts                   # All TypeScript interfaces
│   ├── lib/
│   │   ├── supabase.ts                    # Supabase client (uses env vars)
│   │   ├── aiAdapter.ts                   # Pluggable AI adapter — reads provider from config
│   │   ├── scraper.ts                     # URL → OpenGraph metadata fetcher
│   │   ├── resurface.ts                   # Spaced repetition interval calculator
│   │   ├── notifications.ts               # Push notification registration + scheduling
│   │   └── categories.ts                  # 14 category definitions (label, emoji, colour)
│   ├── store/
│   │   └── useSavedFeedStore.ts           # Zustand store — saves, filters, theme, notification
│   ├── hooks/
│   │   ├── useSaves.ts                    # Saves CRUD + Supabase sync
│   │   ├── useSearch.ts                   # Keyword + semantic search
│   │   ├── useAuth.ts                     # Auth state + session
│   │   └── useTheme.ts                    # Dark/light mode toggle + persistence
│   ├── components/
│   │   ├── saves/
│   │   │   ├── SaveCard.tsx               # Reusable card for Inbox + Home lists
│   │   │   └── ResurfaceCard.tsx          # 260×160 swipeable resurface card
│   │   ├── common/
│   │   │   ├── CategoryBadge.tsx          # Coloured pill badge per category
│   │   │   ├── SkeletonLoader.tsx         # Shimmer skeleton for any loading state
│   │   │   ├── AdBanner.tsx               # AdMob banner wrapper (placeholder in prototype)
│   │   │   ├── EmptyState.tsx             # Illustration + heading + CTA per screen
│   │   │   ├── BottomSheetModal.tsx       # Reusable spring-animated bottom sheet
│   │   │   └── SimulatedNotificationBanner.tsx  # Simulated push banner for prototype
│   │   └── navigation/
│   │       └── BottomTabBar.tsx           # Custom 4-tab bar with spring animation
│   └── data/
│       └── mockSaves.ts                   # 8 realistic pre-populated mock saves
├── supabase/
│   ├── schema.sql                         # Full DB schema including all tables + RLS
│   └── functions/
│       └── process-save/
│           └── index.ts                   # Edge Function — pluggable AI adapter server-side
├── app.json                               # Expo config — includes Android intent filters
├── eas.json                               # EAS Build config for Play Store
├── tailwind.config.js
└── .env.example
```

---

## Phase 1 — Design System, Types & State

### `tailwind.config.js`
Full design token config:
- **Dark backgrounds**: `#0D0D0D` (primary), `#1A1A1A` (secondary), `#242424` (tertiary), `#2E2E2E` (border)
- **Light backgrounds**: `#F7F7F8`, `#FFFFFF`, `#EFEFEF`, `#E4E4E7`
- **Accent**: `#7C6EF6` (primary), `#9585F8` (hover)
- **Status**: Success `#4ADE80`, Warning `#FBBF24`, Danger `#F87171`
- **14 category colours** — Technology `#6366F1`, AI & ML `#8B5CF6`, Programming `#3B82F6`, Design `#EC4899`, Career `#F59E0B`, Courses `#10B981`, Science `#06B6D4`, Business `#F97316`, Finance `#22C55E`, Health `#EF4444`, Productivity `#EAB308`, Entertainment `#A855F7`, News `#64748B`, Other `#6B7280`
- **Border radius**: cards `16px`, bottom sheets `24px` (top), pills `999px`, inputs `12px`, buttons `12px`, FAB `999px`
- **Shadows**: cards `0 2px 12px rgba(0,0,0,0.4)`, FAB `0 4px 20px rgba(124,110,246,0.4)`

### `src/types/savedfeed.ts`
```typescript
export type AIProvider = 'anthropic' | 'openai' | 'google' | 'mistral' | 'ollama';

export type Category =
  | 'technology' | 'ai_ml' | 'programming' | 'design'
  | 'career' | 'courses' | 'science' | 'business'
  | 'finance' | 'health' | 'productivity' | 'entertainment'
  | 'news' | 'uncategorized';

export interface SaveItem {
  id: string;
  user_id: string;
  url: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  domain: string | null;
  source_platform: 'instagram' | 'twitter' | 'youtube' | 'reddit' | 'web' | 'manual' | null;
  category: Category;
  tags: string[];
  created_at: string;
  updated_at: string;
  next_resurface_at: string | null;
  resurface_count: number;
  times_viewed: number;
  is_archived: boolean;
  is_favourite: boolean;
}

export interface CategoryInfo {
  id: Category;
  label: string;
  emoji: string;
  color: string;
  save_count: number;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  streak_days: number;
  daily_nudge_time: string; // "09:00"
  dark_mode: boolean;
}

export interface AppConfig {
  AI_PROVIDER: AIProvider;
  AI_MODEL_CATEGORISE: string;
  AI_MODEL_EMBED: string;
  AI_MODEL_SUMMARY: string;
}

export interface AIAdapterResult {
  category: Category;
  tags: string[];
  embedding: number[];
}
```

### `src/lib/categories.ts`
```typescript
export const CATEGORIES: Record<Category, { label: string; emoji: string; color: string }> = {
  technology:    { label: 'Technology',    emoji: '💻', color: '#6366F1' },
  ai_ml:         { label: 'AI & ML',       emoji: '🤖', color: '#8B5CF6' },
  programming:   { label: 'Programming',   emoji: '⌨️',  color: '#3B82F6' },
  design:        { label: 'Design',        emoji: '🎨', color: '#EC4899' },
  career:        { label: 'Career',        emoji: '🚀', color: '#F59E0B' },
  courses:       { label: 'Courses',       emoji: '📚', color: '#10B981' },
  science:       { label: 'Science',       emoji: '🔬', color: '#06B6D4' },
  business:      { label: 'Business',      emoji: '📊', color: '#F97316' },
  finance:       { label: 'Finance',       emoji: '💰', color: '#22C55E' },
  health:        { label: 'Health',        emoji: '🏃', color: '#EF4444' },
  productivity:  { label: 'Productivity',  emoji: '⚡', color: '#EAB308' },
  entertainment: { label: 'Entertainment', emoji: '🎮', color: '#A855F7' },
  news:          { label: 'News',          emoji: '📰', color: '#64748B' },
  uncategorized: { label: 'Other',         emoji: '📌', color: '#6B7280' },
};
```

### `src/lib/resurface.ts`
```typescript
const INTERVALS_DAYS = [1, 3, 7, 14, 30, 60];

export function calculateNextResurface(resurface_count: number): Date {
  const days = INTERVALS_DAYS[Math.min(resurface_count, INTERVALS_DAYS.length - 1)];
  const next = new Date();
  next.setDate(next.getDate() + days);
  next.setHours(9, 0, 0, 0); // Always 9am
  return next;
}

export function isDueForResurface(next_resurface_at: string | null): boolean {
  if (!next_resurface_at) return true;
  return new Date(next_resurface_at) <= new Date();
}
```

### `src/lib/aiAdapter.ts`
Provider-agnostic adapter. Reads active provider from Supabase `app_config` at runtime. The app code never references a specific model name.

```typescript
// This runs client-side only to call the Edge Function.
// The Edge Function itself handles the actual provider switching.

export async function processSave(payload: {
  url?: string;
  title: string;
  description?: string;
  rawText?: string;
}): Promise<AIAdapterResult> {
  const { data, error } = await supabase.functions.invoke('process-save', {
    body: payload,
  });
  if (error) throw error;
  return data as AIAdapterResult;
}
```

The Edge Function (`supabase/functions/process-save/index.ts`) reads `AI_PROVIDER` and `AI_MODEL_CATEGORISE` from the `app_config` table at request time and routes to the correct provider. See Phase 4.

### `src/data/mockSaves.ts`
8 realistic pre-populated saves used in offline/demo mode:

```typescript
export const MOCK_SAVES: SaveItem[] = [
  {
    id: '1', title: 'How I learned ML in 3 months',
    domain: 'medium.com', category: 'ai_ml',
    tags: ['machine learning', 'roadmap', 'beginner'],
    image_url: 'https://picsum.photos/seed/ml/400/200',
    source_platform: 'web', resurface_count: 1, times_viewed: 2,
    is_archived: false, is_favourite: true,
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
    next_resurface_at: new Date().toISOString(), // due today
    // ...other fields
  },
  {
    id: '2', title: 'The complete guide to system design interviews',
    domain: 'github.com', category: 'programming',
    tags: ['system design', 'interviews', 'backend'],
    image_url: 'https://picsum.photos/seed/sys/400/200',
    source_platform: 'web', resurface_count: 0, times_viewed: 0,
    is_archived: false, is_favourite: false,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    next_resurface_at: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: '3', title: 'Figma auto-layout: everything you need to know',
    domain: 'youtube.com', category: 'design',
    tags: ['figma', 'ui design', 'tutorial'],
    image_url: 'https://picsum.photos/seed/figma/400/200',
    source_platform: 'youtube', resurface_count: 0, times_viewed: 1,
    is_archived: false, is_favourite: false,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    next_resurface_at: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: '4', title: 'Top 10 VS Code extensions for developers',
    domain: 'dev.to', category: 'technology',
    tags: ['vscode', 'productivity', 'tools'],
    image_url: 'https://picsum.photos/seed/vscode/400/200',
    source_platform: 'web', resurface_count: 2, times_viewed: 3,
    is_archived: false, is_favourite: false,
    created_at: new Date(Date.now() - 22 * 86400000).toISOString(),
    next_resurface_at: new Date().toISOString(), // due today
  },
  {
    id: '5', title: 'How to build passive income as a developer',
    domain: 'hashnode.com', category: 'career',
    tags: ['freelancing', 'income', 'developer'],
    image_url: 'https://picsum.photos/seed/income/400/200',
    source_platform: 'web', resurface_count: 0, times_viewed: 0,
    is_archived: false, is_favourite: false,
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    next_resurface_at: new Date(Date.now() + 7 * 86400000).toISOString(),
  },
  {
    id: '6', title: 'CS50: Introduction to Computer Science (Free)',
    domain: 'edx.org', category: 'courses',
    tags: ['cs50', 'harvard', 'free course'],
    image_url: 'https://picsum.photos/seed/cs50/400/200',
    source_platform: 'web', resurface_count: 1, times_viewed: 1,
    is_archived: false, is_favourite: true,
    created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
    next_resurface_at: new Date().toISOString(), // due today
  },
  {
    id: '7', title: 'React Native vs Flutter — which one to pick',
    domain: 'reddit.com', category: 'programming',
    tags: ['react native', 'flutter', 'mobile'],
    image_url: 'https://picsum.photos/seed/rn/400/200',
    source_platform: 'reddit', resurface_count: 0, times_viewed: 0,
    is_archived: false, is_favourite: false,
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    next_resurface_at: new Date(Date.now() + 86400000).toISOString(),
  },
  {
    id: '8', title: 'The Feynman technique for actually learning things',
    domain: 'fs.blog', category: 'productivity',
    tags: ['learning', 'feynman', 'study'],
    image_url: 'https://picsum.photos/seed/feynman/400/200',
    source_platform: 'web', resurface_count: 3, times_viewed: 4,
    is_archived: false, is_favourite: true,
    created_at: new Date(Date.now() - 45 * 86400000).toISOString(),
    next_resurface_at: new Date(Date.now() + 15 * 86400000).toISOString(),
  },
];
```

### `src/store/useSavedFeedStore.ts`
Zustand store handling:
- Saves CRUD (add, update, delete, archive, toggle favourite)
- `markReviewed(id)` — increments `resurface_count`, sets `next_resurface_at` via `calculateNextResurface()`
- Active category filter state
- Search query state
- Dark mode toggle (persisted via AsyncStorage)
- Notification banner trigger (for simulated push in prototype)
- Mock mode flag — when `true`, skips Supabase and uses `MOCK_SAVES`
- Pre-loaded with all 8 mock saves on init

---

## Phase 2 — Navigation & Global Shell

### `app.json` — Android Intent Filters (CRITICAL — required for share sheet)
```json
{
  "expo": {
    "android": {
      "intentFilters": [
        {
          "action": "SEND",
          "data": [{ "mimeType": "text/plain" }],
          "category": ["DEFAULT", "BROWSABLE"]
        },
        {
          "action": "SEND",
          "data": [{ "mimeType": "text/*" }],
          "category": ["DEFAULT"]
        }
      ]
    }
  }
}
```
Without this, the share sheet integration does not work. This must be in `app.json` before first build.

### `app/_layout.tsx`
- ThemeProvider wrapping entire app (dark default, light toggle stored in Zustand + AsyncStorage)
- `SafeAreaProvider` from `react-native-safe-area-context`
- Auth guard: redirect to `(auth)/onboarding` if no session, else to `(tabs)`
- Global `BottomSheetModal` context
- `SimulatedNotificationBanner` mounted at root so it overlays any screen

### `app/(tabs)/_layout.tsx`
- 4 tabs: Home (`index`), Inbox (`inbox`), Categories (`categories`), Search (`search`)
- Uses custom `BottomTabBar` component — **Profile is NOT a tab**
- Tab bar: `#111111` background, `#2A2A2A` top border, 4px safe area bottom padding

### `src/components/navigation/BottomTabBar.tsx`
- 4 icons: House (Home), Tray (Inbox), Grid (Categories), MagnifyingGlass (Search) — Phosphor or Lucide
- Active tab: icon + label visible, accent colour `#7C6EF6`
- Inactive tab: icon only, no label, muted `#5A5A5A`
- Active icon animates with spring bounce on switch (scale 1.0 → 1.2 → 1.0, damping 15)

### `src/components/common/BottomSheetModal.tsx`
- Spring entrance: `translateY` from +300 to 0, damping 20, stiffness 200
- 40×4px drag handle pill centred at top
- Backdrop: `rgba(0,0,0,0.6)`, dismiss on tap
- Swipe down to dismiss (gesture threshold 80px)

### `src/components/common/SimulatedNotificationBanner.tsx`
- Positioned absolute, top 0, full width, z-index 999
- Slides down from `translateY(-80)` to `translateY(0)` on trigger, 300ms spring
- Content: app icon left + "📚 Time to revisit" bold + save title
- Auto-dismisses after 3 seconds (slides back up)
- Tap → navigates to Save Detail for that save

### `src/components/common/SkeletonLoader.tsx`
- Animated shimmer: `LinearGradient` moving left to right, 1.2s loop
- Props: `width`, `height`, `borderRadius`
- Used everywhere content is loading — not a spinner

### `src/components/common/AdBanner.tsx`
- In prototype: styled placeholder strip, `#1F1F1F` background
- "Advertisement" label in 10px muted text above the strip
- In production: swap with `BannerAd` from `react-native-google-mobile-ads`

### `src/components/common/EmptyState.tsx`
Props: `illustration`, `heading`, `subtext`, `ctaLabel`, `onCta`
Used on all 5 empty scenarios (Home no saves, Home all reviewed, Inbox empty, Search no results, Category empty).

---

## Phase 3 — Screens

### Screen 1 — Onboarding + Auth (`app/(auth)/`)

**`onboarding.tsx`**
- 3-slide horizontal `ScrollView` with `pagingEnabled`
- Slides:
  1. Heading: "You save everything." · Subtext: "Articles, courses, tutorials, reels. All of it going nowhere." · Illustration: chaotic bookmarks SVG
  2. Heading: "SavedFeed collects them all." · Subtext: "One inbox for every link, from any app." · Illustration: posts flying into inbox SVG
  3. Heading: "We bring them back at the right time." · Subtext: "Smart nudges so you actually use what you save." · CTA button: "Get started →" (accent, full width)
- 3 progress dots at bottom — active dot wider (24px), inactive narrow (8px), animated with spring
- "Already have an account? Log in" link below CTA on slide 3

**`signup.tsx`**
- App logo centred (80px)
- "Create your account" heading
- Email input + password input (show/hide toggle icon inside field)
- "Sign up" button — full width, accent, 52px, 12px radius
- "Log in instead" link at bottom
- On success → `router.replace('/(tabs)')`

**`login.tsx`**
- Mirror of signup with reversed links
- On success → `router.replace('/(tabs)')`

---

### Screen 2 — Home (`app/(tabs)/index.tsx`)

**Header**
- Left: Dynamic greeting — "Good morning" (5am–12pm) / "Good afternoon" (12pm–5pm) / "Good evening" (5pm+), user display name, wave emoji
- Date below greeting: "Tuesday, 15 Sep" in muted caption
- Right: Avatar circle (40px) with user initials — tap → `router.push('/profile')`
- Below avatar: "🔥 5-day streak" badge (warning colour background, pill)

**Review Today section**
- Label: "REVIEW TODAY" (11px/500, caps, muted) + clock icon
- Subtitle: "X saves waiting for you" or "You're all caught up for today ✓" (green)
- `ScrollView` horizontal, `showsHorizontalScrollIndicator={false}`
- `ResurfaceCard` component (see below)

**`src/components/saves/ResurfaceCard.tsx`**
- 260×160px card, 16px radius, `#1A1A1A` background
- Top 80px: hero thumbnail (`expo-image`, object-cover) with bottom gradient overlay
- Category badge overlaid on image, top-left, 8px from edges
- Bottom 80px: title (2 lines max, 14px/500), domain + "saved X days ago" row
- Two buttons: "✓ Reviewed" (green tint) | "→ Skip" (muted)
- **Swipe right gesture** = Reviewed (green flash, card slides right and disappears)
- **Swipe left gesture** = Skip (grey flash, card slides left and disappears)
- Appear animation: fade + translateY(-8 → 0), staggered 60ms per card

**Recently Saved section**
- "RECENTLY SAVED" label + "See all →" link (navigates to Inbox)
- Last 5 saves as vertical `SaveCard` list

**`src/components/saves/SaveCard.tsx`**
- Full-width card, 16px padding, 16px radius, `#1A1A1A` background
- Left: 72×72px thumbnail, 12px radius (picsum.photos placeholder or real image)
- Right column: Category badge (top) · Title 2 lines / 14px/500 · Domain pill + relative time · Tags (2 pills max)
- Appear: fade + translateY(8 → 0), 200ms ease-out
- Long-press: card lifts (scale 1.02), darkens slightly, triggers context menu bottom sheet

**AdMob banner** — `AdBanner` component at very bottom, above tab bar

---

### Screen 3 — Inbox (`app/(tabs)/inbox.tsx`)

**Top bar**: "Inbox" title (22px/600)

**Search bar** (tappable, not editable inline)
- Placeholder: "Search your saves..."
- Magnifier icon left
- Tap → `router.push('/(tabs)/search')`

**Filter chips** — horizontal `ScrollView`
All · ⭐ Favourites · 💻 Technology · 🤖 AI & ML · ⌨️ Programming · 🎨 Design · (rest of categories)
Active chip: `#7C6EF6` background, white text. Inactive: `#242424` background, muted text.

**Saves list**
- `FlashList` from `@shopify/flash-list`, `estimatedItemSize={88}`
- `SaveCard` per item
- Pull to refresh (custom accent-colour spinner)
- 3 skeleton `SaveCard` loaders during initial load

**Long-press context menu** (bottom sheet)
- ⭐ Add to Favourites / ★ Remove from Favourites (toggles)
- 📁 Archive
- 🗑 Delete (red)
Each row 52px tall with icon left, label, chevron right (except Delete).

**FAB**
- Bottom right, 56px circle, `#7C6EF6` background
- "+" icon (white, 28px)
- Shadow: `0 4px 20px rgba(124,110,246,0.5)`
- Spring scale on press (1.0 → 0.92 → 1.0)
- Tap → `router.push('/save/new')`

**AdMob banner** at bottom above tab bar.

---

### Screen 4 — New Save (`app/save/new.tsx`)

**Top bar**: "← Back" left · "Save" right (greyed `#5A5A5A` until content ready)

**Mode toggle**: "Link" | "Note" — two buttons, active has accent underline

**Link mode**
- Large text input, auto-focused, 14px, placeholder "Paste a URL..."
- Platform detection row below: Instagram · YouTube · Reddit · Twitter · Web icons (20px each) — correct one highlights in accent when URL is pasted and domain matches
- "Fetch preview →" outlined button (appears once URL is non-empty)

**Preview card** (appears after fetch, slides up with spring)
- Hero image full width 180px, 12px radius
- Title (editable — tap to edit inline)
- Domain pill
- Description (2 lines, muted)
- Category badge — "Analysing..." shimmer while AI processes → fills in with real category
- Tags row — same shimmer → fills in

**Note mode**
- Multiline text area, auto-focused
- Category selector: dropdown/picker showing all 14 categories with emojis
- Tags: comma-separated input field

**"Save to SavedFeed" button**
- Full width, accent, 52px
- Loading state: "Saving..." text + spinner
- Success: card animates flick-up (translateY 0 → -400, opacity 1 → 0, 300ms), green flash overlay, haptic (Expo Haptics.notificationAsync SUCCESS), navigate back

**Share intent mode** (Flow 9)
- When opened via Android share intent, URL is pre-filled, Fetch Preview fires automatically
- Small banner at top: "Shared from [platform icon]"

---

### Screen 5 — Save Detail (`app/save/[id].tsx`)

**Hero image**
- Full width, 220px tall, `expo-image`
- Bottom gradient overlay (transparent → `#0D0D0D`)
- "←" back button top-left, floating (white icon, `rgba(0,0,0,0.4)` background circle)
- Bookmark toggle top-right, floating — fills solid on favourite

**Content (scrollable)**
- Domain pill + source platform icon (Instagram/YouTube/Reddit icon)
- Title: 22px/600
- Category badge (large, 14px)
- Tags: all tags as `#242424` pills, wrapping row
- Divider
- Description body text (14px/400, 22px line height)
- "Open original →" — outlined button, accent border, opens `Linking.openURL(url)`

**Resurface status bar**
- "Resurfaced X times · Next in Y days"
- Small segmented progress dots (e.g. ●●●○○○ for 3/6 intervals done)

**"Mark as Reviewed" button**
- Full width, 52px, accent colour
- On press: left-to-right fill animation (300ms), then transitions to "✓ Reviewed today" state (green, muted)
- Below it: "Next resurface in X days" caption appears after marking

**Bottom danger zone**
- "Archive this save" — muted text link
- "Delete save" — `#F87171` red text link
- Both → confirmation bottom sheet before executing

---

### Screen 6 — Categories (`app/(tabs)/categories.tsx`)

**Header**: "Categories" · Subtitle: "X saves across Y categories" (muted)

**2-column grid** (`FlatList` with `numColumns={2}`, 12px gap)

Each category card:
- Background: category colour at 10% opacity
- Left border: 3px solid category colour
- 32px emoji
- Category label (16px/600)
- Save count (14px, muted)
- Chevron right (muted)
- 16px padding, 16px radius

- 0 saves: card at 50% opacity, "No saves yet" instead of count
- Tap → navigates to `/(tabs)/inbox` with that category pre-selected as filter

---

### Screen 7 — Search (`app/(tabs)/search.tsx`)

**Search bar** — auto-focused on mount, full width
- "←" back icon left
- Clear "×" button appears when text entered

**Empty state (on open)**
- "Recent searches" list (clock icon, stored in Zustand)
- "Suggested topics" — horizontal chips from user's top 3 categories

**Typing state**
- Instant keyword results appear from local Zustand store (debounce 0ms for mock mode)
- After 400ms debounce: "Searching semantically..." animated dots appear below search bar
- Semantic search fires against Supabase RPC (or mock similarity ranking in offline mode)

**Results state**
- "X results for '[query]'" header
- `FlashList` of `SaveCard` components
- Semantic matches prefixed with `~` in small muted text above card title (e.g. "~ Semantic match")
- Sorted by relevance score descending

**No results state** — `EmptyState` component with magnifier illustration

---

### Screen 8 — Profile & Settings (`app/profile.tsx`)

**Navigation**: Stack screen, NOT a tab. Accessed by tapping avatar on Home. Back button returns to Home.

**Profile header**
- 80px avatar circle (initials fallback)
- Display name (18px/600)
- @username (14px, muted)
- Stats row: `[Total saves]` `[Reviewed]` `[🔥 Streak days]` — 3 equal boxes

**Settings sections** (grouped list style)

*Preferences*
- "Dark Mode" — toggle switch (on = dark, default)
- "Daily Nudge Time" — shows current time (e.g. "9:00 AM"), tap → time picker

*AI Settings*
- "AI Model" — shows current provider name (e.g. "Anthropic") and model (e.g. "claude-haiku")
- Tap → bottom sheet: "Model is configured by the app admin. Your saves are always processed with the latest available model."
- Note: In a future admin panel this row becomes a full picker dropdown

*Account*
- "Change Email"
- "Change Password"
- "Export my saves" — downloads JSON of all saves
- "Delete account" — red text, opens confirmation bottom sheet

*About*
- App version (e.g. "v1.0.0")
- "Privacy Policy" link
- "Terms of Service" link
- "Rate SavedFeed ⭐" link → Play Store

---

## Phase 4 — Database Schema & Edge Function

### `supabase/schema.sql` — Complete

```sql
-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Profiles table (auto-created on signup)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  streak_days INT DEFAULT 0,
  daily_nudge_time TEXT DEFAULT '09:00',
  dark_mode BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- App config — pluggable AI model system
CREATE TABLE public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed AI config defaults (admin changes these, not the app code)
INSERT INTO public.app_config (key, value, description) VALUES
  ('AI_PROVIDER',          'anthropic',          'Active AI provider: anthropic | openai | google | mistral'),
  ('AI_MODEL_CATEGORISE',  'claude-haiku-4-5',   'Model used for categorisation and tagging'),
  ('AI_MODEL_EMBED',       'text-embedding-3-small', 'Model used for vector embeddings'),
  ('AI_MODEL_SUMMARY',     'claude-sonnet-4-5',  'Model used for article summaries (premium tier)');

-- Saves table
CREATE TABLE public.saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  domain TEXT,
  raw_text TEXT,
  source_platform TEXT,
  category TEXT NOT NULL DEFAULT 'uncategorized',
  tags TEXT[] DEFAULT '{}',
  embedding VECTOR(1536),
  times_viewed INT DEFAULT 0,
  last_viewed_at TIMESTAMPTZ,
  next_resurface_at TIMESTAMPTZ,
  resurface_count INT DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  is_favourite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Profiles: users see and edit only their own
CREATE POLICY "Own profile only" ON public.profiles FOR ALL USING (auth.uid() = id);

-- Saves: users see and edit only their own
CREATE POLICY "Own saves only" ON public.saves FOR ALL USING (auth.uid() = user_id);

-- App config: read-only for authenticated users, write only for service role
CREATE POLICY "Config read" ON public.app_config FOR SELECT TO authenticated USING (TRUE);

-- Indexes
CREATE INDEX saves_user_id_idx ON public.saves(user_id);
CREATE INDEX saves_category_idx ON public.saves(category);
CREATE INDEX saves_resurface_idx ON public.saves(next_resurface_at);
CREATE INDEX saves_embedding_idx ON public.saves
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Auto update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER saves_updated_at
  BEFORE UPDATE ON public.saves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTR(NEW.id::TEXT, 1, 4),
    SPLIT_PART(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Semantic search RPC (user_id filter is REQUIRED — do not remove)
CREATE OR REPLACE FUNCTION match_saves(
  query_embedding VECTOR(1536),
  user_uuid UUID,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID, title TEXT, url TEXT, description TEXT,
  category TEXT, domain TEXT, image_url TEXT,
  created_at TIMESTAMPTZ, similarity FLOAT
)
LANGUAGE SQL STABLE AS $$
  SELECT
    id, title, url, description, category, domain, image_url, created_at,
    1 - (embedding <=> query_embedding) AS similarity
  FROM saves
  WHERE user_id = user_uuid
    AND is_archived = FALSE
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;
```

### `supabase/functions/process-save/index.ts` — Pluggable AI Edge Function

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Load active AI config from app_config table
async function loadConfig(): Promise<Record<string, string>> {
  const { data } = await supabase.from('app_config').select('key, value');
  return Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));
}

const CATEGORY_LIST = [
  'technology','ai_ml','programming','design','career','courses',
  'science','business','finance','health','productivity',
  'entertainment','news','uncategorized'
].join(', ');

// Provider-specific API calls
async function categorise(content: string, provider: string, model: string) {
  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY')!,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: 150,
        messages: [{
          role: 'user',
          content: `Classify this content. Respond ONLY with JSON: {"category":"one of [${CATEGORY_LIST}]","tags":["tag1","tag2","tag3"]}\n\nContent:\n${content}`
        }]
      })
    });
    const data = await res.json();
    return JSON.parse(data.content[0].text);
  }

  if (provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')!}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model, max_tokens: 150,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `Classify content. Respond ONLY with JSON: {"category":"one of [${CATEGORY_LIST}]","tags":["tag1","tag2","tag3"]}` },
          { role: 'user', content }
        ]
      })
    });
    const data = await res.json();
    return JSON.parse(data.choices[0].message.content);
  }

  if (provider === 'google') {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${Deno.env.get('GOOGLE_API_KEY')!}`,
      {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Classify this content. Respond ONLY with JSON: {"category":"one of [${CATEGORY_LIST}]","tags":["tag1","tag2","tag3"]}\n\nContent:\n${content}` }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      }
    );
    const data = await res.json();
    return JSON.parse(data.candidates[0].content.parts[0].text);
  }

  // Default fallback
  return { category: 'uncategorized', tags: [] };
}

async function embed(text: string, provider: string, model: string): Promise<number[]> {
  // OpenAI embeddings (compatible with most providers)
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')!}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: text.slice(0, 2000) })
  });
  const data = await res.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  try {
    const { url, title, description, rawText } = await req.json();
    const config = await loadConfig();
    const content = [title, description, rawText?.slice(0, 800)].filter(Boolean).join('\n');

    const [categorised, embedding] = await Promise.all([
      categorise(content, config.AI_PROVIDER, config.AI_MODEL_CATEGORISE),
      embed(content, config.AI_PROVIDER, config.AI_MODEL_EMBED),
    ]);

    return new Response(
      JSON.stringify({ ...categorised, embedding }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
```

---

## Phase 5 — Build & Play Store Deployment

### `eas.json`
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "aab" }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-services-account.json",
        "track": "internal"
      }
    }
  }
}
```

Build commands:
- **Dev/test APK**: `eas build --platform android --profile preview`
- **Play Store AAB**: `eas build --platform android --profile production`
- **Submit to Play Store**: `eas submit --platform android --profile production`

---

## Animations — Full Specification

| Element | Animation details |
|---|---|
| Screen transitions | Shared element on card → detail. Slide-up for modals/stack screens. |
| Save card appear | Fade + translateY(8→0), 200ms ease-out, staggered 50ms per card |
| Resurface card appear | Fade + translateY(-8→0), staggered 60ms |
| Swipe reviewed | translateX(0→400) + green flash overlay + haptic SUCCESS |
| Swipe skip | translateX(0→-400) + grey flash |
| FAB press | Scale 1.0→0.92→1.0, shadow flare |
| Save success | Card translateY(0→-400) + opacity 1→0, green screen flash, haptic |
| Mark reviewed button | Width fill left→right 300ms, transitions to green "✓ Reviewed today" |
| Bottom tab switch | Active icon spring bounce: scale 1.0→1.2→1.0, damping 15 |
| Bottom sheet | translateY(300→0), spring damping 20 stiffness 200 |
| Skeleton shimmer | LinearGradient `transparent → rgba(255,255,255,0.08) → transparent`, left→right, 1.2s loop |
| Onboarding dots | Active dot width 8→24px spring, inactive 24→8px |
| Notification banner | translateY(-80→0) spring 300ms, auto-dismiss after 3s |
| Category badge mount | Scale 0.8→1.0, 200ms ease-out |
| Pull to refresh | Custom accent-colour spinner |
| Long press card | Scale 1.0→1.02, background darkens, held until menu appears |

---

## Verification Plan

### Automated
- `npx tsc --noEmit` — 0 TypeScript errors
- `npx expo doctor` — project health check
- `eslint src/` — 0 linting errors

### Manual Flow Verification (All 9 Flows)

1. **Onboarding → Signup → Home**: Swipe 3 slides, tap "Get started", fill email/password, land on Home with mock data visible.
2. **Home Resurface → Detail → Reviewed**: Tap a Resurface Card, read detail, tap "Mark as Reviewed", verify fill animation + "Next resurface in X days" appears, return to Home and verify card is gone from Review Today section.
3. **Inbox → Save Detail → Open Original**: Browse Inbox, tap a card, verify all content renders correctly, tap "Open original →".
4. **Save Flow**: Tap FAB, paste a URL, tap "Fetch preview", observe shimmer then category fills in, tap Save, verify flick animation, return to Inbox and confirm new card at top.
5. **Delete Flow**: Long-press card in Inbox, bottom sheet slides up, tap Delete, confirm in modal, card disappears from list.
6. **Category Drill-down**: Navigate to Categories tab, tap "Technology" card, verify Inbox opens pre-filtered to Technology with correct saves only.
7. **Search Flow**: Tap Search tab, type "machine learning", observe "Searching semantically..." then results with `~` prefix, tap a result to open detail.
8. **Settings Flow**: Tap avatar on Home, Profile screen opens (stack, not tab), toggle Dark/Light mode, observe entire app UI colour transition, toggle back.
9. **Simulated Share Intent**: Trigger the share intent simulator screen (accessible from New Save screen in dev mode), observe URL pre-filled, Fetch Preview auto-fires, standard save flow completes.

### Prototype Deliverable Checklist
- [ ] All 8 screens built and populated with mock data (no Lorem Ipsum, no grey boxes)
- [ ] Real placeholder images from picsum.photos throughout
- [ ] Dark mode default, light mode toggle functional globally
- [ ] All 9 flows connected end-to-end
- [ ] Resurface card swipe gestures (right = reviewed, left = skip)
- [ ] Long-press context menu on save cards
- [ ] All loading/skeleton states present
- [ ] Simulated push notification banner on Home
- [ ] Empty states for all 5 scenarios
- [ ] Category grid with correct category colours and emoji
- [ ] Bottom sheet spring animations on delete and context menu
- [ ] FAB present and tappable on Inbox with glow shadow
- [ ] AdMob placeholder banner on Home and Inbox (labelled "Advertisement")
- [ ] Streak badge on Home header
- [ ] Onboarding carousel — swipeable, progress dots animate
- [ ] Profile accessible from avatar tap (NOT a bottom tab)
- [ ] All screen transitions animated (no instant cuts)
- [ ] Mark as Reviewed fill animation functional
- [ ] Mobile container frame visible on desktop web preview (390×844px)
