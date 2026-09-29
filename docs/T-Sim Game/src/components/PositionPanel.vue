<template>
  <div class="panel card">
    <div class="panel__head">
      <span class="label">持仓</span>
      <span class="chip" :class="endedFlat ? '' : 'chip-accent'">
        {{ endedFlat ? '底仓已还原' : '未还原' }}
      </span>
    </div>

    <div class="panel__hero">
      <div class="panel__hero-label">今日做T收益</div>
      <div class="panel__hero-value num" :class="tTone">{{ formatSigned(t, 0) }}</div>
      <div class="panel__hero-sub num" :class="tTone">
        {{ formatSignedNumber(tBp, 1) }} bp · 含费 {{ formatMoney(fees, 0) }}
      </div>
    </div>

    <dl class="rows">
      <div class="row">
        <dt>底仓</dt>
        <dd class="num">{{ formatShares(baseShares) }} 股</dd>
      </div>
      <div class="row">
        <dt>当前持仓</dt>
        <dd class="num">{{ formatShares(position) }} 股</dd>
      </div>
      <div class="row">
        <dt>可卖</dt>
        <dd class="num" :class="sellable === 0 && position > 0 ? 'warn' : ''">
          {{ formatShares(sellable) }} 股
        </dd>
      </div>
      <div v-if="frozen > 0" class="row row--hint">
        <dt>今日买入冻结</dt>
        <dd class="num">{{ formatShares(frozen) }} 股</dd>
      </div>
      <div class="row">
        <dt>持仓成本</dt>
        <dd class="num">{{ formatPrice(cost, tick) }}</dd>
      </div>
      <div class="row">
        <dt>浮动盈亏</dt>
        <dd class="num" :class="floatTone">{{ formatSigned(floatPnl, 0) }}</dd>
      </div>
      <div class="row">
        <dt>可用现金</dt>
        <dd class="num">{{ formatMoney(cash, 0) }}</dd>
      </div>
      <div class="row">
        <dt>持仓市值</dt>
        <dd class="num">{{ formatMoney(marketValue, 0) }}</dd>
      </div>
      <div class="row">
        <dt>总权益</dt>
        <dd class="num">{{ formatMoney(equityValue, 0) }}</dd>
      </div>
    </dl>

    <div v-if="fills.length" class="fills">
      <div class="label">成交明细</div>
      <div v-for="(fill, i) in fills.slice().reverse()" :key="i" class="fill">
        <span class="fill__side" :class="fill.side">{{ fill.side === 'buy' ? '买' : '卖' }}</span>
        <span class="num">{{ fill.time }}</span>
        <span class="num">{{ formatPrice(fill.price, tick) }}</span>
        <span class="num dim">{{ formatShares(fill.shares) }}</span>
        <span class="num faint">{{ formatMoney(fill.fees.total, 1) }}</span>
      </div>
    </div>

    <p v-if="frozen > 0 && !symbol.t0" class="t1-note">
      T+1：今天买入的 {{ formatShares(frozen) }} 股要到下一个交易日才能卖出。
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatMoney, formatPrice, formatShares, formatSigned, formatSignedNumber } from '../core/format.js'

const props = defineProps({
  symbol: { type: Object, required: true },
  baseShares: { type: Number, required: true },
  position: { type: Number, required: true },
  sellable: { type: Number, required: true },
  frozen: { type: Number, default: 0 },
  cost: { type: Number, default: 0 },
  floatPnl: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  marketValue: { type: Number, default: 0 },
  equityValue: { type: Number, default: 0 },
  t: { type: Number, default: 0 },
  tBp: { type: Number, default: 0 },
  fees: { type: Number, default: 0 },
  fills: { type: Array, default: () => [] }
})

const tick = computed(() => props.symbol.tick || 0.01)
const endedFlat = computed(() => props.position === props.baseShares)
const tTone = computed(() => (props.t > 0.005 ? 'up' : props.t < -0.005 ? 'down' : 'flat'))
const floatTone = computed(() =>
  props.floatPnl > 0.005 ? 'up' : props.floatPnl < -0.005 ? 'down' : 'flat'
)
</script>

<style scoped>
.panel {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel__hero {
  padding: 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  text-align: center;
}

.panel__hero-label {
  font-size: 12px;
  color: var(--text-faint);
  margin-bottom: 2px;
}

.panel__hero-value {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.panel__hero-sub {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 2px;
}

.rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 7px 2px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 14px;
}

.row:last-child {
  border-bottom: none;
}

.row dt {
  color: var(--text-dim);
  font-size: 13px;
}

.row dd {
  margin: 0;
  font-weight: 600;
}

.row--hint dd {
  color: var(--warn);
}

.warn {
  color: var(--warn);
}

.fills {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.fill {
  display: grid;
  grid-template-columns: 22px 44px 1fr auto auto;
  gap: 8px;
  align-items: center;
  font-size: 12px;
  color: var(--text-dim);
  padding: 4px 2px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
}

.fill__side {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.fill__side.buy {
  background: var(--up);
}

.fill__side.sell {
  background: var(--down);
  color: #04140f;
}

.t1-note {
  font-size: 12px;
  color: var(--warn);
  line-height: 1.5;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  background: var(--warn-soft);
}
</style>
