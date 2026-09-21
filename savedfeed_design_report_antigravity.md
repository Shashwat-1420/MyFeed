# SavedFeed — Design Report for Antigravity IDE
### App Prototype Build Instructions

---

## What Antigravity must build

A high-fidelity, fully interactive mobile app prototype for **SavedFeed** — a personal second brain for saved social media posts. Every screen must be interactive, transitions must be smooth, and the UI must feel premium and modern. This is not a wireframe or a static mockup — it is a working prototype that can be demonstrated to users, investors, and beta testers.

Target platform: **Android mobile** (375–430px wide viewport). Design for one-handed use.

---

## Brand identity

### App name
**SavedFeed**
Tagline: *Your saves. Finally useful.*

### Logo concept
A bookmark icon with a small lightning bolt or spark in the corner — communicating both saving and intelligence/action. Clean, modern, works on dark and light backgrounds.

### Personality
- **Calm, not cluttered.** Users open this app to feel in control, not overwhelmed.
- **Smart, not showy.** AI features feel invisible and helpful, not gimmicky.
- **Warm but focused.** Like a well-organised personal library, not a chaotic social feed.

---

## Design system

### Colour palette — Dark mode first (primary), then light mode

**Dark mode (default)**

| Token | Hex | Usage |
|---|---|---|
| Background primary | `#0D0D0D` | Main screen backgrounds |
| Background secondary | `#1A1A1A` | Cards, bottom sheets |
| Background tertiary | `#242424` | Input fields, chips |
| Border | `#2E2E2E` | Card borders, dividers |
| Text primary | `#F2F2F2` | Headings, primary text |
| Text secondary | `#9A9A9A` | Subtitles, metadata, muted |
| Text tertiary | `#5A5A5A` | Placeholders, timestamps |
| Accent / Primary | `#7C6EF6` | Buttons, active states, highlights (soft indigo/violet) |
| Accent hover | `#9585F8` | Pressed states |
| Success | `#4ADE80` | Saved confirmation, streak |
| Warning | `#FBBF24` | Resurface nudge badge |
| Danger | `#F87171` | Delete, destructive |
| Ad strip | `#1F1F1F` | Ad banner background |

**Light mode**

| Token | Hex | Usage |
|---|---|---|
| Background primary | `#F7F7F8` | Main screen backgrounds |
| Background secondary | `#FFFFFF` | Cards |
| Background tertiary | `#EFEFEF` | Input fields, chips |
| Border | `#E4E4E7` | Card borders |
| Text primary | `#111111` | Headings |
| Text secondary | `#666666` | Subtitles |
| Accent / Primary | `#6C5FF0` | Buttons, active states |

### Typography

| Style | Font | Size | Weight | Line height |
|---|---|---|---|---|
| Display | System (SF Pro / Roboto) | 28px | 600 | 34px |
| Heading 1 | System | 22px | 600 | 28px |
| Heading 2 | System | 18px | 600 | 24px |
| Body | System | 14px | 400 | 22px |
| Body medium | System | 14px | 500 | 22px |
| Caption | System | 12px | 400 | 18px |
| Label | System | 11px | 500 | 16px — all caps |

### Spacing scale
4px base unit. Use: 4, 8, 12, 16, 20, 24, 32, 40, 48px.

### Border radius
- Cards: 16px
- Chips / badges: 999px (pill)
- Input fields: 12px
- Bottom sheets: 24px top corners
- Buttons: 12px
- FAB: 999px (circle)
- Images: 12px

### Elevation / shadows (dark mode)
- Cards: `0 2px 12px rgba(0,0,0,0.4)`
- Bottom sheet: `0 -4px 24px rgba(0,0,0,0.6)`
- FAB: `0 4px 20px rgba(124,110,246,0.4)`

### Iconography
Use **Phosphor Icons** or **Lucide** — rounded style, 24px default, 20px in compact contexts. Never mix icon families.

---

## Category colour system

Each category has a distinct colour used on badges and category cards:

| Category | Emoji | Colour |
|---|---|---|
| Technology | 💻 | `#6366F1` indigo |
| AI & ML | 🤖 | `#8B5CF6` violet |
| Programming | ⌨️ | `#3B82F6` blue |
| Design | 🎨 | `#EC4899` pink |
| Career | 🚀 | `#F59E0B` amber |
| Courses | 📚 | `#10B981` emerald |
| Science | 🔬 | `#06B6D4` cyan |
| Business | 📊 | `#F97316` orange |
| Finance | 💰 | `#22C55E` green |
| Health | 🏃 | `#EF4444` red |
| Productivity | ⚡ | `#EAB308` yellow |
| Entertainment | 🎮 | `#A855F7` purple |
| News | 📰 | `#64748B` slate |
| Other | 📌 | `#6B7280` grey |

Category badges use the colour as a tinted background (15% opacity) with the colour as text.

---

## Animations and transitions

Antigravity must implement these interactions precisely:

| Element | Animation |
|---|---|
| Screen transitions | Shared element transition on card → detail. Slide-up for modals. |
| Save card appear | Fade + slide up 8px, staggered 50ms per card |
| Category badge | Scale from 0.8 to 1.0 on mount, 200ms ease-out |
| FAB | Scale pulse on press (1.0 → 0.92 → 1.0), shadow flare |
| Save success | Card flicks up and away with a green flash, haptic |
| "Mark reviewed" button | Fill animation left to right on press, then card collapses |
| Bottom tab switch | Icons animate with a small spring bounce |
| Pull to refresh | Custom spinner using the accent colour |
| Long press | Card slightly darkens + lifts (scale 1.02) while held |
| Resurface card swipe | Swipe right = mark reviewed (green), swipe left = skip (grey) |
| Skeleton loader | Shimmer animation on grey blocks while content loads |
| Search | Search bar expands with spring animation on focus |
| Notification badge | Bounce in on appear |

---

## Screen 1 — Onboarding (3 slides + signup)

### What Antigravity must build:
A 3-slide onboarding carousel followed by a signup screen.

**Slide 1**
- Full-screen dark background
- Large illustrated icon: a chaotic pile of bookmarks/posts (use abstract shapes)
- Headline: "You save everything."
- Subtext: "Articles, courses, tutorials, reels. All of it — going nowhere."
- Progress dots at bottom (3 dots, first active)

**Slide 2**
- Animated illustration: posts flying from Instagram, YouTube, Reddit logos into a single glowing inbox
- Headline: "SavedFeed collects them all."
- Subtext: "One inbox for every link you've ever saved, from any app."

**Slide 3**
- Illustration: a calm brain / lightbulb with a notification bell
- Headline: "We bring them back at the right time."
- Subtext: "Smart nudges so you actually use what you save."
- CTA button: "Get started →" (accent colour, full width)

**Signup screen**
- App logo centred at top
- "Create your account" heading
- Email input field
- Password input field (with show/hide toggle)
- "Sign up" button — accent colour, full width, rounded
- "Already have an account? Log in" link below
- Skip all animations and go to Home on success

---

## Screen 2 — Home

### Layout (top to bottom)

**Header area**
- Left: "Good morning, Arjun 👋" (dynamic greeting based on time of day — morning/afternoon/evening)
- Subtitle: Today's date in format "Tuesday, 15 Sep"
- Right: Avatar circle (initials if no photo) — tapping opens profile
- Below header: a streak badge if user has been active — "🔥 5-day streak"

**Section: Review Today**
- Section label: "REVIEW TODAY" in label style (caps, muted) + a small clock icon
- Subtitle: "3 saves waiting for you"
- Horizontal scroll row of **Resurface Cards** (see component spec below)
- If none due: show a calm empty state — "You're all caught up for today ✓" in green

**Resurface Card component**
- Width: 260px, height: 160px
- Rounded 16px card
- Top: thumbnail image (full bleed, top of card, 80px tall) with gradient overlay at bottom
- Category badge overlaid top-left on image
- Title text (2 lines max, 15px/600)
- Domain pill + "saved X days ago"
- Two action buttons at bottom: ✓ Reviewed | → Skip
- Swipe right gesture = Reviewed, swipe left = Skip

**Section: Recently Saved**
- Section label: "RECENTLY SAVED" + "See all →" link right-aligned
- Vertical list of Save Cards (see component spec below)
- Show last 5 saves

**AdMob Banner**
- At very bottom, above the bottom navigation bar
- Label it "Advertisement" in tiny muted text above the banner
- Background: slightly different shade so it doesn't blend in

---

## Screen 3 — Inbox

### Layout

**Top bar**
- Title: "Inbox"
- Right: Filter icon button

**Search bar**
- Below top bar, tappable — navigates to Search screen on tap (does not expand inline)
- Placeholder: "Search your saves..."
- Left icon: magnifier

**Filter chips (horizontal scroll)**
- All · ⭐ Favourites · 💻 Tech · 🤖 AI · 📚 Courses · (etc.)
- Active chip: accent colour background, white text
- Inactive: tertiary background, secondary text

**Saves list**
- Vertical list of Save Cards
- Sorted by created_at descending
- Pull to refresh

**Save Card component**
- Full-width card, 16px radius, 16px padding
- Left: thumbnail image 72×72px, 12px radius
- Right column:
  - Category badge (top)
  - Title (2 lines max, 14px/500)
  - Domain pill + relative time ("2h ago", "3d ago")
  - Tags row (up to 2 tags shown as small grey pills)
- Long-press context menu (bottom sheet slides up):
  - ⭐ Add to favourites
  - 📁 Archive
  - 🗑 Delete (red)

**FAB**
- Bottom right, 56px circle, accent colour
- "+" icon
- Opens New Save screen
- Shadow glow: `0 4px 20px rgba(124,110,246,0.5)`

---

## Screen 4 — New Save

### Triggered by: FAB tap OR Android share intent

**Layout**

Top bar: "< Back" left, "Save" right (greyed out until content is ready)

**URL / Text input area**
- Large text area, auto-focused, placeholder: "Paste a link or type anything..."
- Below: small helper row — platform detection icons (Instagram, YouTube, Reddit, Twitter, Web) appear when a URL is pasted; the matching one highlights

**Fetch Preview button**
- Appears after URL is pasted
- Label: "Fetch preview →"
- Accent outlined button

**Preview Card (appears after fetch)**
- Thumbnail image (large, full width, 180px tall, 12px radius)
- Title (editable — user can tap to change)
- Domain pill
- Description (2 lines, muted)
- Category badge — shows "Analysing..." shimmer while AI runs, then fills in
- Tags row — same shimmer then fills in

**Save button**
- Full width, accent colour, 52px tall
- Label: "Save to SavedFeed"
- On tap: shows loading state "Saving..." with spinner
- On success: card flicks upward with green flash, haptic feedback, navigates back

**Manual note mode**
- Toggle above input: "Link" | "Note"
- In Note mode: plain text area, category selector dropdown, manual tags input

---

## Screen 5 — Save Detail

**Layout**

**Hero image**
- Full-width, 220px tall
- Gradient overlay bottom-to-top so text is readable
- Back button (< ) top left — floating over image
- Bookmark/unfavourite button top right — floating over image

**Content**
- Domain pill + source platform icon
- Title (Display size, 22px/600)
- Category badge
- Tags row (all tags shown as pills)
- Divider
- Description text (body, readable line height)
- "Open original →" button — outlined, accent border — opens URL in browser

**Resurface info bar**
- "Resurfaced X times · Next in Y days"
- Small progress bar showing how many intervals completed

**Mark as Reviewed button**
- Full width, accent colour
- On press: fill animation, then button becomes "✓ Reviewed today" and goes muted green
- Underneath: "Next resurface in 7 days" text appears after marking

**Danger zone (bottom)**
- "Archive this save" — muted text link
- "Delete save" — red text link
- Both open confirmation bottom sheet before acting

---

## Screen 6 — Categories

**Layout**

Header: "Categories"
Subtitle: "X saves across Y categories"

**Category grid**
- 2 columns
- Each card: 
  - Background: category colour at 10% opacity
  - Left border: 3px solid category colour
  - Large emoji (32px)
  - Category name (16px/600)
  - Save count (14px, muted)
  - Arrow icon right
- Tap → navigates to Inbox filtered to that category

**Empty category** (0 saves) — show card at 50% opacity with "No saves yet"

---

## Screen 7 — Search

**Layout**

**Search bar**
- Auto-focused, full width
- Back arrow left
- Clear button appears when text is entered

**States:**

**Empty state (on open)**
- "Recent searches" list with clock icon per item
- "Suggested topics" — horizontal chips based on user's most-used categories

**Typing state**
- Real-time keyword matches appear instantly (from local cache)
- Below: "Searching semantically..." spinner appears after 400ms debounce, runs vector search

**Results state**
- Results header: "X results for 'machine learning'"
- Sorted by relevance (similarity score)
- Same Save Card component as Inbox
- Semantic results labelled with a tiny "~" prefix to indicate fuzzy/semantic match

**No results state**
- Illustration: empty magnifier
- "No saves found for '[query]'"
- Suggestion: "Try searching for: AI, design, courses"

---

## Screen 8 — Profile / Settings

**Accessed by:** Tapping avatar on Home screen

**Layout**

**Profile header**
- Avatar (large, 80px circle) — initials or photo
- Display name (heading)
- Username @handle (muted)
- Stats row: [Total saves] [Reviewed] [Streak 🔥]

**Settings sections:**

*Preferences*
- Dark / Light mode toggle
- Daily nudge time picker (default 9:00 AM)
- Notification on/off toggle

*AI Settings*
- "AI Model" row — shows current active model name
- Tapping opens a bottom sheet: "Model is managed by admin. Contact support to change."
  (In admin build this would show a dropdown)

*Account*
- Change email
- Change password
- Export my saves (downloads JSON)
- Delete account (red, with confirmation)

*About*
- Version number
- Privacy policy link
- Terms of service link
- Rate the app link

---

## Bottom navigation bar

4 tabs, always visible:

| Tab | Icon | Label |
|---|---|---|
| Home | House | Home |
| Inbox | Tray | Inbox |
| Categories | Grid | Categories |
| Search | Magnifier | Search |

Active tab: icon + label in accent colour, inactive: muted grey.
Do not show tab labels on inactive — only show icon when inactive, icon + label when active (saves space, looks modern).

Tab bar background: `#111111` (dark) with top border `#2A2A2A`.

---

## Bottom sheets (global components)

All bottom sheets must:
- Slide up with spring animation (damping: 20, stiffness: 200)
- Have a drag handle (40×4px rounded pill, centred, top of sheet)
- Darken background with 60% opacity overlay
- Dismiss on overlay tap or drag down

**Confirm delete sheet**
- Title: "Delete this save?"
- Body: "This can't be undone."
- Two buttons: "Cancel" (outlined) | "Delete" (red, solid)

**Long-press context menu sheet**
- List of actions with icons, 52px tall each
- Destructive action (Delete) last, red colour

---

## Empty states (one per screen)

Each empty state must have:
- A simple illustration (abstract, on-brand, not stock art)
- A heading
- A subtext
- A CTA button

| Screen | Illustration concept | Heading | Subtext | CTA |
|---|---|---|---|---|
| Home — no saves | Empty box with a bookmark falling into it | "Nothing saved yet" | "Save your first link and we'll take it from here." | "Save something →" |
| Home — all reviewed | Glowing checkmark / brain | "You're all caught up ✓" | "Come back tomorrow for more." | — |
| Inbox — empty | Tray with nothing in it | "Your inbox is empty" | "Share any post from Instagram, YouTube, or Reddit to get started." | "Save a link →" |
| Search — no results | Magnifier with question mark | "Nothing found" | "Try a different word, or save more content first." | — |
| Category — empty | Small folder, open | "No saves here yet" | "When you save something in this category, it'll show up here." | — |

---

## Notification design (visible in prototype as a simulated push)

Show a simulated notification banner at top of screen:

**Daily resurface notification**
- App icon left
- Bold: "📚 Time to revisit"
- Body: "[Save title] — saved 14 days ago"
- Tap → opens Save Detail screen

Animate it sliding down from top, pause 3 seconds, slide back up.

---

## Loading states — every async action needs one

| Action | Loading UI |
|---|---|
| App launch | Splash screen: app logo centres, pulses once, fades out |
| Fetching saves list | 3 skeleton Save Cards (grey shimmer blocks) |
| Fetching URL preview | Skeleton card with shimmer |
| AI categorising | Category badge shows animated "..." shimmer |
| Semantic search | Animated dots below search bar |
| Marking reviewed | Button shows spinner then transitions to checkmark |
| Saving | Full-width progress bar in button |

---

## Prototype flow — what Antigravity must connect

Build these navigation paths as tappable flows:

1. **Onboarding → Signup → Home** (complete new user flow)
2. **Home → tap Resurface Card → Save Detail → Mark Reviewed → back to Home** (core habit loop)
3. **Inbox → tap Save Card → Save Detail → Open original** (browse and read)
4. **Inbox → FAB → New Save → paste URL → Fetch → Save → back to Inbox with new card at top** (save flow)
5. **Inbox → long press card → context menu → Delete → card disappears** (delete flow)
6. **Categories → tap Technology → filtered Inbox** (category drill-down)
7. **Search → type query → see results → tap result → Save Detail** (search flow)
8. **Home → avatar → Profile/Settings → toggle dark/light mode** (settings flow)
9. **Simulated share intent** — show a screen that mimics receiving a share from Instagram, auto-opens New Save with URL pre-filled

---

## Responsive rules

- All screens designed for 390×844px (iPhone 14 / Pixel 7 size)
- Safe area insets: 44px top (notch), 34px bottom (home indicator)
- Bottom nav sits above the home indicator zone
- All tap targets minimum 44×44px
- Text never smaller than 11px

---

## What Antigravity must NOT do

- Do not use placeholder grey boxes as final images — use real placeholder images from a service like picsum.photos or unsplash
- Do not use placeholder text like "Lorem ipsum" — all text must be realistic mock data
- Do not make screens that are not tappable dead-ends — every screen must have a way to go back or forward
- Do not use flat design with no depth — cards must have subtle shadows and elevation
- Do not show all categories as the same grey — each must use its defined colour
- Do not skip loading/skeleton states — they are part of the experience

---

## Mock data to use throughout the prototype

Use these realistic save entries across all screens:

1. Title: "How I learned ML in 3 months" | Domain: medium.com | Category: AI & ML | Tags: machine learning, roadmap, beginner | Saved: 14 days ago
2. Title: "The complete guide to system design interviews" | Domain: github.com | Category: Programming | Tags: system design, interviews, backend | Saved: 3 days ago
3. Title: "Figma auto-layout: everything you need to know" | Domain: youtube.com | Category: Design | Tags: figma, ui design, tutorial | Saved: 1 day ago
4. Title: "Top 10 VS Code extensions for 2024" | Domain: dev.to | Category: Technology | Tags: vscode, productivity, tools | Saved: 22 days ago
5. Title: "How to build passive income as a developer" | Domain: hashnode.com | Category: Career | Tags: freelancing, income, developer | Saved: 7 days ago
6. Title: "CS50: Introduction to Computer Science (Free)" | Domain: edx.org | Category: Courses | Tags: cs50, harvard, free course | Saved: 30 days ago
7. Title: "React Native vs Flutter in 2024 — which one to pick" | Domain: reddit.com | Category: Programming | Tags: react native, flutter, mobile | Saved: 5 hours ago
8. Title: "The Feynman technique for actually learning things" | Domain: fs.blog | Category: Productivity | Tags: learning, feynman, study | Saved: 45 days ago

---

## Deliverable checklist for Antigravity

Before handoff, confirm the prototype has:

- [ ] All 8 screens built and populated with mock data
- [ ] Dark mode as default, light mode toggle working in settings
- [ ] All 9 prototype flows connected and tappable
- [ ] Resurface card swipe gestures working (right = reviewed, left = skip)
- [ ] Long-press context menu working on at least 2 save cards
- [ ] All loading/skeleton states shown for at least 1 action per screen
- [ ] Simulated push notification animation on Home screen
- [ ] Empty states shown (can be toggled by removing mock data)
- [ ] Category grid with correct category colours
- [ ] Bottom sheet animations on delete confirmation and context menu
- [ ] FAB present and tappable on Inbox
- [ ] AdMob placeholder banner visible on Home and Inbox (labelled "Advertisement")
- [ ] Streak badge visible on Home header
- [ ] Onboarding carousel (3 slides, swipeable, progress dots)
- [ ] All screen transitions animated (not instant cuts)
EOF
echo "Done"