/**
 * 视频预加载系统
 * 解决视频黑屏和加载延迟问题
 */
class VideoPreloader {
    constructor() {
        this.preloadedVideos = new Map();
        this.loadingQueue = [];
        this.isLoading = false;
        this.loadingIndicator = null;
        this.init();
    }

    init() {
        this.createLoadingIndicator();
        console.log('🎥 视频预加载系统已初始化');
    }

    /**
     * 创建加载指示器
     */
    createLoadingIndicator() {
        // 创建加载指示器DOM
        this.loadingIndicator = document.createElement('div');
        this.loadingIndicator.id = 'video-loading-indicator';
        this.loadingIndicator.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">视频加载中...</div>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            #video-loading-indicator {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 99999;
                backdrop-filter: blur(5px);
            }
            
            #video-loading-indicator.show {
                display: flex;
            }
            
            .loading-content {
                text-align: center;
                color: white;
                font-family: 'Microsoft YaHei', sans-serif;
            }
            
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 3px solid #333;
                border-top: 3px solid #ffb100;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                font-size: 18px;
                margin-bottom: 20px;
                opacity: 0.9;
            }
            
            .loading-progress {
                width: 300px;
                height: 4px;
                background: #333;
                border-radius: 2px;
                overflow: hidden;
                margin: 0 auto;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #ffb100, #ff5c00);
                width: 0%;
                transition: width 0.3s ease;
                border-radius: 2px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(this.loadingIndicator);
    }

    /**
     * 预加载单个视频
     * @param {string} src - 视频URL
     * @param {Object} options - 配置选项
     */
    async preloadVideo(src, options = {}) {
        // 如果已经预加载过，直接返回
        if (this.preloadedVideos.has(src)) {
            return this.preloadedVideos.get(src);
        }

        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            
            // 设置视频属性
            video.preload = options.preload || 'auto';
            video.muted = true; // 预加载时静音
            
            // 监听加载事件
            video.addEventListener('loadeddata', () => {
                console.log(`✅ 视频预加载完成: ${src}`);
                this.preloadedVideos.set(src, video);
                resolve(video);
            });

            video.addEventListener('error', (e) => {
                console.error(`❌ 视频预加载失败: ${src}`, e);
                reject(e);
            });

            // 开始加载
            video.src = src;
        });
    }

    /**
     * 批量预加载视频列表
     * @param {Array} videoList - 视频URL数组
     * @param {Function} progressCallback - 进度回调
     */
    async preloadVideoList(videoList, progressCallback = null) {
        if (videoList.length === 0) return;

        this.showLoading();
        
        let loadedCount = 0;
        const totalCount = videoList.length;

        try {
            for (const videoSrc of videoList) {
                await this.preloadVideo(videoSrc);
                loadedCount++;
                
                // 更新进度
                const progress = (loadedCount / totalCount) * 100;
                this.updateProgress(progress);
                
                if (progressCallback) {
                    progressCallback(loadedCount, totalCount, progress);
                }
            }
            
            console.log(`🎥 批量预加载完成: ${loadedCount}/${totalCount} 个视频`);
            
        } catch (error) {
            console.error('❌ 批量预加载出错:', error);
        } finally {
            this.hideLoading();
        }
    }

    /**
     * 获取预加载的视频
     * @param {string} src - 视频URL
     */
    getPreloadedVideo(src) {
        return this.preloadedVideos.get(src);
    }

    /**
     * 智能切换视频（使用预加载的视频）
     * @param {HTMLVideoElement} videoElement - 目标视频元素
     * @param {string} newSrc - 新视频URL
     * @param {Object} options - 配置选项
     */
    async switchVideo(videoElement, newSrc, options = {}) {
        const preloadedVideo = this.getPreloadedVideo(newSrc);
        
        if (preloadedVideo) {
            // 使用预加载的视频
            videoElement.src = newSrc;
            videoElement.muted = options.muted !== false;
            
            if (options.autoplay !== false) {
                try {
                    await videoElement.play();
                    console.log(`✅ 视频切换成功: ${newSrc}`);
                } catch (e) {
                    console.warn('视频自动播放被阻止:', e);
                }
            }
        } else {
            // 没有预加载，显示加载状态
            this.showLoading('视频加载中...');
            
            videoElement.addEventListener('loadeddata', () => {
                this.hideLoading();
            }, { once: true });
            
            videoElement.src = newSrc;
            videoElement.muted = options.muted !== false;
            
            if (options.autoplay !== false) {
                videoElement.play().catch(e => {
                    console.warn('视频自动播放被阻止:', e);
                });
            }
        }
    }

    /**
     * 显示加载指示器
     * @param {string} text - 加载文字
     */
    showLoading(text = '视频加载中...') {
        if (this.loadingIndicator) {
            this.loadingIndicator.querySelector('.loading-text').textContent = text;
            this.loadingIndicator.classList.add('show');
        }
    }

    /**
     * 隐藏加载指示器
     */
    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('show');
        }
    }

    /**
     * 更新加载进度
     * @param {number} progress - 进度百分比 (0-100)
     */
    updateProgress(progress) {
        if (this.loadingIndicator) {
            const progressBar = this.loadingIndicator.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
        }
    }

    /**
     * 清理预加载的视频
     */
    clearPreloadedVideos() {
        this.preloadedVideos.forEach(video => {
            video.src = '';
            video.load();
        });
        this.preloadedVideos.clear();
        console.log('🗑️ 已清理所有预加载视频');
    }
}

// 创建全局实例
window.videoPreloader = new VideoPreloader();

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoPreloader;
} 