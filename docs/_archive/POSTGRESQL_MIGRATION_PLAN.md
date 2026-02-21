# PostgreSQL Migration Plan

**Created:** December 2, 2025  
**Completed:** December 2025  
**Status:** ✅ **COMPLETE**

> **Note:** This document is kept for historical reference. The migration from SQLite to PostgreSQL has been successfully completed. Production uses PostgreSQL on Railway, local development uses H2 in-memory database.

---

## Original Goal

Migrate from SQLite to PostgreSQL for production scalability.

---

## Why We Migrated

| SQLite | PostgreSQL |
|--------|------------|
| Single file, single writer | Concurrent connections |
| Good for 1-100 users | Good for 1-1,000,000+ users |
| No network access | Network accessible |
| Dev/testing only | Production ready |
| Free | Free on Railway |

**Bottom line:** SQLite will break under real load. PostgreSQL won't.

---

## Current State

- Database: `backend/lutem.db` (SQLite file)
- Tables: `games`, `calendar_events`, `users`, `game_sessions`
- Records: 57 games, variable events/users
- ORM: Hibernate with auto-DDL

---

## Migration Steps

### Step 1: Create PostgreSQL on Railway (15 min)

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Open your Lutem project
3. Click "New" → "Database" → "PostgreSQL"
4. Wait for provisioning (~30 seconds)
5. Click on the PostgreSQL service
6. Go to "Variables" tab
7. Copy these values:
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`
   - Or just copy `DATABASE_URL`

**Checkpoint:** PostgreSQL instance running on Railway

---

### Step 2: Update Backend Dependencies (10 min)

**File:** `backend/pom.xml`

Replace SQLite driver with PostgreSQL:

```xml
<!-- REMOVE this -->
<dependency>
    <groupId>org.xerial</groupId>
    <artifactId>sqlite-jdbc</artifactId>
    <version>3.42.0.0</version>
</dependency>

<!-- ADD this -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>
```

**Tasks:**
- [ ] Remove SQLite dependency
- [ ] Add PostgreSQL dependency
- [ ] Run `mvn clean install` to verify

---

### Step 3: Update Application Properties (15 min)

**File:** `backend/src/main/resources/application.properties`

**For local development (Option A: Use Railway PostgreSQL):**
```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://${PGHOST}:${PGPORT}/${PGDATABASE}
spring.datasource.username=${PGUSER}
spring.datasource.password=${PGPASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

**For local development (Option B: Local PostgreSQL):**
```properties
# Local PostgreSQL
spring.datasource.url=jdbc:postgresql://localhost:5432/lutem
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

**Recommendation:** Use Option A (Railway PostgreSQL) for simplicity. One database, no local setup.

**Tasks:**
- [ ] Update `application.properties`
- [ ] Set environment variables locally (or use `.env` file)

---

### Step 4: Export Game Data (15 min)

The games are loaded from `games.json`, so they'll auto-load on startup. But let's verify:

**File:** `backend/src/main/resources/games.json`

- [ ] Confirm `games.json` exists and has all 57 games
- [ ] Confirm `GameDataLoader.java` runs on startup

For calendar events and users (if any exist):

```sql
-- Run against SQLite to export (optional, likely not needed)
.mode csv
.output calendar_events.csv
SELECT * FROM calendar_events;
.output users.csv
SELECT * FROM users;
```

**Tasks:**
- [ ] Verify games.json is complete
- [ ] Export any calendar events if needed (probably not)

---

### Step 5: Start Backend with PostgreSQL (15 min)

**Set environment variables:**

Windows (PowerShell):
```powershell
$env:PGHOST="your-host.railway.app"
$env:PGPORT="5432"
$env:PGUSER="postgres"
$env:PGPASSWORD="your-password"
$env:PGDATABASE="railway"
```

Or create `backend/.env`:
```
PGHOST=your-host.railway.app
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your-password
PGDATABASE=railway
```

**Start backend:**
```bash
cd backend
mvn spring-boot:run
```

**Verify:**
- [ ] Backend starts without errors
- [ ] Games load (check `/games` endpoint)
- [ ] Calendar endpoints work
- [ ] Auth endpoints work

---

### Step 6: Test All Features (30 min)

- [ ] Home page loads
- [ ] Wizard works, recommendations return
- [ ] Games library displays 57 games
- [ ] Game filtering works
- [ ] Calendar loads (if authenticated)
- [ ] Can create calendar events
- [ ] ICS import works
- [ ] Auth sign-in/sign-out works

---

### Step 7: Update Railway Deployment (15 min)

Railway should already have the PostgreSQL variables available. Just need to:

1. Push the updated code to GitHub
2. Railway auto-deploys
3. Verify production works

**Or manually set variables:**
1. Go to Railway → Lutem backend service
2. Go to "Variables" tab
3. Add if not already present:
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
   - Or `DATABASE_URL`

**Tasks:**
- [ ] Push code to GitHub
- [ ] Verify Railway deployment succeeds
- [ ] Test production URLs

---

### Step 8: Cleanup (10 min)

- [ ] Delete `backend/lutem.db` (SQLite file)
- [ ] Remove any SQLite references in code
- [ ] Update documentation
- [ ] Commit: "Migrate from SQLite to PostgreSQL"

---

## Rollback Plan

If something breaks:

1. Revert `pom.xml` to include SQLite
2. Revert `application.properties`
3. The SQLite file should still exist (don't delete until verified)

---

## Environment Variables Reference

| Variable | Example | Notes |
|----------|---------|-------|
| `PGHOST` | `containers-us-west-xxx.railway.app` | Railway provides this |
| `PGPORT` | `5432` | Standard PostgreSQL port |
| `PGUSER` | `postgres` | Default user |
| `PGPASSWORD` | `xxxxx` | Railway generates this |
| `PGDATABASE` | `railway` | Default database name |
| `DATABASE_URL` | `postgresql://user:pass@host:port/db` | Alternative format |

---

## Troubleshooting

### "Connection refused"
- Check PGHOST is correct
- Check your IP isn't blocked (Railway should allow all)
- Try `telnet $PGHOST $PGPORT`

### "Authentication failed"
- Double-check PGUSER and PGPASSWORD
- Copy fresh from Railway dashboard

### "Relation does not exist"
- Hibernate should auto-create tables
- Check `spring.jpa.hibernate.ddl-auto=update`

### "Games not loading"
- Check `games.json` exists
- Check `GameDataLoader` logs
- Verify `/games` returns data

---

## Definition of Done

Migration complete when:
- [ ] PostgreSQL running on Railway
- [ ] Backend connects to PostgreSQL
- [ ] All 57 games load
- [ ] Calendar features work
- [ ] Auth features work
- [ ] Production deployment works
- [ ] SQLite file removed

---

## Next Steps

After PostgreSQL migration:
→ **Phase 8: Firestore Integration** (user profiles, sessions, feedback)
