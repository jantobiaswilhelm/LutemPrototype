# Lutem Prototype — Codebase Action Plan

> Generated: 2026-02-21
> Based on full codebase analysis of backend (Spring Boot), frontend (React/TypeScript), infrastructure, and documentation.

---

## Rating System

| Priority | Label | Meaning |
|----------|-------|---------|
| **P0** | 🔴 CRITICAL | Security vulnerability or data loss risk. Fix before any other work. |
| **P1** | 🟠 HIGH | Blocks production readiness or causes major bugs. Fix within 1 week. |
| **P2** | 🟡 MEDIUM | Degrades quality, performance, or developer experience. Fix within 2–4 weeks. |
| **P3** | 🟢 LOW | Technical debt, cleanup, nice-to-have. Schedule when convenient. |

---

## Table of Contents

1. [P0 — Critical Security](#p0--critical-security)
2. [P1 — High Priority](#p1--high-priority)
3. [P2 — Medium Priority](#p2--medium-priority)
4. [P3 — Low Priority](#p3--low-priority)
5. [Summary Checklist](#summary-checklist)

---

## P0 — Critical Security

### 1. Rotate All Exposed Credentials

**Severity:** 🔴 CRITICAL
**Effort:** 1–2 hours
**Risk if ignored:** Full account compromise, API abuse, database wipe

#### Problem

Three sets of credentials are hardcoded in source files and committed to git history:

| Credential | Location | Value Exposed |
|------------|----------|---------------|
| Steam API Key | `application-local.properties`, `start-backend-local.bat` | `REDACTED_STEAM_API_KEY` |
| Firebase Service Account | `backend/firebase-service-account.json` | Full private key + service account email |
| JWT Default Secret | `JwtService.java:30` | `REDACTED_JWT_SECRET` |

#### Action Steps

1. **Steam API Key**
   - Go to [Steam API Key Registration](https://steamcommunity.com/dev/apikey) and revoke/regenerate the key
   - Remove hardcoded value from `application-local.properties` and `start-backend-local.bat`
   - Use environment variables only: `STEAM_API_KEY=${STEAM_API_KEY}`

2. **Firebase Service Account**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Delete the compromised key and generate a new one
   - Never commit the JSON file — store it via environment variable `FIREBASE_CREDENTIALS` (base64-encoded)
   - Verify `firebase-service-account.json` is in `.gitignore` (it is listed, but the file was committed before the rule was added)

3. **JWT Secret**
   - Generate a cryptographically secure 256-bit key: `openssl rand -base64 32`
   - Set it as `JWT_SECRET` environment variable in Railway
   - Remove the hardcoded fallback from `JwtService.java:30`
   - Make the application **fail to start** if `JWT_SECRET` is not set in production

4. **Scrub git history** (optional but recommended)
   - Use `git filter-repo` or BFG Repo-Cleaner to remove secrets from all past commits
   - Force-push to GitHub after scrubbing
   - Notify any collaborators to re-clone

#### Files to Modify

- `backend/src/main/resources/application-local.properties` — remove hardcoded Steam key
- `backend/src/main/java/com/lutem/mvp/security/JwtService.java` — remove default secret, fail if missing
- `start-backend-local.bat` — remove hardcoded Steam key, read from env
- `backend/firebase-service-account.json` — delete from repo, add to `.gitignore`
- `backend/src/main/java/com/lutem/mvp/config/FirebaseConfig.java` — fail loudly if credentials missing in production

---

### 2. Protect Admin Endpoints (Authentication + Authorization)

**Severity:** 🔴 CRITICAL
**Effort:** 2–3 hours
**Risk if ignored:** Anyone can wipe the entire game database or inject malicious data

#### Problem

`GameAdminController.java` exposes destructive operations with **zero authentication**:

- `DELETE /admin/games/all` — deletes all games
- `DELETE /admin/games/wipe` — wipes entire database
- `POST /admin/games` — creates games
- `POST /admin/games/bulk` — bulk imports games

These paths are not listed in `JwtAuthFilter`'s protected routes (lines 116–143), so the auth filter skips them entirely.

#### Action Steps

1. **Add a `role` field to the `User` entity**
   - `@Enumerated(EnumType.STRING) private Role role;` with values `USER`, `ADMIN`
   - Default to `USER` on registration

2. **Create an `@AdminOnly` annotation or check**
   - In `JwtAuthFilter`, extract role from JWT claims
   - Reject non-admin users on `/admin/**` paths with 403

3. **Add `/admin/**` to the JwtAuthFilter's protected paths**
   - Currently the filter skips unknown paths — reverse the logic to protect by default

4. **Add rate limiting to destructive operations**
   - Max 1 wipe per hour, for example

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/model/User.java` — add `role` field
- `backend/src/main/java/com/lutem/mvp/security/JwtAuthFilter.java` — protect `/admin/**`
- `backend/src/main/java/com/lutem/mvp/security/JwtService.java` — include role in JWT claims
- `backend/src/main/java/com/lutem/mvp/controller/GameAdminController.java` — add auth annotations

---

### 3. Fix JWT Storage (XSS Vulnerability)

**Severity:** 🔴 CRITICAL
**Effort:** 3–4 hours
**Risk if ignored:** Any XSS vulnerability anywhere in the app leads to full account takeover

#### Problem

`authStore.ts:223-229` persists the JWT token to `localStorage` via Zustand's `persist` middleware:

```typescript
persist((...) => ({ ... }), {
  name: 'lutem-auth',
  partialize: (state) => ({
    token: state.token,  // Accessible to any JS on the page
    user: state.user,
    isAuthenticated: state.isAuthenticated,
  }),
})
```

An attacker who finds any XSS vector can steal the token with:
```javascript
localStorage.getItem('lutem-auth')
```

#### Action Steps

1. **Backend: Set JWT as httpOnly cookie**
   - In `AuthController` and `SteamAuthController`, set the token as a cookie:
     ```java
     Cookie cookie = new Cookie("lutem_token", jwt);
     cookie.setHttpOnly(true);
     cookie.setSecure(true);
     cookie.setPath("/");
     cookie.setMaxAge(86400); // 24 hours
     cookie.setAttribute("SameSite", "Strict");
     response.addCookie(cookie);
     ```
   - Return user info (without token) in the JSON response body

2. **Backend: Read JWT from cookie in JwtAuthFilter**
   - Check `Authorization` header first (for backwards compatibility)
   - Fall back to reading the `lutem_token` cookie

3. **Frontend: Remove token from Zustand persistence**
   - Remove `token` from `partialize`
   - Store only `user` and `isAuthenticated`
   - On app init, call `/auth/me` (cookie sent automatically) to validate session

4. **Frontend: Remove Bearer header logic**
   - Cookies are sent automatically with `credentials: 'include'`
   - Update `client.ts` fetch calls to include `credentials: 'include'`

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/controller/AuthController.java` — set httpOnly cookie
- `backend/src/main/java/com/lutem/mvp/controller/SteamAuthController.java` — set httpOnly cookie
- `backend/src/main/java/com/lutem/mvp/security/JwtAuthFilter.java` — read from cookie
- `frontend-react/src/stores/authStore.ts` — remove token persistence
- `frontend-react/src/api/client.ts` — add `credentials: 'include'`

---

### 4. Fix Authentication Bypass in Dev Mode

**Severity:** 🔴 CRITICAL
**Effort:** 1 hour
**Risk if ignored:** Authentication silently disabled in production if Firebase misconfigured

#### Problem

`FirebaseAuthFilter` (lines 61–63) silently skips all authentication when Firebase is not configured. Combined with `LUTEM_DEV_MODE=true` in `application.properties:46`, this means:

- Dev endpoints (`/auth/dev/create-user`, `/auth/dev/validate`) are accessible
- If Firebase fails to initialize in production, all auth is bypassed with no warning

#### Action Steps

1. **Remove FirebaseAuthFilter entirely** — JWT auth via `JwtAuthFilter` is the real auth system; Firebase filter is legacy dead code
2. **Guard dev endpoints with a strict check:**
   ```java
   @Value("${lutem.dev-mode:false}")
   private boolean devMode;

   @PostMapping("/auth/dev/create-user")
   public ResponseEntity<?> devCreateUser(...) {
       if (!devMode) {
           return ResponseEntity.status(404).build(); // Hide endpoint entirely
       }
       // ...
   }
   ```
3. **Add startup validation** — if `lutem.dev-mode=true` AND `spring.profiles.active` contains `prod`, fail to start
4. **Log a clear WARNING** at startup if dev mode is enabled

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/config/SecurityConfig.java` — remove FirebaseAuthFilter registration
- `backend/src/main/java/com/lutem/mvp/security/FirebaseAuthFilter.java` — delete or archive
- `backend/src/main/java/com/lutem/mvp/controller/AuthController.java` — guard dev endpoints

---

## P1 — High Priority

### 5. Fix Production API URL Bug

**Severity:** 🟠 HIGH
**Effort:** 15 minutes
**Risk if ignored:** Session recording broken in production

#### Problem

`Home.tsx:13` uses the wrong environment variable:

```typescript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
// Should be:
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
```

The `.env.production` file defines `VITE_API_BASE_URL`, not `VITE_API_URL`. This means `recordSessionStart()` in production falls back to `localhost:8080`, which silently fails.

#### Action Steps

1. Fix the env var name in `Home.tsx:13`
2. Create a shared config file `frontend-react/src/lib/config.ts`:
   ```typescript
   export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';
   ```
3. Replace all 3 duplicate definitions (`authStore.ts:14`, `steam.ts:4`, `client.ts:3`) with the shared import

#### Files to Modify

- `frontend-react/src/lib/config.ts` — create (new file)
- `frontend-react/src/pages/Home.tsx` — fix env var
- `frontend-react/src/stores/authStore.ts` — use shared config
- `frontend-react/src/api/steam.ts` — use shared config
- `frontend-react/src/api/client.ts` — use shared config

---

### 6. Add Database Indexes

**Severity:** 🟠 HIGH
**Effort:** 1–2 hours
**Risk if ignored:** Slow queries, full table scans, degraded performance at scale

#### Problem

Frequently queried columns have no database indexes:

| Entity | Column | Used In | Query Type |
|--------|--------|---------|------------|
| `Game` | `steamAppId` | Steam import, library sync | Lookup by ID |
| `User` | `email` | Login, lookup | Unique lookup |
| `User` | `steamId` | Steam auth | Unique lookup |
| `User` | `googleId` | Google auth | Unique lookup |
| `UserLibrary` | `userId + gameId` | Library queries | Compound lookup |
| `GameSession` | `userId` | Session history | Filter |

#### Action Steps

1. Add `@Index` annotations to entity classes:
   ```java
   @Table(name = "games", indexes = {
       @Index(name = "idx_game_steam_app_id", columnList = "steamAppId", unique = true)
   })
   ```
2. Add composite indexes where needed
3. Add Firestore composite indexes to `firestore.indexes.json` for common query patterns
4. Test with `EXPLAIN ANALYZE` on PostgreSQL

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/model/Game.java`
- `backend/src/main/java/com/lutem/mvp/model/User.java`
- `backend/src/main/java/com/lutem/mvp/model/UserLibrary.java`
- `backend/src/main/java/com/lutem/mvp/model/GameSession.java`
- `firestore.indexes.json`

---

### 7. Fix N+1 Query Problems

**Severity:** 🟠 HIGH
**Effort:** 2–3 hours
**Risk if ignored:** Recommendation endpoint makes 100+ database queries per request

#### Problem

`GameController.java:136-141` loops through all games and accesses lazy-loaded collections (`getGenres()`, `getEmotionalGoals()`, `getSocialPreferences()`, etc.) for each game. Each access triggers a separate SQL query.

With 57 games and 6 lazy collections each = **342 queries per recommendation request**.

#### Action Steps

1. **Add `JOIN FETCH` queries to `GameRepository`:**
   ```java
   @Query("SELECT g FROM Game g " +
          "LEFT JOIN FETCH g.genres " +
          "LEFT JOIN FETCH g.emotionalGoals " +
          "WHERE g.fullyTagged = true")
   List<Game> findAllFullyTaggedWithDetails();
   ```
2. **Or switch to `FetchType.EAGER`** for small collections (genres, emotional goals)
3. **Or use `@EntityGraph`** annotations for flexible loading
4. **Add pagination** — `findAllFullyTagged()` returns unbounded results

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/repository/GameRepository.java` — add fetch join queries
- `backend/src/main/java/com/lutem/mvp/controller/GameController.java` — use new queries
- `backend/src/main/java/com/lutem/mvp/model/Game.java` — consider fetch strategy

---

### 8. Add CSRF Protection

**Severity:** 🟠 HIGH
**Effort:** 2 hours
**Risk if ignored:** Cross-site request forgery attacks on authenticated endpoints

#### Problem

All state-changing requests (POST, PUT, DELETE) are sent without CSRF tokens. If a user visits a malicious page while logged in, that page can submit requests on their behalf.

#### Action Steps

1. **If moving to httpOnly cookies (item #3):** CSRF protection becomes mandatory
   - Backend: Generate CSRF token, send in response header or cookie (non-httpOnly)
   - Frontend: Read CSRF token, attach to all mutating requests as `X-CSRF-Token` header
2. **Alternative:** Use `SameSite=Strict` on auth cookies (simpler but less compatible)
3. **Add `SameSite` attribute** to all cookies set by backend

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/config/SecurityConfig.java` — add CSRF filter
- `frontend-react/src/api/client.ts` — attach CSRF header

---

### 9. Consolidate Dual Authentication System

**Severity:** 🟠 HIGH
**Effort:** 4–6 hours
**Risk if ignored:** Duplicated auth logic, inconsistent token handling, maintenance burden

#### Problem

Two parallel authentication flows exist:

| Flow | Controller | Token Generation | Cookie Setting |
|------|-----------|-----------------|----------------|
| Google | `AuthController.java:82-173` | JWT via `JwtService` | httpOnly cookie |
| Steam | `SteamAuthController.java:90-156` | JWT via `JwtService` | httpOnly cookie + redirect |

Both duplicate JWT generation, cookie setting, and error handling logic. The `User` model has both `steamId` and `googleId` with no clear linking strategy.

#### Action Steps

1. **Extract shared auth logic** into `AuthService`:
   ```java
   public class AuthService {
       public String generateTokenAndSetCookie(User user, HttpServletResponse response) { ... }
       public User findOrCreateUser(String provider, String providerId, String email) { ... }
   }
   ```
2. **Simplify controllers** to only handle provider-specific logic (OpenID validation, Firebase token exchange)
3. **Add account linking** — if a user logs in with Steam and later with Google (same email), link the accounts
4. **Remove deprecated Firebase auth methods** from `User.java:94-107` and `UserService.java:74-80`

#### Files to Modify

- Create `backend/src/main/java/com/lutem/mvp/service/AuthService.java`
- `backend/src/main/java/com/lutem/mvp/controller/AuthController.java` — simplify
- `backend/src/main/java/com/lutem/mvp/controller/SteamAuthController.java` — simplify
- `backend/src/main/java/com/lutem/mvp/model/User.java` — remove deprecated methods
- `backend/src/main/java/com/lutem/mvp/service/UserService.java` — remove deprecated methods

---

### 10. Set Up Frontend Testing

**Severity:** 🟠 HIGH
**Effort:** 8–12 hours (initial setup + critical path tests)
**Risk if ignored:** Regressions go undetected, no confidence in deployments

#### Problem

Zero test files exist in `frontend-react/`. No test framework is configured. No `test` script in `package.json`.

#### Action Steps

1. **Install Vitest + Testing Library:**
   ```bash
   npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
   ```
2. **Add vitest config** to `vite.config.ts`:
   ```typescript
   test: {
     globals: true,
     environment: 'jsdom',
     setupFiles: './src/test/setup.ts',
   }
   ```
3. **Write tests for critical paths** (priority order):
   - Auth flow (login, logout, session validation)
   - Recommendation wizard (form submission, validation)
   - API client (retry logic, error handling)
   - Steam library import
4. **Add `test` script** to `package.json`
5. **Target:** 70% coverage on critical paths

#### Files to Create

- `frontend-react/src/test/setup.ts`
- `frontend-react/src/stores/__tests__/authStore.test.ts`
- `frontend-react/src/api/__tests__/client.test.ts`
- `frontend-react/src/components/__tests__/WizardSteps.test.tsx`

---

### 11. Expand Backend Test Coverage

**Severity:** 🟠 HIGH
**Effort:** 6–8 hours
**Risk if ignored:** Critical business logic (recommendations, auth, Steam import) untested

#### Problem

Only 2 test classes exist:
- `GameControllerTest.java` (108 lines)
- `GameSessionServiceTest.java`

No tests for: `AuthController`, `SteamAuthController`, `SteamService`, `FriendshipService`, `UserService`, `GameAdminController`, error scenarios.

#### Action Steps

1. **Add integration tests for auth endpoints**
   - Test Google login flow (mock Firebase)
   - Test Steam OpenID flow (mock Steam API)
   - Test invalid/expired tokens
2. **Add unit tests for recommendation scoring**
   - `GameController.java:197-374` has 11 scoring factors with hardcoded weights
   - Test edge cases: zero minutes, extreme values, empty goals
3. **Add tests for admin endpoints**
   - Verify auth required (after item #2 is done)
   - Test bulk import validation
4. **Add tests for Steam library import**
   - Mock Steam API responses
   - Test large libraries, duplicate handling
5. **Add SteamService tests**
   - Test rate limiting behavior
   - Test error responses from Steam

#### Files to Create

- `backend/src/test/.../controller/AuthControllerTest.java`
- `backend/src/test/.../controller/SteamAuthControllerTest.java`
- `backend/src/test/.../controller/GameAdminControllerTest.java`
- `backend/src/test/.../service/SteamServiceTest.java`
- `backend/src/test/.../service/FriendshipServiceTest.java`
- `backend/src/test/.../service/RecommendationScoringTest.java`

---

### 12. Add Security Headers

**Severity:** 🟠 HIGH
**Effort:** 1 hour
**Risk if ignored:** XSS, clickjacking, MIME sniffing attacks

#### Problem

`netlify.toml` has no security headers configured. The backend also doesn't set security headers.

#### Action Steps

1. **Add to `netlify.toml`:**
   ```toml
   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-Content-Type-Options = "nosniff"
       X-XSS-Protection = "1; mode=block"
       Referrer-Policy = "strict-origin-when-cross-origin"
       Content-Security-Policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https://cdn.cloudflare.steamstatic.com; connect-src 'self' https://lutemprototype-production.up.railway.app https://*.firebaseio.com"
       Permissions-Policy = "camera=(), microphone=(), geolocation=()"
   ```
2. **Add HTTPS redirect** in netlify.toml or Netlify dashboard

#### Files to Modify

- `netlify.toml` — add headers section
- Optionally: `backend/src/main/java/com/lutem/mvp/config/WebConfig.java` — add response headers

---

## P2 — Medium Priority

### 13. Remove Legacy Frontend & Fix Startup Scripts

**Severity:** 🟡 MEDIUM
**Effort:** 30 minutes
**Risk if ignored:** Confusion, new developers run wrong frontend

#### Problem

- `frontend/` directory (970KB) contains the old vanilla JS implementation
- `start-frontend.bat` and `start-lutem.bat` still open `frontend/index.html`
- `start-frontend-only.bat` also references the old frontend

#### Action Steps

1. Delete `frontend/` directory (or move to `_archive/frontend-legacy/`)
2. Update `start-frontend.bat`:
   ```bat
   cd frontend-react && npm run dev
   ```
3. Update `start-lutem.bat` to start both backend and React dev server
4. Delete `start-frontend-only.bat` (redundant)

#### Files to Modify/Delete

- `frontend/` — delete or archive
- `start-frontend.bat` — update to React
- `start-frontend-only.bat` — delete
- `start-lutem.bat` — update frontend command

---

### 14. Clean Up Dead Code

**Severity:** 🟡 MEDIUM
**Effort:** 1 hour
**Risk if ignored:** Confusion, misleading code

#### Dead Code Inventory

| File | Lines | Issue |
|------|-------|-------|
| `frontend-react/src/api/auth.ts` | 65 | Never imported anywhere — duplicates `authStore.ts` |
| `frontend-react/src/components/ProtectedRoute.tsx` | ~30 | Not imported in any route |
| `GameController.java:45-46` | 2 | In-memory `feedbackMap` alongside database storage |
| `User.java:94-107` | 13 | Deprecated Firebase methods |
| `UserService.java:74-80` | 6 | Deprecated `findByFirebaseUid` |
| `SteamService.java:223-235` | 12 | Deprecated method |
| `commit_msg.txt` + `commit-msg.txt` | 2 files | Orphaned commit message drafts |
| `tag-all.json` + `tag-request.json` (root) | 2 files | Identical content, both `{"all": true}` |

#### Action Steps

1. Delete `api/auth.ts`
2. Delete or properly integrate `ProtectedRoute.tsx`
3. Remove `feedbackMap` from `GameController.java` — use database only
4. Remove all deprecated methods
5. Delete orphaned files in project root

---

### 15. Fix CORS Configuration

**Severity:** 🟡 MEDIUM
**Effort:** 1 hour
**Risk if ignored:** Overly permissive cross-origin access in production

#### Problem

`WebConfig.java:18-38` whitelists multiple localhost ports AND production domains in the same config. `allowedHeaders` uses `"*"` wildcard.

#### Action Steps

1. **Create environment-specific CORS config:**
   - `application-local.properties`: `lutem.cors.origins=http://localhost:5173,http://localhost:5174,http://localhost:5175`
   - `application.properties` (prod): `lutem.cors.origins=https://lutembeta.netlify.app`
2. **Read origins from config** in `WebConfig.java`
3. **Replace `"*"` headers** with specific allowed headers: `Content-Type, Authorization, X-CSRF-Token`

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/config/WebConfig.java`
- `backend/src/main/resources/application.properties`
- `backend/src/main/resources/application-local.properties`

---

### 16. Update Outdated Dependencies

**Severity:** 🟡 MEDIUM
**Effort:** 2–3 hours (including testing)
**Risk if ignored:** Known vulnerabilities, missing bug fixes

#### Outdated Dependencies

| Dependency | Current | Action |
|-----------|---------|--------|
| Spring Boot | 3.2.0 (Nov 2023) | Update to 3.4.x |
| Firebase Admin SDK | 9.2.0 (Nov 2023) | Update to latest |
| JJWT | 0.12.3 | Verify against security advisories |
| `pom.xml` version | `0.0.1-SNAPSHOT` | Update to match changelog (0.7.0+) |

#### Action Steps

1. Run `mvn versions:display-dependency-updates`
2. Update Spring Boot parent to 3.4.x
3. Update Firebase Admin SDK
4. Run `npm audit` in `frontend-react/`
5. Run full test suite after updates
6. Update `pom.xml` version to `0.8.0-SNAPSHOT` or current

#### Files to Modify

- `backend/pom.xml`
- `frontend-react/package.json` (if `npm audit` finds issues)

---

### 17. Set `ddl-auto=validate` in Production

**Severity:** 🟡 MEDIUM
**Effort:** 30 minutes
**Risk if ignored:** Hibernate auto-modifies production database schema unexpectedly

#### Problem

`application.properties:13` has `spring.jpa.hibernate.ddl-auto=update`, which allows Hibernate to auto-alter tables in production. This can cause data loss or schema corruption.

#### Action Steps

1. Set `spring.jpa.hibernate.ddl-auto=validate` in `application.properties`
2. Keep `ddl-auto=update` only in `application-local.properties` for local dev
3. Consider adding Flyway or Liquibase for proper schema migrations

#### Files to Modify

- `backend/src/main/resources/application.properties`

---

### 18. Add Input Validation

**Severity:** 🟡 MEDIUM
**Effort:** 2–3 hours
**Risk if ignored:** Invalid data, potential denial of service

#### Problem Areas

| Endpoint | Missing Validation |
|----------|--------------------|
| `POST /recommendations` | `availableMinutes` has no upper bound (1,000,000 minutes?) |
| `POST /recommendations` | `desiredEmotionalGoals` has no max size (100 goals?) |
| `POST /api/steam/import` | No limit on library size (100,000+ games) |
| `POST /admin/games/bulk` | No limit on bulk import size |
| `Game.java` | `minMinutes` not validated to be ≤ `maxMinutes` |

#### Action Steps

1. Add `@Valid` / `@Validated` annotations to controller parameters
2. Add `@Min`, `@Max`, `@Size` to DTO fields
3. Add pagination/limits to Steam import (process in batches of 100)
4. Add `@AssertTrue` for cross-field validation (min ≤ max)

#### Files to Modify

- `backend/src/main/java/com/lutem/mvp/controller/GameController.java`
- `backend/src/main/java/com/lutem/mvp/controller/SteamController.java`
- `backend/src/main/java/com/lutem/mvp/controller/GameAdminController.java`
- `backend/src/main/java/com/lutem/mvp/model/Game.java`
- Create DTOs with validation annotations if they don't exist

---

### 19. Split Oversized Frontend Components

**Severity:** 🟡 MEDIUM
**Effort:** 3–4 hours
**Risk if ignored:** Hard to maintain, hard to test, poor developer experience

#### Large Components

| Component | Size | Recommended Split |
|-----------|------|-------------------|
| `Library.tsx` | 33KB | `LibraryPage`, `MyGamesTab`, `AllGamesTab`, `GameFilters` |
| `Calendar.tsx` | 26KB | `CalendarPage`, `CalendarGrid`, `EventCard`, `CalendarFilters` |
| `Home.tsx` | 13KB | Acceptable, but extract `RecommendationResult` |

#### Action Steps

1. Identify logical sub-components in each large file
2. Extract into separate files in a subfolder (e.g., `pages/library/`)
3. Keep the page component as a thin orchestrator
4. Ensure props are well-typed

---

### 20. Fix CSS Variable Inconsistencies

**Severity:** 🟡 MEDIUM
**Effort:** 1–2 hours
**Risk if ignored:** Visual bugs, broken theming in some components

#### Problem

Mixed naming conventions for CSS variables:

```typescript
// Correct pattern (used in most places):
bg-[var(--color-bg-secondary)]
text-[var(--color-text-primary)]

// Wrong pattern (used in some places):
bg-[var(--bg-secondary)]       // ErrorBoundary.tsx:63
text-[var(--text-primary)]     // various
var(--accent-primary)          // inconsistent with --color-accent-primary
```

#### Action Steps

1. Audit all `var(--` usages in `.tsx` and `.css` files
2. Standardize on `--color-*` prefix for all color variables
3. Search and replace inconsistent references
4. Verify all 8 theme combinations (4 themes × light/dark) still work

---

### 21. Improve Error Handling Consistency

**Severity:** 🟡 MEDIUM
**Effort:** 2–3 hours
**Risk if ignored:** Poor user experience, swallowed errors, debugging difficulty

#### Frontend Issues

| Location | Issue |
|----------|-------|
| `useGamingPreferences.ts:31` | Empty `catch {}` — silently swallows errors |
| `steamStore.ts:120` | `console.error` only, no user feedback |
| `Home.tsx:192` | Hardcoded "Make sure backend is running at localhost:8080" (leaks infra) |
| Multiple files | Different error message formatting styles |

#### Backend Issues

| Location | Issue |
|----------|-------|
| `GlobalExceptionHandler.java` | Some exceptions expose internal details to client |
| `SteamAuthController.java:82,149` | Logs full URLs with auth tokens |
| Multiple files | No structured error codes for frontend to parse |

#### Action Steps

1. Create `frontend-react/src/lib/errors.ts` with centralized error formatting
2. Replace all `catch {}` with proper error handling
3. Add error codes to backend responses (e.g., `AUTH_001`, `STEAM_002`)
4. Sanitize all log output — mask tokens, redact keys
5. Show generic messages to users, log details server-side

---

### 22. Improve Accessibility

**Severity:** 🟡 MEDIUM
**Effort:** 3–4 hours
**Risk if ignored:** Excludes users with disabilities, potential legal compliance issues

#### Issues Found

| Issue | Locations |
|-------|-----------|
| Buttons missing `aria-label` | `GameCard.tsx`, most icon buttons |
| Forms missing `<label>` | `FeedbackPrompt.tsx:118`, `Settings.tsx` |
| No ARIA live regions | Dynamic content updates not announced |
| Color-only indicators | Need text labels alongside color |
| Focus management | Modals don't trap focus |
| Keyboard navigation | Not verified |

#### Action Steps

1. Add `aria-label` to all icon-only buttons
2. Associate all form inputs with `<label>` elements
3. Add `aria-live="polite"` to dynamic content areas
4. Add visible focus indicators (`:focus-visible` ring)
5. Test with keyboard-only navigation
6. Run axe DevTools audit and fix findings

---

### 23. Add Firestore Data Validation Rules

**Severity:** 🟡 MEDIUM
**Effort:** 1–2 hours
**Risk if ignored:** Malicious or malformed data written to Firestore

#### Problem

`firestore.rules` allows read/write to own documents but has no field-level validation:
- No required fields enforcement
- No data type checking
- No document size limits
- No timestamp validation

#### Action Steps

1. Add field validation rules:
   ```
   match /users/{userId}/sessions/{sessionId} {
     allow write: if request.auth.uid == userId
       && request.resource.data.keys().hasAll(['gameId', 'startTime'])
       && request.resource.data.gameId is string
       && request.resource.data.startTime is timestamp;
   }
   ```
2. Add document size limits
3. Test rules with Firebase emulator

#### Files to Modify

- `firestore.rules`

---

## P3 — Low Priority

### 24. Update Documentation

**Severity:** 🟢 LOW
**Effort:** 2–3 hours
**Risk if ignored:** Confusion for new developers, outdated information

#### Issues

| Document | Issue |
|----------|-------|
| `README.md` | States "December 2025", URLs don't match deployment |
| `PROJECT_INSTRUCTIONS.md` | References vanilla frontend, wrong game counts |
| `CHANGELOG.md` | 133 commits but only 0.7.0 documented |
| `TODO.md` | Last updated December 7, 2025 |
| Calendar docs | 4+ conflicting documents |

#### Action Steps

1. Update `README.md` with correct URLs, current date, accurate feature list
2. Rewrite `PROJECT_INSTRUCTIONS.md` to reflect React frontend
3. Add changelog entries for all work since v0.7.0
4. Consolidate calendar docs into single `CALENDAR.md`
5. Archive or delete outdated docs

---

### 25. Clean Up Database Scripts

**Severity:** 🟢 LOW
**Effort:** 1 hour
**Risk if ignored:** Confusion about which scripts to use

#### Problem

`scripts/database/` has 4 variants of `add_store_urls*.py`, multiple fix scripts, and no README explaining what each does.

#### Action Steps

1. Identify which scripts are current and which are obsolete
2. Delete obsolete variants
3. Add `scripts/README.md` explaining each script's purpose
4. Add version/date comments to Python files

---

### 26. Clean Up Build & Git Scripts

**Severity:** 🟢 LOW
**Effort:** 30 minutes
**Risk if ignored:** Minor confusion, clutter

#### Files to Review

- `scripts/build/force-clean.bat` — document or delete
- `scripts/build/rebuild-backend.bat` — may duplicate `start-backend.bat`
- `scripts/build/pre-run.bat` — unclear purpose
- `scripts/git/commit-database-migration.bat` — document use case
- `scripts/git/commit-restore.bat` — document or delete
- `scripts/git/git-commit.bat` — likely redundant

---

### 27. Improve Rate Limiter for Production

**Severity:** 🟢 LOW (until multi-instance deployment)
**Effort:** 3–4 hours
**Risk if ignored:** Rate limits bypassed in distributed deployment, memory leak

#### Problem

`RateLimitInterceptor.java` uses an in-memory `ConcurrentHashMap`. Each server instance has its own state. Cleanup only runs on request, not on schedule.

#### Action Steps (when scaling)

1. Replace in-memory map with Redis-backed counter
2. Use `@Scheduled` cleanup instead of per-request cleanup
3. Add a max map size to prevent memory exhaustion
4. Consider using Spring Boot's built-in rate limiting or Bucket4j

---

### 28. Add Pre-commit Hooks

**Severity:** 🟢 LOW
**Effort:** 1 hour
**Risk if ignored:** Credentials accidentally committed again, code style violations

#### Action Steps

1. Install husky + lint-staged in `frontend-react/`
2. Configure pre-commit hooks:
   - Run ESLint on staged `.ts`/`.tsx` files
   - Run type check
   - Scan for secrets (use `detect-secrets` or `gitleaks`)
3. Add a backend pre-commit hook to run `mvn spotbugs:check`

---

### 29. Add Client-Side Image Optimization

**Severity:** 🟢 LOW
**Effort:** 1–2 hours
**Risk if ignored:** Slower initial page load

#### Action Steps

1. Add `loading="lazy"` to all `<img>` tags in `GameCard.tsx`
2. Add placeholder/skeleton images while loading
3. Consider using `srcset` for responsive image sizes
4. Cache Steam CDN images via service worker (future)

---

### 30. Consider Downgrading React to v18 LTS

**Severity:** 🟢 LOW
**Effort:** 1–2 hours
**Risk if ignored:** Potential undiscovered React 19 bugs (low probability)

#### Context

React 19 (December 2024) and React Router v7 are relatively new. The project doesn't use React 19-specific features (Server Components, Actions, `use()` hook). Downgrading to React 18 + React Router v6 would provide more stability.

#### Decision

- **If stability is paramount:** Downgrade to React 18.3 + React Router 6.x
- **If staying current is preferred:** Keep React 19 but monitor for issues
- Either way, this is low risk — React 19 is production-ready

---

## Summary Checklist

### P0 — Critical (Do First)

- [x] Rotate Steam API key
- [x] Rotate Firebase service account
- [x] Remove hardcoded JWT secret, require env var
- [x] Scrub git history of credentials
- [x] Add authentication to all `/admin/**` endpoints
- [x] Add role-based access control (RBAC)
- [x] Move JWT from localStorage to httpOnly cookies
- [x] Remove FirebaseAuthFilter (legacy dead code)
- [x] Guard dev-mode endpoints with strict checks

### P1 — High (Do This Week)

- [x] Fix `VITE_API_URL` → `VITE_API_BASE_URL` in `Home.tsx`
- [x] Centralize API base URL config
- [x] Add database indexes on key columns
- [x] Fix N+1 queries in recommendation endpoint
- [x] Add CSRF protection
- [x] Consolidate dual auth system
- [x] Set up Vitest for frontend testing
- [x] Write backend tests for auth, admin, Steam
- [x] Add security headers to `netlify.toml`

### P2 — Medium (Next 2–4 Weeks)

- [x] Remove legacy `frontend/` directory
- [x] Update startup scripts for React
- [x] Delete dead code (api/auth.ts, deprecated methods, orphan files)
- [x] Fix CORS configuration (environment-specific)
- [x] Update Spring Boot to 3.4.x
- [x] Update Firebase Admin SDK
- [x] Set `ddl-auto=validate` in production
- [x] Add input validation to all endpoints
- [x] Split oversized components (Library, Calendar)
- [x] Fix CSS variable naming inconsistencies
- [x] Improve error handling consistency
- [x] Add accessibility improvements
- [x] Add Firestore data validation rules

### P3 — Low (When Convenient)

- [x] Update README, CHANGELOG, PROJECT_INSTRUCTIONS
- [x] Clean up database scripts
- [x] Clean up build/git scripts
- [x] Improve rate limiter for distributed deployment
- [x] Add pre-commit hooks (husky + lint-staged + secret scanning)
- [x] Add image lazy loading
- [x] Evaluate React 18 downgrade → Decision: Keep React 19 (no R19-specific features used, stable, all deps compatible)

---

> **Status:** 30/30 items completed (Feb 2026)
> **All items addressed.**
