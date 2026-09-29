/**
 * Compact price/volume codec shared by the Node data fetcher (tools/fetch-data.mjs)
 * and the browser runtime (src/data/repository.js).
 *
 * Every price is stored as an integer number of 厘 (1/1000 CNY). A-share stocks
 * quote on a 0.01 tick and ETFs on a 0.001 tick, so 厘 keeps both exact.
 *
 * A single trading day is stored as parallel arrays, delta encoded so the JSON
 * stays small enough to commit alongside the site:
 *   c[i] = close[i] - close[i-1]        (c[0] is relative to the day open)
 *   h[i] = high[i]  - close[i]          (>= 0)
 *   l[i] = low[i]   - close[i]          (<= 0)
 *   a[i] = avg[i]   - close[i]          (intraday VWAP, the 均价线)
 *   v[i] = volume in 手 (lots, 1 lot = 100 shares)
 */

export const PRICE_SCALE = 1000

export function toInt(price) {
  return Math.round(Number(price) * PRICE_SCALE)
}

export function fromInt(value) {
  return value / PRICE_SCALE
}

/**
 * @param {object} input
 * @param {number} input.prevClose  previous trading day close (厘)
 * @param {number} input.open       day open (厘)
 * @param {number[]} input.close
 * @param {number[]} input.high
 * @param {number[]} input.low
 * @param {number[]} input.avg      per-bar VWAP (厘)
 * @param {number[]} input.volume   per-bar volume in 手
 * @param {string} input.date       YYYYMMDD
 * @param {string} input.granularity 'm1' | 'm5'
 */
export function encodeDay(input) {
  const n = input.close.length
  const c = new Array(n)
  const h = new Array(n)
  const l = new Array(n)
  const a = new Array(n)
  const v = new Array(n)
  let prev = input.open
  for (let i = 0; i < n; i++) {
    const close = input.close[i]
    c[i] = close - prev
    h[i] = input.high[i] - close
    l[i] = input.low[i] - close
    a[i] = input.avg[i] - close
    v[i] = input.volume[i]
    prev = close
  }
  return {
    d: input.date,
    g: input.granularity,
    n,
    pc: input.prevClose,
    o: input.open,
    c,
    h,
    l,
    a,
    v
  }
}

/**
 * Decode a stored day into the units the rest of the app uses: **CNY floats**.
 * The 厘 integers and delta encoding stay an implementation detail of the
 * on-disk format, so nothing downstream has to remember to divide by 1000.
 */
export function decodeDay(day) {
  const n = day.n
  const close = new Array(n)
  const high = new Array(n)
  const low = new Array(n)
  const avg = new Array(n)
  let prev = day.o
  for (let i = 0; i < n; i++) {
    const px = prev + day.c[i]
    close[i] = px / PRICE_SCALE
    high[i] = (px + day.h[i]) / PRICE_SCALE
    low[i] = (px + day.l[i]) / PRICE_SCALE
    avg[i] = (px + day.a[i]) / PRICE_SCALE
    prev = px
  }
  return {
    date: day.d,
    granularity: day.g,
    prevClose: day.pc / PRICE_SCALE,
    open: day.o / PRICE_SCALE,
    close,
    high,
    low,
    avg,
    volume: day.v
  }
}

/** Daily bars are stored as [YYYYMMDD, open, high, low, close, volume] with prices in 厘. */
export function encodeDailyBar(row) {
  return [row.date, row.open, row.high, row.low, row.close, row.volume]
}

export function decodeDailyBar(row) {
  return {
    date: row[0],
    open: fromInt(row[1]),
    high: fromInt(row[2]),
    low: fromInt(row[3]),
    close: fromInt(row[4]),
    volume: row[5]
  }
}

/**
 * Build the ordered intraday timeline of a session, expressed as minutes since
 * midnight, so the chart axis is identical for every instrument.
 *
 * A-share continuous session: 09:30-11:30 and 13:00-15:00 (240 minutes).
 *   m5 -> 48 bars labelled by their closing minute (09:35 ... 15:00)
 *   m1 -> 241 points (09:30 auction print, then 09:31 ... 15:00)
 */
export function sessionTimeline(granularity) {
  if (granularity === 'm1') {
    const out = [9 * 60 + 30]
    for (let m = 9 * 60 + 31; m <= 11 * 60 + 30; m++) out.push(m)
    for (let m = 13 * 60 + 1; m <= 15 * 60; m++) out.push(m)
    return out
  }
  if (granularity === 'm5') {
    const out = []
    for (let m = 9 * 60 + 35; m <= 11 * 60 + 30; m += 5) out.push(m)
    for (let m = 13 * 60 + 5; m <= 15 * 60; m += 5) out.push(m)
    return out
  }
  throw new Error(`unknown granularity: ${granularity}`)
}

export function formatMarketTime(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
