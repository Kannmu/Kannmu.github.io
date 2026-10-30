# SPATIAL · 建造契约 (build contract)

> 本文件是全站 3D 改造的唯一事实来源。所有 agent 在写代码前必须读本文件。
> 风格、坐标系、DOM 契约、文件归属都在这里定义。**不要自行发明新的 class 或 data 属性。**

---

## 1. 目标与美术方向

把一个 Jekyll 博客改造成**一段连续的室内 3D 空间**：参观者像无人机一样穿行于一座冷色调玻璃幕墙塔楼内部，
每个站点（station）是一个"楼层"，内容以真实的 DOM 文字悬浮在玻璃板前——**文字是清晰的、可读的、可被搜索引擎抓取的**，
空间是 WebGL 渲染的。

美术关键词（每个决定都要能对上这几条）：

- **幕墙 / 玻璃 / 镜面**：冷蓝黑，反射，菲涅尔边缘，噪点极少。
- **前卫几何 / 矢量 / 硬线条**：1px 直线是主要图形语言；不要圆角、不要阴影柔光、不要拟物。
- **动态渐变缓动**：所有运动都用 `--e-out` / `--e-in-out`，camera 用阻尼，禁止线性突跳。
- **极简且有信息量**：每个元素都要承担"导航 / 定位 / 数据 / 层级"中的至少一项。**禁止纯装饰**。
- 单一点缀色：冷青 `--c-cyan`。除此之外全部是黑白灰。

字体：`SP Display`（Archivo 可变字重，拉丁文）用于标题/正文；`SP Mono`（JetBrains Mono）用于索引号、标签、数据；
中文回落到系统黑体（`--f-cjk`）。**不要引入新字体。**

---

## 2. 技术栈

- 静态站：Jekyll 4.4（已有）。新页面 `layout: space`。
- 渲染：Three.js **r186**，已本地化到 `assets/vendor/three/`（`three.module.js` + `three.core.js`），
  通过 `<script type="importmap">` 映射裸模块名 `three`。**禁止 CDN、禁止 npm、禁止新依赖。**
- 引擎：`assets/space/js/engine.js`（已写好：renderer / 平面镜反射 / 玻璃材质 / 后期链 / 相机 rig / DOM 投影器 / 输入 / 画质探测）。
- 空间数据：`assets/space/js/stations.js`（站点与相机机位，**唯一权威**）。
- 场景几何：`assets/space/js/scenes.js`（由 scene agent 写）。
- 运行时：`assets/space/js/app.js`（由 runtime agent 写）。
- 样式：`assets/space/css/space.css`（设计系统，**只允许有归属的 agent 在其标注段落追加**）、
  `assets/space/css/pages.css`（各页面版式）、`assets/space/css/prose.css`（文章正文）。

---

## 3. 世界坐标系

Y 向上，单位 = 米，相机沿 **−Z** 方向前进。站点间距 ≈ 22m。

每站：
- `pos`：相机位置；`look`：看向点；`fov`：竖直视角。
- 内容平面 = `pos + forward * 8`，垂直于该站视线方向（静止时正对相机）。

**像素↔世界**：每站的 `unitsPerPixel = 2 * D * tan(fov/2) / viewportHeightPx`（D = 8）。
因此内容面板在**静止时 1 CSS px = 1 屏幕 px**（文字绝对清晰），前后景深由面板的 `z` 偏移产生。

站点顺序（键名固定，markup / 场景 / 相机三处必须一致）：

| # | key | 楼层标签 | 内容 |
|---|-----|---------|------|
| 0 | `entry` | F01 / 入口 | Hero：标题、简介、关键数据、入口按钮 |
| 1 | `profile` | F02 / 简介 | 研究陈述、单位/导师/ORCID、关键词 |
| 2 | `research` | F03 / 研究 | 4 个研究方向（可展开） |
| 3 | `papers` | F04 / 论文 | 第一/共同一作论文 + 引用数 |
| 4 | `notes` | F05 / 笔记 | 最近文章 |
| 5 | `tools` | F06 / 工具 | 8 个浏览器工具 |
| 6 | `contact` | F07 / 联系 | 联系与链接 |

---

## 4. DOM 契约

### 4.1 页面骨架（由 `_layouts/space.html` 提供，runtime agent 写）

```html
<body class="sp-body" data-sp-mode="spatial|ambient" data-sp-page="home">
  <div class="sp-plate" aria-hidden="true"></div>
  <canvas id="sp-gl" aria-hidden="true"></canvas>
  {% include space-hud.html %}            <!-- 固定 HUD：品牌、菜单、楼层轨、状态 -->
  <a class="sp-skip" href="#sp-content">跳转到正文</a>
  <main class="sp-track" id="sp-content">{{ content }}</main>
  <div class="sp-boot"><!-- 装配动画 --></div>
</body>
```

### 4.2 站点与面板

```html
<section class="sp-station" data-sp-station="research" aria-label="Research">
  <div class="sp-layer">
    <article class="sp-panel" data-sp-slot="title"
             data-sp-pos="-360,20,0" data-sp-rot="0,-6,0" data-sp-anchor="lt">
      <div class="sp-glass" aria-hidden="true"></div>
      ...内容...
    </article>
  </div>
</section>
```

| 属性 | 含义 | 默认 |
|------|------|------|
| `data-sp-station` | 站点 key（必须来自第 3 节表格） | 必填 |
| `data-sp-slot` | 语义槽位：`title` `lede` `aside` `list` `detail` `meta` `cta` | 可选 |
| `data-sp-pos` | `x,y,z`，单位 CSS px；x 向右、y 向下、z 朝向相机。相对内容平面中心 | `0,0,0` |
| `data-sp-rot` | `rx,ry,rz` 度（绕锚点旋转） | `0,0,0` |
| `data-sp-anchor` | `lt` `ct` `rt` `lc` `cc` `rc` `lb` `cb` `rb`（面板哪个点落在 pos 上） | `lt` |
| `data-sp-order` | 载入/淡入顺序号（整数，小的先出现） | DOM 顺序 |
| `data-sp-pin` | `1` 表示该面板在过渡中不淡出（仅标题允许用） | 无 |

**规则**

1. 一个 `data-sp-station` 内的面板总数 ≤ 6；每个面板宽度 ≤ 620px（`entry` 的 hero 标题可到 900px）。
2. 面板之间不得重叠（考虑 `data-sp-rot` 后的包围盒）。
3. 文字永远放在面板里；**不要**把文字烘进 canvas。图形/图表可以是 `<canvas>` 或内联 `<svg>`。
4. 面板内必须自带 `.sp-glass` 子元素（当需要玻璃底板时），否则保持纯文字漂浮。
5. 所有面板必须有 `aria-label` 或在内部有语义标题。

### 4.3 双语

全站双语由 `<html data-lang>` 驱动，CSS 已实现：

```html
<span data-zh>中文</span><span data-en>English</span>
```

`html[data-lang='zh']` 时 `[data-en]` 隐藏，反之亦然。**同一句话必须两种语言都在 DOM 里**（利于 SEO）。

---

## 5. HUD 契约

固定层，`z-index:40`，全部是 DOM（不投影）。结构固定：

```
.sp-frame            四角硬线装饰（1px，仅角标）
.sp-topbar           .sp-brand / .sp-menu / .sp-tools(.sp-lang)
.sp-rail             左侧楼层索引：7 个 .sp-rail__btn（数字 + 1px bar + 名称）
.sp-readout          右下：当前层号 .sp-readout__lvl + .sp-meter（进度）
.sp-status           左下：坐标/状态文本（可放 FOV、帧率、坐标，纯文本）
.sp-hint             底部中央：滚动提示（首个站点可见）
.sp-cursor           custom cursor
```

`.sp-rail__btn` 必须是 `<button data-sp-jump="index">`；`.sp-lang` 是 `<button data-sp-lang="zh|en">`。

---

## 6. 样式系统

只使用 `space.css` 里已有的 class。摘要：

| 用途 | class |
|------|-------|
| 大标题 | `.sp-display` + `.sp-display__sub` |
| 区块标题 | `.sp-h2` / `.sp-h3` |
| 引导段 | `.sp-lede`（拉丁）/ `.sp-lede--cjk`（中文） |
| 正文段 | `.sp-body-copy` + `.sp-copy-zh/.sp-copy-en` |
| 小标签 | `.sp-label` / `.sp-eyebrow` |
| 数字 | `.sp-num` |
| 细分割线 | `.sp-rule` |
| 按钮 | `.sp-btn`（`<a>`/`<button>`） |
| 列表行 | `.sp-item` |
| 元信息 | `.sp-meta` |
| 标签块 | `.sp-chip` |
| 文字链接 | `.sp-link` |
| 论文行 | `.sp-pub` |
| 笔记行 | `.sp-note` |
| 工具碑 | `.sp-tool` |
| 研究塔行 | `.sp-tower` |
| 数据表 | `.sp-stats` |

新增页面级样式写到 `pages.css`，用 `[data-sp-page='xxx']` 或 `.sp-c-station` 作用域隔离。

---

## 7. 文案规则（强制）

- **客观陈述**：不出现"我 / 我的 / 本人"；英文不出现 "I / my / me / we"（引用除外）。
- 用名词化、被动、事实句：`研究方向为人机交互`、`成果发表于 Nature Communications`、`可查阅完整列表`。
- 不写营销词（"震撼""极致""颠覆"）；用可验证的事实、数字、方法。
- 中英双语都写，英文是地道英文而不是直译。

---

## 8. 文件归属（写权限）

| 文件 | 归属 |
|------|------|
| `assets/space/js/engine.js` | **lead**（只读） |
| `assets/space/js/stations.js` | **lead**（只读） |
| `assets/space/js/scenes.js` | scene agent |
| `assets/space/js/app.js` | runtime agent |
| `_layouts/space.html`、`_includes/space-head.html`、`_includes/space-hud.html` | runtime agent |
| `assets/space/css/space.css` | **lead**；其他人的新增一律进 `pages.css` / `prose.css` |
| `assets/space/css/pages.css` | web agent |
| `assets/space/css/prose.css` | reader agent |
| `docs/index.html` | home agent |
| `docs/about.html`、`archive.html`、`tools.html`、`Portfolio.html` | web agent |
| `_layouts/post.html`、`404.html`、`offline.html` | reader agent |
| `tools.html` 数据行 | web agent（读 `_data/tools.yml`，只读） |
| `.tooling/**` | **所有 agent 可写**（截图/脚本，不入库） |

**不要**修改 `_data/*`、`_config.yml`、旧 `css/*.css`、旧 `js/*.js`、子项目目录（CalcFlow / PhoLo / ...）。

---

## 9. 本地预览

- 静态服务器：`http://127.0.0.1:8099` 服务 `docs/_site`，**已在后台运行**。
- 文件保存后由后台 `jekyll build --watch` 自动重建，**2~4 秒**后刷新可见。
- **禁止**自己运行 `jekyll build`（会与 watcher 抢写 `_site`）。保存后 `Start-Sleep -Seconds 4` 再截图。
- 截图（Playwright 已装在 `.tooling/`）：

```powershell
cd D:\Data\OneDrive\KannmuSite
node .tooling\shot.js "http://127.0.0.1:8099/" ".tooling\shots\home-01.png" 1600 1000 3500 0 0
# 参数: url 输出路径 宽 高 等待ms 滚动Y 整页(0/1)
```

- 必须**看图**验证，不能只看"没有报错"。默认 1600×1000；移动端用 420×900。

---

## 10. 验收标准

1. 静止时文字清晰（1 CSS px = 1 屏幕 px），无模糊、无锯齿、无重叠。
2. 滚动丝滑：相机阻尼跟随，无抖动、无穿模、无黑帧。
3. 帧率 ≥ 50fps @1600×1000（中端 GPU）；`prefers-reduced-motion` 下停止 idle 漂移。
4. 关掉 JS 或 WebGL 不可用：页面回落到可读的纵向文档（`.sp-flat`），所有内容仍在。
5. 键盘可达：Tab 顺序合理，`1..7` 跳站，方向键上下换站，焦点可见。
6. 中英切换不闪屏、不丢内容、不换行错乱。
7. 所有链接有效；`about / archive / tools / portfolio / post` 全部使用新布局，没有残留旧样式。
8. 控制台 0 error。
