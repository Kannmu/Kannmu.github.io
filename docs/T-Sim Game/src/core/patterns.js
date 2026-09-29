/**
 * Day-shape classification.
 *
 * The whole point of the trainer is pattern recognition: after enough rounds the
 * player should be able to look at the first hour and say "this is a 宽幅震荡 day,
 * I should be doing 正T at the lower band" instead of guessing. Every finished
 * round is therefore labelled, and career stats are grouped by label.
 *
 * All of this is computed from the finished day, so it is safe to use for
 * post-round feedback. Nothing here may be used to drive in-round coaching.
 */

export const DAY_PATTERNS = {
  UP: { label: '单边上涨', hint: '趋势日，做T容易T飞，倒T要快进快出' },
  DOWN: { label: '单边下跌', hint: '趋势日，正T容易越接越低，宁可空仓等' },
  RANGE: { label: '宽幅震荡', hint: '做T的主场，上下轨来回做' },
  FLAT: { label: '窄幅盘整', hint: '空间不足，手续费会吃掉利润，最好不动' },
  VREV: { label: '探底回升', hint: '早盘杀跌后的正T黄金日' },
  AREV: { label: '冲高回落', hint: '早盘冲高后的倒T黄金日' }
}

/**
 * @param {{close:number[], high:number[], low:number[], open:number}} day prices in CNY
 * @param {number} prevClose
 */
export function classifyDay(day, prevClose) {
  const n = day.close.length
  const close = day.close[n - 1]
  const high = Math.max(...day.high)
  const low = Math.min(...day.low)
  const open = day.open

  const ret = (close - prevClose) / prevClose
  const range = (high - low) / prevClose
  const span = high - low || 1e-9
  const closePos = (close - low) / span

  let path = 0
  for (let i = 1; i < n; i++) path += Math.abs(day.close[i] - day.close[i - 1])
  const efficiency = path > 0 ? Math.abs(close - open) / path : 0

  let lowIndex = 0
  let highIndex = 0
  for (let i = 1; i < n; i++) {
    if (day.low[i] < day.low[lowIndex]) lowIndex = i
    if (day.high[i] > day.high[highIndex]) highIndex = i
  }
  const lowEarly = lowIndex / n < 0.45
  const highEarly = highIndex / n < 0.45

  // Excursions measured against the previous close, which is what a 做T trader
  // actually anchors on ("今日最低比昨收低了 1.4%").
  const dip = (low - prevClose) / prevClose
  const spike = (high - prevClose) / prevClose

  let code
  if (range < 0.008) {
    code = 'FLAT'
  } else if (ret > 0.006 && efficiency > 0.36) {
    code = 'UP'
  } else if (ret < -0.006 && efficiency > 0.36) {
    code = 'DOWN'
  } else if (dip < -0.01 && closePos > 0.55) {
    code = 'VREV'
  } else if (spike > 0.01 && closePos < 0.45) {
    code = 'AREV'
  } else {
    code = 'RANGE'
  }

  return {
    code,
    label: DAY_PATTERNS[code].label,
    hint: DAY_PATTERNS[code].hint,
    ret,
    range,
    closePos,
    efficiency,
    dip,
    spike,
    lowIndex,
    highIndex,
    lowEarly,
    highEarly
  }
}

/**
 * Post-round grading of a single fill. We measure where the fill price sits
 * inside the price range of everything that happened *after* it — a buy near the
 * bottom of what followed is a good buy, regardless of whether it made money.
 *
 * @returns {{percentile:number, score:number, verdict:string}}
 */
export function gradeFill(fill, futurePrices) {
  if (!futurePrices.length) return { percentile: 0.5, score: 50, verdict: '平' }
  // For a buy, every later price above our fill is favourable (we could have
  // waited and paid more); for a sell, every later price below it is favourable.
  const favourable = futurePrices.reduce(
    (acc, px) => acc + (fill.side === 'buy' ? px > fill.price : px < fill.price ? 1 : 0),
    0
  )
  const total = futurePrices.length
  const percentile = favourable / total
  const score = Math.round(percentile * 100)
  let verdict = '平'
  if (score >= 75) verdict = fill.side === 'buy' ? '好买点' : '好卖点'
  else if (score >= 55) verdict = '尚可'
  else if (score >= 35) verdict = '一般'
  else verdict = fill.side === 'buy' ? '买高了' : '卖低了'
  return { percentile, score, verdict }
}
