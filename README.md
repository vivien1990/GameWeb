# 沉浸式动态互动绘本网站 - 独立镜头架构版

一个基于Web技术打造的动态交互式数字故事书体验，采用独立镜头文件架构设计，支持多镜头场景无缝连接和复杂交互逻辑。

## 🎯 项目特色

### 🎬 镜头1：衣柜视角开场序列
- **黑屏淡入效果** - 营造神秘氛围
- **光缝视角** - 透过衣柜缝隙观察外界  
- **动态门板** - 左右门板缓慢拉开的动画
- **画面渐变** - 从模糊到清晰的视觉转换（支持视频）
- **血迹溅射** - 突然出现的血腥特效
- **人物颤抖** - 恐惧情绪的真实表达
- **分段对话** - Chat01→Chat02→Chat03 的音频序列

### 🎬 镜头2：玉佩觉醒序列
- **黑衣人逼近** - 紫色眼睛特写
- **玉佩发热** - 温度上升的视觉效果（颜色变化）  
- **交互激活** - 连续点击玉佩来"激活"它
- **白光爆发** - 全屏震动效果和转场

### 🎮 交互功能
- **鼠标跟随** - 鼠标移动控制视角微调
- **点击推进** - 点击屏幕推进到下一个场景
- **震动反馈** - 配合音效的震动效果（移动设备）
- **音效同步** - 心跳声、雨声、刀砍声的完美配合
- **用户等待交互** - Chat02后等待用户点击继续
- **全屏模式** - 双击进入/退出全屏获得更佳体验

## 📁 独立镜头文件结构

```
NewGameWeb/
├── index-story.html        # 完整故事入口（连接所有镜头）
├── index.html             # 镜头1：衣柜视角（独立文件）
├── simple-test-scene2.html # 镜头2：玉佩觉醒（独立文件）
├── script.js              # 镜头1核心逻辑
├── styles.css             # 镜头1样式
├── README.md              # 项目说明
├── config/                # 配置模块
│   ├── global-config.js   # 全局配置
│   ├── audio-config.js    # 音频配置
│   └── scene-config.js    # 场景配置
├── styles/                # 样式模块
│   ├── global.css         # 全局基础样式
│   ├── scene1.css         # 镜头1专用样式
│   ├── scene2.css         # 镜头2专用样式
│   ├── ui-components.css  # UI组件样式
│   └── animations.css     # 动画效果样式
├── scripts/               # 脚本模块
│   ├── core/              # 核心引擎
│   │   ├── AudioManager.js      # 音频管理器
│   │   ├── SceneManager.js      # 场景管理器
│   │   └── InteractionManager.js # 交互管理器
│   ├── scenes/            # 场景模块
│   │   ├── Scene1.js      # 镜头1：衣柜视角
│   │   └── Scene2.js      # 镜头2：玉佩觉醒
│   ├── components/        # 组件模块
│   │   ├── SubtitleSystem.js # 字幕系统
│   │   ├── EffectSystem.js   # 特效系统
│   │   └── UIComponents.js   # UI组件
│   └── utils/             # 工具模块
│       ├── EventBus.js    # 事件总线
│       ├── ResourceLoader.js # 资源加载器
│       └── DebugTools.js  # 调试工具
├── 镜头1/                 # 镜头1资源
│   ├── 1/                 # 第一阶段
│   │   ├── 视线模糊.png
│   │   ├── 视线清晰.mp4   # 动态视频
│   │   ├── 柜门left.png
│   │   └── 柜门right.png
│   ├── 2/                 # 第二阶段
│   │   └── 惊恐.mp4       # 动态视频
│   └── 3/                 # 第三阶段
│       ├── 门.png
│       └── 人.png
├── 镜头2/                 # 镜头2资源
│   ├── 背景.png
│   ├── 黑衣人.png
│   ├── 受害者.png
│   ├── 玉佩.png
│   ├── 紫色眼睛.png
│   └── 白光爆发.png
└── sounds/                # 音频资源
    ├── heartbeat.mp3      # 心跳声
    ├── Rain.MP3           # 雨声（修正版）
    ├── knife.mp3          # 刀砍声
    ├── Chat01.mp3         # "玉佩在哪"
    ├── Chat02.mp3         # "我说了！真不知道"
    └── Chat03.mp3         # "那就去死吧"
```

## 🔧 独立镜头架构优势

### 独立文件系统
- **镜头隔离** - 每个镜头独立HTML文件，互不干扰
- **资源管理** - 各镜头独立管理自己的资源和逻辑
- **iframe通信** - 通过postMessage实现镜头间通信
- **故事管理器** - 统一的转场和进度控制

### 无缝连接机制
- **自动切换** - 镜头完成后自动发送信号切换
- **手动控制** - 支持手动跳转到任意镜头
- **进度追踪** - 实时显示故事进度和状态
- **转场效果** - 流畅的黑屏转场动画

### 开发优势
- **独立开发** - 每个镜头可以独立开发和测试
- **易于扩展** - 添加新镜头只需创建新文件
- **版本控制** - 每个镜头的变更互不影响

## 🚀 使用说明

### 1. 启动体验
```bash
# 启动HTTP服务器（Windows PowerShell）
python -m http.server 8000

# 访问完整故事页面
首页：http://localhost:8000/GameWeb/index.html

# 单独测试镜头
 镜头1：   http://localhost:8000/index.html
echo    镜头2：   http://localhost:8000/simple-test-scene2.html
echo    镜头3：   http://localhost:8000/scene3-time-vortex.html
echo    镜头4：   http://localhost:8000/scene4-new-awakening.html
echo    镜头5：   http://localhost:8000/scene5-new.html
```

### 2. 基本操作
- **开始体验**：点击音频解锁界面
- **推进剧情**：点击屏幕任意位置
- **视角调整**：移动鼠标微调视角
- **调试模式**：按F1键显示/隐藏调试面板
- **全屏模式**：双击屏幕进入/退出全屏

### 3. 故事控制API
```javascript
// 故事管理器API（在index-story.html中）
storyManager.goToScene(1)        // 跳转到镜头1
storyManager.goToScene(2)        // 跳转到镜头2
storyManager.nextScene()         // 下一镜头
storyManager.prevScene()         // 上一镜头
storyManager.restartStory()      // 重新开始故事

// 镜头1 API（在index.html中）
window.storybook.debug()         // 查看调试信息
window.StoryBookAPI.testWhiteFlash()  // 测试白光效果

// 镜头2 API（在simple-test-scene2.html中）
scene2.start()                   // 开始镜头2
scene2.reset()                   // 重置镜头2

// 快捷键支持
// 在完整故事页面：← → 切换镜头，R 重新开始，F 全屏
// 在单独镜头页面：各自独立的快捷键
```

## 🎬 镜头开发指南

### 添加新镜头
1. **创建独立HTML文件** - 如 `scene3.html`
2. **实现镜头逻辑** - 在HTML文件中编写JavaScript
3. **添加样式** - 在HTML文件中或创建独立CSS
4. **配置资源** - 准备图片/视频/音频资源
5. **更新故事管理器** - 在 `index-story.html` 中添加新镜头配置

### 镜头3开发示例
```html
<!-- scene3.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <title>镜头3：新的冒险</title>
    <!-- 样式和脚本 -->
</head>
<body>
    <!-- 镜头内容 -->
    <script>
        // 镜头完成后发送信号
        function notifyScene3Complete() {
            if (window.parent !== window) {
                window.parent.postMessage({
                    type: 'scene3-complete',
                    timestamp: Date.now()
                }, '*');
            }
        }
    </script>
</body>
</html>
```

### 更新故事管理器
```javascript
// 在 index-story.html 的 StoryManager 中添加
this.totalScenes = 3;
this.scenes = {
    // ... 现有镜头 ...
    3: {
        name: '镜头3：新的冒险',
        file: 'scene3.html',
        iframe: 'scene3-iframe',
        frame: 'scene3-frame'
    }
};
```

## 🔧 技术实现

### 事件驱动架构
```javascript
// 事件总线通信示例
window.EventBus.on('audio:ended', (soundKey) => {
    if (soundKey === 'chat02') {
        window.EventBus.emit('interaction:waitForContinue');
    }
});
```

### 配置化音频管理
```javascript
// 音频配置示例
sounds: {
    dialogue: {
        chat01: {
            src: 'sounds/Chat01.mp3',
            subtitle: '"玉佩！在哪？"',
            subtitlePosition: 'top-right',
            waitForContinue: false
        }
    }
}
```

### 模块化CSS
```css
/* 全局CSS变量 */
:root {
    --transition-speed: 0.25s;
    --primary-color: #ffcc00;
    --danger-color: #ff4444;
}

/* 镜头专用样式 */
.scene-2 .jade-pendant {
    transition: all var(--transition-speed);
    filter: drop-shadow(0 0 20px var(--jade-glow-color, #ff0000));
}
```

## 🛠️ 开发扩展

### 性能优化
- **iframe预加载** - 后台预加载下一镜头
- **资源管理** - 各镜头独立管理资源生命周期
- **内存隔离** - iframe天然的内存隔离机制

### 调试功能
- **故事控制台** - 右上角完整的控制面板
- **镜头通信日志** - 跟踪postMessage通信
- **进度追踪** - 实时显示故事进度和状态

### 扩展方向
- **添加更多镜头** - 按照开发指南添加新场景
- **增强转场效果** - 自定义转场动画和音效
- **存档系统** - 保存用户游戏进度
- **分支剧情** - 根据用户选择切换到不同镜头

## 🔍 故障排除

### iframe加载问题
- 检查所有镜头HTML文件是否存在
- 确认HTTP服务器正常运行
- 查看控制台是否有文件加载错误

### 音频播放问题  
- 确保用户已通过音频解锁界面
- 检查各镜头的音频文件路径
- 验证浏览器自动播放策略设置

### 镜头切换问题
- 检查postMessage通信是否正常
- 确认镜头完成信号是否发送
- 查看故事管理器的状态日志

### 跨域问题
- 确保使用HTTP服务器而非直接打开文件
- 检查iframe的src路径是否正确
- 验证postMessage的域名配置

## 📱 浏览器兼容性

- **Chrome 60+** ✅ 完全支持所有功能
- **Firefox 60+** ✅ 完全支持所有功能  
- **Safari 12+** ✅ 支持（部分视频格式限制）
- **Edge 79+** ✅ 完全支持所有功能
- **移动端** ✅ 支持触摸交互、震动和自适应

## 📄 许可证

本项目采用独立镜头架构设计，仅用于学习和开发参考，请遵守相关版权法规。

---

## 🎯 快速开始

1. **启动服务器**：`python -m http.server 8000`
2. **访问完整故事**：http://localhost:8000/index-story.html
3. **体验流程**：镜头1完成后自动切换到镜头2
4. **控制选项**：使用右上角控制面板或快捷键

每个镜头都是独立的HTML文件，可以单独开发、测试和维护，通过iframe和postMessage实现无缝连接。 
