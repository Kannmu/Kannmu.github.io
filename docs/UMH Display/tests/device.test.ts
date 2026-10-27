import { describe, expect, it } from 'vitest';
import { fixture, expectArrayClose, expectClose } from './helpers.ts';
import { createDefaultConfig } from '../web/src/config/defaults.ts';
import { encodeColor, previewRgb } from '../web/src/motion/color.ts';
import { framePhases, samplePath, pointsArrays } from '../web/src/device/emulation.ts';
import { MotionPoint } from '../web/src/device/protocol.ts';

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

describe('demo hardware hologram engine', () => {
  it('behaves like the device-side keyframe executor', async () => {
    const { DemoDevice } = await import('../web/src/device/demo.ts');
    const { HologramConfig, HOLOGRAM_CHANNELS } = await import('../web/src/device/protocol.ts');
    const demo = new DemoDevice();
    expect(demo.profile.hasHologram).toBe(true);
    expect(demo.hasHologram).toBe(true);

    const frame = (phase: number) => ({
      phase: Uint8Array.from({ length: HOLOGRAM_CHANNELS }, () => phase),
      level: new Uint8Array(HOLOGRAM_CHANNELS).fill(128)
    });
    await demo.holoUpload([frame(0), frame(64), frame(128)]);
    const config = new HologramConfig({ outputRateHz: 200, transitionMs: 500, keyframes: 3 });
    await demo.holoConfigure(config);
    let status = await demo.holoStatus();
    expect(status.state).toBe(1);
    expect(status.stateName).toBe('READY');
    expect(status.keyframeCount).toBe(3);

    await demo.holoStart();
    status = await demo.holoStatus();
    expect(status.state).toBe(2);
    expect(status.running).toBe(true);
    expect(status.currentKeyframe).toBeGreaterThanOrEqual(0);
    expect(status.currentKeyframe).toBeLessThan(3);
    expect(status.alpha).toBeGreaterThanOrEqual(0);
    expect(status.alpha).toBeLessThanOrEqual(1);

    /* START takes the output away from the motion engine, like the firmware. */
    expect((await demo.systemFlags()) & 0x2).toBe(0x2);
    expect((await demo.motionStatus()).running).toBe(false);

    await demo.holoStop();
    status = await demo.holoStatus();
    expect(status.state).toBe(3);
    expect(status.stateName).toBe('STOPPING');
    expect((await demo.systemFlags()) & 0x2).toBe(0x2);

    await demo.clear();
    expect((await demo.motionStatus()).running).toBe(false);
  });
});
