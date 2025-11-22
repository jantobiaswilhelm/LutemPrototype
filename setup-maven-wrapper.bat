@echo off
echo ================================================
echo Maven Wrapper Setup Helper
echo ================================================
echo.

cd /d "%~dp0backend"

REM Check if wrapper already exists
if exist mvnw.cmd (
    echo [OK] Maven wrapper already installed!
    echo.
    echo Test it: mvnw.cmd --version
    pause
    exit /b 0
)

echo [!] Maven wrapper NOT found
echo.
echo ================================================
echo NEXT STEPS:
echo ================================================
echo.
echo METHOD 1 (RECOMMENDED): Use IntelliJ
echo ----------------------------------------
echo 1. Open IntelliJ with backend project
echo 2. Open Terminal (Alt+F12)
echo 3. Run: mvn -N wrapper:wrapper
echo 4. Wait ~30 seconds for download
echo 5. Run this script again to verify
echo.
echo METHOD 2: Use IntelliJ Maven Panel
echo ----------------------------------------
echo 1. View → Tool Windows → Maven
echo 2. Expand Plugins → wrapper
echo 3. Double-click "wrapper:wrapper"
echo 4. Wait for completion
echo 5. Run this script again to verify
echo.
echo METHOD 3: Manual Download
echo ----------------------------------------
echo If IntelliJ Maven doesn't work:
echo 1. Download from: https://github.com/takari/maven-wrapper
echo 2. See: docs\adding-maven-wrapper.md
echo.
echo ================================================
echo.
pause
