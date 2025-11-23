@echo off
echo ================================================
echo Lutem MVP - IntelliJ Integration
echo ================================================
echo.
echo This script runs BEFORE your Spring Boot app starts
echo Opening frontend in browser...
echo.

start "" "%~dp0..\frontend\index.html"

echo.
echo Frontend opened!
echo Backend is starting via IntelliJ...
echo.
