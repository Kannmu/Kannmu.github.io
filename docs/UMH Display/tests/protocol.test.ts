import { describe, expect, it } from 'vitest';
import { fixture, hex } from './helpers.ts';
import {
  FrameParser,
  MotionConfig,
  MotionPoint,
  encodeFrame,
  parseMotionStatus,
  parseProfile,
  parseSystemFlags,
  ratePayload,
  targetPayload,
  uploadChunks,
  uploadPayload,
  MSG_MOTION_START,
  MSG_MOTION_STOP,
  FLAG_DIRECT,
  FLAG_LOOP,
  FLAG_RGB,
  MODE_PATH,
} from '../web/src/device/protocol.ts';

interface ProtocolFixture {
  frame: string;
  motion_config: string;
  upload: string;
  upload_keep: string;
  chunks: string[];
  chunk_lengths: number[];
  target: string;
  rate: string;
  motion_status: string;
  motion_status_expected: Record<string, number>;
  profile: string;
  profile_expected: {
    model: string;
    firmware: string;
    channels: number;
    carrier_hz: number;
    max_path_points: number;
    first_coord: number[];
    caps: number;
  };
}

function unhex(value: string): Uint8Array {
  return Uint8Array.from(Buffer.from(value, 'hex'));
}

describe('UMH v7 protocol', () => {
  const f = fixture<ProtocolFixture>('protocol.json');

  it('encodes frames byte-for-byte', () => {
    expect(hex(encodeFrame(MSG_MOTION_START, new Uint8Array(0), 0x12345678))).toBe(f.frame);
  });

  it('packs MOTION_CONFIG exactly like the Python v3 layout', () => {
    const cfg = new MotionConfig({
      mode: MODE_PATH,
      flags: FLAG_DIRECT | FLAG_LOOP | FLAG_RGB,
      outputRateHz: 2000,
      loopMs: 53,
      maxSpeedMmS: 40,
      maxAccelMmS2: 400,
      level: 255,
      trapMode: 0,
      palette: [
        [255, 40, 0],
        [0, 90, 255]
      ],
      paletteSpinX10: 25,
      rateInitial: 0,
      rateTarget: 1,
      rateRampMs: 600
    });
    expect(hex(cfg.pack())).toBe(f.motion_config);
  });

  it('packs uploads, chunks, targets and rates', () => {
    const points = [0, 1, 2].map(
      (i) => new MotionPoint(i * 1000, -i * 500, 102000, 255 - i, (i * 16) & 0xff)
    );
    expect(hex(uploadPayload(points))).toBe(f.upload);
    expect(hex(uploadPayload(points, true))).toBe(f.upload_keep);
    const big = Array.from({ length: 300 }, (_, i) => new MotionPoint(i * 10, i * -10, 102000, 255, i & 0xff));
    const chunks = uploadChunks(big);
    expect(chunks.map((c) => c.length)).toEqual(f.chunk_lengths);
    expect(chunks.map((c) => hex(c))).toEqual(f.chunks);
    expect(hex(targetPayload(points[1]))).toBe(f.target);
    expect(hex(ratePayload(0.42, 600))).toBe(f.rate);
  });

  it('parses motion status and the device profile', () => {
    const status = parseMotionStatus(unhex(f.motion_status));
    const want = f.motion_status_expected;
    expect(status.state).toBe(want.state);
    expect(status.outputRateHz).toBe(want.output_rate_hz);
    expect(status.xUm).toBe(want.x_um);
    expect(status.yUm).toBe(want.y_um);
    expect(status.zUm).toBe(want.z_um);
    expect(status.phase).toBeCloseTo(want.phase, 12);
    expect(status.fps).toBeCloseTo(want.fps, 9);
    expect(status.frames).toBe(want.frames);

    const profile = parseProfile(unhex(f.profile));
    expect(profile.model).toBe(f.profile_expected.model);
    expect(profile.firmware).toBe(f.profile_expected.firmware);
    expect(profile.channelCount).toBe(f.profile_expected.channels);
    expect(profile.carrierHz).toBe(f.profile_expected.carrier_hz);
    expect(profile.maxPathPoints).toBe(f.profile_expected.max_path_points);
    expect(profile.coordinatesUm[0]).toEqual(f.profile_expected.first_coord);
    expect(profile.hasDisplay).toBe(true);

  });

  it('parses small replies and GUI level helper', () => {
    const flags = new Uint8Array(8);
    new DataView(flags.buffer).setUint32(0, 0x12345678, true);
    expect(parseSystemFlags(flags)).toBe(0x12345678);
  });

  it('extracts frames from a noisy stream', () => {
    const parser = new FrameParser();
    const frame = encodeFrame(MSG_MOTION_STOP, new Uint8Array([1, 2, 3]), 7);
    parser.feed(Uint8Array.from([0, 0x55, 0x00]));
    parser.feed(frame.slice(0, 5));
    expect(parser.next()).toBeNull();
    parser.feed(frame.slice(5));
    const got = parser.next();
    expect(got).not.toBeNull();
    expect(got!.messageType).toBe(MSG_MOTION_STOP);
    expect(got!.transactionId).toBe(7);
    expect(Array.from(got!.payload)).toEqual([1, 2, 3]);
  });
});
