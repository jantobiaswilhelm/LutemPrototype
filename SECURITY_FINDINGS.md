# Security Findings — Lutem Prototype

**Date:** 2026-02-24
**Scope:** Static code review of `LutemPrototype` backend (Spring Boot 3.4.5, Java 17) and frontend (React 19, TypeScript)
**Method:** Manual code review only — no dynamic testing, no dependency CVE scan, no SAST tooling run

---

## High Severity

### 1. IDOR on user stats endpoints — missing ownership check

| Detail | Value |
|--------|-------|
| **Endpoints** | `GET /api/users/{uid}/satisfaction-stats`, `GET /api/users/{uid}/summary/weekly` |
| **Files** | `UserStatsController.java` (line 38, line 56) |

Both endpoints accept any `uid` path variable and return that user's data without verifying the authenticated caller owns that UID. `JwtAuthFilter` requires authentication for `/api/users/**`, so this is not unauthenticated exposure — but any logged-in user can request another user's satisfaction stats, weekly summaries, gaming patterns, and emotional tag frequencies if they know or obtain the target UID.

**Recommendation:** Extract the authenticated user's identifier from request attributes set by `JwtAuthFilter` and compare it to the `{uid}` path variable. Return 403 if they don't match.

---

### 2. Session privacy/integrity — global history + arbitrary session mutation

| Detail | Value |
|--------|-------|
| **Endpoints** | `POST /sessions/{id}/start`, `POST /sessions/{id}/end`, `POST /sessions/alternative/{gameId}`, `GET /sessions/history` |
| **Files** | `GameController.java` (line 438, 459, 480), `GameSessionService.java` (line 52, 64, 109), `GameSessionRepository.java` (line 60) |

Any authenticated user can call `startSession` / `endSession` on arbitrary session IDs; no ownership check is enforced. `GET /sessions/history` returns global started sessions (`findStartedSessionsOrderByStartedAtDesc`) rather than the current user's sessions, which can leak other users' activity.

**Recommendation:** Filter all session queries and mutations by the authenticated user. Add ownership validation before allowing start/end/alternative operations.

---

### 3. Session records created without user binding

| Detail | Value |
|--------|-------|
| **Files** | `GameSessionService.java` (line 31, 100), `GameSession.java` (line 23, 48) |

`recordRecommendation()` and `createAlternativeSession()` create `GameSession` without attaching the authenticated `User`, defaulting to `legacyUserId="anonymous"`. This undermines ownership checks (even where attempted) and contributes to the cross-user session problems above.

**Recommendation:** Pass the authenticated user through to session creation methods and bind sessions to the current user at creation time.

---

## Medium Severity

### 4. Public recommendations endpoint accepts attacker-supplied userId

| Detail | Value |
|--------|-------|
| **Endpoint** | `POST /recommendations` |
| **Files** | `JwtAuthFilter.java` (line 140), `GameController.java` (line 107, 119) |

`/recommendations` is explicitly public, and the controller reads `request.getUserId()` from the request body to load satisfaction stats. An attacker can supply another user's identifier to expose or influence personalized output (privacy leak via recommendation reasons / inferred preferences).

**Recommendation:** Ignore any client-supplied `userId` on public requests. Only use the authenticated user's identity (from the JWT) when personalizing recommendations; fall back to anonymous/generic scoring for unauthenticated callers.

---

### 5. Rate limiter trusts X-Forwarded-For unconditionally

| Detail | Value |
|--------|-------|
| **File** | `RateLimitInterceptor.java` (line 125, 131) |

A direct client can spoof `X-Forwarded-For` / `X-Real-IP` headers and bypass IP-based rate limiting unless a trusted proxy strips or sets them.

**Recommendation:** Trust proxy headers only when requests arrive from known proxy IPs, or rely on the container/reverse-proxy-provided remote address. Railway's proxy may already sanitize these headers — verify and document.

---

## Low Severity

### 6. Secret-bearing local env file tracked by git

| Detail | Value |
|--------|-------|
| **File** | `.env.local` (line 1) |

`git ls-files` shows `.env.local` is tracked, even though `.gitignore` includes the pattern. Current content is redacted placeholder text, but tracking this file creates a recurring risk of accidental secret commits.

**Recommendation:** Remove from git tracking (`git rm --cached .env.local`) and verify `.gitignore` rule takes effect.

---

## Open Questions / Assumptions

- UIDs in `UserStatsController` are assumed to be user-controlled or obtainable (e.g., surfaced in frontend or logs). If not, exploitability is lower but still an authorization flaw.
- Whether a reverse proxy sanitizes `X-Forwarded-For` before the app was not verified.

---

## What Looks Improved

- Admin routes (`/admin/**`) are protected and admin-role checked via `JwtAuthFilter`.
- JWT secret validation now fails startup when missing or too short.
- Steam auth callback no longer puts JWT in URL.
- Auth cookies include `SameSite` attribute.
