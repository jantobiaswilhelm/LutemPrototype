@echo off
echo Starting Lutem Backend with LOCAL profile (H2 database)...
cd /d "%~dp0backend"

REM Set JAVA_HOME if not already set (auto-detect latest JDK)
if "%JAVA_HOME%"=="" (
    for /d %%d in ("C:\Program Files\Java\jdk-*") do set "JAVA_HOME=%%d"
)
echo Using Java: %JAVA_HOME%

REM Set Spring profile
set SPRING_PROFILES_ACTIVE=local

REM Load environment variables from .env.local if it exists
if exist .env.local (
    echo Loading environment from .env.local...
    for /f "tokens=1,2 delims==" %%a in ('type .env.local ^| findstr /v "^#" ^| findstr /v "^$"') do (
        set "%%a=%%b"
    )
)

REM Try Maven wrapper
if exist mvnw.cmd (
    echo Using Maven wrapper with profile: local
    call mvnw.cmd spring-boot:run
    goto :end
)

echo Maven wrapper not found!
pause

:end
