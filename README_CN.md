# Off-Axis Projection Demo 🎯

基于头部追踪的实时3D演示，通过摄像头创建逼真的"虚拟世界窗口"效果。使用 Three.js 和 MediaPipe FaceMesh 构建。

![Off-Axis Demo](https://img.shields.io/badge/License-MIT-blue.svg)

## ✨ 特性

- **实时头部追踪**：使用 MediaPipe FaceMesh 通过摄像头追踪头部位置
- **离轴投影**：根据头部位置动态调整3D相机视锥，创造"窗口"效果
- **深度虚拟空间**：赛博朋克风格网格环境，具有可变密度和电流效果着色器
- **GLTF 模型支持**：加载并显示自定义3D模型
- **模型动画**：自动播放 GLTF 动画（例如：奔跑的马）
- **交互式控制**：实时调整模型位置、缩放、旋转、光照和特效

## 📸 预览

![演示预览](./preview.gif)

*离轴投影效果创造了逼真的"虚拟世界窗口" - 移动头部即可在2D屏幕上体验真实的3D深度！*

## 🎬 演示

在线演示：[您的演示 URL]

本地运行：

```bash
# 克隆仓库
git clone https://github.com/MindDock/off-axis-demo.git
cd off-axis-demo

# 启动本地服务器（Python 3）
python3 server.py

# 在浏览器中打开 http://localhost:8000
```

## 🎮 控制面板

演示运行后，您可以使用以下控制：

- **Select Model（选择模型）**：从可用的3D模型中选择
- **Scale（缩放）**：调整模型大小
- **Rotation Y（Y轴旋转）**：围绕Y轴旋转模型
- **Position Y/Z（Y/Z位置）**：垂直和深度移动模型
- **Light Intensity（光照强度）**：调整聚光灯亮度
- **Grid Speed（网格速度）**：控制电流效果的速度
- **全屏按钮**：左上角，用于沉浸式观看

## 📦 添加自定义模型

1. **下载模型**：访问 [Sketchfab](https://sketchfab.com/3d-models/) 下载 GLTF 格式模型
   - 点击 "Download 3D Model" 按钮
   - 选择 **glTF** 格式（不是 glb、fbx 或其他格式）
   - 下载并解压 ZIP 文件

2. **添加到项目**：
   ```
   models/
   ├── default/           # 默认模型（已包含）
   │   └── scene.gltf
   └── your-model-name/   # 您的自定义模型
       ├── scene.gltf
       └── textures/      # 如果适用
   ```

3. **在代码中注册**：编辑 `index.html` 并将您的模型添加到 `models` 对象：
   ```javascript
   const models = {
       'Original': './models/default/scene.gltf',
       'Your Model': './models/your-model-name/scene.gltf',
       // ... 其他模型
   };
   ```

## 🛠️ 技术细节

### 使用的技术

- **Three.js**：3D 渲染引擎
- **MediaPipe FaceMesh**：实时面部特征点检测
- **dat.GUI**：交互式控制面板
- **WebGL**：硬件加速图形

### 工作原理

1. **面部追踪**：MediaPipe 检测虹膜标记点（468, 473）以估算3D空间中的头部位置
2. **离轴投影**：每帧根据头部位置使用 `makePerspective()` 重新计算相机的投影矩阵，使用非对称视锥参数
3. **深度感知**：可变网格密度和基于着色器的雾效果创造深空间感
4. **平滑追踪**：指数平滑（LERP）减少头部追踪的抖动

### 配置

`index.html` 中的关键参数：

```javascript
const SCREEN_WIDTH_CM = 30.0;   // 虚拟屏幕宽度
const SCREEN_HEIGHT_CM = 20.0;  // 虚拟屏幕高度
const BOX_DEPTH_CM = 80.0;      // 空间深度
const SENSITIVITY = 2.5;        // 头部追踪灵敏度
```

## 🎨 自定义

### 环境

可以通过修改 `createEnvironment()` 函数自定义赛博朋克网格环境：
- 网格密度：调整 `stepX` 和 `numZLines`
- 颜色：更改 `gridUniforms.color`（默认：`0x00ffff` 青色）
- 深度效果：修改片段着色器的 `distFade` 计算

### 光照

三个可配置的光源：
- **主聚光灯**：正面主光
- **环境光**：全局照明
- **轮廓光**：来自下方的青色点光

## 📝 浏览器兼容性

- ✅ Chrome/Edge（推荐）
- ✅ Safari
- ⚠️ Firefox（可能存在 MediaPipe 兼容性问题）

**要求**：
- WebGL 2.0 支持
- 摄像头访问权限
- 现代浏览器（最新2个版本）

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [license.txt](license.txt) 文件

## 🙏 致谢

- **MediaPipe**：Google 的面部追踪 ML 框架
- **Three.js**：3D 图形库
- **默认3D模型**：[如适用，请注明来源]

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 这个仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📧 联系方式

项目链接：[https://github.com/MindDock/off-axis-demo](off-axis-demo)

---

**提示**：该演示在距离屏幕 40-80cm 时效果最佳。移动头部以体验3D效果！
