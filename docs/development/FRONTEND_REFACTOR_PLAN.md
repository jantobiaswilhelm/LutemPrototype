# Frontend Refactoring Plan: Splitting the Monolithic index.html

**Created:** November 26, 2025  
**Status:** 🟡 IN PROGRESS  
**Total Lines:** 5,706  
**Estimated Effort:** 2-4 hours

---

## Current State Analysis

The frontend is a single `index.html` file with embedded CSS and JavaScript. Here's the breakdown:

| Section | Lines | Size | Description |
|---------|-------|------|-------------|
| HTML Head | 1-10 | 10 | DOCTYPE, meta, fonts |
| **CSS Block** | 11-2552 | **2,541** | All styles, themes, components |
| External Links | 2553-2562 | 10 | FullCalendar, demo scripts |
| **HTML Body** | 2563-3054 | **491** | All page content, modals |
| **Main JS** | 3055-4604 | **1,549** | Core app logic |
| **Tab/Games JS** | 4605-5593 | **988** | Tab nav, games library, calendar |
| ⚠️ Orphaned HTML | 5594-5706 | 112 | **BUG: Content after `</html>`** |

---

## Target Structure

```
frontend/
├── index.html              # HTML only (~250 lines)
├── css/
│   ├── variables.css       # CSS custom properties, theme definitions
│   ├── base.css            # Reset, typography, body styles
│   ├── components.css      # Cards, buttons, modals, inputs
│   ├── layout.css          # Grid, navigation, responsive
│   ├── pages/
│   │   ├── home.css        # Home page specific
│   │   ├── games.css       # Games library specific
│   │   ├── profile.css     # Profile page specific
│   │   └── calendar.css    # Calendar page specific
│   └── themes.css          # All 4 palettes × 2 modes
├── js/
│   ├── app.js              # Entry point, initialization
│   ├── state.js            # State management
│   ├── api.js              # Backend communication
│   ├── ui.js               # DOM manipulation helpers
│   ├── themes.js           # Theme switching logic
│   ├── pages/
│   │   ├── home.js         # Home page logic, wizard
│   │   ├── games.js        # Games library logic
│   │   ├── profile.js      # Profile page logic
│   │   └── calendar.js     # Calendar functionality
│   └── navigation.js       # Tab navigation
├── assets/
│   └── lutem-logo.png
├── games-data.js           # Demo mode data (existing)
└── demo-mode.js            # Demo mode logic (existing)
```

---

## Execution Phases


### Phase 0: Preparation (5 min)
**Status:** ✅ COMPLETE

- [x] Create feature branch: `git checkout -b refactor/frontend-split`
- [x] Create directory structure: `css/`, `css/pages/`, `js/`, `js/pages/`, `assets/`
- [x] Fix orphaned HTML bug (lines 5594-5706 after `</html>`) - Removed 12 lines
- [x] Verify app works before changes

---

### Phase 1: Extract CSS Variables & Themes (30 min)
**Status:** ✅ COMPLETE

**Source:** Lines 11-350 (approximately)

**Tasks:**
- [x] Create `css/variables.css` - Extract all CSS custom properties
  - Light mode defaults (:root)
  - Café dark mode
  - Lavender light/dark
  - Earth light/dark  
  - Ocean light/dark
- [x] Create `css/themes.css` - Theme-specific component overrides
- [x] Link both files in index.html
- [ ] Test all 8 theme combinations work (manual verification needed)

**Verification:** Toggle through all palettes + light/dark modes

---

### Phase 2: Extract Base & Component CSS (30 min)
**Status:** 🟡 IN PROGRESS

**Source:** Lines 350-1500 (approximately)

**Tasks:**
- [x] Create `css/base.css` - Body, typography, reset, animations, header
- [x] Create `css/components.css` - Extract buttons, cards (partial)
- [x] Create `css/layout.css` - Navigation, grid, responsive
- [x] Link all CSS files in index.html
- [ ] Extract more component styles (modals, forms, loading spinners)
- [ ] Remove duplicated embedded CSS from index.html

**Notes:**
- Files created and linked but embedded CSS still remains
- This creates some duplication but app works
- Next: gradually migrate more styles and remove embedded duplicates

**Verification:** All UI elements render correctly

---

### Phase 3: Extract Page-Specific CSS (20 min)
**Status:** ⬜ NOT STARTED

**Source:** Lines 1500-2552 + Lines 5550-5593 (calendar styles)

**Tasks:**
- [ ] Create `css/pages/home.css` - Wizard, recommendation display
- [ ] Create `css/pages/games.css` - Games grid, filters
- [ ] Create `css/pages/profile.css` - Profile settings
- [ ] Create `css/pages/calendar.css` - FullCalendar overrides

**Verification:** Each page tab displays correctly

---

### Phase 4: Extract State & API JavaScript (30 min)
**Status:** ⬜ NOT STARTED

**Source:** Lines 3055-3200 (approximately)

**Tasks:**
- [ ] Create `js/state.js` - Extract:
  - `state` object
  - `GAMING_QUOTES` array
  - `TIME_VALUES` array
  - State helper functions
- [ ] Create `js/api.js` - Extract:
  - `API_BASE` constant
  - `isDemoMode()` function
  - `getRecommendation()` function
  - `submitFeedback()` function
  - All fetch calls

**Verification:** Recommendations and feedback still work

---

### Phase 5: Extract UI Helpers JavaScript (20 min)
**Status:** ⬜ NOT STARTED

**Source:** Lines 3200-3600 (approximately)

**Tasks:**
- [ ] Create `js/ui.js` - Extract:
  - `showResultWithFadeIn()` 
  - `displayRecommendation()`
  - `updateTimeDisplay()`
  - `formatDuration()`
  - Generic DOM helpers
- [ ] Create `js/themes.js` - Extract:
  - Palette switching logic
  - Dark mode toggle
  - `localStorage` persistence

**Verification:** UI updates work, themes persist

---


### Phase 6: Extract Page-Specific JavaScript (45 min)
**Status:** ⬜ NOT STARTED

**Source:** Lines 3600-5593

**Tasks:**
- [ ] Create `js/pages/home.js` - Extract:
  - Wizard logic (guided modal)
  - Quick start functions
  - Advanced form handlers
  - Recommendation request/display
  - Feedback submission
  - Touch Grass modal
- [ ] Create `js/pages/games.js` - Extract:
  - `loadGamesLibrary()`
  - `filterGames()`
  - `renderGameCard()`
  - Search and filter handlers
- [ ] Create `js/pages/profile.js` - Extract:
  - Genre preference handlers
  - Profile form logic
- [ ] Create `js/pages/calendar.js` - Extract:
  - FullCalendar initialization
  - Event handling
  - Add/edit/delete task modals

**Verification:** All pages function correctly

---

### Phase 7: Create Main Entry Point (15 min)
**Status:** ⬜ NOT STARTED

**Tasks:**
- [ ] Create `js/app.js` - Main initialization:
  - Import order management
  - DOMContentLoaded handler
  - Initialize theme from localStorage
  - Set up event listeners
  - Start on home page
- [ ] Create `js/navigation.js` - Tab navigation logic

**Verification:** App initializes and navigates correctly

---

### Phase 8: Update index.html (15 min)
**Status:** ⬜ NOT STARTED

**Tasks:**
- [ ] Remove all `<style>` blocks
- [ ] Remove all `<script>` blocks (except external CDN)
- [ ] Add CSS `<link>` tags in correct order:
  ```html
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/themes.css">
  <link rel="stylesheet" href="css/pages/home.css">
  <link rel="stylesheet" href="css/pages/games.css">
  <link rel="stylesheet" href="css/pages/profile.css">
  <link rel="stylesheet" href="css/pages/calendar.css">
  ```
- [ ] Add JS `<script>` tags at end of body:
  ```html
  <script src="js/state.js"></script>
  <script src="js/api.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/themes.js"></script>
  <script src="js/navigation.js"></script>
  <script src="js/pages/home.js"></script>
  <script src="js/pages/games.js"></script>
  <script src="js/pages/profile.js"></script>
  <script src="js/pages/calendar.js"></script>
  <script src="js/app.js"></script>
  ```
- [ ] Fix orphaned HTML (remove or integrate lines 5594-5706)

**Verification:** App loads and all features work

---

### Phase 9: Final Testing & Cleanup (15 min)
**Status:** ⬜ NOT STARTED

**Tasks:**
- [ ] Test all 4 pages (Home, Calendar, Games, Profile)
- [ ] Test all 8 theme combinations
- [ ] Test wizard flow (quick start)
- [ ] Test advanced form
- [ ] Test games library filters
- [ ] Test recommendations
- [ ] Test feedback submission
- [ ] Verify demo mode works (GitHub Pages)
- [ ] Update `docs/ARCHITECTURE.md` with new structure
- [ ] Commit with detailed message

---

## Progress Tracker

| Phase | Description | Status | Completed By |
|-------|-------------|--------|--------------|
| 0 | Preparation | ✅ | Nov 26, 2025 |
| 1 | CSS Variables & Themes | ✅ | Nov 26, 2025 |
| 2 | Base & Component CSS | 🟡 | In Progress |
| 3 | Page-Specific CSS | ⬜ | - |
| 4 | State & API JS | ⬜ | - |
| 5 | UI Helpers JS | ⬜ | - |
| 6 | Page-Specific JS | ⬜ | - |
| 7 | Main Entry Point | ⬜ | - |
| 8 | Update index.html | ⬜ | - |
| 9 | Testing & Cleanup | ⬜ | - |

---

## Risk Mitigation

1. **Global variable conflicts:** Use IIFE or namespace pattern
2. **Load order issues:** Define dependencies clearly
3. **Demo mode breaks:** Test on GitHub Pages after each phase
4. **Theme persistence:** Verify localStorage works across files

---

## Rollback Plan

If issues arise:
```bash
git checkout main -- frontend/
```

Original file preserved at `frontend/index.html.backup` before starting.

---

## Notes

- Keep demo mode compatibility (games-data.js, demo-mode.js)
- FullCalendar CDN links stay in HTML
- Don't use ES modules (keep it simple for GitHub Pages)
- Test after each phase before proceeding

---

*Last updated: November 26, 2025 - Phase 1 validated and completed*
