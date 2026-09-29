/**
 * Download real A-share stock + ETF intraday history into public/data/.
 *
 *   npm run data:fetch                 # full universe (default 110 stocks + 50 ETFs)
 *   npm run data:fetch -- --stocks 40 --etfs 20
 *   npm run data:fetch -- --only 600519,510300
 *
 * Sources (both are public quote endpoints used by the Eastmoney web terminal,
 * no key required):
 *   - push2his .../stock/kline/get   5-minute bars, ~32 recent trading days
 *                                    daily bars, full history (used for context)
 *   - push2his .../stock/trends2/get 1-minute bars for the last 5 trading days
 *
 * Everything is normalised into the compact format described in
 * src/core/codec.js and written to:
 *   public/data/index.json      catalog: instruments + a per-day index
 *   public/data/s/<secid>.json  full bar data for one instrument
 *
 * The script is resumable: raw responses are cached under tools/.cache/raw so a
 * re-run only re-downloads what is missing. Delete that folder to force a
 * refresh; a refresh is also the way to pull newer trading days.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { encodeDay, decodeDay, toInt } from '../src/core/codec.js'
import { classifyDay } from '../src/core/patterns.js'

// Some networks (the author's included) can only reach the quote endpoints
// through an HTTP proxy, which Node's fetch ignores unless asked. Re-exec once
// with --use-env-proxy so `npm run data:fetch` works everywhere without flags.
const NODE_MAJOR = Number(process.versions.node.split('.')[0])
const PROXY_ENV =
  process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY || process.env.http_proxy
if (PROXY_ENV && NODE_MAJOR >= 24 && !process.execArgv.includes('--use-env-proxy')) {
  const { spawnSync } = await import('node:child_process')
  const child = spawnSync(process.execPath, ['--use-env-proxy', ...process.argv.slice(1)], {
    stdio: 'inherit',
    env: process.env
  })
  process.exit(child.status ?? 1)
}

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..')
const OUT_DIR = path.join(ROOT, 'public', 'data')
const SYMBOL_DIR = path.join(OUT_DIR, 's')
const CACHE_DIR = path.join(HERE, '.cache', 'raw')

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'
const HEADERS = { 'User-Agent': UA, Referer: 'https://quote.eastmoney.com/' }

const STOCK_BOARDS = 'm:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23'
const ETF_BOARDS = 'b:MK0021,b:MK0022,b:MK0023,b:MK0024'

const DAILY_KEEP = 180 // daily bars kept per instrument for context
const M1_DAYS = 5      // trends2 window

// ---------------------------------------------------------------- utilities

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function parseArgs(argv) {
  const out = { stocks: 110, etfs: 50, only: null, concurrency: 5 }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--stocks') out.stocks = Number(argv[++i])
    else if (a === '--etfs') out.etfs = Number(argv[++i])
    else if (a === '--only') out.only = String(argv[++i]).split(',').map((s) => s.trim()).filter(Boolean)
    else if (a === '--concurrency') out.concurrency = Number(argv[++i])
  }
  return out
}

async function cachedJson(key, url) {
  const file = path.join(CACHE_DIR, `${key}.json`)
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch {
    /* not cached yet */
  }
  let lastError
  for (let attempt = 0; attempt < 7; attempt++) {
    try {
      const res = await fetch(url, { headers: HEADERS })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      await fs.mkdir(CACHE_DIR, { recursive: true })
      await fs.writeFile(file, JSON.stringify(json))
      return json
    } catch (err) {
      lastError = err
      // The quote hosts occasionally drop a connection mid-handshake; retry with
      // jittered backoff rather than losing the instrument.
      await sleep(300 * (attempt + 1) ** 2 + Math.random() * 400)
    }
  }
  throw new Error(`fetch failed ${url}: ${lastError?.message}`)
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length)
  let cursor = 0
  const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await worker(items[index], index)
      await sleep(90)
    }
  })
  await Promise.all(runners)
  return results
}

// ------------------------------------------------------------------ catalog

async function fetchBoard(fs_, pages, pageSize = 100) {
  const rows = []
  for (let pn = 1; pn <= pages; pn++) {
    const url =
      `https://push2.eastmoney.com/api/qt/clist/get?pn=${pn}&pz=${pageSize}&po=1&np=1&fltt=2&invt=2` +
      `&fid=f6&fs=${fs_}&fields=f12,f13,f14,f2,f3,f5,f6,f8,f20`
    const json = await cachedJson(`list_${fs_.replace(/[^a-z0-9]/gi, '')}_${pn}`, url)
    const diff = json?.data?.diff
    if (!diff) break
    for (const row of diff) rows.push(row)
    if (diff.length < pageSize) break
  }
  return rows
}

function isTradableStock(row) {
  const code = String(row.f12)
  const name = String(row.f14)
  const price = Number(row.f2)
  if (!/^\d{6}$/.test(code)) return false
  if (/ST|退|N |^N(?=[\u4e00-\u9fa5])/.test(name)) return false
  if (/^[48]/.test(code)) return false // 北交所, excluded on purpose
  if (!Number.isFinite(price) || price < 1.5) return false
  if (!(Number(row.f6) > 0)) return false
  return true
}

function stockMeta(row) {
  const code = String(row.f12)
  const market = Number(row.f13)
  const isStar = /^688/.test(code)
  const isChiNext = /^30/.test(code)
  return {
    secid: `${market}.${code}`,
    code,
    market,
    name: String(row.f14),
    kind: 'stock',
    board: isStar ? 'star' : isChiNext ? 'chinext' : market === 1 ? 'sh-main' : 'sz-main',
    limitPct: isStar || isChiNext ? 20 : 10,
    tick: 0.01,
    lot: 100,
    t0: false,
    amount: Number(row.f6) || 0
  }
}

/** ETFs that support same-day revolving trading (T+0) under A-share rules. */
const T0_NAME_HINTS = [
  '恒生', '恒指', '港股', '香港', 'H股', '中概', '纳指', '纳斯达克', '标普', '道琼斯', '美国',
  '德国', '法国', '英国', '欧洲', '日经', '东京', '亚太', '亚洲', '越南', '沙特', '印度', '新兴',
  '海外', '全球', '国际', '原油', '油气', '石油', '能源化工', '黄金', '白银', '有色', '国债',
  '债', '货币', '添益', '融', '短融', '货币ETF', '商品'
]

function isEtfT0(code, name) {
  if (/^(513|518|511|501|502|520|561)/.test(code)) return true
  return T0_NAME_HINTS.some((h) => name.includes(h))
}

function etfMeta(row) {
  const code = String(row.f12)
  const market = Number(row.f13)
  const name = String(row.f14)
  return {
    secid: `${market}.${code}`,
    code,
    market,
    name,
    kind: 'etf',
    board: 'etf',
    limitPct: 10,
    tick: 0.001,
    lot: 100,
    t0: isEtfT0(code, name),
    amount: Number(row.f6) || 0
  }
}

/** Deterministic shuffle so repeated runs pick the same diversified sample. */
function seededShuffle(items, seed) {
  const arr = items.slice()
  let s = seed >>> 0
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Liquidity-first selection with a deliberate tail sample so the trainer also
 * contains mid and small caps with genuinely different intraday behaviour.
 */
function selectUniverse(rows, count, mapper, filter, tailFrom, tailCount) {
  const clean = rows.filter(filter).map(mapper)
  const head = clean.slice(0, tailFrom)
  const tail = seededShuffle(clean.slice(tailFrom, tailFrom + 400), 20260929).slice(0, tailCount)
  const merged = [...head, ...tail]
  const seen = new Set()
  const unique = merged.filter((m) => (seen.has(m.secid) ? false : seen.add(m.secid)))
  return unique.slice(0, count)
}

// ------------------------------------------------------------- market data

function klineUrl(secid, klt) {
  return (
    `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=${secid}` +
    `&fields1=f1,f2,f3,f4,f5,f6&fields2=f51,f52,f53,f54,f55,f56,f57,f58` +
    `&klt=${klt}&fqt=0&beg=0&end=20500101`
  )
}

function trendsUrl(secid) {
  return (
    `https://push2his.eastmoney.com/api/qt/stock/trends2/get?secid=${secid}` +
    `&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13` +
    `&fields2=f51,f52,f53,f54,f55,f56,f57,f58&ndays=${M1_DAYS}&iscr=0`
  )
}

function parseDaily(klines) {
  return klines.map((line) => {
    const p = line.split(',')
    return {
      date: p[0].replace(/-/g, ''),
      open: Number(p[1]),
      close: Number(p[2]),
      high: Number(p[3]),
      low: Number(p[4]),
      volume: Number(p[5]),
      amount: Number(p[6])
    }
  })
}

function groupByDate(klines) {
  const map = new Map()
  for (const line of klines) {
    const p = line.split(',')
    const [rawDate, time] = p[0].split(' ')
    const date = rawDate.replace(/-/g, '')
    if (!map.has(date)) map.set(date, [])
    map.get(date).push({
      time,
      open: Number(p[1]),
      close: Number(p[2]),
      high: Number(p[3]),
      low: Number(p[4]),
      volume: Number(p[5]),
      amount: Number(p[6])
    })
  }
  return map
}

/** Turn one session's raw bars into an encoded, playable day. */
function buildDay(date, bars, prevClose, dailyByDate, granularity, expectBars) {
  if (bars.length !== expectBars) return null
  const daily = dailyByDate.get(date)
  if (!daily) return null

  const open = granularity === 'm1' ? daily.open : bars[0].open
  if (!Number.isFinite(open) || open <= 0) return null

  const close = []
  const high = []
  const low = []
  const avg = []
  const volume = []
  let cumAmount = 0
  let cumVolume = 0

  for (const bar of bars) {
    if (!Number.isFinite(bar.close) || bar.close <= 0) return null
    cumAmount += bar.amount
    cumVolume += bar.volume
    const vwap = cumVolume > 0 ? cumAmount / (cumVolume * 100) : bar.close
    close.push(toInt(bar.close))
    high.push(toInt(Math.max(bar.high, bar.close, bar.open || bar.close)))
    low.push(toInt(Math.min(bar.low > 0 ? bar.low : bar.close, bar.close, bar.open || bar.close)))
    avg.push(toInt(vwap > 0 ? vwap : bar.close))
    volume.push(Math.round(bar.volume))
  }

  return encodeDay({
    date,
    granularity,
    prevClose: toInt(prevClose),
    open: toInt(open),
    close,
    high,
    low,
    avg,
    volume
  })
}

async function fetchInstrument(meta) {
  const [dailyJson, m5Json, m1Json] = await Promise.all([
    cachedJson(`d_${meta.secid}`, klineUrl(meta.secid, 101)),
    cachedJson(`m5_${meta.secid}`, klineUrl(meta.secid, 5)),
    cachedJson(`m1_${meta.secid}`, trendsUrl(meta.secid))
  ])

  const dailyRows = parseDaily(dailyJson?.data?.klines || [])
  if (dailyRows.length < 30) return { meta, days: [], skipped: 'insufficient daily history' }

  const dailyByDate = new Map(dailyRows.map((d) => [d.date, d]))
  const prevCloseByDate = new Map()
  for (let i = 1; i < dailyRows.length; i++) {
    prevCloseByDate.set(dailyRows[i].date, dailyRows[i - 1].close)
  }

  const days = []

  // --- 1-minute sessions (highest fidelity, ~5 most recent trading days) ---
  const m1Groups = groupByDate(m1Json?.data?.trends || [])
  for (const [date, bars] of m1Groups) {
    const prevClose = prevCloseByDate.get(date)
    if (!prevClose) continue
    // Eastmoney pads the 09:30 auction print with a zero open; repair it.
    if (bars.length && !(bars[0].open > 0)) {
      bars[0].open = bars[0].close
      bars[0].high = bars[0].close
      bars[0].low = bars[0].close
    }
    const day = buildDay(date, bars, prevClose, dailyByDate, 'm1', 241)
    if (day) days.push(day)
  }

  // --- 5-minute sessions (~32 recent trading days) ---
  const m5Groups = groupByDate(m5Json?.data?.klines || [])
  for (const [date, bars] of m5Groups) {
    const prevClose = prevCloseByDate.get(date)
    if (!prevClose) continue
    const day = buildDay(date, bars, prevClose, dailyByDate, 'm5', 48)
    if (day) days.push(day)
  }

  const daily = dailyRows.slice(-DAILY_KEEP)

  return { meta, days, daily }
}

/** Per-day index entry: date | range in bp | pattern code | granularity mask. */
function dayIndexEntry(day, pattern) {
  const mask = day.granularity === 'm1' ? 1 : 2
  return [day.date, Math.round(pattern.range * 10000), pattern.code, mask].join('|')
}

// --------------------------------------------------------------------- main

async function main() {
  const args = parseArgs(process.argv.slice(2))
  await fs.mkdir(SYMBOL_DIR, { recursive: true })
  await fs.mkdir(CACHE_DIR, { recursive: true })

  let universe
  if (args.only) {
    const [stockRows, etfRows] = await Promise.all([
      fetchBoard(STOCK_BOARDS, 6),
      fetchBoard(ETF_BOARDS, 3)
    ])
    const all = [
      ...stockRows.filter(isTradableStock).map(stockMeta),
      ...etfRows.map(etfMeta)
    ]
    const wanted = new Set(args.only)
    universe = all.filter((m) => wanted.has(m.code) || wanted.has(m.secid))
    console.log(`--only matched ${universe.length} instrument(s)`)
  } else {
    console.log('Fetching instrument lists…')
    const [stockRows, etfRows] = await Promise.all([
      fetchBoard(STOCK_BOARDS, 6),
      fetchBoard(ETF_BOARDS, 3)
    ])
    console.log(`  stock candidates=${stockRows.length}  etf candidates=${etfRows.length}`)
    const stocks = selectUniverse(stockRows, args.stocks, stockMeta, isTradableStock, 80, Math.max(0, args.stocks - 80))
    const etfs = selectUniverse(etfRows, args.etfs, etfMeta, () => true, 38, Math.max(0, args.etfs - 38))
    universe = [...stocks, ...etfs]
    console.log(`  selected stocks=${stocks.length} etfs=${etfs.length}`)
  }

  const catalog = []
  let done = 0
  await mapLimit(universe, args.concurrency, async (meta) => {
    try {
      const result = await fetchInstrument(meta)
      done++
      if (!result.days.length) {
        console.warn(`  [${done}/${universe.length}] ${meta.name} skipped (${result.skipped || 'no intraday days'})`)
        return
      }
      const decoded = result.days.map((d) => decodeDay(d))
      const index = []
      let rangeSum = 0
      for (const dec of decoded) {
        // decodeDay() normalises everything to CNY, and classifyDay only ever
        // uses ratios, so the units cancel out either way.
        const pattern = classifyDay(dec, dec.prevClose)
        rangeSum += pattern.range
        index.push(dayIndexEntry(dec, pattern))
      }
      const avgRange = rangeSum / decoded.length
      const entry = {
        secid: meta.secid,
        code: meta.code,
        market: meta.market,
        name: meta.name,
        kind: meta.kind,
        board: meta.board,
        limitPct: meta.limitPct,
        tick: meta.tick,
        lot: meta.lot,
        t0: meta.t0,
        file: `s/${meta.secid}.json`,
        avgRange: Number((avgRange * 100).toFixed(3)),
        lastClose: result.daily.length ? Number(result.daily[result.daily.length - 1].close) : null,
        dayCount: index.length,
        days: index
      }
      catalog.push(entry)

      const payload = {
        v: 1,
        secid: meta.secid,
        code: meta.code,
        name: meta.name,
        kind: meta.kind,
        t0: meta.t0,
        tick: meta.tick,
        limitPct: meta.limitPct,
        daily: result.daily.map((d) => [
          d.date,
          toInt(d.open),
          toInt(d.high),
          toInt(d.low),
          toInt(d.close),
          Math.round(d.volume)
        ]),
        days: result.days
      }
      await fs.writeFile(path.join(SYMBOL_DIR, `${meta.secid}.json`), JSON.stringify(payload))
      console.log(`  [${done}/${universe.length}] ${meta.name} (${meta.code}) days=${index.length} avgRange=${entry.avgRange}%`)
    } catch (err) {
      done++
      console.warn(`  [${done}/${universe.length}] ${meta.name} FAILED: ${err.message}`)
    }
  })

  catalog.sort((a, b) => a.kind.localeCompare(b.kind) || b.avgRange - a.avgRange)

  const scenarioCount = catalog.reduce((acc, s) => acc + s.dayCount, 0)
  const index = {
    v: 1,
    generatedAt: new Date().toISOString(),
    source: 'Eastmoney public quote endpoints (5-minute klines + 1-minute trends)',
    session: { m1: 241, m5: 48 },
    scenarioCount,
    symbols: catalog
  }
  await fs.writeFile(path.join(OUT_DIR, 'index.json'), JSON.stringify(index))
  console.log(`\nWrote ${catalog.length} instruments, ${scenarioCount} playable sessions -> ${OUT_DIR}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
