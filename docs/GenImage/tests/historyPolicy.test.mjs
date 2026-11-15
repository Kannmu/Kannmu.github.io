import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  HISTORY_LIMIT_DEFAULT,
  HISTORY_LIMIT_MAX,
  HISTORY_LIMIT_MIN,
  clampHistoryLimit,
  computeHistoryBudget,
  estimateRecordBytes,
  formatBytes,
  pruneHistory
} from '../src/services/historyPolicy.ts'

const record = (id, createdAt, padding = '') => ({
  id,
  createdAt,
  prompt: padding,
  items: []
})

const recordsNewestFirst = (count, padding = '') => Array.from({ length: count }, (_, index) => {
  const date = new Date(Date.UTC(2026, 0, 1, 0, index))
  return record(`record-${index}`, date.toISOString(), padding)
})

test('clamps the history limit to the supported 5-10 range', () => {
  assert.equal(clampHistoryLimit(1), HISTORY_LIMIT_MIN)
  assert.equal(clampHistoryLimit(42), HISTORY_LIMIT_MAX)
  assert.equal(clampHistoryLimit(7), 7)
  assert.equal(clampHistoryLimit('9'), 9)
  assert.equal(clampHistoryLimit('nope'), HISTORY_LIMIT_DEFAULT)
  assert.equal(clampHistoryLimit(null), HISTORY_LIMIT_DEFAULT)
  assert.equal(clampHistoryLimit(Number.NaN), HISTORY_LIMIT_DEFAULT)
})

test('keeps only the newest N records (circular overwrite)', () => {
  const records = recordsNewestFirst(14)
  const { kept, removed, bytes } = pruneHistory(records, 8, 64 * 1024 * 1024)

  assert.equal(kept.length, 8)
  assert.equal(removed.length, 6)
  assert.deepEqual(kept.map((entry) => entry.id), [
    'record-13',
    'record-12',
    'record-11',
    'record-10',
    'record-9',
    'record-8',
    'record-7',
    'record-6'
  ])
  assert.deepEqual(removed.map((entry) => entry.id), [
    'record-5',
    'record-4',
    'record-3',
    'record-2',
    'record-1',
    'record-0'
  ])
  assert.equal(bytes, kept.reduce((total, entry) => total + estimateRecordBytes(entry), 0))
})

test('sorts records by creation time regardless of insertion order', () => {
  const records = [
    record('older', '2026-01-01T00:00:00.000Z'),
    record('newest', '2026-01-03T00:00:00.000Z'),
    record('middle', '2026-01-02T00:00:00.000Z')
  ]
  const { kept } = pruneHistory(records, 5, 64 * 1024 * 1024)
  assert.deepEqual(kept.map((entry) => entry.id), ['newest', 'middle', 'older'])
})

test('evicts the oldest records first when the byte budget is exceeded', () => {
  const records = recordsNewestFirst(6, 'x'.repeat(2_000))
  const single = estimateRecordBytes(records[records.length - 1])
  const budget = single * 3

  const { kept, removed } = pruneHistory(records, 8, budget)

  assert.equal(kept.length, 3)
  assert.deepEqual(kept.map((entry) => entry.id), ['record-5', 'record-4', 'record-3'])
  assert.equal(removed.length, 3)
})

test('always keeps the newest record even when it exceeds the whole budget', () => {
  const records = recordsNewestFirst(3, 'x'.repeat(50_000))
  const { kept } = pruneHistory(records, 8, 1)

  assert.equal(kept.length, 1)
  assert.equal(kept[0].id, 'record-2')
})

test('respects the byte budget and the record count together', () => {
  const records = recordsNewestFirst(10, 'x'.repeat(1_000))
  const single = estimateRecordBytes(records[0])

  const byCount = pruneHistory(records, 5, single * 100)
  assert.equal(byCount.kept.length, 5)

  const byBytes = pruneHistory(records, 10, single * 4)
  assert.equal(byBytes.kept.length, 4)
  assert.deepEqual(byBytes.kept.map((entry) => entry.id), ['record-9', 'record-8', 'record-7', 'record-6'])
})

test('derives a bounded storage budget from the browser quota', () => {
  const megabyte = 1024 * 1024

  assert.equal(computeHistoryBudget(null), 32 * megabyte)
  assert.equal(computeHistoryBudget(undefined), 32 * megabyte)
  assert.equal(computeHistoryBudget(Number.NaN), 32 * megabyte)
  assert.equal(computeHistoryBudget(0), 32 * megabyte)

  // 15% of the quota, clamped between 8 MB and 64 MB.
  assert.equal(computeHistoryBudget(10 * megabyte), 8 * megabyte)
  assert.equal(computeHistoryBudget(100 * megabyte), 15 * megabyte)
  assert.equal(computeHistoryBudget(10 * 1024 * megabyte), 64 * megabyte)
})

test('formats byte sizes for the history header', () => {
  assert.equal(formatBytes(0), '0 KB')
  assert.equal(formatBytes(900), '1 KB')
  assert.equal(formatBytes(1536), '2 KB')
  assert.equal(formatBytes(5 * 1024 * 1024), '5.0 MB')
})
