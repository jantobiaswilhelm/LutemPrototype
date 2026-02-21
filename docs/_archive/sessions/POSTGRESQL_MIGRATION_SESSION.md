# Session: PostgreSQL Migration

## Context
Lutem is my real project (potential startup). Migrating from SQLite to PostgreSQL for scalability.

## Project
- Location: `D:\Lutem\LutemPrototype`
- GitHub: https://github.com/jantobiaswilhelm/LutemPrototype

## Read First
```
D:\Lutem\LutemPrototype\docs\POSTGRESQL_MIGRATION_PLAN.md
```

## Steps (Pause After Each)

### Step 1: Railway PostgreSQL Setup
Create PostgreSQL database on Railway, get credentials.
**PAUSE** — Tell me when done, share connection details (not password).

### Step 2: Update pom.xml
Replace SQLite dependency with PostgreSQL.
**PAUSE** — Verify `mvn clean install` succeeds.

### Step 3: Update application.properties
Configure PostgreSQL connection with environment variables.
**PAUSE** — Don't start backend yet.

### Step 4: Test Locally
Start backend, verify all endpoints work.
**PAUSE** — Test `/games`, `/recommendations`, calendar endpoints.

### Step 5: Deploy to Railway
Push changes, verify production works.
**PAUSE** — Test production URLs.

### Step 6: Cleanup
Remove SQLite file, update docs.
**DONE**

## Commands
```bash
# Start backend
D:\Lutem\LutemPrototype\start-backend.bat

# Start frontend
cd D:\Lutem\LutemPrototype\frontend
python -m http.server 5500

# Test endpoints
curl http://localhost:8080/games
```

## Important
- Don't delete SQLite file until PostgreSQL is verified working
- Games auto-load from games.json on startup
- Free tier PostgreSQL on Railway is fine

## My Responses
I'll respond with:
- "Step X done" — to continue
- "Step X issue: [description]" — if problems
- "Need break" — to pause session
