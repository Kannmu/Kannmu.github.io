import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '../web/src/config/defaults.ts';
import { plan } from '../web/src/motion/planner.ts';
import { MotionConfig, MODE_PATH, ratePayload } from '../web/src/device/protocol.ts';
import { hydratePlan } from '../web/src/app/PlanClient.ts';

describe('unlimited raw trajectory', () => {
  it('keeps the normal planner when the switch is off', () => {
    const cfg = createDefaultConfig();
    const result = plan(cfg, 'circle', { verify: true });
    expect(result.raw).toBeFalsy();
    expect(result.metrics.toppPeriodMs).toBeGreaterThan(0);
    expect(result.trapX.length).toBe(result.beadX.length);
    expect(result.trapX).not.toEqual(result.beadX);
  });

  it('follows the geometry without dynamics and allows a 16.7 h loop', () => {
    const cfg = createDefaultConfig();
    cfg.unlimited.enabled = true;
    cfg.unlimited.loopMs = 60000;
    cfg.unlimited.rate = 0.001;
    const result = plan(cfg, 'circle', { verify: true });
    expect(result.raw).toBe(true);
    expect(result.warnings).toEqual([]);
    expect(result.deviceLoopS).toBe(60);
    expect(result.playbackRate).toBe(0.001);
    expect(result.periodS).toBeCloseTo(60000, 9);
    expect(result.metrics.periodMs).toBeCloseTo(60_000_000, 3);
    expect(result.metrics.refreshHz).toBeCloseTo(1 / 60000, 12);
    expect(result.points.length).toBeLessThanOrEqual(cfg.planner.maxPoints);
    expect(result.trapX.length).toBe(result.beadX.length);
    for (let i = 0; i < result.beadX.length; i++) {
      expect(result.trapX[i]).toBe(result.beadX[i]);
      expect(result.trapY[i]).toBe(result.beadY[i]);
    }
    const speed = result.metrics.vMaxMmS;
    expect(speed).toBeCloseTo((result.metrics.lengthMm / result.periodS), 9);
    expect(speed).toBeLessThan(0.01);
  });

  it('uses the configured rate divider for shorter loops', () => {
    const cfg = createDefaultConfig();
    cfg.unlimited.enabled = true;
    cfg.unlimited.loopMs = 2000;
    cfg.unlimited.rate = 0.5;
    const result = plan(cfg, 'square');
    expect(result.periodS).toBeCloseTo(4, 9);
    expect(result.deviceLoopS).toBe(2);
    expect(result.playbackRate).toBe(0.5);
  });

  it('survives the worker structured clone with raw points', () => {
    const cfg = createDefaultConfig();
    cfg.unlimited.enabled = true;
    const result = plan(cfg, 'star');
    const hydrated = hydratePlan(structuredClone(result));
    expect(hydrated.raw).toBe(true);
    expect(hydrated.points[0].constructor.name).toBe('MotionPoint');
  });

  it('packs the firmware loop and rate divider at the limits', () => {
    const config = new MotionConfig({
      mode: MODE_PATH,
      loopMs: 60000,
      rateInitial: 0.001,
      rateTarget: 0.001,
      rateRampMs: 0
    });
    const bytes = config.pack();
    const view = new DataView(bytes.buffer);
    expect(view.getUint16(4, true)).toBe(60000);
    expect(view.getUint16(78, true)).toBe(1);
    expect(view.getUint16(80, true)).toBe(1);
    const rate = ratePayload(0.001, 0);
    expect(new DataView(rate.buffer).getUint16(0, true)).toBe(1);
  });
});
