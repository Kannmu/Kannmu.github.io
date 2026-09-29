/**
 * Round settlement, grading and mistake detection.
 *
 * The trainer's teaching loop lives here. A finished round is judged on three
 * independent axes so the player learns *why* a round went well or badly:
 *
 *   收益 profit      how much the day's 做T actually added, in bp of the base
 *                    position, benchmarked against the opportunity the day
 *                    actually offered (a flat day is not judged like a 3% swing)
 *   决策 execution   where each fill sat inside the price action that followed it
 *   纪律 discipline  did you keep the base position, or did you chase / panic
 *
 * Everything is computed from the finished day, so no look-ahead leaks into play.
 */
import { computeFees } from './fees.js'
import { averageCost, equity, sellableShares, tContribution, dayHighLowSoFar } from './engine.js'
import { classifyDay, gradeFill } from './patterns.js'

export const RATINGS = [
  { min: 88, grade: 'S', label: '教科书级', tone: 'excellent' },
  { min: 74, grade: 'A', label: '漂亮的一手', tone: 'great' },
  { min: 60, grade: 'B', label: '中规中矩', tone: 'good' },
  { min: 45, grade: 'C', label: '还有空间', tone: 'meh' },
  { min: 0, grade: 'D', label: '交了学费', tone: 'bad' }
]

export const MISTAKES = {
  CHASE_HIGH: { label: '追高买入', tip: '在当日区间上沿买入，回撤风险大。' },
  PANIC_SELL: { label: '杀跌卖出', tip: '在当日区间下沿卖出，很容易卖在最低点。' },
  NO_REBUY: { label: '没有回补底仓', tip: '收盘时持仓与底仓不一致，等于把T做成了加仓/减仓。' },
  NO_SELLBACK: { label: '没有卖回底仓', tip: '买入后没在高位卖出，T 变成了隔夜加仓。' },
  TOO_SMALL: { label: '单笔规模过小', tip: '金额低于 1 万元时，最低 5 元佣金会显著抬高成本。' },
  OVERTRADE: { label: '过度交易', tip: '一天成交笔数过多，手续费累积吃掉利润。' },
  OVERSIZE: { label: '单笔超过底仓', tip: '做T规模超过底仓，风险敞口变化过大。' },
  FEES_ATE_IT: { label: '利润被手续费吃光', tip: '毛利为正但净利为负，价差没覆盖交易成本。' },
  NO_TRADE_MISSED: { label: '空仓错过机会', tip: '当天出现了足够大的价差，全程不动等于放弃。' }
}

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v))
}

/**
 * The best single round trip the day offered at a sane size (half the base
 * position). Only one direction is actually available: if the low printed first
 * you could have run a 正T, otherwise a 倒T.
 */
export function optimalRoundTrip(day, baseShares, symbol, feeConfig) {
  const lot = symbol.lot || 100
  const size = Math.max(lot, Math.floor(baseShares / 2 / lot) * lot)
  let high = -Infinity
  let low = Infinity
  let highIndex = 0
  let lowIndex = 0
  for (let i = 0; i < day.high.length; i++) {
    if (day.high[i] > high) {
      high = day.high[i]
      highIndex = i
    }
    if (day.low[i] < low) {
      low = day.low[i]
      lowIndex = i
    }
  }
  const buyFees = computeFees('buy', low, size, symbol, feeConfig)
  const sellFees = computeFees('sell', high, size, symbol, feeConfig)
  const best = (high - low) * size - buyFees.total - sellFees.total
  return {
    size,
    high,
    low,
    highIndex,
    lowIndex,
    best,
    direction: lowIndex < highIndex ? 'long' : 'short',
    directionLabel: lowIndex < highIndex ? '正T（先买后卖）' : '倒T（先卖后买）'
  }
}

/**
 * Grade every fill against the price action that came after it, and flag the
 * habits that cost money regardless of how the round turned out.
 */
export function analyzeFills(session) {
  const day = session.day
  const n = day.close.length
  const prevClose = day.prevClose
  const fills = []

  for (const fill of session.fills) {
    const future = []
    for (let i = fill.barIndex + 1; i < n; i++) future.push(day.close[i])
    const grade = gradeFill({ side: fill.side, price: fill.price }, future)

    // Position of this fill inside the range the day had printed *so far*.
    let hi = -Infinity
    let lo = Infinity
    for (let i = 0; i <= fill.barIndex; i++) {
      hi = Math.max(hi, day.high[i])
      lo = Math.min(lo, day.low[i])
    }
    const span = hi - lo
    const posInRange = span > 0 ? (fill.price - lo) / span : 0.5
    const rangePct = span / prevClose

    fills.push({
      ...fill,
      grade,
      posInRange,
      rangePctSoFar: rangePct,
      chased: fill.side === 'buy' && rangePct > 0.005 && posInRange > 0.85,
      panicked: fill.side === 'sell' && rangePct > 0.005 && posInRange < 0.15
    })
  }

  return fills
}

function detectMistakes(session, gradedFills, optimal, t) {
  const found = new Map()
  const bump = (code) => found.set(code, (found.get(code) || 0) + 1)

  const baseNotional = session.baseShares * session.day.prevClose
  for (const fill of gradedFills) {
    if (fill.chased) bump('CHASE_HIGH')
    if (fill.panicked) bump('PANIC_SELL')
    if (fill.amount < 10000) bump('TOO_SMALL')
    if (fill.amount > baseNotional * 1.5) bump('OVERSIZE')
  }
  if (gradedFills.length > 8) bump('OVERTRADE')

  if (session.position !== session.baseShares) {
    const netShares = session.fills.reduce(
      (acc, f) => acc + (f.side === 'buy' ? f.shares : -f.shares),
      0
    )
    bump(netShares > 0 ? 'NO_SELLBACK' : 'NO_REBUY')
  }

  const fees = session.feeTotal
  // Without fees the day would have made money, but the fee stack reversed it.
  if (t < 0 && t + fees > 0 && fees > 0) bump('FEES_ATE_IT')
  if (gradedFills.length === 0 && optimal.best > baseNotional * 0.002) bump('NO_TRADE_MISSED')

  return [...found.entries()].map(([code, count]) => ({
    code,
    count,
    label: MISTAKES[code]?.label || code,
    tip: MISTAKES[code]?.tip || ''
  }))
}

export function settleRound(session) {
  const day = session.day
  const finalPrice = day.close[day.close.length - 1]
  const startEquity = session.cashStart + session.baseShares * day.prevClose
  const endEquity = equity(session, finalPrice)
  const basePnl = session.baseShares * (finalPrice - day.prevClose)
  const t = endEquity - startEquity - basePnl
  const baseNotional = session.baseShares * day.prevClose
  const tBp = baseNotional > 0 ? (t / baseNotional) * 10000 : 0

  const pattern = classifyDay(day, day.prevClose)
  const optimal = optimalRoundTrip(day, session.baseShares, session.symbol, session.feeConfig)
  const opportunityBp = baseNotional > 0 ? (optimal.best / baseNotional) * 10000 : 0
  const gradedFills = analyzeFills(session)

  // ---- profit: benchmarked to the opportunity the day actually offered ----
  // Capturing half of the best single round trip the day allowed earns full
  // marks; breaking even earns 50; losing as much as the benchmark earns 0.
  const benchmarkBp = Math.max(15, 0.5 * Math.max(opportunityBp, 0))
  let profitScore
  if (gradedFills.length === 0) {
    // Doing nothing is a decision. It is correct on a dead day and a waste on a
    // wide one, so the score has to depend on what the day actually offered.
    profitScore = opportunityBp < 25 ? 70 : 45
  } else {
    profitScore = clamp(50 + (50 * tBp) / benchmarkBp, 0, 100)
  }

  // ---- execution: average quality of the decisions themselves ----
  const executionScore = gradedFills.length
    ? gradedFills.reduce((acc, f) => acc + f.grade.score, 0) / gradedFills.length
    : 50

  // ---- discipline ----
  let disciplineScore = 100
  if (gradedFills.length === 0 && opportunityBp > 60) disciplineScore -= 20
  if (session.position !== session.baseShares) disciplineScore -= 30
  const chased = gradedFills.filter((f) => f.chased).length
  const panicked = gradedFills.filter((f) => f.panicked).length
  disciplineScore -= Math.min(30, chased * 12)
  disciplineScore -= Math.min(30, panicked * 12)
  if (gradedFills.length > 8) disciplineScore -= 10
  disciplineScore = clamp(disciplineScore, 0, 100)

  const total = 0.5 * profitScore + 0.3 * executionScore + 0.2 * disciplineScore
  const rating = RATINGS.find((r) => total >= r.min)

  const mistakes = detectMistakes(session, gradedFills, optimal, t)

  return {
    date: day.date,
    granularity: day.granularity,
    prevClose: day.prevClose,
    open: day.open,
    close: finalPrice,
    pattern,
    baseShares: session.baseShares,
    baseNotional,
    startEquity,
    endEquity,
    basePnl,
    tContribution: t,
    tBp,
    grossBeforeFees: t + session.feeTotal,
    totalFees: session.feeTotal,
    feeDragBp: baseNotional > 0 ? (session.feeTotal / baseNotional) * 10000 : 0,
    fillCount: gradedFills.length,
    fills: gradedFills,
    optimal,
    opportunityBp,
    capture: optimal.best > 0 ? t / optimal.best : null,
    scores: {
      profit: Math.round(profitScore),
      execution: Math.round(executionScore),
      discipline: Math.round(disciplineScore),
      total: Math.round(total)
    },
    rating,
    mistakes,
    endedFlat: session.position === session.baseShares,
    finalPosition: session.position,
    finalPrice,
    dayRange: dayHighLowSoFar(session),
    averageCost: averageCost(session),
    sellableAtClose: sellableShares(session)
  }
}
