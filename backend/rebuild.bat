@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
set "PATH=%JAVA_HOME%\bin;%PATH%"
cd /d D:\Lutem\LutemPrototype\backend
call mvnw.cmd clean package -DskipTests
