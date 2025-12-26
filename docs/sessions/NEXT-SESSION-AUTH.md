# Session Handoff: Implement Dual Auth (Steam + Google)

## Context

Lutem needs authentication to persist user libraries and track satisfaction over time. Current state:
- Backend has Firebase auth partially implemented but React frontend uses mock UID
- Steam import fails with "User not found" because no real user exists
- Steam API key is working (verified: resolves vanity URLs, fetches games)

## Decision Made

Implement **dual login** - users can sign in via Steam OR Google:
- **Steam OpenID** → Gamers trust it, auto-links Steam library, handles private profiles
- **Google (Firebase)** → Everyone has it, familiar, works for console/mobile users

## What To Build

Full plan documented in: `docs/sessions/2025-12-26-auth-redesign-plan.md`

### Priority Order

1. **Database migration** - Add `steam_id`, `avatar_url` to User, rename `firebase_uid` → `google_id`
2. **Steam OpenID backend** - `/auth/steam/login` and `/auth/steam/callback` endpoints
3. **JWT auth** - Issue tokens on login, validate on protected routes
4. **Frontend auth store** - Zustand store for auth state
5. **Login page** - Two buttons: Steam + Google
6. **Protected routes** - Guard Library and other auth-required pages
7. **Update Library page** - Remove `MOCK_FIREBASE_UID`, use real user from auth store

### Key Files to Create/Modify

**Backend:**
- `User.java` - add fields
- `UserRepository.java` - add findBySteamId()
- `SteamAuthController.java` - NEW
- `JwtService.java` - NEW
- Update security filter to handle JWT

**Frontend:**
- `stores/authStore.ts` - NEW
- `pages/Login.tsx` - NEW
- `components/ProtectedRoute.tsx` - NEW
- `api/auth.ts` - NEW
- `pages/Library.tsx` - remove mock, use real auth

## Environment

- Backend running on port 8080 with `SPRING_PROFILES_ACTIVE=local`
- Steam API key: `REDACTED_STEAM_API_KEY`
- Frontend at `localhost:5173`
- Production: Railway (backend) + Netlify (frontend)

## Test Steam Account

- Profile URL: https://steamcommunity.com/id/jkarmaCH/
- Steam ID: 76561198053706838

## Start Command

```bash
# Backend
cd D:\Lutem\LutemPrototype\backend
$env:SPRING_PROFILES_ACTIVE="local"
$env:STEAM_API_KEY="REDACTED_STEAM_API_KEY"
./mvnw spring-boot:run

# Frontend
cd D:\Lutem\LutemPrototype\frontend-react
npm run dev
```

## Questions to Confirm at Start

1. Start with backend (Steam OpenID + JWT) or frontend (auth store + UI)?
2. Token storage preference: localStorage or httpOnly cookie?
3. Any changes to the plan in `docs/sessions/2025-12-26-auth-redesign-plan.md`?
