# GenPlant

🌱 一个基于Web的程序化植物生成器，使用确定性算法生成独特的三维植物模型。

[English Documentation / 英文文档](./README.md)

## ✨ 功能特性

- **确定性生成**: 相同的种子总是生成相同的植物，确保结果可重现
- **程序化建模**: 基于生物学原理的植物生长算法，模拟真实的植物形态
- **实时渲染**: 使用Three.js实现高质量的3D渲染和交互
- **纯前端**: 无需服务器，完全在浏览器中运行
- **参数化控制**: 丰富的参数系统控制植物的各个方面

## 🚀 快速开始

### 在线体验

直接打开 `GenPlant/index.html` 文件即可开始使用。

### 使用方法

1. **输入种子**: 在输入框中输入任意数字作为生成种子
2. **生成植物**: 点击 "Generate Plant" 按钮生成植物
3. **随机生成**: 点击 "Random Plant" 按钮随机生成植物
4. **相机控制**: 使用鼠标拖拽旋转视角，滚轮缩放，点击 "Reset Camera" 重置视角

## 🏗️ 技术架构

### 核心技术栈

- **Three.js**: 3D渲染引擎
- **ES6 Modules**: 模块化架构
- **WebGL**: 硬件加速渲染
- **HTML5 Canvas**: 渲染目标

### 系统架构

```
用户界面 (UI)
    ↓
主控模块 (Main Controller)
    ↓
生成核心 (Generator Core)
├── 参数生成器 (Parameters)
├── 结构引擎 (Structure Engine)
├── 几何体构建器 (Geometry Builder)
└── 材质生成器 (Material Generator)
    ↓
渲染模块 (Renderer)
    ↓
HTML5 Canvas
```

### 核心算法

- **确定性随机数生成**: 使用Mulberry32算法确保可重现性
- **分层参数系统**: 从宏观形态到细节纹理的多层参数控制
- **递归分支生成**: 模拟植物自然分支的递归算法
- **程序化材质**: 基于参数的材质和纹理生成

## 📁 项目结构

```
GenPlant/
├── index.html              # 主页面
├── style.css              # 样式文件
├── js/
│   ├── main.js            # 主控制器
│   ├── renderer.js        # 渲染模块
│   ├── config/
│   │   └── constants.js   # 配置常量
│   ├── generator/
│   │   ├── index.js       # 生成器入口
│   │   ├── parameters.js  # 参数生成
│   │   ├── structure.js   # 结构生成
│   │   ├── geometry.js    # 几何体构建
│   │   └── material.js    # 材质生成
│   └── util/
│       ├── random.js      # 随机数工具
│       ├── math.js        # 数学工具
│       └── geometry.js    # 几何工具
└── data/
    └── defaultModel/      # 默认模型资源
```

## 🎯 参数系统

### 分层参数架构

1. **全局种子**: 所有随机过程的根源
2. **原型参数**: 植物基本类型和宏观形态
3. **环境参数**: 向光性、重力、修剪因子等环境影响
4. **结构参数**: 主干、分支的几何特性
5. **材质参数**: 颜色、纹理、表面属性

### 生物学启发

- **向光性 (Phototropism)**: 模拟植物向光生长
- **向地性 (Gravitropism)**: 模拟重力对植物形态的影响
- **顶端优势**: 模拟主干相对于侧枝的生长优势
- **自然修剪**: 模拟植物内部枝条的自然淘汰

## 🔧 开发指南

### 本地开发

由于使用ES6模块，需要通过HTTP服务器运行：

```bash
# 使用Python
python -m http.server 8000

# 使用Node.js
npx serve .

# 使用Live Server (VS Code扩展)
# 右键index.html -> Open with Live Server
```

### 代码规范

- 使用ES6+语法
- 模块化设计，单一职责原则
- 详细的JSDoc注释
- 统一的错误处理机制

### 扩展开发

- **新植物类型**: 在 `parameters.js` 中添加新的原型类型
- **新生长算法**: 在 `structure.js` 中实现新的生成逻辑
- **新材质效果**: 在 `material.js` 中添加新的材质类型
- **新几何特性**: 在 `geometry.js` 中扩展几何体生成

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目！

## 🔗 相关链接

- [Three.js 官方文档](https://threejs.org/docs/)
- [WebGL 规范](https://www.khronos.org/webgl/)
- [程序化内容生成](https://en.wikipedia.org/wiki/Procedural_generation)

---

*GenPlant - 让每一个种子都绽放出独特的生命* 🌿



