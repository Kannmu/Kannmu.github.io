import { describe, expect, it } from 'vitest';
import { fixture, expectArrayClose, expectClose } from './helpers.ts';
import { buildDense } from '../web/src/motion/path.ts';
import { place } from '../web/src/shapes/base.ts';
import { make } from '../web/src/shapes/library.ts';

interface PathFixture {
  xy_m: number[][];
  ds: number[];
  curvature: number[];
  stop: number[];
  hue: number[];
  visible: number[];
  length: number;
}

describe('dense path', () => {
  for (const name of ['square', 'star', 'circle']) {
    it(`matches the Python fillet/sampling for ${name}`, () => {
      const want = fixture<PathFixture>(`path_${name}.json`);
      const planar = place(make(name), 16, [0, 0]);
      const got = buildDense(planar, 1.2, 0.05, 'round');
      expect(got.x.length).toBe(want.xy_m.length);
      expectClose(got.length, want.length, 1e-12);
      expectArrayClose(got.x, want.xy_m.map((p) => p[0]), 1e-12, 'x');
      expectArrayClose(got.y, want.xy_m.map((p) => p[1]), 1e-12, 'y');
      expectArrayClose(got.ds, want.ds, 1e-12, 'ds');
      expectArrayClose(got.curvature, want.curvature, 1e-9, 'curvature');
      expectArrayClose(got.hue, want.hue, 1e-12, 'hue');
      for (let i = 0; i < got.stop.length; i++) {
        expect(got.stop[i]).toBe(want.stop[i]);
        expect(got.visible[i]).toBe(want.visible[i]);
      }
    });
  }

  it('honours the stop corner mode', () => {
    const planar = place(make('square'), 16, [0, 0]);
    const rounded = buildDense(planar, 1.2, 0.05, 'round');
    const stopped = buildDense(planar, 1.2, 0.05, 'stop');
    expect(stopped.stop.some((v) => v === 1)).toBe(true);
    expect(rounded.stop.some((v) => v === 1)).toBe(false);
  });
});
