<div align="center">
  <img src="frontend/lutem-logo.png" alt="Lutem Logo" width="500">
</div>

---

# Lutem MVP

**AI-powered game recommendation system that matches games to your mood, time, and energy level.**

[![Live Demo](https://img.shields.io/badge/Demo-lutembeta.netlify.app-00C7B7?logo=netlify)](https://lutembeta.netlify.app)
[![Status](https://img.shields.io/badge/Status-Deployed-brightgreen)]()
[![Games](https://img.shields.io/badge/Games-57%20titles-blue)]()
[![Themes](https://img.shields.io/badge/Themes-8%20combinations-purple)]()

---

## 🌐 Live Demo

**Try it now:** [https://lutembeta.netlify.app](https://lutembeta.netlify.app)

| Service | URL |
|---------|-----|
| **Frontend** | https://lutembeta.netlify.app |
| **Backend API** | https://lutemprototype-production.up.railway.app |
| **Games API** | https://lutemprototype-production.up.railway.app/games |

---

## What is Lutem?

Lutem is a satisfaction-driven game recommendation engine. Unlike platforms that optimize for engagement (hours played), Lutem optimizes for **how you'll feel** after playing.

**Input:** Your available time, mood, energy level, and preferences  
**Output:** The perfect game for right now, plus alternatives

---

## Quick Start (Local Development)

### 🚀 Start the Application

```cmd
# Start backend (recommended method)
start-backend.bat

# Start frontend
start-frontend.bat

# Or start everything at once
start-lutem.bat
```

**Requirements:** Java 17+ with JAVA_HOME set. No Maven installation needed (wrapper included).

### 🎮 Try It Out

1. Backend shows: `"Started LutemMvpApplication"`
2. Frontend opens in browser
3. Set your time (e.g., 30 min)
4. Select your mood (e.g., Unwind + Achieve)
5. Click **"Get Recommendation"**
6. Rate the suggestion with emoji feedback

---

## Key Features

- **8-Dimensional Scoring** - Time, mood, energy, interruptibility, time-of-day, social preference, satisfaction history, genre boost
- **57 Curated Games** - Diverse library including MOBAs, fighting games, JRPGs, quick-session titles, and more
- **Soft Genre Ranking** - Boosts preferred genres without eliminating other matches
- **Progressive Disclosure** - Top pick + 3 alternatives, "See More" for 6 additional
- **8 Theme Combinations** - 4 palettes × light/dark modes
- **Wellness Features** - "Touch Grass" modal for 3+ hour sessions
- **Feedback Learning** - Ratings improve future recommendations

---

## Documentation

| Document | Description |
|----------|-------------|
| **[Architecture](docs/ARCHITECTURE.md)** | System design, scoring algorithm, project structure |
| **[API Reference](docs/API.md)** | Complete endpoint documentation with examples |
| **[Deployment](docs/DEPLOYMENT_PLAN.md)** | Production deployment guide (Netlify + Railway) |
| **[Psychology](docs/PSYCHOLOGY.md)** | Research basis, emotional goals, wellness features |
| **[Contributing](docs/CONTRIBUTING.md)** | Development workflow, troubleshooting, code style |

---

## How It Works

```
User Input → 8-Factor Scoring → Ranked Results → Feedback Loop
     │              │                │               │
     └──────────────┴────────────────┴───────────────┘
                    Continuous Learning
```

**Scoring Weights:**
- Time Match: 30% | Emotional Goals: 25% | Interruptibility: 20%
- Energy Level: 15% | Time of Day: 5% | Social Preference: 5%
- Satisfaction Bonus: +10% | Genre Boost: +15%

👉 **See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for algorithm details**

---

## API Quick Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/games` | GET | List all 57 games |
| `/recommendations` | POST | Get personalized recommendations |
| `/sessions/feedback` | POST | Submit satisfaction rating (1-5) |

👉 **See [API.md](docs/API.md) for full documentation**

---

## Deployment

Lutem is deployed with continuous deployment:

| Service | Platform | Auto-Deploy |
|---------|----------|-------------|
| Frontend | Netlify | ✅ On push to `main` |
| Backend | Railway | ✅ On push to `main` |

**Push to `main` → Live in 2-3 minutes**

See [DEPLOYMENT_PLAN.md](docs/DEPLOYMENT_PLAN.md) for full deployment documentation.

---

## Project Status

**Phase:** ✅ Deployed MVP  
**Last Updated:** November 2025

### Recent Completions
- ✅ **Production deployment** - Live at lutembeta.netlify.app
- ✅ **Frontend modularization** - Split 5,706-line monolith into 20+ files (81% reduction)
- ✅ Expanded game library to 57 titles
- ✅ Professional branding with Lutem logo
- ✅ 8 theme combinations (4 palettes × 2 modes)
- ✅ Environment-aware configuration (auto-detects dev vs prod)

### Up Next
- Custom domain (lutem.3lands.ch)
- Calendar integration
- Session history tracking

---

## Tech Stack

- **Backend:** Spring Boot 3.2, Java 17, SQLite
- **Frontend:** Vanilla HTML/CSS/JS (modular architecture)
- **Hosting:** Netlify (frontend) + Railway (backend)
- **Build:** Maven (wrapper included)


### Project Structure

```
LutemPrototype/
├── backend/                    # Spring Boot application
│   ├── src/main/java/         # Java source code
│   ├── src/main/resources/    # Config & seed data
│   └── pom.xml                # Maven config
├── frontend/                   # Web application
│   ├── index.html             # Main HTML
│   ├── css/                   # Modular stylesheets
│   ├── js/                    # JavaScript modules
│   │   ├── config.js          # Environment detection
│   │   ├── api.js             # Backend communication
│   │   └── ...                # Feature modules
│   └── demo-mode.js           # Offline fallback
├── docs/                       # Documentation
│   ├── DEPLOYMENT_PLAN.md     # Deployment guide
│   └── sessions/              # Session handoffs
├── start-backend.bat          # Backend launcher
├── start-frontend.bat         # Frontend launcher
└── start-lutem.bat            # Full app launcher
```

---

## License

Educational project for Strategic Business Innovation 2025  
University of Applied Sciences Northwestern Switzerland

---

*Built with Spring Boot, Claude AI, and a passion for gaming UX.*
