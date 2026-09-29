import test from 'node:test'
import assert from 'node:assert/strict'
import { computeFees, breakEvenMove, DEFAULT_FEE_CONFIG } from '../src/core/fees.js'

const stock = { kind: 'stock', lot: 100, tick: 0.01 }
const etf = { kind: 'etf', lot: 100, tick: 0.001 }

test('commission is the configured rate once the ticket is large enough', () => {
  // 20,000 CNY at 万5 = 10 CNY, above the 5 CNY floor
  const fees = computeFees('buy', 10, 2000, stock, DEFAULT_FEE_CONFIG)
  assert.equal(fees.amount, 20000)
  assert.equal(Math.round(fees.commission * 100) / 100, 10)
})

test('the 5 CNY minimum commission dominates small tickets', () => {
  // 5,000 CNY at 万5 would be 2.5 CNY, so the floor applies
  const small = computeFees('buy', 10, 500, stock, DEFAULT_FEE_CONFIG)
  assert.equal(small.commission, 5)

  // 10,000 CNY is exactly the break-even between rate and floor
  const atFloor = computeFees('buy', 10, 1000, stock, DEFAULT_FEE_CONFIG)
  assert.equal(atFloor.commission, 5)

  // one yuan more and the rate takes over
  const above = computeFees('buy', 10, 1100, stock, DEFAULT_FEE_CONFIG)
  assert.equal(Math.round(above.commission * 100) / 100, 5.5)
})

test('stamp duty is charged on sells of stocks only', () => {
  const buyStock = computeFees('buy', 10, 1000, stock, DEFAULT_FEE_CONFIG)
  const sellStock = computeFees('sell', 10, 1000, stock, DEFAULT_FEE_CONFIG)
  assert.equal(buyStock.stampDuty, 0)
  assert.equal(Math.round(sellStock.stampDuty * 100) / 100, 5)

  const sellEtf = computeFees('sell', 4.4, 10000, etf, DEFAULT_FEE_CONFIG)
  assert.equal(sellEtf.stampDuty, 0)
})

test('a round trip on a 100k position needs roughly 0.15% to break even', () => {
  const move = breakEvenMove(10, 10000, stock, DEFAULT_FEE_CONFIG)
  // 50 buy commission + 50 sell commission + 50 stamp + 2 transfer = 152 CNY
  assert.ok(move > 0.14 && move < 0.16, `expected ~0.152%, got ${move}%`)
})

test('small tickets are proportionally far more expensive', () => {
  // 100,000 CNY ticket: the rate applies on both legs
  const big = breakEvenMove(10, 10000, stock, DEFAULT_FEE_CONFIG)
  // 2,000 CNY ticket: the 5 CNY floor applies instead of the 1 CNY rate
  const small = breakEvenMove(10, 200, stock, DEFAULT_FEE_CONFIG)
  assert.ok(small > big * 3, `expected the floor to dominate, got ${small}% vs ${big}%`)
})

test('ETFs avoid stamp duty, so they are cheaper to rotate', () => {
  const stockMove = breakEvenMove(4.4, 20000, stock, DEFAULT_FEE_CONFIG)
  const etfMove = breakEvenMove(4.4, 20000, etf, DEFAULT_FEE_CONFIG)
  assert.ok(etfMove < stockMove)
})
