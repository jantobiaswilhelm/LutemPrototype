# Lutem Home UI Redesign - Implementation Plan

## Overview

**Goal:** Transform the home page from a two-column cramped layout to a wizard-first, single-column, mobile-friendly design that prioritizes the quick recommendation flow while keeping advanced options accessible.

**Key Changes:**
1. Wizard-First Approach - Make wizard the default home experience
2. Better Tab Navigation - Move to bottom bar (mobile-style)
3. Larger Touch Targets - Bigger, more prominent interaction elements
4. Color Coding - Use mood colors intentionally throughout
5. Prominent Results - Recommendations take center stage with celebration

---

## Phase 1: Navigation Overhaul
**Files:** `layout.css`, `index.html`, `js/tabs.js`

### 1.1 Convert Top Nav to Bottom Bar
**Current:** Fixed top nav eating 140px vertical space
**New:** Bottom navigation bar (mobile-app style)

```
┌────────────────────────────────────────────────────────┐
│                      CONTENT AREA                      │
│                                                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│  🏠 Home    📅 Calendar    🎮 Games    👤 Profile      │
└────────────────────────────────────────────────────────┘
```

**Tasks:**
- [ ] Move `.tab-navigation` from `top: 0` to `bottom: 0`
- [ ] Remove tab logo from nav (put in page header instead)
- [ ] Reduce button padding for compact bottom bar
- [ ] Update `.page-content` margin from `margin-top` to `margin-bottom`
- [ ] Add safe area padding for mobile devices
- [ ] Update `tabs.js` if needed for bottom bar behavior

### 1.2 Add Page Header with Logo
**Tasks:**
- [ ] Create new `.page-header` component for home page
- [ ] Include Lutem logo prominently
- [ ] Add tagline: "Find your perfect game"

---

## Phase 2: Home Page Structure Rewrite
**Files:** `index.html` (home-page section), `layout.css`

### 2.1 New Home Page Layout
**Current:** Two-column grid (input panel | results panel)
**New:** Single-column wizard flow with inline results

```
┌────────────────────────────────────────────────────────┐
│                       [LUTEM LOGO]                     │
│               Find your perfect game                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│              🎮 What do you want to play?              │
│                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │   🔋     │  │   ⚡⚡   │  │  ⚡⚡⚡  │            │
│  │   Low    │  │  Medium  │  │   High   │            │
│  │  Energy  │  │  Energy  │  │  Energy  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                        │
│  ⏱️ How much time?                                    │
│  ═══════════════●═══════════════  30 min             │
│                                                        │
│  😊 What do you want to feel?                         │
│  [😌 Unwind] [🏆 Progress] [🎯 Focus] [⚡ Challenge]  │
│                                                        │
│           [ 🎮 Get Recommendation ]                   │
│                                                        │
│  ────────────────────────────────────────────────     │
│  [⚙️ Advanced Options]  [🎯 Genre Preferences]        │
│                                                        │
├────────────────────────────────────────────────────────┤
│                   RESULTS AREA                         │
│              (empty until recommendation)              │
└────────────────────────────────────────────────────────┘
```

### 2.2 HTML Structure Changes
**Tasks:**
- [ ] Remove two-column `.main-content` grid
- [ ] Create new `.home-wizard` container (single column, centered)
- [ ] Move essential inputs inline (energy, time, mood)
- [ ] Keep advanced options in collapsible section
- [ ] Create `.results-container` below wizard (initially hidden)
- [ ] Remove separate results panel concept

### 2.3 New CSS Classes Needed
```css
.home-wizard { }           /* Main wizard container */
.wizard-header { }         /* Logo + tagline */
.wizard-section { }        /* Each input group */
.wizard-question { }       /* Question text */
.energy-grid { }           /* 3-column energy cards */
.energy-card { }           /* Individual energy option */
.time-section { }          /* Time slider area */
.mood-grid { }             /* Mood chips container */
.wizard-submit { }         /* Main CTA button */
.advanced-section { }      /* Collapsible advanced */
.results-container { }     /* Results area */
.results-container.show { } /* When results visible */
```

---

## Phase 3: Larger Touch Targets
**Files:** `components.css`

### 3.1 Energy Cards (NEW)
**Current:** Small radio options with emoji
**New:** Large tappable cards (min 100px height)

```css
.energy-card {
    min-height: 120px;
    min-width: 100px;
    padding: 24px 16px;
    border-radius: 16px;
    /* Large icon, clear label */
}
```

**Tasks:**
- [ ] Create `.energy-card` component
- [ ] Add visual battery indicator (not just emoji)
- [ ] Implement selected state with color fill
- [ ] Add hover/focus states

### 3.2 Time Slider Enhancement
**Current:** Small slider thumb
**New:** Larger thumb (44px min), clearer track

**Tasks:**
- [ ] Increase slider thumb to 44x44px
- [ ] Add tick marks for discrete values
- [ ] Show current value prominently above slider
- [ ] Add color gradient to track

### 3.3 Mood Chips Enhancement
**Current:** Small chips (8px padding)
**New:** Larger chips with mood colors

**Tasks:**
- [ ] Increase chip padding to 14px 20px
- [ ] Add mood-specific background colors on selection
- [ ] Improve spacing between chips
- [ ] Add subtle animation on selection

### 3.4 Main CTA Button
**Current:** Full-width button at bottom of input panel
**New:** Prominent, centered button with animation

**Tasks:**
- [ ] Max-width 400px, centered
- [ ] Add pulse animation when ready to submit
- [ ] Disabled state clearly visible
- [ ] Loading state with spinner

---

## Phase 4: Color Coding Implementation
**Files:** `variables.css`, `components.css`

### 4.1 Mood Color Usage
**Existing Variables:**
```css
--mood-unwind: #7db5d4;    /* Blue - calm */
--mood-achieve: #88b88a;   /* Green - progress */
--mood-engage: #e8a868;    /* Orange - focus */
--mood-explore: #b885ba;   /* Purple - adventure */
--mood-challenge: #d47b78; /* Red - intensity */
--mood-recharge: #6eb5b8;  /* Teal - energy */
```

**Tasks:**
- [ ] Map mood chips to their colors on selection
- [ ] Add mood color to results card border
- [ ] Use mood color in recommendation reason text
- [ ] Create mood color badge component

### 4.2 Energy Level Colors
**New Variables Needed:**
```css
--energy-low: #7db5d4;     /* Cool blue - calm */
--energy-medium: #e8a868;  /* Warm orange - balanced */
--energy-high: #d47b78;    /* Warm red - energetic */
```

**Tasks:**
- [ ] Add energy color variables
- [ ] Apply to energy cards on selection
- [ ] Visual battery fill effect

### 4.3 Interruptibility Colors
```css
--interrupt-high: #88b88a;   /* Green - flexible */
--interrupt-medium: #e8a868; /* Orange - moderate */
--interrupt-low: #d47b78;    /* Red - locked in */
```

---

## Phase 5: Results Prominence
**Files:** `components.css`, `recommendation.js`

### 5.1 Results Container Transformation
**Current:** Side panel, always visible, empty placeholder
**New:** Below wizard, hidden until result, expands with animation

**Tasks:**
- [ ] Create slide-up animation for results
- [ ] Add celebration effect on recommendation (confetti or particles)
- [ ] Results card takes full width, prominent
- [ ] Match percentage displayed prominently with color

### 5.2 Game Card Redesign for Results
**Current:** Standard card in results panel
**New:** Hero-style card for primary recommendation

```
┌────────────────────────────────────────────────────────┐
│  ★ YOUR PERFECT MATCH                    92% Match    │
├────────────────────────────────────────────────────────┤
│  ┌────────────────┐                                   │
│  │                │   HADES                           │
│  │   [GAME IMG]   │   Roguelike • Action              │
│  │                │                                   │
│  │                │   ⏱️ 30-45 min  ⚡ High Energy    │
│  └────────────────┘   😌 Unwind, Challenge            │
│                                                        │
│  💡 Why this game?                                    │
│  "Fast-paced runs perfect for your energy level..."   │
│                                                        │
│  [ ▶️ Start Playing ]  [ 🔄 Try Another ]             │
│                                                        │
│  Rate this recommendation:  ⭐⭐⭐⭐⭐                │
└────────────────────────────────────────────────────────┘
```

**Tasks:**
- [ ] Create `.result-hero-card` component
- [ ] Large game image (400px width min)
- [ ] Match percentage with color coding
- [ ] Prominent "Why this game" section
- [ ] Action buttons clearly visible
- [ ] Inline rating (not separate section)

### 5.3 Alternative Recommendations
**Current:** Scrollable list below main result
**New:** Horizontal scroll of smaller cards

**Tasks:**
- [ ] Create `.alternatives-carousel` container
- [ ] Smaller card style for alternatives
- [ ] "See More" link to Games page with filters applied

---

## Phase 6: Remove/Deprecate Old Components
**Files:** `index.html`, `components.css`

### 6.1 Components to Remove
- [ ] Old `.input-panel` / `.results-panel` structure
- [ ] Wizard modal overlay (wizard is now inline)
- [ ] Wizard toggle floating button (no longer needed)
- [ ] Old `.radio-group` for energy/interruptibility

### 6.2 Components to Keep
- [ ] Theme/palette selector (keep floating button)
- [ ] Touch Grass modal (wellness feature)
- [ ] Loading spinner with quotes
- [ ] Advanced options toggles (repurposed)

---

## Phase 7: JavaScript Updates
**Files:** `js/wizard.js`, `js/form.js`, `js/recommendation.js`, `js/main.js`

### 7.1 Wizard.js Changes
**Tasks:**
- [ ] Remove modal-based wizard functions
- [ ] Convert to inline wizard state management
- [ ] Simplify navigation (no more question pages)
- [ ] Remove `startQuickSetup()`, `useFullForm()` etc.

### 7.2 Form.js Changes
**Tasks:**
- [ ] Update selectors for new component classes
- [ ] Simplify chip/option selection handlers
- [ ] Single source of truth for form state

### 7.3 Recommendation.js Changes
**Tasks:**
- [ ] Update `displayRecommendation()` for new results layout
- [ ] Add scroll-to-results behavior
- [ ] Add celebration animation trigger
- [ ] Update alternative recommendations display

### 7.4 Main.js Changes
**Tasks:**
- [ ] Update initialization for new home structure
- [ ] Remove wizard modal auto-show on first visit
- [ ] Simplify event listener setup

---

## Phase 8: Responsive Adjustments
**Files:** `layout.css`, `components.css`

### 8.1 Mobile (< 768px)
- [ ] Energy cards stack 1 column or 3 narrow
- [ ] Bottom nav icons only (no labels on very small screens)
- [ ] Time slider full width
- [ ] Results card stacks vertically

### 8.2 Tablet (768px - 1024px)
- [ ] Comfortable single column
- [ ] Bottom nav with labels
- [ ] Adequate spacing

### 8.3 Desktop (> 1024px)
- [ ] Max-width container (800px)
- [ ] Centered content
- [ ] Optional: side margins with decorative elements

---

## Implementation Order

### Sprint 1: Foundation (Phases 1-2)
1. ✅ Create this plan document
2. Navigation overhaul (bottom bar)
3. New home page HTML structure
4. Basic new CSS layout

### Sprint 2: Components (Phases 3-4)
5. Energy cards component
6. Enhanced time slider
7. Enhanced mood chips
8. Color coding implementation

### Sprint 3: Results & Polish (Phases 5-6)
9. Results container redesign
10. Hero game card
11. Alternatives carousel
12. Remove deprecated components

### Sprint 4: JavaScript & Testing (Phases 7-8)
13. Update JavaScript modules
14. Responsive testing
15. Cross-browser testing
16. Final polish

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Major restructure of home-page section |
| `css/layout.css` | Nav position, page layout |
| `css/components.css` | New components, updated existing |
| `css/variables.css` | New color variables |
| `js/wizard.js` | Convert from modal to inline |
| `js/form.js` | Update selectors |
| `js/recommendation.js` | New results display |
| `js/main.js` | Simplified init |
| `js/tabs.js` | Bottom nav adjustments |

---

## Success Criteria

1. **First Interaction** - User can get a recommendation in < 30 seconds
2. **Visual Clarity** - Clear hierarchy, no competing elements
3. **Touch Friendly** - All interactive elements 44px+ touch target
4. **Color Meaning** - Users understand mood/energy through color
5. **Results Celebration** - Recommendation feels rewarding
6. **Mobile First** - Works great on phone, scales up to desktop
7. **Advanced Access** - Power users can still access all options

---

## Questions to Resolve Before Starting

1. **Interruptibility Question** - Keep in quick flow or move to advanced?
   - Recommendation: Keep in quick flow (it's only 4 inputs total)

2. **Social Preference** - Keep or remove?
   - Recommendation: Move to advanced options

3. **Time of Day** - Keep or remove?
   - Recommendation: Move to advanced, auto-detect as default

4. **Genre Preferences** - Keep toggle or hide deeper?
   - Recommendation: Keep as collapsible section

---

## Rollback Plan

If redesign doesn't work:
1. All changes on `refactor/home-redesign` branch
2. Keep backup of current `index.html` as `index.html.backup`
3. CSS changes in new files, not overwriting existing
4. Can revert to main branch at any time

---

*Created: [Current Date]*
*Status: PLANNING*
*Next Step: Get approval, then start Sprint 1*
