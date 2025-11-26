# Lutem MVP - Structural Issues & Refactoring Guide

**Created:** November 26, 2025  
**Status:** Documented, pending resolution  
**Priority:** Medium-High (technical debt)

---

## Overview

This document identifies structural issues in the Lutem MVP codebase that should be addressed before scaling. These are not bugs - the application works - but they create technical debt that will slow future development.

---

## 🔴 Critical Issues

### 1. Monolithic Frontend (5,706 lines in single file)

**Problem:**  
The entire frontend is in `frontend/index.html` - HTML, CSS (multiple themes), and JavaScript all embedded together.

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

### 2. Misplaced Java Files (Package Structure Violation)

**Problem:**  
Several Java files sit in the root `com.lutem.mvp` package instead of appropriate sub-packages.

**Current State:**
```
com.lutem.mvp/
├── controller/
│   ├── CalendarController.java  ✓
│   └── GameController.java      ✓
├── dto/
│   ├── RecommendationRequest.java   ✓
│   ├── RecommendationResponse.java  ✓
│   └── SessionFeedback.java         ✓
├── model/
│   ├── CalendarEvent.java    ✓
│   ├── Game.java             ✓
│   └── GameSession.java      ✓
├── repository/
│   ├── GameRepository.java        ✓
│   └── GameSessionRepository.java ✓
├── service/
│   └── GameSessionService.java    ✓
│
│   # ⚠️ MISPLACED FILES (in root package):
├── EmotionalGoal.java        ❌ → should be model/ or enums/
├── EnergyLevel.java          ❌ → should be model/ or enums/
├── Interruptibility.java     ❌ → should be model/ or enums/
├── SocialPreference.java     ❌ → should be model/ or enums/
├── TimeOfDay.java            ❌ → should be model/ or enums/
├── GameAdminController.java  ❌ → should be controller/
├── GameDataLoader.java       ❌ → should be config/
└── LutemMvpApplication.java  ✓ (correct location)
```

**Recommended Structure:**
```
com.lutem.mvp/
├── LutemMvpApplication.java
├── config/
│   └── GameDataLoader.java
├── controller/
│   ├── CalendarController.java
│   ├── GameController.java
│   └── GameAdminController.java
├── dto/
│   ├── RecommendationRequest.java
│   ├── RecommendationResponse.java
│   └── SessionFeedback.java
├── model/
│   ├── CalendarEvent.java
│   ├── Game.java
│   ├── GameSession.java
│   ├── EmotionalGoal.java
│   ├── EnergyLevel.java
│   ├── Interruptibility.java
│   ├── SocialPreference.java
│   └── TimeOfDay.java
├── repository/
│   ├── GameRepository.java
│   └── GameSessionRepository.java
└── service/
    └── GameSessionService.java
```

**Effort:** 15-30 minutes (IntelliJ refactor → move)  
**Risk:** Low (IDE handles import updates)

---

## 🟡 Medium Issues

### 3. Missing Unix Maven Wrapper

**Problem:**  
Only `mvnw.cmd` (Windows) exists. Mac/Linux developers cannot use startup scripts.

**Files Present:**
- ✅ `backend/mvnw.cmd` (Windows)
- ❌ `backend/mvnw` (Unix/Mac) - MISSING

**Fix:**  
Run in backend directory:
```bash
mvn wrapper:wrapper
```
Or copy `mvnw` from a new Spring Boot project.

**Effort:** 2 minutes  
**Risk:** None

---

### 4. .gitignore Blocks Maven Wrapper JAR

**Problem:**  
The `.gitignore` excludes `maven-wrapper.jar`, which means new developers cloning the repo won't have a working Maven wrapper.

**Current .gitignore line:**
```gitignore
.mvn/wrapper/maven-wrapper.jar
```

**Impact:**  
`mvnw.cmd` fails on fresh clones because the JAR is missing.

**Fix Options:**
1. Remove the line from `.gitignore` and commit the JAR
2. Use wrapper download mode (adds network dependency)

**Effort:** 1 minute  
**Risk:** None

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

### 7. README is 856 Lines

**Problem:**  
`README.md` contains too much implementation detail, making it overwhelming for new developers.

**Recommendation - Split into:**

| File | Content | Lines |
|------|---------|-------|
| `README.md` | Quick start, project overview | ~100 |
| `docs/ARCHITECTURE.md` | Technical deep-dive, system design | ~200 |
| `docs/API.md` | Endpoint documentation, examples | ~150 |
| `docs/PSYCHOLOGY.md` | Research basis, evidence section | ~200 |
| `docs/CONTRIBUTING.md` | Development workflow, code style | ~100 |

**Effort:** 1 hour  
**Risk:** None

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

| Issue | Impact | Effort | Priority |
|-------|--------|--------|----------|
| 2. Java package structure | High | Low | ⭐ Do First |
| 4. .gitignore maven JAR | High | Trivial | ⭐ Do First |
| 1. Monolithic frontend | High | Medium | ⭐⭐ Do Soon |
| 3. Unix maven wrapper | Medium | Trivial | ⭐⭐ Do Soon |
| 5. Database location | Low | Low | When convenient |
| 6. No tests | Medium | High | When time allows |
| 7. README split | Low | Low | When convenient |
| 8-10. Cleanup | Low | Low | When convenient |

---

## Quick Wins (Under 30 Minutes)

1. **Move Java enums to model package** - 15 min
2. **Move GameAdminController to controller package** - 2 min  
3. **Move GameDataLoader to config package** - 2 min
4. **Remove maven-wrapper.jar from .gitignore** - 1 min
5. **Add Unix mvnw script** - 5 min

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
