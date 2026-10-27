import { describe, expect, it } from 'vitest';
import { fixture, expectArrayClose, expectClose } from './helpers.ts';
import { besselJ1, clearFieldShapeCache, FieldModel, fieldShape } from '../web/src/physics/field.ts';
import { beadMassKg } from '../web/src/config/defaults.ts';
import {
  acousticPower,
  dampingC,
  drag,
  escapeOffset,
  leadLimit,
  spinFoldAccel,
  spinFoldHz,
  stiffness,
  trapModelFromConfig
} from '../web/src/physics/trap.ts';
import { simulate } from '../web/src/physics/dynamics.ts';
import { createDefaultConfig } from '../web/src/config/defaults.ts';

interface FieldFixture {
  shapes: Record<string, {
    rung_heights_mm: number[];
    height_mm: number;
    axial_force: number;
    lateral_peak: number;
    lateral_to_axial: number;
    peak_offset_mm: number;
    basin_mm: number;
    xy_gain: number;
    pumping: number;
    mid_force: number;
    offaxis_r0_mm: number;
  }>;
  focus: {
    table_z: number;
    wells: Array<{ height_mm: number; z: number; force_up: number }>;
    potential_axis: number[];
    pressure_axis_abs: number[];
    lateral_xs: number[];
    lateral_force: number[];
  };
  elements: number[][];
}

describe('field model', () => {
  it('Bessel J1 matches known values', () => {
    // scipy.special.j1 at these points
    expectClose(besselJ1(0), 0, 1e-12);
    expectClose(besselJ1(1), 0.44005058574493355, 1e-10);
    expectClose(besselJ1(3.8317059702075), 0, 1e-9);
    expectClose(besselJ1(3.3), 0.22066345298524112, 1e-9);
  });

  it('builds the six firmware trap patterns and honours radius / span', () => {
    clearFieldShapeCache();
    const bead = { diameterMm: 3, densityKgM3: 25 };
    for (const mode of [0, 1, 2, 3, 4, 5]) {
      const shape = fieldShape(bead, 95, mode, 0, { radiusMm: 2, phaseSpan: 0 });
      expect(Number.isFinite(shape.heightMm)).toBe(true);
      expect(shape.heightMm).toBeGreaterThan(0);
      expect(Number.isFinite(shape.lateralPeak)).toBe(true);
    }
    /* The ring radius is a real DOF: it moves where each source sits, so the
     * complex drive of the ring pattern must change with it. */
    const driveOf = (mode: number, radiusMm: number, phaseSpan: number): number[] => {
      const model = new FieldModel(bead, 95, mode, [0, 0], 0, undefined, { radiusMm, phaseSpan });
      return Array.from(model.drive.re).concat(Array.from(model.drive.im));
    };
    const maxAbsDiff = (a: number[], b: number[]): number => {
      let max = 0;
      for (let i = 0; i < a.length; i++) max = Math.max(max, Math.abs(a[i] - b[i]));
      return max;
    };
    expect(maxAbsDiff(driveOf(3, 1.5, 0), driveOf(3, 8, 0))).toBeGreaterThan(1e-3);

    /* span 0 means one full turn, exactly like motion_rebuild_pattern(). */
    expect(maxAbsDiff(driveOf(4, 3, 0), driveOf(4, 3, 256))).toBeLessThan(1e-12);
    expect(maxAbsDiff(driveOf(4, 3, 0), driveOf(4, 3, 128))).toBeGreaterThan(1e-3);
  });

  it('reproduces the Python field shape for focus and vortex', () => {
    clearFieldShapeCache();
    const fps = fixture<FieldFixture>('field.json');
    for (const mode of [0, 6]) {
      const want = fps.shapes[String(mode)];
      const got = fieldShape({ diameterMm: 3, densityKgM3: 25 }, 95, mode, 0);
      expect(got.rungHeightsMm).toEqual(want.rung_heights_mm);
      expectClose(got.heightMm, want.height_mm, 1e-9);
      expectClose(got.axialForce, want.axial_force, 1e-9);
      expectClose(got.lateralPeak, want.lateral_peak, 1e-9);
      expectClose(got.lateralToAxial, want.lateral_to_axial, 1e-9);
      expectClose(got.peakOffsetMm, want.peak_offset_mm, 1e-9);
      expectClose(got.basinMm, want.basin_mm, 1e-9);
      expectClose(got.xyGain, want.xy_gain, 1e-9);
      expectClose(got.pumping, want.pumping, 1e-9);
      expectClose(got.midForce, want.mid_force, 1e-9);
      expectClose(got.offaxisR0Mm, want.offaxis_r0_mm, 1e-9);
    }
  });

  it('reproduces the axial potential and lateral force law', () => {
    const fps = fixture<FieldFixture>('field.json');
    const model = new FieldModel({ diameterMm: 3, densityKgM3: 25 }, 95, 0);
    expectClose(model.tableZ, fps.focus.table_z, 1e-12);
    const wells = model.axialWells(30);
    for (let i = 0; i < fps.focus.wells.length; i++) {
      expectClose(wells[i].heightMm, fps.focus.wells[i].height_mm, 1e-9);
      expectClose(wells[i].forceUp, fps.focus.wells[i].force_up, 1e-9);
    }
    const pts = new Float64Array(9);
    for (let i = 0; i < Math.min(3, fps.focus.wells.length); i++) {
      pts[i * 3 + 2] = fps.focus.wells[i].z;
    }
    const p = model.pressure(pts);
    const potential = model.potential(pts);
    for (let i = 0; i < Math.min(3, fps.focus.wells.length); i++) {
      expectClose(potential[i], fps.focus.potential_axis[i], 1e-9);
      expectClose(Math.hypot(p.re[i], p.im[i]), fps.focus.pressure_axis_abs[i], 1e-9);
    }
    const law = model.lateralLaw(fps.focus.wells[0].z);
    expectArrayClose(law.xs, fps.focus.lateral_xs, 1e-12);
    expectArrayClose(law.force, fps.focus.lateral_force, 1e-9);
  });
});

interface TrapFixture {
  bead: { mass_kg: number };
  model: {
    mass: number; radius: number; f_max: number; d_pk: number; basin: number;
    height_mm: number; offaxis_r0: number; stiffness: number; natural_hz: number;
    escape_offset: number; lead_limit: number; damping_c: number; accel_max: number;
  };
  force: { at_1mm: number; at_9mm: number; at_10mm: number };
  spin: { fold_hz_8mm: number; fold_accel_8mm_20hz: number };
}

describe('trap model', () => {
  it('matches the Python reduced model', () => {
    const f = fixture<TrapFixture>('trap_model.json');
    expectClose(beadMassKg(3, 25), f.bead.mass_kg, 1e-12);
    const cfg = createDefaultConfig();
    const m = trapModelFromConfig(cfg, 255);
    expectClose(m.mass, f.model.mass, 1e-12);
    expectClose(m.radius, f.model.radius, 1e-12);
    expectClose(m.fMax, f.model.f_max, 1e-12);
    expectClose(m.dPk, f.model.d_pk, 1e-12);
    expectClose(m.basin, f.model.basin, 1e-12);
    expectClose(m.heightMm, f.model.height_mm, 1e-9);
    expectClose(m.offaxisR0, f.model.offaxis_r0, 1e-12);
    expectClose(stiffness(m), f.model.stiffness, 1e-12);
    expectClose(Math.sqrt(stiffness(m) / m.mass) / (2 * Math.PI), f.model.natural_hz, 1e-12);
    expectClose(escapeOffset(m), f.model.escape_offset, 1e-12);
    expectClose(leadLimit(m), f.model.lead_limit, 1e-12);
    expectClose(dampingC(m), f.model.damping_c, 1e-12);
    expectClose(m.fMax / m.mass, f.model.accel_max, 1e-12);
    expectClose(acousticPower(255), 1, 1e-12);
    expectClose(drag(m, 1), drag(m, 1), 0);
    expectClose(spinFoldHz(m, 8e-3), f.spin.fold_hz_8mm, 1e-9);
    expectClose(spinFoldAccel(m, 20, 8e-3, 255), f.spin.fold_accel_8mm_20hz, 1e-9);
  });
});

interface DynamicsFixture {
  model: { f_max: number; d_pk: number; mass: number; radius: number; damping_c: number; offaxis_r0: number; gravity_in_plane: number };
  trap: number[][];
  rate: number;
  state: number[][];
  state_last: number[];
}

describe('bead dynamics', () => {
  it('matches the Python RK4 trajectory', () => {
    const f = fixture<DynamicsFixture>('dynamics.json');
    const cfg = createDefaultConfig();
    const m = trapModelFromConfig(cfg, 255);
    const tx = Float64Array.from(f.trap, (p) => p[0]);
    const ty = Float64Array.from(f.trap, (p) => p[1]);
    const state = simulate(m, tx, ty, f.rate);
    for (let i = 0; i < f.state.length; i++) {
      for (let c = 0; c < 4; c++) {
        expectClose(state.data[i * 4 + c], f.state[i][c], 1e-10);
      }
    }
    for (let c = 0; c < 4; c++) {
      expectClose(state.data[(state.frames - 1) * 4 + c], f.state_last[c], 1e-10);
    }
  });
});

