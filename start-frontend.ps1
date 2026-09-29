Write-Host "Starting BHARAT LIVES Frontend Apps..." -ForegroundColor Green
Write-Host ""

Write-Host "Stopping any existing frontend processes..." -ForegroundColor Gray
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

Write-Host "Starting Officer Console on port 3000..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd \"D:\BHARAT LIVES\bharat-lives\frontend\apps\officer\" && npx next dev -p 3000 > \"D:\BHARAT LIVES\bharat-lives\officer.log\" 2>&1" -WindowStyle Hidden

Write-Host "Starting Citizen Portal on port 3002..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd \"D:\BHARAT LIVES\bharat-lives\frontend\apps\citizen\" && npx next dev -p 3002 > \"D:\BHARAT LIVES\bharat-lives\citizen.log\" 2>&1" -WindowStyle Hidden

Write-Host "Starting Admin Console on port 3003..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd \"D:\BHARAT LIVES\bharat-lives\frontend\apps\admin\" && npx next dev -p 3003 > \"D:\BHARAT LIVES\bharat-lives\admin.log\" 2>&1" -WindowStyle Hidden

Write-Host ""
Write-Host "Waiting 45 seconds for apps to compile..." -ForegroundColor Gray
Start-Sleep -Seconds 45

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "Frontend Apps Started!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Officer Console:  http://localhost:3000" -ForegroundColor White
Write-Host "Citizen Portal:   http://localhost:3002" -ForegroundColor White
Write-Host "Admin Console:    http://localhost:3003" -ForegroundColor White
Write-Host ""
Write-Host "Logs:" -ForegroundColor Gray
Write-Host "  Officer: D:\BHARAT LIVES\bharat-lives\officer.log" -ForegroundColor Gray
Write-Host "  Citizen: D:\BHARAT LIVES\bharat-lives\citizen.log" -ForegroundColor Gray
Write-Host "  Admin:   D:\BHARAT LIVES\bharat-lives\admin.log" -ForegroundColor Gray
Write-Host ""
