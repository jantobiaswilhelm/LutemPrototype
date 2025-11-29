# Lutem Deployment Plan

**Goal:** Deploy Lutem to `lutem.3lands.ch` with continuous deployment from `main` branch.

**Architecture:**
```
lutem.3lands.ch (your domain)
        │
        ▼
   ┌─────────────┐
   │   Netlify   │  ← Frontend (static HTML/CSS/JS)
   │   (FREE)    │     Auto-deploys on push to main
   └─────────────┘
        │
        │ API calls
        ▼
┌──────────────────┐
│     Railway      │  ← Backend (Spring Boot + SQLite)
│     (FREE)       │     Auto-deploys on push to main
│  [api subdomain] │
└──────────────────┘
```

---

## Phase 1: Environment Configuration (Frontend)

**Status:** ✅ COMPLETE (2025-11-29)

### 1.1 Create API Configuration Module

Create `frontend/js/config.js` with runtime environment detection:

```javascript
/**
 * Lutem - Configuration Module
 * Auto-detects environment and sets appropriate API URL
 */

const Config = (function() {
    // Detect environment based on hostname
    const isProduction = !window.location.hostname.includes('localhost') 
                        && !window.location.hostname.includes('127.0.0.1');
    
    // API URLs
    const PRODUCTION_API_URL = 'https://YOUR-RAILWAY-URL.up.railway.app';
    const DEVELOPMENT_API_URL = 'http://localhost:8080';
    
    const API_URL = isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;
    
    console.log(`[Lutem] Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`[Lutem] API URL: ${API_URL}`);
    
    return {
        API_URL,
        API_BASE_URL: API_URL,
        isProduction,
        isDevelopment: !isProduction
    };
})();
```

### 1.2 Update api.js to Use Config

Replace hardcoded URLs in `frontend/js/api.js`:

```javascript
// OLD:
const API_URL = 'http://localhost:8080';
const API_BASE_URL = 'http://localhost:8080';

// NEW:
const API_URL = Config.API_URL;
const API_BASE_URL = Config.API_BASE_URL;
```

### 1.3 Update demo-mode.js

Replace hardcoded localhost check with Config-aware check.

### 1.4 Update index.html Script Loading Order

Ensure `config.js` loads BEFORE `api.js`:

```html
<script src="js/config.js"></script>
<script src="js/api.js"></script>
```

### 1.5 Test Locally

- [ ] Start backend with `start-backend.bat`
- [ ] Open frontend - should detect `localhost` and use local API
- [ ] Verify recommendations work

---

## Phase 2: Backend Deployment (Railway)

**Status:** ⬜ Not Started

### 2.1 Railway Account Setup

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → "Deploy from GitHub repo"
4. Select `jantobiaswilhelm/LutemPrototype`
5. Select branch: `main` (or `refactor` if that's your working branch)
6. Set root directory: `/backend`

### 2.2 Railway Configuration

Railway should auto-detect Spring Boot. If not, add these settings:

**Build Command:**
```bash
./mvnw clean package -DskipTests
```

**Start Command:**
```bash
java -jar target/lutem-mvp-0.0.1-SNAPSHOT.jar
```

**Environment Variables:**
```
PORT=8080
SPRING_PROFILES_ACTIVE=production
```

### 2.3 Database Consideration

Current setup uses SQLite file (`lutem.db`). For Railway:

**Option A: Keep SQLite (Simpler, fine for MVP)**
- SQLite file will reset on each deploy
- Games reload from `GameDataLoader.java` on startup (57 games)
- Session/feedback data will NOT persist between deploys
- ✅ Good enough for demo/coursework

**Option B: Railway PostgreSQL (Production-ready)**
- Add Railway PostgreSQL addon
- Update `application.properties` for PostgreSQL
- Data persists across deploys
- ⬜ Consider for future if needed

### 2.4 CORS Configuration

Update `backend/src/main/java/com/lutem/mvp/config/WebConfig.java` (or create if missing):

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:5500",      // VS Code Live Server
                "http://localhost:3000",       // Local dev
                "http://127.0.0.1:5500",
                "https://lutem.3lands.ch",     // Production domain
                "https://lutem-prototype.netlify.app"  // Netlify default
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*");
    }
}
```

### 2.5 Get Railway URL

After deployment, Railway provides URL like:
`https://lutemprototype-production.up.railway.app`

Copy this URL for Phase 1 config update.

### 2.6 Test Backend

- [ ] Visit `https://YOUR-RAILWAY-URL.up.railway.app/games` 
- [ ] Should return JSON list of 57 games
- [ ] Test `/recommendations` endpoint with POST request

---

## Phase 3: Frontend Deployment (Netlify)

**Status:** ⬜ Not Started

### 3.1 Update Config with Railway URL

In `frontend/js/config.js`, replace placeholder:

```javascript
const PRODUCTION_API_URL = 'https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app';
```

### 3.2 Commit and Push Changes

```bash
git add .
git commit -m "Add production config for Railway + Netlify deployment"
git push origin main
```

### 3.3 Netlify Account Setup

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. "Add new site" → "Import an existing project"
4. Connect GitHub → Select `LutemPrototype`
5. Configure build settings:

**Build Settings:**
```
Base directory: frontend
Build command: (leave empty - static site)
Publish directory: frontend
```

### 3.4 Netlify Deployment

- Netlify will deploy automatically
- Get URL like `https://lutem-prototype.netlify.app`
- Test that it works and calls Railway backend

### 3.5 Test Production

- [ ] Open Netlify URL
- [ ] Check browser console for "Environment: PRODUCTION"
- [ ] Verify API calls go to Railway URL
- [ ] Test full recommendation flow
- [ ] Test demo mode fallback (if backend unreachable)

---

## Phase 4: Custom Domain Setup

**Status:** ⬜ Not Started

### 4.1 Add Domain in Netlify

1. Netlify Dashboard → Your site → Domain settings
2. "Add custom domain"
3. Enter: `lutem.3lands.ch`

### 4.2 Configure DNS

In your domain provider's DNS settings for `3lands.ch`, add:

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: lutem
Value: lutem-prototype.netlify.app
TTL: 3600 (or Auto)
```

**Option B: If CNAME doesn't work (root domain)**
```
Type: A
Name: lutem
Value: 75.2.60.5 (Netlify load balancer)
TTL: 3600
```

### 4.3 Enable HTTPS

1. Netlify automatically provisions SSL certificate
2. Wait 5-15 minutes after DNS propagation
3. Force HTTPS in Netlify settings

### 4.4 Verify

- [ ] Visit `https://lutem.3lands.ch`
- [ ] Verify HTTPS (padlock icon)
- [ ] Test full app functionality
- [ ] Check API calls work correctly

---

## Phase 5: Continuous Deployment Setup

**Status:** ⬜ Automatic (once Phases 2-3 complete)

### How It Works

Once set up, the workflow is:

1. **You make changes** on `main` branch
2. **Push to GitHub**
3. **Railway auto-deploys** backend (2-3 min)
4. **Netlify auto-deploys** frontend (30 sec - 1 min)
5. **Live at** `lutem.3lands.ch`

### Deploy Hooks (Optional)

Both services support webhooks if you want notifications.

---

## Checklist Summary

### Phase 1: Environment Config
- [x] Create `frontend/js/config.js`
- [x] Update `frontend/js/api.js` to use Config
- [x] Update `frontend/demo-mode.js`
- [x] Update `frontend/index.html` script order
- [ ] Test locally (backend + frontend - User to verify)

### Phase 2: Railway Backend
- [ ] Create Railway account
- [ ] Deploy from GitHub
- [ ] Configure build settings
- [ ] Verify CORS config
- [ ] Get Railway URL
- [ ] Test API endpoints

### Phase 3: Netlify Frontend
- [ ] Update config with Railway URL
- [ ] Commit and push
- [ ] Create Netlify account
- [ ] Deploy from GitHub
- [ ] Test production build

### Phase 4: Custom Domain
- [ ] Add domain in Netlify
- [ ] Configure DNS (CNAME)
- [ ] Enable HTTPS
- [ ] Verify everything works

---

## Troubleshooting

### "CORS error" in browser console
- Check `WebConfig.java` includes your domain
- Redeploy backend after CORS changes

### "Failed to fetch" API errors
- Verify Railway backend is running
- Check Railway logs for errors
- Verify `config.js` has correct Railway URL

### Demo mode activating on production
- Check console for which API URL is being used
- Verify `isProduction` detection is working

### DNS not resolving
- Wait up to 24-48 hours for propagation
- Use `dig lutem.3lands.ch` to check DNS
- Verify CNAME record is correct

---

## Cost Estimate

| Service | Tier | Monthly Cost |
|---------|------|--------------|
| Railway | Free (Hobby) | $0 (500 hrs/month) |
| Netlify | Free | $0 |
| Domain | Already owned | $0 |
| **Total** | | **$0** |

Note: Railway free tier is 500 hours/month. If your app runs 24/7, that's ~21 days. For a demo/coursework app with occasional use, this is plenty. Upgrade to $5/month if needed.

---

## Files Changed

After completing this plan, these files will be modified:

```
frontend/
├── js/
│   ├── config.js      (NEW - environment detection)
│   └── api.js         (MODIFIED - use Config)
├── demo-mode.js       (MODIFIED - use Config)  
└── index.html         (MODIFIED - script order)

backend/
└── src/main/java/com/lutem/mvp/config/
    └── WebConfig.java (MODIFIED - CORS origins)
```

---

*Last Updated: 2025-01-29*
*Plan Version: 1.0*
