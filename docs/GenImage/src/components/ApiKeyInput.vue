<script setup lang="ts">
import { ref, computed } from 'vue'
import { Eye, EyeOff, Key } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])

const showKey = ref(false)

const inputKey = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="w-full max-w-md mx-auto mb-8">
    <label class="block text-sm font-medium text-gray-500 mb-2">ZenMux API Key</label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Key class="h-4 w-4 text-gray-400" />
      </div>
      <input
        v-model="inputKey"
        :type="showKey ? 'text' : 'password'"
        class="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-sm"
        placeholder="Enter your API Key"
      />
      <button
        @click="showKey = !showKey"
        class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        <component :is="showKey ? EyeOff : Eye" class="h-4 w-4" />
      </button>
    </div>
    <p class="mt-2 text-xs text-gray-400 text-center">
      Your API key is stored locally in your browser.
    </p>
  </div>
</template>
