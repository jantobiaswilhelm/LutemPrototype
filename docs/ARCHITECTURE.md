# Lutem Architecture

**Technical deep-dive into Lutem's system design and implementation.**

---

## System Overview

Lutem is a Spring Boot backend with a vanilla HTML/CSS/JS frontend, using Firebase for authentication. The architecture prioritizes simplicity while maintaining clean separation of concerns.

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
│              (Google Sign-in, Email/Password)                │
└─────────────────────────────────────────────────────────────┘
                                                     │
                                                     ▼
                                             ┌─────────────────┐
                                             │    SQLite DB    │
                                             │   (lutem.db)    │
                                             └─────────────────┘
```

---

## Project Structure

```
lutem-mvp/
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/lutem/mvp/
│   │   ├── LutemMvpApplication.java      # Main entry point
│   │   ├── config/
│   │   │   ├── FirebaseConfig.java       # Firebase Admin SDK setup
│   │   │   ├── GameDataLoader.java       # Seeds 57 games on startup
│   │   │   └── WebConfig.java            # CORS configuration
│   │   ├── controller/
│   │   │   ├── AuthController.java       # User authentication endpoints
│   │   │   ├── CalendarController.java   # Calendar events
│   │   │   ├── GameController.java       # Recommendations API
│   │   │   └── GameAdminController.java  # CRUD operations
│   │   ├── model/
│   │   │   ├── Game.java                 # Game entity
│   │   │   ├── User.java                 # User entity
│   │   │   ├── CalendarEvent.java        # Calendar event entity
│   │   │   ├── EmotionalGoal.java        # 6 mood types
│   │   │   ├── Interruptibility.java     # Pause flexibility
│   │   │   ├── EnergyLevel.java          # Mental energy
│   │   │   ├── TimeOfDay.java            # Optimal timing
│   │   │   └── SocialPreference.java     # Solo/co-op
│   │   ├── dto/
│   │   │   ├── RecommendationRequest.java
│   │   │   ├── RecommendationResponse.java
│   │   │   └── SessionFeedback.java
│   │   ├── repository/
│   │   │   ├── GameRepository.java       # JPA data access
│   │   │   ├── UserRepository.java
│   │   │   └── GameSessionRepository.java
│   │   ├── security/
│   │   │   └── FirebaseAuthFilter.java   # Token validation filter
│   │   └── service/
│   │       ├── GameSessionService.java   # Business logic
│   │       └── UserService.java          # User management
│   ├── pom.xml
│   └── mvnw / mvnw.cmd          # Maven wrapper
├── frontend/
│   ├── index.html               # Main HTML structure
│   ├── css/                     # Modular stylesheets
│   │   ├── variables.css        # CSS custom properties
│   │   ├── themes.css           # Theme definitions
│   │   ├── base.css             # Reset & typography
│   │   ├── components.css       # UI components
│   │   ├── layout.css           # Layout utilities
│   │   └── pages/calendar.css   # Calendar-specific styles
│   ├── js/                      # JavaScript modules
│   │   ├── main.js              # Entry point
│   │   ├── config.js            # Environment detection & API URL
│   │   ├── api.js               # Backend communication
│   │   ├── auth.js              # Firebase authentication
│   │   ├── state.js             # Global state management
│   │   ├── constants.js         # Configuration values
│   │   ├── utils.js             # Helper functions
│   │   ├── theme.js             # Theme/palette switching
│   │   ├── wizard.js            # Quick start wizard
│   │   ├── form.js              # Form interactions
│   │   ├── validation.js        # Input validation
│   │   ├── recommendation.js    # Game recommendation display
│   │   ├── tabs.js              # Tab navigation
│   │   ├── games-library.js     # Games page functionality
│   │   ├── profile.js           # Profile page functionality
│   │   └── calendar.js          # Calendar functionality
│   ├── demo-mode.js             # GitHub Pages demo support
│   └── lutem-logo.png           # Branding
├── docs/                        # Documentation
├── start-backend.bat            # Primary startup method
├── start-frontend.bat
└── start-lutem.bat              # Start everything
```

---

## Authentication Architecture

### Overview

Lutem uses Firebase Authentication with a client-server validation flow:

```
┌──────────────────────────────────────────────────────────────────┐
│                        Authentication Flow                        │
└──────────────────────────────────────────────────────────────────┘

1. User clicks "Sign in with Google"
         │
         ▼
2. Frontend (auth.js) → Firebase Client SDK → Google OAuth popup
         │
         ▼
3. Firebase returns ID token to frontend
         │
         ▼
4. Frontend stores token, calls backend with Authorization header
         │
         ▼
5. Backend (FirebaseAuthFilter) validates token with Firebase Admin SDK
         │
         ▼
6. If valid: request proceeds with user info attached
   If invalid: 401 Unauthorized response
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `auth.js` | Frontend | Firebase Client SDK, sign-in UI, token management |
| `FirebaseConfig.java` | Backend | Initialize Firebase Admin SDK |
| `FirebaseAuthFilter.java` | Backend | Validate tokens on protected endpoints |
| `AuthController.java` | Backend | User sync and profile endpoints |

### Credential Management

**Production (Railway):**
```java
// FirebaseConfig.java reads from environment variable
String envCredentials = System.getenv("FIREBASE_CREDENTIALS");
// Contains full JSON of service account file
```

**Development (Local):**
```java
// Falls back to file
Resource resource = new FileSystemResource("firebase-service-account.json");
```

### Protected vs Public Endpoints

| Endpoint Pattern | Auth Required | Description |
|------------------|---------------|-------------|
| `/auth/**` | ✅ Yes | User profile, sync |
| `/games` | ❌ No | Public game list |
| `/recommendations` | ❌ No | Anonymous recommendations |
| `/calendar/**` | ✅ Yes | User's calendar events |

---

## Backend Architecture

### Technology Stack

- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17+
- **Database:** SQLite with JPA/Hibernate
- **Auth:** Firebase Admin SDK
- **Build:** Maven 3.9+ (wrapper included)
- **API Style:** RESTful JSON

### Package Organization

| Package | Purpose |
|---------|---------|
| `config` | Application configuration, Firebase setup, CORS, data seeding |
| `controller` | REST endpoints, request handling |
| `model` | Entities, enums, domain objects |
| `dto` | Request/response data transfer objects |
| `repository` | JPA data access interfaces |
| `security` | Authentication filters |
| `service` | Business logic, scoring algorithm |

### Enum System (5 Enums)

```java
EmotionalGoal: UNWIND, RECHARGE, ENGAGE, CHALLENGE, ACHIEVE, EXPLORE
Interruptibility: HIGH, MEDIUM, LOW
EnergyLevel: LOW, MEDIUM, HIGH
TimeOfDay: MORNING, MIDDAY, EVENING, LATE_NIGHT
SocialPreference: SOLO, COOPERATIVE, COMPETITIVE
```

---

## Recommendation Algorithm

### 8-Tier Scoring System (115 points max)

The recommendation engine scores each game against user preferences across 8 dimensions:

| Dimension | Weight | Max Points | Description |
|-----------|--------|------------|-------------|
| Time Match | 30% | 30 | Game fits available time window |
| Emotional Goals | 25% | 25 | Mood alignment (multi-select) |
| Interruptibility | 20% | 20 | Pause flexibility match |
| Energy Level | 15% | 15 | Mental energy compatibility |
| Time of Day | 5% | 5 | Optimal playing time bonus |
| Social Preference | 5% | 5 | Solo/multiplayer fit |
| Satisfaction Bonus | - | +10% | Previous user ratings boost |
| Genre Preference | - | +15% | Soft ranking for preferred genres |

### Scoring Formula

```java
double score = 0;
score += timeMatch(game, request) * 0.30;      // 0-30 points
score += emotionalMatch(game, request) * 0.25; // 0-25 points
score += interruptMatch(game, request) * 0.20; // 0-20 points
score += energyMatch(game, request) * 0.15;    // 0-15 points
score += timeOfDayMatch(game, request) * 0.05; // 0-5 points
score += socialMatch(game, request) * 0.05;    // 0-5 points

// Bonus multipliers (applied after base score)
score *= (1 + satisfactionBonus(game) * 0.10); // Up to +10%
score *= (1 + genreBonus(game, request) * 0.15); // Up to +15%
```

### Soft Ranking vs Hard Filtering

Genre preferences use **soft ranking** - they boost scores without eliminating games:

```java
// NOT THIS (hard filter - bad):
if (!game.genres.containsAny(preferredGenres)) return null;

// THIS (soft ranking - good):
double genreBoost = (matchedGenres / totalPreferred) * 0.15;
score *= (1 + genreBoost);
```

**Why soft ranking?**
- Preserves cross-genre discovery
- Prevents filter bubbles
- Maintains recommendation quality
- Surfaces unexpected gems

---

## Frontend Architecture

### Technology
- **No framework** - Vanilla HTML/CSS/JavaScript
- **Styling:** CSS custom properties for theming
- **State:** Simple JavaScript object
- **API:** Fetch with async/await
- **Auth:** Firebase Client SDK (v10.12.0)

### Module Loading Order

Critical: `config.js` must load before other modules that use API URLs.

```html
<!-- Load order in index.html -->
<script src="js/config.js"></script>    <!-- First: environment detection -->
<script src="js/state.js"></script>
<script src="js/api.js"></script>       <!-- Uses Config.API_URL -->
<script src="js/auth.js"></script>      <!-- Uses Config.API_URL -->
<!-- ... other modules ... -->
<script src="js/main.js"></script>      <!-- Last: initialization -->
```

### State Management

```javascript
const state = {
    selectedGoals: [],
    availableMinutes: 30,
    energyLevel: null,
    interruptibility: null,
    timeOfDay: null,
    socialPreference: null,
    selectedGenres: []
};

// Auth state (managed by auth.js)
window.authState = {
    user: null,
    isAuthenticated: false,
    isLoading: true
};
```

### Theme System

8 combinations: 4 palettes × 2 modes (light/dark)

```css
:root[data-palette="cafe"][data-theme="light"] {
    --bg-primary: #F5F0E8;
    --accent-primary: #8B6914;
}
:root[data-palette="cafe"][data-theme="dark"] {
    --bg-primary: #1A1512;
    --accent-primary: #C4A35A;
}
```

Palettes: Warm Café, Soft Lavender, Natural Earth, Ocean Breeze

---

## Data Flow

### Recommendation Request

```
1. User fills form → Frontend validates
2. Frontend sends POST /recommendations
3. Backend scores all 57 games
4. Backend sorts by score descending
5. Backend returns top 10 with reasons
6. Frontend displays top 1 + 3 alternatives
7. User clicks "See More" for remaining 6
8. User submits feedback → Updates satisfaction
```

### Authentication Flow

```
1. User clicks Sign In → auth.js opens modal
2. Google popup → Firebase validates OAuth
3. Firebase returns user + ID token
4. Frontend stores auth state
5. API calls include Authorization: Bearer <token>
6. Backend validates token via Firebase Admin SDK
7. Protected resources accessible
```

---

## API Overview

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/games` | GET | ❌ | List all 57 games |
| `/recommendations` | POST | ❌ | Get personalized recommendations |
| `/sessions/feedback` | POST | ❌ | Submit satisfaction rating |
| `/admin/games` | POST/PUT/DELETE | ❌ | CRUD operations |
| `/auth/me` | GET | ✅ | Get/sync current user |
| `/calendar/events` | GET/POST/PUT/DELETE | ✅ | Calendar management |

👉 **See [API.md](API.md) for complete endpoint documentation**

---

## Build & Deploy

### Local Development

```bash
# Backend (use startup scripts)
start-backend.bat   # Windows
./mvnw spring-boot:run  # Direct Maven

# Frontend
start-frontend.bat  # Starts Python HTTP server
# Access at http://localhost:5500
```

### Production Stack

| Service | Platform | Purpose |
|---------|----------|---------|
| Frontend | Netlify | Static file hosting |
| Backend | Railway | Spring Boot API |
| Auth | Firebase | User authentication |
| Database | SQLite (embedded) | Data storage |

### Environment Variables (Railway)

| Variable | Purpose |
|----------|---------|
| `FIREBASE_CREDENTIALS` | Service account JSON for token validation |

👉 **See [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md) for detailed deployment guide**

---

*See also: [API.md](API.md) | [PSYCHOLOGY.md](PSYCHOLOGY.md) | [DEPLOYMENT_PLAN.md](DEPLOYMENT_PLAN.md)*
