# Firebase Admin SDK Configuration

## Overview

Lutem uses the **Firebase Admin SDK** for server-side authentication token validation. This allows the backend to verify Firebase ID tokens sent from the frontend, ensuring secure API access for authenticated users.

## Architecture

```
┌──────────────────┐     Firebase ID Token     ┌──────────────────┐
│    Frontend      │ ─────────────────────────▶│     Backend      │
│  (Firebase Auth) │                            │ (Admin SDK)      │
└──────────────────┘                            └──────────────────┘
        │                                               │
        │ 1. User signs in                              │
        ▼                                               │
┌──────────────────┐                            2. Verify token
│  Firebase Auth   │◀───────────────────────────────────┘
│   (Google)       │
└──────────────────┘
```

## Files Structure

```
backend/
├── firebase-service-account.json     # Service account credentials (NEVER commit!)
├── pom.xml                           # Maven dependency
└── src/main/java/com/lutem/mvp/
    ├── config/
    │   └── FirebaseConfig.java       # SDK initialization
    ├── security/
    │   └── FirebaseAuthFilter.java   # Token validation filter
    └── controller/
        └── AuthController.java       # Protected endpoints
```

## Configuration Details

### 1. Maven Dependency (pom.xml)

```xml
<!-- Firebase Admin SDK for authentication -->
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.2.0</version>
</dependency>
```

### 2. FirebaseConfig.java

The main configuration class that initializes the Firebase Admin SDK:

**Key Features:**
- **Dual-mode credentials loading:**
  - **Production (Railway):** Reads from `FIREBASE_CREDENTIALS` environment variable
  - **Development (local):** Reads from `firebase-service-account.json` file
- **Lazy initialization:** Only initializes if not already initialized
- **Graceful degradation:** If credentials not found, authentication is disabled (allows dev without Firebase)

**Beans Provided:**
- `FirebaseAuth` - For token verification
- `Firestore` - For Firestore database access (future use)

### 3. FirebaseAuthFilter.java

A `OncePerRequestFilter` that intercepts requests and validates Firebase tokens:

**Behavior:**
- Skips CORS preflight (OPTIONS) requests
- Only protects `/auth/**` endpoints (configurable in `requiresAuth()`)
- If Firebase not configured, allows all requests through (dev mode)
- Extracts user info from valid tokens and adds to request attributes:
  - `firebaseUid` - User's Firebase UID
  - `firebaseEmail` - User's email
  - `firebaseDisplayName` - User's display name

### 4. AuthController.java

Protected endpoint that requires valid Firebase authentication:

**Endpoint:** `GET /auth/me`
- Requires: `Authorization: Bearer <firebase-id-token>`
- Returns: User info (creates user on first login via `UserService`)

## Environment Configuration

### Local Development

1. **Get service account credentials:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project → Project Settings → Service accounts
   - Click "Generate new private key"
   - Save as `backend/firebase-service-account.json`

2. **Configure application.properties:**
   ```properties
   firebase.credentials.path=${FIREBASE_CREDENTIALS_PATH:firebase-service-account.json}
   ```

3. **Run with local profile:**
   ```bash
   set SPRING_PROFILES_ACTIVE=local
   mvn spring-boot:run
   ```

### Production (Railway)

1. **Set environment variable in Railway:**
   - Variable name: `FIREBASE_CREDENTIALS`
   - Value: Entire contents of your `firebase-service-account.json` file (as JSON string)

2. **The backend will automatically:**
   - Detect the environment variable
   - Parse the JSON credentials
   - Initialize Firebase Admin SDK

## Security Notes

⚠️ **NEVER commit `firebase-service-account.json` to Git!**

The `.gitignore` already includes:
```gitignore
# Firebase credentials (NEVER commit)
firebase-service-account.json
*-firebase-adminsdk-*.json
```

## API Usage

### Authenticating API Calls

From the frontend, include the Firebase ID token in requests:

```javascript
const user = firebase.auth().currentUser;
const idToken = await user.getIdToken();

fetch('/auth/me', {
    headers: {
        'Authorization': `Bearer ${idToken}`
    }
});
```

### Response Format

**Success (200):**
```json
{
    "id": 1,
    "firebaseUid": "abc123xyz",
    "email": "user@example.com",
    "displayName": "John Doe",
    "createdAt": "2025-01-01T12:00:00",
    "lastLoginAt": "2025-01-15T14:30:00"
}
```

**Unauthorized (401):**
```json
{
    "error": "Missing or invalid Authorization header"
}
```

**Invalid Token (401):**
```json
{
    "error": "Invalid or expired token"
}
```

## Troubleshooting

### Console Messages

| Message | Meaning |
|---------|---------|
| ✅ Firebase Admin SDK initialized | Successfully loaded credentials |
| ✅ Loading Firebase credentials from environment variable | Using Railway/production config |
| ✅ Loading Firebase credentials from file | Using local development config |
| ⚠️ Firebase credentials not found | No credentials available, auth disabled |
| ⚠️ Firestore not available | Firebase not initialized |
| ❌ Failed to initialize Firebase | Error loading credentials |
| ❌ Token validation failed | Invalid/expired ID token |

### Common Issues

1. **"Firebase credentials not found"**
   - Ensure `firebase-service-account.json` exists in `backend/` folder
   - Or set `FIREBASE_CREDENTIALS` environment variable

2. **"Invalid or expired token"**
   - Token may have expired (tokens last 1 hour)
   - Refresh the token: `await user.getIdToken(true)`

3. **CORS issues with auth endpoints**
   - WebConfig.java includes `exposedHeaders("Authorization")`
   - Ensure your origin is in the allowed list

## Testing Without Firebase

For development without Firebase credentials:
- The filter allows all requests through
- `/auth/me` will return 401 (no firebaseUid in request)
- All other endpoints work normally

---

**Last Updated:** December 2025
**Firebase Admin SDK Version:** 9.2.0
