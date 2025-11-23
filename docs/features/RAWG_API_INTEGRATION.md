# RAWG API Integration Plan

**Feature:** Expand game library from 41 curated games to thousands via RAWG API  
**Priority:** High  
**Complexity:** High  
**Estimated Effort:** 3-5 development sessions

---

## 🎯 Goals

1. Access RAWG's extensive game database (500,000+ games)
2. Automatically fetch game metadata (genres, platforms, playtime, ratings)
3. Map RAWG data to Lutem's 8-dimensional mood system
4. Maintain recommendation quality while expanding library
5. Add search/discovery capabilities

---

## 📋 Prerequisites

### RAWG API Basics
- **Website:** https://rawg.io/apidocs
- **Free Tier:** 20,000 requests/month
- **Rate Limit:** ~5 requests/second
- **API Key Required:** Yes (free registration)

### Data Available from RAWG
✅ Game name, description, release date  
✅ Genres and tags  
✅ Platforms (PC, PlayStation, Xbox, etc.)  
✅ Average playtime (hours)  
✅ Ratings and review scores  
✅ Cover images and screenshots  
✅ Store links (Steam, Epic, etc.)  
❌ **NOT Available:** Lutem's mood tags (we must generate these)

---

## 🏗️ Architecture Plan

### Phase 1: API Integration Basics
**Goal:** Successfully fetch and display games from RAWG

**Tasks:**
1. **Set up RAWG API client**
   - Create `RawgApiService.java` in backend
   - Configure API key (environment variable)
   - Implement basic GET requests with RestTemplate/WebClient
   - Add error handling and rate limiting

2. **Create RAWG data models**
   - `RawgGame.java` - Raw API response
   - `RawgGenre.java` - Genre information
   - `RawgPlatform.java` - Platform details
   - DTOs for API responses

3. **Test API connection**
   - Fetch popular games
   - Verify data structure
   - Log response times
   - Test rate limiting

**Deliverables:**
- Working RAWG API client
- Successful data fetching
- Basic error handling

---

### Phase 2: Data Mapping System
**Goal:** Map RAWG genres/tags to Lutem's 8-dimensional mood system

**The Challenge:**
RAWG provides genres like "Action", "RPG", "Puzzle" but NOT our mood dimensions:
- Unwind, Recharge, Engage, Challenge, Explore, Achieve, Social, Chill

**Solution: Genre-to-Mood Mapping Table**

Create intelligent mapping rules:

```
RAWG Genre/Tag → Lutem Mood Scores (0-8 scale)

"Puzzle" → Unwind: 7, Engage: 6, Challenge: 7, Chill: 6
"Action" → Engage: 8, Challenge: 7, Achieve: 7, Social: 4
"RPG" → Explore: 8, Engage: 7, Achieve: 6, Challenge: 5
"Casual" → Unwind: 8, Chill: 8, Recharge: 7
"Multiplayer" → Social: 8, Engage: 7, Challenge: 5
"Indie" → Explore: 7, Unwind: 5, Chill: 6
"Story-Rich" → Explore: 7, Engage: 6, Unwind: 5
"Relaxing" → Unwind: 8, Recharge: 8, Chill: 8
```

**Tasks:**
1. **Create mapping configuration**
   - `GenreMoodMapping.java` or YAML config
   - Define rules for 50+ common genres/tags
   - Support multiple tags per game

2. **Implement mapping algorithm**
   - Aggregate mood scores from all game tags
   - Weight by tag importance
   - Normalize to 0-8 scale

3. **Add metadata enrichment**
   - Map playtime to our time categories
   - Infer interruptibility from genre
   - Calculate energy level from pacing tags
   - Determine social level from multiplayer info

**Deliverables:**
- Comprehensive genre-to-mood mapping
- Automated mood score generation
- Validation against our 41 curated games

---

### Phase 3: Database Integration
**Goal:** Store RAWG games alongside curated games

**Strategy: Hybrid Approach**
- Keep our 41 curated games (high-quality, manually tuned)
- Add RAWG games as supplementary library
- Flag games by source (CURATED vs RAWG)

**Database Schema Updates:**
```sql
ALTER TABLE game ADD COLUMN source VARCHAR(20) DEFAULT 'CURATED';
-- Values: 'CURATED' or 'RAWG'

ALTER TABLE game ADD COLUMN rawg_id INTEGER;
-- Link back to RAWG for updates

ALTER TABLE game ADD COLUMN last_updated TIMESTAMP;
-- Track when RAWG data was fetched

ALTER TABLE game ADD COLUMN rating DECIMAL(3,2);
-- RAWG rating (0-5 scale)

ALTER TABLE game ADD COLUMN metacritic_score INTEGER;
-- Metacritic score if available
```

**Tasks:**
1. **Update Game entity**
   - Add source, rawgId, lastUpdated fields
   - Add rating and metacriticScore
   - Update constructors and builders

2. **Create caching strategy**
   - Cache RAWG games in database (avoid repeated API calls)
   - Refresh data every 30 days
   - Priority cache: Popular games (>1000 rating count)

3. **Implement game sync service**
   - `RawgSyncService.java`
   - Fetch popular games on startup
   - Background job for periodic updates
   - Manual sync endpoint for admin

**Deliverables:**
- Updated database schema
- RAWG games stored in H2
- Sync service running

---

### Phase 4: Recommendation Engine Updates
**Goal:** Recommendations work seamlessly with expanded library

**Challenges:**
- Much larger dataset (41 → thousands)
- Performance considerations
- Quality control (RAWG data varies)

**Tasks:**
1. **Optimize recommendation algorithm**
   - Add database indexing on mood scores
   - Pre-filter by time requirement
   - Limit search to top-rated games first
   - Fall back to broader search if needed

2. **Quality scoring**
   - Boost games with high ratings
   - Prefer games with more ratings (popularity)
   - Penalize games with incomplete data
   - Keep curated games always in top results

3. **Update recommendation logic**
```java
// Priority order:
1. Check CURATED games first (always include best matches)
2. Search RAWG games by:
   - Time fit
   - Mood match
   - Rating > 3.5
   - Ratings count > 100
3. Return top 4 (1 curated + 3 RAWG or 4 best overall)
```

**Deliverables:**
- Fast recommendations (<500ms)
- Quality results maintained
- Curated games still featured

---

### Phase 5: Search & Discovery Features
**Goal:** Let users explore the expanded library

**New Features:**
1. **Game Search**
   - Search by name
   - Filter by genre/platform
   - Sort by rating/popularity/playtime

2. **Browse by Mood**
   - "Show me all Unwind games"
   - "Games for Recharge between 20-40 minutes"

3. **Trending/Popular Games**
   - Top rated this month
   - Most recommended by Lutem
   - New releases matching user profile

**API Endpoints:**
```
GET /api/games/search?query={name}&platform={platform}
GET /api/games/browse?mood={mood}&minTime={min}&maxTime={max}
GET /api/games/trending
GET /api/games/new-releases
```

**Deliverables:**
- Search functionality
- Browse interface
- Discovery features

---

## 🛠️ Technical Implementation

### Backend Structure
```
backend/src/main/java/com/lutem/
├── config/
│   └── RawgApiConfig.java          # API key, base URL
├── service/
│   ├── RawgApiService.java         # API client
│   ├── RawgSyncService.java        # Sync games to DB
│   └── GenreMoodMappingService.java # Map genres to moods
├── model/
│   ├── rawg/
│   │   ├── RawgGame.java           # RAWG API response
│   │   ├── RawgGenre.java
│   │   └── RawgPlatform.java
│   └── Game.java (updated)         # Add source, rawgId
└── repository/
    └── GameRepository.java (updated) # New queries
```

### Configuration (application.properties)
```properties
# RAWG API Configuration
rawg.api.key=${RAWG_API_KEY}
rawg.api.base-url=https://api.rawg.io/api
rawg.api.rate-limit=5
rawg.sync.enabled=true
rawg.sync.initial-games=500
rawg.sync.popular-games=true
```

### Dependencies (pom.xml)
```xml
<!-- For HTTP requests -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>

<!-- For rate limiting -->
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>32.1.3-jre</version>
</dependency>

<!-- For JSON processing -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

---

## 📊 Genre-to-Mood Mapping Table (Draft)

### High Unwind Games (7-8)
- Casual, Puzzle, Relaxing, Walking Simulator, Visual Novel

### High Engage Games (7-8)
- Action, Shooter, Fighting, Platformer, Arcade

### High Challenge Games (7-8)
- Puzzle, Strategy, Roguelike, Souls-like, Simulation

### High Explore Games (7-8)
- Open World, Adventure, RPG, Exploration, Metroidvania

### High Achieve Games (7-8)
- RPG, Action-Adventure, Platformer, Indie

### High Social Games (7-8)
- Multiplayer, MMO, Co-op, Party, Online

### High Recharge Games (7-8)
- Casual, Relaxing, Ambient, Meditative, Cozy

### High Chill Games (7-8)
- Casual, Relaxing, Puzzle, Simulation, Creative

---

## ⚠️ Challenges & Solutions

### Challenge 1: Mood Mapping Accuracy
**Problem:** Auto-generated mood scores won't be as accurate as manually curated  
**Solution:**
- Mark RAWG games with lower confidence score
- Allow user feedback to improve mappings
- Periodically review and adjust mapping rules
- Keep curated games prioritized

### Challenge 2: Performance with Large Dataset
**Problem:** Searching thousands of games might be slow  
**Solution:**
- Database indexing on mood_tags JSON
- Pre-filter by time and rating
- Limit initial search scope
- Cache popular recommendations

### Challenge 3: Rate Limiting
**Problem:** 20,000 requests/month might not be enough  
**Solution:**
- Cache all fetched games in database
- Only fetch new/updated games
- Prioritize popular games
- Batch requests efficiently

### Challenge 4: Data Quality
**Problem:** RAWG data completeness varies  
**Solution:**
- Validate required fields before storing
- Skip games with insufficient data
- Prefer games with high rating counts
- Add manual override for important games

### Challenge 5: Update Frequency
**Problem:** When to refresh RAWG data?  
**Solution:**
- Initial sync: Fetch top 500 popular games
- Daily: Fetch new releases
- Monthly: Update existing games
- On-demand: Manual sync for specific games

---

## 🎯 Success Metrics

### Phase 1 Success
- ✅ Successfully fetch games from RAWG API
- ✅ No rate limit errors
- ✅ Data correctly parsed

### Phase 2 Success
- ✅ Genre-to-mood mapping produces reasonable scores
- ✅ Mapped games comparable to curated quality
- ✅ Validation: Compare RAWG "Puzzle" games vs our curated puzzle games

### Phase 3 Success
- ✅ 500+ games stored in database
- ✅ Both CURATED and RAWG games coexist
- ✅ No performance degradation

### Phase 4 Success
- ✅ Recommendations still fast (<500ms)
- ✅ Quality maintained (user feedback)
- ✅ Curated games still featured

### Phase 5 Success
- ✅ Search returns relevant results
- ✅ Browse by mood works intuitively
- ✅ Users discover new games successfully

---

## 📅 Estimated Timeline

**Phase 1:** 1 session (4-6 hours)
- Set up API client, test connection

**Phase 2:** 2 sessions (8-12 hours)  
- Build mapping system, validate results

**Phase 3:** 1 session (4-6 hours)
- Database updates, sync service

**Phase 4:** 1 session (4-6 hours)
- Optimize recommendations, test performance

**Phase 5:** 1-2 sessions (6-10 hours)
- Build search/discovery features

**Total:** 5-7 sessions (~30-40 hours)

---

## 🚀 Getting Started

### Step 1: Get RAWG API Key
1. Go to https://rawg.io/apidocs
2. Sign up for free account
3. Generate API key
4. Add to environment variables

### Step 2: Test API Manually
Try these endpoints:
```
# Get popular games
GET https://api.rawg.io/api/games?key=YOUR_KEY&page_size=10

# Get game details
GET https://api.rawg.io/api/games/{id}?key=YOUR_KEY

# Search games
GET https://api.rawg.io/api/games?key=YOUR_KEY&search=Portal
```

### Step 3: Create Implementation Checklist
See RAWG_IMPLEMENTATION_CHECKLIST.md

---

## 📝 Notes

### Why RAWG?
- Most comprehensive gaming API
- Free tier sufficient for MVP
- Good data quality
- Active maintenance
- Popular choice (Steam Deck uses it!)

### Alternative APIs Considered
- **IGDB:** More complex, requires Twitch account
- **Steam API:** Limited to Steam games only
- **Giant Bomb:** Requires paid subscription
- **HowLongToBeat:** No official API

### Future Enhancements
- User can flag incorrect mood mappings
- Machine learning to improve mappings over time
- Hybrid recommendations (RAWG + Steam library)
- Custom game addition by users

---

**Next Steps:** Would you like to start with Phase 1 (API setup) or would you prefer to get the RAWG API key first?
