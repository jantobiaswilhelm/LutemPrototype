# Calendar Visual Overhaul - Session Guide

**Created:** December 1, 2025  
**Goal:** Phase 5 of Calendar Implementation - Make the calendar look polished  
**Approach:** Step-by-step with pauses to avoid chat limits

---

## Session Startup Prompt

Copy this to start the session:

```
I'm working on Lutem's calendar visual overhaul (Phase 5).

Project: D:\Lutem\LutemPrototype
Read the session guide: D:\Lutem\LutemPrototype\docs\sessions\CALENDAR_VISUAL_SESSION.md

Before we start coding, I'll answer the design questions in that file.
Then we'll work through each step with pauses between them.

Start the backend: D:\Lutem\LutemPrototype\start-backend.bat
Start the frontend: D:\Lutem\LutemPrototype\start-frontend.bat (or python -m http.server 5500 from frontend folder)
```

---

## Design Questions (Answer Before Starting)

1. **Overall Feel:** Do you want the calendar to feel:
   - A) Cozy and warm (like the home wizard - soft shadows, rounded corners)
   - B) Clean and functional (more minimal, productivity-focused)
   - C) Mix of both

2. **Gaming vs Tasks:** Should gaming sessions be:
   - A) Visually dominant (stand out, colorful, game covers prominent)
   - B) Equal weight with tasks (similar styling, just different colors)
   - C) Current approach is fine (game covers with overlay)

3. **Theme Priority:**
   - A) Perfect the Café theme first, then adapt others
   - B) Build for all 4 themes from the start

4. **Import Button:** The calendar has an "Import" button for ICS files. Should it:
   - A) Stay prominent (users import calendars often)
   - B) Be less prominent/secondary (most users won't use it)

---

## Work Steps (Do One at a Time)

### Step 1: Clean Up Inline Styles
**Time:** 30-40 minutes  
**Files:** `frontend/index.html`, `frontend/css/pages/calendar.css`

**What we'll do:**
- Extract all inline styles from calendar-page HTML
- Create proper CSS classes in calendar.css
- Replace hardcoded colors with CSS variables

**Pause after:** Verify calendar still looks the same, just with cleaner code

---

### Step 2: Fix the Legend Colors
**Time:** 10 minutes  
**Files:** `frontend/index.html`, `frontend/css/pages/calendar.css`

**What we'll do:**
- Replace hardcoded `#7db5d4` and `#6c757d` with theme variables
- Test in all 4 themes to ensure colors are correct

**Pause after:** Check legend in Café, Lavender, Earth, Ocean themes

---

### Step 3: Style FullCalendar Toolbar
**Time:** 20-30 minutes  
**Files:** `frontend/css/pages/calendar.css`

**What we'll do:**
- Style prev/next/today buttons to match Lutem
- Style view toggle buttons (Month/Week/Day)
- Style the title (month/year display)
- Add hover states

**Pause after:** Navigate around calendar, switch views, verify styling

---

### Step 4: Style Calendar Grid
**Time:** 20-30 minutes  
**Files:** `frontend/css/pages/calendar.css`

**What we'll do:**
- Style day headers (Mon, Tue, etc.)
- Style time column (left side times)
- Improve today highlight with theme color
- Add subtle hover on day cells
- Refine grid lines/borders

**Pause after:** Visual check of the grid in week and month views

---

### Step 5: Polish Event Cards
**Time:** 30-40 minutes  
**Files:** `frontend/css/pages/calendar.css`, possibly `frontend/js/calendar.js`

**What we'll do:**
- Add icons to event titles (🎮 for games, ✓ for tasks)
- Improve text truncation for long titles
- Better hover/selected states
- Ensure game cover events look good at different sizes

**Pause after:** Create test events, verify they look good

---

### Step 6: Polish Header Buttons
**Time:** 15-20 minutes  
**Files:** `frontend/css/pages/calendar.css`

**What we'll do:**
- Ensure Import/Gaming/Task buttons match Lutem button style
- Add consistent hover effects
- Check mobile responsive behavior

**Pause after:** Test buttons on different screen sizes

---

### Step 7: Add Empty State
**Time:** 20-30 minutes  
**Files:** `frontend/index.html`, `frontend/css/pages/calendar.css`, `frontend/js/calendar.js`

**What we'll do:**
- Design empty calendar message
- Show when no events exist
- Include call-to-action to add first event

**Pause after:** Delete all events, verify empty state shows

---

### Step 8: Theme Testing & Fixes
**Time:** 20-30 minutes  
**Files:** `frontend/css/pages/calendar.css`

**What we'll do:**
- Test all 8 combinations (4 palettes × light/dark)
- Fix any theme-specific issues
- Ensure contrast is good in all modes

**Pause after:** Screenshot or verify each theme looks correct

---

## Key Files Reference

```
frontend/
├── index.html                    # Calendar page HTML (lines ~557-615)
├── css/
│   ├── variables.css            # CSS variables (colors, spacing)
│   ├── themes.css               # Theme definitions
│   └── pages/
│       └── calendar.css         # Calendar-specific styles (main file we'll edit)
└── js/
    └── calendar.js              # FullCalendar init & event rendering
```

---

## Current Calendar HTML Structure (for reference)

```html
<div id="calendar-page" class="page-content">
    <div id="calendarLockedOverlay">...</div>
    <div class="container">
        <header>
            <h1>My Calendar</h1>
            <p>Plan your gaming sessions and tasks</p>
            <div>[Import] [Gaming Session] [New Task] buttons</div>
        </header>
        
        <div>[Calendar Container with FullCalendar]</div>
        
        <div>[Legend: Gaming Session | Task/Event]</div>
    </div>
</div>
```

---

## After Each Step

1. Test the change visually
2. Check in at least 2 themes (Café + one other)
3. Tell Claude "Step X complete, moving to Step Y" or "Step X has issues: [describe]"
4. Claude will update the implementation plan checkboxes

---

## End of Session

When done (or when chat limit approaching):

1. Note which step you're on
2. Commit changes: `git add . && git commit -m "Calendar visual overhaul - Steps 1-X complete"`
3. Update `CALENDAR_IMPLEMENTATION_PLAN.md` Phase 5 checkboxes

---

## Estimated Total Time

| Steps | Time |
|-------|------|
| Steps 1-4 (Core styling) | ~90 min |
| Steps 5-6 (Polish) | ~50 min |
| Steps 7-8 (Empty state, themes) | ~50 min |
| **Total** | **~3 hours** |

You might complete Steps 1-4 in one session, then Steps 5-8 in another.
