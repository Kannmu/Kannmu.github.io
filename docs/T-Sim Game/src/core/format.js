/** Small display helpers shared by the interface. */

export function formatMoney(value, digits = 2) {
  if (!Number.isFinite(value)) return '--'
  const sign = value < 0 ? '-' : ''
  const abs = Math.abs(value)
  return `${sign}${abs.toLocaleString('zh-CN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })}`
}

/** Sign is decided on the *rounded* value, so -0.001 never prints as "-0.00". */
function signedPrefix(value, digits) {
  const rounded = Number(value.toFixed(digits))
  if (rounded > 0) return '+'
  if (rounded < 0) return '-'
  return ''
}

export function formatSigned(value, digits = 2) {
  if (!Number.isFinite(value)) return '--'
  return `${signedPrefix(value, digits)}${formatMoney(Math.abs(value), digits)}`
}

export function formatPct(value, digits = 2) {
  if (!Number.isFinite(value)) return '--'
  return `${signedPrefix(value, digits)}${(Math.abs(value) * 100).toFixed(digits)}%`
}

export function formatSignedNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return '--'
  return `${signedPrefix(value, digits)}${Math.abs(value).toFixed(digits)}`
}

export function formatShares(value) {
  if (!Number.isFinite(value)) return '--'
  return Math.round(value).toLocaleString('zh-CN')
}

export function formatPrice(value, tick = 0.01) {
  const digits = tick === 0.001 ? 3 : 2
  return Number(value).toFixed(digits)
}

export function formatDate(yyyymmdd) {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd || ''
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}

export function patternShort(code) {
  return (
    {
      UP: '单边涨',
      DOWN: '单边跌',
      RANGE: '宽震荡',
      FLAT: '窄盘整',
      VREV: '探底回升',
      AREV: '冲高回落'
    }[code] || code
  )
}
