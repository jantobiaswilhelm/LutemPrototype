# Calendar Integration - Known Issues & Planned Fixes

## 🐛 Current Issues (Not Yet Fixed)

### 1. Calendar Not Showing Up
**Status:** ❌ Not Working  
**Description:** The calendar component is not rendering when switching to the Calendar tab.

**Possible Causes:**
- FullCalendar library may not be loading properly
- Calendar initialization may not be triggering correctly
- DOM element `#calendar` may not be found
- CSS/styling conflicts preventing visibility

**Planned Fix:**
- Verify FullCalendar script and CSS are loaded
- Add console logging to track initialization
- Check if calendar is being initialized on page switch
- Verify DOM structure and element IDs

---

### 2. Game Wizard Not Available in Calendar Tab
**Status:** ❌ Not Working  
**Description:** The game recommendation wizard is only accessible from the Home tab, not from the Calendar tab.

**Current Behavior:**
- Wizard only exists in home-page
- Calendar time slot selection tries to access wizard that's not in scope

**Planned Fix:**
- Move wizard to a shared modal component
- Make wizard accessible from both Home and Calendar tabs
- Update wizard opening logic to work from multiple contexts

---

### 3. Task Cannot Be Added
**Status:** ❌ Not Working  
**Description:** The "Add Task" button and modal are not functioning properly.

**Possible Issues:**
- Modal not displaying when button clicked
- Form submission not working
- Backend endpoint not being called correctly
- Validation errors preventing submission

**Planned Fix:**
- Debug modal display logic
- Verify form event handlers
- Test backend calendar endpoint with manual requests
- Add error logging for form submission

---

### 4. Missing Task Type Selection
**Status:** ⚠️ Feature Missing  
**Description:** Users cannot choose between creating a regular task or a gaming session.

**Current Behavior:**
- All calendar events are created with a fixed type
- No option to specify task vs gaming session

**Required Changes:**
```
Calendar Event Creation Flow:
1. User clicks time slot or "Add Task" button
2. Modal appears with type selection:
   [ ] Regular Task/Event
   [ ] Gaming Session
3. If "Regular Task" selected:
   - Show task form (title, description, times)
4. If "Gaming Session" selected:
   - Show game recommendation wizard
   - User selects mood, energy, etc.
   - System recommends game
   - Create calendar event with selected game
```

**Implementation Plan:**
- Create unified event creation modal
- Add radio buttons or toggle for task type selection
- Route to appropriate form based on selection
- Update backend to handle both event types properly

---

### 5. Gaming Session Selection Not Integrated
**Status:** ⚠️ Feature Missing  
**Description:** The wizard should automatically schedule recommended games to the calendar.

**Required Workflow:**
```
Gaming Session Creation:
1. User selects time slot on calendar
2. Modal asks: "Regular Task" or "Gaming Session"?
3. If "Gaming Session":
   a. Open game recommendation wizard
   b. User fills in preferences (mood, energy, etc.)
   c. System recommends game
   d. User confirms or adjusts recommendation
   e. Calendar event created with:
      - Title: "🎮 [Game Name]"
      - Start/End times from selected slot
      - Type: GAME
      - GameId & metadata stored
```

**Implementation Requirements:**
- Wizard must accept start/end time parameters
- Wizard must return selected game to calendar
- Calendar must create event after wizard completion
- Event must display properly with game information

---

## 📋 Implementation Priority

### Phase 1 - Critical Fixes (Required for MVP)
1. ✅ Fix calendar display issue
2. ✅ Make wizard accessible from calendar
3. ✅ Fix task creation functionality

### Phase 2 - Enhanced UX (Next Sprint)
4. ✅ Add task type selection modal
5. ✅ Integrate gaming session workflow
6. ✅ Test complete calendar → wizard → event flow

---

## 🔍 Debugging Steps to Try

### For Calendar Not Showing:
```javascript
// Add to console after switching to calendar tab
console.log('Calendar element:', document.getElementById('calendar'));
console.log('Calendar instance:', calendar);
console.log('FullCalendar loaded:', typeof FullCalendar);
```

### For Wizard Access:
```javascript
// Check if wizard elements exist in calendar page
console.log('Wizard page:', document.getElementById('wizard-page'));
console.log('Is wizard in DOM:', document.contains(document.getElementById('wizard-page')));
```

### For Task Creation:
```javascript
// Test backend endpoint manually
fetch('http://localhost:8080/calendar/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Test Task',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 3600000).toISOString(),
    type: 'TASK'
  })
}).then(r => r.json()).then(console.log);
```

---

## 📝 Technical Notes

### Current Architecture Issues:
- **Wizard is page-specific**: Should be a global modal
- **Calendar initialization timing**: May need delay or different trigger
- **Event type handling**: Backend supports GAME/TASK but frontend doesn't fully utilize
- **Modal management**: Multiple modals need better coordination

### Recommended Refactoring:
1. Extract wizard to standalone modal component
2. Create unified event creation flow
3. Improve calendar initialization with proper lifecycle
4. Add comprehensive error handling and logging

---

## 🎯 Success Criteria

Calendar integration will be considered complete when:
- ✅ Calendar displays correctly on Calendar tab
- ✅ Users can click time slots to create events
- ✅ Users can choose between Task or Gaming Session
- ✅ Gaming sessions open the recommendation wizard
- ✅ Recommended games are added to calendar
- ✅ Tasks can be added manually
- ✅ Events can be viewed, edited, and deleted
- ✅ Calendar persists across page switches
- ✅ All event types display with correct colors and icons

---

**Last Updated:** November 23, 2025  
**Status:** Issues Documented - Awaiting Fix Implementation
