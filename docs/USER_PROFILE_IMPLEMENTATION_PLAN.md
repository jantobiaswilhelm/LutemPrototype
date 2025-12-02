# User Profile System - Implementation Plan

**Created:** December 2, 2025  
**Updated:** December 2, 2025  
**Goal:** Persist user preferences in Firestore, use them in recommendations  
**Depends on:** Phase 8 (Firestore Integration)  
**Estimated:** 1-2 sessions (4-6 hours) after Firestore is set up

---

## Architecture

### Data Flow
```
User saves profile
       │
       ▼
┌─────────────────┐
│    Frontend     │
│   profile.js    │
└────────┬────────┘
         │ Firestore SDK
         ▼
┌─────────────────┐
│    Firestore    │
│  users/{uid}/   │
│    profile      │
└─────────────────┘

User requests recommendation
       │
       ▼
┌─────────────────┐
│    Frontend     │──── Load profile from Firestore
│   wizard.js     │
└────────┬────────┘
         │ Include preferences in request
         ▼
┌─────────────────┐
│  Spring Boot    │
│  /recommendations│
└─────────────────┘
```

### Why Firestore for Profiles?
- Real-time sync across devices
- Offline support built-in
- Scales infinitely
- Already using Firebase Auth
- Frontend can read/write directly (no backend changes for basic CRUD)

### Why Backend Still Involved?
- Recommendation algorithm runs on backend
- Game data lives in PostgreSQL
- Frontend passes preferences WITH the recommendation request
- Backend doesn't need direct Firestore access (simpler)

---

## Firestore Data Model

### Collection: `users/{firebaseUid}`

```javascript
// Document: users/{firebaseUid}
{
  // Basic info (synced from Firebase Auth)
  email: "user@example.com",
  displayName: "Patrick",
  photoURL: "https://...",
  
  // Gaming preferences
  preferredGenres: ["RPG", "Puzzle", "Strategy"],
  typicalSessionLength: "30-60",  // "5-15", "15-30", "30-60", "60+"
  engagementLevel: "moderate",     // "casual", "moderate", "intense"
  
  // Schedule preferences
  preferredGamingTimes: ["afternoon", "evening"],
  
  // Goals
  primaryGoal: "relaxation",  // "relaxation", "achievement", "exploration", "social", "challenge"
  emotionalGoals: ["Unwind", "Recharge"],
  
  // Meta
  createdAt: Timestamp,
  updatedAt: Timestamp,
  profileComplete: true
}
```

---

## Implementation Steps

### Prerequisites
- [ ] Firestore enabled in Firebase Console
- [ ] Security rules deployed
- [ ] Firebase JS SDK initialized in frontend

---

### Step 1: Create Firestore Module
**File:** `frontend/js/firestore.js`

```javascript
// Initialize Firestore
import { getFirestore, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const db = getFirestore();

// Get user profile
export async function getUserProfile(uid) {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        return docSnap.data();
    }
    return null;
}

// Save user profile
export async function saveUserProfile(uid, profileData) {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
        ...profileData,
        updatedAt: new Date()
    }, { merge: true });
}

// Create initial profile (on first sign-in)
export async function createUserProfile(uid, authData) {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
        email: authData.email,
        displayName: authData.displayName || '',
        photoURL: authData.photoURL || '',
        preferredGenres: [],
        typicalSessionLength: '30-60',
        engagementLevel: 'moderate',
        preferredGamingTimes: ['evening'],
        primaryGoal: 'relaxation',
        emotionalGoals: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        profileComplete: false
    });
}
```

**Tasks:**
- [ ] Create `firestore.js`
- [ ] Export CRUD functions
- [ ] Handle errors gracefully

---

### Step 2: Update Auth Flow
**File:** `frontend/js/auth.js`

On sign-in, check if profile exists. If not, create it.

```javascript
firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
        // Check if profile exists
        const profile = await getUserProfile(user.uid);
        
        if (!profile) {
            // First-time user — create profile
            await createUserProfile(user.uid, {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL
            });
        }
        
        // Store profile in memory for quick access
        window.userProfile = profile || {};
    }
});
```

**Tasks:**
- [ ] Import Firestore functions into auth.js
- [ ] Check/create profile on sign-in
- [ ] Cache profile in memory

---

### Step 3: Update Profile Page
**File:** `frontend/js/profile.js`

Replace localStorage with Firestore.

```javascript
async function saveProfile() {
    const user = firebase.auth().currentUser;
    if (!user) {
        showToast('Please sign in to save your profile', 'error');
        return;
    }
    
    showSaveLoading(true);
    
    const profileData = {
        displayName: document.getElementById('displayName').value,
        preferredGenres: getSelectedGenres(),
        typicalSessionLength: document.getElementById('sessionLength').value,
        engagementLevel: document.getElementById('engagementLevel').value,
        preferredGamingTimes: getSelectedGamingTimes(),
        primaryGoal: getSelectedPriority(),
        emotionalGoals: getSelectedEmotionalGoals(),
        profileComplete: true
    };
    
    try {
        await saveUserProfile(user.uid, profileData);
        window.userProfile = { ...window.userProfile, ...profileData };
        showToast('Profile saved!', 'success');
    } catch (error) {
        console.error('Error saving profile:', error);
        showToast('Failed to save profile', 'error');
    } finally {
        showSaveLoading(false);
    }
}

async function loadProfile() {
    const user = firebase.auth().currentUser;
    if (!user) return;
    
    const profile = await getUserProfile(user.uid);
    if (profile) {
        populateForm(profile);
        window.userProfile = profile;
    }
}
```

**Tasks:**
- [ ] Replace `saveProfile()` with Firestore version
- [ ] Replace `loadProfile()` with Firestore version
- [ ] Add loading states
- [ ] Add error handling
- [ ] Keep localStorage as offline fallback (optional)

---

### Step 4: Include Preferences in Recommendations
**File:** `frontend/js/wizard.js` or `recommendation.js`

When requesting recommendations, include user preferences:

```javascript
async function getRecommendation() {
    const profile = window.userProfile || {};
    
    const request = {
        // Existing fields
        availableMinutes: selectedTime,
        desiredMood: selectedMood,
        energyLevel: selectedEnergy,
        timeOfDay: getTimeOfDay(),
        socialPreference: selectedSocial,
        
        // NEW: User preferences
        preferredGenres: profile.preferredGenres || [],
        engagementLevel: profile.engagementLevel || 'moderate',
        primaryGoal: profile.primaryGoal || null
    };
    
    const response = await fetch(`${API_BASE_URL}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
    });
    
    // ... handle response
}
```

**Tasks:**
- [ ] Load profile into memory on page load
- [ ] Include preferences in recommendation request
- [ ] Handle missing preferences gracefully

---

### Step 5: Backend — Handle Preferences
**File:** `backend/.../dto/RecommendationRequest.java`

Add optional preference fields:

```java
public class RecommendationRequest {
    // Existing
    private int availableMinutes;
    private EmotionalGoal desiredMood;
    private EnergyLevel energyLevel;
    private TimeOfDay timeOfDay;
    private SocialPreference socialPreference;
    
    // NEW: Optional user preferences
    private List<String> preferredGenres;
    private String engagementLevel;
    private String primaryGoal;
    
    // Getters, setters...
}
```

**File:** `backend/.../service/GameService.java` or recommendation logic

Boost games matching preferences:

```java
// In scoring logic
if (preferredGenres != null && preferredGenres.contains(game.getGenre())) {
    score += 10; // Bonus for preferred genre
}
```

**Tasks:**
- [ ] Add preference fields to RecommendationRequest
- [ ] Update recommendation algorithm to use preferences
- [ ] Test with and without preferences

---

### Step 6: UI Polish
- [ ] Add "Personalized" badge when user is logged in with profile
- [ ] Show "Complete your profile for better recommendations" prompt
- [ ] Add profile completion percentage indicator
- [ ] Style save button with loading state

---

## Testing Checklist

### Firestore
- [ ] Profile saves to Firestore (check Firebase Console)
- [ ] Profile loads on page refresh
- [ ] Profile syncs across devices (same account)
- [ ] New user gets empty profile created

### Profile Page
- [ ] All fields save correctly
- [ ] All fields load correctly
- [ ] Loading state shows during save
- [ ] Error toast on failure
- [ ] Success toast on save

### Recommendations
- [ ] Logged-out users get normal recommendations
- [ ] Logged-in users with empty profile get normal recommendations
- [ ] Logged-in users with preferences get boosted genres
- [ ] Preference boost is noticeable but not overwhelming

---

## Security Considerations

### Firestore Rules (Critical!)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can only read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy these rules BEFORE going live.

---

## Session Handoff Prompt

```
I'm implementing the User Profile system for Lutem using Firestore.

Project: D:\Lutem\LutemPrototype
Plan: D:\Lutem\LutemPrototype\docs\USER_PROFILE_IMPLEMENTATION_PLAN.md

Prerequisites check:
- Is Firestore enabled? (Phase 8)
- Are security rules deployed?

Key files:
- Frontend: frontend/js/firestore.js (create new)
- Frontend: frontend/js/profile.js (update)
- Frontend: frontend/js/auth.js (update)
- Backend: RecommendationRequest.java (add fields)

Start backend: D:\Lutem\LutemPrototype\start-backend.bat
Start frontend: python -m http.server 5500 from frontend folder
```

---

## Definition of Done

Phase 9 is complete when:
- [x] Firestore module created
- [x] Profile saves to Firestore
- [x] Profile loads on sign-in
- [x] Profile persists across devices
- [x] Recommendations include preference data
- [x] Backend boosts preferred genres
- [x] UI shows personalization status
