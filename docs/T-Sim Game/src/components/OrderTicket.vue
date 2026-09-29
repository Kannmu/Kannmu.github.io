<template>
  <div class="ticket card">
    <div class="ticket__head">
      <span class="label">下单</span>
      <span class="ticket__price num">
        {{ formatPrice(price, tick) }}
        <small :class="tone">{{ formatPct(change) }}</small>
      </span>
    </div>

    <div class="sizes">
      <button
        v-for="(option, i) in sizeOptions"
        :key="option.key"
        class="size"
        :class="{ active: modelValue === i, disabled: !option.shares }"
        :disabled="!option.shares"
        @click="$emit('update:modelValue', i)"
      >
        <span class="size__label">{{ option.label }}</span>
        <span class="size__shares num">{{ formatShares(option.shares) }}</span>
        <span class="size__hint num">{{ option.hint }}</span>
      </button>
    </div>

    <div class="preview">
      <div class="preview__row">
        <span>金额</span>
        <b class="num">{{ formatMoney(preview.amount, 0) }} 元</b>
      </div>
      <div class="preview__row">
        <span>预估费用</span>
        <b class="num">{{ formatMoney(preview.fee, 2) }} 元</b>
      </div>
      <div class="preview__row">
        <span>单边成本</span>
        <b class="num">{{ preview.feeBp.toFixed(1) }} bp</b>
      </div>
      <div class="preview__row preview__row--key">
        <span>往返盈亏平衡</span>
        <b class="num">{{ preview.roundTripPct.toFixed(3) }}%</b>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-buy" :disabled="!canBuy" @click="$emit('order', 'buy', currentShares)">
        <TrendingUp :size="18" />
        <span>买入</span>
        <kbd>B</kbd>
      </button>
      <button
        class="btn btn-sell"
        :disabled="!canSell"
        @click="$emit('order', 'sell', currentShares)"
      >
        <TrendingDown :size="18" />
        <span>卖出</span>
        <kbd>S</kbd>
      </button>
    </div>

    <p class="ticket__note">
      <template v-if="!canSell && frozen > 0 && !symbol.t0">
        可卖为 0：今日买入的股票受 T+1 限制，只能等下一个交易日。
      </template>
      <template v-else-if="selectedOption && selectedOption.shares">
        以现价成交，数量必须是 {{ symbol.lot || 100 }} 股的整数倍。
      </template>
      <template v-else> 请选择一个下单规模。 </template>
    </p>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { TrendingDown, TrendingUp } from 'lucide-vue-next'
import { formatMoney, formatPct, formatPrice, formatShares } from '../core/format.js'
import { breakEvenMove, computeFees } from '../core/fees.js'
import { sharesForIndex, sizeOptions as sizeOptionsFor } from '../core/sizing.js'

const props = defineProps({
  symbol: { type: Object, required: true },
  price: { type: Number, required: true },
  prevClose: { type: Number, required: true },
  baseShares: { type: Number, required: true },
  sellable: { type: Number, required: true },
  frozen: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  feeConfig: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
  modelValue: { type: Number, default: 2 }
})

const emit = defineEmits(['order', 'update:modelValue'])

const tick = computed(() => props.symbol.tick || 0.01)
const lot = computed(() => props.symbol.lot || 100)
const change = computed(() => (props.price - props.prevClose) / props.prevClose)
const tone = computed(() => (change.value > 0 ? 'up' : change.value < 0 ? 'down' : 'flat'))
const selected = computed(() => props.modelValue)

const sizeOptions = computed(() => sizeOptionsFor(props.baseShares, lot.value, props.price))

const selectedOption = computed(() => sizeOptions.value[selected.value] || sizeOptions.value[0])
const currentShares = computed(() => sharesForIndex(sizeOptions.value, selected.value, props.sellable))

const preview = computed(() => {
  const shares = currentShares.value || 0
  const amount = shares * props.price
  const fees = computeFees('buy', props.price, shares, props.symbol, props.feeConfig)
  return {
    amount,
    fee: fees.total,
    feeBp: amount > 0 ? (fees.total / amount) * 10000 : 0,
    roundTripPct: shares > 0 ? breakEvenMove(props.price, shares, props.symbol, props.feeConfig) : 0
  }
})

const canBuy = computed(() => {
  if (props.disabled) return false
  const shares = currentShares.value
  if (!shares) return false
  const fees = computeFees('buy', props.price, shares, props.symbol, props.feeConfig)
  return fees.amount + fees.total <= props.cash + 1e-6
})

const canSell = computed(
  () => !props.disabled && currentShares.value > 0 && currentShares.value <= props.sellable
)

// Keep a sensible default: half the base position while flat, then whatever is
// actually sellable once a 正T has been opened.
watch(
  () => props.sellable,
  () => {
    if (props.frozen > 0 && props.modelValue === 3) emit('update:modelValue', 2)
  }
)
</script>

<style scoped>
.ticket {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ticket__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.ticket__price {
  font-size: 20px;
  font-weight: 700;
}

.ticket__price small {
  font-size: 13px;
  margin-left: 6px;
}

.sizes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.size {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 4px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  transition: all 0.14s ease;
}

.size:hover:not(.disabled) {
  border-color: var(--border-strong);
}

.size.active {
  background: var(--accent-soft);
  border-color: var(--accent);
}

.size.disabled {
  opacity: 0.35;
}

.size__label {
  font-size: 11px;
  color: var(--text-dim);
}

.size__shares {
  font-size: 14px;
  font-weight: 700;
}

.size__hint {
  font-size: 10px;
  color: var(--text-faint);
}

.preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  border: 1px solid var(--border);
}

.preview__row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-dim);
}

.preview__row b {
  color: var(--text);
}

.preview__row--key b {
  color: var(--warn);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.actions .btn {
  min-height: 60px;
  font-size: 17px;
}

kbd {
  padding: 1px 6px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  opacity: 0.75;
}

.ticket__note {
  font-size: 12px;
  color: var(--text-faint);
  line-height: 1.5;
  min-height: 32px;
}

@media (max-width: 900px) {
  .actions .btn {
    min-height: 64px;
    font-size: 18px;
  }

  .size {
    padding: 10px 2px;
  }
}
</style>
