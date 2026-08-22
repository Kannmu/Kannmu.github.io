<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import { Activity, AlertCircle, BarChart3, Database, Gauge, KeyRound, RefreshCw, Search, TrendingUp, Wallet, X } from 'lucide-vue-next'
import ApiKeyInput from './components/ApiKeyInput.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import QuotaPanel from './components/QuotaPanel.vue'

type Tab = 'overview' | 'analytics' | 'generation'
const apiKey = useStorage('zenmux-management-key', '')
const loading = ref(false), error = ref<string | null>(null), data = ref<any>(null)
const stats = ref<Record<string, any>>({}), statsErrors = ref<string[]>([])
const activeTab = ref<Tab>('overview'), metric = ref<'tokens' | 'cost'>('cost'), bucketWidth = ref<'1d' | '1w'>('1w')
const generationKey = useStorage('zenmux-generation-key', '')
const generationId = ref(''), generation = ref<any>(null), generationLoading = ref(false), lastUpdated = ref<Date | null>(null)
const modelUsage = ref<any>(null), modelUsageLoading = ref(false)
let refreshTimer: number | undefined

const request = (path: string, params?: Record<string, string | number>, token = apiKey.value) => axios.get(path, { params, headers: { Authorization: `Bearer ${token}` } })
const today = () => new Date().toISOString().slice(0, 10)
const daysAgo = (days: number) => { const d = new Date(); d.setUTCDate(d.getUTCDate() - days); return d.toISOString().slice(0, 10) }

const fetchData = async () => {
  if (!apiKey.value) return
  loading.value = true; error.value = null; statsErrors.value = []
  try {
    const accountResults = await Promise.allSettled([
      request('/api/v1/management/subscription/detail'), request('/api/v1/management/flow_rate'), request('/api/v1/management/payg/balance')
    ])
    const [subscription, flowRate, payg] = accountResults.map(result => result.status === 'fulfilled' ? result.value.data.data : null)
    if (!subscription && !flowRate && !payg) throw accountResults.find(result => result.status === 'rejected')?.reason
    data.value = { ...subscription, ...flowRate, payg }
    const requests: Record<string, Promise<any>> = {
      timeseries: request('/api/v1/management/statistics/timeseries', { metric: metric.value, bucket_width: bucketWidth.value, starting_at: daysAgo(bucketWidth.value === '1w' ? 56 : 28), ending_at: today(), limit: 6 }),
      leaderboard: request('/api/v1/management/statistics/leaderboard', { metric: metric.value, starting_at: daysAgo(30), ending_at: today(), limit: 8 }),
      marketShare: request('/api/v1/management/statistics/market_share', { metric: metric.value, bucket_width: bucketWidth.value, starting_at: daysAgo(bucketWidth.value === '1w' ? 56 : 28), ending_at: today(), limit: 6 }),
      trending: request('/api/v1/management/statistics/trending', { metric: metric.value, bucket_width: bucketWidth.value, ending_at: daysAgo(1), limit: 6 }),
      performance: request('/api/v1/management/statistics/performance', { metric: 'throughput', starting_at: daysAgo(7), ending_at: today() })
    }
    const results = await Promise.allSettled(Object.entries(requests).map(async ([name, promise]) => [name, (await promise).data.data] as const))
    for (const result of results) result.status === 'fulfilled' ? stats.value[result.value[0]] = result.value[1] : statsErrors.value.push('部分统计接口暂时不可用')
    const topModel = stats.value.leaderboard?.entries?.find((entry: any) => entry.model !== '__others__')?.model
    if (topModel) fetchModelUsage(topModel)
    lastUpdated.value = new Date()
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || err.message || '获取数据失败，请检查 Management API Key 或网络状态'; data.value = null
  } finally { loading.value = false }
}
const lookupGeneration = async () => {
  if (!generationId.value.trim() || !generationKey.value.trim()) return
  generationLoading.value = true; generation.value = null; error.value = null
  try { generation.value = (await request('/api/v1/management/generation', { id: generationId.value.trim() }, generationKey.value.trim())).data.data }
  catch (err: any) { error.value = err.response?.data?.error?.message || err.message || 'Generation 查询失败' }
  finally { generationLoading.value = false }
}
const fetchModelUsage = async (model: string) => {
  modelUsageLoading.value = true
  try { modelUsage.value = (await request('/api/v1/management/statistics/model_usage', { model, metric: metric.value, starting_at: daysAgo(29), ending_at: today() })).data.data }
  catch { modelUsage.value = null }
  finally { modelUsageLoading.value = false }
}
watch([apiKey, metric, bucketWidth], ([key], _old, onCleanup) => {
  if (refreshTimer) window.clearInterval(refreshTimer)
  if (key?.startsWith('sk-mg-')) { fetchData(); refreshTimer = window.setInterval(fetchData, 5 * 60 * 1000); onCleanup(() => refreshTimer && window.clearInterval(refreshTimer)) }
  else { data.value = null; stats.value = {} }
}, { immediate: true })
onBeforeUnmount(() => refreshTimer && window.clearInterval(refreshTimer))
const formatUsd = (v?: number) => v === undefined || v === null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 4 }).format(v)
const formatNumber = (v?: number) => v === undefined || v === null ? '—' : new Intl.NumberFormat('zh-CN', { notation: v > 999999 ? 'compact' : 'standard', maximumFractionDigits: 2 }).format(v)
const formatDate = (v?: string) => v ? new Intl.DateTimeFormat('zh-CN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(v)) : '—'
const metricValue = (v: number) => metric.value === 'cost' ? formatUsd(v) : formatNumber(v)
const usageRows = computed(() => stats.value.leaderboard?.entries || [])
const performanceRows = computed(() => stats.value.performance?.entries || [])
const timeSeriesRows = computed(() => (stats.value.timeseries?.series || []).map((bucket: any) => ({ date: bucket.date, value: bucket.models.reduce((sum: number, row: any) => sum + row.value, 0) })))
const maxSeriesValue = computed(() => Math.max(...timeSeriesRows.value.map((row: any) => row.value), 1))
const marketRows = computed(() => {
  const rows = stats.value.marketShare?.series?.at(-1)?.authors || []
  const total = rows.reduce((sum: number, row: any) => sum + row.value, 0)
  return rows.map((row: any) => ({ ...row, percentage: total ? row.value / total * 100 : 0 }))
})
</script>

<template>
  <div class="min-h-screen bg-[#f6f7f9] text-slate-900">
    <header class="border-b border-slate-200 bg-white"><div class="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-5 sm:px-6 lg:px-8"><div><p class="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">ZenMux / Platform API</p><h1 class="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Balance Monitor</h1></div><div class="hidden items-center gap-2 text-xs text-slate-500 sm:flex"><Activity :size="15" class="text-emerald-500" /> Management API</div></div></header>
    <main class="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <ApiKeyInput v-model="apiKey" :disabled="loading" />
      <div v-if="error" class="flex items-start gap-3 border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"><AlertCircle :size="18" class="mt-0.5 shrink-0" /><span>{{ error }}</span><button class="ml-auto" title="关闭" @click="error = null"><X :size="16" /></button></div>
      <div v-if="loading && !data" class="flex flex-col items-center gap-3 py-20"><LoadingSpinner /><span class="text-sm text-slate-500">正在读取账户数据…</span></div>
      <template v-if="data">
        <nav class="flex gap-1 border-b border-slate-200"><button v-for="item in ([['overview', '总览', Gauge], ['analytics', '统计分析', BarChart3], ['generation', 'Generation', Search]] as const)" :key="item[0]" :class="['flex items-center gap-2 border-b-2 px-3 py-3 text-sm font-medium', activeTab === item[0] ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-500 hover:text-slate-900']" @click="activeTab = item[0]"><component :is="item[2]" :size="16" />{{ item[1] }}</button><button class="ml-auto flex items-center gap-2 px-3 py-3 text-sm text-slate-500 disabled:opacity-50" :disabled="loading" @click="fetchData"><RefreshCw :size="15" :class="{ 'animate-spin': loading }" />刷新</button></nav>
        <section v-if="activeTab === 'overview'" class="space-y-6">
          <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <article class="border border-slate-200 bg-white p-5"><p class="text-xs text-slate-500">账户状态</p><p class="mt-2 text-xl font-semibold" :class="data.account_status === 'healthy' ? 'text-emerald-700' : 'text-amber-700'">{{ data.account_status }}</p><p class="mt-1 text-xs text-slate-400">{{ lastUpdated ? `更新于 ${formatDate(lastUpdated.toISOString())}` : '—' }}</p></article>
            <article class="border border-slate-200 bg-white p-5"><p class="text-xs text-slate-500">PAYG 余额</p><p class="mt-2 text-xl font-semibold">{{ formatUsd(data.payg?.total_credits) }}</p><p class="mt-1 text-xs text-slate-400">充值 {{ formatUsd(data.payg?.top_up_credits) }} · 奖励 {{ formatUsd(data.payg?.bonus_credits) }}</p></article>
            <article class="border border-slate-200 bg-white p-5"><p class="text-xs text-slate-500">当前计划</p><p class="mt-2 text-xl font-semibold">{{ data.plan?.tier?.toUpperCase() || '—' }}</p><p class="mt-1 text-xs text-slate-400">到期 {{ formatDate(data.plan?.expires_at) }}</p></article>
            <article class="border border-slate-200 bg-white p-5"><p class="text-xs text-slate-500">有效 Flow 费率</p><p class="mt-2 text-xl font-semibold">{{ formatUsd(data.effective_usd_per_flow) }}</p><p class="mt-1 text-xs text-slate-400">基础费率 {{ formatUsd(data.base_usd_per_flow) }} / Flow</p></article>
          </div>
          <div class="grid gap-6 lg:grid-cols-2"><QuotaPanel v-if="data.quota_5_hour" title="5 小时滚动窗口" description="高频保护额度，实时更新。" :quota="data.quota_5_hour" accent="blue" reset-label="窗口重置" /><QuotaPanel v-if="data.quota_7_day" title="7 天滚动窗口" description="周级别额度，实时更新。" :quota="data.quota_7_day" accent="green" reset-label="窗口重置" /></div>
          <article class="border border-slate-200 bg-white p-5"><div class="flex items-center gap-2"><Wallet :size="17" class="text-sky-600" /><h2 class="font-semibold">月度订阅额度</h2></div><div class="mt-4 flex flex-wrap gap-8 text-sm"><span><b class="mr-2 text-lg">{{ formatNumber(data.quota_monthly?.max_flows) }}</b>Flows</span><span><b class="mr-2 text-lg">{{ formatUsd(data.quota_monthly?.max_value_usd) }}</b>额度上限</span></div></article>
        </section>
        <section v-else-if="activeTab === 'analytics'" class="space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-white p-3"><div class="flex items-center gap-1"><button v-for="item in ([['cost', '成本'], ['tokens', 'Tokens']] as const)" :key="item[0]" :class="['px-3 py-1.5 text-sm', metric === item[0] ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100']" @click="metric = item[0]">{{ item[1] }}</button></div><div class="flex items-center gap-1"><button v-for="item in ([['1w', '周'], ['1d', '日']] as const)" :key="item[0]" :class="['px-3 py-1.5 text-sm', bucketWidth === item[0] ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:bg-slate-100']" @click="bucketWidth = item[0]">{{ item[1] }}粒度</button></div></div>
          <p v-if="statsErrors.length" class="text-xs text-amber-700">统计数据按天聚合，部分接口当前不可用或权限不足；余额数据仍然有效。</p>
          <div class="grid gap-6 lg:grid-cols-2"><article class="border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><h2 class="font-semibold">模型用量排行</h2><TrendingUp :size="17" class="text-sky-600" /></div><div class="mt-4 divide-y divide-slate-100"><div v-for="row in usageRows" :key="row.model" class="flex items-center justify-between gap-3 py-3 text-sm"><span class="truncate"><b class="mr-2 text-slate-400">{{ row.rank }}</b>{{ row.label }}</span><strong>{{ metricValue(row.value) }}</strong></div><p v-if="!usageRows.length" class="py-6 text-sm text-slate-400">暂无统计数据</p></div></article><article class="border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><h2 class="font-semibold">热门模型趋势</h2><Activity :size="17" class="text-emerald-600" /></div><div class="mt-4 divide-y divide-slate-100"><div v-for="row in (stats.trending?.entries || [])" :key="row.model" class="flex items-center justify-between gap-3 py-3 text-sm"><span class="truncate">{{ row.label }}</span><span class="font-medium" :class="row.growth_rate >= 0 ? 'text-emerald-700' : 'text-rose-700'">{{ row.growth_label }}</span></div><p v-if="!stats.trending?.entries?.length" class="py-6 text-sm text-slate-400">暂无统计数据</p></div></article></div>
          <div class="grid gap-6 lg:grid-cols-2"><article class="border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><h2 class="font-semibold">用量时间序列</h2><span class="text-xs text-slate-400">{{ bucketWidth === '1w' ? '按周' : '按日' }}</span></div><div class="mt-5 flex h-36 items-end gap-1 border-b border-slate-100"> <div v-for="row in timeSeriesRows" :key="row.date" class="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1"><span class="hidden text-[10px] text-slate-500 group-hover:block">{{ metricValue(row.value) }}</span><div class="w-full bg-sky-500" :style="{ height: `${Math.max(row.value / maxSeriesValue * 100, 3)}%` }" :title="`${row.date}: ${metricValue(row.value)}`" /></div><p v-if="!timeSeriesRows.length" class="w-full py-6 text-sm text-slate-400">暂无统计数据</p></div></article><article class="border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><h2 class="font-semibold">Provider 市占</h2><span class="text-xs text-slate-400">最近一个时间桶</span></div><div class="mt-4 space-y-3"><div v-for="row in marketRows" :key="row.author" class="text-sm"><div class="mb-1 flex justify-between"><span>{{ row.label }}</span><strong>{{ row.percentage.toFixed(1) }}%</strong></div><div class="h-1.5 bg-slate-100"><div class="h-full bg-violet-500" :style="{ width: `${row.percentage}%` }" /></div></div><p v-if="!marketRows.length" class="py-6 text-sm text-slate-400">暂无统计数据</p></div></article></div>
          <article class="border border-slate-200 bg-white p-5"><div class="flex items-center justify-between"><div><h2 class="font-semibold">主力模型逐日用量</h2><p class="mt-1 text-xs text-slate-400">{{ modelUsage?.label || '由模型用量排行自动选择' }}</p></div><span v-if="modelUsageLoading" class="text-xs text-slate-400">读取中…</span></div><div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5"><div v-for="row in (modelUsage?.series || []).slice(-10)" :key="row.date" class="border-l-2 border-sky-200 pl-2"><p class="text-xs text-slate-400">{{ row.date.slice(5) }}</p><p class="mt-1 text-sm font-medium">{{ metricValue(row.value) }}</p></div><p v-if="!modelUsage?.series?.length" class="col-span-full py-4 text-sm text-slate-400">暂无统计数据</p></div></article>
          <article class="border border-slate-200 bg-white p-5"><div class="flex items-center gap-2"><Database :size="17" class="text-violet-600" /><h2 class="font-semibold">Provider 吞吐排行</h2><span class="text-xs text-slate-400">过去 7 天</span></div><div class="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2"><div v-for="row in performanceRows.slice(0, 10)" :key="row.model" class="border-b border-slate-100 pb-3"><div class="flex justify-between text-sm"><span class="truncate">{{ row.label }}</span><span class="text-slate-500">{{ row.providers?.[0]?.value_label || '—' }}</span></div><p class="mt-1 text-xs text-slate-400">{{ row.providers?.[0]?.provider_label || '—' }}</p></div><p v-if="!performanceRows.length" class="text-sm text-slate-400">暂无性能数据</p></div></article>
        </section>
        <section v-else class="space-y-6"><article class="border border-slate-200 bg-white p-5"><div class="flex items-center gap-2"><KeyRound :size="17" class="text-sky-600" /><h2 class="font-semibold">查询 Generation</h2></div><p class="mt-1 text-sm text-slate-500">Generation 接口使用普通 ZenMux API Key，Management Key 不能查询模型请求账单。</p><input v-model="generationKey" type="password" class="mt-4 w-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500" placeholder="ZenMux API Key（sk-…）" /><form class="mt-2 flex flex-col gap-2 sm:flex-row" @submit.prevent="lookupGeneration"><input v-model="generationId" class="min-w-0 flex-1 border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-sky-500" placeholder="gen_01abc123def456" /><button class="flex items-center justify-center gap-2 bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50" :disabled="generationLoading || !generationId.trim() || !generationKey.trim()"><Search :size="15" />{{ generationLoading ? '查询中…' : '查询' }}</button></form></article><article v-if="generation" class="border border-slate-200 bg-white p-5"><div class="grid gap-4 sm:grid-cols-3"><div><p class="text-xs text-slate-500">模型</p><p class="mt-1 font-medium">{{ generation.model || '—' }}</p></div><div><p class="text-xs text-slate-500">请求耗时 / 首字节</p><p class="mt-1 font-medium">{{ generation.generationTime ?? '—' }}ms / {{ generation.latency ?? '—' }}ms</p></div><div><p class="text-xs text-slate-500">本次用量</p><p class="mt-1 font-medium">{{ generation.usage ?? '—' }}</p></div></div><pre class="mt-5 max-h-96 overflow-auto bg-slate-950 p-4 text-xs leading-5 text-slate-200">{{ JSON.stringify(generation, null, 2) }}</pre></article></section>
      </template>
    </main>
    <footer class="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-400 sm:px-6 lg:px-8">ZenMux Balance Monitor · 数据来自 Management Platform API</footer>
  </div>
</template>
