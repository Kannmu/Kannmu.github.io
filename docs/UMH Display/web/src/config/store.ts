/**
 * Config persistence (browser): localStorage instead of ``~/.umh_display.json``.
 *
 * Old Python config files can be imported from the UI; the snake_case keys and
 * the v1 -> v3 migrations from ``config.py`` are honoured so a user keeps their
 * calibrated lateral strength.
 */
import { CONFIG_KEY, CONFIG_VERSION, createDefaultConfig } from './defaults.ts';
import type { AppConfig, ColorScheme, CornerMode, FieldKind, Interpolation, Mount, RGB } from './types.ts';

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function num(value: unknown, fallback: number, lo = -Infinity, hi = Infinity): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(hi, Math.max(lo, n));
}

function int(value: unknown, fallback: number, lo: number, hi: number): number {
  return Math.round(num(value, fallback, lo, hi));
}

function str(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function rgb(value: unknown, fallback: RGB): RGB {
  if (Array.isArray(value) && value.length >= 3) {
    return [
      int(value[0], fallback[0], 0, 255),
      int(value[1], fallback[1], 0, 255),
      int(value[2], fallback[2], 0, 255)
    ];
  }
  return [...fallback];
}

function dict(value: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (isObject(value)) {
    for (const [key, entry] of Object.entries(value)) {
      const n = Number(entry);
      if (Number.isFinite(n)) out[key] = n;
    }
  }
  return out;
}

export function cloneConfig<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Merge a raw object (localStorage or a Python JSON file) into a fresh config. */
export function normalizeConfig(raw: unknown): AppConfig {
  const cfg = createDefaultConfig();
  if (!isObject(raw)) return cfg;

  cfg.port = str(raw.port, cfg.port);

  const bead = isObject(raw.bead) ? raw.bead : {};
  cfg.bead.diameterMm = num(bead.diameter_mm ?? bead.diameterMm, cfg.bead.diameterMm, 0.5, 20);
  cfg.bead.densityKgM3 = num(bead.density_kg_m3 ?? bead.densityKgM3, cfg.bead.densityKgM3, 1, 500);

  const trap = isObject(raw.trap) ? raw.trap : {};
  const field = str(trap.field, cfg.trap.field);
  cfg.trap.field = (field === 'vortex' ? 'vortex' : 'focus') as FieldKind;
  cfg.trap.level = int(trap.level, cfg.trap.level, 1, 255);
  cfg.trap.tableDistanceMm = num(trap.table_distance_mm ?? trap.tableDistanceMm, cfg.trap.tableDistanceMm, 10, 400);
  cfg.trap.focusOffsetMm = num(trap.focus_offset_mm ?? trap.focusOffsetMm, cfg.trap.focusOffsetMm, -95, 95);
  cfg.trap.mount = (str(trap.mount, cfg.trap.mount) === 'side' ? 'side' : 'down') as Mount;
  cfg.trap.lateralAccels = { ...cfg.trap.lateralAccels, ...dict(trap.lateral_accels ?? trap.lateralAccels) };
  cfg.trap.dropLevels = { ...cfg.trap.dropLevels, ...dict(trap.drop_levels ?? trap.dropLevels) };
  cfg.trap.extraDampingRatio = num(trap.extra_damping_ratio ?? trap.extraDampingRatio, cfg.trap.extraDampingRatio, 0, 0.5);

  const planner = isObject(raw.planner) ? raw.planner : {};
  cfg.planner.outputRateHz = int(planner.output_rate_hz ?? planner.outputRateHz, cfg.planner.outputRateHz, 50, 2000);
  cfg.planner.accelFraction = num(planner.accel_fraction ?? planner.accelFraction, cfg.planner.accelFraction, 0.01, 2);
  cfg.planner.maxSpeedMmS = num(planner.max_speed_mm_s ?? planner.maxSpeedMmS, cfg.planner.maxSpeedMmS, 1, 20000);
  cfg.planner.drawLevel = int(planner.draw_level ?? planner.drawLevel, cfg.planner.drawLevel, 0, 255);
  cfg.planner.jerkTimeMs = num(planner.jerk_time_ms ?? planner.jerkTimeMs, cfg.planner.jerkTimeMs, 0, 100);
  cfg.planner.cornerRadiusMm = num(planner.corner_radius_mm ?? planner.cornerRadiusMm, cfg.planner.cornerRadiusMm, 0, 20);
  const corner = str(planner.corner_mode ?? planner.cornerMode, cfg.planner.cornerMode);
  cfg.planner.cornerMode = (corner === 'stop' ? 'stop' : 'round') as CornerMode;
  cfg.planner.sampleStepMm = num(planner.sample_step_mm ?? planner.sampleStepMm, cfg.planner.sampleStepMm, 0.01, 1);
  cfg.planner.maxPoints = int(planner.max_points ?? planner.maxPoints, cfg.planner.maxPoints, 32, 1024);
  const interp = str(planner.interpolation, cfg.planner.interpolation);
  cfg.planner.interpolation = (interp === 'linear' ? 'linear' : 'catmull') as Interpolation;
  cfg.planner.rampMs = int(planner.ramp_ms ?? planner.rampMs, cfg.planner.rampMs, 0, 10000);
  cfg.planner.seekSpeedMmS = num(planner.seek_speed_mm_s ?? planner.seekSpeedMmS, cfg.planner.seekSpeedMmS, 1, 500);
  cfg.planner.seekAccelMmS2 = num(planner.seek_accel_mm_s2 ?? planner.seekAccelMmS2, cfg.planner.seekAccelMmS2, 10, 10000);
  cfg.planner.robustForceError = num(planner.robust_force_error ?? planner.robustForceError, cfg.planner.robustForceError, 0, 0.9);
  cfg.planner.maxTrackingErrorMm = num(planner.max_tracking_error_mm ?? planner.maxTrackingErrorMm, cfg.planner.maxTrackingErrorMm, 0.1, 20);
  cfg.planner.minPeriodMs = num(planner.min_period_ms ?? planner.minPeriodMs, cfg.planner.minPeriodMs, 1, 1000);

  const display = isObject(raw.display) ? raw.display : {};
  cfg.display.sizeMm = num(display.size_mm ?? display.sizeMm, cfg.display.sizeMm, 2, 80);
  cfg.display.centerXMm = num(display.center_x_mm ?? display.centerXMm, cfg.display.centerXMm, -40, 40);
  cfg.display.centerYMm = num(display.center_y_mm ?? display.centerYMm, cfg.display.centerYMm, -40, 40);
  cfg.display.text = str(display.text, cfg.display.text).slice(0, 24);
  cfg.display.textHeightMm = num(display.text_height_mm ?? display.textHeightMm, cfg.display.textHeightMm, 2, 40);
  cfg.display.refreshHz = num(display.refresh_hz ?? display.refreshHz, cfg.display.refreshHz, 0, 200);
  const scheme = str(display.color_scheme ?? display.colorScheme, cfg.display.colorScheme);
  cfg.display.colorScheme = (['wheel', 'gradient', 'solid'].includes(scheme) ? scheme : 'wheel') as ColorScheme;
  cfg.display.colorA = rgb(display.color_a ?? display.colorA, cfg.display.colorA);
  cfg.display.colorB = rgb(display.color_b ?? display.colorB, cfg.display.colorB);
  cfg.display.hueSpinRevS = num(display.hue_spin_rev_s ?? display.hueSpinRevS, cfg.display.hueSpinRevS, 0, 1.55);
  cfg.display.brightness = num(display.brightness, cfg.display.brightness, 0, 1);
  cfg.display.gamma = num(display.gamma, cfg.display.gamma, 0.5, 4);
  cfg.display.evenLines = num(display.even_lines ?? display.evenLines, cfg.display.evenLines, 0, 1);
  cfg.display.hoverBrightness = num(display.hover_brightness ?? display.hoverBrightness, cfg.display.hoverBrightness, 0, 1);

  const gg = isObject(raw.gravity_gun) ? raw.gravity_gun : isObject(raw.gravityGun) ? raw.gravityGun : {};
  cfg.gravityGun.level = int(gg.level, cfg.gravityGun.level, 1, 128);
  cfg.gravityGun.heightMm = num(gg.height_mm ?? gg.heightMm, cfg.gravityGun.heightMm, 20, 130);
  cfg.gravityGun.splitMm = num(gg.split_mm ?? gg.splitMm, cfg.gravityGun.splitMm, 20, 45);
  cfg.gravityGun.sensitivityMmS = num(gg.sensitivity_mm_s ?? gg.sensitivityMmS, cfg.gravityGun.sensitivityMmS, 1, 500);
  cfg.gravityGun.zSpeedMmS = num(gg.z_speed_mm_s ?? gg.zSpeedMmS, cfg.gravityGun.zSpeedMmS, 1, 500);
  cfg.gravityGun.speedLimitMmS = num(gg.speed_limit_mm_s ?? gg.speedLimitMmS, cfg.gravityGun.speedLimitMmS, 1, 1000);
  cfg.gravityGun.updateHz = num(gg.update_hz ?? gg.updateHz, cfg.gravityGun.updateHz, 2, 500);
  cfg.gravityGun.deadzone = num(gg.deadzone, cfg.gravityGun.deadzone, 0, 0.9);
  cfg.gravityGun.smoothingMs = num(gg.smoothing_ms ?? gg.smoothingMs, cfg.gravityGun.smoothingMs, 1, 2000);
  const bounds = gg.bounds_mm ?? gg.boundsMm;
  if (Array.isArray(bounds) && bounds.length >= 3) {
    cfg.gravityGun.boundsMm = [
      num(bounds[0], cfg.gravityGun.boundsMm[0], 5, 200),
      num(bounds[1], cfg.gravityGun.boundsMm[1], 5, 200),
      num(bounds[2], cfg.gravityGun.boundsMm[2], 20, 300)
    ];
  }
  cfg.gravityGun.bottomMm = num(gg.bottom_mm ?? gg.bottomMm, cfg.gravityGun.bottomMm, 10, 200);
  cfg.gravityGun.heightMaxMm = num(gg.height_max_mm ?? gg.heightMaxMm, cfg.gravityGun.heightMaxMm, 20, 300);
  cfg.gravityGun.phaseSign = num(gg.phase_sign ?? gg.phaseSign, cfg.gravityGun.phaseSign, -1, 1);
  cfg.gravityGun.useCalibration = bool(gg.use_calibration ?? gg.useCalibration, cfg.gravityGun.useCalibration);

  // migrations from config.py
  const version = int(raw.config_version ?? raw.configVersion, 1, 1, 999);
  if (version < 2) {
    const upgrades: Record<string, [number, number]> = {
      outputRateHz: [1500, 2000],
      maxPoints: [255, 1024],
      minPeriodMs: [60, 20]
    };
    for (const [key, [oldValue, newValue]] of Object.entries(upgrades)) {
      if ((cfg.planner as unknown as Record<string, number>)[key] === oldValue) {
        (cfg.planner as unknown as Record<string, number>)[key] = newValue;
      }
    }
  }
  if (version < 3) {
    const fresh = createDefaultConfig();
    const reset = ['accelFraction', 'maxSpeedMmS', 'jerkTimeMs', 'robustForceError', 'outputRateHz', 'cornerMode', 'minPeriodMs'] as const;
    for (const key of reset) {
      (cfg.planner as unknown as Record<string, unknown>)[key] = (fresh.planner as unknown as Record<string, unknown>)[key];
    }
    const periodMs = Number((isObject(raw.display) ? raw.display.period_ms : 0) ?? 0);
    cfg.display.refreshHz = periodMs > 0 ? 1000 / periodMs : 0;
    if (cfg.bead.diameterMm === 3.5) cfg.bead.diameterMm = 3.0;
  }
  cfg.configVersion = CONFIG_VERSION;
  return cfg;
}

export function loadConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return createDefaultConfig();
    return normalizeConfig(JSON.parse(raw) as unknown);
  } catch {
    return createDefaultConfig();
  }
}

export function saveConfig(cfg: AppConfig): void {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  } catch {
    /* storage may be unavailable (private mode); the session keeps working */
  }
}

export function clearConfig(): void {
  try {
    localStorage.removeItem(CONFIG_KEY);
  } catch {
    /* ignore */
  }
}

export async function readConfigFile(file: File): Promise<AppConfig> {
  const text = await file.text();
  return normalizeConfig(JSON.parse(text) as unknown);
}

export function downloadConfig(cfg: AppConfig): void {
  const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'umh-display-config.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
