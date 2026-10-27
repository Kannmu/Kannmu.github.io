/** Configuration schema, mirroring ``umh_display/config.py``. */

export type RGB = [number, number, number];
/** MOTION_CONFIG.trap_mode, 0..5 as the controller firmware numbers them. */
export type FieldKind = 'focus' | 'twinz' | 'twiny' | 'ring' | 'vortex' | 'duallring';
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
  /** Pattern radius / twin separation (mm); firmware clamps to >= 0.5 mm. */
  patternRadiusMm: number;
  /** Vortex azimuthal span in carrier units (0 = one full turn). */
  phaseSpan: number;
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

/**
 * ULM tactile modulation (MOTION_CONFIG bytes 69..75, flag bit7).  The focus
 * oscillates transversally at the sensitive-skin frequency on top of the macro
 * path, which is what turns a levitation demo into a haptic one.
 */
export interface UlmConfig {
  enabled: boolean;
  frequencyHz: number;
  /** 0 lets the firmware derive it from the wave speed. */
  amplitudeUm: number;
  /** 0 keeps the firmware default of 5000 mm/s. */
  waveSpeedMmS: number;
  axis: 'x' | 'y' | 'ring';
  sawtooth: boolean;
}

/** Device-side hologram keyframe morph (HOLOGRAM_* messages, cap bit11). */
export interface HoloConfig {
  /** Shape names handed to `shapeKeyframe`; one keyframe each, in order. */
  shapes: string[];
  transitionMs: number;
  outputRateHz: number;
  /** Linear amplitude 0..128. */
  level: number;
  /** 0 lets the firmware derive the cycle from the transition time. */
  loopMs: number;
  holdLast: boolean;
  gamma: boolean;
}

export interface AppConfig {
  port: string;
  configVersion: number;
  bead: BeadConfig;
  trap: TrapConfig;
  planner: PlannerConfig;
  display: DisplayConfig;
  unlimited: UnlimitedConfig;
  ulm: UlmConfig;
  holo: HoloConfig;
}
