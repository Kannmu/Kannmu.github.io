<template>
  <div class="overlay">
    <div class="result card">
      <header class="result__head">
        <div class="result__grade" :class="`grade--${settlement.rating.grade}`">
          {{ settlement.rating.grade }}
        </div>
        <div class="result__title">
          <h2>{{ settlement.rating.label }}</h2>
          <p class="dim">
            {{ scenario.name }} · {{ formatDate(settlement.date) }} ·
            {{ settlement.granularity === 'm1' ? '1 分钟' : '5 分钟' }}
          </p>
        </div>
        <div class="result__xp num">+{{ Math.max(0, settlement.scores.total) }} XP</div>
      </header>

      <div class="result__hero">
        <div>
          <div class="label">今日做T收益</div>
          <div class="result__value num" :class="tone">
            {{ formatSigned(settlement.tContribution, 2) }}
          </div>
          <div class="result__sub num" :class="tone">
            {{ formatSignedNumber(settlement.tBp, 1) }} bp · 含手续费
            {{ formatMoney(settlement.totalFees, 2) }}
          </div>
        </div>
        <div class="result__hero-right">
          <div class="label">当日形态</div>
          <div class="result__pattern">{{ settlement.pattern.label }}</div>
          <div class="result__hint faint">{{ settlement.pattern.hint }}</div>
        </div>
      </div>

      <div class="result__body scroll-y">
        <section class="block">
          <div class="label">评分构成</div>
          <div class="bars">
            <div v-for="bar in scoreBars" :key="bar.key" class="bar-row">
              <span class="bar-row__name">{{ bar.name }}</span>
              <div class="bar-row__track">
                <div class="bar-row__fill" :style="{ width: `${bar.value}%`, background: bar.color }" />
              </div>
              <span class="bar-row__value num">{{ bar.value }}</span>
            </div>
          </div>
          <p class="result__total num">
            总分 <b>{{ settlement.scores.total }}</b>
          </p>
        </section>

        <section class="block">
          <div class="label">和最优解比</div>
          <div class="optimal">
            <div>
              <span class="dim">理论最优（{{ settlement.optimal.directionLabel }}，{{
                formatShares(settlement.optimal.size)
              }} 股）</span>
              <b class="num up">{{ formatMoney(settlement.optimal.best, 0) }}</b>
            </div>
            <div>
              <span class="dim">你的捕获率</span>
              <b class="num" :class="captureTone">{{ captureLabel }}</b>
            </div>
          </div>
          <p class="faint small">
            当日区间 {{ formatPrice(settlement.optimal.low, tick) }} ~
            {{ formatPrice(settlement.optimal.high, tick) }}，振幅
            {{ (settlement.pattern.range * 100).toFixed(2) }}%。最好的单次往返就是这么多，
            多次做T理论上可以更多，但也更容易出错。
          </p>
        </section>

        <section class="block">
          <div class="label">
            逐笔复盘
            <span class="faint">（评分 = 成交后价格朝有利方向运行的比例）</span>
          </div>
          <div v-if="!settlement.fills.length" class="empty">今天没有成交。</div>
          <div v-for="(fill, i) in settlement.fills" :key="i" class="fill-row">
            <span class="fill-row__side" :class="fill.side">{{ fill.side === 'buy' ? '买' : '卖' }}</span>
            <span class="num dim">{{ fill.time }}</span>
            <span class="num">{{ formatPrice(fill.price, tick) }}</span>
            <span class="num dim">{{ formatShares(fill.shares) }} 股</span>
            <span class="fill-row__verdict" :class="verdictTone(fill.grade.score)">
              {{ fill.grade.verdict }} · {{ fill.grade.score }}
            </span>
          </div>
        </section>

        <section v-if="settlement.mistakes.length" class="block">
          <div class="label">要改的习惯</div>
          <div v-for="mistake in settlement.mistakes" :key="mistake.code" class="mistake">
            <div class="mistake__head">
              <span class="mistake__label">{{ mistake.label }}</span>
              <span class="mistake__count num">×{{ mistake.count }}</span>
            </div>
            <p class="faint small">{{ mistake.tip }}</p>
          </div>
        </section>

        <section v-else class="block">
          <div class="clean">
            <CheckCircle2 :size="18" />
            <span>没有发现明显的坏习惯，这一轮很干净。</span>
          </div>
        </section>

        <section class="block block--facts">
          <div class="fact">
            <span class="dim">成交笔数</span><b class="num">{{ settlement.fillCount }}</b>
          </div>
          <div class="fact">
            <span class="dim">手续费合计</span><b class="num">{{ formatMoney(settlement.totalFees, 2) }}</b>
          </div>
          <div class="fact">
            <span class="dim">费用拖累</span>
            <b class="num">{{ settlement.feeDragBp.toFixed(1) }} bp</b>
          </div>
          <div class="fact">
            <span class="dim">底仓还原</span>
            <b :class="settlement.endedFlat ? 'down' : 'up'">
              {{ settlement.endedFlat ? '是' : '否' }}
            </b>
          </div>
          <div class="fact">
            <span class="dim">不含费用</span>
            <b class="num" :class="settlement.grossBeforeFees > 0 ? 'up' : 'down'">
              {{ formatSigned(settlement.grossBeforeFees, 0) }}
            </b>
          </div>
          <div class="fact">
            <span class="dim">收盘涨跌</span>
            <b class="num" :class="settlement.pattern.ret > 0 ? 'up' : 'down'">
              {{ formatPct(settlement.pattern.ret) }}
            </b>
          </div>
        </section>
      </div>

      <footer class="result__actions">
        <button class="btn btn-primary" @click="$emit('next')">
          <ArrowRight :size="18" />
          <span>下一轮</span>
          <kbd>N</kbd>
        </button>
        <button class="btn" @click="$emit('replay')">
          <RotateCcw :size="17" />
          <span>再看一遍</span>
        </button>
        <button class="btn" @click="$emit('review')">
          <LineChart :size="17" />
          <span>看全天分时</span>
        </button>
        <button class="btn btn-ghost" @click="$emit('stats')">
          <BarChart3 :size="17" />
          <span>统计</span>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRight, BarChart3, CheckCircle2, LineChart, RotateCcw } from 'lucide-vue-next'
import {
  formatDate,
  formatMoney,
  formatPct,
  formatPrice,
  formatShares,
  formatSigned,
  formatSignedNumber
} from '../core/format.js'

const props = defineProps({
  settlement: { type: Object, required: true },
  scenario: { type: Object, required: true }
})

defineEmits(['next', 'replay', 'review', 'stats'])

const tick = computed(() => props.scenario.tick || 0.01)
const tone = computed(() =>
  props.settlement.tContribution > 0.005 ? 'up' : props.settlement.tContribution < -0.005 ? 'down' : 'flat'
)

const scoreBars = computed(() => [
  { key: 'profit', name: '收益', value: props.settlement.scores.profit, color: 'var(--up)' },
  { key: 'execution', name: '决策', value: props.settlement.scores.execution, color: 'var(--accent)' },
  { key: 'discipline', name: '纪律', value: props.settlement.scores.discipline, color: 'var(--avg-line)' }
])

const captureLabel = computed(() => {
  const c = props.settlement.capture
  if (c === null || !Number.isFinite(c)) return '—'
  return `${(c * 100).toFixed(0)}%`
})

const captureTone = computed(() => {
  const c = props.settlement.capture
  if (c === null || !Number.isFinite(c)) return 'flat'
  return c >= 0.6 ? 'up' : c >= 0.25 ? '' : 'down'
})

function verdictTone(score) {
  if (score >= 70) return 'good'
  if (score >= 45) return 'meh'
  return 'bad'
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(5, 7, 11, 0.76);
  backdrop-filter: blur(6px);
  animation: fade 0.2s ease;
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

.result {
  width: min(760px, 100%);
  max-height: min(92dvh, 900px);
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow);
  animation: pop 0.24s cubic-bezier(0.2, 0.9, 0.3, 1.2);
}

@keyframes pop {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
}

.result__head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-bottom: 1px solid var(--border);
}

.result__grade {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 16px;
  font-size: 30px;
  font-weight: 800;
  color: #05070b;
  flex: none;
}

.grade--S {
  background: linear-gradient(140deg, #ffe07a, #ffb020);
}

.grade--A {
  background: linear-gradient(140deg, #7ef0c0, #12c48b);
}

.grade--B {
  background: linear-gradient(140deg, #9dc0ff, #4c8dff);
}

.grade--C {
  background: linear-gradient(140deg, #cfd8e3, #8b98a9);
}

.grade--D {
  background: linear-gradient(140deg, #ff9a9b, #ff4d4f);
}

.result__title h2 {
  font-size: 20px;
  font-weight: 700;
}

.result__title p {
  font-size: 13px;
  margin-top: 2px;
}

.result__xp {
  margin-left: auto;
  font-size: 15px;
  font-weight: 700;
  color: var(--accent);
  flex: none;
}

.result__hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 18px;
  background: var(--bg-soft);
}

.result__value {
  font-size: clamp(30px, 5vw, 42px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.result__sub {
  font-size: 13px;
  margin-top: 3px;
}

.result__hero-right {
  text-align: right;
  flex: none;
  max-width: 42%;
}

.result__pattern {
  font-size: 19px;
  font-weight: 700;
  margin-top: 2px;
}

.result__hint {
  font-size: 12px;
  margin-top: 3px;
  line-height: 1.4;
}

.result__body {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
  min-height: 0;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bars {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-row {
  display: grid;
  grid-template-columns: 44px 1fr 34px;
  align-items: center;
  gap: 10px;
  font-size: 13px;
}

.bar-row__name {
  color: var(--text-dim);
}

.bar-row__track {
  height: 8px;
  border-radius: 99px;
  background: var(--surface-2);
  overflow: hidden;
}

.bar-row__fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.5s cubic-bezier(0.2, 0.9, 0.3, 1);
}

.bar-row__value {
  text-align: right;
  font-weight: 600;
}

.result__total {
  font-size: 14px;
  color: var(--text-dim);
  text-align: right;
}

.result__total b {
  font-size: 20px;
  color: var(--text);
}

.optimal {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 13px;
}

.optimal > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.optimal > div:last-child {
  text-align: right;
}

.optimal b {
  font-size: 20px;
}

.small {
  font-size: 12px;
  line-height: 1.55;
}

.empty {
  font-size: 13px;
  color: var(--text-faint);
}

.fill-row {
  display: grid;
  grid-template-columns: 24px 46px 64px 1fr auto;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
}

.fill-row__side {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.fill-row__side.buy {
  background: var(--up);
}

.fill-row__side.sell {
  background: var(--down);
  color: #04140f;
}

.fill-row__verdict {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
}

.fill-row__verdict.good {
  background: var(--down-soft);
  color: var(--down);
}

.fill-row__verdict.meh {
  background: var(--surface-3);
  color: var(--text-dim);
}

.fill-row__verdict.bad {
  background: var(--up-soft);
  color: var(--up);
}

.mistake {
  padding: 9px 11px;
  border-radius: var(--radius-sm);
  background: var(--warn-soft);
  border: 1px solid rgba(255, 176, 32, 0.28);
}

.mistake__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mistake__label {
  font-size: 14px;
  font-weight: 600;
  color: #ffd489;
}

.mistake__count {
  font-size: 12px;
  color: var(--warn);
}

.clean {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--down);
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--down-soft);
}

.block--facts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 9px 11px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  font-size: 12px;
}

.fact b {
  font-size: 15px;
}

.result__actions {
  display: flex;
  gap: 10px;
  padding: 14px 18px;
  border-top: 1px solid var(--border);
}

.result__actions .btn-primary {
  flex: 1;
}

kbd {
  padding: 1px 5px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.24);
  font-family: var(--mono);
  font-size: 10px;
  opacity: 0.75;
}

@media (max-width: 700px) {
  .result__hero {
    flex-direction: column;
    gap: 12px;
  }

  .result__hero-right {
    text-align: left;
    max-width: none;
  }

  .result__head {
    padding: 14px;
  }

  .result__body {
    padding: 14px;
  }

  .result__actions {
    padding: 12px 14px;
    flex-wrap: wrap;
  }

  .result__actions .btn {
    flex: 1 1 40%;
  }
}
</style>
