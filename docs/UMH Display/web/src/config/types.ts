/** Configuration schema, mirroring ``umh_display/config.py``. */

export type RGB = [number, number, number];
export type FieldKind = 'focus' | 'vortex';
export type Mount = 'down' | 'side';
export type CornerMode = 'round' | 'stop';
export type Interpolation = 'catmull' | 'linear';
export type ColorScheme = 'wheel' | 'gradient' | 'solid';

export interface BeadConfig {
  diameterMm: number;
  densityKgM3: number;
}

export interface TrapConfig {
  field: FieldKind;
  level: number;
  tableDistanceMm: number;
  focusOffsetMm: number;
  mount: Mount;
  lateralAccels: Record<string, number>;
  dropLevels: Record<string, number>;
  extraDampingRatio: number;
}

export interface PlannerConfig {
  outputRateHz: number;
  accelFraction: number;
  maxSpeedMmS: number;
  drawLevel: number;
  jerkTimeMs: number;
  cornerRadiusMm: number;
  cornerMode: CornerMode;
  sampleStepMm: number;
  maxPoints: number;
  interpolation: Interpolation;
  rampMs: number;
  seekSpeedMmS: number;
  seekAccelMmS2: number;
  robustForceError: number;
  maxTrackingErrorMm: number;
  minPeriodMs: number;
}

export interface DisplayConfig {
  sizeMm: number;
  centerXMm: number;
  centerYMm: number;
  text: string;
  textHeightMm: number;
  refreshHz: number;
  colorScheme: ColorScheme;
  colorA: RGB;
  colorB: RGB;
  hueSpinRevS: number;
  brightness: number;
  gamma: number;
  evenLines: number;
  hoverBrightness: number;
}

/**
 * "No limits" playback.  The geometry is uploaded as-is and the firmware
 * follows it linearly; loopMs is the device loop and rate scales it down.
 * The effective loop is loopMs / rate (up to 16.7 h at the device limits).
 */
export interface UnlimitedConfig {
  enabled: boolean;
  /** Preallocated preview path parameters (unused by live output). */
  loopMs: number;
  rate: number;
  /** Live joystick/keyboard motion limits. */
  speedMmS: number;
  accelMmS2: number;
}

export interface AppConfig {
  port: string;
  configVersion: number;
  bead: BeadConfig;
  trap: TrapConfig;
  planner: PlannerConfig;
  display: DisplayConfig;
  unlimited: UnlimitedConfig;
}
