# Session: Phase 9 — User Profiles

## Context
Lutem is a gaming recommendation app. PostgreSQL and Firestore are set up. Firebase Auth works. Profile data is auto-created on first sign-in but the Profile tab form doesn't save to Firestore yet.

## Project
- Location: `D:\Lutem\LutemPrototype`
- GitHub: https://github.com/jantobiaswilhelm/LutemPrototype
- Live: https://lutembeta.netlify.app

## Goal
Connect the Profile tab form to Firestore so user preferences persist across devices.

## Current State
- `frontend/js/firestore.js` — Has `getUserProfile()`, `saveUserProfile()` ready
- `frontend/js/auth.js` — Creates profile on first sign-in, caches in `window.userProfile`
- `frontend/js/profile.js` — Currently saves to localStorage (needs update)
- Profile form exists in `frontend/index.html` (Profile tab section)

## Tasks

### 1. Load Profile into Form
When Profile tab opens (if authenticated):
- Call `getUserProfile(uid)` 
- Populate form fields with saved values
- Show loading state while fetching

### 2. Save Profile to Firestore
On form submit:
- Gather form values
- Call `saveUserProfile(uid, data)`
- Show "Saved!" confirmation
- Update `window.userProfile` cache

### 3. Handle Edge Cases
- First-time user (empty profile) — show defaults
- Not authenticated — show sign-in prompt (already done)
- Save error — show error message, don't lose form data

### 4. Pass Preferences to Recommendations (Optional)
When requesting recommendation, include user preferences:
```javascript
// In wizard.js or recommendations.js
const prefs = window.userProfile || {};
fetch('/recommendations', {
    body: JSON.stringify({
        ...wizardData,
        userPreferences: {
            preferredGenres: prefs.preferredGenres,
            engagementLevel: prefs.engagementLevel
        }
    })
});
```

## Key Files
```
frontend/js/profile.js    — UPDATE THIS
frontend/js/firestore.js  — Already has CRUD functions
frontend/js/auth.js       — Has window.userProfile
frontend/index.html       — Profile form HTML
```

## Commands
```bash
# Start backend
D:\Lutem\LutemPrototype\start-backend.bat

# Start frontend
cd D:\Lutem\LutemPrototype\frontend
python -m http.server 5500
# Access: http://localhost:5500
```

## Test Checklist
- [ ] Sign in with Google
- [ ] Open Profile tab — form loads saved data
- [ ] Change preferences, click Save
- [ ] Refresh page — changes persist
- [ ] Sign out, sign in again — data still there
- [ ] Check Firebase Console → Firestore → users/{uid}

## Don't Do
- Don't modify Firestore security rules (already set)
- Don't change auth flow (already works)
- Don't add new profile fields (use existing ones)

## Definition of Done
- Profile form loads from Firestore
- Profile form saves to Firestore
- Loading/saving states shown
- Works on production (Netlify)
