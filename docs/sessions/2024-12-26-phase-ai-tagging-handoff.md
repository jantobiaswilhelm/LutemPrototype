# Phase AI-Tagging: Steam Import + AI Game Enrichment

## Session Handoff Document
**Date:** 2024-12-26
**Status:** Code complete, awaiting API key
**Priority:** HIGH - Core differentiator feature
**Last Updated:** 2024-12-26 (added 3 new attributes)

---

## ⚡ Quick Status

**IMPLEMENTED:**
- ✅ 3 new enums: `AudioDependency`, `ContentRating`, `NsfwLevel`
- ✅ `Game` entity updated with new fields
- ✅ `AITaggingService` prompt updated with examples + new attributes
- ✅ Parsing and applying logic for all 10 attributes

**AWAITING:**
- 🔑 Anthropic API key (console.anthropic.com, $5 minimum)
- Set `ANTHROPIC_API_KEY` environment variable

---

## New Attributes Added (2024-12-26)

### 1. AudioDependency
```java
REQUIRED("Audio Required", "Need sound (horror, rhythm, story)", "🔊"),
HELPFUL("Audio Helpful", "Better with sound but playable muted", "🔉"),
OPTIONAL("Audio Optional", "Fine muted, podcast-friendly", "🔇");
```

### 2. ContentRating (Age-based)
```java
EVERYONE("Everyone", "Suitable for all ages", "👶"),
TEEN("Teen 13+", "Mild violence, some language", "🧒"),
MATURE("Mature 17+", "Violence, blood, strong language", "🔞"),
ADULT("Adults Only 18+", "Intense violence, graphic content", "⛔");
```

### 3. NsfwLevel (Sexual content - separate axis)
```java
NONE("None", "No sexual content", "✅"),
SUGGESTIVE("Suggestive", "Fanservice, revealing outfits, innuendo", "😏"),
EXPLICIT("Explicit", "Sexual content, nudity, adult scenes", "🌶️");
```

### Why Separate?
| Game | ContentRating | NsfwLevel |
|------|---------------|-----------|
| Stardew Valley | EVERYONE | NONE |
| Call of Duty | MATURE | NONE |
| Cyberpunk 2077 | MATURE | SUGGESTIVE |
| Subverse | ADULT | EXPLICIT |

This allows filtering like "mature violence OK but no sexual content."

---

## Full Attribute List (10 Total)

| # | Attribute | Type | Purpose |
|---|-----------|------|---------|
| 1 | emotionalGoals | List<Enum> | What mood? (1-3 picks) |
| 2 | interruptibility | Enum | Can I stop suddenly? |
| 3 | energyRequired | Enum | How tired am I? |
| 4 | bestTimeOfDay | List<Enum> | When to play? (1-3 picks) |
| 5 | socialPreferences | List<Enum> | Solo or with people? |
| 6 | minMinutes | int | Minimum meaningful session |
| 7 | maxMinutes | int | Before fatigue sets in |
| 8 | audioDependency | Enum | Can I play muted? |
| 9 | contentRating | Enum | Age appropriateness |
| 10 | nsfwLevel | Enum | Sexual content level |

---

## Context

We're ditching the static `games-seed.json` approach (57 manually curated games) in favor of a dynamic, AI-powered system where:

1. Users import their Steam library
2. Games are checked against a global database
3. Unknown games get AI-tagged with Lutem attributes
4. The database grows organically as users import libraries

This transforms Lutem from "57 curated games" to "infinite games, intelligently tagged."

---

## Current State

### What Exists
- `Game` entity with all Lutem attributes (emotionalGoals, interruptibility, energyRequired, etc.)
- `TaggingSource` enum: `MANUAL`, `AI_GENERATED`, `USER_ADJUSTED`, `PENDING`
- `SteamService` that fetches user's Steam library via API
- `UserLibrary` table linking users to games
- Steam API integration working (API key configured)
- Firebase auth working

### What's Being Removed
- `games-seed.json` - delete it
- `GameDataLoader.java` - delete it  
- `SteamIdMigration.java` - delete it (no longer needed)

### Files to Delete
```
D:\Lutem\LutemPrototype\backend\src\main\resources\games-seed.json
D:\Lutem\LutemPrototype\backend\src\main\java\com\lutem\mvp\config\GameDataLoader.java
D:\Lutem\LutemPrototype\backend\src\main\java\com\lutem\mvp\config\SteamIdMigration.java
```

---

## New Architecture

### Database Schema (No Changes Needed)
The `games` table already supports this:
```sql
games (
  id BIGINT PRIMARY KEY,
  name VARCHAR,
  steam_app_id BIGINT UNIQUE,      -- Key for matching
  tagging_source VARCHAR,           -- MANUAL, AI_GENERATED, USER_ADJUSTED, PENDING
  tagging_confidence DOUBLE,        -- AI confidence score (0.0-1.0)
  
  -- Lutem attributes (AI will populate these)
  emotional_goals VARCHAR[],        -- UNWIND, CHALLENGE, SOCIALIZE, etc.
  interruptibility VARCHAR,         -- HIGH, MEDIUM, LOW
  energy_required VARCHAR,          -- LOW, MEDIUM, HIGH
  best_time_of_day VARCHAR[],       -- MORNING, AFTERNOON, EVENING, NIGHT, ANY
  social_preferences VARCHAR[],     -- SOLO, COOP, COMPETITIVE, MMO
  genres VARCHAR[],
  min_minutes INT,
  max_minutes INT,
  description TEXT,
  
  -- Steam data (enrichment)
  image_url VARCHAR,
  store_url VARCHAR,
  user_rating DOUBLE,               -- Steam review %
  steam_playtime_forever INT,
  
  -- Metadata
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Import Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    STEAM IMPORT FLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /api/steam/import                                         │
│  Body: { steamId: "76561198..." }                               │
│           │                                                     │
│           ▼                                                     │
│  1. Fetch games from Steam API                                  │
│     - appId, name, playtime_forever, playtime_2weeks            │
│           │                                                     │
│           ▼                                                     │
│  2. Check each against `games` table by steam_app_id            │
│           │                                                     │
│     ┌─────┴─────┐                                               │
│     ▼           ▼                                               │
│  FOUND       NOT FOUND                                          │
│  (tagged)    (unknown)                                          │
│     │           │                                               │
│     │           ▼                                               │
│     │        3. Create placeholder in `games` table             │
│     │           tagging_source = PENDING                        │
│     │           (name, steam_app_id, image_url only)            │
│     │           │                                               │
│     ▼           ▼                                               │
│  4. Link ALL games to user via `user_library` table             │
│           │                                                     │
│           ▼                                                     │
│  5. Return response:                                            │
│     {                                                           │
│       "matched": [...],      // Games with Lutem attributes     │
│       "pending": [...],      // Games needing AI tagging        │
│       "stats": {                                                │
│         "total": 168,                                           │
│         "alreadyTagged": 12,                                    │
│         "needsTagging": 156                                     │
│       }                                                         │
│     }                                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### AI Tagging Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI TAGGING FLOW                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /api/games/tag-pending                                    │
│  Body: { gameIds: [1, 2, 3, ...] } or { all: true }             │
│           │                                                     │
│           ▼                                                     │
│  1. For each PENDING game:                                      │
│           │                                                     │
│           ▼                                                     │
│  2. Fetch Steam store data (optional enrichment):               │
│     GET store.steampowered.com/api/appdetails?appids={id}       │
│     - short_description                                         │
│     - genres                                                    │
│     - categories (multiplayer, co-op, etc.)                     │
│     - metacritic score                                          │
│     - user reviews %                                            │
│           │                                                     │
│           ▼                                                     │
│  3. Call AI (Claude API or local LLM):                          │
│     Prompt: "Given this game info, determine Lutem attributes"  │
│     Input: name, description, genres, tags                      │
│     Output: JSON with emotionalGoals, interruptibility, etc.    │
│           │                                                     │
│           ▼                                                     │
│  4. Update game in database:                                    │
│     - Set all Lutem attributes                                  │
│     - tagging_source = AI_GENERATED                             │
│     - tagging_confidence = AI's confidence score                │
│           │                                                     │
│           ▼                                                     │
│  5. Return progress/results to frontend                         │
│     (could be streaming for large batches)                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints to Create/Modify

### Existing (Modify)
```
POST /api/steam/import
- Remove: Creating games in PENDING state (already done)
- Keep: Matching logic, user_library creation
- Change: Response format to clearly separate tagged vs pending
```

### New Endpoints
```
POST /api/games/tag-pending
- Triggers AI tagging for pending games
- Can accept specific gameIds or tag all pending
- Returns progress/results

GET /api/games/pending
- List all PENDING games (admin/debug)
- Optional: filter by user's library

GET /api/games/stats
- Count by tagging_source
- Total games in database
```

---

## AI Tagging Service Design

### Option A: Claude API (Recommended for MVP)
```java
@Service
public class AITaggingService {
    
    @Value("${anthropic.api.key}")
    private String anthropicApiKey;
    
    public GameAttributes tagGame(String name, String description, 
                                   List<String> steamGenres, 
                                   List<String> steamTags) {
        // Build prompt
        // Call Claude API
        // Parse JSON response
        // Return GameAttributes DTO
    }
}
```

### Option B: Local LLM (Future)
- Ollama with llama3 or mistral
- Lower cost, more control
- Slightly lower quality

### AI Prompt Template
```
You are a gaming recommendation expert for Lutem, an app that matches games 
to players' moods and available time.

Given this game information:
- Name: {name}
- Description: {description}
- Steam Genres: {genres}
- Steam Tags: {tags}

Determine the following Lutem attributes:

1. emotionalGoals (pick 1-3): UNWIND, CHALLENGE, SOCIALIZE, ADVENTURE_TIME, 
   PROGRESS_ORIENTED, CREATIVE_EXPRESSION, COMPETITIVE_THRILL, STORY_IMMERSION

2. interruptibility: HIGH (can stop anytime), MEDIUM (need save points), 
   LOW (long sessions required)

3. energyRequired: LOW (relaxing), MEDIUM (moderate focus), HIGH (intense)

4. bestTimeOfDay (pick 1-3): MORNING, AFTERNOON, EVENING, NIGHT, ANY

5. socialPreferences (pick 1-2): SOLO, COOP, COMPETITIVE, MMO

6. minMinutes: Typical minimum session length
7. maxMinutes: Typical maximum session length

Respond ONLY with valid JSON:
{
  "emotionalGoals": [...],
  "interruptibility": "...",
  "energyRequired": "...",
  "bestTimeOfDay": [...],
  "socialPreferences": [...],
  "minMinutes": ...,
  "maxMinutes": ...,
  "confidence": 0.0-1.0
}
```

---

## Steam Store API for Enrichment

### Endpoint
```
GET https://store.steampowered.com/api/appdetails?appids={appId}
```

### Useful Fields
```json
{
  "success": true,
  "data": {
    "name": "Stardew Valley",
    "short_description": "You've inherited your grandfather's old farm...",
    "detailed_description": "...",
    "genres": [
      {"id": "3", "description": "RPG"},
      {"id": "23", "description": "Indie"},
      {"id": "28", "description": "Simulation"}
    ],
    "categories": [
      {"id": 2, "description": "Single-player"},
      {"id": 1, "description": "Multi-player"},
      {"id": 9, "description": "Co-op"}
    ],
    "metacritic": {"score": 89},
    "recommendations": {"total": 500000},
    "header_image": "https://...",
    "price_overview": {...}
  }
}
```

### Rate Limiting
- Steam store API: ~200 requests/5 minutes
- Implement delay between requests (1-2 seconds)
- Cache responses

---

## Frontend Changes Needed

### Import Flow UI
```
1. User clicks "Import Steam Library"
2. Loading state while fetching
3. Results screen:
   ┌────────────────────────────────────────────┐
   │  Steam Import Complete!                    │
   │                                            │
   │  ✓ 12 games ready to use                   │
   │    (Already in Lutem database)             │
   │                                            │
   │  ⏳ 156 games need setup                   │
   │    (Will be analyzed by AI)                │
   │                                            │
   │  [Set up now]  [Skip for now]              │
   │                                            │
   │  ℹ️ Games without setup won't appear in    │
   │     recommendations until processed.       │
   └────────────────────────────────────────────┘

4. If "Set up now":
   - Show progress bar
   - "Analyzing Counter-Strike 2..." 
   - "Analyzing Stardew Valley..."
   - Estimated time remaining

5. Complete:
   - "All 168 games ready!"
   - Navigate to library view
```

---

## Implementation Order

### Phase 1: Clean Up (30 min)
1. Delete `games-seed.json`
2. Delete `GameDataLoader.java`
3. Delete `SteamIdMigration.java`
4. Delete H2 database to start fresh
5. Verify app starts with empty games table

### Phase 2: Steam Import Refactor (1 hour)
1. Modify `SteamService.doImportSteamLibrary()`
2. Separate response into `tagged` vs `pending` lists
3. Update `SteamImportResponse` DTO
4. Test with real Steam account

### Phase 3: Steam Store Enrichment (1 hour)
1. Create `SteamStoreService`
2. Implement `getAppDetails(Long appId)`
3. Handle rate limiting
4. Extract relevant fields

### Phase 4: AI Tagging Service (2 hours)
1. Add Anthropic SDK dependency
2. Create `AITaggingService`
3. Build prompt template
4. Implement `tagGame()` method
5. Create `POST /api/games/tag-pending` endpoint

### Phase 5: Frontend Integration (2 hours)
1. Update import flow UI
2. Add tagging progress screen
3. Show pending vs ready games in library

---

## Environment Variables Needed

```properties
# Existing
steam.api.key=YOUR_STEAM_API_KEY

# New
anthropic.api.key=YOUR_CLAUDE_API_KEY
anthropic.model=claude-3-haiku-20240307  # Fast & cheap for tagging
```

---

## Testing Checklist

- [ ] App starts with empty games table
- [ ] Steam import creates PENDING games
- [ ] Steam store enrichment fetches data
- [ ] AI tagging generates valid attributes
- [ ] Tagged games appear in recommendations
- [ ] User library correctly links to games
- [ ] Second user importing same game finds it (no duplicate)

---

## Questions for Next Session

1. **AI Model Choice**: Claude Haiku (fast/cheap) vs Sonnet (better quality)?
2. **Batch Size**: Tag all at once or limit per request?
3. **User Override**: Allow users to adjust AI tags? (USER_ADJUSTED)
4. **Caching**: Cache Steam store responses in DB or memory?
5. **Error Handling**: What if AI fails on a game? Retry? Skip?

---

## Project Location & Commands

```bash
# Project root
D:\Lutem\LutemPrototype

# Start backend (after deleting DB)
cd backend
del data\lutem-local.mv.db
del data\lutem-local.trace.db
set SPRING_PROFILES_ACTIVE=local
mvn spring-boot:run

# Start frontend
cd frontend-react
npm run dev
```

---

## Summary

**We're building:**
- Dynamic game database that grows with user imports
- AI-powered attribute tagging (no more manual curation)
- Steam integration for rich game metadata
- Scalable architecture for real users

**The flow:**
1. User imports Steam library
2. Known games → ready immediately
3. Unknown games → AI tags them
4. Database grows → next user benefits

This is the foundation for a real product, not a demo.
