# User Authentication Implementation Plan

## Overview

Implement Firebase Authentication to enable user accounts with gated features (Calendar, Profile) while keeping the core recommendation wizard accessible to everyone.

---

## Access Control Matrix

| Feature | Anonymous | Logged In | Notes |
|---------|-----------|-----------|-------|
| **Home Tab** | ✅ Full access | ✅ Full access | Core value prop, no restriction |
| **Recommendation Wizard** | ✅ Full access | ✅ Full access | Let anyone try it |
| **Games Library** | ✅ View only | ✅ Full access | Anonymous can browse, users can favorite/rate |
| **Calendar Tab** | ❌ Hidden/Locked | ✅ Full access | Requires persistence |
| **Profile Tab** | ❌ Hidden/Locked | ✅ Full access | Obviously needs account |
| **Feedback/Rating** | ⚠️ Session-only | ✅ Persistent | Anonymous feedback lost on refresh |
| **Stats/History** | ❌ None | ✅ Full access | Needs account to track |

---

## Demo Mode Strategy

Demo mode becomes a **fallback**, not a user state:

| Scenario | Backend | Behavior |
|----------|---------|----------|
| **Anonymous user** | ✅ Online | Hit real backend, get real recommendations, data not persisted |
| **Anonymous user** | ❌ Offline | Fall back to demo mode (local algorithm) |
| **Logged in user** | ✅ Online | Full persistence, everything saved |
| **Logged in user** | ❌ Offline | Show error, can't function without sync |

---

## Data Model

```
┌────────────────────────────────────────────────────────────┐
│                         User                                │
│  id | firebaseUid | email | displayName | createdAt        │
├────────────────────────────────────────────────────────────┤
│                           │                                 │
│         ┌─────────────────┼─────────────────┐              │
│         ▼                 ▼                 ▼              │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ GameSession │  │ CalendarEvent│  │ UserPreference  │   │
│  │ (feedback)  │  │ (schedules)  │  │ (profile data)  │   │
│  └─────────────┘  └──────────────┘  └─────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Firebase Setup (30 min)

**Prerequisites:**
1. Create Firebase project at https://console.firebase.google.com/
2. Enable Authentication → Sign-in methods → Google and Email/Password
3. Get Firebase config object

**Frontend Tasks:**
- [ ] Add Firebase SDK to index.html
- [ ] Create `frontend/js/auth.js` module with:
  - `initAuth()` - Initialize Firebase and set up auth state listener
  - `signInWithGoogle()` - Google sign-in popup
  - `signInWithEmail(email, password)` - Email/password sign-in
  - `signUp(email, password, displayName)` - Create new account
  - `signOut()` - Sign out current user
  - `getCurrentUser()` - Get current user or null
  - `onAuthStateChanged(callback)` - Auth state listener
  - `getIdToken()` - Get Firebase ID token for API calls
- [ ] Create `authState` object in state.js:
  ```javascript
  window.authState = {
      user: null,           // Firebase user object
      isAuthenticated: false,
      isLoading: true       // True until first auth check completes
  };
  ```
- [ ] Add login/signup modal HTML to index.html
- [ ] Add auth UI styles to CSS

**Files to Create:**
- `frontend/js/auth.js`

**Files to Modify:**
- `frontend/index.html` (add Firebase SDK, auth modal)
- `frontend/css/components.css` (auth modal styles)
- `frontend/js/main.js` (initialize auth)
- `frontend/js/state.js` (add authState)

---

### Phase 2: Backend User Support (45 min)

**Backend Tasks:**
- [ ] Add Firebase Admin SDK dependency to pom.xml
- [ ] Create Firebase configuration class
- [ ] Create `User` entity:
  ```java
  @Entity
  @Table(name = "users")
  public class User {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      
      @Column(unique = true, nullable = false)
      private String firebaseUid;
      
      private String email;
      private String displayName;
      private LocalDateTime createdAt;
      private LocalDateTime lastLoginAt;
  }
  ```
- [ ] Create `UserRepository`
- [ ] Create `UserService` with `findOrCreateByFirebaseUid()`
- [ ] Create `AuthController` with:
  - `GET /auth/me` - Get current user (creates if first login)
  - Requires Firebase ID token in Authorization header
- [ ] Create `FirebaseAuthFilter` to validate tokens
- [ ] Update `GameSession` entity to use proper User foreign key
- [ ] Update `GameSessionService` to accept userId

**Files to Create:**
- `backend/src/main/java/com/lutem/mvp/model/User.java`
- `backend/src/main/java/com/lutem/mvp/repository/UserRepository.java`
- `backend/src/main/java/com/lutem/mvp/service/UserService.java`
- `backend/src/main/java/com/lutem/mvp/controller/AuthController.java`
- `backend/src/main/java/com/lutem/mvp/config/FirebaseConfig.java`
- `backend/src/main/java/com/lutem/mvp/security/FirebaseAuthFilter.java`

**Files to Modify:**
- `backend/pom.xml` (add Firebase Admin SDK)
- `backend/src/main/java/com/lutem/mvp/model/GameSession.java`
- `backend/src/main/java/com/lutem/mvp/service/GameSessionService.java`

---

### Phase 3: Gated Features UI (30 min)

**Frontend Tasks:**
- [ ] Update tab visibility based on auth state:
  ```javascript
  function updateTabVisibility() {
      const calendarTab = document.querySelector('[data-tab="calendar"]');
      const profileTab = document.querySelector('[data-tab="profile"]');
      
      if (!authState.isAuthenticated) {
          calendarTab.classList.add('locked');
          profileTab.classList.add('locked');
      } else {
          calendarTab.classList.remove('locked');
          profileTab.classList.remove('locked');
      }
  }
  ```
- [ ] Create "Sign in to unlock" overlay for locked tabs
- [ ] Add lock icon to locked tab buttons
- [ ] Show user info in header when logged in (avatar, name, sign out button)
- [ ] Redirect to sign-in modal when clicking locked tabs

**Files to Modify:**
- `frontend/js/tabs.js` (gating logic)
- `frontend/js/auth.js` (trigger UI updates on auth change)
- `frontend/index.html` (add locked tab overlay, user header section)
- `frontend/css/components.css` (locked tab styles, user header styles)

---

### Phase 4: Session Migration (20 min)

**Anonymous → User Data Migration:**

When anonymous user gets a recommendation, store temporarily:
```javascript
// In localStorage
{
    "lutem_pending_session": {
        "gameId": 42,
        "gameName": "Hades",
        "availableMinutes": 45,
        "desiredMood": "challenge",
        "timestamp": "2025-05-29T10:30:00Z",
        "wizardInputs": { /* full wizard state */ }
    }
}
```

On successful login:
1. Check for pending session in localStorage
2. POST to `/sessions/migrate` with pending data
3. Clear localStorage on success

**Frontend Tasks:**
- [ ] Update recommendation.js to store pending session for anonymous users
- [ ] Add migration logic to auth.js `onAuthStateChanged`
- [ ] Create `migrateAnonymousSession()` function

**Backend Tasks:**
- [ ] Create `POST /sessions/migrate` endpoint
- [ ] Accept pending session data and create GameSession with userId

**Files to Modify:**
- `frontend/js/recommendation.js`
- `frontend/js/auth.js`
- `backend/src/main/java/com/lutem/mvp/controller/SessionController.java`

---

### Phase 5: Persist CalendarEvents (30 min)

**Backend Tasks:**
- [ ] Convert CalendarEvent to JPA entity:
  ```java
  @Entity
  @Table(name = "calendar_events")
  public class CalendarEvent {
      @Id
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;
      
      @ManyToOne(fetch = FetchType.LAZY)
      @JoinColumn(name = "user_id", nullable = false)
      private User user;
      
      private String title;
      private LocalDateTime startTime;
      private LocalDateTime endTime;
      private EventType type;
      private Long gameId;
      private String description;
  }
  ```
- [ ] Create `CalendarEventRepository`
- [ ] Update `CalendarController` to:
  - Require authentication
  - Filter events by current user
  - Use repository instead of in-memory map

**Files to Create:**
- `backend/src/main/java/com/lutem/mvp/repository/CalendarEventRepository.java`

**Files to Modify:**
- `backend/src/main/java/com/lutem/mvp/model/CalendarEvent.java`
- `backend/src/main/java/com/lutem/mvp/controller/CalendarController.java`

---

## Firebase Configuration

### Frontend Config (public - safe to commit)
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};
```

### Backend Config (private - use environment variables)
```properties
# application.properties
firebase.credentials.path=${FIREBASE_CREDENTIALS_PATH}
```

Download service account JSON from Firebase Console → Project Settings → Service Accounts.

---

## API Authentication Pattern

All authenticated endpoints require:
```
Authorization: Bearer <firebase-id-token>
```

Backend validates token with Firebase Admin SDK and extracts user UID.

---

## UI Components Needed

### Login Modal
```
┌─────────────────────────────────────────┐
│              Welcome to Lutem     [X]   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🔵 Continue with Google        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ─────────── or ───────────            │
│                                         │
│  Email:    [____________________]      │
│  Password: [____________________]      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │         Sign In                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Don't have an account? Sign up        │
└─────────────────────────────────────────┘
```

### Locked Tab Overlay
```
┌─────────────────────────────────────────┐
│              🔒 Calendar                 │
│                                         │
│    Schedule your gaming sessions        │
│    and track your play time             │
│                                         │
│    ┌─────────────────────────────┐     │
│    │   Sign in to unlock         │     │
│    └─────────────────────────────┘     │
│                                         │
└─────────────────────────────────────────┘
```

### User Header (when logged in)
```
┌──────────────────────────────────────────────────────┐
│  LUTEM    [Home] [Games] [Calendar] [Profile]   👤 ▼ │
│                                           ┌─────────┐│
│                                           │ Jan     ││
│                                           │ Sign Out││
│                                           └─────────┘│
└──────────────────────────────────────────────────────┘
```

---

## Testing Checklist

### Phase 1
- [ ] Can sign in with Google
- [ ] Can sign in with email/password
- [ ] Can create new account
- [ ] Can sign out
- [ ] Auth state persists on page refresh

### Phase 2
- [ ] Backend validates Firebase tokens
- [ ] User record created on first login
- [ ] API returns 401 for invalid/missing token

### Phase 3
- [ ] Calendar tab locked for anonymous
- [ ] Profile tab locked for anonymous
- [ ] Locked tabs show sign-in prompt
- [ ] Tabs unlock after sign-in

### Phase 4
- [ ] Anonymous wizard result stored in localStorage
- [ ] On login, pending session migrated to backend
- [ ] localStorage cleared after migration

### Phase 5
- [ ] Calendar events persist in database
- [ ] Events scoped to current user
- [ ] Events survive server restart

---

## Estimated Time

| Phase | Time |
|-------|------|
| Phase 1: Firebase Setup | 30 min |
| Phase 2: Backend User Support | 45 min |
| Phase 3: Gated Features UI | 30 min |
| Phase 4: Session Migration | 20 min |
| Phase 5: Persist CalendarEvents | 30 min |
| **Total** | **~2.5 hours** |

---

## Next Steps

1. Create Firebase project and get config
2. Share config with Claude to begin Phase 1
3. Implement phases sequentially, testing each before moving on
