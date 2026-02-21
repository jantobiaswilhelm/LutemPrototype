# Steam Library Integration Roadmap

## Overview
Enable users to import their Steam library into Lutem for personalized recommendations based on games they actually own.

## The Core Problem
Steam user has 200 games → Lutem DB has 57 curated games → What about the other 143?

---

## Phase S1: Database Preparation ✅ COMPLETED
**Goal:** Add Steam app ID support to existing games

**Tasks:**
- [x] Add `steamAppId` (Long) field to Game entity
- [x] Add `taggingSource` enum: `MANUAL`, `AI_GENERATED`, `USER_ADJUSTED`, `PENDING`
- [x] Create migration/update for existing schema (auto via JPA)
- [x] Auto-extract Steam IDs from existing game URLs via SteamIdMigration

**Files Created/Modified:**
- `model/TaggingSource.java` - New enum
- `model/Game.java` - Added steamAppId, taggingSource, taggingConfidence, rawgId fields
- `config/SteamIdMigration.java` - Auto-extracts Steam IDs from store/image URLs

**Effort:** ✅ Complete

---

## Phase S2: Steam API Integration ✅ COMPLETED
**Goal:** Fetch user's Steam library

**Tasks:**
- [x] Create SteamService with `GetOwnedGames` endpoint call
- [x] Store API key as environment variable (`STEAM_API_KEY`)
- [x] Create endpoint: `POST /api/steam/import`
- [x] Handle public/private profile errors gracefully

**API Endpoint:**
```
GET https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/
?key={API_KEY}
&steamid={STEAM_ID_64}
&include_appinfo=true
&include_played_free_games=true
```

**Returns:** `appid`, `name`, `playtime_forever`, `playtime_2weeks`, `img_icon_url`

**Files Created:**
- `service/SteamService.java` - Steam API integration
- `controller/SteamController.java` - REST endpoints
- `dto/SteamImportResponse.java` - Response DTOs

**Setup Required:**
1. Get Steam API key from https://steamcommunity.com/dev/apikey
2. Set environment variable: `STEAM_API_KEY=your_key_here`

**Effort:** ✅ Complete

---

## Phase S3: Library Matching ✅ COMPLETED
**Goal:** Match imported Steam games against Lutem database

**Tasks:**
- [x] Match by `steamAppId` field
- [x] Return response with `matched` and `unmatched` game lists
- [x] Create UserLibrary entity to store user's owned games
- [x] Link matched games to user profile

**Response Example:**
```json
{
  "matched": [
    { "steamAppId": 367520, "name": "Hollow Knight", "lutemGameId": 12, "playtimeForever": 4500 }
  ],
  "unmatched": [
    { "steamAppId": 1234567, "name": "Some Indie Game", "playtimeForever": 45 }
  ],
  "stats": {
    "total": 200,
    "matched": 12,
    "unmatched": 188,
    "alreadyInLibrary": 0
  },
  "message": "Found 12 of your 200 Steam games in Lutem's curated library!"
}
```

**Files Created:**
- `model/UserLibrary.java` - User-Game ownership entity
- `repository/UserLibraryRepository.java` - Library queries
- `repository/GameRepository.java` - Updated with Steam queries
- `service/UserLibraryService.java` - Library management
- `dto/UserLibraryGameDTO.java` - Library entry DTO

**Effort:** ✅ Complete

---

## API Endpoints Available

### Check Steam Integration Status
```
GET /api/steam/status
Response: { "configured": true/false, "message": "..." }
```

### Import Steam Library
```
POST /api/steam/import
Headers: X-Firebase-UID: <firebase_uid>
Body: { "steamId": "76561198012345678" }  // 17-digit Steam ID 64

Response: SteamImportResponse (see above)
```

### Get User Library
```
GET /api/steam/library
Headers: X-Firebase-UID: <firebase_uid>

Response: {
  "summary": {
    "totalGames": 15,
    "steamGames": 12,
    "taggedGames": 12,
    "untaggedGames": 3
  },
  "games": [UserLibraryGameDTO, ...]
}
```

---

## Phase S4: Untagged Game Storage (FUTURE)
**Goal:** Store unmatched games for future tagging

**Tasks:**
- [ ] Create games from unmatched Steam data with `taggingSource: PENDING`
- [ ] Store basic Steam info: `steamAppId`, `name`, `coverUrl`
- [ ] Flag as "untagged" — excluded from smart recommendations
- [ ] Show in user library with "needs tagging" indicator

**Effort:** Medium

---

## Phase S5: RAWG API Enrichment (FUTURE)
**Goal:** Auto-fetch rich metadata for untagged games

**Tasks:**
- [ ] Integrate RAWG API (or IGDB as fallback)
- [ ] Fetch: genres, tags, description, screenshots, metacritic score, avg playtime
- [ ] Store enriched data on Game entity
- [ ] Create background job to enrich games in batches

**RAWG Endpoint:**
```
GET https://api.rawg.io/api/games?search={game_name}&key={API_KEY}
```

**Effort:** Medium

---

## Phase S6: AI Tagging Pipeline (FUTURE)
**Goal:** Auto-generate Lutem emotional attributes using AI

**Pipeline:**
```
Steam game (name, appid)
    ↓
RAWG API → genres, tags, description, avg playtime
    ↓
GPT prompt → estimate Lutem attributes
    ↓
New Game entry with taggingSource: 'AI_GENERATED'
    ↓
User can confirm/adjust
```

**Tasks:**
- [ ] Create GPT prompt template for game analysis
- [ ] Map genres/tags to Lutem schema:
  - `emotionalGoals` → [UNWIND, RECHARGE, LOCKING_IN, ADVENTURE_TIME, CHALLENGE, SOCIAL]
  - `energyLevel` → LOW, MEDIUM, HIGH
  - `interruptibility` → LOW, MEDIUM, HIGH  
  - `sessionLength` → minMinutes, maxMinutes
  - `socialPreferences` → SOLO, COOP, COMPETITIVE, BOTH
- [ ] Store confidence scores per attribute
- [ ] Create batch processing job for multiple games
- [ ] Rate limit API calls appropriately

**Effort:** Medium

---

## Phase S7: User Override & Confirmation (FUTURE)
**Goal:** Let users adjust AI-generated tags

**Tasks:**
- [ ] UI for viewing/editing game attributes
- [ ] "Confirm" button to change `taggingSource` to `USER_ADJUSTED`
- [ ] Track user corrections for future AI training data
- [ ] Show tagging source badge: "Curated" / "AI Tagged" / "Your Tags"

**Effort:** Small

---

## Current MVP Scope ✅
**S1 → S3** implemented: "We found X of your Y Steam games" experience.

**What Users Can Do Now:**
1. Check if Steam integration is enabled (`GET /api/steam/status`)
2. Import their Steam library (`POST /api/steam/import`)
3. See matched games added to their Lutem library
4. View their library summary (`GET /api/steam/library`)

---

## Technical Requirements

**Environment Variables:**
- `STEAM_API_KEY` — from Steam developer portal ⚠️ REQUIRED
- `RAWG_API_KEY` — from RAWG.io (free tier: 20k requests/month) — FUTURE
- `OPENAI_API_KEY` — for AI tagging — FUTURE

**New Entities (Created):**
- `UserLibrary` — links User to owned Games
- `TaggingSource` — enum for tracking metadata origin

**New Fields on Game (Added):**
- `steamAppId: Long` — Steam's app identifier
- `taggingSource: TaggingSource` — MANUAL, AI_GENERATED, USER_ADJUSTED, PENDING
- `taggingConfidence: Float` — 0.0-1.0 for AI-generated entries
- `rawgId: Integer` — for RAWG API linking
- `steamPlaytimeForever: Integer` — reference playtime

---

## Notes
- Steam profiles must be **public** for basic API access
- Steam ID format must be 64-bit (17 digits)
- Find your Steam ID at: https://steamid.io
- Alternative: Steam OpenID OAuth (more complex, but works with private profiles)
- Consider caching RAWG responses to avoid rate limits
- AI tagging costs ~$0.01-0.05 per game depending on model
