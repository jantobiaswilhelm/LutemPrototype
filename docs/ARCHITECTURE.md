# Lutem Architecture

**Technical deep-dive into Lutem's system design and implementation.**

**Project Type:** Side Project → Potential Startup  
**Goal:** Scalable architecture for real users

---

## System Overview

### Current Architecture (Deployed)
```
┌─────────────────┐                          ┌─────────────────┐
│    Frontend     │ ◄────── HTTP/JSON ─────► │     Backend     │
│  (Netlify)      │       REST API           │   (Railway)     │
└─────────────────┘                          └─────────────────┘
        │                                            │
        │ Firebase Client SDK                        │ Firebase Admin SDK
        ▼                                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Firebase Auth                            │
└─────────────────────────────────────────────────────────────┘
                                                     │
                                                     ▼
                                             ┌─────────────────┐
                                             │   PostgreSQL    │
                                             │   (Railway)     │
                                             └─────────────────┘

Local Development:
- Backend: H2 in-memory database (application-local.properties)
- Frontend: npm run dev (Vite on http://localhost:5173)
```

### Target Architecture (Scalable)
```
┌─────────────────┐                          ┌─────────────────┐
│    Frontend     │ ◄────── HTTP/JSON ─────► │     Backend     │
│  (Netlify CDN)  │       REST API           │   (Railway)     │
└─────────────────┘                          └─────────────────┘
        │                                            │
        │                                            │
        ▼                                            ▼
┌─────────────────┐                          ┌─────────────────┐
│   Firestore     │                          │   PostgreSQL    │
│  (User Data)    │                          │  (Game Data)    │
└─────────────────┘                          └─────────────────┘
        │
        │
        ▼
┌─────────────────┐
│  Firebase Auth  │
└─────────────────┘
```

### Data Separation Strategy

| Data Type | Storage | Why |
|-----------|---------|-----|
| **Games** (100+) | PostgreSQL | Relational, backend-managed, static |
| **Calendar Events** | PostgreSQL | Backend-managed, linked to games |
| **User Profiles** | Firestore | User-owned, real-time sync, scales |
| **Session History** | Firestore | User-owned, real-time sync |
| **Preferences** | Firestore | User-owned, instant sync |
| **Feedback** | Firestore | Tied to user sessions |

**Rationale:**
- PostgreSQL: Proper relational database for game catalog, complex queries
- Firestore: Already using Firebase Auth, scales infinitely, real-time sync for user data
- Clean separation: Backend owns game logic, users own their data

---

## Project Structure

```
lutem-mvp/
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/lutem/mvp/
│   │   ├── LutemMvpApplication.java
│   │   ├── config/
│   │   │   ├── FirebaseConfig.java
│   │   │   ├── GameDataLoader.java
│   │   │   └── WebConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── CalendarController.java
│   │   │   ├── GameController.java
│   │   │   └── GameAdminController.java
│   │   ├── model/
│   │   │   ├── Game.java
│   │   │   ├── User.java
│   │   │   ├── CalendarEvent.java
│   │   │   └── [enums...]
│   │   ├── dto/
│   │   │   ├── RecommendationRequest.java
│   │   │   └── RecommendationResponse.java
│   │   ├── repository/
│   │   │   └── [JPA repositories]
│   │   ├── security/
│   │   │   ├── JwtService.java
│   │   │   ├── JwtAuthFilter.java
│   │   │   └── CsrfCookieFilter.java
│   │   └── service/
│   │       └── [business logic]
│   └── pom.xml
├── frontend-react/              # React 19 + TypeScript + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── api/                # API client (client.ts, steam.ts, hooks.ts)
│   │   ├── components/         # UI components (wizard/, calendar/, library/, feedback/)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── lib/                # Shared utilities (config.ts)
│   │   ├── pages/              # Route pages (Home, Library, Calendar, Friends, etc.)
│   │   ├── stores/             # Zustand stores (auth, theme, wizard, recommendations, steam)
│   │   ├── styles/themes/      # 4 color themes (cafe, lavender, earth, ocean)
│   │   ├── test/               # Vitest setup + test utilities
│   │   └── types/              # TypeScript type definitions
│   └── index.html
└── docs/
    ├── ROADMAP.md
    ├── ARCHITECTURE.md
    ├── POSTGRESQL_MIGRATION_PLAN.md
    ├── USER_PROFILE_IMPLEMENTATION_PLAN.md
    └── [other docs]
```

---

## Firestore Data Model

```
firestore/
└── users/
    └── {firebaseUid}/
        │
        ├── profile (document)
        │   ├── displayName: string
        │   ├── email: string
        │   ├── createdAt: timestamp
        │   └── updatedAt: timestamp
        │
        ├── preferences (document)
        │   ├── genres: string[]
        │   ├── sessionLength: string
        │   ├── engagementLevel: string
        │   ├── gamingTimes: string[]
        │   ├── primaryGoal: string
        │   ├── emotionalGoals: string[]
        │   └── updatedAt: timestamp
        │
        ├── stats (document)
        │   ├── totalSessions: number
        │   ├── totalMinutesPlayed: number
        │   ├── averageSatisfaction: number
        │   └── lastSessionAt: timestamp
        │
        └── sessions/ (subcollection)
            └── {sessionId}
                ├── gameId: number
                ├── gameName: string
                ├── startTime: timestamp
                ├── endTime: timestamp
                ├── source: string
                ├── feedback: map
                └── context: map
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                         && request.auth.uid == userId;
    }
  }
}
```

---

## PostgreSQL Schema

### Games Table
```sql
CREATE TABLE games (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    subgenre VARCHAR(100),
    min_minutes INTEGER,
    max_minutes INTEGER,
    avg_playtime INTEGER,
    interruptibility VARCHAR(20),
    energy_level VARCHAR(20),
    social_level VARCHAR(20),
    difficulty_level VARCHAR(20),
    platforms TEXT,  -- JSON array
    mood_unwind DOUBLE PRECISION,
    mood_recharge DOUBLE PRECISION,
    mood_engage DOUBLE PRECISION,
    mood_challenge DOUBLE PRECISION,
    mood_achieve DOUBLE PRECISION,
    mood_explore DOUBLE PRECISION,
    mood_social DOUBLE PRECISION,
    mood_chill DOUBLE PRECISION,
    cover_image VARCHAR(500),
    store_link_steam VARCHAR(500),
    store_link_epic VARCHAR(500),
    store_link_gog VARCHAR(500),
    store_link_playstation VARCHAR(500),
    store_link_xbox VARCHAR(500),
    store_link_nintendo VARCHAR(500)
);
```

### Calendar Events Table
```sql
CREATE TABLE calendar_events (
    id BIGSERIAL PRIMARY KEY,
    user_firebase_uid VARCHAR(128) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    type VARCHAR(20),  -- 'TASK', 'GAME', 'IMPORTED'
    game_id BIGINT REFERENCES games(id),
    external_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_calendar_user ON calendar_events(user_firebase_uid);
CREATE INDEX idx_calendar_time ON calendar_events(start_time, end_time);
```

---

## Authentication Flow

Dual auth with JWT httpOnly cookies:

```
Steam OpenID Flow:
1. User clicks "Sign in with Steam" → redirects to Steam login
2. Steam validates → redirects back with OpenID params
3. Backend validates OpenID, creates/finds user, generates JWT
4. JWT set as httpOnly cookie, user redirected to frontend

Google/Firebase Flow:
1. User clicks "Sign in with Google" → Firebase Client SDK → Google OAuth
2. Firebase returns ID token
3. Frontend sends token to backend /auth/google
4. Backend verifies with Firebase Admin SDK, creates/finds user, generates JWT
5. JWT set as httpOnly cookie
```

### Security Features
- **JWT httpOnly cookies** (not localStorage — XSS-safe)
- **CSRF protection** via double-submit cookie pattern
- **RBAC** with USER/ADMIN roles in JWT claims
- **Rate limiting** with scheduled cleanup and IP cap

### Endpoint Authentication

| Endpoint | Auth | Role |
|----------|------|------|
| `GET /games` | No | - |
| `POST /recommendations` | No | - |
| `GET /api/calendar/events` | Yes | USER |
| `POST /api/steam/import` | Yes | USER |
| `POST /admin/games` | Yes | ADMIN |
| `DELETE /admin/games/{id}` | Yes | ADMIN |

---

## Recommendation Algorithm

### Scoring System (115 points base)

| Dimension | Weight | Points |
|-----------|--------|--------|
| Time Match | 30% | 0-30 |
| Emotional Goals | 25% | 0-25 |
| Interruptibility | 20% | 0-20 |
| Energy Level | 15% | 0-15 |
| Time of Day | 5% | 0-5 |
| Social Preference | 5% | 0-5 |

### Preference Bonuses (from Firestore)

| Bonus | Multiplier |
|-------|------------|
| Preferred Genre Match | +10-15% |
| High Past Satisfaction | +10% |
| Engagement Level Match | +5% |

### Soft Ranking Philosophy

Preferences boost scores but don't filter:
```java
// Genre boost example
if (userPreferredGenres.contains(game.genre)) {
    score *= 1.15;  // 15% boost
}
// Game still appears even if genre doesn't match
```

---

## Frontend Architecture

### State Management
- **Zustand** stores with persist middleware (auth, theme, wizard, recommendations, steam, feedback)
- **TanStack Query v5** for server state (API data fetching, caching, mutations)

### Key Stores
| Store | Purpose |
|-------|---------|
| `authStore` | User session, JWT cookie auth |
| `themeStore` | Theme (4 palettes) + mode (light/dark) |
| `wizardStore` | Recommendation wizard state |
| `recommendationStore` | Current recommendation + alternatives |
| `steamStore` | Steam library import state |
| `feedbackStore` | Post-session feedback prompts |

### Theme System

4 palettes x 2 modes = 8 combinations via CSS custom properties:
- Warm Cafe, Soft Lavender, Natural Earth, Ocean Breeze

---

## Deployment

### Production Stack

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | Netlify | CDN, auto-deploy from GitHub |
| Backend | Railway | Auto-deploy, PostgreSQL add-on |
| Auth | Firebase | Free tier sufficient |
| User Data | Firestore | Scales automatically |

### Environment Variables

**Railway:**
```
DATABASE_URL=postgresql://...
FIREBASE_CREDENTIALS={"type":"service_account",...}
SPRING_PROFILES_ACTIVE=prod
```

**Netlify:**
```
# No env vars needed - uses public Firebase config
```

---

## Scaling Considerations

### Current Capacity (Free Tiers)
- PostgreSQL: 1GB storage, ~100k games
- Firestore: 1GB storage, 50k reads/day
- Railway: Shared CPU, sufficient for ~1000 DAU

### When to Scale
- 1,000+ daily users → Upgrade Railway tier
- 10,000+ users → Add Redis caching
- 100,000+ users → Consider CDN for API, read replicas

### What Doesn't Need to Scale Yet
- Game catalog (100+ games, static)
- Recommendation algorithm (in-memory, fast)
- Frontend (Netlify CDN handles it)

---

*See also: [API.md](API.md) | [ROADMAP.md](ROADMAP.md) | [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)*
