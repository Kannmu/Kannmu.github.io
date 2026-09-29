/**
 * Tiny WebAudio feedback.
 *
 * No audio assets: every sound is synthesised on the spot, so the whole game
 * stays a few hundred kilobytes. Audio is only ever triggered by a deliberate
 * user action (an order, a settlement), and the AudioContext is created lazily
 * on the first one so browsers never complain about autoplay.
 */

let ctx = null
let enabled = true

export function setSoundEnabled(value) {
  enabled = Boolean(value)
  if (!enabled && ctx) {
    ctx.close?.()
    ctx = null
  }
}

function context() {
  if (!enabled) return null
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function blip({ freq = 440, to = null, duration = 0.09, type = 'triangle', gain = 0.05, delay = 0 }) {
  const audio = context()
  if (!audio) return
  const start = audio.currentTime + delay
  const osc = audio.createOscillator()
  const amp = audio.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), start + duration)
  amp.gain.setValueAtTime(0.0001, start)
  amp.gain.exponentialRampToValueAtTime(gain, start + 0.012)
  amp.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(amp).connect(audio.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

export const sfx = {
  buy() {
    blip({ freq: 320, to: 620, duration: 0.11, gain: 0.055 })
  },
  sell() {
    blip({ freq: 620, to: 300, duration: 0.11, gain: 0.055 })
  },
  reject() {
    blip({ freq: 150, to: 110, duration: 0.16, type: 'sawtooth', gain: 0.035 })
  },
  roundStart() {
    blip({ freq: 520, duration: 0.06, gain: 0.03 })
    blip({ freq: 780, duration: 0.07, gain: 0.03, delay: 0.07 })
  },
  /** Settlement fanfare scaled by the grade. */
  settle(grade) {
    const notes = {
      S: [523, 659, 784, 1047],
      A: [523, 659, 784],
      B: [523, 659],
      C: [440, 523],
      D: [330, 262]
    }[grade] || [440]
    notes.forEach((freq, i) => {
      blip({ freq, duration: 0.13, gain: 0.045, delay: i * 0.085, type: grade === 'D' ? 'sine' : 'triangle' })
    })
  }
}
