<script setup lang="ts">
import { computed, ref } from 'vue'
import { Eye, EyeOff, Key } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  modelValue: string
  label?: string
  placeholder?: string
  description?: string
  accent?: 'blue' | 'emerald'
}>(), {
  label: 'API Key',
  placeholder: '输入 API Key',
  description: 'API Key 仅保存在当前浏览器的本地存储中，不会写入项目文件。',
  accent: 'blue'
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const showKey = ref(false)

const inputKey = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const focusClass = computed(() => props.accent === 'emerald'
  ? 'focus:ring-emerald-600'
  : 'focus:ring-blue-500')
</script>

<template>
  <label class="block space-y-2">
    <span class="text-sm font-medium text-gray-700">{{ label }}</span>
    <span class="relative block">
      <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Key class="h-4 w-4 text-gray-400" />
      </span>
      <input
        v-model="inputKey"
        :type="showKey ? 'text' : 'password'"
        :placeholder="placeholder"
        autocomplete="off"
        spellcheck="false"
        :class="[
          'block w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-transparent focus:ring-2',
          focusClass
        ]"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors hover:text-gray-600"
        :aria-label="showKey ? '隐藏 API Key' : '显示 API Key'"
        @click="showKey = !showKey"
      >
        <component :is="showKey ? EyeOff : Eye" class="h-4 w-4" />
      </button>
    </span>
    <span class="block text-xs leading-5 text-gray-500">{{ description }}</span>
  </label>
</template>
