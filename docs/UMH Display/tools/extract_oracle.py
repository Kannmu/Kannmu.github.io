"""Extract golden fixtures from the original Python implementation.

The TypeScript port is checked against these files (``tests/``).  Regenerate with

    set UMH_DISPLAY_SRC=D:\\Data\\OneDrive\\Projects\\UMH\\Software\\UMH Display
    python tools/extract_oracle.py

The Python project is imported read-only; nothing is written there.
"""
from __future__ import annotations

import json
import math
import os
import struct
import sys
from pathlib import Path

import numpy as np

SRC = Path(os.environ.get("UMH_DISPLAY_SRC", r"D:\Data\OneDrive\Projects\UMH\Software\UMH Display"))
sys.path.insert(0, str(SRC))

from umh_display.config import AppConfig, BeadConfig  # noqa: E402
from umh_display.device import emulation, protocol as P  # noqa: E402
from umh_display.geometry.elements import element_positions_m  # noqa: E402
from umh_display.motion import color, plan as make_plan  # noqa: E402
from umh_display.motion.path import build_dense  # noqa: E402
from umh_display.physics import dynamics  # noqa: E402
from umh_display.physics.field import FieldModel, axial_wells, field_shape, lateral_law  # noqa: E402
from umh_display.physics.trap import TrapModel, spin_fold_accel, spin_fold_hz  # noqa: E402
from umh_display.shapes import make, place  # noqa: E402
from umh_display.shapes.text import layout_text  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "tests" / "fixtures"
OUT.mkdir(parents=True, exist_ok=True)


def arr(a) -> list:
    """numpy array -> nested lists, NaN/inf -> None."""
    a = np.asarray(a)
    if a.dtype.kind in "fc":
        a = a.astype(float)
    out = a.tolist()

    def clean(v):
        if isinstance(v, list):
            return [clean(x) for x in v]
        if isinstance(v, float) and (math.isnan(v) or math.isinf(v)):
            return None
        return v

    return clean(out)


def write(name: str, payload: dict) -> None:
    path = OUT / name
    path.write_text(json.dumps(payload, indent=1, allow_nan=False), encoding="utf-8")
    print(f"{name:32s} {path.stat().st_size / 1024:8.1f} KiB")


# ------------------------------------------------------------------ trap/field
def trap_fixtures() -> None:
    cfg = AppConfig()
    model = TrapModel.from_config(cfg.bead, cfg.trap, 255)
    write("trap_model.json", {
        "bead": {"diameter_mm": cfg.bead.diameter_mm, "density_kg_m3": cfg.bead.density_kg_m3,
                 "mass_kg": cfg.bead.mass_kg},
        "model": {
            "mass": model.mass, "radius": model.radius, "f_max": model.f_max, "d_pk": model.d_pk,
            "gravity_in_plane": model.gravity_in_plane, "extra_zeta": model.extra_zeta,
            "basin": model.basin, "height_mm": model.height_mm, "offaxis_r0": model.offaxis_r0,
            "stiffness": model.stiffness, "natural_hz": model.natural_hz,
            "escape_offset": model.escape_offset, "lead_limit": model.lead_limit,
            "damping_c": model.damping_c, "accel_max": model.accel_max,
        },
        "force": {"at_1mm": float(model.force(1e-3)), "at_9mm": float(model.force(9e-3)),
                  "at_10mm": float(model.force(10e-3))},
        "spin": {
            "fold_hz_8mm": spin_fold_hz(model, 8e-3),
            "fold_accel_8mm_20hz": spin_fold_accel(model, 20.0, 8e-3, 255),
        },
    })

    bead = BeadConfig()
    shapes = {}
    for mode in (0, 6):
        s = field_shape(bead, 95.0, mode, 0.0)
        shapes[str(mode)] = {
            "rung_heights_mm": [float(v) for v in s.rung_heights_mm],
            "height_mm": s.height_mm, "axial_force": s.axial_force,
            "lateral_peak": s.lateral_peak, "lateral_to_axial": s.lateral_to_axial,
            "peak_offset_mm": s.peak_offset_mm, "basin_mm": s.basin_mm,
            "xy_gain": s.xy_gain, "pumping": s.pumping, "mid_force": s.mid_force,
            "offaxis_r0_mm": s.offaxis_r0_mm,
        }
    model_focus = FieldModel(bead, 95.0, 0)
    wells = axial_wells(model_focus, 30.0)
    z = [w["z"] for w in wells[:3]]
    pts = np.column_stack([np.zeros(3), np.zeros(3), z]) if z else np.zeros((0, 3))
    p, _ = model_focus.pressure(pts) if len(pts) else (np.zeros(0), np.zeros((0, 3)))
    xs, force = lateral_law(model_focus, wells[0]["z"])
    write("field.json", {
        "shapes": shapes,
        "focus": {
            "table_z": model_focus.table_z,
            "wells": [{k: float(v) for k, v in w.items()} for w in wells[:5]],
            "potential_axis": arr([float(v) for v in model_focus.potential(pts)]),
            "pressure_axis_abs": arr([float(v) for v in np.abs(p)]),
            "lateral_xs": arr(xs), "lateral_force": arr(force),
        },
        "elements": arr(element_positions_m()),
    })


# ------------------------------------------------------------------ shapes
def shape_fixtures() -> None:
    shapes = {}
    for name in ("circle", "square", "triangle", "hexagon", "star", "heart", "rose", "lissajous", "infinity"):
        s = make(name)
        shapes[name] = {
            "points": arr(s.points), "corners": arr(s.corners.astype(int)),
            "hue": arr(s.hue), "visible": arr(s.visible.astype(int)),
        }
    write("shapes.json", shapes)

    planar = layout_text("HI", 8.0, (0.0, 0.0))
    write("text_HI.json", {
        "name": planar.name, "xy_mm": arr(planar.xy_mm),
        "corners": arr(planar.corners.astype(int)), "hue": arr(planar.hue),
        "visible": arr(planar.visible.astype(int)), "radius_mm": arr(planar.radius_mm),
    })


# ------------------------------------------------------------------ path
def path_fixtures() -> None:
    cfg = AppConfig()
    for name in ("square", "star", "circle"):
        planar = place(make(name), cfg.display.size_mm, (0.0, 0.0))
        p = build_dense(planar, cfg.planner.corner_radius_mm, cfg.planner.sample_step_mm,
                        cfg.planner.corner_mode)
        write(f"path_{name}.json", {
            "xy_m": arr(p.xy), "ds": arr(p.ds), "curvature": arr(p.curvature),
            "stop": arr(p.stop.astype(int)), "hue": arr(p.hue),
            "visible": arr(p.visible.astype(int)), "length": p.length,
        })


# ------------------------------------------------------------------ planner
def plan_fixtures() -> None:
    def dump(name: str, plan, samples: bool = True) -> None:
        payload = {
            "name": plan.name, "period_s": plan.period_s,
            "rate_hz": plan.rate_hz, "ramp_ms": plan.ramp_ms, "level": plan.level,
            "focus_z_um": plan.focus_z_um, "palette": arr(plan.palette),
            "palette_spin_x10": plan.palette_spin_x10,
            "points": arr([[p.x_um, p.y_um, p.z_um, p.level, p.palette] for p in plan.points]),
            "metrics": {k: (float(v) if isinstance(v, (int, float, np.floating, np.integer)) else v)
                        for k, v in plan.metrics.items()},
            "warnings": plan.warnings,
        }
        if samples:
            payload["samples"] = {
                "t": arr(plan.t), "bead_xy": arr(plan.bead_xy), "trap_xy": arr(plan.trap_xy),
                "led_rgb": arr(plan.led_rgb), "speed": arr(plan.speed), "accel": arr(plan.accel),
                "sim_bead_xy": arr(plan.sim_bead_xy), "target_xy": arr(plan.target_xy),
                "bead_lit": arr(plan.bead_lit.astype(int)),
            }
        write(name, payload)

    cfg = AppConfig()
    plan_auto = make_plan(cfg, "circle")
    dump("plan_circle_auto.json", plan_auto)

    cfg.display.refresh_hz = 15.0
    dump("plan_circle_15hz.json", make_plan(cfg, "circle"))

    cfg.display.refresh_hz = 0.0
    dump("plan_text_HI.json", make_plan(cfg, "text:HI"), samples=False)

    cfg.display.refresh_hz = 0.0
    planar = place(make("square"), 16.0)
    cfg.planner.corner_mode = "stop"
    dump("plan_square_stop.json", make_plan(cfg, "square", planar=planar), samples=False)


# ------------------------------------------------------------------ colour
def color_fixtures() -> None:
    cfg = AppConfig()
    hue = np.linspace(0.0, 0.999, 32)
    intensity = np.linspace(0.0, 1.0, 32)
    for scheme in ("wheel", "gradient", "solid"):
        cfg.display.color_scheme = scheme
        palette, pal_byte, level, spin = color.encode(cfg, np.mod(hue, 1.0), intensity)
        write(f"color_{scheme}.json", {
            "palette": arr(palette), "palette_byte": arr(pal_byte),
            "level": arr(level), "spin_x10": spin,
            "preview": arr(color.preview_rgb(palette, pal_byte, level)),
        })


# ------------------------------------------------------------------ dynamics
def dynamics_fixtures() -> None:
    cfg = AppConfig()
    model = TrapModel.from_config(cfg.bead, cfg.trap, 255)
    rate = 2000.0
    n = 400
    t = np.arange(n) / rate
    r = 8e-3
    trap = np.column_stack([r * np.cos(2 * np.pi * 12 * t), r * np.sin(2 * np.pi * 12 * t)])
    state = dynamics.simulate(model, trap, rate)
    write("dynamics.json", {
        "model": {"f_max": model.f_max, "d_pk": model.d_pk, "mass": model.mass,
                  "radius": model.radius, "damping_c": model.damping_c,
                  "offaxis_r0": model.offaxis_r0, "gravity_in_plane": model.gravity_in_plane},
        "trap": arr(trap), "rate": rate,
        "state": arr(state[:25]), "state_last": arr(state[-1]),
    })


# ------------------------------------------------------------------ emulation
def emulation_fixtures() -> None:
    period = 1 / 18.867924528301888
    phases = emulation.frame_phases(period, 2000, 0.25, 0.1)
    points = [P.MotionPoint(x * 1000.0, y * 1000.0, 102000.0, 255, i * 16)
              for i, (x, y) in enumerate([(0, 0), (5, 0), (5, 5), (0, 5)])]
    raw, lev, pal = emulation.points_arrays(points, 16)
    xyz, level, palette = emulation.sample_path(raw, lev, pal, phases, False, 16)
    write("emulation.json", {
        "phases": arr(phases[:200]), "phase_last": float(phases[-1]),
        "xyz": arr(xyz[:50]), "level": arr(level[:50]), "palette": arr(palette[:50]),
    })


# ------------------------------------------------------------------ protocol
def protocol_fixtures() -> None:
    cfg = P.MotionConfig(mode=P.MODE_PATH, flags=P.FLAG_DIRECT | P.FLAG_LOOP | P.FLAG_RGB,
                         output_rate_hz=2000, loop_ms=53, max_speed_mm_s=40, max_accel_mm_s2=400,
                         level=255, trap_mode=0, palette=[(255, 40, 0), (0, 90, 255)],
                         palette_spin_x10=25, rate_initial=0.0, rate_target=1.0, rate_ramp_ms=600)
    points = [P.MotionPoint(i * 1000.0, -i * 500.0, 102000.0, 255 - i, (i * 16) & 0xFF)
              for i in range(3)]
    big = [P.MotionPoint(i * 10.0, i * -10.0, 102000.0, 255, i & 0xFF) for i in range(300)]
    status_bytes = struct.pack("<BBHHHiiiBBHHHHHHHIIII", 2, 3, 2000, 212, 53,
                               -12500, 8000, 102000, 255, 0, 32768, 10, 20, 30, 40, 50, 60,
                               123456, 7, 2, 199990)
    profile = bytearray(1118)
    profile[0:16] = b"UMH-84\0\0\0\0\0\0\0\0\0\0"
    profile[16:32] = b"7.4.0\0\0\0\0\0\0\0\0\0\0\0"
    struct.pack_into("<H", profile, 64, 84)
    struct.pack_into("<II", profile, 80, 40000, 343000000)
    struct.pack_into("<I", profile, 106, (1 << 12) | (1 << 13))
    coords = np.column_stack([np.zeros(84), np.zeros(84), np.full(84, 7000)])
    for i, (x, y, z) in enumerate(coords):
        struct.pack_into("<iii", profile, 110 + 12 * i, int(x), int(y), int(z))
    write("protocol.json", {
        "frame": P.encode_frame(P.MSG_MOTION_START, b"", 0x12345678).hex(),
        "motion_config": cfg.pack().hex(),
        "upload": P.upload_payload(points).hex(),
        "upload_keep": P.upload_payload(points, keep_phase=True).hex(),
        "chunks": [c.hex() for c in P.upload_chunks(big)],
        "chunk_lengths": [len(c) for c in P.upload_chunks(big)],
        "target": P.target_payload(points[1]).hex(),
        "rate": P.rate_payload(0.42, 600).hex(),
        "motion_status": status_bytes.hex(),
        "motion_status_expected": {
            "state": 2, "flags": 3, "output_rate_hz": 2000, "path_points": 212, "loop_ms": 53,
            "x_um": -12500, "y_um": 8000, "z_um": 102000, "level": 255, "trap_mode": 0,
            "phase": 0.5, "service_max_us": 10, "service_avg_us": 20, "render_max_us": 30,
            "render_avg_us": 40, "submit_max_us": 50, "submit_avg_us": 60, "frames": 123456,
            "missed_deadlines": 7, "frame_errors": 2, "fps": 1999.9,
        },
        "profile": bytes(profile).hex(),
        "profile_expected": {
            "model": "UMH-84", "firmware": "7.4.0", "channels": 84, "carrier_hz": 40000,
            "sound_speed_um_s": 343000000,
            "caps": (1 << 12) | (1 << 13),
            "max_path_points": 1024,
            "first_coord": [0, 0, 7000],
        },
    })


def main() -> None:
    trap_fixtures()
    shape_fixtures()
    path_fixtures()
    plan_fixtures()
    color_fixtures()
    dynamics_fixtures()
    emulation_fixtures()
    protocol_fixtures()
    print("fixtures ->", OUT)


if __name__ == "__main__":
    main()

