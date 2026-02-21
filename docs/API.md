# Lutem API Documentation

**Complete REST API reference for the Lutem backend.**

Base URL: `http://localhost:8080`

---

## Endpoints Overview

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/games` | GET | No | List all games with metadata |
| `/games/paged` | GET | No | Paginated game list |
| `/recommendations` | POST | No | Get personalized game recommendations |
| `/sessions/feedback` | POST | No | Submit satisfaction rating |
| `/auth/google` | POST | No | Google/Firebase login |
| `/auth/steam/login` | GET | No | Steam OpenID login redirect |
| `/auth/me` | GET | Yes | Current user info |
| `/auth/logout` | POST | Yes | Logout |
| `/api/steam/import` | POST | Yes | Import Steam library |
| `/api/steam/library` | GET | Yes | Get user's Steam library |
| `/api/sessions/history` | GET | Yes | Session history |
| `/api/calendar/events` | GET | Yes | List calendar events |
| `/api/calendar/events` | POST | Yes | Create calendar event |
| `/api/friends/list` | GET | Yes | Friends list |
| `/api/friends/request/{id}` | POST | Yes | Send friend request |
| `/admin/games` | POST | Admin | Create new game |
| `/admin/games/bulk` | POST | Admin | Bulk import games |
| `/admin/tag` | POST | Admin | AI tag games via Claude |
| `/admin/games/{id}` | DELETE | Admin | Delete game |

---

## Game Endpoints

### GET /games

Returns all games with full metadata including Steam image URLs.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Unpacking",
    "minMinutes": 10,
    "maxMinutes": 20,
    "emotionalGoals": ["UNWIND", "ACHIEVE", "EXPLORE"],
    "interruptibility": "HIGH",
    "energyRequired": "LOW",
    "bestTimeOfDay": ["MIDDAY", "EVENING", "LATE_NIGHT"],
    "socialPreferences": ["SOLO"],
    "genre": "Puzzle",
    "description": "Zen unpacking simulator with cozy vibes",
    "imageUrl": "https://cdn.cloudflare.steamstatic.com/steam/apps/1135690/header.jpg",
    "storeUrl": "https://store.steampowered.com/app/1135690/Unpacking/",
    "averageSatisfaction": 4.2,
    "sessionCount": 5
  }
]
```

---

## Recommendation Endpoints

### POST /recommendations

Get personalized game recommendations based on user preferences.

**Request Body:**

```json
{
  "availableMinutes": 30,
  "desiredEmotionalGoals": ["UNWIND", "ACHIEVE"],
  "requiredInterruptibility": "HIGH",
  "currentEnergyLevel": "LOW",
  "timeOfDay": "EVENING",
  "socialPreference": "SOLO",
  "preferredGenres": ["Puzzle", "Strategy"]
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `availableMinutes` | int | Yes | Time available (5-180+) |
| `desiredEmotionalGoals` | string[] | Yes | Array of: UNWIND, RECHARGE, ENGAGE, CHALLENGE, ACHIEVE, EXPLORE |
| `requiredInterruptibility` | string | No | HIGH, MEDIUM, or LOW |
| `currentEnergyLevel` | string | No | LOW, MEDIUM, or HIGH |
| `timeOfDay` | string | No | MORNING, MIDDAY, EVENING, LATE_NIGHT |
| `socialPreference` | string | No | SOLO, COOPERATIVE, COMPETITIVE |
| `preferredGenres` | string[] | No | Soft ranking boost (doesn't filter) |

**Response:** `200 OK`

```json
{
  "topRecommendation": {
    "id": 1,
    "name": "Unpacking",
    "minMinutes": 10,
    "maxMinutes": 20,
    "emotionalGoals": ["UNWIND", "ACHIEVE", "EXPLORE"],
    "interruptibility": "HIGH",
    "energyRequired": "LOW",
    "genre": "Puzzle",
    "imageUrl": "https://cdn.cloudflare.steamstatic.com/...",
    "storeUrl": "https://store.steampowered.com/app/1135690/...",
    "averageSatisfaction": 4.2
  },
  "alternatives": [
    { /* Game object */ },
    { /* Game object */ },
    { /* Game object */ }
  ],
  "topReason": "Perfect for: fits your 30 min, unwind, achieve, low energy, highly rated by you",
  "alternativeReasons": [
    "Relaxing farming, achievable goals",
    "Meditative cleaning, easy to pause",
    "Peaceful puzzle, evening-friendly"
  ],
  "totalAlternatives": 9
}
```

---

## Feedback Endpoints

### POST /sessions/feedback

Submit satisfaction rating for a game (1-5 scale). Updates the game's average satisfaction and influences future recommendations.

**Request Body:**

```json
{
  "gameId": 1,
  "satisfactionScore": 5
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gameId` | long | Yes | ID of the game played |
| `satisfactionScore` | int | Yes | Rating 1-5 (😞 to 🤩) |

**Response:** `200 OK`

```json
{
  "status": "success",
  "message": "Feedback recorded",
  "newAverageSatisfaction": 4.3,
  "totalSessions": 6
}
```

---

## Admin Endpoints

### POST /admin/games

Create a new game.

**Request Body:**

```json
{
  "name": "New Game",
  "minMinutes": 15,
  "maxMinutes": 45,
  "emotionalGoals": ["ENGAGE", "CHALLENGE"],
  "interruptibility": "MEDIUM",
  "energyRequired": "MEDIUM",
  "bestTimeOfDay": ["EVENING"],
  "socialPreferences": ["SOLO"],
  "genre": "Action",
  "description": "Fast-paced action game",
  "imageUrl": "https://example.com/image.jpg",
  "storeUrl": "https://store.steampowered.com/app/..."
}
```

### PUT /admin/games/{id}

Update an existing game.

### DELETE /admin/games/{id}

Delete a game by ID.

---

## Calendar Endpoints

### GET /calendar/events

Returns all calendar events.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `start` | ISO date | Filter events after this date |
| `end` | ISO date | Filter events before this date |

### POST /calendar/events

Create a calendar event.

```json
{
  "title": "Gaming Session: Stardew Valley",
  "start": "2025-11-27T18:00:00",
  "end": "2025-11-27T19:00:00",
  "eventType": "GAME",
  "gameId": 5,
  "notes": "Relaxing evening session"
}
```

---

## Enum Values Reference

### EmotionalGoal
```
UNWIND     - Relaxation, stress relief
RECHARGE   - Energy restoration
ENGAGE     - Mental stimulation
CHALLENGE  - Difficulty seeking
ACHIEVE    - Accomplishment focus
EXPLORE    - Discovery and wandering
```

### Interruptibility
```
HIGH   - Can pause anytime, no progress loss
MEDIUM - Some flexibility, occasional save points
LOW    - Difficult to pause, online/competitive
```

### EnergyLevel
```
LOW    - Tired, want something relaxing
MEDIUM - Balanced, open to variety
HIGH   - Energized, ready for challenge
```

### TimeOfDay
```
MORNING    - Early day sessions
MIDDAY     - Afternoon play
EVENING    - Post-work relaxation
LATE_NIGHT - Before bed gaming
```

### SocialPreference
```
SOLO        - Single player
COOPERATIVE - Co-op, team-based
COMPETITIVE - PvP, ranked play
```

---

## Game Library

100+ games across all categories (casual, mid-range, long-form) with rich emotional metadata, Steam integration, and AI-powered tagging via Claude API. The catalog continues to grow via admin bulk import and AI tagging tools.

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "message": "availableMinutes must be greater than 0"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Game with ID 999 not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal error",
  "message": "An unexpected error occurred"
}
```

---

*See also: [ARCHITECTURE.md](ARCHITECTURE.md) | [CONTRIBUTING.md](CONTRIBUTING.md)*
