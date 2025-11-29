# Lutem Architecture

**Technical deep-dive into Lutem's system design and implementation.**

---

## System Overview

Lutem is a Spring Boot backend with a vanilla HTML/CSS/JS frontend. The architecture prioritizes simplicity while maintaining clean separation of concerns.

```
┌─────────────────┐     HTTP/JSON     ┌─────────────────┐
│    Frontend     │ ◄──────────────► │     Backend     │
│  (index.html)   │    REST API       │  (Spring Boot)  │
└─────────────────┘                   └─────────────────┘
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
│   │   │   └── GameDataLoader.java       # Seeds 57 games on startup
│   │   ├── controller/
│   │   │   ├── GameController.java       # Recommendations API
│   │   │   ├── GameAdminController.java  # CRUD operations
│   │   │   └── CalendarController.java   # Calendar events
│   │   ├── model/
│   │   │   ├── Game.java                 # Game entity
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
│   │   │   └── GameRepository.java       # JPA data access
│   │   └── service/
│   │       └── GameSessionService.java   # Business logic
│   ├── pom.xml
│   └── mvnw / mvnw.cmd          # Maven wrapper
├── frontend/
│   ├── index.html               # Main HTML structure (~1,157 lines)
│   ├── css/                     # Modular stylesheets
│   │   ├── variables.css        # CSS custom properties
│   │   ├── themes.css           # Theme definitions
│   │   ├── base.css             # Reset & typography
│   │   ├── components.css       # UI components
│   │   ├── layout.css           # Layout utilities
│   │   └── pages/calendar.css   # Calendar-specific styles
│   ├── js/                      # JavaScript modules
│   │   ├── main.js              # Entry point
│   │   ├── config.js            # Environment detection
│   │   ├── api.js               # Backend communication
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

## Backend Architecture

### Technology Stack

- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17+
- **Database:** SQLite with JPA/Hibernate
- **Build:** Maven 3.9+ (wrapper included)
- **API Style:** RESTful JSON

### Package Organization

| Package | Purpose |
|---------|---------|
| `config` | Application configuration, data seeding |
| `controller` | REST endpoints, request handling |
| `model` | Entities, enums, domain objects |
| `dto` | Request/response data transfer objects |
| `repository` | JPA data access interfaces |
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

### Database Schema

```sql
-- Games table (seeded from GameDataLoader)
CREATE TABLE games (
    id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    min_minutes INT,
    max_minutes INT,
    genre VARCHAR(100),
    description TEXT,
    image_url VARCHAR(500),
    store_url VARCHAR(500),
    average_satisfaction DOUBLE,
    session_count INT
);

-- Many-to-many relationships via join tables
-- games_emotional_goals, games_time_of_day, etc.
```

---

## API Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/games` | GET | List all 57 games |
| `/recommendations` | POST | Get personalized recommendations |
| `/sessions/feedback` | POST | Submit satisfaction rating |
| `/admin/games` | POST/PUT/DELETE | CRUD operations |
| `/calendar/events` | GET/POST/PUT/DELETE | Calendar management |

👉 **See [API.md](API.md) for complete endpoint documentation**

---

## Build & Deploy

### Local Development

```bash
# Backend (use startup scripts)
start-backend.bat   # Windows
./mvnw spring-boot:run  # Direct Maven

# Frontend
start-frontend.bat  # Opens in browser
# Or: Open frontend/index.html directly
```

### Production Considerations

- Replace SQLite with PostgreSQL
- Add authentication (Clerk/Firebase)
- Enable API rate limiting
- Configure CORS for production domain
- Set up CI/CD pipeline

---

*See also: [API.md](API.md) | [PSYCHOLOGY.md](PSYCHOLOGY.md) | [CONTRIBUTING.md](CONTRIBUTING.md)*
