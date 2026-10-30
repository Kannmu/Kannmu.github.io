# QA / audit — spatial rebuild of kannmu.top

**Auditor:** qa-audit (read-only)
**Build audited:** `docs/_site` newest `index.html` mtime **2026-10-29 22:59:49 +08:00**, re-verified against **23:13:15** (and again at 23:17) — the site was being rebuilt by other agents throughout. `.tooling/qa-confirm.js` on the 23:13 build reproduces the same table: all 25 URLs 200, same 3 error-bearing routes, GenPlant still dead.
**Server:** http://127.0.0.1:8099 (Windows filesystem, case-insensitive)
**Tooling / evidence:** `.tooling/qa-*.js|py`, JSON dumps in `.tooling/qa-*.json`, screenshots in `.tooling/qa-shots/`
**Chrome:** `channel:'chrome'`, RTX 3050 Ti / D3D11, WebGL2 available

Scope note: pages were still being edited/rebuild while this ran. Everything below is from a command that was actually run at the timestamp shown, or a screenshot listed in `evidence/`.

---

## a. Route health table

Sweep: `.tooling/qa-routes.js` (1440×900, `networkidle` + 2.5 s settle). "console" = `console` type=error + `pageerror`, excluding analytics/recaptcha/giscus/jsdelivr noise; local 404s counted separately.

| Route | Status | Console / page errors | Blank? | Notes |
|---|---|---|---|---|
| `/` | 200 | 0 | no | Spatial mode (`html.js.sp-ready`), 20 `.sp-panel`, 2 canvas, 434 chars visible text, 1 `<h1>` 涵无的博客 |
| `/about/` | 200 | 0 | no | 31 panels, 1065 chars, h1 Linhan Fan |
| `/archive/` | 200 | 0 | no | 14 panels, 686 chars |
| `/tools/` | 200 | 0 | no | 19 panels, 1170 chars |
| `/Portfolio/` | 200 | 0 | no | 12 panels, 1268 chars — resolves only because the host is case-insensitive (see #14) |
| `/lab/` | 200 | 0 | no | Flat + ambient canvas (`sp-flat js sp-ambient sp-ready`), 3345 chars, live acoustic-field canvas renders |
| `/404.html` | 200 | 0 | no | Flat, 211 chars, 3 CTAs |
| `/offline.html` | 200 | 0 | no | Flat, 237 chars |
| `/2023/06/04/Begin-Blog/` | 200 | 2 | no | Both errors = `giscus.app/api/discussions` 404 (external, ignored per brief) |
| `/2023/12/16/OpenViBE/` | 200 | 0 | no | 4695 chars |
| `/2024/03/19/My-First-Paper/` | 200 | 2 | no | giscus 404 ×2 |
| `/2024/09/06/Camera-Market/` | 200 | 1 | no | `ReferenceError: Chart is not defined` → chart never renders (defect #8) |
| `/2024/04/26/AIGC-Generated-Road-Bike/` | 200 | 1 | no | **local 404**: `/2024/04/26/AIGC-Generated-Road-Bike/enhanced-image%20(4).png` (defect #7) |
| `/2025/08/16/Trae-Latex-Academic-Writing/` | 200 | 0 | no | 3857 chars |
| `/2025/10/26/GenPlant/` | 200 | 0 | no | 1339 chars |
| `/CalcFlow/dist/` | 200 | 0 | no | Renders its own UI (header, live workspace, "Add node", CTAs) — old light design, allowed |
| `/PhoLo/dist/` | 200 | 0 | no | Renders own UI (drop zone, Adjust/Export panels) |
| `/GenImage/dist/` | 200 | 0 | no | Renders own UI |
| `/GenPlant/GenPlant/` | 200 | **2** | no | `Failed to resolve module specifier "lucide"` + `/favicon.ico` 404 → app never boots (defect #1) |
| `/GenPlant/dist/` | 200 | 0 | no | Working build: full 3-D plant renders (`.tooling/qa-shots/genplant-dist.png`) |
| `/UMH/` | 200 | 0 | no | 4250 chars |
| `/UMH%20Demo/dist/` | 200 | 0 | no | 2088 chars, own UI |
| `/T-Sim%20Game/dist/` | 200 | 0 | no | 602 chars, own UI |
| `/ZenMuxBalanceMonitor/dist/` | 200 | 0 | no | 221 chars, own UI |
| `/UMH%20Display/dist/` | 200 | 0 | no | 2645 chars, own UI |

All 25 URLs return 200; none is blank; every sub-app except GenPlant renders its own UI. Earlier 404s for the three space-named apps were an artefact of my own URL double-encoding and are **not** real.

---

## b. Link integrity

Static crawl of all 49 built HTML files, 1,040 internal `href/src/poster/data-src` (`https`, `mailto:`, `#…` ignored): **12 broken**.

Real, reachable defect:
- `_site/2024/04/26/AIGC-Generated-Road-Bike/index.html:376` — `<img src="enhanced-image (4).png">` → 404. Actual file is `docs/img/AIGCAssignment/enhanced-image (4).png`.

Not linked from any page (orphaned Vite dev stubs copied into `_site`, low severity, #13):
| File | Line | Broken target |
|---|---|---|
| `CalcFlow/index.html` | 5, 13 | `/calcflow.svg`, `/src/main.js` |
| `PhoLo/index.html` | 6, 14 | `%BASE_URL%pholo-mark.svg`, `/src/main.ts` |
| `GenImage/index.html` | 5, 13 | `/vite.svg`, `/src/main.ts` |
| `T-Sim Game/index.html` | 6, 18 | `%BASE_URL%t-sim.svg`, `/src/main.js` |
| `ZenMuxBalanceMonitor/index.html` | 5, 13 | `/favicon.svg`, `/src/main.ts` |
| `UMH Display/web/index.html` | 265 | `/src/main.ts` |

Checked separately and **clean**:
- HUD menu on all eight routes → `/`, `/about/`, `/archive/`, `/tools/`, `/Portfolio/` all exist.
- prev/next on posts (`rd-pn__a`) → all targets exist; first post correctly shows "—" for *previous*.
- 11 DOI links (`https://doi.org/10.…`) → all return **302** (valid).
- 8 `_data/tools.yml` URLs → all return **200** (but `/GenPlant/GenPlant/` is a dead app, #1).

---

## c. Bilingual completeness (`qa-bilingual.js`, 1440×900, forced `data-lang` + real button click)

Switch mechanism verified: clicking `[data-sp-lang]` sets `data-lang` and `aria-pressed` correctly on every page (zh: `true/false`, en: `false/true`).

| Page | Unmatched pairs | Both-languages-visible (pair check) | Untranslated visible text in EN | Intersecting panel pairs zh → en |
|---|---|---|---|---|
| `/` | 0 | 0 | 1 (skip link, by design) | 51 → 51 |
| `/about/` | **1** (en `Prof. Yafeng Niu`) | 0 by pair check, **1 real leak** (see #6) | 3 (skip link, `知乎`, `牛亚峰 教授`) | 112 → **116** |
| `/archive/` | 0 | 0 | **6** (5+ filter chips, skip link) | 26 → **28** |
| `/Portfolio/` | 0 | 0 | 1 (skip link) | 20 → **21** |
| `/404.html` | 0 | 0 | 1 (skip link) | 0 → 0 |

- **Panel geometry after switching language.** Longer English copy creates new rect intersections: `/about/` +4 pairs (largest 61×5 px, `ab-news`×`ab-pubcol`), `/archive/` +2 (79×18 `ar-mast`×`ar-yhead`, 43×19 `ar-mast`×`ar-postcol`), `/Portfolio/` +1 (82×40 `pf-group`×`pf-photos`). These are overlapping *section boxes*; a separate glyph-collision scan (`qa-overflow.js`, 54–82 text leaves/page) found **0 real text-on-text collisions** on `/`, `/about/`, `/tools/`, `/archive/`, the post page, and 2 flagged pairs on `/Portfolio/` that a 2× clip screenshot (`qa-shots/pf-h01.png`) shows are **false positives**. No invisible/overlapping text was found.
- `aria-label`/`alt` strings that stay Chinese in EN mode are almost all deliberately bilingual single strings (`"Language / 语言"`, `"F01 · Entry / 入口"`, `"Topic filter 主题筛选"`) → harmless. Exceptions: 16 portfolio `alt="摄影作品：Bg_0"…` and 1 about `alt="范林涵 Linhan Fan 的照片"` (#9).

---

## d. Copy voice (objective third person)

Scanned `docs/index.html`, `about.html`, `archive.html`, `tools.html`, `Portfolio.html`, `lab.html`, `404.html`, `offline.html`, `_layouts/post.html`, `_layouts/space.html`, `_includes/space-head.html`, `_includes/space-hud.html` for `我 我的 本人 我们 \bI\b my me we our` → **0 hits in all 12 files** (independently confirmed with PowerShell regex counts).

Broader scan of `_data/*.yml`, `_includes/*.html`, `_layouts/*.html`:
| file:line | text | classification |
|---|---|---|
| `_data/profile.yml:314` | `站内背景照片均为作者本人拍摄；…` | harmless — third-person "the author himself", not first person |
| `_data/publications.yml:7` (comment) | `用于在作者列表中高亮本人` | harmless — YAML comment, never rendered |
| `_includes/nav.html:20,24` (JS comment) | `we use a 'e.target' filter` | harmless — code comment |
| `_includes/short-about.html:2` | `>ABOUT ME</a>` | harmless — only included by `_layouts/page.html`; string absent from every built page (verified) |

**Real first-person copy to fix: none.** Post bodies (`_posts/**`) contain first person but are out of scope per brief.

---

## Defect list (ordered by severity)

Each: **file — symptom — reproduction — suggested owner**.

1. **`docs/_data/tools.yml:28` (GenPlant entry) → `/GenPlant/GenPlant/` is a dead app.**
   Symptom: page loads a static shell only; no plant, inert sliders. Page error `Failed to resolve module specifier "lucide". Relative references must start with either "/", "./", or "../".` (`GenPlant/GenPlant/js/main.js:10` imports bare `lucide`, no import map is shipped).
   Repro: `node .tooling/qa-probe404.js "/GenPlant/GenPlant/"` → 1 page error; screenshot `.tooling/qa-shots/genplant.png` (empty canvas) vs `.tooling/qa-shots/genplant-dist.png` (working build at `/GenPlant/dist/`, 0 errors).
   Owner: **web-pages** (retarget `url:` to `/GenPlant/dist/`) — one-line fix, working artefact already exists.

2. **Mobile HUD tap targets below the 40 px bar.**
   Symptom: menu links 32×26 px, language buttons 28×26 px, brand 128×26 px; 9 of 15 interactive elements on `/Portfolio/` are under 40 px.
   Repro: `node .tooling/qa-mobile.js` → `SMALL A 32x26 "首页"` … at both 390×844 and 420×900.
   Owner: **runtime** (HUD in `_includes/space-hud.html` / `space.css`).

3. **Mobile type far below 14 px.**
   Symptom: smallest visible text 6.8–8.5 px; 81–360 visible text nodes < 14 px per page (e.g. `/about/`: 360). Examples: `sp-brand__sub` 8.5 px, menu items 10 px, `.sp-meta` 8 px.
   Repro: same run, `TINY 8.5px sp-brand__sub "Spatial Index"`, `minFont=7` on `/about/`.
   Owner: **runtime** (tokens) + **web-pages** (page-level overrides).

4. **Contrast below 4.5:1 for the dim text token `rgb(93,114,133)`.**
   Symptom: `.sp-label` 3.60 / 3.75 / 3.83 on `/about/`; inactive `.sp-rail__btn` 4.02–4.21 on `/` and `/about/` (sampled from rendered pixels, WCAG relative luminance).
   Repro: `node .tooling/qa-contrast.js` then `python qa-contrast.py` → 11/32 samples below threshold; details `qa-contrast-results.json`.
   Owner: **runtime** (`--sp-dim`-style token in `space.css`).

5. **`/about/` "继续/论文/工具箱/联系" CTA block is not keyboard reachable.**
   Symptom: `.ab-cta` is `visibility:hidden; opacity:0` at load and at most scroll positions; its three links never enter the Tab order. A 40-step Tab walk reaches nav, rail (8 buttons), chips, IDs — never the CTA.
   Repro: `node .tooling/qa-cta2.js` → `visible=false` at y=0…3152, `true` only in y≈3940–4728 (1440×900); `qa-a11y.js` tab order shows `CTA focused? false`.
   Owner: **runtime** (reveal/culling) with **web-pages**.

6. **Bilingual leak on `/about/` advisor block — both languages render at once.**
   Symptom: `_site/about/index.html:344` — `<a href="…">牛亚峰 教授</a>` has **no** `data-zh`/`data-en`, followed by `<a href="…" data-en>Prof. Yafeng Niu</a>`. In EN mode the Chinese link is not hidden, so the line reads "牛亚峰 教授 · Prof. Yafeng Niu"; the pair scanner reports the `data-en` node as unmatched and the `a` "牛亚峰 教授" as CJK still visible in EN.
   Repro: `node .tooling/qa-bilingual.js` → `UNMATCHED {"side":"en","text":"Prof. Yafeng Niu"}` + `UNTRANSL {"lang":"en","el":"a","text":"牛亚峰 教授"}`.
   Owner: **web-pages** (`about.html`, advisor `<p>`).

7. **`/2024/04/26/AIGC-Generated-Road-Bike/` has a broken local image.**
   Symptom: HTTP 404 for `/2024/04/26/AIGC-Generated-Road-Bike/enhanced-image%20(4).png`; the image slot is empty.
   Repro: `node .tooling/qa-confirm.js` → `L404 …/enhanced-image%20(4).png`; static crawl agrees (`index.html:376`). File exists at `docs/img/AIGCAssignment/enhanced-image (4).png`.
   Owner: **reader** — source is `_posts/Personal-Project/2024-04-26-AIGC-Generated-Road-Bike.md:85` (`![alt text](<enhanced-image (4).png>)` lacks the `/img/AIGCAssignment/` prefix that lines 82 and 100 use).

8. **`/2024/09/06/Camera-Market/` chart never renders.**
   Symptom: `ReferenceError: Chart is not defined at updateChart (…/:420)`. The post loads Chart.js from `cdn.jsdelivr.net` with `async` and calls it synchronously in the same parse; `#cameraChart` stays empty.
   Repro: `node .tooling/qa-routes.js` → 1 console error on that route (CDN reachable from the host: `HEAD https://cdn.jsdelivr.net/npm/chart.js` → 200, so this is not a network artefact).
   Owner: **reader** (post layout/asset order) — or the post body itself.

9. **Image `alt` text is Chinese-only on `/Portfolio/` and `/about/`.**
   Symptom: 16 portfolio `<img alt="摄影作品：Bg_0">`… and 1 about `<img alt="范林涵 Linhan Fan 的照片">` stay Chinese in EN mode.
   Repro: `qa-bilingual.js` → `attrHits(en)` alt entries.
   Owner: **web-pages**.

10. **`/archive/` filter chips are untranslated.**
    Symptom: tag buttons render raw Jekyll tags — `作品集`, `技术博客`, `技术美术`, `硬件`, `论文研读` — and remain Chinese in EN mode (built from `archive.html:61 {{ tag[0] }}` with no bilingual span).
    Repro: `qa-bilingual.js` → 5 `button.sp-chip.ar-chip` CJK-visible-in-EN hits.
    Owner: **web-pages** (add a tag-name map or EN labels).

11. **Skip link is last, not first, in the tab order.**
    Symptom: `.sp-skip` ("跳转到正文 · Skip to content") is the 17th focusable on `/` (after brand, 5 menu links, 2 language buttons, 7 rail buttons) instead of the 1st.
    Repro: `qa-a11y.js` tab order, entry #17.
    Owner: **runtime**.

12. **No heading structure on `/` and `/about/` (one `<h1>`, zero `<h2>`).**
    Symptom: exactly one heading per page; section titles are `<div class="sp-h2">`. The formal checks pass (1 × h1, no skipped levels) but screen-reader users get no section outline.
    Repro: `qa-a11y.js` → `heading order: h1` on both.
    Owner: **home** for `/`, **web-pages** for `/about/`.

13. **Vite dev stubs published as real routes (6 directories).**
    Symptom: `/CalcFlow/`, `/PhoLo/`, `/GenImage/`, `/T-Sim Game/`, `/ZenMuxBalanceMonitor/`, `/UMH Display/web/` are served with `%BASE_URL%` placeholders and `/src/main.ts` references that 404. Nothing links to them; they compete with the working `/…/dist/` URLs.
    Repro: `node .tooling/qa-links.js` → 8 broken links; `Get-ChildItem docs/_site` lists them.
    Owner: **lead** (build include/exclude).

14. **`/Portfolio/` exists on disk only as lowercase `portfolio/`.**
    Symptom: Jekyll's `/Portfolio/` output landed inside the Vite app directory on this case-insensitive filesystem; there is no `_site/Portfolio/`. Every internal link and `sitemap.xml` uses `/Portfolio/`, so this works here but 404s on a case-sensitive host if this `_site` is deployed as-is.
    Repro: `Get-ChildItem docs/_site -Directory` → `portfolio` only; `_site/portfolio/index.html` title = 研究与设计作品集; `_site/portfolio/dist/` also present.
    Owner: **lead**.

---

## What is verified good

- **No blank screens, no runtime regressions on the eight primary routes**: all 200, **0 console errors / 0 page errors / 0 local 404s**; each renders fully (screenshots `qa-shots/{home,about,archive,tools,portfolio,lab,404,offline}.png`).
- **WebGL shader error is fixed**: the earlier `float patch` compile error (`THREE.WebGLProgram … 'patch' : Illegal use of reserved word`) seen at 22:57 is gone from the 22:59 build — `scenes.js` now uses `spot`. Zero THREE errors on every route in the final sweep.
- **Sub-apps otherwise intact**: CalcFlow, PhoLo, GenImage, UMH, UMH Demo, T-Sim, ZenMux, UMH Display all load with 0 errors and render their own UI (older visual design, as allowed).
- **Links**: 1,040 internal links crawled, only 12 broken (1 real image + 11 orphaned dev-stub assets); HUD menu, prev/next, all 11 DOI targets (302) and all 8 tool URLs (200) resolve.
- **Bilingual switching works**: `aria-pressed` correct in both states, `data-lang` toggles, zero pair-level leaks of both-language spans outside the one advisor line, no skipped/missing pairs beyond it, and no language-switch-induced text collision.
- **Copy voice is clean**: 0 first-person hits across 12 rebuilt files; only harmless matches (third-person "作者本人", code comments, a non-rendered legacy include).
- **A11y basics**: exactly one `<h1>` on `/`, `/about/` and a post; no skipped heading levels; every `<img>` has `alt`; rail + menu reachable by Tab; reduced-motion (`prefers-reduced-motion: reduce`) leaves panels at `transform: none` with **0/8** transform changes while idle and after scrolling.
- **Degradation**: with JavaScript disabled the page renders a complete flat document (3,608 chars; hero 涵无的博客 + all four research directions + recent-note titles present); with `--disable-webgl` likewise (3,241 chars, same content). No console errors, no horizontal overflow in either mode. (Only difference: with JS on, research-detail tabs 02–04 start collapsed by design.)
- **Mobile**: no horizontal scrollbar at 390×844 or 420×900 on any page; every station's content is reachable by scrolling to the document bottom (`scrollY == maxScroll`), and all six pages fall back to the flat document (`html.sp-flat`).

## Not run / out of scope
- Visual pixel-diff against the pre-rebuild site (no clean baseline build in the repo).
- axe-core/Lighthouse rule sweep (only the specific a11y assertions in the brief were tested).
- Real-device iOS/Android rendering (Chromium emulation only).
