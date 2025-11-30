# Lutem Bugs Tracking

## 🔴 Active Bugs - Production (November 30, 2025)

### Critical: Railway Backend CORS Issues

**Symptoms:**
All API calls from `lutembeta.netlify.app` to `lutemprototype-production.up.railway.app` are failing with CORS errors.

---

### Bug #7: CORS Policy Blocking All Backend Requests
**Priority:** CRITICAL
**Status:** 🔴 Open

**Error Messages:**
```
Access to fetch at 'https://lutemprototype-production.up.railway.app/games' from origin 'https://lutembeta.netlify.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Affected Endpoints:**
- `/games` - Game library loading
- `/calendar/events` - Calendar events loading
- All other backend endpoints

**Root Cause Analysis:**
The CORS configuration in `WebConfig.java` IS correct - it includes `lutembeta.netlify.app`.

**The REAL issue is likely:**
1. **Railway backend is NOT RUNNING** - The application may have crashed on startup
2. Railway free tier may have put the service to sleep
3. Railway deployment may have failed

**Investigation Needed:**
- Check Railway dashboard for deployment status
- Check Railway logs for startup errors
- Verify the service is actually running and healthy

**Fix Required:**
1. Go to Railway dashboard
2. Check if the service is running (green status)
3. Check deployment logs for errors
4. If crashed, redeploy or fix the startup issue

---

### Bug #8: Firebase Auth - Unauthorized Domain
**Priority:** HIGH
**Status:** 🔴 Open

**Error Messages:**
```
Firebase: Error (auth/unauthorized-domain)
Info: The current domain is not authorized for OAuth operations.
Add your domain (lutembeta.netlify.app) to the OAuth redirect domains list in the Firebase console -> Authentication -> Settings -> Authorized domains tab.
```

**Root Cause:**
The domain `lutembeta.netlify.app` is not added to Firebase's authorized domains list.

**Fix Required:**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `lutem-68f3a`
3. Navigate to Authentication → Settings → Authorized domains
4. Add `lutembeta.netlify.app` to the list
5. Save changes

---

### Bug #9: Auth Module Using Wrong API URL Variable
**Priority:** MEDIUM  
**Status:** 🔴 Open

**Error Messages:**
```
localhost:8080/auth/me: Failed to load resource: net::ERR_CONNECTION_REFUSED
Backend sync error (server may be offline): Failed to fetch
```

**Root Cause:**
In `auth.js` line 92:
```javascript
const response = await fetch(`${window.API_URL || 'http://localhost:8080'}/auth/me`, {
```

But `config.js` sets:
```javascript
window.LutemConfig.API_URL  // NOT window.API_URL
```

The auth module falls back to `localhost:8080` because `window.API_URL` is undefined.

**Fix Required:**
Change in `auth.js`:
```javascript
// FROM:
${window.API_URL || 'http://localhost:8080'}

// TO:
${window.LutemConfig?.API_URL || 'http://localhost:8080'}
```

Or add to `config.js`:
```javascript
window.API_URL = API_URL;  // Backwards compatibility
```

---

## Analysis Summary

| Bug | Type | Severity | Root Cause | Fix Location |
|-----|------|----------|------------|--------------|
| #7 | CORS | CRITICAL | Railway backend likely not running | Railway Dashboard |
| #8 | Firebase | HIGH | Domain not in authorized list | Firebase Console |
| #9 | Config | MEDIUM | Wrong variable name in auth.js | auth.js line 92 |

---

## Investigation Order

1. **First**: Check Railway - if backend isn't running, CORS errors are a symptom, not the cause
2. **Second**: Add domain to Firebase Console
3. **Third**: Fix the API URL variable in auth.js

---

## Previous Bugs (Resolved)

### 1. ✅ Corrupted emoji in gaming session titles (FIXED)
### 2. ✅ Corrupted emoji on create task button (FIXED)
### 3. ✅ Game cover images not loading in browse library (FIXED)
### 4. ✅ Default to Gaming Session tab when clicking time slot (FIXED)
### 5. ✅ Add Event button placement (FIXED)
### 6. ✅ Two separate buttons for gaming/task (FIXED)

---

**Last Updated:** November 30, 2025
