# Frontend Refactoring Plan: Splitting the Monolithic index.html

**Created:** November 26, 2025  
**Last Updated:** November 27, 2025 19:15  
**Status:** 🔄 Phase 7 NEXT - Link JS Files & Remove Embedded Scripts  
**Original Lines:** 5,706  
**Current Lines:** 3,124 (JS files created but not yet linked)  

---

## Current State (Updated Nov 27, 2025 19:15)

| File | Lines | Status |
|------|-------|--------|
| `index.html` | 3,124 | CSS extracted, JS modules created but NOT linked yet |
| `index.html.backup` | 5,706 | Original backup (intact) |
| `css/variables.css` | 319 | ✅ Linked |
| `css/themes.css` | 19 | ✅ Linked |
| `css/base.css` | 150 | ✅ Linked |
| `css/components.css` | 1,604 | ✅ Linked |
| `css/layout.css` | 161 | ✅ Linked |
| `css/pages/calendar.css` | 121 | ✅ Linked |
| `games-data.js` | 55 | ✅ Linked |
| `demo-mode.js` | 298 | ✅ Linked |
| `js/constants.js` | 30 | ✅ Created |
| `js/state.js` | 25 | ✅ Created |
| `js/utils.js` | 50 | ✅ Created |
| `js/theme.js` | 110 | ✅ Created |
| `js/wizard.js` | 150 | ✅ Created |
| `js/form.js` | 115 | ✅ Created |
| `js/validation.js` | 90 | ✅ Created |
| `js/api.js` | 147 | ✅ Created |
| `js/recommendation.js` | 530 | ✅ Created |
| `js/tabs.js` | 59 | ✅ Created |
| `js/games-library.js` | 389 | ✅ Created |
| `js/profile.js` | 140 | ✅ Created |
| `js/calendar.js` | 327 | ✅ Created |
| `js/main.js` | 56 | ✅ Created |

---

## Execution Phases

### Phase 0: Preparation ✅ COMPLETE (Nov 26)
- [x] Create feature branch: `refactor/frontend-split`
- [x] Create directory structure: `css/`, `css/pages/`
- [x] Create backup: `index.html.backup`

### Phase 1: Extract CSS Variables & Themes ✅ COMPLETE (Nov 26)
- [x] Create `css/variables.css` (319 lines)
- [x] Create `css/themes.css` (19 lines)

### Phase 2: Extract Base & Component CSS ✅ COMPLETE (Nov 27)
- [x] Create `css/base.css` (150 lines)
- [x] Create `css/components.css` (1,604 lines with Profile CSS)
- [x] Create `css/layout.css` (161 lines)
- [x] Add CSS `<link>` tags to index.html
- [x] Remove main embedded `<style>` block (2,541 lines removed)
- [x] Fix orphaned HTML after `</html>` (12 lines removed)
- [x] Add Profile CSS to components.css (300 lines added)

### Phase 3: Extract Page-Specific CSS ✅ COMPLETE (Nov 27)
- [x] Link `css/pages/calendar.css` (already existed)
- [x] Remove embedded calendar `<style>` block (33 lines removed)
- [x] Fix missing JS files (copied from docs/)
- [x] Fix `switchNav is not defined` bug (pre-existing JS issue)

### Phase 4: Core State & Utilities ✅ COMPLETE (Nov 27)
- [x] Create `js/` directory
- [x] Create `js/constants.js` (gaming quotes, time values)
- [x] Create `js/state.js` (global state variables)
- [x] Create `js/utils.js` (toast notifications, helpers)

### Phase 5: Theme & UI Components ✅ COMPLETE (Nov 27)
- [x] Create `js/theme.js` (theme/palette switching)
- [x] Create `js/wizard.js` (guided modal flow)
- [x] Create `js/form.js` (slider, mood buttons)
- [x] Create `js/validation.js` (form validation)

### Phase 6: API & Feature Modules ✅ COMPLETE (Nov 27)
- [x] Create `js/api.js` (backend communication)
- [x] Create `js/recommendation.js` (display logic, feedback, maximized view)
- [x] Create `js/tabs.js` (tab navigation)
- [x] Create `js/games-library.js` (games page filtering, cards, display)
- [x] Create `js/profile.js` (profile save/load)
- [x] Create `js/calendar.js` (FullCalendar init, events, modals)
- [x] Create `js/main.js` (initialization orchestration)

### Phase 7: Link JS Files & Remove Embedded Scripts 🔄 NEXT
- [ ] Add `<script>` tags for all JS modules in index.html `<head>`
- [ ] Remove embedded `<script>` block 1 (lines 522-1636)
- [ ] Remove embedded `<script>` block 2 (lines 2073-3022)
- [ ] Test all pages work correctly
- [ ] Fix any missing function references

### Phase 8: Final Cleanup ⬜ NOT STARTED
- [ ] Remove any remaining embedded JavaScript
- [ ] Verify all external files linked correctly
- [ ] Target: index.html should be ~500-600 lines (HTML only)

### Phase 9: Testing & Documentation ⬜ NOT STARTED
- [ ] Test all theme combinations (8 total)
- [ ] Test demo mode (GitHub Pages)
- [ ] Test backend mode (local development)
- [ ] Update README with new file structure
- [ ] Update CHANGELOG.md
- [ ] Commit and push to GitHub

---

## Progress Tracker

| Phase | Description | Status | Date |
|-------|-------------|--------|------|
| 0 | Preparation | ✅ | Nov 26 |
| 1 | CSS Variables & Themes | ✅ | Nov 26 |
| 2 | Base & Component CSS | ✅ | Nov 27 |
| 3 | Page-Specific CSS | ✅ | Nov 27 |
| 4 | Core State & Utilities | ✅ | Nov 27 |
| 5 | Theme & UI Components | ✅ | Nov 27 |
| 6 | API & Feature Modules | ✅ | Nov 27 |
| 7 | Link JS & Remove Embedded | 🔄 | Next |
| 8 | Final Cleanup | ⬜ | - |
| 9 | Testing & Documentation | ⬜ | - |

---

## JavaScript Module Structure (Complete)

```
frontend/js/
├── constants.js      - Gaming quotes, time values (30 lines)
├── state.js          - State management (25 lines)
├── utils.js          - Utility functions (50 lines)
├── theme.js          - Theme/palette functionality (110 lines)
├── wizard.js         - Guided modal/wizard functions (150 lines)
├── form.js           - Main form interactions (115 lines)
├── validation.js     - Form validation (90 lines)
├── api.js            - API communication (147 lines)
├── recommendation.js - Recommendation display/handling (530 lines)
├── tabs.js           - Tab navigation (59 lines)
├── games-library.js  - Games page functionality (389 lines)
├── profile.js        - Profile page functionality (140 lines)
├── calendar.js       - Calendar functionality (327 lines)
└── main.js           - Main initialization (56 lines)

Total: ~2,218 lines of modular JavaScript
```

---

## Script Loading Order (for Phase 7)

The scripts must be loaded in dependency order:

```html
<!-- Core modules (no dependencies) -->
<script src="js/constants.js"></script>
<script src="js/state.js"></script>
<script src="js/utils.js"></script>

<!-- UI modules (depend on core) -->
<script src="js/theme.js"></script>
<script src="js/wizard.js"></script>
<script src="js/form.js"></script>
<script src="js/validation.js"></script>

<!-- Feature modules (depend on core + UI) -->
<script src="js/api.js"></script>
<script src="js/recommendation.js"></script>
<script src="js/tabs.js"></script>
<script src="js/games-library.js"></script>
<script src="js/profile.js"></script>
<script src="js/calendar.js"></script>

<!-- Main init (depends on all above) -->
<script src="js/main.js"></script>
```

---

## Rollback Plan

```bash
# Restore from backup
copy frontend\index.html.backup frontend\index.html
```

---

## Session Summary (Nov 27, 2025)

**Earlier work (Phases 2-5):**
- CSS fully extracted to external files
- Core JS modules created (constants, state, utils, theme, wizard, form, validation, api, recommendation)

**Phase 6 Work (current session):**
1. Created `js/tabs.js` (59 lines) - Tab navigation functionality
2. Created `js/games-library.js` (389 lines) - Full games page with filtering, cards, rendering
3. Created `js/profile.js` (140 lines) - Profile save/load functionality  
4. Created `js/calendar.js` (327 lines) - FullCalendar init, event management, modals
5. Created `js/main.js` (56 lines) - Main initialization orchestrator

**All 14 JS modules now created!**

**Next step (Phase 7):**
- Add `<script>` tags to index.html in correct order
- Remove the two embedded `<script>` blocks
- Test all functionality

---

*Last updated: November 27, 2025 19:15 - Phase 6 COMPLETE, Phase 7 NEXT*
