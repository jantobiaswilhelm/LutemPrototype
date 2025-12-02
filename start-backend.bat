@echo off
echo Starting Lutem Backend...
cd /d "%~dp0backend"

REM Verify JAVA_HOME is set
if "%JAVA_HOME%"=="" (
    echo ERROR: JAVA_HOME not set
    echo Run: setx JAVA_HOME "C:\Program Files\Java\jdk-25"
    pause
    exit /b 1
)

echo Using JAVA_HOME: %JAVA_HOME%

REM Try Maven wrapper
if exist mvnw.cmd (
    echo Using Maven wrapper...
    call mvnw.cmd spring-boot:run
    goto :end
)

REM Try mvn
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Found Maven, starting...
    mvn spring-boot:run
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
