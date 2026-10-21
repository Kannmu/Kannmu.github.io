import type { MotionConfig, MotionPoint, MotionStatus, Profile } from './protocol.ts';

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
  close(): Promise<void>;
}
