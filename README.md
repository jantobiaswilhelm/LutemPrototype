# Lutem MVP

AI-powered game recommendation system based on available time and mood.

## 📍 Project Status

**Current Phase:** ✅ **Phase 0-3 Complete** - Backend + Frontend Integration Working!

**Last Updated:** November 22, 2025

### What's Working Now
- ✅ Spring Boot backend running on port 8080
- ✅ Frontend with interactive UI
- ✅ 10 hardcoded games with metadata (time, mood, interruptibility)
- ✅ Rule-based recommendation engine (filters by time + mood)
- ✅ Satisfaction feedback system (1-5 rating)
- ✅ Basic learning algorithm (ranks by average satisfaction)
- ✅ Full REST API with 3 endpoints
- ✅ CORS enabled for local development

### Active Development
**Phase 4** - UI Polish & Enhancements (In Progress)
- Improving user experience
- Adding loading states and animations
- Better error handling
- Input validation

### Up Next
- **Phase 5** - Enhanced satisfaction learning with trends
- **Phase 6** - Database integration + deployment (SQLite/Postgres, Render, Netlify)
- **Phase 7** - External API integration (Google Calendar or RAWG API)

### Quick Wins Being Considered
- Show top 3 game alternatives instead of just 1
- Game library view to browse all games
- Recent recommendations history
- Better visual feedback and animations

👉 **See [TODO.md](TODO.md) for complete roadmap, task list, and session notes**

---

## Project Structure
```
lutem-mvp/
├── backend/          # Spring Boot API
│   └── src/
│       └── main/
│           ├── java/
│           └── resources/
└── frontend/         # Simple HTML/JS UI
```

## Quick Start

### Backend (Spring Boot)
```bash
cd backend
mvn spring-boot:run
```
Server runs on http://localhost:8080

### Frontend
Open `frontend/index.html` in your browser
(or use a simple HTTP server like `python -m http.server 3000`)

## API Endpoints

- `GET /games` - Get all available games
- `POST /recommendations` - Get game recommendation
  ```json
  {
    "availableMinutes": 30,
    "desiredMood": "relax"
  }
  ```
- `POST /sessions/feedback` - Submit satisfaction rating
  ```json
  {
    "gameId": 1,
    "satisfactionScore": 5
  }
  ```

## MVP Features (Phase 0-3)

✅ Hardcoded list of 10 games  
✅ Input: Available time (minutes)  
✅ Input: Desired mood (relax/focus/challenge)  
✅ Rule-based recommendation engine  
✅ Feedback system (1-5 satisfaction)  
✅ Simple learning (average satisfaction per game)  

## Technologies

- **Backend**: Spring Boot 3.2, Java 17+
- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Storage**: In-memory (no database for MVP)

## Development Resources

- **Full Roadmap**: `lutem_mvp_roadmap.docx`
- **Task Tracking**: [TODO.md](TODO.md)
- **Project Documentation**: See `/docs` (coming soon)
