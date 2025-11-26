@echo off
echo Starting Lutem Backend...
cd /d "%~dp0backend"

REM Set JAVA_HOME if not already set
if "%JAVA_HOME%"=="" (
    REM Check Java 25 at D:\programmes first
    if exist "D:\programmes\bin\java.exe" (
        set "JAVA_HOME=D:\programmes"
        echo Using JDK 25: D:\programmes
    ) else if exist "C:\Users\janib\.jdks\openjdk-18" (
        set "JAVA_HOME=C:\Users\janib\.jdks\openjdk-18"
        echo Using JDK 18: C:\Users\janib\.jdks\openjdk-18
    ) else if exist "C:\Program Files\Java\jdk-25" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-25"
        echo Using JDK: %JAVA_HOME%
    )
)

REM Verify JAVA_HOME is set
if "%JAVA_HOME%"=="" (
    echo ERROR: JAVA_HOME not set and couldn't find Java installation
    echo Please install Java or set JAVA_HOME manually
    pause
    exit /b 1
)

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
