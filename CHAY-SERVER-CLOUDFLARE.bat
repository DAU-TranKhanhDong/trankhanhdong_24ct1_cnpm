@echo off
title KET NOI CSDL MYSQL QUA CLOUDFLARE TUNNEL
color 0A

echo =========================================================================
echo       HE THONG KET NOI DATABASE MYSQL QUA CLOUDFLARE TUNNEL
echo       DO AN: WEBSITE BAN HANG GIA DUNG SMART - TRAN KHANH DONG
echo =========================================================================
echo.

echo [1/3] Kiem tra ket noi MySQL...
echo Luu y: Hay chac chan ban da mo XAMPP Control Panel va bam [Start] o MySQL!
echo.

echo [2/3] Khoi dong Backend Server (Port 3000)...
start "Backend Server" cmd /k "cd /d %~dp0server && npm start"

timeout /t 3 /nobreak >nul

echo [3/3] Dang tao duong ham Cloudflare Tunnel (HTTP2)...
echo.
echo =========================================================================
echo HUONG DAN SU DUNG:
echo 1. Cho vai giay, Cloudflare se cap 1 link co dang:
echo    https://xxxxxx.trycloudflare.com
echo.
echo 2. Copy duong link do.
echo.
echo 3. Mo website Netlify cua ban:
echo    https://websitebanhangcuakhanhdong.netlify.app/
echo.
echo 4. Bam vao nut [CSDL: Demo Local] o goc tren ben phai,
echo    dan link vao roi bam "Luu & Ket Noi CSDL".
echo.
echo 5. Den xanh se bat: [MySQL: Da ket noi]!
echo =========================================================================
echo.

if exist "%~dp0tools\cloudflared.exe" (
    "%~dp0tools\cloudflared.exe" tunnel --protocol http2 --url http://localhost:3000
) else (
    echo [LOI] Khong tim thay file tools\cloudflared.exe!
    pause
)
