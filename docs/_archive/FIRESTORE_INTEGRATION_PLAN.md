# Firestore Integration Plan

**Created:** December 2, 2025  
**Goal:** Set up Firestore for user data (profiles, sessions, feedback)  
**Priority:** 🔴 CRITICAL — Foundation for personalization  
**Depends on:** Phase 7 (PostgreSQL Migration)  
**Estimated:** 1-2 sessions (4-6 hours)

---

## Why Firestore?

| Feature | PostgreSQL | Firestore |
|---------|------------|-----------|
| Game catalog | ✅ Best fit | ❌ Overkill |
| User profiles | ⚠️ Works | ✅ Best fit |
| Session history | ⚠️ Works | ✅ Best fit |
| Real-time sync | ❌ Manual | ✅ Built-in |
| Offline support | ❌ No | ✅ Built-in |
| Scaling | Manual | Automatic |
| Cost | Per instance | Per operation |

**Decision:** 
- PostgreSQL = Game data, calendar events (shared, relational)
- Firestore = User data (per-user, real-time, scalable)

---

## Data Model

### Collection Structure

```
firestore-root/
│
├── users/                          # Collection
│   └── {firebaseUid}/              # Document (one per user)
│       │
│       ├── (profile fields)        # Top-level fields in document
│       │   ├── email
│       │   ├── displayName
│       │   ├── preferredGenres[]
│       │   ├── typicalSessionLength
│       │   ├── engagementLevel
│       │   ├── preferredGamingTimes[]
│       │   ├── primaryGoal
│       │   ├── emotionalGoals[]
│       │   ├── createdAt
│       │   └── updatedAt
│       │
│       ├── sessions/               # Subcollection
│       │   └── {sessionId}/
│       │       ├── gameId
│       │       ├── gameName
│       │       ├── startTime
│       │       ├── endTime
│       │       ├── source
│       │       ├── satisfaction
│       │       ├── moodTag
│       │       └── createdAt
│       │
│       └── stats/                  # Subcollection (computed)
│           └── weekly/
│               └── {yyyy-Www}/     # e.g., "2025-W49"
│                   ├── sessionsCount
│                   ├── totalMinutes
│                   ├── avgSatisfaction
│                   └── topGames[]
```

---

## Implementation Steps

### Step 1: Enable Firestore (10 min)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your Lutem project
3. Click "Firestore Database" in left sidebar
4. Click "Create database"
5. Choose "Start in production mode" (we'll set rules)
6. Select location: `europe-west` (closest to Switzerland)
7. Click "Enable"

**Checkpoint:** Firestore database created

---

### Step 2: Set Security Rules (15 min)

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Sessions subcollection
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Stats subcollection (read-only for users, written by Cloud Functions later)
      match /stats/{document=**} {
        allow read: if request.auth != null && request.auth.uid == userId;
        allow write: if false; // Only backend/cloud functions can write
      }
    }
    
    // Deny everything else by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Click "Publish" to deploy rules.

**Checkpoint:** Security rules deployed

---

### Step 3: Add Firestore SDK to Frontend (20 min)

**Check if Firebase is already included:**

Look in `frontend/index.html` for Firebase imports. You probably have:
```html
<script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-auth-compat.js"></script>
```

**Add Firestore:**
```html
<script src="https://www.gstatic.com/firebasejs/10.x.x/firebase-firestore-compat.js"></script>
```

**Or if using modules:**
```javascript
import { getFirestore } from 'firebase/firestore';
```

**Tasks:**
- [ ] Add Firestore script/import
- [ ] Verify Firebase version matches existing imports

---

### Step 4: Create Firestore Module (30 min)

**File:** `frontend/js/firestore.js`

```javascript
// ============================================
// FIRESTORE DATABASE OPERATIONS
// ============================================

/**
 * Get Firestore database instance
 */
function getDb() {
    return firebase.firestore();
}

// ==========================================
// USER PROFILE OPERATIONS
// ==========================================

/**
 * Get user profile from Firestore
 * @param {string} uid - Firebase user ID
 * @returns {Object|null} User profile or null
 */
async function getUserProfile(uid) {
    try {
        const doc = await getDb().collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
}

/**
 * Save user profile to Firestore
 * @param {string} uid - Firebase user ID  
 * @param {Object} profileData - Profile data to save
 */
async function saveUserProfile(uid, profileData) {
    try {
        await getDb().collection('users').doc(uid).set({
            ...profileData,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error('Error saving user profile:', error);
        throw error;
    }
}

/**
 * Create initial profile for new user
 * @param {string} uid - Firebase user ID
 * @param {Object} authData - Data from Firebase Auth
 */
async function createUserProfile(uid, authData) {
    const initialProfile = {
        email: authData.email || '',
        displayName: authData.displayName || '',
        photoURL: authData.photoURL || '',
        
        // Default preferences
        preferredGenres: [],
        typicalSessionLength: '30-60',
        engagementLevel: 'moderate',
        preferredGamingTimes: ['evening'],
        primaryGoal: 'relaxation',
        emotionalGoals: [],
        
        // Meta
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        profileComplete: false
    };
    
    await getDb().collection('users').doc(uid).set(initialProfile);
    return initialProfile;
}

// ==========================================
// SESSION OPERATIONS (for Phase 10)
// ==========================================

/**
 * Log a gaming session
 * @param {string} uid - Firebase user ID
 * @param {Object} sessionData - Session data
 */
async function logSession(uid, sessionData) {
    try {
        await getDb()
            .collection('users')
            .doc(uid)
            .collection('sessions')
            .add({
                ...sessionData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Error logging session:', error);
        throw error;
    }
}

/**
 * Get user's recent sessions
 * @param {string} uid - Firebase user ID
 * @param {number} limit - Max sessions to return
 */
async function getRecentSessions(uid, limit = 10) {
    try {
        const snapshot = await getDb()
            .collection('users')
            .doc(uid)
            .collection('sessions')
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .get();
        
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting sessions:', error);
        throw error;
    }
}

/**
 * Update session with feedback
 * @param {string} uid - Firebase user ID
 * @param {string} sessionId - Session document ID
 * @param {Object} feedback - Feedback data (satisfaction, moodTag)
 */
async function updateSessionFeedback(uid, sessionId, feedback) {
    try {
        await getDb()
            .collection('users')
            .doc(uid)
            .collection('sessions')
            .doc(sessionId)
            .update({
                satisfaction: feedback.satisfaction,
                moodTag: feedback.moodTag || null,
                feedbackAt: firebase.firestore.FieldValue.serverTimestamp()
            });
    } catch (error) {
        console.error('Error updating session feedback:', error);
        throw error;
    }
}

// ==========================================
// EXPORTS (if using modules)
// ==========================================
// If not using ES modules, these functions are globally available

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getUserProfile,
        saveUserProfile,
        createUserProfile,
        logSession,
        getRecentSessions,
        updateSessionFeedback
    };
}
```

**Tasks:**
- [ ] Create `firestore.js`
- [ ] Add script to `index.html` (after Firebase scripts, before other JS)
- [ ] Test basic operations in console

---

### Step 5: Integrate with Auth Flow (20 min)

**File:** `frontend/js/auth.js`

Update the auth state handler to check/create Firestore profile:

```javascript
// In onAuthStateChanged callback, after successful sign-in:

firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // ... existing auth UI updates ...
        
        // Check if Firestore profile exists
        try {
            let profile = await getUserProfile(user.uid);
            
            if (!profile) {
                // First-time user - create profile
                console.log('Creating new user profile...');
                profile = await createUserProfile(user.uid, {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                });
            }
            
            // Cache profile in memory
            window.userProfile = profile;
            console.log('User profile loaded:', profile);
            
        } catch (error) {
            console.error('Error loading profile:', error);
            // Don't block auth - profile can be created later
            window.userProfile = {};
        }
        
    } else {
        // User signed out
        window.userProfile = null;
    }
});
```

**Tasks:**
- [ ] Update auth.js with Firestore profile check
- [ ] Test sign-in creates profile
- [ ] Test sign-in loads existing profile
- [ ] Verify profile appears in Firebase Console

---

### Step 6: Test Firestore Integration (20 min)

**Manual testing:**

1. Open browser console
2. Sign in with Google
3. Check console for "User profile loaded"
4. Go to Firebase Console → Firestore
5. Verify `users/{uid}` document exists
6. Verify fields are populated

**Console tests:**
```javascript
// Get current user's profile
const profile = await getUserProfile(firebase.auth().currentUser.uid);
console.log(profile);

// Update a preference
await saveUserProfile(firebase.auth().currentUser.uid, {
    preferredGenres: ['RPG', 'Puzzle']
});

// Verify in Firebase Console
```

**Tasks:**
- [ ] Profile created on first sign-in
- [ ] Profile loads on subsequent sign-ins
- [ ] Profile updates save correctly
- [ ] Data visible in Firebase Console

---

## Firestore Pricing (Free Tier)

| Operation | Free Limit | Notes |
|-----------|------------|-------|
| Reads | 50,000/day | Profile load = 1 read |
| Writes | 20,000/day | Profile save = 1 write |
| Deletes | 20,000/day | Rarely needed |
| Storage | 1 GB | Plenty for profiles |

**Estimate:** 
- 100 active users × 10 reads/day = 1,000 reads/day
- Well within free tier for early growth

---

## Troubleshooting

### "Missing or insufficient permissions"
- Check security rules are published
- Verify user is signed in: `firebase.auth().currentUser`
- Check uid matches document path

### "Firestore not defined"
- Add Firestore script to index.html
- Check script order (Firebase core → Auth → Firestore)

### Data not appearing in Console
- Check correct Firebase project selected
- Look in correct region
- Refresh Console page

---

## Definition of Done

Phase 8 complete when:
- [ ] Firestore database created
- [ ] Security rules deployed
- [ ] Firestore SDK added to frontend
- [ ] `firestore.js` module created
- [ ] Auth flow creates profile for new users
- [ ] Auth flow loads profile for existing users
- [ ] Profile data visible in Firebase Console
- [ ] Basic CRUD operations work from console

---

## Next Steps

After Firestore setup:
→ **Phase 9: User Profiles** (connect profile form to Firestore)
→ **Phase 10: Session Tracking** (log sessions, collect feedback)
