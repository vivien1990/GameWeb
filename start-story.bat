@echo off
echo 🎬 启动沉浸式动态互动绘本...
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未找到Python，请先安装Python
    echo 下载地址：https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python已安装
echo 🚀 启动HTTP服务器...
echo.

REM 显示访问地址
echo 📍 访问地址：
echo    首页：     http://localhost:8000/GameWeb/index.html
echo.

echo    镜头1：   http://localhost:8000/index.html
echo    镜头2：   http://localhost:8000/simple-test-scene2.html
echo    镜头3：   http://localhost:8000/scene3-time-vortex.html
echo    镜头4：   http://localhost:8000/scene4-new-awakening.html
echo    镜头5：   http://localhost:8000/scene5-new.html
echo    镜头6：   http://localhost:8000/scene6-first-battle.html
echo    镜头7：   http://localhost:8000/scene7-cultivation.html
echo.

REM 等待2秒后自动打开浏览器
echo ⏰ 2秒后自动打开浏览器...
timeout /t 2 /nobreak >nul

REM 自动打开浏览器（首页）
start "" "http://localhost:8000/GameWeb/index.html"

echo 🎮 浏览器已打开，开始体验故事！
echo 💡 提示：使用右上角控制面板可以切换镜头
echo.

REM 启动HTTP服务器
echo 🔥 服务器运行中... (按 Ctrl+C 停止)
python -m http.server 8000 