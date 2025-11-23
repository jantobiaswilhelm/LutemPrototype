# Lutem MVP Changelog

All notable changes to this project will be documented in this file.

## [Current] - November 23, 2025 - Interruptibility Required Field ✅

### Added - Required Interruptibility Validation (Quick Win #5)
- **FORM VALIDATION:** Interruptibility is now a required field
  - Added validation check for "Can I pause anytime?" field
  - Shows error message: "⚠️ Can you pause anytime?"
  - Shows success feedback: "✓ Good to know!" when selected
  - Prevents incomplete recommendations without pause flexibility info
  
- **QUICK START WIZARD UPDATE:** Added Question 4
  - Extended wizard from 3 to 4 questions
  - New Question 4: "Can you pause anytime?"
  - Three clear options:
    - "Yes, Anytime" (HIGH) - Total flexibility
    - "Some Pauses" (MEDIUM) - Are fine
    - "No, I'm Locked In" (LOW) - Full commitment
  - Updated estimated time: ~40 seconds (was ~30)
  - All progress indicators show "X of 4" instead of "X of 3"
  
- **STATE MANAGEMENT:**
  - Added `guidedInterruptibility` to state object
  - Proper value mapping between wizard and main form
  - Fixed value mismatch bug (ANYTIME/SAVEPOINTS/COMMITTED → HIGH/MEDIUM/LOW)
  - Enhanced `syncFormFromState()` to include interruptibility
  - Wizard properly transfers selection to main form

### Technical Implementation
- **Frontend Changes:**
  - Updated `validateForm()` to check interruptibility
  - Added Question 4 HTML structure to wizard
  - Created `goToQuestion4()` navigation function
  - Enhanced `selectBigOption()` to enable Q4 next button
  - Fixed `submitGuidedSetup()` to use guided interruptibility value
  - Updated `syncFormFromState()` to sync interruptibility selection
  
- **Bug Fixes:**
  - Fixed wizard value mismatch causing server errors
  - Corrected data-value attributes (HIGH/MEDIUM/LOW)
  - Ensured proper state transfer from wizard to form
  - Validated backend compatibility with values

### Why This Matters
- **Better Recommendations:** Algorithm needs pause flexibility for accurate matching
- **User Clarity:** Forces users to think about their session constraints
- **Prevents Errors:** No more incomplete requests to backend
- **Wizard Completeness:** All essential inputs now in Quick Start flow
- **Professional UX:** Consistent validation across all required fields

---

## [Previous] - November 23, 2025 - Input Validation System ✅

### Added - Smart Input Validation (Quick Win #4)
- **HYBRID VALIDATION:** Intelligent form validation with user-friendly feedback
  - Initial state: Clean form, no validation nag
  - On submit: Validates all required fields
  - After first validation: Live validation enabled
  - Auto-scrolls to first error
  - Prevents broken API calls
  
- **VISUAL FEEDBACK:**
  - Red borders around invalid fields with shake animation
  - Green borders + checkmarks for valid fields
  - Helpful inline error messages:
    - "⚠️ Pick what you want to feel" (emotional goals)
    - "⚠️ How are you feeling?" (energy level)
  - Smooth animations for state transitions
  
- **FRONTEND VALIDATION:**
  - Validates emotional goals (at least 1 required)
  - Validates energy level (required)
  - Validates available minutes (must be > 0)
  - Live validation triggers on chip/button clicks
  - `validateForm()` function with comprehensive checks
  - `triggerValidationIfEnabled()` for hybrid approach
  
- **BACKEND VALIDATION:**
  - Server-side validation in GameController
  - `validateRequest()` method with detailed checks
  - Returns validation error response if checks fail
  - Prevents malformed data from reaching recommendation engine
  
### Technical Implementation
- **Files Modified:**
  - `frontend/index.html` - Added validation CSS and JavaScript
  - `backend/.../GameController.java` - Added validation methods
  
- **CSS Classes:**
  - `.input-group.error` - Red border styling
  - `.input-group.valid` - Green border styling  
  - `.validation-message` - Error/success message styling
  - `@keyframes shake` - Error attention animation
  
- **JavaScript Functions:**
  - `validateForm()` - Main validation logic
  - `markFieldAsError()` - Show error state
  - `markFieldAsValid()` - Show success state
  - `triggerValidationIfEnabled()` - Conditional validation

### Why This Matters
- Better UX - users know what's missing immediately
- Prevents confusion and frustration
- Reduces backend errors from incomplete data
- Professional, polished feel
- Follows best practices (hybrid validation approach)

---

## [Previous] - November 23, 2025 - Documentation Update

### Updated - Startup Instructions 📝
- **CRITICAL UPDATE:** Clarified that bat files are the PRIMARY startup method
  - Updated CLAUDE_INSTRUCTIONS.md with mandatory bat file usage
  - Updated README.md Quick Start section for consistency
  - Emphasized that IntelliJ is secondary/optional method
  - Added clear warnings against manual Maven/JAVA_HOME configuration
  
### Why This Matters
- Bat files auto-detect JAVA_HOME
- Maven wrapper is built-in (no system Maven needed)
- Consistent, reliable startup across all environments
- Prevents confusion about startup methods

---

## [Previous] - November 23, 2025 - Late Evening

### Added - Genre Preference Feature 🎮
- **NEW FEATURE:** Genre preference soft ranking system
  - 20+ genre options with emoji icons (Puzzle 🧩, Action ⚔️, Strategy 🎲, etc.)
  - Multi-select chip interface in main form
  - Soft ranking boost (+15% max) - doesn't eliminate games, just prioritizes
  - Backend scoring integration in GameController
  - Added `preferredGenres` field to RecommendationRequest
  - All 41 games now tagged with appropriate genres
  
### Technical Details
- **Frontend Changes:**
  - New genre selection section with 20 genre chips
  - Visual feedback for selected genres
  - Clean UI integration below "What matters most?" section
  
- **Backend Changes:**
  - Genre preference boost in scoring algorithm (section 8)
  - Calculates match percentage based on genre overlap
  - Maximum 15-point boost for perfect genre matches
  - Gracefully handles missing genre preferences (no penalty)
  
- **Algorithm Enhancement:**
  - Genre matching is SOFT RANKING (boosts score, doesn't filter)
  - Prevents over-filtering that could eliminate good matches
  - Balances genre preference with other 7 scoring dimensions
  - Formula: `(matchedGenres / totalPreferredGenres) * 15.0`

### Why This Matters
- Gives users more control over recommendations
- Doesn't restrict matches (soft ranking approach)
- Preserves algorithm's multi-dimensional intelligence
- Enhances personalization without sacrificing quality

---

## [November 23, 2025 - Evening Session]

### Added - Loading & Developer Experience
- **LOADING SPINNER:** Added engaging 2-second loading experience
  - 24 iconic gaming quotes from classic titles
  - Smooth spinner animation with theme-aware colors
  - Smart timing system (minimum 2s display to prevent flashing)
  - Random quote rotation on each load
  - Created comprehensive feature documentation
  
- **MAVEN WRAPPER:** Improved developer onboarding
  - Added Maven wrapper for standalone execution
  - No system Maven installation required
  - Auto-detect JAVA_HOME in start-backend.bat
  - Version-locked Maven 3.9.6 for consistency
  - Created setup documentation guide
  
- **DEVELOPER EXPERIENCE:** Enhanced build reliability
  - Updated startup scripts with better error messages
  - Improved first-run experience
  - Self-contained project setup

---

## [November 23, 2025 - Morning Session]

### Added - Branding & Visual Identity
- **BRANDING:** Added professional Lutem logo
  - Created custom logo with transparent background
  - Integrated logo into main header and modal
  - Updated README with centered logo
  - Optimized margins and spacing
  
- **UI/UX:** Added 4 color palette themes
  - 🍂 Café (default warm browns)
  - 💜 Soft Lavender
  - 🌿 Natural Earth
  - 🌊 Ocean Breeze
  - Persistent theme selection via localStorage
  - Seamless transitions between palettes
  
- **GAME LIBRARY:** Expanded to 20 categorized games
  - 7 casual games (5-30 min)
  - 9 mid-range games (30-60 min)
  - 4 long-form games (60+ min)
  - All games include Steam cover art and metadata

### Fixed - Frontend Restoration
- **MAJOR:** Restored complete frontend functionality
  - Added 484 lines of JavaScript
  - Added 255 lines of results display CSS
  - Restored theme toggle, guided modal, feedback system
  - Fixed all event handlers and state management

---

## [November 22, 2025]

### Added - UI Improvements
- Implemented Guided Setup Modal with Quick Start wizard
- Added UI cleanup with collapsible advanced options
- Created comprehensive session documentation
- Enhanced time slider with "Touch Grass" modal
- **QuickWin #1:** Loading spinner with rotating gaming tips

---

## Version History

### MVP v0.5 - Current State
- ✅ Complete 8-dimensional recommendation system
- ✅ Genre preference soft ranking
- ✅ 41 games with full metadata
- ✅ Professional branding and theming
- ✅ Guided onboarding
- ✅ Loading spinner with quotes
- ✅ Maven wrapper integration

### MVP v0.4 - UI Polish
- Multi-theme system
- Dark/light mode
- Enhanced game library
- Professional visual identity

### MVP v0.3 - User Experience
- Guided setup modal
- Touch Grass wellness feature
- Collapsible advanced options
- Loading animations

### MVP v0.2 - Core Functionality
- Multi-dimensional scoring
- Feedback system
- Alternative recommendations
- Steam image integration

### MVP v0.1 - Foundation
- Basic recommendation engine
- REST API endpoints
- Initial game library
- Simple frontend form
