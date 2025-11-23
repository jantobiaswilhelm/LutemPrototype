@echo off
REM Batch script to add store URLs to GameController.java
setlocal enabledelayedexpansion

set "FILE=src\main\java\com\lutem\mvp\GameController.java"
set "TEMP_FILE=%FILE%.tmp"

echo Adding store URLs to GameController.java...

REM Read the file and replace empty storeUrls
(
    for /f "usebackq delims=" %%a in ("%FILE%") do (
        set "line=%%a"
        
        REM Check if line contains empty storeUrl
        echo !line! | findstr /C:"\"\".*// storeUrl" >nul
        if !errorlevel! equ 0 (
            REM Tetris Effect
            echo !line! | findstr /C:"1003590" >nul
            if !errorlevel! equ 0 (
                echo             "https://store.steampowered.com/app/1003590/Tetris_Effect_Connected/", // storeUrl
            ) else (
                REM Dead Cells
                echo !line! | findstr /C:"588650" >nul
                if !errorlevel! equ 0 (
                    echo             "https://store.steampowered.com/app/588650/Dead_Cells/", // storeUrl
                ) else (
                    echo !line!
                )
            )
        ) else (
            echo !line!
        )
    )
) > "%TEMP_FILE%"

move /y "%TEMP_FILE%" "%FILE%"
echo Done!
pause
