@echo off
echo ================================================
echo Lutem Development Environment Check
echo ================================================
echo.

echo [1/4] Checking Java...
where java >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Java found in PATH
    java -version 2>&1 | findstr "version"
) else (
    echo [!] Java NOT in PATH
    echo     But IntelliJ likely has Java configured
)
echo.

echo [2/4] Checking Maven...
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Maven found in PATH
    mvn --version | findstr "Apache Maven"
) else (
    echo [!] Maven NOT in PATH
    echo     Solution: Add Maven Wrapper (see below)
)
echo.

echo [3/4] Checking Maven Wrapper...
cd /d "%~dp0backend"
if exist mvnw.cmd (
    echo [OK] Maven wrapper found!
    mvnw.cmd --version | findstr "Apache Maven"
) else (
    echo [!] Maven wrapper NOT found
    echo     Run: setup-maven-wrapper.bat
)
echo.

echo [4/4] Checking IntelliJ...
if exist "%USERPROFILE%\.IntelliJIdea*" (
    echo [OK] IntelliJ config found
) else (
    echo [?] IntelliJ config not in standard location
)
echo.

echo ================================================
echo RECOMMENDATIONS:
echo ================================================
if not exist mvnw.cmd (
    echo.
    echo [ACTION NEEDED] Add Maven Wrapper
    echo -----------------------------------------
    echo Run: setup-maven-wrapper.bat
    echo.
    echo This will make the project work on ANY machine!
    echo.
)

echo ================================================
echo CURRENT STARTUP METHOD:
echo ================================================
echo.
if exist mvnw.cmd (
    echo [READY] You can use:
    echo   - Double-click: start-lutem.bat
    echo   - Command line: mvnw.cmd spring-boot:run
) else (
    echo [MANUAL] Until wrapper is added:
    echo   1. IntelliJ: Right-click LutemMvpApplication.java → Run
    echo   2. Double-click: start-frontend.bat
)
echo.
echo ================================================
pause
