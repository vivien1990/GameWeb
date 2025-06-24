// 主初始化文件 - 协调所有模块的启动
class GameInitializer {
    constructor() {
        this.isInitialized = false;
        this.config = null;
        this.loadingScreen = null;
    }
    
    // 开始初始化游戏
    async initialize() {
        console.log('🎮 游戏初始化开始');
        
        try {
            // 显示加载屏幕
            this.showLoadingScreen();
            
            // 等待配置加载
            await this.waitForModules();
            
            // 初始化核心管理器
            await this.initializeManagers();
            
            // 预加载全局资源
            await this.preloadGlobalResources();
            
            // 启动游戏
            this.startGame();
            
            this.isInitialized = true;
            console.log('✅ 游戏初始化完成');
            
        } catch (error) {
            console.error('❌ 游戏初始化失败:', error);
            this.showErrorScreen(error);
        }
    }
    
    // 显示加载屏幕
    showLoadingScreen() {
        console.log('📺 显示加载屏幕');
        
        // 创建自定义加载屏幕
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'game-loading-screen';
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #0a0a2e, #1a1a3e);
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 1000000;
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        
        loadingScreen.innerHTML = `
            <div style="text-align: center;">
                <h1 style="font-size: 32px; margin-bottom: 20px; color: #ffcc00;">
                    沉浸式互动体验
                </h1>
                <div style="width: 300px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; margin: 20px 0;">
                    <div id="loading-bar" style="height: 100%; background: #ffcc00; border-radius: 2px; width: 0%; transition: width 0.3s ease;"></div>
                </div>
                <div id="loading-status" style="font-size: 14px; opacity: 0.8;">
                    正在初始化...
                </div>
            </div>
        `;
        
        document.body.appendChild(loadingScreen);
        this.loadingScreen = loadingScreen;
    }
    
    // 更新加载进度
    updateLoadingProgress(progress, message) {
        const bar = document.getElementById('loading-bar');
        const status = document.getElementById('loading-status');
        
        if (bar) bar.style.width = `${progress}%`;
        if (status) status.textContent = message;
    }
    
    // 等待模块加载
    waitForModules() {
        return new Promise((resolve) => {
            const checkModules = () => {
                const required = [
                    'GameConfig',
                    'EventBus', 
                    'AudioManager',
                    'SceneManager',
                    'InteractionManager',
                    'ResourceLoader',
                    'DebugTools',
                    'SubtitleSystem',
                    'EffectSystem',
                    'UIComponents',
                    'Scene1',
                    'Scene2',
                    'GlobalKeyHandler'
                ];
                
                const available = required.filter(module => window[module]);
                const progress = (available.length / required.length) * 50; // 0-50%
                
                this.updateLoadingProgress(progress, `加载模块中... ${available.length}/${required.length}`);
                
                console.log(`📦 模块检查: ${available.length}/${required.length}`);
                
                if (available.length === required.length) {
                    console.log('🎯 所有模块已加载完成');
                    resolve();
                } else {
                    const missing = required.filter(m => !window[m]);
                    console.log('⏳ 等待模块:', missing.join(', '));
                    setTimeout(checkModules, 100);
                }
            };
            checkModules();
        });
    }
    
    // 初始化管理器
    async initializeManagers() {
        console.log('🔧 初始化管理器');
        this.updateLoadingProgress(60, '初始化核心系统...');
        
        // 初始化音频管理器
        if (window.AudioManager && window.AudioManager.initialize) {
            await window.AudioManager.initialize();
        }
        
        // 初始化场景管理器
        if (window.SceneManager && window.SceneManager.initialize) {
            await window.SceneManager.initialize();
        }
        
        this.updateLoadingProgress(80, '核心系统初始化完成');
        console.log('✅ 管理器初始化完成');
    }
    
    // 预加载全局资源
    async preloadGlobalResources() {
        console.log('📦 预加载全局资源');
        this.updateLoadingProgress(85, '预加载资源...');
        
        // 获取所有场景的资源配置
        const allResources = [];
        
        if (window.GameConfig && window.GameConfig.scenes) {
            Object.values(window.GameConfig.scenes).forEach(sceneConfig => {
                if (sceneConfig.resources) {
                    allResources.push(...sceneConfig.resources);
                }
            });
        }
        
        if (allResources.length > 0) {
            console.log(`📦 发现 ${allResources.length} 个资源需要预加载`);
            
            // 监听资源加载进度
            window.EventBus.on('resource:progress', (data) => {
                const resourceProgress = (data.percentage / 100) * 10; // 0-10%
                this.updateLoadingProgress(85 + resourceProgress, `预加载资源 ${data.loaded}/${data.total}`);
            });
            
            await window.ResourceLoader.preloadBatch(allResources);
        }
        
        this.updateLoadingProgress(95, '资源预加载完成');
        console.log('✅ 全局资源预加载完成');
    }
    
    // 启动游戏
    startGame() {
        console.log('🚀 启动游戏');
        this.updateLoadingProgress(100, '启动游戏...');
        
        // 延迟启动以确保加载动画完成
        setTimeout(() => {
            // 通知场景管理器开始游戏
            window.EventBus.emit('game:start');
            
            // 移除加载屏幕
            if (this.loadingScreen) {
                this.loadingScreen.style.opacity = '0';
                this.loadingScreen.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    if (this.loadingScreen && this.loadingScreen.parentNode) {
                        this.loadingScreen.remove();
                    }
                }, 500);
            }
        }, 500);
    }
    
    // 显示错误屏幕
    showErrorScreen(error) {
        console.error('💥 显示错误屏幕:', error);
        
        const errorScreen = document.createElement('div');
        errorScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a0000;
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 999999;
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        
        errorScreen.innerHTML = `
            <div style="text-align: center; max-width: 500px; padding: 40px;">
                <h2 style="color: #ff4444; margin-bottom: 20px;">
                    ❌ 加载错误
                </h2>
                <p style="margin-bottom: 20px; line-height: 1.6;">
                    游戏加载过程中遇到了问题。<br>
                    请刷新页面重试，或检查网络连接。
                </p>
                <details style="text-align: left; margin-top: 20px; font-size: 12px; color: #ccc;">
                    <summary style="cursor: pointer;">技术详情</summary>
                    <pre style="white-space: pre-wrap; margin-top: 10px;">${error.stack || error.message}</pre>
                </details>
                <button onclick="location.reload()" style="
                    margin-top: 30px;
                    padding: 12px 24px;
                    background: #333;
                    border: 1px solid #555;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                ">
                    🔄 重新加载
                </button>
            </div>
        `;
        
        document.body.appendChild(errorScreen);
        
        // 隐藏加载屏幕
        if (this.loadingScreen) {
            this.loadingScreen.style.display = 'none';
        }
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📄 页面DOM加载完成');
    
    const gameInitializer = new GameInitializer();
    await gameInitializer.initialize();
});

// 防止右键和文本选择（增强沉浸感）
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

// 全局调试API
window.GameAPI = {
    // 场景控制
    changeScene: (sceneId, options = {}) => {
        window.EventBus.emit('scene:change', {
            sceneId,
            ...options
        });
    },
    
    // 快速场景切换
    scene1: () => {
        window.EventBus.emit('scene:change', { sceneId: 'scene1' });
    },
    
    scene2: () => {
        window.EventBus.emit('scene:change', { sceneId: 'scene2' });
    },
    
    // 调试工具
    debug: {
        showEventInfo: () => window.DebugTools?.showEventInfo(),
        showAudioInfo: () => window.DebugTools?.showAudioInfo(),
        showSceneInfo: () => window.DebugTools?.showSceneInfo(),
        resetAudio: () => window.AudioManager?.reset(),
        clearEffects: () => window.EffectSystem?.clear()
    }
};

console.log('🎮 主初始化文件已加载');
console.log('🎮 全局API可用: window.GameAPI.scene1() / window.GameAPI.scene2()'); 