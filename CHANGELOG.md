# Lutem MVP - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.6.0] - 2025-11-30 (Desktop Responsive Layout)

### Added - Desktop Layout
- **Responsive Breakpoints**
  - Tablet (768px-1023px): 2-column grid for wizard inputs
  - Desktop (1024px+): Full 2x2 grid with sidebar navigation
  - Large Desktop (1400px+): Extra spacious layout

- **Sidebar Navigation (Desktop)**
  - Fixed left sidebar (110px wide) replaces bottom navigation
  - Vertical tab layout with icons and labels
  - Auth/Sign-in section integrated into sidebar
  - Accent-colored border and subtle background tint (8% accent mix)
  - Proper flexbox stacking for tabs, auth, and credits

- **Desktop UX Improvements**
  - Advanced options (Genre Preferences, More Options) expanded by default
  - "Optional Preferences" header above advanced sections
  - Expanded header with larger logo and tagline
  - Page content offset to accommodate sidebar

### Changed
- Top auth header hidden on desktop (moved to sidebar)
- Wizard inputs use CSS Grid for responsive 2-column/2x2 layouts
- Submit button centered with max-width constraint on desktop

### Technical
- Added `.wizard-inputs-grid` wrapper for responsive grid
- Added `.wizard-submit-row` wrapper for button centering
- Added `.advanced-sections-grid` wrapper for side-by-side advanced options
- Added `.optional-section-header` for desktop-only labeling
- Added `.sidebar-auth` section with dropdown support
- New JS functions: `toggleSidebarUserDropdown()`, `updateSidebarAuthUI()`

---

## [0.5.1] - 2025-11-29 (Documentation Update & Deployment Prep)

### Changed
- **Game Library:** Expanded from 41 to 57 games (MOBAs, Fighting, JRPGs, Quick-session titles)
- **Documentation:** Updated all docs to reflect 57 game count
- **Deployment:** Phase 1 complete - environment configuration ready

### Fixed
- Corrected game counts across all documentation files (ROADMAP, ARCHITECTURE, TODO)
- Updated project structure documentation to reflect modular frontend

---

## [0.5.0] - 2025-11-28 (Frontend Modularization Complete)

### Added - Frontend Refactoring
- **Complete Frontend Modularization**
  - Split monolithic index.html (5,706 lines) into modular structure
  - index.html now contains only 1,078 lines of pure HTML (81% reduction)
  
- **CSS Architecture**
  - `css/variables.css` - CSS custom properties (319 lines)
  - `css/themes.css` - Theme class definitions (19 lines)
  - `css/base.css` - Reset and typography (150 lines)
  - `css/components.css` - UI components (1,604 lines)
  - `css/layout.css` - Layout utilities (161 lines)
  - `css/pages/calendar.css` - Calendar-specific styles (121 lines)

- **JavaScript Modules**
  - `js/constants.js` - Configuration and quotes (30 lines)
  - `js/state.js` - Global state management (25 lines)
  - `js/utils.js` - Helper functions (50 lines)
  - `js/theme.js` - Theme/palette switching (110 lines)
  - `js/wizard.js` - Quick start wizard (150 lines)
  - `js/form.js` - Form interactions (115 lines)
  - `js/validation.js` - Input validation (90 lines)
  - `js/api.js` - Backend API communication (147 lines)
  - `js/recommendation.js` - Game recommendation display (530 lines)
  - `js/tabs.js` - Tab navigation (59 lines)
  - `js/games-library.js` - Games page functionality (389 lines)
  - `js/profile.js` - Profile page functionality (140 lines)
  - `js/calendar.js` - Calendar functionality (327 lines)
  - `js/main.js` - Main initialization (56 lines)

### Changed
- **Project Structure** - Frontend app now in `frontend/` folder, `docs/` contains only documentation
- Improved code organization with clear separation of concerns
- Scripts load in dependency order for proper initialization
- Easier debugging with focused, single-purpose modules
- Updated bat files to point to new frontend location

### Known Issues
- Calendar not displaying on Calendar tab ([#1](docs/calendar-known-issues.md#1))
- Game wizard not accessible from Calendar tab ([#2](docs/calendar-known-issues.md#2))
- Task creation functionality not working ([#3](docs/calendar-known-issues.md#3))
- Missing task type selection modal ([#4](docs/calendar-known-issues.md#4))
- Gaming session workflow not integrated ([#5](docs/calendar-known-issues.md#5))

See [docs/calendar-known-issues.md](docs/calendar-known-issues.md) for detailed analysis.

---

## [0.4.0] - 2025-11-23 (Theme System & Calendar Enhancement)

### Added - Frontend
- **Dark/Light Mode Toggle**
  - Theme switcher button with smooth transitions
  - Persistent theme preference using localStorage
  - System preference detection on first load
  - Animated theme transition effects

- **Color Palette System**
  - Comprehensive CSS custom properties for theming
  - Light mode palette with soft, professional colors
  - Dark mode palette with reduced eye strain
  - Mood-based accent colors (relax: blue, focus: purple, challenge: red)
  - Consistent color application across all UI elements

- **Calendar Free Time Display**
  - "Your Available Time" section in home tab
  - Displays next 3 free time slots from calendar
  - Shows duration and time range for each slot
  - Automatic filtering of busy periods
  - Fallback message when no calendar events exist
  - Real-time updates based on calendar data

### Enhanced - Frontend
- Improved visual hierarchy with theme-aware colors
- Better contrast ratios for accessibility
- Smooth color transitions between theme changes
- Modal and overlay backgrounds adapted for both themes

### Documentation
- Created `docs/features/COLOR_PALETTE_SYSTEM.md`
  - Complete color reference for both themes
  - Usage guidelines for developers
  - Semantic color naming conventions

### Technical
- Refactored CSS to use custom properties throughout
- Improved calendar data fetching and parsing
- Better error handling for calendar API calls

---

## [0.3.0] - 2025-11-23 (Calendar Integration - Partial)

### Added - Backend
- **CalendarController** - Full CRUD REST API for calendar events
  - `POST /calendar/events` - Create new events
  - `GET /calendar/events` - Retrieve all events with optional date filtering
  - `GET /calendar/events/{id}` - Get single event by ID
  - `PUT /calendar/events/{id}` - Update existing event
  - `DELETE /calendar/events/{id}` - Delete event
- **CalendarEvent** entity with JPA annotations
- **EventType** enum (GAME, TASK) for event categorization
- **CalendarEventRepository** with custom query methods

### Added - Frontend (Non-Functional)
- FullCalendar library integration (v6.1.8)
- Calendar initialization code with event handlers
- Event Details modal with delete functionality
- Add Task modal with form validation
- Calendar-wizard integration code
- Event management functions (load, create, update, delete)
- Utility functions:
  - `formatDateTimeLocal()` - For datetime inputs
  - `formatDateTime()` - For display
  - `calculateDuration()` - Between dates
  - `showToast()` - Notification system
- CSS animations for toast notifications
- Calendar event color coding (blue for games, gray for tasks)

### Changed
- Updated `index.html` with calendar JavaScript (+400 lines)
- Added `API_BASE_URL` constant for calendar endpoints
- Modified recommendation flow to support calendar event creation
- Enhanced modal styling for better consistency

### Documentation
- Created `docs/calendar-known-issues.md` - Comprehensive issue tracking
- Created `docs/calendar-fix-guide.md` - Debugging and fix instructions
- Updated `docs/TODO.md` - Added calendar tasks to backlog
- Updated `README.md` - Calendar status and next priorities

---

## [0.2.0] - 2025-11-23 (Theme System & Progressive Display)

### Added
- **Combined Theme Selector** - Unified palette and mode interface
  - 8 total theme combinations (4 palettes × 2 modes)
  - Visual color swatches in selector menu
  - Smart icon display (palette icon in light, moon in dark)
  - Single menu for both palette and mode selection
- **Progressive Recommendations Display**
  - Top 1 + 3 alternatives shown initially
  - "See 6 More Alternatives" button for remaining games
  - Smooth expansion animation
  - Automatic button removal after expansion
  - Reduces decision paralysis and cognitive load

### Changed
- Refactored theme toggle system for better UX
- Enhanced results display with progressive disclosure
- Improved theme switching performance
- Updated documentation with UX principles

### Documentation
- Created `docs/features/COLOR_PALETTE_SYSTEM.md` - Complete theme documentation
- Added "Why This Works" section to README with research citations
- Enhanced output examples with progressive display flow

---

## [0.1.5] - 2025-11-23 (Genre Preferences - Soft Ranking)

### Added
- **Genre Preference System** with 20+ genre options
  - Multi-select chip interface with emoji icons
  - Soft ranking algorithm (boosts scores, doesn't filter)
  - Backend integration with +15% max boost
  - Formula: `(matchedGenres / totalPreferredGenres) * 15.0`
  - Optional feature - works with or without selection
- Tagged all 41 games with appropriate genres
- Genre matching logic in recommendation algorithm

### Changed
- Enhanced recommendation scoring with genre preferences
- Improved game metadata with genre tags
- Updated frontend validation for genre selection

---

## [0.1.4] - 2025-11-23 (Loading Experience & Developer Onboarding)

### Added
- **Loading Spinner** with gaming quotes
  - 24 iconic quotes from classic games
  - 2-second minimum display time
  - Random quote rotation
  - Theme-aware animations
- **Maven Wrapper** for standalone execution
  - No system Maven required
  - Auto-detect JAVA_HOME in startup scripts
  - Version-locked Maven 3.9.6
  - Improved first-run experience

### Changed
- Enhanced `start-backend.bat` with better error messages
- Updated startup documentation
- Improved build reliability

### Documentation
- Created `docs/LOADING_SPINNER_FEATURE.md` - Feature guide
- Created `docs/MAVEN_WRAPPER_SETUP.md` - Setup instructions
- Created `docs/LOADING_SPINNER_IMPLEMENTATION.md` - Technical docs

---

## [0.1.3] - 2025-11-23 (Branding & Visual Identity)

### Added
- **Lutem Logo** with transparent background
  - 440px in main header
  - 304px in guided modal
  - Professional visual identity
- **4 Color Palette Themes**
  - ☕ Café (warm browns) - Default
  - 💜 Soft Lavender (gentle purples)
  - 🌿 Natural Earth (fresh greens)
  - 🌊 Ocean Breeze (sky blues)
- **Game Library Expansion** - 20 games categorized:
  - 7 casual (5-30 min)
  - 9 mid-range (30-60 min)
  - 4 long-form (60+ min)
- Steam cover art for all games

### Changed
- Improved UI layout with logo integration
- Enhanced README with centered branding
- Optimized margins and spacing

---

## [0.1.2] - 2025-11-23 (Frontend Restoration)

### Fixed
- **CRITICAL:** Restored 484 lines of JavaScript
  - All interactions and event handlers
  - Complete API communication layer
  - Modal system (guided setup, feedback)
  - Theme toggle functionality
  - State management
- **CRITICAL:** Restored 255 lines of results display CSS
  - Game cards and badges
  - Alternative recommendations layout
  - Image display and loading states
  - Hover effects and animations

### Changed
- Complete end-to-end testing and validation
- Verified all features working correctly

---

## [0.1.1] - 2025-11-22 (UX Enhancements)

### Added
- **Guided Setup Modal** with Quick Start wizard
  - 3-step onboarding flow
  - Energy level, time, and mood selection
  - Progress indicators
  - "Skip to full form" option
- **Touch Grass Modal** for 3+ hour sessions
  - Wellness reminder
  - Health checklist
  - Time adjustment option
- **Collapsible Advanced Options**
  - Time of Day
  - Social Preference
  - Progressive disclosure UX

### Changed
- Enhanced time slider with wellness features
- Improved form hierarchy and visual clarity
- Better onboarding for new users

---

## [0.1.0] - 2025-11-22 (MVP Foundation)

### Added
- **Spring Boot Backend** (Port 8080)
  - RESTful API with 3 endpoints
  - In-memory storage (HashMap)
  - 8-dimensional recommendation algorithm
  - Satisfaction feedback system
- **Frontend** (Single-page app)
  - Modern HTML/CSS/JavaScript
  - Multi-step form with validation
  - Results display with alternatives
  - Dark/light mode toggle
  - Emoji feedback system (1-5 stars)
- **Game Library** - Initial 41 games
  - Rich metadata (genre, time, energy, etc.)
  - Multi-dimensional categorization
  - Satisfaction tracking
- **5 Enum Systems**
  - EmotionalGoal (6 options)
  - Interruptibility (3 levels)
  - EnergyLevel (3 levels)
  - TimeOfDay (4 periods)
  - SocialPreference (3 types)
- **Documentation**
  - Comprehensive README
  - API documentation
  - Setup instructions
  - Troubleshooting guide

### Technical
- Java 17+ / Spring Boot 3.2.0
- Maven build system
- SQLite for future persistence
- Vanilla JavaScript (no frameworks)
- CSS custom properties for theming

---

## Version History

- **[0.5.1]** - Documentation update & deployment prep - 2025-11-29
- **[0.5.0]** - Frontend modularization complete (81% reduction) - 2025-11-28
- **[0.4.0]** - Theme system & calendar enhancement - 2025-11-23
- **[0.3.0]** - Calendar integration (backend complete, frontend partial) - 2025-11-23
- **[0.2.0]** - Combined theme selector & progressive display - 2025-11-23
- **[0.1.5]** - Genre preferences with soft ranking - 2025-11-23
- **[0.1.4]** - Loading spinner & Maven wrapper - 2025-11-23
- **[0.1.3]** - Branding, logo, and 4 color palettes - 2025-11-23
- **[0.1.2]** - Frontend restoration (JavaScript & CSS) - 2025-11-23
- **[0.1.1]** - UX enhancements (guided modal, wellness) - 2025-11-22
- **[0.1.0]** - MVP foundation (backend + frontend) - 2025-11-22

---

**Documentation:**
- [README.md](README.md) - Project overview and setup
- [docs/calendar-known-issues.md](docs/calendar-known-issues.md) - Calendar issue tracking
- [docs/calendar-fix-guide.md](docs/calendar-fix-guide.md) - Fix instructions
- [docs/TODO.md](docs/TODO.md) - Development roadmap
- [SESSION_COMPLETE_SUMMARY.md](SESSION_COMPLETE_SUMMARY.md) - Technical deep-dive
