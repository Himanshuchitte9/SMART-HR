@echo off
echo ========================================
echo SmartHR - Quick Start Script
echo ========================================
echo.

echo Checking if PostgreSQL is installed...
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] PostgreSQL not found!
    echo The system will use MongoDB as fallback.
    echo.
    echo To install PostgreSQL:
    echo 1. Download from: https://www.postgresql.org/download/windows/
    echo 2. Run installer and set password
    echo 3. Update backend\.env with your password
    echo 4. Restart this script
    echo.
) else (
    echo [OK] PostgreSQL is installed
)

echo.
echo Checking if MongoDB is installed...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB not found!
    echo If PostgreSQL is not configured, the app won't work.
    echo.
    echo To install MongoDB:
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
) else (
    echo [OK] MongoDB is installed
)

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
start cmd /k "cd backend && npm start"

timeout /t 3 >nul

echo.
echo ========================================
echo Starting Frontend Server...
echo ========================================
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo SmartHR is starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul
