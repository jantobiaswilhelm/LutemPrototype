@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
cd /d %~dp0
echo JAVA_HOME=%JAVA_HOME%
call mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=local
