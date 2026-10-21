import type { CalResult, HologramConfig, HologramStatus, MotionConfig, MotionPoint, MotionStatus, Profile } from './protocol.ts';

/** What both the real controller and the demo hardware implement. */
export interface DeviceLike {
  readonly label: string;
  readonly profile: Profile;
  systemFlags(): Promise<number>;
  motionStatus(): Promise<MotionStatus>;
  eepromCalLevel(): Promise<number | null>;
  eepromRead(): Promise<Uint8Array>;
  calibrationResult(): Promise<CalResult>;
  calibrate(progress?: (result: CalResult) => void, timeoutS?: number): Promise<CalResult>;
  upload(points: MotionPoint[], keepPhase?: boolean): Promise<void>;
  configure(config: MotionConfig): Promise<void>;
  target(point: MotionPoint): Promise<void>;
  rate(target: number, rampMs: number): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  clear(): Promise<void>;
  holoUpload(frames: Array<readonly [Uint8Array, Uint8Array]>, firstIndex?: number): Promise<void>;
  holoConfigure(config: HologramConfig): Promise<void>;
  holoStart(): Promise<void>;
  holoStop(): Promise<void>;
  holoStatus(): Promise<HologramStatus>;
  close(): Promise<void>;
}
