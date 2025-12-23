# Lutem Design Vision

**"Headspace meets Steam"** — A calm gaming companion that prioritizes emotional wellbeing over engagement metrics.

---

## Core Philosophy

### What We Are
- A **wellness tool** that happens to recommend games
- **Calm, not chaotic** — gaming platforms scream at you; we whisper
- **Result-first** — show the recommendation, hide the complexity
- **Emotionally intelligent** — we care how you *felt*, not just what you played

### What We're Not
- A storefront trying to sell you things
- A social platform with feeds and notifications
- A productivity app with guilt-inducing streaks
- Another dark-mode gamer aesthetic with neon accents

---

## Design Principles

### 1. Progressive Disclosure
Show only what's needed. Hide complexity until asked for.

```
BAD:  [Form with 8 inputs] → [Submit] → [Results below]
GOOD: [One recommendation] → [Not feeling it?] → [Wizard opens]
```

### 2. Calm Confidence
The app knows you. It doesn't ask 20 questions every time. Smart defaults, easy overrides.

### 3. Emotional Feedback Loop
Every interaction reinforces the value: "You felt relaxed" — not "You played 47 minutes."

### 4. Breathing Room
Generous whitespace. Let elements breathe. No cramped forms or dense data tables.

### 5. Soft Power
Rounded corners, gentle shadows, muted colors. Nothing sharp or aggressive.

---

## Visual Language

### Color Philosophy

**Primary palette: Soft, muted, calming**

We keep the 4 theme options (Café, Lavender, Earth, Ocean) but they all share these traits:
- Low saturation
- High enough contrast for accessibility
- Warm neutrals for backgrounds
- One accent color per theme (never neon)

### Theme Tokens (CSS Variables)

```css
/* Base structure - each theme overrides these */
--color-bg-primary:      /* Main background */
--color-bg-secondary:    /* Cards, surfaces */
--color-bg-tertiary:     /* Inputs, wells */

--color-text-primary:    /* Headings, important text */
--color-text-secondary:  /* Body text */
--color-text-muted:      /* Hints, placeholders */

--color-accent:          /* Primary actions, highlights */
--color-accent-soft:     /* Hover states, subtle emphasis */

--color-success:         /* Positive feedback */
--color-warning:         /* Caution states */
--color-error:           /* Error states */

--color-border:          /* Subtle borders */
--color-border-strong:   /* Emphasized borders */

--shadow-sm:             /* Subtle lift */
--shadow-md:             /* Cards */
--shadow-lg:             /* Modals, popovers */

--radius-sm:             /* 8px - buttons, inputs */
--radius-md:             /* 12px - small cards */
--radius-lg:             /* 16px - large cards */
--radius-xl:             /* 24px - modals, panels */
```

### Example: Café Theme (Light)

```css
--color-bg-primary:      #FAF7F2;    /* Warm cream */
--color-bg-secondary:    #FFFFFF;    /* Clean white */
--color-bg-tertiary:     #F0EBE3;    /* Soft tan */

--color-text-primary:    #2D2A26;    /* Warm black */
--color-text-secondary:  #5C574F;    /* Warm gray */
--color-text-muted:      #9C968C;    /* Muted brown */

--color-accent:          #8B7355;    /* Coffee brown */
--color-accent-soft:     #A69580;    /* Light coffee */
```

### Example: Ocean Theme (Dark)

```css
--color-bg-primary:      #0F1A1F;    /* Deep sea */
--color-bg-secondary:    #1A2830;    /* Slightly lifted */
--color-bg-tertiary:     #243640;    /* Input wells */

--color-text-primary:    #E8F1F5;    /* Soft white */
--color-text-secondary:  #A8BFC9;    /* Muted cyan */
--color-text-muted:      #6B8A97;    /* Faded teal */

--color-accent:          #4DA3A8;    /* Teal */
--color-accent-soft:     #3D8A8F;    /* Deeper teal */
```

---

## Typography

### Font Stack
```css
--font-sans: 'Nunito', 'SF Pro Rounded', system-ui, sans-serif;
```

Nunito is friendly and rounded — matches our soft aesthetic. Fall back to SF Pro Rounded on Apple devices.

### Scale

| Use | Size | Weight | Line Height |
|-----|------|--------|-------------|
| Display (game title on card) | 28px / 1.75rem | 700 | 1.2 |
| Heading 1 | 24px / 1.5rem | 700 | 1.3 |
| Heading 2 | 20px / 1.25rem | 600 | 1.3 |
| Heading 3 | 16px / 1rem | 600 | 1.4 |
| Body | 16px / 1rem | 400 | 1.5 |
| Body Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 400 | 1.4 |
| Button | 16px / 1rem | 600 | 1 |

### Rules
- **No ALL CAPS** except for tiny labels (like "PLAY NOW" on game cards)
- **No bold abuse** — use sparingly for emphasis
- **Left-align text** — centered only for short headings or CTAs

---

## Spacing System

Base unit: **4px**

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Usage
- **Inner padding (cards):** 16-24px
- **Gap between cards:** 16px
- **Section spacing:** 32-48px
- **Modal padding:** 24px
- **Button padding:** 12px 24px

---

## Component Patterns

### Buttons

**Primary (accent color)**
```
- Solid fill with accent color
- White text
- Subtle shadow
- Slightly larger (padding: 12px 32px)
- Rounded (radius-sm: 8px)
```

**Secondary (outlined or ghost)**
```
- Transparent or subtle fill
- Accent text color
- Border on hover
```

**Danger**
```
- Reserved for destructive actions
- Red accent, use sparingly
```

### Cards

**Game Card**
```
┌──────────────────────────┐
│  ┌────────────────────┐  │ ← Game art (aspect 16:9 or 3:4)
│  │                    │  │
│  │    [Game Image]    │  │
│  │                    │  │
│  └────────────────────┘  │
│                          │
│  Game Title              │ ← Heading 2, truncate if long
│  Genre • 30-60 min       │ ← Caption, muted
│                          │
│  ⭐⭐⭐⭐☆  (4.2)         │ ← Your rating (if exists)
│                          │
│  [Unwind] [Focus]        │ ← Mood tags as small pills
└──────────────────────────┘

- Background: bg-secondary
- Border: none (shadow instead)
- Shadow: shadow-md
- Radius: radius-lg (16px)
- Padding: 12-16px
- Hover: lift slightly (translateY -2px, shadow-lg)
```

**Recommendation Card (Home Screen - Hero)**
```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │         [Large Game Art]              │  │
│  │                                       │  │
│  │              PLAY NOW                 │  │ ← Small label
│  │           Cozy Grove                  │  │ ← Display size
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│         Simulation                          │
│   Time          Mood                        │
│   30 min        Relaxing                    │
│                                             │
│            [ START ]                        │ ← Big primary button
│                                             │
└─────────────────────────────────────────────┘

- Full bleed image with gradient overlay at bottom
- Text overlaid on image (ensure contrast)
- Generous padding
- START button is prominent
```

### Inputs

**Text Input**
```
- Background: bg-tertiary
- Border: 1px solid transparent (border-strong on focus)
- Radius: radius-sm (8px)
- Padding: 12px 16px
- No visible label above (use placeholder or floating label)
```

**Selection Chips (for Energy, Mood, etc.)**
```
┌─────────┐  ┌─────────┐  ┌─────────┐
│   😴    │  │   😊    │  │   ⚡    │
│   Low   │  │ Medium  │  │  High   │
└─────────┘  └─────────┘  └─────────┘
     ○            ●            ○
           (selected)

- Unselected: bg-tertiary, text-secondary
- Selected: bg-accent, text on accent
- Hover: bg-accent-soft
- Radius: radius-md (12px)
- Size: min 80px wide, comfortable tap target
```

**Slider (for Time)**
```
- Track: bg-tertiary, rounded
- Filled portion: accent color
- Thumb: white circle with shadow
- Labels below for discrete stops
```

### Modals

```
┌───────────────────────────────────────┐
│                                   ✕   │ ← Close button, top right
│                                       │
│            Modal Title                │ ← Heading 1, centered
│                                       │
│  ─────────────────────────────────── │ ← Optional divider
│                                       │
│           [Modal Content]             │
│                                       │
│                                       │
│  ─────────────────────────────────── │
│                                       │
│        [Secondary]    [Primary]       │ ← Action buttons
│                                       │
└───────────────────────────────────────┘

- Background: bg-secondary
- Radius: radius-xl (24px)
- Shadow: shadow-lg
- Padding: 24px
- Backdrop: semi-transparent dark (rgba(0,0,0,0.5))
- Animation: fade in + scale up slightly
```

---

## Navigation

### Mobile (Bottom Tab Bar)
```
┌─────────────────────────────────────────────────────┐
│  🏠 Home    📊 Stats    📅 Sessions    👤 Profile   │
└─────────────────────────────────────────────────────┘

- Fixed to bottom
- Height: 64px
- Background: bg-secondary
- Active tab: accent color icon + text
- Inactive: text-muted
- Optional: pill/blob behind active icon
```

### Desktop (Sidebar or Top Nav)
```
SIDEBAR OPTION:
┌────────────────┐
│     LUTEM      │ ← Logo
├────────────────┤
│  🏠 Home       │
│  📊 Stats      │
│  📅 Sessions   │
│  🎮 Library    │
├────────────────┤
│  ⚙️ Settings   │
│  👤 Profile    │
└────────────────┘

- Width: 200-240px
- Background: bg-secondary or bg-primary
- Collapsed option for more space (icons only, 64px wide)
```

### Floating Wizard Button
```
On mobile: FAB (floating action button) with wizard/wand icon
On desktop: Can be in nav or as subtle button on home

- Accent color background
- White icon
- Shadow for lift
- Position: bottom-right on mobile (above tab bar)
```

---

## Page Structure

### Home Screen

**Mobile**
```
┌─────────────────────────────────┐
│  ☀️ Good afternoon              │ ← Greeting based on time
│  You felt relaxed! ✨           │ ← Last session feedback
├─────────────────────────────────┤
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │     [Hero Game Card]      │  │ ← Today's recommendation
│  │                           │  │
│  │       [ START ]           │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│     Not feeling it? Customize → │ ← Link to wizard
│                                 │
├─────────────────────────────────┤
│  Alternatives                   │
│  ┌─────┐ ┌─────┐ ┌─────┐       │ ← Horizontal scroll
│  │     │ │     │ │     │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
├─────────────────────────────────┤
│  Your Week                      │
│  ████░░░░ 3 sessions            │ ← Mini stats
│  Avg mood: 😊                   │
│                                 │
└─────────────────────────────────┘
```

**Desktop**
```
┌──────────────────────────────────────────────────────────────────────┐
│  [Sidebar]  │                                                        │
│             │  Good afternoon, Patrick                               │
│  🏠 Home    │  You felt relaxed after Stardew Valley ✨              │
│  📊 Stats   │                                                        │
│  📅 Sessions│  ┌─────────────────────────────┐  ┌──────────────────┐ │
│  🎮 Library │  │                             │  │ Your Week        │ │
│             │  │    [Hero Game Card]         │  │                  │ │
│             │  │                             │  │ Sessions: 3      │ │
│             │  │        [ START ]            │  │ Avg rating: 4.2  │ │
│             │  │                             │  │ Top mood: Unwind │ │
│             │  └─────────────────────────────┘  └──────────────────┘ │
│  ──────     │                                                        │
│  ⚙️ Settings│  Alternatives                                         │
│  👤 Profile │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                      │
│             │  │     │ │     │ │     │ │     │                      │
│             │  └─────┘ └─────┘ └─────┘ └─────┘                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Wizard Modal

**Mobile (Full Screen Steps)**
```
Step 1:                    Step 2:                    Step 3:
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│            ✕    │       │            ✕    │       │            ✕    │
│                 │       │                 │       │                 │
│   How's your    │       │   How much      │       │   What mood     │
│   energy?       │       │   time?         │       │   are you in?   │
│                 │       │                 │       │                 │
│  ┌───┐ ┌───┐   │       │                 │       │  [Unwind    ]   │
│  │Low│ │Med│   │       │   ══════●════   │       │  [Focus     ]   │
│  └───┘ └───┘   │       │     45 min      │       │  [Challenge ]   │
│     ┌───┐      │       │                 │       │  [Explore   ]   │
│     │Hi │      │       │                 │       │                 │
│     └───┘      │       │                 │       │                 │
│                 │       │                 │       │                 │
│    ● ○ ○ ○     │       │    ○ ● ○ ○     │       │    ○ ○ ● ○     │
│                 │       │                 │       │                 │
│   [ Next → ]   │       │   [ Next → ]   │       │   [ Next → ]   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

**Desktop (All Steps Visible)**
```
┌────────────────────────────────────────────────────────────────────────┐
│  ✕                        New Recommendation                           │
├────────────────┬────────────────┬────────────────┬─────────────────────┤
│    ENERGY      │     TIME       │     MOOD       │   INTERRUPTIBILITY  │
│       ●        │       ○        │       ○        │          ○          │
├────────────────┼────────────────┼────────────────┼─────────────────────┤
│                │                │                │                     │
│   [Low]        │   ════●════    │   [ ] Unwind   │   [High]            │
│   [Med] ←      │    45 min      │   [ ] Focus    │   [Med ]            │
│   [High]       │                │   [✓] Explore  │   [Low ]            │
│                │                │   [ ] Challenge│                     │
│                │                │                │                     │
├────────────────┴────────────────┴────────────────┴─────────────────────┤
│                                                                        │
│   ▼ More options (genre, social preference, time of day)              │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                                              [ Get Recommendation ]    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Iconography

### Style
- **Outlined or light-filled** — not heavy solid icons
- **Rounded** — match the soft aesthetic
- **Consistent stroke width** — 1.5-2px

### Recommended Icon Set
- Lucide (https://lucide.dev) — clean, customizable
- Phosphor (https://phosphoricons.com) — friendly, many weights

### Key Icons Needed
| Use | Suggested Icon |
|-----|----------------|
| Home | house, home |
| Stats | bar-chart, chart-line |
| Calendar/Sessions | calendar, calendar-days |
| Profile | user, user-circle |
| Library/Games | gamepad-2, joystick |
| Wizard/Magic | wand, sparkles |
| Settings | settings, sliders |
| Energy Low | battery-low, moon |
| Energy Medium | battery-medium, sun |
| Energy High | battery-full, zap |
| Time | clock, timer |
| Close | x |
| Back | arrow-left, chevron-left |
| Expand | chevron-down |
| Star (rating) | star (filled/outline) |

---

## Motion & Animation

### Principles
- **Subtle, not flashy** — ease-out transitions, no bouncing
- **Quick** — 150-250ms for most transitions
- **Purposeful** — animation should guide attention, not distract

### Common Animations

**Page/Modal Transitions**
```css
/* Fade + slight scale */
.modal-enter {
  opacity: 0;
  transform: scale(0.95);
}
.modal-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: all 200ms ease-out;
}
```

**Card Hover**
```css
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  transition: all 150ms ease-out;
}
```

**Button Press**
```css
.button:active {
  transform: scale(0.98);
}
```

**Skeleton Loading**
```css
/* Subtle pulse, not aggressive shimmer */
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
```

---

## Responsive Breakpoints

```css
/* Mobile first */
--bp-sm: 640px;   /* Large phones */
--bp-md: 768px;   /* Tablets */
--bp-lg: 1024px;  /* Small laptops */
--bp-xl: 1280px;  /* Desktops */
--bp-2xl: 1536px; /* Large screens */
```

### Layout Changes

| Breakpoint | Nav | Wizard | Grid |
|------------|-----|--------|------|
| < 768px | Bottom tabs | Full-screen steps | 1 column |
| 768-1024px | Bottom tabs or sidebar | Modal stepper | 2 columns |
| > 1024px | Sidebar | Modal with all steps visible | 3-4 columns |

---

## Accessibility

### Requirements
- **Color contrast:** Minimum 4.5:1 for text, 3:1 for UI elements
- **Focus states:** Visible focus ring on all interactive elements
- **Touch targets:** Minimum 44x44px
- **Screen reader:** Semantic HTML, ARIA labels where needed
- **Reduced motion:** Respect `prefers-reduced-motion` media query
- **Keyboard nav:** All actions reachable via keyboard

### Focus Ring Style
```css
*:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

---

## Summary: The Lutem Feel

When someone uses Lutem, they should feel:

| ✅ This | ❌ Not This |
|---------|-------------|
| Calm | Overwhelmed |
| Guided | Confused |
| Understood | Interrogated |
| Satisfied | Guilty |
| In control | Manipulated |

The app is a **gentle companion** that knows what you need, not a **demanding platform** that wants your attention.

---

## Reference Mood Board

**Apps to draw from:**
- Headspace (calm, guided, soft)
- Spotify (dark themes, content-forward, good use of imagery)
- Linear (clean, minimal, professional-but-friendly)
- Apple Fitness+ (soft gradients, encouraging tone)

**Not like:**
- Discord (too gamer-bro, dark and dense)
- Steam (utilitarian, cluttered)
- Mobile games (aggressive, ad-filled, engagement-bait)

---

*Last updated: December 2024*
*For: Lutem React Frontend Rebuild*
