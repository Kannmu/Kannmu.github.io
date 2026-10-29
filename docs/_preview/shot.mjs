// Headless screenshot helper via Chrome DevTools Protocol (no npm deps).
// Usage: node shot.mjs <url> <outfile.png> [width] [height] [mode: full|viewport] [theme: light|dark] [scale]
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const [url, out, w = '1440', h = '900', mode = 'full', theme = 'light', scale = '1'] = process.argv.slice(2);
if (!url || !out) { console.error('usage: node shot.mjs <url> <out> [w] [h] [full|viewport] [light|dark] [scale]'); process.exit(2); }

const port = 9200 + Math.floor(Math.random() * 400);
const profileDir = resolve(tmpdir(), `dsh-shot-${port}`);
const args = [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-extensions', '--hide-scrollbars', '--force-color-profile=srgb',
  '--disable-features=Translate,MediaRouter', '--font-render-hinting=none',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profileDir}`, 'about:blank',
];
const child = spawn(CHROME, args, { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWsUrl() {
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      const j = await res.json();
      if (j.webSocketDebuggerUrl) return j.webSocketDebuggerUrl;
    } catch { /* retry */ }
    await sleep(120);
  }
  throw new Error('chrome did not start');
}

let id = 0;
const pending = new Map();
const events = [];
const pageErrors = [];
function send(ws, method, params = {}, sessionId) {
  const msgId = ++id;
  return new Promise((res, rej) => {
    pending.set(msgId, { res, rej });
    ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
  });
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
ws.addEventListener('message', (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) rej(new Error(JSON.stringify(msg.error)));
    else res(msg.result);
  } else if (msg.method) {
    events.push(msg);
    if (msg.method === 'Runtime.exceptionThrown') {
      const d = msg.params.exceptionDetails || {};
      pageErrors.push('EXC: ' + (d.text || '') + ' ' + ((d.exception && d.exception.description) || ''));
    } else if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') {
      pageErrors.push('LOG: ' + msg.params.entry.text.slice(0, 220));
    } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      pageErrors.push('CON: ' + msg.params.args.map((a) => a.value || a.description || '').join(' ').slice(0, 220));
    }
  }
});

const { targetId } = await send(ws, 'Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send(ws, 'Target.attachToTarget', { targetId, flatten: true });
const S = (m, p) => send(ws, m, p, sessionId);

await S('Page.enable');
await S('Runtime.enable');
await S('Log.enable');
await S('Network.enable');
await S('Network.setCacheDisabled', { cacheDisabled: true });
await S('Network.setBypassServiceWorker', { bypass: true });
await S('Emulation.setDeviceMetricsOverride', {
  width: Number(w), height: Number(h), deviceScaleFactor: Number(scale), mobile: false,
});

// Theme + language bootstrap before any page script runs.
const boot = `
  try {
    localStorage.setItem('theme', ${JSON.stringify(theme)});
  } catch (e) {}
  (function apply() {
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)});
    } else {
      document.addEventListener('readystatechange', apply, { once: true });
    }
  })();
`;
const { identifier } = await S('Page.addScriptToEvaluateOnNewDocument', { source: boot });
void identifier;

await S('Page.navigate', { url });
await sleep(900);
// Wait for load event if it fired already, then settle.
const start = Date.now();
while (Date.now() - start < 12000) {
  const r = await S('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
  if (r.result.value === 'complete') break;
  await sleep(150);
}
await sleep(1400);
await S('Runtime.evaluate', {
  expression: `document.documentElement.setAttribute('data-theme', ${JSON.stringify(theme)});
    window.scrollTo(0,0);`,
});
await sleep(600);

// Disable smooth scrolling + reveal animations that depend on viewport for full-page capture.
await S('Runtime.evaluate', {
  expression: `(() => {
    const st = document.createElement('style');
    st.textContent = 'html{scroll-behavior:auto !important}';
    document.head.appendChild(st);
    return true;
  })()`,
});

let clip;
const MAX_H = 7600;

if (mode === 'full') {
  const metrics = await S('Page.getLayoutMetrics');
  let height = Math.ceil(metrics.cssContentSize.height);
  if (height > MAX_H) height = MAX_H;
  clip = { x: 0, y: 0, width: Number(w), height, scale: 1 };
  await S('Emulation.setDeviceMetricsOverride', {
    width: Number(w), height, deviceScaleFactor: Number(scale), mobile: false,
  });
  await sleep(700);
}

if (mode === 'scroll') {
  const scrollY = Number(process.argv[9] || 0);
  await S('Runtime.evaluate', {
    expression: `window.scrollTo(0, ${scrollY});`,
  });
  await sleep(1500);
}

if (mode === 'clip') {
  const y = Number(process.argv[9] || 0);
  const metrics0 = await S('Page.getLayoutMetrics');
  const fullH = Math.ceil(metrics0.cssContentSize.height);
  await S('Emulation.setDeviceMetricsOverride', {
    width: Number(w), height: fullH, deviceScaleFactor: Number(scale), mobile: false,
  });
  await sleep(700);
  await S('Runtime.evaluate', {
    expression: `document.querySelectorAll('[data-reveal]').forEach(function(e){e.classList.add('is-in');});`,
  });
  await sleep(900);
  clip = { x: 0, y, width: Number(w), height: Number(h), scale: 1 };
}

const shot = await S('Page.captureScreenshot', {
  format: 'png',
  ...(clip ? { clip } : {}),
  captureBeyondViewport: mode === 'full' || mode === 'clip',
  fromSurface: true,
});
mkdirSync(dirname(resolve(out)), { recursive: true });
writeFileSync(out, Buffer.from(shot.data, 'base64'));

const probe = await S('Runtime.evaluate', {
  expression: `JSON.stringify({
    h: document.documentElement.scrollHeight,
    theme: document.documentElement.getAttribute('data-theme'),
    lang: document.documentElement.getAttribute('data-lang'),
    err: window.__shotErrors || []
  })`, returnByValue: true,
}).catch(() => ({ result: { value: '{}' } }));
console.log('saved', out, probe.result.value);
if (pageErrors.length) {
  console.log('--- page errors (' + pageErrors.length + ') ---');
  pageErrors.slice(0, 12).forEach((e) => console.log(e));
}

ws.close();
child.kill();
try { rmSync(profileDir, { recursive: true, force: true }); } catch {}
process.exit(0);

