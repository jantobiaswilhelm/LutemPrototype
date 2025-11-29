# Lutem Deployment Session Handoff

## Project Location
**Path:** `D:\Lutem\LutemPrototype`
**Branch:** `main`
**GitHub:** https://github.com/jantobiaswilhelm/LutemPrototype

## Architecture
- **Frontend**: Static HTML/CSS/JS → Netlify (free)
- **Backend**: Spring Boot + SQLite → Railway (free)  
- **Domain**: `lutem.3lands.ch` (already owned)
- **Games**: 57 games in database

## Current State (2025-11-29)
- ✅ Phase 1 COMPLETE - Environment config created
- ⬜ Phase 2 - Railway backend deployment (NEXT)
- ⬜ Phase 3 - Netlify frontend deployment
- ⬜ Phase 4 - Custom domain setup

## Project Metrics
- **Games in Database:** 57
- **Frontend:** Modularized (14 JS modules, 6 CSS files)
- **Calendar:** Display works, interactions deferred

## Quick Start Commands
```bash
# Start backend
D:\Lutem\LutemPrototype\start-backend.bat

# Start frontend
D:\Lutem\LutemPrototype\start-frontend.bat

# Or both
D:\Lutem\LutemPrototype\start-lutem.bat
```

## Phase 1 Completed
Created runtime environment detection:
- `frontend/js/config.js` - Auto-detects localhost vs production
- Updated `api.js`, `demo-mode.js`, `index.html`
- Console shows environment on load

## Next: Phase 2 - Railway Deployment
1. Create Railway account at railway.app
2. Connect GitHub repo `jantobiaswilhelm/LutemPrototype`
3. Deploy from `main` branch, root directory: `backend`
4. Get Railway URL
5. Update `frontend/js/config.js` line 16 with Railway URL
6. Test `/games` endpoint

## Key Files
```
D:\Lutem\LutemPrototype\
├── backend/                 # Spring Boot backend
├── frontend/
│   ├── js/config.js        # Environment detection
│   ├── js/api.js           # API calls
│   └── index.html          # Main page
├── docs/
│   └── DEPLOYMENT_PLAN.md  # Full deployment guide
├── start-backend.bat
└── start-frontend.bat
```
