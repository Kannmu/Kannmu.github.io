/**
 * FFT primitives for the motion planner.
 *
 * The Python planner uses numpy's rfft/irfft on loop lengths that are not
 * powers of two (n = round(period * 4000 Hz)), so this module implements a
 * radix-2 FFT plus Bluestein's algorithm for arbitrary lengths.  Conventions
 * match numpy: forward transforms are unscaled, inverse transforms carry 1/n,
 * and irfft assumes Hermitian symmetry.
 */

function isPow2(n: number): boolean {
  return n > 0 && (n & (n - 1)) === 0;
}

function nextPow2(n: number): number {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
}

/** In-place power-of-two complex FFT.  inverse = true scales by 1/n. */
export function fftPow2(re: Float64Array, im: Float64Array, inverse = false): void {
  const n = re.length;
  if (n <= 1) return;
  if (!isPow2(n)) throw new Error(`fftPow2: length ${n} is not a power of two`);

  // bit-reversal permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      let t = re[i]; re[i] = re[j]; re[j] = t;
      t = im[i]; im[i] = im[j]; im[j] = t;
    }
  }

  const sign = inverse ? 1 : -1;
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (sign * 2 * Math.PI) / len;
    const wRe = Math.cos(ang);
    const wIm = Math.sin(ang);
    const half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let curRe = 1;
      let curIm = 0;
      for (let k = 0; k < half; k++) {
        const a = i + k;
        const b = a + half;
        const vRe = re[b] * curRe - im[b] * curIm;
        const vIm = re[b] * curIm + im[b] * curRe;
        re[b] = re[a] - vRe;
        im[b] = im[a] - vIm;
        re[a] += vRe;
        im[a] += vIm;
        const nextRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = nextRe;
      }
    }
  }

  if (inverse) {
    const inv = 1 / n;
    for (let i = 0; i < n; i++) {
      re[i] *= inv;
      im[i] *= inv;
    }
  }
}

/** Arbitrary-length forward complex FFT (Bluestein when not a power of two). */
export function fftAny(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  if (isPow2(n)) {
    fftPow2(re, im, false);
    return;
  }
  bluestein(re, im, false);
}

/** Arbitrary-length inverse complex FFT, scaled by 1/n. */
export function ifftAny(re: Float64Array, im: Float64Array): void {
  const n = re.length;
  if (isPow2(n)) {
    fftPow2(re, im, true);
    return;
  }
  bluestein(re, im, true);
}

function bluestein(re: Float64Array, im: Float64Array, inverse: boolean): void {
  const n = re.length;
  const m = nextPow2(2 * n - 1);
  const aRe = new Float64Array(m);
  const aIm = new Float64Array(m);
  const bRe = new Float64Array(m);
  const bIm = new Float64Array(m);
  const sign = inverse ? 1 : -1;

  // w[k] = exp(sign * i*pi*k^2/n) (chirp); reduce k^2 mod 2n to keep the
  // argument small for long transforms
  const chirpRe = new Float64Array(n);
  const chirpIm = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    const kk = (k * k) % (2 * n);
    const phase = (sign * Math.PI * kk) / n;
    chirpRe[k] = Math.cos(phase);
    chirpIm[k] = Math.sin(phase);
  }

  for (let k = 0; k < n; k++) {
    aRe[k] = re[k] * chirpRe[k] - im[k] * chirpIm[k];
    aIm[k] = re[k] * chirpIm[k] + im[k] * chirpRe[k];
  }
  bRe[0] = chirpRe[0];
  bIm[0] = -chirpIm[0];
  for (let k = 1; k < n; k++) {
    bRe[k] = bRe[m - k] = chirpRe[k];
    bIm[k] = bIm[m - k] = -chirpIm[k];
  }

  fftPow2(aRe, aIm, false);
  fftPow2(bRe, bIm, false);
  for (let i = 0; i < m; i++) {
    const r = aRe[i] * bRe[i] - aIm[i] * bIm[i];
    const ii = aRe[i] * bIm[i] + aIm[i] * bRe[i];
    aRe[i] = r;
    aIm[i] = ii;
  }
  fftPow2(aRe, aIm, true);

  const scale = inverse ? 1 / n : 1;
  for (let k = 0; k < n; k++) {
    // multiply by the remaining chirp
    const r = aRe[k] * chirpRe[k] - aIm[k] * chirpIm[k];
    const ii = aRe[k] * chirpIm[k] + aIm[k] * chirpRe[k];
    re[k] = r * scale;
    im[k] = ii * scale;
  }
}

export interface ComplexSpectrum {
  re: Float64Array;
  im: Float64Array;
}

/** numpy.fft.rfft for an arbitrary length. */
export function rfft(values: ArrayLike<number>): ComplexSpectrum {
  const n = values.length;
  const re = new Float64Array(n);
  const im = new Float64Array(n);
  for (let i = 0; i < n; i++) re[i] = values[i];
  fftAny(re, im);
  const half = Math.floor(n / 2) + 1;
  return { re: re.slice(0, half), im: im.slice(0, half) };
}

/** numpy.fft.irfft for an arbitrary length. */
export function irfft(re: ArrayLike<number>, im: ArrayLike<number>, n: number): Float64Array {
  const fullRe = new Float64Array(n);
  const fullIm = new Float64Array(n);
  const half = Math.floor(n / 2) + 1;
  fullRe[0] = re[0] ?? 0;
  fullIm[0] = im[0] ?? 0;
  for (let k = 1; k < half; k++) {
    fullRe[k] = re[k] ?? 0;
    fullIm[k] = im[k] ?? 0;
    if (k < n - k) {
      fullRe[n - k] = fullRe[k];
      fullIm[n - k] = -fullIm[k];
    }
  }
  if (n % 2 === 0) {
    fullRe[n / 2] = re[half - 1] ?? 0;
    fullIm[n / 2] = 0;
  }
  ifftAny(fullRe, fullIm);
  return fullRe;
}

export function complexMagnitude(re: number, im: number): number {
  return Math.sqrt(re * re + im * im);
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  // Python colorsys.hsv_to_rgb
  if (s <= 0) return [v, v, v];
  const i = Math.floor(h * 6) % 6;
  const f = h * 6 - Math.floor(h * 6);
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  switch (i) {
    case 0: return [v, t, p];
    case 1: return [q, v, p];
    case 2: return [p, v, t];
    case 3: return [p, q, v];
    case 4: return [t, p, v];
    default: return [v, p, q];
  }
}
