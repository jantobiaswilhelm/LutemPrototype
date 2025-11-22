@echo off
cd /d "%~dp0"

echo ======================================
echo LUTEM MVP - STRUCTURED GIT COMMIT
echo ======================================
echo.

REM Stage all modified and new files
echo Staging files...
git add .
echo.

REM Show what will be committed
echo Files to be committed:
git status --short
echo.

echo Creating commit...
git commit -m "feat: Multi-dimensional game recommendation system with enhanced UI" -m "BACKEND ENHANCEMENTS:" -m "- Added 5 new enums for rich game categorization (EmotionalGoal, Interruptibility, EnergyLevel, TimeOfDay, SocialPreference)" -m "- Expanded Game model with multi-dimensional attributes" -m "- Implemented 5-tier scoring algorithm (100-point scale)" -m "- Upgraded from 10 to 20 fully categorized games" -m "- Enhanced RecommendationRequest to accept 6 parameters" -m "- Updated RecommendationResponse to return top + 3 alternatives with reasons" -m "" -m "FRONTEND ENHANCEMENTS:" -m "- Replaced simple mood dropdown with multi-dimensional input system" -m "- Added 6-parameter form (emotional goals, interruptibility, energy, time, social)" -m "- Restored discrete time slider with 8 steps (5min → 3hr+)" -m "- Implemented 'Touch Grass' modal for 3+ hour sessions" -m "- Added loading spinner with rotating gaming tips (QuickWin #1)" -m "- Enhanced UX with smooth animations and transitions" -m "" -m "DEVELOPER TOOLS:" -m "- Created reliable startup scripts (start-backend.bat, start-frontend.bat, start-lutem.bat)" -m "- Added force-clean.bat for deep build cache cleaning" -m "- Implemented git workflow helper (git-commit.bat)" -m "" -m "DOCUMENTATION:" -m "- Comprehensive SESSION_COMPLETE_SUMMARY.md with technical deep-dive" -m "- Updated README.md with current features and architecture" -m "- Refreshed TODO.md with completed work and next steps" -m "- Added QuickWin documentation" -m "" -m "GAME LIBRARY:" -m "Casual (5-30 min): Unpacking, Dorfromantik, Tetris Effect, Dead Cells, Rocket League, Baba Is You" -m "Mid-Range (30-60 min): Hades, Stardew Valley, Slay the Spire, Apex Legends, PowerWash Simulator, Into the Breach, A Short Hike, Loop Hero" -m "Long-Form (60+ min): The Witcher 3, Minecraft, Dark Souls III, Civilization VI, Valorant, The Witness" -m "" -m "BREAKING CHANGES:" -m "- API request format changed from 2 to 6 parameters" -m "- Response now includes alternatives array" -m "- Frontend completely redesigned" -m "" -m "NEXT STEPS:" -m "- UI/UX enhancement phase (modern design refresh)" -m "- Expand game library to 40+" -m "- Complete QuickWin #3 (display alternatives in UI)" -m "" -m "Status: Core MVP Complete ✅"

echo.
echo Commit created successfully!
echo.

REM Show the commit
echo Commit details:
git log -1 --stat
echo.

echo ======================================
echo READY TO PUSH
echo ======================================
echo.
echo To push to GitHub:
echo   git push origin main
echo.
echo To create a new branch first:
echo   git checkout -b feature/multi-dimensional-system
echo   git push origin feature/multi-dimensional-system
echo.

pause
