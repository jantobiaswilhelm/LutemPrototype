# Lutem Feedback Flow Roadmap

## Overview

Redesign feedback system to capture **post-session** satisfaction data tied to actual play experience, enabling meaningful analytics and future algorithm improvements.

**Core Principle:** Rate after playing, not before. Capture real emotional outcomes.

---

## Session Data Model

```javascript
Session {
  // Identity
  id: string (auto-generated)
  odataid: string (Firebase UID)
  
  // Game Context (captured at scheduling)
  gameId: number
  gameName: string
  gameGenre: string
  gameImageUrl: string
  
  // Recommendation Context
  moodSelected: string (UNWIND, RECHARGE, ENGAGE, CHALLENGE, EXPLORE)
  energyLevel: string (LOW, MEDIUM, HIGH)
  timeAvailable: number (minutes)
  matchPercentage: number
  recommendationReason: string
  
  // Scheduling
  scheduledStart: timestamp
  scheduledEnd: timestamp
  status: string (PENDING | COMPLETED | SKIPPED | EXPIRED)
  source: string (RECOMMENDATION | CALENDAR | MANUAL)
  
  // Feedback (filled after session)
  didPlay: string (YES | NO | DIFFERENT_GAME)
  actualDuration: number (minutes)
  rating: number (1-5)
  emotionalTags: string[] (RELAXING, ENERGIZING, SATISFYING, FRUSTRATING, CHALLENGING, FUN)
  notes: string (optional)
  
  // Metadata
  createdAt: timestamp
  feedbackAt: timestamp (when feedback submitted)
  dayOfWeek: string (MONDAY-SUNDAY)
  timeOfDay: string (MORNING | AFTERNOON | EVENING | NIGHT)
}
```

### Emotional Tags
| Tag | Emoji | Description |
|-----|-------|-------------|
| RELAXING | 😌 | Felt calm, unwound |
| ENERGIZING | ⚡ | Felt pumped, activated |
| SATISFYING | 😊 | Felt fulfilled, content |
| FRUSTRATING | 😤 | Felt annoyed, stuck |
| CHALLENGING | 🎯 | Felt tested, pushed |
| FUN | 🎉 | Felt entertained, joyful |

### Session Status Flow
```
PENDING → COMPLETED (feedback submitted)
        → SKIPPED (user dismissed without feedback)
        → EXPIRED (auto after X days, optional future feature)
```

---

## Phases

### Phase A: Data Foundation
**Goal:** Firestore schema and functions ready for session tracking

**Tasks:**
1. Update Firestore security rules for `sessions` subcollection
2. Create/update FirestoreModule functions:
   - `createPendingSession(uid, sessionData)` 
   - `getPendingSessions(uid)` - returns sessions where status=PENDING and scheduledEnd < now
   - `getSessionHistory(uid, limit, offset)` - paginated history
   - `updateSessionFeedback(uid, sessionId, feedbackData)`
   - `markSessionSkipped(uid, sessionId)`
   - `createManualSession(uid, sessionData)` - for manual logging
3. Helper functions for derived fields (dayOfWeek, timeOfDay)

**Test Criteria:**
- Can create a pending session from console
- Can query pending sessions for a user
- Can update session with feedback
- Security rules prevent cross-user access

**Estimated Time:** 1-2 hours

---

### Phase B: Schedule from Home
**Goal:** Users can schedule recommended games

**Tasks:**
1. Add "Schedule This" button to hero recommendation card
2. Add "Schedule" option to alternative game cards
3. Create schedule modal:
   - Date picker (default: today)
   - Time picker (default: next hour)
   - Duration (pre-filled from game's typical time)
   - "Play Now" shortcut (schedules for current time)
4. On schedule: create PENDING session in Firestore
5. Show confirmation toast
6. Store current recommendation context (mood, energy, match%) in session

**Test Criteria:**
- Can schedule from main recommendation
- Can schedule from alternative cards
- "Play Now" creates session with current timestamp
- Session appears in Firestore with correct data

**Estimated Time:** 2-3 hours

---

### Phase C: Calendar Integration
**Goal:** Calendar displays and manages gaming sessions

**Tasks:**
1. Fetch sessions from Firestore on calendar load
2. Display sessions on calendar (color-coded by status)
3. Click session → detail popover with:
   - Game info
   - Status
   - Feedback summary (if completed)
   - "Add Feedback" button (if pending)
4. "Schedule Session" button on calendar
5. Game picker for calendar-initiated scheduling

**Dependencies:** Phase A, Phase B

**Test Criteria:**
- Pending sessions show on calendar
- Completed sessions show with rating
- Can add feedback from calendar click
- Can create new session from calendar

**Estimated Time:** 2-3 hours

---

### Phase D: Feedback Prompt
**Goal:** Prompt users to rate sessions after playing

**Tasks:**
1. On app load (after auth): check for pending sessions past scheduledEnd
2. If found, show feedback modal:
   - Game name + image
   - "Did you play this?" (Yes / No / Played something else)
   - If yes: duration slider, rating (1-5), emotional tags (multi-select)
   - If no/different: optional reason
   - Submit / Skip buttons
3. Badge on pending count: "2 sessions to review"
4. Click badge → shows list of pending sessions
5. Clicking any pending session opens feedback modal for it

**UI Components:**
- FeedbackModal component
- PendingSessionsBadge component
- EmotionalTagSelector (multi-select chips)
- DurationSlider

**Test Criteria:**
- Modal appears on login when pending sessions exist
- Can submit full feedback
- Can skip feedback (marks SKIPPED)
- Multiple pending sessions show count badge
- Can review older pending sessions from badge

**Estimated Time:** 2-3 hours

---

### Phase E: Manual Session Logging
**Goal:** Users can log sessions they didn't schedule

**Tasks:**
1. "Log a Session" button (Stats tab header or floating action)
2. Manual entry modal:
   - Game picker (search/select from library)
   - Date played (default: today)
   - Duration
   - Rating
   - Emotional tags
   - Notes (optional)
3. Creates session with status=COMPLETED and source=MANUAL

**Test Criteria:**
- Can search and select any game
- Can set custom date
- Session saved correctly
- Shows in history and analytics

**Estimated Time:** 1-2 hours

---

### Phase F: Analytics/Stats Page
**Goal:** Visualize gaming history and satisfaction trends

**Metrics to Display:**
1. **Summary Cards:**
   - Sessions this week / month / all time
   - Total playtime
   - Average rating
   - Completion rate (COMPLETED vs SKIPPED)

2. **Charts:**
   - Satisfaction over time (line chart)
   - Emotional tag distribution (pie/donut)
   - Sessions by day of week (bar)
   - Sessions by time of day (bar)

3. **Insights:**
   - "Best games for unwinding" (highest rated when mood=UNWIND)
   - "Your peak gaming time" (most sessions)
   - "Most satisfying genre"

4. **Session History:**
   - Scrollable list
   - Filter by status, game, date range
   - Click → expand details

**Dependencies:** Phase A (needs session data)

**Test Criteria:**
- Stats load from Firestore
- Charts render correctly
- Filters work
- Empty state when no sessions

**Estimated Time:** 3-4 hours

---

## Recommended Implementation Order

```
A (Data) → B (Home Schedule) → D (Feedback Prompt) → E (Manual Log) → C (Calendar) → F (Analytics)
```

**Rationale:**
- A is foundation, must be first
- B enables creating sessions (core flow)
- D captures feedback (core value)
- E is quick win after D (similar UI)
- C ties it together with calendar
- F is the payoff (visualization)

---

## Future Enhancements (Not in MVP)

- Push satisfaction data to backend for algorithm learning
- Session reminders/notifications
- Social sharing of stats
- Achievement system based on sessions
- Game recommendations based on past satisfaction patterns
- Export session data

---

## Technical Notes

**Firestore Structure:**
```
users/{uid}/sessions/{sessionId}
```

**Security Rules:**
```javascript
match /users/{userId}/sessions/{sessionId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

**Data Ownership:** Firestore-only for MVP. Backend integration for algorithm learning is a separate future phase.
