# Calendar Integration - Quick Fix Guide

## 🎯 Quick Start for Next Session

This guide provides step-by-step instructions to fix the calendar integration issues.

---

## Issue #1: Calendar Not Displaying

### Symptoms:
- Calendar tab shows empty space
- No calendar grid visible
- No errors in console (possibly)

### Files to Check:
- `frontend/index.html` - Lines ~5090-5200 (calendar initialization)
- Browser DevTools Console

### Debugging Steps:

**Step 1: Verify FullCalendar is Loaded**
```javascript
// Open browser console and run:
console.log('FullCalendar:', typeof FullCalendar);
// Should output: "FullCalendar: function"
// If "undefined", the library isn't loading
```

**Step 2: Check Calendar Element**
```javascript
// Switch to Calendar tab, then run:
console.log('Calendar element:', document.getElementById('calendar'));
console.log('Calendar parent:', document.getElementById('calendar-page'));
// Elements should exist and be visible
```

**Step 3: Check Initialization**
```javascript
// Run after switching to calendar tab:
console.log('Calendar instance:', calendar);
// Should show FullCalendar object, not null/undefined
```

### Likely Causes & Fixes:

**A) FullCalendar Script Not Loading:**
```html
<!-- Check these lines exist in <head>: -->
<link href="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.8/index.global.min.js"></script>
```

**B) Calendar Not Initialized on Tab Switch:**
Find the `switchNav()` function and verify this code exists:
```javascript
if (pageName === 'calendar' && !calendar) {
    setTimeout(() => {
        initCalendar();
    }, 100);
}
```

**C) CSS Display Issue:**
Check if calendar parent has `display: none`:
```javascript
// After switching to calendar:
const calPage = document.getElementById('calendar-page');
console.log('Display:', window.getComputedStyle(calPage).display);
// Should be "block" not "none"
```

### Quick Fix to Try:
```javascript
// Force calendar initialization in console:
const calendarEl = document.getElementById('calendar');
if (calendarEl && typeof FullCalendar !== 'undefined') {
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        editable: true,
        selectable: true
    });
    calendar.render();
    console.log('Calendar manually initialized!');
}
```

---

## Issue #2: Wizard Not Accessible from Calendar

### Symptoms:
- Clicking time slots does nothing
- Error in console about wizard elements not found

### Files to Check:
- `frontend/index.html` - Search for `showGameWizardForCalendar` function
- `frontend/index.html` - Search for `id="wizard-page"`

### Problem:
The wizard (`<div id="wizard-page">`) only exists inside `<div id="home-page">`, which is hidden when viewing the Calendar tab.

### Solution Approaches:

**Option A: Move Wizard to Global Scope (Recommended)**
1. Find the wizard HTML (search for `id="wizard-page"`)
2. Cut the entire `<div id="wizard-page">...</div>` section
3. Move it OUTSIDE of any page-specific divs
4. Place it near other modals (after calendar page, before `</body>`)

**Option B: Duplicate Wizard (Quick Fix)**
1. Copy the entire wizard div
2. Paste it inside the calendar-page div
3. Update IDs to avoid conflicts (`wizard-page-calendar`)
4. Update function calls to use new IDs when on calendar

**Option C: Make Wizard a Modal (Best Practice)**
```html
<!-- Convert wizard to fixed-position modal -->
<div id="wizard-modal" style="display: none; position: fixed; top: 0; left: 0; 
     width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000;">
    <div style="background: var(--surface); max-width: 800px; margin: 50px auto; 
         border-radius: 20px; padding: 30px;">
        <!-- Move wizard content here -->
    </div>
</div>
```

### Test After Fix:
1. Go to Calendar tab
2. Click and drag on an empty time slot
3. Wizard should appear with duration pre-filled
4. Complete wizard and verify event is created

---

## Issue #3: Task Creation Not Working

### Symptoms:
- "Add Task" button does nothing
- Modal doesn't appear
- Or modal appears but submit doesn't work

### Files to Check:
- `frontend/index.html` - Line ~5350 (addTaskEvent function)
- `frontend/index.html` - Line ~5545 (addTaskModal div)

### Debugging Steps:

**Step 1: Check if Button Exists**
```javascript
console.log('Add Task button:', 
    document.querySelector('[onclick="addTaskEvent()"]'));
```

**Step 2: Check if Modal Exists**
```javascript
console.log('Add Task modal:', 
    document.getElementById('addTaskModal'));
```

**Step 3: Test Function Manually**
```javascript
// Try calling the function:
addTaskEvent();
// Modal should appear
```

**Step 4: Test Backend**
```javascript
// Verify backend endpoint works:
fetch('http://localhost:8080/calendar/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Test Task',
        description: 'Testing',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
        type: 'TASK'
    })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

### Likely Causes & Fixes:

**A) Function Not Defined:**
Search for `function addTaskEvent()` - should exist around line 5350

**B) Modal Not Displaying:**
Check modal's initial style:
```html
<div id="addTaskModal" style="display: none; ...">
```
The function should set `display: flex` to show it.

**C) Form Submit Handler Not Working:**
Check that form has:
```html
<form id="addTaskForm" onsubmit="saveTask(event)">
```

**D) API_BASE_URL Not Defined:**
Should be defined around line 3617:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

### Quick Fix to Try:
```javascript
// Manually open modal:
document.getElementById('addTaskModal').style.display = 'flex';

// Or create complete function:
function addTaskEvent() {
    const modal = document.getElementById('addTaskModal');
    modal.style.display = 'flex';
    
    // Set default times
    const now = new Date();
    now.setMinutes(0, 0, 0);
    document.getElementById('taskStart').value = 
        formatDateTimeLocal(now);
    
    const end = new Date(now);
    end.setHours(end.getHours() + 1);
    document.getElementById('taskEnd').value = 
        formatDateTimeLocal(end);
}
```

---

## Issue #4 & #5: Task Type Selection & Gaming Session

### Symptoms:
- No way to choose between regular task and gaming session
- Time slots don't trigger game recommendations

### Implementation Plan:

**Step 1: Create Type Selection Modal**
```html
<!-- Add this modal before addTaskModal -->
<div id="eventTypeModal" style="display: none; position: fixed; top: 0; left: 0;
     width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000;
     align-items: center; justify-content: center;">
    <div style="background: var(--surface); border-radius: 20px; padding: 30px;
         max-width: 500px;">
        <h2>What would you like to add?</h2>
        <div style="display: grid; gap: 15px; margin-top: 20px;">
            <button onclick="selectEventType('TASK')" 
                    style="padding: 20px; border-radius: 12px; background: var(--accent-primary);">
                📋 Regular Task/Event
            </button>
            <button onclick="selectEventType('GAME')" 
                    style="padding: 20px; border-radius: 12px; background: var(--accent-secondary);">
                🎮 Gaming Session
            </button>
        </div>
    </div>
</div>
```

**Step 2: Update Calendar Select Handler**
```javascript
// In initCalendar(), update select handler:
select: function(info) {
    selectedTimeSlot = { start: info.start, end: info.end };
    const duration = (info.end - info.start) / (1000 * 60);
    selectedDuration = duration;
    
    // Show type selection modal
    document.getElementById('eventTypeModal').style.display = 'flex';
}
```

**Step 3: Add Type Selection Handler**
```javascript
function selectEventType(type) {
    // Hide type selection modal
    document.getElementById('eventTypeModal').style.display = 'none';
    
    if (type === 'TASK') {
        // Open task creation modal
        addTaskEvent();
    } else if (type === 'GAME') {
        // Open game wizard with selected time slot
        showGameWizardForCalendar(
            selectedTimeSlot.start, 
            selectedTimeSlot.end, 
            selectedDuration
        );
    }
}
```

---

## 🧪 Testing Checklist

After implementing fixes, test this complete flow:

### Calendar Display:
- [ ] Calendar tab shows calendar grid
- [ ] Can switch between week/month/day views
- [ ] Events display with correct colors
- [ ] No console errors

### Task Creation:
- [ ] "Add Task" button works
- [ ] Modal appears with form
- [ ] Can fill in title, description, times
- [ ] Submit creates event
- [ ] Event appears on calendar
- [ ] Can view event details by clicking

### Gaming Session:
- [ ] Click time slot shows type selection
- [ ] Select "Gaming Session" opens wizard
- [ ] Wizard shows with duration pre-filled
- [ ] Can complete wizard and get recommendation
- [ ] Selected game creates calendar event
- [ ] Event shows game name with 🎮 icon
- [ ] Event has correct color (blue)

### Event Management:
- [ ] Can drag events to reschedule
- [ ] Can resize events
- [ ] Can delete events
- [ ] Changes persist on refresh

---

## 📞 Need Help?

If you're stuck, check:
1. Browser console for errors
2. Network tab for failed API calls
3. `docs/calendar-known-issues.md` for detailed issue analysis
4. Backend logs for server errors

**Common Issues:**
- **CORS errors:** Backend might not be running
- **404 on calendar endpoints:** Check backend CalendarController is compiled
- **Elements not found:** Check exact element IDs match function calls
- **Styling issues:** Check if FullCalendar CSS is loaded

---

**Last Updated:** November 23, 2025  
**Next Steps:** Fix calendar display first, then wizard access, then task creation
