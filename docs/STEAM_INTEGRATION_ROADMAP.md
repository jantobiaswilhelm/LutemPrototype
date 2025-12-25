# Steam Library Integration Roadmap

## Overview
Enable users to import their Steam library into Lutem for personalized recommendations based on games they actually own.

## The Core Problem
Steam user has 200 games → Lutem DB has 57 curated games → What about the other 143?

---

## Phase S1: Database Preparation
**Goal:** Add Steam app ID support to existing games

**Tasks:**
- [ ] Add `steamAppId` (Long) field to Game entity
- [ ] Add `taggingSource` enum: `MANUAL`, `AI_GENERATED`, `USER_ADJUSTED`
- [ ] Create migration/update for existing schema
- [ ] Manually map existing 57 games to their Steam app IDs

**Effort:** Small

---

## Phase S2: Steam API Integration
**Goal:** Fetch user's Steam library

**Tasks:**
- [ ] Get Steam API key (https://steamcommunity.com/dev/apikey)
- [ ] Store API key as environment variable
- [ ] Create SteamService with `GetOwnedGames` endpoint call
- [ ] Create endpoint: `POST /api/steam/import?steamId={STEAM_ID_64}`
- [ ] Handle public/private profile errors gracefully

**API Endpoint:**
```
GET https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/
?key={API_KEY}
&steamid={STEAM_ID_64}
&include_appinfo=true
&include_played_free_games=true
```

**Returns:** `appid`, `name`, `playtime_forever`, `playtime_2weeks`, `img_icon_url`

**Effort:** Medium

---

## Phase S3: Library Matching
**Goal:** Match imported Steam games against Lutem database

**Tasks:**
- [ ] Match by `steamAppId` field
- [ ] Return response with `matched` and `unmatched` game lists
- [ ] Create UserLibrary entity to store user's owned games
- [ ] Link matched games to user profile

**Response Example:**
```json
{
  "matched": [
    { "steamAppId": 367520, "name": "Hollow Knight", "lutemGameId": 12 }
  ],
  "unmatched": [
    { "steamAppId": 1234567, "name": "Some Indie Game", "playtime": 45 }
  ],
  "stats": {
    "total": 200,
    "matched": 12,
    "unmatched": 188
  }
}
```

**Effort:** Small

---

## Phase S4: Untagged Game Storage
**Goal:** Store unmatched games for future tagging

**Tasks:**
- [ ] Create games from unmatched Steam data with `taggingSource: null` or `PENDING`
- [ ] Store basic Steam info: `steamAppId`, `name`, `coverUrl`
- [ ] Flag as "untagged" — excluded from smart recommendations
- [ ] Show in user library with "needs tagging" indicator

**Effort:** Medium

---

## Phase S5: RAWG API Enrichment
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

## Phase S6: AI Tagging Pipeline
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
  - `emotionalGoals` → [RELAXING, ESCAPING, LOCKING_IN, EXPLORING, COMPETING, CONNECTING]
  - `energyLevel` → LOW, MEDIUM, HIGH
  - `interruptibility` → LOW, MEDIUM, HIGH  
  - `sessionLength` → minMinutes, maxMinutes
  - `socialType` → SOLO, COOP, COMPETITIVE, MMO
- [ ] Store confidence scores per attribute
- [ ] Create batch processing job for multiple games
- [ ] Rate limit API calls appropriately

**GPT Prompt Example:**
```
Given this game data:
- Name: {name}
- Genres: {genres}
- Tags: {tags}  
- Description: {description}
- Average playtime: {playtime}

Estimate Lutem attributes as JSON:
{
  "emotionalGoals": [],
  "energyLevel": "",
  "interruptibility": "",
  "minMinutes": 0,
  "maxMinutes": 0,
  "socialType": ""
}
```

**Effort:** Medium

---

## Phase S7: User Override & Confirmation
**Goal:** Let users adjust AI-generated tags

**Tasks:**
- [ ] UI for viewing/editing game attributes
- [ ] "Confirm" button to change `taggingSource` to `USER_ADJUSTED`
- [ ] Track user corrections for future AI training data
- [ ] Show tagging source badge: "Curated" / "AI Tagged" / "Your Tags"

**Effort:** Small

---

## MVP Scope
**S1 → S3** gets you a working "we found 12 of your Steam games" experience.

**S4 → S6** makes it actually useful for users with large libraries.

**S7** adds polish and user trust.

---

## Technical Requirements

**Environment Variables:**
- `STEAM_API_KEY` — from Steam developer portal
- `RAWG_API_KEY` — from RAWG.io (free tier: 20k requests/month)
- `OPENAI_API_KEY` — for AI tagging (already have for other features?)

**New Entities:**
- `UserLibrary` — links User to owned Games
- `GameImport` — tracks import history/status

**New Fields on Game:**
- `steamAppId: Long` — Steam's app identifier
- `taggingSource: Enum` — MANUAL, AI_GENERATED, USER_ADJUSTED, PENDING
- `taggingConfidence: Float` — 0.0-1.0 for AI-generated entries
- `rawgId: Integer` — for RAWG API linking

---

## Notes
- Steam profiles must be **public** for basic API access
- Alternative: Steam OpenID OAuth (more complex, but works with private profiles)
- Consider caching RAWG responses to avoid rate limits
- AI tagging costs ~$0.01-0.05 per game depending on model
