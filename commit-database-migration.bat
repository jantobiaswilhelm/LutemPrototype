@echo off
echo ========================================
echo  Lutem Database Migration - Git Commit
echo ========================================
echo.

cd /d D:\Lutem\ProjectFiles\lutem-mvp

echo Adding all changes to Git...
git add .

echo.
echo Committing with detailed message...
git commit -m "feat: Migrate to SQLite database with admin API

- Add SQLite database with Spring Data JPA
- Create GameRepository and GameAdminController
- Extract all 41 games to games-seed.json
- Implement auto-loading system (GameDataLoader)
- Add full CRUD admin API endpoints
- Update GameController to use database
- Ready to scale to 100+ games

Files added:
- GameRepository.java
- GameAdminController.java
- GameDataLoader.java
- games-seed.json
- DATABASE_MIGRATION_COMPLETE.md
- DATABASE_MIGRATION_SESSION_SUMMARY.md

Files modified:
- pom.xml (added SQLite dependencies)
- application.properties (database config)
- Game.java (JPA entity)
- GameController.java (use repository)
- TODO.md (updated status)
- .gitignore (exclude database file)

Admin endpoints: /admin/games (GET, POST, PUT, DELETE, bulk)
Database: lutem.db (auto-created on first run)
"

echo.
echo ✅ Changes committed!
echo.
echo To push to GitHub:
echo   git push origin main
echo.
pause
