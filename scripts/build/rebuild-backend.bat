@echo off
echo Cleaning and rebuilding backend...
cd /d "%~dp0backend"

if exist target (
    echo Deleting old build...
    rmdir /s /q target
)

echo Build cleaned. Please rebuild in IntelliJ:
echo 1. Build -^> Rebuild Project
echo 2. Then run LutemMvpApplication.java
pause
