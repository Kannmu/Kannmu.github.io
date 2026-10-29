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

本项目基于 [Jekyll](https://jekyllrb.com/) 构建，使用了高度定制化的 Hux 模板。

- `docs/`: 博客的核心源代码。
  - `_posts/`: 所有的博客文章 (Markdown)。
  - `_config.yml`: 网站配置文件。
  - `img/`: 网站引用的所有静态图片资源。
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

首页、学术主页、作品集与归档页支持中英切换（导航栏 `EN / 中文`）；
文章页与工具页为单语，不显示切换按钮。

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
