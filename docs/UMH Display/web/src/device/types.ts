import type {
  HologramConfig,
  HologramKeyframe,
  HologramStatus,
  MotionConfig,
  MotionPoint,
  MotionStatus,
  Profile
} from './protocol.ts';

/** What both the real controller and the demo hardware implement. */
export interface DeviceLike {
  readonly label: string;
  readonly profile: Profile;
  systemFlags(): Promise<number>;
  motionStatus(): Promise<MotionStatus>;
  upload(points: MotionPoint[], keepPhase?: boolean): Promise<void>;
  configure(config: MotionConfig): Promise<void>;
  target(point: MotionPoint): Promise<void>;
  rate(target: number, rampMs: number): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  clear(): Promise<void>;
  /* Hologram keyframe executor (capability bit11). */
  readonly hasHologram: boolean;
  holoUpload(frames: HologramKeyframe[], firstIndex?: number): Promise<void>;
  holoConfigure(config: HologramConfig): Promise<void>;
  holoStart(): Promise<void>;
  holoStop(): Promise<void>;
  holoStatus(): Promise<HologramStatus>;
  close(): Promise<void>;
}
