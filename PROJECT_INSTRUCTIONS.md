# Lutem Project Instructions

## Project Overview
Lutem is an AI-powered gaming recommendation platform that helps users find the perfect game based on their available time, mood, energy level, and preferences.

**Location:** `D:\Lutem\LutemPrototype`
**Branch:** `main`
**GitHub:** https://github.com/jantobiaswilhelm/LutemPrototype
**Games:** 57 games in database

## Quick Start Commands

### Starting the Application

```bash
# Start backend
D:\Lutem\LutemPrototype\start-backend.bat

# Start frontend
D:\Lutem\LutemPrototype\start-frontend.bat

# Or start everything at once
D:\Lutem\LutemPrototype\start-lutem.bat
```

### Testing the Application

After starting:
1. Backend runs on `http://localhost:8080`
2. Frontend opens in browser
3. Test: Select preferences → Click "Get Recommendation" → Verify game appears

## Project Structure

```
D:\Lutem\LutemPrototype\
├── backend/                    # Spring Boot backend (Java)
│   ├── src/main/java/         # Application code
│   ├── src/main/resources/    # games-seed.json (57 games)
│   └── pom.xml                # Maven configuration
├── frontend/                   # Frontend (HTML/CSS/JS)
│   ├── js/
│   │   ├── config.js          # Environment detection (localhost vs production)
│   │   ├── api.js             # Backend API calls
│   │   └── ...                # Other modules
│   ├── css/                   # Stylesheets
│   └── index.html             # Main page
├── docs/
│   ├── DEPLOYMENT_PLAN.md     # Full deployment guide
│   └── sessions/              # Session handoff docs
├── start-backend.bat
├── start-frontend.bat
└── start-lutem.bat
```

## API Endpoints

- `GET /games` - List all 57 games
- `POST /recommendations` - Get game recommendation
  - Body: `{"availableMinutes": 30, "desiredEmotionalGoals": ["UNWIND"], ...}`
- `POST /sessions/feedback` - Submit satisfaction score
  - Body: `{"gameId": 1, "satisfactionScore": 5}`

## Key Technical Details

- **Backend:** Spring Boot 3.2 + Java 17+
- **Frontend:** Vanilla HTML/CSS/JS (no framework)
- **Database:** PostgreSQL (prod on Railway) / H2 (local dev), games loaded from `games-seed.json` on startup
- **Environment:** `config.js` auto-detects localhost vs production

## Deployment Status

- **Live:** `lutem.3lands.ch`
- **Architecture:** Netlify (frontend) + Railway (backend + PostgreSQL)
- **Phase 1:** ✅ Environment config complete
- **Phase 2:** ✅ Railway backend deployment
- **Phase 3:** ✅ Netlify frontend deployment
- **Phase 4:** ✅ Custom domain setup

See `docs/DEPLOYMENT_PLAN.md` for full deployment guide.

## User Preferences

- Be critical, no sugarcoating
- Call out mistakes directly
- Deny overly complex solutions
- **NEVER KILL ALL NODE PROCESSES**

## Working with This Project

1. Always use the bat files to start backend/frontend
2. Check `docs/sessions/` for current state and next steps
3. Backend must be running for recommendations to work (otherwise falls back to demo mode)
4. After changes, test locally before committing
