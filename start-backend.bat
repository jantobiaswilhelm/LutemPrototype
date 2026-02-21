@echo off
echo Starting Lutem Backend (Local Development)...
cd /d "%~dp0backend"

REM Set JAVA_HOME if not already set (auto-detect latest JDK)
if "%JAVA_HOME%"=="" (
    for /d %%d in ("C:\Program Files\Java\jdk-*") do set "JAVA_HOME=%%d"
    if "%JAVA_HOME%"=="" (
        echo WARNING: JAVA_HOME not set and no JDK found in C:\Program Files\Java\
        echo Please set JAVA_HOME manually.
    ) else (
        echo JAVA_HOME not set, auto-detected: %JAVA_HOME%
    )
)

echo Using JAVA_HOME: %JAVA_HOME%
echo Using Profile: local (H2 database)

REM Steam API Key - set in .env.local or as environment variable
if "%STEAM_API_KEY%"=="" (
    echo WARNING: STEAM_API_KEY not set. Steam features will be unavailable.
) else (
    echo Steam API: Configured
)

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
