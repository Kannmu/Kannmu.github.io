<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import { useLocale } from '../composables/useLocale'

const props = defineProps<{ open: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement | null>(null)
const { t } = useLocale()
const titleId = 'mobile-sheet-title'

watch(() => props.open, (open) => {
  if (open && !dialog.value?.open) dialog.value?.showModal()
  if (!open && dialog.value?.open) dialog.value.close()
})
function onClick(event: MouseEvent): void { if (event.target === dialog.value) emit('close') }
onBeforeUnmount(() => { if (dialog.value?.open) dialog.value.close() })
</script>

<template>
  <dialog ref="dialog" class="mobile-sheet" :aria-labelledby="titleId" @close="emit('close')" @cancel.prevent="emit('close')" @click="onClick">
    <div class="sheet-surface"><div class="sheet-handle"></div><header><h2 :id="titleId">{{ title }}</h2><button type="button" :aria-label="t('close')" @click="emit('close')"><X :size="20" /></button></header><slot /></div>
  </dialog>
</template>
