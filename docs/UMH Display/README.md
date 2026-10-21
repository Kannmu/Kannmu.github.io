# UMH Display · 浏览器版

把原来的 Python / Tk / matplotlib 桌面程序 **UMH Display** 重构为纯前端应用：84 路超声相控阵的声场模型、运动规划、固件协议与光绘渲染全部运行在浏览器里，通过 **Web Serial** 连接 UMH 控制器，通过 **three.js / WebGL2** 呈现声场与光绘。

KannmuSite 发布地址：<https://kannmu.top/UMH%20Display/dist/>

## 能做什么

**光绘显示器（阵列朝下）**

- 84 个活塞声源 + 桌面镜像 + Gor'kov 势的声场模型（与 Python 版逐点一致）
- 图形 / 文字路径：圆角、按弧长采样、曲率
- 时间最优速度规划、摩擦圆限制、jerk 平滑、抗共振鲁棒前馈
- 小球动力学 RK4 仿真、设备插值/斜坡仿真、路径重构误差检查
- LED 色轮 / 渐变 / 单色编码、gamma、空白段、驻留补偿
- 三维光绘视图、俯视规划视图、桌面上方声场热图
- 播放 / 暂停 / 停止 / 落球 / E-STOP、Spin 横向强度标定
- **解除所有限制（原始轨迹）**：旁路全部动力学规划，直接按几何轨迹输出

**不需要硬件也能用**

默认进入 **演示模式**：内置一台 `DemoDevice`，完整支持规划、播放动画、Spin 标定和诊断面板。连接真实设备后自动切换到 Web Serial 链路。

> 本前端**不再包含**桌面回波相位校准（Calibration）。需要重新做阵列相位校准时，请使用原 Python 工具或设备端流程。

## 解除所有限制

「模式」区顶部的开关用于在两种互相独立的播放方式间切换：

| | 标准模式（默认） | 原始轨迹模式 |
| --- | --- | --- |
| 路径 | 时间最优 + jerk + 抗共振滤波 + 前馈 | 几何轨迹直接采样，陷阱位置 = 目标位置 |
| 速度 | 由 TOPP / 力模型自动决定 | 基础周期 × 速率分频，人工任意设置 |
| 仿真 | RK4 小球仿真、误差/力用提示 | 不做动力学仿真，不产生可信度警告 |
| 设备插值 | 跟随配置（Catmull-Rom / 线性） | 强制线性，完整经过每个上传点 |

**原始轨迹模式的范围**

- 基础周期（固件 `loop_ms`）：**1 ms – 60 s**
- 播放速度（固件 Q0.10 速率分频）：**0.001× – 1×**，播放中可实时调整
- 实际一圈：**1 ms – 60 000 s（约 16.7 小时）**
- 50 mm 圆在 16.7 h 下平均速度约 **0.0008 mm/s**
- 设备点：旧固件 255 点，v7.4 固件 1024 点（硬边界）
- 可在线调整速率分频，无需停止、重新上传或重新规划

设备端不需要新的消息组：原始模式仍然使用现有的 `MOTION_PATH`、`MOTION_CONFIG`、`MOTION_RATE` 通路，只是 `loop_ms` 与 `rate` 由界面直接给出。标准模式的规划、上传和播放路径保持不变，因此切换模式不会影响原来的光绘效果。

## 技术栈

- **Vite 7 + TypeScript（strict）**，无 UI 框架
- **three.js 0.179**：WebGL 场景、Line2 光绘、Shader 声场、OrbitControls
- **Web Serial API**：2 Mbaud 的 UMH v7 二进制协议
- **Web Worker**：规划与声场截面计算，主线程保持 60 fps
- **Canvas 2D**：速度/加速度曲线、平面轨迹、声压热图
- **Lucide** 图标；CSS 自定义属性设计系统；响应式抽屉布局

## 快速开始

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # 类型检查 + vite build -> ../dist
npm run preview    # 预览 dist，http://localhost:4180
npm test           # vitest：41 个黄金数据回归测试
npm run typecheck
npm run oracle     # 重新生成 tests/fixtures（需要原 Python 项目）
```

`npm run oracle` 默认从
`D:\Data\OneDrive\Projects\UMH\Software\UMH Display` 读取 Python 实现；可用环境变量覆盖：

```bash
set UMH_DISPLAY_SRC=D:\path\to\UMH Display
python tools/extract_oracle.py
```

## 目录结构

```
UMH Display/
├─ web/                       # Vite root（等价于 GenPlant/GenPlant）
│  ├─ index.html
│  ├─ styles/                 # tokens / layout / components / workspaces
│  └─ src/
│     ├─ app/                 # App shell、DeviceManager、PlanClient、工作区
│     ├─ config/              # 配置 schema、默认值、localStorage、迁移
│     ├─ core/                # DOM、数学、FFT（含 Bluestein）
│     ├─ device/              # 协议、Web Serial、仿真设备、会话
│     ├─ geometry/            # 84 阵元坐标
│     ├─ motion/              # 路径、颜色、标准规划器、原始轨迹
│     ├─ physics/             # 声场、陷阱、动力学
│     ├─ scene/               # three.js 场景
│     ├─ shapes/              # 图形库、单线字体、摆放
│     ├─ ui/                  # 控件、图表、图标、toast
│     └─ worker/              # 规划 / 声场 Worker
├─ tests/                     # vitest 回归测试
│  └─ fixtures/               # Python 生成的黄金数据
├─ tools/extract_oracle.py    # 从原 Python 实现导出黄金数据
├─ dist/                      # 构建产物：index.html + assets/
├─ vite.config.ts
├─ vitest.config.ts
├─ tsconfig.json
└─ package.json
```

## 构建与部署（与 GenPlant 对齐）

`vite.config.ts` 复刻站内 GenPlant 工具页的构建设置：

| 设置 | 值 | 原因 |
| --- | --- | --- |
| `root` | `web` | 仓库根只放工具链与文档，源码在子目录 |
| `base` | `'./'` | 页面部署在 `/UMH Display/dist/` 子路径，资源必须相对引用 |
| `build.outDir` | `'../dist'` | 产物固定落在项目根的 `dist/` |
| `build.assetsDir` | `'assets'` | Vite 哈希资源进入 `dist/assets/` |
| `build.emptyOutDir` | `true` | 每次构建不残留旧哈希文件 |
| `chunkSizeWarningLimit` | `1500` | three.js 单包体积较大 |

构建结果就是站点可直接发布的目录：

```
dist/
├─ index.html                  # 引用 ./assets/...
└─ assets/
   ├─ index-<hash>.js
   ├─ index-<hash>.css
   └─ planWorker-<hash>.js     # 规划 Worker
```

Jekyll 会把 `docs/UMH Display/dist/` 原样发布到
`https://kannmu.top/UMH%20Display/dist/`。部署时只需要同步 `dist/`，**不要**把 `web/`、`node_modules/` 或测试文件带到站点。

`docs/_config.yml` 中已为 `UMH Display/dist/index.html` 关闭 sitemap，和 GenPlant 的处理一致。

## 浏览器与硬件

- 三维视图需要 **WebGL 2**；推荐最新版 Chrome / Edge。
- 真实硬件需要 **Web Serial**（Chrome / Edge 桌面版），页面必须运行在 **HTTPS** 或 `localhost`。自动筛选 STM32 CDC `VID 0483 / PID 5740`，波特率 2 Mbaud（USB CDC 实际不受波特率影响）。
- Firefox / Safari 可以运行演示模式、规划和图表，但没有 Web Serial。
- 没有硬件时顶部显示「演示模式」；点「连接设备」打开浏览器串口选择器。

> 安全提示：真实设备的声场会托起小球。请先从小图形、低刷新率开始，熟悉 Stop / 落球 / E-STOP。浏览器端的串口与运动通路按协议移植，但本次重构没有在真实 UMH 硬件上做端到端验证；首次连接建议空载试跑命令，并保留设备本身的急停手段。

## 操作

1. 连接设备（或留在演示模式）。
2. 「起浮 / 接管」打开陷阱，把 3 mm 泡沫小球放进声场。
3. 选图形或输入英文文字，调尺寸/位置/颜色。
4. 「规划」；查看诊断里的力用、形状误差、跟踪误差和警告。
5. 「播放」；「停止」会沿路径减速后原地悬停，「落球」直接关场。
6. 首次画图前建议做 **Spin 标定**：小球在 8 mm 圆上指数加速，甩出/掉下时点「它甩出了！」，程序扣掉 0.3 s 反应时间反解 255 级横向强度。

### 原始轨迹

1. 打开「解除所有限制」。
2. 先用「基础周期」选固件循环长度，再用「播放速度」选分频；下方会显示实际一圈和平均速度。
3. 「规划」只重采样几何，不做动力学；「播放」直接按上传点线性走。
4. 播放中拖动「播放速度」会发送 `MOTION_RATE`，立即改变速率；「基础周期」在下次播放生效。
5. 关闭开关会停止当前原始轨迹，恢复标准规划并重新规划；两套参数分别保存在配置里。

## 配置

- 浏览器 `localStorage`：`umh-display.config.v3`（参数）与 `umh-display.ui.v1`（图形、视图、预览速度）。
- 「配置」区可导出 JSON、导入 JSON，或恢复默认。导入逻辑兼容原 Python 的 `~/.umh_display.json`（snake_case、`config_version` v1/v2 迁移）。
- 原始模式的 `unlimited.enabled / loopMs / rate` 也会随配置导入导出。
- 规划与界面分离：Worker 只接收纯数据，结果回到主线程后重新构造 `MotionPoint` 类，保证固件上传时 `pack()` 可用。

## 移植与验证

以下模块与 Python 实现逐行对应，并用 `tools/extract_oracle.py` 从原项目导出的黄金数据做回归：

| 模块 | 测试内容 |
| --- | --- |
| `physics/field.ts` | Bessel J1、84+84 声源压强/梯度、轴向势阱、横向力律、离轴 r0、场参数 |
| `physics/trap.ts` | 力律、阻尼、固有频率、逃逸半径、Spin fold 反解 |
| `physics/dynamics.ts` | RK4 轨迹逐帧对比 |
| `motion/path.ts` | 圆角、采样点、曲率、颜色坐标、点亮段 |
| `motion/planner.ts` | 标准 Plan（周期、点位、LED 字节、验证指标）与原始轨迹（无前馈、相等 trap/bead、超长周期） |
| `shapes/text.ts` | 文字笔画排序、圆角、可见段、颜色 |
| `device/protocol.ts` | 帧编码、上传/分块、配置、状态、速率，逐字节对比 |
| `device/emulation.ts` | 固件 Catmull/调色板/相位模型 |
| `motion/color.ts` | 色轮/渐变/单色编码与 LED 预览 |

FFT 使用自实现的 radix-2 + Bluestein（任意长度），归一化与 numpy `rfft/irfft` 一致。规划器测试的数值容差为相对 `1e-7`；标准模式的 `plan_circle_15hz`、`plan_circle_auto`、`plan_text_HI`、`plan_square_stop` 全部通过。

## 已知限制

- 浏览器端没有真实硬件闭环测试；真实设备的时序、串口粘包与固件版本差异仍需上机确认。
- 原始轨迹的硬边界来自固件：路径点数（255 / 1024）和 `loop_ms`（最大 60 s）。速率分频最小 0.001×，因此单圈不可能超过约 16.7 小时。
- 三维渲染在集成显卡/移动端会降低帧率；规划与声场计算已全部移入 Worker。
- Spin 标定依赖人工判断甩出瞬间，精度主要受反应时间限制（原实现同样如此）。
- 当前版本只做贴桌面的二维光绘。原项目的 `trap.mount = "side"` 模型仍保留在物理层，但界面不暴露侧装，也未在硬件上验证。

## 许可

本项目是个人项目 UMH Display 的前端重构，沿用原项目与其所在站点的使用约定。
