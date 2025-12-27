@echo off
echo ╔════════════════════════════════════════════════════════╗
echo ║        LUTEM - Seed Local DB from Production           ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo This will fetch all games from production and import to local H2.
echo.
echo Make sure:
echo   1. Production backend is running (Railway)
echo   2. Local backend is NOT running (will start fresh)
echo.
pause

cd /d %~dp0backend
call mvn spring-boot:run -Dspring-boot.run.profiles=local,seed

pause
