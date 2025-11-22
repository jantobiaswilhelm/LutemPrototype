@echo off
echo Starting Lutem Backend...
cd /d "%~dp0backend"

REM Try mvn first
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Found Maven, starting...
    mvn spring-boot:run
    goto :end
)

REM Try mvnw (Maven wrapper)
if exist mvnw.cmd (
    echo Using Maven wrapper...
    mvnw.cmd spring-boot:run
    goto :end
)

REM Fall back to IntelliJ message
echo =====================================================
echo Maven not found in PATH!
echo.
echo Please start backend manually:
echo 1. Open backend folder in IntelliJ
echo 2. Right-click on LutemMvpApplication.java
echo 3. Select "Run 'LutemMvpApplication'"
echo.
echo OR install Maven: https://maven.apache.org/download.cgi
echo =====================================================
pause

:end
