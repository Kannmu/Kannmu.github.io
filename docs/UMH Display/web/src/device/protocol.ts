/**
 * UMH v7 wire format, pure functions (no I/O).
 * Port of ``umh_display/device/protocol.py``; little-endian throughout.
 */
import { pyRound } from '../core/math.ts';

export const SYNC0 = 0x55;
export const SYNC1 = 0xaa;
export const PROTOCOL_VERSION = 7;
export const HEADER_SIZE = 16;
export const MAX_PAYLOAD = 2048;

export const MSG_GET_PROFILE = 0x01;
export const MSG_PROFILE = 0x02;
export const MSG_GET_STATUS = 0x03;
export const MSG_STATUS = 0x04;
export const MSG_STOP_PLAN = 0x22;
export const MSG_CLEAR_PLAN = 0x23;
export const MSG_FPGA_STATUS = 0x30;
export const MSG_EEPROM_READ = 0x40;
export const MSG_MOTION_UPLOAD = 0x62;
export const MSG_MOTION_CONFIG = 0x63;
export const MSG_MOTION_START = 0x64;
export const MSG_MOTION_TARGET = 0x65;
export const MSG_MOTION_STOP = 0x66;
export const MSG_MOTION_STATUS = 0x67;
export const MSG_MOTION_RATE = 0x68;
export const MSG_ACK = 0x70;
export const MSG_NACK = 0x71;
export const MSG_CAL_RESULT = 0x81;
export const MSG_CAL_START = 0x82;
export const MSG_HOLOGRAM_UPLOAD = 0xa0;
export const MSG_HOLOGRAM_CONFIG = 0xa1;
export const MSG_HOLOGRAM_START = 0xa2;
export const MSG_HOLOGRAM_STOP = 0xa3;
export const MSG_HOLOGRAM_STATUS = 0xa5;

export const FLAG_ACK_REQUIRED = 0x01;
export const FLAG_RESPONSE = 0x08;
export const FLAG_ERROR = 0x10;

export const STATUS_NAMES: Record<number, string> = {
  0: 'OK',
  1: 'BAD_HEADER',
  2: 'BAD_LENGTH',
  3: 'BAD_SEQUENCE',
  4: 'NO_MEMORY',
  5: 'UNSUPPORTED',
  6: 'INVALID_STATE',
  7: 'BUSY',
  8: 'IO',
  9: 'CRC'
};

export const CAP_MOTION = 1 << 9;
export const CAP_MOTION_DISPLAY = 1 << 12;
export const CAP_MOTION_LONG_PATH = 1 << 13;
export const CAP_HOLOGRAM = 1 << 11;

export const SYS_FPGA_READY = 1 << 2;
export const SYS_CALIBRATION_VALID = 1 << 4;
export const SYS_LEVITATION = 1 << 7;
export const SYS_VORTEX_STEADY = 1 << 8;
export const SYS_VORTEX_ALT = 1 << 9;

export const MODE_PATH = 0;
export const MODE_LIVE = 1;

export const FLAG_PAUSED = 1 << 0;
export const FLAG_DIRECT = 1 << 1;
export const FLAG_RGB = 1 << 2;
export const FLAG_LOOP = 1 << 3;
export const FLAG_LINEAR = 1 << 4;

export const TRAP_DARK_VORTEX = 6;
export const DISPLAY_SMOOTH_PALETTE = 1 << 0;
export const DISPLAY_POINT_BRIGHTNESS = 1 << 1;
export const UPLOAD_KEEP_PHASE = 1 << 0;
export const UPLOAD_CHUNKED = 1 << 1;

export const STATE_NAMES: Record<number, string> = { 0: 'OFF', 1: 'READY', 2: 'RUNNING', 3: 'STOPPING', 4: 'FAULT' };
export const MAX_POINTS = 255;
export const MAX_LONG_POINTS = 1024;
export const PALETTE_SIZE = 16;
export const RATE_UNITY = 1000;
export const MIN_RATE_HZ = 50;
export const MAX_RATE_HZ = 2000;

export interface Frame {
  messageType: number;
  flags: number;
  transactionId: number;
  streamSequence: number;
  payload: Uint8Array;
}

export function encodeFrame(
  messageType: number,
  payload: Uint8Array | ArrayLike<number> = new Uint8Array(0),
  transactionId: number,
  streamSequence = 0,
  flags = FLAG_ACK_REQUIRED
): Uint8Array {
  const body = payload instanceof Uint8Array ? payload : Uint8Array.from(payload);
  if (body.length > MAX_PAYLOAD) throw new Error(`payload ${body.length} > ${MAX_PAYLOAD}`);
  const out = new Uint8Array(HEADER_SIZE + body.length);
  const view = new DataView(out.buffer);
  out[0] = SYNC0;
  out[1] = SYNC1;
  out[2] = PROTOCOL_VERSION;
  out[3] = messageType & 0xff;
  out[4] = flags & 0xff;
  out[5] = HEADER_SIZE;
  view.setUint16(6, body.length, true);
  view.setUint32(8, transactionId >>> 0, true);
  view.setUint32(12, streamSequence >>> 0, true);
  out.set(body, HEADER_SIZE);
  return out;
}

/** Incremental frame extractor with resync on garbage. */
export class FrameParser {
  private buffer = new Uint8Array(0);

  feed(chunk: Uint8Array): void {
    if (chunk.length === 0) return;
    const merged = new Uint8Array(this.buffer.length + chunk.length);
    merged.set(this.buffer, 0);
    merged.set(chunk, this.buffer.length);
    this.buffer = merged;
  }

  next(): Frame | null {
    while (this.buffer.length >= HEADER_SIZE) {
      if (this.buffer[0] !== SYNC0 || this.buffer[1] !== SYNC1 || this.buffer[5] !== HEADER_SIZE) {
        this.buffer = this.buffer.subarray(1);
        continue;
      }
      const view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
      const length = view.getUint16(6, true);
      if (length > MAX_PAYLOAD) {
        this.buffer = this.buffer.subarray(1);
        continue;
      }
      if (this.buffer.length < HEADER_SIZE + length) return null;
      const frame: Frame = {
        messageType: this.buffer[3],
        flags: this.buffer[4],
        transactionId: view.getUint32(8, true),
        streamSequence: view.getUint32(12, true),
        payload: this.buffer.slice(HEADER_SIZE, HEADER_SIZE + length)
      };
      this.buffer = this.buffer.subarray(HEADER_SIZE + length);
      return frame;
    }
    return null;
  }

  reset(): void {
    this.buffer = new Uint8Array(0);
  }
}

function clampInt(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, pyRound(value)));
}

export class MotionPoint {
  constructor(
    public xUm: number,
    public yUm: number,
    public zUm: number,
    public level = 255,
    public palette = 0
  ) {}

  pack(): Uint8Array {
    const out = new Uint8Array(8);
    const view = new DataView(out.buffer);
    view.setInt16(0, clampInt(this.xUm / 10, -32767, 32767), true);
    view.setInt16(2, clampInt(this.yUm / 10, -32767, 32767), true);
    view.setInt16(4, clampInt(this.zUm / 10, -32767, 32767), true);
    out[6] = clampInt(this.level, 0, 255);
    out[7] = clampInt(this.palette, 0, 255);
    return out;
  }
}

export function uploadPayload(points: MotionPoint[], keepPhase = false): Uint8Array {
  if (points.length > MAX_POINTS) throw new Error(`${points.length} points > ${MAX_POINTS}`);
  const out = new Uint8Array(8 + points.length * 8);
  const view = new DataView(out.buffer);
  out[0] = 1;
  out[1] = keepPhase ? UPLOAD_KEEP_PHASE : 0;
  view.setUint16(2, points.length, true);
  points.forEach((p, i) => out.set(p.pack(), 8 + i * 8));
  return out;
}

export function uploadChunks(points: MotionPoint[], keepPhase = false): Uint8Array[] {
  const n = points.length;
  if (n > MAX_LONG_POINTS) throw new Error(`${n} points > ${MAX_LONG_POINTS}`);
  const flags = UPLOAD_CHUNKED | (keepPhase ? UPLOAD_KEEP_PHASE : 0);
  const chunks: Uint8Array[] = [];
  for (let first = 0; first < Math.max(n, 1); first += MAX_POINTS) {
    const part = points.slice(first, first + MAX_POINTS);
    const out = new Uint8Array(8 + part.length * 8);
    const view = new DataView(out.buffer);
    out[0] = 1;
    out[1] = flags;
    view.setUint16(2, part.length, true);
    view.setUint16(4, first, true);
    view.setUint16(6, n, true);
    part.forEach((p, i) => out.set(p.pack(), 8 + i * 8));
    chunks.push(out);
  }
  return chunks;
}

export function targetPayload(point: MotionPoint): Uint8Array {
  return point.pack();
}

export function ratePayload(target: number, rampMs: number): Uint8Array {
  const out = new Uint8Array(4);
  const view = new DataView(out.buffer);
  view.setUint16(0, clampInt(target * RATE_UNITY, 0, RATE_UNITY), true);
  view.setUint16(2, clampInt(rampMs, 0, 65535), true);
  return out;
}

export type RGBTuple = readonly [number, number, number];

export interface MotionConfigInit {
  mode?: number;
  flags?: number;
  outputRateHz?: number;
  loopMs?: number;
  maxSpeedMmS?: number;
  maxAccelMmS2?: number;
  zOffsetUm?: number;
  level?: number;
  trapMode?: number;
  trapRadiusUm?: number;
  trapPhaseSpan?: number;
  palette?: RGBTuple[];
  paletteSpinX10?: number;
  pathSpinMradS?: number;
  displayFlags?: number;
  rateInitial?: number;
  rateTarget?: number;
  rateRampMs?: number;
}

export class MotionConfig {
  mode: number;
  flags: number;
  outputRateHz: number;
  loopMs: number;
  maxSpeedMmS: number;
  maxAccelMmS2: number;
  zOffsetUm: number;
  level: number;
  trapMode: number;
  trapRadiusUm: number;
  trapPhaseSpan: number;
  palette: RGBTuple[];
  paletteSpinX10: number;
  pathSpinMradS: number;
  displayFlags: number;
  rateInitial: number;
  rateTarget: number;
  rateRampMs: number;

  constructor(init: MotionConfigInit = {}) {
    this.mode = init.mode ?? MODE_LIVE;
    this.flags = init.flags ?? 0;
    this.outputRateHz = init.outputRateHz ?? 1000;
    this.loopMs = init.loopMs ?? 1000;
    this.maxSpeedMmS = init.maxSpeedMmS ?? 60;
    this.maxAccelMmS2 = init.maxAccelMmS2 ?? 600;
    this.zOffsetUm = init.zOffsetUm ?? 0;
    this.level = init.level ?? 111;
    this.trapMode = init.trapMode ?? TRAP_DARK_VORTEX;
    this.trapRadiusUm = init.trapRadiusUm ?? 0;
    this.trapPhaseSpan = init.trapPhaseSpan ?? 0;
    this.palette = init.palette ?? [[255, 255, 255]];
    this.paletteSpinX10 = init.paletteSpinX10 ?? 0;
    this.pathSpinMradS = init.pathSpinMradS ?? 0;
    this.displayFlags = init.displayFlags ?? DISPLAY_SMOOTH_PALETTE | DISPLAY_POINT_BRIGHTNESS;
    this.rateInitial = init.rateInitial ?? 1;
    this.rateTarget = init.rateTarget ?? 1;
    this.rateRampMs = init.rateRampMs ?? 0;
  }

  pack(): Uint8Array {
    if (this.outputRateHz < MIN_RATE_HZ || this.outputRateHz > MAX_RATE_HZ) {
      throw new Error(`output rate ${this.outputRateHz} Hz out of range`);
    }
    if (this.loopMs < 1 || this.loopMs > 60000) throw new Error(`loop_ms ${this.loopMs} out of range`);
    if (this.palette.length < 1 || this.palette.length > PALETTE_SIZE) throw new Error('palette needs 1..16 colours');
    const out = new Uint8Array(84);
    const view = new DataView(out.buffer);
    out[0] = this.mode;
    out[1] = this.flags & 0xff;
    view.setUint16(2, this.outputRateHz, true);
    view.setUint16(4, this.loopMs, true);
    view.setUint16(6, clampInt(this.maxSpeedMmS, 0, 10000), true);
    view.setUint16(8, clampInt(this.maxAccelMmS2, 0, 65535), true);
    view.setInt16(10, clampInt(this.zOffsetUm / 10, -32767, 32767), true);
    out[12] = clampInt(this.level, 0, 255);
    out[13] = this.trapMode;
    view.setUint16(14, clampInt(this.trapRadiusUm / 10, 0, 5000), true);
    out[16] = this.trapPhaseSpan & 0xff;
    out[17] = this.palette.length;
    this.palette.forEach(([r, g, b], i) => {
      out[18 + 3 * i] = clampInt(r, 0, 255);
      out[19 + 3 * i] = clampInt(g, 0, 255);
      out[20 + 3 * i] = clampInt(b, 0, 255);
    });
    out[66] = clampInt(this.paletteSpinX10, 0, 250);
    view.setInt16(67, clampInt(this.pathSpinMradS, -32767, 32767), true);
    out[76] = this.displayFlags & 0xff;
    view.setUint16(78, clampInt(this.rateInitial * RATE_UNITY, 0, RATE_UNITY), true);
    view.setUint16(80, clampInt(this.rateTarget * RATE_UNITY, 0, RATE_UNITY), true);
    view.setUint16(82, clampInt(this.rateRampMs, 0, 65535), true);
    return out;
  }
}

export interface MotionStatus {
  state: number;
  flags: number;
  outputRateHz: number;
  pathPoints: number;
  loopMs: number;
  xUm: number;
  yUm: number;
  zUm: number;
  level: number;
  trapMode: number;
  phase: number;
  serviceMaxUs: number;
  serviceAvgUs: number;
  renderMaxUs: number;
  renderAvgUs: number;
  submitMaxUs: number;
  submitAvgUs: number;
  frames: number;
  missedDeadlines: number;
  frameErrors: number;
  fps: number;
  stateName: string;
  running: boolean;
}

export function parseMotionStatus(body: Uint8Array): MotionStatus {
  if (body.length !== 52) throw new Error(`motion status length ${body.length}`);
  const v = new DataView(body.buffer, body.byteOffset, body.byteLength);
  const state = body[0];
  return {
    state,
    flags: body[1],
    outputRateHz: v.getUint16(2, true),
    pathPoints: v.getUint16(4, true),
    loopMs: v.getUint16(6, true),
    xUm: v.getInt32(8, true),
    yUm: v.getInt32(12, true),
    zUm: v.getInt32(16, true),
    level: body[20],
    trapMode: body[21],
    phase: v.getUint16(22, true) / 65536,
    serviceMaxUs: v.getUint16(24, true),
    serviceAvgUs: v.getUint16(26, true),
    renderMaxUs: v.getUint16(28, true),
    renderAvgUs: v.getUint16(30, true),
    submitMaxUs: v.getUint16(32, true),
    submitAvgUs: v.getUint16(34, true),
    frames: v.getUint32(36, true),
    missedDeadlines: v.getUint32(40, true),
    frameErrors: v.getUint32(44, true),
    fps: v.getUint32(48, true) / 100,
    stateName: STATE_NAMES[state] ?? String(state),
    running: state === 2 || state === 3
  };
}

export interface Profile {
  model: string;
  firmware: string;
  channelCount: number;
  carrierHz: number;
  soundSpeedUmS: number;
  capabilityFlags: number;
  coordinatesUm: Array<[number, number, number]>;
  hasDisplay: boolean;
  hasHologram: boolean;
  maxPathPoints: number;
}

function textAt(body: Uint8Array, start: number, end: number): string {
  const slice = body.subarray(start, end);
  const zero = slice.indexOf(0);
  const bytes = zero >= 0 ? slice.subarray(0, zero) : slice;
  return new TextDecoder('ascii').decode(bytes);
}

export function parseProfile(body: Uint8Array): Profile {
  if (body.length !== 1118) throw new Error(`profile length ${body.length}`);
  const view = new DataView(body.buffer, body.byteOffset, body.byteLength);
  const channelCount = view.getUint16(64, true);
  const carrierHz = view.getUint32(80, true);
  const soundSpeedUmS = view.getUint32(84, true);
  const capabilityFlags = view.getUint32(106, true);
  const coordinatesUm: Array<[number, number, number]> = [];
  for (let i = 0; i < channelCount; i++) {
    const at = 110 + 12 * i;
    coordinatesUm.push([view.getInt32(at, true), view.getInt32(at + 4, true), view.getInt32(at + 8, true)]);
  }
  return {
    model: textAt(body, 0, 16),
    firmware: textAt(body, 16, 32),
    channelCount,
    carrierHz,
    soundSpeedUmS,
    capabilityFlags,
    coordinatesUm,
    hasDisplay: (capabilityFlags & CAP_MOTION_DISPLAY) !== 0,
    hasHologram: (capabilityFlags & CAP_HOLOGRAM) !== 0,
    maxPathPoints: capabilityFlags & CAP_MOTION_LONG_PATH ? MAX_LONG_POINTS : MAX_POINTS
  };
}

export function parseSystemFlags(body: Uint8Array): number {
  if (body.length !== 8) throw new Error(`status length ${body.length}`);
  return new DataView(body.buffer, body.byteOffset, body.byteLength).getUint32(0, true);
}

export const EEPROM_CAL_META_VALID_OFFSET = 291;
export const EEPROM_CAL_LEVEL_OFFSET = 297;

export function parseEepromCalLevel(body: Uint8Array): number | null {
  if (body.length < EEPROM_CAL_LEVEL_OFFSET + 2 || body[EEPROM_CAL_META_VALID_OFFSET] === 0) return null;
  const level = new DataView(body.buffer, body.byteOffset, body.byteLength).getUint16(EEPROM_CAL_LEVEL_OFFSET, true);
  return level || null;
}

// ----------------------------------------------------------------- hologram
export const HOLOGRAM_MAX_KEYFRAMES = 10;
export const HOLOGRAM_UPLOAD_MAX_PER_MSG = 11;
export const HOLOGRAM_FULL_LEVEL = 128;
export const HOLOGRAM_MIN_RATE_HZ = 10;
export const HOLOGRAM_MAX_RATE_HZ = 500;
export const HOLOGRAM_FLAG_RUNNING = 1 << 0;
export const HOLOGRAM_FLAG_HOLD_LAST = 1 << 1;
export const HOLOGRAM_FLAG_GAMMA = 1 << 2;
export const HOLOGRAM_FLAG_STATIC = 1 << 3;
export const HOLOGRAM_STATE_NAMES: Record<number, string> = { 0: 'OFF', 1: 'READY', 2: 'RUNNING', 3: 'STOPPING', 4: 'FAULT' };

export interface HologramConfigInit {
  flags?: number;
  outputRateHz?: number;
  loopMs?: number;
  transitionMs?: number;
  level?: number;
  keyframes?: number;
}

export class HologramConfig {
  flags: number;
  outputRateHz: number;
  loopMs: number;
  transitionMs: number;
  level: number;
  keyframes: number;

  constructor(init: HologramConfigInit = {}) {
    this.flags = init.flags ?? HOLOGRAM_FLAG_HOLD_LAST;
    this.outputRateHz = init.outputRateHz ?? 200;
    this.loopMs = init.loopMs ?? 0;
    this.transitionMs = init.transitionMs ?? 100;
    this.level = init.level ?? HOLOGRAM_FULL_LEVEL;
    this.keyframes = init.keyframes ?? 1;
  }

  pack(): Uint8Array {
    if (this.outputRateHz < HOLOGRAM_MIN_RATE_HZ || this.outputRateHz > HOLOGRAM_MAX_RATE_HZ) {
      throw new Error(`hologram rate ${this.outputRateHz} Hz out of range`);
    }
    if (this.level < 0 || this.level > HOLOGRAM_FULL_LEVEL) throw new Error(`hologram level ${this.level} out of range`);
    if (this.keyframes < 1 || this.keyframes > HOLOGRAM_MAX_KEYFRAMES) throw new Error(`hologram keyframes ${this.keyframes} out of range`);
    const out = new Uint8Array(12);
    const view = new DataView(out.buffer);
    out[0] = 1;
    out[1] = this.flags & 0x0f;
    view.setUint16(2, this.outputRateHz, true);
    view.setUint16(4, Math.max(0, Math.min(60000, this.loopMs)), true);
    view.setUint16(6, Math.max(0, Math.min(60000, this.transitionMs)), true);
    out[8] = this.level;
    out[9] = this.keyframes;
    return out;
  }
}

export function hologramPayload(frames: Array<readonly [Uint8Array, Uint8Array]>, firstIndex = 0): Uint8Array {
  const n = frames.length;
  if (n < 1 || n > HOLOGRAM_UPLOAD_MAX_PER_MSG) throw new Error(`${n} keyframes in one message`);
  if (firstIndex < 0 || firstIndex + n > HOLOGRAM_MAX_KEYFRAMES) {
    throw new Error(`keyframes ${firstIndex}..${firstIndex + n} out of range`);
  }
  const out = new Uint8Array(12 + n * 168);
  const view = new DataView(out.buffer);
  out[0] = 1;
  out[1] = 0;
  view.setUint16(2, firstIndex, true);
  view.setUint16(4, n, true);
  let at = 12;
  for (const [phase, level] of frames) {
    out.set(phase, at);
    out.set(level, at + 84);
    at += 168;
  }
  return out;
}

export interface HologramStatus {
  state: number;
  flags: number;
  outputRateHz: number;
  keyframes: number;
  currentKeyframe: number;
  alpha: number;
  serviceMaxUs: number;
  serviceAvgUs: number;
  renderMaxUs: number;
  renderAvgUs: number;
  submitMaxUs: number;
  submitAvgUs: number;
  frames: number;
  skipped: number;
  missedDeadlines: number;
  frameErrors: number;
  fps: number;
  stateName: string;
  running: boolean;
}

export function parseHologramStatus(body: Uint8Array): HologramStatus {
  if (body.length !== 42) throw new Error(`hologram status length ${body.length}`);
  const v = new DataView(body.buffer, body.byteOffset, body.byteLength);
  const state = body[0];
  const get16 = (o: number) => v.getUint16(o, true);
  const get32 = (o: number) => v.getUint32(o, true);
  return {
    state,
    flags: body[1],
    outputRateHz: get16(2),
    keyframes: get16(4),
    currentKeyframe: get16(6),
    alpha: get16(8) / 1000,
    serviceMaxUs: get16(10),
    serviceAvgUs: get16(12),
    renderMaxUs: get16(14),
    renderAvgUs: get16(16),
    submitMaxUs: get16(18),
    submitAvgUs: get16(20),
    frames: get32(22),
    skipped: get32(26),
    missedDeadlines: get32(30),
    frameErrors: get32(34),
    fps: get32(38) / 100,
    stateName: HOLOGRAM_STATE_NAMES[state] ?? String(state),
    running: state === 2 || state === 3
  };
}

// ---------------------------------------------------------------- calibration
export const CHANNELS = 84;
const CAL_LEGACY_SIZE = 135;
export const CAL_RESULT_SIZE = 323;
export const CAL_STATE_NAMES: Record<number, string> = {
  0: 'IDLE',
  1: 'WAIT',
  2: 'MEASURE',
  3: 'SOLVE',
  4: 'VERIFY',
  5: 'OK',
  6: 'FAIL'
};
export const CAL_STATE_OK = 5;
export const CAL_STATE_FAIL = 6;
export const CAL_QUALITY_NAMES = [
  'coverage',
  'microphones',
  'fit',
  'consistency',
  'dead channels',
  'no reflector / geometry',
  'focus verify',
  'measurement'
];
export const CAL_DEAD = 0xff;

export interface CalResult {
  state: number;
  progress: number;
  fault: number;
  qualityFlags: number;
  goodMics: number;
  phase: Uint8Array;
  tableMm: number;
  tiltXDeg: number;
  tiltYDeg: number;
  staticRmsDeg: number;
  pairSdDeg: number;
  verifyGainDb: number;
  echoMag: number;
  saturated: number;
  correctionRmsDeg: number;
  ampP10: number;
  ampP90: number;
  pairs: number;
  covered: number;
  dead: number;
  verifyWins: number;
  verifySets: number;
  committed: boolean;
  method: number;
  amplitude: Uint8Array;
  coverage: Uint8Array;
  done: boolean;
  ok: boolean;
  stateName: string;
  phaseDeg: number[];
  deadChannels: number[];
  qualityProblems: string[];
  summary: string;
}

export function parseCalResult(body: Uint8Array): CalResult {
  if (body.length < CAL_LEGACY_SIZE) throw new Error(`CAL_RESULT payload ${body.length} < ${CAL_LEGACY_SIZE}`);
  const v = new DataView(body.buffer, body.byteOffset, body.byteLength);
  const phase = body.slice(0, 84);
  const progress = body[84];
  const goodMics = body[85];
  const fault = body[86];
  const qualityFlags = body[87];
  const state = body[88];
  const f32 = (o: number) => v.getFloat32(o, true);
  const base = {
    state,
    progress,
    fault,
    qualityFlags,
    goodMics,
    phase,
    staticRmsDeg: f32(95),
    pairSdDeg: f32(99),
    saturated: Math.trunc(f32(107)),
    tableMm: f32(111) * 1000,
    tiltXDeg: f32(115),
    tiltYDeg: f32(119),
    echoMag: f32(123),
    verifyGainDb: f32(131),
    correctionRmsDeg: 0,
    ampP10: 0,
    ampP90: 0,
    pairs: 0,
    covered: 0,
    dead: 0,
    verifyWins: 0,
    verifySets: 0,
    committed: false,
    method: 0,
    amplitude: new Uint8Array(0),
    coverage: new Uint8Array(0)
  };
  if (body.length >= CAL_RESULT_SIZE) {
    const e = CAL_LEGACY_SIZE;
    base.correctionRmsDeg = f32(e);
    base.ampP10 = f32(e + 4);
    base.ampP90 = f32(e + 8);
    base.pairs = v.getUint16(e + 12, true);
    base.covered = body[e + 14];
    base.dead = body[e + 15];
    base.verifyWins = body[e + 16];
    base.verifySets = body[e + 17];
    base.committed = body[e + 18] !== 0;
    base.method = body[e + 19];
    base.amplitude = body.slice(e + 20, e + 104);
    base.coverage = body.slice(e + 104, e + 188);
  }
  const phaseDeg = Array.from(phase, (b) => ((b > 127 ? b - 256 : b) * 360) / 256);
  const deadChannels: number[] = [];
  for (let i = 0; i < base.coverage.length; i++) if (base.coverage[i] === CAL_DEAD) deadChannels.push(i);
  const qualityProblems = CAL_QUALITY_NAMES.filter((_, bit) => ((qualityFlags >> bit) & 1) !== 0);
  const ok = state === CAL_STATE_OK && fault === 0;
  const done = progress >= 100 && (state === CAL_STATE_OK || state === CAL_STATE_FAIL);
  const result: CalResult = {
    ...base,
    done,
    ok,
    stateName: CAL_STATE_NAMES[state] ?? String(state),
    phaseDeg,
    deadChannels,
    qualityProblems,
    summary: ''
  };
  result.summary = calSummary(result);
  return result;
}

function calSummary(r: CalResult): string {
  const fmt = (x: number, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : '—');
  if (!r.ok) {
    const why = r.qualityProblems.length ? r.qualityProblems.join(', ') : `fault ${r.fault}`;
    return `Calibration FAILED (${why}); EEPROM unchanged.  table ${fmt(r.tableMm)} mm, echo ${fmt(r.echoMag)}, focus test ${r.verifyGainDb >= 0 ? '+' : ''}${fmt(r.verifyGainDb, 2)} dB`;
  }
  const large = r.phaseDeg
    .map((d, i) => [i, d] as const)
    .filter(([, d]) => Math.abs(d) >= 30)
    .map(([i, d]) => `ch${i} ${d >= 0 ? '+' : ''}${d.toFixed(0)}°`);
  return (
    `Calibration OK${r.committed ? ' and saved' : ' (not saved)'}: table ${fmt(r.tableMm)} mm, static error ${fmt(r.staticRmsDeg)}° RMS, ` +
    `applied correction ${fmt(r.correctionRmsDeg)}° RMS, noise ${fmt(r.pairSdDeg)}°/pair, ` +
    `focus test ${r.verifyGainDb >= 0 ? '+' : ''}${fmt(r.verifyGainDb, 2)} dB (${r.verifyWins}/${r.verifySets} better), ` +
    `${r.covered} channels, dead ${r.deadChannels.length ? r.deadChannels.join(',') : 'none'}` +
    (large.length ? `, large: ${large.join(', ')}` : '')
  );
}

export function guiLevitationLevel(calLevel: number | null): number {
  let duty = calLevel === null ? 32 : calLevel * 2;
  duty = Math.max(44, Math.min(68, duty));
  return Math.floor((duty * 255 + 64) / 128);
}


