@echo off
echo ======================================
echo FORCE CLEAN BACKEND
echo ======================================
echo.

cd /d "%~dp0backend"

echo Deleting target folder...
if exist target (
    rd /s /q target
    echo Target folder deleted!
) else (
    echo Target folder not found.
)

echo.
echo Deleting IntelliJ build cache...
cd ..
if exist .idea (
    if exist .idea\compiler.xml (
        del /q .idea\compiler.xml
        echo Compiler cache cleared!
    )
)

echo.
echo ======================================
echo CLEAN COMPLETE!
echo ======================================
echo.
echo Next steps:
echo 1. Open IntelliJ
echo 2. Build -^> Rebuild Project
echo 3. Run LutemMvpApplication.java
echo.
pause
