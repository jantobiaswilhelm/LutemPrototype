# Lutem MVP

AI-powered game recommendation system based on available time and mood.

## 📍 Project Status

**Current Phase:** ✅ **Phase 4** - UI Polish & QuickWins

**Last Updated:** November 22, 2025

### What's Working Now
- ✅ Spring Boot backend running on port 8080
- ✅ Frontend with interactive UI and loading spinner
- ✅ 10 hardcoded games with metadata (time, mood, interruptibility)
- ✅ Rule-based recommendation engine (filters by time + mood)
- ✅ Satisfaction feedback system (1-5 rating)
- ✅ Basic learning algorithm (ranks by average satisfaction)
- ✅ Full REST API with 3 endpoints
- ✅ CORS enabled for local development
- ✅ **NEW:** Loading spinner with rotating gaming tips

### QuickWins Progress
- ✅ **Loading Spinner** - Complete! (with rotating tips)
- ⏳ **Input Validation** - Next (30 min)
- ⏳ **Top 3 Alternatives** - Planned (45 min)

### Up Next
- **Phase 5** - Enhanced satisfaction learning with trends
- **Phase 6** - Database integration + deployment (SQLite/Postgres, Render, Netlify)
- **Phase 7** - External API integration (Google Calendar or RAWG API)

👉 **See [TODO.md](TODO.md) for complete roadmap and task list**

---

## 🚀 Quick Start

### Option 1: Use Startup Scripts (EASIEST)
```cmd
# Check your environment first
check-environment.bat

# Start everything
start-lutem.bat

# Or start individually:
start-frontend-only.bat  # Opens browser
```

### Option 2: Manual Startup

**Backend (IntelliJ):**
1. Open `backend/pom.xml` in IntelliJ IDEA
2. Right-click `LutemMvpApplication.java`
3. Select "Run 'LutemMvpApplication'"
4. Wait for: "Started LutemMvpApplication"

**Frontend:**
- Double-click `frontend/index.html`
- Or run: `start-frontend-only.bat`

### Option 3: Command Line (After Maven Wrapper Setup)
```bash
cd backend
mvnw.cmd spring-boot:run  # Windows
./mvnw spring-boot:run     # Mac/Linux
```

---

## ⚙️ Maven Setup (One-Time)

**Problem:** Maven not in system PATH  
**Solution:** Add Maven Wrapper (makes project self-contained)

```cmd
# Check what's available
check-environment.bat

# Setup Maven Wrapper  
setup-maven-wrapper.bat
```

**See:** [MAVEN_SETUP_GUIDE.md](MAVEN_SETUP_GUIDE.md) for detailed instructions

---

## Project Structure
```
lutem-mvp/
├── backend/              # Spring Boot API
│   ├── src/
│   ├── pom.xml
│   ├── mvnw.cmd         # Maven wrapper (Windows)
│   └── mvnw             # Maven wrapper (Unix)
├── frontend/             # Simple HTML/JS UI
│   └── index.html
├── docs/                 # Documentation
│   ├── CLAUDE_INSTRUCTIONS.md
│   ├── adding-maven-wrapper.md
│   └── QUICK_START_IMPROVEMENTS.md
├── start-lutem.bat      # Start everything
├── start-frontend-only.bat
├── check-environment.bat
└── setup-maven-wrapper.bat
```

---

## API Endpoints

**Backend runs on:** `http://localhost:8080`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/games` | Get all available games |
| POST | `/recommendations` | Get game recommendation |
| POST | `/sessions/feedback` | Submit satisfaction rating |

### Example: Get Recommendation
```json
POST /recommendations
{
  "availableMinutes": 30,
  "desiredMood": "relax"
}
```

### Example: Submit Feedback
```json
POST /sessions/feedback
{
  "gameId": 1,
  "satisfactionScore": 5
}
```

---

## MVP Features

✅ **Core Functionality**
- Hardcoded list of 10 games with metadata
- Time-based filtering (min/max minutes)
- Mood-based filtering (relax/focus/challenge)
- Rule-based recommendation engine
- Simple satisfaction learning algorithm

✅ **User Experience**
- Clean, responsive UI
- Loading spinner with gaming tips
- Satisfaction feedback (1-5 rating)
- Smooth animations and transitions

---

## Technologies

- **Backend**: Spring Boot 3.2, Java 17+
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: In-memory (no database for MVP)
- **Build**: Maven (with Maven Wrapper)

---

## Development Resources

| Resource | Description |
|----------|-------------|
| [TODO.md](TODO.md) | Task tracking and session notes |
| [MAVEN_SETUP_GUIDE.md](MAVEN_SETUP_GUIDE.md) | Long-term Maven solution |
| `docs/CLAUDE_INSTRUCTIONS.md` | Claude project setup guide |
| `docs/adding-maven-wrapper.md` | Maven wrapper setup details |
| `lutem_mvp_roadmap.docx` | Original project roadmap |

---

## Troubleshooting

**Backend won't start:**
- Check port 8080 is free: `netstat -ano | findstr :8080`
- Verify IntelliJ is using JDK 17+
- See IntelliJ console for errors

**Scripts don't work:**
- Run `check-environment.bat` to diagnose
- Follow `setup-maven-wrapper.bat` instructions
- Or use IntelliJ manual startup method

**Frontend can't connect:**
- Verify backend console shows "Started"
- Check browser DevTools (F12) for errors
- Confirm backend is on port 8080

---

## Contributing

For development workflow and best practices, see:
- `docs/CLAUDE_INSTRUCTIONS.md`
- Current QuickWins status in TODO.md

---

## License

This is an educational project for Strategic Business Innovation 2025.
