<template>
  <div
    ref="wrap"
    class="chart"
    @pointermove="onPointerMove"
    @pointerdown="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <canvas ref="canvas" />
    <div v-if="hoverInfo" class="chart__hover num" :style="hoverStyle">
      <span>{{ hoverInfo.time }}</span>
      <strong :class="hoverInfo.tone">{{ hoverInfo.price }}</strong>
      <span class="dim">{{ hoverInfo.change }}</span>
      <span v-if="hoverInfo.avg" class="avg">均价 {{ hoverInfo.avg }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatMarketTime, sessionTimeline } from '../core/codec.js'

const props = defineProps({
  day: { type: Object, required: true },
  barIndex: { type: Number, default: 0 },
  fills: { type: Array, default: () => [] },
  prevClose: { type: Number, required: true },
  tick: { type: Number, default: 0.01 },
  revealAll: { type: Boolean, default: false },
  showVolume: { type: Boolean, default: true }
})

const wrap = ref(null)
const canvas = ref(null)
let ctx = null
let observer = null
let frame = 0
let scaleMax = 0.006
let volMax = 1
let hoverIndex = -1

const COLORS = {
  bg: '#0b0f15',
  grid: 'rgba(255,255,255,0.055)',
  axis: 'rgba(255,255,255,0.14)',
  text: '#93a1b3',
  faint: '#5f6d7e',
  up: '#ff4d4f',
  down: '#12c48b',
  avg: '#ffc93c',
  crosshair: 'rgba(255,255,255,0.22)'
}

const PAD = { left: 10, right: 62, top: 16, bottom: 22 }

const grid = computed(() =>
  sessionTimeline(props.day.granularity === 'm5' ? 'm5' : 'm1').map(formatMarketTime)
)

const hoverInfo = ref(null)
const hoverStyle = ref({})

function priceDigits() {
  return props.tick === 0.001 ? 3 : 2
}

function formatPx(v) {
  return Number(v).toFixed(priceDigits())
}

function layout() {
  const el = wrap.value
  if (!el) return { w: 0, h: 0, dpr: 1 }
  const dpr = Math.min(2.5, window.devicePixelRatio || 1)
  const rect = el.getBoundingClientRect()
  const w = Math.max(120, Math.floor(rect.width))
  const h = Math.max(120, Math.floor(rect.height))
  const cv = canvas.value
  if (cv.width !== Math.floor(w * dpr) || cv.height !== Math.floor(h * dpr)) {
    cv.width = Math.floor(w * dpr)
    cv.height = Math.floor(h * dpr)
  }
  cv.style.width = `${w}px`
  cv.style.height = `${h}px`
  return { w, h, dpr }
}

function scheduleDraw() {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    draw()
  })
}

function draw() {
  const { w, h, dpr } = layout()
  if (!ctx || w <= 0) return
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, w, h)

  const day = props.day
  const n = day.close.length
  const lastIndex = props.revealAll ? n - 1 : Math.min(props.barIndex, n - 1)
  const plotW = w - PAD.left - PAD.right
  const volH = props.showVolume ? Math.max(28, h * 0.16) : 0
  const plotH = h - PAD.top - PAD.bottom - volH - 6
  if (plotW <= 10 || plotH <= 10) return

  const x = (i) => PAD.left + (plotW * i) / (n - 1)

  // --- price scale: expands with the day's own range, never with future data
  let hi = -Infinity
  let lo = Infinity
  for (let i = 0; i <= lastIndex; i++) {
    hi = Math.max(hi, day.high[i])
    lo = Math.min(lo, day.low[i])
  }
  const pc = props.prevClose
  const dev = Math.max(Math.abs(hi - pc), Math.abs(lo - pc), pc * 0.005)
  const target = Math.min(0.22, Math.max(0.005, dev * 1.18))
  scaleMax += (target - scaleMax) * 0.25
  if (Math.abs(target - scaleMax) < 0.0002) scaleMax = target

  const top = pc * (1 + scaleMax)
  const bottom = pc * (1 - scaleMax)
  const y = (price) => PAD.top + plotH * (1 - (price - bottom) / (top - bottom))

  // --- grid
  ctx.lineWidth = 1
  ctx.strokeStyle = COLORS.grid
  ctx.font = '500 11px ui-monospace, SF Mono, Consolas, monospace'
  ctx.textBaseline = 'middle'
  const levels = [1, 0.5, 0, -0.5, -1]
  for (const level of levels) {
    const price = pc * (1 + scaleMax * level)
    const yy = Math.round(y(price)) + 0.5
    ctx.beginPath()
    ctx.moveTo(PAD.left, yy)
    ctx.lineTo(PAD.left + plotW, yy)
    ctx.strokeStyle = level === 0 ? COLORS.axis : COLORS.grid
    if (level === 0) ctx.setLineDash([4, 4])
    ctx.stroke()
    ctx.setLineDash([])

    const pct = (scaleMax * level * 100).toFixed(2)
    ctx.fillStyle = level === 0 ? COLORS.faint : pct > 0 ? COLORS.up : COLORS.down
    ctx.textAlign = 'left'
    ctx.fillText(`${pct > 0 ? '+' : ''}${pct}%`, PAD.left + plotW + 8, yy)
    ctx.fillStyle = COLORS.faint
    ctx.textAlign = 'right'
    ctx.fillText(formatPx(price), PAD.left + plotW - 6, yy)
  }

  // --- time grid
  const marks = [0, 0.25, 0.5, 0.75, 1]
  ctx.textAlign = 'center'
  ctx.fillStyle = COLORS.faint
  ctx.font = '500 10px ui-monospace, SF Mono, Consolas, monospace'
  for (const m of marks) {
    const xx = Math.round(PAD.left + plotW * m) + 0.5
    ctx.strokeStyle = COLORS.grid
    ctx.beginPath()
    ctx.moveTo(xx, PAD.top)
    ctx.lineTo(xx, PAD.top + plotH)
    ctx.stroke()
    const idx = Math.round((n - 1) * m)
    ctx.fillText(grid.value[Math.min(idx, grid.value.length - 1)], Math.min(w - 16, Math.max(16, xx)), h - PAD.bottom + 12)
  }

  // --- volume
  if (props.showVolume) {
    let vmax = 1
    for (let i = 0; i <= lastIndex; i++) vmax = Math.max(vmax, day.volume[i] || 0)
    volMax += (vmax - volMax) * 0.25
    if (volMax < 1) volMax = 1
    const volTop = PAD.top + plotH + 6
    const barW = Math.max(1, plotW / n - (n > 120 ? 0.4 : 2))
    for (let i = 0; i <= lastIndex; i++) {
      const v = day.volume[i] || 0
      const bh = (volH * v) / volMax
      const up = i === 0 ? day.close[0] >= day.open : day.close[i] >= day.close[i - 1]
      ctx.fillStyle = up ? 'rgba(255,77,79,0.42)' : 'rgba(18,196,139,0.42)'
      ctx.fillRect(x(i) - barW / 2, volTop + volH - bh, barW, bh)
    }
  }

  // --- area + price line
  const lastPrice = day.close[lastIndex]
  const rising = lastPrice >= pc
  const lineColor = rising ? COLORS.up : COLORS.down

  ctx.beginPath()
  ctx.moveTo(x(0), y(day.close[0]))
  for (let i = 1; i <= lastIndex; i++) ctx.lineTo(x(i), y(day.close[i]))
  ctx.lineTo(x(lastIndex), y(bottom))
  ctx.lineTo(x(0), y(bottom))
  ctx.closePath()
  const grad = ctx.createLinearGradient(0, PAD.top, 0, PAD.top + plotH)
  grad.addColorStop(0, rising ? 'rgba(255,77,79,0.20)' : 'rgba(18,196,139,0.20)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(x(0), y(day.close[0]))
  for (let i = 1; i <= lastIndex; i++) ctx.lineTo(x(i), y(day.close[i]))
  ctx.strokeStyle = lineColor
  ctx.lineWidth = 1.8
  ctx.lineJoin = 'round'
  ctx.stroke()

  // --- average line (均价线)
  ctx.beginPath()
  ctx.moveTo(x(0), y(day.avg[0]))
  for (let i = 1; i <= lastIndex; i++) ctx.lineTo(x(i), y(day.avg[i]))
  ctx.strokeStyle = COLORS.avg
  ctx.lineWidth = 1.3
  ctx.stroke()

  // --- fills
  for (const fill of props.fills) {
    if (fill.barIndex > lastIndex) continue
    const fx = x(fill.barIndex)
    const fy = y(fill.price)
    const buy = fill.side === 'buy'
    ctx.beginPath()
    ctx.arc(fx, fy, 4.5, 0, Math.PI * 2)
    ctx.fillStyle = buy ? COLORS.up : COLORS.down
    ctx.fill()
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.lineWidth = 1.2
    ctx.stroke()
    ctx.fillStyle = buy ? COLORS.up : COLORS.down
    ctx.font = '700 10px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(buy ? 'B' : 'S', fx, fy - 11)
  }

  // --- current price marker
  const cx = x(lastIndex)
  const cy = y(lastPrice)
  ctx.setLineDash([3, 4])
  ctx.strokeStyle = lineColor
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.moveTo(PAD.left, cy)
  ctx.lineTo(PAD.left + plotW, cy)
  ctx.stroke()
  ctx.globalAlpha = 1
  ctx.setLineDash([])

  ctx.beginPath()
  ctx.arc(cx, cy, 3.4, 0, Math.PI * 2)
  ctx.fillStyle = lineColor
  ctx.fill()

  const tag = formatPx(lastPrice)
  ctx.font = '700 12px ui-monospace, SF Mono, Consolas, monospace'
  const tagW = ctx.measureText(tag).width + 14
  const tagX = PAD.left + plotW + 4
  const tagH = 20
  ctx.fillStyle = lineColor
  roundRect(ctx, tagX, cy - tagH / 2, Math.min(tagW, PAD.right - 8), tagH, 5)
  ctx.fill()
  ctx.fillStyle = '#0b0f15'
  ctx.textAlign = 'center'
  ctx.fillText(tag, tagX + Math.min(tagW, PAD.right - 8) / 2, cy)

  // --- hover crosshair
  if (hoverIndex >= 0 && hoverIndex <= lastIndex) {
    const hx = Math.round(x(hoverIndex)) + 0.5
    ctx.strokeStyle = COLORS.crosshair
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(hx, PAD.top)
    ctx.lineTo(hx, PAD.top + plotH)
    ctx.stroke()
    ctx.setLineDash([])
    const hy = y(day.close[hoverIndex])
    ctx.beginPath()
    ctx.arc(hx, hy, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
  }
}

function roundRect(context, rx, ry, rw, rh, r) {
  context.beginPath()
  context.moveTo(rx + r, ry)
  context.arcTo(rx + rw, ry, rx + rw, ry + rh, r)
  context.arcTo(rx + rw, ry + rh, rx, ry + rh, r)
  context.arcTo(rx, ry + rh, rx, ry, r)
  context.arcTo(rx, ry, rx + rw, ry, r)
  context.closePath()
}

function onPointerMove(event) {
  const el = wrap.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const pos = event.touches ? event.touches[0].clientX : event.clientX
  const n = props.day.close.length
  const plotW = rect.width - PAD.left - PAD.right
  const ratio = (pos - rect.left - PAD.left) / plotW
  const idx = Math.round(ratio * (n - 1))
  const lastIndex = props.revealAll ? n - 1 : Math.min(props.barIndex, n - 1)
  if (idx < 0 || idx > lastIndex) {
    hoverIndex = -1
    hoverInfo.value = null
    scheduleDraw()
    return
  }
  hoverIndex = idx
  const price = props.day.close[idx]
  const change = (price - props.prevClose) / props.prevClose
  hoverInfo.value = {
    time: grid.value[Math.min(idx, grid.value.length - 1)],
    price: formatPx(price),
    change: `${change >= 0 ? '+' : ''}${(change * 100).toFixed(2)}%`,
    avg: formatPx(props.day.avg[idx]),
    tone: change >= 0 ? 'up' : 'down'
  }
  const left = Math.max(8, Math.min(rect.width - 190, (rect.width * idx) / (n - 1) - 90))
  hoverStyle.value = { left: `${left}px` }
  scheduleDraw()
}

function onPointerLeave() {
  hoverIndex = -1
  hoverInfo.value = null
  scheduleDraw()
}

onMounted(() => {
  ctx = canvas.value.getContext('2d')
  observer = new ResizeObserver(() => scheduleDraw())
  observer.observe(wrap.value)
  scheduleDraw()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  if (frame) cancelAnimationFrame(frame)
})

watch(
  () => [props.barIndex, props.day, props.fills.length, props.revealAll],
  () => scheduleDraw()
)
watch(
  () => props.fills.map((f) => f.barIndex).join(','),
  () => scheduleDraw()
)
</script>

<style scoped>
.chart {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 180px;
  border-radius: var(--radius);
  overflow: hidden;
  touch-action: pan-y;
}

canvas {
  display: block;
}

.chart__hover {
  position: absolute;
  top: 8px;
  display: flex;
  gap: 10px;
  align-items: baseline;
  padding: 5px 10px;
  border-radius: 8px;
  background: rgba(12, 16, 22, 0.9);
  border: 1px solid var(--border);
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
}

.chart__hover strong {
  font-size: 14px;
}

.chart__hover .avg {
  color: var(--avg-line);
}
</style>
