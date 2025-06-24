@echo off
chcp 65001 >nul
echo.
echo ========================================
echo     🚀 游戏网站快速部署工具
echo ========================================
echo.
echo 选择部署平台：
echo.
echo [1] Vercel (推荐 - 速度最快)
echo [2] GitHub Pages (免费方案)  
echo [3] Cloudflare Pages (全球CDN)
echo [4] 优化当前Netlify部署
echo [5] 部署到Surge.sh
echo [0] 退出
echo.
set /p choice="请输入选项 (0-5): "

if "%choice%"=="1" goto vercel
if "%choice%"=="2" goto github
if "%choice%"=="3" goto cloudflare
if "%choice%"=="4" goto netlify
if "%choice%"=="5" goto surge
if "%choice%"=="0" goto exit
goto invalid

:vercel
echo.
echo 🚀 准备部署到Vercel...
echo.
echo 检查Vercel CLI...
vercel --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Vercel CLI未安装，正在安装...
    npm install -g vercel
    if errorlevel 1 (
        echo ❌ 安装失败，请手动安装：npm install -g vercel
        pause
        goto end
    )
)

echo ✅ Vercel CLI已准备好
echo.
echo 开始部署...
vercel --prod

if errorlevel 1 (
    echo ❌ 部署失败
) else (
    echo ✅ 部署成功！
    echo 💡 访问您的网站查看效果
)
goto end

:github
echo.
echo 📱 准备部署到GitHub Pages...
echo.
echo 检查Git状态...
git status >nul 2>&1
if errorlevel 1 (
    echo ❌ 当前目录不是Git仓库
    echo 💡 请先初始化Git仓库并连接到GitHub
    pause
    goto end
)

echo 提交代码...
git add .
git commit -m "🚀 优化部署配置"
git push origin main

echo.
echo ✅ 代码已推送到GitHub
echo 💡 请在GitHub仓库设置中启用Pages：
echo    Settings → Pages → Source: Deploy from a branch → main
echo.
pause
goto end

:cloudflare
echo.
echo ☁️ 部署到Cloudflare Pages...
echo.
echo 💡 请访问：https://pages.cloudflare.com
echo    1. 连接您的GitHub仓库
echo    2. 选择框架预设：无（静态站点）
echo    3. 构建命令：留空
echo    4. 构建输出目录：/
echo    5. 点击部署
echo.
pause
goto end

:netlify
echo.
echo 🔧 优化当前Netlify部署...
echo.
echo ✅ 已创建netlify.toml配置文件
echo 💡 推送更新到仓库以应用优化：
echo.
git add netlify.toml
git commit -m "🔧 优化Netlify部署配置"
git push

echo.
echo ✅ 配置已更新，等待Netlify重新部署...
echo 💡 通常需要1-2分钟生效
goto end

:surge
echo.
echo ⚡ 准备部署到Surge.sh...
echo.
echo 检查Surge CLI...
surge --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Surge CLI未安装，正在安装...
    npm install -g surge
)

echo ✅ 开始部署...
surge . --domain your-game.surge.sh

goto end

:invalid
echo ❌ 无效选项，请重新选择
echo.
goto menu

:exit
echo 👋 再见！
exit /b 0

:end
echo.
echo ========================================
echo     🎯 部署建议
echo ========================================
echo.
echo 🥇 首选：Vercel - 对视频内容优化最好
echo 🥈 备选：GitHub Pages - 完全免费
echo 🥉 国内：考虑阿里云OSS或腾讯云COS
echo.
echo 💡 如果还是很卡，建议：
echo    1. 压缩视频文件大小
echo    2. 使用CDN加速
echo    3. 实施懒加载
echo.
pause 