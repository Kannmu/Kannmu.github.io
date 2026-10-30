# Kannmu Blog | 涵无的博客

> 这里是 @Kannmu 涵无 的个人博客 | 一个杂食者的精神角落

[![Website](https://img.shields.io/badge/Website-kannmu.top-blue?style=flat-square)](https://kannmu.top/)
[![GitHub](https://img.shields.io/github/stars/Kannmu?style=flat-square&label=GitHub)](https://github.com/Kannmu)

---

## 👨‍💻 关于我

**范林涵 (Linhan Fan)**，网络 ID 为 **涵无 (Kannmu)**。
目前在 **东南大学 (Southeast University)** 攻读设计学博士学位。

- **研究方向**: 人机交互 (HCI)、人工智能 (AI)、眼动交互、脑机接口。
- **学术成果**: 曾在 *Nature Communications*、*Advanced Engineering Informatics*、*Displays* 等期刊发表论文。
- **技能树**: 硬件开发 (Robocon 经历)、深度学习、Unity 开发、交互设计、摄影。

---

## 📚 博客内容

本博客记录了我在学术研究、项目开发和日常生活中的点滴：

- **[学术研究](https://kannmu.top/archive/?tag=Paper-Summary)**: 论文研读笔记与学术思考。
- **[技术博客](https://kannmu.top/archive/?tag=TchBlog)**: Unity Shader、Python 效率、硬件 DIY、GPU 驱动修改等技术干货。
- **[个人项目](https://kannmu.top/archive/?tag=Personal-Project)**:
  - **CalcFlow**: 基于流程图的数学计算工具。
  - **GenPlant**: 参数化植物生成系统。
  - **Magnetic Light**: 磁吸交互灯光项目。
- **[作品集](https://kannmu.top/archive/?tag=Profolios)**: 摄影作品（建筑、艺术、生物）与机械/硬件设计展示。

---

## 🛠️ 项目结构

本项目基于 [Jekyll](https://jekyllrb.com/) 构建，视觉层为自建的 WebGL 空间引擎（three.js 已本地化）。

- `docs/`: 博客的核心源代码。
  - `_posts/`: 所有的博客文章 (Markdown)。
  - `_config.yml`: 网站配置文件。
  - `_data/`: 个人信息 / 论文 / 工具数据源。
  - `assets/space/`: 3D 空间引擎、场景、运行时与设计系统。
  - `assets/vendor/three/`: three.js r186。
  - `_doc/`: 设计契约与运行时契约。
  - `CalcFlow/` & `GenPlant/`: 独立的子项目页面。
- `README.md`: 你当前看到的文档。

---

## 🚀 快速开始

如果你想在本地运行这个博客：

1. **安装环境**: 确保已安装 Ruby 和 Bundler。
2. **安装依赖**:

   ```bash
   cd docs
   bundle install
   ```

3. **启动预览**:

   ```bash
   bundle exec jekyll serve
   ```

   然后访问 `http://localhost:4000`。

> 本机若因 `wdm` gem 缺失导致 `bundle exec` 失败，可直接用全局 Jekyll 构建：
> `JEKYLL_NO_BUNDLER_REQUIRE=true jekyll build`。

---

## ✍️ 更新内容（无需改 HTML）

站点把「内容」和「呈现」分开了。日常维护只需要动 `_data/` 下的三个文件：

| 文件 | 作用 |
| :--- | :--- |
| `docs/_data/profile.yml` | 姓名、简介、研究方向、动态、教育/经历、荣誉、技能、联系方式 |
| `docs/_data/publications.yml` | 论文列表（标题、作者、期刊、卷期页、DOI、引用数、摘要） |
| `docs/_data/tools.yml` | 工具索引页的条目 |

页面结构：

- `/` — 首页（研究概览 + 第一/共同一作论文 + 最近文章）
- `/about/` — 学术主页（研究主题、完整论文列表、筛选、摘要展开、BibTeX 复制、履历）
- `/Portfolio/` — 作品集（原型、专利、摄影）
- `/archive/` — 全部文章，按年份分组 + 主题标签筛选
- `/tools/` — 工具索引（各工具本身仍是独立子应用）
- `/lab/` — 声场实验台：84 阵元超声相控阵的 x–z 截面声压场实时计算（Canvas 2D）

首页、学术主页、作品集与归档页支持中英切换（导航栏 `EN / 中文`）；
文章页与工具页为单语，不显示切换按钮。

---

## 🌐 3D 空间架构（v4）

整站是一次连续的三维穿行：访问者像无人机一样在一座冷色调玻璃幕墙建筑内部移动，
内容以真实 DOM 文字悬浮在建筑结构之前，因此**文字始终保持像素级清晰、可选中、可被搜索引擎抓取**，
而空间由 WebGL 实时渲染。没有贴图、没有外部素材、没有 CDN 依赖。

### 目录

```
docs/assets/vendor/three/          three.js r186（three.module.js + three.core.js）
docs/assets/space/js/engine.js     引擎：渲染器 / 平面镜反射 / 玻璃材质 / 后期链 / 相机 rig / DOM 投影器
docs/assets/space/js/stations.js   站点与相机机位（唯一权威的空间脚本）
docs/assets/space/js/scenes.js     建筑：幕墙、镜面地板、天花灯带、每站的 host 结构
docs/assets/space/js/app.js        运行时：装配、滚动时间线、投影、HUD、小地图、降级
docs/assets/space/css/space.css    设计系统（令牌 + 组件）
docs/assets/space/css/{home,pages,prose,lab}.css   各页面版式
docs/_includes/space-head.html     <head>：SEO、字体预载、importmap
docs/_includes/space-hud.html      固定 HUD（品牌 / 菜单 / 楼层轨 / 状态 / 小地图）
docs/_layouts/space.html           空间页面骨架
docs/_layouts/post.html            文章页（document 模式：正文为正常文档流）
docs/_doc/space-spec.md            设计契约（坐标系、DOM 契约、文案规则）
docs/_doc/runtime-spec.md          运行时契约
```

### 三档渲染模式

| 模式 | 触发条件 | 行为 |
| :-- | :-- | :-- |
| **spatial** | 有 WebGL、未开启减弱动态、宽度 ≥ 900、设备档位 ≥ 2 | 站点式投影 DOM、镜面反射、楼层轨、小地图、弧形运镜 |
| **document** | 文章页 / 404 / 离线页 | 正文按正常文档流排版，画布作为固定背景随滚动推进 |
| **ambient / flat** | 小屏、`prefers-reduced-motion`、低档位、无 WebGL | 可读的纵向文档；ambient 保留一张实时背景 |

降级是**默认状态**：HTML 从第一个字节就带着 `sp-flat`，运行时成功启动 3D 后才移除。
所以关闭 JS、屏蔽 WebGL、或脚本加载失败时，页面仍然是一篇完整可读的文档。

### 如何改一段 3D 内容

内容是你写在 HTML 里的真实文本，3D 位置由 `data-sp-*` 属性描述，运行时读取后投影：

```html
<section class="sp-station" data-sp-station="research">
  <div class="sp-layer">
    <article class="sp-panel" data-sp-slot="list"
             data-sp-pos="-640,-120,40" data-sp-rot="0,-7,0" data-sp-anchor="lt"
             data-sp-slab="glass">
      …任意 HTML…
    </article>
  </div>
</section>
```

| 属性 | 含义 |
| :-- | :-- |
| `data-sp-pos` | `x,y,z`，单位 CSS px（静止时 1 px = 1 屏幕 px），x 右、y 下、z 朝向相机 |
| `data-sp-rot` | `rx,ry,rz` 度，绕锚点旋转 |
| `data-sp-anchor` | 面板哪个角落在 `pos` 上：`lt` `ct` `rt` `lc` `cc` `rc` `lb` `cb` `rb` |
| `data-sp-slab` | `glass` / `ink`：给面板一层功能性玻璃底（含 1px 顶边高光），用于密集数据 |
| `data-sp-order` | 淡入顺序 |

相机机位在 `stations.js` 的 `STATIONS` 数组里；新增站点时在那里加一条，
`pos / look / fov / accent / exposure` 决定镜头，`arc / lookArc / bank` 决定离开该站时的那一段弧线运镜。

### 滚动与吸附

滚动本身是**连续、无极**的原生滚动（没有 CSS `scroll-snap`，不拦截滚轮），
在此之上叠了一层**磁性吸附**：停止输入约 0.24 s、且离某一站不足 0.40 屏时，
用临界阻尼弹簧（ζ≈0.92，无过冲）把页面滑到该站最完整的构图位置，全程约 0.62 s；
超出 0.40 屏则视为刻意停在中途，不做任何拉回。触屏惯性、键盘、楼层轨跳转行为不变。

- 键盘 `1`–`7`、`↑/↓`、`j/k`、`Home/End` 换站；楼层轨可点击。
- `?sp=N`（**从 1 开始**）可直接定位到某一站，便于分享与回归测试。
- `prefers-reduced-motion: reduce`、窄屏降级模式、文章页（document 模式）下不启用吸附。

### 首屏渐入

加载时画布约 0.23 s（热缓存）/ 0.49 s（冷缓存）内出现完整构图，
之后 0.7 s 内完成一次自下而上的"灯光渐亮"，浅色扫描带穿过画面；
面板错峰揭示总时长 ≤0.32 s。刻意不再使用整屏由黑变亮的长时间渐入。

### 修改后的检查方式

```bash
cd docs && JEKYLL_NO_BUNDLER_REQUIRE=true jekyll build   # Windows 上绕开 wdm
```

打开 `/`、`/about/`、`/archive/`、`/tools/`、`/Portfolio/`、`/lab/` 与任意文章页，确认：

1. 控制台 0 error；2. 滚动时相机连续、无抖动、无穿模；
3. 静止时文字清晰（1 CSS px = 1 屏幕 px）；4. 关掉 JS 仍可读。

### 如何写中英双语

在支持双语切换的页面里，同一段文字写两遍并加上 `data-zh` / `data-en`：

```html
<p>
  <span data-zh>中文版本</span>
  <span data-en>English version</span>
</p>
```

`<html data-lang>` 由 `_includes/head.html` 在首次绘制前写好（读取 `?lang=`
与 localStorage），所以切换不会闪屏；两种语言都保留在 HTML 里，便于搜索引擎收录。
让一个新页面支持切换，只需在 front matter 里加一行 `multilingual: true`。

### 论文数据自动同步

论文数据有两条自动更新通道，都不需要服务器：

1. **浏览器端实时校准**（`docs/js/academic-sync.js`）
   打开 `/about/` 时向 ORCID 公共 API 与 Crossref 查询：刷新每篇论文的引用数，
   并把 ORCID 上尚未收录的成果追加到列表顶部。结果缓存 12 小时。
2. **定时任务回写仓库**（`.github/workflows/sync-academic.yml`）
   每天定时运行 `docs/_scripts/sync_academic.py`，更新 `_data/publications.yml`
   的引用数与新增条目，并生成 `_data/metrics.yml`，随后自动提交。
   也可以在 Actions 页面手动触发，或在本地运行：

   ```bash
   cd docs && python _scripts/sync_academic.py
   ```

---

## 📬 联系我

- **Email**: <Kannmu@163.com>
- **知乎**: [sk4-project](https://www.zhihu.com/people/sk4-project)
- **LinkedIn**: [林涵-范](https://www.linkedin.com/in/%E6%9E%97%E6%B6%B5-%E8%8C%83-578a47279)
- **GitHub**: [@Kannmu](https://github.com/Kannmu)

---

## 📄 License

Apache License 2.0.
Copyright (c) 2023-present Kannmu.
Derived from [Hux Blog](https://github.com/Huxpro/huxpro.github.io).
