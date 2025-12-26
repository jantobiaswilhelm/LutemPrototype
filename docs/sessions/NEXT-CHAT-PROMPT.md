# Lutem - Next Steps Prompt

Copy this to start your next chat:

---

## Project Context

I'm building **Lutem**, an AI-powered gaming recommendation system ("Headspace meets Steam"). The frontend just got updated with new attributes support.

**Project Location:** `D:\Lutem\LutemPrototype`  
**Frontend:** `D:\Lutem\LutemPrototype\frontend-react` (Vite + React + TypeScript + Tailwind + Zustand)  
**Backend:** Spring Boot on `localhost:8080`

## What Was Just Completed ✅

1. **Types** - `AudioDependency`, `ContentRating`, `NsfwLevel`, `AudioAvailability` with display data
2. **AudioStep** - New wizard step between social and result
3. **Settings** - Content Preferences section (max rating + NSFW toggle)
4. **useContentPreferences hook** - Reusable access to content prefs

## What's Next: API Integration

The frontend is ready but needs to send the new filters to the backend.

### Tasks:

1. **Update recommendation API call** to include:
   - `audioAvailability` from wizard store
   - `maxContentRating` and `allowNsfw` from content preferences

2. **Backend filter support** (if not already done):
   - Update RecommendationRequest DTO with new fields
   - Add filtering logic to recommendation service

### Files to check:

- `src/api/hooks.ts` or wherever recommendation API is called
- `src/stores/recommendationStore.ts`
- Backend: `RecommendationController.java`, `RecommendationService.java`

## Quick Start

```bash
# Frontend
cd D:\Lutem\LutemPrototype\frontend-react
npm run dev

# Backend
cd D:\Lutem\LutemPrototype\backend
set SPRING_PROFILES_ACTIVE=local
mvn spring-boot:run
```

---

**Start by checking where the recommendation API call happens, then wire in the new filters.**
