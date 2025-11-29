# Lutem Deployment Session Handoff

## Context
Jan is deploying Lutem to production at `lutem.3lands.ch`. The deployment plan is documented in `docs/DEPLOYMENT_PLAN.md`.

## Architecture
- **Frontend**: Static HTML/CSS/JS → Netlify (free)
- **Backend**: Spring Boot + SQLite → Railway (free)
- **Domain**: `lutem.3lands.ch` (already owned)

## Key Decision Made
Using **runtime environment detection** (not separate branches) - frontend auto-detects localhost vs production and calls appropriate API URL.

## Current State
- Project: `D:\Lutem\LutemPrototype-refactor` on `main` branch
- 57 games in database (41 currently loaded in local DB)
- Frontend refactoring DONE
- Calendar modal work uncommitted (in progress)
- **Phase 1 COMPLETE** - Config module created and integrated

## Phase 1 Completed (2025-11-29)
Created `frontend/js/config.js` with environment detection:
- Auto-detects localhost vs production hostname
- Exposes `Config.API_URL` and `Config.API_BASE_URL`
- Logs environment info to console for debugging

Updated files:
- `frontend/js/config.js` - NEW: Environment detection module
- `frontend/js/api.js` - Uses Config.API_URL instead of hardcoded localhost
- `frontend/demo-mode.js` - Uses Config if available for checkBackendAvailable()
- `frontend/index.html` - config.js loads FIRST before all other scripts

## What Needs to Be Done Next (in order)

### Test Phase 1 Locally (User Action Required)
1. Backend is running on port 8080
2. Open frontend in browser (file:// or localhost)
3. Open browser DevTools Console (F12)
4. Verify console shows: `[Lutem Config] Environment: 💻 DEVELOPMENT`
5. Verify console shows: `[Lutem Config] API URL: http://localhost:8080`
6. Test recommendation flow - should work with local backend

### Phase 2: Deploy Backend to Railway
1. Create Railway account, connect GitHub repo
2. Deploy from `main` branch, root directory `/backend`
3. Update CORS in `WebConfig.java` to allow `lutem.3lands.ch`
4. Get the Railway URL (like `https://xxx.up.railway.app`)
5. **Update `config.js` with actual Railway URL** (line 16)
6. Test that `/games` endpoint returns JSON

### Phase 3: Deploy Frontend to Netlify  
1. Commit and push changes to GitHub
2. Create Netlify account, deploy from GitHub
3. Configure: Base directory = `frontend`, no build command
4. Test Netlify URL works

### Phase 4: Connect Domain
1. In Netlify: Add custom domain `lutem.3lands.ch`
2. In DNS settings: Add CNAME `lutem` → `xxx.netlify.app`
3. Wait for SSL certificate
4. Test `https://lutem.3lands.ch`

## Files Modified in Phase 1
```
frontend/js/config.js     (CREATED - environment detection)
frontend/js/api.js        (MODIFIED - uses Config.API_URL)
frontend/demo-mode.js     (MODIFIED - uses Config for checkBackendAvailable)
frontend/index.html       (MODIFIED - config.js loads first)
docs/DEPLOYMENT_PLAN.md   (UPDATED - Phase 1 marked complete)
```

## Important Notes
- Read `docs/DEPLOYMENT_PLAN.md` for full details and code snippets
- Railway free tier = 500 hrs/month (plenty for demo usage)
- SQLite data resets on each Railway deploy (games reload from code, feedback doesn't persist)
- Both services auto-deploy on push to `main`
- The TODO in config.js line 16 needs the actual Railway URL after Phase 2

## Continue Command
```
Test Phase 1: Open browser console and verify Config is detecting development environment.
Then proceed to Phase 2: Railway deployment.
```
