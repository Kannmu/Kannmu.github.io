<script setup lang="ts">
import { ref, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import axios from 'axios'
import ApiKeyInput from './components/ApiKeyInput.vue'
import QuotaPanel from './components/QuotaPanel.vue'
import MetricCard from './components/MetricCard.vue'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { AlertCircle, RefreshCw } from 'lucide-vue-next'

const apiKey = useStorage('zenmux-management-key', '')
const loading = ref(false)
const error = ref<string | null>(null)
const data = ref<any>(null)

const fetchData = async () => {
  if (!apiKey.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await axios.get('/api/v1/management/subscription/detail', {
      headers: {
        'Authorization': `Bearer ${apiKey.value}`
      }
    })
    
    if (response.data.success) {
      data.value = response.data.data
    } else {
      throw new Error('获取数据失败')
    }
  } catch (err: any) {
    console.error('Fetch failed:', err)
    error.value = err.response?.data?.error?.message || err.message || '获取数据失败，请检查 API Key 或网络状态'
    data.value = null
  } finally {
    loading.value = false
  }
}

// Watch for API Key changes
watch(apiKey, (newVal) => {
  if (newVal && newVal.startsWith('sk-mg-')) {
    fetchData()
  } else {
    data.value = null
  }
}, { immediate: true })

const formatUsd = (value?: number) => {
  if (value === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 4
  }).format(value)
}

const formatDate = (dateString?: string) => {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
    
    <!-- Header -->
    <header class="text-center mb-12 animate-fade-in-down">
      <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
        ZenMux Balance Monitor
      </h1>
      <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Monitor your subscription quotas and plan details in real-time.
      </p>
    </header>

    <!-- Main Content -->
    <main class="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      <!-- API Key Input -->
      <ApiKeyInput v-model="apiKey" :disabled="loading" />

      <!-- Error Message -->
      <div v-if="error" class="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700">
        <AlertCircle class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <span class="text-sm font-medium">{{ error }}</span>
      </div>

      <!-- Loading State -->
      <div v-if="loading && !data" class="mt-12 flex flex-col items-center justify-center space-y-4">
        <LoadingSpinner />
        <p class="text-gray-400 text-sm font-medium animate-pulse">Fetching your subscription details...</p>
      </div>

      <!-- Data Dashboard -->
      <div v-if="data" class="space-y-6">
        
        <!-- Action Bar -->
        <div class="flex justify-end">
          <button 
            @click="fetchData" 
            :disabled="loading"
            class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw :size="16" :class="{'animate-spin': loading}" />
            <span>刷新数据</span>
          </button>
        </div>

        <!-- Overview Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard 
            title="账户状态" 
            :value="data.account_status === 'healthy' ? 'Healthy' : data.account_status" 
            :tone="data.account_status === 'healthy' ? 'green' : 'amber'"
          />
          <MetricCard 
            title="当前计划" 
            :value="data.plan?.tier.toUpperCase()" 
            :subtitle="`Expires: ${formatDate(data.plan?.expires_at)}`"
            tone="blue"
          />
          <MetricCard 
            title="有效费率" 
            :value="formatUsd(data.effective_usd_per_flow)" 
            subtitle="USD / Flow"
          />
          <MetricCard 
            title="月度总额度" 
            :value="formatUsd(data.quota_monthly?.max_value_usd)" 
            :subtitle="`Max Flows: ${data.quota_monthly?.max_flows}`"
          />
        </div>

        <!-- Quota Panels -->
        <div class="grid md:grid-cols-2 gap-6">
          <QuotaPanel 
            v-if="data.quota_5_hour"
            title="5小时窗口配额" 
            description="当前 5 小时滚动窗口内的使用情况。"
            :quota="data.quota_5_hour"
            accent="blue"
            resetLabel="下次刷新时间"
          />
          
          <QuotaPanel 
            v-if="data.quota_7_day"
            title="7天窗口配额" 
            description="本周内的使用情况统计。"
            :quota="data.quota_7_day"
            accent="green"
            resetLabel="每周刷新时间"
          />
        </div>

      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-auto py-8 text-center text-gray-400 text-sm">
      <p>&copy; {{ new Date().getFullYear() }} Kannmu. Designed for ZenMux.</p>
    </footer>

  </div>
</template>
