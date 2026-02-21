# Lutem Project Instructions

## Project Overview
Lutem is an AI-powered gaming recommendation platform that helps users find the perfect game based on their available time, mood, energy level, and preferences.

**Location:** `D:\Projects\Lutem\LutemPrototype`
**Branch:** `main`
**GitHub:** https://github.com/jantobiaswilhelm/LutemPrototype

## Quick Start

```bash
# Start everything (backend + frontend)
start-lutem.bat

# Or start individually:
start-backend.bat        # Backend on http://localhost:8080
start-frontend.bat       # Frontend on http://localhost:5173
```

### Environment Setup
Create `backend/.env.local` with:
```
STEAM_API_KEY=your-steam-api-key
JWT_SECRET=your-secret-at-least-32-characters-long
```

## Project Structure

```
LutemPrototype/
├── backend/                    # Spring Boot backend (Java 17)
│   ├── src/main/java/         # Application code (controllers, services, models, security)
│   ├── src/main/resources/    # Config files, games-seed.json
│   └── pom.xml                # Maven (Spring Boot 3.4.5)
├── frontend-react/             # React 19 + TypeScript + Vite + Tailwind CSS 4
│   ├── src/
│   │   ├── api/               # API client (client.ts, steam.ts, hooks.ts)
│   │   ├── components/        # UI components + wizard steps
│   │   ├── pages/             # Route pages (Home, Library, Calendar, Friends, etc.)
│   │   ├── stores/            # Zustand stores (auth, theme, wizard, recommendations, steam)
│   │   └── styles/themes/     # 4 color themes x 2 modes
│   └── package.json
├── docs/                       # Documentation
├── scripts/                    # Database and build scripts
├── firestore.rules            # Firestore security rules with data validation
└── start-*.bat                # Startup scripts
```

## Key API Endpoints

### Public
- `GET /games` - List fully tagged games
- `GET /games/paged` - Paginated game list
- `POST /recommendations` - Get recommendation (body: availableMinutes, desiredEmotionalGoals, etc.)

### Authenticated (cookie-based JWT)
- `GET /auth/me` - Current user info
- `POST /auth/logout` - Logout
- `POST /api/steam/import` - Import Steam library
- `GET /api/steam/library` - Get user's Steam library
- `GET /api/sessions/history` - Session history
- `POST /sessions/feedback` - Submit satisfaction score (body: sessionId, satisfactionScore 1-5)
- `GET /api/calendar/events` - Calendar events
- `POST /api/calendar/events` - Create calendar event
- `GET /api/friends/list` - Friends list
- `POST /api/friends/request/{userId}` - Send friend request

### Admin (requires ADMIN role)
- `POST /admin/games` - Add game
- `POST /admin/games/bulk` - Bulk import
- `POST /admin/tag` - AI tag games via Claude
- `DELETE /admin/games/{id}` - Delete game

## Authentication

Dual auth system:
- **Steam:** OpenID 2.0 flow → JWT httpOnly cookie
- **Google:** Firebase token exchange → JWT httpOnly cookie
- **CSRF:** Double-submit cookie pattern (XSRF-TOKEN cookie + X-XSRF-TOKEN header)
- **RBAC:** USER and ADMIN roles stored in JWT claims

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, TanStack Query |
| Backend | Spring Boot 3.4.5, Java 17, JPA/Hibernate |
| Database | PostgreSQL (prod via Railway), H2 (local dev) |
| User Data | Firestore |
| Auth | JWT httpOnly cookies, Firebase Admin SDK, Steam OpenID |
| AI | Anthropic Claude API (game tagging) |
| Hosting | Netlify (frontend) + Railway (backend) |

## Deployment

- **Frontend:** Netlify at [lutembeta.netlify.app](https://lutembeta.netlify.app)
- **Backend:** Railway at lutemprototype-production.up.railway.app
- **Database:** PostgreSQL on Railway
- **Domain:** lutem.3lands.ch

## User Preferences

- Be critical, no sugarcoating
- Call out mistakes directly
- Deny overly complex solutions
- **NEVER KILL ALL NODE PROCESSES**
