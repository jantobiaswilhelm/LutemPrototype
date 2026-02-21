# Lutem MVP - Project Tracker

## Current Status

**PRODUCTION DEPLOYED** - [lutembeta.netlify.app](https://lutembeta.netlify.app)
- **Backend:** Spring Boot 3.2 on Railway with PostgreSQL
- **Frontend:** React 19 + TypeScript + Vite on Netlify
- **Auth:** Dual auth (Steam OpenID + Google/Firebase) with JWT httpOnly cookies
- **User Data:** Firestore (profiles, satisfaction analytics)
- **Games:** 57+ titles in database

**Last Updated:** February 2026

---

## Completed

### Core Platform
- [x] Multi-dimensional recommendation engine (11 scoring factors)
- [x] 57+ curated games with emotional metadata
- [x] Inline wizard with 6 recommendation steps
- [x] Mood shortcuts for quick recommendations
- [x] Steam library import + game matching
- [x] Session tracking with feedback collection
- [x] Satisfaction analytics via Firestore

### Authentication & Security
- [x] Dual auth: Steam OpenID + Google/Firebase
- [x] JWT httpOnly cookies (migrated from localStorage)
- [x] CSRF protection (double-submit cookie)
- [x] RBAC (USER/ADMIN roles)
- [x] Security headers (CSP, X-Frame-Options, etc.)
- [x] Input validation on API endpoints
- [x] Firestore data validation rules

### Social Features
- [x] Friends system (search, request, accept/decline)
- [x] Calendar with social events (invites, join/leave)
- [x] Event visibility controls (private, friends-only, public)

### Frontend
- [x] 4 themes x 2 modes (8 total)
- [x] All pages complete (Home, Library, Calendar, Friends, Sessions, Stats, Settings, Profile)
- [x] Swipeable taskbar navigation
- [x] TanStack Query + Zustand state management

### Infrastructure
- [x] Railway deployment (backend + PostgreSQL)
- [x] Netlify deployment (frontend)
- [x] Custom domain (lutem.3lands.ch)
- [x] Environment-specific CORS config
- [x] Database indexes on key columns
- [x] N+1 query optimization (EntityGraph)
- [x] Production ddl-auto=validate

---

## Remaining Items

### P1 - High Priority (Skipped)
- [ ] Consolidate dual auth into shared AuthService
- [ ] Set up Vitest for frontend testing
- [ ] Expand backend test coverage (auth, admin, Steam)

### P2 - Medium Priority (Skipped)
- [ ] Update Spring Boot to 3.4.x + Firebase Admin SDK
- [ ] Split oversized components (Library.tsx 33KB, Calendar.tsx 26KB)
- [ ] Improve error handling consistency (frontend + backend)
- [ ] Accessibility improvements (aria-labels, focus management, keyboard nav)

### P3 - Low Priority
- [x] Update documentation (README, PROJECT_INSTRUCTIONS, TODO)
- [ ] Clean up database/build/git scripts
- [ ] Add pre-commit hooks (husky + lint-staged + secret scanning)
- [ ] Image lazy loading optimization
- [ ] Improve rate limiter for distributed deployment (Redis-backed)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, TanStack Query |
| Backend | Spring Boot 3.2, Java 17, JPA/Hibernate |
| Database | PostgreSQL (Railway), H2 (local dev) |
| User Data | Firestore |
| Auth | JWT httpOnly cookies, Firebase Admin SDK, Steam OpenID |
| AI | Anthropic Claude API (game tagging) |
| Hosting | Netlify + Railway |
