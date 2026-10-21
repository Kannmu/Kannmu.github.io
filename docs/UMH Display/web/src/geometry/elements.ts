/**
 * UMH-84 transducer positions, exactly as the firmware renders them
 * (device_profile.c, mirrored in umh_display/geometry/elements.py).
 * x/y in millimetres, piezo faces 7 mm above the PCB plane.
 */
export const ELEMENT_FACE_Z_MM = 7.0;
export const CARRIER_HZ = 40000.0;
export const SOUND_SPEED_M_S = 343.0;

/* prettier-ignore */
export const ELEMENT_XY_MM: ReadonlyArray<readonly [number, number]> = [
  [-26.0, -35.0], [-43.3, -15.0], [8.6, -45.0], [-0.0, -30.0], [-26.0, -25.0], [-0.0, -10.0],
  [-26.0, -5.0], [-0.0, -40.0], [-17.4, -30.0], [-17.4, -20.0], [-17.3, -10.0], [-43.3, -5.0],
  [-8.7, -35.0], [-34.7, -30.0], [-34.7, -20.0], [-8.7, -25.0], [-8.7, -15.0], [-26.0, -15.0],
  [-34.7, -10.0], [-34.7, 0.0], [-8.7, -5.0], [0.0, 10.0], [-17.3, 0.0], [0.0, 30.0],
  [-8.7, 25.0], [-8.7, 5.0], [-34.7, 10.0], [-26.0, 25.0], [-8.7, 45.0], [-17.3, 40.0],
  [-26.0, 5.0], [-43.3, 15.0], [-26.0, 35.0], [-8.7, 35.0], [-8.7, 15.0], [-34.7, 20.0],
  [-17.3, 30.0], [-17.3, 20.0], [-26.0, 15.0], [-17.3, 10.0], [-43.3, 5.0], [-34.6, 30.0],
  [0.0, 20.0], [43.3, 15.0], [0.0, 40.0], [17.4, 40.0], [26.0, 35.0], [8.7, 45.0],
  [8.7, 25.0], [17.3, 30.0], [8.7, 5.0], [34.7, -0.0], [34.7, 10.0], [8.7, 35.0],
  [17.3, 20.0], [8.7, 15.0], [17.3, 10.0], [17.4, -0.0], [34.7, 30.0], [26.0, 25.0],
  [34.7, 20.0], [26.0, 15.0], [26.0, 5.0], [8.6, -35.0], [26.0, -25.0], [-0.0, -20.0],
  [26.0, -15.0], [17.3, -20.0], [43.3, -15.0], [26.0, -5.0], [-8.7, -45.0], [26.0, -35.0],
  [43.3, 5.0], [-17.4, -40.0], [17.3, -30.0], [17.3, -40.0], [34.7, -30.0], [34.7, -20.0],
  [17.4, -10.0], [43.3, -5.0], [8.6, -25.0], [8.6, -15.0], [34.7, -10.0], [8.7, -5.0]
];

export interface ElementPositions {
  /** Flat xyz triples, metres. */
  xyz: Float64Array;
  count: number;
}

/** Port of ``element_positions_m``; profile coordinates (µm) override the table. */
export function elementPositionsM(coordinatesUm?: ReadonlyArray<readonly [number, number, number]> | null): ElementPositions {
  const n = ELEMENT_XY_MM.length;
  const xyz = new Float64Array(n * 3);
  if (coordinatesUm && coordinatesUm.length >= n) {
    for (let i = 0; i < n; i++) {
      xyz[i * 3] = coordinatesUm[i][0] * 1e-6;
      xyz[i * 3 + 1] = coordinatesUm[i][1] * 1e-6;
      xyz[i * 3 + 2] = coordinatesUm[i][2] * 1e-6;
    }
  } else {
    for (let i = 0; i < n; i++) {
      xyz[i * 3] = ELEMENT_XY_MM[i][0] * 1e-3;
      xyz[i * 3 + 1] = ELEMENT_XY_MM[i][1] * 1e-3;
      xyz[i * 3 + 2] = ELEMENT_FACE_Z_MM * 1e-3;
    }
  }
  return { xyz, count: n };
}

/** Aperture radius (m) around the array centre. */
export function apertureRadiusM(coordinatesUm?: ReadonlyArray<readonly [number, number, number]> | null): number {
  const pos = elementPositionsM(coordinatesUm);
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < pos.count; i++) {
    cx += pos.xyz[i * 3];
    cy += pos.xyz[i * 3 + 1];
  }
  cx /= pos.count;
  cy /= pos.count;
  let max = 0;
  for (let i = 0; i < pos.count; i++) {
    const dx = pos.xyz[i * 3] - cx;
    const dy = pos.xyz[i * 3 + 1] - cy;
    max = Math.max(max, Math.hypot(dx, dy));
  }
  return max;
}
