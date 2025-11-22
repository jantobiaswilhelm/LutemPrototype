# Lutem MVP

AI-powered game recommendation system based on available time and mood.

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

## Next Steps

See `lutem_mvp_roadmap.docx` for full development plan.
