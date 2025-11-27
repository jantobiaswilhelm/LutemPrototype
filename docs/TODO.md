# Lutem MVP - Development TODO

## 🚨 Critical Issues - Calendar Integration

### High Priority (Blocking Calendar Feature)
- [ ] **Fix calendar not displaying**
  - Issue: Calendar component not rendering on Calendar tab
  - File: `frontend/index.html`
  - Section: Calendar initialization and FullCalendar library
  - Documentation: `docs/calendar-known-issues.md` Issue #1

- [ ] **Make wizard accessible from Calendar tab**
  - Issue: Game wizard only available in Home tab
  - Solution: Convert wizard to shared modal component
  - Documentation: `docs/calendar-known-issues.md` Issue #2

- [ ] **Fix task creation functionality**
  - Issue: "Add Task" button and modal not working
  - File: `frontend/index.html` - addTaskEvent() function
  - Documentation: `docs/calendar-known-issues.md` Issue #3

### Medium Priority (UX Enhancement)
- [ ] **Add task type selection**
  - Feature: Let users choose between Regular Task or Gaming Session
  - Implementation: Modal with radio buttons before showing respective forms
  - Documentation: `docs/calendar-known-issues.md` Issue #4

- [ ] **Integrate gaming session workflow**
  - Feature: Gaming sessions should open wizard and schedule recommended game
  - Flow: Time slot → Type selection → Wizard → Game recommendation → Calendar event
  - Documentation: `docs/calendar-known-issues.md` Issue #5

---

## 📋 Backlog - Future Enhancements

### Calendar Features
- [ ] Add week/month/day view switching
- [ ] Implement recurring events
- [ ] Add calendar event reminders/notifications
- [ ] Export calendar to Google Calendar/Outlook
- [ ] Add calendar sharing functionality
- [ ] Implement event search/filter

### Game Recommendation
- [ ] Add "Alternative Recommendations" section
- [ ] Implement game history tracking
- [ ] Add favorite games functionality
- [ ] Create personalized recommendation learning
- [ ] Add social features (friends' recommendations)

### Profile & Settings
- [ ] Add avatar upload
- [ ] Implement theme customization
- [ ] Add language localization
- [ ] Create notification preferences
- [ ] Add data export functionality

### Statistics & Analytics
- [ ] Weekly gaming recap dashboard
- [ ] Mood tracking over time
- [ ] Achievement progress visualization
- [ ] Gaming time analytics
- [ ] Satisfaction trends graph

### Technical Improvements
- [ ] Add proper error handling and user feedback
- [ ] Implement loading states for all async operations
- [ ] Add unit tests for recommendation algorithm
- [ ] Optimize image loading and caching
- [ ] Add offline support with service workers
- [ ] Implement proper authentication system
- [ ] Add database migration system

### UI/UX Polish
- [ ] Add micro-animations for interactions
- [ ] Improve mobile responsiveness
- [ ] Add keyboard shortcuts
- [ ] Implement accessibility features (ARIA labels)
- [ ] Add onboarding tutorial for new users
- [ ] Create help/documentation section

---

## ✅ Completed Features

### Phase 0-5 (MVP Foundation)
- ✅ Basic project structure
- ✅ Spring Boot backend setup
- ✅ Game library with 41 games
- ✅ Multi-dimensional recommendation engine
- ✅ Frontend with HTML/CSS/JavaScript
- ✅ Loading spinner with gaming quotes
- ✅ Game cover images and visual polish
- ✅ Mood-based color coding
- ✅ Satisfaction feedback system (1-5 stars)
- ✅ Quick Start wizard
- ✅ Advanced options panel
- ✅ Profile page with preferences
- ✅ Games library page with filters

### Recent Additions
- ✅ Calendar backend endpoints (CRUD operations)
- ✅ Calendar frontend structure
- ✅ Event modals (details and add task)
- ✅ Calendar utility functions
- ✅ Event type differentiation (GAME vs TASK)

### Frontend Refactoring (Nov 27, 2025)
- ✅ CSS extracted to 6 modular files
- ✅ JavaScript split into 14 focused modules
- ✅ index.html reduced from 5,706 to 1,078 lines (81% reduction)
- ✅ Clear separation of concerns
- ✅ Proper script loading order with dependencies
- [ ] Final testing of all 4 pages
- [ ] Testing of all 8 theme combinations

---

## 🐛 Known Bugs

### High Priority
- ⚠️ Calendar not rendering (see Critical Issues)
- ⚠️ Task creation modal not working (see Critical Issues)
- ⚠️ Wizard not accessible from calendar (see Critical Issues)

### Medium Priority
- ⚠️ Image loading errors not handled gracefully on slow connections
- ⚠️ Modal overlays sometimes don't close properly
- ⚠️ Profile preferences not persisting after page refresh in some browsers

### Low Priority
- ⚠️ Dark mode toggle animation sometimes stutters
- ⚠️ Some game descriptions truncate oddly on small screens
- ⚠️ Console warnings for deprecated FullCalendar options

---

## 📚 Documentation Needs

- [ ] Complete API documentation for all endpoints
- [ ] Add JSDoc comments to major functions
- [ ] Create user guide for calendar features
- [ ] Document recommendation algorithm logic
- [ ] Write deployment guide
- [ ] Create database schema documentation
- [ ] Add troubleshooting guide

---

## 🚀 Next Sprint Goals

### Sprint Goal: Fix Calendar Integration
**Duration:** 1-2 weeks  
**Priority:** High

**Must Have:**
1. Calendar displays correctly
2. Task creation works
3. Wizard accessible from calendar

**Should Have:**
4. Task type selection implemented
5. Gaming session workflow complete

**Nice to Have:**
6. Event editing functionality
7. Better error messages
8. Calendar loading animation

---

## 📝 Notes

- **Calendar integration started:** November 23, 2025
- **Known issues documented:** See `docs/calendar-known-issues.md`
- **Backend ready:** All calendar endpoints tested and working
- **Frontend blocked:** Calendar display and wizard integration issues

**Development Team Notes:**
- Focus on getting calendar visible first
- Then fix task creation
- Finally implement full gaming session workflow
- Don't add new features until calendar is stable
- **Frontend refactoring completed Nov 27** - now easier to debug issues

---

**Last Updated:** November 27, 2025  
**Next Review:** After frontend refactoring testing complete
