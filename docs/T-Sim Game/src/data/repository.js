/**
 * Data access layer.
 *
 * The catalog is loaded once; instrument files are fetched lazily and cached in
 * memory, with a background prefetch of the next scenario so a round never waits
 * on the network between days.
 */
import { decodeDay, decodeDailyBar } from '../core/codec.js'

const BASE = import.meta.env.BASE_URL || './'

const symbolCache = new Map()
const inflight = new Map()
let catalogPromise = null

function url(relative) {
  return `${BASE}${relative}`.replace(/([^:])\/{2,}/g, '$1/')
}

/**
 * Day index entries travel as compact strings ("20260928|235|AREV|1") to keep
 * the catalog small; expand them once here so the rest of the app can treat a
 * day as `[date, rangeBp, patternCode, granularityMask]`.
 */
function parseDayIndex(raw) {
  const parts = String(raw).split('|')
  return [parts[0], Number(parts[1]), parts[2], Number(parts[3])]
}

export function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetch(url('data/index.json'))
      .then((res) => {
        if (!res.ok) throw new Error(`无法加载数据目录 (${res.status})`)
        return res.json()
      })
      .then((data) => ({
        ...data,
        symbols: (data.symbols || []).map((symbol) => ({
          ...symbol,
          days: (symbol.days || []).map(parseDayIndex)
        }))
      }))
      .catch((err) => {
        catalogPromise = null
        throw err
      })
  }
  return catalogPromise
}

export function loadSymbol(symbol) {
  const key = symbol.secid
  if (symbolCache.has(key)) return Promise.resolve(symbolCache.get(key))
  if (inflight.has(key)) return inflight.get(key)

  // catalog `file` is relative to the data directory ("s/1.600519.json")
  const promise = fetch(url(`data/${symbol.file}`))
    .then((res) => {
      if (!res.ok) throw new Error(`无法加载 ${symbol.name} 的行情数据 (${res.status})`)
      return res.json()
    })
    .then((payload) => {
      const record = {
        meta: symbol,
        daily: (payload.daily || []).map(decodeDailyBar),
        days: (payload.days || []).map((raw) => ({ raw, decoded: decodeDay(raw) }))
      }
      symbolCache.set(key, record)
      inflight.delete(key)
      return record
    })
    .catch((err) => {
      inflight.delete(key)
      throw err
    })

  inflight.set(key, promise)
  return promise
}

/**
 * Resolve one playable session: the decoded day plus the daily context bars.
 */
export async function loadScenario(symbol, dayDate, granularity) {
  const record = await loadSymbol(symbol)
  const match = record.days.find(
    (d) => d.raw.d === dayDate && (granularity ? d.raw.g === granularity : true)
  )
  if (!match) throw new Error('该交易日的行情数据不存在')

  const index = record.days.indexOf(match)
  const prevDaily = record.daily.filter((bar) => bar.date < dayDate)
  return {
    symbol,
    day: match.decoded,
    raw: match.raw,
    daily: prevDaily.slice(-60),
    recentDays: record.days.slice(Math.max(0, index - 5), index).map((d) => d.decoded)
  }
}

export function prefetchSymbol(symbol) {
  if (!symbol || symbolCache.has(symbol.secid) || inflight.has(symbol.secid)) return
  loadSymbol(symbol).catch(() => {})
}

