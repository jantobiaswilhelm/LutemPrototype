# Lutem Frontend Functionality Specification

**Purpose:** This document describes all features and user flows for each screen/tab of the Lutem application. Use this to create UI/UX mockups for a React rebuild.

**App Concept:** Lutem is an AI-powered gaming recommendation platform that matches games to your current mood, energy level, available time, and emotional goals. The core philosophy is "satisfaction-driven" gaming — helping users find the RIGHT game for RIGHT NOW, not just any game.

---

## Global Elements (Present on All Screens)

### Bottom Navigation Bar
- 4 main tabs: **Home** | **Calendar** | **Games** | **Profile**
- Each tab has an icon and label
- Active tab is highlighted
- Additional nav controls:
  - **Wizard Button** (🧙) - Opens quick recommendation wizard modal
  - **Theme Button** (🎨) - Opens theme selector

### Theme System
- **4 Color Palettes:** Café (warm browns), Lavender (soft purples), Earth (natural greens), Ocean (cool blues)
- **2 Modes:** Light and Dark
- User preference persists across sessions

### Authentication Header
- **Logged Out:** "Sign In" button
- **Logged In:** User avatar, display name, dropdown menu (Profile, Sign Out)
- Pending sessions badge (shows count of sessions needing feedback)

---

## TAB 1: HOME (Recommendation Wizard)

**Purpose:** The core experience — help users find the perfect game for their current situation.

### Main Wizard Form (Always Visible)
A card-based form with 4 input sections in a 2x2 grid on desktop, stacked on mobile:

#### Section 1: Energy Level
- Question: "How's your energy right now?"
- 3 options as visual cards with battery icons:
  - **Low Energy** (1/3 battery)
  - **Medium Energy** (2/3 battery)
  - **High Energy** (full battery)
- Single selection

#### Section 2: Time Available
- Question: "How much time do you have?"
- Slider with discrete stops: 5min, 15min, 30min, 45min, 1hr, 2hr, 3hr, 3hr+
- Large display showing selected time
- Triggers "Touch Grass" modal at 3hr+ (wellness reminder)

#### Section 3: Emotional Goals / Mood
- Question: "What do you want to feel?"
- 6 selectable chips (multi-select):
  - 😌 Unwind
  - 🏆 Progress
  - 🎯 Focus
  - 🗺️ Adventure
  - ⚡ Challenge
  - 🔋 Recharge

#### Section 4: Interruptibility
- Question: "Can you pause anytime?"
- 3 options as cards:
  - **Yes, Anytime** (⏸️) - Flexible
  - **Some Pauses** (💾) - Pauses OK
  - **No, Locked In** (🔒) - Full commitment

### Advanced Options (Collapsible)
Two expandable sections:

#### Genre Preferences
- Grid of selectable genre chips (multi-select)
- Genres: RPG, Action, Strategy, Puzzle, Adventure, Simulation, Sports, Racing, Roguelike, Card Game, Battle Royale, Tactical FPS, Horror, Platformer, Sandbox, Party Game, Board Game, Management, Life Sim, Social Deduction, Survival, Co-op Adventure, Arcade, Farming Sim

#### More Options
- **Time of Day:** Morning, Midday, Afternoon, Evening, Late Night (single select)
- **Social Preference:** Solo, Co-op, Competitive (single select)

### Submit Button
- Large primary button: "🎮 Get Recommendation"
- Triggers API call to backend

### Results Panel
After submission, shows:

#### Top Recommendation Card (Prominent)
- Game cover image (from Steam CDN)
- Game name
- Genre badge
- Time range (e.g., "15-30 min")
- Match percentage (e.g., "95% Match")
- Recommendation reason text
- **Action Buttons:**
  - "📅 Schedule" → Opens schedule modal
  - "🔄 Try Another" → Shows next alternative
  - "ℹ️ Details" → Expands game info

#### Alternative Games Section
- Shows 3-4 alternative recommendations
- Smaller cards with image, name, match %
- Each clickable to view details or schedule

#### Summary Bar (After Recommendation)
- Collapsible bar showing current selections
- Quick edit button to modify inputs
- Shows: Energy | Time | Mood | Interruptibility

### Weekly Summary Section (Top of Page)
- Shows aggregated stats when user has history:
  - Sessions this week
  - Average satisfaction score
  - Most played games
  - Satisfaction trend graph

---

## TAB 2: CALENDAR

**Purpose:** Plan gaming sessions, track scheduled vs completed sessions, manage non-gaming events.

### Locked State (Not Authenticated)
- Overlay with lock icon
- Message: "Sign in to unlock this feature"
- Sign in button

### Unlocked State (Authenticated)

#### Header
- Title: "My Calendar"
- Subtitle: "Plan your gaming sessions and tasks"
- **Action Buttons:**
  - "🎮 Gaming Session" → Opens add event modal (gaming tab)
  - "📋 New Task" → Opens add event modal (task tab)
  - "📥 Import" → Opens ICS import modal

#### Calendar View (FullCalendar Integration)
- Monthly/Weekly/Daily views
- Color-coded events:
  - **Gaming (Calendar):** Purple/primary color
  - **Scheduled Session:** Yellow/pending
  - **Completed Session:** Green
  - **Skipped Session:** Gray
  - **Task/Event:** Blue

#### Event Interactions
- Click event → Opens details modal
- Drag to reschedule (gaming sessions)
- Click empty slot → Opens add event modal with time pre-filled

#### Calendar Legend
- Visual guide showing what each color means

### Add Event Modal
Tabbed modal with two modes:

#### Task Tab
- Title input
- Description textarea
- Start time picker
- End time picker
- Duration display (calculated)

#### Gaming Session Tab
Three sub-modes:

**Browse Library Mode:**
- Search input to filter games
- Scrollable list of all games with:
  - Cover image, name, genre, time range
- Selected game preview

**Wizard Mode (Let Lutem Choose):**
- Mini version of home wizard
- Mood chips selection
- Energy level selection
- "Find Games for This Session" button
- Shows top recommendations to pick from

**Random Mode (Surprise Me):**
- Large dice icon
- "Roll the Dice" button
- Shows random game result
- Accept or re-roll options

### Session Details Modal
When clicking a gaming session:
- Game header with cover image background
- Status badge (Pending/Completed/Skipped)
- Session info grid:
  - Match score percentage
  - Duration
  - Mood
  - Energy
- **For past pending sessions:** Feedback prompt
- **For completed sessions:** Show rating and emotional tags
- Actions: Delete, Add Feedback, Close

### ICS Import Modal
- Instructions for exporting from Google Calendar
- Drag-and-drop zone for .ics file
- Preview of events to import
- Confirm import button

---

## TAB 3: GAMES LIBRARY

**Purpose:** Browse all available games, filter and search, view details.

### Filter Section
Card with 4 filter controls:

- **Search:** Text input with instant filtering
- **Genre:** Dropdown with all genres
- **Mood:** Dropdown with emotional goals
- **Time Available:** Dropdown (Quick 0-30min, Medium 30-60min, Long 60+min)
- **Clear All Filters** button

### Results Count
- "Showing X games" text

### Games Grid
Responsive grid of game cards:

#### Game Card
- Cover image (Steam header image)
- Game name
- Genre badge
- Time range (e.g., "15-30 min")
- Energy level indicator
- Interruptibility indicator
- Average satisfaction stars (if rated)
- Emotional goal tags
- **Hover/Click:** Expand to show full details

#### Game Details (Expanded or Modal)
- Full description
- Best time of day tags
- Social preferences
- Store link (Steam)
- Session count
- Action: "Get Recommendation with This Game"

### Loading State
- Spinner with "Loading games..."

### Empty State
- "No games found" with suggestion to adjust filters

---

## TAB 4: PROFILE

**Purpose:** User settings, preferences, linked accounts, gaming stats.

### Locked State (Not Authenticated)
- Same pattern as Calendar

### Unlocked State

#### User Information Section
- Large avatar (currently placeholder)
- "Change Avatar" button (future feature)
- Display name input
- "Gaming Since" year input

#### Linked Game Libraries Section
- Description text
- List of platforms with connection status:
  - Steam (Not Connected) [Connect]
  - Epic Games (Not Connected) [Connect]
  - Xbox (Not Connected) [Connect]
  - PlayStation (Not Connected) [Connect]
- Future feature: OAuth integration

#### Gaming Preferences Section
- **Preferred Genres:** Selectable tag grid
- **Typical Session Length:** Dropdown (Quick, Short, Medium, Long)
- **Engagement Level:** Dropdown (Casual, Moderate, Intense)

#### Gaming Schedule Section
- Calendar sync checkbox (future feature)
- **Preferred Gaming Times:** Checkboxes
  - Morning (6am-12pm)
  - Afternoon (12pm-6pm)
  - Evening (6pm-12am)
  - Late Night (12am-6am)

#### Gaming Priorities Section
- Radio card selection:
  - 🧘 Relaxation - Unwind and destress
  - 🏆 Challenge - Test your skills
  - 👥 Social - Play with others
  - 📖 Story - Immersive narratives
  - ⚔️ Competition - Ranked matches
  - 🗺️ Exploration - Discover new worlds

#### Emotional Goals Section
- Checkbox selection of default moods:
  - 🌊 Unwind
  - ⚡ Recharge
  - 🎯 Engage
  - 🔥 Challenge
  - 🗺️ Explore
  - 🏆 Achieve

#### Save Button
- "💾 Save Profile" - Saves all settings

---

## MODALS (Standalone Overlays)

### Quick Start Wizard Modal (🧙 button)
Guided flow alternative to home form:

1. **Welcome Screen:** Choice between "Quick Start" (4 questions) or "Custom Setup" (full form)

2. **Question 1 - Energy:**
   - Progress dots (1 of 4)
   - "How are you feeling right now?"
   - 3 large option cards

3. **Question 2 - Time:**
   - Progress dots (2 of 4)
   - "How much time do you have?"
   - Large time slider
   - Time display

4. **Question 3 - Mood:**
   - Progress dots (3 of 4)
   - "What do you want to feel?"
   - 6 mood chips

5. **Question 4 - Interruptibility:**
   - Progress dots (4 of 4)
   - "Can you pause anytime?"
   - 3 option cards
   - "Get Recommendation 🎮" button

### Touch Grass Modal
- Wellness check when selecting 3+ hours
- Icon: 🌱
- Message about taking breaks
- Checklist: moved body? had water? comfortable space?
- Buttons: "I'll Choose Less Time" or "I'm Ready! 🎮"

### Schedule Session Modal
- Game preview (image, name, genre, match %)
- Date picker
- Time picker
- Duration input
- Quick action buttons: "Play Now", "Next Hour", "Tomorrow"
- Confirm button

### Feedback Modal
Post-session feedback collection:
- Game preview
- "Did you play?" options: Yes / No / Different game
- **If Yes:**
  - Duration slider (5-180 min)
  - 5-star rating
  - Emotional tags (Relaxing, Energizing, Satisfying, Frustrating, Challenging, Fun)
  - Optional notes textarea
- **If No:** Simple skip message
- Skip and Submit buttons

### Pending Sessions Modal
- List of sessions awaiting feedback
- Quick feedback submission

### Auth Modal
- Tab: Sign In / Sign Up
- Google OAuth button
- Email/password form
- Error display area

### Game Maximized Modal
- Full-screen game details view
- Large cover image
- All metadata
- Actions

---

## Key User Flows

### Flow 1: Get a Quick Recommendation
1. User opens app (Home tab)
2. Selects energy level
3. Adjusts time slider
4. Picks 1-3 moods
5. Chooses interruptibility
6. Clicks "Get Recommendation"
7. Sees top game + alternatives
8. Clicks "Schedule" or plays directly

### Flow 2: Schedule Gaming Session
1. From home or calendar
2. Opens schedule modal
3. Picks date/time or uses quick buttons
4. Confirms session
5. Session appears on calendar

### Flow 3: Complete Session & Give Feedback
1. After scheduled session time passes
2. User sees pending badge
3. Opens feedback modal
4. Rates experience
5. Session marked complete
6. Data influences future recommendations

### Flow 4: Browse & Discover Games
1. Goes to Games tab
2. Uses filters/search
3. Finds interesting game
4. Views details
5. Can trigger recommendation with that game

---

## Design Notes

### Current Issues to Address
- Heavy emoji usage (consider cleaner iconography)
- Inconsistent spacing/alignment
- Form feels dense on mobile
- Results cards could be more visual
- Theme system works but could be more polished

### Key Differentiators to Highlight
- Satisfaction-driven, not engagement-driven
- Emotional/mood matching
- Time-aware recommendations
- Interruptibility as a key factor
- Session feedback loop

### Target Aesthetic Options
- **Minimal/Clean:** Like Notion, Linear
- **Gaming/Bold:** Like Discord, Steam
- **Premium/Sleek:** Like Spotify, Apple
- **Playful/Colorful:** Current vibe but better

---

*Document generated for mockup creation. Covers all existing functionality.*
