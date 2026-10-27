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
export const MSG_MOTION_UPLOAD = 0x62;
export const MSG_MOTION_CONFIG = 0x63;
export const MSG_MOTION_START = 0x64;
export const MSG_MOTION_TARGET = 0x65;
export const MSG_MOTION_STOP = 0x66;
export const MSG_MOTION_STATUS = 0x67;
export const MSG_MOTION_RATE = 0x68;
export const MSG_HOLOGRAM_UPLOAD = 0xa0;
export const MSG_HOLOGRAM_CONFIG = 0xa1;
export const MSG_HOLOGRAM_START = 0xa2;
export const MSG_HOLOGRAM_STOP = 0xa3;
export const MSG_HOLOGRAM_STATUS = 0xa5;
export const MSG_ACK = 0x70;
export const MSG_NACK = 0x71;

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

/**
 * ``DeviceProfile.capability_flags`` (device_profile.h).  Everything the UI
 * gates on is read from here so an older controller still works.
 */
export const CAP_CHANNEL_STATE = 1 << 0;
export const CAP_SPATIAL_POINT = 1 << 1;
export const CAP_RGB = 1 << 2;
export const CAP_LOOP_RAM = 1 << 5;
export const CAP_LOOP_STREAM = 1 << 6;
export const CAP_GEOMETRY_VALID = 1 << 7;
export const CAP_FOCUSED_AM = 1 << 8;
export const CAP_MOTION = 1 << 9;
export const CAP_FOCUSED_AM_MULTI = 1 << 10;
export const CAP_HOLOGRAM = 1 << 11;
export const CAP_MOTION_DISPLAY = 1 << 12;
export const CAP_MOTION_LONG_PATH = 1 << 13;

/** ``GET_STATUS`` flags (umh_system_flag_t).  bit7..9 are reserved and always 0. */
export const SYS_CONNECTED = 1 << 0;
export const SYS_PLAYING = 1 << 1;
export const SYS_FPGA_READY = 1 << 2;
export const SYS_FLASH_READY = 1 << 3;
export const SYS_CAL_VALID = 1 << 4;
export const SYS_UNDERRUN = 1 << 5;
export const SYS_ERROR = 1 << 6;
export const SYS_TRIGGER = 1 << 10;
export const SYS_RECORDING = 1 << 11;
export const SYS_USB_AUDIO = 1 << 12;
/** Alias kept for call sites written before bit1 was fixed to mean PLAYING. */
export const SYS_LEVITATION = SYS_PLAYING;

export const MODE_PATH = 0;
export const MODE_LIVE = 1;

export const FLAG_PAUSED = 1 << 0;
export const FLAG_DIRECT = 1 << 1;
export const FLAG_RGB = 1 << 2;
export const FLAG_LOOP = 1 << 3;
export const FLAG_LINEAR = 1 << 4;
export const FLAG_TRAP_PATTERN = 1 << 5;
export const FLAG_STEP = 1 << 6;
export const FLAG_ULM = 1 << 7;

/**
 * ``MOTION_CONFIG.trap_mode``: the six patterns ``motion_rebuild_pattern``
 * synthesises.  6 and above are rejected with -4, so the old Python
 * "continuous vortex beam" cannot be sent to this firmware.
 */
export const TRAP_SINGLE = 0;
export const TRAP_TWIN_Z = 1;
export const TRAP_TWIN_Y = 2;
export const TRAP_RING = 3;
export const TRAP_VORTEX = 4;
export const TRAP_DUAL_RING = 5;
export const TRAP_MODE_MAX = 5;
export const TRAP_MODE_NAMES = ['单焦点', '轴向双焦', '横向双焦', '环形', '涡旋', '双环'] as const;

/** ``ulm_axis``: spatial axis plus the unidirectional sawtooth selector. */
export const ULM_AXIS_X = 1;
export const ULM_AXIS_Y = 2;
export const ULM_AXIS_RING = 3;
export const ULM_SAWTOOTH = 0x80;

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
/** ``UMH_MOTION_MAX_RATE_HZ``; the request frame rate the tracker services. */
export const MAX_RATE_HZ = 4000;
export const MIN_LOOP_MS = 2;
export const MAX_LOOP_MS = 60000;

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
  ulmFrequencyHz?: number;
  ulmAmplitudeUm?: number;
  ulmWaveSpeedMmS?: number;
  ulmAxis?: number;
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
  ulmFrequencyHz: number;
  ulmAmplitudeUm: number;
  ulmWaveSpeedMmS: number;
  ulmAxis: number;
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
    this.trapMode = init.trapMode ?? TRAP_VORTEX;
    this.trapRadiusUm = init.trapRadiusUm ?? 0;
    this.trapPhaseSpan = init.trapPhaseSpan ?? 0;
    this.palette = init.palette ?? [[255, 255, 255]];
    this.paletteSpinX10 = init.paletteSpinX10 ?? 0;
    this.pathSpinMradS = init.pathSpinMradS ?? 0;
    this.ulmFrequencyHz = init.ulmFrequencyHz ?? 0;
    this.ulmAmplitudeUm = init.ulmAmplitudeUm ?? 0;
    this.ulmWaveSpeedMmS = init.ulmWaveSpeedMmS ?? 0;
    this.ulmAxis = init.ulmAxis ?? 0;
    this.displayFlags = init.displayFlags ?? DISPLAY_SMOOTH_PALETTE | DISPLAY_POINT_BRIGHTNESS;
    this.rateInitial = init.rateInitial ?? 1;
    this.rateTarget = init.rateTarget ?? 1;
    this.rateRampMs = init.rateRampMs ?? 0;
  }

  pack(): Uint8Array {
    if (this.outputRateHz < MIN_RATE_HZ || this.outputRateHz > MAX_RATE_HZ) {
      throw new Error(`output rate ${this.outputRateHz} Hz out of range`);
    }
    if (this.loopMs < 1 || this.loopMs > MAX_LOOP_MS) throw new Error(`loop_ms ${this.loopMs} out of range`);
    if (this.trapMode < 0 || this.trapMode > TRAP_MODE_MAX) {
      throw new Error(`trap mode ${this.trapMode} is not one of the firmware patterns`);
    }
    if (this.palette.length < 1 || this.palette.length > PALETTE_SIZE) throw new Error('palette needs 1..16 colours');
    if (this.ulmFrequencyHz < 0 || this.ulmFrequencyHz > 1000) throw new Error(`ulm frequency ${this.ulmFrequencyHz} Hz out of range`);
    if (this.ulmWaveSpeedMmS < 0 || this.ulmWaveSpeedMmS > 10000) throw new Error('ulm wave speed out of range');
    if ((this.ulmAxis & 0x7c) !== 0) throw new Error('ulm axis bit2..6 must be zero');
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
    view.setUint16(14, clampInt(this.trapRadiusUm / 10, 0, 50000), true);
    out[16] = this.trapPhaseSpan & 0xff;
    out[17] = this.palette.length;
    this.palette.forEach(([r, g, b], i) => {
      out[18 + 3 * i] = clampInt(r, 0, 255);
      out[19 + 3 * i] = clampInt(g, 0, 255);
      out[20 + 3 * i] = clampInt(b, 0, 255);
    });
    out[66] = clampInt(this.paletteSpinX10, 0, 250);
    /* The packed wire struct puts path_spin at 67, not on an int16 boundary. */
    view.setInt16(67, clampInt(this.pathSpinMradS, -32767, 32767), true);
    view.setUint16(69, clampInt(this.ulmFrequencyHz, 0, 1000), true);
    view.setUint16(71, clampInt(this.ulmAmplitudeUm / 10, 0, 32767), true);
    view.setUint16(73, clampInt(this.ulmWaveSpeedMmS, 0, 10000), true);
    out[75] = this.ulmAxis & 0xff;
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
  hasMotion: boolean;
  hasHologram: boolean;
  hasFocusAm: boolean;
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
    hasMotion: (capabilityFlags & CAP_MOTION) !== 0,
    hasHologram: (capabilityFlags & CAP_HOLOGRAM) !== 0,
    hasFocusAm: (capabilityFlags & CAP_FOCUSED_AM) !== 0,
    maxPathPoints: capabilityFlags & CAP_MOTION_LONG_PATH ? MAX_LONG_POINTS : MAX_POINTS
  };
}

export function parseSystemFlags(body: Uint8Array): number {
  if (body.length !== 8) throw new Error(`status length ${body.length}`);
  return new DataView(body.buffer, body.byteOffset, body.byteLength).getUint32(0, true);
}

/* ---------------------------------------------------------------- hologram
 * Device-side keyframe executor (hologram_engine.h, capability bit11).
 *
 * The host hands over complete 84-channel holograms; the render task
 * interpolates between consecutive keyframes on its own frame clock, so a
 * shape morph stays continuous even when the USB link hiccups.
 */

export const HOLOGRAM_CHANNELS = 84;
/** ``UMH_HOLOGRAM_MAX_KEYFRAMES``. */
export const HOLOGRAM_MAX_KEYFRAMES = 10;
/** 11 * 168 + 12 = 1860 <= the 2048-byte payload ceiling. */
export const HOLOGRAM_MAX_PER_MESSAGE = 11;
export const HOLOGRAM_MIN_RATE_HZ = 10;
export const HOLOGRAM_MAX_RATE_HZ = 1000;
export const HOLOGRAM_MAX_TRANSITION_MS = 60000;
/** ``level`` is a linear amplitude; 128 is a 50 % duty carrier. */
export const HOLOGRAM_LEVEL_FULL = 128;
export const HOLOGRAM_KEYFRAME_BYTES = 2 * HOLOGRAM_CHANNELS;

export const HOLO_FLAG_RUNNING = 1 << 0;
export const HOLO_FLAG_HOLD_LAST = 1 << 1;
export const HOLO_FLAG_GAMMA = 1 << 2;
export const HOLO_FLAG_STATIC = 1 << 3;

export interface HologramKeyframe {
  /** 84 phase bytes, carrier phase in 1/256 turn. */
  phase: Uint8Array;
  /** 84 linear amplitudes 0..128 (128 = full spatial amplitude). */
  level: Uint8Array;
}

function assertKeyframe(frame: HologramKeyframe): void {
  if (frame.phase.length !== HOLOGRAM_CHANNELS || frame.level.length !== HOLOGRAM_CHANNELS) {
    throw new Error(`hologram keyframe needs ${HOLOGRAM_CHANNELS} channels`);
  }
}

/** ``HOLOGRAM_UPLOAD``: 12-byte header followed by whole 168-byte keyframes. */
export function hologramUploadPayload(firstIndex: number, frames: HologramKeyframe[]): Uint8Array {
  if (frames.length === 0 || frames.length > HOLOGRAM_MAX_PER_MESSAGE) {
    throw new Error(`hologram upload carries 1..${HOLOGRAM_MAX_PER_MESSAGE} keyframes`);
  }
  if (firstIndex < 0 || firstIndex + frames.length > HOLOGRAM_MAX_KEYFRAMES) {
    throw new Error(`keyframes ${firstIndex}..${firstIndex + frames.length} exceed ${HOLOGRAM_MAX_KEYFRAMES}`);
  }
  const out = new Uint8Array(12 + frames.length * HOLOGRAM_KEYFRAME_BYTES);
  const view = new DataView(out.buffer);
  out[0] = 1;
  out[1] = 0;
  view.setUint16(2, firstIndex, true);
  view.setUint16(4, frames.length, true);
  frames.forEach((frame, i) => {
    assertKeyframe(frame);
    const at = 12 + i * HOLOGRAM_KEYFRAME_BYTES;
    out.set(frame.phase, at);
    out.set(frame.level, at + HOLOGRAM_CHANNELS);
  });
  return out;
}

export interface HologramConfigInit {
  flags?: number;
  outputRateHz?: number;
  loopMs?: number;
  transitionMs?: number;
  level?: number;
  keyframes?: number;
}

/** ``HOLOGRAM_CONFIG``: 12 bytes, exactly ``umh_hologram_config_wire_t``. */
export class HologramConfig {
  version = 1;
  flags: number;
  outputRateHz: number;
  loopMs: number;
  transitionMs: number;
  level: number;
  keyframes: number;

  constructor(init: HologramConfigInit = {}) {
    this.flags = init.flags ?? HOLO_FLAG_GAMMA;
    this.outputRateHz = init.outputRateHz ?? 200;
    this.loopMs = init.loopMs ?? 0;
    this.transitionMs = init.transitionMs ?? 3000;
    this.level = init.level ?? HOLOGRAM_LEVEL_FULL;
    this.keyframes = init.keyframes ?? 1;
  }

  pack(): Uint8Array {
    if (this.outputRateHz < HOLOGRAM_MIN_RATE_HZ || this.outputRateHz > HOLOGRAM_MAX_RATE_HZ) {
      throw new Error(`hologram rate ${this.outputRateHz} Hz out of range`);
    }
    if (this.transitionMs < 0 || this.transitionMs > HOLOGRAM_MAX_TRANSITION_MS) {
      throw new Error(`hologram transition ${this.transitionMs} ms out of range`);
    }
    if (this.level < 0 || this.level > HOLOGRAM_LEVEL_FULL) throw new Error('hologram level must be 0..128');
    const count = Math.max(1, Math.min(HOLOGRAM_MAX_KEYFRAMES, Math.round(this.keyframes)));
    const out = new Uint8Array(12);
    const view = new DataView(out.buffer);
    out[0] = this.version;
    out[1] = this.flags & 0x0f;
    view.setUint16(2, Math.round(this.outputRateHz), true);
    view.setUint16(4, clampInt(this.loopMs, 0, 65535), true);
    view.setUint16(6, clampInt(this.transitionMs, 0, HOLOGRAM_MAX_TRANSITION_MS), true);
    out[8] = clampInt(this.level, 0, HOLOGRAM_LEVEL_FULL);
    out[9] = count;
    return out;
  }
}

export interface HologramStatus {
  state: number;
  flags: number;
  outputRateHz: number;
  keyframeCount: number;
  currentKeyframe: number;
  /** Progress inside the current segment, 0..1. */
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
  /** Measured submit rate; compare with ``outputRateHz``. */
  fps: number;
  stateName: string;
  running: boolean;
}

export function parseHologramStatus(body: Uint8Array): HologramStatus {
  if (body.length !== 42) throw new Error(`hologram status length ${body.length}`);
  const v = new DataView(body.buffer, body.byteOffset, body.byteLength);
  const state = body[0];
  return {
    state,
    flags: body[1],
    outputRateHz: v.getUint16(2, true),
    keyframeCount: v.getUint16(4, true),
    currentKeyframe: v.getUint16(6, true),
    alpha: v.getUint16(8, true) / 1000,
    serviceMaxUs: v.getUint16(10, true),
    serviceAvgUs: v.getUint16(12, true),
    renderMaxUs: v.getUint16(14, true),
    renderAvgUs: v.getUint16(16, true),
    submitMaxUs: v.getUint16(18, true),
    submitAvgUs: v.getUint16(20, true),
    frames: v.getUint32(22, true),
    skipped: v.getUint32(26, true),
    missedDeadlines: v.getUint32(30, true),
    frameErrors: v.getUint32(34, true),
    fps: v.getUint32(38, true) / 100,
    stateName: STATE_NAMES[state] ?? String(state),
    running: state === 2 || state === 3
  };
}
