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
- ✅ Phase 2 COMPLETE - Railway backend deployed
- ✅ Phase 3 COMPLETE - Netlify frontend deployed
- ⬜ Phase 4 - Custom domain setup (lutem.3lands.ch)

## Production URLs
- **Frontend:** https://lutembeta.netlify.app
- **Backend API:** https://lutemprototype-production.up.railway.app
- **Test endpoint:** https://lutemprototype-production.up.railway.app/games (returns 57 games)

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

## Phase 2 Completed
Railway backend deployment:
- Created `WebConfig.java` for centralized CORS
- Removed `@CrossOrigin` annotations from controllers
- Fixed `mvnw` execute permissions
- Reduced logging for production (disabled SQL logging)
- Backend live at: https://lutemprototype-production.up.railway.app
- `/games` endpoint returns 57 games ✅

## Next: Phase 3 - Netlify Deployment ✅ COMPLETE
- Site deployed to: https://lutembeta.netlify.app
- CORS updated to allow lutembeta.netlify.app
- Railway auto-redeployed with new CORS config

## Next: Phase 4 - Custom Domain Setup
1. In Netlify: Site settings → Domain management → Add custom domain
2. Enter: lutem.3lands.ch
3. Netlify will provide DNS records to add
4. In 3lands.ch DNS settings, add CNAME or A record as instructed
5. Wait for DNS propagation (can take up to 48h, usually 15-30min)
6. Enable HTTPS in Netlify (automatic with Let's Encrypt)

## Key Files
```
D:\Lutem\LutemPrototype\
├── backend/
│   └── src/main/java/com/lutem/mvp/config/
│       ├── WebConfig.java      # CORS configuration
│       └── GameDataLoader.java # Seeds 57 games
├── frontend/
│   ├── js/config.js           # Production API URL set ✅
│   ├── js/api.js              # Uses Config
│   └── index.html             # Main page
├── docs/
│   ├── DEPLOYMENT_PLAN.md     # Full deployment guide
│   └── sessions/              # Session handoffs
├── start-backend.bat
└── start-frontend.bat
```

## CORS Allowed Origins
Configured in `WebConfig.java`:
- localhost:5500, localhost:3000, 127.0.0.1:5500, 127.0.0.1:3000
- https://lutem.3lands.ch
- https://lutembeta.netlify.app
- https://lutemprototype-production.up.railway.app
