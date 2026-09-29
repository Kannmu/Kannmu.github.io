/**
 * Central game state: settings, career progress, round lifecycle, playback clock.
 *
 * Kept as a module-level singleton so every component can read the same round
 * without prop drilling. Persistence is localStorage only — the trainer works
 * entirely offline once the data files are downloaded.
 */
import { computed, reactive, ref, shallowRef } from 'vue'
import { createSession, advance, placeOrder, finish, snapshot, barCount } from '../core/engine.js'
import { settleRound } from '../core/scoring.js'
import { buildCandidates, pickScenario, scenarioKey, describeScenario, DIFFICULTIES } from '../core/scenario.js'
import { createRng, todaySeed } from '../core/rng.js'
import { nextSignalBar } from '../core/coach.js'
import { loadCatalog, loadScenario, prefetchSymbol } from '../data/repository.js'
import { FEE_PRESETS, DEFAULT_FEE_CONFIG } from '../core/fees.js'
import { setSoundEnabled, sfx } from '../core/sfx.js'

const STORAGE_KEY = 'tsim.state.v1'
const MAX_HISTORY = 400

export const SPEEDS = [
  { label: '慢', value: 2 },
  { label: '常速', value: 4 },
  { label: '快', value: 8 },
  { label: '很快', value: 16 },
  { label: '极快', value: 32 }
]

export const TITLES = [
  { min: 0, name: '见习交易员' },
  { min: 400, name: '做T学徒' },
  { min: 1200, name: '日内熟手' },
  { min: 2600, name: '分时老手' },
  { min: 5000, name: '做T高手' },
  { min: 9000, name: '做T宗师' }
]

export const DEFAULT_SETTINGS = {
  difficulty: 'mixed',
  adaptive: true,
  granularity: 'any',
  kinds: [],
  patterns: [],
  feePreset: 'user',
  feeConfig: { ...DEFAULT_FEE_CONFIG },
  capitalTarget: 100000,
  slippageTicks: 0,
  speed: 8,
  coach: true,
  hideDate: true,
  sound: true
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persisted = loadPersisted()

export const settings = reactive({
  ...DEFAULT_SETTINGS,
  ...(persisted?.settings || {}),
  feeConfig: { ...DEFAULT_FEE_CONFIG, ...(persisted?.settings?.feeConfig || {}) }
})

export const career = reactive({
  rounds: persisted?.career?.rounds || [],
  seen: persisted?.career?.seen || [],
  xp: persisted?.career?.xp || 0,
  streak: persisted?.career?.streak || 0,
  bestStreak: persisted?.career?.bestStreak || 0
})

export const catalog = shallowRef(null)
export const loadState = reactive({ loading: true, error: '', progress: '' })
export const view = ref('start')
// The engine mutates a plain object (fast, no proxy overhead on 241-bar arrays),
// so a monotonic counter is what tells the interface that a bar has printed.
export const session = shallowRef(null)
export const version = ref(0)

export function touch() {
  version.value++
}
export const scenario = shallowRef(null)
export const settlement = shallowRef(null)
export const reviewOpen = ref(false)
export const roundMeta = reactive({ startedAt: 0, index: 0, briefShown: false, seed: null })
export const playback = reactive({
  playing: false,
  speed: settings.speed,
  effectiveDifficulty: settings.difficulty,
  lastTick: 0
})
export const toast = reactive({ text: '', tone: 'info', id: 0, visible: false })

let rafHandle = null
let accumulator = 0
let lastFrame = 0

// --------------------------------------------------------------- persistence

export function persist() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        settings: { ...settings },
        career: {
          rounds: career.rounds.slice(-MAX_HISTORY),
          seen: career.seen.slice(-2000),
          xp: career.xp,
          streak: career.streak,
          bestStreak: career.bestStreak
        }
      })
    )
  } catch {
    /* storage full or unavailable — the trainer still works for this session */
  }
}

export function resetProgress() {
  career.rounds = []
  career.seen = []
  career.xp = 0
  career.streak = 0
  career.bestStreak = 0
  persist()
}

// --------------------------------------------------------------------- boot

export async function boot() {
  loadState.loading = true
  loadState.error = ''
  try {
    const data = await loadCatalog()
    catalog.value = data
    loadState.progress = `${data.symbols.length} 个标的 · ${data.scenarioCount} 个交易日`
  } catch (err) {
    loadState.error = err.message || '数据加载失败'
  } finally {
    loadState.loading = false
  }
}

// ------------------------------------------------------------------ helpers

export const instruments = computed(() => catalog.value?.symbols || [])

export const candidates = computed(() => {
  if (!catalog.value) return []
  return buildCandidates(catalog.value.symbols, {
    difficulty: playback.effectiveDifficulty,
    kinds: settings.kinds,
    patterns: settings.patterns,
    granularity: settings.granularity
  })
})

export const level = computed(() => {
  const idx = TITLES.reduce((acc, t, i) => (career.xp >= t.min ? i : acc), 0)
  const current = TITLES[idx]
  const next = TITLES[idx + 1] || null
  const span = next ? next.min - current.min : 1
  const into = next ? career.xp - current.min : 1
  return {
    index: idx,
    name: current.name,
    next: next?.name || null,
    progress: next ? Math.min(1, into / span) : 1,
    toNext: next ? next.min - career.xp : 0
  }
})

export const summary = computed(() => {
  const rounds = career.rounds
  if (!rounds.length) {
    return { count: 0, avgScore: 0, winRate: 0, totalT: 0, avgBp: 0, byPattern: {}, mistakes: [] }
  }
  let totalScore = 0
  let totalT = 0
  let totalBp = 0
  let wins = 0
  const byPattern = {}
  const mistakes = new Map()

  for (const r of rounds) {
    totalScore += r.score
    totalT += r.t
    totalBp += r.tBp
    if (r.t > 0) wins++
    const bucket = (byPattern[r.pattern] ||= { count: 0, score: 0, bp: 0, wins: 0 })
    bucket.count++
    bucket.score += r.score
    bucket.bp += r.tBp
    if (r.t > 0) bucket.wins++
    for (const code of r.mistakes || []) mistakes.set(code, (mistakes.get(code) || 0) + 1)
  }

  for (const key of Object.keys(byPattern)) {
    const b = byPattern[key]
    b.avgScore = b.score / b.count
    b.avgBp = b.bp / b.count
    b.winRate = b.wins / b.count
  }

  return {
    count: rounds.length,
    avgScore: totalScore / rounds.length,
    winRate: wins / rounds.length,
    totalT,
    avgBp: totalBp / rounds.length,
    byPattern,
    mistakes: [...mistakes.entries()].sort((a, b) => b[1] - a[1]).map(([code, count]) => ({ code, count }))
  }
})

export function showToast(text, tone = 'info') {
  toast.text = text
  toast.tone = tone
  toast.id++
  toast.visible = true
  window.clearTimeout(showToast._t)
  showToast._t = window.setTimeout(() => {
    toast.visible = false
  }, 2600)
}

// ------------------------------------------------------------ round control

function bumpDifficulty(delta) {
  const order = ['easy', 'normal', 'hard', 'mixed']
  const idx = order.indexOf(playback.effectiveDifficulty)
  const next = Math.max(0, Math.min(order.length - 1, idx + delta))
  if (order[next] !== playback.effectiveDifficulty) {
    playback.effectiveDifficulty = order[next]
    showToast(`难度自适应 → ${DIFFICULTIES[order[next]].label}`, 'info')
    return true
  }
  return false
}

function maybeAdapt() {
  if (!settings.adaptive) return
  const recent = career.rounds.slice(-3)
  if (recent.length < 3) return
  const avg = recent.reduce((a, r) => a + r.score, 0) / recent.length
  if (avg >= 74) bumpDifficulty(1)
  else if (avg < 48) bumpDifficulty(-1)
}

export async function startRound({ seed, pinned } = {}) {
  if (!catalog.value) return
  settlement.value = null
  const rng = pinned ? createRng(pinned.seed) : createRng(seed ?? Date.now() ^ (roundMeta.index * 7919))
  roundMeta.seed = seed ? String(seed) : null

  let choice = null
  if (pinned) {
    const symbol = catalog.value.symbols.find((s) => s.secid === pinned.secid)
    const day = symbol?.days.find((d) => d[0] === pinned.date)
    if (symbol && day) choice = { symbol, day }
  }
  if (!choice) {
    const pool = candidates.value
    if (!pool.length) {
      showToast('当前筛选条件下没有可用的场景，请放宽条件', 'warn')
      return
    }
    const last = career.rounds[career.rounds.length - 1]?.key
    choice = pickScenario(pool, {
      rng,
      seen: new Set(career.seen),
      recent: career.rounds.slice(-40).map((r) => r.key),
      exclude: last
    })
  }
  if (!choice) return

  try {
    const loaded = await loadScenario(choice.symbol, choice.day[0], choice.day[3] === 1 ? 'm1' : 'm5')
    const state = createSession({
      symbol: loaded.symbol,
      day: loaded.day,
      dailyBars: loaded.daily,
      feeConfig: settings.feeConfig,
      capitalTarget: settings.capitalTarget,
      slippageTicks: settings.slippageTicks
    })
    session.value = state
    scenario.value = { ...describeScenario(choice.symbol, choice.day), recentDays: loaded.recentDays }
    roundMeta.startedAt = performance.now()
    roundMeta.index++
    reviewOpen.value = false
    setSoundEnabled(settings.sound)
    view.value = 'play'
    touch()
    startPlayback()
    sfx.roundStart()
    prefetchNext(choice.symbol.secid)
  } catch (err) {
    showToast(err.message || '场景加载失败', 'warn')
  }
}

function prefetchNext(currentSecid) {
  const pool = candidates.value
  if (!pool.length) return
  const rng = createRng(Date.now())
  for (let i = 0; i < 8; i++) {
    const candidate = pool[rng.int(pool.length)]
    if (candidate.symbol.secid !== currentSecid) {
      prefetchSymbol(candidate.symbol)
      return
    }
  }
}

export function settle() {
  if (!session.value || settlement.value) return
  stopPlayback()
  finish(session.value)
  const result = settleRound(session.value)
  settlement.value = result
  touch()
  sfx.settle(result.rating.grade)

  const key = scenario.value.key
  const record = {
    key,
    seed: roundMeta.seed,
    secid: scenario.value.secid,
    code: scenario.value.code,
    name: scenario.value.name,
    kind: scenario.value.kind,
    date: scenario.value.date,
    granularity: scenario.value.granularity,
    pattern: result.pattern.code,
    t: result.tContribution,
    tBp: result.tBp,
    capture: result.capture,
    score: result.scores.total,
    rating: result.rating.grade,
    fills: result.fillCount,
    fees: result.totalFees,
    mistakes: result.mistakes.map((m) => m.code),
    durationMs: Math.round(performance.now() - roundMeta.startedAt),
    ts: Date.now()
  }
  career.rounds.push(record)
  if (career.rounds.length > MAX_HISTORY) career.rounds.splice(0, career.rounds.length - MAX_HISTORY)
  if (!career.seen.includes(key)) career.seen.push(key)
  if (career.seen.length > 2000) career.seen.splice(0, career.seen.length - 2000)

  const gained = Math.max(0, record.score)
  career.xp += gained
  if (record.score >= 58) {
    career.streak += 1
    career.bestStreak = Math.max(career.bestStreak, career.streak)
  } else {
    career.streak = 0
  }
  persist()
  maybeAdapt()
}

export function nextRound() {
  settlement.value = null
  session.value = null
  startRound()
}

export function replayRound() {
  if (!scenario.value) return
  const pinned = {
    secid: scenario.value.secid,
    date: scenario.value.date,
    seed: `${scenario.value.key}`
  }
  settlement.value = null
  startRound({ pinned })
}

export function backToStart() {
  stopPlayback()
  settlement.value = null
  session.value = null
  view.value = 'start'
}

// ------------------------------------------------------------------ playback

export function barMinutes() {
  return session.value?.day.granularity === 'm5' ? 5 : 1
}

export function barsPerSecond() {
  return Math.max(0.25, playback.speed / barMinutes())
}

export function stepOnce() {
  const state = session.value
  if (!state || settlement.value) return
  const last = barCount(state) - 1
  if (state.barIndex >= last) {
    stopPlayback()
    return
  }
  advance(state, 1)
  touch()
  if (state.barIndex >= last) stopPlayback()
}

export function jumpToNextSignal() {
  const state = session.value
  if (!state || settlement.value) return
  const last = barCount(state) - 1
  const next = Math.min(last, nextSignalBar(state))
  advance(state, Math.max(1, next - state.barIndex))
  touch()
  if (state.barIndex >= last) stopPlayback()
}

function loop(timestamp) {
  rafHandle = requestAnimationFrame(loop)
  if (!playback.playing) {
    lastFrame = timestamp
    return
  }
  const state = session.value
  if (!state || settlement.value) return
  const delta = Math.min(0.25, (timestamp - lastFrame) / 1000)
  lastFrame = timestamp
  accumulator += delta * barsPerSecond()
  const whole = Math.floor(accumulator)
  if (whole <= 0) return
  accumulator -= whole
  const last = barCount(state) - 1
  advance(state, Math.min(whole, last - state.barIndex))
  touch()
  if (state.barIndex >= last) stopPlayback()
}

export function startPlayback() {
  playback.playing = true
  lastFrame = performance.now()
  accumulator = 0
  if (!rafHandle) rafHandle = requestAnimationFrame(loop)
}

export function stopPlayback() {
  playback.playing = false
}

export function togglePlayback() {
  if (settlement.value) return
  if (playback.playing) stopPlayback()
  else startPlayback()
}

export function setSpeed(value) {
  playback.speed = value
  settings.speed = value
  persist()
}

// ------------------------------------------------------------------- orders

export function order(side, shares) {
  const state = session.value
  if (!state || settlement.value) return null
  const result = placeOrder(state, side, shares)
  if (!result.ok) {
    showToast(result.reason, 'warn')
    sfx.reject()
  } else {
    if (side === 'buy') sfx.buy()
    else sfx.sell()
  }
  touch()
  return result
}

export function applyFeePreset(presetKey) {
  settings.feePreset = presetKey
  const preset = FEE_PRESETS[presetKey]
  if (preset?.config) settings.feeConfig = { ...preset.config }
  persist()
}

export function updateSettings(patch) {
  Object.assign(settings, patch)
  if (patch.speed) playback.speed = patch.speed
  if (patch.difficulty) playback.effectiveDifficulty = patch.difficulty
  if ('sound' in patch) setSoundEnabled(patch.sound)
  persist()
}

export { snapshot, todaySeed }
