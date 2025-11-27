# Frontend Refactoring Plan: Splitting the Monolithic index.html

**Created:** November 26, 2025  
**Last Updated:** November 27, 2025 18:10  
**Status:** 🔄 Phase 6 IN PROGRESS - JavaScript Extraction  
**Original Lines:** 5,706  
**Current Lines:** 3,124  

---

## Current State (Updated Nov 27, 2025 18:10)

| File | Lines | Status |
|------|-------|--------|
| `index.html` | 3,124 | CSS extracted, JS extraction in progress |
| `index.html.backup` | 5,706 | Original backup (intact) |
| `css/variables.css` | 319 | ✅ Linked |
| `css/themes.css` | 19 | ✅ Linked |
| `css/base.css` | 150 | ✅ Linked |
| `css/components.css` | 1,604 | ✅ Linked |
| `css/layout.css` | 161 | ✅ Linked |
| `css/pages/calendar.css` | 121 | ✅ Linked |
| `games-data.js` | 55 | ✅ Copied from docs/ |
| `demo-mode.js` | 298 | ✅ Copied from docs/ |
| `js/constants.js` | ~30 | ✅ Created |
| `js/state.js` | ~25 | ✅ Created |
| `js/utils.js` | ~50 | ✅ Created |
| `js/theme.js` | ~110 | ✅ Created |
| `js/wizard.js` | ~150 | ✅ Created |
| `js/form.js` | ~115 | ✅ Created |
| `js/validation.js` | ~90 | ✅ Created |
| `js/api.js` | ~147 | ✅ Created |
| `js/recommendation.js` | ~530 | ✅ Created |

---

## JavaScript Analysis (Phase 4 Preparation)

### Script Block 1 (lines 522-1636) - HOME PAGE FUNCTIONALITY
| Section | Lines | Description |
|---------|-------|-------------|
| GAMING QUOTES | 523-555 | Loading screen quotes array |
| STATE MANAGEMENT | 557-580 | Global state variables |
| THEME & PALETTE TOGGLE | 581-690 | Theme switching functionality |
| WIZARD TOGGLE | 691-707 | Show/hide wizard modal |
| GUIDED MODAL FUNCTIONS | 708-857 | Step-by-step wizard flow |
| TOUCH GRASS MODAL | 858-880 | Session time warning modal |
| MAIN FORM INTERACTIONS | 881-995 | Sliders, mood buttons, input handling |
| VALIDATION | 996-1082 | Form validation logic |
| API COMMUNICATION | 1083-1456 | Backend API calls, recommendation display |
| MAXIMIZED GAME VIEW | 1457-1622 | Full-screen game detail view |
| INIT ON PAGE LOAD | 1623-1636 | DOMContentLoaded initialization |

### Script Block 2 (lines 2073-3022) - TAB PAGES FUNCTIONALITY
| Section | Lines | Description |
|---------|-------|-------------|
| TAB NAVIGATION | 2074-2112 | Tab switching logic |
| GAMES LIBRARY FUNCTIONALITY | 2113-2523 | Game browsing, filtering, sorting |
| PROFILE PAGE FUNCTIONALITY | 2524-2652 | User preferences, settings |
| CALENDAR FUNCTIONALITY | 2653-2719 | FullCalendar initialization |
| CALENDAR-WIZARD INTEGRATION | 2720-2779 | Calendar to recommendation flow |
| EVENT MANAGEMENT FUNCTIONS | 2780-2955 | Add/edit/delete calendar events |
| UTILITY FUNCTIONS | 2956-3022 | Toast notifications, helpers |

---

## Planned JavaScript Module Structure

```
frontend/js/
├── constants.js      - Gaming quotes, time values
├── state.js          - State management
├── theme.js          - Theme/palette functionality
├── wizard.js         - Guided modal/wizard functions
├── form.js           - Main form interactions
├── validation.js     - Form validation
├── api.js            - API communication
├── recommendation.js - Recommendation display/handling
├── tabs.js           - Tab navigation
├── games-library.js  - Games page functionality
├── profile.js        - Profile page functionality
├── calendar.js       - Calendar functionality
├── utils.js          - Utility functions (toast, date formatting)
└── main.js           - Main initialization
```

---

## Completed Issues

### Issue 1: Orphaned HTML after `</html>` ✅ FIXED
- **Fixed:** Nov 27, 2025 15:00
- Removed 12 lines of invalid HTML after closing tags

### Issue 2: Missing Profile Page CSS ✅ FIXED
- **Fixed:** Nov 27, 2025 15:02
- Extracted ~300 lines of Profile CSS from backup → appended to `css/components.css`

### Issue 3: Embedded calendar `<style>` block ✅ FIXED
- **Fixed:** Nov 27, 2025 15:12
- Moved to `css/pages/calendar.css` (already existed, just needed linking)
- Added `<link>` tag to head
- Removed 33 lines of embedded CSS

### Issue 4: Missing JS files ✅ FIXED
- **Fixed:** Nov 27, 2025 15:30
- `games-data.js` and `demo-mode.js` were in `docs/` but referenced from `frontend/`
- Copied both files to `frontend/` folder

### Issue 5: `switchNav is not defined` error ✅ FIXED
- **Fixed:** Nov 27, 2025 15:31
- Pre-existing bug: calendar init code referenced non-existent `switchNav` function
- Moved calendar initialization into the existing tab navigation event listener
- Removed 11 lines of broken code, added 6 lines of working code

### Known Remaining Issues (to address later)
- Console still shows some errors (deferred to later phase)

---

## Execution Phases

### Phase 0: Preparation
**Status:** ✅ COMPLETE (Nov 26)

- [x] Create feature branch: `refactor/frontend-split`
- [x] Create directory structure: `css/`, `css/pages/`
- [x] Create backup: `index.html.backup`

---

### Phase 1: Extract CSS Variables & Themes
**Status:** ✅ COMPLETE (Nov 26)

- [x] Create `css/variables.css` (319 lines)
- [x] Create `css/themes.css` (19 lines)

---

### Phase 2: Extract Base & Component CSS
**Status:** ✅ COMPLETE (Nov 27)

- [x] Create `css/base.css` (150 lines)
- [x] Create `css/components.css` (1,604 lines with Profile CSS)
- [x] Create `css/layout.css` (161 lines)
- [x] Add CSS `<link>` tags to index.html
- [x] Remove main embedded `<style>` block (2,541 lines removed)
- [x] Fix orphaned HTML after `</html>` (12 lines removed)
- [x] Add Profile CSS to components.css (300 lines added)
- [x] Test all pages render correctly ✅
- [x] Test theme combinations ✅

---

### Phase 3: Extract Page-Specific CSS
**Status:** ✅ COMPLETE (Nov 27)

- [x] Link `css/pages/calendar.css` (already existed)
- [x] Remove embedded calendar `<style>` block (33 lines removed)
- [x] Fix missing JS files (copied from docs/)
- [x] Fix `switchNav is not defined` bug (pre-existing JS issue)
- [x] Test calendar page renders correctly ✅

---

### Phase 4-7: JavaScript Extraction
**Status:** 🔄 IN PROGRESS

#### Phase 4: Core State & Utilities ✅ COMPLETE
- [x] Create `js/` directory
- [x] Create `js/constants.js` (gaming quotes, time values)
- [x] Create `js/state.js` (global state variables)
- [x] Create `js/utils.js` (toast notifications, helpers)

#### Phase 5: Theme & UI Components ✅ COMPLETE
- [x] Create `js/theme.js` (theme/palette switching)
- [x] Create `js/wizard.js` (guided modal flow)
- [x] Create `js/form.js` (slider, mood buttons)
- [x] Create `js/validation.js` (form validation)

#### Phase 6: API & Feature Modules 🔄 IN PROGRESS
- [x] Create `js/api.js` (backend communication)
- [x] Create `js/recommendation.js` (display logic, feedback, maximized view)
- [ ] Create `js/tabs.js` (tab navigation)
- [ ] Create `js/games-library.js` (games page)
- [ ] Create `js/profile.js` (profile page)
- [ ] Create `js/calendar.js` (calendar functionality)
- [ ] Test all tabs work correctly

#### Phase 7: Main Entry Point
- [ ] Create `js/main.js` (initialization orchestration)
- [ ] Update index.html with `<script>` tags
- [ ] Remove embedded `<script>` blocks
- [ ] Test full application

---

### Phase 8: Final index.html Cleanup
**Status:** ⬜ NOT STARTED

- [ ] Remove all embedded JavaScript
- [ ] Verify all external files linked correctly
- [ ] Final line count should be ~500-600 lines (HTML only)

---

### Phase 9: Testing & Documentation
**Status:** ⬜ NOT STARTED

- [ ] Test all theme combinations (8 total)
- [ ] Test demo mode (GitHub Pages)
- [ ] Test backend mode (local development)
- [ ] Update README with new file structure
- [ ] Update CHANGELOG.md

---

## Progress Tracker

| Phase | Description | Status | Notes |
|-------|-------------|--------|-------|
| 0 | Preparation | ✅ | Nov 26 |
| 1 | CSS Variables & Themes | ✅ | Nov 26 |
| 2 | Base & Component CSS | ✅ | Nov 27 |
| 3 | Page-Specific CSS | ✅ | Nov 27 - Also fixed JS bugs |
| 4 | Core State & Utilities | 🔄 | In Progress |
| 5 | Theme & UI Components | ⬜ | - |
| 6 | API & Feature Modules | ⬜ | - |
| 7 | Main Entry Point | ⬜ | - |
| 8 | Update index.html | ⬜ | - |
| 9 | Testing & Cleanup | ⬜ | - |

---

## Rollback Plan

```bash
# Restore from backup
copy frontend\index.html.backup frontend\index.html
```

---

## Session Summary (Nov 27, 2025)

**Phase 2 Work (earlier):**
1. Fixed orphaned HTML after `</html>` - removed 12 lines
2. Extracted Profile CSS from backup → `css/components.css` - added ~300 lines
3. Tested all 4 tabs and themes working

**Phase 3 Work:**
1. Linked existing `css/pages/calendar.css` to `<head>`
2. Removed embedded calendar `<style>` block (33 lines)
3. Discovered and fixed pre-existing bugs:
   - Missing `games-data.js` and `demo-mode.js` in frontend/ (copied from docs/)
   - `switchNav is not defined` error (moved calendar init to tab navigation)
4. Calendar now renders correctly

**Phase 4 Work (current):**
1. Analyzed JavaScript structure in index.html
2. Identified two script blocks (lines 522-1636 and 2073-3022)
3. Mapped all JavaScript sections to planned modules
4. Beginning extraction...

**Current file sizes:**
- `index.html`: 3,124 lines (down from original 5,706 - reduced by 45%)
- All CSS now in external files
- Demo mode JS files now in correct location

**Target after JS extraction:**
- `index.html`: ~500-600 lines (HTML structure only)

---

*Last updated: November 27, 2025 17:00 - Phase 4 IN PROGRESS*
