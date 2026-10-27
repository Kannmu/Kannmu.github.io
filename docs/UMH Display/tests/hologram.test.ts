import { describe, expect, it } from 'vitest';
import { createDefaultConfig } from '../web/src/config/defaults.ts';
import { ELEMENT_XY_MM, ELEMENT_FACE_Z_MM } from '../web/src/geometry/elements.ts';
import { focusZmmOf } from '../web/src/config/defaults.ts';
import {
  hologramFieldMap,
  interpolateKeyframes,
  shapeKeyframe,
  synthesizeHologram,
  HOLOGRAM_LEVEL_MAX
} from '../web/src/motion/hologram.ts';
import {
  HologramConfig,
  HOLOGRAM_CHANNELS,
  hologramUploadPayload,
  MotionConfig,
  parseHologramStatus
} from '../web/src/device/protocol.ts';
import { hex } from './helpers.ts';

const K = (2 * Math.PI * 40000) / 343;

function expectedPhase(xMm: number, yMm: number, zMm: number, k: number): number {
  const [ex, ey] = ELEMENT_XY_MM[k];
  const d = Math.hypot(ex - xMm, ey - yMm, ELEMENT_FACE_Z_MM - zMm) * 1e-3;
  const turn = Math.round(((-K * d * 256) / (2 * Math.PI)));
  return ((turn % 256) + 256) % 256;
}

describe('hologram synthesis', () => {
  it('turns a single target into a pure phase focus', () => {
    const target = { xMm: 4, yMm: -3, zMm: 102 };
    const { frame, quality } = synthesizeHologram([target]);
    expect(frame.phase.length).toBe(HOLOGRAM_CHANNELS);
    expect(frame.level.length).toBe(HOLOGRAM_CHANNELS);
    for (let k = 0; k < HOLOGRAM_CHANNELS; k++) {
      expect(frame.level[k]).toBe(HOLOGRAM_LEVEL_MAX);
      const want = expectedPhase(target.xMm, target.yMm, target.zMm, k);
      /* 8-bit phase quantisation makes the comparison a wrap-around one. */
      const delta = Math.abs(frame.phase[k] - want);
      expect(Math.min(delta, 256 - delta)).toBeLessThanOrEqual(1);
    }
    expect(quality.peakToMean).toBeGreaterThan(1);
    expect(quality.sidelobeDb).toBeLessThan(0);
  });

  it('tapers the amplitude where several targets disagree', () => {
    const z = 102;
    const ring = Array.from({ length: 8 }, (_, i) => {
      const a = (2 * Math.PI * i) / 8;
      return { xMm: 8 * Math.cos(a), yMm: 8 * Math.sin(a), zMm: z };
    });
    const { frame, quality } = synthesizeHologram(ring);
    let low = 0;
    for (let k = 0; k < HOLOGRAM_CHANNELS; k++) {
      expect(frame.level[k]).toBeGreaterThanOrEqual(0);
      expect(frame.level[k]).toBeLessThanOrEqual(HOLOGRAM_LEVEL_MAX);
      if (frame.level[k] < HOLOGRAM_LEVEL_MAX * 0.6) low++;
    }
    /* A ring cannot be served by every channel at full amplitude. */
    expect(low).toBeGreaterThan(0);
    expect(quality.energy).toBeGreaterThan(0);
  });

  it('builds a shape keyframe at the configured focus plane', () => {
    const cfg = createDefaultConfig();
    const { frame, quality } = shapeKeyframe(cfg, 'circle', { samples: 32 });
    expect(frame.phase.length).toBe(HOLOGRAM_CHANNELS);
    expect(quality.energy).toBeGreaterThan(0);
    const zMm = focusZmmOf(cfg);
    expect(zMm).toBe(102);
    /* Same synthesis as an explicit 32-point circular target set. */
    const outline = Array.from({ length: 32 }, (_, i) => {
      const a = (2 * Math.PI * i) / 32;
      return { xMm: 8 * Math.cos(a), yMm: 8 * Math.sin(a), zMm };
    });
    const direct = synthesizeHologram(outline);
    expect(hex(direct.frame.phase)).toBe(hex(frame.phase));
  });

  it('interpolates along the shortest 8-bit wrap path', () => {
    const a = { phase: Uint8Array.from({ length: HOLOGRAM_CHANNELS }, () => 10), level: new Uint8Array(HOLOGRAM_CHANNELS).fill(128) };
    const b = { phase: Uint8Array.from({ length: HOLOGRAM_CHANNELS }, () => 250), level: new Uint8Array(HOLOGRAM_CHANNELS).fill(0) };
    expect(hex(interpolateKeyframes(a, b, 0).phase)).toBe(hex(a.phase));
    expect(hex(interpolateKeyframes(a, b, 1).phase)).toBe(hex(b.phase));
    /* 250 - 10 = 240, which wraps to -16: half way is 2, not 130. */
    expect(interpolateKeyframes(a, b, 0.5).phase[0]).toBe(2);
    expect(interpolateKeyframes(a, b, 0.5).level[0]).toBe(64);
  });

  it('lays the preview out as a normalised field map', () => {
    const { frame } = synthesizeHologram([{ xMm: 0, yMm: 0, zMm: 102 }]);
    const map = hologramFieldMap(frame, { heightMm: 0, extentMm: 60, grid: 32, tableDistanceMm: 95 });
    expect(map.width).toBe(32);
    expect(map.height).toBe(32);
    expect(map.values.length).toBe(32 * 32);
    let peak = 0;
    let min = 1;
    for (const v of map.values) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
      peak = Math.max(peak, v);
      min = Math.min(min, v);
    }
    expect(peak).toBe(1);
    expect(min).toBe(0);
    /* The axis carries the focus, the corners are the quiet background. */
    const centre = map.values[Math.floor(map.height / 2) * map.width + Math.floor(map.width / 2)];
    expect(centre).toBeGreaterThan(map.values[0]);
  });
});

describe('hologram wire format', () => {
  const frame = {
    phase: Uint8Array.from({ length: HOLOGRAM_CHANNELS }, (_, i) => i * 3),
    level: new Uint8Array(HOLOGRAM_CHANNELS).fill(128)
  };

  it('packs a 12-byte upload header', () => {
    const payload = hologramUploadPayload(2, [frame, frame]);
    expect(payload.length).toBe(12 + 2 * 168);
    expect(payload[0]).toBe(1);
    expect(payload[1]).toBe(0);
    expect(payload[2] | (payload[3] << 8)).toBe(2);
    expect(payload[4] | (payload[5] << 8)).toBe(2);
    expect(payload[12]).toBe(frame.phase[0]);
    expect(payload[12 + HOLOGRAM_CHANNELS]).toBe(128);
    expect(payload[12 + 168]).toBe(frame.phase[0]);
  });

  it('rejects keyframes the firmware would refuse', () => {
    expect(() => hologramUploadPayload(9, [frame, frame])).toThrow();
    expect(() => hologramUploadPayload(0, [])).toThrow();
    expect(() => hologramUploadPayload(0, Array.from({ length: 12 }, () => frame))).toThrow();
    const short = { phase: new Uint8Array(80), level: new Uint8Array(80) };
    expect(() => hologramUploadPayload(0, [short])).toThrow();
  });

  it('packs the 12-byte config and clamps the panel values', () => {
    const config = new HologramConfig({ outputRateHz: 200, transitionMs: 1200, level: 128, keyframes: 3 });
    const bytes = config.pack();
    expect(bytes.length).toBe(12);
    expect(bytes[0]).toBe(1);
    expect(bytes[1]).toBe(4);
    expect(bytes[2] | (bytes[3] << 8)).toBe(200);
    expect(bytes[6] | (bytes[7] << 8)).toBe(1200);
    expect(bytes[8]).toBe(128);
    expect(bytes[9]).toBe(3);
    expect(() => new HologramConfig({ outputRateHz: 5000 }).pack()).toThrow();
    expect(() => new HologramConfig({ level: 200 }).pack()).toThrow();
    expect(() => new HologramConfig({ transitionMs: 70000 }).pack()).toThrow();
  });

  it('parses the 42-byte status frame', () => {
    const body = new Uint8Array(42);
    const view = new DataView(body.buffer);
    body[0] = 2;
    body[1] = 1;
    view.setUint16(2, 200, true);
    view.setUint16(4, 4, true);
    view.setUint16(6, 1, true);
    view.setUint16(8, 750, true);
    view.setUint16(10, 90, true);
    view.setUint16(12, 45, true);
    view.setUint16(14, 12, true);
    view.setUint16(16, 6, true);
    view.setUint16(18, 21, true);
    view.setUint16(20, 10, true);
    view.setUint32(22, 1234, true);
    view.setUint32(26, 56, true);
    view.setUint32(30, 7, true);
    view.setUint32(34, 8, true);
    view.setUint32(38, 19950, true);
    const status = parseHologramStatus(body);
    expect(status.stateName).toBe('RUNNING');
    expect(status.running).toBe(true);
    expect(status.alpha).toBeCloseTo(0.75, 6);
    expect(status.currentKeyframe).toBe(1);
    expect(status.frames).toBe(1234);
    expect(status.skipped).toBe(56);
    expect(status.missedDeadlines).toBe(7);
    expect(status.fps).toBeCloseTo(199.5, 6);
    expect(() => parseHologramStatus(body.subarray(0, 41))).toThrow();
  });
});

describe('motion config wire format', () => {
  it('carries the ULM extension the firmware reads at bytes 69..75', () => {
    const bytes = new MotionConfig({
      outputRateHz: 4000,
      trapMode: 4,
      trapRadiusUm: 6000,
      trapPhaseSpan: 0,
      ulmFrequencyHz: 120,
      ulmAmplitudeUm: 800,
      ulmWaveSpeedMmS: 3000,
      ulmAxis: 3 | 0x80
    }).pack();
    expect(bytes.length).toBe(84);
    const view = new DataView(bytes.buffer);
    expect(view.getUint16(2, true)).toBe(4000);
    expect(view.getUint16(14, true)).toBe(600);
    expect(view.getUint16(69, true)).toBe(120);
    expect(view.getUint16(71, true)).toBe(80);
    expect(view.getUint16(73, true)).toBe(3000);
    expect(bytes[75]).toBe(0x83);
    expect(bytes[76]).toBe(3);
  });

  it('refuses trap modes the firmware rejects', () => {
    expect(() => new MotionConfig({ trapMode: 6 }).pack()).toThrow();
    expect(() => new MotionConfig({ outputRateHz: 4001 }).pack()).toThrow();
    expect(() => new MotionConfig({ ulmFrequencyHz: 1200 }).pack()).toThrow();
    expect(() => new MotionConfig({ ulmAxis: 0x04 }).pack()).toThrow();
  });
});
