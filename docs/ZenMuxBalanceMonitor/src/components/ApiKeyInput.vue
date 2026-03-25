<script setup lang="ts">
import { computed, ref } from 'vue'
import { Eye, EyeOff, Key } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const visible = ref(false)

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})
</script>

<template>
  <div class="w-full max-w-4xl mx-auto mb-8">
    <label class="block text-sm font-medium text-gray-500 mb-2">ZenMux Management API Key</label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Key class="h-4 w-4 text-gray-400" />
      </div>
      <input
        v-model="inputValue"
        :type="visible ? 'text' : 'password'"
        class="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
        :disabled="disabled"
        placeholder="sk-mg-v1-..."
      />
      <button
        @click="visible = !visible"
        :disabled="disabled"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
      >
        <component :is="visible ? EyeOff : Eye" class="h-4 w-4" />
      </button>
    </div>
    <p class="mt-2 text-xs text-gray-400">
      Your API key is stored locally in your browser. Used to fetch your subscription details.
    </p>
  </div>
</template>
