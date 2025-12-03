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
- Frontend: python -m http.server 5500
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
| **Games** (57+) | PostgreSQL | Relational, backend-managed, static |
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
│   │   │   └── FirebaseAuthFilter.java
│   │   └── service/
│   │       └── [business logic]
│   └── pom.xml
├── frontend/
│   ├── index.html
│   ├── css/
│   │   ├── variables.css
│   │   ├── themes.css
│   │   └── [component styles]
│   └── js/
│       ├── main.js
│       ├── config.js
│       ├── api.js
│       ├── auth.js
│       ├── firestore.js           # NEW: User data operations
│       ├── wizard.js
│       ├── calendar.js
│       ├── profile.js
│       └── [other modules]
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

```
1. User clicks "Sign in with Google"
         │
         ▼
2. Frontend → Firebase Client SDK → Google OAuth
         │
         ▼
3. Firebase returns ID token
         │
         ▼
4. Frontend stores auth state
         │
    ┌────┴────┐
    │         │
    ▼         ▼
5a. Firestore     5b. Backend API
    (user data)       (protected endpoints)
    Direct access     Authorization header
```

### Endpoint Authentication

| Endpoint | Auth | Data Source |
|----------|------|-------------|
| `GET /games` | ❌ | PostgreSQL |
| `POST /recommendations` | ❌ | PostgreSQL + request body |
| `GET /calendar/events` | ✅ | PostgreSQL |
| `POST /calendar/events` | ✅ | PostgreSQL |
| User preferences | N/A | Firestore (frontend direct) |
| Session history | N/A | Firestore (frontend direct) |

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

## Frontend Module System

### Load Order (Critical)

```html
<script src="js/config.js"></script>      <!-- 1st: Environment -->
<script src="js/state.js"></script>       <!-- 2nd: State -->
<script src="js/api.js"></script>         <!-- 3rd: API client -->
<script src="js/auth.js"></script>        <!-- 4th: Firebase Auth -->
<script src="js/firestore.js"></script>   <!-- 5th: Firestore (NEW) -->
<!-- ... other modules ... -->
<script src="js/main.js"></script>        <!-- Last: Init -->
```

### Theme System

4 palettes × 2 modes = 8 combinations
- Warm Café
- Soft Lavender
- Natural Earth
- Ocean Breeze

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

## Migration Path

### Current → Target

1. ✅ SQLite working (legacy)
2. ✅ Migrated to PostgreSQL (Railway) + H2 (local dev)
3. ⬜ Add Firestore for user data (2-3 hours)
4. ⬜ Update frontend for Firestore (2-3 hours)
5. ⬜ Connect preferences to recommendations (2 hours)

See:
- `docs/POSTGRESQL_MIGRATION_PLAN.md` (completed)
- `docs/USER_PROFILE_IMPLEMENTATION_PLAN.md`

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
- Game catalog (57 games, static)
- Recommendation algorithm (in-memory, fast)
- Frontend (Netlify CDN handles it)

---

*See also: [API.md](API.md) | [ROADMAP.md](ROADMAP.md) | [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)*
