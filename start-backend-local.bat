@echo off
echo Starting Lutem Backend with LOCAL profile (H2 database)...
cd /d "%~dp0backend"

REM Set JAVA_HOME to JDK 25
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
echo Using Java: %JAVA_HOME%

REM Set Spring profile
set SPRING_PROFILES_ACTIVE=local

REM Try Maven wrapper
if exist mvnw.cmd (
    echo Using Maven wrapper with profile: local
    call mvnw.cmd spring-boot:run
    goto :end
)

echo Maven wrapper not found!
pause

:end
