import { describe, expect, it } from 'vitest';
import { fftAny, ifftAny, irfft, rfft } from '../web/src/core/fft.ts';

function roundTrip(values: number[]): void {
  const spec = rfft(values);
  const back = irfft(spec.re, spec.im, values.length);
  for (let i = 0; i < values.length; i++) {
    expect(Math.abs(back[i] - values[i])).toBeLessThan(1e-10);
  }
}

describe('FFT', () => {
  it('round-trips arbitrary lengths', () => {
    roundTrip([1, 2, 3, 4]);
    roundTrip([1, -2, 0.5, 3, 7, -1, 2, 0.25, 9, 4, 4, -3, 2, 1, 0, 5, 6]);
    roundTrip([0]);
    roundTrip([1, 2]);
  });

  it('matches the analytic DFT for a few bins', () => {
    const values = [1, 2, 3, 4, 5, 6, 7];
    const spec = rfft(values);
    const n = values.length;
    for (let k = 0; k < spec.re.length; k++) {
      let re = 0;
      let im = 0;
      for (let t = 0; t < n; t++) {
        const a = (-2 * Math.PI * k * t) / n;
        re += values[t] * Math.cos(a);
        im += values[t] * Math.sin(a);
      }
      expect(Math.abs(spec.re[k] - re)).toBeLessThan(1e-10);
      expect(Math.abs(spec.im[k] - im)).toBeLessThan(1e-10);
    }
  });

  it('inverse complex transform scales by 1/n', () => {
    const re = Float64Array.from([3, 1, 4, 1, 5, 9]);
    const im = Float64Array.from([2, 7, 1, 8, 2, 8]);
    const r = re.slice();
    const i = im.slice();
    fftAny(r, i);
    ifftAny(r, i);
    for (let k = 0; k < re.length; k++) {
      expect(Math.abs(r[k] - re[k])).toBeLessThan(1e-10);
      expect(Math.abs(i[k] - im[k])).toBeLessThan(1e-10);
    }
  });
});
