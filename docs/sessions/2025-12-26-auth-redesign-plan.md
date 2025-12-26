# Auth Redesign Plan - Dual Login (Steam + Google)

**Date:** 2025-12-26
**Status:** Planned
**Priority:** High - Blocks Steam import functionality

---

## Problem

Current setup requires Firebase auth, but:
- React frontend has no auth implemented yet (uses `MOCK_FIREBASE_UID`)
- Steam import fails with "User not found" because no real user exists
- Firebase-only login is friction for gamers who just want to use Steam

## Solution

Support **both** Steam and Google login:
- Steam OpenID → for gamers, auto-links Steam library, handles private profiles
- Google (Firebase) → for everyone else, familiar, easy

---

## Database Changes

### Update User Model

```java
// User.java - add fields
@Column(name = "steam_id", unique = true)
private String steamId;  // 64-bit Steam ID (nullable)

@Column(name = "google_id", unique = true)  
private String googleId; // Firebase UID (nullable) - rename from firebase_uid

@Column(name = "avatar_url")
private String avatarUrl; // From Steam or Google profile
```

### Migration SQL

```sql
ALTER TABLE users ADD COLUMN steam_id VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(500);
ALTER TABLE users RENAME COLUMN firebase_uid TO google_id;
```

---

## Backend Changes

### 1. Steam OpenID Authentication

Steam uses OpenID 2.0 (not OAuth). Flow:

```
1. User clicks "Login with Steam"
2. Redirect to: https://steamcommunity.com/openid/login
3. User logs in on Steam
4. Steam redirects back with claimed_id containing Steam ID
5. Backend validates response & extracts Steam ID
6. Create/find user by steam_id
7. Issue session token (JWT)
```

**New Endpoints:**

```
GET  /auth/steam/login     → Redirects to Steam OpenID
GET  /auth/steam/callback  → Handles Steam response, creates session
GET  /auth/google/login    → Existing Firebase flow
POST /auth/logout          → Clears session
GET  /auth/me              → Returns current user (works for both auth types)
```

### 2. Unified Auth Service

```java
@Service
public class AuthService {
    
    // Find or create user from Steam login
    public User authenticateWithSteam(String steamId, String personaName, String avatarUrl) {
        return userRepository.findBySteamId(steamId)
            .orElseGet(() -> createUserFromSteam(steamId, personaName, avatarUrl));
    }
    
    // Find or create user from Google/Firebase login
    public User authenticateWithGoogle(String googleId, String email, String displayName) {
        return userRepository.findByGoogleId(googleId)
            .orElseGet(() -> createUserFromGoogle(googleId, email, displayName));
    }
    
    // Link Steam to existing Google account (optional future feature)
    public User linkSteamAccount(Long userId, String steamId) { ... }
}
```

### 3. Session Management

Options:
- **JWT tokens** (stateless, stored in localStorage)
- **Session cookies** (stateful, more secure)

Recommendation: **JWT** for simplicity, stored in httpOnly cookie.

---

## Frontend Changes

### 1. Auth Context/Store

```typescript
// stores/authStore.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (provider: 'steam' | 'google') => void;
  logout: () => void;
}

interface User {
  id: number;
  displayName: string;
  email?: string;
  steamId?: string;
  avatarUrl?: string;
}
```

### 2. Login Page

```tsx
// pages/Login.tsx
<div className="login-container">
  <h1>Welcome to Lutem</h1>
  <p>Sign in to sync your game library</p>
  
  <Button onClick={() => login('steam')} variant="steam">
    <SteamIcon /> Continue with Steam
  </Button>
  
  <Button onClick={() => login('google')} variant="google">
    <GoogleIcon /> Continue with Google
  </Button>
</div>
```

### 3. Protected Routes

```tsx
// Wrap routes that need auth
<Route path="/library" element={
  <ProtectedRoute>
    <Library />
  </ProtectedRoute>
} />
```

### 4. Update Library Page

```tsx
// Remove MOCK_FIREBASE_UID
// Use actual user from auth store
const { user } = useAuthStore();

// If logged in via Steam, auto-import is possible
// If logged in via Google, show Steam ID input
```

---

## Steam OpenID Implementation Details

### Request URL Format

```
https://steamcommunity.com/openid/login?
  openid.ns=http://specs.openid.net/auth/2.0
  &openid.mode=checkid_setup
  &openid.return_to=https://lutembeta.netlify.app/auth/steam/callback
  &openid.realm=https://lutembeta.netlify.app
  &openid.identity=http://specs.openid.net/auth/2.0/identifier_select
  &openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select
```

### Response Parsing

Steam returns `openid.claimed_id` like:
```
https://steamcommunity.com/openid/id/76561198053706838
```

Extract the 17-digit Steam ID from the end.

### Validation

Must verify the response with Steam to prevent spoofing:
```
POST https://steamcommunity.com/openid/login
openid.mode=check_authentication
+ all other params from callback
```

---

## File Changes Summary

### Backend (Java)

| File | Change |
|------|--------|
| `User.java` | Add steamId, googleId, avatarUrl fields |
| `UserRepository.java` | Add findBySteamId(), findByGoogleId() |
| `AuthService.java` | New - unified auth logic |
| `SteamAuthController.java` | New - Steam OpenID endpoints |
| `AuthController.java` | Update for Google, add /me endpoint |
| `JwtService.java` | New - token generation/validation |
| `SecurityConfig.java` | New - configure public/protected paths |
| `application.properties` | Add JWT secret, Steam realm config |

### Frontend (React)

| File | Change |
|------|--------|
| `stores/authStore.ts` | New - auth state management |
| `pages/Login.tsx` | New - login page with both buttons |
| `components/ProtectedRoute.tsx` | New - auth guard |
| `api/auth.ts` | New - auth API calls |
| `pages/Library.tsx` | Remove mock UID, use real auth |
| `App.tsx` | Add login route, wrap with auth provider |

---

## Environment Variables

### Backend
```
JWT_SECRET=<random-256-bit-key>
STEAM_REALM=https://lutembeta.netlify.app
STEAM_RETURN_URL=https://lutembeta.netlify.app/auth/steam/callback
```

### Frontend
```
VITE_API_URL=http://localhost:8080  # or production URL
```

---

## Testing Checklist

- [ ] Steam login redirects correctly
- [ ] Steam callback creates new user
- [ ] Steam callback finds existing user
- [ ] Google login still works
- [ ] JWT token issued on login
- [ ] JWT token validated on protected routes
- [ ] /auth/me returns current user
- [ ] Logout clears token
- [ ] Library page uses real user
- [ ] Steam import works for Steam-logged-in users
- [ ] Steam import prompts for ID for Google-logged-in users

---

## Open Questions

1. **Token storage:** localStorage vs httpOnly cookie?
2. **Session duration:** How long before re-login required?
3. **Account linking:** Allow linking Steam to Google account?
4. **Profile page:** Show connected accounts?

---

## Dependencies

```xml
<!-- Backend: JWT -->
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.12.3</version>
</dependency>

<!-- OpenID validation (or implement manually) -->
<!-- Consider: openid4java or manual HTTP validation -->
```

---

## Estimated Effort

| Task | Time |
|------|------|
| Database migration | 30 min |
| Steam OpenID backend | 2-3 hours |
| JWT auth setup | 1-2 hours |
| Frontend auth store | 1 hour |
| Login page UI | 1 hour |
| Protected routes | 30 min |
| Update Library page | 30 min |
| Testing | 1-2 hours |
| **Total** | **8-11 hours** |

---

## References

- [Steam Web API - OpenID](https://steamcommunity.com/dev)
- [OpenID 2.0 Spec](https://openid.net/specs/openid-authentication-2_0.html)
- [JJWT Library](https://github.com/jwtk/jjwt)
