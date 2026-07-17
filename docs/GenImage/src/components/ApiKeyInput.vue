<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff, Key } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  label: string
  placeholder?: string
  description?: string
}>()

const emit = defineEmits(['update:modelValue'])

const showKey = ref(false)

const inputKey = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="w-full">
    <label class="block text-sm font-medium text-gray-700 mb-2">{{ label }}</label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Key class="h-4 w-4 text-gray-400" />
      </div>
      <input
        v-model="inputKey"
        :type="showKey ? 'text' : 'password'"
        class="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
        :placeholder="placeholder || '输入 API Key'"
        autocomplete="off"
        spellcheck="false"
      />
      <button
        type="button"
        @click="showKey = !showKey"
        class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
        :aria-label="showKey ? '隐藏 API Key' : '显示 API Key'"
        :title="showKey ? '隐藏 API Key' : '显示 API Key'"
      >
        <component :is="showKey ? EyeOff : Eye" class="h-4 w-4" />
      </button>
    </div>
    <p class="mt-2 text-xs leading-5 text-gray-500">
      {{ description || 'API Key 仅保存在当前浏览器中。' }}
    </p>
  </div>
</template>
