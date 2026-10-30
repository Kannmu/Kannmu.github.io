# DIRECTION v3 · “SPECTRAL VECTOR”

> **唯一事实来源（this file overrides every older spec).** Read it fully before writing a line.
> The site is a Jekyll blog with a hand-written WebGL spatial runtime. v2 (cold blue glass tower)
> is being replaced by v3: a near-black **vector architecture** world with one spectral gradient,
> hard 1px line work, very large type, and data-driven motion. Nothing decorative: every panel,
> number and line is navigation, position, data or hierarchy.

---

## 0. Non-negotiables

1. **Objective copy.** No first person anywhere: no 我 / 我的 / 本人 / 我们的 / we / I / my / me.
   No marketing adjectives (震撼/极致/颠覆/惊艳/perfect/amazing). Facts, numbers, methods, nouns.
2. **Readability first.** Body ≥ 19px, meta ≥ 13px (never below 12px), line-height ≥ 1.55,
   contrast ≥ 7:1 for body on the void. Nothing important below 15px.
3. **No new dependencies.** three.js r186 is local (`assets/vendor/three/`), fonts are local.
   No CDN, no npm, no jQuery, no GSAP. All animation is hand-written rAF/CSS.
4. **Minimal inventory.** One accent system (the spectral gradient). Black / white / grey / one
   gradient. No drop-shadow blur, no rounded corners (radius 0 everywhere), no glassmorphism blur
   cards, no emoji.
5. **Hard lines.** 1px is the drawing language: hairlines, rules, 90°/45° cuts, outlined numerals.
6. **Everything must degrade.** JS off / WebGL off → `.sp-flat` readable document with all content.
   `prefers-reduced-motion` → no idle drift, no wipes, no counters.
7. **Do not touch** `_data/*`, `_config.yml`, `css/*`, `js/*` (legacy), or any sub-project folder
   (CalcFlow, GenPlant, PhoLo, UMH*, T-Sim Game, ZenMuxBalanceMonitor, portfolio, video, img).

---

## 1. Art direction

**World:** a black dimensionless hall. Architecture is drawn, not lit: extruded matte-black slabs,
1px white line work, a mirror-black floor, and one continuous **spectral seam** — a horizontal
band of gradient light at eye level that runs the length of the building and bends with the camera.

**Palette (exact):**

| token | value | use |
|---|---|---|
| `--ink-0` | `#05060A` | page void, canvas clear |
| `--ink-1` | `#090B10` | panel body |
| `--ink-2` | `#10131A` | raised body |
| `--paper` | `#F7F7F4` | headings, body |
| `--paper-2` | `#C9CDD6` | secondary text |
| `--mute` | `#8C93A3` | meta / labels (≥ 5:1) |
| `--dim` | `#5C6472` | disabled only, never body |
| `--line-1` | `rgba(255,255,255,.09)` | hairline |
| `--line-2` | `rgba(255,255,255,.20)` | rules |
| `--line-3` | `rgba(255,255,255,.42)` | active rule / cursor |
| `--g-violet` | `#7C5CFF` | gradient stop 1 |
| `--g-cyan` | `#24D6EA` | gradient stop 2 |
| `--g-lime` | `#C6FF4A` | gradient stop 3 |
| `--g-rose` | `#FF5C7A` | gradient stop 4 (rare: signal/alert only) |
| `--grad` | `linear-gradient(100deg, var(--g-violet) 0%, var(--g-cyan) 38%, var(--g-lime) 74%, var(--g-rose) 100%)` | the one gradient |

The gradient appears only where something is *live or measured*: the seam, active nav, chart
strokes, focus rings, the mailto underline, counters. Static chrome is grey.

**Type:**

- `--f-display` = `SP Display` → Archivo variable (**wght 100–900, wdth 62–125**), file
  `assets/fonts/archivo-latin-wdth-normal.woff2`. Use `font-stretch` for width language.
- `--f-mono` = `SP Mono` → JetBrains Mono variable (wght 100–800).
- `--f-serif` = `SP Serif` → Instrument Serif 400 (editorial accent only: one italic phrase per
  screen at most; never body copy).
- `--f-cjk` = system CJK stack (PingFang / HarmonyOS / Microsoft YaHei UI).
- Latin display is **uppercase**, tracking `-0.045em`, `font-stretch: 108%–118%`, wght 700–800.
- CJK display is **never uppercase**, wght 600–700, tracking `-0.02em`.
- Real type scale (desktop):
  - hero H1 `clamp(64px, 8.2vw, 132px)`, line-height `.86`
  - section H2 `clamp(44px, 5.2vw, 88px)`, line-height `.92`
  - H3 `clamp(24px, 2.1vw, 34px)`
  - lede `clamp(20px, 1.55vw, 26px)`, line-height 1.45
  - body `20px / 1.62`
  - list title `21–26px`
  - label (mono) `12px / .16em tracking / uppercase`
  - KPI numeral `clamp(48px, 5.6vw, 84px)` mono, tabular

**Motion:** every transition uses `--e-out` (`cubic-bezier(.16,1,.3,1)`) or `--e-in-out`.
Scroll motion is damped, never linear. Camera moves are one continuous dolly with an arc and a
small bank; no cuts except the deliberate **blade wipe** when jumping between floors.

---

## 2. Home stations — exact composition (authoritative)

Composition canvas is **1520 × 950** CSS px, projected 1:1 at rest; `data-sp-pos` is relative to
the content-plane centre: **x → right, y → down, +z → toward the eye**. Safe area:
`x ∈ [-700, 700]`, `y ∈ [-420, 420]`, `z ∈ [-120, 160]`. Panels must not overlap after rotation.

`data-sp-anchor`: `lt` (default), `ct`, `rt`, `lb`, `cb`, `rb`, `lc`, `cc`, `rc`.
`data-sp-order`: 1 = first to appear. Max 4 panels per station (band counts as one).

| # | key | floor label | panels (slot · anchor · pos · rot · width) | content |
|---|---|---|---|---|
| 1 | `entry` | F01 / 入口 | `title` · lt · **-690,-330,110** · 0,-2,0 · 780<br>`kpi` · rt · **700,-300,60** · 0,6,0 · 320<br>`cta` · lb · **-690,300,150** · 0,3,0 · 700<br>`numeral` · rb · **700,250,90** · 0,5,0 · 300 | name/role/statement; 4 KPIs; 2 CTAs + place; giant outlined `01` |
| 2 | `profile` | F02 / 简介 | `title` · lt · **-690,-395,100** · 0,-2,0 · 620<br>`statement` · lt · **-690,-150,-30** · 0,-3,0 · 660<br>`facts` · rt · **700,-230,60** · 0,6,0 · 340<br>`timeline` · lb · **-690,340,140** · 0,2,0 · 1380 (band) | 2-paragraph research statement; fact sheet; education timeline |
| 3 | `research` | F03 / 研究 | `title` · lt · **-690,-395,100** · 0,-2,0 · 640<br>`list` · lt · **-690,-140,-20** · 0,-3,0 · 700<br>`detail` · rt · **700,-215,60** · 0,6,0 · 380<br>`index` · rb · **700,330,120** · 0,3,0 · 300 | 4 directions (accordion); detail + radar viz; count |
| 4 | `papers` | F04 / 论文 | `title` · lt · **-690,-395,100** · 0,-2,0 · 640<br>`list` · lt · **-690,-130,-20** · 0,-3,0 · 700<br>`viz` · rt · **700,-235,60** · 0,6,0 · 400<br>`kpi` · rb · **700,330,120** · 0,3,0 · 400 | first/co-first papers; citation spine chart; totals |
| 5 | `notes` | F05 / 笔记 | `title` · lt · **-690,-395,100** · 0,-2,0 · 680<br>`list` · lt · **-690,-150,-20** · 0,-3,0 · 700<br>`aside` · rt · **700,-235,60** · 0,6,0 · 360<br>`index` · rb · **700,330,120** · 0,3,0 · 360 | 6 recent posts; archive + topic distribution |
| 6 | `tools` | F06 / 工具 | `title` · ct · **0,-395,100** · 0,2,0 · 760<br>`grid` · ct · **0,-120,-20** · 0,-2,0 · 1200<br>`index` · cb · **0,395,130** · 0,2,0 · 900 | 8 tool tiles (4×2); count + note |
| 7 | `contact` | F07 / 联系 | `title` · lt · **-690,-330,110** · 0,-2,0 · 720<br>`links` · rt · **700,-160,60** · 0,6,0 · 340<br>`meta` · lb · **-690,330,130** · 0,2,0 · 900 | email + statement; link list; imprint |

Station order, keys and camera are fixed in `assets/space/js/stations.js` (**lead-owned**). If a
station needs different framing, message the lead — do not edit stations.js.

---

## 3. CSS class inventory (only these)

Existing `sp-*` classes stay and are restyled by the lead. **New v3 classes** (lead implements):

```
layout     .sp-band .sp-split .sp-grid2 .sp-figure
type       .sp-kicker .sp-xl .sp-accent .sp-quote .sp-numeral .sp-ghost .sp-caps
data       .sp-kpi .sp-kpi__v .sp-kpi__l .sp-viz .sp-viz__cap .sp-meter-line
item       .sp-rowline .sp-rowline__no .sp-arrow .sp-slab .sp-slab--fill .sp-hair
```

Do not invent other classes. Page-specific markup with its own CSS file is allowed for secondary
pages only (`.ab-*`, `.ar-*`, `.tl-*`, `.pf-*` stay as-is, restyled by their owner).

Modifiers that remain valid: `.sp-btn--solid`, `.sp-link`, `.sp-chip`, `.sp-pub`, `.sp-note`,
`.sp-tool`, `.sp-tower`, `.sp-stats`, `.sp-glass`, `.sp-panel--ghost`, `.sp-copy-zh/-en`.

---

## 4. Files, owners, write scopes

| path | owner | notes |
|---|---|---|
| `assets/space/js/engine.js` | **lead** | renderer, mirror, glass, **post chain v3**, camera rig, projector, input, cursor, quality |
| `assets/space/js/stations.js` | **lead** | station keys, camera keyframes, flight arcs, shell |
| `assets/space/css/space.css` | **lead** | tokens, base, type system, HUD chrome, panels, components |
| `assets/space/js/scenes.js` | **scene-artist** | the 3D architecture |
| `assets/space/js/app.js` | **runtime-engineer** | runtime, transition, HUD wiring, cursor behaviour, counters |
| `_layouts/space.html`, `_includes/space-head.html` | **runtime-engineer** | document shell, script loading |
| `_includes/space-hud.html`, `assets/space/css/hud.css` | **runtime-engineer** | HUD markup + its styles |
| `docs/index.html` | **home-content** | 7 stations of copy + markup |
| `assets/space/js/viz.js`, `assets/space/css/viz.css` | **viz-engineer** | charts / diagrams |
| `docs/about.html archive.html tools.html Portfolio.html 404.html offline.html lab.html`, `_layouts/post.html page.html`, `assets/space/css/pages.css prose.css` | **pages-architect** | wave 2 |
| `.tooling/qa/**` | **qa-auditor** | harness + reports |
| `.tooling/v3-shot.js` | **lead** | shared screenshot tool |

Never edit a file you do not own. Never run `jekyll build` (a watcher owns `_site`).

---

## 5. Runtime contracts (JS)

### 5.1 engine.js (lead) — exported API

```js
makeRenderer(canvas, quality)            // unchanged signature
makeMirrorFloor(renderer, scene, camera, { width, depth, y, resScale, gridStep })
makeGlassMaterial(opts)                  // unchanged
makeLineLace(segments, color, opacity)   // unchanged
makePostChain(renderer, quality)         // post.render(scene, camera, state)
CameraRig(camera)                        // rig.setPose({pos,look,fov,roll}); rig.update(dt,{lambda})
DomProjector(camera)                     // projector.add(el, anchor, {anchorX,anchorY,order})
SpaceInput({stationCount,onJump})        // input.pointer, input.hot
makeCursor()                             // cursor.update(dt)
detectQuality(), hasWebGL(), THREE
clamp, lerp, smoothstep, damp
```

`post.render(scene, camera, state)` state fields (all optional, defaults keep v2 behaviour):
`time, velocity, exposure, reveal, fade, wipe (0..1), field (0..1), edge (0..1), poster (0..1),
flash (0..1), accent (THREE.Color), station (0..6)`.

`post` also exposes `post.setAccent(hex)` and `post.resize(w,h)` (alias of setSize).

### 5.2 scenes.js (scene-artist)

```js
export function buildScenes({ THREE, scene, renderer, camera, quality, ambient, mirror, stations })
// stations: [{ key, def, frame:{pos,look,forward,right,up,origin,basis,distance}, root, el }]
// returns {
//   update(time, dt, camera, state),   // state: { velocity, station, t, reduced }
//   resize(w, h, pr),
//   focus(key)          // optional: 'gaze'|'bci'|'haptics'|'method'|paper id|null — highlight
//   dispose()
// }
```

- Add geometry in **world coordinates**, built from `frame.origin / right / up / forward`
  (`right`, `up` are the screen basis at rest; `forward` points away from the camera).
- **Keep a clear volume around every content plane**: no bright geometry within 3.2 m (world) of a
  station's content plane, and nothing between the eye and a panel inside the panel's screen
  rectangle ±0.8 m. Panels are read at 8 m; geometry that crosses them is a bug.
- `focus(key)` is called by app.js when a research row / paper row is hovered or focused.
- Budget: < 220 draw calls desktop, < 90 mobile; no per-frame allocations; no textures > 1024.

### 5.3 app.js (runtime-engineer)

- Keeps the existing public QA hook: `window.__sp.{go,go0,state,mode,fps,stations,detent}`.
- Dispatches `document` CustomEvent **`sp:station`** `{detail:{i,key}}` at station rest and
  **`sp:focus`** `{detail:{key}}` on row hover/expand (bubbles, not cancelable).
- Calls `scenes.focus(key)` when available.
- Blade wipe: on rail / keyboard jumps call `app.wipe()` → post wipe 0→1 over ~520 ms while scroll
  tween runs. Reduce to a 1-frame fade when `quality.reduced`.
- No changes to the panel projection maths without lead review (it is pixel-locked).

### 5.4 viz.js (viz-engineer)

Auto-initialise: `document.querySelectorAll('[data-viz]')` → render by type. Types:
`spine` (publication citation spine), `timeline` (education/positions), `radar` (four research
directions), `topics` (post topic distribution), `sigil` (per-tool procedural mark), `signal`
(live oscilloscope from `sp:station`/velocity — optional, only if HUD asks).

Markup contract (written by home-content, consumed by viz):

```html
<figure class="sp-viz" data-viz="spine"
        data-viz-data='[{"label":"2024","value":6,"sub":"AEI"}]'
        data-viz-label="Citations by year"
        role="img" aria-label="Citations by year: 2024…">
  <figcaption class="sp-viz__cap">…</figcaption>
  <noscript><!-- table fallback with the same numbers --></noscript>
</figure>
```

- Canvas 2D, DPR-aware, 1px hairline strokes (offset .5), gradient stroke from CSS vars,
  no library, ≤ 4 ms per frame budget, static after 1 intro animation.
- Palette comes from `getComputedStyle(document.documentElement)` custom properties; re-render on
  `sp:lang` and resize. Respect `prefers-reduced-motion` (no intro animation).
- Never overlap the figure's own caption; the figure does not exceed the panel width.

---

## 6. Copy rules (hard)

- Bilingual: every sentence exists in both `[data-zh]` and `[data-en]`. English is idiomatic, not
  a translation of the Chinese word order.
- Objective voice only. Date-stamped facts preferred (`2024`, `11 papers`, `80 citations`).
- No sentence that begins with 我/我们/本网站. No "欢迎来到". No "follow me". No exclamation marks.
- Claims must trace to `_data/profile.yml`, `_data/publications.yml`, `_data/tools.yml` or
  `_posts/`. If a number is not in the data, do not invent it.
- Section labels are nouns: `简介 / PROFILE`, `研究 / RESEARCH`, `论文 / PUBLICATIONS`,
  `笔记 / NOTES`, `工具 / TOOLS`, `联系 / CONTACT`.

Good: 「东南大学设计学博士研究生，研究方向为人机交互、眼动交互、脑机接口与空中超声触觉。」
Bad: 「我目前在东南大学读博，研究方向是……」
Good: “Ph.D. candidate in design at Southeast University. Research spans eye-gaze interaction,
brain–computer interfaces and mid-air ultrasonic haptics.”
Bad: “I study…”

---

## 7. Workflow (verified)

- Static build watcher **is already running**: saving a source file rebuilds `_site` in ~3 s.
  Never run `jekyll build` yourself.
- Preview: **http://127.0.0.1:8099/** (`docs/_site`), served by a background server.
- Screenshots (Chrome via playwright-core in `.tooling/`):
  ```powershell
  cd D:\Data\OneDrive\KannmuSite
  node .tooling\v3-shot.js --out=.tooling\v3\shots\NAME --stations=0-6 --w=1600 --h=1000 --wait=2200
  node .tooling\v3-shot.js --out=.tooling\v3\shots\NAME-m --stations=0-6 --w=420 --h=900 --wait=1600
  ```
  Use `--lang=en` for the English pass. Read `_report.json` for panels/console/overflow.
- **Look at the PNGs with the read_image tool.** “No console error” is not proof. Check:
  no overlap, nothing clipped at the frame edge, text ≥ 19px, contrast, and that the 3D never
  covers a panel.
- Mobile 420×900 must stay readable (body ≥ 17px there) and never overflow horizontally.

---

## 8. Acceptance (v3)

1. Hero: name at ≥ 96px on 1600×1000; first screen reads in < 2 s; contrast ≥ 7:1.
2. At every station rest: 0 overlapping panels, 0 clipped panels, 0 panel hidden by geometry.
3. The spectral gradient is visible in motion (seam + live accents) but the page never becomes
   colourful noise: > 80% of the frame is neutral black/white/grey.
4. Rail/keyboard jump triggers the blade wipe and lands exactly on a station; scroll is damped,
   no jitter, no black frames; ≥ 50 fps at 1600×1000 on the local RTX 3050.
5. `prefers-reduced-motion`: still, readable, all content present.
6. English and Chinese both complete, no overflow, no CJK fallback in Latin display.
7. No console errors; no network requests off-origin except analytics.
8. No-JS: `.sp-flat` document with every fact visible.
