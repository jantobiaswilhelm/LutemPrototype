@echo off
echo ======================================
echo Starting Lutem MVP
echo ======================================
echo.

REM Start backend in new window
echo [1/2] Starting backend...
start "Lutem Backend" cmd /k "%~dp0start-backend.bat"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in new window
echo [2/2] Starting frontend...
start "Lutem Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo ======================================
echo Lutem Started!
echo ======================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Close this window when done.
pause >nul
