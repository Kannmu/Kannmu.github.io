<template>
  <div class="settings">
    <header class="settings__head">
      <button class="btn btn-ghost" @click="view = 'start'"><ArrowLeft :size="16" />返回</button>
      <h1>设置</h1>
      <span class="faint small">{{ loadState.progress }}</span>
    </header>

    <section class="card block">
      <h2>交易成本</h2>
      <p class="faint small">
        训练里最容易被忽略、也最容易决定成败的一项。默认按“万分之五 + 每笔最低 5 元”的账户设置。
      </p>
      <div class="presets">
        <button
          v-for="preset in presetList"
          :key="preset.key"
          class="preset"
          :class="{ active: settings.feePreset === preset.key }"
          @click="applyFeePreset(preset.key)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div class="fields">
        <label class="field">
          <span>佣金费率（‱ 万分之）</span>
          <input
            class="num"
            type="number"
            step="0.1"
            min="0"
            :value="(settings.feeConfig.commissionRate * 10000).toFixed(2)"
            @change="setFee('commissionRate', $event.target.value / 10000)"
          />
        </label>
        <label class="field">
          <span>每笔最低佣金（元）</span>
          <input
            class="num"
            type="number"
            step="1"
            min="0"
            :value="settings.feeConfig.commissionMin"
            @change="setFee('commissionMin', $event.target.value)"
          />
        </label>
        <label class="field">
          <span>印花税（‱，仅卖出）</span>
          <input
            class="num"
            type="number"
            step="0.1"
            min="0"
            :value="(settings.feeConfig.stampDutyRate * 10000).toFixed(2)"
            @change="setFee('stampDutyRate', $event.target.value / 10000)"
          />
        </label>
        <label class="field">
          <span>过户费（‱）</span>
          <input
            class="num"
            type="number"
            step="0.001"
            min="0"
            :value="(settings.feeConfig.transferFeeRate * 10000).toFixed(3)"
            @change="setFee('transferFeeRate', $event.target.value / 10000)"
          />
        </label>
      </div>

      <div class="cost-preview">
        <div>
          <span class="dim">10 万元一次往返的成本</span>
          <b class="num">{{ formatMoney(roundTripCost, 2) }} 元</b>
        </div>
        <div>
          <span class="dim">需要覆盖的涨幅</span>
          <b class="num warn">{{ breakEven.toFixed(3) }}%</b>
        </div>
        <div>
          <span class="dim">1 万元一次往返</span>
          <b class="num">{{ formatMoney(smallRoundTrip, 2) }} 元</b>
          <small class="faint">（最低佣金在这里开始咬人）</small>
        </div>
      </div>
    </section>

    <section class="card block">
      <h2>仓位与资金</h2>
      <div class="fields">
        <label class="field">
          <span>底仓规模（元）</span>
          <input
            class="num"
            type="number"
            step="10000"
            min="10000"
            :value="settings.capitalTarget"
            @change="updateSettings({ capitalTarget: Math.max(10000, Number($event.target.value)) })"
          />
        </label>
        <label class="field">
          <span>滑点（跳）</span>
          <input
            class="num"
            type="number"
            step="1"
            min="0"
            max="5"
            :value="settings.slippageTicks"
            @change="updateSettings({ slippageTicks: Math.max(0, Math.min(5, Number($event.target.value))) })"
          />
        </label>
      </div>
      <p class="faint small">
        底仓规模决定每笔 T 的绝对金额。金额越小，最低 5 元佣金占成本的比例越高。
      </p>
    </section>

    <section class="card block">
      <h2>训练内容</h2>
      <div class="chips">
        <span class="label">标的类型</span>
        <button
          v-for="kind in kindOptions"
          :key="kind.key"
          class="toggle"
          :class="{ active: settings.kinds.includes(kind.key) }"
          @click="toggleKind(kind.key)"
        >
          {{ kind.label }}
        </button>
      </div>

      <div class="chips">
        <span class="label">K 线周期</span>
        <button
          v-for="gran in granularityOptions"
          :key="gran.key"
          class="toggle"
          :class="{ active: settings.granularity === gran.key }"
          @click="updateSettings({ granularity: gran.key })"
        >
          {{ gran.label }}
        </button>
      </div>

      <div class="chips chips--wrap">
        <span class="label">只练这些形态（不选 = 全部）</span>
        <div class="chips__row">
          <button
            v-for="pattern in patternOptions"
            :key="pattern.code"
            class="toggle"
            :class="{ active: settings.patterns.includes(pattern.code) }"
            @click="togglePattern(pattern.code)"
          >
            {{ pattern.label }}
          </button>
        </div>
      </div>

      <p class="faint small">当前筛选命中 {{ candidates.length }} 个交易日场景。</p>
    </section>

    <section class="card block">
      <h2>游戏体验</h2>
      <label class="switch">
        <input
          type="checkbox"
          :checked="settings.coach"
          @change="updateSettings({ coach: $event.target.checked })"
        />
        <span>显示教练提示（只用当前已知信息，不会剧透）</span>
      </label>
      <label class="switch">
        <input
          type="checkbox"
          :checked="settings.hideDate"
          @change="updateSettings({ hideDate: $event.target.checked })"
        />
        <span>隐藏日期（避免事后诸葛，收盘后揭晓）</span>
      </label>
      <label class="switch">
        <input
          type="checkbox"
          :checked="settings.sound"
          @change="updateSettings({ sound: $event.target.checked })"
        />
        <span>音效反馈（下单、结算时的简短提示音）</span>
      </label>
      <label class="switch">
        <input
          type="checkbox"
          :checked="settings.adaptive"
          @change="updateSettings({ adaptive: $event.target.checked })"
        />
        <span>自适应难度（连续高分自动加压，连续低分自动减压）</span>
      </label>

      <div class="chips">
        <span class="label">播放速度</span>
        <button
          v-for="speed in SPEEDS"
          :key="speed.value"
          class="toggle"
          :class="{ active: settings.speed === speed.value }"
          @click="updateSettings({ speed: speed.value })"
        >
          {{ speed.label }}（{{ speed.value }} 分钟/秒）
        </button>
      </div>
    </section>

    <section class="card block">
      <h2>数据</h2>
      <p class="faint small">
        行情来自公开行情接口下载的真实分钟级历史数据，随站点一起发布。新增交易日需要重新运行
        <code>npm run data:fetch</code>。
      </p>
      <div class="cost-preview">
        <div><span class="dim">标的数量</span><b class="num">{{ catalog?.symbols.length ?? '--' }}</b></div>
        <div><span class="dim">可玩交易日</span><b class="num">{{ catalog?.scenarioCount ?? '--' }}</b></div>
        <div><span class="dim">数据生成时间</span><b class="num">{{ generatedAt }}</b></div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowLeft } from 'lucide-vue-next'
import {
  SPEEDS,
  applyFeePreset,
  catalog,
  candidates,
  loadState,
  settings,
  updateSettings,
  view
} from '../composables/useGame.js'
import { FEE_PRESETS, breakEvenMove, computeFees } from '../core/fees.js'
import { DAY_PATTERNS } from '../core/patterns.js'
import { GRANULARITIES } from '../core/scenario.js'
import { formatMoney } from '../core/format.js'

const presetList = computed(() =>
  Object.entries(FEE_PRESETS)
    .filter(([, value]) => value.config)
    .map(([key, value]) => ({ key, label: value.label }))
)

const kindOptions = [
  { key: 'stock', label: '股票' },
  { key: 'etf', label: 'ETF / 基金' }
]

const granularityOptions = computed(() => Object.values(GRANULARITIES))
const patternOptions = computed(() =>
  Object.entries(DAY_PATTERNS).map(([code, value]) => ({ code, label: value.label }))
)

const generatedAt = computed(() => {
  const iso = catalog.value?.generatedAt
  if (!iso) return '--'
  return iso.slice(0, 10)
})

const probe = { kind: 'stock', lot: 100, tick: 0.01 }

const roundTripCost = computed(() => {
  const buy = computeFees('buy', 10, 10000, probe, settings.feeConfig)
  const sell = computeFees('sell', 10, 10000, probe, settings.feeConfig)
  return buy.total + sell.total
})

const smallRoundTrip = computed(() => {
  const buy = computeFees('buy', 10, 1000, probe, settings.feeConfig)
  const sell = computeFees('sell', 10, 1000, probe, settings.feeConfig)
  return buy.total + sell.total
})

const breakEven = computed(() => breakEvenMove(10, 10000, probe, settings.feeConfig))

function setFee(key, value) {
  const numeric = Number(value)
  updateSettings({
    feePreset: 'custom',
    feeConfig: { ...settings.feeConfig, [key]: Number.isFinite(numeric) ? numeric : 0 }
  })
}

function toggleKind(key) {
  const next = settings.kinds.includes(key)
    ? settings.kinds.filter((k) => k !== key)
    : [...settings.kinds, key]
  updateSettings({ kinds: next })
}

function togglePattern(code) {
  const next = settings.patterns.includes(code)
    ? settings.patterns.filter((p) => p !== code)
    : [...settings.patterns, code]
  updateSettings({ patterns: next })
}
</script>

<style scoped>
.settings {
  width: min(820px, 100%);
  margin: 0 auto;
  padding: 20px 16px 48px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.settings__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.settings__head h1 {
  font-size: 20px;
  font-weight: 700;
}

.settings__head .btn {
  min-height: 42px;
  font-size: 13px;
}

.block {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.block h2 {
  font-size: 16px;
  font-weight: 700;
}

.small {
  font-size: 12px;
  line-height: 1.6;
}

.presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.preset {
  padding: 9px 14px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
}

.preset.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: #c3d8ff;
}

.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  color: var(--text-dim);
}

.field input {
  height: 44px;
  padding: 0 12px;
  border-radius: var(--radius-sm);
  background: var(--bg-soft);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: 15px;
  font-weight: 600;
}

.field input:focus {
  outline: none;
  border-color: var(--accent);
}

.cost-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.cost-preview > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  font-size: 12px;
}

.cost-preview b {
  font-size: 16px;
}

.warn {
  color: var(--warn);
}

.chips {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chips--wrap {
  align-items: flex-start;
  flex-direction: column;
}

.chips__row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.toggle {
  padding: 8px 14px;
  border-radius: 999px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-dim);
}

.toggle.active {
  background: var(--accent-soft);
  border-color: var(--accent);
  color: #c3d8ff;
}

.switch {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: var(--text-dim);
  cursor: pointer;
  padding: 6px 0;
}

.switch input {
  width: 20px;
  height: 20px;
  accent-color: var(--accent);
}

code {
  font-family: var(--mono);
  font-size: 12px;
  padding: 1px 5px;
  border-radius: 5px;
  background: var(--surface-2);
  color: var(--text);
}
</style>
