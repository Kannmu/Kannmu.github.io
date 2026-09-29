/**
 * 做T replay engine.
 *
 * Models the reality of intraday band trading on the A-share market:
 *   - you start the day holding a 底仓 (base position) bought earlier
 *   - 正T = buy the dip first, then sell the same amount out of the base position
 *   - 倒T = sell the base position high first, then buy it back lower
 *   - T+1: shares bought today cannot be sold today (stocks and equity ETFs);
 *     跨境/债券/黄金/货币 ETFs are T+0 and rotate freely
 *   - 涨跌停: a bar locked at the limit cannot be bought (涨停) or sold (跌停)
 *   - every order pays the real fee stack, including the 5 元 minimum commission
 *
 * All functions mutate `state` in place so a Vue `reactive()` wrapper can drive
 * the UI directly. Pure helpers are exported separately for unit tests.
 */
import { computeFees, normalizeFeeConfig } from './fees.js'

const SIDE_BUY = 'buy'
const SIDE_SELL = 'sell'

function tickDigits(tick) {
  return tick === 0.001 ? 3 : 2
}

export function roundToTick(value, tick) {
  const digits = tickDigits(tick)
  return Number(value.toFixed(digits))
}

export function limitPrices(prevClose, limitPct, tick) {
  const factor = 1 + limitPct / 100
  return {
    up: roundToTick(prevClose * factor, tick),
    down: roundToTick(prevClose * (1 - limitPct / 100), tick)
  }
}

/** Position size for the day: aim for `capitalTarget` CNY of base position. */
export function planBasePosition(prevClose, lot, capitalTarget) {
  const raw = capitalTarget / prevClose
  const lots = Math.max(1, Math.round(raw / lot))
  return lots * lot
}

export function createSession({ symbol, day, dailyBars = [], feeConfig, capitalTarget = 100000, slippageTicks = 0 }) {
  const tick = symbol.tick || 0.01
  const baseShares = planBasePosition(day.prevClose, symbol.lot || 100, capitalTarget)
  const baseCost = day.prevClose
  // Cash matches the base position plus a small buffer, so a full-size 正T is
  // actually executable once fees are added on top.
  const cash = round2(baseShares * day.prevClose * 1.02)

  return {
    symbol,
    day,
    dailyBars,
    feeConfig: normalizeFeeConfig(feeConfig),
    slippageTicks,
    tick,
    barIndex: 0,
    baseShares,
    baseCost,
    cashStart: cash,
    cash,
    position: baseShares,
    frozenShares: 0,
    costBasis: baseShares * baseCost,
    fills: [],
    notices: [],
    feeTotal: 0,
    realized: 0,
    finished: false
  }
}

function round2(v) {
  return Math.round(v * 100) / 100
}

export function barCount(state) {
  return state.day.close.length
}

export function currentPrice(state) {
  const i = Math.min(state.barIndex, state.day.close.length - 1)
  return state.day.close[i]
}

export function currentAvg(state) {
  const i = Math.min(state.barIndex, state.day.avg.length - 1)
  return state.day.avg[i]
}

export function currentTimeLabel(state) {
  const i = Math.min(state.barIndex, state.day.close.length - 1)
  const grid = state.day.granularity === 'm1' ? M1_TIMES : M5_TIMES
  return grid[Math.min(i, grid.length - 1)]
}

const M5_TIMES = buildTimes(5)
const M1_TIMES = buildTimes(1)

function buildTimes(step) {
  const out = []
  if (step === 1) {
    out.push('09:30')
    for (let m = 9 * 60 + 31; m <= 11 * 60 + 30; m++) out.push(fmt(m))
    for (let m = 13 * 60 + 1; m <= 15 * 60; m++) out.push(fmt(m))
    return out
  }
  for (let m = 9 * 60 + 35; m <= 11 * 60 + 30; m += 5) out.push(fmt(m))
  for (let m = 13 * 60 + 5; m <= 15 * 60; m += 5) out.push(fmt(m))
  return out
}

function fmt(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
}

export function dayHighLowSoFar(state) {
  const i = Math.min(state.barIndex, state.day.close.length - 1)
  let high = -Infinity
  let low = Infinity
  for (let k = 0; k <= i; k++) {
    high = Math.max(high, state.day.high[k])
    low = Math.min(low, state.day.low[k])
  }
  return { high, low }
}

export function limitState(state) {
  const { up, down } = limitPrices(state.day.prevClose, state.symbol.limitPct, state.tick)
  const i = Math.min(state.barIndex, state.day.close.length - 1)
  const barHigh = state.day.high[i]
  const barLow = state.day.low[i]
  const eps = state.tick / 2
  return {
    up,
    down,
    lockedUp: barLow >= up - eps && barHigh <= up + eps,
    lockedDown: barHigh <= down + eps && barLow >= down - eps
  }
}

export function sellableShares(state) {
  if (state.symbol.t0) return state.position
  return Math.max(0, state.position - state.frozenShares)
}

export function averageCost(state) {
  return state.position > 0 ? state.costBasis / state.position : 0
}

export function marketValue(state, price = currentPrice(state)) {
  return state.position * price
}

export function equity(state, price = currentPrice(state)) {
  return state.cash + marketValue(state, price)
}

/** P&L of today's trading only, i.e. equity change versus "did nothing". */
export function tContribution(state, price = currentPrice(state)) {
  const startEquity = state.cashStart + state.baseShares * state.day.prevClose
  const basePnl = state.baseShares * (price - state.day.prevClose)
  return equity(state, price) - startEquity - basePnl
}

function pushNotice(state, kind, message) {
  state.notices.push({ barIndex: state.barIndex, kind, message })
  if (state.notices.length > 40) state.notices.shift()
}

function fillPrice(state, side) {
  const raw = currentPrice(state)
  const slip = state.slippageTicks * state.tick
  return roundToTick(side === SIDE_BUY ? raw + slip : raw - slip, state.tick)
}

/**
 * @returns {{ok:boolean, reason?:string, fill?:object}}
 */
export function placeOrder(state, side, shares) {
  if (state.finished) return { ok: false, reason: '本交易日已结束' }
  const lot = state.symbol.lot || 100
  const qty = Math.floor(shares)
  if (!Number.isFinite(qty) || qty <= 0) return { ok: false, reason: '数量无效' }

  const isSell = side === SIDE_SELL
  const sellAll = isSell && qty >= sellableShares(state)
  if (!sellAll && qty % lot !== 0) {
    return { ok: false, reason: `必须是 ${lot} 股的整数倍` }
  }

  const limits = limitState(state)
  if (!isSell && limits.lockedUp) {
    pushNotice(state, 'reject', '一字涨停，买不到')
    return { ok: false, reason: '一字涨停，买不到' }
  }
  if (isSell && limits.lockedDown) {
    pushNotice(state, 'reject', '一字跌停，卖不出')
    return { ok: false, reason: '一字跌停，卖不出' }
  }

  const price = fillPrice(state, side)
  const fees = computeFees(side, price, qty, state.symbol, state.feeConfig)

  if (isSell) {
    const available = sellableShares(state)
    if (qty > available) {
      const reason =
        available === 0 && state.position > 0
          ? 'T+1：今日买入的股票今天不能卖'
          : `可卖数量不足（可用 ${available} 股）`
      pushNotice(state, 'reject', reason)
      return { ok: false, reason }
    }
    const proceeds = fees.amount - fees.total
    const costOut = averageCost(state) * qty
    state.cash = round2(state.cash + proceeds)
    state.position -= qty
    state.costBasis = Math.max(0, state.costBasis - costOut)
    state.realized += proceeds - costOut
    state.feeTotal += fees.total
    const fill = {
      side,
      shares: qty,
      price,
      barIndex: state.barIndex,
      time: currentTimeLabel(state),
      amount: fees.amount,
      fees,
      realized: proceeds - costOut
    }
    state.fills.push(fill)
    return { ok: true, fill }
  }

  const total = fees.amount + fees.total
  if (total > state.cash + 1e-6) {
    const reason = `现金不足，最多可买 ${maxBuyable(state, price)} 股`
    pushNotice(state, 'reject', reason)
    return { ok: false, reason }
  }
  state.cash = round2(state.cash - total)
  state.position += qty
  state.costBasis += fees.amount + fees.total
  if (!state.symbol.t0) state.frozenShares += qty
  state.feeTotal += fees.total
  const fill = {
    side,
    shares: qty,
    price,
    barIndex: state.barIndex,
    time: currentTimeLabel(state),
    amount: fees.amount,
    fees,
    realized: 0
  }
  state.fills.push(fill)
  return { ok: true, fill }
}

export function maxBuyable(state, price = currentPrice(state)) {
  const lot = state.symbol.lot || 100
  const approx = computeFees(SIDE_BUY, price, lot, state.symbol, state.feeConfig)
  const perLot = approx.amount + approx.total
  if (perLot <= 0) return 0
  const lots = Math.floor(state.cash / perLot)
  return Math.max(0, lots * lot)
}

export function advance(state, steps = 1) {
  if (state.finished) return false
  const last = state.day.close.length - 1
  state.barIndex = Math.min(last, state.barIndex + steps)
  return state.barIndex < last
}

export function finish(state) {
  state.finished = true
}

/** Mark-to-market snapshot used by the UI every bar. */
export function snapshot(state) {
  const price = currentPrice(state)
  const avg = currentAvg(state)
  const { high, low } = dayHighLowSoFar(state)
  const dev = avg > 0 ? (price - avg) / avg : 0
  return {
    price,
    avg,
    dev,
    dayHigh: high,
    dayLow: low,
    change: (price - state.day.prevClose) / state.day.prevClose,
    cost: averageCost(state),
    sellable: sellableShares(state),
    marketValue: marketValue(state, price),
    equity: equity(state, price),
    floatPnl: state.position * (price - averageCost(state)),
    t: tContribution(state, price),
    fees: state.feeTotal
  }
}
