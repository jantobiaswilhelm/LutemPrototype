# Lutem Bugs Tracking

## ✅ All Production Bugs Resolved (November 30, 2025)

---

### Bug #7: CORS Policy Blocking All Backend Requests ✅ FIXED
**Priority:** CRITICAL → RESOLVED

**Issue:** Railway backend was crash-looping because Firebase credentials weren't available.

**Root Cause:** 
- `FirebaseAuthFilter` required `FirebaseAuth` bean via constructor injection
- `FirebaseConfig` returned null when no credentials file found
- Spring couldn't inject null, causing startup failure
- No running backend = no CORS headers = CORS errors

**Fix Applied:**
1. Made `FirebaseAuthFilter` use `@Autowired(required = false)` for optional injection
2. Updated `FirebaseConfig` to read credentials from `FIREBASE_CREDENTIALS` env variable
3. Added service account JSON to Railway environment variables

**Files Changed:**
- `backend/.../security/FirebaseAuthFilter.java`
- `backend/.../config/FirebaseConfig.java`

---

### Bug #8: Firebase Auth - Unauthorized Domain ✅ FIXED
**Priority:** HIGH → RESOLVED

**Issue:** Google sign-in failed with `auth/unauthorized-domain` error.

**Root Cause:** Domain `lutembeta.netlify.app` was not in Firebase's authorized domains list.

**Fix Applied:**
1. Added `lutembeta.netlify.app` to Firebase Console
2. Path: Authentication → Settings → Authorized domains

---

### Bug #9: Auth.js Using Wrong API Variable ✅ FIXED
**Priority:** MEDIUM → RESOLVED

**Issue:** `auth.js` was calling `localhost:8080` in production.

**Root Cause:** 
- Code used `window.API_URL` which was undefined
- Fell back to `'http://localhost:8080'`
- `config.js` sets `window.LutemConfig.API_URL`, not `window.API_URL`

**Fix Applied:**
Changed in `auth.js` line 99:
```javascript
// FROM:
${window.API_URL || 'http://localhost:8080'}

// TO:
${window.LutemConfig?.API_URL || 'http://localhost:8080'}
```

**Files Changed:**
- `frontend/js/auth.js`

---

## Summary

| Bug | Type | Root Cause | Fix |
|-----|------|------------|-----|
| #7 | Backend Crash | Firebase credentials not in Railway | Added env var + optional injection |
| #8 | Firebase | Domain not authorized | Added to Firebase Console |
| #9 | Config | Wrong variable name | Updated auth.js to use LutemConfig |

---

## Previous Bugs (UI/Calendar - November 29, 2025)

### 1. ✅ Corrupted emoji in gaming session titles (FIXED)
### 2. ✅ Corrupted emoji on create task button (FIXED)
### 3. ✅ Game cover images not loading in browse library (FIXED)
### 4. ✅ Default to Gaming Session tab when clicking time slot (FIXED)
### 5. ✅ Add Event button placement (FIXED)
### 6. ✅ Two separate buttons for gaming/task (FIXED)

---

## Known Non-Issues (Can Ignore)

These appear in console but are harmless:

**Cross-Origin-Opener-Policy warnings (popup.ts)**
- Browser security policy with Firebase popup
- Sign-in still works correctly
- No fix needed

**"message channel closed" error**
- Caused by browser extensions (password managers, ad blockers)
- Not our code
- No fix needed

---

**Last Updated:** November 30, 2025
**Status:** ✅ All bugs resolved
