<template>
  <transition name="coach" mode="out-in">
    <div v-if="hint" :key="hint.id + hint.text" class="coach" :class="`coach--${hint.level}`">
      <component :is="icon" :size="16" />
      <span>{{ hint.text }}</span>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { AlertTriangle, Info, Target } from 'lucide-vue-next'

const props = defineProps({
  hints: { type: Array, default: () => [] }
})

const hint = computed(() => props.hints[0] || null)
const icon = computed(() => {
  if (!hint.value) return Info
  if (hint.value.level === 'signal') return Target
  if (hint.value.level === 'caution') return AlertTriangle
  return Info
})
</script>

<style scoped>
.coach {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  line-height: 1.45;
  border: 1px solid transparent;
  background: var(--surface-2);
  color: var(--text-dim);
}

.coach--signal {
  background: var(--accent-soft);
  border-color: rgba(76, 141, 255, 0.42);
  color: #c3d8ff;
}

.coach--caution {
  background: var(--warn-soft);
  border-color: rgba(255, 176, 32, 0.4);
  color: #ffd489;
}

.coach-enter-active,
.coach-leave-active {
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.coach-enter-from,
.coach-leave-to {
  opacity: 0;
  transform: translateY(3px);
}
</style>
