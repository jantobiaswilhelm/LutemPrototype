# Calendar Implementation Plan

**Created:** November 28, 2025  
**Updated:** December 1, 2025  
**Goal:** Import Google Calendar, plan tasks & gaming sessions with game selection options

---

## Overview

### User Stories
1. As a user, I want to import my Google Calendar (via OAuth or .ics file)
2. As a user, I want to plan normal tasks on my calendar
3. As a user, I want to plan gaming sessions where I can:
   - Choose a game from my library (browse/search)
   - Let the wizard recommend a game based on mood/time/energy
   - Get a random game suggestion

---

## Phase 1: Enhanced Event Creation Modal
**Status:** ✅ COMPLETE  
**Completed:** November 28-29, 2025

### Step 1.1: Create Modal HTML Structure
- [x] Add new modal `#addEventModal` to index.html
- [x] Two tabs/modes: "📋 Task" and "🎮 Gaming Session"
- [x] Shared fields: start time, end time
- [x] Task-specific: title, description
- [x] Gaming-specific: game selection area

**Checkpoint:** ✅ Modal opens, tabs switch, forms display correctly

### Step 1.2: Task Creation Flow
- [x] Wire up task form submission
- [x] Call existing `/calendar/events` API with type=TASK
- [x] Close modal, refresh calendar
- [x] Show success toast

**Checkpoint:** ✅ Can create tasks from new modal

### Step 1.3: Gaming Session - Basic Flow
- [x] Add game selection (browse library mode)
- [x] Fetch games from `/games` API on modal open
- [x] Create event with type=GAME and gameId
- [x] Display game name in calendar event

**Checkpoint:** ✅ Can create gaming sessions with game selection

---

## Phase 2: Game Selection Modes
**Status:** ✅ COMPLETE  
**Completed:** December 1, 2025

### Step 2.1: Browse Library Mode ✅ COMPLETE
- [x] Searchable game list in modal
- [x] Show game cover thumbnail, name, duration
- [x] Click to select, highlight selected game
- [ ] Optional: filter by genre (deferred)

**Checkpoint:** ✅ Can search and browse games in modal

### Step 2.2: Wizard Recommendation Mode
- [x] Mini-wizard UI: mood selector, energy level
- [x] Calculate duration from selected time slot
- [x] Call `/recommendations` API
- [x] Show top 5 recommendations as clickable cards
- [x] Click to select, updates selectedGame

**Checkpoint:** Wizard recommends games, can select from top 5

### Step 2.3: Random Game Mode ✅ COMPLETE
- [x] "🎲 Surprise Me" button with dice animation
- [x] Randomly select from library (filtered by time slot duration)
- [x] Show selected game with cover, name, genre, time, energy
- [x] Re-roll and Accept buttons
- [x] Time hint showing matching game count

**Checkpoint:** ✅ Random selection works with time filtering

---

## Phase 3: ICS File Import
**Status:** ✅ COMPLETE  
**Completed:** November 30, 2025

### Step 3.1: Frontend File Upload
- [x] Add "📥 Import Calendar" button to calendar header
- [x] File input accepting .ics files
- [x] Read file content client-side
- [x] Drag & drop support

**Checkpoint:** ✅ Can select and read .ics file

### Step 3.2: ICS Parsing (Client-Side)
- [x] Parse VEVENT components from ICS
- [x] Extract: summary (title), dtstart, dtend, description
- [x] Convert to Lutem event format
- [x] Handle timezone issues (UTC and local)
- [x] Handle line folding in ICS format

**Checkpoint:** ✅ ICS events parsed correctly

### Step 3.3: Bulk Import to Backend
- [x] Create `/calendar/events/bulk` endpoint (POST array of events)
- [x] Skip duplicates (same externalId/UID)
- [x] Return import summary
- [x] Frontend shows "Imported X events, Y skipped"
- [x] Persist events to SQLite database

**Checkpoint:** ✅ ICS import works end-to-end

---

## Phase 4: Google Calendar OAuth
**Status:** 🔴 Not Started  
**Estimated:** 10-15 hours total (3-4 sessions)  
**Updated:** December 1, 2025

### Time Breakdown Summary
| Step | Estimated Time | Difficulty |
|------|----------------|------------|
| 4.1 Google Cloud Setup | 45-90 min | Easy but tedious |
| 4.2 Backend Dependencies | 30-60 min | Easy |
| 4.3 OAuth Flow | 2-3 hours | Medium-Hard |
| 4.4 Calendar API Service | 2-3 hours | Medium |
| 4.5 Frontend Integration | 1.5-2 hours | Easy-Medium |
| 4.6 Testing & Edge Cases | 1-2 hours | Medium |

---

### Step 4.1: Google Cloud Console Setup (45-90 min)

**Pre-requisite:** Google account with access to Google Cloud Console

- [ ] Create new Google Cloud project (or use existing)
  - Go to: https://console.cloud.google.com/
  - New Project → Name: "Lutem" or "Lutem Calendar"
- [ ] Enable Google Calendar API
  - APIs & Services → Library → Search "Google Calendar API" → Enable
- [ ] Configure OAuth Consent Screen (⚠️ Most tedious part)
  - APIs & Services → OAuth consent screen
  - User Type: External
  - App name: "Lutem"
  - User support email: your email
  - Scopes: Add `https://www.googleapis.com/auth/calendar.readonly`
  - Test users: Add your Google email
  - **Note:** Stay in "Testing" mode for development
- [ ] Create OAuth 2.0 Credentials
  - APIs & Services → Credentials → Create Credentials → OAuth client ID
  - Application type: Web application
  - Name: "Lutem Web Client"
- [ ] Add Authorized Redirect URIs:
  - `http://localhost:8080/calendar/google/callback` (development)
  - `https://lutemprototype-production.up.railway.app/calendar/google/callback` (production)
- [ ] Download credentials JSON and note Client ID + Secret

**Checkpoint:** Can access Google Cloud Console, Calendar API enabled, OAuth credentials created

**Files to create/update:**
- `backend/src/main/resources/application.properties` - Add Google OAuth config

---

### Step 4.2: Backend Dependencies & Configuration (30-60 min)

- [ ] Add Maven dependencies to `pom.xml`:
```xml
<!-- Google API Client -->
<dependency>
    <groupId>com.google.api-client</groupId>
    <artifactId>google-api-client</artifactId>
    <version>2.2.0</version>
</dependency>
<!-- Google OAuth Client -->
<dependency>
    <groupId>com.google.oauth-client</groupId>
    <artifactId>google-oauth-client-jetty</artifactId>
    <version>1.34.1</version>
</dependency>
<!-- Google Calendar API -->
<dependency>
    <groupId>com.google.apis</groupId>
    <artifactId>google-api-services-calendar</artifactId>
    <version>v3-rev20231123-2.0.0</version>
</dependency>
```
- [ ] Add configuration to `application.properties`:
```properties
# Google OAuth
google.client.id=${GOOGLE_CLIENT_ID}
google.client.secret=${GOOGLE_CLIENT_SECRET}
google.redirect.uri=http://localhost:8080/calendar/google/callback
```
- [ ] Create `GoogleOAuthConfig.java` configuration class
- [ ] Add environment variables to `.env` or Railway secrets

**Checkpoint:** Application starts without errors, dependencies resolved

**Files to create/update:**
- `backend/pom.xml`
- `backend/src/main/resources/application.properties`
- `backend/src/main/java/com/lutem/mvp/config/GoogleOAuthConfig.java`

---

### Step 4.3: OAuth Flow Implementation (2-3 hours)

**Architecture Decision:** Token Storage
- ✅ **Session-based (recommended for MVP):** Simple, tokens in HTTP session
- ⬜ **Database (future):** Persistent, survives restarts, multi-device

- [ ] Create `GoogleOAuthService.java`:
  - `getAuthorizationUrl()` - Generate Google OAuth URL with scopes
  - `exchangeCodeForTokens(code)` - Exchange auth code for access token
  - `refreshAccessToken(refreshToken)` - Handle token refresh
  - `revokeToken(accessToken)` - For disconnect functionality
- [ ] Create endpoint `GET /calendar/google/auth`:
  - Generates authorization URL
  - Redirects user to Google sign-in
- [ ] Create endpoint `GET /calendar/google/callback`:
  - Receives authorization code from Google
  - Exchanges code for tokens
  - Stores tokens in session
  - Redirects back to frontend with success/error
- [ ] Create endpoint `GET /calendar/google/status`:
  - Returns whether user has valid Google token
  - Returns connected email if available
- [ ] Create endpoint `POST /calendar/google/disconnect`:
  - Revokes token
  - Clears session
  - Returns success

**Checkpoint:** Can click "Connect", sign in with Google, see callback succeed

**Files to create:**
- `backend/src/main/java/com/lutem/mvp/service/GoogleOAuthService.java`
- `backend/src/main/java/com/lutem/mvp/controller/GoogleCalendarController.java`

---

### Step 4.4: Google Calendar API Service (2-3 hours)

- [ ] Create `GoogleCalendarService.java`:
  - `getCalendarEvents(accessToken, timeMin, timeMax)` - Fetch events
  - Handle pagination (Google returns max 250 events per request)
  - `convertToLutemEvent(googleEvent)` - Map Google Event → CalendarEvent
- [ ] Handle recurring events:
  - **Decision:** Expand instances for next 3 months
  - Use `singleEvents=true` parameter to expand recurrences
- [ ] Create endpoint `GET /calendar/google/events`:
  - Fetches events from Google Calendar
  - Converts to Lutem format
  - Returns list of CalendarEvent objects
- [ ] Create endpoint `POST /calendar/google/sync`:
  - Fetches Google events
  - Imports to Lutem database (avoiding duplicates via externalId)
  - Returns sync summary
- [ ] Handle timezones:
  - Google returns ISO8601 with timezone
  - Convert to user's local timezone or UTC

**Field Mapping:**
| Google Event | Lutem CalendarEvent |
|--------------|---------------------|
| id | externalId |
| summary | title |
| description | description |
| start.dateTime | startTime |
| end.dateTime | endTime |
| (hardcoded) | type = "IMPORTED" |
| (null) | gameId = null |

**Checkpoint:** Can fetch events from Google Calendar via API

**Files to create:**
- `backend/src/main/java/com/lutem/mvp/service/GoogleCalendarService.java`
- Update `GoogleCalendarController.java`

---

### Step 4.5: Frontend Integration (1.5-2 hours)

- [ ] Add "Connect Google Calendar" button to calendar header:
  - Icon: Google logo or calendar icon
  - Placement: Next to "Import Calendar" button
- [ ] Implement OAuth flow handling:
  - Option A: Popup window (better UX, more complex)
  - Option B: Redirect (simpler, page reload)
  - Recommendation: Start with redirect, popup later
- [ ] Add connection status indicator:
  - Not connected: Show "Connect Google Calendar" button
  - Connected: Show email + "Sync Now" + "Disconnect" buttons
- [ ] Create `connectGoogleCalendar()` function:
  - Redirects to `/calendar/google/auth`
- [ ] Create `syncGoogleCalendar()` function:
  - Calls `/calendar/google/sync`
  - Shows progress toast
  - Refreshes calendar on completion
- [ ] Create `disconnectGoogleCalendar()` function:
  - Calls `/calendar/google/disconnect`
  - Updates UI to show disconnected state
- [ ] Check connection status on page load:
  - Call `/calendar/google/status`
  - Update UI accordingly

**Checkpoint:** Full connect → sync → disconnect flow works in UI

**Files to update:**
- `frontend/index.html` - Add buttons
- `frontend/js/calendar.js` - Add functions
- `frontend/css/pages/calendar.css` - Style new elements

---

### Step 4.6: Testing & Edge Cases (1-2 hours)

- [ ] Test happy path: Connect → Sync → Events appear
- [ ] Test with different Google accounts
- [ ] Test token expiration (wait 1 hour or manually expire)
- [ ] Test with large calendar (100+ events)
- [ ] Test with calendar that has recurring events
- [ ] Test disconnect and reconnect
- [ ] Test error scenarios:
  - User denies consent
  - Network failure during sync
  - Invalid/expired token
- [ ] Test interaction with Firebase auth (both use Google)
- [ ] Test on production environment (Railway)

**Checkpoint:** Google Calendar OAuth is production-ready

---

### Known Gotchas & Tips

1. **Consent Screen "Testing" mode:** Limited to 100 users, tokens expire after 7 days. Fine for MVP.
2. **Firebase + Google OAuth conflict:** Both use Google sign-in but for different purposes. Keep them separate (different buttons, different flows).
3. **Token refresh:** Access tokens expire after 1 hour. Either refresh proactively or handle 401 errors.
4. **Production redirect URI:** Must add Railway URL to Google Cloud Console before deploying.
5. **Scopes:** Start with `calendar.readonly`. Adding `calendar.events` later allows creating events in Google Calendar.

---

### Optional Future Enhancements (Not in MVP)

- [ ] Two-way sync (create events in Google from Lutem)
- [ ] Multiple calendar support (work + personal)
- [ ] Auto-sync on schedule (background job)
- [ ] Store tokens in database for persistence
- [ ] Support for other calendars (Outlook, Apple)

**Checkpoint:** Full Google Calendar integration working

---

## Phase 5: Calendar Visual Overhaul
**Status:** 🔴 Not Started  
**Estimated:** 2-3 sessions  
**Priority:** HIGH - Current calendar page looks unpolished

### Step 5.1: Calendar Layout & Structure
- [ ] Improve overall page layout and spacing
- [ ] Add proper header section with title and actions
- [ ] Better responsive design for different screen sizes
- [ ] Fix any layout overflow/scrolling issues

**Checkpoint:** Calendar page has clean, balanced layout

### Step 5.2: Calendar Grid Styling
- [ ] Restyle FullCalendar to match Lutem theme
- [ ] Improve day cell appearance (hover states, today highlight)
- [ ] Better month/week/day view toggle buttons
- [ ] Style navigation arrows and date display
- [ ] Improve time slot appearance in week/day views
- [ ] Add subtle grid lines and borders

**Checkpoint:** Calendar grid looks native to Lutem design

### Step 5.3: Event Cards/Pills
- [ ] Color code event types with theme colors:
  - Gaming sessions: primary accent color
  - Tasks: secondary/muted color
  - Imported events: distinct color
- [ ] Add icons to events (🎮 for games, ✓ for tasks)
- [ ] Improve event text truncation and overflow
- [ ] Better hover/selected states
- [ ] Show game cover thumbnails in events (if space permits)

**Checkpoint:** Events are visually distinct and informative

### Step 5.4: Add Event Modal Polish
- [ ] Review modal sizing and proportions
- [ ] Improve tab/mode switcher styling
- [ ] Better spacing in form fields
- [ ] Polish game selection cards
- [ ] Improve wizard step transitions
- [ ] Style random mode dice animation
- [ ] Better button hierarchy (primary/secondary actions)

**Checkpoint:** Modal feels polished and intuitive

### Step 5.5: Calendar Header Actions
- [ ] Style "Import Calendar" button better
- [ ] Add "Add Event" button to header (not just click-to-add)
- [ ] View switcher (Month/Week/Day) styling
- [ ] Today/navigation button polish
- [ ] Optional: Mini calendar for quick date jumping

**Checkpoint:** Header is functional and looks professional

### Step 5.6: Empty States & Loading
- [ ] Design empty calendar state (no events)
- [ ] Loading skeleton while fetching events
- [ ] Error state design
- [ ] "No games found" state in modal

**Checkpoint:** All states have proper visual treatment

### Step 5.7: Theme Integration
- [ ] Ensure all calendar elements use CSS variables
- [ ] Test all 4 color themes (Café, Lavender, Earth, Ocean)
- [ ] Test light/dark mode combinations
- [ ] Fix any theme-specific visual issues

**Checkpoint:** Calendar looks great in all theme combinations

---

## Phase 6: Polish & Edge Cases
**Status:** 🔴 Not Started  
**Estimated:** 1 session

### Step 6.1: Conflict Handling
- [ ] Detect overlapping events
- [ ] Show warning before creating
- [ ] Allow override

### Step 6.2: Error Handling
- [ ] Handle API failures gracefully
- [ ] Show user-friendly error messages
- [ ] Retry options for network errors

### Step 6.3: UX Improvements
- [ ] Keyboard shortcuts (Escape to close modal, etc.)
- [ ] Drag to resize events
- [ ] Drag to reschedule events
- [ ] Quick edit on event click

**Checkpoint:** Edge cases handled, UX polished

---

## Current Progress

| Phase | Status | Estimate | Notes |
|-------|--------|----------|-------|
| Phase 1 | ✅ Complete | - | Modal, tasks, gaming sessions all work |
| Phase 2 | ✅ Complete | - | Browse, Wizard, and Random modes all work |
| Phase 3 | ✅ Complete | - | ICS Import with persistence |
| Phase 4 | 🔴 Not Started | **10-15 hours (3-4 sessions)** | Google Calendar OAuth - detailed plan added |
| Phase 5 | 🔴 Not Started | 2-3 sessions | **Visual Overhaul - NEXT PRIORITY** |
| Phase 6 | 🔴 Not Started | 1 session | Polish & Edge Cases |

---

## Session Handoff Notes

### To Continue Development:

**Copy this prompt to start a new chat:**

```
I'm working on the Lutem project calendar features. 

Project location: D:\Lutem\LutemPrototype
GitHub: https://github.com/jantobiaswilhelm/LutemPrototype

Please read the implementation plan:
D:\Lutem\LutemPrototype\docs\CALENDAR_IMPLEMENTATION_PLAN.md

Check the "Current Progress" section to see where we left off, then continue with the next uncompleted step. After completing each step, update the checkboxes in the plan file.

Key files:
- Frontend: frontend/index.html, frontend/js/calendar.js
- Backend: backend/src/main/java/com/lutem/mvp/controller/CalendarController.java
- Styles: frontend/css/components.css

Start the backend with: D:\Lutem\LutemPrototype\start-backend.bat
```

### After Each Step:
1. Update checkbox in this file: `- [ ]` → `- [x]`
2. Add notes if needed
3. Test the feature
4. Commit if stable

---

## Technical References

### Existing APIs
- `GET /games` - List all games
- `POST /recommendations` - Get game recommendation
- `GET /calendar/events` - List calendar events
- `POST /calendar/events` - Create event
- `PUT /calendar/events/{id}` - Update event
- `DELETE /calendar/events/{id}` - Delete event

### CalendarEvent Model
```java
{
  id: Long,
  title: String,
  startTime: LocalDateTime,
  endTime: LocalDateTime,
  type: "TASK" | "GAME",
  gameId: Long (nullable),
  description: String
}
```

### Key Frontend Functions
- `initCalendar()` - Initialize FullCalendar
- `loadCalendarEvents()` - Fetch and display events
- `addTaskEvent()` - Current task modal (to be replaced)
- `showGameWizardForCalendar()` - Calendar → Wizard integration

---

**Last Updated:** December 1, 2025
