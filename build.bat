@echo off
echo === Rotina da Familia - Build Script ===
cd C:\Users\danil\Documents\AppFanily

:: Le o versionCode atual
for /f "tokens=2 delims=:," %%a in ('findstr "versionCode" app.json') do set VC=%%a
set VC=%VC: =%
set /a NEWVC=%VC%+1

echo versionCode atual: %VC%
echo Novo versionCode: %NEWVC%

:: Atualiza versionCode
powershell -Command "(Get-Content app.json) -replace '\"versionCode\": %VC%', '\"versionCode\": %NEWVC%' | Set-Content app.json"

git add .
git commit -m "build versionCode %NEWVC%"
git push
eas build --platform android --profile production

echo === Build iniciado! Aguarde o link do AAB ===
pause
