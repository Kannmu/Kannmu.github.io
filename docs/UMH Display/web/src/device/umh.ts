/**
 * Typed calls for the parts of the UMH v7 protocol this project uses.
 * Port of ``umh_display/device/umh.py`` over the asynchronous Web Serial link.
 */
import {
  HOLOGRAM_MAX_PER_MESSAGE,
  MAX_POINTS,
  MSG_CLEAR_PLAN,
  MSG_ACK,
  MSG_GET_PROFILE,
  MSG_GET_STATUS,
  MSG_HOLOGRAM_CONFIG,
  MSG_HOLOGRAM_START,
  MSG_HOLOGRAM_STATUS,
  MSG_HOLOGRAM_STOP,
  MSG_HOLOGRAM_UPLOAD,
  MSG_MOTION_CONFIG,
  MSG_MOTION_RATE,
  MSG_MOTION_START,
  MSG_MOTION_STATUS,
  MSG_MOTION_STOP,
  MSG_MOTION_TARGET,
  MSG_MOTION_UPLOAD,
  MSG_PROFILE,
  MSG_STATUS,
  MotionConfig,
  MotionPoint,
  hologramUploadPayload,
  parseHologramStatus,
  parseMotionStatus,
  parseProfile,
  parseSystemFlags,
  ratePayload,
  targetPayload,
  uploadChunks,
  uploadPayload,
  type HologramConfig,
  type HologramKeyframe,
  type HologramStatus,
  type MotionStatus,
  type Profile
} from './protocol.ts';
import { SerialLink } from './link.ts';
import type { SerialPort } from './webSerial.ts';
import type { DeviceLike } from './types.ts';

export class UmhDevice implements DeviceLike {
  readonly profile: Profile;
  readonly label: string;

  private constructor(
    private readonly link: SerialLink,
    profile: Profile
  ) {
    this.profile = profile;
    this.label = link.portName;
  }

  static async open(port: SerialPort): Promise<UmhDevice> {
    const link = await SerialLink.open(port);
    try {
      const profile = parseProfile(await link.request(MSG_GET_PROFILE, new Uint8Array(0), MSG_PROFILE));
      const device = new UmhDevice(link, profile);
      return device;
    } catch (error) {
      await link.close();
      throw error;
    }
  }

  get portName(): string {
    return this.link.portName;
  }

  set onDisconnect(handler: (() => void) | null) {
    this.link.onDisconnect = handler;
  }

  async close(): Promise<void> {
    await this.link.close();
  }

  async systemFlags(): Promise<number> {
    return parseSystemFlags(await this.link.request(MSG_GET_STATUS, new Uint8Array(0), MSG_STATUS));
  }

  async motionStatus(): Promise<MotionStatus> {
    return parseMotionStatus(await this.link.request(MSG_MOTION_STATUS, new Uint8Array(0), MSG_MOTION_STATUS));
  }

  async upload(points: MotionPoint[], keepPhase = false): Promise<void> {
    if (points.length > this.profile.maxPathPoints) {
      throw new Error(`${points.length} path points, firmware ${this.profile.firmware} holds ${this.profile.maxPathPoints}`);
    }
    if (points.length <= MAX_POINTS) {
      await this.link.request(MSG_MOTION_UPLOAD, uploadPayload(points, keepPhase));
      return;
    }
    for (const chunk of uploadChunks(points, keepPhase)) {
      await this.link.request(MSG_MOTION_UPLOAD, chunk);
    }
  }

  async configure(config: MotionConfig): Promise<void> {
    await this.link.request(MSG_MOTION_CONFIG, config.pack());
  }

  async target(point: MotionPoint): Promise<void> {
    await this.link.request(MSG_MOTION_TARGET, targetPayload(point));
  }

  async rate(target: number, rampMs: number): Promise<void> {
    await this.link.request(MSG_MOTION_RATE, ratePayload(target, rampMs));
  }

  async start(): Promise<void> {
    await this.link.request(MSG_MOTION_START);
  }

  async stop(): Promise<void> {
    await this.link.request(MSG_MOTION_STOP, new Uint8Array(0), MSG_ACK, 2);
  }

  async clear(): Promise<void> {
    await this.link.request(MSG_CLEAR_PLAN, new Uint8Array(0), MSG_ACK, 2);
  }

  /* -------------------------------------------------------------- hologram */

  get hasHologram(): boolean {
    return this.profile.hasHologram;
  }

  private requireHologram(): void {
    if (!this.profile.hasHologram) {
      throw new Error(`固件 ${this.profile.firmware} 没有全息关键帧引擎（capability bit11），请先烧录新固件`);
    }
  }

  async holoUpload(frames: HologramKeyframe[], firstIndex = 0): Promise<void> {
    this.requireHologram();
    /* One UPLOAD carries at most 11 keyframes; a longer sequence goes out as
     * consecutive slots and only the CONFIG count makes them one morph. */
    for (let at = 0; at < frames.length; at += HOLOGRAM_MAX_PER_MESSAGE) {
      const part = frames.slice(at, at + HOLOGRAM_MAX_PER_MESSAGE);
      await this.link.request(MSG_HOLOGRAM_UPLOAD, hologramUploadPayload(firstIndex + at, part));
    }
  }

  async holoConfigure(config: HologramConfig): Promise<void> {
    this.requireHologram();
    await this.link.request(MSG_HOLOGRAM_CONFIG, config.pack());
  }

  async holoStart(): Promise<void> {
    this.requireHologram();
    await this.link.request(MSG_HOLOGRAM_START);
  }

  async holoStop(): Promise<void> {
    this.requireHologram();
    await this.link.request(MSG_HOLOGRAM_STOP, new Uint8Array(0), MSG_ACK, 2);
  }

  async holoStatus(): Promise<HologramStatus> {
    this.requireHologram();
    return parseHologramStatus(await this.link.request(MSG_HOLOGRAM_STATUS, new Uint8Array(0), MSG_HOLOGRAM_STATUS));
  }
}
