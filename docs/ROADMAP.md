# LUTEM MVP - Project Roadmap

**Last Updated:** 2025-11-29  
**Current Phase:** Phase 6 (Deployment in Progress)

---

## ✅ COMPLETED PHASES

### PHASE 0 - Lock in MVP ✅ COMPLETE
**Goal:** Create the smallest but real version of Lutem for one persona (Sam)

**Completed Features:**
- ✅ Manually entered/mocked list of games (57 games)
- ✅ Input: Available time (minutes)
- ✅ Input: Desired mood (8 dimensions: Unwind, Recharge, Engage, Challenge, Explore, Achieve, Social, Chill)
- ✅ System outputs best game recommendations
- ✅ Simple feedback loop (1-5 satisfaction rating)

**Excluded (as planned):**
- ❌ Calendar sync
- ❌ Steam/Xbox/PS APIs
- ❌ Authentication
- ❌ Dashboards
- ❌ Multi-persona support

---

### PHASE 1 - Set Up the Playground ✅ COMPLETE
**Goal:** Development environment and repo ready

**Completed:**
- ✅ Git repo "lutem-mvp" created
- ✅ backend/ (Spring Boot) - Full implementation
- ✅ frontend/ (HTML/JS/CSS) - Modern UI
- ✅ IntelliJ Spring Boot project setup
- ✅ API Endpoints:
  - GET /games
  - POST /recommendations
  - POST /sessions/feedback
- ✅ In-memory storage with H2 database

---

### PHASE 2 - Core Domain Modeling ✅ COMPLETE
**Backend Entities Implemented:**

**Game:**
- ✅ id, name, description
- ✅ minMinutes, maxMinutes, avgPlaytime
- ✅ genre, subgenre
- ✅ moodTags (8-dimensional emotional scoring)
- ✅ interruptibility, socialLevel, difficultyLevel, energyLevel
- ✅ platforms, cover image, store links

**RecommendationRequest:**
- ✅ availableMinutes, desiredMood
- ✅ energyLevel, timeOfDay, socialPreference

**RecommendationResponse:**
- ✅ game, matchPercentage, reason
- ✅ alternatives (top 3)

**SessionFeedback:**
- ✅ gameId, satisfactionScore, timestamp

---

### PHASE 3 - Recommendation Engine v0 ✅ COMPLETE
**Multi-Dimensional Scoring Algorithm:**
- ✅ Time fit scoring (45 points max)
- ✅ 8-dimensional mood matching (48 points max)
- ✅ Energy level matching (8 points)
- ✅ Social preference matching (6 points)
- ✅ Time of day matching (4 points)
- ✅ Interruptibility bonus (4 points)
- ✅ **Total: 115 points maximum**

**Advanced Features:**
- ✅ Soft ranking with genre preferences
- ✅ "Touch Grass" wellness feature (3+ hour sessions)
- ✅ Alternative recommendations (top 3)

---

### PHASE 4 - Minimal UI ✅ COMPLETE
**Frontend Implementation:**
- ✅ Modern HTML/CSS/JavaScript (no framework)
- ✅ Two interaction modes:
  - Quick Start wizard (guided)
  - Advanced options (direct access)
- ✅ Input fields for minutes + 8-dimensional mood
- ✅ Energy slider, time of day, social preference
- ✅ "Get Recommendation" button
- ✅ Display recommended game with alternatives
- ✅ Feedback buttons: 1-5 satisfaction rating
- ✅ Loading spinner with rotating gaming tips
- ✅ Match percentage display
- ✅ Mood-based color coding
- ✅ Game cover images
- ✅ Store links integration

**UI Polish:**
- ✅ Visual enhancements with color-coded moods
- ✅ Game cards with cover art
- ✅ Smooth transitions and animations
- ✅ Responsive design
- ✅ Input validation with helpful error messages

---

### PHASE 5 - Satisfaction Learning ✅ COMPLETE (Basic)
**Simple Learning Implemented:**
- ✅ Store feedback in H2 database
- ✅ Track satisfaction per game
- ✅ API endpoint for feedback submission

**Pending Enhancement:**
- 🔄 Compute average satisfaction per game
- 🔄 Use satisfaction to improve ranking

---

## 🚀 CURRENT PRIORITIES

### Quick Wins Completed
- ✅ Alternative recommendations (show top 3 games)
- ✅ Input validation and error handling
- ✅ Loading spinner with gaming tips
- ✅ Visual polish (colors, images, layout)
- ✅ Match percentage display
- ✅ Store links for each game

### 🔄 IN PROGRESS: Tab Navigation Structure
**Goal:** Organize Lutem into three navigable sections

**Three Pages:**
1. **🏠 Home** - Current recommendation interface (unchanged)
2. **🎮 Games** - Browse all games with filters (search, genre, time, platform)
3. **👤 Profile** - User stats and settings (primitive for now, expand later)

**Status:** Phase 1 Complete ✅ - Basic tab structure working  
**Remaining:** Phase 2 (Games library), Phase 3 (Profile page)  
**Effort:** 2-3 hours remaining  
**Documentation:** See `docs/features/TAB_NAVIGATION_*.md`

**Current Implementation:** Single-page app with show/hide (fast, simple)  
**Future Consideration:** Split into separate HTML pages when features grow (better organization, bookmarkable URLs)

### Next MVP-Focused Priorities

**Option A: Session History & Statistics (Small)**
- Show user's past recommendations
- Display satisfaction trends over time
- Track favorite moods/games
- **Effort:** 1 session (4-6 hours)
- **Value:** Helps users see their patterns

**Option B: Deploy to Production (Medium)**
- Get Lutem online for real user testing
- Deploy backend (Render/Railway/Heroku)
- Deploy frontend (Netlify/Vercel)
- **Effort:** 1-2 sessions (6-10 hours)
- **Value:** Real user feedback, portfolio piece

**Option C: Expand Game Library Manually (Small)**
- Add 10-20 more high-quality curated games
- Focus on filling gaps (more casual/indie games)
- Maintain quality over quantity
- **Effort:** 1 session (3-4 hours)
- **Value:** More variety without complexity

**Option D: Enhanced Feedback System (Small)**
- Optional feedback notes ("What did you like?")
- Show feedback history to users
- Better feedback UI/UX
- **Effort:** 1 session (4-5 hours)
- **Value:** Better data for future improvements

**Recommendation:** Start with **Option A (Session History)** or **Option B (Deployment)**  
Both are high-value, MVP-appropriate features that don't add excessive complexity.

---

## 📋 UPCOMING PHASES

### PHASE 6 - Persistence & Deployment (IN PROGRESS)
**Goals:**
- ✅ Phase 1: Environment configuration complete
- 🔄 Phase 2: Deploy backend to Railway
- ⬜ Phase 3: Deploy frontend to Netlify
- ⬜ Phase 4: Custom domain (lutem.3lands.ch)

**Status:** Environment detection implemented, awaiting Railway deployment

**Prerequisites:**
- ✅ Environment configuration
- ✅ Production build setup
- ✅ CORS configuration prepared

---

### PHASE 7 - Add One Integration (POSTPONED)
**Choose One:**
- Option A: Google Calendar (manual → real OAuth)
- Option B: RAWG API (add real game data search)

**Status:** Postponed - Too complex for MVP stage  
**Reason:** RAWG integration requires significant development effort (~30-40 hours) and might be premature before validating core value proposition with users

**Alternative Approach:** Manually curate additional high-quality games as needed

---

### PHASE 8 - Weekly Recap
**Backend:**
- GET /summary/weekly endpoint
- Aggregate user statistics
- Calculate trends and insights

**Frontend:**
- Dashboard card with:
  - Total sessions
  - Average satisfaction
  - Top games played
  - Mood trends

---

### PHASE 9 - Later Enhancements
**Future Features:**
- Authentication (Clerk/Firebase)
- Real calendar sync integration
- Steam/Xbox/PS game imports
- Multi-persona support (Mark, Emma, Lisa, Jake)
- Subscription model & analytics
- Improved dashboards & UX
- Mobile app (React Native/Flutter)

---

## 📊 PROJECT METRICS

### Current State
- **Games in Database:** 57
- **API Endpoints:** 3 core + Calendar CRUD + Admin CRUD
- **Scoring Dimensions:** 8 moods + 5 context factors
- **Max Match Score:** 115 points
- **Frontend:** Single-page application (modularized)
- **Backend:** Spring Boot with SQLite
- **Deployment:** Phase 1 complete, Phase 2 (Railway) next

### Technical Debt
- None critical
- Consider migration to PostgreSQL for production
- Add comprehensive testing suite
- Implement proper logging

---

## 🎯 SUCCESS CRITERIA

### MVP Success (Current Phase)
- ✅ Users can get personalized game recommendations
- ✅ Recommendations consider time, mood, and context
- ✅ Users can provide feedback
- ✅ System is visually appealing and easy to use

### Next Milestone Success
- 🔄 Feedback influences future recommendations
- 🔄 User can view their gaming history
- 🔄 System deployed and accessible online
- 🔄 Performance metrics tracked and optimized

---

## 📝 NOTES

### Recent Achievements
- Successfully implemented 8-tier emotional scoring system
- Created comprehensive game database with rich metadata (57 games)
- Built dual-mode UI (Quick Start + Advanced)
- Added visual polish with mood colors and game covers
- Implemented loading states with educational content
- Added validation for all user inputs
- Tab navigation structure (Home, Games, Profile)
- Centered button-style tabs with gradient active states
- **COMPLETE:** Frontend modularization (81% reduction in index.html)
- **COMPLETE:** Deployment environment configuration
- **DEFERRED:** Calendar interactive features

### Lessons Learned
- Discrete sliders work better than free-form mood input
- Visual feedback (colors, images) significantly improves UX
- Loading spinners with content reduce perceived wait time
- Alternative recommendations provide user choice without overwhelming
- Match percentages help users understand recommendations

### Next Steps Discussion Needed
1. **Should we prioritize deployment or more features?**
   - Lean toward deployment - get MVP online for user testing
   
2. **What's the minimum viable feature set before deployment?**
   - Current features may be sufficient
   - Consider adding simple session history first
   
3. **Do we need authentication before deployment?**
   - Not essential for MVP
   - Can launch with anonymous usage
   
4. **What analytics/metrics do we want to track?**
   - Recommendation acceptance rate
   - User satisfaction trends
   - Most popular moods/games

### Deferred for Post-MVP
- ❌ RAWG API Integration (documentation available in docs/features/)
- ❌ Calendar sync
- ❌ Steam/Xbox/PS library integration
- ❌ Authentication system
- ❌ **Multi-page architecture** (currently single-page show/hide, consider splitting later when:
  - Games/Profile pages have substantial functionality
  - File size becomes unwieldy (>5000 lines)
  - Need bookmarkable URLs for sharing
  - Want separate page-specific JavaScript/CSS)

---

**Owner:** Jan Wilhelm  
**Project:** Strategic Business Innovation 2025  
**Repository:** https://github.com/jantobiaswilhelm/LutemPrototype
