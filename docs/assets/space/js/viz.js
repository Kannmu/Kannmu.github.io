/* ============================================================================
   viz.js — SPECTRAL VECTOR v3 · data marks
   ----------------------------------------------------------------------------
   Dependency-free Canvas 2D renderer for every [data-viz] element.

     spine      publication citation spine (year bands, citation bars)
     timeline   education / position axis
     radar      research-direction polygon
     topics     horizontal distribution bars
     sigil      deterministic procedural tool mark
     signal     live scroll-velocity oscilloscope (96 × 28)

   Contract: docs/_doc/direction-v3.md §5.4.
   · one canvas per figure, DPR-aware, 1px hairlines on .5 offsets
   · colours come from the v3 custom properties on :root, re-read on sp:lang
   · static after one intro animation (skipped for prefers-reduced-motion)
   · ResizeObserver redraw, never wider than the figure
   · role=img + aria-label summary is preserved / generated when absent
   · data-viz-data JSON first, <table data-viz-table> fallback
   ========================================================================== */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
const TAU = Math.PI * 2;

/* ---------------------------------------------------------------------------
   0. palette + CSS custom properties
   ------------------------------------------------------------------------ */

const FB = {
  ink0: '#05060A',
  ink1: '#090B10',
  ink2: '#10131A',
  paper: '#F7F7F4',
  paper2: '#C9CDD6',
  mute: '#8C93A3',
  dim: '#5C6472',
  line1: 'rgba(255,255,255,.09)',
  line2: 'rgba(255,255,255,.20)',
  line3: 'rgba(255,255,255,.42)',
  violet: '#7C5CFF',
  cyan: '#24D6EA',
  lime: '#C6FF4A',
  rose: '#FF5C7A',
  mono: "'SP Mono', ui-monospace, 'SF Mono', 'Cascadia Mono', Consolas, monospace",
  display:
    "'SP Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei UI', system-ui, sans-serif",
};

let TOK = null;

function tokens() {
  if (TOK) return TOK;
  const cs = getComputedStyle(document.documentElement);
  const get = (name, fallback) => {
    const v = cs.getPropertyValue(name).trim();
    return v || fallback;
  };
  TOK = {
    ink0: get('--ink-0', FB.ink0),
    ink1: get('--ink-1', FB.ink1),
    ink2: get('--ink-2', FB.ink2),
    paper: get('--paper', FB.paper),
    paper2: get('--paper-2', FB.paper2),
    mute: get('--mute', FB.mute),
    dim: get('--dim', FB.dim),
    line1: get('--line-1', FB.line1),
    line2: get('--line-2', FB.line2),
    line3: get('--line-3', FB.line3),
    violet: get('--g-violet', FB.violet),
    cyan: get('--g-cyan', FB.cyan),
    lime: get('--g-lime', FB.lime),
    rose: get('--g-rose', FB.rose),
    mono: get('--f-mono', FB.mono),
    display: get('--f-display', FB.display),
  };
  return TOK;
}

function isZh() {
  return document.documentElement.getAttribute('data-lang') !== 'en';
}

/* ---------------------------------------------------------------------------
   1. tiny utilities (no allocations worth worrying about: ≤ 40 rows per chart)
   ------------------------------------------------------------------------ */

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function easeOut(t) {
  t = clamp(t, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOut(t) {
  t = clamp(t, 0, 1);
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function num(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    const s = v.replace(/[,\s]/g, '').replace(/%$/, '');
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function firstVal() {
  for (let i = 0; i < arguments.length; i++) {
    const v = arguments[i];
    if (v !== null && v !== undefined && v !== '') return v;
  }
  return '';
}

function truthy(v) {
  return (
    v === true ||
    v === 1 ||
    v === '1' ||
    v === 'true' ||
    v === 'TRUE' ||
    v === 'yes' ||
    v === 'first' ||
    v === 'cofirst' ||
    v === 'current'
  );
}

function str(v) {
  return v === null || v === undefined ? '' : String(v).replace(/\s+/g, ' ').trim();
}

function fmt(v) {
  if (v === null || v === undefined || !Number.isFinite(v)) return '—';
  if (Math.abs(v - Math.round(v)) < 1e-6) return String(Math.round(v));
  return v.toFixed(1).replace(/\.0$/, '');
}

function mono(size, weight) {
  const T = tokens();
  return `${weight || 400} ${size}px ${T.mono}`;
}

function display(size, weight) {
  const T = tokens();
  return `${weight || 500} ${size}px ${T.display}`;
}

/* ---- colour ------------------------------------------------------------- */

function rgba(color, alpha) {
  if (color === null || color === undefined || color === '') return 'rgba(255,255,255,' + alpha + ')';
  const c = String(color).trim();
  let m = c.match(/^#([0-9a-f]{3,8})$/i);
  if (m) {
    let hex = m[1];
    if (hex.length === 3) hex = hex.split('').map((x) => x + x).join('');
    if (hex.length === 4) hex = hex.split('').map((x) => x + x).join('');
    if (hex.length !== 6 && hex.length !== 8) return c;
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return `rgba(${r},${g},${b},${+(a * alpha).toFixed(4)})`;
  }
  m = c.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?\s*\)$/i);
  if (m) {
    const a = (m[4] === undefined ? 1 : +m[4]) * alpha;
    return `rgba(${+m[1]},${+m[2]},${+m[3]},${+a.toFixed(4)})`;
  }
  return c;
}

function spectral(ctx, x0, y0, x1, y1, alpha) {
  const T = tokens();
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  const a = alpha === undefined ? 1 : alpha;
  g.addColorStop(0, a === 1 ? T.violet : rgba(T.violet, a));
  g.addColorStop(0.38, a === 1 ? T.cyan : rgba(T.cyan, a));
  g.addColorStop(0.74, a === 1 ? T.lime : rgba(T.lime, a));
  g.addColorStop(1, a === 1 ? T.rose : rgba(T.rose, a));
  return g;
}

/* ---- canvas primitives -------------------------------------------------- */

/** .5 offset so a 1px stroke lands on one physical pixel row at DPR 1. */
function hair(v) {
  return Math.round(v) + 0.5;
}

function hline(ctx, x0, x1, y, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 1;
  ctx.beginPath();
  ctx.moveTo(x0, y);
  ctx.lineTo(x1, y);
  ctx.stroke();
}

function vline(ctx, x, y0, y1, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 1;
  ctx.beginPath();
  ctx.moveTo(x, y0);
  ctx.lineTo(x, y1);
  ctx.stroke();
}

function line(ctx, x0, y0, x1, y1, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 1;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
}

function outline(ctx, x, y, w, h, color) {
  const xi = Math.round(x);
  const yi = Math.round(y);
  const wi = Math.round(w);
  const hi = Math.round(h);
  if (wi < 1 || hi < 1) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(xi + 0.5, yi + 0.5, Math.max(1, wi - 1), Math.max(1, hi - 1));
}

function diamond(ctx, cx, cy, r, fill, stroke) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function text(ctx, value, x, y, opt) {
  if (value === null || value === undefined || value === '') return;
  const o = opt || {};
  ctx.save();
  ctx.font = o.font || mono(12);
  ctx.fillStyle = o.color || tokens().mute;
  ctx.textAlign = o.align || 'left';
  ctx.textBaseline = o.baseline || 'alphabetic';
  if (o.tracking) {
    try {
      ctx.letterSpacing = o.tracking;
    } catch (e) {
      /* older canvas implementation: tracking is decorative */
    }
  }
  ctx.fillText(String(value), x, y);
  ctx.restore();
}

function measure(ctx, value, font) {
  ctx.save();
  ctx.font = font;
  const w = ctx.measureText(String(value)).width;
  ctx.restore();
  return w;
}

/** Truncate with an ellipsis to maxW. */
function fit(ctx, value, maxW, font) {
  const s = str(value);
  if (!s) return '';
  ctx.save();
  ctx.font = font;
  if (ctx.measureText(s).width <= maxW) {
    ctx.restore();
    return s;
  }
  let lo = 0;
  let hi = s.length;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (ctx.measureText(s.slice(0, mid) + '…').width <= maxW) lo = mid;
    else hi = mid - 1;
  }
  ctx.restore();
  return lo > 0 ? s.slice(0, lo) + '…' : '';
}

/** Word wrap (CJK chunks fall back to per-character wrap), max maxLines. */
function wrapText(ctx, value, maxW, maxLines, font) {
  const clean = str(value);
  if (!clean) return [];
  ctx.save();
  ctx.font = font;
  const words = clean.split(' ');
  const lines = [];
  let current = '';
  let truncated = false;

  const push = () => {
    if (current) {
      lines.push(current);
      current = '';
    }
  };

  for (let wi = 0; wi < words.length && !truncated; wi++) {
    const word = words[wi];
    const cand = current ? current + ' ' + word : word;
    if (ctx.measureText(cand).width <= maxW) {
      current = cand;
      continue;
    }
    if (current) {
      push();
      if (lines.length >= maxLines) {
        truncated = true;
        break;
      }
    }
    if (ctx.measureText(word).width <= maxW) {
      current = word;
      continue;
    }
    let chunk = '';
    for (const ch of word) {
      if (chunk && ctx.measureText(chunk + ch).width > maxW) {
        lines.push(chunk);
        chunk = ch;
        if (lines.length >= maxLines) {
          truncated = true;
          break;
        }
      } else {
        chunk += ch;
      }
    }
    if (truncated) break;
    current = chunk;
  }
  if (!truncated) push();
  if (lines.length > maxLines) {
    lines.length = maxLines;
    truncated = true;
  }
  if (truncated && lines.length) {
    let last = lines[lines.length - 1];
    while (last && ctx.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    lines[lines.length - 1] = last + '…';
  }
  ctx.restore();
  return lines;
}

function drawLines(ctx, lines, x, y, leading, opt) {
  lines.forEach((l, i) => text(ctx, l, x, y + i * leading, opt));
}

/* ---- deterministic hash / rng (sigil) ----------------------------------- */

function hashSeed(source) {
  const s = String(source);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------------------------------------------------------------------------
   2. data intake — JSON attribute first, table fallback, tolerant normaliser
   ------------------------------------------------------------------------ */

function makeItem(raw, index) {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') raw = { value: raw };
  else if (typeof raw === 'string') raw = { label: raw, seed: raw };
  else if (Array.isArray(raw)) raw = { label: raw[0], value: raw[1], sub: raw[2], key: raw[3] };
  if (typeof raw !== 'object') return null;

  const role = firstVal(raw.role, raw.detail, raw.description, raw.title);
  const highlight = truthy(
    firstVal(
      raw.hi,
      raw.first,
      raw.current,
      raw.author_role === 'first' ? true : undefined,
      raw.author_role === 'cofirst' ? true : undefined,
      raw.highlight
    )
  );

  const item = {
    raw: raw,
    index: index,
    label: str(firstVal(raw.label, raw.year, raw.tag, raw.name, raw.axis, raw.date, raw.period, raw.title)),
    labelZh: str(firstVal(raw.labelZh, raw.tagZh, raw.yearZh, raw.nameZh)),
    value: num(firstVal(raw.value, raw.count, raw.citations, raw.citation_count, raw.n, raw.weight, raw.score, raw.total, raw.v)),
    sub: str(firstVal(raw.sub, raw.venue, raw.venue_short, raw.org, raw.organization, raw.institution, raw.category, raw.type)),
    subZh: str(firstVal(raw.subZh, raw.venueZh, raw.orgZh, raw.institutionZh, raw.categoryZh)),
    role: str(role),
    roleZh: str(firstVal(raw.roleZh, raw.detailZh, raw.descriptionZh)),
    title: str(firstVal(raw.title, raw.name, raw.label)),
    titleZh: str(firstVal(raw.titleZh, raw.nameZh)),
    key: str(firstVal(raw.key, raw.doi, raw.id)),
    short: str(firstVal(raw.short, raw.abbr, raw.short_label)),
    year: num(firstVal(raw.year, raw.start, raw.start_year)),
    seed: str(firstVal(raw.seed, raw.id, raw.name, raw.label)),
    hi: highlight,
  };
  return item;
}

/** Bilingual field selector: sub / subZh, role / roleZh, label / labelZh. */
function loc(item, field, zh) {
  if (!item) return '';
  if (zh) {
    const zhField = field + 'Zh';
    if (item[zhField]) return item[zhField];
  }
  return item[field] || '';
}

function normaliseRoot(root) {
  if (root === null || root === undefined) return [];
  if (Array.isArray(root)) return root;
  if (typeof root === 'string' || typeof root === 'number') return [root];
  if (typeof root === 'object') {
    if (root.seed !== undefined || root.label !== undefined || root.value !== undefined) return [root];
    const keys = ['items', 'rows', 'data', 'values', 'axes', 'nodes', 'series', 'entries', 'points'];
    for (const k of keys) {
      if (Array.isArray(root[k])) return root[k];
    }
    const entries = Object.entries(root);
    if (entries.length && entries.every(([, v]) => num(v) !== null)) {
      return entries.map(([label, value]) => ({ label: label, value: value }));
    }
    return [root];
  }
  return [];
}

function mapHeader(h) {
  if (/citation|引用|count|数量|posts|篇|value|值|权重/.test(h)) return 'value';
  if (/year|年份|时间|date|开始|起始/.test(h)) return 'label';
  if (/venue|期刊|会议|来源|所在/.test(h)) return 'sub';
  if (/doi|key|id|链接/.test(h)) return 'key';
  if (/title|标题|名称|题目/.test(h)) return 'title';
  if (/role|角色|职位|内容|detail/.test(h)) return 'role';
  if (/author|作者|first|一作/.test(h)) return 'author_role';
  if (/tag|标签|topic|主题|方向|axis|机构|org/.test(h)) return 'label';
  return h;
}

function readTable(table) {
  if (!table) return null;
  const rows = Array.prototype.slice.call(table.querySelectorAll('tr'));
  if (!rows.length) return null;
  let headerRow = null;
  let headers = null;
  for (const tr of rows) {
    const ths = tr.querySelectorAll('th');
    if (ths.length && !tr.querySelector('td')) {
      headerRow = tr;
      headers = Array.prototype.map.call(ths, (c) => c.textContent.replace(/\s+/g, ' ').trim().toLowerCase());
      break;
    }
  }

  const items = [];
  for (const tr of rows) {
    if (tr === headerRow) continue;
    const cells = Array.prototype.filter.call(tr.children, (c) => c.tagName === 'TD' || c.tagName === 'TH');
    if (!cells.length) continue;
    const values = cells.map((c) => c.textContent.replace(/\s+/g, ' ').trim());
    if (!values.some(Boolean)) continue;

    if (headers) {
      const obj = {};
      headers.forEach((h, i) => {
        if (i < values.length) obj[mapHeader(h)] = values[i];
      });
      items.push(obj);
      continue;
    }

    const label = values[0];
    let value = null;
    let sub = '';
    let key = '';
    for (let i = 1; i < values.length; i++) {
      const n = num(values[i]);
      if (value === null && n !== null && !/[a-z]{2,}/i.test(values[i])) {
        value = n;
        continue;
      }
      if (!sub) {
        sub = values[i];
        continue;
      }
      if (!key && /(10\.\d{4,9}\/|\/|doi)/i.test(values[i])) key = values[i];
    }
    items.push({ label: label, value: value, sub: sub, key: key });
  }
  return items.length ? items : null;
}

function tableFrom(figure) {
  let table = figure.querySelector('table[data-viz-table]');
  if (table) return table;
  const noscript = figure.querySelector('noscript');
  if (noscript && /<table/i.test(noscript.textContent || '')) {
    try {
      const doc = new DOMParser().parseFromString(noscript.textContent, 'text/html');
      table = doc.querySelector('table[data-viz-table]') || doc.querySelector('table');
      if (table) return table;
    } catch (e) {
      /* fall through */
    }
  }
  return null;
}

function parseData(figure, type) {
  const raw = figure.getAttribute('data-viz-data');
  if (raw !== null && raw.trim() !== '') {
    try {
      return normaliseRoot(JSON.parse(raw));
    } catch (e) {
      if (type === 'sigil') return [{ label: raw.trim(), seed: raw.trim() }];
      /* malformed JSON: try the table fallback instead of throwing */
    }
  }
  const table = tableFrom(figure);
  if (table) {
    const items = readTable(table);
    if (items) return normaliseRoot(items);
  }
  return [];
}

/* ---------------------------------------------------------------------------
   3. renderers
   ------------------------------------------------------------------------ */

const L10N = {
  zh: {
    noData: '暂无数据',
    citations: '次引用',
    posts: '篇',
    first: '第一作者',
    cofirst: '共同第一作者',
    directions: '研究方向',
    signal: '滚动速度 · 实时信号',
    hint: '方向键查看数据',
  },
  en: {
    noData: 'NO DATA',
    citations: 'CITATIONS',
    posts: 'POSTS',
    first: 'FIRST AUTHOR',
    cofirst: 'CO-FIRST AUTHOR',
    directions: 'RESEARCH DIRECTIONS',
    signal: 'SCROLL VELOCITY · LIVE',
    hint: 'Arrow keys inspect data',
  },
};

function l10n() {
  return isZh() ? L10N.zh : L10N.en;
}

/* ---- in-figure header: metric + source left, total / scale right --------- */

function chartHead(g, inst, cfg) {
  const { ctx, w, T } = g;
  const fig = inst.fig;
  const metric = str(fig.getAttribute('data-viz-metric') || cfg.metric || '').toUpperCase();
  const source = str(fig.getAttribute('data-viz-source') || cfg.source || '');
  const total = str(fig.getAttribute('data-viz-total') || cfg.total || '');
  const y = 13;
  const headFont = mono(12, 500);
  const rightW = total ? measure(ctx, total, headFont) : 0;
  const left = [metric, source].filter(Boolean).join(' · ');
  const leftText = fit(ctx, left, Math.max(40, w - rightW - 22), headFont);
  text(ctx, leftText, 4, y, {
    font: headFont,
    color: T.mute,
    tracking: '0.07em',
  });
  if (total) {
    text(ctx, total, w - 4, y, {
      align: 'right',
      font: headFont,
      color: T.paper,
      tracking: '0.04em',
    });
  }
  hline(ctx, 0, w, hair(y + 9), T.line1);
  return y + 9;
}


/** data-viz-h is an exact cap when it is above the chart's structural floor;
 *  legacy values below the floor (older, pre-header layouts) are ignored so a
 *  chart can never clip its own axis header. */
function heightWithCap(fig, ideal, minViable) {
  const cap = num(fig && fig.getAttribute('data-viz-h'));
  if (cap && cap >= minViable && cap < ideal) return cap;
  return ideal;
}
function drawNoData(g, topOffset) {
  const { ctx, w, h, T, lang } = g;
  const pad = 8;
  const top = (topOffset || 0) + Math.min(18, (h - (topOffset || 0)) * 0.18);
  const bottom = h - Math.min(22, h * 0.2);
  for (let i = 0; i <= 3; i++) {
    const y = hair(lerp(top, bottom, i / 3));
    hline(ctx, pad, w - pad, y, i === 0 || i === 3 ? T.line2 : T.line1);
  }
  for (let i = 1; i < 5; i++) {
    vline(ctx, hair(lerp(pad, w - pad, i / 5)), hair(top), hair(bottom), T.line1);
  }
  const L = L10N[lang];
  text(ctx, L.noData, w / 2, h / 2 + 3, {
    align: 'center',
    baseline: 'middle',
    font: mono(12),
    color: T.mute,
    tracking: '0.14em',
  });
}

/* ---- spine -------------------------------------------------------------- */

function spineYear(item) {
  if (item.year !== null && item.year >= 1900 && item.year <= 2200) return Math.round(item.year);
  const m = String(item.label).match(/(19|20)\d{2}/);
  return m ? +m[0] : null;
}

const SPINE = {
  interactive: true,
  introMs: 800,

  model(items) {
    const rows = items.map(makeItem).filter(Boolean).filter((r) => r.label || r.value !== null);
    const withYear = rows.map((r) => ({ item: r, year: spineYear(r) }));
    const known = withYear.map((r) => r.year).filter((y) => y !== null);
    if (!withYear.length) return { groups: [], max: 0, rows: withYear, categorical: false };

    if (!known.length) {
      const groups = withYear.map((r, i) => ({
        year: r.item.label || String(i + 1),
        rows: [r.item],
        categorical: true,
      }));
      const max = Math.max(1, ...rows.map((r) => Math.max(0, r.value || 0)));
      return { groups: groups, max: max, rows: withYear, categorical: true };
    }

    const lo = Math.min.apply(null, known);
    const hi = Math.max.apply(null, known);
    let groups = [];
    if (hi - lo <= 8) {
      for (let y = lo; y <= hi; y++) groups.push({ year: String(y), rows: [], categorical: false });
    } else {
      Array.from(new Set(known))
        .sort((a, b) => a - b)
        .forEach((y) => groups.push({ year: String(y), rows: [], categorical: false }));
    }
    withYear.forEach((r) => {
      const year = r.year === null ? hi : r.year;
      let group = null;
      for (const g of groups) {
        if (+g.year === year) {
          group = g;
          break;
        }
      }
      (group || groups[groups.length - 1]).rows.push(r.item);
    });
    const max = Math.max(1, ...rows.map((r) => Math.max(0, r.value || 0)));
    return { groups: groups, max: max, rows: withYear, categorical: false };
  },

  height(model, w, fig) {
    if (!model.groups.length) return 190;
    return heightWithCap(fig, clamp(Math.round(w * 0.78), 300, 330), 260);
  },

  draw(g, inst) {
    const { ctx, w, h, T, lang, hover, elapsed } = g;
    const model = inst.model;
    const total = model.rows.reduce(function (sum, wrap) {
      const value = wrap && wrap.item ? wrap.item.value : wrap && wrap.value;
      return sum + Math.max(0, value || 0);
    }, 0);
    const headBottom = chartHead(g, inst, {
      metric: 'CITATIONS',
      source: 'CROSSREF',
      total: 'TOTAL ' + fmt(total),
    });
    if (!model.groups.length) {
      drawNoData(g, headBottom);
      inst.hits = [];
      return;
    }

    const padL = 6;
    const padR = 46;
    const top = headBottom + 18;
    const baseline = h - 32;
    const plotH = baseline - top;
    const max = model.max;
    const L = L10N[lang];

    /* light line-1 gridline set (0 · 25 · 50 · 75 · 100 %) */
    for (let i = 0; i <= 4; i++) {
      const y = baseline - (plotH * i) / 4;
      hline(ctx, padL, w - padR, hair(y), i === 0 ? T.line2 : T.line1);
      if (i > 0) {
        text(ctx, fmt((max * i) / 4), w - 14, Math.floor(y) + 4, {
          align: 'right',
          font: mono(12),
          color: T.mute,
          tracking: '0.02em',
        });
      }
    }

    /* the v3 seam: one gradient across the plot; each hi bar takes its slice */
    const seam = spectral(ctx, padL, baseline, w - padR, top);

    const gap = 12;
    const innerW = w - padL - padR - gap * (model.groups.length - 1);
    const bandW = innerW / model.groups.length;
    const hits = [];
    let order = 0;

    model.groups.forEach(function (group, gi) {
      const bandX = padL + gi * (bandW + gap);
      const n = group.rows.length;
      if (n) {
        const barGap = 4;
        const barW = Math.max(3, Math.min(14, Math.floor((bandW - 10 - (n - 1) * barGap) / n)));
        const pitch = barW + barGap;
        const groupW = n * barW + (n - 1) * barGap;
        const startX = Math.round(bandX + (bandW - groupW) / 2);

        group.rows.forEach(function (item, ri) {
          const x = startX + ri * pitch;
          const value = Math.max(0, item.value || 0);
          const fullH = value <= 0 ? 0 : Math.max(2, (value / max) * plotH);
          const appear = easeOut(clamp((elapsed - 80 - order * 22) / 520, 0, 1));
          const barH = fullH > 0 ? Math.max(2, Math.round(fullH * appear)) : 0;
          const y = baseline - barH;
          const isHover = hover === order;

          if (value <= 0) {
            /* zero citations: a single hard tick on the baseline, never a tube */
            hline(ctx, x, x + barW, hair(baseline - 1), item.hi ? seam : rgba(T.paper, 0.34));
          } else if (item.hi) {
            ctx.fillStyle = seam;
            ctx.fillRect(x, y, barW, barH);
            hline(ctx, x, x + barW, hair(y), rgba(T.paper, 0.92));
          } else {
            outline(ctx, x, y, barW, barH, rgba(T.paper, 0.42));
            hline(ctx, x, x + barW, hair(y), rgba(T.paper, 0.92));
          }

          if (isHover) {
            vline(ctx, hair(x + barW / 2), hair(top - 4), hair(baseline + 4), T.line3);
            outline(ctx, x - 1, Math.max(top - 1, y - 1), barW + 2, barH + 2, T.paper);
          }

          /* value labels above the bars — mono, paper, 12px floor */
          if (appear > 0.92 && value > 0 && pitch >= 15) {
            const label = fmt(value);
            const labelFont = mono(12, 500);
            text(ctx, label, x + barW / 2, y - 6, {
              align: 'center',
              font: labelFont,
              color: isHover ? T.paper : item.hi ? T.paper : T.paper2,
            });
          } else if (appear > 0.92 && value <= 0 && pitch >= 15) {
            /* zeros are data too: name them so a base tick is not read as a scale mark */
            text(ctx, '0', x + barW / 2, baseline - 8, {
              align: 'center',
              font: mono(12),
              color: isHover ? T.paper : T.mute,
            });
          }

          hits.push({
            x: x - 3,
            y: Math.min(y || baseline - 8, baseline - 8) - 3,
            w: Math.max(6, barW + 6),
            h: Math.max(14, barH + 14),
            cx: x + barW / 2,
            cy: Math.max(top + 6, (y || baseline) - 4),
            item: item,
            index: order,
          });
          order++;
        });
      }

      const cx = bandX + bandW / 2;
      vline(ctx, hair(cx), hair(baseline), hair(baseline + 6), T.line2);
      text(ctx, group.year, cx, baseline + 20, {
        align: 'center',
        font: mono(12),
        color: n ? T.paper : T.mute,
        tracking: '0.04em',
      });
    });

    inst.hits = hits;
  },

  tip(item, zh) {
    const L = L10N[zh ? 'zh' : 'en'];
    const title = item.title || item.label;
    const meta = [item.sub, item.label, item.hi ? (item.raw.author_role === 'cofirst' ? L.cofirst : L.first) : '']
      .filter(Boolean)
      .join(' · ');
    const value = `${fmt(item.value || 0)} ${L.citations}`;
    return [title, meta, value].filter(Boolean);
  },

  aria(model, zh) {
    const parts = model.groups
      .map((gr) => gr.year + ': ' + (gr.rows.length ? gr.rows.map((r) => fmt(r.value || 0)).join(', ') : '0'))
      .slice(0, 10);
    return (zh ? '引用年份 ' : 'CITATIONS BY YEAR ') + parts.join(' · ');
  },
};

/* ---- timeline ----------------------------------------------------------- */

function timelineYear(item) {
  if (item.year !== null && item.year >= 1900 && item.year <= 2200) return Math.round(item.year);
  const m = String(firstVal(item.label, item.role, item.sub)).match(/(19|20)\d{2}/);
  return m ? +m[0] : null;
}

const TIMELINE = {
  interactive: true,
  introMs: 760,

  model(items) {
    const rows = items.map(makeItem).filter(Boolean).filter((r) => r.label || r.sub || r.role);
    rows.forEach((r) => {
      r._year = timelineYear(r);
    });
    const known = rows.map((r) => r._year).filter((y) => y !== null);
    rows.sort((a, b) => {
      if (a._year !== null && b._year !== null) return a._year - b._year;
      return a.index - b.index;
    });
    let lo = 0;
    let hi = 0;
    if (known.length) {
      lo = Math.min.apply(null, known);
      hi = Math.max.apply(null, known);
    }
    return { rows: rows, lo: lo, hi: hi, categorical: !known.length, span: hi - lo };
  },

  height(model, w, fig) {
    if (!model.rows.length) return 160;
    if (w < 560) return heightWithCap(fig, 30 + model.rows.length * 74, 160);
    return heightWithCap(fig, 140, 120);
  },

  draw(g, inst) {
    const { ctx, w, h, T, hover, elapsed, lang } = g;
    const model = inst.model;
    const rows = model.rows;
    const zh = lang === 'zh';
    const headBottom = chartHead(g, inst, {
      metric: 'POSITIONS',
      source: 'CV',
      total: String(rows.length).padStart(2, '0') + ' NODES',
    });
    if (!rows.length) {
      drawNoData(g, headBottom);
      inst.hits = [];
      return;
    }

    const nodeMark = function (x, y, current, isHover) {
      if (current) {
        const fill = spectral(ctx, x - 3, y - 3, x + 3, y + 3);
        ctx.fillStyle = fill;
        ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
        outline(ctx, x - 3, y - 3, 6, 6, rgba(T.paper, 0.85));
      } else {
        ctx.fillStyle = rgba(T.paper, isHover ? 0.95 : 0.72);
        ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      }
      if (isHover) outline(ctx, x - 5, y - 5, 10, 10, T.paper);
    };

    /* ---- vertical mode for narrow panels -------------------------------- */
    if (w < 560) {
      const lineX = 14;
      const top = headBottom + 16;
      const rowH = 74;
      const ruleP = easeOut(clamp((elapsed - 40) / 520, 0, 1));
      if (ruleP > 0) {
        vline(ctx, hair(lineX), hair(top - 8), hair(top - 8 + rows.length * rowH * ruleP), T.line2);
      }

      const hits = [];
      const cellW = Math.max(80, w - lineX - 24);
      rows.forEach(function (row, i) {
        const y = top + i * rowH + 8;
        const p = easeOut(clamp((elapsed - 120 - i * 60) / 420, 0, 1));
        if (p <= 0) return;
        const current = row.hi;
        const isHover = hover === i;
        const yearLabel = row.label || (row._year !== null ? String(row._year) : '');
        const yearFont = mono(12, current ? 500 : 400);
        const orgFont = display(14, current ? 550 : 450);
        const roleFont = mono(12);

        ctx.save();
        ctx.globalAlpha = p;
        text(ctx, fit(ctx, yearLabel, cellW, yearFont), lineX + 15, y - 7, {
          font: yearFont,
          color: T.paper,
          tracking: '0.04em',
        });
        nodeMark(lineX, y, current, isHover);
        text(ctx, fit(ctx, loc(row, 'sub', zh), cellW, orgFont), lineX + 15, y + 14, {
          font: orgFont,
          color: T.paper,
        });
        const roleLines = wrapText(ctx, loc(row, 'role', zh), cellW, 2, roleFont);
        drawLines(ctx, roleLines, lineX + 15, y + 29, 14, {
          font: roleFont,
          color: T.paper2,
        });
        ctx.restore();

        if (isHover) hline(ctx, lineX + 5, w - 2, hair(y), T.line2);
        hits.push({ cx: lineX, cy: y, r: 26, ax: lineX + 15, ay: y - 8, item: row, index: i });
      });
      inst.hits = hits;
      return;
    }

    /* ---- horizontal band ------------------------------------------------ */
    const padL = 24;
    const padR = 24;
    const ruleY = headBottom + 28;
    const xs = rows.map(function (_, i) {
      return rows.length === 1 ? w / 2 : padL + (i / (rows.length - 1)) * (w - padL - padR);
    });

    /* the hard rule draws on once, left → right */
    const ruleP = easeOut(clamp((elapsed - 40) / 520, 0, 1));
    if (ruleP > 0) {
      hline(ctx, padL, padL + (w - padL - padR) * ruleP, hair(ruleY), T.line2);
    }

    const hits = [];
    rows.forEach(function (row, i) {
      const x = xs[i];
      const p = easeOut(clamp((elapsed - 140 - i * 70) / 480, 0, 1));
      if (p <= 0) return;
      const current = row.hi;
      const isHover = hover === i;
      const labelY = ruleY + 24;

      const left = i === 0 ? padL : (xs[i - 1] + x) / 2;
      const right = i === rows.length - 1 ? w - padR : (x + xs[i + 1]) / 2;
      const cellW = Math.max(72, right - left - 12);
      let align = 'center';
      let tx = x;
      if (i === 0) {
        align = 'left';
        tx = padL;
      } else if (i === rows.length - 1) {
        align = 'right';
        tx = w - padR;
      }
      const yearLabel = row.label || (row._year !== null ? String(row._year) : '');
      const yearFont = mono(12, current ? 500 : 400);

      ctx.save();
      ctx.globalAlpha = p;

      /* year above the rule */
      text(ctx, fit(ctx, yearLabel, cellW, yearFont), tx, ruleY - 14, {
        align: align,
        font: yearFont,
        color: T.paper,
        tracking: '0.04em',
      });

      /* 1px tick from label to rule */
      vline(ctx, hair(x), hair(ruleY - 8), hair(ruleY - 2), current ? T.line3 : T.line1);

      nodeMark(x, ruleY, current, isHover);

      /* org + role below */
      const orgFont = display(14, current ? 550 : 450);
      text(ctx, fit(ctx, loc(row, 'sub', zh), cellW, orgFont), tx, labelY, {
        align: align,
        font: orgFont,
        color: T.paper,
      });
      const roleFont = mono(12);
      const roleLines = wrapText(ctx, loc(row, 'role', zh), cellW, 2, roleFont);
      drawLines(ctx, roleLines, tx, labelY + 18, 15, {
        align: align,
        font: roleFont,
        color: T.paper2,
      });

      ctx.restore();

      hits.push({ cx: x, cy: ruleY, r: 24, ax: x, ay: labelY, item: row, index: i });

      if (isHover) {
        vline(ctx, hair(x), hair(headBottom + 8), hair(h - 8), T.line2);
      }
    });

    inst.hits = hits;
  },

  tip(item, zh) {
    const head = [item.label, loc(item, 'sub', zh)].filter(Boolean).join(' · ');
    return [head, loc(item, 'role', zh)].filter(Boolean);
  },

  aria(model, zh) {
    const parts = model.rows.map((r) => [r.label, loc(r, 'sub', zh)].filter(Boolean).join(' ')).slice(0, 6);
    return (zh ? '教育经历时间轴 ' : 'TIMELINE ') + parts.join(' · ');
  },
};

/* ---- radar -------------------------------------------------------------- */

const RADAR = {
  interactive: true,
  introMs: 900,
  maxAxes: 6,

  model(items) {
    let rows = items.map(makeItem).filter(Boolean).filter((r) => r.label);
    if (rows.length > RADAR.maxAxes) rows = rows.slice(0, RADAR.maxAxes);
    const values = rows.map((r) => r.value);
    let peak = 0;
    values.forEach((v) => {
      if (v !== null) peak = Math.max(peak, v);
    });
    let scale = 1;
    if (peak > 1) scale = peak <= 100 ? 100 : peak;
    const fracs = values.map((v) => {
      if (v === null) return 1;
      return clamp(v / scale, 0, 1);
    });
    return { rows: rows, values: values, peak: peak, scale: scale, fracs: fracs };
  },

  height(model, w, fig) {
    if (model.rows.length < 3) return 190;
    return heightWithCap(fig, clamp(Math.round(w * 0.75), 240, 320), 220);
  },

  geom(ctx, model, w, h, headBottom) {
    const n = model.rows.length;
    const font = mono(12);
    let maxSide = 20;
    const angles = [];
    for (let i = 0; i < n; i++) angles.push(-Math.PI / 2 + (i * TAU) / n);
    model.rows.forEach((row, i) => {
      const label = (row.short || row.label || '').toUpperCase();
      const tw = measure(ctx, label, font);
      if (Math.abs(Math.cos(angles[i])) > 0.3) maxSide = Math.max(maxSide, tw);
    });
    const sidePad = Math.min(w * 0.34, maxSide + 16);
    const topPad = 34;
    const bottomPad = 30;
    const cx = w / 2;
    const cy = headBottom + (h - headBottom) / 2 + 2;
    const r = Math.max(30, Math.min(cx - sidePad, cy - headBottom - topPad, h - cy - bottomPad));
    return { cx: cx, cy: cy, r: r, angles: angles, font: font, sidePad: sidePad };
  },

  draw(g, inst) {
    const { ctx, w, h, T, hover, elapsed } = g;
    const model = inst.model;
    const rows = model.rows;
    const headBottom = chartHead(g, inst, {
      metric: 'RESEARCH',
      source: 'DIRECTIONS',
      total: String(rows.length).padStart(2, '0') + ' AXES',
    });
    if (rows.length < 3) {
      drawNoData(g, headBottom);
      inst.hits = [];
      return;
    }

    const geo = RADAR.geom(ctx, model, w, h, headBottom);
    const { cx, cy, r, angles, font } = geo;
    const n = rows.length;

    /* grid: four 1px polygons + spokes */
    for (let ring = 1; ring <= 4; ring++) {
      const rr = (r * ring) / 4;
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = angles[i];
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = ring === 4 ? T.line2 : T.line1;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    for (let i = 0; i < n; i++) {
      const a = angles[i];
      line(
        ctx,
        cx,
        cy,
        cx + Math.cos(a) * r,
        cy + Math.sin(a) * r,
        hover === i ? rgba(T.paper, 0.34) : T.line1
      );
    }

    /* centre cross */
    hline(ctx, hair(cx - 3), hair(cx + 3), hair(cy), T.line2);
    vline(ctx, hair(cx), hair(cy - 3), hair(cy + 3), T.line2);

    /* polygon — gradient fill at 10%, 1px gradient stroke */
    const p = easeOut(clamp((elapsed - 120) / 700, 0, 1));
    if (p > 0) {
      const grad = spectral(ctx, cx - r, cy - r, cx + r, cy + r);
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const a = angles[i];
        const rr = r * model.fracs[i] * p;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = spectral(ctx, cx - r, cy - r, cx + r, cy + r, 0.1);
      ctx.fill();
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();

      for (let i = 0; i < n; i++) {
        const a = angles[i];
        const rr = r * model.fracs[i] * p;
        const x = cx + Math.cos(a) * rr;
        const y = cy + Math.sin(a) * rr;
        if (p > 0.94) {
          const s = hover === i ? 4 : 2;
          ctx.fillStyle = hover === i ? T.paper : T.paper2;
          ctx.fillRect(Math.round(x) - s / 2, Math.round(y) - s / 2, s, s);
        }
      }
    }

    /* axis labels */
    const hits = [];
    rows.forEach((row, i) => {
      const a = angles[i];
      const cos = Math.cos(a);
      const sin = Math.sin(a);
      const lx = cx + cos * (r + 12);
      const ly = cy + sin * (r + 12);
      let align = 'center';
      if (cos > 0.28) align = 'left';
      else if (cos < -0.28) align = 'right';
      let baseline = 'middle';
      if (sin < -0.72) {
        baseline = 'bottom';
      } else if (sin > 0.72) {
        baseline = 'top';
      }
      const avail = align === 'left' ? w - lx - 3 : align === 'right' ? lx - 3 : Math.min(w / 2 - 4, 150);
      const label = fit(ctx, (row.short || row.label || '').toUpperCase(), Math.max(28, avail), font);
      text(ctx, label, lx, ly, {
        align: align,
        baseline: baseline,
        font: font,
        color: hover === i ? T.paper : T.paper2,
        tracking: '0.05em',
      });
      hits.push({
        cx: cx + cos * r * model.fracs[i],
        cy: cy + sin * r * model.fracs[i],
        r: 18,
        ax: lx,
        ay: ly,
        item: row,
        index: i,
      });
    });

    inst.hits = hits;
  },

  tip(item, zh) {
    const second = loc(item, 'sub', zh) || (item.value !== null ? fmt(item.value) : '');
    return [item.label, second].filter(Boolean);
  },

  aria(model, zh) {
    const parts = model.rows.map((r) => r.label).slice(0, 6);
    return (zh ? '研究方向雷达图：' : 'RESEARCH DIRECTIONS RADAR: ') + parts.join(' · ');
  },
};

/* ---- topics ------------------------------------------------------------- */

const TOPICS = {
  interactive: true,
  introMs: 720,
  rowH: 26,

  model(items) {
    const rows = items.map(makeItem).filter(Boolean).filter((r) => r.label || r.value !== null);
    const max = Math.max(1, ...rows.map((r) => Math.max(0, r.value || 0)));
    const total = rows.reduce((sum, r) => sum + Math.max(0, r.value || 0), 0);
    return { rows: rows, max: max, total: total };
  },

  height(model, w, fig) {
    if (!model.rows.length) return 150;
    return heightWithCap(fig, 30 + model.rows.length * TOPICS.rowH + 8, 38 + model.rows.length * 20);
  },

  draw(g, inst) {
    const { ctx, w, h, T, lang, hover, elapsed } = g;
    const model = inst.model;
    const rows = model.rows;
    const headBottom = chartHead(g, inst, {
      metric: 'POSTS',
      source: 'ARCHIVE',
      total: 'TOTAL ' + fmt(model.total),
    });
    if (!rows.length) {
      drawNoData(g, headBottom);
      inst.hits = [];
      return;
    }
    const RH = clamp((h - headBottom - 16) / rows.length, 22, TOPICS.rowH);
    const labelFont = mono(12);
    let labelW = 0;
    rows.forEach((r) => {
      labelW = Math.max(labelW, measure(ctx, (r.label || '').toUpperCase(), labelFont));
    });
    const labelCap = Math.max(42, Math.min(Math.round(w * 0.42), labelW + 4));
    const countW = 28;
    const tx0 = labelCap + 10;
    const tx1 = Math.max(tx0 + 24, w - countW - 2);
    const grad = spectral(ctx, tx0, 0, tx1, 0);

    const hits = [];
    rows.forEach((row, i) => {
      const top = headBottom + 8 + i * RH;
      const labelY = top + 12;
      const trackY = top + 18;
      const value = Math.max(0, row.value || 0);
      const p = easeOut(clamp((elapsed - 60 - i * 38) / 460, 0, 1));
      const isHover = hover === i;
      const barW = value > 0 ? Math.max(1.5, (value / model.max) * (tx1 - tx0) * p) : 0;

      const label = fit(ctx, (row.label || '').toUpperCase(), labelCap, labelFont);
      text(ctx, label, 4, labelY, {
        font: labelFont,
        color: isHover ? T.paper : T.paper2,
        tracking: '0.04em',
      });

      hline(ctx, tx0, tx1, hair(trackY), isHover ? T.line3 : T.line1);

      if (barW > 0) {
        ctx.fillStyle = grad;
        ctx.fillRect(tx0, trackY - 3, barW, 3);
      }

      text(ctx, fmt(row.value || 0), w - 4, labelY, {
        align: 'right',
        font: mono(12, 500),
        color: isHover ? T.paper : T.paper,
      });

      if (isHover) {
        vline(ctx, hair(tx0 - 5), hair(top + 2), hair(trackY + 3), T.line2);
      }

      const pct = model.total > 0 ? Math.round((value / model.total) * 100) : 0;
      hits.push({
        x: 0,
        y: top,
        w: w,
        h: RH,
        cx: tx0 + Math.max(barW, 12) / 2,
        cy: trackY - 4,
        item: row,
        index: i,
        extra: pct,
      });
    });

    inst.hits = hits;
  },

  tip(item, zh, hit) {
    const L = L10N[zh ? 'zh' : 'en'];
    const pct = hit && hit.extra !== undefined ? ' · ' + hit.extra + '%' : '';
    return [item.label, fmt(item.value || 0) + ' ' + L.posts + pct];
  },

  aria(model, zh) {
    return (
      (zh ? '主题分布：' : 'TOPIC DISTRIBUTION: ') +
      model.rows
        .slice(0, 10)
        .map((r) => r.label + ' ' + fmt(r.value || 0))
        .join(' · ')
    );
  },
};

/* ---- sigil -------------------------------------------------------------- */

const SIGIL = {
  interactive: false,

  model(items, figure) {
    const item = items.length ? makeItem(items[0]) : null;
    const seed = str(
      firstVal(
        figure && figure.getAttribute('data-viz-seed'),
        item && item.seed,
        item && item.label,
        'sigil'
      )
    );
    return { seed: seed || 'sigil' };
  },

  height(model, w, figure) {
    const forced = num(figure && figure.getAttribute('data-viz-h'));
    if (forced) return forced;
    return clamp(Math.round(w * 0.42), 84, 144);
  },

  draw(g, inst) {
    const { ctx, w, h, T } = g;
    const model = inst.model;
    const seed = model.seed;
    const rand = mulberry32(hashSeed(seed));
    const side = Math.max(48, Math.min(w, h) - 12);
    const left = (w - side) / 2;
    const top = (h - side) / 2;
    const cx = left + side / 2;
    const cy = top + side / 2;

    /* deterministic composition: quarter-turn orientation + a few fractions */
    const turn = Math.floor(rand() * 8);
    const rot = (turn * Math.PI) / 4;
    const R = side * 0.355;
    const baseAngles = [-Math.PI / 2, Math.PI / 6, (Math.PI * 5) / 6];
    const pts = baseAngles.map((a) => {
      const aa = a + rot;
      return { x: cx + Math.cos(aa) * R, y: cy + Math.sin(aa) * R };
    });
    const apex = pts[0];
    const p1 = pts[1];
    const p2 = pts[2];
    const baseMid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    const mid = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    const bx = p2.x - p1.x;
    const by = p2.y - p1.y;

    /* registration cut: apex to the square corner it points at */
    const ex = apex.x >= cx ? 1 : -1;
    const ey = apex.y >= cy ? 1 : -1;
    line(ctx, apex.x, apex.y, ex > 0 ? left + side : left, ey > 0 ? top + side : top, T.line1);

    /* corner brackets — the mark's own 1px frame language */
    const bl = side * 0.075;
    line(ctx, left, top, left + bl, top, rgba(T.paper, 0.36));
    line(ctx, left, top, left, top + bl, rgba(T.paper, 0.36));
    line(ctx, left + side, top + side, left + side - bl, top + side, rgba(T.paper, 0.36));
    line(ctx, left + side, top + side, left + side, top + side - bl, rgba(T.paper, 0.36));

    /* primary triangle: 1px outline only */
    ctx.beginPath();
    ctx.moveTo(apex.x, apex.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.strokeStyle = rgba(T.paper, 0.55);
    ctx.lineWidth = 1;
    ctx.stroke();

    /* construction lines clipped to the triangle */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(apex.x, apex.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    ctx.clip();

    const t1 = 0.3 + rand() * 0.08;
    const t2 = 0.58 + rand() * 0.1;
    [t1, t2].forEach(function (t) {
      const p = mid(apex, baseMid, t);
      line(ctx, p.x - bx * 0.72, p.y - by * 0.72, p.x + bx * 0.72, p.y + by * 0.72, rgba(T.paper, 0.2));
    });
    line(ctx, apex.x, apex.y, baseMid.x, baseMid.y, rgba(T.paper, 0.34));

    /* one perpendicular tick on the median */
    const tp = 0.76;
    const tpPt = mid(apex, baseMid, tp);
    const nx = -(baseMid.y - apex.y);
    const ny = baseMid.x - apex.x;
    const nl = Math.hypot(nx, ny) || 1;
    line(
      ctx,
      tpPt.x - (nx / nl) * side * 0.06,
      tpPt.y - (ny / nl) * side * 0.06,
      tpPt.x + (nx / nl) * side * 0.06,
      tpPt.y + (ny / nl) * side * 0.06,
      rgba(T.paper, 0.16)
    );
    ctx.restore();

    /* one gradient accent — the only fill in the mark */
    const ar = 0.38 + rand() * 0.1;
    const a1 = mid(apex, p1, ar);
    const a2 = mid(apex, p2, ar);
    ctx.beginPath();
    ctx.moveTo(apex.x, apex.y);
    ctx.lineTo(a1.x, a1.y);
    ctx.lineTo(a2.x, a2.y);
    ctx.closePath();
    ctx.fillStyle = spectral(
      ctx,
      Math.min(apex.x, a1.x, a2.x),
      Math.min(apex.y, a1.y, a2.y),
      Math.max(apex.x, a1.x, a2.x),
      Math.max(apex.y, a1.y, a2.y)
    );
    ctx.fill();

    /* a lone measurement tick, chosen by seed, on one edge of the square */
    const edge = Math.floor(rand() * 4);
    const tl = side * 0.11;
    if (edge === 0) line(ctx, left, top + side / 2, left + tl * 0.6, top + side / 2, rgba(T.paper, 0.22));
    else if (edge === 1) line(ctx, left + side, top + side / 2, left + side - tl * 0.6, top + side / 2, rgba(T.paper, 0.22));
    else if (edge === 2) line(ctx, left + side / 2, top, left + side / 2, top + tl * 0.6, rgba(T.paper, 0.22));
    else line(ctx, left + side / 2, top + side, left + side / 2, top + side - tl * 0.6, rgba(T.paper, 0.22));

    inst.hits = [];
  },

  tip() {
    return [];
  },

  aria(model, zh) {
    return (zh ? '程序化图形 · 种子 ' : 'PROCEDURAL MARK · SEED ') + model.seed;
  },
};

/* ---- signal ------------------------------------------------------------- */

const SIGNAL = {
  interactive: false,
  fixedWidth: true,

  model() {
    return { samples: new Array(48).fill(0) };
  },

  height() {
    return 28;
  },

  draw(g, inst) {
    const { ctx, w, h, T, elapsed } = g;
    const samples = inst.model.samples;
    const mid = h / 2;
    const amp = h / 2 - 3;

    hline(ctx, 0, w, hair(mid), T.line1);
    vline(ctx, hair(0), hair(mid - 2), hair(mid + 2), T.line3);

    ctx.beginPath();
    for (let i = 0; i < samples.length; i++) {
      const x = (i / (samples.length - 1)) * w;
      const y = mid - clamp(samples[i], -1, 1) * amp;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = spectral(ctx, 0, 0, w, 0, 0.92);
    ctx.lineWidth = 1;
    ctx.stroke();

    /* newest sample head */
    const last = clamp(samples[samples.length - 1], -1, 1);
    ctx.fillStyle = T.paper;
    ctx.fillRect(w - 2, mid - last * amp - 1, 2, 2);
    inst.hits = [];
  },

  tip() {
    return [];
  },

  aria(model, zh) {
    return zh ? '滚动速度实时示波器' : 'LIVE SCROLL VELOCITY OSCILLOSCOPE';
  },
};

/* ---------------------------------------------------------------------------
   4. mounting + lifecycle
   ------------------------------------------------------------------------ */

const TYPES = {
  spine: SPINE,
  timeline: TIMELINE,
  radar: RADAR,
  topics: TOPICS,
  sigil: SIGIL,
  signal: SIGNAL,
};

const INSTANCES = [];
const SEEN = typeof WeakSet === 'function' ? new WeakSet() : null;

function figureWidth(inst) {
  const fig = inst.fig;
  const cs = getComputedStyle(fig);
  const pl = parseFloat(cs.paddingLeft) || 0;
  const pr = parseFloat(cs.paddingRight) || 0;
  const raw = fig.clientWidth - pl - pr;
  if (TYPES[inst.type].fixedWidth) {
    const fixed = parseFloat(fig.getAttribute('data-viz-w')) || 96;
    return Math.max(24, Math.min(fixed, raw || fixed));
  }
  return Math.max(24, raw);
}

function fitCanvas(inst, w, h) {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const bw = Math.max(1, Math.round(w * dpr));
  const bh = Math.max(1, Math.round(h * dpr));
  const canvas = inst.canvas;
  if (canvas.width !== bw) canvas.width = bw;
  if (canvas.height !== bh) canvas.height = bh;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  inst.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  inst.w = w;
  inst.h = h;
  inst.dpr = dpr;
}

function render(inst, elapsed) {
  const spec = TYPES[inst.type];
  const w = figureWidth(inst);
  if (w < 24) return;
  const h = Math.max(24, Math.round(spec.height(inst.model, w, inst.fig)));
  const t0 = performance.now();
  fitCanvas(inst, w, h);
  const ctx = inst.ctx;
  ctx.clearRect(0, 0, w, h);
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  const g = {
    ctx: ctx,
    w: w,
    h: h,
    T: tokens(),
    lang: isZh() ? 'zh' : 'en',
    hover: inst.hover,
    elapsed: elapsed === undefined ? 1e9 : elapsed,
  };
  spec.draw(g, inst);
  inst.drawMs = performance.now() - t0;
  if (window.__viz) {
    window.__viz.lastDrawMs = +inst.drawMs.toFixed(3);
    window.__viz.maxDrawMs = Math.max(window.__viz.maxDrawMs || 0, inst.drawMs);
  }
}

function hideTip(inst) {
  if (!inst.tip) return;
  inst.tip.setAttribute('data-on', '0');
  inst.tipIndex = -1;
}

function showTip(inst, index, x, y) {
  const spec = TYPES[inst.type];
  const hit = (inst.hits || []).find((h) => h.index === index);
  if (!spec.tip || !hit) {
    hideTip(inst);
    return;
  }
  const lines = spec.tip(hit.item, isZh(), hit);
  if (!lines || !lines.length) {
    hideTip(inst);
    return;
  }
  const tip = inst.tip;
  while (tip.firstChild) tip.removeChild(tip.firstChild);
  lines.forEach((ln, i) => {
    const el = document.createElement(i === 0 ? 'b' : 'span');
    el.textContent = ln;
    tip.appendChild(el);
  });
  tip.setAttribute('data-on', '1');
  tip.style.visibility = 'visible';

  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;
  const fw = inst.fig.clientWidth;
  const fh = inst.fig.clientHeight;
  const ax = x === undefined ? hit.cx : x;
  const ay = y === undefined ? hit.cy : y;
  let left = clamp(ax - tw / 2, 4, Math.max(4, fw - tw - 4));
  let top = ay - th - 10;
  if (top < 2) top = ay + 12;
  if (top + th > fh - 2) top = Math.max(2, fh - th - 2);
  tip.style.left = Math.round(left) + 'px';
  tip.style.top = Math.round(top) + 'px';
  inst.tipIndex = index;
}

function emitFocus(inst, item) {
  if (inst.type !== 'spine') return;
  const key = item && item.key ? item.key : null;
  if (inst.focusKey === key) return;
  inst.focusKey = key;
  try {
    document.dispatchEvent(new CustomEvent('sp:focus', { detail: { key: key }, bubbles: true }));
  } catch (e) {
    /* no runtime listening */
  }
}

function setHover(inst, index, opts) {
  const o = opts || {};
  const spec = TYPES[inst.type];
  if (!spec.interactive) return;
  if (index === inst.hover) {
    if (index >= 0 && inst.tipIndex !== index) showTip(inst, index);
    return;
  }
  if (inst.animId) {
    cancelAnimationFrame(inst.animId);
    inst.animId = 0;
    inst.animStarted = true;
  }
  inst.hover = index;
  render(inst, 1e9);
  if (index >= 0) {
    showTip(inst, index);
    const hit = (inst.hits || []).find((h) => h.index === index);
    if (hit && inst.type === 'spine') emitFocus(inst, hit.item);
  } else {
    hideTip(inst);
    if (inst.type === 'spine') emitFocus(inst, null);
  }
  if (o.focus && inst.fig.focus) {
    /* focus was already on the figure; nothing else to do */
  }
}

function hitTest(inst, x, y) {
  const hits = inst.hits || [];
  for (let i = hits.length - 1; i >= 0; i--) {
    const h = hits[i];
    if (h.r !== undefined) {
      const dx = x - h.cx;
      const dy = y - h.cy;
      if (dx * dx + dy * dy <= h.r * h.r) return h.index;
    } else if (x >= h.x && x <= h.x + h.w && y >= h.y && y <= h.y + h.h) {
      return h.index;
    }
  }
  return -1;
}

function pointerPos(inst, ev) {
  const rect = inst.canvas.getBoundingClientRect();
  const sx = rect.width ? inst.w / rect.width : 1;
  const sy = rect.height ? inst.h / rect.height : 1;
  return { x: (ev.clientX - rect.left) * sx, y: (ev.clientY - rect.top) * sy };
}

function bindInteraction(inst) {
  const spec = TYPES[inst.type];
  if (!spec.interactive) return;
  const canvas = inst.canvas;

  canvas.addEventListener(
    'pointermove',
    function (ev) {
      if (ev.pointerType === 'touch') return;
      const pos = pointerPos(inst, ev);
      const idx = hitTest(inst, pos.x, pos.y);
      setHover(inst, idx);
      canvas.style.cursor = idx >= 0 ? 'crosshair' : 'default';
    },
    { passive: true }
  );

  canvas.addEventListener(
    'pointerdown',
    function (ev) {
      const pos = pointerPos(inst, ev);
      const idx = hitTest(inst, pos.x, pos.y);
      if (idx >= 0) {
        setHover(inst, idx);
        if (inst.fig.focus) inst.fig.focus({ preventScroll: true });
      }
    },
    { passive: true }
  );

  canvas.addEventListener('pointerleave', function () {
    setHover(inst, -1);
  });

  inst.fig.addEventListener('focus', function () {
    if (!inst.started) startIntro(inst);
    if (inst.hover < 0 && lib_hits(inst)) setHover(inst, 0);
  });

  inst.fig.addEventListener('blur', function () {
    if (inst.hover >= 0) setHover(inst, -1);
  });

  inst.fig.addEventListener('keydown', function (ev) {
    const hits = inst.hits || [];
    if (!hits.length) return;
    let next = -1;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = (inst.hover + 1) % hits.length;
    else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = (inst.hover - 1 + hits.length) % hits.length;
    else if (ev.key === 'Home') next = 0;
    else if (ev.key === 'End') next = hits.length - 1;
    else if (ev.key === 'Escape') {
      setHover(inst, -1);
      return;
    }
    if (next < 0) return;
    ev.preventDefault();
    setHover(inst, next);
  });
}

function lib_hits(inst) {
  return !!(inst.hits && inst.hits.length);
}

function ensureAria(inst) {
  const fig = inst.fig;
  if (!fig.hasAttribute('role')) fig.setAttribute('role', 'img');
  if (!fig.getAttribute('aria-label')) {
    const summary = TYPES[inst.type].aria(inst.model, isZh());
    if (summary) fig.setAttribute('aria-label', summary);
  }
  if (TYPES[inst.type].interactive && !fig.hasAttribute('tabindex')) {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('aria-keyshortcuts', 'ArrowLeft ArrowRight Home End Escape');
  }
}

function mount(figure) {
  const type = (figure.getAttribute('data-viz') || '').toLowerCase();
  const spec = TYPES[type];
  if (!spec) return null;

  let items = [];
  try {
    items = parseData(figure, type);
  } catch (e) {
    items = [];
  }

  const model = spec.model(items, figure);

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.display = 'block';
  canvas.style.maxWidth = '100%';
  canvas.style.borderRadius = '0';

  const tip = document.createElement('div');
  tip.setAttribute('data-viz-tip', '');
  tip.setAttribute('data-on', '0');
  tip.setAttribute('aria-hidden', 'true');

  const first = figure.firstChild;
  if (first) figure.insertBefore(canvas, first);
  else figure.appendChild(canvas);
  figure.appendChild(tip);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    tip.remove();
    return null;
  }

  const inst = {
    fig: figure,
    canvas: canvas,
    ctx: ctx,
    tip: tip,
    type: type,
    items: items,
    model: model,
    hover: -1,
    tipIndex: -1,
    focusKey: undefined,
    hits: [],
    w: 0,
    h: 0,
    dpr: 1,
    started: false,
    startedAt: 0,
    animId: 0,
    animStarted: false,
    drawMs: 0,
    ro: null,
    io: null,
    disposed: false,
  };

  INSTANCES.push(inst);
  ensureAria(inst);
  bindInteraction(inst);

  /* pre-animation frame: grid + rules are already drawn, bars are at zero */
  render(inst, REDUCED.matches ? 1e9 : 0);

  if (type === 'signal') {
    mountSignal(inst);
    return inst;
  }

  if (typeof ResizeObserver === 'function') {
    let scheduled = 0;
    inst.ro = new ResizeObserver(function () {
      if (scheduled || inst.disposed) return;
      scheduled = requestAnimationFrame(function () {
        scheduled = 0;
        const w = figureWidth(inst);
        if (w < 24) return;
        if (Math.abs(w - inst.w) < 0.5 && inst.h > 0) return;
        if (!inst.started) render(inst, 0);
        else if (!inst.animId) render(inst, 1e9);
        /* while the intro loop runs it already redraws at the new width */
      });
    });
    inst.ro.observe(figure);
  }

  if (type === 'sigil') {
    render(inst, 1e9);
    return inst;
  }

  if (REDUCED.matches) {
    inst.started = true;
    render(inst, 1e9);
    return inst;
  }

  if (typeof IntersectionObserver === 'function') {
    inst.io = new IntersectionObserver(
      function (entries) {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            startIntro(inst);
            inst.io.disconnect();
            inst.io = null;
            break;
          }
        }
      },
      { rootMargin: '140px 0px', threshold: 0.01 }
    );
    inst.io.observe(figure);
  } else {
    startIntro(inst);
  }

  return inst;
}

function startIntro(inst) {
  if (inst.started || inst.animStarted || inst.disposed) return;
  inst.animStarted = true;
  inst.started = true;
  if (REDUCED.matches || inst.type === 'signal' || inst.type === 'sigil') {
    render(inst, 1e9);
    return;
  }
  const spec = TYPES[inst.type];
  const dur = spec.introMs || 700;
  const begin = performance.now();
  const step = function (now) {
    if (inst.disposed) return;
    const elapsed = now - begin;
    render(inst, elapsed);
    if (elapsed < dur) inst.animId = requestAnimationFrame(step);
    else {
      inst.animId = 0;
      render(inst, 1e9);
    }
  };
  inst.animId = requestAnimationFrame(step);
}

/* ---- signal loop -------------------------------------------------------- */

function hookState() {
  try {
    if (window.__sp && typeof window.__sp.state === 'function') return window.__sp.state();
  } catch (e) {
    /* ignore */
  }
  return null;
}

function mountSignal(inst) {
  render(inst, 1e9);
  if (REDUCED.matches) return;

  let lastY = null;
  let lastT = 0;
  let raf = 0;
  let visible = true;

  const step = function (now) {
    raf = 0;
    if (inst.disposed) return;
    const dt = lastT ? clamp(now - lastT, 8, 64) : 16;
    const state = hookState();
    const y = state && typeof state.scrollY === 'number' ? state.scrollY : window.scrollY || 0;
    if (lastY === null) lastY = y;
    let velocity = ((y - lastY) / dt) * 1000;
    lastY = y;
    lastT = now;
    if (!Number.isFinite(velocity)) velocity = 0;
    const norm = clamp(velocity / 2400, -1, 1);
    const samples = inst.model.samples;
    samples.push(Math.abs(norm) < 0.015 ? 0 : norm);
    samples.shift();
    render(inst, 1e9);
    if (visible && !document.hidden) raf = requestAnimationFrame(step);
  };

  const kick = function () {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(step);
  };

  if (typeof IntersectionObserver === 'function') {
    const io = new IntersectionObserver(
      function (entries) {
        visible = entries.some((e) => e.isIntersecting);
        kick();
      },
      { threshold: 0 }
    );
    io.observe(inst.fig);
    inst.sigIo = io;
  }

  document.addEventListener('visibilitychange', kick);
  document.addEventListener('sp:station', function () {
    const s = inst.model.samples;
    s[s.length - 1] = s[s.length - 1] > 0.12 ? s[s.length - 1] : 0.7;
    kick();
  });
  kick();
}

/* ---- global re-render triggers ----------------------------------------- */

let relayoutRaf = 0;

function relayoutAll(force) {
  if (relayoutRaf) cancelAnimationFrame(relayoutRaf);
  relayoutRaf = requestAnimationFrame(function () {
    relayoutRaf = 0;
    for (const inst of INSTANCES) {
      if (inst.disposed) continue;
      const w = figureWidth(inst);
      if (w < 24) continue;
      if (force) {
        if (inst.started) render(inst, 1e9);
        else render(inst, 0);
      }
    }
  });
}

function redrawTooltip() {
  for (const inst of INSTANCES) {
    if (inst.tipIndex >= 0 && inst.hover >= 0) showTip(inst, inst.hover);
  }
}

function scan() {
  const nodes = document.querySelectorAll('[data-viz]');
  for (const fig of nodes) {
    if (SEEN && SEEN.has(fig)) continue;
    if (SEEN) SEEN.add(fig);
    try {
      mount(fig);
    } catch (e) {
      /* a broken figure must never break the page: leave the noscript table */
      fig.setAttribute('data-viz-error', '1');
    }
  }
}

document.addEventListener('sp:lang', function () {
  TOK = null;
  relayoutAll(true);
  redrawTooltip();
});

document.addEventListener('sp:station', function (ev) {
  const key = ev && ev.detail && ev.detail.key;
  if (!key) return;
  for (const inst of INSTANCES) {
    if (inst.started || inst.type === 'signal' || inst.type === 'sigil') continue;
    const station = inst.fig.closest('[data-sp-station]');
    if (!station) continue;
    const stationKey = station.getAttribute('data-sp-station');
    if (stationKey !== key) continue;
    setTimeout(function () {
      startIntro(inst);
    }, 120);
  }
});

window.addEventListener('resize', function () {
  /* ResizeObserver covers width; this catches a DPR change / font reflow */
  relayoutAll(true);
});

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function () {
    relayoutAll(true);
  });
}

if (typeof MutationObserver === 'function') {
  let scheduled = 0;
  const mo = new MutationObserver(function (mutations) {
    let found = false;
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches && node.matches('[data-viz]')) {
          found = true;
          break;
        }
        if (node.querySelector && node.querySelector('[data-viz]')) {
          found = true;
          break;
        }
      }
      if (found) break;
    }
    if (!found || scheduled) return;
    scheduled = requestAnimationFrame(function () {
      scheduled = 0;
      scan();
    });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

/* public QA hook (read-only helpers; also used by the probe harness) */
window.__viz = {
  get types() {
    return Object.keys(TYPES);
  },
  lastDrawMs: 0,
  maxDrawMs: 0,
  instances: function () {
    return INSTANCES.map(function (i) {
      return {
        type: i.type,
        w: i.w,
        h: i.h,
        dpr: i.dpr,
        items: i.items.length,
        started: i.started,
        hover: i.hover,
        drawMs: +i.drawMs.toFixed(3),
        error: i.fig.getAttribute('data-viz-error') || '',
        hits: i.hits.map(function (h) {
          return {
            index: h.index,
            cx: Math.round(h.cx),
            cy: Math.round(h.cy),
            hx: Math.round(h.x !== undefined ? h.x + h.w / 2 : h.cx),
            hy: Math.round(h.y !== undefined ? h.y + h.h / 2 : h.cy),
            label: (h.item && (h.item.label || h.item.title)) || '',
          };
        }),
      };
    });
  },
  redraw: function () {
    relayoutAll(true);
  },
  hit: function (type, x, y) {
    const inst = INSTANCES.find(function (i) {
      return i.type === type;
    });
    return inst ? { index: hitTest(inst, x, y), hits: inst.hits.length, hover: inst.hover } : null;
  },
  scan: scan,
};

scan();

export { scan, redrawAll };
function redrawAll() {
  relayoutAll(true);
}
