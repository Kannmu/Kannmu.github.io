<script setup lang="ts">
import { Check, ChevronDown } from 'lucide-vue-next'
import { computed, nextTick, onBeforeUnmount, ref, useId, watch } from 'vue'

export interface SelectOption {
  value: string
  label: string
}

const props = defineProps<{ label: string; modelValue: string; options: SelectOption[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const id = useId()
const labelId = `select-label-${id}`
const triggerId = `select-trigger-${id}`
const listboxId = `select-listbox-${id}`
const trigger = ref<HTMLButtonElement | null>(null)
const listbox = ref<HTMLDivElement | null>(null)
const portalTarget = ref<HTMLElement | null>(null)
const open = ref(false)
const activeIndex = ref(0)
const menuStyle = ref<Record<string, string>>({})

const selectedIndex = computed(() => Math.max(0, props.options.findIndex((option) => option.value === props.modelValue)))
const selected = computed(() => props.options[selectedIndex.value])
const activeId = computed(() => `${listboxId}-option-${activeIndex.value}`)

function positionMenu(): void {
  if (!open.value || !trigger.value || !listbox.value) return
  const anchor = trigger.value.getBoundingClientRect()
  const menu = listbox.value.getBoundingClientRect()
  const margin = 8
  const gap = 6
  const roomBelow = window.innerHeight - anchor.bottom - margin
  const roomAbove = anchor.top - margin
  const placeBelow = roomBelow >= menu.height + gap || roomBelow >= roomAbove
  const desiredTop = placeBelow ? anchor.bottom + gap : anchor.top - menu.height - gap
  const maxTop = Math.max(margin, window.innerHeight - menu.height - margin)
  const maxLeft = Math.max(margin, window.innerWidth - anchor.width - margin)

  menuStyle.value = {
    left: `${Math.round(Math.min(Math.max(anchor.left, margin), maxLeft))}px`,
    top: `${Math.round(Math.min(Math.max(desiredTop, margin), maxTop))}px`,
    width: `${Math.round(anchor.width)}px`,
  }
}

function addPositionListeners(): void {
  window.addEventListener('resize', positionMenu)
  window.addEventListener('scroll', positionMenu, true)
}

function removePositionListeners(): void {
  window.removeEventListener('resize', positionMenu)
  window.removeEventListener('scroll', positionMenu, true)
}

function openMenu(direction = 0): void {
  if (open.value) return
  activeIndex.value = Math.min(Math.max(selectedIndex.value + direction, 0), props.options.length - 1)
  portalTarget.value = trigger.value?.closest('dialog') || document.body
  open.value = true
  addPositionListeners()
  void nextTick(() => {
    positionMenu()
    listbox.value?.focus()
    listbox.value?.querySelector<HTMLElement>(`#${activeId.value}`)?.scrollIntoView({ block: 'nearest' })
  })
}

function closeMenu(returnFocus = false): void {
  if (!open.value) return
  open.value = false
  removePositionListeners()
  if (returnFocus) void nextTick(() => trigger.value?.focus())
}

function selectOption(index: number): void {
  const option = props.options[index]
  if (!option) return
  emit('update:modelValue', option.value)
  closeMenu(true)
}

function moveActive(index: number): void {
  activeIndex.value = Math.min(Math.max(index, 0), props.options.length - 1)
  void nextTick(() => listbox.value?.querySelector<HTMLElement>(`#${activeId.value}`)?.scrollIntoView({ block: 'nearest' }))
}

function findByPrefix(key: string): void {
  if (key.length !== 1 || key.trim() === '') return
  const query = key.toLocaleLowerCase()
  const count = props.options.length
  for (let offset = 1; offset <= count; offset += 1) {
    const index = (activeIndex.value + offset) % count
    if (props.options[index]?.label.toLocaleLowerCase().startsWith(query)) {
      moveActive(index)
      return
    }
  }
}

function onTriggerKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    openMenu(event.key === 'ArrowDown' ? 1 : -1)
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openMenu()
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    openMenu()
    moveActive(event.key === 'Home' ? 0 : props.options.length - 1)
  }
}

function onListboxKeydown(event: KeyboardEvent): void {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    moveActive(activeIndex.value + (event.key === 'ArrowDown' ? 1 : -1))
  } else if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    moveActive(event.key === 'Home' ? 0 : props.options.length - 1)
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    selectOption(activeIndex.value)
  } else if (event.key === 'Escape') {
    event.preventDefault()
    closeMenu(true)
  } else if (event.key === 'Tab') {
    closeMenu()
  } else {
    findByPrefix(event.key)
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  const target = event.target as Node
  if (trigger.value?.contains(target) || listbox.value?.contains(target)) return
  closeMenu()
}

watch(open, (value) => {
  if (value) document.addEventListener('pointerdown', onDocumentPointerDown, true)
  else document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
watch(() => props.modelValue, () => { activeIndex.value = selectedIndex.value })
onBeforeUnmount(() => {
  removePositionListeners()
  document.removeEventListener('pointerdown', onDocumentPointerDown, true)
})
</script>

<template>
  <div class="select-field">
    <span :id="labelId">{{ label }}</span>
    <button
      :id="triggerId"
      ref="trigger"
      type="button"
      class="select-trigger"
      :class="{ open }"
      :aria-labelledby="`${labelId} ${triggerId}-value`"
      aria-haspopup="listbox"
      :aria-expanded="open"
      :aria-controls="listboxId"
      @click="open ? closeMenu() : openMenu()"
      @keydown="onTriggerKeydown"
    >
      <span :id="`${triggerId}-value`">{{ selected?.label }}</span>
      <ChevronDown :size="17" aria-hidden="true" />
    </button>

    <Teleport v-if="open && portalTarget" :to="portalTarget">
      <div
        :id="listboxId"
        ref="listbox"
        class="select-listbox"
        role="listbox"
        tabindex="-1"
        :aria-labelledby="labelId"
        :aria-activedescendant="activeId"
        :style="menuStyle"
        @keydown="onListboxKeydown"
      >
        <button
          v-for="(option, index) in options"
          :id="`${listboxId}-option-${index}`"
          :key="option.value"
          type="button"
          class="select-option"
          :class="{ active: index === activeIndex, selected: option.value === modelValue }"
          role="option"
          tabindex="-1"
          :aria-selected="option.value === modelValue"
          @pointerenter="activeIndex = index"
          @click="selectOption(index)"
        >
          <span>{{ option.label }}</span>
          <Check v-if="option.value === modelValue" :size="16" stroke-width="2.5" aria-hidden="true" />
        </button>
      </div>
    </Teleport>
  </div>
</template>
