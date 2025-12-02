# LUTEM - Project Roadmap

**Last Updated:** December 2, 2025  
**Project Type:** Side Project → Potential Startup  
**Goal:** Real users, scalable architecture, satisfaction-driven gaming discovery

---

## Project Vision

Lutem is an AI-powered gaming recommendation platform that matches games to users based on mood, available time, energy levels, and context. Unlike engagement-optimized platforms, Lutem focuses on **satisfaction** — helping users have fulfilling gaming experiences.

### Core Value Proposition
1. Personalized recommendations that **learn and improve** over time
2. **Emotional feedback loop** with satisfaction tracking
3. **Calendar integration** with automatic free slot detection
4. **User profiles** with preferences, goals, and satisfaction history
5. **Weekly summaries** with session stats and satisfaction trends
6. **Platform integrations** (Steam, Xbox, PlayStation — future)

---

## Technical Architecture

### Current Stack
- **Frontend:** Vanilla HTML/CSS/JS → Netlify
- **Backend:** Spring Boot + SQLite → Railway
- **Auth:** Firebase Authentication

### Target Stack (Scalable)
- **Frontend:** Vanilla JS → Netlify (CDN)
- **Backend:** Spring Boot + **PostgreSQL** → Railway
- **User Data:** **Firestore** (profiles, preferences, sessions, feedback)
- **Auth:** Firebase Authentication
- **Cache:** Redis (future, when needed)

### Data Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
│                    (Netlify - Static)                           │
└─────────────────────┬───────────────────────┬───────────────────┘
                      │                       │
                      ▼                       ▼
┌─────────────────────────────┐   ┌───────────────────────────────┐
│      SPRING BOOT API        │   │         FIRESTORE             │
│        (Railway)            │   │    (Firebase - Google)        │
│                             │   │                               │
│  • Game catalog             │   │  • User profiles              │
│  • Recommendation engine    │   │  • Preferences                │
│  • Calendar events          │   │  • Session history            │
│  • Game metadata            │   │  • Satisfaction feedback      │
│                             │   │  • Weekly stats cache         │
└──────────────┬──────────────┘   └───────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│        POSTGRESQL           │
│     (Railway - Managed)     │
│                             │
│  • games                    │
│  • calendar_events          │
│  • (game content only)      │
└─────────────────────────────┘
```

### Why This Split?

| Data Type | Storage | Reason |
|-----------|---------|--------|
| Games catalog | PostgreSQL | Relational, queryable, shared across all users |
| Calendar events | PostgreSQL | Relational, needs joins with games |
| User profiles | Firestore | Per-user, real-time sync, scales infinitely |
| Session history | Firestore | Per-user, append-heavy, time-series |
| Feedback | Firestore | Per-user, needs to be fast |

**Key insight:** Game data is shared/static. User data is personal/dynamic. Different access patterns = different storage.

---

## ✅ COMPLETED

### Core MVP
- [x] Spring Boot backend with SQLite (will migrate to PostgreSQL)
- [x] 57 curated games with 8-dimensional mood scoring
- [x] Multi-factor recommendation engine (time, mood, energy, social, interruptibility)
- [x] Progressive disclosure wizard UI
- [x] Alternative recommendations (top 3)
- [x] "Touch Grass" wellness feature
- [x] Game library with filtering and search
- [x] Store links for each game

### Authentication & Deployment
- [x] Firebase authentication with Google sign-in
- [x] Locked tabs requiring auth (Calendar, Profile)
- [x] Frontend deployed to Netlify
- [x] Backend deployed to Railway
- [x] Custom domain option (lutem.3lands.ch)

### Calendar System
- [x] ICS file import with duplicate detection
- [x] Manual task creation
- [x] Gaming session scheduling with game selection
- [x] Three game selection modes: Browse, Wizard, Random
- [x] FullCalendar integration with themed styling
- [x] Visual overhaul complete

### UI/UX
- [x] 4 color themes (Café, Lavender, Earth, Ocean)
- [x] Light/dark mode with persistence
- [x] Responsive desktop layout
- [x] Frontend modularization (81% HTML reduction)

---

## 🔴 PHASE 7: Database Migration (FOUNDATION)
**Priority:** CRITICAL — Do before any new features  
**Estimated:** 1-2 sessions (4-6 hours)

### Why First?
SQLite is fine for development but doesn't scale. PostgreSQL is free on Railway and production-ready. Do this migration before adding more data dependencies.

### 7.1 PostgreSQL Setup on Railway
- [ ] Create PostgreSQL database on Railway (free tier)
- [ ] Get connection string
- [ ] Update `application.properties` with PostgreSQL config
- [ ] Add PostgreSQL driver to `pom.xml`

### 7.2 Schema Migration
- [ ] Export current SQLite data (games, calendar events)
- [ ] Create PostgreSQL schema (Hibernate auto-create or manual)
- [ ] Import data to PostgreSQL
- [ ] Test all existing functionality

### 7.3 Remove SQLite
- [ ] Remove SQLite dependency from `pom.xml`
- [ ] Delete SQLite file from repo
- [ ] Update documentation

**Checkpoint:** Backend runs on PostgreSQL, all features work, deployed to Railway.

---

## 🔴 PHASE 8: Firestore Integration (FOUNDATION)
**Priority:** CRITICAL — Enables user data at scale  
**Estimated:** 2-3 sessions (8-12 hours)

### Why Firestore?
- Already using Firebase Auth
- Scales infinitely (Google infrastructure)
- Real-time sync built-in
- Perfect for user-specific data
- Free tier: 50K reads, 20K writes per day

### 8.1 Firestore Setup
- [ ] Enable Firestore in Firebase Console
- [ ] Choose database location (europe-west for you)
- [ ] Set up security rules (authenticated users only)
- [ ] Add Firebase JS SDK to frontend (if not already)

### 8.2 Data Model Design

```
firestore/
├── users/
│   └── {firebaseUid}/
│       ├── profile: {
│       │     displayName: string,
│       │     preferredGenres: string[],
│       │     typicalSessionLength: string,
│       │     engagementLevel: string,
│       │     preferredGamingTimes: string[],
│       │     primaryGoal: string,
│       │     emotionalGoals: string[],
│       │     createdAt: timestamp,
│       │     updatedAt: timestamp
│       │   }
│       │
│       ├── sessions/ (subcollection)
│       │   └── {sessionId}/
│       │       ├── gameId: number,
│       │       ├── gameName: string,
│       │       ├── startTime: timestamp,
│       │       ├── endTime: timestamp,
│       │       ├── source: string ("WIZARD" | "CALENDAR" | "LIBRARY"),
│       │       ├── satisfaction: number (1-5),
│       │       ├── moodTag: string,
│       │       └── createdAt: timestamp
│       │
│       └── stats/ (subcollection)
│           └── weekly/
│               └── {weekId}/
│                   ├── sessionsCount: number,
│                   ├── totalMinutes: number,
│                   ├── avgSatisfaction: number,
│                   ├── topGames: array,
│                   └── calculatedAt: timestamp
```

### 8.3 Frontend Firestore Integration
- [ ] Create `firestore.js` module
- [ ] Initialize Firestore client
- [ ] Create CRUD functions for user profiles
- [ ] Create functions for session logging
- [ ] Handle offline persistence (Firestore built-in)

### 8.4 Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /stats/{statId} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if false; // Only cloud functions write stats
      }
    }
  }
}
```

**Checkpoint:** Can read/write user data to Firestore from frontend.

---

## 🟡 PHASE 9: User Profiles (CORE FEATURE)
**Priority:** HIGH — Enables personalization  
**Estimated:** 1-2 sessions (4-6 hours)  
**Depends on:** Phase 8 (Firestore)

### 9.1 Profile Save/Load
- [ ] Update `profile.js` to use Firestore instead of localStorage
- [ ] Save profile on form submit
- [ ] Load profile on page load (if authenticated)
- [ ] Handle first-time users (empty profile)
- [ ] Add loading states

### 9.2 Profile UI Polish
- [ ] Show save status ("Saved" / "Saving..." / "Error")
- [ ] Show last updated timestamp
- [ ] Add profile completion indicator
- [ ] Remove "Coming Soon" placeholders

### 9.3 Backend Integration (for recommendations)
- [ ] Backend needs to read user preferences for personalized recommendations
- [ ] Option A: Frontend passes preferences with each recommendation request
- [ ] Option B: Backend calls Firestore Admin SDK (more complex)
- [ ] **Decision:** Option A for MVP — simpler, no backend changes

**Checkpoint:** User preferences persist across devices, influence recommendation requests.

---

## 🟡 PHASE 10: Session Tracking & Feedback (CORE FEATURE)
**Priority:** HIGH — Enables learning  
**Estimated:** 2-3 sessions (8-12 hours)  
**Depends on:** Phase 8 (Firestore)

### 10.1 Session Logging
- [ ] Log session when user accepts a recommendation
- [ ] Log session when user schedules game via calendar
- [ ] Store: gameId, gameName, startTime, source

### 10.2 Feedback Collection UI
- [ ] After recommendation: "Did you play? How was it?"
- [ ] Simple satisfaction rating (1-5 stars or emoji scale)
- [ ] Optional mood tag selection
- [ ] Non-intrusive — don't ask every time

### 10.3 Session History View
- [ ] Add "History" section to Profile tab
- [ ] Show recent sessions with games, ratings
- [ ] Basic filtering (last 7 days, last 30 days)

### 10.4 Connect Feedback to Recommendations
- [ ] Include past satisfaction data in recommendation request
- [ ] Backend boosts games user rated highly
- [ ] Backend slightly penalizes games rated poorly

**Checkpoint:** Users can rate sessions, history is visible, recommendations consider past satisfaction.

---

## 🟡 PHASE 11: Weekly Dashboard (DIFFERENTIATOR)
**Priority:** MEDIUM-HIGH — Key feature from paper  
**Estimated:** 2 sessions (6-8 hours)  
**Depends on:** Phase 10 (Session Tracking)

### 11.1 Stats Calculation
- [ ] Calculate weekly stats from session data
- [ ] Sessions completed, total time played
- [ ] Average satisfaction
- [ ] Most played games
- [ ] Store in Firestore `stats/weekly/{weekId}`

### 11.2 Dashboard UI
- [ ] Weekly recap card on Home tab
- [ ] Visual indicators (up/down arrows for trends)
- [ ] Highlight: "Your most satisfying game this week"
- [ ] Upcoming scheduled sessions

### 11.3 Insights
- [ ] Pattern detection: "You enjoy puzzle games in the evening"
- [ ] Suggestions: "Try scheduling shorter sessions on weekdays"

**Checkpoint:** Users see their gaming patterns, feel value in tracking.

---

## 🟢 PHASE 12: Google Calendar OAuth
**Priority:** MEDIUM — Nice to have, ICS import works  
**Estimated:** 3-4 sessions (10-15 hours)  
**Documentation:** See `docs/CALENDAR_IMPLEMENTATION_PLAN.md` Phase 4

Already planned in detail. Lower priority now that we have ICS import.

---

## 🔵 FUTURE PHASES (Backlog)

### Phase 13: Steam Integration
- Steam Web API for library import
- Match Steam games to Lutem database
- Fetch playtime data

### Phase 14: Expanded Game Library
- RAWG API integration OR
- Manual curation of 100+ more games

### Phase 15: Mobile PWA
- Responsive mobile layout
- Add to Home Screen support
- Push notifications (Firebase Cloud Messaging)

### Phase 16: Advanced Features
- Xbox/PlayStation integration (limited APIs)
- Health app integration (mood inference)
- Two-way calendar sync
- Social features (share recommendations)

---

## Priority Matrix

| Phase | Effort | Impact | Priority | Status |
|-------|--------|--------|----------|--------|
| 7: PostgreSQL Migration | Low | High | 🔴 Critical | Not Started |
| 8: Firestore Setup | Medium | High | 🔴 Critical | Not Started |
| 9: User Profiles | Low | High | 🟡 High | Not Started |
| 10: Session Tracking | Medium | High | 🟡 High | Not Started |
| 11: Weekly Dashboard | Medium | Medium | 🟡 High | Not Started |
| 12: Google OAuth | High | Medium | 🟢 Medium | Not Started |
| 13-16: Future | High | Variable | 🔵 Low | Backlog |

---

## Realistic Timeline

### December 2025
**Focus:** Foundation

- Week 1: Phase 7 (PostgreSQL migration)
- Week 2: Phase 8 (Firestore setup)
- Week 3-4: Phase 9 (User profiles working)

### January 2026
**Focus:** Core loop

- Week 1-2: Phase 10 (Session tracking & feedback)
- Week 3-4: Phase 11 (Weekly dashboard)

### February 2026+
**Focus:** Growth features

- Google Calendar OAuth
- Steam integration
- Mobile optimization
- Marketing / user acquisition

---

## Success Metrics

### Technical
- [ ] Backend runs on PostgreSQL
- [ ] User data in Firestore
- [ ] < 500ms recommendation response time
- [ ] 99% uptime

### Product
- [ ] Users can save preferences (persist across devices)
- [ ] Users can rate sessions
- [ ] Recommendations improve with feedback
- [ ] Weekly summary provides value

### Growth (Future)
- [ ] 100 registered users
- [ ] 50% weekly active rate
- [ ] 4+ average satisfaction rating
- [ ] Positive user feedback

---

## Production URLs

- **Frontend:** https://lutembeta.netlify.app
- **Backend:** https://lutemprototype-production.up.railway.app
- **Custom Domain:** https://lutem.3lands.ch (optional)

---

## Quick Reference

### Start Development
```bash
# Backend
D:\Lutem\LutemPrototype\start-backend.bat

# Frontend  
cd D:\Lutem\LutemPrototype\frontend
python -m http.server 5500
# Access: http://localhost:5500
```

### Key Documentation
- `docs/CALENDAR_IMPLEMENTATION_PLAN.md` — Calendar phases
- `docs/USER_PROFILE_IMPLEMENTATION_PLAN.md` — Profile system (needs update for Firestore)
- `docs/API.md` — API reference
- `docs/ARCHITECTURE.md` — System design

---

**Owner:** Patrick  
**Repository:** https://github.com/jantobiaswilhelm/LutemPrototype
