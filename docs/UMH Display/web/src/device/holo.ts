/**
 * Host side of the 0xA0 hologram path: arbitrary 84-channel phase on the device.
 * Port of ``umh_display/device/holo.py``.
 */
import { pyRound } from '../core/math.ts';
import {
  EEPROM_CAL_LEVEL_OFFSET,
  MSG_EEPROM_READ,
  HOLOGRAM_FLAG_HOLD_LAST,
  HOLOGRAM_FLAG_STATIC,
  HOLOGRAM_FULL_LEVEL,
  HologramConfig,
  type HologramStatus
} from './protocol.ts';
import type { DeviceLike } from './types.ts';

const EEPROM_PHASE_OFFSET = 12;
const EEPROM_CHANNELS = 84;

export interface ComplexDrive {
  re: Float64Array;
  im: Float64Array;
}

export class HologramDevice {
  readonly channels: number;
  calPhase: Float64Array;
  calGain: Float64Array;
  calValid = false;
  elementXy: Float64Array;
  soundSpeed = 343;
  carrierHz = 40000;
  scaleQ10: number;
  lastError = '';

  private constructor(
    private readonly dev: DeviceLike,
    channels: number
  ) {
    this.channels = channels;
    this.calPhase = new Float64Array(channels);
    this.calGain = new Float64Array(channels).fill(255);
    this.elementXy = new Float64Array(channels * 2);
    this.scaleQ10 = 1024 / (this.soundSpeed / this.carrierHz);
  }

  static open(device: DeviceLike): HologramDevice {
    const channels = Math.min(EEPROM_CHANNELS, device.profile.channelCount || EEPROM_CHANNELS);
    const holo = new HologramDevice(device, channels);
    const profile = device.profile;
    profile.coordinatesUm.slice(0, channels).forEach((coord, i) => {
      holo.elementXy[i * 2] = coord[0] * 1e-6;
      holo.elementXy[i * 2 + 1] = coord[1] * 1e-6;
    });
    holo.soundSpeed = profile.soundSpeedUmS * 1e-6 || 343;
    holo.carrierHz = profile.carrierHz || 40000;
    holo.scaleQ10 = 1024 / (holo.soundSpeed / holo.carrierHz);
    return holo;
  }

  /** Read the per-channel phase corrections from the EEPROM profile record. */
  async loadCalibration(): Promise<boolean> {
    try {
      const body = await this.dev.eepromRead();
      const need = EEPROM_PHASE_OFFSET + 2 * this.channels;
      if (body.length < need) {
        this.calValid = false;
        return false;
      }
      const view = new DataView(body.buffer, body.byteOffset, body.byteLength);
      for (let i = 0; i < this.channels; i++) {
        const raw = view.getUint16(EEPROM_PHASE_OFFSET + 2 * i, true);
        this.calPhase[i] = raw >> 8;
      }
      const gainAt = EEPROM_PHASE_OFFSET + 2 * EEPROM_CHANNELS;
      if (body.length >= gainAt + this.channels) {
        for (let i = 0; i < this.channels; i++) this.calGain[i] = body[gainAt + i];
      }
      this.calValid = true;
      return true;
    } catch {
      this.calValid = false;
      return false;
    }
  }

  /** Complex per-channel drive -> 1/256-turn phase bytes. */
  phaseBytes(drive: ComplexDrive, sign = 1, withCalibration = true): Uint8Array {
    const code = new Uint8Array(drive.re.length);
    for (let i = 0; i < drive.re.length; i++) {
      const angle = Math.atan2(drive.im[i], drive.re[i]);
      let value = sign * angle * (256 / (2 * Math.PI));
      if (withCalibration && this.calValid && this.calPhase.length === drive.re.length) {
        value += this.calPhase[i];
      }
      code[i] = pyRound(value) & 0xff;
    }
    return code;
  }

  /** A keyframe for a phase-only drive: full duty, phase from the drive. */
  phaseOnlyFrame(
    drive: ComplexDrive,
    level = HOLOGRAM_FULL_LEVEL,
    sign = 1,
    withCalibration = true,
    deadLevel = 0
  ): [Uint8Array, Uint8Array] {
    const phase = this.phaseBytes(drive, sign, withCalibration);
    const levels = new Uint8Array(drive.re.length).fill(level);
    for (let i = 0; i < drive.re.length; i++) {
      if (Math.hypot(drive.re[i], drive.im[i]) < 1e-9) levels[i] = deadLevel;
    }
    return [phase, levels];
  }

  async upload(frames: Array<readonly [Uint8Array, Uint8Array]>, firstIndex = 0): Promise<void> {
    for (const [phase, level] of frames) {
      if (phase.length !== this.channels || level.length !== this.channels) {
        throw new Error(`keyframe must carry ${this.channels} channels`);
      }
    }
    await this.dev.holoUpload(frames, firstIndex);
  }

  async configure(config: HologramConfig): Promise<void> {
    await this.dev.holoConfigure(config);
  }

  async start(): Promise<void> {
    await this.dev.holoStart();
  }

  async stop(): Promise<void> {
    await this.dev.holoStop();
  }

  async status(): Promise<HologramStatus> {
    return this.dev.holoStatus();
  }

  async show(
    frame: readonly [Uint8Array, Uint8Array],
    outputRateHz = 200,
    level = HOLOGRAM_FULL_LEVEL,
    transitionMs = 100,
    start = true
  ): Promise<void> {
    await this.upload([frame], 0);
    await this.configure(
      new HologramConfig({
        flags: HOLOGRAM_FLAG_HOLD_LAST | HOLOGRAM_FLAG_STATIC,
        outputRateHz,
        transitionMs,
        level,
        keyframes: 1
      })
    );
    if (start) await this.start();
  }

  async morph(
    first: readonly [Uint8Array, Uint8Array],
    second: readonly [Uint8Array, Uint8Array],
    transitionMs: number,
    level = HOLOGRAM_FULL_LEVEL,
    outputRateHz = 200
  ): Promise<void> {
    await this.upload([first, second], 0);
    await this.configure(
      new HologramConfig({
        flags: HOLOGRAM_FLAG_HOLD_LAST,
        outputRateHz,
        transitionMs: Math.max(1, Math.round(transitionMs)),
        level,
        keyframes: 2
      })
    );
  }
}

export { MSG_EEPROM_READ, EEPROM_CAL_LEVEL_OFFSET };
