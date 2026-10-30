# SPATIAL · 运行时契约 (runtime contract)

> 给 runtime agent。目标：把 `engine.js` + `stations.js` + 页面 DOM 接成一个**丝滑、无抖动、可降级**的运行时。
> 先读 `_doc/space-spec.md`（美术与 DOM 契约）。本文件只讲运行时算法。

---

## A. 交付文件（你独占）

```
_includes/space-head.html      <head> 内容
_includes/space-hud.html       固定 HUD
_layouts/space.html            页面骨架
assets/space/js/app.js         运行时（ES module，入口）
```

`docs/index.html` 等页面由其他 agent 写，**不要动**。

---

## B. `_includes/space-head.html`

必须包含（顺序即性能顺序）：

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
{% seo %}
<link rel="manifest" href="{{ '/pwa/manifest.json' | relative_url }}">
<link rel="shortcut icon" href="{{ '/img/favicon_K.ico' | relative_url }}">
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="{{ '/assets/fonts/archivo-latin-wght-normal.woff2' | relative_url }}">
<link rel="preload" as="font" type="font/woff2" crossorigin
      href="{{ '/assets/fonts/jbmono-latin-wght-normal.woff2' | relative_url }}">
<link rel="stylesheet" href="{{ '/assets/space/css/space.css' | relative_url }}">
{% if page.extra_css %}<link rel="stylesheet" href="{{ page.extra_css | relative_url }}">{% endif %}
<script>
  // 语言 / 主题在首帧前写入，避免闪烁。localStorage 键沿用 'lang'。
  (function (root) {
    root.classList.add('js');
    var lang = 'zh';
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q === 'en' || q === 'zh') { lang = q; localStorage.setItem('lang', q); }
      else if (localStorage.getItem('lang') === 'en') lang = 'en';
    } catch (e) {}
    root.setAttribute('data-lang', lang);
  })(document.documentElement);
</script>
<script type="importmap">
{ "imports": { "three": "{{ '/assets/vendor/three/three.module.js' | relative_url }}" } }
</script>
```

**不要**引入 bootstrap / hux-blog.css / site.css / jquery / Google Fonts / AdSense。
保留 `{% seo %}`、manifest、favicon。百度统计与 ahrefs 可保留（`async`），但要放在最后。

`<head>` 尾部：`<script type="module" src="{{ '/assets/space/js/app.js' | relative_url }}"></script>`。
**放在 head 里、模块自带 defer**，比放 body 尾部更早开始下载。

---

## C. `_layouts/space.html`

```html
<!DOCTYPE html>
<html lang="{{ page.lang | default: site.lang }}" data-lang="zh">
{% include space-head.html %}
<body class="sp-body" data-sp-page="{{ page.sp_page | default: page.title | slugify }}">
  <div class="sp-plate" aria-hidden="true"></div>
  <canvas id="sp-gl" aria-hidden="true"></canvas>
  {% include space-hud.html %}
  <a class="sp-skip" href="#sp-content">跳转到正文 · Skip to content</a>
  <div class="sp-boot" id="sp-boot" aria-hidden="true">
    <div class="sp-boot__inner">
      <div class="sp-boot__t"><span>STRUCTURE / ASSEMBLY</span><span>--</span></div>
      <div class="sp-boot__bar"><i></i></div>
    </div>
  </div>
  <main class="sp-track" id="sp-content">{{ content }}</main>
  <div class="sp-frame" aria-hidden="true"></div>
</body>
</html>
```

---

## D. `_includes/space-hud.html`

```html
<header class="sp-topbar">
  <a class="sp-brand" href="{{ '/' | relative_url }}">
    <span class="sp-brand__mark">K</span>
    <span class="sp-brand__txt">
      <span class="sp-brand__name">Kannmu</span>
      <span class="sp-brand__sub">Spatial Index</span>
    </span>
  </a>
  <nav class="sp-menu" aria-label="Primary">
    <a href="{{ '/' | relative_url }}" data-zh>首页 <i>00</i></a><a href="{{ '/' | relative_url }}" data-en>Home <i>00</i></a>
    ... 关于 /about/ 03 · 文章 /archive/ 04 · 工具 /tools/ 05 · 作品 /Portfolio.html 06
  </nav>
  <div class="sp-tools">
    <div class="sp-lang" role="group" aria-label="Language">
      <button data-sp-lang="zh" aria-pressed="true">中</button>
      <button data-sp-lang="en" aria-pressed="false">EN</button>
    </div>
  </div>
</header>

<nav class="sp-rail" id="sp-rail" aria-label="Sections"><!-- app.js 注入 7 个 .sp-rail__btn --></nav>

<div class="sp-readout">
  <div class="sp-readout__lvl"><b id="sp-level">01</b><span>/ 07</span></div>
  <div class="sp-meter">
    <div class="sp-meter__bar"><i></i></div>
    <div class="sp-meter__txt"><span data-zh>当前位置</span><span data-en>Position</span><span id="sp-pct">000%</span></div>
  </div>
</div>

<div class="sp-status">
  <span>XYZ <b id="sp-xyz">0.0 / 1.6 / 6.0</b></span>
  <span>FOV <b id="sp-fov">33</b></span>
  <span>FPS <b id="sp-fps">--</b></span>
</div>

<div class="sp-hint" id="sp-hint"><span data-zh>滚动穿行</span><span data-en>Scroll to travel</span><i></i></div>
```

`app.js` 负责：注入 rail 按钮、更新 level / pct / xyz / fov / fps / hint 显隐、语言切换、minimap。

---

## E. `app.js` 算法（严格按此实现）

### E1. 启动

```js
import * as THREE from 'three';
import { STATIONS, stationFrame, unitsPerPixel, CONTENT_DISTANCE } from './stations.js';
import { makeRenderer, makeMirrorFloor, makePostChain, CameraRig, DomProjector,
         SpaceInput, makeCursor, detectQuality, hasWebGL } from './engine.js';
import { buildScenes } from './scenes.js';
```

1. `const q = detectQuality()`；`mode = (hasWebGL() && !q.reduced && innerWidth >= 900 && q.tier >= 2) ? 'spatial' : 'ambient'`。
2. 若 `mode === 'ambient'`：`document.documentElement.classList.add('sp-flat', 'sp-ambient')`，
   仍然创建 renderer（低配：`q.maxDpr=1`，mirror off，post off）并从 STATIONS 里挑 2 个站点做缓慢漂移的静态背景；
   若 WebGL 完全不可用：`classList.add('sp-flat')` 并 `return`（DOM 内容本身就是可读的）。
3. **所有初始化包在 try/catch 里**，失败一律降级 `.sp-flat`，不能白屏。

### E2. 建站（spatial）

对每个 `document.querySelectorAll('[data-sp-station]')`（按 DOM 顺序）：

```js
const key = el.dataset.spStation;
const st  = STATIONS.find(s => s.key === key);          // 缺失则 console.warn 并跳过
const fr  = stationFrame(st);
const root = new THREE.Object3D();
root.position.copy(fr.origin);
root.quaternion.setFromRotationMatrix(fr.basis);        // basis = makeBasis(right, down, forward)
root.scale.setScalar(unitsPerPixel(st.fov, innerHeight));  // 之后 root 内坐标单位 = CSS px
scene.add(root);
```

每个 `.sp-panel`：

```js
const [x, y, z] = (el.dataset.spPos || '0,0,0').split(',').map(Number);
const [rx, ry, rz] = (el.dataset.spRot || '0,0,0').split(',').map(Number);
const [ax, ay] = ANCHORS[el.dataset.spAnchor || 'lt'];   // lt=[0,0] ct=[.5,0] rb=[1,1] ...
const anchor = new THREE.Object3D();
anchor.position.set(x, y, -(z || 0));                    // +z 传入 = 更靠近相机
anchor.rotation.set(rx*Math.PI/180, ry*Math.PI/180, rz*Math.PI/180);
root.add(anchor);
projector.add(el, anchor, { anchorX: ax, anchorY: ay, order: +el.dataset.spOrder || 0 });
el.style.position = 'absolute'; el.style.left = '0'; el.style.top = '0';
```

**注意**：`DomProjector.add` 的第三参现在已经支持 `anchorX/anchorY`——若引擎里还没有，按契约自行在
`engine.js` 的 `k` 矩阵里加入 `T(-anchorX*w, -anchorY*h)`（这一段允许你改，属于接口缺口）。

### E3. 相机时间线

```js
const p = window.scrollY / window.innerHeight;      // 站点单位
const i = Math.min(Math.floor(p), N - 1);
const t = Math.min(1, p - i);
const k = t * t * (3 - 2 * t);                      // smoothstep，自带起停缓动
const A = STATIONS[i], B = STATIONS[Math.min(i + 1, N - 1)];
rig.setPose({
  pos:  lerp3(A.pos,  B.pos,  k),
  look: lerp3(A.look, B.look, k),
  fov:  lerp(A.fov, B.fov, k) + speedKick,           // speedKick = clamp(|v|*1.6, 0, 3.2)
  roll: 0,
});
rig.update(dt);
```

- 相机必须经过 `CameraRig` 的阻尼（`lambda ≈ 7.5`），禁止直接赋值。
- 扭曲速度 `v = (scrollY - last)/dt / innerHeight`，做一阶低通后传给后期 `uVel`（clamp ±1）。
- `scene.fog = new THREE.FogExp2(0x05080c, 0.016)`；每站 `exposure` 做插值传给 composite。

### E4. 每帧顺序

```
1. dt = min(0.05, clock.getDelta())
2. 读 scroll → 相机时间线 → rig.update(dt)
3. camera.updateMatrixWorld(true); camera.matrixWorldInverse.copy(camera.matrixWorld).invert()
4. mirror.update(scene, camera)            // spatial 模式；反射目标半分辨率
5. post.render(scene, camera, {time, velocity, exposure, reveal, fade})
6. projector.update(innerWidth, innerHeight)   // DOM 投影，必须在相机更新之后
7. HUD 更新（每 3 帧一次足够：level / pct / xyz / fov / fps）
8. cursor.update(dt); input.update(dt)
```

- `requestAnimationFrame` 循环；`document.hidden` 时暂停。
- 帧率读数用 30 帧滑动平均。

### E5. 滚动 / 跳转

- **原生滚动**，`html { scroll-behavior: auto }`（不要用 CSS smooth）。
- 点击 `.sp-rail__btn` 或键盘 `1..7`：用 rAF 自己做 900ms `easeInOutQuart` 补间 `window.scrollTo(0, y)`，**不要** `behavior:'smooth'`（受系统设置影响、不可控）。
- 键盘：↑↓ / j k / PageUp PageDown / Home End 由 `SpaceInput` 已实现，接到同一个 `jump(i)`。
- 触摸：原生。

### E6. 淡入 / 装配

- 首帧后：`requestAnimationFrame` 两帧 + `await document.fonts.ready` → `.sp-boot` 加 `data-done="true"`。
- `reveal`：0 → 1，2200ms，`easeInOutCubic`，传给 composite 的 `uReveal`（做结构装配的横向扫光）。
- 面板错峰淡入：按 `data-sp-order` 给每个面板一个 60ms 的延迟，用 CSS `transition: opacity`（运行时只切换 class `.is-in`）。
- 站内面板可见性由 `DomProjector` 按距离算，不要重复写。

### E7. Resize

`ResizeObserver` 或 `window.resize` 去抖 120ms：
`renderer.setSize` → `post.setSize(w,h,pr)` → `mirror.resize()` →
`camera.aspect` → 重算每个 station root 的 `scale = unitsPerPixel(fov, innerHeight)` → `projector` 会自动读新的 `offsetWidth`。

### E8. 语言切换

`.sp-lang button` → `document.documentElement.dataset.lang = v` + `localStorage.setItem('lang', v)` + `aria-pressed`。
面板高度会变，**不必**重排 3D 布局（面板按锚点定位），但要 `requestAnimationFrame` 后重新投影一次。

### E9. 平面图 minimap（P1，做完主线再做）

HUD 右下加一个 148×92 的 `<canvas class="sp-map">`，用 2D context 画建筑平面：
- 背景透明；走廊轮廓用 1px `rgba(186,220,240,.18)`；
- 7 个站点用 3×3 实心方块，当前站用 `--c-cyan`；
- 相机用一条 10px 的短线表示朝向；
- `pointerenter` 时展开到 320×200 并显示站点名。
这属于"用 3D/矢量语言表达空间导航"，必须极简，不要加图例。

---

### E10. 通用页面站点（about / archive / tools / portfolio / post 复用）

`stations.js` 只定义**首页巡游**。其它页面的 `<section data-sp-station="任意key">` 走"自动机位"：

- 若 `STATIONS` 里找不到该 key，按 DOM 顺序 `i` 生成：
  `pos = [0, 1.55, 6 - i*22]`，`look = [0, 1.55, -4 - i*22]`，`fov = 33`，`exposure = 1`。
- HUD 楼层轨的标签从 section 上读：`data-sp-floor="01"`、`data-sp-zh="概述"`、`data-sp-en="Overview"`；
  缺省时用 `String(i + 1).padStart(2, '0')` 与 `Section {i+1}`。
- 楼层总数 = 当前页面的 `[data-sp-station]` 数量（不是全局 7）。
- `?sp=n`（可选）：加载时直接定位到第 n 站，便于回归测试与深链；页面内的锚点 `#sp-<key>` 也要能跳转。
- 页面里若一个 `[data-sp-station]` 都没有（如 404）：跳过 3D，直接 `.sp-flat`，不要报错。

---

## F. 验收（自己截图确认）

1. `http://127.0.0.1:8099/` 静止时：标题清晰、无重影、360ms 内完成装配动画。
2. 滚轮从顶到底：相机连续前进，无回弹/抖动/穿墙；到达每站时内容完整可见。
3. 点击左侧楼层钮：900ms 内平滑到位。
4. 控制台 0 error（允许 Jekyll 无关的 favicon 404）。
5. 缩小到 420×900 或屏蔽 WebGL（`--disable-webgl`）：页面仍是可读文档。
6. 截图存 `.tooling/shots/`，至少 3 张（顶部 / 中部 / 底部）交回报告。

**改动边界**：只写 A 节列出的 4 个文件（+ E9 的 minimap 样式写进 `pages.css` 会与 web agent 冲突 → minimap 的样式请用内联 `<style>` 写在 `space-hud.html` 里）。
