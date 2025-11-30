# Lutem Deployment Plan

**Goal:** Deploy Lutem to `lutem.3lands.ch` with manual deployment (auto-deploy disabled).

**Status:** ✅ ALL PHASES COMPLETE | Full Production Deployment

## Production URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://lutembeta.netlify.app | ✅ LIVE |
| **Backend API** | https://lutemprototype-production.up.railway.app | ✅ LIVE |
| **Games Endpoint** | https://lutemprototype-production.up.railway.app/games | ✅ 57 games |
| **Custom Domain** | https://lutem.3lands.ch | ✅ LIVE |

## Architecture

```
lutembeta.netlify.app (current)
lutem.3lands.ch (custom domain)
        │
        ▼
   ┌─────────────┐
   │   Netlify   │  ← Frontend (static HTML/CSS/JS)
   │   (FREE)    │     Auto-deploys on push to main
   └─────────────┘
        │
        │ API calls
        ▼
┌──────────────────────────────────────────┐
│              Railway                      │
│  lutemprototype-production.up.railway.app │
│  Backend (Spring Boot + SQLite)           │
│  Auto-deploys on push to main             │
│  Firebase Admin SDK for auth validation   │
└──────────────────────────────────────────┘
        │
        │ Token validation
        ▼
┌──────────────────────────────────────────┐
│            Firebase Auth                  │
│  Project: lutem-68f3a                     │
│  Google Sign-in + Email/Password          │
└──────────────────────────────────────────┘
```

---

## Phase 1: Environment Configuration ✅ COMPLETE

**Completed:** 2025-11-29

### What Was Done

- Created `frontend/js/config.js` with runtime environment detection
- Updated `frontend/js/api.js` to use Config module
- Updated `frontend/js/demo-mode.js` for production detection
- Updated `frontend/index.html` script loading order (config.js loads first)

### Key File: config.js
```javascript
const Config = (function() {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isProduction = !isLocalhost;
    
    const PRODUCTION_API_URL = 'https://lutemprototype-production.up.railway.app';
    const DEVELOPMENT_API_URL = 'http://localhost:8080';
    
    const API_URL = isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;
    
    return {
        API_URL,
        API_BASE_URL: API_URL,
        isProduction,
        isDevelopment: !isProduction
    };
})();
```

---

## Phase 2: Railway Backend Deployment ✅ COMPLETE

**Completed:** 2025-11-29  
**URL:** https://lutemprototype-production.up.railway.app

### What Was Done
- Created Railway account and connected GitHub repo
- Deployed from `jantobiaswilhelm/LutemPrototype`
- Root directory: `/backend`
- Created centralized CORS configuration in `WebConfig.java`
- Removed `@CrossOrigin` annotations from controllers
- Fixed `mvnw` execute permissions for Linux build environment
- Reduced logging verbosity for production

### Railway Build Settings
- **Build Command:** `./mvnw clean package -DskipTests`
- **Start Command:** `java -jar target/lutem-mvp-0.0.1-SNAPSHOT.jar`

### Database
- SQLite file resets on each deploy
- Games reload from `GameDataLoader.java` on startup (57 games)
- Session/feedback data does NOT persist between deploys
- Acceptable for MVP/coursework demo

### CORS Configuration
File: `backend/src/main/java/com/lutem/mvp/config/WebConfig.java`
```java
.allowedOrigins(
    "http://localhost:5500",
    "http://localhost:3000",
    "http://127.0.0.1:5500",
    "http://127.0.0.1:3000",
    "https://lutem.3lands.ch",
    "https://lutembeta.netlify.app",
    "https://lutemprototype-production.up.railway.app"
)
```

---

## Phase 3: Netlify Frontend Deployment ✅ COMPLETE

**Completed:** 2025-11-29  
**URL:** https://lutembeta.netlify.app

### What Was Done
- Created Netlify account and connected GitHub repo
- Deployed from `jantobiaswilhelm/LutemPrototype`
- Configured build settings for static site
- Updated CORS on Railway to allow Netlify domain
- Verified full app functionality

### Netlify Build Settings
- **Base directory:** `frontend`
- **Build command:** *(empty - static site)*
- **Publish directory:** `frontend`

### Verification
- [x] Site loads at https://lutembeta.netlify.app
- [x] Console shows `🌐 PRODUCTION` environment
- [x] API calls reach Railway backend
- [x] 57 games load correctly
- [x] Recommendation wizard works
- [x] Feedback submission works

---

## Phase 4: Custom Domain Setup ✅ COMPLETE

**Completed:** 2025-11-29  
**URL:** https://lutem.3lands.ch

### What Was Done
- Added custom domain in Netlify site settings
- Configured DNS CNAME record at 3lands.ch
- SSL certificate auto-provisioned by Netlify
- CORS already configured in backend

---

## Phase 5: Firebase Authentication ✅ COMPLETE

**Completed:** 2025-11-30

### Firebase Project
- **Project ID:** `lutem-68f3a`
- **Console:** https://console.firebase.google.com/project/lutem-68f3a

### Authentication Setup

#### Frontend (Firebase Client SDK)
- Firebase SDK loaded via CDN in `index.html`
- Configuration in `frontend/js/auth.js`
- Supports Google Sign-in and Email/Password

#### Backend (Firebase Admin SDK)
- Validates Firebase ID tokens on protected endpoints
- Credentials loaded from environment variable (production) or file (development)

### Authorized Domains
In Firebase Console → Authentication → Settings → Authorized domains:
- `localhost`
- `lutembeta.netlify.app`
- `lutem.3lands.ch`

### Railway Environment Variable
**CRITICAL:** The backend requires Firebase credentials to validate tokens.

| Variable | Value |
|----------|-------|
| `FIREBASE_CREDENTIALS` | Full JSON content of service account file |

To set up:
1. Firebase Console → Project Settings → Service Accounts
2. Generate new private key (downloads JSON file)
3. Railway Dashboard → Variables → Add `FIREBASE_CREDENTIALS`
4. Paste entire JSON content as value

### Key Files
```
frontend/js/auth.js                           # Firebase client SDK integration
backend/.../config/FirebaseConfig.java        # Loads credentials from env or file
backend/.../security/FirebaseAuthFilter.java  # Token validation filter
```

### FirebaseConfig.java Logic
```java
// 1. Try environment variable (production/Railway)
String envCredentials = System.getenv("FIREBASE_CREDENTIALS");
if (envCredentials != null) {
    // Parse JSON from env var
}

// 2. Fall back to file (local development)
// Looks for firebase-service-account.json
```

### Local Development
For local development with Firebase auth:
1. Download service account JSON from Firebase Console
2. Save as `backend/firebase-service-account.json`
3. File is gitignored - never commit credentials!

---

## Continuous Deployment ✅ ACTIVE

Both services auto-deploy when you push to `main`:

1. **Push to GitHub** → `main` branch
2. **Railway** auto-deploys backend (2-3 min)
3. **Netlify** auto-deploys frontend (30 sec - 1 min)
4. **Live** at production URLs

---

## Quick Reference

### Local Development
```bash
# Start backend
D:\Lutem\LutemPrototype\start-backend.bat

# Start frontend
D:\Lutem\LutemPrototype\start-frontend.bat

# Or both
D:\Lutem\LutemPrototype\start-lutem.bat
```

### Production Endpoints
| Endpoint | URL |
|----------|-----|
| Frontend | https://lutembeta.netlify.app |
| Games API | https://lutemprototype-production.up.railway.app/games |
| Recommendations | https://lutemprototype-production.up.railway.app/recommendations |
| Feedback | https://lutemprototype-production.up.railway.app/sessions/feedback |

### Key Files
```
frontend/js/config.js              # Environment detection + API URL
frontend/js/api.js                 # API client (uses Config)
frontend/js/auth.js                # Firebase authentication
backend/.../config/WebConfig.java  # CORS configuration
backend/.../config/FirebaseConfig.java  # Firebase Admin SDK setup
```

---

## Cost

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Railway | Free (Hobby) | $0 (500 hrs/month) |
| Netlify | Free | $0 |
| Firebase | Spark (Free) | $0 |
| Domain | Already owned | $0 |
| **Total** | | **$0** |

---

## Troubleshooting

### CORS Error
- Verify domain is in `WebConfig.java`
- Push changes and wait for Railway redeploy (2-3 min)

### API Errors / Demo Mode Activating
- Check browser console for API URL being used
- Verify Railway is running (check dashboard)
- Test: https://lutemprototype-production.up.railway.app/games

### Netlify Not Updating
- Check GitHub push was successful
- Check Netlify deploy logs in dashboard

### Firebase Auth Errors

**"auth/unauthorized-domain"**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

**Backend crashes with "FirebaseAuth bean not found"**
- Check Railway Variables for `FIREBASE_CREDENTIALS`
- Ensure JSON is complete (copy entire file content)
- Check Railway logs for `✅ Loading Firebase credentials from environment variable`

**"localhost:8080" errors in production**
- Ensure `auth.js` uses `window.LutemConfig?.API_URL`
- Clear browser cache / hard refresh

---

*Last Updated: 2025-11-30*  
*Deployment Status: ✅ LIVE*
