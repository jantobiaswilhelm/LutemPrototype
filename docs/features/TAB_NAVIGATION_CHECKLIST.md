# Tab Navigation - Implementation Checklist

**Status:** ✅ Phase 1 Complete, Ready for Phase 2  
**Started:** 2025-01-15  
**Phase 1 Completed:** 2025-01-15  
**Estimated Time Remaining:** 2-3 hours (Phases 2-3)

---

## ✅ PHASE 1: Navigation Structure (30-45 min) - COMPLETE

### HTML Changes
- [x] Add `<nav class="tabs">` section to header
- [x] Create three tab buttons (Home, Games, Profile)
- [x] Add `data-page` attributes to buttons
- [x] Wrap existing content in `<div id="home-page" class="page-content active">`
- [x] Create empty `<div id="games-page" class="page-content">`
- [x] Create empty `<div id="profile-page" class="page-content">`

### CSS for Tabs
- [x] Style `.tabs` container (flexbox, gap, border-bottom)
- [x] Style `.tab-button` (padding, hover effects)
- [x] Style `.tab-button.active` (highlight, underline/border)
- [x] Style `.page-content` (display: none by default)
- [x] Style `.page-content.active` (display: block)
- [x] Add smooth transitions
- [x] **BONUS:** Redesigned as centered button-style tabs with gradient

### JavaScript Tab Switching
- [x] Add event listeners to tab buttons
- [x] Implement tab switching logic
- [x] Remove active class from all tabs/pages
- [x] Add active class to clicked tab/page
- [x] Test: Clicking tabs switches content

### Testing Phase 1
- [x] Test: Home tab shows recommendation interface
- [x] Test: Games tab shows empty page
- [x] Test: Profile tab shows empty page
- [x] Test: Active tab is highlighted
- [x] Test: Tab switching is smooth
- [x] Test: No duplicate content showing
- [x] Test: Fixed structure with separate pages

---

## ✅ PHASE 2: Games Library Page (1.5-2 hours)

### API Integration
- [ ] Add function to fetch all games: `fetchAllGames()`
- [ ] Call API: `GET http://localhost:8080/games`
- [ ] Store games in variable: `let allGames = []`
- [ ] Store filtered games: `let filteredGames = []`

### Filter Bar HTML
- [ ] Create filter container
- [ ] Add search input with icon
- [ ] Add Genre dropdown
  - [ ] Populate with unique genres from games
  - [ ] Add "All" option
- [ ] Add Time dropdown
  - [ ] Options: All, Casual (<30min), Mid (30-90min), Long (>90min)
- [ ] Add Platform dropdown
  - [ ] Options: All, PC, Console, Mobile
- [ ] Add Sort dropdown
  - [ ] Options: Rating, Name (A-Z), Playtime
- [ ] Add game count display (e.g., "42 games")

### Filtering Logic (JavaScript)
- [ ] Implement `filterGames()` function
- [ ] Filter by search text (case-insensitive, includes)
- [ ] Filter by genre (exact match or "All")
- [ ] Filter by time range
  - [ ] Casual: maxMinutes <= 30
  - [ ] Mid: minMinutes >= 30 && maxMinutes <= 90
  - [ ] Long: minMinutes >= 90
- [ ] Filter by platform (check if game.platforms includes selected)
- [ ] Update filteredGames array
- [ ] Call `renderGameGrid()`

### Sorting Logic (JavaScript)
- [ ] Implement `sortGames(filteredGames, sortBy)` function
- [ ] Sort by rating (high to low)
- [ ] Sort by name (A-Z alphabetical)
- [ ] Sort by playtime (avgPlaytime, short to long)
- [ ] Return sorted array

### Game Grid Display
- [ ] Create `renderGameGrid(games)` function
- [ ] Clear existing grid
- [ ] Loop through games
- [ ] For each game, create game card:
  - [ ] Cover image with fallback
  - [ ] Game name
  - [ ] Star rating (convert to stars)
  - [ ] Playtime range (e.g., "20-60 min")
  - [ ] Primary mood tags (top 2-3)
  - [ ] Click handler to open details modal
- [ ] Use CSS Grid or Flexbox for responsive layout
- [ ] 3 columns desktop, 2 tablet, 1 mobile

### Game Details Modal
- [ ] Create modal HTML structure
- [ ] Style modal (overlay, centered, close button)
- [ ] Implement `showGameDetails(game)` function
  - [ ] Display cover image
  - [ ] Display full description
  - [ ] Show all mood scores (bars or dots)
  - [ ] Show platforms
  - [ ] Show store links (Steam, Epic, etc.)
- [ ] Add close button handler
- [ ] Add click-outside-to-close handler
- [ ] Add ESC key to close

### Styling Games Page
- [ ] Style filter bar (clean, horizontal layout)
- [ ] Style dropdowns and search input
- [ ] Style game grid (responsive, cards)
- [ ] Style game cards (hover effects, shadow)
- [ ] Style mood tags (color-coded pills)
- [ ] Style modal (overlay, animation)

### Testing Phase 2
- [ ] Test: All games load correctly
- [ ] Test: Search filter works
- [ ] Test: Genre filter works
- [ ] Test: Time filter works
- [ ] Test: Platform filter works
- [ ] Test: Sorting works (all options)
- [ ] Test: Game cards display correctly
- [ ] Test: Modal opens with correct game data
- [ ] Test: Modal closes properly
- [ ] Test: Responsive on mobile/tablet

---

## ✅ PHASE 3: Profile Page (45-60 min)

### Stats Section
- [ ] Create stats container
- [ ] Display hardcoded placeholders:
  - [ ] Total Recommendations: 0
  - [ ] Average Satisfaction: N/A
  - [ ] Games Played: 0
  - [ ] Total Gaming Time: 0 hours
- [ ] Use icons or emojis
- [ ] Style as cards or list

### Favorite Moods Section
- [ ] Create moods container
- [ ] Display placeholder:
  - [ ] "Your Most Requested Moods"
  - [ ] Empty state: "Start getting recommendations to see your favorite moods!"
- [ ] Add mood bars (for later data):
  - [ ] Unwind bar (empty)
  - [ ] Engage bar (empty)
  - [ ] Challenge bar (empty)
  - [ ] etc.

### Recent Activity Section (Optional)
- [ ] Create activity container
- [ ] Display placeholder:
  - [ ] "Recent Recommendations"
  - [ ] Empty state: "No recommendations yet"
- [ ] Style for future game list

### Settings Section
- [ ] Create settings container
- [ ] Add theme selector:
  - [ ] Dropdown: Warm Café, Lavender, Earth
  - [ ] Hook up to existing theme switching
- [ ] Add default time input (just UI, no save yet)
- [ ] Add show tutorial checkbox (just UI)
- [ ] Add placeholder buttons:
  - [ ] Reset Stats (disabled for now)
  - [ ] Export Data (disabled for now)

### Styling Profile Page
- [ ] Use card-based layout
- [ ] Consistent with existing design
- [ ] Responsive layout (stack on mobile)
- [ ] Add appropriate spacing and padding
- [ ] Use existing color variables

### Testing Phase 3
- [ ] Test: Profile page displays correctly
- [ ] Test: All sections visible
- [ ] Test: Theme selector works
- [ ] Test: Responsive on mobile/tablet
- [ ] Test: Placeholders look clean

---

## ✅ PHASE 4: Polish & Final Testing (30 min)

### Cross-Page Testing
- [ ] Test: Navigate between all three tabs smoothly
- [ ] Test: Home page still works perfectly
- [ ] Test: Games page filters work
- [ ] Test: Profile page displays correctly
- [ ] Test: No JavaScript errors in console

### Responsive Testing
- [ ] Test on desktop (1920x1080)
- [ ] Test on laptop (1366x768)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Fix any layout issues

### Visual Consistency
- [ ] Check all pages use same color palette
- [ ] Check fonts are consistent
- [ ] Check spacing is consistent
- [ ] Check buttons/inputs match style

### Performance Check
- [ ] Test: Page loads quickly
- [ ] Test: Tab switching is instant
- [ ] Test: Game filtering is smooth
- [ ] Test: No lag or delays

### Final Touches
- [ ] Add loading state for games page
- [ ] Add empty states where needed
- [ ] Add helpful hints/tooltips
- [ ] Proofread all text content

---

## 🎯 Definition of Done

### Phase 1 Complete When:
- ✅ Three tabs exist and are clickable
- ✅ Clicking tabs switches content
- ✅ Active tab is visually highlighted
- ✅ Home page unchanged and working

### Phase 2 Complete When:
- ✅ All games display in grid
- ✅ All filters work correctly
- ✅ Sorting works for all options
- ✅ Game modal shows full details
- ✅ Responsive on all screen sizes

### Phase 3 Complete When:
- ✅ Profile page displays with sections
- ✅ Placeholders look clean and professional
- ✅ Theme selector works
- ✅ Layout is responsive

### Phase 4 Complete When:
- ✅ All three pages work flawlessly
- ✅ No visual bugs or layout issues
- ✅ Fast and smooth on all devices
- ✅ Ready for user testing

---

## 🚨 Common Issues & Solutions

### Issue: Games not loading
**Solution:** Check API endpoint, verify CORS, check backend is running

### Issue: Filters not working
**Solution:** Check filteredGames array updates, verify filter logic

### Issue: Modal won't close
**Solution:** Check event listeners, verify modal.style.display logic

### Issue: Layout breaks on mobile
**Solution:** Use CSS Grid `auto-fit` or media queries

### Issue: Theme switching breaks tabs
**Solution:** Ensure tab styles use CSS variables

---

## 📝 Notes

### Current Progress
- [ ] Phase 1: Not started
- [ ] Phase 2: Not started
- [ ] Phase 3: Not started
- [ ] Phase 4: Not started

### Time Tracking
- Phase 1: ___ minutes
- Phase 2: ___ minutes
- Phase 3: ___ minutes
- Phase 4: ___ minutes
- **Total:** ___ minutes

### Decisions Made
- Using client-side filtering (sufficient for 41 games)
- No URL routing (keep it simple)
- Primitive profile page (expand later)
- Modal for game details (clean UX)

---

**Ready to start?** Begin with Phase 1 - setting up the tab navigation structure!
