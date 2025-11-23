<div align="center">
  <img src="frontend/lutem-logo.png" alt="Lutem Logo" width="500">
</div>

---

# Lutem MVP

**AI-powered game recommendation system that matches games to your mood, time, and energy level.**

## 📍 Project Status

**Current Phase:** ✅ **FULLY FUNCTIONAL MVP** - Complete End-to-End System

**Last Updated:** November 23, 2025

### ✨ What's Working Now
- ✅ **Professional Branding** - Custom Lutem logo with transparent background across all UI
- ✅ **8 Theme Combinations** - 4 color palettes × light/dark modes with unified selector
- ✅ **Combined Theme Toggle** - Single palette selector menu for both palette and mode
- ✅ **Complete Frontend JavaScript** - All interactions, API calls, and UI logic (500+ lines)
- ✅ **Smart Input Validation** - Hybrid validation with friendly error messages, live feedback, red/green borders
- ✅ **Loading Spinner with Gaming Quotes** - 24 iconic quotes, 2-second minimum display, smooth animations
- ✅ **Guided Setup Modal** - Two-path onboarding (Quick Start vs Custom Setup)
- ✅ **Smart Recommendation Engine** - 8-dimensional scoring algorithm with genre preference soft ranking
- ✅ **Progressive Recommendations Display** - Top 1 + 3 alternatives initially, "See More" button for 6 additional
- ✅ **41 Curated Games with Store Links** - Full library with Steam cover art, genre tags, and shopping cart links
  - Casual games (5-30 min): 7 titles
  - Mid-range (30-60 min): 9 titles  
  - Long-form (60+ min): 4 titles
- ✅ **Results Display** - Top pick with golden badge + expandable alternatives section
- ✅ **7-Parameter Input System** - Emotional goals, genre preferences (soft ranking), energy, flexibility, time, social preference
- ✅ **Feedback System** - 1-5 emoji ratings that update satisfaction tracking and improve future recommendations
- ✅ **Touch Grass Modal** - Wellness reminder for 3+ hour sessions
- ✅ **Maven Wrapper** - Self-contained backend execution without system Maven installation
- ✅ **Enhanced Startup Scripts** - Auto-detect JAVA_HOME, reliable backend launching
- ✅ **Spring Boot Backend** - RESTful API on port 8080
- ✅ **Modern UI/UX** - Clean, responsive design with smooth transitions and progressive disclosure
- ✅ **5 Enum System** - EmotionalGoal, Interruptibility, EnergyLevel, TimeOfDay, SocialPreference
- ✅ **Evidence-Based Design** - Built on psychological research and gaming studies

### 🎯 Recent Restoration (Nov 23, 2025)
**Previous Issue:** During UI updates, all JavaScript functionality was accidentally stripped from the frontend.

**Solution Implemented:** Complete restoration of:
- ✅ 484 lines of JavaScript (theme toggle, modals, forms, API, results)
- ✅ 255 lines of results display CSS (cards, badges, images, alternatives)
- ✅ All event handlers and state management
- ✅ Full API integration with error handling
- ✅ Complete feedback loop functionality

**Latest Enhancements (Nov 23, 2025 - Evening):**
- ✅ **Loading Spinner with Gaming Quotes** - 2-second minimum display with 24 iconic quotes
- ✅ **Maven Wrapper Installation** - Standalone backend execution without system Maven
- ✅ **Enhanced start-backend.bat** - Auto-detects JAVA_HOME and uses Maven wrapper
- ✅ **Comprehensive Documentation** - Added feature guides for new components

**Result:** Application is now fully functional end-to-end with professional loading experience and improved developer onboarding.

### 🏆 QuickWins Complete
- ✅ **#1: Loading Spinner** - Professional animations with rotating tips
- ✅ **#2: Fun Slider** - Discrete steps + "Touch Grass" modal
- ✅ **#3: Store Links** - All 41 games have shopping cart links
- ✅ **#4: Input Validation** - Hybrid validation with red/green borders, shake animations, friendly messages
- ✅ **#5: Guided Setup Modal** - Quick Start wizard + Custom Setup
- ✅ **#6: Branding & Themes** - Professional logo + 4 color palettes

### 🚀 Up Next

**Calendar Integration - In Progress:**
- ⚠️ Calendar backend complete (all CRUD endpoints working)
- ⚠️ Calendar frontend partially implemented (initialization code added)
- ⚠️ Known issues documented in `docs/calendar-known-issues.md`
- ⚠️ Fix guide available in `docs/calendar-fix-guide.md`

**Priority Fixes Needed:**
1. Fix calendar display (not rendering)
2. Make wizard accessible from calendar tab
3. Fix task creation functionality
4. Add task type selection (Task vs Gaming Session)
5. Complete gaming session workflow integration

👉 **See [docs/calendar-known-issues.md](docs/calendar-known-issues.md) for detailed issue tracking**  
👉 **See [docs/calendar-fix-guide.md](docs/calendar-fix-guide.md) for step-by-step fix instructions**

**Other Enhancements:**
- Enhanced game card animations
- Session history tracking
- Weekly satisfaction dashboard
- Expand game library (40+ games)
- Database integration (PostgreSQL)

👉 **See [SESSION_COMPLETE_SUMMARY.md](SESSION_COMPLETE_SUMMARY.md) for detailed technical overview**

---

## 🚀 Quick Start

### ✨ PRIMARY METHOD: Use Startup Scripts (ALWAYS)
```cmd
# Start backend (use this by default)
start-backend.bat

# Start frontend (use this by default)
start-frontend.bat

# Or start everything at once
start-lutem.bat
```

**Why these scripts?**
- ✅ Auto-detect JAVA_HOME
- ✅ Use Maven wrapper (no system Maven needed)
- ✅ Tested and reliable
- ✅ Handle all environment setup automatically

### 🔧 Alternative: IntelliJ (Only if requested)
**Backend:**
1. Open `backend/pom.xml` in IntelliJ IDEA
2. Build → Rebuild Project
3. Run `src/main/java/com/lutem/mvp/LutemMvpApplication.java`
4. Wait for: `"Started LutemMvpApplication"`

**Frontend:**
- Double-click `frontend/index.html`

**⚠️ Note:** Scripts are the primary method - IntelliJ is secondary

---

## 🎮 How It Works

### User Input (7 Parameters)
1. **⏱️ Available Time** - 5min to 3+ hours (discrete slider)
2. **🎯 Emotional Goals** - Unwind, Recharge, Engage, Challenge, Achieve, Explore (multi-select)
3. **🎮 Genre Preferences** - 20+ genres (Puzzle, Action, Strategy, RPG, etc.) - SOFT RANKING (optional)
4. **⏸️ Interruptibility** - Can you pause? (High/Medium/Low)
5. **⚡ Energy Level** - How much mental energy? (Low/Medium/High)
6. **🌙 Time of Day** - Morning/Afternoon/Evening/Late Night (optional)
7. **👥 Social Preference** - Solo/Co-op/Competitive

### Smart Recommendation Algorithm
**8-Tier Scoring System (115 points max):**
- **Time Match (30%)** - Game must fit your available time
- **Emotional Goal Match (25%)** - Aligns with desired mood
- **Interruptibility Match (20%)** - Matches your flexibility needs
- **Energy Level Match (15%)** - Suits your current mental state
- **Time of Day Match (5%)** - Optimal playing time bonus
- **Social Preference Match (5%)** - Solo/multiplayer fit
- **Satisfaction Bonus (max 10%)** - Previous user ratings
- **Genre Preference Boost (max 15%)** - SOFT RANKING: Boosts score for preferred genres without eliminating other matches

### Output
- **Top Recommendation** with golden crown badge, game image, and 95% match indicator
- **3 Initial Alternatives** - Best matches shown immediately
- **"See 6 More Alternatives" Button** - Reveals additional 6 recommendations on click
- **Match explanation** - Why each game was selected
- **Interactive feedback** - 1-5 emoji rating system for continuous learning

**Progressive Display Strategy:**
- Shows **top 4 games initially** (1 top pick + 3 alternatives)
- **"See More" button** appears if more than 4 recommendations exist
- **Expands to show all 10 games** (or however many were recommended)
- **Smooth animation** when expanding alternatives
- **Button disappears** after expansion (clean UX)

**Why Progressive Display?**
- Prevents overwhelming users with too many choices (decision fatigue)
- Highlights the best matches first (top 4 are usually the best fit)
- Allows exploration without forcing it
- Faster initial page load and perceived performance

**Example:**
```
Input: 30 min, Unwind + Achieve, High flexibility, Low energy, Evening, Solo

Top Pick: Unpacking (92/100) 👑
[Game Image]
95% Match
→ "Perfect for: fits your 30 min, unwind, low energy, highly rated by you"

Initial Alternatives (shown immediately):
1. Stardew Valley (88/100) - "Relaxing farming, achievable goals"
2. PowerWash Simulator (85/100) - "Meditative cleaning, easy to pause"  
3. Dorfromantik (82/100) - "Peaceful puzzle, evening-friendly"

[See 6 More Alternatives Button]

Additional Alternatives (shown after clicking):
4. A Short Hike (79/100) - "Cozy exploration, low commitment"
5. Baba Is You (76/100) - "Clever puzzles, mental stimulation"
... (up to 10 total recommendations)
```

---

## 🧠 Why This Works

Lutem isn't just another recommendation algorithm - it's built on psychological principles and gaming research that explain why traditional game discovery often fails.

### The Problem with Traditional Discovery

**Decision Paralysis:**
- Modern game libraries contain 100-1000+ titles
- More choices = More anxiety (Barry Schwartz, "The Paradox of Choice")
- Players spend more time browsing than playing
- Result: Frustration, abandoned sessions, and lower satisfaction

**Engagement-First Metrics:**
- Steam, Xbox, PlayStation optimize for "hours played"
- Longer sessions = Better metrics ≠ Better experience
- Ignores emotional state, energy levels, and real-world constraints
- Can lead to burnout and negative gaming experiences

**Genre-Only Filtering:**
- Traditional systems: "You like RPGs, here are 500 RPGs"
- Ignores context: A 2-hour RPG at 11pm after work might be terrible
- Misses perfect matches from other genres
- Creates filter bubbles and reduces discovery

### Lutem's Evidence-Based Approach

**1. Multi-Dimensional Matching (8 Factors)**
*Research Basis:* Personalization systems that consider multiple contextual factors significantly improve user satisfaction and reduce information overload (Liang et al., 2006, "Personalized Content Recommendation and User Satisfaction").

**How Lutem Applies It:**
- Time availability (prevents incomplete sessions)
- Emotional goals (mood-aligned gaming)
- Energy levels (cognitive load matching)
- Interruptibility needs (real-world flexibility)
- Time of day (circadian rhythm optimization)
- Social preferences (solo/co-op/competitive fit)
- Genre preferences (soft ranking, not filtering)
- Satisfaction history (continuous learning)

**2. Emotional Satisfaction Focus**
*Research Basis:* 88.4% of gamers report positive emotional benefits from gaming when games match their emotional needs, including stress relief and mood enhancement (Hazel et al., 2022, "Mental Health Benefits of Video Games").

**How Lutem Applies It:**
- Prioritizes "how you'll feel" over "how long you'll play"
- Matches games to 6 emotional goals (Unwind, Recharge, Engage, Challenge, Achieve, Explore)
- Considers energy levels to prevent mental fatigue
- Optimizes for satisfaction, not just engagement time

**3. Soft Ranking vs Hard Filtering**
*Research Basis:* Recommendation systems that use soft ranking (boosting scores) instead of hard filtering (eliminating options) maintain diversity while respecting preferences, reducing filter bubbles and improving discovery (Ziegler et al., 2005, "Improving Recommendation Lists Through Topic Diversification").

**How Lutem Applies It:**
- Genre preferences boost scores (+15% max) but never eliminate games
- Preserves cross-genre discovery (e.g., puzzle lovers finding great strategy games)
- Prevents over-specialization and gaming echo chambers
- Surfaces unexpected gems that match emotional needs

**4. Progressive Disclosure**
*Research Basis:* Presenting information in stages reduces cognitive load and prevents decision paralysis (Nielsen Norman Group, "Progressive Disclosure").

**How Lutem Applies It:**
- Shows 4 games initially (top pick + 3 alternatives)
- "See More" button for deeper exploration (optional)
- Guided setup modal with 3-step onboarding
- Collapsible advanced options
- Reduces overwhelm while maintaining depth

**5. Feedback-Driven Learning**
*Research Basis:* Continuous learning systems that incorporate user feedback improve recommendation quality over time and build trust through transparency (Choung et al., 2022, "Trust in AI and Its Role in Acceptance of AI Technologies").

**How Lutem Applies It:**
- Post-session emoji feedback (1-5 scale)
- Updates game satisfaction scores
- Influences future recommendations (up to +10% score boost)
- Transparent scoring: always explains WHY a game was recommended
- Builds trust through explainability

**6. Context-Aware Timing**
*Research Basis:* Time-of-day affects cognitive performance and preferences. Evening sessions favor relaxing activities, while morning sessions support higher-energy tasks (Schmidt et al., 2007, "A Time to Think: Circadian Rhythms in Human Cognition").

**How Lutem Applies It:**
- Optional time-of-day input (Morning/Afternoon/Evening/Late Night)
- Games tagged with optimal playing times
- Considers energy levels in combination with time
- Prevents mismatched recommendations (e.g., high-intensity games when tired)

**7. Wellness Integration**
*Research Basis:* Gaming can support well-being when balanced with real-world needs. Excessive session lengths can lead to negative outcomes (Digital Wellness Research, 2024).

**How Lutem Applies It:**
- "Touch Grass" modal for 3+ hour sessions
- Encourages breaks, movement, hydration
- Respects time constraints (prevents overcommitment)
- Frames gaming as part of balanced lifestyle

### The Result: Better Gaming, Less Stress

Lutem transforms gaming from:
- ❌ "Endless scrolling through libraries"
- ❌ "Starting games that don't fit your mood"
- ❌ "Feeling guilty about gaming choices"
- ❌ "Burnout from poorly-timed sessions"

To:
- ✅ **Instant, confident recommendations** (under 3 seconds)
- ✅ **Emotionally aligned gaming** (matches your mood and energy)
- ✅ **Guilt-free leisure** (respects your time and well-being)
- ✅ **Continuous improvement** (learns from your feedback)

### Research References

- Barry Schwartz (2004). *The Paradox of Choice: Why More Is Less*
- Liang et al. (2006). "Personalized Content Recommendation and User Satisfaction." *Journal of Management Information Systems*
- Hazel et al. (2022). "Mental Health Benefits of Video Games." *Australasian Psychiatry*
- Ziegler et al. (2005). "Improving Recommendation Lists Through Topic Diversification." *ACM WWW Conference*
- Choung et al. (2022). "Trust in AI and Its Role in Acceptance of AI Technologies." *International Journal of Human-Computer Interaction*
- Schmidt et al. (2007). "A Time to Think: Circadian Rhythms in Human Cognition." *Cognitive Psychology*
- Nielsen Norman Group. "Progressive Disclosure." *UX Design Principles*

---

## 📂 Project Structure
```
lutem-mvp/
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/lutem/mvp/
│   │   ├── LutemMvpApplication.java      # Main app
│   │   ├── GameController.java           # API + 20 games w/ images
│   │   ├── Game.java                     # Game model (with imageUrl)
│   │   ├── EmotionalGoal.java            # Enum: mood types
│   │   ├── Interruptibility.java         # Enum: pause flexibility
│   │   ├── EnergyLevel.java              # Enum: mental energy
│   │   ├── TimeOfDay.java                # Enum: optimal timing
│   │   ├── SocialPreference.java         # Enum: solo/co-op
│   │   ├── RecommendationRequest.java    # Request model
│   │   ├── RecommendationResponse.java   # Response model
│   │   └── SessionFeedback.java          # Feedback model
│   └── pom.xml                   # Maven config
├── frontend/
│   └── index.html                # Full-stack app (1,977 lines)
│                                 # - HTML structure
│                                 # - Complete CSS (theme, modals, results)
│                                 # - Full JavaScript (484 lines)
├── docs/                         # Documentation
├── start-backend.bat             # Reliable Maven launcher
├── start-frontend.bat            # Opens browser
├── start-lutem.bat               # Start everything
├── force-clean.bat               # Deep clean build cache
├── git-commit.bat                # Git workflow helper
└── SESSION_COMPLETE_SUMMARY.md   # Technical deep-dive
```

---

## 🎯 API Endpoints

**Backend:** `http://localhost:8080`

### GET /games
Returns all 20 games with full metadata including Steam image URLs.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Unpacking",
    "minMinutes": 10,
    "maxMinutes": 20,
    "emotionalGoals": ["UNWIND", "ACHIEVE", "EXPLORE"],
    "interruptibility": "HIGH",
    "energyRequired": "LOW",
    "bestTimeOfDay": ["MIDDAY", "EVENING", "LATE_NIGHT"],
    "socialPreferences": ["SOLO"],
    "genre": "Puzzle",
    "description": "Zen unpacking simulator with cozy vibes",
    "imageUrl": "https://cdn.cloudflare.steamstatic.com/steam/apps/1135690/header.jpg",
    "averageSatisfaction": 4.2,
    "sessionCount": 5
  }
]
```

### POST /recommendations
Get personalized game recommendation with top pick and 3 alternatives.

**Request:**
```json
{
  "availableMinutes": 30,
  "desiredEmotionalGoals": ["UNWIND", "ACHIEVE"],
  "requiredInterruptibility": "HIGH",
  "currentEnergyLevel": "LOW",
  "timeOfDay": "EVENING",
  "socialPreference": "SOLO"
}
```

**Response:**
```json
{
  "topRecommendation": { /* Game object */ },
  "alternatives": [ /* 3 Game objects */ ],
  "topReason": "Perfect for: fits your 30 min, unwind, achieve, low energy, highly rated by you",
  "alternativeReasons": [ /* 3 reasons */ ]
}
```

### POST /sessions/feedback
Submit satisfaction rating for a game (1-5).

**Request:**
```json
{
  "gameId": 1,
  "satisfactionScore": 5
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Feedback recorded"
}
```

---

## 🎮 Game Library (20 Games)

### Casual (5-30 min) - 7 Games
Unpacking • Dorfromantik • Tetris Effect • Dead Cells • Rocket League • Baba Is You • A Short Hike

### Mid-Range (30-60 min) - 9 Games
Hades • Stardew Valley • Slay the Spire • Apex Legends • PowerWash Simulator • Into the Breach • Loop Hero • The Witness • Valorant

### Long-Form (60+ min) - 4 Games
The Witcher 3 • Minecraft • Dark Souls III • Civilization VI

**All games include:**
- ✅ Steam header images (460x215)
- ✅ Rich metadata (genre, description)
- ✅ Multi-dimensional categorization
- ✅ Satisfaction tracking

---

## 💡 Key Features

### 🌙 Color Palette & Theme System *(Updated Nov 23, 2025)*
**✨ NEW: Combined Palette Selector** - Single unified interface for both palette and mode selection

**8 Total Theme Combinations:**
- 4 color palettes × 2 modes (light/dark)
- Each palette available in both light and dark variants
- Unified palette selector menu (bottom-right corner)
- Separate controls for mode (☀️ Light / 🌙 Dark) and palette selection

**4 Color Palette Themes:**
- ☕ **Warm Café (Default)** - Cozy browns and creams (light) / Rich coffee tones (dark)
- 💜 **Soft Lavender** - Gentle purples (light) / Deep mysterious purples (dark)
- 🌿 **Natural Earth** - Fresh green tones (light) / Deep forest greens (dark)
- 🌊 **Ocean Breeze** - Sky blues (light) / Deep ocean blues (dark)

**Key Features:**
- **Unified selector:** Combined palette and mode toggle in single menu
- **Visual preview:** Color swatches for each palette option
- **Instant switching:** Changes apply immediately without reload
- **Persistent storage:** Preferences saved via localStorage
- **Smart icons:** Palette icon in light mode, moon icon in dark mode
- **Mood adaptation:** All 6 mood colors adjust per theme and mode
- **Smooth transitions:** Seamless visual changes between themes

👉 **See [COLOR_PALETTE_SYSTEM.md](docs/features/COLOR_PALETTE_SYSTEM.md) for complete documentation**

### 🚀 Guided Setup Modal
Two-path onboarding system for different user preferences:

**Quick Start (~30 seconds):**
- Step 1: Choose your energy level (Relaxed 😌 / Balanced 😊 / Energized 🔥)
- Step 2: Set available time with big friendly slider
- Step 3: Select emotional goals (multi-select mood chips)
- Progress dots show current step
- Back/Next navigation on every step
- Auto-fills sensible defaults for advanced options
- Shows only on first visit (localStorage)

**Custom Setup:**
- Direct access to full form
- Complete control over all 6 parameters
- Collapsible advanced options (Time of Day, Social Preference)
- Visual hierarchy with clear sections

**Smart Features:**
- Welcome modal appears on page load (first time)
- Background blurs when modal is active
- Smooth animations between questions
- "Skip to full form" link always visible
- Form state syncs after wizard completion
- Both paths lead to same powerful recommendation engine

### 🌱 "Touch Grass" Modal
When selecting 3+ hours on the time slider:
- Friendly reminder to take breaks
- Promotes healthy gaming habits
- Wellness checklist (movement, hydration, comfort)
- Two options: keep selection or adjust time
- Always resets to 3 hours after closing (prevents re-trigger)
- Appears above all other modals (z-index: 3000)

### 🎮 Genre Preference System (SOFT RANKING)
**NEW FEATURE:** Intelligent genre preference without over-filtering

**20+ Genre Options:**
- 🧩 Puzzle • ⚔️ Action • 🎲 Strategy • 🗡️ RPG • 🎯 Platformer
- 🏎️ Racing • ⚽ Sports • 🎲 Roguelike • 🃏 Card Game
- 🔫 Tactical FPS • 👻 Horror • 🏗️ Sandbox • 🎉 Party Game
- 📊 Management • 🏡 Life Sim • 🕵️ Social Deduction
- ⛺ Survival • 🤝 Co-op Adventure • 👾 Arcade • 🚜 Farming Sim

**How It Works:**
- **Multi-select chip interface** - Click genres you enjoy
- **Soft ranking approach** - Boosts preferred genres (+15% max score)
- **Never eliminates games** - Prevents over-filtering
- **Intelligent scoring** - Calculates match percentage based on overlap
- **Optional feature** - Leave blank for standard recommendations

**Why Soft Ranking?**
Traditional hard filtering (showing ONLY selected genres) can:
- Eliminate excellent matches that don't perfectly fit genre tags
- Reduce recommendation quality by ignoring other 7 scoring dimensions
- Create artificial barriers to game discovery

Lutem's soft ranking:
- ✅ Prioritizes your genre preferences
- ✅ Still considers emotional fit, time, energy, etc.
- ✅ Surfaces unexpected gems you might love
- ✅ Maintains recommendation quality and diversity

**Example:**
You select "Puzzle" and "Strategy":
- Games with both genres get +15% boost
- Games with one genre get +7.5% boost  
- Games with neither genre still eligible if they match other criteria
- Result: Smart prioritization without missing great recommendations

### 🎯 Results Display
**Top Recommendation Card:**
- 👑 Golden "Top Pick" badge
- 🖼️ Large game cover image (Steam header)
- 📊 "95% Match" percentage overlay
- 📝 Game title, genre, description
- ⏱️ Time range (min-max minutes)
- ⚡ Energy level required
- ⏸️ Interruptibility (pause flexibility)
- 💡 Match reason explanation
- 😊 1-5 emoji feedback buttons

**Alternatives Section:**
- Grid layout (responsive)
- 3 alternative games
- Medium-sized game images
- Title, genre, match reason
- Time and energy metadata
- Hover effects with elevation

### 🔄 Feedback System
- **5 emoji ratings**: 😞 😕 😐 😊 🤩
- **Instant submission** to backend
- **Updates game satisfaction** score
- **Influences future recommendations**
- **Success confirmation** message
- **Persistent tracking** across sessions

### 🎯 Multi-Dimensional Matching
Goes beyond simple genre matching:
- Considers emotional state (6 goals)
- Respects energy levels (3 levels)
- Accommodates flexibility needs (3 types)
- Optimizes for time of day
- Matches social preferences
- Learns from satisfaction feedback

### 🔄 Transparent Recommendations
Always explains WHY a game was recommended:
- Shows scoring breakdown
- Lists matching attributes
- Provides context for alternatives
- Displays match percentages

---

## 🛠️ Technologies

- **Backend**: Spring Boot 3.2.0, Java 17+
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Build**: Maven 3.9+ (use provided startup scripts)
- **Storage**: In-memory HashMap (future: PostgreSQL)
- **API**: RESTful with JSON
- **CSS**: Custom properties for theming
- **JavaScript**: ES6+ with async/await

### Frontend Architecture
```javascript
// State Management
const state = {
    selectedGoals: [],
    availableMinutes: 30,
    energyLevel: null,
    interruptibility: null,
    timeOfDay: null,
    socialPreference: null
};

// API Communication
async function getRecommendation() {
    // Validation → API call → Display results
}

// Theme Management
localStorage.setItem('theme', 'dark');
root.setAttribute('data-theme', 'dark');
```

---

## ⚙️ Troubleshooting

### Backend won't start
```cmd
# Option 1: Use reliable startup script
start-backend.bat

# Option 2: Deep clean + rebuild in IntelliJ
force-clean.bat
# Then: Build → Rebuild Project
```

### IntelliJ serves old code
**Problem:** Build cache not updating  
**Solution:** Always use `start-backend.bat` (uses Maven, never caches)

### Port 8080 already in use
```cmd
# Find process using port
netstat -ano | findstr :8080

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Frontend can't connect
1. Verify backend console shows: `"Started LutemMvpApplication"`
2. Check browser DevTools (F12) for errors
3. Confirm backend URL is `http://localhost:8080`
4. Check CORS configuration in GameController

### Dark mode not persisting
- Check browser localStorage (DevTools → Application tab)
- Clear browser cache and reload
- Verify JavaScript is enabled

### Results not displaying
1. Open DevTools (F12) and check Console for errors
2. Verify API response in Network tab
3. Check that backend returned `topRecommendation` (not `game`)
4. Ensure all 20 games have valid `imageUrl` fields

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [SESSION_COMPLETE_SUMMARY.md](SESSION_COMPLETE_SUMMARY.md) | Technical deep-dive and architecture |
| [TODO.md](TODO.md) | Roadmap, tasks, and progress tracking |
| `docs/CLAUDE_INSTRUCTIONS.md` | Development environment setup |
| `docs/LOADING_SPINNER_FEATURE.md` | **NEW:** Loading spinner with gaming quotes feature guide |
| `docs/MAVEN_WRAPPER_SETUP.md` | **NEW:** Maven wrapper installation and troubleshooting |
| `docs/LOADING_SPINNER_IMPLEMENTATION.md` | Complete loading spinner technical documentation |
| [QuickWin_1_LoadingSpinner.md](QuickWin_1_LoadingSpinner.md) | Loading spinner feature guide & future ideas |
| `QuickWin_2_FunSlider.md` | Time slider feature documentation |

---

## 🎯 Next Development Phase

### Content Expansion
- Add 20+ more games (target: 40 total)
- Broader genre coverage
- More diverse emotional profiles
- Game discovery history

### Feature Additions
- Session history tracking
- Weekly satisfaction summary dashboard
- Game bookmarking/favorites
- Export session reports
- Advanced filtering options

### Technical Improvements
- Database integration (PostgreSQL)
- User authentication
- API rate limiting
- Enhanced caching strategy
- Mobile-responsive optimizations

---

## 📝 License

Educational project for Strategic Business Innovation 2025  
University of Applied Sciences Northwestern Switzerland

---

## 🙏 Acknowledgments

Built with:
- Spring Boot Framework
- Claude AI (development assistant)
- IntelliJ IDEA
- Steam (game cover art)
- A passion for gaming and UX

---

## 🔄 Changelog

### November 23, 2025 - Calendar Integration Attempt
- **CALENDAR BACKEND:** Complete CRUD API implementation
  - POST /calendar/events - Create events (tasks or gaming sessions)
  - GET /calendar/events - Retrieve all events (with date filtering)
  - PUT /calendar/events/{id} - Update event times/details
  - DELETE /calendar/events/{id} - Remove events
  - CalendarEvent entity with EventType enum (GAME/TASK)
  - Full JPA repository with query methods
- **CALENDAR FRONTEND:** Partial implementation (not yet functional)
  - FullCalendar library integration attempted
  - Event modals created (Event Details, Add Task)
  - Calendar initialization code added
  - Event management functions implemented
  - Utility functions for date formatting
  - Toast notification system
- **KNOWN ISSUES:** Documented 5 critical blockers
  - Issue #1: Calendar not displaying on Calendar tab
  - Issue #2: Game wizard not accessible from calendar
  - Issue #3: Task creation functionality not working
  - Issue #4: Missing task type selection (Task vs Gaming Session)
  - Issue #5: Gaming session workflow not integrated
- **DOCUMENTATION:** Comprehensive issue tracking created
  - `docs/calendar-known-issues.md` - Detailed issue analysis
  - `docs/calendar-fix-guide.md` - Step-by-step debugging guide
  - `docs/TODO.md` - Updated project roadmap
  - README updated with calendar status section
- **NEXT SESSION PRIORITIES:**
  - Fix calendar display issue first
  - Make wizard globally accessible
  - Complete task type selection modal
  - Test full calendar → wizard → event flow

### November 23, 2025 - Late Night Session (Theme System Enhancement)
- **COMBINED THEME TOGGLE:** Unified palette selector interface
  - Merged separate palette and mode toggles into single menu
  - Added dark mode variants for all 4 color palettes (8 total combinations)
  - Improved UX with visual color swatches and mode toggle buttons
  - Smart icon display: palette icon (light) / moon icon (dark)
  - Maintains localStorage persistence and instant switching
  - Created comprehensive COLOR_PALETTE_SYSTEM.md documentation
- **WHY THIS CHANGE:**
  - Reduces UI clutter (one button instead of two)
  - Improves discoverability with visual preview
  - Provides more theme variety (4 themes → 8 combinations)
  - Maintains all previous functionality with better organization

### November 23, 2025 - Late Night Session
- **PROGRESSIVE RECOMMENDATIONS:** Enhanced results display system
  - Top 1 + 3 alternatives shown initially (prevents decision paralysis)
  - "See 6 More Alternatives" button reveals remaining recommendations
  - Smooth expansion animation with automatic button removal
  - Improves perceived performance and reduces cognitive load
  - Implements progressive disclosure UX principle
- **WHY THIS WORKS:** Added comprehensive section explaining the science
  - 7 evidence-based psychological principles behind Lutem
  - Research citations from academic journals
  - Explains multi-dimensional matching, emotional satisfaction focus
  - Details soft ranking vs hard filtering approach
  - Covers progressive disclosure, feedback learning, context-aware timing
  - Includes wellness integration and research references
- **DOCUMENTATION:** Major README enhancements
  - Updated output examples with progressive display
  - Added detailed explanations of recommendation strategy
  - Improved clarity on feedback system impact
  - Enhanced developer and user-facing documentation

### November 23, 2025 - Late Evening
- **GENRE PREFERENCES:** Added intelligent genre preference system
  - 20+ genre options with emoji icons
  - Multi-select chip interface
  - Soft ranking approach (boosts score, doesn't filter)
  - Backend scoring integration (+15% max boost)
  - Formula: (matchedGenres / totalPreferredGenres) * 15.0
  - All 41 games tagged with appropriate genres
  - Preserves multi-dimensional recommendation quality
  - Optional feature - works great with or without selection

### November 23, 2025 - Evening Session
- **LOADING SPINNER:** Added engaging 2-second loading experience
  - 24 iconic gaming quotes from classic titles
  - Smooth spinner animation with theme-aware colors
  - Smart timing system (minimum 2s display to prevent flashing)
  - Random quote rotation on each load
  - Created comprehensive feature documentation
- **MAVEN WRAPPER:** Improved developer onboarding
  - Added Maven wrapper for standalone execution
  - No system Maven installation required
  - Auto-detect JAVA_HOME in start-backend.bat
  - Version-locked Maven 3.9.6 for consistency
  - Created setup documentation guide
- **DEVELOPER EXPERIENCE:** Enhanced build reliability
  - Updated startup scripts with better error messages
  - Improved first-run experience
  - Self-contained project setup

### November 23, 2025 - Morning Session
- **BRANDING:** Added professional Lutem logo and visual identity
  - Created custom logo with transparent background (328KB)
  - Integrated logo into main header (440px) and modal (304px)
  - Updated README with centered logo at top
  - Optimized margins and spacing for cleaner layout
- **UI/UX:** Added 4 color palette themes
  - 🍂 Café (default warm browns), 💜 Soft Lavender, 🌿 Natural Earth, 🌊 Ocean Breeze
  - Each palette includes custom variables for all UI elements
  - Persistent theme selection via localStorage
  - Seamless transitions between palettes
- **GAME LIBRARY:** Expanded and categorized 20 games
  - 7 casual games (5-30 min)
  - 9 mid-range games (30-60 min)
  - 4 long-form games (60+ min)
  - All games include Steam cover art and rich metadata
- **DOCUMENTATION:** Enhanced project documentation
  - Created loading spinner implementation guide
  - Documented Git commit information and deployment
  - Added technical specs, code examples, testing checklist
  - Listed future enhancement opportunities
- **MAJOR:** Restored complete frontend functionality after accidental stripping
  - Added 484 lines of JavaScript (all interactions, API, modals)
  - Added 255 lines of results display CSS
  - Restored theme toggle, guided modal, feedback system
  - Fixed all event handlers and state management
- Complete end-to-end testing and validation

### November 22, 2025
- Implemented Guided Setup Modal with Quick Start wizard
- Added UI cleanup with collapsible advanced options
- Created comprehensive session documentation
- Enhanced time slider with "Touch Grass" modal
- **QuickWin #1:** Added loading spinner with rotating gaming tips
