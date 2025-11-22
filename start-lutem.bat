@echo off
echo ======================================
echo Starting Lutem MVP
echo ======================================
echo.

REM Start backend in new window
echo [1/2] Starting backend...
start "Lutem Backend" cmd /k "%~dp0start-backend.bat"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Open frontend
echo [2/2] Opening frontend...
call "%~dp0start-frontend.bat"

echo.
echo ======================================
echo Lutem Started!
echo ======================================
echo Backend: http://localhost:8080
echo Frontend: opened in browser
echo.
echo Press any key to exit (backend will keep running)
pause >nul
