<script setup lang="ts">
import { computed } from 'vue'
import { Clock3, Gauge, Sparkles } from 'lucide-vue-next'

type QuotaData = {
  usage_percentage?: number
  resets_at?: string
  max_flows?: number
  used_flows?: number
  remaining_flows?: number
  used_value_usd?: number
  max_value_usd?: number
}

const props = defineProps<{
  title: string
  description: string
  quota: QuotaData
  accent?: 'blue' | 'green'
  resetLabel: string
}>()

const percentage = computed(() => {
  const raw = props.quota.usage_percentage ?? 0
  return Math.max(0, Math.min(raw * 100, 100))
})

const formatNumber = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 2 }).format(value)
}

const formatUsd = (value?: number) => {
  if (value === undefined || Number.isNaN(value)) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value)
}

const formatTime = (value?: string) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  }).format(date)
}
</script>

<template>
  <section class="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl border border-gray-100 flex flex-col gap-6">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Usage Window</p>
        <h2 class="text-2xl font-bold text-gray-900 mb-1">{{ title }}</h2>
        <p class="text-sm text-gray-500">{{ description }}</p>
      </div>
      <div :class="['flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border', 
                    accent === 'green' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-blue-50 text-blue-700 border-blue-100']">
        <Gauge :size="16" />
        <span>{{ percentage.toFixed(2) }}%</span>
      </div>
    </div>

    <!-- Progress bar -->
    <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        :class="['h-full transition-all duration-1000 ease-out', accent === 'green' ? 'bg-green-500' : 'bg-blue-500']"
        :style="{ width: `${percentage}%` }" 
      />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <article class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
          <Sparkles :size="14" />
          <span>已用 Flows</span>
        </div>
        <strong class="text-xl font-semibold text-gray-900">{{ formatNumber(quota.used_flows) }}</strong>
      </article>
      <article class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
          <Sparkles :size="14" />
          <span>剩余 Flows</span>
        </div>
        <strong class="text-xl font-semibold text-gray-900">{{ formatNumber(quota.remaining_flows) }}</strong>
      </article>
      <article class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
          <Gauge :size="14" />
          <span>已用额度</span>
        </div>
        <strong class="text-xl font-semibold text-gray-900">{{ formatUsd(quota.used_value_usd) }}</strong>
      </article>
      <article class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5 text-gray-500 text-xs font-medium mb-1">
          <Gauge :size="14" />
          <span>窗口总额度</span>
        </div>
        <strong class="text-xl font-semibold text-gray-900">{{ formatUsd(quota.max_value_usd) }}</strong>
      </article>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
      <div class="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
        <div class="p-2 bg-white rounded-lg shadow-sm">
          <Clock3 :size="16" class="text-gray-600" />
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-500">{{ resetLabel }}</span>
          <strong class="text-sm text-gray-900 font-medium">{{ formatTime(quota.resets_at) }}</strong>
        </div>
      </div>
      <div class="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100 opacity-80">
        <div class="p-2 bg-white rounded-lg shadow-sm">
          <Sparkles :size="16" class="text-gray-600" />
        </div>
        <div class="flex flex-col">
          <span class="text-xs text-gray-500">窗口最大 Flows</span>
          <strong class="text-sm text-gray-900 font-medium">{{ formatNumber(quota.max_flows) }}</strong>
        </div>
      </div>
    </div>
  </section>
</template>
