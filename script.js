class InteractiveStorybook {
    constructor() {
        this.currentScene = 1;
        this.isTransitioning = false;
        this.audioContext = null;
        this.sounds = {};
        this.waitingForUserInteraction = false;
        this.audioUnlocked = false;
        
        // 🎮 快速测试模式配置
        this.quickTestMode = true; // 设为false可体验完整44秒Chat音频
        this.quickTestDelay = 5000; // 快速模式延迟时间（毫秒）
        this.knifeAlreadyPlayed = false; // 防止刀砍音效重复播放
        this.postChatSequenceStarted = false; // 防止后续序列重复执行
        this.whiteFlashExecuted = false; // 防止白光效果重复播放
        this.bloodEffectExecuted = false; // 防止血迹效果重复播放
        this.waitingForContinueClick = false; // 等待用户点击继续
        this.clickListenerAdded = false; // 防止重复添加点击监听器
        this.scene1CompletedSignalSent = false; // 防止重复发送镜头1完成信号
        this.personLayersAdded = false; // 🔧 防止人物门图层重复添加
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.preloadSounds();
        this.startScene1();
    }

    setupEventListeners() {
        // 鼠标移动控制视角微调
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        });

        // 点击推进剧情 - 确保只有一个监听器
        if (!this.clickListenerAdded) {
        document.addEventListener('click', (e) => {
            this.handleClick(e);
        });
            this.clickListenerAdded = true;
            console.log('✅ 点击事件监听器已添加');
        }

        // 键盘控制（可选）
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                this.handleClick(e);
            }
        });

        // 触摸设备支持
        document.addEventListener('touchstart', (e) => {
            this.handleClick(e);
        });

        // 预加载完成后隐藏加载屏
        window.addEventListener('load', () => {
            this.hideLoading();
        });
    }

    // 鼠标移动视角微调
    handleMouseMove(e) {
        if (this.currentScene === 1) {
            const scene = document.querySelector('.scene-1');
            const backgroundScene = scene.querySelector('.background-scene');
            
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            
            const moveX = mouseX * 30; // 增大视角微调范围
            const moveY = mouseY * 30;
            
            // 根据当前状态决定缩放比例
            let scaleValue = '1.2'; // 初始状态120%
            if (scene.classList.contains('approaching')) {
                scaleValue = '0.8'; // 接近状态80%
            }
            
            backgroundScene.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scaleValue})`;
        }
    }

    // 点击事件处理
    handleClick(e) {
        console.log('🖱️ 检测到点击事件');
        console.log('🔍 点击调试信息:');
        console.log('  - isTransitioning:', this.isTransitioning);
        console.log('  - waitingForContinueClick:', this.waitingForContinueClick);
        console.log('  - currentScene:', this.currentScene);
        
        if (this.isTransitioning) {
            console.log('⏸️ 正在转换中，忽略点击');
            return;
        }

        // 检查是否在等待继续点击
        if (this.waitingForContinueClick) {
            console.log('🖱️ 用户点击继续，开始后续动画');
            this.waitingForContinueClick = false;
            this.hideContinueHint();
            this.continueAfterChat02();
            return;
        }

        switch (this.currentScene) {
            case 1:
                this.approachDoor();
                break;
            case 1.5:
                this.transitionToScene2();
                break;
            case 2:
                // 这里可以扩展更多场景
                console.log('后续场景开发中...');
                break;
        }
    }

    // 新增：角色向前接近门板的交互
    approachDoor() {
        if (this.isTransitioning) return;
        
        // 如果音频还没解锁，不允许进行游戏
        if (!this.audioUnlocked) {
            console.log('❌ 音频未解锁，请先启用音频');
            return;
        }
        
        this.isTransitioning = true;
        console.log('🎮 角色向前接近门板...');

        const scene1 = document.querySelector('.scene-1');
        
        // 第一阶段：贴近效果（背景缩小，门板放大）
        scene1.classList.add('approaching');
        
        // 用户开始交互，不需要隐藏任何提示（因为初始就没有）
        console.log('🎮 用户开始交互体验');
        
        console.log('🎮 角色接近，门板放大效果启动...');
        
        // 轻微震动效果
        setTimeout(() => {
            this.addShakeEffect();
        }, 300);

        // 0.3秒后开始开门动画 - 超快节奏
        setTimeout(() => {
            this.startDoorOpeningSequence();
        }, 300);
    }

    // 新增：开门动画序列
    startDoorOpeningSequence() {
        console.log('开始开门动画序列...');
        
        const scene1 = document.querySelector('.scene-1');
        scene1.classList.add('opening');

        // 2.4秒后背景变清晰
        setTimeout(() => {
            const clearScene = document.querySelector('.clear-scene');
            if (clearScene) {
                clearScene.classList.add('active');
                console.log('背景变清晰');
            }
        }, 2400);

        // 播放对话音频，并使用ended事件来控制后续序列
        console.log('开始播放分段Chat音频序列');
        this.playChatWithSequence();
    }

    // 播放分段Chat音频并控制后续序列
    playChatWithSequence() {
        console.log('🎵 开始播放分段Chat音频序列');
        
        // 检查音频文件是否都存在
        const chat01 = this.sounds['chat01'];
        const chat02 = this.sounds['chat02'];
        const chat03 = this.sounds['chat03'];
        
        if (!chat01 || !chat02 || !chat03) {
            console.error('❌ 分段Chat音频文件未找到');
            console.log('🔧 2秒后直接启动后续序列');
            setTimeout(() => {
                if (!this.postChatSequenceStarted) {
                    this.startPostChatSequence();
                }
            }, 2000);
            return;
        }

        // 播放序列：Chat01 → Chat02 → Chat03 → 后续序列
        this.playChatSequence();
    }

    // 播放Chat音频序列
    playChatSequence() {
        console.log('🎵 播放Chat序列：Chat01 → Chat02 → Chat03');
        
        // 第一段："玉佩在哪"
        this.playChat01();
    }

    // 播放第一段音频："玉佩在哪"
    playChat01() {
        const chat01 = this.sounds['chat01'];
        console.log('🎵 播放Chat01: "玉佩在哪"');
        
        // 显示字幕
        setTimeout(() => {
            this.createSubtitleBubble('"玉佩！在哪？"', 'top-right', 3000);
        }, 300);
        
        chat01.currentTime = 0;
        chat01.play().then(() => {
            console.log('🎵 Chat01开始播放');
        }).catch(e => {
            console.error('❌ Chat01播放失败:', e);
        });

        // 监听播放结束
        const onChat01Ended = () => {
            console.log('🎵 Chat01播放完毕，开始Chat02');
            chat01.removeEventListener('ended', onChat01Ended);
            setTimeout(() => this.playChat02(), 500); // 500ms间隔
        };
        
        chat01.addEventListener('ended', onChat01Ended);
    }

    // 播放第二段音频："我说了！真的不知道"
    playChat02() {
        const chat02 = this.sounds['chat02'];
        console.log('🎵 播放Chat02: "我说了！真的不知道"');
        
        // 显示字幕
        setTimeout(() => {
            this.createSubtitleBubble('"我说了！我真不知道！"', 'bottom-left', 4000);
        }, 300);
        
        chat02.currentTime = 0;
        chat02.play().then(() => {
            console.log('🎵 Chat02开始播放');
        }).catch(e => {
            console.error('❌ Chat02播放失败:', e);
        });

        // 监听播放结束，等待用户交互
        const onChat02Ended = () => {
            console.log('🎵 Chat02播放完毕，等待用户点击继续');
            chat02.removeEventListener('ended', onChat02Ended);
            
            // 等待1.5秒让字幕完整显示，然后显示点击提示
            setTimeout(() => {
                this.showContinueHint();
                this.waitingForContinueClick = true;
            }, 1500);
        };
        
        chat02.addEventListener('ended', onChat02Ended);
    }

    // 播放第三段音频："那你就去死吧！"
    playChat03() {
        const chat03 = this.sounds['chat03'];
        console.log('🎵 播放Chat03: "那你就去死吧！"');
        
        // 显示字幕
        setTimeout(() => {
            this.createSubtitleBubble('"那就去死吧"', 'top-center', 3000);
        }, 300);
        
        chat03.currentTime = 0;
        chat03.play().then(() => {
            console.log('🎵 Chat03开始播放');
        }).catch(e => {
            console.error('❌ Chat03播放失败:', e);
        });

        // 监听播放结束，开始后续序列
        const onChat03Ended = () => {
            console.log('🎵 所有Chat音频播放完毕，开始后续序列');
            chat03.removeEventListener('ended', onChat03Ended);
            this.hideChatSubtitles(); // 隐藏所有字幕
            setTimeout(() => {
                if (!this.postChatSequenceStarted) {
                    this.startPostChatSequence();
                }
            }, 1000);
        };
        
        chat03.addEventListener('ended', onChat03Ended);
    }

    // 切换到惊恐背景 - 加快转场速度
    switchToScaryBackground() {
        console.log('🖼️ 开始快速切换背景到惊恐.png');
        const scene1 = document.querySelector('.scene-1');
        const backgroundScene = scene1.querySelector('.background-scene');
        const cabinetDoors = scene1.querySelector('.cabinet-doors');
        
        if (!scene1 || !backgroundScene) {
            console.error('❌ 场景元素未找到');
            return;
        }
        
        // 🆕 添加转场效果容器 - 超快转场时间
        const transitionOverlay = document.createElement('div');
        transitionOverlay.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 25;
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
            backdrop-filter: blur(10px);
        `;
        scene1.appendChild(transitionOverlay);
        
        // 转场第一阶段：超快淡入黑色蒙版
        setTimeout(() => {
            console.log('🌫️ 转场第一阶段：超快淡入黑色蒙版');
            transitionOverlay.style.opacity = '1';
        }, 25);
        
        // 转场第二阶段：在蒙版下切换背景 - 超短等待时间
        setTimeout(() => {
            console.log('🖼️ 转场第二阶段：在蒙版下切换背景');
            
            // 🚨 关键修复：隐藏门板层，让惊恐背景全屏显示
            if (cabinetDoors) {
                cabinetDoors.style.opacity = '0';
                cabinetDoors.style.transition = 'opacity 0.5s ease-out';
                console.log('🖼️ 隐藏门板层');
            }
            
            // 隐藏现有背景
            const blurScene = backgroundScene.querySelector('.blur-scene');
            const clearScene = backgroundScene.querySelector('.clear-scene');
            if (blurScene) {
                blurScene.style.opacity = '0';
                blurScene.style.transition = 'opacity 0.3s ease-out';
                console.log('🖼️ 隐藏模糊背景');
            }
            if (clearScene) {
                clearScene.style.opacity = '0';
                clearScene.style.transition = 'opacity 0.3s ease-out';
                console.log('🖼️ 隐藏清晰背景');
            }
            
            // 首先清除所有已存在的惊恐背景，避免重复
            const existingScaryBgs = backgroundScene.querySelectorAll('.scary-background');
            existingScaryBgs.forEach(bg => {
                bg.remove();
                console.log('🖼️ 移除已存在的惊恐背景');
            });
            
                        // 创建唯一的惊恐背景视频 - 强制使用最新文件
            const scaryVideo = document.createElement('video');
            scaryVideo.src = '镜头1/2/惊恐.mp4?v=20250614'; // 缓存破坏参数
            scaryVideo.alt = '惊恐场景';
            scaryVideo.className = 'scary-background';
            scaryVideo.muted = true; // 静音播放
            scaryVideo.loop = true; // 循环播放
            scaryVideo.autoplay = true; // 自动播放
            scaryVideo.playsInline = true; // 移动端内联播放
            scaryVideo.style.cssText = `
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                opacity: 0 !important;
                z-index: 20 !important;
                transition: opacity 0.2s ease-in-out !important;
                display: block !important;
            `;
            
            scaryVideo.onloadeddata = () => {
                console.log('🎬 惊恐背景视频加载完成');
                console.log('🎬 视频尺寸:', scaryVideo.videoWidth, 'x', scaryVideo.videoHeight);
                scaryVideo.style.opacity = '1';
                scaryVideo.play().catch(e => console.warn('视频自动播放失败:', e));
                console.log('🎬 背景透明度设置为1，z-index: 20');
                
                // 转场第三阶段：超快淡出蒙版，显示新背景
                setTimeout(() => {
                    console.log('🌫️ 转场第三阶段：超快淡出蒙版，显示新背景');
                    transitionOverlay.style.opacity = '0';
                    
                    // 转场完成后移除蒙版 - 超短等待时间
                    setTimeout(() => {
                        if (transitionOverlay && transitionOverlay.parentNode) {
                            transitionOverlay.remove();
                            console.log('🌫️ 转场蒙版已移除');
                        }
                    }, 200);
                }, 75);
            };
            
            scaryVideo.onerror = (e) => {
                console.error('❌ 惊恐背景视频加载失败，详细错误:', e);
                console.error('❌ 尝试的视频路径:', scaryVideo.src);
                // 如果加载失败，也要超快移除蒙版
                setTimeout(() => {
                    transitionOverlay.style.opacity = '0';
                    setTimeout(() => transitionOverlay.remove(), 200);
                }, 150);
            };
            
            backgroundScene.appendChild(scaryVideo);
            console.log('🎬 惊恐背景视频已添加到DOM');
        }, 200); // 超快等待蒙版显示后再切换背景
    }

    // 添加人物和门图层，人在门后颤抖 - 增强自然过渡
    addPersonWithTrembleEffect() {
        const scene1 = document.querySelector('.scene-1');
        
        // 🔧 增强防重复检查：添加实例标志
        if (this.personLayersAdded) {
            console.log('🚫 人物门图层已通过实例标志检测到存在，跳过重复添加');
            return;
        }
        
        // 检查是否已经添加过人物和门图层，避免重复
        const existingPersonLayer = scene1.querySelector('.person-layer');
        const existingDoorLayer = scene1.querySelector('.door-layer');
        if (existingPersonLayer || existingDoorLayer) {
            console.log('🚫 人物或门图层已存在，跳过重复添加');
            this.personLayersAdded = true; // 设置标志
            return;
        }
        
        // 设置添加标志，防止重复调用
        this.personLayersAdded = true;
        console.log('👤 开始自然过渡到门+人场景');
        
        // 第一阶段：创建过渡蒙版，让背景逐渐变暗模糊
        this.createTransitionToPersonScene(() => {
            // 第二阶段：在蒙版下添加人物和门图层
            this.addPersonAndDoorLayers();
        });
    }
    
    // 创建到门+人场景的过渡效果 - 快速简洁版
    createTransitionToPersonScene(callback) {
        const scene1 = document.querySelector('.scene-1');
        
        console.log('🌫️ 创建惊恐→门+人的快速过渡');
        
        // 检查并清除已存在的过渡元素，避免重影
        const existingTransitions = scene1.querySelectorAll('.scary-to-person-transition');
        existingTransitions.forEach(transition => transition.remove());
        
        // 创建简单的黑色渐变蒙版
        const transitionMask = document.createElement('div');
        transitionMask.className = 'scary-to-person-transition';
        transitionMask.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0);
            z-index: 22;
            opacity: 0;
            transition: all 0.8s ease-in-out;
            pointer-events: none;
        `;
        
        scene1.appendChild(transitionMask);
        
        // 快速渐暗
        setTimeout(() => {
            transitionMask.style.background = 'rgba(0, 0, 0, 0.7)';
            transitionMask.style.opacity = '1';
            console.log('🌫️ 快速渐暗开始');
        }, 50);
        
        // 0.5秒后执行回调，添加门+人
        setTimeout(() => {
            if (callback) callback();
            console.log('🌫️ 开始添加门+人图层');
        }, 500);
        
        // 1秒后移除过渡蒙版
        setTimeout(() => {
            transitionMask.style.opacity = '0';
            setTimeout(() => {
                if (transitionMask.parentNode) {
                    transitionMask.remove();
                }
                console.log('🌫️ 快速过渡完成');
            }, 800);
        }, 1000);
    }
    
    // 添加人物和门图层 - 防重影优化版
    addPersonAndDoorLayers() {
        const scene1 = document.querySelector('.scene-1');
        
        console.log('👤 添加人物图层和门图层（防重影版）');
        
        // 🔧 防重影：先清除可能存在的旧图层 - 使用最严格的清除机制
        const existingPersonLayers = scene1.querySelectorAll('.person-layer, .trembling-person');
        const existingDoorLayers = scene1.querySelectorAll('.door-layer, .door-foreground');
        const existingTransitions = scene1.querySelectorAll('.scary-to-person-transition');
        const existingCleanBgs = scene1.querySelectorAll('.clean-person-background');
        const existingScaryVideos = scene1.querySelectorAll('.scary-background-video, video');
        
        existingPersonLayers.forEach(layer => {
            console.log('🗑️ 移除旧的人物图层:', layer.className);
            layer.remove();
        });
        existingDoorLayers.forEach(layer => {
            console.log('🗑️ 移除旧的门图层:', layer.className);
            layer.remove();
        });
        existingTransitions.forEach(transition => {
            console.log('🗑️ 移除旧的过渡效果:', transition.className);
            transition.remove();
        });
        existingCleanBgs.forEach(bg => {
            console.log('🗑️ 移除旧的纯色背景:', bg.className);
            bg.remove();
        });
        existingScaryVideos.forEach(video => {
            console.log('🗑️ 停止并移除惊恐视频:', video.className || 'video');
            video.pause();
            video.remove();
        });
        
        // 🔧 等待一帧确保DOM完全清除
        requestAnimationFrame(() => {
            this.createPersonAndDoorElements();
        });
    }
    
    // 创建人物和门元素 - 分离出来避免重影
    createPersonAndDoorElements() {
        const scene1 = document.querySelector('.scene-1');
        console.log('👤 开始创建全新的人物和门元素');
        
        // 🔧 关键修复：停止和隐藏惊恐视频，避免重叠
        const scaryVideo = scene1.querySelector('.scary-background-video');
        if (scaryVideo) {
            console.log('🎬 停止并隐藏惊恐视频，避免与门+人重叠');
            scaryVideo.pause();
            scaryVideo.style.opacity = '0';
            scaryVideo.style.zIndex = '-1';
            scaryVideo.style.display = 'none';
            // 移除视频元素
            setTimeout(() => {
                if (scaryVideo.parentNode) {
                    scaryVideo.remove();
                    console.log('🗑️ 惊恐视频已完全移除');
                }
            }, 500);
        }
        
        // 🔧 同时隐藏所有可能的背景图层
        const allBackgrounds = scene1.querySelectorAll('.blur-scene, .clear-scene, .scary-background');
        allBackgrounds.forEach(bg => {
            bg.style.opacity = '0';
            bg.style.zIndex = '-1';
            console.log('🗑️ 隐藏背景图层:', bg.className);
        });
        
        // 🔧 添加纯色背景，确保干净显示
        const cleanBackground = document.createElement('div');
        cleanBackground.className = 'clean-person-background';
        cleanBackground.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%);
            z-index: 40;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
            pointer-events: none;
        `;
        scene1.appendChild(cleanBackground);
        
        // 添加人物图层（在门后，z-index较低）
        const personLayer = document.createElement('div');
        personLayer.className = 'person-layer';
        personLayer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 45;
            opacity: 0;
            transition: opacity 0.6s ease-in-out;
            pointer-events: none;
        `;
        
        const personImg = document.createElement('img');
        personImg.src = '镜头1/3/人.png?v=20250614';
        personImg.alt = '躲在门后颤抖的人物';
        personImg.className = 'trembling-person';
        personImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            animation: trembleEffect 1.8s infinite;
            filter: contrast(1.1) brightness(0.9);
        `;
        
        personImg.onload = () => {
            console.log('👤 人物图片加载完成，快速淡入');
            // 先显示纯色背景
            setTimeout(() => {
                cleanBackground.style.opacity = '1';
                console.log('🎨 纯色背景已显示');
            }, 50);
            // 再显示人物
            setTimeout(() => {
                personLayer.style.opacity = '0.8';
            }, 200);
        };
        
        personImg.onerror = () => {
            console.error('❌ 人物图片加载失败');
        };
        
        personLayer.appendChild(personImg);
        scene1.appendChild(personLayer);
        
        // 添加门图层（在人物上方，z-index较高）
        const doorLayer = document.createElement('div');
        doorLayer.className = 'door-layer';
        doorLayer.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            z-index: 50;
            opacity: 0;
            transition: opacity 0.8s ease-in-out;
            pointer-events: none;
        `;
        
        const doorImg = document.createElement('img');
        doorImg.src = '镜头1/3/门.png?v=20250614';
        doorImg.alt = '门';
        doorImg.className = 'door-foreground';
        doorImg.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(1.05) brightness(0.95);
        `;
        
        doorImg.onload = () => {
            console.log('🚪 门图片加载完成，快速淡入');
            setTimeout(() => {
                doorLayer.style.opacity = '0.9';
            }, 300);
        };
        
        doorImg.onerror = () => {
            console.error('❌ 门图片加载失败');
        };
        
        doorLayer.appendChild(doorImg);
        scene1.appendChild(doorLayer);
        
        console.log('👤 人物和门图层添加完成，快速淡入中');
    }

    // 新增：显示下一场景提示 - 圆形波动按钮
    showNextSceneHint() {
        console.log('🎯 显示圆形波动按钮："点击屏幕继续"');
        
        // 创建圆形波动按钮
        const continueButton = document.createElement('div');
        continueButton.className = 'continue-ripple-button';
        continueButton.id = 'final-continue-button';
        
        // 创建按钮文字
        const buttonText = document.createElement('div');
        buttonText.className = 'continue-button-text';
        buttonText.textContent = '点击继续';
        
        continueButton.appendChild(buttonText);
        document.body.appendChild(continueButton);
        
        // 淡入显示
        setTimeout(() => {
            continueButton.style.opacity = '1';
            console.log('🎯 圆形波动按钮已显示');
        }, 100);
        
        // 添加点击事件
        continueButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('🖱️ 圆形按钮被点击，准备切换到镜头2');
            continueButton.style.opacity = '0';
            setTimeout(() => {
                continueButton.remove();
                this.notifyScene1Complete();
            }, 300);
        });
        
        // 重新绑定点击事件到下一场景
        this.currentScene = 1.5; // 标记为可以切换到场景2的状态
    }
    
    // 通知镜头1完成
    notifyScene1Complete() {
        // 防止重复发送信号
        if (this.scene1CompletedSignalSent) {
            console.log('📡 镜头1完成信号已发送过，跳过重复发送');
            return;
        }
        
        console.log('📡 镜头1完成，发送信号给故事管理器');
        this.scene1CompletedSignalSent = true;
        
        // 如果在iframe中，发送消息给父窗口
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'scene1-complete',
                timestamp: Date.now()
            }, '*');
            console.log('📡 已发送镜头1完成信号');
        } else {
            // 如果不在iframe中，直接切换场景
            this.transitionToScene2();
        }
    }

    // 开始场景1
    startScene1() {
        console.log('开始场景1：衣柜视角');
        
        // 显示初始状态：模糊背景立即显示
        const blurScene = document.querySelector('.blur-scene');
        if (blurScene) {
            blurScene.style.animation = 'fadeInBlur 3s ease-in-out forwards';
        }
        
        // 直接显示音频解锁界面
        this.showAudioUnlockScreen();
    }

    // 强制尝试自动播放音频
    forceAutoPlayAudio() {
        console.log('🎵 强制尝试自动播放背景音效...');
        
        // 立即尝试播放，使用更积极的策略
        const heartbeat = this.sounds['heartbeat'];
        const rain = this.sounds['rain'];
        
        if (heartbeat && rain) {
            // 设置静音状态先播放，再淡入
            heartbeat.volume = 0;
            rain.volume = 0;
            heartbeat.loop = true;
            rain.loop = true;
            
            // 立即尝试播放
            Promise.all([
                heartbeat.play().catch(e => {
                    console.warn('心跳音频自动播放失败:', e);
                    return false;
                }),
                rain.play().catch(e => {
                    console.warn('雨声音频自动播放失败:', e);
                    return false;
                })
            ]).then(results => {
                const heartbeatSuccess = results[0] !== false;
                const rainSuccess = results[1] !== false;
                
                if (heartbeatSuccess || rainSuccess) {
                    console.log('✅ 自动播放成功，开始音量淡入');
                    if (heartbeatSuccess) this.fadeInHeartbeat();
                    if (rainSuccess) this.fadeInRain();
                } else {
                    console.log('❌ 自动播放被阻止，等待用户首次交互');
                    this.waitingForUserInteraction = true;
                    this.showAudioUnlockHint();
                }
            });
        }
    }

    // 显示音频解锁屏幕
    showAudioUnlockScreen() {
        console.log('🎵 显示音频解锁屏幕');
        
        // 创建音频解锁覆盖层
        const unlockScreen = document.createElement('div');
        unlockScreen.id = 'audio-unlock-screen';
        unlockScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: 'Microsoft YaHei', sans-serif;
            cursor: pointer;
        `;
        
        unlockScreen.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h2 style="font-size: 28px; margin-bottom: 20px; color: #ffcc00;">
                    🎵 沉浸式音效体验
                </h2>
                <p style="font-size: 18px; margin-bottom: 30px; opacity: 0.9;">
                    本体验包含背景音乐和音效<br>
                    请点击此处启用音频并开始
                </p>
                <div style="padding: 15px 30px; border: 2px solid #ffcc00; border-radius: 25px; font-size: 16px; animation: pulse 2s infinite;">
                    点击启动音频体验
                </div>
            </div>
        `;
        
        // 点击解锁音频
        unlockScreen.addEventListener('click', () => {
            console.log('🎵 用户点击解锁音频');
            this.unlockAudioAndStart();
            document.body.removeChild(unlockScreen);
        });
        
        document.body.appendChild(unlockScreen);
    }

    // 解锁音频并开始体验
    unlockAudioAndStart() {
        console.log('🎵 解锁音频并开始体验');
        
        // 立即启动背景音效
        this.forceStartAudio();
        
        // 初始不显示任何提示，用户可以直接点击屏幕
        console.log('🎵 音频解锁完成，用户可以直接点击屏幕开始体验');
        
        // 标记音频已解锁
        this.audioUnlocked = true;
        
        // 通知故事管理器音频已解锁
        if (window.parent !== window) {
            window.parent.postMessage({
                type: 'audio-unlocked-from-scene1',
                timestamp: Date.now()
            }, '*');
            console.log('📡 已通知故事管理器音频解锁');
        }
    }

    // 心跳音量淡入
    fadeInHeartbeat() {
        const heartbeat = this.sounds['heartbeat'];
        if (heartbeat) {
            let volume = 0;
            const fadeIn = setInterval(() => {
                volume += 0.02;
                heartbeat.volume = Math.min(volume, 0.6);
                if (volume >= 0.6) {
                    clearInterval(fadeIn);
                    console.log('✅ 心跳音效淡入完成');
                }
            }, 50);
        }
    }

    // 雨声音量淡入
    fadeInRain() {
        const rain = this.sounds['rain'];
        if (rain) {
            let volume = 0;
            const fadeIn = setInterval(() => {
                volume += 0.015;
                rain.volume = Math.min(volume, 0.4);
                if (volume >= 0.4) {
                    clearInterval(fadeIn);
                    console.log('✅ 雨声音效淡入完成');
                }
            }, 50);
        }
    }

    // 强制启动音频（用户交互后）
    forceStartAudio() {
        const heartbeat = this.sounds['heartbeat'];
        const rain = this.sounds['rain'];
        
        if (heartbeat) {
            heartbeat.volume = 0;
            heartbeat.loop = true;
            heartbeat.play().then(() => {
                console.log('✅ 心跳音频启动成功');
                this.fadeInHeartbeat();
            }).catch(e => console.warn('心跳音频启动失败:', e));
        }
        
        if (rain) {
            rain.volume = 0;
            rain.loop = true;
            rain.play().then(() => {
                console.log('✅ 雨声音频启动成功');
                this.fadeInRain();
            }).catch(e => console.warn('雨声音频启动失败:', e));
        }
    }

    // 心跳音效淡入
    playHeartbeatWithFadeIn() {
        const heartbeat = this.sounds['heartbeat'];
        if (heartbeat) {
            heartbeat.volume = 0;
            heartbeat.loop = true;
            heartbeat.play().catch(e => console.warn('心跳音频播放失败:', e));
            
            // 3秒内音量从0增到0.6
            let volume = 0;
            const fadeIn = setInterval(() => {
                volume += 0.02;
                heartbeat.volume = Math.min(volume, 0.6);
                if (volume >= 0.6) {
                    clearInterval(fadeIn);
                }
            }, 50);
        }
    }

    // 雨声音效淡入
    playRainWithFadeIn() {
        const rain = this.sounds['rain'];
        if (rain) {
            rain.volume = 0;
            rain.loop = true;
            rain.play().catch(e => console.warn('雨声音频播放失败:', e));
            
            // 3秒内音量从0增到0.4
            let volume = 0;
            const fadeIn = setInterval(() => {
                volume += 0.015;
                rain.volume = Math.min(volume, 0.4);
                if (volume >= 0.4) {
                    clearInterval(fadeIn);
                }
            }, 50);
        }
    }

    // 切换到场景2 - 超快转场速度
    transitionToScene2() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        console.log('超快切换到场景2');

        // 超快淡出当前场景
        const scene1 = document.querySelector('.scene-1');
        const scene2 = document.querySelector('.scene-2');
        
        scene1.classList.remove('active');
        
        setTimeout(() => {
            scene2.classList.add('active');
            this.currentScene = 2;
            this.isTransitioning = false;
            
            // 停止场景1的音效
            this.stopSound('heartbeat');
            this.stopSound('rain');
        }, 250); // 从500ms减少到250ms
    }

    // 预加载音效文件
    preloadSounds() {
        const soundFiles = {
            heartbeat: 'sounds/heartbeat.mp3',
            rain: 'sounds/Rain.MP3',  // 🔧 替换为新的雨声音频，避免包含刀砍声
            'knife-sound': 'sounds/knife.mp3',
            'chat01': 'sounds/Chat01.mp3',  // "玉佩在哪"
            'chat02': 'sounds/Chat02.mp3',  // "我说了！真的不知道"
            'chat03': 'sounds/Chat03.mp3'   // "那你就去死吧！"
        };

        Object.keys(soundFiles).forEach(key => {
            const audio = new Audio();
            audio.preload = 'auto';
            audio.src = soundFiles[key];
            
            // 处理音频加载错误
            audio.onerror = () => {
                console.warn(`音频文件加载失败: ${soundFiles[key]}`);
            };
            
            this.sounds[key] = audio;
        });
    }

    // 播放音效 - 强化knife防重复机制
    playSound(soundName) {
        console.log(`尝试播放音效: ${soundName}`);
        const sound = this.sounds[soundName];
        if (sound) {
            // 对于knife音效，强化防重复机制
            if (soundName === 'knife-sound') {
                if (this.knifeAlreadyPlayed) {
                    console.log('🔪 knife音效已播放过，强制跳过重复播放');
                    return;
                }
                // 检查音频是否正在播放
                if (!sound.paused && sound.currentTime > 0) {
                    console.log('🔪 knife音效正在播放中，跳过重复播放');
                    return;
                }
                this.knifeAlreadyPlayed = true;
                console.log('🔪 标记knife音效为已播放');
            }
            
            sound.currentTime = 0;
            sound.play().then(() => {
                console.log(`${soundName} 音频播放成功`);
            }).catch(e => {
                console.error(`音频播放失败: ${soundName}`, e);
            });
        } else {
            console.error(`音频对象不存在: ${soundName}`);
        }
    }

    // 停止音效
    stopSound(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.pause();
            sound.currentTime = 0;
            
            // 如果停止的是knife音效，保持已播放标志不变
            if (soundName === 'knife-sound') {
                console.log('🔪 knife音效已停止，保持已播放标志');
            }
        }
    }

    // 触发震动效果（移动设备）
    triggerVibration() {
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 400]);
        }
    }

    // 添加屏幕震动效果
    addShakeEffect() {
        const container = document.querySelector('.story-container');
        container.classList.add('shake');
        
        setTimeout(() => {
            container.classList.remove('shake');
        }, 300);
    }

    // 隐藏加载屏
    hideLoading() {
        const loading = document.querySelector('.loading');
        if (loading) {
            loading.classList.add('hidden');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }
    }

    // 添加血迹效果 - 防重复版本
    addBloodEffect() {
        // 检查是否已经执行过血迹效果
        if (this.bloodEffectExecuted) {
            console.log('🩸 血迹效果已执行过，跳过重复播放');
            return;
        }
        
        console.log('🩸 血迹效果现在通过人.png组合显示');
        this.bloodEffectExecuted = true;
        
        // 血迹效果现在主要通过后续的人.png图层来实现
        // 这里可以添加一些血迹特效，但主要视觉效果由人.png承担
        
        console.log('🩸 血迹效果标记完成，等待人物图层显示');
    }

    // 瞳孔震颤效果已移除
    addPupilShake() {
        console.log('👁️ 瞳孔震颤效果已移除，跳过此步骤');
        // 不再创建瞳孔震颤效果，避免与惊恐背景重复
        const pupilShake = document.querySelector('.pupil-shake');
        if (pupilShake) {
            // 清除任何现有的瞳孔图片
            pupilShake.innerHTML = '';
            pupilShake.style.display = 'none';
            console.log('👁️ 瞳孔容器已隐藏');
        }
    }

    // 添加白光闪烁效果 - 防重复版本
    addWhiteFlash() {
        // 检查是否已经执行过白光效果
        if (this.whiteFlashExecuted) {
            console.log('⚡ 白光效果已执行过，跳过重复播放');
            return;
        }
        
        console.log('⚡ 执行刀光白闪效果（防重复版本）');
        this.whiteFlashExecuted = true;
        
        // 先移除任何现有的白光元素
        const existingFlash = document.querySelectorAll('.white-flash, #knife-flash');
        existingFlash.forEach(el => el.remove());
        console.log('⚡ 清除现有白光元素');
        
        // 创建新的白光元素
        const whiteFlash = document.createElement('div');
        whiteFlash.className = 'white-flash';
        whiteFlash.id = 'knife-flash'; // 添加唯一ID
        whiteFlash.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: white !important;
            z-index: 99999999 !important;
            opacity: 0 !important;
            pointer-events: none !important;
            display: block !important;
            visibility: visible !important;
            transform: translateZ(0) !important;
        `;
        
        console.log('⚡ 创建刀光元素，初始透明');
        document.body.appendChild(whiteFlash);
        
        // 强制重绘
        whiteFlash.offsetHeight;
        
        // 立即闪现 - 配合1s knife音频
        setTimeout(() => {
            console.log('⚡ 刀光瞬间闪现');
            whiteFlash.style.opacity = '1';
            
            // 0.2秒后开始淡出，持续时间更短
            setTimeout(() => {
                console.log('⚡ 刀光开始快速淡出');
                whiteFlash.style.transition = 'opacity 0.4s ease-out';
                whiteFlash.style.opacity = '0';
                
                // 动画完成后移除元素
                setTimeout(() => {
                    if (whiteFlash && whiteFlash.parentNode) {
                        whiteFlash.remove();
                        console.log('⚡ 刀光效果完成');
                    }
                }, 400);
            }, 200);
        }, 50);
    }

    // 调试方法
    debug() {
        console.log('🔧 调试信息:');
        console.log('  当前场景:', this.currentScene);
        console.log('  是否在转换中:', this.isTransitioning);
        console.log('  音频已解锁:', this.audioUnlocked);
        console.log('  等待继续点击:', this.waitingForContinueClick);
        console.log('  knife已播放:', this.knifeAlreadyPlayed);
        console.log('  后续序列已启动:', this.postChatSequenceStarted);
        console.log('  白光已执行:', this.whiteFlashExecuted);
        console.log('  血迹已执行:', this.bloodEffectExecuted);
        console.log('  可用音效:', Object.keys(this.sounds));
    }

    // 测试后续序列（调试用） - 防重复版本
    testSequence() {
        console.log('🧪 测试后续序列');
        if (!this.postChatSequenceStarted) {
        this.startPostChatSequence();
        } else {
            console.log('🛑 后续序列已启动过，跳过测试');
        }
    }

    // 直接测试白光效果
    testWhiteFlash() {
        console.log('🧪 测试白光效果');
        // 清除所有现有白光元素
        const existingFlash = document.querySelectorAll('.white-flash');
        existingFlash.forEach(el => el.remove());
        
        this.addWhiteFlash();
        
        // 额外的调试信息
        setTimeout(() => {
            const flash = document.querySelector('.white-flash');
            if (flash) {
                console.log('🧪 白光元素信息:');
                console.log('  - 位置:', flash.getBoundingClientRect());
                console.log('  - 样式:', getComputedStyle(flash));
                console.log('  - z-index:', getComputedStyle(flash).zIndex);
                console.log('  - opacity:', getComputedStyle(flash).opacity);
            }
        }, 100);
    }

    // 直接测试背景切换
    testScaryBackground() {
        console.log('🧪 测试背景切换');
        this.switchToScaryBackground();
        
        // 额外的调试信息
        setTimeout(() => {
            const scaryBg = document.querySelector('.scary-background');
            if (scaryBg) {
                console.log('🧪 惊恐背景信息:');
                if (scaryBg.tagName === 'VIDEO') {
                    console.log('  - 视频是否加载:', scaryBg.readyState >= 2);
                    console.log('  - 视频尺寸:', scaryBg.videoWidth, 'x', scaryBg.videoHeight);
                    console.log('  - 是否在播放:', !scaryBg.paused);
                } else {
                console.log('  - 是否加载:', scaryBg.complete);
                console.log('  - 自然尺寸:', scaryBg.naturalWidth, 'x', scaryBg.naturalHeight);
                }
                console.log('  - 当前透明度:', getComputedStyle(scaryBg).opacity);
                console.log('  - z-index:', getComputedStyle(scaryBg).zIndex);
            }
        }, 500);
    }

    // 切换测试模式
    toggleQuickTestMode() {
        this.quickTestMode = !this.quickTestMode;
        console.log(`🎮 测试模式已${this.quickTestMode ? '启用' : '关闭'}`);
        console.log(`🔧 现在使用分段音频，不再需要快速测试模式`);
        return this.quickTestMode;
    }




    
    // 创建字幕气泡
    createSubtitleBubble(text, position, duration) {
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.textContent = text;
        
        // 设置位置样式
        let positionStyle = '';
        switch(position) {
            case 'top-right':
                positionStyle = 'top: 15%; right: 10%;';
                break;
            case 'bottom-left':
                positionStyle = 'bottom: 20%; left: 10%;';
                break;
            case 'top-center':
                positionStyle = 'top: 10%; left: 50%; transform: translateX(-50%);';
                break;
            default:
                positionStyle = 'top: 50%; left: 50%; transform: translate(-50%, -50%);';
        }
        
        bubble.style.cssText = `
            position: fixed;
            ${positionStyle}
            background: rgba(255, 255, 255, 0.95);
            color: #000;
            padding: 15px 20px;
            border-radius: 20px;
            border: 3px solid #333;
            font-size: 18px;
            font-weight: bold;
            z-index: 30000;
            opacity: 0;
            transform-origin: center;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            max-width: 300px;
            text-align: center;
            font-family: 'Microsoft YaHei', sans-serif;
        `;
        
        // 添加漫画风格的尾巴
        const tail = document.createElement('div');
        tail.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border: 12px solid transparent;
            border-top-color: #333;
            bottom: -24px;
            left: 50%;
            transform: translateX(-50%);
        `;
        
        const tailInner = document.createElement('div');
        tailInner.style.cssText = `
            position: absolute;
            width: 0;
            height: 0;
            border: 9px solid transparent;
            border-top-color: rgba(255, 255, 255, 0.95);
            bottom: 3px;
            left: -9px;
        `;
        
        tail.appendChild(tailInner);
        bubble.appendChild(tail);
        
        document.body.appendChild(bubble);
        
        // 动画显示
        setTimeout(() => {
            bubble.style.opacity = '1';
            bubble.style.transform += ' scale(1.05)';
        }, 100);
        
        // 弹跳效果
        setTimeout(() => {
            bubble.style.transform = bubble.style.transform.replace('scale(1.05)', 'scale(1)');
        }, 300);
        
        // 自动隐藏
        setTimeout(() => {
            bubble.style.opacity = '0';
            bubble.style.transform += ' scale(0.9)';
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.remove();
                }
            }, 300);
        }, duration);
        
        console.log(`💬 显示字幕: ${text} (位置: ${position})`);
    }
    
    // 隐藏所有字幕
    hideChatSubtitles() {
        const bubbles = document.querySelectorAll('.chat-bubble');
        bubbles.forEach(bubble => {
            bubble.style.opacity = '0';
            bubble.style.transform += ' scale(0.8)';
            setTimeout(() => {
                if (bubble.parentNode) {
                    bubble.remove();
                }
            }, 300);
        });
        console.log('💬 隐藏所有字幕');
    }

    // 显示继续点击提示 - 圆形波动按钮（Chat02后）
    showContinueHint() {
        console.log('🎯 显示圆形波动按钮："Chat02后点击继续"');
        console.log('🔍 showContinueHint调试信息:');
        console.log('  - waitingForContinueClick:', this.waitingForContinueClick);
        
        // 移除已存在的提示
        const existingHint = document.querySelector('.continue-hint');
        if (existingHint) {
            console.log('🗑️ 移除已存在的提示');
            existingHint.remove();
        }
        
        // 创建圆形波动按钮
        const continueButton = document.createElement('div');
        continueButton.className = 'continue-ripple-button';
        continueButton.id = 'continue-hint-button';
        
        // 创建按钮文字
        const buttonText = document.createElement('div');
        buttonText.className = 'continue-button-text';
        buttonText.textContent = '点击继续';
        
        continueButton.appendChild(buttonText);
        document.body.appendChild(continueButton);
        
        // 淡入显示
        setTimeout(() => {
            continueButton.style.opacity = '1';
            console.log('🎯 Chat02后圆形波动按钮已显示');
        }, 100);
        
        // 为按钮添加点击事件
        continueButton.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('🖱️ Chat02后圆形按钮被点击，继续后续剧情');
            if (this.waitingForContinueClick) {
                this.waitingForContinueClick = false;
                continueButton.style.opacity = '0';
                setTimeout(() => {
                    continueButton.remove();
                    this.continueAfterChat02();
                }, 300);
            }
        });
    }

    // 隐藏继续提示
    hideContinueHint() {
        const continueHint = document.querySelector('.continue-hint');
        const continueButton = document.querySelector('#continue-hint-button');
        
        if (continueHint) {
            continueHint.style.opacity = '0';
            setTimeout(() => {
                if (continueHint.parentNode) {
                    continueHint.remove();
                }
            }, 300);
        }
        
        if (continueButton) {
            continueButton.style.opacity = '0';
            setTimeout(() => {
                if (continueButton.parentNode) {
                    continueButton.remove();
                }
            }, 300);
        }
    }

    // Chat02后继续动画
    continueAfterChat02() {
        console.log('🎬 Chat02后继续，开始切换背景和Chat03');
        console.log('🔍 调试信息 - 当前状态:');
        console.log('  - waitingForContinueClick:', this.waitingForContinueClick);
        console.log('  - postChatSequenceStarted:', this.postChatSequenceStarted);
        console.log('  - knifeAlreadyPlayed:', this.knifeAlreadyPlayed);
        
        // 切换背景到惊恐.png
        this.switchToScaryBackground();
        
        // 等500ms开始第三段对话
        setTimeout(() => {
            this.playChat03();
        }, 500);
    }

    // 启动Chat播放后的序列 - 适配1s knife音频 + 防重复播放
    startPostChatSequence() {
        console.log('🎬 启动后续视觉序列');
        
        // 检查是否已经执行过序列，避免重复
        if (this.postChatSequenceStarted) {
            console.log('🛑 后续序列已启动过，跳过重复执行');
            return;
        }
        this.postChatSequenceStarted = true;
        
        // 等待1秒
        setTimeout(() => {
            console.log('⚡ 先触发刀光闪烁');
            this.addWhiteFlash();
            
            // 刀光开始后立即播放knife音效（1s时长）- 额外防重复检查
            setTimeout(() => {
                console.log('🔪 刀光开始，检查knife音效播放条件');
                
                // 额外的防重复检查
                if (!this.knifeAlreadyPlayed) {
                    console.log('🔪 条件满足，播放knife音效（1s）');
                this.playSound('knife-sound');
                this.triggerVibration();
                } else {
                    console.log('🔪 knife音效已播放过，跳过播放');
                }
                
                // 等待200ms再显示血迹效果，与刀光和声音配合
                setTimeout(() => {
                    console.log('🩸 显示血迹效果');
                    this.addBloodEffect();
                    
                    // 等待400ms添加颤抖的人物图层
                    setTimeout(() => {
                        console.log('👤 添加颤抖的人物图层');
                        this.addPersonWithTrembleEffect();
                        
                        // 完成所有序列
                        setTimeout(() => {
                            this.isTransitioning = false;
                            console.log('✅ 所有视觉序列完成');
                            
                            // 再等待2秒让用户消化画面，然后显示点击提示
                            setTimeout(() => {
                            this.showNextSceneHint();
                                console.log('💡 显示文字引导：点击屏幕继续');
                        }, 2000);
                        }, 1500);
                    }, 400);
                }, 200); // 刀光+声音开始后200ms显示血迹
            }, 100); // 刀光开始后100ms播放声音，几乎同时
        }, 1000);
    }

    // 重置音效播放状态 - 谨慎重置所有标志
    resetAudioFlags(forceReset = false) {
        console.log('🔄 检查播放状态标志');
        
        if (forceReset) {
            console.log('🔄 强制重置所有标志（调试模式）');
            // 注意：生产环境中不应该重置knife标志
            console.warn('⚠️ 警告：强制重置可能导致knife音效重复播放！');
        this.knifeAlreadyPlayed = false;
            this.postChatSequenceStarted = false;
            this.whiteFlashExecuted = false;
            this.bloodEffectExecuted = false;
            console.log('🔄 所有标志已强制重置');
        } else {
            console.log('🔪 knife已播放:', this.knifeAlreadyPlayed);
            console.log('🎬 后续序列已启动:', this.postChatSequenceStarted);
            console.log('⚡ 白光已执行:', this.whiteFlashExecuted);
            console.log('🩸 血迹已执行:', this.bloodEffectExecuted);
            console.log('🔄 保持所有标志状态，避免重复播放');
        }
    }
}

// 创建加载屏幕
function createLoadingScreen() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <div>
            <p>沉浸式动态绘本加载中...</p>
            <div style="margin-top: 20px; font-size: 16px; opacity: 0.7;">
                请确保音量已开启以获得最佳体验
            </div>
        </div>
    `;
    document.body.appendChild(loading);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 创建加载屏幕
    createLoadingScreen();
    
    // 初始化故事书
    window.storybook = new InteractiveStorybook();
    
    // 添加全局API
    window.StoryBookAPI = {
        testWhiteFlash: () => window.storybook.testWhiteFlash(),
        testScaryBackground: () => window.storybook.testScaryBackground(),
        // testSequence: () => window.storybook.testSequence(), // 注释掉以防重复触发
        testChat01: () => window.storybook.playChat01(),
        testChat02: () => window.storybook.playChat02(),
        testChat03: () => window.storybook.playChat03(),
        hideSubtitles: () => window.storybook.hideChatSubtitles(),
        resetAudio: () => window.storybook.resetAudioFlags(),
        debug: () => window.storybook.debug(),
        // 安全的重启方法
        restartScene: () => {
            console.log('🔄 安全重启场景');
            location.reload();
        }
    };
    
    console.log('🔧 调试API可用: window.StoryBookAPI');
    
    // 添加调试快捷键（开发用）
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
            // 允许开发者工具
        } else if (e.key === 'F1') {
            window.storybook.debug();
        }
    });
});

// 处理页面可见性变化（暂停/恢复音效） - 修复knife重复播放
document.addEventListener('visibilitychange', () => {
    if (window.storybook) {
        if (document.hidden) {
            // 页面隐藏时暂停音效
            Object.keys(window.storybook.sounds).forEach(key => {
                window.storybook.stopSound(key);
            });
        } else {
            // 页面可见时恢复音效（如果在场景1）- 排除knife音效
            if (window.storybook.currentScene === 1) {
                setTimeout(() => {
                    // 只恢复背景循环音效，不恢复单次播放的knife音效
                    window.storybook.playSound('heartbeat');
                    window.storybook.playSound('rain');
                    // 注意：不恢复knife-sound，因为它是单次播放的音效
                }, 100);
            }
        }
    }
});

// 防止右键菜单（增强沉浸感）
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 防止选择文本（增强沉浸感）
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
});

// 添加全屏功能（可选）
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(e => {
            console.warn('无法进入全屏模式:', e);
        });
    } else {
        document.exitFullscreen();
    }
}

// 双击进入全屏
document.addEventListener('dblclick', (e) => {
    toggleFullscreen();
});

// 监听来自父窗口的停止音频指令
window.addEventListener('message', (event) => {
    if (event.data.type === 'stop-all-audio') {
        console.log('🔇 镜头1收到停止音频指令');
        console.log('🔍 检查window.storybook:', window.storybook ? '存在' : '不存在');
        
        if (window.storybook) {
            console.log('🔍 window.storybook.sounds:', window.storybook.sounds ? '存在' : '不存在');
            if (window.storybook.sounds) {
                // 停止所有音频
                Object.keys(window.storybook.sounds).forEach(soundName => {
                    console.log(`🔇 停止镜头1音频: ${soundName}`);
                    window.storybook.stopSound(soundName);
                });
                console.log('🔇 镜头1所有音频已停止');
            } else {
                console.warn('⚠️ window.storybook.sounds不存在');
            }
        } else {
            console.warn('⚠️ window.storybook不存在，尝试直接停止音频元素');
            // 备用方案：直接查找并停止页面中的音频元素
            const audioElements = document.querySelectorAll('audio');
            audioElements.forEach((audio, index) => {
                console.log(`🔇 直接停止音频元素 ${index}:`, audio.src);
                audio.pause();
                audio.currentTime = 0;
            });
            console.log('🔇 镜头1备用音频停止完成');
        }
    }
});

// 导出主要功能供外部调用
window.StoryBookAPI = {
    nextScene: () => window.storybook?.transitionToScene2(),
    playSound: (name) => window.storybook?.playSound(name),
    stopSound: (name) => window.storybook?.stopSound(name),
    debug: () => window.storybook?.debug(),
    fullscreen: toggleFullscreen,
    // 测试功能
    // testSequence: () => window.storybook?.testSequence(), // 注释掉以防重复触发
    testWhiteFlash: () => window.storybook?.testWhiteFlash(),
    testScaryBackground: () => window.storybook?.testScaryBackground(),
    testChat01: () => window.storybook?.playChat01(),
    testChat02: () => window.storybook?.playChat02(),
    testChat03: () => window.storybook?.playChat03()
};