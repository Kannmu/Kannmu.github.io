<template>
  <div class="play">
    <QuoteHeader
      :symbol="session.symbol"
      :scenario="scenario"
      :prev-close="session.day.prevClose"
      :price="snap.price"
      :avg="snap.avg"
      :deviation="snap.dev"
      :time-label="timeLabel"
      :progress="progress"
      :settlement="settlement"
      :hide-date="settings.hideDate"
    />

    <div class="play__main">
      <aside class="play__left">
        <PositionPanel
          :symbol="session.symbol"
          :base-shares="session.baseShares"
          :position="session.position"
          :sellable="snap.sellable"
          :frozen="session.frozenShares"
          :cost="snap.cost"
          :float-pnl="snap.floatPnl"
          :cash="session.cash"
          :market-value="snap.marketValue"
          :equity-value="snap.equity"
          :t="snap.t"
          :t-bp="tBp"
          :fees="session.feeTotal"
          :fills="session.fills"
        />
        <div class="session card">
          <div class="label">今日盘面</div>
          <div class="session__grid">
            <div><span class="dim">昨收</span><b class="num">{{ formatPrice(prevClose, tick) }}</b></div>
            <div><span class="dim">今开</span><b class="num">{{ formatPrice(open, tick) }}</b></div>
            <div><span class="dim">最高</span><b class="num up">{{ formatPrice(snap.dayHigh, tick) }}</b></div>
            <div><span class="dim">最低</span><b class="num down">{{ formatPrice(snap.dayLow, tick) }}</b></div>
            <div>
              <span class="dim">振幅</span>
              <b class="num">{{ (rangeSoFar * 100).toFixed(2) }}%</b>
            </div>
            <div>
              <span class="dim">位置</span>
              <b class="num">{{ (posInRange * 100).toFixed(0) }}%</b>
            </div>
          </div>
          <div v-if="recentDaily.length" class="session__daily">
            <span class="label">近 10 日</span>
            <div class="sparkline">
              <div
                v-for="(bar, i) in recentDaily"
                :key="i"
                class="spark"
                :class="bar.close >= bar.open ? 'up' : 'down'"
                :style="{ height: `${sparkHeight(bar)}%` }"
                :title="`${formatDate(bar.date)} ${bar.close}`"
              />
            </div>
          </div>
        </div>
      </aside>

      <section class="play__center">
        <div class="chart-shell card">
          <IntradayChart
            :day="session.day"
            :bar-index="session.barIndex"
            :fills="session.fills"
            :prev-close="prevClose"
            :tick="tick"
            :reveal-all="!!settlement"
          />
        </div>

        <CoachBar v-if="settings.coach && !settlement" :hints="hints" />

        <div v-if="settlement && reviewOpen" class="review-bar card">
          <div class="review-bar__text">
            <b>{{ settlement.pattern.label }}</b>
            <span class="faint">
              全天区间 {{ formatPrice(settlement.optimal.low, tick) }} ~
              {{ formatPrice(settlement.optimal.high, tick) }}，你的成交点已标在图上
            </span>
          </div>
          <button class="btn btn-primary" @click="reviewOpen = false">回到结算</button>
        </div>

        <PlaybackBar
          v-if="!settlement"
          :playing="playback.playing"
          :current-speed="playback.speed"
          :bar-index="session.barIndex"
          :total="totalBars"
          :time-label="timeLabel"
          :speeds="SPEEDS"
          @toggle="togglePlayback"
          @step="stepOnce"
          @signal="jumpToNextSignal"
          @speed="setSpeed"
          @settle="settle"
        />
      </section>

      <aside class="play__right">
        <div class="mobile-strip card">
          <div>
            <span class="label">今日做T</span>
            <b class="num" :class="snap.t > 0.005 ? 'up' : snap.t < -0.005 ? 'down' : 'flat'">
              {{ formatSigned(snap.t, 0) }}
            </b>
          </div>
          <div>
            <span class="label">持仓</span>
            <b class="num">{{ formatShares(session.position) }}</b>
          </div>
          <div>
            <span class="label">可卖</span>
            <b class="num" :class="snap.sellable === 0 && session.position > 0 ? 'warn' : ''">
              {{ formatShares(snap.sellable) }}
            </b>
          </div>
          <div>
            <span class="label">成本</span>
            <b class="num">{{ formatPrice(snap.cost, tick) }}</b>
          </div>
        </div>

        <OrderTicket
          v-model="sizeIndex"
          :symbol="session.symbol"
          :price="snap.price"
          :prev-close="prevClose"
          :base-shares="session.baseShares"
          :sellable="snap.sellable"
          :frozen="session.frozenShares"
          :cash="session.cash"
          :fee-config="settings.feeConfig"
          :disabled="!!settlement"
          @order="handleOrder"
        />
        <button class="btn btn-ghost quit" @click="backToStart">
          <LogOut :size="16" />
          <span>退出本轮</span>
        </button>
      </aside>
    </div>

    <ResultCard
      v-if="settlement && !reviewOpen"
      :settlement="settlement"
      :scenario="scenario"
      @next="nextRound"
      @replay="replayRound"
      @review="reviewOpen = true"
      @stats="view = 'stats'"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { LogOut } from 'lucide-vue-next'
import IntradayChart from '../components/IntradayChart.vue'
import OrderTicket from '../components/OrderTicket.vue'
import PlaybackBar from '../components/PlaybackBar.vue'
import PositionPanel from '../components/PositionPanel.vue'
import CoachBar from '../components/CoachBar.vue'
import QuoteHeader from '../components/QuoteHeader.vue'
import ResultCard from '../components/ResultCard.vue'
import { coachHints } from '../core/coach.js'
import { barCount, currentTimeLabel, dayHighLowSoFar } from '../core/engine.js'
import { formatDate, formatPrice, formatShares, formatSigned } from '../core/format.js'
import { sharesForIndex, sizeOptions as sizeOptionsFor } from '../core/sizing.js'
import {
  SPEEDS,
  backToStart,
  jumpToNextSignal,
  nextRound,
  order,
  playback,
  replayRound,
  reviewOpen,
  scenario,
  session,
  setSpeed,
  settings,
  settle,
  settlement,
  snapshot,
  stepOnce,
  togglePlayback,
  version,
  view
} from '../composables/useGame.js'

const sizeIndex = ref(2)

const snap = computed(() => {
  // `version` is bumped by the engine whenever a bar prints or an order fills,
  // which is what makes the derived numbers recompute.
  void version.value
  return session.value ? snapshot(session.value) : null
})

const tick = computed(() => session.value?.symbol.tick || 0.01)
const prevClose = computed(() => session.value?.day.prevClose || 0)
const open = computed(() => session.value?.day.open || 0)
const totalBars = computed(() => (session.value ? barCount(session.value) : 1))
const timeLabel = computed(() => (session.value ? currentTimeLabel(session.value) : '09:30'))
const progress = computed(() =>
  session.value ? session.value.barIndex / Math.max(1, totalBars.value - 1) : 0
)
const tBp = computed(() => {
  if (!session.value || !snap.value) return 0
  const notional = session.value.baseShares * session.value.day.prevClose
  return notional > 0 ? (snap.value.t / notional) * 10000 : 0
})
const hints = computed(() => (session.value && !settlement.value ? coachHints(session.value) : []))
const rangeSoFar = computed(() => {
  if (!snap.value) return 0
  return (snap.value.dayHigh - snap.value.dayLow) / prevClose.value
})
const posInRange = computed(() => {
  if (!snap.value) return 0.5
  const span = snap.value.dayHigh - snap.value.dayLow
  return span > 0 ? (snap.value.price - snap.value.dayLow) / span : 0.5
})
const recentDaily = computed(() => (session.value?.dailyBars || []).slice(-10))

function sparkHeight(bar) {
  const highs = recentDaily.value.map((b) => b.high)
  const lows = recentDaily.value.map((b) => b.low)
  const hi = Math.max(...highs)
  const lo = Math.min(...lows)
  const span = hi - lo || 1
  return 12 + ((bar.close - lo) / span) * 88
}

function handleOrder(side, shares) {
  order(side, shares)
}

/** Shares for the currently selected preset, capped by what can actually be sold. */
function keyboardShares() {
  const state = session.value
  if (!state || !snap.value) return 0
  const options = sizeOptionsFor(state.baseShares, state.symbol.lot || 100, snap.value.price)
  return sharesForIndex(options, sizeIndex.value, snap.value.sellable)
}

function onKeydown(event) {
  if (event.target instanceof HTMLInputElement) return
  const key = event.key
  if (key === ' ') {
    event.preventDefault()
    togglePlayback()
    return
  }
  if (key === 'ArrowRight') {
    event.preventDefault()
    stepOnce()
    return
  }
  if (key === 'Enter') {
    if (!settlement.value) settle()
    else nextRound()
    return
  }
  if (key === 'n' || key === 'N') {
    if (settlement.value) nextRound()
    return
  }
  if (/^[1-4]$/.test(key)) {
    sizeIndex.value = Number(key) - 1
    return
  }
  if (settlement.value) return
  if (key === 'b' || key === 'B') order('buy', keyboardShares())
  else if (key === 's' || key === 'S') order('sell', keyboardShares())
  else if (key === 'f' || key === 'F') jumpToNextSignal()
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
.play {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 100%;
  min-height: 0;
  padding: 10px;
  overflow: hidden;
}

.play__main {
  display: grid;
  grid-template-columns: 290px minmax(0, 1fr) 330px;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.play__left,
.play__right,
.play__center {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}

.play__left,
.play__right {
  overflow-y: auto;
  scrollbar-width: thin;
}

.chart-shell {
  flex: 1;
  min-height: 240px;
  padding: 6px;
  overflow: hidden;
}

.review-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 10px 14px;
  flex-wrap: wrap;
}

.review-bar__text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.review-bar__text b {
  font-size: 15px;
}

.mobile-strip {
  display: none;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  padding: 10px 12px;
}

.mobile-strip > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.mobile-strip b {
  font-size: 15px;
}

.warn {
  color: var(--warn);
}

.quit {
  min-height: 42px;
  font-size: 13px;
}

.session {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.session__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  font-size: 13px;
}

.session__grid > div {
  display: flex;
  justify-content: space-between;
  gap: 6px;
}

.session__daily {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sparkline {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 34px;
}

.spark {
  flex: 1;
  border-radius: 2px;
  min-height: 3px;
}

.spark.up {
  background: var(--up);
  opacity: 0.8;
}

.spark.down {
  background: var(--down);
  opacity: 0.8;
}

@media (max-width: 1100px) {
  .play__main {
    grid-template-columns: minmax(0, 1fr) 320px;
  }

  .play__left {
    display: none;
  }
}

@media (max-width: 860px) {
  .play {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
    padding: 8px;
  }

  .play__main {
    grid-template-columns: 1fr;
  }

  /* The compact strip carries the numbers a phone player needs while the
     ticket stays within thumb reach right under the chart. */
  .mobile-strip {
    display: grid;
  }

  .play__left {
    display: flex;
    order: 3;
    overflow: visible;
  }

  .play__center {
    order: 1;
  }

  .play__right {
    order: 2;
    overflow: visible;
  }

  .chart-shell {
    flex: none;
    height: 42dvh;
    min-height: 220px;
  }
}
</style>
