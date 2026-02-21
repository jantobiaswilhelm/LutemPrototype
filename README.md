# Lutem

**Optimizing Gaming Satisfaction: An AI-Powered Discovery Interface**

> *"Headspace meets Steam"* --- A calm gaming companion that prioritizes emotional wellbeing over engagement metrics.

---

## Philosophy

Lutem isn't just another game recommendation engine. While platforms like Steam and Xbox optimize for **engagement time**, Lutem optimizes for **satisfaction**.

- **Gaming should recharge you, not drain you.** The right game at the right time can be genuinely restorative.
- **Less choice, more clarity.** A curated recommendation beats an endless library scroll.
- **Satisfaction > Engagement.** We measure success by how you *feel* after playing, not how long you played.
- **Calm, not chaotic.** Gaming platforms scream at you with sales and notifications. We whisper.

### How It Works

An emotionally intelligent companion that suggests games based on:

| Dimension | What We Ask |
|-----------|-------------|
| **Source** | Where do you want to play from? (Your library, all games) |
| **Mood** | What emotional outcome do you want? (Unwind, Focus, Challenge, Explore) |
| **Energy** | How much mental energy do you have right now? |
| **Time** | How long can you actually play? |
| **Interruptibility** | Might you need to stop suddenly? |
| **Social** | Solo session or playing with others? |

The result: **One confident recommendation** that fits your life right now.

---

## Live URLs

- **Production:** [lutembeta.netlify.app](https://lutembeta.netlify.app)
- **GitHub:** [github.com/jantobiaswilhelm/LutemPrototype](https://github.com/jantobiaswilhelm/LutemPrototype)

---

## Features

### Backend (Spring Boot + PostgreSQL on Railway)
- Curated game catalog with rich metadata (mood tags, energy levels, time ranges, interruptibility, popularity scores)
- Multi-dimensional recommendation engine (11 scoring factors including personalized satisfaction data)
- Dual authentication: Steam OpenID + Google/Firebase with JWT httpOnly cookies
- Firestore integration for user satisfaction analytics
- Steam library import with automatic game matching
- Session tracking with feedback collection
- Calendar system with social events (invites, join/leave, visibility controls)
- Friends system (send/accept/decline requests, search users)
- AI-powered game tagging via Claude API
- Role-based access control (USER/ADMIN)
- CSRF protection (double-submit cookie)
- Rate limiting

### Frontend (React 19 + Vite + TypeScript + Tailwind CSS 4)
- 4 color themes (Cafe, Lavender, Earth, Ocean) x 2 modes (light/dark) = 8 combinations
- Inline wizard with 6 recommendation steps
- Mood shortcuts for quick one-tap recommendations
- Game cards with Steam CDN cover art and match reasoning
- Library page with dual tabs (My Games + All Games), search/sort/filter, grid/list views
- Calendar page with event creation, ICS import, social events
- Friends page with search, requests, friend list
- Session history with feedback
- Stats page with satisfaction trends and weekly summaries
- Settings page (appearance, preferences)
- Swipeable taskbar navigation with edge gestures
- Steam + Google authentication with persistent cookie sessions

### Pages

| Page | Status | Features |
|------|--------|----------|
| `/` Home | Complete | Greeting, mood shortcuts, inline wizard, game cards, alternatives |
| `/login` Login | Complete | Steam + Google auth, loading states |
| `/library` Library | Complete | My Games (Steam import) + All Games, search/sort/filter |
| `/calendar` Calendar | Complete | Events, ICS import, social invites, join/leave |
| `/friends` Friends | Complete | Search, send/accept/decline requests |
| `/sessions` Sessions | Complete | Session history, feedback collection |
| `/profile` Profile | Complete | User info, Steam connection |
| `/stats` Stats | Complete | Satisfaction trends, time insights, top games |
| `/settings` Settings | Complete | Theme, dark mode, preferences |

---

## Tech Stack

### Backend
- **Framework:** Spring Boot 3.4.5 (Java 17)
- **Database:** PostgreSQL (Railway) / H2 (local dev)
- **Auth:** JWT (httpOnly cookies) + Firebase Admin SDK + Steam OpenID
- **User Data:** Firestore
- **AI:** Anthropic Claude API (game tagging)
- **Hosting:** Railway

### Frontend
- **Build:** Vite 7.x
- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + CSS Variables (custom design tokens)
- **State:** Zustand 5 (with persist middleware)
- **Data Fetching:** TanStack Query v5
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Hosting:** Netlify

---

## Running Locally

### Prerequisites
- Node.js 18+
- Java 17+
- Git

### Backend
```bash
cd backend

# Set environment variables (or create backend/.env.local)
# Required: STEAM_API_KEY, JWT_SECRET (32+ chars)
# Optional: ANTHROPIC_API_KEY, FIREBASE_CREDENTIALS_PATH

# Local development (H2 database)
set SPRING_PROFILES_ACTIVE=local
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend-react
npm install
npm run dev
# Runs on http://localhost:5173
```

### Quick Start
```bash
# Start both backend and frontend
start-lutem.bat
```

---

## Project Structure

```
LutemPrototype/
├── backend/                      # Spring Boot API
│   ├── src/main/java/com/lutem/mvp/
│   │   ├── config/              # WebConfig, SecurityConfig, Firebase, Rate Limiting
│   │   ├── controller/          # REST controllers (Auth, Game, Calendar, Friends, Steam, Admin)
│   │   ├── dto/                 # Request/response DTOs
│   │   ├── model/               # JPA entities (User, Game, GameSession, CalendarEvent, etc.)
│   │   ├── repository/          # Spring Data JPA repositories
│   │   ├── security/            # JWT service, auth filter, CSRF filter
│   │   └── service/             # Business logic (UserService, SteamService, CalendarService, etc.)
│   └── src/main/resources/
│       ├── application.properties        # Production config
│       └── application-local.properties  # Local dev config (H2)
│
├── frontend-react/               # React frontend
│   ├── src/
│   │   ├── api/                 # API client, Steam API, TanStack Query hooks
│   │   ├── components/          # Reusable components (wizard/, GameCard, Taskbar, etc.)
│   │   ├── lib/                 # Shared utilities (config.ts)
│   │   ├── pages/               # Route pages (Home, Library, Calendar, Friends, etc.)
│   │   ├── stores/              # Zustand stores (auth, theme, wizard, recommendations, steam)
│   │   ├── styles/themes/       # 4 color themes (cafe, lavender, earth, ocean)
│   │   └── types/               # TypeScript definitions
│   └── index.html
│
├── docs/                         # Documentation
├── scripts/                      # Database and build scripts
└── firestore.rules              # Firestore security rules
```

---

## Environment Variables

### Backend (Railway / local .env.local)

| Variable | Required | Description |
|----------|----------|-------------|
| `STEAM_API_KEY` | Yes | Steam Web API key |
| `JWT_SECRET` | Yes (prod) | 32+ character secret for JWT signing |
| `SPRING_DATASOURCE_URL` | Yes (prod) | PostgreSQL connection string |
| `PGUSER` / `PGPASSWORD` | Yes (prod) | Database credentials |
| `FIREBASE_CREDENTIALS_PATH` | No | Path to Firebase service account JSON |
| `ANTHROPIC_API_KEY` | No | Claude API key for AI game tagging |
| `FRONTEND_URL` | No | Frontend URL for CORS/redirects (default: https://lutembeta.netlify.app) |
| `CORS_EXTRA_ORIGINS` | No | Additional CORS origins (comma-separated) |
| `DDL_AUTO` | No | Hibernate DDL mode (default: validate in prod, update in dev) |

### Frontend (Netlify / .env.production)

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL (default: /api, proxied via Netlify) |

---

## Design Principles

| Principle | What It Means |
|-----------|---------------|
| **Result-First** | Show the recommendation immediately. Hide the wizard until needed. |
| **Progressive Disclosure** | Don't overwhelm. Reveal options as they become relevant. |
| **Calm Confidence** | The app knows you. Smart defaults, easy overrides. |
| **Emotional Feedback** | "You felt relaxed" matters more than "You played 47 minutes." |
| **Breathing Room** | Generous whitespace. Let elements breathe. Nothing cramped. |

---

## Academic Context

This project is part of the **Strategic Business Innovation 2025** coursework at the University of Applied Sciences Northwestern Switzerland (FHNW), developed as a real startup prototype with genuine commercial ambitions.

---

*Built with intention.*
*Last updated: February 2026*
