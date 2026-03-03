@echo off
echo Starting Class Assessment Data Visualizer...
echo.

echo Starting Backend API...
cd "visualization-practice-api\visualization-practice-api-act"
start "Backend API" cmd /k "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend...
cd "..\..\visualization-frontend\Visualzation-of-Assessment-Data-SWE-V2-main"
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo Both services are starting in separate windows:
echo - Backend API: http://localhost:8000
echo - Frontend: Check the frontend window for the URL (usually http://localhost:5173)
echo.
echo Press any key to exit this script (services will continue running)...
pause >nul
