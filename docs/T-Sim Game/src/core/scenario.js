/**
 * Scenario picking: which instrument, which historical day, which bar size.
 *
 * Endless mode leans on this. The goal is variety with intent — a beginner
 * should meet calm ETFs, an advanced player should meet 5% swinging small caps,
 * and the same day should not come around twice in a row. Difficulty is driven
 * by the realised range of the *day*, not the reputation of the instrument.
 */
import { formatDate } from './format.js'

// Bands are tuned to the actual distribution of the bundled dataset
// (median day range ≈ 4.3%, 10th percentile ≈ 1.6%).
export const DIFFICULTIES = {
  easy: { key: 'easy', label: '入门', detail: '低波动 ETF / 大盘股，振幅 ≤2.2%', minBp: 0, maxBp: 220 },
  normal: { key: 'normal', label: '进阶', detail: '振幅 1.4% ~ 5.6%', minBp: 140, maxBp: 560 },
  hard: { key: 'hard', label: '高手', detail: '振幅 ≥4.3%，高波动个股为主', minBp: 430, maxBp: 100000 },
  mixed: { key: 'mixed', label: '混合', detail: '不限制振幅，全部历史场景随机', minBp: 0, maxBp: 100000 }
}

export const GRANULARITIES = {
  any: { key: 'any', label: '任意' },
  m1: { key: 'm1', label: '1 分钟' },
  m5: { key: 'm5', label: '5 分钟' }
}

const GRAN_MASK = { m1: 1, m5: 2 }

export function scenarioKey(symbol, day) {
  return `${symbol.secid}:${day[0]}:${day[3] === 1 ? 'm1' : 'm5'}`
}

export function describeScenario(symbol, day) {
  return {
    key: scenarioKey(symbol, day),
    secid: symbol.secid,
    name: symbol.name,
    code: symbol.code,
    kind: symbol.kind,
    date: day[0],
    dateLabel: formatDate(day[0]),
    rangeBp: day[1],
    pattern: day[2],
    granularity: day[3] === 1 ? 'm1' : 'm5'
  }
}

/**
 * Flatten the catalog into candidate scenarios. ~5k entries for the full
 * dataset, cheap enough to rebuild whenever the filters change.
 */
export function buildCandidates(catalog, { difficulty = 'mixed', kinds = [], patterns = [], granularity = 'any' } = {}) {
  const band = DIFFICULTIES[difficulty] || DIFFICULTIES.mixed
  const mask = granularity === 'any' ? 0 : GRAN_MASK[granularity]
  const kindSet = kinds.length ? new Set(kinds) : null
  const patternSet = patterns.length ? new Set(patterns) : null

  const out = []
  for (const symbol of catalog) {
    if (kindSet && !kindSet.has(symbol.kind)) continue
    for (const day of symbol.days) {
      if (day[1] < band.minBp || day[1] > band.maxBp) continue
      if (mask && (day[3] & mask) === 0) continue
      if (patternSet && !patternSet.has(day[2])) continue
      out.push({ symbol, day })
    }
  }
  return out
}

/**
 * @param {object} options
 * @param {ReturnType<import('./rng.js').createRng>} options.rng
 * @param {Set<string>} [options.seen] scenario keys already played
 * @param {string[]} [options.recent] most recently played keys, newest first
 * @param {string} [options.exclude]
 */
export function pickScenario(candidates, { rng, seen, recent = [], exclude, preferFresh = true } = {}) {
  if (!candidates.length) return null
  const recentSet = new Set(recent.slice(0, 40))
  const pool = candidates.filter((c) => scenarioKey(c.symbol, c.day) !== exclude)
  const usable = pool.length ? pool : candidates
  if (!preferFresh) return usable[rng.int(usable.length)]

  return rng.pickWeighted(usable, (c) => {
    const key = scenarioKey(c.symbol, c.day)
    if (recentSet.has(key)) return 0.15
    if (seen && seen.has(key)) return 1
    return 6
  })
}
