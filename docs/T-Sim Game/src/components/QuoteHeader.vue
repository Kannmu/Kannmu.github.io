<template>
  <div class="quote">
    <div class="quote__id">
      <div class="quote__name">
        <span class="quote__title">{{ symbol.name }}</span>
        <span class="quote__code num">{{ symbol.code }}</span>
      </div>
      <div class="quote__chips">
        <span class="chip">{{ scenario.granularity === 'm1' ? '1 分钟' : '5 分钟' }}</span>
        <span v-if="symbol.t0" class="chip chip-t0">T+0</span>
        <span v-else class="chip">T+1</span>
        <span class="chip">{{ symbol.kind === 'etf' ? 'ETF' : '股票' }}</span>
        <span v-if="hideDate && !settlement" class="chip chip-accent">日期隐藏</span>
      </div>
    </div>

    <div class="quote__price">
      <div class="quote__last num" :class="tone">{{ formatPrice(price, tick) }}</div>
      <div class="quote__delta num" :class="tone">
        <span>{{ formatSignedNumber(price - prevClose, digits) }}</span>
        <span>{{ formatPct(change) }}</span>
      </div>
    </div>

    <div class="quote__meta">
      <div class="quote__time num">
        <Clock :size="15" />
        <span>{{ timeLabel }}</span>
        <span class="faint">/ 15:00</span>
      </div>
      <div class="quote__progress">
        <div class="quote__progress-fill" :style="{ width: `${progress * 100}%` }" />
        <span
          v-for="mark in [0.25, 0.5, 0.75]"
          :key="mark"
          class="quote__tick"
          :style="{ left: `${mark * 100}%` }"
        />
      </div>
      <div class="quote__stats">
        <span>昨收 <b class="num">{{ formatPrice(prevClose, tick) }}</b></span>
        <span>均价 <b class="num avg">{{ formatPrice(avg, tick) }}</b></span>
        <span>
          乖离
          <b class="num" :class="devTone">{{ formatSignedNumber(deviation * 100, 2) }}%</b>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Clock } from 'lucide-vue-next'
import { formatPct, formatPrice, formatSignedNumber } from '../core/format.js'

const props = defineProps({
  symbol: { type: Object, required: true },
  scenario: { type: Object, required: true },
  prevClose: { type: Number, required: true },
  price: { type: Number, required: true },
  avg: { type: Number, required: true },
  deviation: { type: Number, default: 0 },
  timeLabel: { type: String, default: '09:30' },
  progress: { type: Number, default: 0 },
  settlement: { type: Object, default: null },
  hideDate: { type: Boolean, default: true }
})

const tick = computed(() => props.symbol.tick || 0.01)
const digits = computed(() => (tick.value === 0.001 ? 3 : 2))
const change = computed(() => (props.price - props.prevClose) / props.prevClose)
const tone = computed(() => (change.value > 0 ? 'up' : change.value < 0 ? 'down' : 'flat'))
const devTone = computed(() =>
  props.deviation > 0.001 ? 'up' : props.deviation < -0.001 ? 'down' : 'flat'
)
</script>

<style scoped>
.quote {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.quote__name {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.quote__title {
  font-size: clamp(17px, 2.4vw, 21px);
  font-weight: 700;
  letter-spacing: -0.01em;
}

.quote__code {
  font-size: 13px;
  color: var(--text-faint);
}

.quote__chips {
  display: flex;
  gap: 6px;
  margin-top: 6px;
  flex-wrap: wrap;
}

.quote__price {
  text-align: center;
  min-width: 150px;
}

.quote__last {
  font-size: clamp(30px, 5vw, 44px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.quote__delta {
  display: flex;
  justify-content: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  margin-top: 2px;
}

.quote__meta {
  justify-self: end;
  width: 100%;
  max-width: 300px;
  text-align: right;
}

.quote__time {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dim);
}

.quote__progress {
  position: relative;
  height: 4px;
  margin: 8px 0;
  border-radius: 99px;
  background: var(--surface-3);
  overflow: hidden;
}

.quote__progress-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 99px;
  transition: width 0.15s linear;
}

.quote__tick {
  position: absolute;
  top: 0;
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.28);
}

.quote__stats {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  font-size: 12px;
  color: var(--text-faint);
  flex-wrap: wrap;
}

.quote__stats b {
  color: var(--text);
  font-weight: 600;
}

.quote__stats .avg {
  color: var(--avg-line);
}

@media (max-width: 900px) {
  .quote {
    grid-template-columns: 1fr;
    gap: 10px;
    text-align: left;
  }

  .quote__price {
    text-align: left;
  }

  .quote__delta {
    justify-content: flex-start;
  }

  .quote__meta {
    justify-self: stretch;
    max-width: none;
    text-align: left;
  }

  .quote__time,
  .quote__stats {
    justify-content: flex-start;
  }
}
</style>
