@echo off
echo Starting Lutem Backend (Local Development)...
cd /d "%~dp0backend"

REM Verify JAVA_HOME is set
if "%JAVA_HOME%"=="" (
    echo ERROR: JAVA_HOME not set
    echo Run: setx JAVA_HOME "C:\Program Files\Java\jdk-25"
    pause
    exit /b 1
)

echo Using JAVA_HOME: %JAVA_HOME%
echo Using Profile: local (H2 database)

REM Set Steam API Key for local development
set STEAM_API_KEY=REDACTED_STEAM_API_KEY
echo Steam API: Configured

REM Try Maven wrapper
if exist mvnw.cmd (
    echo Using Maven wrapper...
    call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
    goto :end
)

REM Try mvn
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Found Maven, starting...
    mvn spring-boot:run -Dspring-boot.run.profiles=local
    goto :end
)

REM Fall back to error message
echo =====================================================
echo Maven wrapper and Maven not found!
echo.
echo Please start backend manually in IntelliJ
echo =====================================================
pause

:end
