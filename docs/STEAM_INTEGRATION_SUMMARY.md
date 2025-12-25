# Steam Integration Implementation Summary

## What Was Implemented (Phases S1-S3)

### New Files Created

**Models:**
- `model/TaggingSource.java` - Enum for tracking how game attributes were determined (MANUAL, AI_GENERATED, USER_ADJUSTED, PENDING)
- `model/UserLibrary.java` - Entity linking users to their owned games with source tracking and playtime data

**DTOs:**
- `dto/SteamImportResponse.java` - Complete response DTO with matched/unmatched games and stats
- `dto/UserLibraryGameDTO.java` - DTO for user library entries

**Services:**
- `service/SteamService.java` - Steam API integration for fetching owned games
- `service/UserLibraryService.java` - User library management

**Controllers:**
- `controller/SteamController.java` - REST endpoints for Steam integration

**Config:**
- `config/SteamIdMigration.java` - Auto-extracts Steam App IDs from existing game URLs

### Modified Files

**Models:**
- `model/Game.java` - Added fields:
  - `steamAppId` (Long) - Steam's app identifier
  - `taggingSource` (TaggingSource) - How metadata was determined
  - `taggingConfidence` (Float) - AI confidence score
  - `rawgId` (Integer) - RAWG API ID for future enrichment
  - `steamPlaytimeForever` (Integer) - Reference playtime

**Repositories:**
- `repository/GameRepository.java` - Added Steam-related queries
- `repository/UserLibraryRepository.java` - NEW - User library queries

**Config:**
- `config/GameDataLoader.java` - Added @Order(1) annotation
- `application.properties` - Added `steam.api.key` config
- `application-local.properties` - Added `steam.api.key` config

---

## API Endpoints

### 1. Check Steam Status
```
GET /api/steam/status

Response:
{
  "configured": true,
  "message": "Steam integration is ready"
}
```

### 2. Import Steam Library
```
POST /api/steam/import
Headers: 
  X-Firebase-UID: <firebase_uid>
Body: 
  { "steamId": "76561198012345678" }

Response:
{
  "matched": [
    {
      "steamAppId": 367520,
      "name": "Hollow Knight",
      "lutemGameId": 12,
      "imageUrl": "...",
      "playtimeForever": 4500,
      "playtime2Weeks": 120
    }
  ],
  "unmatched": [
    {
      "steamAppId": 1234567,
      "name": "Some Indie Game",
      "playtimeForever": 45,
      "iconUrl": "..."
    }
  ],
  "stats": {
    "total": 200,
    "matched": 12,
    "unmatched": 188,
    "alreadyInLibrary": 0
  },
  "steamId": "76561198012345678",
  "message": "Found 12 of your 200 Steam games in Lutem's curated library!"
}
```

### 3. Get User Library
```
GET /api/steam/library
Headers:
  X-Firebase-UID: <firebase_uid>

Response:
{
  "summary": {
    "totalGames": 15,
    "steamGames": 12,
    "taggedGames": 12,
    "untaggedGames": 3
  },
  "games": [
    {
      "libraryEntryId": 1,
      "gameId": 12,
      "gameName": "Hollow Knight",
      "imageUrl": "...",
      "source": "STEAM",
      "steamAppId": 367520,
      "playtimeForever": 4500,
      "playtime2Weeks": 120,
      "addedAt": "2024-01-15T10:30:00",
      "isTagged": true,
      "taggingSource": "MANUAL"
    }
  ]
}
```

---

## Setup Instructions

### 1. Get Steam API Key
1. Go to https://steamcommunity.com/dev/apikey
2. Login with your Steam account
3. Enter a domain name (can be anything like "lutem.local")
4. Copy your API key

### 2. Configure Environment

**Local Development:**
```bash
# Set environment variable before running
set STEAM_API_KEY=your_api_key_here
```

**Railway (Production):**
1. Go to Railway dashboard
2. Select your service
3. Go to Variables tab
4. Add: `STEAM_API_KEY` = `your_api_key_here`

### 3. Database Migration
The schema updates automatically via JPA on startup. The `SteamIdMigration` component will:
- Extract Steam App IDs from existing game URLs
- Set `taggingSource = MANUAL` for all curated games

---

## How It Works

### Import Flow
1. User provides their Steam ID (64-bit format)
2. SteamService calls Steam API to get owned games
3. Each Steam game is matched against Lutem's `steamAppId` field
4. Matched games are added to UserLibrary
5. Response shows what matched and what didn't

### Matching Logic
Games are matched by `steamAppId` which is:
- Pre-populated for existing curated games (extracted from store URLs)
- Compared against Steam's `appid` from the API

### User Library
- Tracks which games a user owns
- Stores source (STEAM, MANUAL, etc.)
- Keeps playtime data from Steam
- Links to Lutem Game entity for recommendations

---

## Next Steps (Phases S4-S7)

1. **Store Unmatched Games** - Save games not in Lutem DB with PENDING status
2. **RAWG Enrichment** - Auto-fetch metadata for unknown games
3. **AI Tagging** - Generate Lutem attributes using GPT
4. **User Confirmation** - Let users adjust AI-generated tags

---

## Testing

### Test Steam Import
```bash
curl -X POST http://localhost:8080/api/steam/import \
  -H "Content-Type: application/json" \
  -H "X-Firebase-UID: test-user-uid" \
  -d '{"steamId": "76561198012345678"}'
```

### Find Your Steam ID
1. Go to https://steamid.io
2. Enter your Steam profile URL
3. Copy the "steamID64" value (17 digits)

### Make Profile Public
1. Go to Steam Settings > Privacy Settings
2. Set "Game details" to Public
3. Wait a few minutes for changes to propagate
