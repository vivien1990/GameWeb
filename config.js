// 沉浸式动态互动绘本配置文件
const STORYBOOK_CONFIG = {
    // 动画时序配置（毫秒）
    animations: {
        // 场景1动画时序
        scene1: {
            blurFadeIn: 3000,        // 模糊场景淡入时间
            doorOpenDelay: 2000,     // 门板开启延迟
            doorOpenDuration: 4000,  // 门板开启持续时间
            clearViewDelay: 3000,    // 清晰视角出现延迟
            clearViewDuration: 6000, // 清晰视角动画时间
            bloodSplashDelay: 6000,  // 血迹溅射延迟
            bloodSplashDuration: 500, // 血迹溅射持续时间
            pupilShakeDelay: 6500,   // 瞳孔震颤延迟
            pupilShakeDuration: 2000, // 瞳孔震颤持续时间
            hintDelay: 8000,         // 提示文字出现延迟
            hintDuration: 1000       // 提示文字淡入时间
        },
        
        // 场景转换
        transition: {
            fadeOutDuration: 1000,   // 场景淡出时间
            fadeInDelay: 1000        // 下一场景淡入延迟
        }
    },

    // 音效配置
    audio: {
        // 音效文件路径
        files: {
            heartbeat: 'sounds/heartbeat.mp3',
            rain: 'sounds/rain.mp3',
            knife: 'sounds/knife.mp3'
        },
        
        // 音效播放时机（毫秒）
        timing: {
            heartbeatStart: 1000,    // 心跳声开始时间
            rainStart: 1000,         // 雨声开始时间
            knifeSound: 6000         // 刀砍声播放时间
        },
        
        // 音量设置（0-1）
        volume: {
            heartbeat: 0.7,
            rain: 0.5,
            knife: 0.8
        },
        
        // 循环播放设置
        loop: {
            heartbeat: true,
            rain: true,
            knife: false
        }
    },

    // 交互配置
    interaction: {
        // 鼠标跟随灵敏度
        mouseSensitivity: 10,
        
        // 视角调整范围
        viewAdjustment: {
            maxMoveX: 20,
            maxMoveY: 20,
            scale: 1.02
        },
        
        // 震动配置（移动设备）
        vibration: {
            pattern: [200, 100, 200, 100, 400], // 震动模式
            enabled: true
        },
        
        // 屏幕震动配置
        screenShake: {
            duration: 300,           // 震动持续时间
            intensity: 5             // 震动强度
        }
    },

    // 视觉效果配置
    visual: {
        // 滤镜设置
        filters: {
            initialBlur: 8,          // 初始模糊度（像素）
            finalBlur: 0             // 最终模糊度
        },
        
        // 颜色设置
        colors: {
            backgroundColor: '#000000',
            textColor: 'rgba(255, 255, 255, 0.8)',
            bloodColor: '#8B0000'
        },
        
        // 缩放效果
        scaling: {
            bloodSplashInitial: 0.8,
            bloodSplashPeak: 1.1,
            bloodSplashFinal: 1.0,
            pupilInitial: 0.5,
            pupilFinal: 1.0
        }
    },

    // 性能配置
    performance: {
        // 预加载设置
        preload: {
            images: true,
            audio: true,
            showProgress: true
        },
        
        // 动画优化
        animation: {
            useGPUAcceleration: true,
            reducedMotion: false     // 是否考虑用户的减少动画偏好
        }
    },

    // 调试配置
    debug: {
        enabled: false,              // 是否启用调试模式
        showTimeline: false,         // 是否显示动画时间轴
        logEvents: false,            // 是否记录事件日志
        showFPS: false              // 是否显示帧率
    },

    // 响应式配置
    responsive: {
        mobile: {
            pupilSize: 150,          // 移动端瞳孔大小
            textSize: 16,            // 移动端文字大小
            hintBottom: 30           // 移动端提示文字底部距离
        },
        
        desktop: {
            pupilSize: 200,          // 桌面端瞳孔大小
            textSize: 18,            // 桌面端文字大小
            hintBottom: 50           // 桌面端提示文字底部距离
        }
    },

    // 用户体验配置
    ux: {
        // 全屏模式
        fullscreen: {
            autoEnter: false,        // 是否自动进入全屏
            showControls: false      // 是否显示全屏控制按钮
        },
        
        // 用户提示
        hints: {
            showClickHint: true,     // 是否显示点击提示
            showMouseHint: false,    // 是否显示鼠标移动提示
            hintText: '点击屏幕推进剧情'
        },
        
        // 防止误操作
        prevention: {
            rightClick: true,        // 禁用右键菜单
            textSelection: true,     // 禁用文本选择
            dragDrop: true          // 禁用拖放
        }
    }
};

// 导出配置供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = STORYBOOK_CONFIG;
}

// 浏览器环境下挂载到全局对象
if (typeof window !== 'undefined') {
    window.STORYBOOK_CONFIG = STORYBOOK_CONFIG;
} 