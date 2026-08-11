import type { Directive, DirectiveBinding } from 'vue'

const VIEWPORT_MARGIN = 8
const TOOLTIP_GAP = 10
let tooltipId = 0

interface TooltipState {
  tooltip: HTMLDivElement
  text: string
  visible: boolean
  frame: number
  describedBy: string | null
  show: (event?: Event) => void
  hide: () => void
  position: () => void
  onFocus: () => void
  onKeydown: (event: KeyboardEvent) => void
}

const states = new WeakMap<HTMLElement, TooltipState>()

function setDescription(element: HTMLElement, id: string): string | null {
  const describedBy = element.getAttribute('aria-describedby')
  const ids = new Set((describedBy || '').split(/\s+/).filter(Boolean))
  ids.add(id)
  element.setAttribute('aria-describedby', [...ids].join(' '))
  return describedBy
}

function positionTooltip(element: HTMLElement, state: TooltipState): void {
  if (!state.visible || !element.isConnected) return

  const anchor = element.getBoundingClientRect()
  const tooltipRect = state.tooltip.getBoundingClientRect()
  const availableAbove = anchor.top - VIEWPORT_MARGIN
  const availableBelow = window.innerHeight - anchor.bottom - VIEWPORT_MARGIN
  const placeAbove = availableAbove >= tooltipRect.height + TOOLTIP_GAP || availableAbove >= availableBelow
  const desiredTop = placeAbove
    ? anchor.top - tooltipRect.height - TOOLTIP_GAP
    : anchor.bottom + TOOLTIP_GAP
  const desiredLeft = anchor.left + anchor.width / 2 - tooltipRect.width / 2
  const maxLeft = Math.max(VIEWPORT_MARGIN, window.innerWidth - tooltipRect.width - VIEWPORT_MARGIN)
  const maxTop = Math.max(VIEWPORT_MARGIN, window.innerHeight - tooltipRect.height - VIEWPORT_MARGIN)
  const left = Math.min(Math.max(desiredLeft, VIEWPORT_MARGIN), maxLeft)
  const top = Math.min(Math.max(desiredTop, VIEWPORT_MARGIN), maxTop)
  const arrowX = Math.min(Math.max(anchor.left + anchor.width / 2 - left, 12), tooltipRect.width - 12)

  state.tooltip.style.left = `${Math.round(left)}px`
  state.tooltip.style.top = `${Math.round(top)}px`
  state.tooltip.style.setProperty('--tooltip-arrow-x', `${Math.round(arrowX)}px`)
  state.tooltip.dataset.placement = placeAbove ? 'top' : 'bottom'
}

function mounted(element: HTMLElement, binding: DirectiveBinding<string>): void {
  const tooltip = document.createElement('div')
  tooltip.id = `pholo-tooltip-${++tooltipId}`
  tooltip.className = 'app-tooltip'
  tooltip.setAttribute('role', 'tooltip')
  tooltip.hidden = true
  tooltip.textContent = binding.value || ''
  document.body.appendChild(tooltip)

  const state = {} as TooltipState
  state.tooltip = tooltip
  state.text = binding.value || ''
  state.visible = false
  state.frame = 0
  state.describedBy = setDescription(element, tooltip.id)
  state.position = () => positionTooltip(element, state)
  state.show = (event?: Event) => {
    if (!state.text || (event instanceof PointerEvent && event.pointerType === 'touch')) return
    state.visible = true
    tooltip.hidden = false
    tooltip.textContent = state.text
    state.position()
    window.addEventListener('resize', state.position)
    window.addEventListener('scroll', state.position, true)
    cancelAnimationFrame(state.frame)
    state.frame = requestAnimationFrame(() => {
      state.position()
      tooltip.classList.add('is-visible')
    })
  }
  state.hide = () => {
    if (!state.visible) return
    state.visible = false
    cancelAnimationFrame(state.frame)
    tooltip.classList.remove('is-visible')
    tooltip.hidden = true
    window.removeEventListener('resize', state.position)
    window.removeEventListener('scroll', state.position, true)
  }
  state.onFocus = () => {
    if (element.matches(':focus-visible')) state.show()
  }
  state.onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') state.hide()
  }

  states.set(element, state)
  element.addEventListener('pointerenter', state.show)
  element.addEventListener('pointerleave', state.hide)
  element.addEventListener('focus', state.onFocus)
  element.addEventListener('blur', state.hide)
  element.addEventListener('pointerdown', state.hide)
  element.addEventListener('keydown', state.onKeydown)
}

function updated(element: HTMLElement, binding: DirectiveBinding<string>): void {
  const state = states.get(element)
  if (!state) return
  state.text = binding.value || ''
  state.tooltip.textContent = state.text
  if (!state.text) state.hide()
  else state.position()
}

function unmounted(element: HTMLElement): void {
  const state = states.get(element)
  if (!state) return
  state.hide()
  element.removeEventListener('pointerenter', state.show)
  element.removeEventListener('pointerleave', state.hide)
  element.removeEventListener('focus', state.onFocus)
  element.removeEventListener('blur', state.hide)
  element.removeEventListener('pointerdown', state.hide)
  element.removeEventListener('keydown', state.onKeydown)
  if (state.describedBy === null) element.removeAttribute('aria-describedby')
  else element.setAttribute('aria-describedby', state.describedBy)
  state.tooltip.remove()
  states.delete(element)
}

export const tooltip: Directive<HTMLElement, string> = { mounted, updated, unmounted }
