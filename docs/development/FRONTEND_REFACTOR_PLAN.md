# Frontend Refactoring Plan: Splitting the Monolithic index.html

**Created:** November 26, 2025  
**Last Updated:** November 27, 2025 21:00  
**Status:** ✅ Phase 7 COMPLETE - Phase 8 NEXT  
**Original Lines:** 5,706  
**Current Lines:** 1,078 (HTML only - all CSS/JS extracted)  

---

## Current State (Updated Nov 27, 2025 21:00)

| File | Lines | Status |
|------|-------|--------|
| `index.html` | 1,078 | ✅ Pure HTML - all CSS & JS extracted |
| `index.html.backup` | 5,706 | Original backup (intact) |
| `css/variables.css` | 319 | ✅ Linked |
| `css/themes.css` | 19 | ✅ Linked |
| `css/base.css` | 150 | ✅ Linked |
| `css/components.css` | 1,604 | ✅ Linked |
| `css/layout.css` | 161 | ✅ Linked |
| `css/pages/calendar.css` | 121 | ✅ Linked |
| `games-data.js` | 55 | ✅ Linked |
| `demo-mode.js` | 298 | ✅ Linked |
| `js/constants.js` | 30 | ✅ Linked |
| `js/state.js` | 25 | ✅ Linked |
| `js/utils.js` | 50 | ✅ Linked |
| `js/theme.js` | 110 | ✅ Linked |
| `js/wizard.js` | 150 | ✅ Linked |
| `js/form.js` | 115 | ✅ Linked |
| `js/validation.js` | 90 | ✅ Linked |
| `js/api.js` | 147 | ✅ Linked |
| `js/recommendation.js` | 530 | ✅ Linked |
| `js/tabs.js` | 59 | ✅ Linked |
| `js/games-library.js` | 389 | ✅ Linked |
| `js/profile.js` | 140 | ✅ Linked |
| `js/calendar.js` | 327 | ✅ Linked |
| `js/main.js` | 56 | ✅ Linked |

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

### Phase 7: Link JS Files & Remove Embedded Scripts ✅ COMPLETE (Nov 27)
- [x] Add `<script>` tags for all JS modules in index.html
- [x] Remove all embedded `<script>` blocks
- [x] Verify scripts load in correct dependency order
- [x] index.html reduced from 5,706 to 1,078 lines

### Phase 8: Final Cleanup & Testing 🔄 NEXT
- [ ] Test all 4 pages (Home, Calendar, Games, Profile)
- [ ] Test all 8 theme combinations (4 palettes × light/dark)
- [ ] Test demo mode (GitHub Pages compatibility)
- [ ] Test backend mode (local development with Spring Boot)
- [ ] Fix any console errors or broken functionality
- [ ] Remove any remaining inline styles that should be in CSS

### Phase 9: Documentation & Commit ⬜ NOT STARTED
- [ ] Update README with new file structure
- [ ] Update CHANGELOG.md with refactoring summary
- [ ] Commit all changes to refactor branch
- [ ] Create pull request or merge to main
- [ ] Push to GitHub

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
| 7 | Link JS & Remove Embedded | ✅ | Nov 27 |
| 8 | Final Cleanup & Testing | 🔄 | Next |
| 9 | Documentation & Commit | ⬜ | - |

---

## Final File Structure

```
frontend/
├── index.html              (1,078 lines - pure HTML)
├── index.html.backup       (5,706 lines - original)
├── games-data.js           (55 lines - game data for demo)
├── demo-mode.js            (298 lines - GitHub Pages support)
├── lutem-logo.png
├── css/
│   ├── variables.css       (319 lines - CSS custom properties)
│   ├── themes.css          (19 lines - theme class definitions)
│   ├── base.css            (150 lines - reset, typography)
│   ├── components.css      (1,604 lines - buttons, cards, modals)
│   ├── layout.css          (161 lines - grid, containers)
│   └── pages/
│       └── calendar.css    (121 lines - FullCalendar overrides)
└── js/
    ├── constants.js        (30 lines - quotes, config values)
    ├── state.js            (25 lines - global state)
    ├── utils.js            (50 lines - helper functions)
    ├── theme.js            (110 lines - theme switching)
    ├── wizard.js           (150 lines - quick start wizard)
    ├── form.js             (115 lines - form interactions)
    ├── validation.js       (90 lines - input validation)
    ├── api.js              (147 lines - backend API calls)
    ├── recommendation.js   (530 lines - game recommendations)
    ├── tabs.js             (59 lines - tab navigation)
    ├── games-library.js    (389 lines - games page)
    ├── profile.js          (140 lines - profile page)
    ├── calendar.js         (327 lines - calendar page)
    └── main.js             (56 lines - initialization)
```

**Total CSS:** ~2,374 lines across 6 files  
**Total JS:** ~2,218 lines across 14 modules  
**HTML:** 1,078 lines (down from 5,706 - **81% reduction**)

---

## Script Loading Order

Scripts are loaded in dependency order at the end of `<body>`:

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
# Restore from backup if needed
copy frontend\index.html.backup frontend\index.html
```

---

## Refactoring Summary

### Before (Nov 26, 2025)
- Single monolithic `index.html` with 5,706 lines
- All CSS embedded in `<style>` tags
- All JavaScript embedded in `<script>` tags
- Difficult to maintain, debug, and extend

### After (Nov 27, 2025)
- Clean `index.html` with only 1,078 lines of pure HTML
- CSS organized into 6 logical files
- JavaScript split into 14 focused modules
- Clear separation of concerns
- Easy to find and modify specific functionality
- **81% reduction in index.html size**

---

*Last updated: November 27, 2025 21:00 - Phase 7 COMPLETE, Phase 8 NEXT*
