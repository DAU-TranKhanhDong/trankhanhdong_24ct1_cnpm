@echo off
chcp 65001 >nul
title KET NOI CSDL MYSQL VOI WEBNETLIFY QUA CLOUDFLARE TUNNEL
color 0A

echo =========================================================================
echo       HE THONG KET NOI DATABASE MYSQL QUA CLOUDFLARE TUNNEL
echo       DO AN: WEBSITE BAN HANG GIA DUNG SMART - TRAN KHANH DONG
echo =========================================================================
echo.

:: 1. Kiem tra XAMPP MySQL
echo [1/3] Kiem tra ket noi MySQL...
echo 👉 Hay chac chan ban da mo XAMPP Control Panel va bam [Start] o MySQL!
echo.

:: 2. Khoi dong Backend Server neu chua chay
echo [2/3] Khoi dong Backend Node.js Express (Port 3000)...
start "Backend Express Server (Port 3000)" cmd /k "cd /d %~dp0server && npm start"

:: Cho 3 giay de Backend on dinh
timeout /t 3 /nobreak >nul

:: 3. Chay Cloudflare Tunnel
echo [3/3] Dang tao duong ham Cloudflare Tunnel...
echo.
echo =========================================================================
echo ⚡ HUONG DAN SU DUNG:
echo 1. Cho vai giay, Cloudflare se tao ra 1 duong link co duoi:
echo    👉 https://xxxxxxxx.trycloudflare.com
echo.
echo 2. Copy duong link do (Boi den va bam Enter).
echo.
echo 3. Mo website Netlify cua ban:
echo    👉 https://websitebanhangcuakhanhdong.netlify.app/
echo.
echo 4. Bam vao nut [CSDL: Demo Local] o tren thanh Header (goc tren ben phai),
echo    dan link vao roi bam "Luu & Ket Noi CSDL".
echo.
echo 5. Den xanh se hien len: [MySQL: Da ket noi]!
echo    Du lieu web Netlify se luu thang vao MySQL tren may tinh cua ban!
echo =========================================================================
echo.

if exist "%~dp0tools\cloudflared.exe" (
    "%~dp0tools\cloudflared.exe" tunnel --url http://localhost:3000
) else (
    echo [LOI] Khong tim thay file tools\cloudflared.exe!
    pause
)
