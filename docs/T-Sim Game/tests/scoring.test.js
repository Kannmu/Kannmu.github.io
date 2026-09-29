import test from 'node:test'
import assert from 'node:assert/strict'
import { encodeDay, decodeDay, toInt } from '../src/core/codec.js'
import { advance, createSession, finish, placeOrder } from '../src/core/engine.js'
import { DEFAULT_FEE_CONFIG } from '../src/core/fees.js'
import { optimalRoundTrip, RATINGS, settleRound } from '../src/core/scoring.js'
import { classifyDay } from '../src/core/patterns.js'

const STOCK = {
  secid: '1.600000',
  code: '600000',
  name: '测试股',
  kind: 'stock',
  tick: 0.01,
  lot: 100,
  limitPct: 10,
  t0: false
}

function makeDay(closes, prevClose, pad = 0.03) {
  return decodeDay(
    encodeDay({
      date: '20260101',
      granularity: 'm5',
      prevClose: toInt(prevClose),
      open: toInt(closes[0]),
      close: closes.map(toInt),
      high: closes.map((c) => toInt(c + pad)),
      low: closes.map((c) => toInt(c - pad)),
      avg: closes.map(toInt),
      volume: closes.map(() => 1000)
    })
  )
}

function session(day) {
  return createSession({
    symbol: STOCK,
    day,
    dailyBars: [],
    feeConfig: DEFAULT_FEE_CONFIG,
    capitalTarget: 100000
  })
}

/** A wide V day: 10.00 -> 9.40 -> 10.90 */
function wideDay() {
  const closes = []
  for (let i = 0; i < 48; i++) {
    closes.push(i <= 14 ? 10 - (i / 14) * 0.6 : 9.4 + ((i - 14) / 33) * 1.5)
  }
  return makeDay(closes, 10)
}

/** A dead flat day drifting inside 0.3%. */
function flatDay() {
  const closes = []
  for (let i = 0; i < 48; i++) closes.push(10 + Math.sin(i / 5) * 0.006)
  return makeDay(closes, 10, 0.004)
}

test('optimal round trip picks the direction the day actually allowed', () => {
  const vUp = optimalRoundTrip(wideDay(), 10000, STOCK, DEFAULT_FEE_CONFIG)
  assert.equal(vUp.direction, 'long')
  assert.match(vUp.directionLabel, /正T/)
  assert.ok(vUp.best > 0)

  // spike first, then a slide below the open: only a 倒T was available
  const reversed = []
  for (let i = 0; i < 48; i++) reversed.push(i <= 20 ? 10 + (i / 20) * 0.9 : 10.9 - ((i - 20) / 27) * 1.0)
  const vDown = optimalRoundTrip(makeDay(reversed, 10), 10000, STOCK, DEFAULT_FEE_CONFIG)
  assert.equal(vDown.direction, 'short')
  assert.match(vDown.directionLabel, /倒T/)
})

test('sitting out a dead-flat day is scored as a correct decision', () => {
  const state = session(flatDay())
  advance(state, 47)
  finish(state)
  const result = settleRound(state)

  assert.equal(result.fillCount, 0)
  assert.ok(result.opportunityBp < 25, 'a flat day offers almost nothing')
  assert.equal(result.scores.profit, 70, 'not losing on a dead day is a skill')
  assert.equal(result.scores.discipline, 100, 'there was nothing to be undisciplined about')
  assert.ok(result.scores.total >= 60, `expected a pass, got ${result.scores.total}`)
  assert.ok(!result.mistakes.some((m) => m.code === 'NO_TRADE_MISSED'))
})

test('sitting out a wide day is scored as a wasted opportunity', () => {
  const state = session(wideDay())
  advance(state, 47)
  finish(state)
  const result = settleRound(state)

  assert.equal(result.fillCount, 0)
  assert.ok(result.opportunityBp > 60, 'the day offered a real range')
  assert.equal(result.scores.profit, 45)
  assert.ok(result.scores.discipline < 100, 'missing a wide day costs discipline points')
  assert.ok(result.scores.total < 60, `expected a below-pass score, got ${result.scores.total}`)
  assert.ok(result.mistakes.some((m) => m.code === 'NO_TRADE_MISSED'))
})

test('capturing about half of the available move earns a top profit score', () => {
  const day = wideDay()
  const state = session(day)
  // buy the low, sell the high at half the base position
  advance(state, 14)
  placeOrder(state, 'buy', 5000)
  advance(state, 33)
  placeOrder(state, 'sell', 5000)
  finish(state)
  const result = settleRound(state)

  assert.ok(result.capture > 0.85, `expected a high capture, got ${result.capture}`)
  assert.equal(result.scores.profit, 100)
  assert.ok(result.scores.total >= RATINGS[0].min, `expected an S, got ${result.scores.total}`)
})

test('a losing round lands in the bottom grades', () => {
  const day = wideDay()
  const state = session(day)
  // sell the low, buy the high: the classic way to lose money 做T
  advance(state, 14)
  placeOrder(state, 'sell', 5000)
  advance(state, 30)
  placeOrder(state, 'buy', 5000)
  finish(state)
  const result = settleRound(state)

  assert.ok(result.tContribution < 0)
  assert.ok(result.optimal.direction === 'long')
  assert.ok(result.scores.profit < 30)
  assert.ok(result.scores.total < 60)
})

test('every rating band is reachable and ordered', () => {
  for (let i = 1; i < RATINGS.length; i++) {
    assert.ok(RATINGS[i - 1].min > RATINGS[i].min, 'bands must descend')
  }
  assert.equal(RATINGS.at(-1).min, 0, 'the last band must catch everything')
})

test('day classification separates trend, range and reversal shapes', () => {
  const trend = []
  for (let i = 0; i < 48; i++) trend.push(10 + i * 0.02)
  assert.equal(classifyDay(makeDay(trend, 10), 10).code, 'UP')

  const down = []
  for (let i = 0; i < 48; i++) down.push(10 - i * 0.02)
  assert.equal(classifyDay(makeDay(down, 10), 10).code, 'DOWN')

  assert.equal(classifyDay(flatDay(), 10).code, 'FLAT')

  // deep morning dip then a full recovery
  const vrev = []
  for (let i = 0; i < 48; i++) vrev.push(i <= 10 ? 10 - (i / 10) * 0.25 : 9.75 + ((i - 10) / 37) * 0.4)
  assert.equal(classifyDay(makeDay(vrev, 10), 10).code, 'VREV')

  // morning spike then a full give-back
  const arev = []
  for (let i = 0; i < 48; i++) arev.push(i <= 10 ? 10 + (i / 10) * 0.25 : 10.25 - ((i - 10) / 37) * 0.4)
  assert.equal(classifyDay(makeDay(arev, 10), 10).code, 'AREV')
})
