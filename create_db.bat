@echo off
echo ========================================
echo Creating SmartHR Database in PostgreSQL
echo ========================================
echo.

echo Enter your PostgreSQL password:
set /p PGPASSWORD=

echo.
echo Creating database 'smarthr'...
psql -U postgres -c "CREATE DATABASE smarthr;"

if %errorlevel% equ 0 (
    echo.
    echo ✅ Database created successfully!
    echo.
    echo Now you can start the backend server:
    echo   cd backend
    echo   npm start
) else (
    echo.
    echo ❌ Failed to create database
    echo.
    echo Possible reasons:
    echo 1. Wrong password
    echo 2. PostgreSQL not in PATH
    echo 3. Database already exists
    echo.
    echo Try manually:
    echo 1. Open pgAdmin
    echo 2. Right-click Databases
    echo 3. Create Database: smarthr
)

echo.
pause
