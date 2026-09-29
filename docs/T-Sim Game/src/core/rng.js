/** Deterministic RNG so the daily challenge and "repeat this round" reproduce exactly. */

export function hashString(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

export function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(seed) {
  const next = mulberry32(typeof seed === 'string' ? hashString(seed) : seed >>> 0)
  return {
    next,
    int(maxExclusive) {
      return Math.floor(next() * maxExclusive)
    },
    pick(array) {
      return array[Math.floor(next() * array.length)]
    },
    /** Weighted pick: `weightOf(item)` returns a positive number. */
    pickWeighted(array, weightOf) {
      let total = 0
      for (const item of array) total += Math.max(0, weightOf(item))
      if (total <= 0) return array[Math.floor(next() * array.length)]
      let roll = next() * total
      for (const item of array) {
        roll -= Math.max(0, weightOf(item))
        if (roll <= 0) return item
      }
      return array[array.length - 1]
    }
  }
}

export function todaySeed(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}
