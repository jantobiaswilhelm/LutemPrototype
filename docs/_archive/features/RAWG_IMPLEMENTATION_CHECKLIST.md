# RAWG API Integration - Implementation Checklist

**Status:** 🔄 In Progress  
**Started:** 2025-01-15

---

## 📋 PHASE 1: API Integration Basics

### Setup & Configuration
- [ ] Get RAWG API key from https://rawg.io/apidocs
- [ ] Add API key to environment variables (`RAWG_API_KEY`)
- [ ] Test API key with manual request (Postman/curl)

### Backend Dependencies
- [ ] Add `spring-boot-starter-webflux` to pom.xml
- [ ] Add `guava` for rate limiting to pom.xml
- [ ] Reload Maven dependencies

### Configuration Files
- [ ] Create `RawgApiConfig.java`
  - API key from environment
  - Base URL: https://api.rawg.io/api
  - Rate limit: 5 req/sec
  - Timeout configuration

### API Client
- [ ] Create `RawgApiService.java`
  - WebClient configuration
  - GET request helper methods
  - Error handling (404, 429, 500)
  - Rate limiter implementation

### Data Models
- [ ] Create `RawgGame.java` (DTO for API response)
  - id, name, slug
  - released, background_image
  - rating, rating_top, ratings_count
  - genres[], platforms[], tags[]
  - playtime (hours)
  - esrb_rating

- [ ] Create `RawgGenre.java`
  - id, name, slug

- [ ] Create `RawgPlatform.java`
  - id, name, slug

- [ ] Create `RawgSearchResponse.java`
  - count, next, previous
  - results[] (array of RawgGame)

### Testing
- [ ] Test: Fetch popular games (page_size=10)
- [ ] Test: Search by name ("Portal")
- [ ] Test: Get single game by ID
- [ ] Test: Rate limiter works (>5 req/sec blocked)
- [ ] Test: Error handling (invalid key, game not found)

### Deliverable Checkpoint
- [ ] Can successfully fetch games from RAWG
- [ ] Data correctly parsed into Java objects
- [ ] Error handling works
- [ ] Rate limiting prevents API abuse

---

## 📋 PHASE 2: Data Mapping System

### Mapping Configuration
- [ ] Create `GenreMoodMapping.java` or `genre-mood-mapping.yml`
- [ ] Define mappings for 50+ common genres/tags
- [ ] Research RAWG's most common tags
- [ ] Create mapping weights (primary vs secondary tags)

### Core Mappings to Define
- [ ] Action → moods
- [ ] Adventure → moods
- [ ] RPG → moods
- [ ] Strategy → moods
- [ ] Shooter → moods
- [ ] Puzzle → moods
- [ ] Casual → moods
- [ ] Simulation → moods
- [ ] Sports → moods
- [ ] Racing → moods
- [ ] Indie → moods
- [ ] Multiplayer → moods
- [ ] Singleplayer → moods
- [ ] Platformer → moods
- [ ] Fighting → moods
- [ ] Roguelike → moods
- [ ] Story Rich → moods
- [ ] Atmospheric → moods
- [ ] Relaxing → moods
- [ ] Open World → moods

### Mapping Algorithm
- [ ] Create `GenreMoodMappingService.java`
  - Method: `mapGameToMoods(RawgGame game)`
  - Aggregate mood scores from all tags
  - Weight by tag importance
  - Normalize to 0-8 scale

### Metadata Enrichment
- [ ] Map playtime to time categories
  - <1hr → Casual (5-30 min)
  - 1-5hr → Mid-range (30-90 min)
  - 5+hr → Long-form (90+ min)

- [ ] Infer interruptibility
  - Singleplayer → HIGH
  - Multiplayer → LOW
  - Turn-based → HIGH
  - Real-time → MEDIUM

- [ ] Calculate energy level
  - "Relaxing", "Casual" → LOW
  - "Action", "Fast-Paced" → HIGH
  - Default → MEDIUM

- [ ] Determine social level
  - "Multiplayer", "Co-op", "MMO" → HIGH
  - "Singleplayer" → LOW
  - Default → MEDIUM

### Validation
- [ ] Compare mapped games vs our 41 curated games
- [ ] Test: "Stardew Valley" → Should have high Unwind/Chill
- [ ] Test: "Dark Souls" → Should have high Challenge
- [ ] Test: "Portal 2" → Should have high Engage/Challenge
- [ ] Manual review of 20 randomly mapped games

### Deliverable Checkpoint
- [ ] Genre-to-mood mapping complete
- [ ] Automated mood generation works
- [ ] Quality comparable to curated games

---

## 📋 PHASE 3: Database Integration

### Schema Updates
- [ ] Add `source` column (VARCHAR, DEFAULT 'CURATED')
- [ ] Add `rawg_id` column (INTEGER, nullable)
- [ ] Add `last_updated` column (TIMESTAMP)
- [ ] Add `rating` column (DECIMAL 3,2)
- [ ] Add `metacritic_score` column (INTEGER, nullable)
- [ ] Create migration script or update data.sql

### Entity Updates
- [ ] Update `Game.java` entity
  - Add source field (enum: CURATED, RAWG)
  - Add rawgId field
  - Add lastUpdated field
  - Add rating field
  - Add metacriticScore field
  - Update constructors
  - Update builder pattern

### Repository Updates
- [ ] Update `GameRepository.java`
  - Add `findBySource(String source)`
  - Add `findByRawgId(Long rawgId)`
  - Add `findByRatingGreaterThan(double rating)`
  - Add custom query for mood-based search with source filter

### Sync Service
- [ ] Create `RawgSyncService.java`
  - Method: `syncPopularGames(int count)`
  - Method: `syncGameById(long rawgId)`
  - Method: `updateExistingGames()`
  - Batch processing for multiple games
  - Skip duplicates (check rawgId)

### Caching Strategy
- [ ] Cache RAWG games in H2 database
- [ ] Set refresh interval (30 days)
- [ ] Priority: Games with >1000 ratings first
- [ ] Track last_updated timestamp

### Initial Data Load
- [ ] Fetch top 500 popular games from RAWG
- [ ] Map each game to mood scores
- [ ] Store in database with source='RAWG'
- [ ] Verify no conflicts with curated games

### Testing
- [ ] Test: Curated games unaffected
- [ ] Test: RAWG games stored correctly
- [ ] Test: Can query by source
- [ ] Test: Can query by rating
- [ ] Test: Duplicate detection works

### Deliverable Checkpoint
- [ ] Database contains 500+ games
- [ ] CURATED and RAWG games coexist
- [ ] Sync service functional

---

## 📋 PHASE 4: Recommendation Engine Updates

### Performance Optimization
- [ ] Add database index on mood_tags column
- [ ] Add index on source column
- [ ] Add index on rating column
- [ ] Add index on available_time range

### Quality Scoring
- [ ] Implement quality boost algorithm
  - Rating > 4.0 → +10 bonus points
  - Rating > 4.5 → +15 bonus points
  - Ratings count > 1000 → +5 bonus
  - Source = CURATED → +20 bonus

### Updated Recommendation Logic
- [ ] Update `RecommendationService.java`
  - Pre-filter by time (quick elimination)
  - Score all matching games (mood + quality)
  - Sort by total score (mood + quality bonuses)
  - Return top 4 results
  - Ensure at least 1 curated game if available

### Recommendation Strategy
```java
1. Filter games by time fit (availableMinutes ±10)
2. Calculate mood match score (0-115 points)
3. Add quality bonus (0-30 points)
4. Sort by total score (descending)
5. If top result is RAWG, include best CURATED in alternatives
6. Return top 1 + 3 alternatives
```

### Performance Testing
- [ ] Measure recommendation time (target: <500ms)
- [ ] Test with 41 games (baseline)
- [ ] Test with 500 games
- [ ] Test with 1000 games (if added later)
- [ ] Optimize if needed (caching, indexing)

### Quality Testing
- [ ] Generate 50 test recommendations
- [ ] Compare RAWG vs CURATED game quality
- [ ] User acceptance testing (if available)
- [ ] Adjust quality bonuses if needed

### Deliverable Checkpoint
- [ ] Recommendations still fast
- [ ] Quality maintained
- [ ] Curated games still featured prominently

---

## 📋 PHASE 5: Search & Discovery Features

### New API Endpoints
- [ ] `GET /api/games/search`
  - Query params: query, platform, genre
  - Returns: List of matching games

- [ ] `GET /api/games/browse`
  - Query params: mood, minTime, maxTime, platform
  - Returns: Filtered games

- [ ] `GET /api/games/trending`
  - Returns: Top-rated games (last 30 days)

- [ ] `GET /api/games/new-releases`
  - Returns: Recently released games

### Search Implementation
- [ ] Create `GameSearchService.java`
  - Search by name (case-insensitive, partial match)
  - Filter by platform
  - Filter by genre/tags
  - Sort by relevance, rating, name

### Browse Implementation
- [ ] Filter games by mood dominance
  - Example: "Unwind" → games with unwind ≥ 6
- [ ] Filter by time range
- [ ] Filter by platform
- [ ] Sort by rating or match score

### Frontend Updates
- [ ] Add search bar to frontend
- [ ] Add "Browse Games" page/section
- [ ] Add "Trending" section
- [ ] Add "New Releases" section
- [ ] Display game cards with:
  - Cover image
  - Name, genre
  - Rating (stars)
  - Playtime estimate
  - Source indicator (curated vs RAWG)

### Testing
- [ ] Test search: "Portal" → finds Portal, Portal 2
- [ ] Test browse: mood=Unwind, time=30-60 → correct results
- [ ] Test trending: returns high-rated recent games
- [ ] Test new releases: returns recently added games
- [ ] Frontend displays results correctly

### Deliverable Checkpoint
- [ ] Search works accurately
- [ ] Browse provides meaningful exploration
- [ ] UI is intuitive and responsive

---

## 🎯 Definition of Done

### Phase 1 Complete When:
- ✅ Can fetch games from RAWG API
- ✅ No rate limit violations
- ✅ Data correctly parsed
- ✅ Error handling robust

### Phase 2 Complete When:
- ✅ 50+ genre mappings defined
- ✅ Mood generation produces reasonable scores
- ✅ Validation against curated games passes

### Phase 3 Complete When:
- ✅ 500+ RAWG games in database
- ✅ Sync service runs successfully
- ✅ No conflicts with curated games

### Phase 4 Complete When:
- ✅ Recommendations <500ms response time
- ✅ User feedback remains positive
- ✅ Quality maintained or improved

### Phase 5 Complete When:
- ✅ All search/browse endpoints work
- ✅ Frontend displays results beautifully
- ✅ Users can discover new games easily

---

## 🚨 Blockers & Risks

### Potential Blockers
- [ ] RAWG API key approval delay → Apply early
- [ ] Rate limit hit during testing → Implement caching immediately
- [ ] Mood mapping inaccurate → Manual tuning required
- [ ] Performance issues → Database optimization needed

### Mitigation Strategies
- Test with small batches first (10-50 games)
- Cache aggressively to avoid API limits
- Manual review of mappings before bulk import
- Profile and optimize database queries early

---

## 📝 Notes & Decisions

### Key Decisions Made
- **Decision:** Keep both CURATED and RAWG games
  - **Rationale:** Curated games are high quality, RAWG adds breadth

- **Decision:** Prioritize curated games in recommendations
  - **Rationale:** Maintain quality while expanding options

- **Decision:** Auto-generate mood scores with manual override option
  - **Rationale:** Scalability vs quality tradeoff

### Open Questions
- [ ] Should users be able to flag incorrect mood mappings?
- [ ] Should we show "confidence score" for RAWG games?
- [ ] How often to refresh RAWG data? (daily, weekly, monthly?)
- [ ] Should we add user reviews/ratings over time?

---

**Start Date:** TBD  
**Target Completion:** TBD  
**Current Phase:** Phase 0 (Planning)
