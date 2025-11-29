# Calendar Bugs - November 29, 2025

## Bug List

### 1. ✅ Corrupted emoji in gaming session titles (FIXED)
**Issue:** Gaming sessions show garbled text like `ÃƒÆ'Ã‚Â°Ãƒâ€¦Ã‚Â¸Ãƒâ€¦Ã‚Â½Ãƒâ€šÃ‚Â® Unpacking` instead of `🎮 Unpacking`
**Cause:** File encoding issue - emoji got corrupted during PowerShell string replacement
**Fix:** Replaced corrupted string with proper UTF-8 emoji ✓

### 2. ✅ Corrupted emoji on create task button (FIXED)
**Issue:** Same encoding issue on the save button text
**Cause:** Same as #1
**Fix:** Same as #1 ✓

### 3. ✅ Game cover images not loading in browse library (FIXED)
**Issue:** Images broken/not showing when selecting games in modal
**Cause:** Frontend used `coverImageUrl` but backend uses `imageUrl`
**Fix:** Changed `coverImageUrl` to `imageUrl` in calendar.js renderGameList() and selectGameForEvent() ✓

### 4. ✅ Default to Gaming Session tab when clicking time slot (FIXED)
**Issue:** When user clicks a time slot on calendar, modal opens on Task tab
**Want:** Should default to Gaming Session tab since that's the primary use case
**Fix:** Changed default tab parameter in openAddEventModal() to 'gaming' ✓

### 5. ✅ Add Event button placement (FIXED)
**Issue:** Button not nicely placed in calendar header
**Fix:** Replaced single button with two properly styled buttons using new CSS classes ✓

### 6. ✅ Want two separate buttons instead of one (FIXED)
**Issue:** Currently one "Add Event" button that opens modal with tabs
**Want:** Two buttons - "Create Gaming Session" and "Create Task" that pre-select the tab
**Fix:** Added two buttons with icons - "🎮 Gaming Session" and "📋 New Task" - each passing the appropriate defaultTab parameter ✓

---

## Status
- [x] Bug 1 - Corrupted emoji in titles ✅
- [x] Bug 2 - Corrupted emoji on button ✅
- [x] Bug 3 - Game images not loading ✅
- [x] Bug 4 - Default to gaming tab ✅
- [x] Bug 5 - Button placement ✅
- [x] Bug 6 - Two separate buttons ✅

## All bugs fixed! 🎉
