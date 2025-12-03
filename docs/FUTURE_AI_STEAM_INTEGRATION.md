# Future: AI Game Tagging & Steam Integration

**Status:** 📋 PLANNED (Not Priority)  
**Created:** December 4, 2025  
**Priority:** After Phase 10-11 (Session Tracking & Weekly Dashboard)

---

## Overview

This document captures a planned feature for scaling Lutem's game library using Steam integration combined with AI-powered game tagging. The concept allows users to import their Steam library, with unknown games automatically tagged by an LLM.

---

## The Problem

Currently Lutem has 57 manually curated games. To scale:
- Manual tagging doesn't scale (too slow)
- Can't predict which games users own
- Need a way to add games on-demand

---

## The Solution: Demand-Driven AI Tagging

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER CONNECTS STEAM                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              FETCH STEAM LIBRARY (API)                          │
│         [Stardew Valley, DOTA 2, Hollow Knight, ...]            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MATCH AGAINST LUTEM DB                       │
│                                                                 │
│   ✅ Stardew Valley → ID 23 (already tagged)                    │
│   ✅ Hollow Knight → ID 45 (already tagged)                     │
│   ❌ Some Indie Game → NOT FOUND                                │
│   ❌ Unknown Title → NOT FOUND                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
            ┌─────────────┐     ┌─────────────────┐
            │   MATCHED   │     │    UNMATCHED    │
            │  Ready for  │     │                 │
            │  recs now   │     │  Queue for AI   │
            └─────────────┘     │  tagging        │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │   AI TAGGING    │
                                │  (Claude/GPT)   │
                                │                 │
                                │  Fetch from     │
                                │  Steam/RAWG     │
                                │  → Generate     │
                                │  mood tags      │
                                └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  ADD TO LUTEM   │
                                │  DATABASE       │
                                │                 │
                                │  status:        │
                                │  "AI_TAGGED"    │
                                └─────────────────┘
```

---

## Why This Approach Works

| Benefit | Explanation |
|---------|-------------|
| **Demand-driven growth** | Only tag games people actually own |
| **No wasted effort** | Not tagging 50,000 Steam games nobody uses |
| **Crowdsourced discovery** | Users bring games you didn't know about |
| **Immediate value** | Matched games work instantly |
| **Scales naturally** | Popular games get added first |

---

## Database Schema Changes

```sql
-- Add to games table
ALTER TABLE games ADD COLUMN steam_app_id INTEGER;
ALTER TABLE games ADD COLUMN source VARCHAR(20); -- 'MANUAL', 'AI_TAGGED', 'USER_SUBMITTED'
ALTER TABLE games ADD COLUMN confidence FLOAT;   -- AI confidence score
ALTER TABLE games ADD COLUMN verified BOOLEAN;   -- Human reviewed?

-- Track pending games (games requested but not yet tagged)
CREATE TABLE pending_games (
    id SERIAL PRIMARY KEY,
    steam_app_id INTEGER UNIQUE,
    name VARCHAR(255),
    requested_by_count INTEGER DEFAULT 1,
    first_requested_at TIMESTAMP,
    status VARCHAR(20) -- 'PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED'
);
```

---

## AI Tagging Prompt

```
You are tagging video games for Lutem, a mood-based recommendation system.

Game: {name}
Description: {steam_description}
Genres: {steam_genres}
Tags: {steam_tags}
Average Playtime: {avg_playtime} hours

Return JSON matching this schema:
{
  "minMinutes": number (minimum meaningful session),
  "maxMinutes": number (typical max session),
  "emotionalGoals": ["UNWIND" | "RECHARGE" | "CHALLENGE" | "LOCKING_IN" | "ADVENTURE_TIME" | "PROGRESS"],
  "interruptibility": "HIGH" | "MEDIUM" | "LOW",
  "energyRequired": "LOW" | "MEDIUM" | "HIGH",
  "bestTimeOfDay": ["MORNING" | "AFTERNOON" | "EVENING" | "LATE_NIGHT"],
  "socialPreferences": ["SOLO" | "COOP" | "COMPETITIVE" | "MMO"],
  "genres": [string array],
  "description": "2-3 sentence summary focused on gameplay feel",
  "confidence": 0.0-1.0 (how confident are you in these tags?)
}

Consider:
- Interruptibility: Can you pause? Save anywhere? Online-only?
- Energy: Is it relaxing or demanding?
- Session length: Based on game structure (levels, matches, etc.)
```

---

## Implementation Phases

### Phase A: Manual Core Library ✅ DONE
- 57 games, hand-tagged
- High quality, high confidence
- Gold standard for recommendations

### Phase B: Steam Connection
**Effort:** 1-2 sessions

1. Add Steam Web API integration
2. User enters Steam ID or connects via OAuth
3. Fetch owned games list
4. Match by `steam_app_id` or fuzzy name match
5. Return: matched games + unmatched games

**Steam Web API Docs:** https://developer.valvesoftware.com/wiki/Steam_Web_API

### Phase C: AI Expansion Pipeline
**Effort:** 2-3 sessions

1. Unmatched games → `pending_games` table
2. Background job processes queue (or on-demand)
3. Fetch game info from Steam Store API or RAWG
4. Send to OpenAI/Claude API for tagging
5. Store result with `source: 'AI_TAGGED'`, `verified: false`
6. Game immediately available for recommendations

**Estimated cost:** $0.01-0.05 per game (GPT-4o-mini or Claude Haiku)

### Phase D: Quality Control (Optional)
**Effort:** 1-2 sessions

- Admin dashboard to review AI-tagged games
- Flag/fix obviously wrong tags
- Mark as `verified: true` after review
- Community voting on tags (future)

---

## Total Effort Estimate

| Phase | Sessions | Hours |
|-------|----------|-------|
| Steam library fetch | 1-2 | 3-6 |
| Match against DB | 0.5 | 1-2 |
| AI tagging pipeline | 2-3 | 6-10 |
| Admin review UI | 1-2 | 3-6 |
| **Total** | **5-8** | **15-25** |

---

## The Pitch (What You Can Claim)

With this implemented:

> "Lutem integrates with Steam to import your game library. Games already in our curated database are immediately available for mood-based recommendations. New games are automatically analyzed using AI to generate emotional and temporal metadata, enabling personalized recommendations across your entire library."

This is legitimate "AI-powered" functionality.

---

## Prerequisites

Before implementing this:
- [x] Core recommendation engine working
- [ ] Phase 10: Session tracking & feedback
- [ ] Phase 11: Weekly dashboard
- [ ] Stable user base to test with

---

## API References

- **Steam Web API:** https://developer.valvesoftware.com/wiki/Steam_Web_API
- **Steam Store API:** https://store.steampowered.com/api/appdetails?appids={appid}
- **RAWG API:** https://rawg.io/apidocs (alternative game data source)
- **OpenAI API:** https://platform.openai.com/docs
- **Anthropic API:** https://docs.anthropic.com/

---

## Notes

- Xbox/PlayStation APIs are restricted (require partner agreements) — Steam is the realistic option
- Start with Steam ID input, OAuth is more complex
- RAWG API is good backup for game descriptions if Steam data is insufficient
- Consider rate limiting AI calls to control costs

---

**This document is for future reference. Current priority is Phase 10-11.**
