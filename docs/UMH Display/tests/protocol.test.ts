import { describe, expect, it } from 'vitest';
import { fixture, hex } from './helpers.ts';
import {
  FrameParser,
  MotionConfig,
  MotionPoint,
  encodeFrame,
  parseCalResult,
  parseEepromCalLevel,
  parseHologramStatus,
  parseMotionStatus,
  parseProfile,
  parseSystemFlags,
  HologramConfig,
  hologramPayload,
  ratePayload,
  targetPayload,
  uploadChunks,
  uploadPayload,
  guiLevitationLevel,
  MSG_MOTION_START,
  MSG_MOTION_STOP,
  FLAG_DIRECT,
  FLAG_LOOP,
  FLAG_RGB,
  MODE_PATH,
  HOLOGRAM_FLAG_HOLD_LAST
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
  hologram_config: string;
  hologram_payload: string;
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
  cal: string;
  cal_expected: Record<string, number | boolean>;
  gui_level_none: number;
  gui_level_47: number;
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

  it('packs hologram messages', () => {
    const cfg = new HologramConfig({
      flags: HOLOGRAM_FLAG_HOLD_LAST,
      outputRateHz: 200,
      transitionMs: 50,
      level: 128,
      keyframes: 2
    });
    expect(hex(cfg.pack())).toBe(f.hologram_config);
    const phase = Uint8Array.from({ length: 84 }, (_, i) => i);
    const level = new Uint8Array(84).fill(128);
    expect(hex(hologramPayload([[phase, level]], 0))).toBe(f.hologram_payload);
  });

  it('parses motion status, profile and calibration results', () => {
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
    expect(profile.hasHologram).toBe(true);

    const cal = parseCalResult(unhex(f.cal));
    const cw = f.cal_expected;
    expect(cal.state).toBe(cw.state);
    expect(cal.progress).toBe(cw.progress);
    expect(cal.tableMm).toBeCloseTo(cw.table_mm as number, 4);
    expect(cal.pairs).toBe(cw.pairs);
    expect(cal.covered).toBe(cw.covered);
    expect(cal.committed).toBe(cw.committed);
    expect(cal.method).toBe(cw.method);
    expect(cal.ok).toBe(true);
    expect(cal.done).toBe(true);
    expect(cal.amplitude.length).toBe(84);
    expect(cal.summary).toContain('Calibration OK');
  });

  it('parses small replies and GUI level helper', () => {
    const flags = new Uint8Array(8);
    new DataView(flags.buffer).setUint32(0, 0x12345678, true);
    expect(parseSystemFlags(flags)).toBe(0x12345678);
    const eeprom = new Uint8Array(320);
    expect(parseEepromCalLevel(eeprom)).toBeNull();
    eeprom[291] = 1;
    new DataView(eeprom.buffer).setUint16(297, 47, true);
    expect(parseEepromCalLevel(eeprom)).toBe(47);
    expect(guiLevitationLevel(null)).toBe(f.gui_level_none);
    expect(guiLevitationLevel(47)).toBe(f.gui_level_47);
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

describe('hologram status', () => {
  it('parses the 42-byte wire record', () => {
    const body = new Uint8Array(42);
    const view = new DataView(body.buffer);
    body[0] = 2;
    body[1] = 1;
    view.setUint16(2, 200, true);
    view.setUint16(4, 2, true);
    view.setUint16(6, 1, true);
    view.setUint16(8, 500, true);
    view.setUint32(22, 1000, true);
    view.setUint32(38, 12345, true);
    const status = parseHologramStatus(body);
    expect(status.stateName).toBe('RUNNING');
    expect(status.alpha).toBe(0.5);
    expect(status.fps).toBe(123.45);
    expect(status.running).toBe(true);
  });
});
