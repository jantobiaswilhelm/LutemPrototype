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
- ✅ **4 Color Palette Themes** - Café (default), Soft Lavender, Natural Earth, Ocean Breeze
- ✅ **Dark/Light Mode Toggle** - Persistent theme switching with localStorage
- ✅ **Complete Frontend JavaScript** - All interactions, API calls, and UI logic (484 lines)
- ✅ **Guided Setup Modal** - Two-path onboarding (Quick Start vs Custom Setup)
- ✅ **Smart Recommendation Engine** - 5-dimensional scoring algorithm
- ✅ **20 Curated Games with Images** - Full library with Steam cover art
  - Casual games (5-30 min): 7 titles
  - Mid-range (30-60 min): 9 titles  
  - Long-form (60+ min): 4 titles
- ✅ **Results Display** - Top pick with golden badge + 3 alternatives
- ✅ **6-Parameter Input System** - Emotional goals, energy, flexibility, time, social preference
- ✅ **Feedback System** - 1-5 emoji ratings that update satisfaction tracking
- ✅ **Touch Grass Modal** - Wellness reminder for 3+ hour sessions
- ✅ **Loading States** - Professional animations with rotating gaming tips
- ✅ **Spring Boot Backend** - RESTful API on port 8080
- ✅ **Modern UI/UX** - Clean, responsive design with smooth transitions
- ✅ **5 Enum System** - EmotionalGoal, Interruptibility, EnergyLevel, TimeOfDay, SocialPreference

### 🎯 Recent Restoration (Nov 23, 2025)
**Problem:** During UI updates, all JavaScript functionality was accidentally stripped from the frontend.

**Solution:** Complete restoration of:
- ✅ 484 lines of JavaScript (theme toggle, modals, forms, API, results)
- ✅ 255 lines of results display CSS (cards, badges, images, alternatives)
- ✅ All event handlers and state management
- ✅ Full API integration with error handling
- ✅ Complete feedback loop functionality

**Result:** Application is now fully functional end-to-end with all features working.

### 🏆 QuickWins Complete
- ✅ **#1: Loading Spinner** - Professional animations with rotating tips
- ✅ **#2: Fun Slider** - Discrete steps + "Touch Grass" modal
- ✅ **#3: UI Cleanup** - Collapsible advanced options, visual hierarchy
- ✅ **#4: Guided Setup Modal** - Quick Start wizard + Custom Setup
- ✅ **#5: Branding & Themes** - Professional logo + 4 color palettes

### 🚀 Up Next
- Enhanced game card animations
- Session history tracking
- Weekly satisfaction dashboard
- Expand game library (40+ games)
- Database integration (PostgreSQL)

👉 **See [SESSION_COMPLETE_SUMMARY.md](SESSION_COMPLETE_SUMMARY.md) for detailed technical overview**

---

## 🚀 Quick Start

### ✨ EASIEST: Use Startup Scripts
```cmd
# Start everything at once
start-lutem.bat

# Or start individually:
start-backend.bat   # Launches backend with Maven
start-frontend.bat  # Opens frontend in browser
```

### 🔧 Alternative: IntelliJ
**Backend:**
1. Open `backend/pom.xml` in IntelliJ IDEA
2. Build → Rebuild Project
3. Run `src/main/java/com/lutem/mvp/LutemMvpApplication.java`
4. Wait for: `"Started LutemMvpApplication"`

**Frontend:**
- Double-click `frontend/index.html`

**⚠️ Note:** If IntelliJ serves old code, use `start-backend.bat` (always uses Maven)

---

## 🎮 How It Works

### User Input (6 Parameters)
1. **⏱️ Available Time** - 5min to 3+ hours (discrete slider)
2. **🎯 Emotional Goals** - Unwind, Recharge, Engage, Challenge, Achieve, Explore (multi-select)
3. **⏸️ Interruptibility** - Can you pause? (High/Medium/Low)
4. **⚡ Energy Level** - How much mental energy? (Low/Medium/High)
5. **🌙 Time of Day** - Morning/Afternoon/Evening/Late Night (optional)
6. **👥 Social Preference** - Solo/Co-op/Competitive

### Smart Recommendation Algorithm
**5-Tier Scoring System (100 points):**
- **Time Match (30%)** - Game must fit your available time
- **Emotional Goal Match (25%)** - Aligns with desired mood
- **Interruptibility Match (20%)** - Matches your flexibility needs
- **Energy Level Match (15%)** - Suits your current mental state
- **Time of Day Match (5%)** - Optimal playing time bonus
- **Social Preference Match (5%)** - Solo/multiplayer fit
- **Satisfaction Bonus (max 10%)** - Previous user ratings

### Output
- **Top Recommendation** with golden crown badge, game image, and 95% match indicator
- **3 Alternative Games** with reasons and metadata
- **Match explanation** - Why each game was selected
- **Interactive feedback** - 1-5 emoji rating system

**Example:**
```
Input: 30 min, Unwind + Achieve, High flexibility, Low energy, Evening, Solo

Top Pick: Unpacking (92/100) 👑
[Game Image]
95% Match
→ "Perfect for: fits your 30 min, unwind, low energy, highly rated by you"

Alternatives:
1. Stardew Valley (88/100) - "Relaxing farming, achievable goals"
2. PowerWash Simulator (85/100) - "Meditative cleaning, easy to pause"  
3. Dorfromantik (82/100) - "Peaceful puzzle, evening-friendly"
```

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

### 🌙 Dark Mode & Color Palettes
**Dark/Light Mode Toggle:**
- **Toggle button** (bottom-right corner)
- **Persistent** via localStorage
- **Smooth transitions** between themes
- **Complete coverage** - all UI elements themed
- **Icons change** - 🌙 (light) ↔ ☀️ (dark)

**4 Color Palette Themes:**
- 🍂 **Café (Default)** - Warm browns and creams, cozy coffee shop aesthetic
- 💜 **Soft Lavender** - Gentle purples and pastels, calming and elegant
- 🌿 **Natural Earth** - Green earth tones, organic and grounded
- 🌊 **Ocean Breeze** - Cool blues and teals, fresh and serene

Each palette includes:
- Custom color variables for backgrounds, text, and accents
- Mood-specific colors that adapt to the theme
- Optimized contrast for readability
- Seamless transitions between palettes
- Persistent selection via localStorage

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
| `docs/LOADING_SPINNER_IMPLEMENTATION.md` | **NEW:** Complete loading spinner documentation |
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

### November 23, 2025
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
- **DOCUMENTATION:** Added comprehensive loading spinner implementation guide
  - Created `docs/LOADING_SPINNER_IMPLEMENTATION.md` with full technical specs
  - Documented Git commit information and deployment status
  - Included detailed feature specs, code examples, and testing checklist
  - Listed future enhancement opportunities across 4 tiers
  - Added metrics, success criteria, and lessons learned
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
