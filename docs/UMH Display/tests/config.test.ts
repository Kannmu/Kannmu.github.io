import { describe, expect, it } from 'vitest';
import { createDefaultConfig, focusZmmOf, lateralAccelOf, trapModeOf } from '../web/src/config/defaults.ts';
import { normalizeConfig } from '../web/src/config/store.ts';

describe('configuration', () => {
  it('starts from the Python defaults', () => {
    const cfg = createDefaultConfig();
    expect(cfg.trap.level).toBe(88);
    expect(cfg.trap.lateralAccels.focus).toBe(200);
    expect(cfg.planner.outputRateHz).toBe(2000);
    expect(cfg.display.sizeMm).toBe(16);
    expect(lateralAccelOf(cfg)).toBe(200);
    expect(trapModeOf(cfg)).toBe(0);
    expect(focusZmmOf(cfg)).toBe(102);
  });

  it('imports a legacy Python config (snake_case)', () => {
    const cfg = normalizeConfig({
      config_version: 3,
      port: 'COM7',
      trap: {
        field: 'vortex',
        level: 203,
        table_distance_mm: 97.5,
        lateral_accels: { focus: 210, vortex: 44 }
      },
      planner: { draw_level: 255, corner_mode: 'stop', interpolation: 'linear' },
      display: {
        size_mm: 22,
        color_scheme: 'gradient',
        color_a: [10, 20, 30],
        refresh_hz: 15
      },
      unlimited: { enabled: true, loop_ms: 60000, rate: 0.001 }
    });
    expect(cfg.port).toBe('COM7');
    expect(cfg.trap.field).toBe('vortex');
    expect(trapModeOf(cfg)).toBe(6);
    expect(lateralAccelOf(cfg)).toBe(44);
    expect(cfg.planner.cornerMode).toBe('stop');
    expect(cfg.planner.interpolation).toBe('linear');
    expect(cfg.display.colorScheme).toBe('gradient');
    expect(cfg.display.colorA).toEqual([10, 20, 30]);
    expect(cfg.display.refreshHz).toBe(15);
    expect(cfg.unlimited.enabled).toBe(true);
    expect(cfg.unlimited.loopMs).toBe(60000);
    expect(cfg.unlimited.rate).toBe(0.001);
  });

  it('applies the v1 -> v2 -> v3 migrations', () => {
    const cfg = normalizeConfig({
      config_version: 1,
      planner: { output_rate_hz: 1500, max_points: 255, min_period_ms: 60 },
      display: { period_ms: 40 },
      bead: { diameter_mm: 3.5 }
    });
    expect(cfg.planner.maxPoints).toBe(1024);
    expect(cfg.planner.outputRateHz).toBe(2000);
    expect(cfg.display.refreshHz).toBe(25);
    expect(cfg.bead.diameterMm).toBe(3);
  });

  it('clamps nonsense values instead of taking them literally', () => {
    const cfg = normalizeConfig({
      trap: { level: -20, table_distance_mm: 9999 },
      display: { size_mm: 500, gamma: 100, color_scheme: 'cartoon' },
      unlimited: { loop_ms: 0, rate: 2 }
    });
    expect(cfg.trap.level).toBe(1);
    expect(cfg.trap.tableDistanceMm).toBe(400);
    expect(cfg.display.sizeMm).toBe(80);
    expect(cfg.display.gamma).toBe(4);
    expect(cfg.display.colorScheme).toBe('wheel');
    expect(cfg.unlimited.loopMs).toBe(1);
    expect(cfg.unlimited.rate).toBe(1);
  });
});
