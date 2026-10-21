import { describe, expect, it } from 'vitest';
import { expectArrayClose } from './helpers.ts';
import { fixture } from './helpers.ts';
import { make, SHAPES } from '../web/src/shapes/library.ts';
import { layoutText } from '../web/src/shapes/text.ts';
import { place } from '../web/src/shapes/base.ts';

interface ShapeFixture {
  [name: string]: { points: number[][]; corners: number[]; hue: number[]; visible: number[] };
}

describe('shape library', () => {
  it('matches the Python geometry', () => {
    const data = fixture<ShapeFixture>('shapes.json');
    for (const name of Object.keys(data)) {
      const shape = make(name);
      expect(shape.x.length).toBe(data[name].points.length);
      for (let i = 0; i < shape.x.length; i++) {
        expect(shape.x[i]).toBeCloseTo(data[name].points[i][0], 12);
        expect(shape.y[i]).toBeCloseTo(data[name].points[i][1], 12);
        expect(shape.corners[i]).toBe(data[name].corners[i]);
        expect(shape.hue[i]).toBeCloseTo(data[name].hue[i], 12);
        expect(shape.visible[i]).toBe(data[name].visible[i]);
      }
    }
    expect(Object.keys(SHAPES)).toHaveLength(9);
  });

  it('places a shape in the drawing plane', () => {
    const planar = place(make('square'), 16, [3, -2]);
    expect(Math.max(...planar.xMm)).toBeCloseTo(3 + 8 * Math.SQRT1_2, 12);
    expect(planar.radiusMm.every((v) => Number.isNaN(v))).toBe(true);
  });
});

interface TextFixture {
  name: string;
  xy_mm: number[][];
  corners: number[];
  hue: number[];
  visible: number[];
  radius_mm: Array<number | null>;
}

describe('text layout', () => {
  it('matches the Python stroke ordering for "HI"', () => {
    const want = fixture<TextFixture>('text_HI.json');
    const got = layoutText('HI', 8, [0, 0]);
    expect(got.name).toBe(want.name);
    expect(got.xMm.length).toBe(want.xy_mm.length);
    for (let i = 0; i < got.xMm.length; i++) {
      expect(got.xMm[i]).toBeCloseTo(want.xy_mm[i][0], 12);
      expect(got.yMm[i]).toBeCloseTo(want.xy_mm[i][1], 12);
      expect(got.corners[i]).toBe(want.corners[i]);
      expect(got.hue[i]).toBeCloseTo(want.hue[i], 12);
      expect(got.visible[i]).toBe(want.visible[i]);
    }
    expectArrayClose(got.radiusMm, want.radius_mm, 1e-12, 'radius');
  });

  it('folds lower case and rejects empty text', () => {
    expect(layoutText('hi', 8).name).toBe('text:hi');
    expect(layoutText('a b', 8).xMm.length).toBeGreaterThan(10);
    expect(() => layoutText('   ', 8)).toThrow();
  });
});
