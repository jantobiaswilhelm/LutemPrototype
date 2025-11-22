# Lutem MVP

**AI-powered game recommendation system that matches games to your mood, time, and energy level.**

## 📍 Project Status

**Current Phase:** ✅ **Core MVP Complete** - Multi-Dimensional Recommendation System

**Last Updated:** November 22, 2025

### ✨ What's Working Now
- ✅ **Guided Setup Modal** - Two-path onboarding (Quick Start vs Custom Setup)
- ✅ **Smart Recommendation Engine** - 5-dimensional scoring algorithm
- ✅ **20 Diverse Games** - Fully categorized with rich metadata
- ✅ **6-Parameter Input System** - Emotional goals, energy, flexibility, time, social preference
- ✅ **Top 3 Alternatives** - Backend returns multiple options with explanations
- ✅ **Fun Time Slider** - Discrete steps with "Touch Grass" modal for 3+ hours
- ✅ **Loading Spinner** - Professional animations with rotating gaming tips
- ✅ **Spring Boot Backend** - RESTful API on port 8080
- ✅ **Modern Frontend** - Clean, responsive UI with smooth transitions
- ✅ **5 Enum System** - EmotionalGoal, Interruptibility, EnergyLevel, TimeOfDay, SocialPreference

### 🎯 QuickWins Progress
- ✅ **#1: Loading Spinner** - COMPLETE (with rotating tips)
- ✅ **#2: Fun Slider** - COMPLETE (discrete steps + "Touch Grass" modal)
- ✅ **#3: UI Cleanup** - COMPLETE (collapsible advanced options, visual hierarchy)
- ✅ **#4: Guided Setup Modal** - COMPLETE (Quick Start wizard + Custom Setup)

### 🚀 Up Next
- Display all 3 alternatives in frontend UI
- Session feedback system (1-5 stars)
- Weekly satisfaction recap
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

### Output
- **Top Recommendation** with explanation
- **3 Alternative Games** with reasons
- **All results scored and ranked**

**Example:**
```
Input: 30 min, Unwind + Achieve, High flexibility, Low energy, Evening, Solo

Top Pick: Unpacking (92/100)
→ "Zen puzzle game, perfect for evening wind-down, easy to pause"

Alternatives:
1. Stardew Valley (88/100)
2. PowerWash Simulator (85/100)
3. Dorfromantik (82/100)
```

---

## 📂 Project Structure
```
lutem-mvp/
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/lutem/mvp/
│   │   ├── LutemMvpApplication.java      # Main app
│   │   ├── GameController.java           # API + 20 games
│   │   ├── Game.java                     # Game model
│   │   ├── EmotionalGoal.java            # Enum: mood types
│   │   ├── Interruptibility.java         # Enum: pause flexibility
│   │   ├── EnergyLevel.java              # Enum: mental energy
│   │   ├── TimeOfDay.java                # Enum: optimal timing
│   │   ├── SocialPreference.java         # Enum: solo/co-op
│   │   ├── RecommendationRequest.java    # Request model
│   │   └── RecommendationResponse.java   # Response model
│   └── pom.xml                   # Maven config
├── frontend/
│   └── index.html                # Full-stack app (1000+ lines)
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
Returns all 20 games with full metadata.

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
    "description": "Zen unpacking simulator with cozy vibes"
  }
]
```

### POST /recommendations
Get personalized game recommendation.

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
  "game": { /* Game object */ },
  "alternatives": [ /* 3 Game objects */ ],
  "reason": "Perfect fit: matches your low energy evening mood",
  "alternativeReasons": [ /* 3 reasons */ ]
}
```

---

## 🎮 Game Library (20 Games)

### Casual (5-30 min)
Unpacking • Dorfromantik • Tetris Effect • Dead Cells • Rocket League • Baba Is You

### Mid-Range (30-60 min)
Hades • Stardew Valley • Slay the Spire • Apex Legends • PowerWash Simulator • Into the Breach • A Short Hike • Loop Hero

### Long-Form (60+ min)
The Witcher 3 • Minecraft • Dark Souls III • Civilization VI • Valorant • The Witness

---

## 💡 Key Features

### 🚀 Guided Setup Modal (NEW!)
Two-path onboarding system for different user preferences:

**Quick Start (~30 seconds):**
- Step 1: Choose your energy level (Relaxed 😌 / Balanced 😊 / Energized 🔥)
- Step 2: Set available time with big friendly slider
- Step 3: Select emotional goals (multi-select mood chips)
- Progress dots show current step
- Back/Next navigation on every step
- Auto-fills sensible defaults for advanced options

**Custom Setup:**
- Direct access to full form
- Complete control over all 6 parameters
- Collapsible advanced options (Time of Day, Social Preference)
- Visual hierarchy with clear sections

**Smart Features:**
- Welcome modal appears on page load
- Background blurs when modal is active
- Smooth animations between questions
- "Skip to full form" link always visible
- Form state syncs after wizard completion
- Both paths lead to same powerful recommendation engine

### 🌱 "Touch Grass" Modal
When selecting 3+ hours on the time slider:
- Friendly reminder to take breaks
- Promotes healthy gaming habits
- Two options: keep selection or adjust time
- Always resets to 3 hours after closing (prevents re-trigger)
- Appears above all other modals

### 🎯 Multi-Dimensional Matching
Goes beyond simple genre matching:
- Considers emotional state (6 goals)
- Respects energy levels (3 levels)
- Accommodates flexibility needs (3 types)
- Optimizes for time of day
- Matches social preferences

### 🔄 Transparent Recommendations
Always explains WHY a game was recommended:
- Shows scoring breakdown
- Lists matching attributes
- Provides context for alternatives

---

## 🛠️ Technologies

- **Backend**: Spring Boot 3.2.0, Java 17+
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Build**: Maven 3.9+ (use provided startup scripts)
- **Storage**: In-memory (future: PostgreSQL)
- **API**: RESTful with JSON

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

---

## 📚 Documentation

| File | Description |
|------|-------------|
| [SESSION_COMPLETE_SUMMARY.md](SESSION_COMPLETE_SUMMARY.md) | Technical deep-dive and architecture |
| [TODO.md](TODO.md) | Roadmap, tasks, and progress tracking |
| `docs/CLAUDE_INSTRUCTIONS.md` | Development environment setup |
| `QuickWin_2_FunSlider.md` | Time slider feature documentation |

---

## 🎯 Next Development Phase

### UI/UX Enhancement
- Modern design system
- Improved color scheme
- Better visual hierarchy
- Responsive layout improvements

### Content Expansion
- Add 20+ more games (target: 40 total)
- Broader genre coverage
- More diverse emotional profiles

### Feature Additions
- Display all 3 alternatives in frontend
- Session feedback system (1-5 stars)
- Weekly satisfaction summary
- Game discovery history

---

## 📝 License

Educational project for Strategic Business Innovation 2025  
University of Applied Sciences Northwestern Switzerland

---

## 🙏 Acknowledgments

Built with:
- Spring Boot
- Claude AI (development assistant)
- IntelliJ IDEA
- A passion for gaming and UX
