import { G } from '../core/math.ts';
import type { AppConfig, RGB } from './types.ts';

export const CONFIG_VERSION = 3;
export const CONFIG_KEY = 'umh-display.config.v3';
export const UI_KEY = 'umh-display.ui.v1';

/** Piezo faces above the PCB plane (geometry/elements.py). */
export const ELEMENT_FACE_Z_MM = 7.0;

/**
 * Field name -> MOTION_CONFIG.trap_mode.  These are the six patterns the
 * firmware synthesises in ``motion_rebuild_pattern``; 6 and above are rejected
 * with -4, so the old Python "continuous vortex beam" is no longer selectable.
 */
export const FIELDS: Record<string, number> = {
  focus: 0,
  twinz: 1,
  twiny: 2,
  ring: 3,
  vortex: 4,
  duallring: 5
};

export const FIELD_LABELS: Record<string, string> = {
  focus: '单焦点',
  twinz: '轴向双焦',
  twiny: '横向双焦',
  ring: '环形',
  vortex: '涡旋',
  duallring: '双环'
};

export function defaultColorA(): RGB {
  return [255, 40, 0];
}

export function defaultColorB(): RGB {
  return [0, 90, 255];
}

export function createDefaultConfig(): AppConfig {
  return {
    port: '',
    configVersion: CONFIG_VERSION,
    bead: { diameterMm: 3.0, densityKgM3: 25.0 },
    trap: {
      field: 'focus',
      level: 88,
      tableDistanceMm: 95.0,
      focusOffsetMm: 0.0,
      patternRadiusMm: 2.0,
      phaseSpan: 0,
      mount: 'down',
      lateralAccels: { focus: 200.0, vortex: 40.0, twinz: 120.0, twiny: 60.0, ring: 40.0, duallring: 45.0 },
      dropLevels: {},
      extraDampingRatio: 0.02
    },
    planner: {
      outputRateHz: 2000,
      accelFraction: 0.6,
      maxSpeedMmS: 5000.0,
      drawLevel: 255,
      jerkTimeMs: 8.0,
      cornerRadiusMm: 1.2,
      cornerMode: 'round',
      sampleStepMm: 0.05,
      maxPoints: 1024,
      interpolation: 'catmull',
      rampMs: 600,
      seekSpeedMmS: 40.0,
      seekAccelMmS2: 400.0,
      robustForceError: 0.2,
      maxTrackingErrorMm: 1.2,
      minPeriodMs: 5.0
    },
    display: {
      sizeMm: 16.0,
      centerXMm: 0.0,
      centerYMm: 0.0,
      text: 'HI',
      textHeightMm: 8.0,
      refreshHz: 0.0,
      colorScheme: 'wheel',
      colorA: defaultColorA(),
      colorB: defaultColorB(),
      hueSpinRevS: 0.25,
      brightness: 1.0,
      gamma: 2.2,
      evenLines: 0.8,
      hoverBrightness: 0.15
    },
    unlimited: {
      enabled: false,
      loopMs: 2000,
      rate: 1,
      speedMmS: 2.0,
      accelMmS2: 5.0
    },
    ulm: {
      enabled: false,
      frequencyHz: 120,
      amplitudeUm: 0,
      waveSpeedMmS: 0,
      axis: 'ring',
      sawtooth: false
    },
    holo: {
      shapes: ['circle', 'square'],
      transitionMs: 1200,
      outputRateHz: 200,
      level: 128,
      loopMs: 0,
      holdLast: false,
      gamma: true
    }
  };
}

export function beadMassKg(diameterMm: number, densityKgM3: number): number {
  const r = diameterMm * 0.5e-3;
  return (densityKgM3 * 4.0) / 3.0 * Math.PI * r ** 3;
}

export function trapModeOf(cfg: AppConfig): number {
  return FIELDS[cfg.trap.field] ?? 0;
}

export function lateralAccelOf(cfg: AppConfig): number {
  return cfg.trap.lateralAccels[cfg.trap.field] ?? 200.0;
}

export function setLateralAccel(cfg: AppConfig, value: number): void {
  cfg.trap.lateralAccels = { ...cfg.trap.lateralAccels, [cfg.trap.field]: value };
}

export function focusZmmOf(cfg: AppConfig): number {
  return ELEMENT_FACE_Z_MM + cfg.trap.tableDistanceMm + cfg.trap.focusOffsetMm;
}

export function dropLevelOf(cfg: AppConfig): number | null {
  const value = cfg.trap.dropLevels[cfg.trap.field];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

export const PHYSICS_G = G;
