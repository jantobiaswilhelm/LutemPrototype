# Lutem Bug Tracker

This file tracks known bugs, their status, and resolution details.

## Bug Status Legend

| Status | Description |
|--------|-------------|
| 🔴 OPEN | Bug confirmed, not yet fixed |
| 🟡 IN PROGRESS | Currently being worked on |
| 🟢 FIXED | Bug has been resolved |
| ⚪ WONTFIX | Decided not to fix (with reason) |
| 🔵 CANNOT REPRODUCE | Unable to reproduce the issue |

---

## Active Bugs

_All bugs from initial report have been addressed. See Resolved Bugs below._

---

## Resolved Bugs

### BUG-007: Mood tags not rendering in game cards
- **Status:** 🟢 FIXED
- **Severity:** Medium
- **Reported:** 2025-11-27
- **Fixed:** 2025-11-27
- **Component:** Frontend - Games Tab
- **Root Cause:** games-library.js `createGameCard()` was accessing `goal.name` but demo data stores emotional goals as strings directly (e.g., "UNWIND") not objects (e.g., {name: "UNWIND"}). The filter was fixed in BUG-003 but the rendering code was missed.
- **Fix Applied:** Updated mood tag rendering to handle both formats:
  ```javascript
  const goalName = typeof goal === 'string' ? goal : goal.name;
  ```

---

### BUG-006: Buttons generally not selectable/clickable
- **Status:** 🟢 FIXED
- **Severity:** Critical
- **Reported:** 2025-11-27
- **Fixed:** 2025-11-27
- **Component:** Frontend - JavaScript Initialization
- **Root Cause:** main.js was calling `initFormInteractions()` but the actual function in form.js is named `initForm()`. This caused form event handlers to never be attached.
- **Fix Applied:** 
  - Updated main.js to call correct function names
  - Added `initForm()` call
  - Added `initWizard()` call  
  - Added recommend button event listener setup
  - Added error logging for missing functions
- **Related Bugs Fixed:** BUG-002, BUG-004

---

### BUG-001: Game images not displaying in Games Tab
- **Status:** 🟢 FIXED
- **Severity:** Medium
- **Reported:** 2025-11-27
- **Fixed:** 2025-11-27
- **Component:** Frontend - Games Tab
- **Root Cause:** games-library.js was checking for `game.coverUrl` but the demo data uses `game.imageUrl`
- **Fix Applied:** Updated image check to `if (game.imageUrl || game.coverUrl)`

---

### BUG-002: Player cards not clickable in Games Tab
- **Status:** 🟢 FIXED
- **Severity:** High
- **Reported:** 2025-11-27
- **Fixed:** 2025-11-27
- **Component:** Frontend - Games Tab
- **Root Cause:** 
  1. Part of BUG-006 (event handlers not initialized)
  2. `showGameDetails()` was calling non-existent `showMaximizedGame()` instead of `openMaximizedGame()`
- **Fix Applied:** Updated to call `openMaximizedGame(game, 'From your game library', 100)`

---

### BUG-003: Mood dropdown not filtering games
- **Status:** 🟢 FIXED
- **Severity:** High
- **Reported:** 2025-11-27
- **Fixed:** 2025-11-27
- **Component:** Frontend - Games Tab
- **Root Cause:** Filter was checking `goal.name === selectedMood` but demo data stores emotional goals as strings directly (e.g., "UNWIND") not objects (e.g., {name: "UNWIND"})
- **Fix Applied:** Updated filter and gradient functions to handle both formats:
  ```javascript
  const goalName = typeof goal === 'string' ? goal : goal.name;
  ```

---

### BUG-004: Quick Start Wizard not working
- **Status:** 🟢 FIXED
- **Severity:** High
- **Reported:** 2025-11-27
- **Fixed:** 2025-11-27
- **Component:** Frontend - Wizard
- **Root Cause:** `initWizard()` was not being called from main.js
- **Fix Applied:** Added `initWizard()` call to main.js initialization

---

### BUG-005: Touch Grass modal not opening
- **Status:** 🟢 FIXED
- **Severity:** Medium
- **Reported:** 2025-11-27
- **Fixed:** 2025-11-27
- **Component:** Frontend - Wellness Feature
- **Root Cause:** Part of BUG-006 - time slider event handler wasn't attached because `initForm()` wasn't called
- **Fix Applied:** Fixed by resolving BUG-006

---

## Files Modified

1. **frontend/js/main.js** - Fixed initialization calls
2. **frontend/js/games-library.js** - Fixed image URL, mood filter, game card click handler

---

## How to Report a Bug

When adding a new bug, include:
1. Clear, descriptive title
2. Steps to reproduce
3. Expected vs actual behavior
4. Environment details (browser, OS, etc.)
5. Screenshots if applicable
6. Severity assessment

### Severity Guidelines

- **Critical:** Application unusable, blocking all functionality
- **High:** Application crash, data loss, security issue, or major feature broken
- **Medium:** Feature partially broken, workaround exists
- **Low:** Minor UI issues, typos, cosmetic problems

---

## Bug Statistics

| Status | Count |
|--------|-------|
| 🔴 OPEN | 0 |
| 🟡 IN PROGRESS | 0 |
| 🟢 FIXED | 7 |
| Total Tracked | 7 |

_Last updated: 2025-11-27_
