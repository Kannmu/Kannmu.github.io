/**
 * A-share transaction cost model.
 *
 * Defaults follow the rules given for this trainer:
 *   - 佣金 commission: 万分之五 (0.05%) on both sides, minimum 5 元 per order
 *     ("买入每笔佣金最低5元，其他万分之五")
 *   - 印花税 stamp duty: 万分之五 (0.05%), charged on SELL only, stocks only
 *     (ETFs and funds are exempt)
 *   - 过户费 transfer fee: 万分之0.1 (0.001%), both sides
 *
 * Cost awareness is one of the two or three things that separate a profitable
 * 做T habit from a churning one, so every config value here is exposed in the UI
 * and the break-even move is always shown next to the order ticket.
 */

export const FEE_PRESETS = {
  custom: { label: '自定义', config: null },
  user: {
    label: '默认（万五，最低5元）',
    config: {
      commissionRate: 0.0005,
      commissionMin: 5,
      stampDutyRate: 0.0005,
      stampDutyOnEtf: false,
      transferFeeRate: 0.00001,
      transferFeeOnEtf: true
    }
  },
  lowCommission: {
    label: '低佣账户（万1.5，最低5元）',
    config: {
      commissionRate: 0.00015,
      commissionMin: 5,
      stampDutyRate: 0.0005,
      stampDutyOnEtf: false,
      transferFeeRate: 0.00001,
      transferFeeOnEtf: true
    }
  },
  zeroFee: {
    label: '理想零费用（仅用于对比）',
    config: {
      commissionRate: 0,
      commissionMin: 0,
      stampDutyRate: 0,
      stampDutyOnEtf: false,
      transferFeeRate: 0,
      transferFeeOnEtf: true
    }
  }
}

export const DEFAULT_FEE_CONFIG = { ...FEE_PRESETS.user.config }

export function normalizeFeeConfig(partial) {
  const config = { ...DEFAULT_FEE_CONFIG, ...(partial || {}) }
  return {
    commissionRate: clampNonNegative(config.commissionRate),
    commissionMin: clampNonNegative(config.commissionMin),
    stampDutyRate: clampNonNegative(config.stampDutyRate),
    stampDutyOnEtf: Boolean(config.stampDutyOnEtf),
    transferFeeRate: clampNonNegative(config.transferFeeRate),
    transferFeeOnEtf: Boolean(config.transferFeeOnEtf)
  }
}

function clampNonNegative(value) {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * @param {'buy'|'sell'} side
 * @param {number} price   fill price in CNY
 * @param {number} shares
 * @param {{kind:'stock'|'etf'}} instrument
 * @param {object} config
 */
export function computeFees(side, price, shares, instrument, config) {
  const fee = normalizeFeeConfig(config)
  const amount = price * shares
  const isEtf = instrument?.kind === 'etf'

  const commission = amount <= 0 ? 0 : Math.max(amount * fee.commissionRate, fee.commissionMin)
  const stampDuty =
    side === 'sell' && (!isEtf || fee.stampDutyOnEtf) ? amount * fee.stampDutyRate : 0
  const transferFee = !isEtf || fee.transferFeeOnEtf ? amount * fee.transferFeeRate : 0

  return {
    amount,
    commission,
    stampDuty,
    transferFee,
    total: commission + stampDuty + transferFee
  }
}

/**
 * How far the price has to move, in percent, before a round trip breaks even.
 * This single number is the most useful cost fact a 做T trader can carry around.
 */
export function breakEvenMove(price, shares, instrument, config) {
  const buy = computeFees('buy', price, shares, instrument, config)
  const sell = computeFees('sell', price, shares, instrument, config)
  const notional = price * shares
  if (notional <= 0) return 0
  return ((buy.total + sell.total) / notional) * 100
}
