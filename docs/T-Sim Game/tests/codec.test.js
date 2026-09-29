import test from 'node:test'
import assert from 'node:assert/strict'
import { encodeDay, decodeDay, toInt, sessionTimeline } from '../src/core/codec.js'

test('a day survives an encode/decode round trip exactly', () => {
  const close = [10000, 10050, 9980, 10120, 10010]
  const high = [10060, 10080, 9990, 10160, 10040]
  const low = [9990, 10010, 9950, 10080, 9980]
  const avg = [10020, 10040, 10000, 10090, 10030]
  const volume = [10, 20, 30, 40, 50]

  const encoded = encodeDay({
    date: '20260101',
    granularity: 'm5',
    prevClose: 9990,
    open: 10000,
    close,
    high,
    low,
    avg,
    volume
  })
  const decoded = decodeDay(encoded)

  // decodeDay() normalises 厘 back to CNY, so every value is the input / 1000
  assert.deepEqual(decoded.close, close.map((v) => v / 1000))
  assert.deepEqual(decoded.high, high.map((v) => v / 1000))
  assert.deepEqual(decoded.low, low.map((v) => v / 1000))
  assert.deepEqual(decoded.avg, avg.map((v) => v / 1000))
  assert.deepEqual(decoded.volume, volume)
  assert.equal(decoded.prevClose, 9.99)
  assert.equal(decoded.open, 10)
})

test('ETF prices keep their third decimal', () => {
  assert.equal(toInt(0.478), 478)
  assert.equal(toInt(4.412), 4412)
  const encoded = encodeDay({
    date: '20260101',
    granularity: 'm1',
    prevClose: 478,
    open: 478,
    close: [479, 481],
    high: [480, 482],
    low: [477, 479],
    avg: [478, 480],
    volume: [1, 2]
  })
  const decoded = decodeDay(encoded)
  assert.deepEqual(decoded.close, [0.479, 0.481])
  assert.deepEqual(decoded.high, [0.48, 0.482])
})

test('session timelines have the bar counts the A-share session requires', () => {
  assert.equal(sessionTimeline('m5').length, 48)
  assert.equal(sessionTimeline('m1').length, 241)
  assert.equal(sessionTimeline('m5')[0], 9 * 60 + 35)
  assert.equal(sessionTimeline('m5').at(-1), 15 * 60)
  assert.equal(sessionTimeline('m1')[0], 9 * 60 + 30)
  assert.equal(sessionTimeline('m1').at(-1), 15 * 60)
  // the lunch break is excluded
  assert.ok(!sessionTimeline('m1').includes(12 * 60))
})
