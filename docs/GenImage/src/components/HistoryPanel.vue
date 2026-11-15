<script setup lang="ts">
import { computed } from 'vue'
import { AlertCircle, Clock3, History, ImageOff, Trash2 } from 'lucide-vue-next'
import { formatBytes } from '../services/historyPolicy'
import type { HistoryRecord } from '../services/historyStore'

const props = defineProps<{
  records: HistoryRecord[]
  limit: number
  bytes: number
  budgetBytes: number
  activeId: string | null
  status: 'loading' | 'ready' | 'unavailable'
  error: string | null
}>()

const emit = defineEmits<{
  (event: 'select', record: HistoryRecord): void
  (event: 'delete', id: string): void
  (event: 'clear'): void
  (event: 'update:limit', limit: number): void
}>()

const limitOptions = [5, 6, 7, 8, 9, 10]

const usageLabel = computed(() => `${formatBytes(props.bytes)} / ${formatBytes(props.budgetBytes)}`)

const thumbnailFor = (record: HistoryRecord) => {
  const image = [...record.items].reverse().find((item) => item.kind === 'image')
  return image && image.kind === 'image' ? image.imageUrl : null
}

const statusLabel = (record: HistoryRecord) => {
  if (record.status === 'failed') return '失败'
  return record.operation === 'edit' ? '编辑' : '生成'
}

const formatTime = (iso: string) => {
  const value = Date.parse(iso)
  if (!Number.isFinite(value)) return '未知时间'
  const diff = Date.now() - value
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`

  const date = new Date(value)
  const time = date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  const sameDay = new Date().toDateString() === date.toDateString()
  if (sameDay) return `今天 ${time}`
  return `${date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })} ${time}`
}

const handleLimitChange = (event: Event) => {
  const value = Number((event.target as HTMLSelectElement).value)
  if (Number.isFinite(value)) emit('update:limit', value)
}

const requestClear = () => {
  if (props.records.length === 0) return
  if (window.confirm(`确定清空全部 ${props.records.length} 条历史记录吗？该操作不可撤销。`)) {
    emit('clear')
  }
}
</script>

<template>
  <section class="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="flex items-center gap-2 text-lg font-semibold text-gray-950">
          <History class="h-5 w-5 text-gray-400" />
          历史记录
          <span class="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {{ records.length }}/{{ limit }}
          </span>
        </h2>
        <p class="mt-1 text-xs leading-5 text-gray-500">
          仅保存在当前浏览器，超出 {{ limit }} 条或存储上限时自动覆盖最旧的记录。
          <span class="whitespace-nowrap">占用 {{ usageLabel }}</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <label class="flex items-center gap-2 text-xs font-medium text-gray-600">
          保留条数
          <select
            :value="limit"
            class="h-9 rounded-lg border border-gray-200 bg-white px-2 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-emerald-600"
            @change="handleLimitChange"
          >
            <option v-for="option in limitOptions" :key="option" :value="option">{{ option }} 条</option>
          </select>
        </label>
        <button
          type="button"
          class="inline-flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="records.length === 0"
          @click="requestClear"
        >
          <Trash2 class="h-4 w-4" />
          清空
        </button>
      </div>
    </div>

    <div v-if="status === 'unavailable'" class="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
      <AlertCircle class="mt-0.5 h-4 w-4 shrink-0" />
      <p>{{ error || '当前浏览器不支持或禁用了本地数据库，历史记录不可用；生成功能不受影响。' }}</p>
    </div>

    <div v-else-if="status === 'loading' && records.length === 0" class="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
      正在读取历史记录…
    </div>

    <div v-else-if="records.length === 0" class="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
      还没有历史记录，完成一次生成后会自动保存。
    </div>

    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <article
        v-for="record in records"
        :key="record.id"
        :class="[
          'group relative overflow-hidden rounded-lg border bg-white transition',
          activeId === record.id ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-gray-200 hover:border-gray-300'
        ]"
      >
        <button type="button" class="block w-full text-left" @click="emit('select', record)">
          <div class="relative aspect-square bg-gray-100">
            <img
              v-if="thumbnailFor(record)"
              :src="thumbnailFor(record) || ''"
              :alt="record.prompt.slice(0, 40)"
              loading="lazy"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full flex-col items-center justify-center gap-1 text-xs text-gray-400">
              <ImageOff class="h-5 w-5" />
              <span>无图片</span>
            </div>

            <span
              :class="[
                'absolute left-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-medium text-white',
                record.status === 'failed' ? 'bg-red-600/85' : 'bg-gray-900/70'
              ]"
            >
              {{ statusLabel(record) }}
            </span>
            <span class="absolute bottom-2 right-2 max-w-[85%] truncate rounded-full bg-black/55 px-2 py-0.5 text-[11px] text-white">
              {{ record.imageSize }}
            </span>
          </div>

          <div class="space-y-1 p-3">
            <p class="line-clamp-2 text-xs leading-5 text-gray-700">{{ record.prompt }}</p>
            <p class="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock3 class="h-3 w-3" />
              <span>{{ formatTime(record.createdAt) }}</span>
              <span class="truncate">· {{ record.modelName || record.model }}</span>
            </p>
          </div>
        </button>

        <button
          type="button"
          class="absolute right-2 top-2 rounded-full bg-white/85 p-1.5 text-gray-500 opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-white hover:text-red-600 focus:opacity-100"
          title="删除这条记录"
          aria-label="删除这条记录"
          @click.stop="emit('delete', record.id)"
        >
          <Trash2 class="h-4 w-4" />
        </button>
      </article>
    </div>
  </section>
</template>
