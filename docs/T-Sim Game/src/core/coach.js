/**
 * The coach.
 *
 * Hard rule: every hint is derived only from bars that have already printed.
 * A hint that peeks at the future would destroy the training value of the whole
 * tool, so nothing in this file may read past `session.barIndex`.
 *
 * The hints encode the handful of intraday facts that actually matter for 做T:
 * the 均价线 as the day's bull/bear divide, the rhythm of the session, where the
 * current price sits inside the day's range, the T+1 constraint, and fees.
 */
import { currentAvg, currentPrice, dayHighLowSoFar, limitState, sellableShares } from './engine.js'

export function barProgress(session) {
  return session.barIndex / Math.max(1, session.day.close.length - 1)
}

/**
 * @returns {{dev:number, posInRange:number, rangePct:number, phase:string, minutes:string}}
 */
export function readContext(session) {
  const price = currentPrice(session)
  const avg = currentAvg(session)
  const { high, low } = dayHighLowSoFar(session)
  const span = high - low
  const dev = avg > 0 ? (price - avg) / avg : 0
  const rangePct = span / session.day.prevClose
  const progress = barProgress(session)

  let phase = '盘中'
  if (progress < 0.12) phase = '开盘'
  else if (progress < 0.45) phase = '上午'
  else if (progress < 0.56) phase = '午间'
  else if (progress < 0.85) phase = '午后'
  else phase = '尾盘'

  return {
    price,
    avg,
    dev,
    high,
    low,
    span,
    rangePct,
    posInRange: span > 0 ? (price - low) / span : 0.5,
    progress,
    phase
  }
}

/**
 * Ranked hints for the current bar. The UI shows the first one or two.
 */
export function coachHints(session) {
  const ctx = readContext(session)
  const hints = []
  const devBp = ctx.dev * 10000
  const progress = ctx.progress

  // --- 均价线乖离: the core 做T signal -------------------------------------
  if (devBp <= -150) {
    hints.push({
      id: 'dev-low',
      level: 'signal',
      text: `现价低于均价线 ${Math.abs(devBp).toFixed(0)}bp，日内均值回归的典型位置 — 正T观察窗口`,
      short: `乖离 -${Math.abs(devBp).toFixed(0)}bp`
    })
  } else if (devBp >= 150) {
    hints.push({
      id: 'dev-high',
      level: 'signal',
      text: `现价高于均价线 ${devBp.toFixed(0)}bp，冲高回落的典型位置 — 倒T观察窗口`,
      short: `乖离 +${devBp.toFixed(0)}bp`
    })
  }

  // --- session rhythm ------------------------------------------------------
  if (progress < 0.12) {
    hints.push({
      id: 'open',
      level: 'info',
      text: '开盘 30 分钟情绪最重、波动最大，先看清楚再出手，别一次打满'
    })
  } else if (progress >= 0.42 && progress <= 0.56) {
    hints.push({ id: 'midday', level: 'info', text: '上午收盘前后常出现当天的第一个高低点，注意量能是否配合' })
  } else if (progress > 0.6 && progress < 0.72) {
    hints.push({ id: 'afternoon', level: 'info', text: '午后开盘常有二次探底或补涨，是回补底仓的常见时点' })
  } else if (progress > 0.88) {
    hints.push({ id: 'close', level: 'info', text: '尾盘 30 分钟：检查一下底仓是否已经回到原数量' })
  }

  // --- position inside the day's range -------------------------------------
  if (ctx.rangePct > 0.006) {
    if (ctx.posInRange > 0.9) {
      hints.push({ id: 'near-high', level: 'caution', text: '已在日内区间上沿，这个位置买入是追高' })
    } else if (ctx.posInRange < 0.1) {
      hints.push({ id: 'near-low', level: 'caution', text: '已在日内区间下沿，这个位置卖出容易卖飞' })
    }
  }

  // --- T+1 constraint ------------------------------------------------------
  if (session.frozenShares > 0 && !session.symbol.t0) {
    hints.push({
      id: 't1',
      level: 'info',
      text: `T+1：今日买入的 ${session.frozenShares} 股今天不能卖，可卖只有 ${sellableShares(session)} 股`
    })
  }

  // --- did the player do anything yet --------------------------------------
  if (session.fills.length === 0 && progress > 0.5) {
    hints.push({ id: 'idle', level: 'info', text: '今天还没有出手。如果全天就这么过去，收益就是 0' })
  }

  // --- open buy with a profit available ------------------------------------
  const lastBuy = [...session.fills].reverse().find((f) => f.side === 'buy')
  if (lastBuy && ctx.price > lastBuy.price * 1.004 && sellableShares(session) > 0) {
    hints.push({
      id: 'take-profit',
      level: 'info',
      text: `已买入的部分浮盈 ${(((ctx.price - lastBuy.price) / lastBuy.price) * 100).toFixed(2)}%，可以卖出等量底仓锁定差价`
    })
  }

  // --- limit board ---------------------------------------------------------
  const limits = limitState(session)
  if (limits.lockedUp) hints.push({ id: 'limit-up', level: 'caution', text: '一字涨停封板，今天买不进去' })
  if (limits.lockedDown) hints.push({ id: 'limit-down', level: 'caution', text: '一字跌停封死，今天卖不出来' })

  return hints
}

/**
 * Fast-forward target: the next bar that is actually worth a decision.
 * Used by the "跳到下一个关键点" button so a round never drags.
 */
export function nextSignalBar(session) {
  const day = session.day
  const n = day.close.length
  let high = -Infinity
  let low = Infinity
  for (let i = 0; i <= session.barIndex; i++) {
    high = Math.max(high, day.high[i])
    low = Math.min(low, day.low[i])
  }
  const rangeRef = Math.max(high - low, day.prevClose * 0.004)

  for (let i = session.barIndex + 1; i < n; i++) {
    const price = day.close[i]
    const avg = day.avg[i]
    const dev = avg > 0 ? (price - avg) / avg : 0
    const isExtreme = price > high || price < low
    const stretched = Math.abs(dev) >= 0.012
    const swingy = Math.abs(price - day.close[Math.max(0, i - 3)]) > rangeRef * 0.35
    if (stretched || (isExtreme && Math.abs(dev) >= 0.005) || swingy) return i
  }
  return n - 1
}

