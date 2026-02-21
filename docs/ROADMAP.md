# LUTEM - Project Roadmap

**Last Updated:** February 2026
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
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4 → Netlify
- **Backend:** Spring Boot 3.4.5 + PostgreSQL → Railway
- **User Data:** Firestore (profiles, sessions, feedback)
- **Auth:** Dual auth (Steam OpenID + Google/Firebase) with JWT httpOnly cookies
- **State:** Zustand + TanStack Query v5

### Target Stack (Scalable)
- **Cache:** Redis (when scaling to multi-instance)
- **Rate Limiting:** Redis-backed (currently in-memory)

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
- [x] Spring Boot backend with PostgreSQL (prod) / H2 (local)
- [x] 100+ curated games with 8-dimensional mood scoring
- [x] Multi-factor recommendation engine (time, mood, energy, social, interruptibility)
- [x] Progressive disclosure wizard UI
- [x] Alternative recommendations (top 3)
- [x] "Touch Grass" wellness feature
- [x] Game library with filtering and search
- [x] Store links for each game

### Authentication & Security
- [x] Dual auth: Steam OpenID + Google/Firebase
- [x] JWT httpOnly cookies (migrated from localStorage)
- [x] CSRF protection (double-submit cookie)
- [x] RBAC (USER/ADMIN roles)
- [x] Security headers (CSP, X-Frame-Options, etc.)
- [x] Input validation on all API endpoints
- [x] Rate limiting with scheduled cleanup

### Infrastructure
- [x] Frontend deployed to Netlify
- [x] Backend deployed to Railway with PostgreSQL
- [x] Custom domain (lutem.3lands.ch)
- [x] Firestore integration for user data
- [x] Database indexes on key columns
- [x] N+1 query optimization (EntityGraph)
- [x] Production ddl-auto=validate

### Social Features
- [x] Friends system (search, request, accept/decline)
- [x] Calendar with social events (invites, join/leave)
- [x] Event visibility controls (private, friends-only, public)
- [x] ICS file import

### Frontend (React 19)
- [x] Complete rewrite from vanilla JS to React 19 + TypeScript + Vite
- [x] 4 color themes x 2 modes (8 combinations)
- [x] All pages: Home, Library, Calendar, Friends, Sessions, Stats, Settings, Profile
- [x] Zustand state management + TanStack Query
- [x] Swipeable taskbar navigation
- [x] Vitest + Testing Library (22 tests)
- [x] Accessibility improvements (aria-labels, keyboard nav, screen reader support)

---

## ✅ PHASE 7: Database Migration (COMPLETE)
**Status:** ✅ DONE — December 2025

### 7.1 PostgreSQL Setup on Railway
- [x] Create PostgreSQL database on Railway (free tier)
- [x] Get connection string
- [x] Update `application.properties` with PostgreSQL config
- [x] Add PostgreSQL driver to `pom.xml`

### 7.2 Schema Migration
- [x] Export current SQLite data (games, calendar events)
- [x] Create PostgreSQL schema (Hibernate auto-create)
- [x] Import data to PostgreSQL
- [x] Test all existing functionality

### 7.3 Local Development
- [x] H2 database for local development
- [x] `application-local.properties` for local config
- [x] `start-backend-local.bat` for local dev

**Checkpoint:** ✅ Backend runs on PostgreSQL, all features work, deployed to Railway.

---

## ✅ PHASE 8: Firestore Integration (COMPLETE)
**Status:** ✅ DONE — December 2025

### 8.1 Firestore Setup
- [x] Enable Firestore in Firebase Console
- [x] Choose database location (europe-west)
- [x] Set up security rules (authenticated users only)
- [x] Firebase JS SDK integrated

### 8.2 Frontend Firestore Integration
- [x] Create `firestore.js` module
- [x] Initialize Firestore client
- [x] Create CRUD functions for user profiles
- [x] Create functions for session logging
- [x] Handle offline persistence (Firestore built-in)

### 8.3 Auth Integration
- [x] Profile auto-created on first sign-in
- [x] Profile loaded on subsequent sign-ins
- [x] `window.userProfile` cached in memory

**Checkpoint:** ✅ Can read/write user data to Firestore from frontend.

---

## ✅ PHASE 9: User Profiles (COMPLETE)
**Priority:** HIGH — Enables personalization  
**Status:** ✅ DONE — December 2025  
**Depends on:** Phase 8 (Firestore)

### 9.1 Profile Save/Load ✅
- [x] Update `profile.js` to use Firestore instead of localStorage
- [x] Save profile on form submit
- [x] Load profile on page load (if authenticated)
- [x] Handle first-time users (empty profile)
- [x] Add loading states
- [x] Removed redundant localStorage backup for authenticated users

### 9.2 Profile UI ✅
- [x] Show save status ("Saved" / "Saving..." / "Error")
- [x] Toast notifications on save success/failure
- [x] Profile creation on first sign-in

### 9.3 Backend Integration
- [x] Frontend passes preferences with recommendation requests
- [x] No backend changes needed for MVP

**Checkpoint:** ✅ User preferences persist across devices via Firestore.

---

## 🔵 FUTURE PHASES (Backlog)

### Google Calendar OAuth
- Two-way calendar sync via Google Calendar API
- Lower priority since ICS import already works

### Expanded Game Library
- RAWG API integration for broader catalog
- Community-submitted games

### Mobile PWA
- Service worker for offline support
- Add to Home Screen
- Push notifications (Firebase Cloud Messaging)

### Advanced Features
- Xbox/PlayStation integration
- Health app integration (mood inference)
- AI-powered insights ("You enjoy puzzle games in the evening")

---

## Success Metrics

### Technical
- [x] Backend runs on PostgreSQL
- [x] User data in Firestore
- [x] < 500ms recommendation response time
- [x] Frontend + backend testing infrastructure
- [ ] 99% uptime

### Product
- [x] Users can save preferences (persist across devices)
- [x] Users can rate sessions
- [x] Recommendations improve with feedback
- [x] Session history + stats page
- [ ] 100 registered users
- [ ] 4+ average satisfaction rating

---

## Production URLs

- **Frontend:** https://lutembeta.netlify.app
- **Backend:** https://lutemprototype-production.up.railway.app
- **Custom Domain:** https://lutem.3lands.ch (optional)

---

## Quick Reference

### Start Development
```bash
# Both backend + frontend
start-lutem.bat

# Or individually:
start-backend.bat               # Backend on http://localhost:8080
cd frontend-react && npm run dev # Frontend on http://localhost:5173
```

### Key Documentation
- `docs/API.md` — API reference
- `docs/ARCHITECTURE.md` — System design
- `docs/CODEBASE_ACTION_PLAN.md` — Quality checklist (30/30 complete)

---

**Owner:** Patrick  
**Repository:** https://github.com/jantobiaswilhelm/LutemPrototype
