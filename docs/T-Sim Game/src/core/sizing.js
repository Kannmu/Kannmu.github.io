/**
 * Order sizing.
 *
 * 做T is a position-sizing game as much as a timing game, so the four presets
 * are always expressed relative to the base position rather than as round money
 * amounts: ¼ / ⅓ / ½ / all. Half is the classic default; anything above the base
 * position stops being a T and starts being a directional bet.
 */

export const SIZE_PRESETS = [
  { key: 'q1', label: '¼ 底仓', ratio: 0.25 },
  { key: 'q2', label: '⅓ 底仓', ratio: 1 / 3 },
  { key: 'q3', label: '½ 底仓', ratio: 0.5 },
  { key: 'q4', label: '全部', ratio: 1 }
]

export function roundLots(shares, lot) {
  const lots = Math.floor(Math.max(0, shares) / lot)
  return lots * lot
}

export function sizeOptions(baseShares, lot, price) {
  return SIZE_PRESETS.map((preset) => {
    const shares = roundLots(baseShares * preset.ratio, lot)
    return {
      ...preset,
      shares,
      hint: `${((shares * price) / 10000).toFixed(1)}万`
    }
  })
}

/** Shares for a preset index, capped at what can actually be sold. */
export function sharesForIndex(options, index, sellable) {
  const wanted = options[index]?.shares || 0
  if (sellable !== undefined && wanted > sellable && wanted > 0) {
    return roundLots(sellable, 100)
  }
  return wanted
}
