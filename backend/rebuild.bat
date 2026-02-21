@echo off
if "%JAVA_HOME%"=="" (
    for /d %%d in ("C:\Program Files\Java\jdk-*") do set "JAVA_HOME=%%d"
)
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d "%~dp0"
call mvnw.cmd clean package -DskipTests
