# Lutem Deployment Session Handoff

## Project Location
**Path:** `D:\Lutem\LutemPrototype`  
**Branch:** `main`  
**GitHub:** https://github.com/jantobiaswilhelm/LutemPrototype

## 🌐 Production URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://lutembeta.netlify.app | ✅ LIVE |
| **Backend API** | https://lutemprototype-production.up.railway.app | ✅ LIVE |
| **Games Endpoint** | https://lutemprototype-production.up.railway.app/games | ✅ 57 games |

## Deployment Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Environment config | ✅ COMPLETE |
| Phase 2 | Railway backend | ✅ COMPLETE |
| Phase 3 | Netlify frontend | ✅ COMPLETE |
| Phase 4 | Custom domain (lutem.3lands.ch) | ⬜ Optional |

## Architecture
```
lutembeta.netlify.app
        │
        ▼
   ┌─────────────┐
   │   Netlify   │  ← Frontend (static HTML/CSS/JS)
   └─────────────┘
        │ API calls
        ▼
┌──────────────────────────────────────────┐
│  lutemprototype-production.up.railway.app │
│  Backend (Spring Boot + SQLite, 57 games) │
└──────────────────────────────────────────┘
```

## Continuous Deployment
Both services auto-deploy on push to `main`:
- **Netlify:** ~30 seconds
- **Railway:** ~2-3 minutes

## Quick Start Commands
```bash
# Local development
D:\Lutem\LutemPrototype\start-backend.bat   # Backend on :8080
D:\Lutem\LutemPrototype\start-frontend.bat  # Frontend on :5500
D:\Lutem\LutemPrototype\start-lutem.bat     # Both
```

## Key Files
```
frontend/js/config.js              # Environment detection (localhost vs production)
frontend/js/api.js                 # API client
backend/.../config/WebConfig.java  # CORS configuration
docs/DEPLOYMENT_PLAN.md            # Full deployment documentation
```

## CORS Allowed Origins
Configured in `WebConfig.java`:
- `http://localhost:5500`, `http://localhost:3000`
- `http://127.0.0.1:5500`, `http://127.0.0.1:3000`
- `https://lutem.3lands.ch`
- `https://lutembeta.netlify.app`
- `https://lutemprototype-production.up.railway.app`

## Project Metrics
- **Games in Database:** 57
- **Frontend:** Modularized (14 JS modules, 6 CSS files)
- **Backend:** Spring Boot 3.2 + SQLite

## Phase 4 (Optional): Custom Domain
If you want `lutem.3lands.ch`:
1. Netlify → Site settings → Domain management → Add `lutem.3lands.ch`
2. Add CNAME in your DNS: `lutem` → `lutembeta.netlify.app`
3. Wait for propagation, HTTPS auto-provisions

---

*Last Updated: 2025-11-29*  
*Status: ✅ DEPLOYED AND LIVE*
