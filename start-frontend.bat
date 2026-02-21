@echo off
echo Starting Lutem React Frontend (dev server)...
cd /d "%~dp0frontend-react"

if exist node_modules (
    echo Starting Vite dev server...
    npm run dev
) else (
    echo Installing dependencies first...
    npm install && npm run dev
)
