import { describe, expect, it } from 'vitest';
import { fixture, expectArrayClose, expectClose } from './helpers.ts';
import { createDefaultConfig } from '../web/src/config/defaults.ts';
import { encodeColor, previewRgb } from '../web/src/motion/color.ts';
import { framePhases, samplePath, pointsArrays } from '../web/src/device/emulation.ts';
import { MotionPoint } from '../web/src/device/protocol.ts';
import { FreeSpace, bottlePhase, clampSplit, coreRadius } from '../web/src/physics/bottle.ts';

interface ColorFixture {
  palette: number[][];
  palette_byte: number[];
  level: number[];
  spin_x10: number;
  preview: number[][];
}

describe('colour encoding', () => {
  for (const scheme of ['wheel', 'gradient', 'solid'] as const) {
    it(`matches Python for ${scheme}`, () => {
      const want = fixture<ColorFixture>(`color_${scheme}.json`);
      const cfg = createDefaultConfig();
      cfg.display.colorScheme = scheme;
      const hue = Float64Array.from({ length: 32 }, (_, i) => (i * 0.999) / 31);
      const intensity = Float64Array.from({ length: 32 }, (_, i) => i / 31);
      const got = encodeColor(cfg, hue, intensity);
      expect(got.palette).toEqual(want.palette);
      expectArrayClose(got.paletteByte, want.palette_byte, 0, 'palette byte');
      expectArrayClose(got.level, want.level, 0, 'level');
      expect(got.spinX10).toBe(want.spin_x10);
      const preview = previewRgb(got.palette, got.paletteByte, got.level);
      for (let i = 0; i < preview.length; i++) {
        expect(preview[i]).toEqual(want.preview[i]);
      }
    });
  }
});

interface EmulationFixture {
  phases: number[];
  phase_last: number;
  xyz: number[][];
  level: number[];
  palette: number[];
}

describe('device emulation', () => {
  it('matches the firmware models', () => {
    const f = fixture<EmulationFixture>('emulation.json');
    const period = 1 / 18.867924528301888;
    const phases = framePhases(period, 2000, 0.25, 0.1);
    expectArrayClose(phases.subarray(0, 200), f.phases, 1e-12, 'phase');
    expectClose(phases[phases.length - 1], f.phase_last, 1e-12);
    const points = [0, 1, 2, 3].map(
      (i) =>
        new MotionPoint(
          [0, 5, 5, 0][i] * 1000,
          [0, 0, 5, 5][i] * 1000,
          102000,
          255,
          i * 16
        )
    );
    const arr = pointsArrays(points, 16);
    const sampled = samplePath(arr.xyzUm, arr.level, arr.palettePos, phases, false, 16);
    for (let i = 0; i < 50; i++) {
      expectClose(sampled.x[i], f.xyz[i][0], 1e-12);
      expectClose(sampled.y[i], f.xyz[i][1], 1e-12);
      expectClose(sampled.z[i], f.xyz[i][2], 1e-12);
      expectClose(sampled.level[i], f.level[i], 1e-12);
      expectClose(sampled.palette[i], f.palette[i], 1e-12);
    }
  });
});

interface BottleFixture {
  positions: number[][];
  radii: number[];
  aperture_radius_mm: number;
  phase_angle: number[];
  clamp_20: number;
  clamp_32: number;
  clamp_50: number;
  core_29: number;
  core_32: number;
  core_35: number;
  height_z: number;
}

describe('bottle beam', () => {
  it('matches the Python phase pattern and calibration table', () => {
    const f = fixture<BottleFixture>('bottle.json');
    const space = new FreeSpace();
    expectClose(space.apertureRadiusMm, f.aperture_radius_mm, 1e-12);
    expectClose(space.planeZ, 7e-3, 1e-12);
    for (let i = 0; i < f.positions.length; i++) {
      expectClose(space.positions[i * 3], f.positions[i][0], 1e-12);
      expectClose(space.positions[i * 3 + 1], f.positions[i][1], 1e-12);
      expectClose(space.radii[i], f.radii[i], 1e-12);
    }
    const drive = bottlePhase(space, -10, 5, 70, 32);
    for (let i = 0; i < f.phase_angle.length; i++) {
      expectClose(Math.atan2(drive.im[i], drive.re[i]), f.phase_angle[i], 1e-12);
    }
    expectClose(clampSplit(space, 20), f.clamp_20, 1e-12);
    expectClose(clampSplit(space, 32), f.clamp_32, 1e-12);
    expectClose(clampSplit(space, 50), f.clamp_50, 1e-12);
    expectClose(coreRadius(29), f.core_29, 1e-12);
    expectClose(coreRadius(32), f.core_32, 1e-12);
    expectClose(coreRadius(35), f.core_35, 1e-12);
    expectClose(space.zOf(70), f.height_z, 1e-12);
  });
});
