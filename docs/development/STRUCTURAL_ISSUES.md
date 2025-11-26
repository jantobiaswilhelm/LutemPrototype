# Lutem MVP - Structural Issues & Refactoring Guide

**Created:** November 26, 2025  
**Last Updated:** November 26, 2025  
**Status:** Quick wins complete ✅ | README split ✅ | Frontend split 🟡 IN PROGRESS  
**Priority:** Medium-High (technical debt)

> **📋 Detailed frontend refactoring plan:** See [FRONTEND_REFACTOR_PLAN.md](./FRONTEND_REFACTOR_PLAN.md)

---

## Overview

This document identifies structural issues in the Lutem MVP codebase that should be addressed before scaling. These are not bugs - the application works - but they create technical debt that will slow future development.

---

## 🔴 Critical Issues

### 1. Monolithic Frontend (5,706 lines in single file)

**Problem:**  
The entire frontend is in `frontend/index.html` - HTML, CSS (multiple themes), and JavaScript all embedded together.

**⚠️ Additional Issue Found:** Lines 5594-5706 contain orphaned HTML after `</html>` - likely from a bad merge.

**Detailed Breakdown:**
| Section | Lines | Size |
|---------|-------|------|
| CSS Block | 11-2552 | 2,541 lines |
| HTML Body | 2563-3054 | 491 lines |
| Main JS | 3055-4604 | 1,549 lines |
| Tab/Games JS | 4605-5593 | 988 lines |
| Orphaned HTML | 5594-5706 | 112 lines (BUG) |

**Impact:**
- Hard to maintain and debug
- Causes merge conflicts in team environments
- Makes code reuse impossible
- Slows IDE performance
- Difficult to test individual components

**Current State:**
```
frontend/
└── index.html    # 5,706 lines (HTML + CSS + JS)
```

**Recommended Structure:**
```
frontend/
├── index.html              # HTML only (~200 lines)
├── css/
│   ├── base.css            # Reset, typography
│   ├── themes.css          # Color palettes, dark mode variables
│   ├── components.css      # Cards, buttons, modals, forms
│   └── layout.css          # Grid, navigation, responsive
├── js/
│   ├── app.js              # Main entry point, initialization
│   ├── api.js              # Backend communication (fetch calls)
│   ├── state.js            # State management
│   ├── ui.js               # DOM manipulation, rendering
│   └── themes.js           # Theme switching logic
└── assets/
    └── lutem-logo.png
```

**Effort:** 2-4 hours  
**Risk:** Low (purely organizational)

---

### 2. ~~Misplaced Java Files (Package Structure Violation)~~ ✅ RESOLVED

**Status:** FIXED - All files moved to correct packages.

**Current State (Correct):**
```
com.lutem.mvp/
├── LutemMvpApplication.java  ✓
├── config/
│   └── GameDataLoader.java   ✓
├── controller/
│   ├── CalendarController.java   ✓
│   ├── GameAdminController.java  ✓
│   └── GameController.java       ✓
├── dto/
│   ├── RecommendationRequest.java   ✓
│   ├── RecommendationResponse.java  ✓
│   └── SessionFeedback.java         ✓
├── model/
│   ├── CalendarEvent.java     ✓
│   ├── EmotionalGoal.java     ✓
│   ├── EnergyLevel.java       ✓
│   ├── Game.java              ✓
│   ├── GameSession.java       ✓
│   ├── Interruptibility.java  ✓
│   ├── SocialPreference.java  ✓
│   └── TimeOfDay.java         ✓
├── repository/
│   ├── GameRepository.java        ✓
│   └── GameSessionRepository.java ✓
└── service/
    └── GameSessionService.java    ✓
```

---

## 🟡 Medium Issues

### 3. ~~Missing Unix Maven Wrapper~~ ✅ RESOLVED

**Status:** FIXED - Unix `mvnw` script added.

**Files Present:**
- ✅ `backend/mvnw.cmd` (Windows)
- ✅ `backend/mvnw` (Unix/Mac) - ADDED
- ✅ `backend/.mvn/wrapper/maven-wrapper.jar`
- ✅ `backend/.mvn/wrapper/maven-wrapper.properties`

---

### 4. ~~.gitignore Blocks Maven Wrapper JAR~~ ✅ NOT AN ISSUE

**Status:** Verified - The `.gitignore` never contained this blocking line. The `maven-wrapper.jar` exists and is tracked properly.

**Files Present:**
- ✅ `backend/.mvn/wrapper/maven-wrapper.jar`
- ✅ `backend/.mvn/wrapper/maven-wrapper.properties`
- ✅ `backend/mvnw.cmd` (Windows)

---

### 5. Database File in Wrong Location

**Problem:**  
`lutem.db` sits directly in `backend/` root, cluttering the source directory.

**Current:**
```
backend/
├── lutem.db          # ← Database in source root
├── pom.xml
└── src/
```

**Recommended:**
```
backend/
├── data/
│   └── lutem.db      # ← Dedicated data directory
├── pom.xml
└── src/
```

Or configure to use `target/` so it's cleaned on rebuild.

**Effort:** 5 minutes (update application.properties)  
**Risk:** Low

---

### 6. No Test Directory

**Problem:**  
`src/test/java/` doesn't exist - zero unit tests.

**Impact:**
- No automated verification of recommendation algorithm
- No regression protection
- Harder to refactor safely

**Recommendation:**  
At minimum, add tests for:
- `RecommendationService` scoring logic
- `GameDataLoader` JSON parsing
- API endpoint responses

**Effort:** 2-4 hours for basic coverage  
**Risk:** None (additive)

---

### 7. ~~README is 856 Lines~~ ✅ RESOLVED

**Status:** FIXED - README split into focused documentation files.

**New Structure:**
| File | Content | Lines |
|------|---------|-------|
| `README.md` | Quick start, project overview | ~145 |
| `docs/ARCHITECTURE.md` | Technical deep-dive, system design | ~273 |
| `docs/API.md` | Endpoint documentation, examples | ~221 |
| `docs/PSYCHOLOGY.md` | Research basis, evidence section | ~221 |
| `docs/CONTRIBUTING.md` | Development workflow, code style | ~246 |

**Result:** README reduced from 856 → 145 lines. All detailed content preserved in appropriate docs.

---

## 🟢 Minor Issues

### 8. Duplicate/Confusing Documentation

**Problem:**  
Multiple TODO files with different content:
- `TODO.md` (root) - 343 lines
- `docs/TODO.md` - 181 lines, different content

**Recommendation:**  
Consolidate into single `docs/TODO.md` and delete root file.

---

### 9. Redundant Scripts

**Problem:**  
Multiple scripts do similar things:

```
start-backend.bat              # Main startup
scripts/build/pre-run.bat      # Similar purpose?
scripts/build/rebuild-backend.bat
scripts/git/commit-*.bat       # Multiple commit helpers
```

**Recommendation:**  
Audit and consolidate. Keep only essential scripts in root.

---

### 10. Demo Files Mixed with Docs

**Problem:**  
`docs/index.html` and `docs/games-data.js` appear to be GitHub Pages demo files mixed with development documentation.

**Recommendation:**  
Move to `demo/` directory or separate `gh-pages` branch.

---

## Priority Matrix

| Issue | Impact | Effort | Priority | Status |
|-------|--------|--------|----------|--------|
| 2. Java package structure | High | Low | ⭐ Do First | ✅ DONE |
| 4. .gitignore maven JAR | High | Trivial | ⭐ Do First | ✅ DONE |
| 1. Monolithic frontend | High | Medium | ⭐⭐ Do Soon | 🟡 IN PROGRESS |
| 3. Unix maven wrapper | Medium | Trivial | ⭐⭐ Do Soon | ✅ DONE |
| 5. Database location | Low | Low | When convenient | Pending |
| 6. No tests | Medium | High | When time allows | Pending |
| 7. README split | Low | Low | When convenient | ✅ DONE |
| 8-10. Cleanup | Low | Low | When convenient | Pending |

---

## Quick Wins (Under 30 Minutes)

1. ~~**Move Java enums to model package**~~ - ✅ DONE
2. ~~**Move GameAdminController to controller package**~~ - ✅ DONE
3. ~~**Move GameDataLoader to config package**~~ - ✅ DONE
4. ~~**Remove maven-wrapper.jar from .gitignore**~~ - ✅ DONE (was never blocking)
5. ~~**Add Unix mvnw script**~~ - ✅ DONE

---

## Next Steps

To address these issues:
1. Create a feature branch: `git checkout -b refactor/project-structure`
2. Start with quick wins (Java files)
3. Test that application still works
4. Commit incrementally
5. Address frontend split in separate PR

---

*Document maintained as part of Lutem MVP technical debt tracking.*
