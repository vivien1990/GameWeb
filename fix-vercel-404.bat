@echo off
chcp 65001 >nul
echo.
echo ========================================
echo     🔧 修复Vercel 404错误
echo ========================================
echo.

echo 📝 添加修复文件到Git...
git add vercel.json
git add index.html

echo 📤 提交更改...
git commit -m "🔧 修复Vercel 404错误 - 添加根目录重定向"

echo 🚀 推送到仓库...
git push

echo.
echo ✅ 修复文件已提交！
echo.
echo 💡 接下来的步骤：
echo    1. 等待Vercel自动重新部署（约1-2分钟）
echo    2. 或者在Vercel控制台手动触发重新部署
echo    3. 访问您的网站测试是否正常
echo.
echo 🌐 如果还有问题，可能需要：
echo    - 在Vercel控制台检查部署日志
echo    - 确认vercel.json配置已生效
echo.
pause 