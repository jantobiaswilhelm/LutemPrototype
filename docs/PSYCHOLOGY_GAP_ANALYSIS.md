# Psychology Gap Analysis

**Status:** Implementation Roadmap
**Based on:** [PSYCHOLOGY.md](PSYCHOLOGY.md) (7 evidence-based design principles)
**Date:** 2025-02-23
**Finding:** 5 of 11 backend scoring factors are dormant because the React frontend never sends the required data. The signature "Touch Grass" wellness modal was never ported from the old vanilla JS frontend to React.

---

## Summary Table

| # | Gap | Priority | Effort | Files Affected | Backend Change? |
|---|-----|----------|--------|----------------|-----------------|
| 1 | Touch Grass modal missing from React | IMPORTANT | ~2 hours | `TimeStep.tsx`, new `TouchGrassModal.tsx` | None |
| 2 | Time of day not sent to API | CRITICAL | ~5 min | `ResultStep.tsx`, `MoodShortcuts.tsx` | None |
| 3 | Genre preferences not wired to API | CRITICAL | ~5 min | `ResultStep.tsx`, `MoodShortcuts.tsx` | None |
| 4 | MoodShortcuts skips content/audio prefs | CRITICAL | ~10 min | `MoodShortcuts.tsx` | None |
| 5 | 7 wizard steps instead of 3 | NICE-TO-HAVE | None | None | None |
| 6 | Star rating instead of emoji feedback | NICE-TO-HAVE | ~5 min | `FeedbackPrompt.tsx` | None |
| 7 | userId not sent — Firestore personalization inactive | CRITICAL | ~10 min | `ResultStep.tsx`, `MoodShortcuts.tsx` | None |

**Key takeaway:** Zero backend changes required. All scoring logic already exists and is waiting for the frontend to send the data.

---

## CRITICAL Priority

### GAP 2: Time of Day Not Sent to API

**Psychology principle:** #6 — Context-Aware Timing
**Impact:** Backend scoring factors #5 (+5%) and #10 (+5%) are inactive

**The problem:**
`getCurrentTimeOfDay()` exists in `lib/utils.ts` and works correctly, but neither API call site ever calls it.

```typescript
// frontend-react/src/lib/utils.ts:9-16
export function getCurrentTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'MORNING';
  if (hour >= 12 && hour < 15) return 'MIDDAY';
  if (hour >= 15 && hour < 18) return 'AFTERNOON';
  if (hour >= 18 && hour < 24) return 'EVENING';
  return 'LATE_NIGHT';
}
```

The `RecommendationRequest` type already has `timeOfDay` as an optional field (`types/index.ts:133`), and the backend already scores on it:

```java
// GameController.java — Factor #5: TIME OF DAY MATCH (5%)
if (request.getTimeOfDay() != null) {
    if (game.isSuitableForTimeOfDay(request.getTimeOfDay())) {
        score += 5.0;
        matchReasons.add("Ideal for " + request.getTimeOfDay().getDisplayName().toLowerCase());
    }
}

// GameController.java — Factor #10: TIME-OF-DAY SATISFACTION PATTERN (max 5%)
if (userStats != null && userStats.getBestTimeOfDay() != null && request.getTimeOfDay() != null) {
    String currentTime = request.getTimeOfDay().name();
    if (currentTime.equals(userStats.getBestTimeOfDay())) {
        // ...
        score += 3.0;
    }
}
```

**Fix — ResultStep.tsx:**
```diff
+ import { getCurrentTimeOfDay } from '@/lib/utils';
  // ...
  const data = await recommendationsApi.getRecommendation({
    availableMinutes,
    desiredEmotionalGoals: selectedMoods,
    currentEnergyLevel: energyLevel,
    requiredInterruptibility: interruptibility,
    socialPreference,
+   timeOfDay: getCurrentTimeOfDay(),
    audioAvailability: audioAvailability ?? undefined,
    maxContentRating: contentPrefs.maxContentRating,
    allowNsfw: contentPrefs.allowNsfw,
  });
```

**Fix — MoodShortcuts.tsx:**
```diff
+ import { getCurrentTimeOfDay } from '@/lib/utils';
  // ...
  const request: RecommendationRequest = {
    availableMinutes: DEFAULT_MINUTES,
    desiredEmotionalGoals: [shortcut.emotionalGoal],
    currentEnergyLevel: shortcut.energyLevel,
    requiredInterruptibility: 'MEDIUM',
    socialPreference: 'BOTH',
+   timeOfDay: getCurrentTimeOfDay(),
  };
```

**Files to modify:**
- `frontend-react/src/components/wizard/ResultStep.tsx` — add import + field
- `frontend-react/src/components/MoodShortcuts.tsx` — add import + field

---

### GAP 3: Genre Preferences Not Wired to API

**Psychology principle:** #3 — Soft Ranking vs Hard Filtering
**Impact:** Backend scoring factor #8 (+15% soft ranking boost) is inactive

**The problem:**
The Settings page lets users toggle preferred genres. `getGamingPreferences()` in `useGamingPreferences.ts` reads them from localStorage. But neither API call site includes `preferredGenres` in the request body.

```typescript
// frontend-react/src/hooks/useGamingPreferences.ts:94-96
export function getGamingPreferences(): GamingPreferences {
  return loadPreferences();
}
// Returns: { preferredGenres: string[], defaultTimeAvailable, ... }
```

The backend already applies a soft genre boost (not a hard filter):

```java
// GameController.java — Factor #8: GENRE PREFERENCE BOOST (max 15%)
if (request.getPreferredGenres() != null && !request.getPreferredGenres().isEmpty()) {
    long genreMatches = game.getGenres().stream()
        .filter(genre -> request.getPreferredGenres().stream()
            .anyMatch(prefGenre -> prefGenre.equalsIgnoreCase(genre)))
        .count();
    if (genreMatches > 0) {
        double genreBonus = (genreMatches / (double) request.getPreferredGenres().size()) * 15.0;
        score += genreBonus;
    }
}
```

**Fix — ResultStep.tsx:**
```diff
+ import { getGamingPreferences } from '@/hooks/useGamingPreferences';
  // ...
+ const gamingPrefs = getGamingPreferences();
  const data = await recommendationsApi.getRecommendation({
    // ... existing fields ...
+   preferredGenres: gamingPrefs.preferredGenres.length > 0
+     ? gamingPrefs.preferredGenres : undefined,
  });
```

**Fix — MoodShortcuts.tsx:**
```diff
+ import { getGamingPreferences } from '@/hooks/useGamingPreferences';
  // ...
+ const gamingPrefs = getGamingPreferences();
  const request: RecommendationRequest = {
    // ... existing fields ...
+   preferredGenres: gamingPrefs.preferredGenres.length > 0
+     ? gamingPrefs.preferredGenres : undefined,
  };
```

**Files to modify:**
- `frontend-react/src/components/wizard/ResultStep.tsx`
- `frontend-react/src/components/MoodShortcuts.tsx`

---

### GAP 4: MoodShortcuts Skips Content/Audio Preferences

**Psychology principle:** Content safety & user preference respect
**Impact:** Users with EVERYONE content rating can receive MATURE games via shortcuts

**The problem:**
The wizard path in `ResultStep.tsx` correctly sends `audioAvailability`, `maxContentRating`, and `allowNsfw`. But `MoodShortcuts.tsx` sends none of these — it builds a bare-minimum request:

```typescript
// frontend-react/src/components/MoodShortcuts.tsx:64-70 — CURRENT (incomplete)
const request: RecommendationRequest = {
  availableMinutes: DEFAULT_MINUTES,
  desiredEmotionalGoals: [shortcut.emotionalGoal],
  currentEnergyLevel: shortcut.energyLevel,
  requiredInterruptibility: 'MEDIUM',
  socialPreference: 'BOTH',
};
```

Compare with `ResultStep.tsx` which sends content preferences:

```typescript
// frontend-react/src/components/wizard/ResultStep.tsx:83-93 — CORRECT (complete)
const data = await recommendationsApi.getRecommendation({
  availableMinutes,
  desiredEmotionalGoals: selectedMoods,
  currentEnergyLevel: energyLevel,
  requiredInterruptibility: interruptibility,
  socialPreference,
  audioAvailability: audioAvailability ?? undefined,
  maxContentRating: contentPrefs.maxContentRating,
  allowNsfw: contentPrefs.allowNsfw,
});
```

**Fix — MoodShortcuts.tsx:**
```diff
+ import { getContentPreferences } from '@/hooks/useContentPreferences';
+ import { getGamingPreferences } from '@/hooks/useGamingPreferences';
  // ...
  const handleShortcutClick = async (shortcut: MoodShortcut) => {
+   const contentPrefs = getContentPreferences();
+   const gamingPrefs = getGamingPreferences();
    // ...
    const request: RecommendationRequest = {
      availableMinutes: DEFAULT_MINUTES,
      desiredEmotionalGoals: [shortcut.emotionalGoal],
      currentEnergyLevel: shortcut.energyLevel,
      requiredInterruptibility: 'MEDIUM',
      socialPreference: 'BOTH',
+     maxContentRating: contentPrefs.maxContentRating,
+     allowNsfw: contentPrefs.allowNsfw,
+     audioAvailability: gamingPrefs.defaultAudioAvailability,
    };
  };
```

**Files to modify:**
- `frontend-react/src/components/MoodShortcuts.tsx`

---

### GAP 7: userId Not Sent — Firestore Personalization Inactive

**Psychology principle:** #5 — Feedback-Driven Learning
**Impact:** Backend scoring factors #7 (up to +15%), #9 (up to +10%), and #10 (up to +5%) are all inactive

**The problem:**
The backend loads per-user Firestore data (personal game ratings, genre ratings, time-of-day patterns) using `userId`. But neither frontend API call sends it. Users submit star ratings that get stored, but those ratings never influence future recommendations.

```java
// GameController.java — Factor #7: SATISFACTION BONUS - FIRESTORE (max 15%)
// Uses personalized Firestore data if available
if (userStats != null && userStats.getRatingsByGame() != null) {
    Double userRating = userStats.getRatingsByGame().get(game.getId());
    if (userRating != null && userRating > 0) {
        score += (userRating / 5.0) * 15.0;
    }
}

// GameController.java — Factor #9: GENRE SATISFACTION BOOST - FIRESTORE (max 10%)
if (userStats != null && userStats.getRatingsByGenre() != null) {
    // ... boosts genres the user rates highly ...
    score += 5.0;
}

// GameController.java — Factor #10: TIME-OF-DAY SATISFACTION PATTERN (max 5%)
if (userStats != null && userStats.getBestTimeOfDay() != null) {
    // ... boosts when user is gaming at their best-rated time ...
    score += 3.0;
}
```

The auth store has the user with their backend database ID:

```typescript
// frontend-react/src/stores/authStore.ts:16-26
export interface LutemUser {
  id: number;           // <-- backend database ID
  displayName: string;
  steamId?: string;
  googleId?: string;
  // ...
}
```

**Fix — ResultStep.tsx:**
```diff
+ import { useAuthStore } from '@/stores/authStore';
  // ...
  export default function ResultStep() {
+   const user = useAuthStore((s) => s.user);
    // ...
    const data = await recommendationsApi.getRecommendation({
      // ... existing fields ...
+     userId: user ? String(user.id) : undefined,
    });
  };
```

**Fix — MoodShortcuts.tsx:**
```diff
+ import { useAuthStore } from '@/stores/authStore';
  // ...
  export function MoodShortcuts() {
+   const user = useAuthStore((s) => s.user);
    // ...
    const request: RecommendationRequest = {
      // ... existing fields ...
+     userId: user ? String(user.id) : undefined,
    };
  };
```

**Files to modify:**
- `frontend-react/src/components/wizard/ResultStep.tsx`
- `frontend-react/src/components/MoodShortcuts.tsx`

---

## IMPORTANT Priority

### GAP 1: Touch Grass Wellness Modal Not in React

**Psychology principle:** #7 — Wellness Integration
**Impact:** Core differentiating feature completely absent from the React app

**The problem:**
The old vanilla JS frontend (`_archive_frontend_legacy/index.html` + `_archive_frontend_legacy/js/wizard.js`) has a fully working Touch Grass wellness modal. The React frontend has zero Touch Grass logic — `TimeStep.tsx` allows unlimited time selection with no wellness prompt.

**Old implementation reference:**

```html
<!-- _archive_frontend_legacy/index.html — Touch Grass modal HTML -->
<div class="modal-overlay" id="touchGrassModal">
  <div class="modal-content">
    <div class="modal-icon">🌱</div>
    <h2>Time to Touch Grass?</h2>
    <p>3+ hours of gaming is a marathon session!</p>
    <p style="font-weight: 600;">Before you dive in, consider:</p>
    <ul>
      <li>Have you moved your body today?</li>
      <li>Have you had water recently?</li>
      <li>Is your space comfortable for a long session?</li>
    </ul>
    <div class="modal-buttons">
      <button onclick="closeTouchGrassModal(false)">I'll Choose Less Time</button>
      <button onclick="closeTouchGrassModal(true)">I'm Ready! 🎮</button>
    </div>
  </div>
</div>
```

```javascript
// _archive_frontend_legacy/js/wizard.js — close handler
function closeTouchGrassModal(keepSelection) {
    document.getElementById('touchGrassModal').style.display = 'none';
    if (!keepSelection) {
        // Reset to 3 hours (index 6 = 180 min)
        state.availableMinutes = 180;
        updateTimeDisplay(6);
    }
}
```

**Current React TimeStep.tsx:**

```typescript
// frontend-react/src/components/wizard/TimeStep.tsx:4-5
const UNLIMITED_TIME = 999;
const TIME_PRESETS = [15, 30, 45, 60, 90, 120, UNLIMITED_TIME];
// Note: max slider is 120 min. UNLIMITED_TIME (999) is "2h+".
// No 180 min preset exists. No Touch Grass trigger.
```

**Fix — Create `TouchGrassModal.tsx`:**

New file: `frontend-react/src/components/wizard/TouchGrassModal.tsx`

```tsx
interface TouchGrassModalProps {
  isOpen: boolean;
  onKeep: () => void;    // User acknowledges, keeps 3h+ selection
  onReduce: () => void;  // User chooses to reduce time
}

export function TouchGrassModal({ isOpen, onKeep, onReduce }: TouchGrassModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-[var(--color-bg-primary)] rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
        <div className="text-center mb-4">
          <span className="text-4xl">🌱</span>
          <h2 className="text-xl font-bold text-[var(--color-text-primary)] mt-2">
            Time to Touch Grass?
          </h2>
          <p className="text-[var(--color-text-muted)] mt-1">
            3+ hours is a marathon session!
          </p>
        </div>

        <p className="font-semibold text-[var(--color-text-primary)] mb-2">
          Before you dive in, consider:
        </p>
        <ul className="space-y-2 mb-6 text-[var(--color-text-secondary)]">
          <li className="flex items-center gap-2">
            <span>🚶</span> Have you moved your body today?
          </li>
          <li className="flex items-center gap-2">
            <span>💧</span> Have you had water recently?
          </li>
          <li className="flex items-center gap-2">
            <span>🪑</span> Is your space comfortable for a long session?
          </li>
        </ul>

        <div className="flex gap-3">
          <button onClick={onReduce} className="flex-1 btn-secondary">
            I'll Choose Less Time
          </button>
          <button onClick={onKeep} className="flex-1 btn-primary">
            I'm Ready! 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Fix — Modify `TimeStep.tsx`:**

```diff
+ import { useState } from 'react';
+ import { TouchGrassModal } from './TouchGrassModal';

  const UNLIMITED_TIME = 999;
- const TIME_PRESETS = [15, 30, 45, 60, 90, 120, UNLIMITED_TIME];
+ const TIME_PRESETS = [15, 30, 45, 60, 90, 120, 180, UNLIMITED_TIME];
+ const TOUCH_GRASS_THRESHOLD = 180; // 3 hours

  export default function TimeStep() {
    const { availableMinutes, setAvailableMinutes, nextStep } = useWizardStore();
+   const [showTouchGrass, setShowTouchGrass] = useState(false);

-   // ... (Next button calls nextStep directly)
+   const handleNext = () => {
+     if (availableMinutes >= TOUCH_GRASS_THRESHOLD) {
+       setShowTouchGrass(true);
+     } else {
+       nextStep();
+     }
+   };

+   const handleKeepTime = () => {
+     setShowTouchGrass(false);
+     nextStep();
+   };

+   const handleReduceTime = () => {
+     setShowTouchGrass(false);
+     setAvailableMinutes(120); // Reset to 2 hours
+   };

    // ... slider and presets unchanged ...

-   <button onClick={nextStep} className="btn-primary w-full mt-3">
+   <button onClick={handleNext} className="btn-primary w-full mt-3">
      Next
    </button>

+   <TouchGrassModal
+     isOpen={showTouchGrass}
+     onKeep={handleKeepTime}
+     onReduce={handleReduceTime}
+   />
  };
```

**Notes:**
- The slider max is currently 120 (mapped to `UNLIMITED_TIME = 999` at the boundary). Adding a `180` preset gives users an explicit 3-hour option that triggers the modal.
- If `UNLIMITED_TIME` (999) is selected, that's also >= 180, so the modal triggers for "2h+" as well.

**Files to create:**
- `frontend-react/src/components/wizard/TouchGrassModal.tsx`

**Files to modify:**
- `frontend-react/src/components/wizard/TimeStep.tsx`

---

## NICE-TO-HAVE Priority

### GAP 5: 7 Wizard Steps Instead of 3

**Psychology principle:** #4 — Progressive Disclosure
**PSYCHOLOGY.md says:** "Guided setup with 3-step onboarding"

**Assessment:**
The React wizard has 7 input steps (Time, Mood, Energy, Interruptibility, Social, Audio, Result). However, each step asks exactly one question with large touch-friendly buttons. This IS progressive disclosure — just with finer granularity than "3 steps."

**Verdict:** Intentional design divergence, not a bug. The one-question-per-step pattern actually reduces cognitive load more than cramming 3 questions per step.

**Action:** No code change. Update PSYCHOLOGY.md to say "7-step guided wizard (one question per step)" if desired, or leave as-is since "3-step" was aspirational.

---

### GAP 6: Star Rating Instead of Emoji Feedback

**Psychology principle:** #5 — Feedback-Driven Learning
**PSYCHOLOGY.md says:** "Post-session emoji feedback (1-5 scale)"

**Assessment:**
The current implementation uses a `StarRating` component with text labels:

```typescript
// frontend-react/src/components/feedback/FeedbackPrompt.tsx:177-186
function getRatingLabel(rating: number): string {
  switch (rating) {
    case 1: return 'Not great - will avoid next time';
    case 2: return 'Meh - not what I needed';
    case 3: return 'Okay - served its purpose';
    case 4: return 'Good session!';
    case 5: return 'Exactly what I needed!';
    default: return '';
  }
}
```

Stars are industry-standard and functionally equivalent. The backend receives a 1-5 integer either way.

**Optional enhancement — Add emoji alongside labels:**

```typescript
function getRatingLabel(rating: number): string {
  switch (rating) {
    case 1: return '😞 Not great - will avoid next time';
    case 2: return '😕 Meh - not what I needed';
    case 3: return '😐 Okay - served its purpose';
    case 4: return '😊 Good session!';
    case 5: return '🤩 Exactly what I needed!';
    default: return '';
  }
}
```

**Files to modify:**
- `frontend-react/src/components/feedback/FeedbackPrompt.tsx` (1 function, 5 lines)

---

## Consolidated File Change List

### Files to Create (1)
| File | Purpose |
|------|---------|
| `frontend-react/src/components/wizard/TouchGrassModal.tsx` | Wellness modal component |

### Files to Modify (5)
| File | Changes |
|------|---------|
| `frontend-react/src/components/wizard/ResultStep.tsx` | Add `timeOfDay`, `preferredGenres`, `userId` to API request |
| `frontend-react/src/components/MoodShortcuts.tsx` | Add `timeOfDay`, `preferredGenres`, `userId`, `maxContentRating`, `allowNsfw`, `audioAvailability` |
| `frontend-react/src/components/wizard/TimeStep.tsx` | Add 180min preset, Touch Grass trigger logic, import modal |
| `frontend-react/src/components/feedback/FeedbackPrompt.tsx` | Add emoji prefixes to rating labels (optional) |
| `frontend-react/src/types/index.ts` | No change needed — all fields already defined |

### Backend Changes
**None.** All 11 scoring factors are already implemented and waiting for data.

---

## Backend Scoring Activation Summary

| # | Factor | Weight | Currently Active? | Activated By |
|---|--------|--------|--------------------|-------------|
| 1 | Time match | 30% | YES | — |
| 2 | Emotional goal match | 25% | YES | — |
| 3 | Interruptibility match | 20% | YES | — |
| 4 | Energy level match | 15% | YES | — |
| 5 | Time of day match | 5% | NO | GAP 2 fix |
| 6 | Social preference match | 5% | YES | — |
| 7 | Satisfaction bonus (Firestore) | up to 15% | NO (falls back to DB avg) | GAP 7 fix |
| 8 | Genre preference boost | up to 15% | NO | GAP 3 fix |
| 9 | Genre satisfaction boost (Firestore) | up to 10% | NO | GAP 7 fix |
| 10 | Time-of-day satisfaction pattern | up to 5% | NO | GAP 2 + GAP 7 fix |
| 11 | Popularity bonus | up to 10% | YES | — |

**Before fixes:** 6 of 11 scoring factors active
**After fixes:** 10 of 11 active (factor #7 upgrades from DB-average fallback to personalized Firestore data)

---

## Implementation Order

### Phase 1: Critical API Gaps (GAPs 2 + 3 + 4 + 7) — ~30 min combined

All four gaps touch the same two files (`ResultStep.tsx` and `MoodShortcuts.tsx`), so they should be done together in a single pass.

1. Add imports to both files (`getCurrentTimeOfDay`, `getGamingPreferences`, `getContentPreferences`, `useAuthStore`)
2. Add all missing fields to the API request in `ResultStep.tsx`
3. Add all missing fields to the API request in `MoodShortcuts.tsx`
4. Test both paths (wizard + shortcut) — verify backend logs show the new fields arriving

### Phase 2: Touch Grass Modal (GAP 1) — ~2 hours

1. Create `TouchGrassModal.tsx` component
2. Add 180min preset to `TimeStep.tsx`
3. Add trigger logic (>= 180 min → show modal before proceeding)
4. Wire up keep/reduce handlers
5. Test: select 3h → modal appears; "reduce" → resets to 2h; "keep" → proceeds

### Phase 3: Emoji Labels (GAP 6) — ~5 min, optional

1. Add emoji prefixes to `getRatingLabel()` in `FeedbackPrompt.tsx`
2. Visual check

---

## Key Files Reference

| File | Role |
|------|------|
| `frontend-react/src/components/wizard/ResultStep.tsx` | Primary API call — needs `timeOfDay`, `preferredGenres`, `userId` |
| `frontend-react/src/components/MoodShortcuts.tsx` | Secondary API call — needs all missing fields + content safety |
| `frontend-react/src/components/wizard/TimeStep.tsx` | Touch Grass trigger point |
| `frontend-react/src/lib/utils.ts` | Has `getCurrentTimeOfDay()` ready to use |
| `frontend-react/src/hooks/useGamingPreferences.ts` | Has `getGamingPreferences()` ready to use |
| `frontend-react/src/hooks/useContentPreferences.ts` | Has `getContentPreferences()` ready to use |
| `frontend-react/src/stores/authStore.ts` | Has user with database ID |
| `frontend-react/src/types/index.ts` | `RecommendationRequest` type (all fields already defined) |
| `frontend-react/src/components/feedback/FeedbackPrompt.tsx` | Star rating + labels |
| `_archive_frontend_legacy/index.html` | Reference implementation for Touch Grass modal HTML |
| `_archive_frontend_legacy/js/wizard.js` | Reference for Touch Grass trigger/close logic |
| `backend/.../controller/GameController.java` | All 11 scoring factors (read-only reference) |

---

*See also: [PSYCHOLOGY.md](PSYCHOLOGY.md) | [ARCHITECTURE.md](ARCHITECTURE.md) | [ROADMAP.md](ROADMAP.md)*
