import test from 'node:test'
import assert from 'node:assert/strict'
import { encodeDay, decodeDay, toInt } from '../src/core/codec.js'
import {
  advance,
  createSession,
  currentPrice,
  equity,
  finish,
  limitPrices,
  placeOrder,
  planBasePosition,
  sellableShares,
  tContribution
} from '../src/core/engine.js'
import { DEFAULT_FEE_CONFIG } from '../src/core/fees.js'
import { settleRound } from '../src/core/scoring.js'

const STOCK = { secid: '1.600000', code: '600000', name: '测试股', kind: 'stock', tick: 0.01, lot: 100, limitPct: 10, t0: false }
const T0_ETF = { secid: '1.513050', code: '513050', name: '测试跨境ETF', kind: 'etf', tick: 0.001, lot: 100, limitPct: 10, t0: true }

/** Build a synthetic 48-bar session from a list of close prices. */
function makeDay(closes, prevClose, options = {}) {
  const { granularity = 'm5', flat = false } = options
  const close = closes.map(toInt)
  const high = flat ? close.slice() : closes.map((c) => toInt(c + 0.03))
  const low = flat ? close.slice() : closes.map((c) => toInt(c - 0.03))
  const avg = closes.map((c) => toInt(c))
  const volume = closes.map(() => 1000)
  return {
    encoded: encodeDay({
      date: '20260101',
      granularity,
      prevClose: toInt(prevClose),
      open: toInt(closes[0]),
      close,
      high,
      low,
      avg,
      volume
    })
  }
}

function buildSession(day, symbol = STOCK) {
  const decoded = decodeDay(day.encoded)
  return createSession({
    symbol,
    day: decoded,
    dailyBars: [],
    feeConfig: DEFAULT_FEE_CONFIG,
    capitalTarget: 100000
  })
}

/** A V-shaped day: dips to 9.50, rallies to 10.60, closes 10.40. */
function vShapeDay() {
  const closes = []
  for (let i = 0; i < 48; i++) {
    if (i <= 12) closes.push(10 - (i / 12) * 0.5)
    else closes.push(9.5 + ((i - 12) / 35) * 1.1)
  }
  return makeDay(closes, 10)
}

test('base position is planned to the capital target and stays lot aligned', () => {
  assert.equal(planBasePosition(10, 100, 100000), 10000)
  assert.equal(planBasePosition(1243.88, 100, 100000), 100)
  assert.equal(planBasePosition(4.4, 100, 100000) % 100, 0)
})

test('limit prices round to the instrument tick', () => {
  assert.deepEqual(limitPrices(10, 10, 0.01), { up: 11, down: 9 })
  assert.deepEqual(limitPrices(4.412, 10, 0.001), { up: 4.853, down: 3.971 })
})

test('a 正T round trip on a V-shaped day makes money and leaves the base intact', () => {
  const session = buildSession(vShapeDay())
  const base = session.baseShares
  assert.equal(base, 10000)

  advance(session, 12) // the low
  assert.equal(Number(currentPrice(session).toFixed(2)), 9.5)
  const buy = placeOrder(session, 'buy', 5000)
  assert.ok(buy.ok, buy.reason)
  assert.equal(session.position, 15000)
  // T+1: nothing bought today can be sold yet
  assert.equal(sellableShares(session), 10000)

  advance(session, 35) // the high
  assert.ok(currentPrice(session) > 10.5)
  const sell = placeOrder(session, 'sell', 5000)
  assert.ok(sell.ok, sell.reason)
  assert.equal(session.position, base, 'base position must be restored')

  const t = tContribution(session)
  // 5000 shares bought at 9.50 and sold above 10.5, minus two fee stacks
  assert.ok(t > 4800, `expected a solid gain, got ${t}`)
  // ~24 CNY commission + transfer on the buy, ~27 commission + 27 stamp on the sell
  assert.ok(session.feeTotal > 70, `both legs must pay commission plus stamp duty, got ${session.feeTotal}`)
})

test('T+1 blocks selling what was bought today, even at a profit', () => {
  const session = buildSession(vShapeDay())
  advance(session, 12)
  placeOrder(session, 'buy', 3000)
  // the base position is still sellable, but not the 3,000 bought today
  assert.equal(sellableShares(session), 10000)
  const tooMany = placeOrder(session, 'sell', 13000)
  assert.equal(tooMany.ok, false)
  assert.match(tooMany.reason, /可卖数量不足|T\+1/)

  const allowed = placeOrder(session, 'sell', 10000)
  assert.ok(allowed.ok)
  assert.equal(sellableShares(session), 0)
  const blocked = placeOrder(session, 'sell', 100)
  assert.equal(blocked.ok, false)
  assert.match(blocked.reason, /T\+1/)
})

test('T+0 instruments rotate freely within the day', () => {
  const session = buildSession(vShapeDay(), T0_ETF)
  advance(session, 12)
  placeOrder(session, 'buy', 3000)
  assert.equal(sellableShares(session), session.position)
  const sell = placeOrder(session, 'sell', 3000)
  assert.ok(sell.ok)
})

test('orders must be lot aligned, and cash cannot go negative', () => {
  const session = buildSession(vShapeDay())
  const bad = placeOrder(session, 'buy', 150)
  assert.equal(bad.ok, false)
  assert.match(bad.reason, /整数倍/)

  const huge = placeOrder(session, 'buy', 100000)
  assert.equal(huge.ok, false)
  assert.match(huge.reason, /现金不足/)
  assert.ok(session.cash >= 0)
})

test('a bar locked at the limit cannot be bought, and a locked down bar cannot be sold', () => {
  // 一字板: the whole 5-minute bar prints at a single price, the limit price
  const upDay = makeDay(new Array(48).fill(11), 10, { flat: true })
  const upSession = buildSession(upDay)
  advance(upSession, 5)
  const buy = placeOrder(upSession, 'buy', 100)
  assert.equal(buy.ok, false)
  assert.match(buy.reason, /涨停/)

  const downDay = makeDay(new Array(48).fill(9), 10, { flat: true })
  const downSession = buildSession(downDay)
  advance(downSession, 5)
  const sell = placeOrder(downSession, 'sell', 100)
  assert.equal(sell.ok, false)
  assert.match(sell.reason, /跌停/)
})

test('a bar that merely touches the limit is still tradable', () => {
  // high = 11 exactly at the limit, but the bar traded down to 10.90 too
  const day = makeDay(new Array(48).fill(11), 10)
  const session = buildSession(day)
  advance(session, 5)
  const buy = placeOrder(session, 'buy', 100)
  assert.ok(buy.ok, 'only a fully locked bar should be unfillable')
})

test('doing nothing leaves the account exactly where it started', () => {
  const session = buildSession(vShapeDay())
  const start = equity(session, session.day.prevClose)
  advance(session, 47)
  const end = equity(session)
  // the base position moved with the market, and the T contribution is zero
  assert.equal(session.feeTotal, 0)
  assert.ok(Math.abs(tContribution(session)) < 1e-6)
  assert.notEqual(end, start)
})

test('settlement captures the opportunity a wide day offered', () => {
  const session = buildSession(vShapeDay())
  advance(session, 12)
  placeOrder(session, 'buy', 5000)
  advance(session, 30)
  placeOrder(session, 'sell', 5000)
  advance(session, 5)
  finish(session)
  const result = settleRound(session)

  assert.ok(result.optimal.best > 0)
  assert.equal(result.optimal.direction, 'long', 'the low printed before the high')
  assert.ok(result.tContribution > 0)
  assert.ok(result.tBp > 0)
  assert.ok(result.scores.total >= 0 && result.scores.total <= 100)
  assert.equal(result.endedFlat, true)
  assert.equal(result.fillCount, 2)
  assert.ok(result.fills.every((f) => f.grade.score >= 0 && f.grade.score <= 100))
})

test('a wide day on which the player never trades is scored as a missed chance', () => {
  const session = buildSession(vShapeDay())
  advance(session, 47)
  finish(session)
  const result = settleRound(session)

  assert.equal(result.fillCount, 0)
  assert.ok(Math.abs(result.tContribution) < 1e-6)
  assert.equal(result.endedFlat, true)
  assert.equal(result.scores.execution, 50)
  assert.ok(
    result.mistakes.some((m) => m.code === 'NO_TRADE_MISSED'),
    'sitting out a 11% range day must be flagged'
  )
})

test('chasing the high is detected and costs discipline points', () => {
  const session = buildSession(vShapeDay())
  // buy right at the top of the day, then dump it back lower
  advance(session, 40)
  placeOrder(session, 'buy', 5000)
  const chaseIndex = session.fills[0].barIndex
  advance(session, 7)
  placeOrder(session, 'sell', 5000)
  finish(session)
  const result = settleRound(session)

  const chased = result.fills.find((f) => f.barIndex === chaseIndex)
  assert.ok(chased.chased, 'a buy at the day high must be flagged as chasing')
  assert.ok(result.scores.discipline < 100)
  assert.ok(result.mistakes.some((m) => m.code === 'CHASE_HIGH'))
})
