@echo off
REM ==============================================
REM HACKTOLIVE - Local Development with Docker
REM ==============================================

echo ========================================
echo HACKTOLIVE - Starting Development
echo ========================================

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)

echo Starting Docker containers...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo ========================================
echo Development environment is running!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo.
echo To view logs: docker-compose -f docker-compose.dev.yml logs -f
echo To stop:      docker-compose -f docker-compose.dev.yml down
echo.

pause
