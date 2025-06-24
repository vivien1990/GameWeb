@echo off
chcp 65001 >nul
echo.
echo =====================================================
echo     Immersive Interactive Story Website
echo =====================================================
echo.
echo Starting local server...
echo.

REM 检查是否安装了 Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python server...
    echo Project URL: http://localhost:8001
    echo Press Ctrl+C to stop server
    echo.
    python -m http.server 8001
) else (
    REM 检查是否安装了 Node.js
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo Using Node.js server...
        echo Project URL: http://localhost:8001
        echo Press Ctrl+C to stop server
        echo.
        npx http-server -p 8001
    ) else (
        echo.
        echo Error: Python or Node.js not detected
        echo.
        echo Please install one of the following:
        echo 1. Python 3.x - https://www.python.org/downloads/
        echo 2. Node.js - https://nodejs.org/
        echo.
        echo Or open index.html directly in browser
        echo (Note: Some features may require HTTP server)
        echo.
        pause
    )
) 