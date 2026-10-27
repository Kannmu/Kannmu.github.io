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
    /* v7.5 firmware renumbers the patterns: 4 is the eight-source vortex ring
     * and 6 is rejected, so the legacy name maps onto the real device mode. */
    expect(trapModeOf(cfg)).toBe(4);
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
      trap: { level: -20, table_distance_mm: 9999, pattern_radius_mm: 999, phase_span: 400 },
      display: { size_mm: 500, gamma: 100, color_scheme: 'cartoon' },
      unlimited: { loop_ms: 0, rate: 2 }
    });
    expect(cfg.trap.level).toBe(1);
    expect(cfg.trap.tableDistanceMm).toBe(400);
    expect(cfg.trap.patternRadiusMm).toBe(20);
    expect(cfg.trap.phaseSpan).toBe(255);
    expect(cfg.display.sizeMm).toBe(80);
    expect(cfg.display.gamma).toBe(4);
    expect(cfg.display.colorScheme).toBe('wheel');
    expect(cfg.unlimited.loopMs).toBe(1);
    expect(cfg.unlimited.rate).toBe(1);
  });

  it('keeps the ULM and hologram panels inside firmware limits', () => {
    const cfg = normalizeConfig({
      ulm: { enabled: true, frequency_hz: 5000, amplitude_um: -3, wave_speed_mm_s: 20000, axis: 'z' },
      holo: { shapes: ['circle', 'star'], transition_ms: 99999, output_rate_hz: 5000, level: 300, loop_ms: -1 }
    });
    expect(cfg.ulm.enabled).toBe(true);
    expect(cfg.ulm.frequencyHz).toBe(1000);
    expect(cfg.ulm.amplitudeUm).toBe(0);
    expect(cfg.ulm.waveSpeedMmS).toBe(10000);
    expect(cfg.ulm.axis).toBe('ring');
    expect(cfg.holo.shapes).toEqual(['circle', 'star']);
    expect(cfg.holo.transitionMs).toBe(10000);
    expect(cfg.holo.outputRateHz).toBe(1000);
    expect(cfg.holo.level).toBe(128);
    expect(cfg.holo.loopMs).toBe(0);
  });
});
