# Calendar Implementation Plan

**Created:** November 28, 2025  
**Updated:** November 29, 2025  
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
**Status:** 🟡 Partial (Browse works, Wizard/Random are placeholders)  
**Estimated:** 1 session

### Step 2.1: Browse Library Mode ✅ COMPLETE
- [x] Searchable game list in modal
- [x] Show game cover thumbnail, name, duration
- [x] Click to select, highlight selected game
- [ ] Optional: filter by genre (deferred)

**Checkpoint:** ✅ Can search and browse games in modal

### Step 2.2: Wizard Recommendation Mode
- [ ] Mini-wizard UI: mood selector, energy level
- [ ] Calculate duration from selected time slot
- [ ] Call `/recommendations` API
- [ ] Show recommended game with Accept/Try Another buttons

**Checkpoint:** Wizard recommends game, can accept or retry

### Step 2.3: Random Game Mode
- [ ] "🎲 Surprise Me" button
- [ ] Randomly select from library (filtered by time if set)
- [ ] Show selected game, allow re-roll

**Checkpoint:** Random selection works

---

## Phase 3: ICS File Import
**Status:** 🔴 Not Started  
**Estimated:** 1 session

### Step 3.1: Frontend File Upload
- [ ] Add "📥 Import Calendar" button to calendar header
- [ ] File input accepting .ics files
- [ ] Read file content client-side

**Checkpoint:** Can select and read .ics file

### Step 3.2: ICS Parsing (Client-Side)
- [ ] Parse VEVENT components from ICS
- [ ] Extract: summary (title), dtstart, dtend, description
- [ ] Convert to Lutem event format
- [ ] Handle timezone issues

**Checkpoint:** ICS events parsed correctly

### Step 3.3: Bulk Import to Backend
- [ ] Create `/calendar/events/bulk` endpoint (POST array of events)
- [ ] Skip duplicates (same title + start time)
- [ ] Return import summary
- [ ] Frontend shows "Imported X events, Y skipped"

**Checkpoint:** ICS import works end-to-end

---

## Phase 4: Google Calendar OAuth
**Status:** 🔴 Not Started  
**Estimated:** 2 sessions

### Step 4.1: Google Cloud Setup
- [ ] Create Google Cloud project
- [ ] Enable Calendar API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URIs

**Checkpoint:** Google Cloud configured

### Step 4.2: Backend OAuth Flow
- [ ] Add Spring Security OAuth2 dependencies
- [ ] Create `/calendar/google/auth` - redirect to Google
- [ ] Create `/calendar/google/callback` - handle token
- [ ] Store access token in session

**Checkpoint:** OAuth login flow works

### Step 4.3: Fetch Google Events
- [ ] Create `/calendar/google/events` endpoint
- [ ] Use Google Calendar API to fetch events
- [ ] Convert to Lutem format
- [ ] Handle pagination for large calendars

**Checkpoint:** Can fetch events from Google Calendar

### Step 4.4: Frontend Integration
- [ ] "Connect Google Calendar" button
- [ ] Handle OAuth popup/redirect
- [ ] Show connected status
- [ ] "Sync Now" and "Disconnect" buttons

**Checkpoint:** Full Google Calendar integration working

---

## Phase 5: Polish & Edge Cases
**Status:** 🔴 Not Started  
**Estimated:** 1 session

### Step 5.1: Visual Improvements
- [ ] Color code event types (task=gray, game=blue, imported=green)
- [ ] Add icons to event titles
- [ ] Improve modal styling

### Step 5.2: Conflict Handling
- [ ] Detect overlapping events
- [ ] Show warning before creating
- [ ] Allow override

### Step 5.3: Error Handling
- [ ] Handle API failures gracefully
- [ ] Show user-friendly error messages
- [ ] Retry options for network errors

**Checkpoint:** Polish complete, edge cases handled

---

## Current Progress

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 1 | ✅ Complete | Modal, tasks, gaming sessions all work |
| Phase 2 | 🟡 Partial | Browse works; Wizard/Random are placeholders |
| Phase 3 | 🔴 Not Started | ICS Import |
| Phase 4 | 🔴 Not Started | Google Calendar OAuth - **NEXT PRIORITY** |
| Phase 5 | 🔴 Not Started | Polish |

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

**Last Updated:** November 29, 2025
