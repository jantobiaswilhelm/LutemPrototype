<div align="center">
  <img src="frontend/lutem-logo.png" alt="Lutem Logo" width="500">
</div>

---

# Lutem

**Satisfaction-driven game recommendation platform that matches games to your mood, time, and energy level.**

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
| **Custom Domain** | https://lutem.3lands.ch |
| **Backend API** | https://lutemprototype-production.up.railway.app |

---

## What is Lutem?

Lutem is a satisfaction-driven game recommendation engine. Unlike platforms that optimize for engagement (hours played), Lutem optimizes for **how you'll feel** after playing.

**The Problem:** You have 30 minutes, you're tired, you open Steam... and spend 15 minutes deciding what to play.

**The Solution:** Tell Lutem your time, mood, and energy → get the perfect game instantly.

---

## Quick Start (Local Development)

### Prerequisites
- Java 17+ with `JAVA_HOME` set
- Python 3.x (for frontend server)
- No Maven installation needed (wrapper included)

### Start the Application

```bash
# Option 1: Use batch files (Windows)
start-backend.bat    # Starts backend with H2 database
start-frontend.bat   # Starts frontend on localhost:5500

# Option 2: Manual start
# Backend (with local H2 database)
cd backend
set SPRING_PROFILES_ACTIVE=local
mvn spring-boot:run

# Frontend
cd frontend
python -m http.server 5500
```

**Access:** http://localhost:5500

---

## Features

### Core Recommendation Engine
- **8-Dimensional Scoring** — Time, mood, energy, interruptibility, time-of-day, social preference, satisfaction history, genre boost
- **57 Curated Games** — Each tagged with emotional metadata
- **Progressive Disclosure** — Top pick + 3 alternatives, expandable to 9 total
- **Soft Genre Ranking** — Boosts preferred genres without eliminating variety

### User Experience
- **Quick Start Wizard** — Get recommendations in 3 clicks
- **Advanced Options** — Fine-tune energy, social preferences, time-of-day
- **8 Theme Combinations** — 4 color palettes (Café, Lavender, Earth, Ocean) × light/dark
- **Wellness Features** — "Touch Grass" modal for 3+ hour sessions

### Authentication & Persistence
- **Firebase Authentication** — Google Sign-in
- **Firestore Integration** — User profiles sync across devices
- **Profile Preferences** — Saved genres, session lengths, gaming goals

### Calendar Integration
- **ICS Import** — Import existing calendars
- **Gaming Session Scheduling** — Plan sessions with game selection
- **Three Selection Modes** — Browse library, use wizard, or random pick

---

## Architecture

```
┌─────────────────┐                          ┌─────────────────┐
│    Frontend     │ ◄────── REST API ──────► │     Backend     │
│    (Netlify)    │                          │    (Railway)    │
└────────┬────────┘                          └────────┬────────┘
         │                                            │
         │ Firebase SDK                               │ Admin SDK
         ▼                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Firebase                                   │
│              (Auth + Firestore User Data)                        │
└─────────────────────────────────────────────────────────────────┘
                                                      │
                                                      ▼
                                              ┌───────────────┐
                                              │  PostgreSQL   │
                                              │  (Railway)    │
                                              │  Game Data    │
                                              └───────────────┘
```

### Data Strategy

| Data | Storage | Reason |
|------|---------|--------|
| Games (57+) | PostgreSQL | Shared, relational, queryable |
| Calendar Events | PostgreSQL | Backend-managed, linked to games |
| User Profiles | Firestore | Per-user, real-time sync, scales infinitely |
| Session History | Firestore | Per-user, append-heavy |
| Preferences | Firestore | Instant cross-device sync |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Vanilla HTML/CSS/JS (modular, 20+ files) |
| **Backend** | Spring Boot 3.2, Java 17 |
| **Database** | PostgreSQL (prod) / H2 (local) |
| **User Data** | Firebase Firestore |
| **Auth** | Firebase Authentication + Admin SDK |
| **Hosting** | Netlify (frontend) + Railway (backend) |

---

## API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/games` | GET | ❌ | List all 57 games |
| `/recommendations` | POST | ❌ | Get personalized recommendations |
| `/sessions/feedback` | POST | ❌ | Submit satisfaction rating (1-5) |
| `/auth/me` | GET | ✅ | Get/create user profile |
| `/calendar/events` | GET | ✅ | List calendar events |
| `/calendar/events` | POST | ✅ | Create calendar event |

**Full API documentation:** [docs/API.md](docs/API.md)

---

## Scoring Algorithm

```
Final Score = Base Score × Modifiers

Base Score Weights:
├── Time Match:        30%
├── Emotional Goals:   25%
├── Interruptibility:  20%
├── Energy Level:      15%
├── Time of Day:        5%
└── Social Preference:  5%

Modifiers:
├── Past Satisfaction: +10% (if rated highly before)
└── Genre Boost:       +15% (if matches preferred genres)
```

**Full algorithm details:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## Project Status

**Last Updated:** December 2025

### ✅ Completed

| Phase | Description | Status |
|-------|-------------|--------|
| **Core MVP** | Recommendation engine, 57 games, wizard UI | ✅ Done |
| **Frontend Modularization** | Split 5,706-line monolith → 20+ files | ✅ Done |
| **Firebase Auth** | Google Sign-in, protected routes | ✅ Done |
| **Deployment** | Netlify + Railway + custom domain | ✅ Done |
| **Phase 7: PostgreSQL** | Production database on Railway | ✅ Done |
| **Phase 8: Firestore** | User data storage, real-time sync | ✅ Done |
| **Phase 9: User Profiles** | Profile save/load to Firestore | ✅ Done |

### 🟡 In Progress

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 10: Session Tracking** | Log sessions, feedback collection, history view | Next Up |
| **Phase 11: Weekly Dashboard** | Stats, satisfaction trends, insights | Planned |

### 📋 Future

| Feature | Description |
|---------|-------------|
| Steam Integration | Import library, match against database |
| AI Game Tagging | Auto-tag new games using LLM |
| Google Calendar OAuth | Real calendar sync (ICS import works now) |

**Full roadmap:** [docs/ROADMAP.md](docs/ROADMAP.md)

---

## Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, data flow, scoring algorithm |
| [API.md](docs/API.md) | Complete API reference with examples |
| [ROADMAP.md](docs/ROADMAP.md) | Development phases and priorities |
| [DEPLOYMENT_PLAN.md](docs/DEPLOYMENT_PLAN.md) | Production deployment guide |
| [FIREBASE_ADMIN_SDK.md](docs/FIREBASE_ADMIN_SDK.md) | Server-side auth setup |
| [FUTURE_AI_STEAM_INTEGRATION.md](docs/FUTURE_AI_STEAM_INTEGRATION.md) | Planned AI/Steam features |
| [PSYCHOLOGY.md](docs/PSYCHOLOGY.md) | Research basis, emotional goals |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Development workflow, code style |

---

## Project Structure

```
LutemPrototype/
├── backend/                        # Spring Boot API
│   ├── src/main/java/com/lutem/mvp/
│   │   ├── config/                 # Firebase, CORS, data loading
│   │   ├── controller/             # REST endpoints
│   │   ├── dto/                    # Request/Response objects
│   │   ├── model/                  # JPA entities
│   │   ├── repository/             # Data access
│   │   ├── security/               # Firebase auth filter
│   │   └── service/                # Business logic
│   ├── src/main/resources/
│   │   ├── application.properties  # Production config (PostgreSQL)
│   │   ├── application-local.properties  # Local config (H2)
│   │   └── games-seed.json         # Initial game data
│   └── pom.xml
│
├── frontend/                       # Web application
│   ├── index.html                  # Main HTML (modular)
│   ├── css/
│   │   ├── variables.css           # Design tokens
│   │   ├── themes.css              # 8 theme combinations
│   │   ├── base.css                # Reset, typography
│   │   ├── components.css          # UI components
│   │   ├── layout.css              # Page layout
│   │   └── calendar.css            # Calendar styles
│   ├── js/
│   │   ├── config.js               # Environment detection
│   │   ├── auth.js                 # Firebase authentication
│   │   ├── firestore.js            # User data operations
│   │   ├── api.js                  # Backend communication
│   │   ├── recommendations.js      # Core recommendation UI
│   │   ├── profile.js              # Profile management
│   │   ├── calendar.js             # Calendar features
│   │   └── ...                     # Other modules
│   └── demo-mode.js                # Offline fallback
│
├── docs/                           # Documentation
│   ├── sessions/                   # Development session logs
│   └── *.md                        # Various docs
│
├── start-backend.bat               # Backend launcher
├── start-frontend.bat              # Frontend launcher
└── start-lutem.bat                 # Full app launcher
```

---

## Environment Variables

### Production (Railway)

| Variable | Required | Description |
|----------|----------|-------------|
| `FIREBASE_CREDENTIALS` | Yes | Service account JSON for token validation |
| `SPRING_DATASOURCE_URL` | Auto | PostgreSQL connection (Railway provides) |
| `PGUSER` | Auto | Database user (Railway provides) |
| `PGPASSWORD` | Auto | Database password (Railway provides) |

### Local Development

```bash
# Use local profile for H2 database
set SPRING_PROFILES_ACTIVE=local
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for detailed guidelines.

---

## License

Educational project for Strategic Business Innovation 2025  
University of Applied Sciences Northwestern Switzerland

---

## Acknowledgments

- Game cover images from Steam
- Built with Spring Boot, Firebase, and vanilla JS
- Developed with Claude AI assistance

---

*Optimizing gaming satisfaction, one recommendation at a time.* 🎮
