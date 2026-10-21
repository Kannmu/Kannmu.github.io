import { describe, expect, it } from 'vitest';
import { fixture, expectArrayClose, expectClose } from './helpers.ts';
import { createDefaultConfig } from '../web/src/config/defaults.ts';
import { plan, placeShape, drawLevel } from '../web/src/motion/planner.ts';
import { make } from '../web/src/shapes/library.ts';
import { place } from '../web/src/shapes/base.ts';
import { hydratePlan } from '../web/src/app/PlanClient.ts';
import { MotionPoint, uploadPayload } from '../web/src/device/protocol.ts';

interface PlanFixture {
  name: string;
  period_s: number;
  rate_hz: number;
  ramp_ms: number;
  level: number;
  focus_z_um: number;
  palette: number[][];
  palette_spin_x10: number;
  points: number[][];
  metrics: Record<string, number>;
  warnings: string[];
  samples?: {
    t: number[];
    bead_xy: number[][];
    trap_xy: number[][];
    led_rgb: number[][];
    speed: number[];
    accel: number[];
    sim_bead_xy: number[][] | null;
    target_xy: number[][] | null;
    bead_lit: number[];
  };
}

function compare(name: string, cfg = createDefaultConfig()): ReturnType<typeof plan> {
  const f = fixture<PlanFixture>(name);
  const got = plan(cfg, f.name);
  expect(got.periodS).toBeCloseTo(f.period_s, 9);
  expect(got.level).toBe(f.level);
  expect(got.rampMs).toBe(f.ramp_ms);
  expect(got.rateHz).toBe(f.rate_hz);
  expect(got.focusZUm).toBeCloseTo(f.focus_z_um, 6);
  expect(got.palette).toEqual(f.palette);
  expect(got.paletteSpinX10).toBe(f.palette_spin_x10);
  expect(got.points.length).toBe(f.points.length);
  for (let i = 0; i < f.points.length; i++) {
    expect(got.points[i].xUm).toBeCloseTo(f.points[i][0], 3);
    expect(got.points[i].yUm).toBeCloseTo(f.points[i][1], 3);
    expect(got.points[i].zUm).toBeCloseTo(f.points[i][2], 3);
    expect(got.points[i].level).toBe(f.points[i][3]);
    expect(got.points[i].palette).toBe(f.points[i][4]);
  }
  for (const [key, want] of Object.entries(f.metrics)) {
    const camel = key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
    const value = got.metrics[camel];
    const relative = Math.abs(value - want) / Math.max(1, Math.abs(want));
    expect(relative, `${name} metric ${key} (${value} vs ${want})`).toBeLessThan(1e-7);
  }
  expect(got.warnings.length).toBe(f.warnings.length);
  if (f.samples) {
    const s = f.samples;
    expectArrayClose(got.t, s.t, 1e-9, 't');
    expectArrayClose(got.beadX, s.bead_xy.map((p) => p[0]), 1e-6, 'beadX');
    expectArrayClose(got.beadY, s.bead_xy.map((p) => p[1]), 1e-6, 'beadY');
    expectArrayClose(got.trapX, s.trap_xy.map((p) => p[0]), 1e-6, 'trapX');
    expectArrayClose(got.trapY, s.trap_xy.map((p) => p[1]), 1e-6, 'trapY');
    expectArrayClose(got.speed, s.speed, 1e-6, 'speed');
    expectArrayClose(got.accel, s.accel, 1e-6, 'accel');
    expectArrayClose(got.ledR, s.led_rgb.map((p) => p[0]), 0, 'ledR');
    expectArrayClose(got.ledG, s.led_rgb.map((p) => p[1]), 0, 'ledG');
    expectArrayClose(got.ledB, s.led_rgb.map((p) => p[2]), 0, 'ledB');
    if (s.target_xy) {
      expectArrayClose(got.targetX, s.target_xy.map((p) => p[0]), 1e-9, 'targetX');
      expectArrayClose(got.targetY, s.target_xy.map((p) => p[1]), 1e-9, 'targetY');
    }
    if (s.sim_bead_xy) {
      expectArrayClose(got.simBeadX!, s.sim_bead_xy.map((p) => p[0]), 1e-6, 'simX');
      expectArrayClose(got.simBeadY!, s.sim_bead_xy.map((p) => p[1]), 1e-6, 'simY');
    }
  }
  return got;
}

describe('motion planner', () => {
  it('matches the Python automatic-refresh plan for a circle', () => {
    compare('plan_circle_auto.json');
  });

  it('matches the Python 15 Hz plan for a circle', () => {
    const cfg = createDefaultConfig();
    cfg.display.refreshHz = 15;
    compare('plan_circle_15hz.json', cfg);
  });

  it('matches the Python plan for text "HI"', () => {
    compare('plan_text_HI.json');
  });

  it('matches the Python stop-corner square', () => {
    const cfg = createDefaultConfig();
    cfg.planner.cornerMode = 'stop';
    const f = fixture<PlanFixture>('plan_square_stop.json');
    const got = plan(cfg, 'square', { planar: place(make('square'), 16) });
    expectClose(got.periodS, f.period_s, 1e-9);
    expect(got.points.length).toBe(f.points.length);
    for (const [key, want] of Object.entries(f.metrics)) {
      const camel = key.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());
      const value = got.metrics[camel];
      const relative = Math.abs(value - want) / Math.max(1, Math.abs(want));
      expect(relative, `metric ${key} (${value} vs ${want})`).toBeLessThan(1e-7);
    }
  });

  it('survives the worker structured-clone round trip', () => {
    const cfg = createDefaultConfig();
    const raw = plan(cfg, 'circle', { verify: false });
    const cloned = structuredClone(raw);
    const hydrated = hydratePlan(cloned);
    expect(hydrated.points[0]).toBeInstanceOf(MotionPoint);
    const payload = uploadPayload(hydrated.points);
    expect(payload.length).toBe(hydrated.points.length * 8 + 8);
  });

  it('exposes the placement helpers', () => {
    const cfg = createDefaultConfig();
    expect(drawLevel(cfg)).toBe(255);
    const planar = placeShape(cfg, 'text:OK');
    expect(planar.name).toBe('text:OK');
    expect(planar.xMm.length).toBeGreaterThan(10);
  });
});
