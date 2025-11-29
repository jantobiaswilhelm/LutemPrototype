# Lutem User Authentication - Session Handoff

## Context

We are implementing Firebase Authentication for Lutem, an AI-powered gaming recommendation platform. The goal is to enable user accounts with gated features while keeping the core experience accessible to everyone.

## Project Location

- **Path:** D:\Lutem\LutemPrototype
- **Branch:** main
- **GitHub:** https://github.com/jantobiaswilhelm/LutemPrototype
- **Live:** lutembeta.netlify.app (frontend) + lutemprototype-production.up.railway.app (backend)

## Implementation Plan

See `docs/USER_AUTH_IMPLEMENTATION_PLAN.md` for the complete plan including:
- Access control matrix (what's gated vs public)
- Data model with User entity
- 5 implementation phases with file lists
- UI component designs
- Testing checklist

## Current State

- [x] Phase 1: Firebase Setup - COMPLETE
- [x] Phase 2: Backend User Support - COMPLETE (fixed 2025-11-29)
- [ ] Phase 3: Gated Features UI - PARTIAL (tab locking works, locked page overlays needed)
- [ ] Phase 4: Session Migration - NOT STARTED
- [ ] Phase 5: Persist CalendarEvents - NOT STARTED

## Phase 2 Bug Fix (2025-11-29)

**Issue:** The `GameSessionRepository.getRecentSessions()` method was using `s.userId` in the JPQL query, but the actual JPA property is `legacyUserId` (the field mapped to `user_id` column).

**Fix:** Updated `GameSessionRepository.java` to:
- Rename `findByUserId()` to `findByLegacyUserId()`
- Add `findByUser(User user)` for authenticated users
- Fix JPQL query to use `s.legacyUserId` instead of `s.userId`
- Add `getRecentSessionsForUser()` method for User entity queries

## Phase 1 Completed Items

### Files Created/Modified:
- `frontend/js/auth.js` - Firebase auth module with all functions
- `frontend/css/components.css` - Added auth modal styles, header UI, tab locking CSS
- `frontend/index.html` - Added auth header, auth modal, auth.js script tag
- `frontend/js/main.js` - Added auth initialization
- `frontend/js/tabs.js` - Added tab locking logic

### Features Working:
- Firebase config initialized (project: lutem-68f3a)
- Auth modal UI (sign in / sign up forms)
- Google sign-in button
- Email/password sign-in and sign-up
- Auth state management (authState global)
- Header sign-in button and user dropdown
- Tab locking for Calendar and Profile tabs
- Toast notifications for auth events

## Phase 2 Completed Items

### Files Created:
- `backend/.../model/User.java` - User entity with firebaseUid, email, displayName, timestamps
- `backend/.../repository/UserRepository.java` - JPA repository with findByFirebaseUid()
- `backend/.../service/UserService.java` - findOrCreateByFirebaseUid() logic
- `backend/.../controller/AuthController.java` - GET /auth/me endpoint
- `backend/.../config/FirebaseConfig.java` - Firebase Admin SDK initialization
- `backend/.../security/FirebaseAuthFilter.java` - Token validation filter
- `backend/firebase-service-account.json` - Firebase credentials (gitignored!)

### Files Modified:
- `backend/pom.xml` - Added Firebase Admin SDK dependency
- `backend/.../model/GameSession.java` - Added User relationship
- `backend/.../repository/GameSessionRepository.java` - Fixed JPQL queries
- `backend/src/main/resources/application.properties` - Firebase config path
- `frontend/js/auth.js` - Added syncUserWithBackend() function
- `.gitignore` - Added firebase credential patterns

### API Endpoints:
- `GET /auth/me` - Returns current user info, creates user on first login
  - Requires: `Authorization: Bearer <firebase-id-token>`
  - Returns: `{ id, firebaseUid, email, displayName, createdAt, lastLoginAt }`

### Database Changes:
- New `users` table with: id, firebase_uid, email, display_name, created_at, last_login_at
- `game_sessions` table updated with optional `user_id_fk` foreign key

## Testing Phase 2

To test:
1. Start backend: `D:\Lutem\LutemPrototype\start-backend.bat`
2. Start frontend: `python -m http.server 5500` in frontend folder
3. Open http://localhost:5500
4. Sign in with Google or email
5. Check browser console for "User synced with backend" message
6. Check backend logs for Firebase initialization and user creation
7. Verify user record in lutem.db (users table)

## Next Steps - Phase 3: Locked Tab Overlays

1. Create "Sign in to unlock" overlay component
2. Show overlay when clicking locked Calendar/Profile tabs
3. Style locked tabs with lock icon
4. Improve sign-in prompt messaging
