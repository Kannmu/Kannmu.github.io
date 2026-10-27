# UMH Display · 浏览器版

把原来的 Python / Tk / matplotlib 桌面程序 **UMH Display** 重构为纯前端应用：84 路超声相控阵的声场模型、运动规划、固件协议与光绘渲染全部运行在浏览器里，通过 **Web Serial** 连接 UMH 控制器，通过 **three.js / WebGL2** 呈现声场与光绘。

固件侧已同步到 **UMH Controller v7.5.x**：六种 `trap_mode` 图案、`output_rate_hz` 上限 4000 Hz、ULM 触觉调制（76 字节 CONFIG 扩展）、以及设备端**全息关键帧引擎**（`HOLOGRAM_*` 0xA0..0xA5，capability bit11）。

KannmuSite 发布地址：<https://kannmu.top/UMH%20Display/dist/>

## 能做什么

**光绘显示器（阵列朝下）**

- 84 个活塞声源 + 桌面镜像 + Gor'kov 势的声场模型（与 Python 版逐点一致）
- **六种固件阵列图案**：单焦点 / 轴向双焦 / 横向双焦 / 环形 / 涡旋 / 双环，带图案半径与涡旋相位跨度
- **全息变形**：把图形上传成 84 路相位关键帧，设备端按自己的帧时钟插值，USB 抖动不跳变
- **ULM 触觉调制**：1–1000 Hz 横向振荡，X / Y / 环形轴向与单向锯齿波形
- 图形 / 文字路径：圆角、按弧长采样、曲率
- 时间最优速度规划、摩擦圆限制、jerk 平滑、抗共振鲁棒前馈
- 小球动力学 RK4 仿真、设备插值/斜坡仿真、路径重构误差检查
- LED 色轮 / 渐变 / 单色编码、gamma、空白段、驻留补偿
- 三维光绘视图、俯视规划视图、桌面上方声场热图
- 播放 / 暂停 / 停止 / 落球 / E-STOP、Spin 横向强度标定
- **解除所有限制（实时 XY）**：自动起浮，WASD / 手柄左摇杆直接控制声场中心

**不需要硬件也能用**

默认进入 **演示模式**：内置一台 `DemoDevice`，完整支持规划、播放动画、Spin 标定、诊断面板、全息形变与 ULM 参数。连接真实设备后自动切换到 Web Serial 链路。

> 本前端**不再包含**桌面回波相位校准（Calibration）。需要重新做阵列相位校准时，请使用原 Python 工具或设备端流程。

## 固件能力同步（v7.5.x）

| 能力 | 固件 | 本页 |
| --- | --- | --- |
| `trap_mode` 0..5 | `motion_rebuild_pattern()`，6 及以上返回 -4 | 六选一图案 + 半径 / 跨度，实时重发 CONFIG |
| `output_rate_hz` | 50..4000 Hz | 规划与 UI 上限 4000 |
| ULM 扩展（CONFIG 69..75，flag bit7） | 频率 ≤1000 Hz、波速 ≤10000 mm/s、锯齿 bit7 | 频率 / 振幅 / 波速 / 轴向 / 锯齿面板 |
| 全息关键帧（0xA0..0xA5，cap bit11） | 10 帧 × (84B 相位 + 84B 幅度)，10..1000 Hz，形变 ≤60 s | 关键帧列表、上传/开始/停止、实时状态与场图预览 |
| 长路径 1024 点（cap bit13） | CHUNKED 上传 | 已支持（分片上传） |
| 显示扩展（cap bit12） | SMOOTH_PALETTE / POINT_BRIGHTNESS / 速率斜坡 | 已支持（`MOTION_RATE`、`KEEP_PHASE`） |
| 扳机 / 录音 / USB 音频 | `GET_STATUS` bit10..12 | 诊断面板实时显示 |

全息帧的相位由本页按**理论阵元几何**（时间反演多焦点叠加）合成，不含 EEPROM 里的逐路校准修正；相位场形状正确，但焦斑与效率会略逊于设备用校准参数现场合成的场。要做定量实验时请以设备实测为准。

## 解除所有限制（实时 XY）

「模式」区顶部的开关用于在标准规划与实时输出间切换。开启后会**自动起浮**并直接进入实时输出：不生成路径、不需要规划、没有播放按钮。

| | 标准模式（默认） | 解除限制（实时） |
| --- | --- | --- |
| 输出 | 规划后的路径 + 前馈/滤波 | 当前中心 X/Y 直接作为 LIVE 目标 |
| 速度 | 由 TOPP / 力模型自动决定 | 手柄左摇杆 / WASD，速度与加速度可调 |
| 播放 | Plan → Play | 无路径、无播放；改坐标即刻下发 |
| 关闭 | — | 恢复标准规划并重新规划 |

- 中心 X/Y：滑块每改一次立即下发 `MOTION_TARGET`。
- 控制器：Xbox 手柄左摇杆，或 `WASD`；对角线归一化。
- 移动速度：**0.01 – 50 mm/s**；加速度：**0.1 – 500 mm/s²**，运行时实时生效。
- 采用加速度限制逼近目标速度，松开输入后自然减速停下。
- 移动范围：**±35 mm**，与中心 X/Y 滑块一致。
- 电平沿用「悬停强度」；实时模式使用设备已有的 `MODE_LIVE` / `MOTION_TARGET` 通路，不上传路径。
- 关闭开关会停止实时控制；如果声场是开关自动打开的，会同时落球，然后回到标准规划。

标准模式的规划、上传与播放逻辑保持不变，因此实时模式不会覆盖或影响原来的光绘参数。

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
npm test           # vitest：55 个回归测试（黄金数据 + 固件协议 + 全息）
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
│     ├─ motion/              # 路径、颜色、标准规划器、原始轨迹、全息合成
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
2. 在「声场与强度」里选图案（单焦点 / 轴向双焦 / 横向双焦 / 环形 / 涡旋 / 双环），按需调半径与涡旋跨度。
3. 「起浮 / 接管」打开陷阱，把 3 mm 泡沫小球放进声场。
4. 选图形或输入英文文字，调尺寸/位置/颜色。
5. 「规划」；查看诊断里的力用、形状误差、跟踪误差和警告。
6. 「播放」；「停止」会沿路径减速后原地悬停，「落球」直接关场。
7. 首次画图前建议做 **Spin 标定**：小球在 8 mm 圆上指数加速，甩出/掉下时点「它甩出了！」，程序扣掉 0.3 s 反应时间反解 255 级横向强度。

### 全息变形

1. 在「全息变形」区用下拉框逐个添加关键帧（复用当前尺寸/位置/文字）。
2. 调形变时间、帧率、幅度与循环周期；「上传并开始」会一次性上传全部 84 路相位，再让设备接管输出。
3. 「场图预览」切换到声场视图，显示设备**当前正在给出**的那一帧（按 `current_keyframe + alpha` 插值）。
4. 「停止形变」由设备端 20 ms 淡出后关闭输出；停止后小球会落下，需要重新「起浮」。

### 触觉 ULM

1. 打开「ULM 触觉调制」，设频率（100–300 Hz 手感最强）与轴向。
2. 振幅留 0 时由波速推导；先用小振幅试，再逐步加大。
3. ULM 与光绘路径同时生效；改参数会立即重发 CONFIG，不需要重启播放。

### 实时 XY

1. 打开「解除所有限制」，声场自动起浮，设备开始接收 LIVE 目标。
2. 直接拖中心 X/Y 滑块，或使用 Xbox 左摇杆 / `WASD`。
3. 「移动速度」「加速度」可随时调整；松开输入后按加速度自然停下。
4. 关闭开关会停止实时输出并恢复标准规划。

## 配置

- 浏览器 `localStorage`：`umh-display.config.v3`（参数）与 `umh-display.ui.v1`（图形、视图、预览速度）。
- 「配置」区可导出 JSON、导入 JSON，或恢复默认。导入逻辑兼容原 Python 的 `~/.umh_display.json`（snake_case、`config_version` v1/v2 迁移）。
- 实时模式的 `unlimited.enabled / speedMmS / accelMmS2`、`trap.patternRadiusMm / phaseSpan`、`ulm.*` 与 `holo.*` 都会随配置导入导出；旧配置里的 `trap.field = "vortex"` 现在映射到固件 `trap_mode 4`。
- 规划与界面分离：Worker 只接收纯数据，结果回到主线程后重新构造 `MotionPoint` 类，保证固件上传时 `pack()` 可用。

## 移植与验证

以下模块与 Python 实现逐行对应，并用 `tools/extract_oracle.py` 从原项目导出的黄金数据做回归：

| 模块 | 测试内容 |
| --- | --- |
| `physics/field.ts` | Bessel J1、84+84 声源压强/梯度、轴向势阱、横向力律、离轴 r0、场参数 |
| `physics/trap.ts` | 力律、阻尼、固有频率、逃逸半径、Spin fold 反解 |
| `physics/dynamics.ts` | RK4 轨迹逐帧对比 |
| `motion/path.ts` | 圆角、采样点、曲率、颜色坐标、点亮段 |
| `motion/planner.ts` | 标准 Plan（周期、点位、LED 字节、验证指标）与原始路径采样（无前馈、相等 trap/bead） |
| `shapes/text.ts` | 文字笔画排序、圆角、可见段、颜色 |
| `device/protocol.ts` | 帧编码、上传/分块、配置、状态、速率，逐字节对比；ULM 扩展、全息 0xA0..0xA5 与 42 字节状态 |
| `device/emulation.ts` | 固件 Catmull/调色板/相位模型 |
| `device/demo.ts` | 演示设备的全息形变生命周期（READY → RUNNING → STOPPING）与 PLAYING 状态位 |
| `motion/hologram.ts` | 时间反演多焦点相位、形状关键帧、8 bit 最短路径插值、归一化场图 |
| `motion/color.ts` | 色轮/渐变/单色编码与 LED 预览 |

FFT 使用自实现的 radix-2 + Bluestein（任意长度），归一化与 numpy `rfft/irfft` 一致。规划器测试的数值容差为相对 `1e-7`；标准模式的 `plan_circle_15hz`、`plan_circle_auto`、`plan_text_HI`、`plan_square_stop` 全部通过。

## 已知限制

- 浏览器端没有真实硬件闭环测试；真实设备的时序、串口粘包与固件版本差异仍需上机确认。
- 全息帧的相位用理论阵元几何合成，不含 EEPROM 里的逐路校准修正；焦斑形状正确，绝对声压与效率会低于设备现场合成。
- 全息形变与光绘路径互斥：`HOLOGRAM_START` 会接管输出，停止后小球落下，需要重新起浮。
- 实时 XY 的发送频率受 Web Serial 与固件 LIVE 目标处理限制；它不经过路径表，所以没有 255/1024 点限制。
- 三维渲染在集成显卡/移动端会降低帧率；规划与声场计算已全部移入 Worker，全息场图预览只在声场视图打开时按 2 Hz 刷新。
- Spin 标定依赖人工判断甩出瞬间，精度主要受反应时间限制（原实现同样如此）。
- 当前版本只做贴桌面的二维光绘。原项目的 `trap.mount = "side"` 模型仍保留在物理层，但界面不暴露侧装，也未在硬件上验证。
- 旧的"连续涡旋束"（Python 的 `trap_mode 6`）仍保留在物理层作为回归基准，但固件不接受，界面只提供 0..5。

## 许可

本项目是个人项目 UMH Display 的前端重构，沿用原项目与其所在站点的使用约定。
