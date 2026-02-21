@echo off
echo ================================================
echo Lutem MVP - IntelliJ Integration
echo ================================================
echo.
echo This script runs BEFORE your Spring Boot app starts.
echo Starting React dev server...
echo.

cd /d "%~dp0..\..\frontend-react"
start cmd /k "npm run dev"

echo.
echo Frontend dev server starting on http://localhost:5173
echo Backend is starting via IntelliJ...
echo.
