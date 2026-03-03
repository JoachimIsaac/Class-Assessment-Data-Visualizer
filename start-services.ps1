# PowerShell script to start both frontend and backend services
Write-Host "Starting Class Assessment Data Visualizer..." -ForegroundColor Green
Write-Host ""

# Start Backend API
Write-Host "Starting Backend API..." -ForegroundColor Yellow
Set-Location "visualization-practice-api\visualization-practice-api-act"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Set-Location "..\..\visualization-frontend\Visualzation-of-Assessment-Data-SWE-V2-main"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "Both services are starting in separate windows:" -ForegroundColor Green
Write-Host "- Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "- Frontend: Check the frontend window for the URL (usually http://localhost:5173)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this script (services will continue running)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
